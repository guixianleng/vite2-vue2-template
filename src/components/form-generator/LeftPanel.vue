<template>
  <el-scrollbar>
    <div class="components-list">
      <div v-for="(item, listIndex) in componentsList" :key="listIndex">
        <div class="components-title" @click="handleCollapse(item)">
          <i :class="`el-icon-caret-${!item.collapse ? 'bottom' : 'top'}`"></i>
          <span>{{ item.title }}</span>
        </div>
        <el-collapse-transition>
          <div v-show="!item.collapse">
            <draggable
              class="components-draggable"
              :list="item.list"
              :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
              :clone="cloneComponent"
              draggable=".components-item"
              :sort="false"
              @end="onEnd"
            >
              <div
                v-for="(element, index) in item.list"
                :key="index"
                class="components-item"
                @click="addComponent(element)"
              >
                <div class="components-body">
                  <svg-icon :icon-class="element.__config__.tagIcon" />
                  {{ element.__config__.label }}
                </div>
              </div>
            </draggable>
          </div>
        </el-collapse-transition>
      </div>
    </div>
  </el-scrollbar>
</template>
<script>
  import draggable from 'vuedraggable';
  import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';

  export default {
    name: 'LeftPanel',
    components: {
      draggable,
      [CollapseTransition.name]: CollapseTransition,
    },
    props: {
      // 当前组件列表
      componentsList: {
        type: Array,
        default: () => [],
      },
    },
    methods: {
      addComponent(item) {
        this.$emit('add-click', item);
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
      onEnd() {
        this.$emit('end');
      },
      handleCollapse(row) {
        this.$set(row, 'collapse', !row.collapse);
      },
    },
  };
</script>
