import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import './styles/index.scss';

import App from './App.vue';
// Register icon Sprite
import 'vite-plugin-svg-icons/register';

Vue.use(ElementUI);

new Vue({
  render: (h) => h(App),
}).$mount('#app');
