window.app=window.app||{};
window.app.StreamingMedia=window.app.StreamingMedia||{};
/**
        该接口用于播放video
        @method app.StreamingMedia.playVideo
        @static
        @param url {String} 文件url的地址
        @param options {jsonarray} 选项
        @param orientation {string} 选项
        @param successCallback  成功回调方法
        @param errorCallback  失败回调方法
        @example 
        //播放刚刚录制的视频,第三个参数 0为竖屏播放，1为横屏播放，2为根据物理感应器决定
           $("#btnPlayVideo").tap(function(){
              app.StreamingMedia.playVideo(videoPath,{},0,function(res){
              alert(res);
          },function(error){
              alert(error);
          });
        });
    */  
app.StreamingMedia.playVideo=function (url,options,orientation,successCallback,errorCallback) {
	options = options || {};
	cordova.exec(successCallback || null, errorCallback||null, "StreamingMedia", "playVideo", [url, options,orientation]);
};

/**
        该接口用于播放video
        @method app.StreamingMedia.playAudio
        @static
        @param url {String} 文件url的地址
        @param options {String} 选项
        @param successCallback  成功回调方法
        @param errorCallback  失败回调方法
        @example 
          $("#btnPlayAudio").tap(function(){
              app.StreamingMedia.playAudio(audioPath,{},function(res){
              alert(res);
          },function(error){
              alert(error);
          });
        });
    */  
app.StreamingMedia.playAudio=function (url, options,successCallback,errorCallback) {
	options = options || {};
	cordova.exec(successCallback || null, errorCallback||null, "StreamingMedia", "playAudio", [url, options,0]);
};