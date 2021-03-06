<template>
  <div class="form-generator">
    <div class="header-title">
      <div class="text">{{ title }}</div>
      <el-button type="primary" @click="AssembleFormData" size="small">提交创建</el-button>
    </div>
    <el-row>
      <el-col :span="5">
        <div class="left-scrollbar">
          <el-tabs
            :value="currentTab"
            class="center-tabs"
            @tab-click="handleTabChange"
            v-if="tabList.length"
          >
            <el-tab-pane
              :label="item.label"
              :name="item.name"
              v-for="(item, indx) in tabList"
              :key="indx"
            >
            </el-tab-pane>
          </el-tabs>
          <left-panel
            :components-list="leftComponents"
            @add-click="addComponent"
            @end="onEnd"
            v-show="currentTab === 'form'"
          />
        </div>
      </el-col>
      <el-col :span="14">
        <div class="center-scrollbar">
          <el-scrollbar>
            <el-row class="center-board-row" :gutter="formConf.gutter">
              <head-desc :formDesc.sync="formConf" v-if="showHeader" />
              <el-form
                :size="formConf.size"
                :label-position="formConf.labelPosition"
                :disabled="formConf.disabled"
                :label-width="formConf.labelWidth + 'px'"
              >
                <draggable
                  class="drawing-board"
                  :list="drawingList"
                  :animation="340"
                  group="componentsGroup"
                >
                  <draggable-item
                    v-for="(item, index) in drawingList"
                    :key="item.renderKey"
                    :drawing-list="drawingList"
                    :current-item="item"
                    :index="index"
                    :active-id="activeId"
                    :form-conf="formConf"
                    @activeItem="activeFormItem"
                    @copyItem="drawingItemCopy"
                    @deleteItem="drawingItemDelete"
                  />
                </draggable>
                <div v-show="!drawingList.length" class="empty-info">
                  从左侧拖入或点选组件进行台账表单设计
                </div>
              </el-form>
            </el-row>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col :span="5">
        <right-panel
          :active-data="activeData"
          :form-conf="formConf"
          :show-field="!!drawingList.length"
          @tag-change="tagChange"
          @fetch-data="fetchData"
        />
      </el-col>
    </el-row>

    <input id="copyNode" type="hidden" />
  </div>
</template>

<script>
  import draggable from 'vuedraggable';
  import { debounce } from 'throttle-debounce';
  import { saveAs } from 'file-saver';
  import ClipboardJS from 'clipboard';
  import RightPanel from './RightPanel';
  import LeftPanel from './LeftPanel';
  import DraggableItem from './DraggableItem';
  import HeadDesc from './HeadDesc';

  import {
    assistComponents,
    formConf,
    imageComponents,
    inputComponents,
    personalInfoComponents,
    selectComponents,
  } from '@/components/form-generator/components/generator/config';
  import {
    beautifierConf,
    titleCase,
    deepClone,
    isObjectObject,
  } from '@/components/form-generator/utils/index';
  import {
    makeUpHtml,
    vueTemplate,
    vueScript,
    cssStyle,
  } from '@/components/form-generator/components/generator/html';
  import { makeUpJs } from '@/components/form-generator/components/generator/js';
  import { makeUpCss } from '@/components/form-generator/components/generator/css';
  import drawingDefault from '@/components/form-generator/components/generator/drawingDefault';

  import {
    getDrawingList,
    saveDrawingList,
    getIdGlobal,
    saveIdGlobal,
    getFormConf,
  } from '@/components/form-generator/utils/db';

  let beautifier;
  let oldActiveId;
  let tempActiveData;
  const drawingListInDB = getDrawingList();
  const formConfInDB = getFormConf();
  const idGlobal = getIdGlobal();

  export default {
    components: {
      draggable,
      LeftPanel,
      RightPanel,
      DraggableItem,
      HeadDesc,
    },
    props: {
      // 其他自定义组件
      otherComponents: {
        type: Array,
        default: () => [],
      },
      // tab栏列表
      tabList: {
        type: Array,
        default: () => [],
      },
      // 当前tab
      currentTab: {
        type: String,
        default: 'form',
      },
      title: {
        type: String,
        default: '创建自定义表单',
      },
      showHeader: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        idGlobal,
        formConf,
        drawingList: drawingDefault,
        drawingData: {},
        activeId: drawingDefault.length != 0 ? drawingDefault[0].formId : 0,
        drawerVisible: false,
        formData: {},
        dialogVisible: false,
        jsonDrawerVisible: false,
        generateConf: null,
        showFileName: false,
        activeData: null,
        saveDrawingListDebounce: debounce(340, saveDrawingList),
        saveIdGlobalDebounce: debounce(340, saveIdGlobal),
        defaultComponents: [
          {
            title: '联系人组件',
            list: personalInfoComponents,
          },
          {
            title: '输入型组件',
            list: inputComponents,
          },
          {
            title: '图片型组件',
            list: imageComponents,
          },
          {
            title: '辅助型组件',
            list: assistComponents,
          },
          {
            title: '选择型组件',
            list: selectComponents,
          },
        ],
      };
    },
    computed: {
      leftComponents() {
        return this.defaultComponents.concat(this.otherComponents);
      },
    },
    watch: {
      // eslint-disable-next-line func-names
      'activeData.__config__.label': function (val, oldVal) {
        if (
          this.activeData.placeholder === undefined ||
          !this.activeData.__config__.tag ||
          oldActiveId !== this.activeId
        ) {
          return;
        }
        this.activeData.placeholder = this.activeData.placeholder.replace(oldVal, '') + val;
      },
      activeId: {
        handler(val) {
          oldActiveId = val;
        },
        immediate: true,
      },
      drawingList: {
        handler(val) {
          this.saveDrawingListDebounce(val);
          if (val.length === 0) this.idGlobal = 100;
        },
        deep: true,
      },
      idGlobal: {
        handler(val) {
          this.saveIdGlobalDebounce(val);
        },
        immediate: true,
      },
    },
    mounted() {
      if (Array.isArray(drawingListInDB) && drawingListInDB.length > 0) {
        this.drawingList = drawingListInDB;
      } else {
        this.drawingList = drawingDefault;
      }
      this.activeFormItem(this.drawingList.length ? this.drawingList[0] : null);
      if (formConfInDB) {
        this.formConf = formConfInDB;
      }
      const clipboard = new ClipboardJS('#copyNode', {
        text: (trigger) => {
          const codeStr = this.generateCode();
          this.$notify({
            title: '成功',
            message: '代码已复制到剪切板，可粘贴。',
            type: 'success',
          });
          return codeStr;
        },
      });
      clipboard.on('error', (e) => {
        this.$message.error('代码复制失败');
      });
    },
    methods: {
      handleTabChange(tab) {
        this.$emit('update:currentTab', tab.name);
      },
      setObjectValueReduce(obj, strKeys, data) {
        const arr = strKeys.split('.');
        arr.reduce((pre, item, i) => {
          if (arr.length === i + 1) {
            pre[item] = data;
          } else if (!isObjectObject(pre[item])) {
            pre[item] = {};
          }
          return pre[item];
        }, obj);
      },
      setRespData(component, resp) {
        const { dataPath, renderKey, dataConsumer } = component.__config__;
        if (!dataPath || !dataConsumer) return;
        const respData = dataPath.split('.').reduce((pre, item) => pre[item], resp);

        // 将请求回来的数据，赋值到指定属性。
        // 以el-tabel为例，根据Element文档，应该将数据赋值给el-tabel的data属性，所以dataConsumer的值应为'data';
        // 此时赋值代码可写成 component[dataConsumer] = respData；
        // 但为支持更深层级的赋值（如：dataConsumer的值为'options.data'）,使用setObjectValueReduce
        this.setObjectValueReduce(component, dataConsumer, respData);
        const i = this.drawingList.findIndex((item) => item.__config__.renderKey === renderKey);
        if (i > -1) this.$set(this.drawingList, i, component);
      },
      fetchData(component) {
        const { dataType, method, url } = component.__config__;
        if (dataType === 'dynamic' && method && url) {
          this.setLoading(component, true);
          this.$axios({
            method,
            url,
          }).then((resp) => {
            this.setLoading(component, false);
            this.setRespData(component, resp.data);
          });
        }
      },
      setLoading(component, val) {
        const { directives } = component;
        if (Array.isArray(directives)) {
          const t = directives.find((d) => d.name === 'loading');
          if (t) t.value = val;
        }
      },
      activeFormItem(currentItem) {
        if (!currentItem) return;
        this.activeData = currentItem;
        this.activeId = currentItem.__config__.formId;
      },
      onEnd(obj) {
        if (obj.from !== obj.to) {
          this.fetchData(tempActiveData);
          this.activeData = tempActiveData;
          this.activeId = this.idGlobal;
        }
      },
      addComponent(item) {
        const clone = this.cloneComponent(item);
        this.fetchData(clone);
        this.drawingList.push(clone);
        this.activeFormItem(clone);
      },
      cloneComponent(origin) {
        const clone = deepClone(origin);
        const config = clone.__config__;
        config.span = this.formConf.span; // 生成代码时，会根据span做精简判断
        this.createIdAndKey(clone);
        clone.placeholder !== undefined && (clone.placeholder += config.label);
        tempActiveData = clone;
        return tempActiveData;
      },
      createIdAndKey(item) {
        const config = item.__config__;
        config.formId = ++this.idGlobal;
        config.renderKey = `${config.formId}${+new Date()}`; // 改变renderKey后可以实现强制更新组件
        if (config.layout === 'colFormItem') {
          item.__vModel__ = `field${this.idGlobal}`;
        } else if (config.layout === 'rowFormItem') {
          config.componentName = `row${this.idGlobal}`;
          !Array.isArray(config.children) && (config.children = []);
          delete config.label; // rowFormItem无需配置label属性
        }
        if (Array.isArray(config.children)) {
          config.children = config.children.map((childItem) => this.createIdAndKey(childItem));
        }
        return item;
      },
      async AssembleFormData() {
        this.formData = {
          fields: deepClone(this.drawingList),
          ...this.formConf,
        };
        console.log(this.formData, 'this.formData');
        this.$emit('submit', { generateFields: this.formData });
      },
      generate(data) {
        const func = this[`exec${titleCase(this.operationType)}`];
        this.generateConf = data;
        func && func(data);
      },
      execRun(data) {
        this.AssembleFormData();
        this.drawerVisible = true;
      },
      execDownload(data) {
        const codeStr = this.generateCode();
        const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, data.fileName);
      },
      execCopy(data) {
        document.getElementById('copyNode').click();
      },
      empty() {
        this.$confirm('确定要清空所有组件吗？', '提示', { type: 'warning' }).then(() => {
          this.drawingList = [];
          this.idGlobal = 100;
        });
      },
      drawingItemCopy(item, list) {
        let clone = deepClone(item);
        clone = this.createIdAndKey(clone);
        list.push(clone);
        this.activeFormItem(clone);
      },
      drawingItemDelete(index, list) {
        list.splice(index, 1);
        this.$nextTick(() => {
          const len = this.drawingList.length;
          if (len) {
            this.activeFormItem(this.drawingList[len - 1]);
          }
        });
      },
      generateCode() {
        const { type } = this.generateConf;
        this.AssembleFormData();
        const script = vueScript(makeUpJs(this.formData, type));
        const html = vueTemplate(makeUpHtml(this.formData, type));
        const css = cssStyle(makeUpCss(this.formData));
        return beautifier.html(html + script + css, beautifierConf.html);
      },
      showJson() {
        this.AssembleFormData();
        this.jsonDrawerVisible = true;
      },
      download() {
        this.dialogVisible = true;
        this.showFileName = true;
        this.operationType = 'download';
      },
      run() {
        this.dialogVisible = true;
        this.showFileName = false;
        this.operationType = 'run';
      },
      copy() {
        this.dialogVisible = true;
        this.showFileName = false;
        this.operationType = 'copy';
      },
      tagChange(newTag) {
        newTag = this.cloneComponent(newTag);
        const config = newTag.__config__;
        newTag.__vModel__ = this.activeData.__vModel__;
        config.formId = this.activeId;
        config.span = this.activeData.__config__.span;
        this.activeData.__config__.tag = config.tag;
        this.activeData.__config__.tagIcon = config.tagIcon;
        this.activeData.__config__.document = config.document;
        if (typeof this.activeData.__config__.defaultValue === typeof config.defaultValue) {
          config.defaultValue = this.activeData.__config__.defaultValue;
        }
        Object.keys(newTag).forEach((key) => {
          if (this.activeData[key] !== undefined) {
            newTag[key] = this.activeData[key];
          }
        });
        this.activeData = newTag;
        this.updateDrawingList(newTag, this.drawingList);
      },
      updateDrawingList(newTag, list) {
        const index = list.findIndex((item) => item.__config__.formId === this.activeId);
        if (index > -1) {
          list.splice(index, 1, newTag);
        } else {
          list.forEach((item) => {
            if (Array.isArray(item.__config__.children))
              this.updateDrawingList(newTag, item.__config__.children);
          });
        }
      },
      refreshJson(data) {
        this.drawingList = deepClone(data.fields);
        delete data.fields;
        this.formConf = data;
      },
    },
  };
</script>

<style lang="scss">
  @import './styles/index';
  @import './styles/home';
</style>
