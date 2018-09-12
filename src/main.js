// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import FastClick from 'fastclick'
// import MintUi from 'mint-ui'
// import 'mint-ui/lib/style.css'
import router from './router'
import axios from './api/HTTP.js'// 数据请求Ajax
import Vuex from 'vuex' // 组件信息管理插件
import store from './vuex/index' // 组件信息管理入口
import * as filters from './filters/filter'
import VueScroller from 'vue-scroller'
import '../static/iconfont/iconfont'
import {
  XHeader,
  ToastPlugin,
  Datetime,
  Group,
  XButton,
  ViewBox,
  Actionsheet,
  XInput,
  Msg,
  AlertPlugin,
  // Loading,
  LoadingPlugin,
  ConfirmPlugin
} from 'vux'
import '../static/iconfont/iconfont.css'
import './common/less/reset.css'
// import '../node_modules/vux/src/styles/reset.less'
FastClick.attach(document.body)
axios.defaults.withCredentials = true // 开启跨域请求时使用凭证
Vue.config.productionTip = false
Vue.prototype.axios = axios // 将 axios 改写为 Vue 的原型属性
// Vue.use(AlertPlugin)
Vue.use(ToastPlugin, {position: 'default'})
Vue.use(AlertPlugin)
Vue.use(LoadingPlugin)
Vue.use(ConfirmPlugin)
Vue.component('datetime', Datetime)
// Vue.component('loading', Loading)
Vue.component('group', Group)
Vue.component('x-button', XButton)
Vue.component('view-box', ViewBox)
Vue.component('Msg', Msg)
Vue.component('actionsheet', Actionsheet)
Vue.component('x-header', XHeader)
Vue.component('x-input', XInput)
// Vue.use(XInput)
// Vue.component('x-button', XButton)
Vue.use(Vuex) // 使用组件信息管理插件
Vue.use(VueScroller)
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.prototype.fetch = fetch
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
