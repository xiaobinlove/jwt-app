// import http from './HTTP'
import http from './fetch'

// 登陆
const login = (params) => {
  return http.post('/service-mjcj/user/loginUser', {}, {
    params
  })
}
const addOrRmoveUserinfo = (params) => {
  return http.post('/service-mjcj/pubUser/addOrRmoveUserinfo', {}, {
    params
  })
}
export { login, addOrRmoveUserinfo }
