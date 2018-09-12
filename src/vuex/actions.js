/**
 * Created by DGGA on 2017/9/9.
 */
import * as types from './mutation-type' //  导入mutations的命名空间
import {bd09togcj02, gcj02towgs84} from '../../static/js/coor'
import {autoOpenGPS} from '../common/js/util'
// import $router from '../router'

/*
 * Action类似mutation 不同在于：
 * Action提交的是mutation，而不是直接更改状态
 * Action可以包含任意异步操作
 * Action接收一个store实例相同的方法和属性的context对象
 * Action可通过context.commit提交一个mutation
 * Action通过store.dispatch()方法触发 */

// socket通讯处理
export const socketAction = ({dispatch, commit}, result) => {
  let msgData = JSON.parse(result)
  console.log(msgData.msg, 'msgData.msg')
  console.log(msgData, 'msgData')
  if (msgData.type === 'refresh_app_task') { // 新警情
    console.log(msgData, 'skill_group_jwt')
    commit(types.REFRESH_TASK, msgData.msg)
  } else if (msgData.type === 'skill_rw_jwt') { // 任务消息
    console.log(msgData, 'skill_rw_jwt')
    commit(types.MU_RW)
  } else if (msgData.type === 'refresh_dwxxzt') { // dwxxzt
    console.log(msgData, 'refresh_dwxxzt')
    commit(types.REFRESH_DWXXZT, msgData.msg)
  } else if (msgData.type === 'refresh_onlineNum') { // dwxxzt
    console.log(msgData, 'refresh_onlineNum')
    commit(types.REFRESH_ONLINE_NUM, msgData.msg)
  }
  console.log(result, 'mttqResult')
}
// 获取当前位置
export const getCurPositon = ({dispatch, commit}, result) => {
  console.log(11111111111)
  autoOpenGPS()
  let position = {}
  return new Promise((resolve, reject) => {
    app.getLocation(res => {
      console.log(res, 'app.getLocation')
      console.log(res, '位置信息')
      let obj1 = bd09togcj02(res.longitude, res.latitude)
      let obj2 = gcj02towgs84(obj1[0], obj1[1])
      obj2[0] = obj2[0].toFixed(6)
      obj2[1] = obj2[1].toFixed(6)
      console.log(obj2, 'obj2')
      // position.longitude = 113.762129
      // position.latitude = 23.029493
      position.longitude = obj2[0]
      position.latitude = obj2[1]
      // position.longitude = res.longitude
      // position.latitude = res.latitude
      commit(types.SAVE_POSITION, position)
      resolve(position)
    }, err => {
      // app.refresh()
      // 如果星火定位api获取定位失败，启动h5定位api
      navigator.geolocation.getCurrentPosition(function (pos) {
        // 经度
        let longitude = pos.coords.longitude
        // 纬度
        let latitude = pos.coords.latitude
        position.longitude = longitude
        position.latitude = latitude
        resolve(position)
        console.log(longitude, latitude, 'getPosition')
      }, function (error) {
        console.log(error, 'positionerror')
      })
      console.log(err, '获取定位失败')
    })
    // navigator.geolocation.getCurrentPosition(function (pos) {
    //   // 经度
    //   let longitude = pos.coords.longitude
    //   // 纬度
    //   let latitude = pos.coords.latitude
    //   position.longitude = longitude
    //   position.latitude = latitude
    //   resolve(position)
    //   console.log(longitude, latitude, 'getPosition')
    // }, function (error) {
    //   console.log(error, 'positionerror')
    //   reject(error)
    // })
  })
}
