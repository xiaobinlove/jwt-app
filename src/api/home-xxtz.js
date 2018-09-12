import http from './fetch'
// 单位树
const mjcjXxtzList = (params) => {
  return http.post('/service-mjcj/mjcjXxtz/list', {}, {
    params
  })
}
export { mjcjXxtzList }
