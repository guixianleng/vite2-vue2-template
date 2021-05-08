import Vue from 'vue';
import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';
import Antd from 'ant-design-vue/lib';
import App from './App.vue';

import 'ant-design-vue/dist/antd.css';

// Register icon Sprite
import 'vite-plugin-svg-icons/register';

/**
 * @name 前端监控部署
 * @params 若想在不同分支 release及哪个版本, 如：release: 'test@1.0.2'
 * @params 在不同环境 production, 如：process.env.NODE_ENV === "production"
 * 查看错误日志 https://sentry.io/organizations --- issues 菜单
 */

Sentry.init({
  Vue,
  dsn: 'https://d0f86a390c3742a38c648e0a75550ab3@o624252.ingest.sentry.io/5753280',
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  logErrors: true, // 浏览器控制台输入错误
});

Vue.config.productionTip = false;

Vue.use(Antd);

new Vue({
  render: (h) => h(App),
}).$mount('#app');
