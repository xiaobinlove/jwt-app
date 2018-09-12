
import http from './fetch'

// 背景信息
const backgroundInfo = (params) => {
  return http.post('/service-mjcj/user/backgroundInfo', {}, {
    params
  })
}

export { backgroundInfo }
