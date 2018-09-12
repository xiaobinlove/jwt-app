// import http from './HTTP'
import http from './fetch'
// 单位树
const getTreeByUser = (params) => {
  return http.post('/service-mjcj/pubZzjg/getTreeByUser', {}, {
    params
  })
}
const fstz = (params) => {
  return http.post('/service-mjcj/mjcjXxtz/fstz', {}, {
    params
  })
}
export { getTreeByUser, fstz }
