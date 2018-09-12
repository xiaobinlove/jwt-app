import http from './fetch'
const sendGPS = (params) => {
  return http.post('/service-mjcj/mjcjAppdwxx/scGpsDw', {}, {
    params
  })
}

const addOrRmoveUserinfo = (params) => {
  return http.post('/service-mjcj/pubUser/addOrRmoveUserinfo', {}, {
    params
  })
}
export { sendGPS, addOrRmoveUserinfo }
