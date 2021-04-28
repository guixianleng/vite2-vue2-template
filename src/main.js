import Vue from 'vue';
import App from './App.vue';

// Register icon Sprite
import 'vite-plugin-svg-icons/register';

new Vue({
  render: (h) => h(App),
}).$mount('#app');
