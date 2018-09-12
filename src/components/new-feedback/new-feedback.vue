<template>
  <div class="new-feedback">
    <alarm-header :title="'处警反馈'" @back="$router.back()"></alarm-header>
    <div class="f-content of-y-s" :class="{'more-menu': moreMenuFlag}" ref="content">
      <div class="wrap">
        <!--<div :class="{'others': false, 'me': true}" class="msg-item p-box">-->
          <!--<div class="icon-head t-c">-->
            <!--<svg class="icon" aria-hidden="true">-->
              <!--<use xlink:href="#icon-jingcha"></use>-->
            <!--</svg>-->
          <!--</div>-->
          <!--<div class="msg-detail p-box p-box-ver">-->
            <!--<div class="desc p-box">-->
              <!--<div class="nickname">砖三</div>-->
            <!--</div>-->
            <!--<div v-if="false" class="msg-content">111111111111111111111</div>-->
            <!--<div v-if="true" class="msg-content">-->
              <!--<img :src="imgUrl" alt="">-->
            <!--</div>-->
            <!--&lt;!&ndash;<div v-if="false" class="msg-content"></div>&ndash;&gt;-->
          <!--</div>-->
        <!--</div>-->
        <!--<div :class="{'others': true, 'me': false}" class="msg-item p-box">-->
        <div :class="{'others': item.fkType === 2, 'me': item.fkType === 1}" v-for="(item, index) in chatList" :key="index">
          <div class="msg-item p-box">
            <div class="icon-head t-c">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-jingcha"></use>
              </svg>
            </div>
            <div class="msg-detail p-box p-box-ver">
              <div class="desc p-box">
                <div class="nickname">{{item.fkrxm}}</div>
              </div>
              <div v-if="item.filetype === null" class="msg-content">{{item.fknr}}</div>
              <div v-else>
                <div v-if="item.fknr.indexOf('.jpg') !== -1 || item.fknr.indexOf('.jpeg') !== -1 || item.fknr.indexOf('.png') !== -1" class="msg-content" @click="imgClick(item)">
                  <img :src="mapIp + '/'  + item.fknr" alt="" class="msg-img" ref="msgImg">
                  <!--<img :src="item.fullPath" alt="" class="msg-img" v-if="item.imgType === 'local'" ref="msgImg">-->
                  <!--<img :src="mapIp + '/'  + item.fknr" alt="" class="msg-img" ref="msgImg" v-else>-->
                </div>
                <div v-if="item.fknr.indexOf('.mp3') !== -1 || item.fknr.indexOf('.amr') !== -1" class="msg-content" @click="openFile(item)">
                  <!--<span>{{xhUrl + '/' + item.fileUrl + item.fknr}}</span>-->
                  <!--<x-button mini class="bt" type="primary" @click.native="playVideo(item)">播放视频</x-button>-->
                  <!--<audio :src="mapIp + '/'  + item.fknr" controls></audio>-->
                  <img src="./img/eecordings.png" alt="" class="file-img">
                  {{item.wjm + item.fknr.substring(item.fknr.indexOf('.'))}}
                </div>
                <div v-if="item.fknr.indexOf('.mp4') !== -1 || item.fknr.indexOf('.3gp') !== -1 || item.fknr.indexOf('.ogg') !== -1" class="msg-content" @click="openFile(item)">
                  <!--<span>{{xhUrl + '/' + item.fileUrl + item.fknr}}</span>-->
                  <!--<x-button mini class="bt" type="primary" @click.native="playVideo(item)">播放视频</x-button>-->
                  <!--<video :src="mapIp + '/'  + item.fknr" controls></video>-->
                  <img src="./img/videos.png" alt="" class="file-img">
                  {{item.wjm + item.fknr.substring(item.fknr.indexOf('.'))}}
                </div>
                <div v-if="item.fknr.indexOf('.jpg') === -1 && item.fknr.indexOf('.jpeg') === -1 && item.fknr.indexOf('.png') === -1 && item.fknr.indexOf('.mp3') === -1 && item.fknr.indexOf('.amr') === -1 && item.fknr.indexOf('.mp4') === -1 && item.fknr.indexOf('.ogg') === -1 && item.fknr.indexOf('.3gp') === -1" class="msg-content">
                  <!--<span>{{xhUrl + '/' + item.fileUrl + item.fknr}}</span>-->
                  <!--<x-button mini class="bt" type="primary" @click.native="playVideo(item)">播放视频</x-button>-->
                  <!--<x-button mini class="bt" type="primary" @click.native="xhdownloadFile(item)">{{item.wjm + item.fknr.substring(item.fknr.indexOf('.'))}}</x-button>-->
                  <img src="./img/file.png" alt="" class="file-img">
                  {{item.wjm + item.fknr.substring(item.fknr.indexOf('.'))}}
                </div>
              </div>
            </div>
          </div>
          <div class="todo-time t-c">
            {{item.fksj | sortDate}}
          </div>
        </div>
        <div>
        </div>
      </div>
      </div>
    <div class="msg-sender p-box p-box-ver w-100">
      <div class="p-box p-box-ac w-100">
        <div class="iconfont icon-tianjiaadd154 icon" @click="moreMenu"></div>
        <textarea ref="textInput" class="input p-box-f1" v-model="jqcljg"></textarea>
        <x-button mini class="bt" type="primary" @click.native="sendFeedBack">发送</x-button>
      </div>
    </div>
    <div class="sample_result" id="fu_result"></div>
    <div class="file-sender" v-show="moreMenuFlag">
      <div class="item" @click="photographAndUpload">
        <i class="iconfont icon-xiangji"></i>
        <span>拍摄</span>
      </div>
      <div class="item" @click="record">
        <i class="iconfont icon-voice_icon"></i>
        <span>录音</span>
      </div>
      <div class="item" @click="uploadPictures">
        <i class="iconfont icon-folder_icon"></i>
        <span>图片</span>
      </div>
      <div class="item" @click="selectFiles">
        <i class="iconfont icon-folder_icon"></i>
        <span>文件</span>
      </div>
      <div class="item" @click="sceneVideo">
        <i class="iconfont icon-shipin"></i>
        <span>摄像</span>
      </div>
    </div>
  </div>
</template>
<script>
import alarmHeader from '../components/alarm-hearder'
import { XButton, Spinner } from 'vux'
import {getAppUser, IS_OK, getUser} from '../../common/js/auth'
import {mapGetters} from 'vuex'
import {uploadFile, getByCjdbh, cjfkList, sendCjfk} from '../../api/feed-back'
import {startShowPic, startVideoPlay, scrollToBottom} from '../../common/js/util'
import {MAP_IP, DOOR_URL, LOCAL_URL} from '../../common/js/config'
// var fileList = new Array()
// var fileIndex = 0
var dstDir
var savePath
var saveDirectory = 'GACloudFiles'
var MAX_PHOTOS = 1
export default {
  name: 'newFeedback',
  components: {
    alarmHeader,
    XButton,
    Spinner
  },
  data () {
    return {
      chatList: [],
      moreMenuFlag: false,
      imgUrl: '../../../static/testimg.jpg',
      fkdb: '',
      jqcljg: '', // 反馈内容
      mapIp: MAP_IP // 映射地址
    }
  },
  watch: {},
  computed: {
    ...mapGetters({mapData: 'mapData', detailInfo: 'detailInfo'})
  },
  async created () {
    this.$vux.loading.show()
    await this.getByCjdbhApi()
    this.cjfkListApi()
    this.getSavePath()
  },
  methods: {
    xhdownloadFile (item) {
      console.log()
      this.getAppDirectoryEntry()
      var url1 = DOOR_URL
      // var url2 = `${LOCAL_URL}/service-mjcj/mjcjFkdb/cjfkFile`
      var url2 = `${LOCAL_URL}/service-mjcj/uploadify/download`
      var src = `Downloads/file/${item.wjm + item.fknr.substring(item.fknr.indexOf('.'))}.jpg`
      var uri = `${url1}?loginid=${getAppUser().loginid}&cclj=${src}&&APP_URL=${url2}`
      var filePath = savePath + '/' + src
      console.log(filePath, uri, 'filePath, uri')
      // xh.downloadFile_dg(filePath, uri, success, fail)
      app.openFile('http://192.168.2.56:19041/jwt-app/121212.mp4', '', function (res) {
        console.log(res, 'openFile')
      })
      function success (e) {
        console.log(e, '下载成功')
      }
      function fail (e) {
        console.log(e, '下载失败')
      }
    },
    openFile (item) {
      console.log(item, 'openFile')
      let path
      if (item.isLocal) {
        path = item.fullPath
      } else {
        path = this.mapIp + '/' + item.fknr
      }
      console.log(path, 'path')
      app.openFile(path, '', function (res) {
        console.log(res, 'openFile')
      })
    },
    selectFiles () {
      let _this = this
      app.link.chooseFile(function (result) {
        console.log(result, 'selectFiles')
        _this.onFileSelected('file://' + result)
      })
      // function onFileSelected (imageURI) {
      //   console.log(imageURI, 'onFileSelected')
      //   window.resolveLocalFileSystemURI(imageURI, function (fileEntry) {
      //     fileEntry.file(function (fileObj) {
      //       _this.upload2(fileObj, 5)
      //       console.log(fileObj, 'selectFilesfileObj')
      //     })
      //   })
      // }
    },
    onFileSelected (imageURI, toEncoder = 'N') {
      let _this = this
      console.log(imageURI, 'onFileSelected')
      window.resolveLocalFileSystemURI(imageURI, function (fileEntry) {
        fileEntry.file(function (fileObj) {
          // let type = _this.judgeType(fileObj.type)
          let type = 5
          _this.upload2(fileObj, type, toEncoder)
          console.log(fileObj, 'selectFilesfileObj')
        })
      })
    },
    judgeType (val) {
      if (val.indexOf('image/jpeg') !== -1 || val.indexOf('jpg') !== -1) {
        return 2
      }
      if (val.indexOf('audio/amr') !== -1) {
        return 4
      }
      if (val.indexOf('video/mp4') !== -1 || val.indexOf('mp4') !== -1) {
        return 3
      }
      return 5
    },
    imgClick (item) {
      let imagesPath = this.stitchingPath(item)
      startShowPic(imagesPath)
    },
    // 路径拼接
    stitchingPath (item) {
      let imagesPath = this.mapIp + '/service-mjcj/' + item.fileUrl + item.fknr
      return imagesPath
    },
    playVideo (item) {
      let imagesPath = this.stitchingPath(item)
      startVideoPlay(imagesPath)
    },

    // 获取手机目录
    getAppDirectoryEntry () {
      app.getAppDirectoryEntry(function (res) {
        // 区分平台，并将相应的目录保存到全局,方便下面下载的时候使用
        if (window.devicePlatform === 'android') {
          savePath = res.sdcard
        } else if (window.devicePlatform === 'iOS') {
          savePath = res.documents
        }
      })
    },
    // 下载
    download () {
      this.getAppDirectoryEntry()
      var url1 = DOOR_URL
      // var url2 = `${LOCAL_URL}/service-mjcj/mjcjFkdb/cjfkFile`
      var url2 = `${LOCAL_URL}/service-mjcj/uploadify/download`
      var src = 'group1/M00/02/9A/RK4hS1tGt-KAZaWRAAjsd68Xi_Q880.jpg'
      var uri = `${url1}?loginid=${getAppUser().loginid}&cclj=${src}&&APP_URL=${url2}`
      var filePath = savePath + '/' + src
      console.log(filePath, uri, 'filePath, uri')
      xh.downloadFile_dg(filePath, uri, success, fail)
      function success (e) {
        console.log(e, '下载成功')
      }
      function fail (e) {
        console.log(e, '下载失败')
      }
    },
    // 获取反馈单
    async getByCjdbhApi () {
      await getByCjdbh({cjdbh: this.detailInfo.cjdbh, loginid: getAppUser().loginid}).then(res => {
        console.log(res.data, 'getByCjdbhApi')
        if (res.data.status === IS_OK) {
          this.fkdb = JSON.parse(res.data.data).data
        }
      })
    },
    // 反馈列表
    cjfkListApi () {
      let _this = this
      cjfkList({loginid: getAppUser().loginid, jjdbh: this.detailInfo.jjdbh, fkdbh: this.fkdb.fkdbh}).then(res => {
        this.$vux.loading.hide()
        console.log(res.data, '反馈列表')
        console.log(JSON.parse(res.data.data).data, '反馈列表')
        if (res.data.status === IS_OK) {
          this.chatList = JSON.parse(res.data.data).data
          scrollToBottom(_this, this.$refs.content)
        }
      }, function () {
        this.$vux.loading.hide()
      })
    },
    sendFeedBack () {
      console.log('发送')
      let nr = this.jqcljg
      if (nr.trim().length === 0) {
        this.$vux.toast.show({
          type: 'warn',
          text: '请输入文字'
        })
        return
      }
      this.jqcljg = ''
      sendCjfk({
        loginid: getAppUser().loginid,
        jjdbh: this.detailInfo.jjdbh,
        cjdbh: this.detailInfo.cjdbh,
        fkdbh: this.fkdb.fkdbh,
        xzqhdm: this.fkdb.xzqhdm,
        jqcljg: nr
      }).then(res => {
        if (res.data.status === IS_OK) {
          // this.jqcljg = ''
          // this.cjfkListApi()
          console.log(this.$refs.content, 'this.$refs.content')
          let time = new Date().getTime()
          // let time = dateFormat(new Date(), 'HH:mm')
          let obj = {}
          obj.filetype = null
          obj.fkrxm = getUser().yhxm
          obj.fksj = time
          obj.fknr = nr
          obj.fkType = 1
          this.chatList.push(obj)
          scrollToBottom(this, this.$refs.content)
        }
        console.log(res.data, 'sendCjfk')
      })
    },
    moreMenu () {
      // this.download()
      console.log(1111)
      console.log(this.detailInfo, 'detailInfo')
      this.moreMenuFlag = !this.moreMenuFlag
    },
    // 拍照上传图片
    photographAndUpload () {
      // navigator.camera.getPicture(this.photoSuccess, this.photoFail, {
      navigator.camera.getPicture(this.onImageSuccess, this.photoFail, {
        quality: 100,
        targetWidth: 600,
        targetHeight: 1000,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.CAMERA,
        encodingType: navigator.camera.EncodingType.JPEG,
        cameraDirection: 0
      })
    },
    // 打开图片库
    uploadPictures () {
      navigator.camera.getPicture(this.photoSuccess, this.photoFail, {
        quality: 100,
        targetWidth: 600,
        targetHeight: 1000,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: 0,
        encodingType: navigator.camera.EncodingType.JPEG
      })
      // navigator.camera.getPicture(this.photoSuccess, this.photoFail, { quality: 50,
      //   destinationType: Camera.DestinationType.DATA_URL,
      //   sourceType: Camera.PictureSourceType.PHOTOLIBRARY
      // })
    },
    upload2 (fileEntry, filetype = 2, toEncoder = 'N') {
      this.$vux.loading.show({
        text: '上传中'
      })
      let _this = this
      console.log(fileEntry, 'fileEntry')
      var options = new FileUploadOptions()
      options.fileKey = 'file' // 用于设置参数，服务端的Request字串
      // options.fileName = fileEntry.name // 希望文件存储到服务器所用的文件名
      options.mimeType = fileEntry.type // 图片格式
      var url1 = DOOR_URL
      // var url2 = `${LOCAL_URL}/service-mjcj/mjcjFkdb/cjfkFile`
      var url2 = `${LOCAL_URL}/service-mjcj/mjcjFkdb/cjfkFile?loginid=${getAppUser().loginid}`
      console.log(url2, 'url2')
      var uri = `${url1}?APP_URL=${url2}`
      // var uri = encodeURI(`${url1}?APP_URL=${url2}`)
      console.log(uri, 'uri')
      options.chunkedMode = false	// 如果上传的文件大小未知时，必须带上此参数，否则后台无法获取文件流
      var params = {}
      // params.loginid = getAppUser().loginid
      params.jjdbh = this.detailInfo.jjdbh
      params.cjdbh = this.detailInfo.cjdbh
      params.fkdbh = this.fkdb.fkdbh
      params.xzqhdm = this.fkdb.xzqhdm
      // params.filetype = filetype
      if (filetype === 5) {
        params.filetype = this.judgeType(fileEntry.type)
      } else {
        params.filetype = filetype
      }
      params.type = '2'
      params.toEncoder = toEncoder
      params.fileName = fileEntry.name
      // options.headers = 'headers'
      options.fileName = JSON.stringify(params)
      // options.params = params
      console.log(options, params)
      xh.uploadFile_dg(fileEntry.fullPath, uri, uploadOK, onFail, options)

      // uploadFile(fileEntry.fullPath, {
      //   loginid: getAppUser().loginid,
      //   jjdbh: this.detailInfo.jjdbh,
      //   filetype: 2,
      //   type: '2',
      //   cjdbh: this.detailInfo.cjdbh,
      //   fkdbh: this.fkdb.fkdbh
      // }, {
      //   fileKey: 'file',
      //   fileName: fileEntry.name,
      //   mimeType: fileEntry.type
      // }).then(res => {
      //   console.log(res, '上传成功promise')
      // }, err => {
      //   console.log(err, '上传失败')
      // })

      console.log(this.fkdb.fkdbh, 'this.fkdb.fkdbh')
      function uploadOK (msg) {
        _this.$vux.loading.hide()
        console.log(msg, '上传图片成功')
        console.log(filetype, 'filetype')
        if (filetype === 3) {
          localAdd()
        } else {
          _this.cjfkListApi()
        }
        if (msg.response.cclj) {
          app.hint('上传成功')
          // localAdd()
        } else {
          app.hint(msg.response.errMsg)
        }
        // _this.cjfkListApi()
        // var data = eval('(' + msg.response + ')')
        // var Pfname = data.obj[0].pfname
        // var imgName = Pfname.substr(Pfname.lastIndexOf('/') + 1)
        // mediaFiles.substr(mediaFiles.lastIndexOf('/') + 1)
      }
      function localAdd () {
        let time = new Date().getTime()
        // let time = dateFormat(new Date(), 'HH:mm')
        let obj = {}
        obj.filetype = filetype
        obj.fkrxm = getUser().yhxm
        obj.fksj = time
        obj.fknr = fileEntry.name
        obj.wjm = fileEntry.name.substring(0, fileEntry.name.indexOf('.'))
        obj.fkType = 1
        obj.isLocal = true
        obj.fullPath = fileEntry.fullPath
        _this.chatList.push(obj)
        console.log('localAdd', obj)
        scrollToBottom(_this, _this.$refs.content)
      }
      function onFail (err) {
        app.hint('上传失败!')
        _this.$vux.loading.hide()
        alert(JSON.stringify(err))
      }
    },
    getSavePath () {
      app.getAppDirectoryEntry(function(res){
        // 区分平台，并将相应的目录保存到全局,方便下面下载的时候使用
        //  alert(JSON.stringify(res));     //wangxi
        if (window.devicePlatform === 'android') {
          savePath = res.sdcard + '/' + saveDirectory
        }
      })
    },
    // 文件复制保存路径
    copyFile2Library (obj, newName) {
      // 检查保存路径
      // alert(newName+"  " +savePath)
      this.checkFile(savePath)
      if (obj.fullPath.indexOf(saveDirectory) > 0) {
        // 历史记录，不重复保存
        //                app.hint("file :" + obj.fullPath + " exist.no copy needed.");
        return obj.fullPath
      }
      // 拍照的相片复制到保存路径下
      window.resolveLocalFileSystemURI(obj.fullPath, onSuccess, onError)

      function onSuccess (fileEntry) {
        var dstName = obj.name
        if (typeof (newName) !== 'undefined' && newName != null && newName !== '') {
          dstName = newName
        }
        fileEntry.copyTo(dstDir, dstName, null, null)
      }

      function onError (evt) {
        app.hint('保存路径不存在！', evt)
      }

      return dstDir.fullPath + '/' + newName
    },
    checkFile (path) {
      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail)
      function onFileSystemSuccess (fileSystem) {
        fileSystem.root.getDirectory(path, {
          create: true,
          exclusive: false
        }, success, fail)
        function success (parent) {
          //                    $("#result").html(JSON.stringify(parent));
          dstDir = parent
          // 创建一个目录读取器
          var directoryReader = parent.createReader()
          // 获取目录中的所有条目
          directoryReader.readEntries(function (entries) {
            console.log(entries, 'directoryReader')
            if (entries.length > MAX_PHOTOS) {
              // 删除此目录及其所有内容
              parent.removeRecursively(function () {
                // 重建文件夹
                fileSystem.root.getDirectory(path, {
                  create: true,
                  exclusive: false
                }, success, fail)
              }, function (error) {
                app.hint('清空图片缓存文件夹失败', error)
              })
            }
            //                        $("#result").html(JSON.stringify(entries));
          }, function (error) {
            alert('Failed to list directory contents:' + error.code)
          })
        }

        function fail (error) {
          app.hint('Unable to create new directory:' + error.code)
        }
      }

      function fail (evt) {
        app.hint('requestFileSystem : ' + evt.target.error.code)
      }
    },
    onImageSuccess (imageURI) {
      let _this = this
      var tmp = imageURI.split('/')
      if (tmp[tmp.length - 1].indexOf('%') > 0) {
        app.alert('华为手机从‘最近’获取的图片无效！')
        return
      }
      window.resolveLocalFileSystemURI(imageURI, function (fileEntry) {
        fileEntry.file(function (fileObj) {
          // 因为压缩图片后，名字会改变成resize.jpg，重新命名
          var newPicName = (new Date().getTime()) + '.jpg'
          var fullPath = _this.copyFile2Library(fileObj, newPicName)
          fileObj.name = newPicName
          fileObj.fullPath = fullPath
          fileObj.type = 'jpg'
          console.log(fileObj, 'onImageSuccess')
          _this.upload2(fileObj, 2)
        })
      })
    },
    // 获取文件相关信息
    photoSuccess (imageURI) {
      let _this = this
      var tmp = imageURI.split('/')
      if (tmp[tmp.length - 1].indexOf('%') > 0) {
        app.alert('华为手机从‘最近’获取的图片无效！')
        return
      }
      window.resolveLocalFileSystemURI(imageURI, function (fileEntry) {
        fileEntry.file(function (fileObj) {
          _this.upload2(fileObj, 2)
          // 因为压缩图片后，名字会改变成resize.jpg，重新命名
          // var newPicName = (new Date().getTime()) + '.jpg'
          // var fullPath = _this.copyFile2Library(fileObj, newPicName)
          // fileObj.name = newPicName
          // fileObj.fullPath = fullPath
          // fileObj.type = 'jpg'
        })
      })
      console.log(imageURI, 'imageURI')
      // app.progress.start('温馨提示","文件上传中...')
      // var ft = new FileTransfer()
      // ft.upload(imageURI, UPLOAD_URL, this.win, this.photoFail, options)
    },
    photoFail (message) {
      console.log(message, 'uploadfail')
    },
    record () {
      navigator.device.capture.captureAudio(this.recordSuccess, this.recordFail, {limit: 1})
    },
    recordSuccess (mediaFiles) {
      console.log(mediaFiles, 'mediaFiles')
      for (let item of mediaFiles) {
        this.upload2(item, 4, 'Y')
      }
    },
    recordFail (msg) {
      console.log(msg, 'recordFail')
    },
    // 摄影上传
    sceneVideo () {
      let _this = this
      document.addEventListener('deviceready', function () {
        let opthons = {limit: 1}
        navigator.device.capture.captureVideo(_this.sceneVideoSuccess, _this.sceneVideoFail, opthons)
        // navigator.mediaDevices.getUserMedia({
        //   video: {width: 480, height: 320}
        // }).then(res => {
        //   console.log(res, 'getUserMedia')
        // }).catch(err => {
        //   console.log(err, 'getUserMediaerr')
        // })
      }, false)
    },
    sceneVideoSuccess (mediaFiles) {
      console.log(mediaFiles, 'sceneVideoSuccess')
      for (let item of mediaFiles) {
        this.upload2(item, 3, 'Y')
        // this.onFileSelected(item.fullPath, 'Y')
      }
    },
    sceneVideoFail (err) {
      console.log(err, 'sceneVideoFail')
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" type="text/less">
  @import "../../common/less/sum";
  .new-feedback {
    height: 100%;
    .todo-time {
      margin: 5px auto;
      .mt(20);
      .w(150);
      .h(50);
      .lh(50);
      color: #fff;
      border-radius: 4px;
      background: #c6c6c6;
      .fs(36)
    }
    .file-img {
      .h(100);
      .w(100);
    }
    .msg-img {
      width: 100%;
      .h(1000)
    }
    .f-content {
      height: calc(100% - unit(250/108, rem));
      &.more-menu {
        height: calc(100% - unit(390/108, rem));
      }
      .msg-item {
        .pt(25);
        .icon-head {
          margin: unit(10/108, rem);
          .w(105);
          .h(105);
          .lh(105);
          background-color: #8ba38d;
          border-radius: 50%;
          .fs(80);
        }
        .msg-detail {
          .ml(10);
          .mr(10);
          .nickname {
            color: #999;
          }
          .msg-content {
            position: relative;
            .mt(10);
            padding: unit(20/108, rem);
            max-width: unit(800/108, rem);
            background-color: #fff;
            border-radius: 5px;
            .lh(60);
            .fs(36);
            word-wrap: break-word;
            img {
              /*display: block;*/
              max-width: 100%;
            }
          }
          .msg-content:before {
            position: absolute;
            .t(15);
            width: 0;
            height: 0;
            display: block;
            content: '';
            border-top: unit(10/108, rem) solid transparent;
            border-bottom: unit(10/108, rem) solid transparent;
          }
        }
        &.others {
          .msg-content:before {
            .l(145);
            border-right: unit(15/108, rem) solid #fff;
          }
        }
        &.me {
          flex-direction: row-reverse;
          .desc {
            flex-direction: row-reverse;
          }
          .msg-content:before {
            .r(145);
            border-left: unit(15/109) solid #fff;
          }
        }
      }
    }
    .msg-sender {
      box-sizing: border-box;
      width: 100%;
      .h(120);
      background-color: #f4f3f4;
      border-top: 1px solid #d8d8d9;
      justify-content: center;
      .input {
        box-sizing: border-box;
        outline: none;
        border: 1px solid #dddddd;
       /* padding: unit(10/108, rem);*/
        .h(90);
        /*.lh(90);*/
        border-radius: 6px;
        background-color: #fcfcfc;
        /*resize: none;*/
        overflow: auto;
        font-family: sans-serif;
      }
      .icon {
        .h(80);
        .w(80);
        .ml(15);
        .mr(15);
      }
      .iconfont {
        .fs(75);
        color: #808388;
      }
      .bt {
        .h(78);
        .lh(78);
        .ml(15);
        .mr(15);
        .fs(35);
        /*background: #35b9ff;*/
      }
    }
    .file-sender {
      width: 100%;
      box-sizing: border-box;
      background-color: #f4f3f4;
      /*.pt(10);
      .pb(10);*/
      display: flex;
      align-items: center;
      justify-content: space-around;
      .h(140);
      color: #808388;
      .iconfont {
        .fs(80);
      }
      .item {
        .fs(35);
        text-align: center;
        display: flex;
        flex-direction: column;
        .w(95);
        height: 100%;
      }
    }
  }
</style>
