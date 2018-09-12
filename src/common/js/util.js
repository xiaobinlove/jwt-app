// 图片预览
export function startShowPic (imagesPath) {
  // var imagesPath = 'http://img4.imgtn.bdimg.com/it/u=2659431908,1847612742&fm=27&gp=0.jpg;http://img4.imgtn.bdimg.com/it/u=2659431908,1847612742&fm=27&gp=0.jpg'
  var params = {
    'action': 'com.xhinfo.orc.GlidePicActivity',
    // imagesPath 图片路径，用;号分割开  showPosition显示第几章，默认0（第0张为第一张）   isInternet是不是网络图片
    'names': ['imagesPath', 'showPosition', 'isInternet'],
    'values': [imagesPath, '0', '1']
  }
  // { 'success'接口是否成功,  'message' 提示信息,    'isPluginOK'星火插件是否奔溃或者接口出问题，1表示没问题 0表示有问题 为空表示用户点了返回键  'score',比对分数 'picPath'图片路径 };
  // alert(JSON.stringify(params))
  app.szgaplugin.startActivityForResult(params, function (res) {
    // var ret = eval('(' + res + ')')
    // alert(JSON.stringify(ret))
  }, function (err) {
    // alert(JSON.stringify(err))
  })
}
// 视频播放
export function startVideoPlay (videoPath) {
  // var videoPath = 'http://172.28.0.56:9000/new/upload/201708/20170829194205%E3%80%8A%E4%B9%A0%E8%BF%91%E5%B9%B3%E7%94%A8%E5%85%B8%E3%80%8B2%E5%AD%A3%E7%AC%AC9%E9%9B%86%EF%BC%9A%E5%90%BE%E6%97%A5%E4%B8%89%E7%9C%81%E5%90%BE%E8%BA%AB.mp4_%E6%A0%87%E6%B8%85.mp4'
  var params = {'action': 'xinghuo_start_video_activity',
    // videoPath 视频播放路径  allTime视频总时长 cameraTime 拍照的时间  fullScreen是否全屏 takeCamera是否拍照 dragProgress是否可以快进
    'names': ['videoPath', 'allTime', 'beginTime', 'cameraTime', 'fullScreen', 'takeCamera', 'dragProgress'],
    'values': [videoPath, '180', '60', '0', 'true', 'true', 'false']
  }
  // { 'success'接口是否成功,  'message' 提示信息,    'isPluginOK'星火插件是否奔溃或者接口出问题，1表示没问题 0表示有问题 为空表示用户点了返回键  'score',比对分数 'picPath'图片路径 };
  alert(JSON.stringify(params))
  app.szgaplugin.startActivityForResult(params, function (res) {
    var ret = eval('(' + res + ')')
    alert(JSON.stringify(ret))
  }, function (err) {
    alert(JSON.stringify(err))
  })
}
export function scrollToBottom (Vue, Dom) {
  Vue.$nextTick(() => {
    Dom.scrollTop = Dom.children[0].offsetHeight
    // Dom.scrollTop = 10000
  })
}
// 硬件控制
const TYPE_GPS = 2
const mIsEnable = false
function setStatus (isOpen, which, isEnable) {
  var params = {
    'flag': isOpen,
    'which': which,
    'isEnable': isEnable
  }
  app.szgaplugin.setStatus(params, function (res) {
    // alert(JSON.stringify(res))
    // console.log(res, 'setStatus')
  }, function (err) {
    // alert(JSON.stringify(err))
    console.log(err, 'setStatuserr')
  })
}
function getStatus (which) {
  return new Promise((resolve, reject) => {
    var params = {
      'which': which
    }
    app.szgaplugin.getStatus(params, function (res) {
      // alert(JSON.stringify(res))
      // console.log(res, 'getStatus')
      resolve(res.isEnable)
    }, function (err) {
      // alert(JSON.stringify(err))
      console.log(err, 'getStatuserr')
      reject(err)
    })
  })
}

// 检测定位状态，自动打开定位
export function autoOpenGPS () {
// 没有打开定位
  getStatus(TYPE_GPS).then(res => {
    if (res === false) {
      // 有打开定位
      setStatus(true, TYPE_GPS, mIsEnable)
    }
  }, () => {
    // 获取定位状态失败也打开定位
    setStatus(true, TYPE_GPS, mIsEnable)
  })
}
