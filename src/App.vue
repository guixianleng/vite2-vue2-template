<template>
  <div id="app">
    <form-generator :tab-list="tabList" :current-tab.sync="currentTab" />
  </div>
</template>

<script>
  import FormGenerator from '@/components/form-generator/index.vue';

  export default {
    components: {
      FormGenerator,
    },
    data() {
      return {
        currentTab: 'form',
        tabList: [
          // {
          //   label: '设 置',
          //   name: 'setting',
          // },
          {
            label: '表 单',
            name: 'form',
          },
          // {
          //   label: '大纲',
          //   name: 'outline',
          // },
        ],
      };
    },
  };
</script>
