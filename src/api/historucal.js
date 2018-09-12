import http from './fetch'
// 历史查询
const getUserTaskByDate = (params) => {
  return http.post('/service-mjcj/mjcjJjdb/getUserTaskByDate', {}, {
    params: params
  })
}
export {getUserTaskByDate}
