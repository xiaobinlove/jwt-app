// LOCAL_URL: 服务器地址  DOOR_URL: 星火转发url
import {LOCAL_URL, DOOR_URL, TEL_DEV} from '../common/js/config'
import http from './HTTP'
let fetch
function post (url, obj, params) {
  return new Promise((resolve, reject) => {
    let param = {
      APP_URL: getAppUrl(url, params.params)
    }
    window.xh.post_dg(DOOR_URL, param, res => {
      // var result = eval('(' + res.returnValue + ')')
      // alert(JSON.stringify(result))
      resolve({data: JSON.parse(res.returnValue)})
    }, err => {
      console.log(err, 'posterr')
      reject(JSON.parse(err.returnValue))
    })
  })
}
// 拼接APP_URL
function getAppUrl (url, params) {
  let APP_URL = LOCAL_URL + url
  let count = 0
  for (let key in params) {
    if (count === 0) {
      APP_URL += `?${key}=${encodeURI(params[key])}`
    } else {
      APP_URL += `&${key}=${encodeURI(params[key])}`
    }
    count++
  }
  return APP_URL
}
function uploadFile (filePath, url, params, options) {
  let APP_URL = getAppUrl(url, params)
  var _options = new FileUploadOptions()
  _options.chunkedMode = false
  for (let key in options) {
    if (options.hasOwnProperty(key)) {
      _options[key] = options[key]
    }
  }
  _options.params = {}
  console.log(filePath, APP_URL, _options, 'uploadFileTst')
  return new Promise((resolve, reject) => {
    window.xh.uploadFile_dg(filePath, APP_URL, function (res) {
      resolve(res)
    }, function (err) {
      reject(err)
    }, _options)
  })
}
if (!TEL_DEV) {
  fetch = http
} else {
  fetch = {
    post,
    uploadFile
  }
}
export default fetch
