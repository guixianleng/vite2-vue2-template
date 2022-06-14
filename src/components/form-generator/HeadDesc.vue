<template>
  <div class="head-desc">
    <div class="head-title">
      <el-input placeholder="请输入标题" class="head-title_input" v-model="headForm.title" clearable v-if="titleEdit"> </el-input>
      <div v-else @click="editTitle = true" v-html="headForm.title" />
    </div>
    <div class="head-rich">
      <Tinymce v-if="richEdit" v-model="headForm.description" placeholder="请输入描述（选填），介绍背景或政策说明等" />
      <div v-else @click="editRich = true" class="head-rich_desc" v-html="headForm.description" />
    </div>
  </div>
</template>
<script>
  import Tinymce from './components/tinymce/index.vue';

  export default {
    name: 'HeadDesc',
    components: {
      Tinymce,
    },
    props: {
      editable: {
        type: Boolean,
        default: true,
      },
      formDesc: {
        type: Object,
        default: () => {
          return {
            title: '速度与激情',
            description: '',
          };
        },
      },
    },
    computed: {
      titleEdit() {
        return this.editable && this.editTitle;
      },
      richEdit() {
        return this.editable && this.editRich;
      },
    },
    data() {
      return {
        editTitle: true,
        editRich: true,
        headForm: {},
      };
    },
    created() {
      this.headForm = this.formDesc;
      this.$watch(
        'headForm',
        () => {
          this.$emit('update:formDesc', this.headForm);
        },
        { deep: true, immediate: true }
      );
    },
  };
</script>

<style lang="scss">
  .head-desc {
    margin-bottom: 20px;
    padding: 0 12px;
    .head-title {
      margin-bottom: 10px;
      &_input {
        .el-input__inner {
          border: none;
        }
      }
    }
    .head-title,
    .head-title_input .el-input__inner {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      text-align: center;
    }
    .head-rich {
      &_desc {
        line-height: 24px;
      }
    }
  }
</style>
