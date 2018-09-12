/*
 * version:2.1
 * author:pa_dev
 * date:2018-1-24
 * */

var APP_NAME = "";
var APP_VERSION = "";

//每个应用的默认字体
var SERVER_CHARSET = "UTF-8";

//全局变量,端口是否转发,每个应用可以单独配置该变量
var isProxy = true;

//设定应用所有get和post请求，采用底层get和post（非品高）
var isUsingNativeGetAndPost = false;

var XH_DEBUG_STATUS = false;//是不是测试版，默认为正式版

//是否连接星火转发
var isUsingXhServer = true;

var XH_URL = "http://172.28.0.56:9999/service/forward";
var XH_URL3 = "http://172.28.0.56:9999/service/requestForward";//新的接口
//var XH_URL = "http://172.28.0.189:9999/service/forward";

/**
 * Created by jack on 2014/12/26.
 * Modify by wangxi，移动到全局
 */
//统一处理请求url
//var door_url = "http://172.28.0.56:9008/supp/httpClient";
var door_url = "http://172.28.0.56:9000/supp/httpClient";



(function(window) {
    /*========================xinghuo=======================================*/
    //

    //因为要获取登陆人的信息，所以要把linkplugins.js中的函数引进来
    window.app.link = window.app.link || {};

    app.link.getLoginInfo = function (callback) {
        var successCallback = function (result) {
            callback(app.utils.toJSON(result));
        };
        Cordova.exec(successCallback, null, "LinkPlugin", "getLoginInfo", []);
    }
    //添加获取设备号方法  2014-12-19 yintaiyuan
    app.getDeviceId = function(callback){
        Cordova.exec(callback, null,"ExtendApp","getDeviceId",[]);
    }

    //添加获取meid的方法  2014-12-24 yintaiyuan
    app.getMeid = function(callback){
        Cordova.exec(callback,null,"ExtendApp","getMeid",[]);
    }

    //添加获取imsi的方法 2014-12-24 yintaiyuan
    app.getImsi = function(callback){
        Cordova.exec(callback,null,"ExtendApp","getImsi",[]);
    }

    //
    app.getUrl = function(orgin_url) {
        if (isProxy == true) {
            return door_url;
        }
        else {
            return orgin_url;
        }
    }




    window.xh = window.xh || {};

    //文件下载，带上手机硬件参数
    xh.downloadFile3 = function(filePath, url, success, fail) {
        var fileTransfer=new FileTransfer();

        if (typeof (userLoginId) == "undefined" || typeof (deviceId) == "undefined" ||
            typeof (meid) == "undefined" || typeof (imsi) == "undefined" ||
            typeof (app_device) == "undefined") {
            getInfos();
        }

        url += "&APP_DEVICE=" + JSON.stringify(app_device);
        url += "&APP_NAME=" + APP_NAME;
        url += "&APP_VERSION=" + APP_VERSION;
        url += "&SERVER_CHARSET=" + SERVER_CHARSET;

        var uri=encodeURI(url);

        var successCallback = function(result) {
            success(result);
        };
        var failCallback = function(result) {
            //检测错误返回，进行统一提示。
            checkFailCallback(result);
            fail(result);
        };

        fileTransfer.download(
            uri,
            filePath,
            successCallback,
            failCallback
        );
    }

    //文件下载，带上手机硬件参数  lxt修改新的接口，全部转向新的接口，只经过一次转发，不再使用door_url
    xh.downloadFile = function(filePath, url, success, fail) {
        var fileTransfer=new FileTransfer();

        if (typeof (userLoginId) == "undefined" || typeof (deviceId) == "undefined" ||
            typeof (meid) == "undefined" || typeof (imsi) == "undefined" ||
            typeof (app_device) == "undefined") {
            getInfos();
        }

        url += "&APP_DEVICE=" + JSON.stringify(app_device);
        url += "&APP_NAME=" + APP_NAME;
        url += "&APP_VERSION=" + APP_VERSION;
        url += "&SERVER_CHARSET=" + SERVER_CHARSET;

        //var uri=encodeURI(url);
        var temp = url.replace('?', '&');
        var newUri = getAppUrl(temp);
        var ret = XH_URL3 + newUri;
        var uri=encodeURI(ret);

        var successCallback = function(result) {
            //alert(JSON.stringify(result));
            success(result);
        };
        var failCallback = function(result) {
            //alert(JSON.stringify(result));
            //检测错误返回，进行统一提示。
            checkFailCallback(result);
            fail(result);
        };

        fileTransfer.download(
            uri,
            filePath,
            successCallback,
            failCallback
        );
    }

    function translateUrl(url) {

        var temp = url.replace('?', '&');
        var ret = XH_URL + "?forwardUrl=" + temp;
        return ret;
    }

    //文件上传，带上手机硬件参数
    xh.uploadFile3 = function(filePath, url, success, fail, options) {
        var fileTransfer=new FileTransfer();

        if (typeof (userLoginId) == "undefined" || typeof (deviceId) == "undefined" ||
            typeof (meid) == "undefined" || typeof (imsi) == "undefined" ||
            typeof (app_device) == "undefined") {
            getInfos();
        }

        url += "&APP_DEVICE=" + JSON.stringify(app_device);
        url += "&APP_NAME=" + APP_NAME;
        url += "&APP_VERSION=" + APP_VERSION;
        url += "&SERVER_CHARSET=" + SERVER_CHARSET;

//        var uri=encodeURI(url);

        var uri;
        if (isUsingXhServer) {
            //jmt地址转换ga地址
//            var header = url.substring(0, jmt_url.length);
//            if (header == jmt_url) {
//                var tmp = url.substring(jmt_url.length);
//                url = ga_url + tmp;
//            }

            var temp = translateUrl(url);
            uri=encodeURI(temp);
//           app.alert("uri : " + uri);
        } else {
            uri=encodeURI(url);
        }

        var successCallback = function(result) {
            //app.alert(JSON.stringify(result));

            if (isUsingXhServer) {
                var ret = eval( "(" + result.response + ")");
                var flag = ret.success;
                var msg = ret.msg;
                var obj = ret.obj;
                if (typeof (flag) == 'undefined') {
                    //没有错误检查机制
                    success({"response":ret});
                    return;
                }

                var msgType = ret.msgType;
                showMsg(flag, msgType, msg);
                //if (!flag) {
                //    app.hint(msg);
                //}
                success({"response":obj});
            } else {
                success(result);
            }

//            success(result);
        };
        var failCallback = function(result) {
            //检测错误返回，进行统一提示。
            checkFailCallback(result);
            fail(result);
        };

        fileTransfer.upload(
            filePath,
            uri,
            successCallback,
            failCallback,
            options
        );
    }

    function  getAppUrl(url){
        if(url.indexOf("APP_URL") >= 0) {
            var temp = url.replace('?', '&');
            var newUrl = "?xhValidUrl1225=" +temp;
            return newUrl;
        }else{
            var temp = url.replace('?', '&');
            return "?APP_URL=" + url;
        }
    }


    //文件上传，带上手机硬件参数  lxt修改新的接口，全部转向新的接口，只经过一次转发，不再使用door_url
    xh.uploadFile = function(filePath, url, success, fail, options) {
        var fileTransfer=new FileTransfer();

        if (typeof (userLoginId) == "undefined" || typeof (deviceId) == "undefined" ||
            typeof (meid) == "undefined" || typeof (imsi) == "undefined" ||
            typeof (app_device) == "undefined") {
            getInfos();
        }

        url += "&APP_DEVICE=" + JSON.stringify(app_device);
        url += "&APP_NAME=" + APP_NAME;
        url += "&APP_VERSION=" + APP_VERSION;
        url += "&SERVER_CHARSET=" + SERVER_CHARSET;

        var uri;
        var temp = url.replace('?', '&');
        var newUri = getAppUrl(temp);
        var ret = XH_URL3 + newUri;
        //alert(ret);
        uri=encodeURI(ret);

        var successCallback = function(result) {

                var ret = eval( "(" + result.response + ")");
                var flag = ret.success;
                var msg = ret.msg;
                var obj = ret.obj;
                if (typeof (flag) == 'undefined') {
                    //没有错误检查机制
                    success({"response":ret});
                    return;
                }

                var msgType = ret.msgType;
                showMsg(flag, msgType, msg);
                success({"response":obj});

        };
        var failCallback = function(result) {
            //检测错误返回，进行统一提示。
            checkFailCallback(result);
            fail(result);
        };

        fileTransfer.upload(
            filePath,
            uri,
            successCallback,
            failCallback,
            options
        );
    }

    xh.uploadFile2 = function(filePath, url, success, fail, options) {
        var fileTransfer=new FileTransfer();

        if (typeof (userLoginId) == "undefined" || typeof (deviceId) == "undefined" ||
            typeof (meid) == "undefined" || typeof (imsi) == "undefined" ||
            typeof (app_device) == "undefined") {
            getInfos();
        }

        url += "&APP_DEVICE=" + JSON.stringify(app_device);
        url += "&APP_NAME=" + APP_NAME;
        url += "&APP_VERSION=" + APP_VERSION;
        url += "&SERVER_CHARSET=" + SERVER_CHARSET;


        var uri=encodeURI(url);
        var successCallback = function(result) {
                success(result);
        };
        var failCallback = function(result) {
            //检测错误返回，进行统一提示。
            checkFailCallback(result);
            fail(result);
        };

        fileTransfer.upload(
            filePath,
            uri,
            successCallback,
            failCallback,
            options
        );
    }

    //post,get提交时带上手机硬件参数
    var userLoginId;
    var deviceId;
    var meid;
    var imsi;
    var app_device;

    function getInfos() {
//        alert("get infos");
        app.link.getLoginInfo(function(result){
            //data.loginId = result.loginId;
            userLoginId = result.loginId;
        });

        //获取设备号
        app.getDeviceId(function(result){
            //data.deviceId = result;
            deviceId = result;
        });

        //获取meid
        app.getMeid(function(result){
            meid = result;
        });

        //获取imsi
        app.getImsi(function(result){
            imsi = result;
        });

        app_device = {
            "deviceUuid" : device.uuid,
            "deviceVersion" : device.version,
            "deviceName" : device.name,
            "platform" : device.platform,
            "model" : device.model,
            "bingoDeviceId" : deviceId,
            "loginId" : userLoginId,
            "meid" : meid,
            "imsi" : imsi
        };
        // alert(JSON.stringify(app_device));
    }

    var jmt_url = "http://172.28.0.56";
    var ga_url = "http://10.42.0.235";

    var MSG_TYPE_NORMAL = "NORMAL";
    var MSG_TYPE_WARN = "WARN";
    var MSG_TYPE_ERROR = "ERROR";

    //是否显示后台错误提示
    function showMsg(flag, level, msg) {
        if (!flag) {
            if (MSG_TYPE_WARN == level) {
                //alert 提示
                app.alert(msg, null, "警告");
            } else if (MSG_TYPE_ERROR == level) {
                app.hint("错误提示：" + msg);
            } else if (MSG_TYPE_NORMAL == level) {
                //不提示
            } else {
                //unknown type
                app.hint("未知错误：" + msg);
            }
        }
    }

    //2014-12-18 yintaiyuan为了解决timeout失效的问题，暂时改为调用$.ajax，设置超时为30秒
    //发送POST请求
    xh.post3 = function(url, data, success, fail, isCloud) {
        //当前登陆的LoginId(必须先引用linkplugins.js中的函数，如上app.link部分)

        if (typeof (userLoginId) == "undefined" || typeof (deviceId) == "undefined" ||
            typeof (meid) == "undefined" || typeof (imsi) == "undefined" ||
            typeof (app_device) == "undefined") {
            getInfos();
        }

        data.APP_DEVICE = JSON.stringify(app_device);
        data.APP_NAME = APP_NAME;
        data.APP_VERSION = APP_VERSION;
        data.SERVER_CHARSET = SERVER_CHARSET;

//        alert("xh:" + JSON.stringify(data)); //wangxi

        var timeout = data.timeout;
        if (typeof (timeout) == "undefined" || timeout == "") {
            timeout = 30000;
        }

        if (isUsingXhServer) {
//            var header = url.substring(0, jmt_url.length);
//            if (header == jmt_url) {
//                var tmp = url.substring(jmt_url.length);
//                url = ga_url + tmp;
//            }

            data.forwardUrl = url;
            url = XH_URL;
        }

        if ( (typeof (isCloud) != "undefined" && isCloud == false) || isUsingNativeGetAndPost == true ) {
            var successCallback = function(result) {
                if (isUsingXhServer) {
                    var ret = eval( "(" + result + ")");
                    var flag = ret.success;
                    var msg = ret.msg;
                    var obj = ret.obj;

                    if (typeof (flag) == 'undefined') {
                        //没有错误检查机制
                        success({"returnValue":ret});
                        return;
                    }

                    var msgType = ret.msgType;
                    showMsg(flag, msgType, msg);
                    //if (!flag) {
                    //    app.hint(msg);
                    //}
                    success({"returnValue":obj});
                } else {
                    success({"returnValue": result});
                }

            };
            var failCallback = function(result) {
                checkFailCallback(result);
                fail({"returnValue":result});
            };
            $.ajax({
                url : url,
                data : data,
                async : app.utils.toJSON(data).async, // || true,
                timeout : timeout,
                type : "POST",
                success : successCallback,
                error : failCallback
            });
        }
        else
        {
            var successCallback = function(result) {
                if (isUsingXhServer) {
                    var ret = eval( "(" + result.returnValue + ")");
                    //alert(JSON.stringify(ret));
                    var flag = ret.success;
                    var msg = ret.msg;
                    var obj = ret.obj;

                    if (typeof (flag) == 'undefined') {
                        //没有错误检查机制
//                    app.hint("flag is null.");
                        success({"returnValue":ret});
                        return;
                    }

                    var msgType = ret.msgType;
                    showMsg(flag, msgType, msg);
                    //if (!flag) {
                    //    app.hint(msg);
                    //}
                    success({"returnValue":obj});
                } else {
                    success(result);
                }
            };
            var failCallback = function(result) {
                //检测错误返回，进行统一提示。
                checkFailCallback(result);
                fail(result);
            };

            app.ajax({
                "url" : url,
                "data" : data,
                "timeout" : timeout,
                "method" : "POST",
                // application/json
                "contentType" : "application/x-www-form-urlencoded",
                "success" : successCallback,
                "fail" : failCallback,
                "async" : app.utils.toJSON(data).async
            });
        }
    }

    //2014-12-25 lxt修改新的接口，全部转向新的接口，只经过一次转发，不再使用door_url
    /*
    * post请求参数说明：
    * 1.APP_NAME 应用标识符
    * 2.APP_VERSION 应用版本号
    * 3.APP_URL 服务方接口地址
    * 4.timeout 超时时间
    * 5.APP_DEVICE 设备信息 标识json格式字符串，包含参数:deviceVersion:系统版本号,deviceName:机器名称,
     platform:平台(android/ios),model:机型,loginId:登录账号,meid,imsi
    * 6.SERVER_CHARSET 向服务方接口请求使用的编码 默认UTF-8
    * 7.PostOrGet 向服务方接口请求使用的方式（公安网）默认POST(暂时只支持GET/POST)
    * 8.REQUEST_TYPE 向服务方接口请求使用的方式（移动信息网）默认POST(暂时只支持GET/POST)
    * 9.headerParameter	向服务方接口请求携带的HTTP头	标准json格式字符串
    * 10.bodyEntity	需要直接放入requestBody的数据	常用于application/json的请求，与参数contentType配合使用
    * 11.contentType	向服务方接口请求使用的contentType	默认application/x-www-form-urlencoded
    * */
    //发送POST请求
    xh.post = function(url, data, success, fail, isCloud) {
        //当前登陆的LoginId(必须先引用linkplugins.js中的函数，如上app.link部分)

        if (typeof (userLoginId) == "undefined" || typeof (deviceId) == "undefined" ||
            typeof (meid) == "undefined" || typeof (imsi) == "undefined" ||
            typeof (app_device) == "undefined") {
            getInfos();
        }

        data.APP_DEVICE = JSON.stringify(app_device);
        data.APP_NAME = APP_NAME;
        data.APP_VERSION = APP_VERSION;
        data.SERVER_CHARSET = SERVER_CHARSET;
        var timeout = data.timeout;
        if (typeof (timeout) == "undefined" || timeout == "") {
            timeout = 30000;
        }

        if(data.APP_URL !=undefined && data.APP_URL.length>0){
            //如果有APP_URL，则不作处理
        }else{
            data.APP_URL = url;//将url当作参数
        }
        url = XH_URL3;//所以接口都通过这个来转发

        //alert("xh:" + JSON.stringify(data)); //wangxi

        if ( (typeof (isCloud) != "undefined" && isCloud == false) || isUsingNativeGetAndPost == true ) {
            var successCallback = function(result) {
                    var ret = eval( "(" + result + ")");
                    var flag = ret.success;
                    var msg = ret.msg;
                    var obj = ret.obj;

                    if (typeof (flag) == 'undefined') {
                        //没有错误检查机制
                        success({"returnValue":ret});
                        return;
                    }

                    var msgType = ret.msgType;
                    showMsg(flag, msgType, msg);
                    //if (!flag) {
                    //    app.hint(msg);
                    //}
                    success({"returnValue":obj});

            };
            var failCallback = function(result) {
                checkFailCallback(result);
                fail({"returnValue":result});
            };
            $.ajax({
                url : url,
                data : data,
                async : app.utils.toJSON(data).async, // || true,
                timeout : timeout,
                type : "POST",
                success : successCallback,
                error : failCallback
            });
        }
        else
        {
            var successCallback = function(result) {
                    var ret = eval( "(" + result.returnValue + ")");
                    //alert(JSON.stringify(ret));
                    var flag = ret.success;
                    var msg = ret.msg;
                    var obj = ret.obj;

                    if (typeof (flag) == 'undefined') {
                        //没有错误检查机制
//                    app.hint("flag is null.");
                        success({"returnValue":ret});
                        return;
                    }

                    var msgType = ret.msgType;
                    showMsg(flag, msgType, msg);
                    //if (!flag) {
                    //    app.hint(msg);
                    //}
                    success({"returnValue":obj});
            };
            var failCallback = function(result) {
                //检测错误返回，进行统一提示。
                checkFailCallback(result);
                fail(result);
            };

            app.ajax({
                "url" : url,
                "data" : data,
                "timeout" : timeout,
                "method" : "POST",
                // application/json
                "contentType" : "application/x-www-form-urlencoded",
                "success" : successCallback,
                "fail" : failCallback,
                "async" : app.utils.toJSON(data).async
            });
        }
    }

    /*
    * 错误反馈，统一对用户进行提示
    * */
    function checkFailCallback(result) {
//      alert(JSON.stringify(result));
        var errorCode = result.code;
        if (errorCode == 404){
            app.hint("你所访问的接口不存在！");
        } else if (errorCode == 0) {
            ret = "" + result.returnValue;
            if (ret.indexOf("SocketTimeoutException") >= 0) {
                app.hint("网络连接超时！");
            } else if (ret.indexOf("ConnectException") >= 0) {
                app.hint("网络连接失败！");
            } else {
                //其他连接失败错误
                app.hint("其他网络错误！");
            }
        } else {
            var ret = eval( "(" + result.returnValue + ")" );
            if (ret.success == false) {
                app.hint(ret.msg);
            } else {
                //未知错误
                app.hint("其他连接错误！");
            }
        }
    }

    //2014-12-18 yintaiyuan为了解决timeout失效的问题，暂时改为调用$.ajax，设置超时为30秒
    //发送GET请求
    xh.get3 = function(url, data, success, fail, isCloud) {
        if (typeof (userLoginId) == "undefined" || typeof (deviceId) == "undefined" ||
            typeof (meid) == "undefined" || typeof (imsi) == "undefined" ||
            typeof (app_device) == "undefined") {
            getInfos();
        }

        data.APP_DEVICE = JSON.stringify(app_device);
        data.APP_NAME = APP_NAME;
        data.APP_VERSION = APP_VERSION;
        data.SERVER_CHARSET = SERVER_CHARSET;
        data.PostOrGet = "GET";     //端口转发的时候生效

        var timeout = data.timeout;
        if (typeof (timeout) == "undefined" || timeout == "") {
            timeout = 30000;
        }

        if (isUsingXhServer) {
//            var header = url.substring(0, jmt_url.length);
//            if (header == jmt_url) {
//                var tmp = url.substring(jmt_url.length);
//                url = ga_url + tmp;
//            }

            //get请求，必须要用door_url转发，但是不能直接调用door_url，需要用9999接口转到door_url，外加PostOrGet参数
            //这个时候APP_URL一定要写，并且写对。
            //王曦，2013-11-16
            data.forwardUrl = door_url;//url;
            url = XH_URL;
        }
        //alert("url :" + url + ",params :" + JSON.stringify(data));

        if ( (typeof (isCloud) != "undefined" && isCloud == false) || isUsingNativeGetAndPost == true ) {
            var successCallback = function(result) {
                var ret = eval( "(" + result + ")");
                var flag = ret.success;
                var msg = ret.msg;
                var obj = ret.obj;
                if (typeof (flag) == 'undefined') {
                    //没有错误检查机制
                    success({"returnValue":ret});
                    return;
                }

                var msgType = ret.msgType;
                showMsg(flag, msgType, msg);
                success({"returnValue":obj});

//                success({"returnValue":result});
            };
            var failCallback = function(result) {
                fail({"returnValue":result});
            };
            $.ajax({
                url : url,
                data : data,
                async : app.utils.toJSON(data).async || true,
                timeout : timeout,
                type : "GET",
                method : "GET",
                success : successCallback,
                error : failCallback
            });
        }
        else
        {
            var successCallback = function(result) {
                var ret = eval( "(" + result.returnValue + ")");
                //alert(JSON.stringify(ret));
                var flag = ret.success;
                var msg = ret.msg;
                var obj = ret.obj;
//                app.hint(flag);
                if (typeof (flag) == 'undefined') {
                    //没有错误检查机制
//                    app.hint("flag is null.");
                    success({"returnValue":ret});
                    return;
                }

                var msgType = ret.msgType;
                showMsg(flag, msgType, msg);
                //if (!flag) {
                //    app.hint(msg);
                //}
                success({"returnValue":obj});

//                success(result);
            };
            var failCallback = function(result) {
                //检测错误返回，进行统一提示。
                checkFailCallback(result);
                fail(result);
            };

            app.ajax({
                "url" : url,
                "data" : data,
                "method" : "GET",
                "type" : "GET",
                "success" : successCallback,
                "fail" : failCallback,
                "async" : app.utils.toJSON(data).async,
                "timeout" : timeout
            });
        }
    }
    //2014-12-25 lxt修改新的接口，全部转向新的接口，只经过一次转发，不再使用door_url
    /**
     * 参数说明：
     *  * 1.PostOrGet 向服务方接口请求使用的方式（公安网）默认POST(暂时只支持GET/POST)
     * 2.REQUEST_TYPE 向服务方接口请求使用的方式（移动信息网）默认POST(暂时只支持GET/POST)
     */
    //发送GET请求
    xh.get = function(url, data, success, fail, isCloud) {
        data.PostOrGet = "GET";
        xh.post(url,data,success, fail, isCloud);
    }





    //一般不要使用，使用之后会没有日志记录。
    xh.get2 = function(url, data, success, fail, isCloud) {
        if (typeof (userLoginId) == "undefined" || typeof (deviceId) == "undefined" ||
            typeof (meid) == "undefined" || typeof (imsi) == "undefined" ||
            typeof (app_device) == "undefined") {
            getInfos();
        }


        data.APP_DEVICE = JSON.stringify(app_device);
        data.APP_NAME = APP_NAME;
        data.APP_VERSION = APP_VERSION;
        data.SERVER_CHARSET = SERVER_CHARSET;
        data.PostOrGet = "GET";     //端口转发的时候生效

        var timeout = data.timeout;
        if (typeof (timeout) == "undefined" || timeout == "") {
            timeout = 30000;
        }

        //alert("url :" + url + ",params :" + JSON.stringify(data));

        if ( (typeof (isCloud) != "undefined" && isCloud == false) || isUsingNativeGetAndPost == true ) {
            var successCallback = function(result) {

                success({"returnValue":result});
            };
            var failCallback = function(result) {
                fail({"returnValue":result});
            };
            $.ajax({
                url : url,
                data : data,
                async : app.utils.toJSON(data).async || true,
                timeout : timeout,
                type : "GET",
                method : "GET",
                success : successCallback,
                error : failCallback
            });
        }
        else
        {
            var successCallback = function(result) {

                success(result);
            };
            var failCallback = function(result) {
                //检测错误返回，进行统一提示。
                checkFailCallback(result);
                fail(result);
            };

            app.ajax({
                "url" : url,
                "data" : data,
                "method" : "GET",
                "type" : "GET",
                "success" : successCallback,
                "fail" : failCallback,
                "async" : app.utils.toJSON(data).async,
                "timeout" : timeout
            });
        }
    }

    //日期格式化
    //示例：var endDate = new Date().format('yyyy-M-d');
    Date.prototype.format = function(format) {
        var date = {
            "M+" : this.getMonth() + 1,
            "d+" : this.getDate(),
            "h+" : this.getHours(),
            "m+" : this.getMinutes(),
            "s+" : this.getSeconds(),
            "q+" : Math.floor((this.getMonth() + 3) / 3),
            "S+" : this.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + '')
                .substr(4 - RegExp.$1.length));
        }
        for ( var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1,
                        RegExp.$1.length == 1 ? date[k] : ("00" + date[k])
                        .substr(("" + date[k]).length));
            }
        }
        return format;
    };

    //获取随机数
    xh.getRandomNum = function(Min,Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        return(Min + Math.round(Rand * Range));
    }

    //获取用户信息，加入了调试模式，可以干预loginId和userName的值
    xh.getLoginInfo = function(callback) {
        var isDebug = localStorage.getItem("xh_debug");
        if (typeof (isDebug) != 'undefined' && isDebug == 'yes') {

            var loginId = localStorage.getItem("xh_user_id");
            var userName = localStorage.getItem("xh_user_name");
            var deptName = localStorage.getItem("xh_dept_name");
            var userId = localStorage.getItem("xh_uuid");
            var ret = {
                loginId : loginId,
                userName : userName,
                orgName : deptName,
                userId:userId
            };
            var successCallback = function (result) {
                callback(ret);
            };
            app.link.getLoginInfo(successCallback);
        } else {
            app.link.getLoginInfo(callback);
        }
    }


    /**
     该接口用于调用二维码扫描
     @method app.barcode.scan
     @static
     @param success 成功回调方法
     @param fail 失败回调方法
     @example
     app.barcode.scan(function(result) {
				app.alert(result)
			}, function(result) {
				app.alert(result)
			});
     */
    xh.scan=function(success,fail){
        Cordova.exec(success, fail, "BarcodeScanner", "scan", []);
    }

    /**
         该接口用于规范化日期选择控件的输出格式，将选择之后的日期格式规范为YYYY-MM-DD
         @param id: 控件标签在document结构中的element id
                callback: function(dateText) {
                    // TO DO
                    // 选择之后的回调函数，参数为选择的日期字符串YYYY-MM-DD
                }
         @example
        html:
            <div data-role="BTSelect" id="myDate"><span>请选择</span></div>
        js:
            $("#myDate").tap(function(){
                xh.selectDate("myDate");
            });
     */
    xh.selectDate = function(id, callback) {
        var def = null;
        var curr = $("#" + id).attr("value");
        if (curr != null) {
            var array = curr.split("-");
            var year = array[0];
            var month = array[1];
            var day = array[2];
            def = {year: year, month: month, day: day};
        }

        app.dateTimePicker.selectDate(function(result) {
            //alert(JSON.stringify(result));
            if (result.month < 10) {
                result.month = "0" + result.month;
            }
            if (result.day < 10) {
                result.day = "0" + result.day;
            }
            var full = result.year + "-" + result.month + "-" + result.day;
            $("#" + id).attr("value", full);
            $("#" + id + " span").html(full);

            if (callback != undefined && callback != null) {
                callback(full);
            }
        }, def, 'yyyy MM dd');
    }

    /*
        该接口仅处理日期选择后的格式化输出，不作界面处理
     */
    xh.selectDate2 = function(date, callback) {
        var def = null;
        if (date != null && date != "") {
            var array = date.split("-");
            var year = array[0];
            var month = array[1];
            var day = array[2];
            def = {year: year, month: month, day: day};
        }

        app.dateTimePicker.selectDate(function(result) {
            if (result.month < 10) {
                result.month = "0" + result.month;
            }
            if (result.day < 10) {
                result.day = "0" + result.day;
            }
            var full = result.year + "-" + result.month + "-" + result.day;

            if (callback != undefined && callback != null) {
                callback(full, result.year, result.month, result.day);
            }
        }, def, 'yyyy MM dd');
    }

    /**
     该接口用于规范化日期选择控件的输出格式，将选择之后的日期格式规范为hh:mm
     @param id 控件标签在document结构中的element id
            callback: function(timeText) {
                    // TO DO
                    // 选择之后的回调函数，参数为选择的日期字符串hh:mm
                }
     @example
     html:
     <div data-role="BTSelect" id="myTime"><span>请选择</span></div>
     js:
     $("#myTime").tap(function(){
            xh.selectTime("myTime");
        });
     */
    xh.selectTime = function(id, callback) {
        var def = null;
        var curr = $("#" + id).attr("value");
        if (curr != null) {
            var array = curr.split(":");
            var hour = array[0];
            var minute = array[1];
            def = {hour: hour, minute: minute};
        }
        app.dateTimePicker.selectTime(function(result) {
            //alert(JSON.stringify(result));
            if (result.hour < 10) {
                result.hour = "0" + result.hour;
            }
            if (result.minute < 10) {
                result.minute = "0" + result.minute;
            }

            var full = result.hour + ":" + result.minute;
            $("#" + id).attr("value", full);
            $("#" + id + " span").html(full);

            if (callback != undefined && callback != null) {
                callback(full);
            }
        }, def, 'hh mm');
    }

    /*
        该接口仅用于处理时间选择后的格式化输出，不作任何界面处理
     */
    xh.selectTime2 = function(time, callback) {
        var def = null;
        if (time != null && time != "") {
            var array = time.split(":");
            var hour = array[0];
            var minute = array[1];
            def = {hour: hour, minute: minute};
        }

        app.dateTimePicker.selectTime(function(result) {
            if (result.hour < 10) {
                result.hour = "0" + result.hour;
            }
            if (result.minute < 10) {
                result.minute = "0" + result.minute;
            }

            var full = result.hour + ":" + result.minute;

            if (callback != undefined && callback != null) {
                callback(full, result.hour, result.minute);
            }
        }, def, 'hh mm');
    }

    /**
     比较两个日期的先后顺序
     @param startDate 日期信息1，格式为YYYY-MM-DD
     @param endDate 日期信息2，格式为YYYY-MM-DD
     @return -1: 日期1早于日期2
                0: 日期1和日期2为同一天
                1: 日期1晚于日期2
     @example
     xh.compareDate("1999-01-02", "1991-01-01") = 1
     */
    xh.compareDate = function(startDate, endDate) {
        if (startDate == endDate) {
            return 0;
        }

        var arr1 = startDate.split("-");
        var arr2 = endDate.split("-");
        if (arr1[0] > arr2[0]) {
            //app.hint(endText + "不能早于" + startText);
            return 1;
        }

        if (arr1[0] < arr2[0]) {
            return -1;
        }

        if (arr1[0] == arr2[0] && arr1[1] > arr2[1]) {
            //app.hint(endText + "不能早于" + startText);
            return 1;
        }

        if (arr1[0] == arr2[0] && arr1[1] < arr2[1]) {
            return -1;
        }

        if (arr1[0] == arr2[0] && arr1[1] == arr2[1] && arr1[2] > arr2[2]) {
            //app.hint(endText + "不能早于" + startText);
            return 1;
        }

        return -1;
    }

    /**
     比较两个时间的先后顺序
     @param startTime 时间信息1，格式为hh:mm
     @param endTime 时间信息2，格式为hh:mm
     @return -1: 时间1早于时间2
     0: 时间1和时间2相等
     1: 时间1晚于时间2
     @example
     xh.compareTime("18:00", "18:01") = -1
     */
    xh.compareTime = function(startTime, endTime) {
        if (startTime == endTime) {
            return 0;
        }

        var arr1 = startTime.split(":");
        var arr2 = endTime.split(":");
        if (arr1[0] > arr2[0]) {
            //app.hint(endText + "不能早于" + startText);
            return 1;
        }

        if (arr1[0] == arr2[0] && arr1[1] >= arr2[1]) {
            //app.hint(endText + "不能早于" + startText);
            return 1;
        }

        return -1;
    }

    //发送POST请求,不转发，一般不要使用
    xh.post2 = function(url, data, success, fail, isCloud) {
        //当前登陆的LoginId(必须先引用linkplugins.js中的函数，如上app.link部分)

        if (typeof (userLoginId) == "undefined" || typeof (deviceId) == "undefined" ||
            typeof (meid) == "undefined" || typeof (imsi) == "undefined" ||
            typeof (app_device) == "undefined") {
            getInfos();
        }

        data.APP_DEVICE = JSON.stringify(app_device);
        data.APP_NAME = APP_NAME;
        data.APP_VERSION = APP_VERSION;
        data.SERVER_CHARSET = SERVER_CHARSET;

//        app.hint("post2");

        var timeout = data.timeout;
        if (typeof (timeout) == "undefined" || timeout == "") {
            timeout = 30000;
        }

        if ( (typeof (isCloud) != "undefined" && isCloud == false) || isUsingNativeGetAndPost == true ) {
            var successCallback = function(result) {
                success({"returnValue": result});
            };
            var failCallback = function(result) {
                fail({"returnValue":result});
            };
            $.ajax({
                url : url,
                data : data,
                async : app.utils.toJSON(data).async, // || true,
                timeout : timeout,
                type : "POST",
                success : successCallback,
                error : failCallback
            });
        }
        else
        {
            var successCallback = function(result) {
                success(result);
            };
            var failCallback = function(result) {
                //检测错误返回，进行统一提示。
                checkFailCallback(result);
                fail(result);
            };

            app.ajax({
                "url" : url,
                "data" : data,
                "timeout" : timeout,
                "method" : "POST",
                // application/json
                "contentType" : "application/x-www-form-urlencoded",
                "success" : successCallback,
                "fail" : failCallback,
                "async" : app.utils.toJSON(data).async
            });
        }
    }

    //调试的信息用xh.alert代替，isXhDebug = false则所有显示信息不显示。
    var isXhDebug = false;
    xh.alert = function (message, callback, title, buttonName) {

        if (!isXhDebug) {
            //调试模式关闭，不显示alert
            return;
        }
        app.alert(message, callback, title, buttonName);
    }

    //专网http://172.28.0.56:9123/sso/user/slogin
    xh.getToken = function(loginId,callback){
        //callback(loginId);
        var params = {"userCode":loginId};
        xh.post("http://172.19.255.175/sso/user/slogin",params,function(res){
            callback(res);
        });
    }

    /* -------------------------------------东莞项目----------------------------------------*/

    /*
     添加人：吴日文
     修改时间：2018-1-02
     注释：东莞项目专网转发地址
     */
    var door_url_dg = "http://192.168.2.56:18080/supp/httpClient";

    /*
     添加人：吴日文
     修改时间：2018-1-02
     注释：文件上传，带上手机硬件参数,东莞项目文件上传方法
     */
    xh.uploadFile_dg = function(filePath, url, success, fail, options, onprogress) {
        var fileTransfer=new FileTransfer();
        if (typeof (userLoginId) == "undefined" || typeof (deviceId) == "undefined" ||
            typeof (meid) == "undefined" || typeof (imsi) == "undefined" ||
            typeof (app_device) == "undefined") {
            getInfos();
        }

        url += "&APP_DEVICE=" + JSON.stringify(app_device);
        url += "&APP_NAME=" + APP_NAME;
        url += "&APP_VERSION=" + APP_VERSION;
        url += "&SERVER_CHARSET=" + SERVER_CHARSET;

//        var uri=encodeURI(url);

        var uri;
        uri=encodeURI(url); //地址转码
        // alert(filePath);
        // alert(uri);
        var successCallback = function(result) {
            // app.alert(JSON.stringify(result));
          console.log(result, 'successCallback')
            if (isUsingXhServer) {
                var ret = eval( "(" + result.response + ")");
                console.log(ret, 'ret')
                var flag = ret.success;
                var msg = ret.msg;
                var obj = ret.obj;
                if (typeof (flag) == 'undefined') {
                    //没有错误检查机制
                    success({"response":ret});
                    return;
                }

                if (!flag) {
                    app.hint(msg);
                }
                success({"response":obj});
            } else {
                console.log(1111111111111111111111)
                success(result);
            }

//            success(result);
        };
        var failCallback = function(result) {
          console.log(result, '上传文件错误')
          fail(result);
            //alert(JSON.stringify(result));
            //检测错误返回，进行统一提示。
            checkFailCallback(result);
            // fail(result);
        };
        fileTransfer.upload(
            filePath,
            uri,
            successCallback,
            failCallback,
            options
        );
        // fileTransfer.onprogress = function (e) {
      //   onprogress(e)
      //   console.info(e)
      //   if (e.lengthComputable) {
      //     console.log(`当前进度${e.loaded / e.total}`)
      //   }
      // }
    }

    /*
     添加人：吴日文
     修改时间：2018-1-02
     注释：文件下载，带上手机硬件参数,东莞项目文件下载方法
     */
    xh.downloadFile_dg = function(filePath, url, success, fail) {
        var fileTransfer=new FileTransfer();

        if (typeof (userLoginId) == "undefined" || typeof (deviceId) == "undefined" ||
            typeof (meid) == "undefined" || typeof (imsi) == "undefined" ||
            typeof (app_device) == "undefined") {
            getInfos();
        }

        url += "&APP_DEVICE=" + JSON.stringify(app_device);
        url += "&APP_NAME=" + APP_NAME;
        url += "&APP_VERSION=" + APP_VERSION;
        url += "&SERVER_CHARSET=" + SERVER_CHARSET;

        var uri=encodeURI(url);

        var successCallback = function(result) {
            success(result);
        };
        var failCallback = function(result) {
            //检测错误返回，进行统一提示。
            checkFailCallback(result);
            fail(result);
        };

        fileTransfer.download(
            uri,
            filePath,
            successCallback,
            failCallback
        );
    }

    /*
     添加人：吴日文
     修改时间：2018-1-02
     注释：东莞项目专网是否转发方法
     */
    app.getUrl_dg = function(orgin_url) {
        if (isProxy == true) {
            return door_url_dg;
        } else {
            return orgin_url;
        }
    }

    //发送POST请求,不转发
    xh.post_dg = function(url, data, success, fail, isCloud) {
        //当前登陆的LoginId(必须先引用linkplugins.js中的函数，如上app.link部分)

        if (typeof (userLoginId) == "undefined" || typeof (deviceId) == "undefined" ||
            typeof (meid) == "undefined" || typeof (imsi) == "undefined" ||
            typeof (app_device) == "undefined") {
            getInfos();
        }

        data.APP_DEVICE = JSON.stringify(app_device);
        data.APP_NAME = APP_NAME;
        data.APP_VERSION = APP_VERSION;
        data.SERVER_CHARSET = SERVER_CHARSET;

//        app.hint("post2");

        var timeout = data.timeout;
        if (typeof (timeout) == "undefined" || timeout == "") {
            timeout = 30000;
        }

        if ( (typeof (isCloud) != "undefined" && isCloud == false) || isUsingNativeGetAndPost == true ) {
            var successCallback = function(result) {
                success({"returnValue": result});
            };
            var failCallback = function(result) {
                fail({"returnValue":result});
            };
            $.ajax({
                url : url,
                data : data,
                async : app.utils.toJSON(data).async, // || true,
                timeout : timeout,
                type : "POST",
                success : successCallback,
                error : failCallback
            });
        }
        else
        {
            var successCallback = function(result) {
                success(result);
            };
            var failCallback = function(result) {
                //检测错误返回，进行统一提示。
                checkFailCallback(result);
                fail(result);
            };

            app.ajax({
                "url" : url,
                "data" : data,
                "timeout" : timeout,
                "method" : "POST",
                // application/json
                "contentType" : "application/x-www-form-urlencoded",
                "success" : successCallback,
                "fail" : failCallback,
                "async" : app.utils.toJSON(data).async
            });
        }
    }
    // 获取请求默认参数
    xh.default_params = function () {
      var data = {}
      if (typeof (userLoginId) == "undefined" || typeof (deviceId) == "undefined" ||
        typeof (meid) == "undefined" || typeof (imsi) == "undefined" ||
        typeof (app_device) == "undefined") {
        getInfos();
      }

      data.APP_DEVICE = JSON.stringify(app_device);
      data.APP_NAME = APP_NAME;
      data.APP_VERSION = APP_VERSION;
      data.SERVER_CHARSET = SERVER_CHARSET;
      return data
    }
    /*
    * 切换正式版和测试版
    * status status为false为正式版，status为true为测试版
    * */
    xh.changeStatus = function(status){
        if(true == status || false==status){
            localStorage.setItem("XH_DEBUG_STATUS", status);
            XH_DEBUG_STATUS =  localStorage.getItem("XH_DEBUG_STATUS");
            if(XH_DEBUG_STATUS=="true"){
                return true;
            }else{
                return false;
            }
          ;
        }
    }
    /*
    * 获取真实的url地址
    * */
    xh.getRealUrl = function(index){
        XH_DEBUG_STATUS =  localStorage.getItem("XH_DEBUG_STATUS");
        if(XH_DEBUG_STATUS=="true"){
            return url_test[index];
        }else{
            return url_formal[index];
        }
    }
    /*
    *判断是否为测试版 true为测试版
    * */
    xh.isDebugStatus = function(){
        XH_DEBUG_STATUS =  localStorage.getItem("XH_DEBUG_STATUS");
        if(XH_DEBUG_STATUS=="true"){
            return true;
        }else{
            return false;
        }
    }

    /* -------------------------------------工具方法----------------------------------------*/
    /*
     *校验手机号码
     * */
    xh.checkPhoneNum =  function(phoneNo) {
        if (phoneNo.length != 11) {
            app.hint("手机号码不足11位！");
            return false;
        }

        var myreg = /^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/;
        if(!myreg.test(phoneNo))
        {
            app.hint('无效的手机号码！');
            return false;
        }

        return true;
    }
    /*
     *校验身份证号码
     * */
    xh.checkIdcard = function(idNo){
        if (typeof (idNo) == 'undefined' || idNo == "") {
            app.hint("请先查询被查人员身份证号码!");
            return false;
        }
        if (idNo.length != 15 && idNo.length != 18) {
            app.hint("身份证号应为15或18位数字，请正确输入后再进行查询");
            return false;
        }
        //var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",
        //    32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",
        //    45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",
        //    64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"}
        var reg = /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/;
        if (reg.test(idNo) == false) {
            app.hint("您输入的身份证格式有误，请核查后再输入");
            return false;
        }
        return true;
    }


})(window);
