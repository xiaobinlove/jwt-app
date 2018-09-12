import http from './fetch'
const getIndexInfo = (params) => {
  return http.post('/service-mjcj/mjcj/index', {}, {
    params: params
  })
}

// 首页信息
const getUserTask = (params) => {
  return http.post('/service-mjcj/mjcjJjdb/getUserTask', {}, {
    params: params
  })
}
// 单位在线人数
const getUnitNum = (params) => {
  return http.post('/service-mjcj/mjcjAppdwxx/query/indexNum', {}, {
    params: params
  })
}
// 单位在线人数
const getUnitNumList = (params) => {
  return http.post('/service-mjcj/mjcjAppdwxx/query/dwNum', {}, {
    params: params
  })
}
export {getUserTask, getIndexInfo, getUnitNum, getUnitNumList}
