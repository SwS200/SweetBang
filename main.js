import App from './App'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false

//注册全局属性--跳转页面路径方法
Vue.prototype.$toPage = url=>uni.navigateTo({url})

App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount();

// 全局使用uview-ui组件
import uView from "uview-ui";
Vue.use(uView);

// 开启小程序分享
let mpShare = require('uview-ui/libs/mixin/mpShare.js');
Vue.mixin(mpShare)

//注册全局属性--调用api接口方法
import { myRequest } from './util/api.js'
Vue.prototype.$myRequest = myRequest
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif