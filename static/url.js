
// 全局变量，端口是否转发
isProxy = true

var debug = false

// 端口映射地址
// var url = 'http://172.28.0.56:9000'
var url = 'http://192.168.2.56:19041'
var _MAP_IP = 'http://192.168.2.56:19041'
// var url = 'http://192.168.2.56:19045' // 测试环境映射地址
url = app.getUrl(url)

// 服务器真实地址
var _url = 'http://68.174.33.52'
// var _url = 'http://68.174.75.235'

// 全局变量，app名称和版本信息
APP_NAME = 'MJCJ-JWT'
isUsingXhServer = true

// var APP_VERSION = 'v1.00.20180827'
