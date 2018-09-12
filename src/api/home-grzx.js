import http from './fetch'
// 退出
const logout = (params) => {
  return http.post('/service-mjcj/user/logout', {}, {
    params: params
  })
}
// 退出
const addZxlxinfo = (params) => {
  return http.post('/service-mjcj/pubUser/addZxlxinfo', {}, {
    params: params
  })
}
export { logout, addZxlxinfo }
