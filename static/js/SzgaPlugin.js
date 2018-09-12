/*
 * 深圳公安link项目定制插件
 * 2015/3/5
 * */
;
(function(window) {
	window.app = window.app || {};
	window.app.szgaplugin=window.app.szgaplugin||{};

    //接口控制
    var TYPE_WIFI = 1;
    var TYPE_GPS = 2;
    var TYPE_BLUETOOTH = 3;
    var TYPE_NFC = 4;

	//开启定位
	app.szgaplugin.startLocation=function(successCallback, failCallback, values){
		Cordova.exec(successCallback, failCallback,  "SzgaPlugin", "startLocation", [values]);
	}


	//获取定位信息
	app.szgaplugin.getLocationInfo=function(successCallback, failCallback){
	    // alert(1);
        var wifiOpened = false;
        var gpsOpened = false;

        var params = {
            "flag" : true,
            "which" : TYPE_GPS,
            "isEnable" : false
        };

        var params1 = {
            "which" : TYPE_WIFI
        };

        function getLoc() {
//            app.hint("wifi : " + wifiOpened + " , gps : " +gpsOpened );
            if (!wifiOpened) {
                params.which = TYPE_WIFI;
                app.szgaplugin.setStatus(params);
//                app.hint("open wifi");
                //打开wifi要等几秒让wifi完成扫描

                setTimeout(function(){
                    app.szgaplugin.getLocationInfo2(successCallback,failCallback);
                }, 3000);
            } else {
                //获取一次
                app.szgaplugin.getLocationInfo2(successCallback,failCallback);
            }
        }

        function checkWifi() {
            params1.which = TYPE_WIFI;
            alert(JSON.stringify(params1))
            app.szgaplugin.getStatus(params1, function(res) {
               alert("wifi : " + JSON.stringify(res));
                wifiOpened = res.isEnable;
                // alert(1)
                //启动wifi和gps
                if (!gpsOpened) {
                    params.which = TYPE_GPS;
                    app.szgaplugin.setStatus(params);
                }
                // alert(1)
                getLoc();
            }, function(err) {
                // alert(JSON.stringify(params1))
                getLoc();
            });
        }

        params1.which = TYPE_GPS;
        // alert(JSON.stringify(params1))
        app.szgaplugin.getStatus(params1, function(res) {
           // alert("gps : " + JSON.stringify(res));
            gpsOpened = res.isEnable;

            checkWifi();
        }, function(err) {
            // alert(1)
            checkWifi();
        });

//		Cordova.exec(successCallback, failCallback, "SzgaPlugin", "getLocationInfo", []);
	}



    app.szgaplugin.getLocationInfo2=function(successCallback, failCallback){
        Cordova.exec(successCallback, failCallback, "SzgaPlugin", "getLocationInfo", []);
    }

	//关闭定位
	app.szgaplugin.stopLocation=function(successCallback, failCallback, values){
        if (typeof (values) == 'undefined' || values == null) {
            values = {
                closeWifi : true
            };
        }
		Cordova.exec(successCallback, failCallback, "SzgaPlugin", "stopLocation", [values]);
	}

    //启动证件识别系统
    //values 为类型，2：身份证正面；1000：深圳居住证
    app.szgaplugin.startORC=function(values, successCallback, failCallback){
	    // alert(values);
        Cordova.exec(successCallback, failCallback, "SzgaPlugin", "startORC", [values]);
    }

    app.szgaplugin.startActivityForResult=function(values, successCallback, failCallback){
       // alert("activity : " + JSON.stringify(values));
        Cordova.exec(successCallback, failCallback, "SzgaPlugin", "startActivityForResult", [values]);
    }

    //获取wifi，定位，蓝牙，nfc状态
    app.szgaplugin.getStatus=function(values, successCallback, failCallback){
       // alert("activity : " + JSON.stringify(values));
        Cordova.exec(successCallback, failCallback, "SzgaPlugin", "getStatus", [values]);
    }

    //wifi，定位，蓝牙，nfc开关
    app.szgaplugin.setStatus=function(values, successCallback, failCallback){
        Cordova.exec(successCallback, failCallback, "SzgaPlugin", "setStatus", [values]);
    }

    //启动服务
    app.szgaplugin.startService=function(values, successCallback, failCallback){
        Cordova.exec(successCallback, failCallback, "SzgaPlugin", "startService", [values]);
    }

    //停止服务
    app.szgaplugin.stopService=function(values, successCallback, failCallback){
        Cordova.exec(successCallback, failCallback, "SzgaPlugin", "stopService", [values]);
    }

    //文件转base64
    app.szgaplugin.encodePic2Base64=function(values, successCallback, failCallback){
        Cordova.exec(successCallback, failCallback, "SzgaPlugin", "bitmapToBase64", [values]);
    }

    //base64转文件
    app.szgaplugin.decodeBase64toPic=function(values, successCallback, failCallback){
        Cordova.exec(successCallback, failCallback, "SzgaPlugin", "base64ToBitmap", [values]);
    }
    //获取海拔值
    app.szgaplugin.getAltitude=function(values, successCallback, failCallback){
        Cordova.exec(successCallback, failCallback, "SzgaPlugin", "getAltitude", [values]);
    }
    //图片压缩
    app.szgaplugin.getPicCompress=function(values, successCallback, failCallback){
        Cordova.exec(successCallback, failCallback, "SzgaPlugin", "picCompress", [values]);
    }
    //文字转语音
    app.szgaplugin.wordToVoice=function(values, successCallback, failCallback){
        Cordova.exec(successCallback, failCallback, "SzgaPlugin", "wordToVoice", [values]);
    }
    //说话转文字
    app.szgaplugin.speakToWord=function(values, successCallback, failCallback){
        Cordova.exec(successCallback, failCallback, "SzgaPlugin", "speakToWord", [values]);
    }
    //录音文件转文字
    app.szgaplugin.voiceToWord=function(values, successCallback, failCallback){
        Cordova.exec(successCallback, failCallback, "SzgaPlugin", "voiceToWord", [values]);
    }
    //开始播放音频文件
    app.szgaplugin.startMedia=function(values, successCallback, failCallback){
        Cordova.exec(successCallback, failCallback, "SzgaPlugin", "startMedia", [values]);
    }
    //暂停播放音频文件
    app.szgaplugin.pauseMedia=function(values, successCallback, failCallback){
        Cordova.exec(successCallback, failCallback, "SzgaPlugin", "stopMedia", [values]);
    }
    //继续播放音频文件
    app.szgaplugin.resumeMedia=function(values, successCallback, failCallback){
        Cordova.exec(successCallback, failCallback, "SzgaPlugin", "resumeMedia", [values]);
    }
    //复制文本到剪贴板
    app.szgaplugin.copyClipboard=function(values, successCallback, failCallback){
        Cordova.exec(successCallback, failCallback, "SzgaPlugin", "copyClipboard", [values]);
    }

})(window);