import http from './fetch'

// 上传文件
const uploadFile = (filePath, params, options) => {
  return http.uploadFile(filePath, '/service-mjcj/mjcjFkdb/cjfkFile', params, options)
}
// 获取反馈单
const getByCjdbh = (params) => {
  return http.post('/service-mjcj/mjcjFkdb/getByCjdbh', {}, {
    params
  })
}
// 获取反馈列表
const cjfkList = (params) => {
  return http.post('/service-mjcj/mjcjFkdb/cjfkList', {}, {
    params
  })
}
// 发送反馈
const sendCjfk = (params) => {
  console.log('sendCjfk', params)
  return http.post('/service-mjcj/mjcjFkdb/cjfk', {}, {
    params
  })
}
export { uploadFile, getByCjdbh, cjfkList, sendCjfk }
