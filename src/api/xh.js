import http from './HTTP'
import {LOCAL_URL, DOOR_URL} from '../common/js/config'

// let post = (url, params) => {
//   params.APP_URL = localURL + url
//   let defaultParams = window.xh.default_params()
//   for (let key in defaultParams) {
//     params[key] = defaultParams[key]
//   }
//   console.log(params, 'xhparamshttp')
//   return params
//   // return http.post('', params, {
//   //   headers: {
//   //     'Content-Type': 'application/x-www-form-urlencoded'
//   //   }
//   // })
//   // return http({
//   //   method: 'get',
//   //   url: '',
//   //   data: params
//   // })
// }
function post (url, params) {
  let _param = {}
  let defaultParams = window.xh.default_params()
  _param.APP_URL = getAppUrl(url, params)
  for (let key in defaultParams) {
    _param[key] = defaultParams[key]
  }
  console.log(_param, 'xhparamshttp')
  return http({
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: DOOR_URL,
    params: _param
  })
  // return http.post('', params, {
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded'
  //   }
  // })
}
// 拼接APP_URL
function getAppUrl (url, params) {
  let APP_URL = LOCAL_URL + url
  let count = 0
  for (let key in params) {
    if (count === 0) {
      APP_URL += `?${key}=${params[key]}`
    } else {
      APP_URL += `&${key}=${params[key]}`
    }
    count++
  }
  console.log(APP_URL, 'APP_URL')
  return APP_URL
}
let xh = {
  post
}
export {xh}
