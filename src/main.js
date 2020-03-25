// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import VueRouter from 'vue-router';
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
// import Index from './Index';
// import Login from './views/login/login'
// import Index from './views/index/index';
// import Table from './views/table/table';
// import Form from './views/form/form';
// import Upload from './views/upload/upload';
// import ue from './views/editor/editor';
import 'font-awesome/css/font-awesome.min.css'
import Mock from './mock/mock'
import store from './store'
import api from './api/api'

import '../static/UE/ueditor.config.js'
import '../static/UE/ueditor.all.min.js'
import '../static/UE/lang/zh-cn/zh-cn.js'
import '../static/UE/ueditor.parse.min.js'

Mock.mockData()
// Vue.use(VueRouter);// 安装路由功能
/* eslint-disable no-new */
// Vue.use(VueRouter);
Vue.prototype.$http = axios
Vue.use(ElementUI)

Vue.prototype.$api = api
let app = new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
}).$mount('#app')
export default app
