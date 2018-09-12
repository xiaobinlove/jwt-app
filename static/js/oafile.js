/**
 * 初始化
 */
;(function(undefined){
    //初始化
})()

function getSavepath(){
    app.getAppDirectoryEntry(function(res){
        //区分平台，并将相应的目录保存到全局,方便下面下载的时候使用
        if(window.devicePlatform=="android"){
            window.savePath=res.sdcard + "/Download/linkDowns";
        }
    });
}

/**
 * 清除文件
 */
function clearFile() {
    app.hashmap.readValues("oaHashMapFile",function(res){
        for(var i = 0; i<res.length;i++){
            app.file.remove(res[i],function(res){
                //app.hint("已清除文件!");
            });
        }
    });
    app.hashmap.clear("oaHashMapFile");
}

function loadContent(){
    var $formcontent = $(".content");
    if($formcontent.length){
        var contentHeight = $(window).height() - $(".header").height() - $(".footer").height();
        $formcontent.height(contentHeight).css("overflow-y", "auto");
    }
}
