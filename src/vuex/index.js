/**
 * Created by admin on 2017/8/18.
 */
import Vue from 'vue' // 导入Vue
import Vuex from 'vuex' // 导入Vuex
import * as getters from './getters' // 导入根级别的getters
import * as actions from './actions' // 导入根级别的getters
import user from './modules/user' // 管理用户状态模块
import jqcl from './modules/home-jqcl' // 管理用户状态模块
import home from './modules/home' // 首页消息
import map from './modules/map' // 管理用户状态模块
import todoDetail from './modules/todo-detail' // 管理用户状态模块
Vue.use(Vuex) // 使用Vuex

const debug = process.env.NODE_ENV !== 'production'
// env里去获取当前的环境是否需要开启严格模式
// 在发布环境开启严格模式会造成性能上不必要的损失

export default new Vuex.Store({ // 默认导出Vuex模块
  actions,
  getters,
  modules: {
    user,
    jqcl,
    map,
    todoDetail,
    home
  },
  strict: debug // 是否开启严格模式
})
