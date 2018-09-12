// 映射地址
let MAP_IP = 'http://192.168.2.56:19041'
// 统一处理请求url
let DOOR_URL = 'http://192.168.2.56:18080/supp/httpClient'
// 服务器url
let LOCAL_URL = 'http://68.174.33.52'
// 版本号
let APP_VERSION = 'v1.0.2.20180907'
// mqttIP
let WSBROKER
let WSPORT
// mqtt端口
console.log(process.env.srconfig, 'process.env.srconfig')
switch (process.env.srconfig) {
  case 'dev':
    WSPORT = 19041
    MAP_IP = 'http://192.168.2.56:' + WSPORT
    LOCAL_URL = 'http://68.174.33.52'
    WSBROKER = '192.168.2.56'
    break
  case 'test':
    WSPORT = 19045
    MAP_IP = 'http://192.168.2.56:' + WSPORT
    LOCAL_URL = 'http://68.174.33.43'
    WSBROKER = '192.168.2.56'
    break
  case 'pro':
    WSPORT = 18088
    // WSPORT = 80
    MAP_IP = 'http://192.168.2.56:' + WSPORT
    LOCAL_URL = 'http://68.174.75.235'
    WSBROKER = '192.168.2.56'
    break
  default:
    WSPORT = 19041
    MAP_IP = 'http://192.168.2.56:' + WSPORT
    LOCAL_URL = 'http://68.174.33.52'
    WSBROKER = '192.168.2.56'
    break
}
// 是否手机运行环境
const TEL_DEV = true

function mqtt () {
  if (TEL_DEV) {
    // WSBROKER = '192.168.2.56'
    // WSPORT = 19041
  } else {
    // WSBROKER = '68.174.33.52'
    WSBROKER = '68.174.33.43'
    WSPORT = 80
  }
}
console.log(LOCAL_URL, 'LOCAL_URL')
mqtt()
export {DOOR_URL, LOCAL_URL, TEL_DEV, WSBROKER, WSPORT, MAP_IP, APP_VERSION}
