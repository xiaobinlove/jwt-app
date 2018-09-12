/**
 * Created by admin on 2017/8/18.
 */
// 字符串集合，用 import * as types from '../types' 方法导入vuex模块里
// 就变成了一个types对象
import * as types from '../mutation-type' //  导入mutations的命名空间
/*
 * 单一状态树
 * user应用层唯一数据源 */
const state = {
  token: '', // 用户唯一标识
  vux_group: 1,
  vux_rw: 1,
  qwzt: '0', // 0无任务 1 有任务
  test: '0', // 0无任务 1 有任务
  count: 0, // 计数
  operation: true // 计数
}

/*
 * 更改state的唯一方法 提交mutation
 * 接收一个事件类型（type），一个回调函数 回调函数就是进行状态更改的地方
 * 回调函数接收state为第一个参数
 * 可接收第二个参数，可为字符串，对象
 * 一般接收对象类型，对象可包含多个字段
 * mutation提交可直接更改状态
 * mutation通过store.commit()触发 */
const mutations = {
  [types.SET_TOKEN]: (state, token) => { // 获取设置用户token
    state.token = token
  },
  [types.MU_GROUP]: (state) => { //
    state.vux_group++
  },
  [types.MU_RW]: (state) => { //
    state.vux_rw++
  },
  [types.SET_QWZT]: (state, val) => { //
    state.qwzt = val
  },
  [types.SET_TEST]: (state, val) => { //
    state.test = val
  },
  [types.SET_COUNT]: (state, val) => { //
    state.count = val
  },
  [types.SET_OPERATION]: (state, val) => { //
    state.operation = val
  }
}

export default {
  state,
  mutations
}
