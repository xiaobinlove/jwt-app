/*
 * UI control
 * version : 3.3
 * author : lufeng
 * date : 2015-6-3
 */
var ui = {
    //参数设置
    settings : {
        //single  单页面工程  muti  多页面工程
        appType : 'single',      
        //page没有设置data-transition时默认动画效果
        transitionType : 'slide',
        //是否显示页面加载中(页面加载时，页面回退或其他页面的加载都会失效，直到此页面失败或成功)
        showPageLoading : true ,
        //加载中文字
        showPageLoadingText : "加载中...",
        //加载中图标（为样式）
        showPageLoadingIcon : "icon-spinner5",
        //初始化操作
        init : function(){}
    },
    //是否有打开的侧边菜单
    hasSidebarOpen : false,
    //是否有打开的弹出框
    hasPopupOpen : false,
    //是否页面正在切换
    isPageSwitching : false,
    /*
     * 启动程序
     */
    launch : function(){
        $.noop = function(){}; //增加一个空函数

        //设置viewport
        ui.Utils.setViewPort();
    

        //如果主页就有侧边栏, DOM元素不被删除
        //$("aside").addClass("noRemove");

        ui.init(); //uiwidget

        //单页初始化的东西
        if(ui.settings.appType == 'single'){    
            ui.Page.init(); //主页添加到page缓存
        }

        ui.settings.init(); 
        
        document.addEventListener('doubleTap', function (e) { e.preventDefault(); }, false);

        
		/*$(window).on("ortchange",function(){
			//设置viewport
			ui.Utils.setViewPort();
		});*/
		
        //这句加上后将导致无iscroll的页面拖动不了
        //document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        
        
    },
    //用户启动程序
    run : function (options){
        $.extend(this.settings, options);

        $.each(ui.pages,function(k,v){
            var sectionId = '#'+k;
            $('body').delegate(sectionId,'pageReady',function(e, options){
                v.pageReady && v.pageReady.call(v, e, options);
            });
            $('body').delegate(sectionId,'pageLoad',function(e, options){
                v.pageLoad && v.pageLoad.call(v, e, options);
            });
            $('body').delegate(sectionId,'pageBack',function(e, options){
                v.pageBack && v.pageBack.call(v, e, options);
            });
        });

        this.launch();
    },
    pages : {}, 
    //添加页面的事件处理
    addPageEvent : function(id,factory){
        ui.pages[id] = new factory();
    }
}

/*
 * javascript垃圾回收
 * */
;var GC = (function(){

    //引用地址
    var refs = {},EVENTS = [];

    var purge = function(d) {
        var a = d.attributes, i, l, n;
        if (a) {
            for (i = a.length - 1; i >= 0; i -= 1) {
                n = a[i].name;
                if (typeof d[n] === 'function') {
                    d[n] = null;
                }
            }
        }
        a = d.childNodes;
        if (a) {
            l = a.length;
            for (i = 0; i < l; i += 1) {
                purge(d.childNodes[i]);
            }
        }
    }
     
     function walkTheDOM(node, func) {
        func(node); 
        node = node.firstChild; 
        while (node) { 
            walkTheDOM(node, func); 
            node = node.nextSibling; 
        } 
    } 
    /**
     * 清除dom节点的所有引用，防止内存泄露
     *
     * @param Elem node  所要清除的元素节点
     * 
     */
    function purgeEventHandlers(node) {
        walkTheDOM(node, function (e) {
            for (var n in e) {    

                if (typeof e[n] === 'function') {
                    e[n] = null;
                }
            }
        });
    }

    /*
     * gcArrays 回收的对象
     * modules 回收所属模块
     */
    var push = function (gcArrays, modules , target) {

        var id = $(target).attr("id") || "body";
        if(!refs[id]) refs[id] = {};
        refs[id][modules] = gcArrays.concat(refs[id][modules] || []);
    }

    var get = function (id , modules) {
        if(refs[id]){
            return  refs[id][modules];
        } else{
            return [];
        }
         
    }


    var destroy = function (sectionId) {
        if(refs[sectionId]){
            for(var module in refs[sectionId]){
                for (var i = module.length - 1; i >= 0; i -= 1) {
                    var obj = module[i];
                    obj.destroyMe && obj.destroyMe();
                    obj = null;
                }
            }
            //purgeEventHandlers($(refs[sectionId])[0]);
            $("#" + sectionId).unbind("tap");
            refs[sectionId] = null;
        }
    };

    return {
        purge : purge,
        push : push,
        get : get,
        destroy : destroy,
        refs:refs
    }

})();



 



;
(function(window) {
    /**
	 插件类，提供数据请求、界面加载、数据持久化、日期控件等接口，提供全局属性。
     @class app
    */
	window.app = window.app || {};

    /**
	 页面事件
     @class app.page
    */
	window.app.page= window.app.page|| {}; 
	/*========================page=======================================*/
    /**
	 页面dom结构完成后的事件，类似window.onload
	  @method app.page.onReady
	  @static
	  @example
		app.page.onReady=function(){
			app.alert("页面dom结构加载完成");
		}
    */	
	app.page.onReady=function(){}
	/**
	 页面加载完成后执行的事件，类似$(function(){...})
	  @method app.page.onLoad
	  @static
	  @example
		app.page.onLoad=function(){
			app.alert("页面加载完成");
		}
    */
	app.page.onLoad=function(){}
	/**
	页面遇到脚本错误时候的事件,全局监控的事件,实际上对window.onerror()的封装
	@method app.page.onError
	@static
	@example
		
	*/
	app.page.onError=function(msg,url,line){
		//这个会全局捕获js报出的错误，生产环境可以禁用掉
		//alert("url:"+url+" msg:"+msg+" line:"+line);
	}
	
	/* ===========================utils=================================== */
	/**
	  工具类
	  @class  app.utils
	*/
	window.app.utils = window.utils || {};
	/**
	  将json字符串转成json对象
	  @method app.utils.toJSON
	  @static
	  @param param {String} JSON字符串
	 */
	app.utils.toJSON = function(param) {
		return typeof (param) == "string"? eval('(' + param + ')') : param;
	}
	/**
	  判断是否在PC上
	  @method app.utils.isPC
	  @static
	  @return {boolean} 返回结果 ⇒ true | false
	 */
	app.utils.isPC=function(){
		var userAgentInfo = navigator.userAgent;
        var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
        }
        return flag;
	}
	
	/* =============================HttpRequest=============================== */
	/**
     @class app
    */
	/**
	  Ajax请求数据
	  @method app.ajax
	  @static
	  @param params {JSON对象} 请求参数（参数详情如下）<br/>
				url：网络请求的目标地址<br/>
				data：请求的参数，参数是一个JSON对象<br/>
				method：请求的方法，post或者get，默认是get<br/>
				async：true为异步，false为同步<br/>
				contentType：将数据发到服务器时浏览器使用的编码类型，默认值是"application/x-www-form-urlencoded"<br/>
				headers: http请求头，参数是JSON对象<br/>
				timeout: 超时时间，单位毫秒，默认是10000毫秒<br/>
				success：请求成功时的回调函数<br/>
				fail：请求失败时的回调函数<br/>
	  @example
		app.ajax({
			"url":"http://10.201.76.142:8500/dataservice.ashx", 
			"data":{type:'news'},
			"async" : true,
			"timeout" :5000,
			"success" : function(res){
				var data = res.returnValue;
				app.alert(data);
			}
		}) ;
		//return
		{ name:'yulsh' , sex:'男', age: '25' }
	*/
	app.ajax = function(params) {
		params = params || {};
		params.data = app.utils.toJSON(params.data);
		params.method = params.method || "GET";
		if (typeof (params.async) == "undefined") {
			params.async = true;
		}
		params.contentType = params.contentType || "";
		params.headers = params.headers || {};
		params.timeout = params.timeout || 10000;
		var successCallback = function(result) {
			params.success(app.utils.toJSON(result));
		};
		var failCallback = function(result) {
			params.fail(app.utils.toJSON(result));
		}

		Cordova.exec(successCallback, failCallback, "HttpRequest", "ajax", [
				params.url, params.data, params.method, params.async,
				params.contentType, params.headers, params.timeout ]);
	}
	/**
	Ajax请求数据，请求wsdl(webservice)
	@method app.ajaxWSDL
	@static
	@param params {JSON对象} 请求参数（参数详情参考示例）<br/>
			method:调用的方法名<br/>
			data:方法参数,json对象<br/>
			namespace:wsdl的命名空间<br/>
			endpoint:wsdl的请求地址<br/>
			timeout:请求超时时间,默认是10000 毫秒<br/>
			success:成功回调，返回数据(字符串)<br/>
			fail:失败回调，返回错误信息(字符串)<br/>
	@example 
		var params={
                   	method:"getStoreInfo",   //调用的方法
			data:{"storeId":123},   //方法参数，json对象
			namespace:"http://webservice.gmcc.com/",   //wsdl的命名空间
			endpoint:"http://183.232.148.39:7655/fdaims/webservice/FdaimsWebservices",   //wsdl的地址(去掉?wsdl)
			success:function(res){alert(res);},   //成功回调
			fail:function(error){alert(error);}   //失败回调
			};
			app.ajaxWSDL(params);
		
	*/
	app.ajaxWSDL=function(params){
		params.data=params.data||{};
		params.async=params.async||true;
		params.timeout=params.timeout||10000;
		Cordova.exec(params.success, params.fail, "HttpRequest", "ajaxWSDL", [params.method,params.data,params.namespace,params.endpoint,params.async,params.timeout]);
	}
	
	/**
	  发送POST请求
	  @method app.post
	  @static
	  @param url {String} 请求地址
	  @param data {JSON对象} 请求参数
      @param success {Function} 成功调用函数
      @param fail {Function}  失败调用函数
	  @example
		var url="http://10.201.76.142:8500/dataservice.ashx";
		app.post(url,{type:"date"},function(res){
			$("#result").html("返回值类型:"+typeof(res)+"<br/> 结果:"+ JSON.stringify(res));
		},function(res){
			app.alert(res);
		});		
		//return 
		{"code":"200","returnValue":"2013/9/5 14:14:51"}		
	*/
	app.post = function(url, data, success, fail) {
		app.ajax({
			"url" : url,
			"data" : data,
            "timeout" : data.timeout,
			"method" : "POST",
			"contentType" : "application/x-www-form-urlencoded",
			"success" : success,
			"fail" : fail
		});
	}
	/**
	  发送GET请求
	  @method app.get
	  @static
	  @param url {String} 请求地址
	  @param data {JSON对象} 请求参数
      @param success {Function} 成功调用函数
      @param fail {Function}  失败调用函数
	  @example
		var url="http://10.201.76.142:8500/dataservice.ashx?type=date";
		app.get(url,{},function(res){
			$("#result").html("返回值类型:"+typeof(res)+"<br/> 结果:"+ JSON.stringify(res));
		},function(res){
			app.alert(res);
		});		
		//return 
		{"code":"200","returnValue":"2013/9/5 14:14:51"}		
	*/
	app.get = function(url, data, success, fail) {
		app.ajax({
			"url" : url,
			"data" : data,
            "timeout" : data.timeout,
			"method" : "GET",
			"success" : success,
			"fail" : fail
		});
	}

	/**
	  退出程序（<font color="red">android支持退出app，ios下通常不退出，在iOS尽量不要用此接口,在Link中可以通过此接口回到Link应用</font>）
	  @method app.exit
	  @static
	  @example
		app.exit();
	 */	
	app.exit = function() {
		Cordova.exec(null, null, "ExtendApp", "exit", []);
	}
	
	/**
	  检测是否存在某个app
	  android:传入包名 eg: bingo.touch.debugger
	  ios:urlSchemes eg: bingo-debugger://
	  @method app.isExist
	  @param appId {string} 应用Id
	  @param callback {Function} 回调函数
	  @return {boolean} 返回结果 ⇒ true | false
	  @example
		app.isExist("bingo.touch.debugger",function(res){
			if(res){
				app.alert("存在appId为bingo.touch.debugger的应用!");
			}else{
				app.alert("不存在appId为bingo.touch.debugger应用!")
			}
		});
	*/
	app.isExist = function(appId, callback) {
		if (typeof appId == "undefined") {
			app.alert("appId is necessary!");
			return;
		}
		callback = callback || function(result) {
			app.alert(result);
		};
		Cordova.exec(callback, null, "ExtendApp", "isExistApp", [ appId ]);
	}
	
	/**
	  执行第三方的应用，如果是传入http的远程地址，将会调用系统自带的浏览器打开远程页面
	  android: package name eg: bingo.touch.debugger
	  ios: urlSchemes eg: http://www.baidu.com open safari
	  @method app.run
	  @param appId {string} 应用Id
	  @param data {JSON对象} 启动参数
	  @example
		app.run("bingo.touch.demo",{
			"user" : "yulsh",
			"status" : 1
		});
	*/
	app.run = function(appId, data) {
		if (typeof (data) == "undefined" || data == "") {
			data = {};
		}
		Cordova.exec(null, null, "ExtendApp", "runApp", [ appId, data ]);
	}
	
	// 打开文件:如office文件，会自动识别MIME类型
	// filePath:document path
	// mime: mime type
	/**
	  打开文件:如office文件
	  @method app.openFile
	  @param filePath {String} 文件地址
	  @param mime {String} mime类型 
	  @param success {Function} 打开成功回调
	  @param fail {Function} 打开失败回调
	  @example
		app.openFile(uri,"file:///mnt/sdcard/bingotouch.docx",function(res){
			app.hint("打开成功!");
		});	 	 
	*/	
	app.openFile = function(filePath, mime, success, fail) {
		filePath = filePath || "";
		mime = mime || "";
		success = success || function(result) {};
		fail = fail || function(result) {
			app.hint("没有找到合适的程序打开该文件");
		};
		Cordova.exec(success, fail, "ExtendApp", "openFile",[ filePath, mime ]);
	}
	

	/**
	  获取app安装后的相关目录
	  @method app.getAppDirectoryEntry
	  @param callback {Function} 回调函数
	  @example
		//android和ios的目录结构不同
		//android下可以存储在 /sdcard/download下面
		//ios只能存储在应用里面	   
		app.getAppDirectoryEntry(function(res){
			//区分平台，并将相应的目录保存到全局,方便下面下载的时候使用
			if(window.devicePlatform=="android"){
				window.savePath=res.sdcard;   					
			}else if(window.devicePlatform=="iOS"){
				window.savePath=res.documents;
			}
		});
	*/
	app.getAppDirectoryEntry = function(callback) {
		var success = function(result) {
			callback(app.utils.toJSON(result));
		}
		Cordova.exec(success, null, "ExtendApp", "getAppDirectoryEntry",[]);
	}
	

	
	/**
	  加载一个新的页面
	  @method app.load
	  @static
	  @param params {JSON对象} 请求参数，详情如下<br/>
				url：切换页面的url<br/>
				params：页面传递的参数，一个JSON对象<br/>
				slideType：页面切换的方向<br/>
				progress:(3.0以上版本已弃用该参数)页面间切换时的提示窗口，有三个属性，分别是show、title、message<br/>
						&nbsp;&nbsp;show：为true时，切换页面时显示提示窗口，为false时无提示窗口<br/>
						&nbsp;&nbsp;title：提示窗口的标题<br/>
						&nbsp;&nbsp;message：提示窗口的提示信息<br/>
	  @example
		app.load({
			url:"http://www.baidu.com",
			params:{name:"lufeng", sex:"男"},
			slideType:"left",
			progress:{show:"false", title:"your title", message:"your message"}
		});
	*/
	app.load = function(params) {
		if (!params) {
			app.alert("should be object like {url:'http://domain',params:{....}}");
			return;
		}
		if (!params.url) {
			app.alert("url is necessary!");
			return;
		}
		var url = params.url;
		if (url.startWith("http://") || url.startWith("https://")|| url.startWith("file://") || url.startWith("/")) 
		{
			//to do
		} else {
			// 处理相对路径
			var selfUrl = window.location.href;
			var lio = selfUrl.lastIndexOf("/");
			url = selfUrl.substring(0, lio) + "/" + url;
			params.url = url;
		}
		// 如果是pc的话直接执行
		if (app.utils.isPC()) {
			window.location.href = url;
			return;
		}
		Cordova.exec(null, null, "Page", "loadUrl", [ params ]);
	}
	

	/**
	  加载一个新的页面
	  @method app.loadWithUrl
	  @static
	  @param url {String} 切换页面的url
	  @param params {JSON对象} 页面传递的参数
	  @param slideType {String} 页面切换的方向
	  @param progress {JSON对象} (3.0以上版本已弃用该参数)页面间切换时的提示窗口，有三个属性，分别是show、title、message<br/>
			show：为true时，切换页面时显示提示窗口，为false时无提示窗口<br/>
			title：提示窗口的标题<br/>
			message：提示窗口的提示信息
	  @example
		app.loadWithUrl('modules/test/secondpage.html',{},'left',{show:"true", title:"我是切换窗口", message:"正在切换中，别着急..."});
	*/
	app.loadWithUrl = function(url, params, slideType, progress) {
		if (typeof (url)=="undefined") {
			app.alert("url is necessary!");
			return;
		}
		params = params || {};
		slideType = slideType || "left"
		var obj = {
			url : url,
			params : params,
			slideType : slideType,
			progress : progress
		};
		app.load(obj);
	}
	/**
	  控制屏幕旋转
	  @method app.rotation
	  @static
	  @param type {string} landscape表示横屏锁定、portrait表示竖屏锁定
	  @example
		app.rotation("landscape"); //表示当前页面需要横屏锁定显示； 
		app.rotation("portrait"); //表示竖屏锁定
		app.rotation("user");  //解除锁定，恢复横竖屏(仅android)。

	*/	
	app.rotation = function(type) {
		Cordova.exec(null, null, "RotationPlugin", "setRotation", [ type ]);
	}
	
	/**
	  获取页面传递的参数
	  @method app.getPageParams
	  @static
	  @param callback {Function} 回调函数，注意这个回调函数是有返回结果的
	  @example
		app.getPageParams(function(result){ 
			var name = result.name;  
			//……   
		}); 
	*/
	app.getPageParams = function(callback) {
		var success = function(result) {
			callback(app.utils.toJSON(result));
		}
		Cordova.exec(success, null, "Page", "getPageParams", []);
	}
	
	/**
	  返回上个页面，返回的时候可以在上个页面执行相关逻辑
	  @method app.back
	  @static 
	  @param callback {Function} 回调函数，可以是一个方法签名,也可以是匿名函数
	  @example
		//传入方法签名
		app.back("test('abc')"); //需要在上个页面声明test(a)方法
		app.back(function(){ $(".span>h1").text("BingoTouch");}); //执行匿名函数
	*/
	app.back = function(callback) {
		if(typeof callback=="undefined"){
			callback="";
		}
		if($.isFunction(callback)){
			callback="("+callback.toString()+")()";
		}
		Cordova.exec(null, null, "Page", "back", [ callback ]);
	}
	
	/**
	  刷新当前页面
	  @method app.refresh
	  @static 
	  @example
		app.refresh();
	*/
	app.refresh = function() {
		Cordova.exec(null, null, "Page", "refresh", []);
	}
	
	/**
	  获取当前页面的地址
	  @method app.getCurrentUri
	  @static 
	  @param callback {Function} 回调函数
	  @example
		app.getCurrentUri(function(res){
			$("#result").html("返回值类型:"+typeof(res)+"<br/> 结果:"+ JSON.stringify(res));
		});
	*/
	app.getCurrentUri = function(callback) {
		Cordova.exec(callback, null, "Page", "getCurrentUri", []);
	}
	
	
	/**
	 获取当前坐标
	 @method app.getLocation
	 @static
	 @param success {Function} 成功回调函数,返回json对象
	 @param fail {Function} 失败回调函数，返回错误信息
	 */
	app.getLocation=function(success,fail){
		var callbackSuccess = function(result) {
			success(app.utils.toJSON(result));
		}
		Cordova.exec(callbackSuccess, fail, "LocationPlugin", "location", []);
	}
	
	
	/**
	  获取app相关信息
	  @method app.getInfo
	  @static 
	  @param callback {Function} 回调函数
	  @example
		//res包含三个属性，id:程序的id号、versionCode:版本编码、versionName：版本名称
		app.getInfo(function(res){
			app.alert(res);
		});
	*/
	app.getInfo = function(callback) {
		var success = function(result) {
			callback(app.utils.toJSON(result));
		}
		Cordova.exec(success, null, "ExtendApp", "getInfo", []);
	}
	
	/**
	  获取设备的尺寸
	  @method app.getSize
	  @static 
	  @param callback {Function} 回调函数
	  @example
		//res包含两个属性，height:屏幕的高度、width:屏幕的宽度
		app.getSize(function(res){
			app.alert(res);
		});
	*/
	app.getSize = function(callback) {
		var success = function(result) {
			callback(app.utils.toJSON(result));
		}
		Cordova.exec(success, null, "ExtendApp", "getSize", []);
	}
	
	/**
	  弹出提示框
	  @method app.alert
	  @static
	  @param message {String} 窗口消息内容
	  @param callback {Function} 回调函数
      @param title {String}  窗口标题
      @param buttonName {String}   按钮名称
	  @example
		app.alert("这是一个定制的提示框", function(){
			app.hint("我有一个回调事件");
		}, "温馨提示", "OK");	  
	 */
	app.alert = function(message, callback, title, buttonName) {
		callback = callback || function(res) {};
		title = title || "提示";
		buttonName = buttonName || "确定";
		if (typeof (message) == "object") {
			message = JSON.stringify(message);
		}
		navigator.notification.alert(message, callback, title, buttonName);
	}
	
	/**
	  弹出确认框
	  @method app.confirm
	  @static
	  @param message {String} 窗口消息内容
	  @param callback {Function} 回调函数
      @param title {String}  窗口标题
      @param buttonNames {String}  按钮组的名称，例："确定,取消"
	  @example
		app.confirm("确定要使用BingoTouch吗?", function(index){
			if(index==1){
				app.hint("我点击了OK");
			}else{
				app.hint("我点击了Cancel");
			}
		}, "请您确认", "OK,Cancel");
	 */	
	app.confirm = function(message, callback, title, buttonNames) {
		callback = callback || function(res) {};
		title = title || "提示";
		buttonNames = buttonNames ||"确认,取消";
		navigator.notification.confirm(message, callback, title, buttonNames);
	}
	
	/**
	 显示提示信息
	 @method app.hint
	 @param message {string} 提示信息
	 @param pasition {string}  提示语位置
	 @example 
		app.hint("Hello,BingoTouch");
	*/
	app.hint = function(message, position) {
		message = message || "Hello BingoTouch!";
		position = position || "bottom";
		Cordova.exec(null, null, "ExtendApp", "hint", [ message, position ]);
	}
	/**
	设备震动提醒
	@method app.vibrate
	@param mills {int} 毫秒
	*/
	app.vibrate=function(mills){
		navigator.notification.vibrate(mills);
	}
	
	/**
	  安装应用（<font color="red">仅android平台适用,iOS平台是通过plist的方式安装</font>）
	  @method app.install
	  @param fileUrl {String} 文件路径
	  @param success {Function} 安装成功回调
	  @param fail {Function} 安装失败回调
	  @example
		app.install(fileUrl);
	*/
	app.install = function(fileUrl, success, fail) {
		success = success || function(res) {
			app.hint(res);
		};
		fail = fail || function(res) {
			app.hint(res);
		};
		if (window.devicePlatform == "android") {
			Cordova.exec(success, fail, "ExtendApp", "install", [ fileUrl ]);
		} else if (window.devicePlatform == "iOS") {
			app.alert("iOS platform do not support this api!");
		}
	}
	
	/**
	  设置运行时全局变量
	  @method app.setGlobalVariable
	  @param key {String} 键
	  @param value {String} 值
	  @example
		app.setGlobalVariable("globalParam","BingoTouch");	 
	*/
	app.setGlobalVariable = function(key, value) {
		Cordova.exec(null, null, "ExtendApp", "setVariable", [ key, value ]);
	}
	
	/**
	  获取运行时全局变量
	  @method app.getGlobalVariable
	  @param key {String} 键
	  @param callback {Function} 回调函数
	  @example
		app.getGlobalVariable("globalParam",function(res){
			app.alert("返回值类型:"+typeof(res)+"<br/> 结果:"+ JSON.stringify(res));
		});
	*/
	app.getGlobalVariable = function(key, callback) {
		Cordova.exec(callback, null, "ExtendApp", "getVariable", [ key ]);
	}

	
	  /**
      获取sim卡信息
      @method app.getSimInfo
      @static 
      @param 
      @example
        //res包含10个属性，deviceId, phoneNumber, operatorName,
             simCountryIso, simSerialNumber, subscriberId, networkType,
             deviceSoftwareVersion, voiceMailAlphaTag, voiceMailNumber
        app.getSimInfo(function(res){
            app.alert(res);
        });
    */
    app.getSimInfo = function(callback) {
        Cordova.exec(callback, null, "ExtendApp", "getSimInfo", []);
    }


    /**
	打开本地通讯录选择通讯录信息
	@method app.openContactSelector
	@static
	@param  callback {Function} 回调函数,返回json数组，包含名称和手机号

    */
    app.openContactSelector=function(callback){
    	 Cordova.exec(callback, null, "ContractEx", "getContracts", []);
    }

	/* =============================app settings========================== */
	/**
	  持久化配置
	  @class app.setting
	*/
	window.app.setting = window.app.setting || {};
	
	/**
	  持久化保存配置信息
	  @method app.setting.set
	  @static
	  @param name {String} 键
      @param value {String}  值  
	  @example
		app.setting.set("name", "lufeng");
		app.setting.set("sex","男");
	 */
	app.setting.set = function(name, value) {
		if (typeof (name) == "undefined" || typeof (value) == "undefined") {
			app.alert("name and value is necessary!");
			return;
		}
		Cordova.exec(null, null, "Setting", "set", [ name, value]);
	}
	
	/**
	  获取配置信息
	  @method app.setting.get
	  @static
	  @param name {String} 键名称
      @param defaultValue {String}  默认值	  
	  @param callback {Function} 回调函数
	  @example
		app.setting.get("name","默认值",function(res){
			app.alert(res);
		}); 
	*/
	app.setting.get = function(name, defaultValue, callback) {
		if (name == "" || typeof name == "undefined") {
			app.alert("name is necessary!");
			return;
		}
		defaultValue = defaultValue || "";
		callback = callback || function(result) {
			app.alert(result);
		}
		Cordova.exec(callback, null, "Setting", "get", [ name, defaultValue]);
	}
	
	/**
	  删除某配置信息
	  @method app.setting.remove
	  @static
	  @param name {String} 键
	  @example
		app.setting.remove("name");
	*/
	app.setting.remove = function(name) {
		if (typeof (name) == "undefined") {
			app.alert("name is necessary!");
			return;
		}
		Cordova.exec(null, null, "Setting", "remove", [ name]);
	}
	
	/**
	  清除所有配置：慎用
	  @method app.setting.clear
	  @static
	  @example
		app.setting.clear();
	 */	
	app.setting.clear = function() {
		Cordova.exec(null, null, "Setting", "clear", []);
	}
	
	/**
	  获取所有配置信息
	  @method app.setting.getAll
	  @static
	  @param callback {Function} 回调函数	  
	  @example
		app.setting.getAll(function(res){
			app.alert(res);
		}); 
	 */
	app.setting.getAll = function(callback) {
		var success = function(result) {
			callback(app.utils.toJSON(result));
		}
		Cordova.exec(success, null, "Setting", "load", []);
	}
	
	/* =============================app progress========================== */
	/**
	  进度条提示
	  @class app.progress
	*/
	window.app.progress = window.app.progress || {};
	
	/**
	  显示进度条
	  @method app.progress.start
	  @static
	  @param title {String} 标题
      @param message {String}  消息内容  
	  @example
		app.progress.start("温馨提示","加载中...");
	 */
	app.progress.start = function(title, message) {
		title = title || "";
		message = message || "";
		Cordova.exec(null, null, "ExtendApp", "progressStart",[ title, message ]);
	}
	
	/**
	  停止进度条
	  @method app.progress.stop
	  @static
	  @example
		app.progress.stop();
	 */	 
	app.progress.stop = function() {
		Cordova.exec(null, null, "ExtendApp", "progressStop", []);
	}
	
	/* ==============================dateTimePicker============================ */
	/**
	   日期时间时间选择控件
	   @class app.dateTimePicker
	*/
	window.app.dateTimePicker = window.app.dateTimePicker || {};

	/**
	  选择日期，android下适用,ios下请用滚轮选择
	  @method app.dateTimePicker.selectDate
	  @static
	  @param callback {Function} 回调函数
	  @param defaultDate {JSON对象} 默认日期，默认是今天的年月日
      @param format {String}  返回日期格式	  
	  @example
		app.dateTimePicker.selectDate (function(res){
			app.alert("您选择了:"+JSON.stringify(res));
		}, null, "yyyy MM dd");
	 */
	app.dateTimePicker.selectDate = function(callback, defaultDate, format) {
		var toDate = new Date();
		defaultDate = defaultDate || {
			"year" : toDate.getFullYear(),
			"month" : toDate.getMonth() + 1,
			"day" : toDate.getDate()
		};
		format = format || "yyyy-MM-dd";
		var success = function(result) {
			callback(app.utils.toJSON(result));
		}
		if (window.devicePlatform == "android") {
			Cordova.exec(success, null, "DateTimePicker", "date", [defaultDate, format ]);
		} else if (window.devicePlatform == "iOS") {
			app.dateTimePicker.wheelSelectDate(callback, defaultDate, format);
		}
	};
	
	/**
	  选择时间，android下适用,ios下请用滚轮选择
	  @method app.dateTimePicker.selectTime
	  @static
	  @param callback {Function} 回调函数
	  @param defaultTime {JSON对象} 默认弹出的时间
      @param format {String}  返回时间格式	  
	  @param is24Hours {String}  是否是24小时制，默认是true
	  @example
		app.dateTimePicker.selectTime (function(res){
			app.alert("您选择了:"+JSON.stringify(res));
		}, null, "hh mm", true);
	*/	
	app.dateTimePicker.selectTime = function(callback, defaultTime, format,
			is24Hours) {
		var toDate = new Date();
		defaultTime = defaultTime || {
			"hour" : toDate.getHours(),
			"minute" : toDate.getMinutes()
		};
		format = format || "hh:mm";
		is24Hours = is24Hours || true;
		var success = function(result) {
			callback(app.utils.toJSON(result));
		}
		if (window.devicePlatform == "android") {
			Cordova.exec(success, null, "DateTimePicker", "time", [
					defaultTime, format, is24Hours ]);
		} else if (window.devicePlatform == "iOS") {
			app.dateTimePicker.wheelSelectTime(callback, defaultTime, format, is24Hours);
		}
	};
	
	/**
	  滚轮选择日期
	  @method app.dateTimePicker.wheelSelectDate 
	  @static
	  @param callback {Function} 回调函数
	  @param defaultDate {JSON对象} 默认日期，默认是今天的年月日
      @param format {String}  日期格式，默认是"yyyy-MM-dd"  
	  @param range {JSON对象}  年份的范围，格式如{ "minYear": 2000, "maxYear": 2046 }
	  @param isFormat {String} 是否支持格式化，例如只选择年月等。默认是false，format在设置true的时候才生效
	  @example
		app.dateTimePicker.wheelSelectDate (function(res){
			app.alert("您选择了:"+JSON.stringify(res));
		}, null, null, { "minYear": 1980, "maxYear": 2013 });
	 */
	app.dateTimePicker.wheelSelectDate = function(callback, defaultDate,
			format, range,isFormat) {
		var toDate = new Date();
		defaultDate = defaultDate || {
			"year" : toDate.getFullYear(),
			"month" : toDate.getMonth() + 1,
			"day" : toDate.getDate()
		};
        format = format || "yyyy-MM-dd";
        range = range || {
            "minYear" : 2000,
            "maxYear" : 2046
        };
        var success = function(result) {
            callback(app.utils.toJSON(result));
        }
        defaultDate.month = defaultDate.month - 1;
        //ios下重构了日期滚轮控件，这里是兼容处理
        isFormat=isFormat||false;
        if(isFormat&&window.devicePlatform == "iOS"){
            defaultDate.month = defaultDate.month+ 1;
            Cordova.exec(success, null, "WheelSelectPluginFormat", "date", [ defaultDate,format, range ]);
        }else{
            Cordova.exec(success, null, "WheelSelectPlugin", "date", [ defaultDate,format, range ]);
        }
	}
	
	/**
	  滚轮选择时间
	  @method app.dateTimePicker.wheelSelectTime 
	  @static
	  @param callback {Function} 回调函数
	  @param defaultTime {JSON对象} 默认弹出的时间
      @param format {String}  返回时间格式	  
	  @param is24Hours {String}  是否是24小时制，默认是true
	  @example
		app.dateTimePicker.wheelSelectTime (function(res){
			app.alert("您选择了:"+JSON.stringify(res));
		}, null, null, false); 
	*/
	app.dateTimePicker.wheelSelectTime = function(callback, defaultTime,
			format, is24Hours) {
		var toDate = new Date();
		defaultTime = defaultTime || {
			"hour" : toDate.getHours(),
			"minute" : toDate.getMinutes()
		};
		format = format || "hh:mm";
		is24Hours = is24Hours || true;
		var success = function(result) {
			callback(app.utils.toJSON(result));
		}
		Cordova.exec(success, null, "WheelSelectPlugin", "time", [ defaultTime,format, is24Hours ]);
	}
	
	/* ==============================wheelSelect================================== */
	/**
	   滚轮选择控件
	   @class app.wheelSelect
	*/
	window.app.wheelSelect = window.app.wheelSelect || {};
	 /**
	  滚轮单选
	  @method  app.wheelSelect.oneSelect
	  @static
	  @param data {Array} 被选择数据
	  @param callback {Function} 回调函数
      @param selectedKey {String}  默认选中key	  
	  @param title {String} 标题
	  @param buttons {JSON对象}  按钮设置
	  @example
		HTML:
			<div id="selectOrg" data-role="BTSelect"  ><span>请选择部门</span></div>
		JS:
			$("#selectOrg").click(function(){
				app.wheelSelect.oneSelect( [{key:"o1",value:"平台"},{key:"o2",value:"电信"}], function(res){
					$("#selectOrg").btselect("val",res, null);
				}, "o1", "选择部门", { "sureBtn": "确定啦", "cancelBtn": "取消啦" } );
			});
	 */
	app.wheelSelect.oneSelect = function(data, callback, selectedKey, title,
			buttons) {
		data = data || [];
		title = title || "提示";
		buttons = buttons || {
			"sureBtn" : "确定",
			"cancelBtn" : "取消"
		};
		selectedKey = selectedKey || "";
		var success = function(result) {
			callback(app.utils.toJSON(result));
		}
		Cordova.exec(success, null, "WheelSelectPlugin", "oneSelect", [ data,
				selectedKey, title, buttons ]);
	}
	
	/* ==============================Phone====================================== */
	/**
	   打电话，发短信
	   @class app.phone
	*/
	window.app.phone = window.app.phone || {};
	
	/**
	 发短信
	 @method app.phone.sendSMS
	 @param phone {string}  电话号码
	 @param message {string} 信息内容
	 @example
		app.phone.sendSMS("10086,10000","你好,我要使用BingoTouch");
	*/
	app.phone.sendSMS = function(phone, message) {
		Cordova.exec(null, null, "PhonePlugin", "sms", [ phone, message ]);
	}

	/**
	 打电话
	 @method app.phone.dial
	 @param phone {string}  电话号码
	 @example
		app.phone.dial("10086");
	*/
	app.phone.dial = function(phone) {
		Cordova.exec(null, null, "PhonePlugin", "dial", [ phone ]);
	}
	
	/* ======================================SSO====================================== */
	/**
	  sso
	  @class app.sso
	*/
	window.app.sso = window.app.sso || {};
	// sso登陆
	// param:{credential_type:"password",username:"tony",password:"1",get_spec_secret:"y",get_service_ticket:"y"}
	// credential_type: password or specsecret
	/**
	 sso登陆
	 @method app.sso.login
	 @param params {JSON对象} 登陆信息,具体参数如下<br/>
			credential_type : 登陆方式  ⇒ password 用普通用户密码 | specsecret 应用专用密码<br/>
			username : 用户名<br/>
			password : 密码<br/>
			get_spec_secret : 是否返回 specsecret  ⇒ y | n<br/>
			get_service_ticket : 是否获得serviceticker ⇒ y | n<br/>
	 @param success {Function} 成功回调
	 @param fail{Function} 失败回调
	 @example
		var params = {
			credential_type: "",
			username: "yulsh",
			password: "111111",
			get_spec_secret: "y",
			get_service_ticket: "y"
		};
		app.sso.login(params, function (res) {
			app.alert(res);
		}, function (res) {
			app.alert("error" + res);
		});
	*/ 
	app.sso.login = function(params, success, fail) {
		params = params || {};
		params.credential_type = params.credential_type || "password";
		params.get_spec_secret = params.get_spec_secret == "y" ? true : false;
		params.get_service_ticket = params.get_service_ticket == "y" ? true
				: false;
		var successCallback = function(result) {
			success(app.utils.toJSON(result));
		}
		var failCallback = function(result) {
			fail(app.utils.toJSON(result));
		}
		Cordova.exec(successCallback, failCallback, "SSOPlugin", "login",
				[ params ]);
	}
	
	 /**
		sso注销
		@method app.sso.logout
		@param success {Function} 成功回调
		@param fail{Function} 失败回调
		@example
			app.sso.logout(function (res) {
				app.alert(res);
			},function(res){
				app.alert(res);
			});
	 */
	app.sso.logout = function(success, fail) {
		success = success || function(response) {
		};
		fail = fail || function(response) {
		};
		Cordova.exec(success, fail, "SSOPlugin", "logout", []);
	}
	
	/**
	 判断是否已经登录
	 @method app.sso.isLogined
	 @param success {Function} 成功回调
	 @example
		app.sso.isLogined(function(res){
			if(res=="true"){
				app.alert("您已正常登录!");
			}else{
				app.alert("您尚未登录!");
			}
		});
	*/
	app.sso.isLogined = function(success) {
		Cordova.exec(success, null, "SSOPlugin", "isLogined", []);
	}

	/* ==========================Sqlite Database====================== */
	/**
	  数据库
	  @class app.database
	*/
	window.app.database = window.app.database || {};

	/**
	 打开数据库，如果不存在会默认创建
		@method app.database.open
		@param name {String} 数据库名称
		@param version {String} 版本
		@param size{Number} 数据大小，单位是 bytes.  1024bytes=1KB 1024KB=1MB 
		@example
			var testDatabase = app.database.open("test", "1.0", 1000000);	// 1000000bytes ≈ 1MB  
	*/
	app.database.open = function(name, version, size) {
		if (name == "" || typeof name == "undefined") {
			app.alert("name is necessary!");
			return null;
		}
		return window.openDatabase(name, version, name, size);
	}
	
	/**
	 执行sql: create,drop,insert,update,delete.
	 支持批量
		@method app.database.executeNonQuery
		@param database {Object} open的数据库
		@param sql {String | Array } sql （可单条或批量）
		@param success {Function} 成功回调 PS：成功回调没有result参数
		@param fail{Function} 失败回调
		@example
			app.database.executeNonQuery(testDatabase, [
				'DROP TABLE IF EXISTS DEMO',
				'CREATE TABLE IF NOT EXISTS DEMO (id unique, data)',
				'INSERT INTO DEMO (id, data) VALUES (1, "First row")',
				'INSERT INTO DEMO (id, data) VALUES (2, "Second row")'
			],function(){
			},function(res){
			});	  
	*/
	app.database.executeNonQuery = function(database, sql, success, fail) {
		success = success || function() {
		}
		fail = fail || function(error) {
			app.alert(error);
		}
		database.transaction(function(tx) {
			if (typeof sql == "string") {
				tx.executeSql(sql);
			} else if ($.isArray(sql)) {
				for ( var i = 0; i < sql.length; i++) {
					tx.executeSql(sql[i]);
				}
			}
		}, fail, success);
	}
	
	/**
	 执行查询
		@method app.database.executeQuery
		@param database {Object} open的数据库
		@param sql {String} sql 
		@param success {Function} 成功回调
		@param fail{Function} 失败回调
		@example
			app.database.executeQuery(testDatabase ,'select * from DEMO',function(tx, results){
			},function(res){
			});	  
	*/
	app.database.executeQuery = function(database, sql, success, fail) {
		success = success || function(tx, results) {
			// results.rows.length
			// results.rowsAffected
			// results.insertId
			// results.rows.item(i).field
		}
		fail = fail || function(error) {
			app.alert(error);
		}
		database.transaction(function(tx) {
			tx.executeSql(sql, [], success, fail);
		}, fail);
	}


	
    /**
	  二维码
	  @class app.barcode
	*/
	window.app.barcode = window.app.barcode || {};

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
	app.barcode.scan=function(success,fail){
		Cordova.exec(success, fail, "BarcodeScanner", "scan", []);
	}

    /**
	  本地通知
	  @class app.notification
	*/
	window.app.notification = window.app.notification || {};

	/**
        该接口用于发起本地通知
        @method app.notification.notify
        @static
        @param title {String} 标题
        @param body {String} 主要内容
		@param isAutoDisapper {boolean} 是否自动移除
		@param disapperTime {long} X时间后移除        
		@param clickAction {String} 点击本地通知回到activity后执行的JS方法
		@param clickActionParams {JsonArray} 方法的参数
        @example 
			$("#btnNotification").tap(function() {
					var params = {
					"title":"理想",
					"body":"这是理想！",
					"isAutoDisappear":true,
					"disappearTime":5000,
					"clickAction": "afterNotification",
					"clickActionParams": {"title":"理想"}
					};
				app.notification.notify(params);
			});

			afterNotification = function(param){
				alert(param.title);
			}
    */	
	app.notification.notify = function(params) {
		params = params || {};
		params.title = params.title||"";
		params.body = params.body||"";
		params.isAutoDisappear = params.isAutoDisappear || true;
		params.disappearTime = params.disappearTime || 5000;
		params.clickAction = params.clickAction || "";
		params.clickActionParams = params.clickActionParams || {};
		Cordova.exec(null, null, "LocalNotification", "notify", [ params.title,params.body,params.isAutoDisappear,params.disappearTime,params.clickAction,params.clickActionParams]);
	}


/**
        社会化分享插件
        @class app.shareplugin
    */
	window.app.shareplugin=window.app.shareplugin||{};

    /**
        该接口用于社会化分享
        @method app.shareplugin.share
        @static
        @param title {String} 标题，邮箱、信息、微信、QQ空间使用
        @param titleUrl {String} 标题的网络链接，仅在QQ空间使用
		@param text {String} 分享文本，所有平台都需要这个字段
		@param url {String} 仅在微信（包括好友和朋友圈）中使用        
		@param comment {String} 对这条分享的评论，仅在QQ空间使用
		@param siteName {String} 分享此内容的网站名称，仅在QQ空间使用
		@param siteUrl {String} 分享此内容的网站地址，仅在QQ空间使用
        @example 
			var params={
				title:"BingoTouch开发框架",
				titleUrl:"http://www.bingosoft.net",
				text:"欢迎关注BingoTouch!",
				url:"http://www.bingosoft.net",
				comment:"我们一直在完善",
				siteName:"BingoTouch官方网站",
				siteUrl:"http://dev.bingocc.cc:8060/modules/bingotouch/",
			};
			app.shareplugin.share(params);
    */	
	app.shareplugin.share=function(params){
		Cordova.exec(null, null, "ShareSDKPlugin", "share", [params.title,params.titleUrl,params.text,params.url,params.comment,params.siteName,params.siteUrl ]);
	}



	/**
	运行时定时任务接口
	@class app.timetask
	*/
	window.app.timetask=window.app.timetask||{}

	/**
	开启一个定时任务
	@method app.timetask.start
	@static
	@param params {Object} 启动定时任务需要的参数
	   id: 定时任务id，id重复不能重复
	   taskAction: 定时执行的动作，这里可以是方法名或者匿名方法
	   maxCount: 任务最多执行的次数，不传默认1w次
	   loopTime: 任务执行间隔时间，单位是毫秒
	   isImmediate: 是否立刻执行，默认不立刻执行，loopTime 毫秒后才执行
	   callback: 回调函数，返回json对象。如｛id:"",status:"",desc:""｝ 
	*/
	app.timetask.start=function(params){
		params=params||{};
		params.id=params.id||"";
		params.taskAction=params.taskAction||"";
		params.maxCount=params.maxCount||10000;//默认执行1w次
		params.loopTime=params.loopTime||1000; //默认1s 执行一次
		params.isImmediate=params.isImmediate||false; //是否立刻执行

		if(params.id==""){
			app.alert("任务id不能为空!");
			return;
		}
		if(params.taskAction==""){
			app.alert("任务动作不能为空!");
			return;
		}
        var nativeCallback=function(result){
            params.callback(app.utils.toJSON(result));
        }
		Cordova.exec(nativeCallback, null, "TimeTask", "taskStart", [params]);
	}

	/**
	结束一个定时任务
	@method app.timetask.stop
	@static
	@param id {String} 任务id
	@param callback {function} 回调函，数返回json对象。如｛id:"",status:"",desc:""｝ 
	*/
	app.timetask.stop=function(id,callback){
		id=id||"";
		if(id==""){
			app.alert("任务id不能为空!");
			return;
		}
        var nativeCallback=function(result){
            callback(app.utils.toJSON(result));
        }
		Cordova.exec(nativeCallback, null, "TimeTask", "taskStop", [id]);
	}

	
})(window);

//Dom结构加载完成
$(function(){
	
	//页面报错时候执行
	window.onerror=function(msg,url,line){
		app.page.onError(msg,url,line);
	}
	
	//dom结构加载完成执行
	app.page.onReady();
});

//页面完整加载完成
window.onload=function(){
	document.addEventListener("deviceready", function() {

		//声明页面事件
		app.page.onLoad();
		
	}, false);
}();



;ui.Utils = {
    setViewPort: function () {
        //android viewport
        var viewport = "";
        var userAgent = navigator.userAgent.toLowerCase();

        if (/android (\d+\.\d+)/.test(userAgent)) {
            viewport ="width=device-width,initial-scale=1,user-scalable=no,target-densitydpi =240";
        } else {
          	viewport ="width=device-width,initial-scale=0.666666,user-scalable=no";
        }
        //add view
        if ($("meta[name='viewport']").length > 0) {
            $("meta[name='viewport']").attr("content", viewport);
        } else {
            var element = document.createElement('meta');
            element.name = "viewport";
            element.content = viewport;
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(element);
			
        }
    },
    parseHash : function(hash){
        var tag,query,param={};
        var arr = hash.split('?');
        tag = arr[0];
        if(arr.length>1){
            var seg,s;
            query = arr[1];
            seg = query.split('&');
            for(var i=0;i<seg.length;i++){
                if(!seg[i])continue;
                s = seg[i].split('=');
                param[s[0]] = s[1];
            }
        }
        return {
            hash : hash,
            tag : tag,
            query : query,
            param : param
        }
    },
    //Color
	//将hex颜色值str转化成rgb数组  
    HexToRgb : function (str) {  
        var r = /^\#?[0-9a-fA-Z]{6}$/;  
        //test方法检查在字符串中是否存在一个模式，如果存在则返回true，否则返回false  
        if (!r.test(str)) return window.alert("输入错误的hex颜色值");  
        //replace替换查找的到的字符串  
        str = str.replace("#", "");  
        //match得到查询数组  
        var hxs = str.match(/../g);  
        for (var i = 0; i < 3; i++) hxs[i] = parseInt(hxs[i], 16);  
        return hxs;  
    },
    //将rgb颜色值为a,b,c转化成hex颜色值  
    RgbToHex : function (a, b, c) {  
        var r = /^\d{1,3}$/;  
        if (!r.test(a) || !r.test(b) || !r.test(c)) return window.alert("输入错误的rgb颜色值");  
        var hexs = [a.toString(16), b.toString(16), c.toString(16)];  
        for (var i = 0; i < 3; i++) if (hexs[i].length == 1) hexs[i] = "0" + hexs[i];  
        return "#" + hexs.join("");  
    },  
    //得到hex颜色值为color的加深颜色值，level为加深的程度，限0-1之间  
    getDarkColor : function (color, level) {  
        var r = /^\#?[0-9a-fA-Z]{6}$/;  
        if (!r.test(color)) return window.alert("输入错误的hex颜色值");  
        var rgbc = ui.Utils.HexToRgb(color);  
        //floor 向下取整  
        for (var i = 0; i < 3; i++) rgbc[i] = Math.floor(rgbc[i] * (1 - level));  
        return ui.Utils.RgbToHex(rgbc[0], rgbc[1], rgbc[2]);  
    },  
    //得到hex颜色值为color的减淡颜色值，level为减淡的程度，限0-1之间  
    getLightColor : function (color, level) {  
        var r = /^\#?[0-9a-fA-Z]{6}$/;  
        if (!r.test(color)) return window.alert("输入错误的hex颜色值");  
        var rgbc = ui.Utils.HexToRgb(color);  
        for (var i = 0; i < 3; i++) rgbc[i] = Math.floor((255 - rgbc[i]) * level + rgbc[i]);  
        return ui.Utils.RgbToHex(rgbc[0], rgbc[1], rgbc[2]);  
    },  
    //得到hex颜色值为color的web安全色  
    getWebSafeColor : function (color) {  
        var r = /^\#?[0-9a-fA-Z]{6}$/;  
        if (!r.test(color)) return window.alert("输入错误的hex颜色值");  
        var rgbc = ui.Utils.HexToRgb(color);  
        for (var i = 0; i < 3; i++) {  
            var q1 = Math.floor(rgbc[i] / 51) * 51;  
            //ceil向上取整  
            var q2 = Math.ceil(rgbc[i] / 51) * 51;  
            //abs绝对值  
            if (Math.abs(q1 - rgbc[i]) <= Math.abs(q2 - rgbc[i])) rgbc[i] = q1;  
            else rgbc[i] = q2;  
        }  
        return ui.Utils.RgbToHex(rgbc[0], rgbc[1], rgbc[2]);  
    },
    //获取url参数
    getUrlQueryString : function (item){
         var sValue=location.search.match(new RegExp("[\?\&]"+item+"=([^\&]*)(\&?)","i"))
         return sValue?sValue[1]:sValue
    },
    getDefaultDatePickerValue : function(type, value, format){
		var dateGroup = [];
		
		var nowDate = {};
		if (type == 'date' || type == 'wheeldate') {
			dateGroup = value.split('-');
			if(format){
			 	if(format.indexOf('y') > -1)   
			 		nowDate.year = dateGroup.shift();
			 	else
			 		nowDate.year = 2016;
			 	if(format.indexOf('m') > -1)   
			 		nowDate.month = dateGroup.shift();
			 	else
			 		nowDate.month = 1; 
			 	if(format.indexOf('d') > -1)   
			 		nowDate.day = dateGroup.shift();
			 	else
			 		nowDate.day = 1;
			} else {
				nowDate.year = dateGroup[0];
				nowDate.month = dateGroup[1];
				nowDate.day = dateGroup[2];	
			}
		} else {
			dateGroup = value.split(':');
			nowDate.hour = dateGroup[0];
			nowDate.minute = dateGroup[1];
		}
		return nowDate;
    },
    getFormatDatePickerValue : function(type, res, format){
   
    	if(format){
    		format = format.toLowerCase();
	       	var full = [];    	
			if (type == 'date' || type == 'wheeldate') {
			 	if(format.indexOf('y') > -1) full.push(res.year);
			 	if(format.indexOf('m') > -1) full.push(res.month);
			 	if(format.indexOf('d') > -1) full.push(res.day);
			 	return full.join("-");
			} 		
    	} else {
    		return res.full;
    	}
		
    }
}


/*
* Object String extend
*/
String.prototype.startWith = function (str) {
    var reg = new RegExp("^" + str);
    return reg.test(this);
}

String.prototype.endWith = function (str) {
    var reg = new RegExp(str + "$");
    return reg.test(this);
}

String.prototype.getQueryString = function (name) { //name 是URL的参数名字 
    var reg = new RegExp("(^|&|\\?)" + name + "=([^&]*)(&|$)"), r;
    if (r = this.match(reg)) return (unescape(r[2]) || "").split("#")[0]; return null;
};


//表单数据 toJSON
/**
@class ui
*/
/**
  将表单数据封装成为一个JSON对象 ,
  <span><font color='red'>不论是BingoTouch定义的表单元素还是传统表单元素，都能被封装。</font></span>
  @method $(selector).toJSON(justValue)
  @param justValue {boolean} 只封装值  ⇒ true |　false
  @return {JSON对象} 表单数据
  @example
	HTML:
		<div id="test">
			<div  id="btswitch" name="switchB" class="BTCheck_OFF" data-role="BTSwitch" ></div>
			<div data-role="BTCheck" name="csex" value="girl">女</div>
			<div data-role="BTCheck" name="csex" value="boy">男</div>
			<div data-role="BTCheck" name="csex" value="rao">中</div>
			<div data-role="BTRadio" name="rsex"  value="boy">男</div>
			<div data-role="BTRadio" name="rsex"  value="girl">女</div>
			<div id="BTSelect" data-role="BTSelect"  name="selectsex" data='[{"value":"female","label":"女"},{"value":"male","label":"男"}]' title="请选择性别"><span>请选择性别</span></div>
			<div id="BTTime" data-role="BTSelect"  name="time" data='{"hour":16,"minute":29,"full":"16:29"}' type="time"><span>请选择时间</span></div>
		</div>
	JS:
		$("#test").toJSON(false);
		//return JSON对象如下
		{ 
		"csex":[{"value":"girl","label":"女"},{"value":"boy","label":"男"}],
		"rsex":{"value":"boy","label":"男"},
		"switchB":true,
		"selectsex":{"value":"female","label":"女"},
		"time":"10:4"
		}
		$("#test").toJSON(true);
		//return JSON对象如下
		{ 
		"csex":["girl","boy"],
		"rsex":"boy",
		"switchB":true,
		"selectsex":"female",
		"time":"10:4"
		}
*/
$.fn.toJSON= function(justValue){
	//BingoTouch定义表单元素
	var selector =$(this);
   	var result={};
	$("[data-role='BTCheck']",selector).each(function(){
	    var $obj = $(this);
		var name = $obj.attr("name"), val =$obj.btcheck("val")[0];
		if(name!=null&&val!=null){
			result[name] = result[name]||[] ;
			if(justValue){ result[name].push(val.value) ; }
			else{ result[name].push(val) ; } 
		}
    }) ;
	$("[data-role='BTRadio']",selector).each(function(){
	    var $obj = $(this);
		var name = $obj.attr("name"), val =$obj.btradio("val");
		if(name!=null&&val!=null){
			if(justValue){ result[name] = val.value; }
			else{ result[name] =val; } 
		}
    }) ;
	$("[data-role='BTSwitch']",selector).each(function(){
	    var $obj = $(this);
		var name = $obj.attr("name"), val =$obj.btswitch("val") ;
		if(name!=null){
			result[name] = val;
		}
    }) ;
	$("[data-role='BTSelect']",selector).each(function(){
	    var $obj = $(this);
		var type = $obj.attr("type"),name = $obj.attr("name"),val;
		if(type=='date'||type=='time'){
		   val =$obj.btdatepicker("val") ;
		}
		else{
		   val =$obj.btselect("val") ;
		}
		if(name!=null){
			if(justValue){ result[name] = val.value; }
			else{ result[name] =val; } 
		}
    }) ;
	$('.dropdown > div[data-role="BTButton"]',selector).each(function(){
	    var $obj = $(this);
		var name = $obj.attr("name"), val =$obj.btdropdown("val");
		if(name!=null){
			result[name] =val;
		}
    }) ;
	//传统表单元素
	$("input",selector).each(function(){
	   var $obj = $(this);
	   var type = $obj.attr('type'),name= $obj.attr("name");
	   if(type=='text'||type=='password'){
		  result[name] = $obj.attr('value');
	   }
	   else if( type =='checkbox'){
		  if($obj.attr("checked")){
		  	 result[name] = result[name]||[] ;
		     result[name].push($obj.attr("value")) ;	
		  }		  
	   }
	   else if( type=='radio') {
		  if($obj.attr("checked")){
		  	 result[name] = $obj.attr("value") ;
		  }		   
	   }
	});
	$("textarea",selector).each(function(){
	    var $obj = $(this);
		result[$obj.attr("name")] = $obj.attr('value');
	});
	$("select",selector).each(function(){
	    var $obj = $(this);
		result[$obj.attr("name")] = $obj.attr('value');
	});
    return result;	
}
 






//UI控件 form list collapse navbar btngroup
;(function (ui) {

    ui.form = {};
    ui.list = {};

    $.bt_jqprefix = "bt";
    $.bt_staticprefix = "ui";
    $.bt_options = {
        val: function (defaultValue) {
            return $(this).attr("value") || defaultValue;
        }
    };
    $.bt = function (type, options) {
        $.fn[$.bt_jqprefix + type] = function (type) {
            var args = [];
			for(var i=1 ;i<arguments.length ;i++){
				args.push(arguments[i]);
			}
            var func = options[type];
            return func.apply(this, args);
        };
    };

    ui._off = function (obj, event, widgetType) {
        obj = obj || 'div[data-role=' + widgetType + ']';
        $(obj).unbind(event || 'tap');
        return obj;
    }
    window.st = null;

    ui.bindTouchStart = function (obj) {
        $(obj).bind('touchstart', function (e) {
        	//alert('touchstart');
            //st = new Date().getTime();
            $(this).addClass('btn-active');
            //会让默认的滚动事件在按钮上失效
            //e.preventDefault(); 
            //防止按钮有链接时会触发2次
            //e.stopPropagation();
        })
    }
    ui.bindTouchEnd = function (obj) {
        $(obj).bind('touchend', function (e) {
        	//alert('touchend');
            $(this).removeClass('btn-active');
            //e.stopPropagation();
        })
    }

    /*
    * 控件初始化
    */
    $.uiwidget = {
        mark: "data-role",
        map: {},
        dependMap: {},
        funcs: [],
        /*
        * eg: $.widget.register("combotree",function(){})
        */
        register: function () {//type ,depend , func
            var type = arguments[0];
            var func = null;
            var depend = null;
            if (arguments.length == 1) {
                func = arguments[0];
                $.uiwidget.funcs.push(func);
                return;
            } else if (arguments.length == 2) {
                func = arguments[1];
            } else if (arguments.length == 3) {
                func = arguments[2];
                depend = arguments[1];
            }


            $.uiwidget.map[type] = func;
            $.uiwidget.dependMap[type] = depend;
        },
        init: function (options, target) {
            var widgetTrack = [];
            var pushed = {};
            //format dependMap
            for (var o in $.uiwidget.map) {
                _addTypeTrack(o);
            }

            options = options || {};
            options.before && options.before(target);
            var cacheType = {};

            $(widgetTrack).each(function (index, type) {
   
                if ($.uiwidget.map[type]) {
                    var selector = $("[" + $.uiwidget.mark + "^='" + type + "'],[" + $.uiwidget.mark + "*='," + type + "']", target)
                    if (selector.length > 0) {
                        $.uiwidget.map[type](selector, target);
                    }
                }
            });

            $($.uiwidget.funcs).each(function (index, func) {
                func && func(target); //加上作用域
            });

            options.after && options.after(target);

            function _addTypeTrack(o) {
                var depend = $.uiwidget.dependMap[o];
                if (depend) {//存在依赖
                    $(depend).each(function (index, type) {
                        _addTypeTrack(type);
                    });
                }
                (!pushed[o]) && widgetTrack.push(o);
                pushed[o] = true;
            }

            pushed = null;
            widgetTrack = null;

        }
    }

    $.fn.uiwidget = function () {
    	//$.uiwidget.init({}, $(this).parent()); //这里的widget parent, 进行修正(不知原来是出于什么原因考虑)
        $.uiwidget.init({}, $(this)); 
    }

    $.pageLoad = { before: [], after: [] };
    $.pageLoad.register = function (type, func) {
        $.pageLoad[type].push(func);
    };

    ui.init = function () {
        $(document.body).uiwidget();
    };
})(window.ui);

/*
* button.js
*/
//select
(function (undefined) {
    $.bt("button", {
        off: function (event) {
            return ui._off(this, event, 'BTButton');
        }
    });

    /*
    * 初始化控件
    */
    $.uiwidget.register("BTButton", function (selector) {
        selector.each(function () {
            var status = $(this).attr('data-status'); //是否要渲染
            var url = $(this).attr('data-url'); //跳转地址
            var urlArg = $(this).attr('data-urlarg'); //跳转地址带参数
            var mousedown = $(this).attr('mousedown'); //是否取消点击高亮
            var mouseup = $(this).attr('mouseup'); //是否取消点击高亮
            var disabled = $(this).attr('disabled'); //是否取消点击高亮
            var icon = $(this).attr('data-icon'); //图标class或图片路径	
            var badges = $(this).attr('data-badges'); //提示文本
            //是否要内嵌一层以及渲染图标
            if (status != 1) {
                $(this).wrapInner('<span class="btn-text"/>');
                //是否有图标
                if (icon != null) {
                    if (icon.indexOf('/') > -1) {
                        $(this).append('<span class="icon"><img src="' + icon + '" alt=""/></span>');
                    } else {
                        $(this).append('<span class="icon ' + icon + '"></span>');
                    }
                }
                
                //如果按钮有这个属性，则去掉跳转跟高亮等属性
                if (disabled == 'ture' || disabled == 'disabled') {

                }
            }
            
            if (badges != undefined) {
            	if( $(this).find("span.badges").length ){
            		//do nothing
            		$(this).find("span.badges").html(badges) ;
            	}else{
            		 $(this).append('<span class="badges">' + badges + '</span>');
            	}
            }else{
            	$(this).find("span.badges").remove() ;
            }
            
            $(this).attr('data-status', 1);

            //是否跳转            
            if (url != undefined && url != '') {
                if (urlArg != undefined && urlArg != '') {
                    $(this).bind('tap', function (e) {
                    	//urlArg获取到的是json字符串
                    	var args=eval('(' + urlArg + ')');
                        ui.load({ url: url, params:args.params||args,slideType:args.slideType,progress:args.progress});
                        e.stopPropagation();
                    });
                    
                    
                } else {
                    $(this).bind('tap', function (e) {
                        ui.load({url: url, slideType:'left'})
                        e.stopPropagation();
                    });
                }
            }

            //如果 mousedown=false 就取消默认点击高亮事件
            if (mousedown == null || mousedown != 'false') {
                ui.bindTouchStart(this);
            }
            //如果 mouseup=false 就默认点击高亮  
            if (mouseup == null || mouseup != 'false') {
            	//if( mouseup !=null) alert(mouseup);
                ui.bindTouchEnd(this);
            }
        });
    });
})();

/*
* btngroup.js
* */
$.uiwidget.register(function (target) {
    $('div[data-role="BTSwitchs"] >[data-role=BTButton]', target).btbutton("off", 'touchstart touchend');
    //btn-group	
    $('div[data-role="BTSwitchs"]>[data-role=BTButton]', target).bind('tap', function (e) {
        $(this).addClass('btn-active').siblings().removeClass('btn-active');
        e.stopPropagation();
    })
});

/*
* check.js
* */
/**
  表单元素、日期组件等调用接口
  @class ui
*/
$.bt("check", {

    val: function (data,callback) {
		var len = arguments.length;
	    //参数大于0，即为设值操作
		/**
		  设置checkbox值，<font color='red'>这个方法会先将所有checkbox清空，再根据data参数勾选。<br/>
		  此方法提供给BingoTouch定义的checkbox</font>
		  @method $(selector).btcheck('val',data,callback)
		  @param data {string|Array} 需要选中的checkbox的value，可传入单个字符串或字符串数组
		  @param callback {Function} 状态改变<font color='red'>前</font>的操作,当callback返回true时，状态才允许被改变		  
		  @return {Object} 返回当前链式对象
		  @chainable
		  @example
			HTML:
				<div data-role="BTCheck" id="checkg" name="csex" value="girl">女</div>
				<div data-role="BTCheck" id="checkb" name="csex" value="boy">男</div>
				<div data-role="BTCheck" id="checkz" name="csex" value="rao">中</div>
			JS:
				//设置选中,checkbox的value为["boy","rao"]会被选中
				$("div[name='csex']").btcheck('val',["boy","rao"],function(obj,data){
					//这里做改变状态之前的操作...........
					//obj  selector的DOM对象，data 是传入data参数
					//return true 允许改变状态 ，return  false不允许改变状态
					return true;
				}); 
				//也可以这样设值
				$("div[name='csex']").btcheck('val',"rao")
		 */		
		if(len > 0){
			var bool = callback ? callback(this, data) : true;//状态改变前的操作，决定是否改变状态
			//主动JS设置
			if(data!=null){		
				if (bool == true) {
					var objs = this, dt ;			
					var isArray =typeof data =="object" ? true : false;
					if(!isArray){  dt = []; dt.push(data);  }
					else { dt = data ; }
				
					$(objs).each(function (index ,obj){
						$(obj).removeClass('BTCheck_ON').addClass('BTCheck_OFF');
					});	 
					for(var i=0 ;i< dt.length ;i++){
						$(objs).each(function (index ,obj){
							if($(obj).attr("value")==dt[i]){
								$(obj).removeClass('BTCheck_OFF').addClass('BTCheck_ON');				
							}	
						});	
					}
				}
			}else{
				var btCheck_ON = $(this).hasClass('BTCheck_ON');	
				if (bool == true) {
					if (!btCheck_ON) {
						$(this).removeClass('BTCheck_OFF').addClass('BTCheck_ON');
					}
					if (btCheck_ON) {
						$(this).removeClass('BTCheck_ON').addClass('BTCheck_OFF');
					}
				}							
			}
			return $(this);		
		}
		/**
		  获取checkbox值，<font color='red'>此方法提供给BingoTouch定义的checkbox</font>
		  @method $(selector).btcheck('val')
		  @return {Object} checkbox选中值  ⇒ null | {value:'',label:''} | [{value:'',label:''} ,{value:'',label:''}]
		  @example
			HTML:
				<div data-role="BTCheck" id="checkg" name="csex" value="girl">女</div>
				<div data-role="BTCheck" id="checkb" name="csex" value="boy">男</div>
				<div data-role="BTCheck" id="checkz" name="csex" value="rao">中</div>
			JS:
				//建议这种取值方式
				//return  [{"value":"girl","label":"女"},{"value":"boy","label":"男"}]
				$("div[name='csex']").btcheck('val')
				//也可以这样取值
				//return  [{"value":"boy","label":"男"}]
				$("#checkb").btcheck('val')
		 */	
		else{
			var result =[];
			$(this).each(function (index, obj) {
			  var $obj = $(obj);
			  if($obj.hasClass('BTCheck_ON')){
			     var res ={};
				 res.value = $obj.attr("value");
				 res.label = $obj.text();
				 result.push(res);	 
			  }
			});
		    return result;
		}
    }
});

$.uiwidget.register("BTCheck", function (selector) {
	selector.each(function(index, item){
		var callback = $(this).attr('callback');
		callback = callback?eval("("+callback+")"):function(){return true;} ;
		$(this).unbind().bind('tap', function (e) {
		        $(this).btcheck('val',null,callback);
		        e.stopPropagation();
		 });
	}) ;
});

/*
* checkbox.js
* */
$.bt("checkbox", {
    off: function (event) {
        return ui._off(this, event, 'BTCheckbox');
    }
});

/*
* collapse.js
* */
$.uiwidget.register(function (target) {
    //collapse的点击事件
    $('.collapse-header > [data-role=BTButton]', target).bind('tap', function () {
        $(this).toggleClass('btn-active');
        $(this).find('.icon').toggleClass('icon-minus');
        $(this).parent().next().toggle();
    })
    $('.collapse.show', target).find('.collapse-header [data-role=BTButton]').addClass('btn-active')
							.find('.icon').toggleClass('icon-minus');
});


/*
* select.js
* */
$.bt("select", {

    val: function (data,callback) {
		var len = arguments.length;
	    //参数大于0，即为设值操作
		/**
		   设置select值，<font color='red'>此方法提供给BingoTouch定义的select</font>
		  @method $(selector).btselect('val',data,callback)
		  @param data {JSON对象} 设置的值 ⇒ {value:'',label:''}
		  @param callback {Function} 状态改变<font color='red'>前</font>的操作,当callback返回true时，状态才允许被改变		  
		  @return {Object} 返回当前链式对象
		  @chainable
		  @example
			HTML:
				<div id="BTSelect" data-role="BTSelect"   value="" name="selectsex" data='[{"value":"female","label":"女"},{"value":"male","label":"男"}]' title="请选择性别"><span>请选择性别</span></div>
			JS:		
				//设置选中，参数格式{value:'',label:''}
				$("#BTSelect").btselect('val',{value:'female',label:'女'},function(obj,data){
					//这里做改变状态之前的操作...........
					//obj  selector的DOM对象，data 是传入data参数
					//return true 允许改变状态 ，return  false不允许改变状态
					return true;
				});
		 */
		if(len > 0){
			var obj = this;
			var bool = callback ? callback(obj, data) : true;
			if(bool){
				//保存进data属性	
				var json =typeof data =="object"?data:$.parseJSON(data);
				var value =json.key||json.value;
				var label = json.label||json.value;
				$(obj).attr('value', value).find('span').text(label);
			}
			return $(obj);		
		}
		/**
		  获取select值， <font color='red'>此方法提供给BingoTouch定义的select</font>
		  @method $(selector).btselect('val')
		  @return {JSON对象} select选中值  ⇒ {value:'',label:''}
		  @example
			HTML:
				<div id="BTSelect" data-role="BTSelect"   value="" name="selectsex" data='[{"value":"female","label":"女"},{"value":"male","label":"男"}]' title="请选择性别"><span>请选择性别</span></div>
			JS:			  
				//return {"value":"female",label:"女"}
				$("#BTSelect").btselect('val')
		 */			
		else{
			var $obj = $(this);
			var res = {};
			res.value = $obj.attr('value') == undefined ? '' : $obj.attr('value');
			res.label = $obj.text() == undefined ? '' : $obj.text();
			return res;		
		}
    },
    off: function (event) {
        return ui._off(this, event, 'BTSelect');
    }
});

$.uiwidget.register( function (target) {
	$('div[data-role=BTSelect],div[data-role=BTButton][type="select"]', target).each(function(){
		
		var attrType = $(this).attr("type") ;
		if( attrType && attrType != 'select' ) return ;
		
		var self = this;
		//选中以后的数据
		var data =  eval($(this).attr('data'));
		var value = $(this).attr('value');
		var title = $(this).attr('title');
		var callback = $(this).attr('callback');
		callback = callback?eval("("+callback+")"):function(){return true;} ;
		
		if(!data) return;

		if(data[0].label!=null){
			for(var i=0;i<data.length;i++ ){
				data[i].key =data[i].value;
				data[i].value = data[i].label;
			}
		}
		
		var selected = null ;
		for(var i=0;i<data.length;i++ ){
			if(value == data[i].key){
				selected = data[i] ;
			}
		}
		if(value == undefined || value == ''){
		}else {
			$(self).btselect('val',selected,callback) ;
		}
		
		$(this).unbind('tap').bind('tap',function(e){
			if(value == undefined || value == ''){
				app.wheelSelect.oneSelect(data,function(res){ 
					//设置Select的值
					$(self).btselect('val',res,callback) ; 
					value = res.value;
				},data[0].key,title);
			}else {
				app.wheelSelect.oneSelect(data,function(res){ 
					//设置Select的值
					$(self).btselect('val',res,callback) ;
					value = res.value;
				},value,title);
				
				//$(self).btselect('val',selected,callback) ;
			}
		});
		
	}) ;
	
	//每个select date 的点击效果
	$('div[data-role="BTSelect"]', target).bind('touchstart', function () {
		$(this).addClass('btn-active');
	}).bind('touchend', function () {
		$(this).removeClass('btn-active');
	});	
});


/*
* datepicker.js
* 
* */
//select
$.bt("datepicker", {

    val: function (data, callback) {
		var len = arguments.length;
	    //参数大于0，即为设值操作
		/**
		   设置日期或时间，<font color='red'>此方法提供给BingoTouch定义的datepicker</font>
		  @method $(selector).btdatepicker('val',data,callback)
		  @param data {string} 设置的日期或时间值 ⇒ "2013-9-4" | "10:04"
		  @param callback {Function} 状态改变<font color='red'>前</font>的操作,当callback返回true时，状态才允许被改变		  
		  @return {Object} 返回当前链式对象
		  @chainable
		  @example
			HTML:
				<div id="BTDate" data-role="BTSelect" value="" name="date" data='2013-4-3' type="date"><span>请选择日期</span></div>
				<div id="BTTime" data-role="BTSelect" value="" name="time" data='16:29' type="time"><span>请选择时间</span></div>		 
			JS:
				//设置日期
				$("#BTDate").btdatepicker('val',"2013-2-30",function(obj,data){
					//obj  selector的DOM对象，data 是传入data参数
					//return true 允许改变状态 ，return  false不允许改变状态
					return true;
				});
				//设置时间
				$("#BTTime").btdatepicker('val',"10:30");
		 */
		if(len > 0){
			var obj = this;
			var bool = callback ? callback(obj, data) : true;
			if(bool){			
				$(obj).attr('value',data).find('span').text(data);
			}
			return $(obj);				
		}
		/**
		  日期或时间的取值，<font color='red'>此方法提供给BingoTouch定义的datepicker</font>
		  @method $(selector).btdatepicker('val')
		  @return {string} datepicker选中值  
		  @example
			HTML:
				<div id="BTDate" data-role="BTSelect" value="" name="date" data='2013-4-3' type="date"><span>请选择日期</span></div>
				<div id="BTTime" data-role="BTSelect" value="" name="time" data='16:29' type="time"><span>请选择时间</span></div>		 
			JS:
				//日期和时间的取值都是使用这个方法
				//return  "2013-9-4"
				$("#BTDate").btdatepicker('val');
				//return  "10:4"
				$("#BTTime").btdatepicker('val');
		 */
		else{
			var $obj = $(this);
			return $obj.attr('value');		
		}

    }
});

$.uiwidget.register(function (target) {
    //如果有初始值就把值替换原来的文本提示
    var obj = "div[data-role='BTSelect'][type='date'],div[data-role='BTSelect'][type='wheeldate'],div[data-role='BTSelect'][type='time'],div[data-role='BTSelect'][type='wheeltime'],div[data-role='BTButton'][type='date'],div[data-role='BTButton'][type='wheeldate'],div[data-role='BTButton'][type='time'],div[data-role='BTButton'][type='wheeltime']";
    
    $(obj, target).each(function () {
    	var callback = $(this).attr('callback');
		callback = callback?eval("("+callback+")"):function(){return true;} ;
    	
        var value = $(this).attr('data');
        if (value != undefined && value != '') {
			$(this).btdatepicker('val',value,callback);
        }
       
		$(this).unbind('tap').bind('tap', function (e) {
			
			//选中以后的数据 {"year":2013,"month":4,"day":3,"full":"2013-4-3"}
			var self = this;
			var type = $(this).attr('type'); //日期还是时间
			var value = $(this).attr('value');
			var format = $(this).attr('format');
			var action = null;
			if (type == 'date') {
				action = 'selectDate';
			} else if (type == 'wheeldate') {
				action = 'wheelSelectDate';
			} else if (type == 'time') {
				action = 'selectTime';
			} else if (type == 'wheeltime') {
				action = 'wheelSelectTime';
			}
			
			__datepicker(value, action, type, format);

			function __datepicker(value, action, type, format) {
				
				//alert(value + ":" + action + ":" + type + ":" + format);
				if (value == undefined || value == '') {
					app.dateTimePicker[action](function (res) {

						var fVal = ui.Utils.getFormatDatePickerValue(type, res, format);
						//设置Select的值
						$(self).btdatepicker('val',fVal, callback);
					}, null, format);

				} else {
					var defaultValue = ui.Utils.getDefaultDatePickerValue(type, value, format);
					//alert(JSON.stringify(defaultValue));
					app.dateTimePicker[action](function (res) {
						
						var fVal = ui.Utils.getFormatDatePickerValue(type, res, format);
						//设置Select的值
						$(self).btdatepicker('val', fVal ,callback);
					}, defaultValue, format);
				}
			}
			//设置Select的值
			//ui.setDatepickerValue(this,data);
			//获取Select值的json对象
			//alert(ui.getDatepickerValue(this));

			e.stopPropagation();
		})
    });
	
    //每个select date 的点击效果
    $('div[data-role="BTDate"]', target).bind('touchstart', function () {
        $(this).addClass('btn-active');
    }).bind('touchend', function () {
        $(this).removeClass('btn-active');
    });

});

/*
* dropdown.js
* */
$.bt("dropdown", {

    val: function (data, callback) {
	    var len = arguments.length;
	    //参数大于0，即为设值操作
		/**
		   设置下拉菜单值，<font color='red'>此方法提供给BingoTouch定义的dropdown</font>
		  @method $(selector).btdropdown('val',data,callback)
		  @param data {string} 设置的下拉菜单值 
		  @param callback {Function} 状态改变<font color='red'>前</font>的操作,当callback返回true时，状态才允许被改变		  
		  @return {Object} 返回当前链式对象
		  @chainable
		  @example
			HTML:
				<div class="dropdown" data-menupos="top" date-inline='true'>
					<div data-role="BTButton" id="BTDropdown" data-theme="a" data-icon="icon-list-down" data-iconpos="right" align="center"  name="dropdownBT">下拉菜单</div>
					<ul class="list-view" data-theme="b" data-corner="all">
						<li><div data-role="BTButton" align="center">Button1</div></li>
						<li><div data-role="BTButton" align="center">Button2</div></li>
						<li><div data-role="BTButton" align="center">Button3</div></li>
						<li><div data-role="BTButton" align="center">Button4</div></li>
					</ul>
				</div>
			JS:
				$("#BTDropdown").btdropdown('val',"我是设置",function(obj,data){
					//这里做改变状态之前的操作...........
					//obj  selector的DOM对象，data 是传入data参数
					//return true 允许改变状态 ，return  false不允许改变状态
					return true;
				});
		 */
		if(len > 0){
			var obj = this;
			var bool = callback ? callback(obj, data) : true;
			if(bool){
				$(obj).find('.btn-text').text(data);
			}
			return $(obj);		
		}
		/**
		  下拉菜单取值，<font color='red'>此方法提供给BingoTouch定义的dropdown</font>
		  @method $(selector).btdropdown('val')
		  @return {string} dropdown选中值   
		  @example
			HTML:
				<div class="dropdown" data-menupos="top" date-inline='true'>
					<div data-role="BTButton" id="BTDropdown" data-theme="a" data-icon="icon-list-down" data-iconpos="right" align="center"  name="dropdownBT">下拉菜单</div>
					<ul class="list-view" data-theme="b" data-corner="all">
						<li><div data-role="BTButton" align="center">Button1</div></li>
						<li><div data-role="BTButton" align="center">Button2</div></li>
						<li><div data-role="BTButton" align="center">Button3</div></li>
						<li><div data-role="BTButton" align="center">Button4</div></li>
					</ul>
				</div>
			JS:
				//return "下拉菜单"
				$("#BTDropdown").btdropdown('val')
		 */		
		else{
		    return $(this).find('.btn-text').text();
		}
    },
    off: function (event) {
        var obj = this;
        $(obj || '.dropdown > div[data-role=BTButton]').unbind(event || 'tap');
        return obj;
    }
});

$.uiwidget.register(function (target) {
    $('.dropdown > div[data-role="BTButton"]', target).append('<span class="angle"></span>');
    //点击切换隐藏下拉菜单
    $('.dropdown > div[data-role="BTButton"]', target).unbind().bind('tap', function (e) {
        $(this).toggleClass('btn-active');
        $(this).find('.angle').toggle();
        $(this).next().toggle();
        e.stopPropagation();
    });
    $('.dropdown > ul div[data-role="BTButton"]', target).bind('tap', function (e) {
    	
    	var callback = $(this).closest(".dropdown").attr('callback');
		callback = callback?eval("("+callback+")"):function(){return true;} ;
    	

        var obj = $(this).parents('ul').prev();
        var value = $(this).find('.btn-text').text();

        $(obj).btdropdown('val', value,callback);
        //alert(ui.getDropdownValue(obj))

        $('.dropdown ul').hide();
        $('.angle').hide();
        obj.removeClass('btn-active');

        e.stopPropagation();
    });
});

/*
* list.js
* */
$.uiwidget.register(function (target) {
    //list-view
    $('.list-view li > [data-role=BTButton]', target).bind('tap', function (e) {
        $(this).parent().siblings()
			.find('[data-role=BTButton]').removeClass('btn-active');
        //e.stopPropagation();
    })

    //list-collapse 
    $('.list-collapse > li > [data-role=BTButton]', target).unbind().bind('tap', function () {
        $(this).toggleClass('btn-active')
				.parent().siblings().find('[data-role=BTButton]')
						.removeClass('btn-active');
    })
    //取消绑定头部的事件
    $('.list-collapse.list-view-head > li:first-child > [data-role=BTButton]', target).unbind();
    //list-collapse data-multipe="true"
    $('.list-collapse[data-multiple="true"] > li > [data-role=BTButton]', target).unbind().bind('tap', function () {
        $(this).toggleClass('btn-active');
    });
});

/*
* navbar.js
* */
$.uiwidget.register(function (target) {
    //关闭touchmstart 跟 touchend 事件
    var button = $('.navbar > ul > li >[data-role=BTButton]', target);
    button.btbutton('off', 'touchstart touchend');
    //navbar
    $('.navbar > ul > li ,.navbar table tr td ', target).bind('tap', function (e) {
        $(this).siblings()
			.find('[data-role=BTButton]').removeClass('btn-active');
        $(this).find('[data-role=BTButton]').addClass('btn-active');
        e.stopPropagation();
    });
    if ($('.navbar .sonmenu', target).length > 0) {
        $('.navbar > ul', target).each(function () {
            //有下拉菜单时，动态添加三角形图标,默认隐藏

            $(this).find('ul').hide().prev().append('<span class="angle"></span>');
            $(this).find('.angle').hide();
        });
        //一级菜单点击
        $('.navbar > ul > li >[data-role="BTButton"]', target).bind('tap', function (e) {

            $(this).parent().siblings().find('[data-role="BTButton"]').removeClass('btn-active');
            $(this).addClass('btn-active');
            $('.angle').hide();
            $('ul.sonmenu').hide();
            
            $(this).find('.angle').show() ;
            $(this).next().show();
            
           // $(this).find('.angle').show().end().next().show();
            e.stopPropagation();
        })
        //二级菜单点击			
        $('.sonmenu [data-role="BTButton"]', target).bind('tap', function (e) {
            $('.sonmenu').hide().prev().find('.angle').hide();
            e.stopPropagation();
        })
    }

    $('body').tap(function () {
        $('.sonmenu').hide().prev().find('.angle').hide();
    });
});

/*
* radio.js
* */
//radio
$.bt("radio", {
      
    val: function (data,callback) {
		var len = arguments.length;
	    //参数大于0，即为设值操作
		/**
		  设置radio值，<font color='red'>此方法提供给BingoTouch定义的radio</font>
		  @method $(selector).btradio('val',data,callback)
		  @param data {string} 需要选中的radio的value
		  @param callback {Function} 状态改变<font color='red'>前</font>的操作,当callback返回true时，状态才允许被改变		  
		  @return {Object} 返回当前链式对象
		  @chainable
		  @example
			HTML:
				<div data-role="BTRadio" name="rsex"  id="radioboy" class="BTCheck_ON" value="boy">男</div>
				<div data-role="BTRadio" name="rsex"  id="radiogirl" value="girl">女</div>
			JS:
				$("div[name='rsex']").btradio('val',"boy",function(obj,data){
					//这里做改变状态之前的操作...........
					//obj  selector的DOM对象，data 是传入data参数
					//return true 允许改变状态 ，return  false不允许改变状态
					return true;
				});
		 */		
		if(len > 0){
			var objs = this;
			var bool = callback ? callback(objs,data) : true;
			if (bool == true) {
				$(objs).each(function (index, obj) {
					if($(obj).attr('value')==data){
						var name = $(obj).attr('name');		
						if (!$(obj).hasClass('BTCheck_ON')) {
							$('div[data-role="BTRadio"][name="' + name + '"]').removeClass('BTCheck_ON');
							$(obj).addClass('BTCheck_ON');
						}			
					}
				});
			}
			return $(objs);		
		}
		/**
		  获取单选框值，<font color='red'>此方法提供给BingoTouch定义的radio</font>
		  @method $(selector).btradio('val')
		  @return {JSON对象} radio选中值  | {value:'',label:''}
		  @example
			HTML:
				<div data-role="BTRadio" name="rsex"  id="radioboy" class="BTCheck_ON" value="boy">男</div>
				<div data-role="BTRadio" name="rsex"  id="radiogirl" value="girl">女</div>
			JS:		  
				//建议这样获取radio值
				//return  {"value":"girl","label":"女"}
				$("div[name='rsex']").btradio('val')
				//获取id为radioboy的radio的值，如果被选中，则返回{value:'',label:''}，如果未被选中，则返回null
				//return  {"value":"boy","label":"男"}
				$("#radioboy").btradio('val');
		 */				
		else{
			var res = null;
			$(this).each(function (index, obj) {
			  var $obj = $(obj);
			  if($(obj).hasClass('BTCheck_ON')){
			     res ={};
				 res.value = $obj.attr("value");
				 res.label = $obj.text();
			  }
			});
			return res;
		}
    },
    off: function (event) {
        return ui._off(this, event, 'BTRadio');
    }
});

$.uiwidget.register("BTRadio", function (selector) {
    selector.unbind().bind('tap', function (e) {
    	var callback = $(this).attr('callback');
		callback = callback?eval("("+callback+")"):function(){return true;} ;
        $(this).btradio('val',$(this).attr("value"),callback);
        e.stopPropagation();
    });
});

/*
* switch.js
* */
$.bt("switch", {

	val: function (data,callback){
	    var len = arguments.length;
	    //参数大于0，即为设值操作
		/**
		  设置switch值，<font color='red'>此方法提供给BingoTouch定义的switch</font>
		  @method $(selector).btswitch('val',data,callback)
		  @param data {boolean} switch值   true |　false
		  @param callback {Function} 状态改变<font color='red'>前</font>的操作,当callback返回true时，状态才允许被改变		  
		  @return {Object} 返回当前链式对象
		  @chainable
		  @example
			HTML:
				<div  id="btswitch" name="switchB" class="BTCheck_OFF" data-role="BTSwitch" ></div>
			JS:
				//设置为开
				$("#btswitch").btswitch('val',true,function(obj,data){
					//这里做改变状态之前的操作...........
					//obj  selector的DOM对象，data 是传入data参数
					//return true 允许改变状态 ，return  false不允许改变状态
					return true;
				});
		 */	
		if(len > 0){
			var obj = this;
			var btCheck_ON = $(obj).hasClass('BTCheck_ON');
			var bool = callback ? callback(obj ,data) : true;
			if (bool == true) {
				if(data!=null){
					if (data) {
						$(obj).removeClass('BTCheck_OFF').addClass('BTCheck_ON');
					} else if (btCheck_ON) {
						$(obj).removeClass('BTCheck_ON').addClass('BTCheck_OFF');
					}				
				}else{
					if (!btCheck_ON) {
						$(obj).removeClass('BTCheck_OFF').addClass('BTCheck_ON');
					} else if (btCheck_ON) {
						$(obj).removeClass('BTCheck_ON').addClass('BTCheck_OFF');
					}				
				}
			}
			return $(obj);		   		
		}
		//取值操作
		/**
		  获取switch值， <font color='red'>此方法提供给BingoTouch定义的switch</font>
		  @method $(selector).btswitch('val')
		  @return {boolean} switch值   true |　false
		  @example
			HTML:
				<div  id="btswitch" name="switchB" class="BTCheck_OFF" data-role="BTSwitch" ></div>
			JS:
				//return  true
				$("#btswitch").btswitch('val')
		 */		
		else{				
			if ($(this).hasClass('BTCheck_ON')){
				return  true;
			}else{
				return  false;
			}
		}
	},
    off: function (event) {
        return ui._off(this, event, 'BTSwitch');
    }
});

$.uiwidget.register("BTSwitch", function (selector) {
    selector.unbind().bind('tap', function (e) {
    	var callback = $(this).attr('callback');
		callback = callback?eval("("+callback+")"):function(){return true;} ;
        $(this).btswitch('val',null,callback);
        e.stopPropagation();
    });
});


/*
 * iscroll初始化
 */
$.uiwidget.register(function ( target) {
	var $iscrollWrapper = $(".iscroll-wrapper", target);
	if($iscrollWrapper.length){
		$(".iscroll-wrapper", target).each(function(i, elem){
	  		 ui.IScroll.init(this); 
		});
	} else{
		var $formcontent = $(".content.formcontent", target);
		if($formcontent.length){
			if(window.devicePlatform == 'android'){
				var contentHeight = $(window).height() - $(".header", target).height() - $(".footer", target).height();
				$formcontent.height(contentHeight).css("overflow-y", "auto");				
			} 
			//ios允许使用iscroll
			else {
				ui.IScroll.init(this); 
			}

		}
		/*document.addEventListener("hidekeyboard", onHide, false);
        document.addEventListener("showkeyboard", onShow, false);

        function onShow(){
        	$(".footer", target).hide();
        }
        function onHide(){
        	$(".footer", target).show();
        }*/
	}
}); 
/*
 * page转场动画
 * 可自定义css动画
 */
;ui.Transition = (function($){
    var isBack,$current,$target,transitionName, animationCallback,
        animationClass = {
        //[[currentOut,targetIn],[currentOut,targetIn]]
        slide : [['slideLeftOut','slideLeftIn'],['slideRightOut','slideRightIn']],
        cover : [['','slideLeftIn'],['slideRightOut','']],
        slideUp : [['','slideUpIn'],['slideDownOut','']],
        slideDown : [['','slideDownIn'],['slideUpOut','']],
        popup : [['','scaleIn'],['scaleOut','']],
        flip : [['slideLeftOut','flipOut'],['slideRightOut','flipIn']],
        none :[['',''],['','']]
        };

    var _doTransition = function(){
      
        var c_class = transitionName[0]||'empty' ,t_class = transitionName[1]||'empty';
        
        $current.addClass('anim '+ c_class);
        $target.bind('webkitAnimationEnd', _finishTransition).addClass('anim animating '+ t_class);
    }
    var _finishTransition = function() {
        $current.off('webkitAnimationEnd');
        $target.off('webkitAnimationEnd');
        //reset class
        $current.attr('class','');
        $target.attr('class','active');

        animationCallback && animationCallback();
        ui.isPageSwitching = false; //页面切换结束
        $current = $target = null;//释放
    }

    /*
     * 执行转场动画，动画类型取决于目标page上动画配置(返回时取决于当前page)
     * @param current 当前page
     * @param target  目标page
     * @param back  是否为后退
     * @param animation 是否进行动画
     * @param callback 动画回调
     */
    var run = function(current,target,back, animation, callback){
        //关闭键盘
        $(':focus').trigger('blur');
        isBack = back;
        $current = $(current);
        $target = $(target);
        var type = isBack?$current.attr('data-transition'):$target.attr('data-transition');
        type = type|| ui.settings.transitionType;
        //后退时取相反的动画效果组
        transitionName  = isBack ? animationClass[type][1] : animationClass[type][0];

        if(!animation){
            transitionName = [];
        }
        animationCallback = callback;

        _doTransition();
    }

    /*
     * 添加自定义转场动画效果
     * @param name  动画名称
     * @param currentOut 正常情况下当前页面退去的动画class
     * @param targetIn   正常情况下目标页面进入的动画class
     * @param backCurrentOut 后退情况下当前页面退去的动画class
     * @param backCurrentIn 后退情况下目标页面进入的动画class
     */
    var addAnimation = function(name,currentOut,targetIn,backCurrentOut,backCurrentIn){
        if(animationClass[name]){
            console.error('该转场动画已经存在，请检查你自定义的动画名称(名称不能重复)');
            return;
        }
        animationClass[name] = [[currentOut,targetIn],[backCurrentOut,backCurrentIn]];
    }
    return {
        run : run,
        add : addAnimation
    }

})(Zepto);
;ui.Page = (function(){

 	var _history = [], sectionEventCache = {}, _currentSection = {}, _pageStatus = {},
        //上次section事件
        prevSectionEvent = {
            onReady :null,
            onLoad : null,
            onBack : null 
        };
	var init = function(){
 		var $section = $('#section_container section').first();
        var indexHash = '#'+$section.attr('id');
        _add2History({
        	tag : indexHash
        },true);

        app.section = {
            onReady :$.noop,
            onLoad : $.noop,
            onBack : $.noop 
        }

        app.getSectionParams = function(){
            return _currentSection.params;
        }
	}

    var _pageCanSwitch = function (){
        if(ui.isPageSwitching){
            return false;
        } else{
            ui.isPageSwitching = true;
            return true;
        }
    }


	//加载页面
	var load = function(options){

		if(ui.settings.appType == 'single'){
            if(!_pageCanSwitch()) return;

            delete options.progress;
            delete options.slideType;

            if(ui.hasMenuOpen){//关闭菜单后再转场
                ui.Menu.hide(200,function(){
                    _router(options);
                    //_showSection(options, true);
                });  
                return;         
            }
            _router(options);
            //_showSection(options, true);
            
        } else {
        	app.load(options);
        }
	}

   /*
     * 后退
     */
    var back = function(pageNumber){
        if(ui.settings.appType == 'single' && _history.length > 1 ){

            var res =  sectionEventCache[_history[0].tag].onBack && sectionEventCache[_history[0].tag].onBack();
            if(res === false) { return; }
            
            if(ui.hasMenuOpen || !_pageCanSwitch()) return;

            var current = _history.shift();

            //退到某特定页码
            if(pageNumber < _history.length ){ //合理页码 
                var popNumber = _history.length - 1 - pageNumber;
                if(popNumber > 0 ){
                    while(popNumber){
                        var delHistory = _history.shift();
                         GC.destroy(delHistory.tag.replace("#",""));//垃圾回收
                        _removeHistoryDom(delHistory.tag);//清除旧页面DOM
                        popNumber--;
                    }
                }
            }

            _changePage(current.tag, _history[0].tag,true, true, function(){

                GC.destroy(current.tag.replace("#",""));//垃圾回收
                _removeHistoryDom(current.tag);//清除旧页面DOM
                _resumePageStatus(_history[0].tag); //页面状态恢复
            });

            //$(current.tag).trigger("pageBack", [current]);
            delete sectionEventCache[current.tag];
            _currentSection = _history[0];
        } else{
            app.back();
        }
    }

    /*
      * 刷新
      */
    var refresh = function(){     
        if(ui.settings.appType == 'single' && _history.length > 1 ){
            if(!_pageCanSwitch()) return;
            var current =  _history.shift();
            GC.destroy(current.tag.replace("#",""));//垃圾回收
            _showSection(current, false);
        } else {
            app.refresh();
        }
    }

    /*
    * 路由控制
    */
    var _router = function(options){
        var isRemoteUrl = /^https?:\/\//.test(options.url);
        if(isRemoteUrl){
           window.open(options.url,"_blank","location=yes"); //open打开远程页面
           ui.isPageSwitching = false;
        } else {
            _showSection(options, true);
        }
    }


	/*
     * 跳转到新页面
     * @param hash 新page的'#id'
     */
    var _showSection  = function(options, animation){
 	
 	 	var current = _history[0];
    	options.tag =  "#" + _getTag(options.url);
        
        //同一个页面,则不重新加载
        if(current.tag === options.tag){
            return;
        }
        //加载模板
        loadSectionTpl(options,function(){

            //页面状态保存
           _savePageStatus(current.tag);
            //卡片页跳转动画
           _changePage(current.tag, options.tag, false, animation);

           _add2History(options);
           //$(options.tag).trigger('pageLoad', [options]); // 页面动画效果结束
           sectionEventCache[options.tag].onLoad && sectionEventCache[options.tag].onLoad(options.params);
                

        });
    }

    var _getTag = function(url){
    	var _dIndex = url.lastIndexOf("."),
    	    _gIndex = url.lastIndexOf("/");
    	if(_dIndex > -1 ){
    		return url.substring(_gIndex + 1, _dIndex);
    	} else{
    		return url.substring(_gIndex + 1);
    	}
    }

    var _changePage = function(current,target,isBack, animation, callback){
        ui.Transition.run(current,target,isBack, animation, callback);
    }

    var _add2History = function(hashObj){

        _history.unshift(hashObj);
    }

    //捕获section页的事件
    var _catchSectionEvent = function(options){
        if(!sectionEventCache[options.tag]){
            sectionEventCache[options.tag] = {};
        } 

        if(prevSectionEvent.onReady != app.section.onReady){
            sectionEventCache[options.tag].onReady = prevSectionEvent.onReady = app.section.onReady;
        } 

        if(prevSectionEvent.onLoad != app.section.onLoad){
            sectionEventCache[options.tag].onLoad = prevSectionEvent.onLoad = app.section.onLoad;
        } 

        if(prevSectionEvent.onBack != app.section.onBack){
            sectionEventCache[options.tag].onBack = prevSectionEvent.onBack = app.section.onBack;
        } 
    }
    
	/*
     * 加载section模板
     * @param {string} hash信息
     * @param {string} url参数
     */
    var loadSectionTpl = function(options ,callback){

    	var url = options.url,
    	    params = options.params;
			
//2018年-03月-08日 dengzanqiang 注释此ui.load()跳转时，弹出(加载中...)窗不关闭的bug；
       // if(ui.settings.showPageLoading){
            //if(typeof Cordova == 'undefined') ui.showMask(ui.settings.showPageLoadingText, ui.settings.showPageLoadingIcon);
            //else app.progress.start('',ui.settings.showPageLoadingText);
      //  }

        loadContent(url,params,function(html){

            $(options.tag).remove();//主要是为了ui.refresh()  
            //添加到dom树中
            var $h = $(html);
            $('#section_container').append($h);
 
            $h.filter("section").addClass('active'); //不然aside块也是active
            _catchSectionEvent(options);
            _currentSection = options;
            //$h.trigger('pageReady', [options]); // 页面DOM加载完成
            sectionEventCache[options.tag].onReady && sectionEventCache[options.tag].onReady(options.params);

            $h.uiwidget(); //初始化

            if(ui.settings.showPageLoading){
                if(typeof Cordova == 'undefined') ui.hideMask();
                else app.progress.stop();
            }
            callback();
            $h = null;
        });
    }

    var _removeHistoryDom = function(tag){
		_removeAside($(tag)); 
		 
        $(tag).remove();  
        $("#section_container>*").filter("script,style").remove();
    }
	
	function _removeAside($obj){
		var prev = $obj.prev("aside");
		if(prev.length > 0){
			_removeAside(prev);
			prev.remove();
		}   
	}

    /*
     * 加载文档片段
     * @param url
     */
    var loadContent = function(url,param,callback){
        return $.ajax({
                url : url + "?t=" + (new Date()).valueOf() , //加上时间戳，不缓存
                timeout : 20000,
                data : {},
                success : function(html){
                    if(html){
                        callback && callback(html);                       
                    } else{
                        _loadContentError({status:4}); //android下请求不存在的页面是success回调，-_-|||
                    }

                },
                error : function(e) {
                    _loadContentError(e);
                }
        });
    }

    var _loadContentError = function(e){

        ui.isPageSwitching = false;
        var errorType = (e.status + "").substring(0,1), errorMsg;
   
        switch(errorType){
            case '4' : 
                errorMsg = "页面不存在";
            break;
            case '5' :
                errorMsg = "服务器错误";
            break;
            case '3' : 
                errorMsg = "页面已重定向";
            break;
        }

        if( ui.settings.showPageLoading){
            if(typeof Cordova == 'undefined'){
                $("#bingotouch_popup").find("i,p").remove();
                $("#bingotouch_popup").prepend('<i class="icon icon-cancel"></i><p>' + errorMsg + '</p>');   
            } else{
               app.progress.stop();
               ui.showMask(errorMsg, "icon-cancel");  
            }

        } else {
            ui.showMask(errorMsg, "icon-cancel");  
        }

    }
    

    //保存页面状态
    //TODO:表单页面的状态并没有处理
    var _savePageStatus = function(tag){

        var iscrolls = GC.get(tag.replace("#",""), "iScroll");

        for (var i = iscrolls.length - 1; i >= 0; i -= 1) {
           iscrolls[i].animating = true;
        }
 
    }

    //恢复页面状态
    //TODO:表单页面的状态并没有处理
    var _resumePageStatus = function(tag){
       
        var iscrolls = GC.get(tag.replace("#",""), "iScroll");

        //恢复自动刷新
        for (var i = iscrolls.length - 1; i >= 0; i -= 1) {
           iscrolls[i].animating = false;
        }
    }


	return {
        history : _history, //页面堆栈
		init : init,
		load : load,
        refresh : refresh,
        back : back
	};

})();
 


 // //另一中页面事件声明的方式, 不过现在没启用
// ui.addPageEvent(sectionId ,function(){
//  //页面DOM加载完成
//  //页面信息
//  /*
//      options
//      tag: "#popup_section" 页面最外层容器的css选择器
//      url: 页面url
//      params : 页面传的参数 
//   */
//     this.pageReady = function(event, options){
//      // console.log(event);
//      // console.log(options);
//     }

//     //页面uiwidget完成
//     this.pageLoad = function(){

        
//     }

//     //页面后退
//     this.pageBack = function(){
//     }
// });
/*
 * IScroll extend
 * version : 3.0
 * refactor : lufeng
 * date : 2014-10-31
 */
/**
isroll组件
 @class ui.IScroll
*/
/**
    isroll组件初始化
    @method  ui.IScroll.init(selector, options)
    @param selector {selector|zepto} (必选) iscroll对象CSS选择器
    @param options {JSONObject} (可选) 参数，具体参数如下
    <ul>
    <li>scrollBar (Boolean):   是否出现滚动条 | 默认 false</li>
    <li>enablePullDown (Boolean):  是否允许下拉刷新 | 默认 false </li>
    <li>enablePullUp (Boolean):  是否允许上拉刷新  | 默认 false</li>
    <li>pullDownAction (Function):  下拉刷新调用方法 </li>
    <li>pullUpAction (Function):  上拉刷新调用方法</li>
    </ul>
    @example
		ui.IScroll.init(".pullrefresh-wrapper",{
		    scrollBar : true,                //是否出现滚动条
		    enablePullDown: true,            //是否允许下拉刷新
		    pullDownAction: pullDownActionDemo //下拉刷新调用方法
		});

		//refreshCallback必须执行，这是执行完业务逻辑之后IScroll状态刷新的回调。
		//例如是ajax请求，那这条语句就放在ajax的callback的最后一条。
		//PS:之所以要提供回调处理，是因为IScroll不知道业务逻辑什么时候结束
		function pullDownActionDemo(refreshCallback){
		    //setTimeout是为了模拟ajax请求数据的时间
		    setTimeout(function () {    
		        refreshCallback && refreshCallback(); 
		    }, 3500);              
		}
*/
;ui.IScroll = (function(){

	var defaults = {
		scrollBar : false,
		enablePullDown: false,
		enablePullUp:false,
		loadingLabel:"加载中...",
		flipLabel:"释放刷新",
		pullDownlabel:"下拉刷新",
	 	pullUplabel:"上拉显示更多",
	    pullDownAction:function(){},
		pullUpAction:function(){}		
	};

	var init = function(selector, options){
		var pullSettings = $.extend({}, defaults, options);
		var $iscrollWrapper = $(selector);
		if($iscrollWrapper.length){

			_uiRender($iscrollWrapper); 

     		var pullContainer = $iscrollWrapper.children();

			var pullDownEl, pullUpEl,
				pullDownOffset = pullUpOffset = 0,
			    _pervScroll = 0, isLoading = false;
			if(pullSettings.enablePullDown){
				var paddingTop = pullContainer.css("padding-top") || "";
            	paddingTop = paddingTop.replace("px", "");
				pullDownEl = $('<div class="pullDown"><span class="pullDownIcon"></span><span class="pullDownLabel">下拉刷新</span></div>').prependTo(pullContainer);
			    pullDownOffset = ( pullDownEl.height() || 51 )  - paddingTop; //提供一个默认值
			    pullDownEl.hide();
			}

			if(pullSettings.enablePullUp){
				pullUpEl = $('<div class="pullUp"><span class="pullUpIcon"></span><span class="pullUpLabel">上拉显示更多</span></div>').appendTo(pullContainer) ;
			    pullUpOffset =  ( pullUpEl.height()|| 51 );
			    pullUpEl.hide();
			}

			var myScroll = new iScroll($iscrollWrapper[0], {
			    hScrollbar: pullSettings.scrollBar, //是否显示水平滚动条  
				vScrollbar: pullSettings.scrollBar,
				checkDOMChanges: !(pullSettings.enablePullDown || pullSettings.enablePullUp) ,
				useTransition: false,
				topOffset: pullDownOffset,
				bounce : pullSettings.enablePullDown || pullSettings.enablePullUp ,
				//topOffset : pullDownOffset ,
				onBeforeScrollStart: function (e) {
                    var target = e.target;
                    while (target.nodeType != 1) target = target.parentNode;
					
                    if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
                        e.preventDefault();
                },
				onRefresh: function () {
					if( pullSettings.enablePullDown && pullDownEl.hasClass("loading")   ){
						pullDownEl.removeClass("loading") ;
						pullDownEl.find(".pullDownLabel").html( pullSettings.pullDownlabel ) ;
						//pullDownEl.hide();
					}else if(  pullSettings.enablePullUp && pullUpEl.hasClass("loading")   ){
						pullUpEl.removeClass("loading") ;
						pullUpEl.find(".pullUpLabel").html( pullSettings.pullUplabel ) ;
						//pullUpEl.hide();
					}
				},
				onScrollMove: function () {

					if(isLoading) { return; }

					
					if(window._keyboardIsShow){ //fix android键盘弹出时，滚不到最上或最下
						this.wrapper.scrollTop = 0;
						$(this.scroller).height(window._currentIscrollHeight + 1);			
					}
		
					
					if( pullSettings.enablePullDown ){
						pullDownEl.show();
					}
					
					if( pullSettings.enablePullUp ){
						pullUpEl.show();
					}
					
					if (pullSettings.enablePullDown && this.y > 5 && !pullDownEl.hasClass('flip') ) {

						pullDownEl.addClass("flip") ;
						pullDownEl.find(".pullDownLabel").html( pullSettings.flipLabel ) ;
						this.minScrollY = 0;
					} else if (pullSettings.enablePullDown && this.y < 5 && pullDownEl.hasClass('flip') ) {

						pullDownEl.show().removeClass("flip") ;
						pullDownEl.find(".pullDownLabel").html( pullSettings.pullDownlabel) ;
						this.minScrollY = -pullDownOffset;
					} else if (pullSettings.enablePullUp &&this.y < (this.maxScrollY - 5) && !pullUpEl.hasClass('flip')) {
						pullUpEl.addClass("flip") ;
						pullUpEl.find(".pullUpLabel").html( pullSettings.flipLabel ) ;			
						this.maxScrollY = this.maxScrollY;
					} else if (pullSettings.enablePullUp &&this.y > (this.maxScrollY + 5) && pullUpEl.hasClass('flip')) {
						pullUpEl.show().removeClass("flip") ;
						pullUpEl.find(".pullUpLabel").html( pullSettings.pullUplabel  ) ;
	
						//this.maxScrollY = pullUpOffset;
					}
				},
				onScrollEnd: function () {
					//阻止重复调用
					if(isLoading){ return; }

					if (pullSettings.enablePullDown&&pullDownEl.hasClass('flip')) {
						pullDownEl.addClass("loading") ;
						pullDownEl.find(".pullDownLabel").html( pullSettings.loadingLabel ) ;
						isLoading = true;		
					
						pullSettings.pullDownAction(refreshCallback) ;
					} else if (pullSettings.enablePullUp&&pullUpEl.hasClass('flip')  ) {
						pullUpEl.addClass("loading") ;
						pullUpEl.find(".pullUpLabel").html( pullSettings.loadingLabel ) ;
						isLoading = true;						

						pullSettings.pullUpAction(refreshCallback) ; 
					}
				}
			});
			
			//结束调用action之后的事情
			function refreshCallback(){
				pullDownEl && pullDownEl.removeClass("flip"); 
				pullUpEl && pullUpEl.removeClass("flip"); 
				myScroll.refresh();
				isLoading = false;
			}

			if( pullSettings.enablePullDown ){
				pullDownEl.show();
			}
			
			if( pullSettings.enablePullUp ){
				pullUpEl.show();
			}

			
			myScroll.destroyMe = function() {
				pullSettings = null;
				pullDownEl = null;
			    pullUpEl= null;
				pullDownOffset = null;
				pullUpOffset= null;
			    isLoading = null;
				myScroll.destroy();
			};

			GC&&GC.push([myScroll], "iScroll", $iscrollWrapper.closest("section")); 
		 	return myScroll;
		}
		return null;
	}

	function _uiRender($iscrollWrapper){
		$iscrollWrapper.addClass("iscroll-wrapper-clz") ;

		var $footer1 = $iscrollWrapper.next(".footer") ,
			$footer2 = $iscrollWrapper.closest("section").find(".footer"),
		    $header1 = $iscrollWrapper.prev(".header"),
			$header2= $iscrollWrapper.closest("section").find(".header");

		var $footer = $footer1.length ? $footer1 : $footer2,
			$header = $header1.length ? $header1 : $header2;

		if($footer.length){
			$iscrollWrapper.css("bottom", $footer.height()+"px" ) ;
		}
		//if($header.length){
			var top  = $iscrollWrapper.attr("top") ||  $header.height() || $header2.height();;
			$iscrollWrapper.css("top", parseFloat(top) + "px" ) ;
		//}

	}

	/**
	    isroll页面放大缩小
	    @method  ui.IScroll.zoom(selector)
	    @param selector {selector|zepto} (必选) iscroll对象CSS选择器
	    @example
			ui.IScroll.zoom(".pullrefresh-wrapper");
 
	*/
	var zoom = function(selector){
		return new iScroll($(selector)[0], { 
			zoom:true,
			checkDOMChanges:true,
			useTransition: false,
		 	hScrollbar: true, //是否显示水平滚动条  
			vScrollbar: true
		});
	}

	return {
		init : init,
		zoom : zoom 
	};

})();

;$(function () {
	
	if(window.devicePlatform == 'android'){
		document.addEventListener("deviceready", function() {
	 
	 		var _focusElem = null;
			var _currentIscroll = null;
		    window._keyboardIsShow = false;
		   
		    document.body.addEventListener("focus", function(e) { 
		        _focusElem = e.target || e.srcElement;
		    }, true);

		    document.addEventListener("hidekeyboard", function() { //ios没有这两个事件

				if(_currentIscroll){
					 $(_currentIscroll.scroller).height("auto");
					 _currentIscroll.wrapper.scrollTop = 0;
				}
		        _focusElem && _focusElem.blur();
		        _keyboardIsShow = false;
				
		    }, false);

		    document.addEventListener("showkeyboard", function() {
		        _keyboardIsShow = true;
		    }, false);

		    window.addEventListener("resize", function() {
		        if (_focusElem && _keyboardIsShow) {
		         
										
					_focusElem.scrollIntoView(false);
					
					var id = $("section.active").attr("id") || "body";
					var iscrolls = GC.get(id, "iScroll");

					for (var i = iscrolls.length - 1; i >= 0; i -= 1) {
						if((window._currentIscrollHeight = $(iscrolls[i].scroller).height()) > 0) {
						
							_currentIscroll = iscrolls[i];
							break;
						}

					}

		        }
		    });

		}, false);
	}	
});
/**
简化一些常用方法的写法
 @class ui.alias
*/
;(function($){
    /*
     * alias func
     * 简化一些常用方法的写法
     ** /
    /*
     * 完善zepto的动画函数,让参数变为可选
     */
    ui.anim  =  function(el,animName,duration,ease,callback){
        var d, e,c;
        var len = arguments.length;
        for(var i = 2;i<len;i++){
            var a = arguments[i];
            var t = $.type(a);
            t == 'number'?(d=a):(t=='string'?(e=a):(t=='function')?(c=a):null);
        }
        $(el).animate(animName,d|| 250,e|| 'ease', c);
    }
    /**
        显示loading框（ui.Popup.loading(text, icon)的缩写）
        @method  ui.showMask(text, icon)
        @param text {String} 文本 |  当为null时，不显示文字
        @param icon {String}  加载中字体图标  | 默认值 'icon-spinner5'
        @example
            ui.showMask("加载中...");
    */  
    ui.showMask = function(text, icon){
        ui.Popup.loading(text, icon);
    }

    /**
        关闭loading框（ui.Popup.close(true)的缩写）
        @method  ui.hideMask()
        @example
            ui.hideMask();
    */
    ui.hideMask = function(){
        ui.Popup.close(true);
    }
 
    /**
        alert组件（ui.Popup.alert(title,content)的缩写）
        @method ui.alert(title,content)
        @param title {String} 标题
        @param content {String}  内容
        @example
            ui.Popup.alert('提示','这是一个Alert');
    */
    ui.alert = function(title,content){
        ui.Popup.alert(title,content);
    }

    /**
        confirm 组件（ui.Popup.confirm(title,content)的缩写）
        @method  ui.confirm(title,content,okCall,cancelCall,okBtnName,cancelBtnName)
        @param title {String}  标题
        @param content {String}  内容
        @param okCall {Function} 确定按钮handler
        @param cancelCall {Function} 取消按钮handler
        @param okBtnName {String}  （可选）确认按钮名称 | 默认值 '确定'
        @param cancelBtnName {String}  （可选）取消按钮名称 | 默认值 '取消'
        @example
            ui.confirm('提示','这是一个Confirm！',function(){app.hint('你选择了“确定”')},function(){app.hint('你选择了“取消”')});
    */ 
    ui.confirm = function(title,content,okCall,cancelCall, okBtnName, cancelBtnName){
        ui.Popup.confirm(title,content,okCall,cancelCall, okBtnName, cancelBtnName);
    }
    /**
        弹出窗口（ui.Popup.show(options)的缩写）
        @method  ui.popup(options)
        @param options {JSONObject} (可选) 参数，具体参数如下
        <ul>
        <li>height (Number):  高度</li>
        <li>width (Number):  宽度 </li>
        <li>opacity (Number):  遮罩层透明度 | 默认值 0.3</li>
        <li>html (String):  popup内容 </li>
        <li>pos (String):  位置  | 取值 top|top-second|center|bottom|bottom-second </li>
        <li>clickMask2Close (Boolean):  是否点击外层遮罩关闭popup | 默认值 true </li>
        <li>showCloseBtn (Boolean):  是否显示关闭按钮 | 默认值 true </li>
        <li>animation (Boolean):  是否显示动画 | 默认值 true </li>
        <li>duration (Number):  动画执行时间 | 默认值 200ms </li>     
        </ul>
        @example
            ui.popup({
                html: '<div style="height: 100px;text-align: center;font-size: 20px;font-weight: 600;margin-top: 10px;color:#E74C3C ">随意设计你的弹出框吧</div>',
                pos : 'center'
            })
     */
    ui.popup = function(options){
        ui.Popup.show(options);
    }

    /**
        关闭窗口（ui.Popup.close()的缩写）
        @method  ui.closePopup()
        @example
            ui.closePopup();
    */
    ui.closePopup = function(){
        ui.Popup.close();
    }

    /**
        带箭头的弹出框（ui.Popup.popover(html,pos,arrowDirection,onShow)的缩写）
        @method  ui.popover(html,pos,arrowDirection,onShow)
        @param html {String} 弹出框内容
        @param pos {String}  位置  | 取值 top|top-second|center|bottom|bottom-second
        @param arrowDirection {String}  箭头方向 | 取值 top|bottom
        @param onShow  {Function} 显示之前执行
        @example
            var html = '<ul id="popoverlist" class="list-view"> ' +
                            '<li><div data-role="BTButton">Hello, BingoTouch</div></li>' +
                            '<li><div data-role="BTButton">Good good Study</div></li>' +
                            '<li><div data-role="BTButton">Day day up</div></li>' +
                        '</ul>';    
            ui.popover(html,{
                top:'70px',
                left:'10%',
                right:'10%'
            },'top');

            $("#popoverlist").uiwidget();
    */
    ui.popover = function(html,pos,arrowDirection,onShow){
        ui.Popup.popover(html,pos,arrowDirection,onShow);
    }

    /**
        刷新当前页面（单页模式下使用）
        @method  ui.refresh()
        @example
            ui.refresh();
    */
    ui.refresh = function(){
        ui.Page.refresh();
    }

    /**
        页面跳转（单页模式下使用）
        @method  ui.load()
        @param url {String}  页面路径
        @param params {JSONObject} 页面参数
        @example
            ui.load({
                url : "modules/test.html",
                params : {
                    name : "bt"
                }
            });
    */
    ui.load = function(options){
        ui.Page.load(options);
    }

    /**
        页面后退（单页模式下使用）
        @method  ui.back()
        @param pageNumber {Number}  (可选) 退回页码
        @example
            ui.back(); //返回上一页
            ui.back(0); //返回首页
    */
    ui.back = function(pageNumber){
        ui.Page.back(pageNumber);
    }
    
    
    	
	//tab兼容以前写法
	ui.Tab = function(options){
		$(options.container).tab(options);
	}
})(Zepto);
 /**
弹出框组件
 @class ui.Popup
  更新记录：
  wuzhifeng 2017-05-11 添加actionsheet2方法，弹出选择菜单项被点击时，回调函数可以获取到数组下标
*/
;ui.Popup = (function($){

    var _popup,_mask,transition,clickMask2close,
        POSITION = {
            'top':{
                top:0,
                left:0,
                right:0
            },
            'top-second':{
                top:'70px',
                left:0,
                right:0
            },
            'center':{
                top:'50%',
                left:'5%',
                right:'5%',
                'border-radius' : '3px'
            },
            'bottom' : {
                bottom:0,
                left:0,
                right:0
            },
            'bottom-second':{
                bottom : '72px',
                left:0,
                right:0
            }
        },
        ANIM = {
            top : ['slideDownIn','slideUpOut'],
            bottom : ['slideUpIn','slideDownOut'],
            defaultAnim : ['bounceIn','bounceOut']
        },
        TEMPLATE = {
            alert : '<div class="popup-title">{title}</div><div class="popup-content">{content}</div><div id="popup_btn_container"><a data-target="closePopup" data-icon="checkmark">{ok}</a></div>',
            confirm : '<div class="popup-title">{title}</div><div class="popup-content">{content}</div><div id="popup_btn_container"><a class="cancel" data-icon="close">{cancel}</a><a data-icon="checkmark">{ok}</a></div>',
            loading : '<i class="icon {icon}"></i><p>{title}</p>',
            loadingOnlyIcon : '<i class="icon iconOnly {icon}"></i>'
        };

    /*
     * 全局只有一个popup实例
     * @private
     */
    var _init = function(){
        $('body').append('<div id="bingotouch_popup"></div><div id="bingotouch_popup_mask"></div>');
        _mask = $('#bingotouch_popup_mask');
        _popup = $('#bingotouch_popup');
        _subscribeEvents();
    }

    /**
        打开窗口
        @method  ui.Popup.show(options)
        @param options {JSONObject} (可选) 参数，具体参数如下
        <ul>
        <li>height (Number):  高度</li>
        <li>width (Number):  宽度 </li>
        <li>opacity (Number):  遮罩层透明度 | 默认值 0.3</li>
        <li>html (String):  popup内容 </li>
        <li>pos (String):  位置  | 取值 top|top-second|center|bottom|bottom-second </li>
        <li>clickMask2Close (Boolean):  是否点击外层遮罩关闭popup | 默认值 true </li>
        <li>showCloseBtn (Boolean):  是否显示关闭按钮 | 默认值 true </li>
        <li>animation (Boolean):  是否显示动画 | 默认值 true </li>
        <li>duration (Number):  动画执行时间 | 默认值 200ms </li>     
        </ul>
        @example
            ui.Popup.show({
                html: '<div style="height: 100px;text-align: center;font-size: 20px;font-weight: 600;margin-top: 10px;color:#E74C3C ">随意设计你的弹出框吧</div>',
                pos : 'center'
            })
    */
    var show = function(options){
        var settings = {
            height : undefined,//高度
            width : undefined,//宽度
            opacity : 0.3,//透明度
            url : null,//远程加载url
            tplId : null,//加载模板ID
            tplData : null,//模板数据，配合tplId使用
            html : '',//popup内容
            pos : 'center',//位置 {@String top|top-second|center|bottom|bottom-second}   {@object  css样式}
            clickMask2Close : true,// 是否点击外层遮罩关闭popup
            showCloseBtn : true,// 是否显示关闭按钮
            arrowDirection : undefined,//popover的箭头指向
            animation : true,//是否显示动画
            timingFunc : 'linear',
            duration : 200,//动画执行时间
            onShow : undefined //@event 在popup内容加载完毕，动画开始前触发
        }
        $.extend(settings,options);
        clickMask2close = settings.clickMask2Close;
        _mask.css('opacity',settings.opacity);
        //rest position and class
        _popup.attr({'style':'','class':''});
        settings.width && _popup.width(settings.width);
        settings.height && _popup.height(settings.height);
        var pos_type = $.type(settings.pos);
        if(pos_type == 'object'){// style
            _popup.css(settings.pos);
            transition = ANIM['defaultAnim'];
        }else if(pos_type == 'string'){
            if(POSITION[settings.pos]){ //已经默认的样式
                _popup.css(POSITION[settings.pos])
                var trans_key = settings.pos.indexOf('top')>-1?'top':(settings.pos.indexOf('bottom')>-1?'bottom':'defaultAnim');
                transition = ANIM[trans_key];
            }else{// pos 为 class
                _popup.addClass(settings.pos);
                transition = ANIM['defaultAnim'];
            }
        }else{
            console.error('错误的参数！');
            return;
        }
        _mask.show();
        var html;
        if(settings.html){
            html = settings.html;
        }else if(settings.url){//远程加载
            //html = J.Page.loadContent(settings.url);
        }else if(settings.tplId){//加载模板
            //html = template(settings.tplId,settings.tplData)
        }

        //是否显示关闭按钮
        if(settings.showCloseBtn){
            html += '<div id="tag_close_popup" data-target="closePopup" class="icon icon-cancel"></div>';
        }
        //popover 箭头方向
        if(settings.arrowDirection){
            _popup.addClass('arrow '+settings.arrowDirection);
            _popup.css('padding','8px');
            if(settings.arrowDirection=='top'||settings.arrowDirection=='bottom'){
                transition = ANIM[settings.arrowDirection];
            }
        }

        _popup.html(html).show();

        //J.Element.init(_popup); 
        //执行onShow事件，可以动态添加内容
        settings.onShow && settings.onShow.call(_popup);

        //显示获取容器高度，调整至垂直居中
        if(settings.pos == 'center'){
            var height = _popup.height();
            _popup.css('margin-top','-'+height/2+'px')
        }
        if(settings.animation){
            ui.anim(_popup,transition[0],settings.duration,settings.timingFunc);
        }
        ui.hasPopupOpen = true;
    }

    /**
       关闭弹出框
        @method  ui.Popup.hide(noTransition)
        @param noTransition {Boolean}  是否立即关闭，无动画  | 默认值是false
        @example
            ui.Popup.hide();
    */
    var hide = function(noTransition){
        _mask.hide();
        if(transition && !noTransition){
            ui.anim(_popup,transition[1],200,function(){
                _popup.hide().empty();
                ui.hasPopupOpen = false;
            });
        }else{
            _popup.hide().empty();
            ui.hasPopupOpen = false;
        }

    }
    var _subscribeEvents = function(){
        _mask.on('tap',function(){
            clickMask2close &&  hide();
        }).on("touchmove",function(e){
            e.preventDefault();
        });
        _popup.on('tap','[data-target="closePopup"]',function(){
            hide();
        }).on("touchmove",function(e){
            e.preventDefault();
        });
    }

    /**
        alert组件
        @method  ui.Popup.alert(title,content,btnName)
        @param title {String} 标题
        @param content {String}  内容
        @param btnName {String}  按钮名称 | 默认值 '确定'
        @example
            ui.Popup.alert('提示','这是一个Alert');
    */    
    var alert = function(title,content,btnName){
        var markup = TEMPLATE.alert.replace('{title}',title).replace('{content}',content).replace('{ok}',btnName || '确定');
        show({
            html : markup,
            pos : 'center',
            clickMask2Close : false,
            showCloseBtn : false
        });
    }

    /**
        confirm 组件
        @method  ui.Popup.confirm(title,content,okCall,cancelCall,okBtnName,cancelBtnName)
        @param title {String}  标题
        @param content {String}  内容
        @param okCall {Function} 确定按钮handler
        @param cancelCall {Function} 取消按钮handler
        @param okBtnName {String}  （可选）确认按钮名称 | 默认值 '确定'
        @param cancelBtnName {String}  （可选）取消按钮名称 | 默认值 '取消'
        @example
            ui.Popup.confirm('提示','这是一个Confirm！',function(){app.hint('你选择了“确定”')},function(){app.hint('你选择了“取消”')});
    */     
    var confirm = function(title,content,okCall,cancelCall, okBtnName, cancelBtnName){
        var markup = TEMPLATE.confirm.replace('{title}',title).replace('{content}',content).replace('{cancel}', cancelBtnName || '取消').replace('{ok}', okBtnName || '确定');
        show({
            html : markup,
            pos : 'center',
            clickMask2Close : false,
            showCloseBtn : false
        });
        $('#popup_btn_container [data-icon="checkmark"]').tap(function(){
            hide();
            okCall.call(this);
        });
        $('#popup_btn_container [data-icon="close"]').tap(function(){
            hide();
            cancelCall.call(this);
        });
    }

    /**
        带箭头的弹出框
        @method  ui.Popup.popover(html,pos,arrow_direction,onShow)
        @param html {String} 弹出框内容
        @param pos {String}  位置  | 取值 top|top-second|center|bottom|bottom-second
        @param arrow_direction {String}  箭头方向 | 取值 top|bottom
        @param onShow  {Function} 显示之前执行
        @example
            var html = '<ul id="popoverlist" class="list-view"> ' +
                            '<li><div data-role="BTButton">Hello, BingoTouch</div></li>' +
                            '<li><div data-role="BTButton">Good good Study</div></li>' +
                            '<li><div data-role="BTButton">Day day up</div></li>' +
                        '</ul>';    
            ui.Popup.popover(html,{
                top:'70px',
                left:'10%',
                right:'10%'
            },'top');

            $("#popoverlist").uiwidget();
    */     
    var popover = function(html,pos,arrow_direction,onShow){
        show({
            html : html,
            pos : pos,
            showCloseBtn : false,
            arrowDirection : arrow_direction,
            onShow : onShow
        });
    }

    /*
        loading组件
        @method  ui.Popup.loading(text, icon)
        @param text {String} 文本 |  当为null时，不显示文字
        @param icon {String}  加载中字体图标  | 默认值 'icon-spinner5'
        @example
            ui.Popup.loading("加载中...");
    */     
    var loading = function(text, icon){
        var markup;
        if(text == null){
            markup = TEMPLATE.loadingOnlyIcon.replace('{icon}', icon||'icon-spinner5');      
        } else{
            markup = TEMPLATE.loading.replace('{title}', text).replace('{icon}', icon||'icon-spinner5');     
        }
         show({
            html : markup,
            pos : 'loading',
            opacity :.1,
            duration : 10,
            clickMask2Close : false
        });
    }

    
    /**
        actionsheet组件
        @method   ui.Popup.actionsheet(buttons)
        @param buttons {Array}  按钮集合
        [{color:'red',text:'btn',handler:function(){}},{color:'red',text:'btn',handler:function(){}}]
        @example
            ui.Popup.actionsheet([{
                color : "#27AE60",
                text : '告诉QQ好友',
                handler : function(){
                    app.hint('告诉QQ好友！');
                }
            },{
                color : "#27AE60",
                text : '告诉MSN好友',
                handler : function(){
                    app.hint('告诉MSN好友！');
                }
            }
            ]);
    */     
    var actionsheet = function(buttons){
        var markup = '<div class="actionsheet">';
        $.each(buttons,function(i,n){
            //markup += '<button style="background-color: '+ n.color +' !important;">'+ n.text +'</button>';

            markup += '<div data-role="BTButton" style="background-color:'+ n.color +'" data-status="1"><span class="btn-text">'+ n.text +'</span></div>';
        });
        markup += '<div data-role="BTButton" data-theme="d" data-status="1"><span class="btn-text">取消</span></div>';
        markup += '</div>';
        show({
            html : markup,
            pos : 'bottom',
            showCloseBtn : false,
            onShow : function(){
                $(this).find('[data-role="BTButton"]').each(function(i,button){
                    $(button).on('tap',function(){
                        if(buttons[i] && buttons[i].handler){
                            buttons[i].handler.call(button);
                        }
                        hide();
                    });
                });
            }
        });
    }

    /**
     星火定制actionsheet组件 wuzhifeng 2017-05-11
     @method   ui.Popup.actionsheet2(buttons)
     @param buttons {Array}  按钮集合
     [{color:'red',text:'btn',handler:function(index){}},{color:'red',text:'btn',handler:function(index){}}]
     @example
     ui.Popup.actionsheet([{
                color : "#27AE60",
                text : '第一个菜单项',
                handler : function(index){
                    app.alert("这是第" + index + "个菜单项);
                }
            },{
                color : "#27AE60",
                text : '第二个菜单项',
                handler : function(index){
                    app.alert("这是第" + index + "个菜单项);
                }
            }
     ]);
     */
    var actionsheet2 = function(buttons){
        var markup = '<div class="actionsheet">';
        $.each(buttons,function(i,n){
            //markup += '<button style="background-color: '+ n.color +' !important;">'+ n.text +'</button>';

            markup += '<div data-role="BTButton" style="background-color:'+ n.color +'" data-status="1"><span class="btn-text">'+ n.text +'</span></div>';
        });
        markup += '<div data-role="BTButton" data-theme="d" data-status="1"><span class="btn-text">取消</span></div>';
        markup += '</div>';
        show({
            html : markup,
            pos : 'bottom',
            showCloseBtn : false,
            onShow : function(){
                $(this).find('[data-role="BTButton"]').each(function(i,button){
                    $(button).on('tap',function(){
                        if(buttons[i] && buttons[i].handler){
                            //buttons[i].handler.call(button);
                            buttons[i].handler(i);
                        }
                        hide();
                    });
                });
            }
        });
    }

    $(function(){
        _init();
    });


    return {
        show : show,
        close : hide,
        alert : alert,
        confirm : confirm,
        popover : popover,
        loading : loading,
        actionsheet : actionsheet,
        /*
        添加星火定制的菜单选择控件 wuzhifeng 2017-05-11
         */
        actionsheet2: actionsheet2
    }
})(Zepto);
/**
换肤
 @class ui.Skin
*/
/**
    换肤初始化（header和footer默认添加到bgColorSelector）
    @method  ui.Skin.init(options)
    @param color {String}  字体颜色 | 默认值 #FFFFFF
    @param colorSelector {Array} 字体颜色CSS选择器
    @param bgColor {String} 背景颜色 | 默认值 #278cca
    @param bgColorActive {String}  active 背景颜色 | 默认值 是背景色加深20%
    @param bgColorSelector {Array}  背景颜色CSS选择器
    @param borderColor {String}  边框颜色 | 默认值 是背景色加深30%
    @param borderColorSelector {Array}  边框颜色CSS选择器
    @param iconFontColor {String}  字体图标颜色 | 默认值 #333333
    @param iconFontColorSelector {Array}  字体图标颜色CSS选择器
    @example
		ui.Skin.init({
			bgColor : bgColor,
			iconFontColor : bgColor, 
			iconFontColorSelector :[".thumbnail [class^='icon-']",".list-view .icon"]
		});
*/
;ui.Skin = (function(){

	var skinTagId = "BINGOTOUCH-SKIN", TEMPLATE = {
	 	 	BGCOLOR : "@selector { background-color : @bgColor !important;}",
	 	 	BGCOLORACTIVE : "@selector.btn-active { background-color : @bgColorActive !important;}", 
	 	 	COLOR : "@selector { color : @color !important; }",
	 	 	BORDERCOLOR :"@selector {  border-color: @borderColor !important;}"

 		}, 	
 		defaultColorSelect = [ ".header .title", ".footer .navbar [data-role='BTButton']"],
 		defaultBgColorSelect = [ ".header .title",".footer .navbar [data-role='BTButton']", ".footer .sonmenu", ".footer .angle"];

 	var init = function (options){

	 	var settings = {
	 		colorSelector : [],	 	 
	 	 	bgColorSelector : [],
	 	 	borderColorSelector :[],
 	 		iconFontColorSelector :[],
 	 		color : "#FFFFFF",
	 	 	bgColor : "#278cca",
	 	 	bgColorActive : null,
	 	 	borderColor : null,
	 	 	iconFontColor : "#333333",
	 	 	appendElement : "head"
 	 	}

 	 	$.extend(settings,options);
 	 	settings.colorSelector = settings.colorSelector.concat(defaultColorSelect);
 	 	settings.bgColorSelector = settings.bgColorSelector.concat(defaultBgColorSelect);
 	 	settings.borderColorSelector = settings.borderColorSelector.concat(defaultBgColorSelect);
 	 	
 	 	if(!settings.borderColor){
 	 		settings.borderColor = ui.Utils.getDarkColor(settings.bgColor, 0.3); //以背景色加深作为边框颜色
 	 	}

 	 	if(!settings.bgColorActive){
 	 		settings.bgColorActive = ui.Utils.getDarkColor(settings.bgColor, 0.2); 
 	 	}


 	 	$("#" + skinTagId).remove();
 	 	
 	 	var html = "<style id='" + skinTagId + "'>";
	 	 	html += _createCss(settings.colorSelector, "COLOR", { color : settings.color });
	 	 	html += _createCss(settings.iconFontColorSelector, "COLOR", { color : settings.iconFontColor });
	 	 	html += _createCss(settings.bgColorSelector, "BGCOLOR",{ bgColor:settings.bgColor });
	 	 	html += _createCss(settings.bgColorSelector, "BGCOLORACTIVE",{  bgColorActive :settings.bgColorActive });
	 	 	html += _createCss(settings.borderColorSelector, "BORDERCOLOR",{ borderColor :settings.borderColor });
	 	 	html += "</style>";
 	 	$(settings.appendElement).append(html);
 	}

 	var _createCss = function(changeSelectors, templateType, replaceAttrs){
 		var html = "";
   		$.each(changeSelectors ,function(i, selector) {  
   			var res = TEMPLATE[templateType].replace("@selector", selector);
   			for(var attr in replaceAttrs){
   				res = res.replace("@" + attr, replaceAttrs[attr]);
   			}
         	html += res;
        });		
   		return html;
 	}


 	return { 
 		init : init
 	}

})();
 
/**
侧边菜单
 @class ui.Menu
*/
/**
    侧边菜单初始化
    @method  ui.Menu.init(options)
    @param options {JSONObject}  参数，具体参数如下
    <ul>
    <li>sectionId (selector):   section块Id<font color="red">（单页模式必需设，多页模式下不需设置）</font></li>
    <li>duration (Number):  (可选)切换时间 | 默认值 200ms </li>
    </ul>
    @example
        ui.Menu.init({
            sectionId : 'menu_section',
            duration : 200 
        })  
*/
;ui.Menu = (function($){

    var init = function(options){

	    var $sectionContainer,$sectionMask, duration = 200;
		
        options.duration && (duration = options.duration);
        $sectionContainer = options.sectionId ? $("#" + options.sectionId) : $("section");
        $("#section_container_mask").remove();
        $sectionMask = $('<div id="section_container_mask"></div>').appendTo('#section_container');

        //添加各种关闭事件
        $sectionMask.on('tap',hideMenu);
     
        
        $sectionContainer.attr("MenuDuration", duration).find("[data-aside]").each(function(i, elem){
            var targetAsideId = $(this).attr("data-aside");
            $(this).off("tap").on('tap',function(){
                _toggleMenu("#" + targetAsideId);
            });
        });
   
    }

    var _toggleMenu = function(selector){
        ui.hasMenuOpen?ui.Menu.hide():ui.Menu.show(selector);
    }

    /**
        打开侧边菜单
        @method  ui.Menu.show(selector)
        @param selector {selector|zepto} (必选) aside的css选择器
        @example
            ui.Menu.show("#left_aside"); 
    */
    var showMenu = function(selector){
	
		$('#section_container_mask').show();
		
        var $aside = $(selector).addClass('active'),
			$sectionContainer = $("section.active"),
			duration = $sectionContainer.attr("MenuDuration") * 1,
            transition = $aside.data('transition'),// push overlay  reveal scale
            position = $aside.data('position') || 'left',
            width = $aside.width(),
            width = transition == 'scale' ? (width - $(window).width() * 0.1) : width,
            translateX = position == 'left'?width+'px':'-'+width+'px';
  
		var _finishTransition = function(){
           	ui.hasMenuOpen = true;
			if(transition == 'reveal') $aside.css("z-index", 30); //把层级升起来
        };

        if(transition == 'overlay'){
            ui.anim($aside,{translateX : '0%'},duration,_finishTransition);
        }else if(transition == 'reveal'){
            ui.anim($sectionContainer,{translateX : translateX},duration,_finishTransition);
        }else{//默认为push
            ui.anim($aside,{translateX : '0%'},duration);
            var animation = {
            	translateX : translateX
            }
            if(transition == 'scale')
            	$.extend(animation, {
            		scale : 0.8
            	});
            ui.anim($sectionContainer, animation ,duration,_finishTransition); 	
        }
			
    }

    /**
        关闭侧边菜单
        @method  ui.Menu.hide(duration, callback)
        @param duration {Number}  (可选) 切换时间 | 默认值 200ms
        @param callback {Function} (可选) 动画完毕回调函数
        @example
            ui.Menu.hide(); 
    */
    var hideMenu = function(duration, callback){
		if(!ui.hasMenuOpen) return;
        var $aside = $('#section_container aside.active'),
			$sectionContainer = $("section.active"),
			duration = typeof duration === 'number' ? duration : $sectionContainer.attr("MenuDuration") * 1,
            transition = $aside.data('transition'),// push overlay  reveal
            position = $aside.data('position') || 'left',
            translateX = position == 'left'?'-100%':'100%';

        var _finishTransition = function(){
            $aside.removeClass('active');
            ui.hasMenuOpen = false;
            callback && callback();
        };

        if(transition == 'overlay'){
            ui.anim($aside,{translateX : translateX},duration,_finishTransition);
        }else if(transition == 'reveal'){
		    $aside.css("z-index", 10); //把层级设回去
            ui.anim($sectionContainer,{translateX : '0'},duration,_finishTransition);
        }else{//默认为push
            ui.anim($aside,{translateX : translateX},duration);
            ui.anim($sectionContainer,{translateX : '0'},duration,_finishTransition);
        }

        $('#section_container_mask').hide();
    }
    return {
        init : init,
        //bind : bind,
        show : showMenu,
        hide : hideMenu
    }
})(Zepto);
/**
滑动列表
 @class ui.SwipeListview
*/
/**
    滑动列表初始化
    @method  ui.SwipeListview.init(selector, buttons)
    @param selector {selector|zepto} (必选) 滑动列表选择器
    @param buttons  {JSONObject} 参数,具体参数如下<br/>
    <p> leftBtn  {Array} 左按钮， 具体参数如下</p>
    <ul>
    <li>color ： 背景色</li>
    <li>title ： 显示名称</li>
    <li>width ： 宽度 默认100</li>
	<li>onTap ： 点击触发事件</li>
	</ul>
    <p> rightBtn  {Array} 右按钮 ,具体参数如左按钮</p>
    @example
		ui.SwipeListview.init("#swipe_listview_section .list-view",{
		    leftBtn:[{color:'#8B0000',title:'左按钮1', width:'120', onTap: function(liDom){
		                    alert("左1")
		            }}],
		    rightBtn:[{color:'#8B0000',title:'右按钮1', width:'100', onTap : function(liDom){
		     
		                    alert("右按钮1")
		                    //$(liDom).parent().remove();
		              }},
		              {color:'#228B22',title:'右按钮2', width:'100', onTap : function(liDom){
		 
		                    alert("右按钮2")
		              }}]
		});
*/
;ui.SwipeListview = (function(){

	var defaults = {
		duration :100,
		leftBtn : [],
    	rightBtn : []
	} 

	var init = function(listSelector, options ){
		var $listSelector = $(listSelector);
		if($listSelector.length == 0) return;

		var settings = $.extend({}, defaults, options);

		$listSelector.closest("ul").addClass("swipeListview");

		//列表点击
		$listSelector.delegate("li", "tap", function(e){
 			hide(this, settings.duration);
		});	

		//左右滑动
		var rightBtnWidth =  -1 *  __caculateWidth(settings.rightBtn) + "px";
		$listSelector.delegate("li", "swipeLeft", function(e){	 
			addSwipeBtn(this, settings);
 		 	swipeListAnimation(this, 'left', rightBtnWidth, settings.duration);
 		 	e.preventDefault();
		});	

		var leftBtnWidth =  __caculateWidth(settings.leftBtn) + "px";
		$listSelector.delegate("li", "swipeRight", function(e){
 			addSwipeBtn(this, settings);
	 		swipeListAnimation(this, 'right', leftBtnWidth, settings.duration);
	 		e.preventDefault();
		});	

		//按钮事件
        $listSelector.delegate(".swipe>span",'tap',function(e){
            var isLeft = $(this).parent().hasClass("swipeLeft"),
                index = $(this).attr("i"),
                liObj = $(this).parent().siblings("[data-role='BTButton']")[0];
            if(isLeft){
            	settings.leftBtn[index].onTap(liObj);
            } else{
            	settings.rightBtn[index].onTap(liObj);
            }

            return false;
    	});
	}

	/**
	    打开滑块
	    @method  ui.SwipeListview.show(selector, direct)
	    @param selector {selector|zepto} (必选) 打开滑块DOM对象(可整个list 或 单个li)
	    @param direct  {String} 方向 | 取值为  'Right' 或 'Left'   
	    @example
			ui.SwipeListview.show(".list-view li")  // 打开所有滑块
			ui.SwipeListview.show(".list-view li:eq(0)") //打开单个滑块
	*/
	var show = function(obj, direct ){
		$(obj).trigger("swipe" + (direct || 'Left') );
	}

 	/**
	    关闭滑块
	    @method  ui.SwipeListview.hide(selector, duration)
	    @param selector {selector|zepto} (必选) 关闭滑块DOM对象   (可整个list 或 单个li)
	    @param duration  {Number} 动画时间 | 默认100ms
	    @example
			ui.SwipeListview.hide(".list-view")  // 关闭所有滑块
			ui.SwipeListview.hide(".list-view li:eq(0)") //关闭单个滑块
	*/
	var hide = function(obj , duration){
		duration = duration || defaults.duration;
	 	ui.anim($(obj).find(".swipeRight"),{translateX : "100%"}, duration);
	    ui.anim($(obj).find("[data-role='BTButton']"),{translateX : '0px'}, duration);
	 	ui.anim($(obj).find(".swipeLeft"),{translateX : "-100%"}, duration);
	}

	/*
	 * 添加按钮
	 * @liObj 滑动列
	 */
	function addSwipeBtn(liObj, settings){
	 	var $li = $(liObj), height = $li.height();

		if( settings.rightBtn.length > 0 && $li.find(".swipeRight").length == 0 ){
			var html =  __createBtn(settings.rightBtn, 'swipeRight', height);
	 	   	$li.append(html);
		}

		if(settings.leftBtn.length > 0 && $li.find(".swipeLeft").length == 0 ){
			var html =   __createBtn(settings.leftBtn, 'swipeLeft', height);  
	 	   $li.prepend(html);
		}
	}

	function __createBtn(btns, swipeClass, height){
		var html = '<div class="swipe ' + swipeClass + '">';
  		$.each(btns ,function(i, btn) {  
         	html += '<span i="'+i+'" style="background:'+ btn.color +';width:' + (btn.width || 100) + 'px;height:' + height + 'px;">' + btn.title + '</span>';
        });	
      	html += "</div>";
        return html;
	}

	function __caculateWidth(btns){
		var width = 0;
		$.each(btns ,function(i, btn) {  
         	width += (btn.width || 100) * 1  ;
        });	
        return width;
	}

	/*
	 * 滑动切换
	 * @liObj 滑动列
	 * @direct 滑动方向
	 * zepto的anim对写法有要求,所以下面的anim是有顺序的
	 *（例如有左右两个滑块，如果两个滑块同时向右，那么必须左的那个先anim，不然在低端的android会有bug）
	 */
	function swipeListAnimation(liObj, direct, translateX, duration){
		var liStatus =  __getLiStatus(liObj);
		switch(liStatus){
			case 'rightBtnShow' :
				//close rightBtn
				if(direct == 'right'){	        
           		    ui.anim($(liObj).find("[data-role='BTButton']"),{translateX : '0'}, duration);
           		    ui.anim($(liObj).find(".swipeRight"),{translateX : "100%"}, duration);
				}
			break;
			case 'normal':
				if(direct == 'right'){ //open leftBtn
					ui.anim($(liObj).find(".swipeLeft"),{translateX : '0%' }, duration);
         	 	    ui.anim($(liObj).find("[data-role='BTButton']"),{translateX : translateX}, duration);	 		
				} else{ //open rightBtn			
          	  	    ui.anim($(liObj).find("[data-role='BTButton']"),{translateX : translateX}, duration); 	
          	  	    ui.anim($(liObj).find(".swipeRight"),{translateX : '0%' }, duration);	 
				}
			break;
			case 'leftBtnShow':
				//close leftBtn
				if(direct == 'left'){
			        ui.anim($(liObj).find(".swipeLeft"),{translateX : "-100%"}, duration);
           		    ui.anim($(liObj).find("[data-role='BTButton']"),{translateX : '0'}, duration);
				}
			break;
		}
	}

	/*
	 * 滑动列状态
	 * @liObj 滑动列
	 */	
 	function __getLiStatus(liObj){
		var left = $(liObj).find("[data-role='BTButton']").offset().left;

		if(left < 0 ) {
			return  'rightBtnShow';
		} else if( left > 40 ){ //寫40并沒有多大的關係，因為listview應該要比他長。
			return  'leftBtnShow';
		} else{
			return  'normal';
		}
 	}


	return {
		init : init,
		show : show ,
		hide : hide  //可关闭一个或多个li
	}

})();
 
/**
 * 校验组件
 * @class ui.validation
 */
 /**
    初始化， 该组件有两种校验，一种自动校验，另一种是单次校验
    @method $(selector).validation(options)
    @param autoValidate {Boolean} (可选) 是否开启自动校验（即实时校验）
    @param promptType  {String} (可选) 错误提示显示效果, 取值是 'bubble'| 'inline',默认是 inline 
	@param isPromptAll {Boolean} (可选) 是否显示全部错误 （只在单次校验时生效）
    @example
		//自动校验
		$("#vdForm").validation({
			autoValidate: true
		});
		
		
		//单次校验
		var res = $("#vdForm").validation();
*/
(function($) {

	$.validationConfig = {
		allRules: {
			// Add your regex rules here, you can take telephone as an example
			"required": {
				"executor": "_required"
			},
			"pattern": {
				"executor": "_customRegex"
			},
			"func": {
				"executor": "_funcCall"
			},
			"length": {
				"executor": "_length"
			},
			"range": {
				"executor": "_range"
			},
			"equalToField": {
				"executor": "_confirm",
				"alertText": "输入值与相关信息不相符"
			},
			"url": {
				"regex": /^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i,
				"executor": "_customRegex",
				"alertText": "网址输入不正确"
			},
			"qq": {
				"regex": /^[1-9][0-9]{4,}$/,
				"executor": "_customRegex",
				"alertText": "QQ号码输入不正确"
			},
			"telephone": {
				"regex": /^(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/,
				"executor": "_customRegex",
				"alertText": "电话号码输入不正确"
			},
			"mobile": {
				"regex": /^1[3|5|8]\d{9}$/,
				"executor": "_customRegex",
				"alertText": "手机号码输入不正确"
			},
			"email": {
				"regex": /^[a-zA-Z0-9_\.\-]+\@([a-zA-Z0-9\-]+\.)+[a-zA-Z0-9]{2,4}$/,
				"executor": "_customRegex",
				"alertText": "邮箱地址输入不正确"
			},
			"date": {
				"regex": /^[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}$/,
				"executor": "_customRegex",
				"alertText": "日期输入格式不正确（YYYY-MM-DD）"
			},
			"identity": {
				"regex": /^([0-9]{17}[0-9X]{1})|([0-9]{15})$/,
				"executor": "_customRegex",
				"alertText": "身份证输入不正确"
			},
			"money": {
				"regex": /^[0-9]+(.[0-9]{2})?$/,
				"executor": "_customRegex",
				"alertText": "金额格式输入不正确"
			},
			"integer": {
				"regex": /^\d+$/,
				"executor": "_customRegex",
				"alertText": "输入值必须是正整数"
			},
			"double": {
				"regex": /^[0-9]+(.[0-9]+)?$/,
				"executor": "_customRegex",
				"alertText": "输入值必须是数值"
			},
			"digit": {
				"regex": /^[0-9]+$/,
				"executor": "_customRegex",
				"alertText": "只能输入数字"
			},
			"noSpecialCaracters": {
				"regex": /^[0-9a-zA-Z]+$/,
				"executor": "_customRegex",
				"alertText": "不允许输入字母和数字之外的特殊字符"
			},
			"letter": {
				"regex": /^[a-zA-Z]+$/,
				"executor": "_customRegex",
				"alertText": "只允许输入英文"
			},
			"chinese": {
				"regex": /^[\u0391-\uFFE5]+$/,
				"executor": "_customRegex",
				"alertText": "只允许输入中文"
			}
		},
		addRules : function(rules){
			$.extend($.validationConfig.allRules, rules);
		}
	}

	var validtorAttr = '[data-validator]';
	var validtorAttrValue = 'data-validator';
	$.fn.validation = function(options) {
		
		options = options || {};
		if(!options.promptType) options.promptType = 'inline';
		var settings = $.extend({
			validationEventTriggers: 	"focusout", //校验默认触发事件
			isPromptAll:				true,		//是否提示全部的错误， 否则只提示第一个错误， 默认是提示全部
			autoValidate: 				false ,		//自动校验
			buildPrompt: 				$.validatePrompt[options.promptType].build,
			closePrompt: 				$.validatePrompt[options.promptType].close
		}, options);
		
		var isInitClosePromptEvent = $(this).data("isInitClosePromptEvent");
		if(!isInitClosePromptEvent){ //关闭错误提示, 不重复添加
			$(this).data("isInitClosePromptEvent", true);
			$(this).find("input"+validtorAttr+",textarea"+validtorAttr).each(function(){
				$(this).bind("focus" , function(){
					settings.closePrompt(this);
				});
			});	
		}
		
		var isInitAutoValidate = $(this).data("isInitAutoValidate");
		//实时校验
		if(settings.autoValidate && !isInitAutoValidate) {
			$(this).data("isInitAutoValidate", true); //阻止重复添加
			//text、 textarea
			$(this).find("input"+validtorAttr+",textarea"+validtorAttr).each(function(){
				var event = $(this).attr("event") || settings.validationEventTriggers ;
				$(this).bind(event , function(){
					_inlineEvent(this, event);
				});
			}) ;		
			
		 	//btcheck、btradio
		 	$(this).find(validtorAttr+"[data-role=BTCheck],"+ validtorAttr+"[data-role=BTRadio]").each(function(){
				$(this).bind("tap" , function(){
					_inlineEvent(this, "tap");
				});
			}) ;	
			
			//TODO:重复初始化问题
			function _inlineEvent(caller,eventType) {
				$.validation.loadValidation(caller, eventType, settings);
			}
		} else {
			return $.validation.validate(this, settings);
		}

	}


	$.validation = {
		loadValidation : function(caller, eventType, settings) { // GET VALIDATIONS TO BE EXECUTED
			var rules = new Array();
			var getRules = $(caller).attr(validtorAttrValue);
			if (!getRules) return true;
			
			var ruleOptions = getRules.match(/\[.+\]/g); //由于正则表达式贪婪模式影响，规则只能存在一个[],否则解析错误
			if (ruleOptions) {
				$.each(ruleOptions, function(index, value) {
					getRules = getRules.replace(this, ("##" + index));
				});
			}

			getRules = getRules.split(",");
			$.each(getRules, function(index, value) {

				var ruleAndOption = this.split("##");
				
				if (ruleAndOption && ruleAndOption.length == 2) {
					rules.push({
						name : ruleAndOption[0],
						options : ruleOptions[ruleAndOption[1]].replace(/^\[|\]$/g, "").split(",")
					});
				} else {
					rules.push({
						name : ruleAndOption[0],
						options : []
					});
				}
			});

			return $.validation.validateCall(caller, rules, eventType, settings)
		},

		validateCall : function(caller, rules, eventType, settings) { // EXECUTE VALIDATION REQUIRED BY THE USER FOR THIS FIELD
			var promptText = "",
				callerName = $(caller).attr("name"),
				errorInfo = $(caller).attr("errorInfo"),
				isError = false;

			$.each(rules, function(i, v) {
				
				var validator = $.validationConfig.allRules[this.name];
				if (validator) {
					eval(validator.executor + "(caller,this,eventType)");
				}  
				
				if (isError) {
					return false;
				}
			});
 
			if (isError == true) {
				promptText = errorInfo || promptText;
				settings.buildPrompt(caller, promptText);
			} else {
				settings.closePrompt(caller);
			}


			/* VALIDATION FUNCTIONS */
			function _required(caller, rule) { // VALIDATE BLANK FIELD
				
				var callerType  = $(caller).attr("type");
				var tagName 	= $(caller)[0].tagName ;
				var dataRole    = $(caller).attr("data-role");
				
				if (callerType == "text" || callerType == "password" || tagName == "TEXTAREA"|| callerType == "hidden") {
					if (!$.trim($(caller).val())) {
						isError = true;
						promptText += _buildPromptText("该输入项必填", rule.options[0]);
					}
				} else if (dataRole == "BTRadio" || dataRole == "BTCheck") {
					callerName = $(caller).attr("name");

					if ($("[name='" + callerName + "'].BTCheck_ON").size() == 0) {
						isError = true;
						if ($("[name='" + callerName + "']").size() == 1) {
							promptText += _buildPromptText("该选项为必选项", rule.options[0]);
						} else {
							promptText += _buildPromptText("必须选择一个选项", rule.options[0]);
						}
					}
				} 
			}

			function _customRegex(caller, rule) { 
				
				if (_isValueEmpty(caller)) {
                    return false;
                }
				var customRule = rule.name;
				var pattern;
				if (customRule == "pattern") {
					pattern = {regex : rule.options[0], alertText : "输入内容不规范"};
				} else {
					pattern = $.validationConfig.allRules[customRule] 
				}
	
				if( typeof pattern.regex == 'string' ){
					pattern.regex = new RegExp(pattern.regex) ;
				}else{
					pattern.regex = eval(pattern.regex);
				}
				
				if (!pattern.regex.test($.trim($(caller).val()))) {
					isError = true;
					promptText += _buildPromptText(pattern.alertText);
				}
			}

			function _funcCall(caller, rule, eventType) { // VALIDATE CUSTOM FUNCTIONS OUTSIDE OF THE ENGINE SCOPE
				var funce = rule.options[0];

				var fn = window[funce];
				if (typeof(fn) === 'function') {
					var fn_result = fn(caller,eventType);
					if (fn_result.isError) {
						isError = true;
						promptText += _buildPromptText(fn_result.errorInfo);
					}
				}
			}

			function _confirm(caller, rule) { // VALIDATE FIELD MATCH
				var confirmField = rule.options[0];
				
				var conf = $("[name='"+confirmField+"']")[0]||$("#" + confirmField)[0] ;//兼容class写法

				if ($(caller).val() != $(conf).val()) {
					isError = true;
					promptText += _buildPromptText($.validationConfig.allRules[rule.name].alertText, rule.options[1]);
				} else {
                    settings.closePrompt(caller);
                }
			}

		 
			function _length(caller, rule) { // VALIDATE LENGTH
				if (_isValueEmpty(caller)) {
					return false;
				}

				var minL = rule.options[0];
				var maxL = rule.options[1];
				var feildLength = $.trim($(caller).val()).length; //.replace(/[^\x00-\xff]/g,'**') 不区分中文长度
				if (minL && feildLength < minL || maxL && feildLength > maxL) {
					isError = true;  
					var tip = "";
					if(minL) tip = '至少' + minL;
					if(maxL) tip += '最多' + maxL;
					promptText += _buildPromptText("已输入"+Math.ceil(feildLength)+"字符，请输入"+tip+"字符" , rule.options[2]);
				}
			}

			function _range(caller, rule) {
				var min = rule.options[0];
				var max = rule.options[1];

				var callerType = $(caller).attr("type");
				var dataRole    = $(caller).attr("data-role");
				if (dataRole == "BTRadio" || dataRole == "BTCheck") {
					var groupSize = $("[name='" + $(caller).attr("name") + "'].BTCheck_ON").size();
					if (groupSize < min || groupSize > max) {
						isError = true;
						var tip = [];
						if(min) tip.push(min);
						if(max) tip.push(max);
						promptText += _buildPromptText("必须选择" +tip.join("到")+ "个选项", rule.options[2]);
					}
				} else {
					if (_isValueEmpty(caller)) {
						return false;
					}
					var inputValue = parseFloat($.trim($(caller).val())) || 0;
					if (inputValue < min || inputValue > max) {
						isError = true;
						promptText += _buildPromptText("输入的值必须在" + min + "到" + max + "之间", rule.options[2]);
					}
				}
			}

			function _buildPromptText(defaultPT, customPT) {
				return customPT ? customPT : defaultPT;
			}

			function _isValueEmpty(caller) {
				return !($(caller).val() && $.trim($(caller).val()).length > 0);
			}

			return isError;
		},
		validate : function(caller, settings) { // FORM SUBMIT VALIDATION LOOPING INLINE VALIDATION
			
			var isError = false;
            var errorInfo = "";

			$(caller).find(validtorAttr).each(function() {
				var res = $.validation.loadValidation(this, null, settings);
				if(res && errorInfo == "") {
					isError = true;
					errorInfo = $(this).attr("errorInfo");
				}
				return settings.isPromptAll || !res;
			});
  
			return {isError:isError,errorInfo:errorInfo};
		}
	}
	
	
	$.validatePrompt = {
		//内嵌
		inline : {
			build : function(caller, promptText){
			 	var html = '<label class="errorInfo">' + promptText + '</label>';
			 	$(caller).siblings(".errorInfo").remove();
			 	$(caller).parent().append(html);			
			},
			close : function(caller){
				$(caller).siblings(".errorInfo").remove();	
			}			
		},
		//冒泡
		bubble : {
			build : function(caller, promptText){
	 			var html = '<label class="errorInfo bubble"><div class="error-inner">' + promptText + '</div><span class="ag"></span></label>';
	 			var pos = $(caller).parent().offset();
	 			var dataRole  = $(caller).attr("data-role");
	 			
	 			var $html = $(html).css({ 
	 				"max-width": pos.width,
	 				top: dataRole == undefined ? pos.height / 2 : pos.height 
	 			});
			 	$(caller).siblings(".errorInfo").remove();
			 	$html.appendTo($(caller).parent()).css("left", pos.width / 2 - $html.width()/ 2);
			},
			close : function(caller){
			 	$(caller).siblings(".errorInfo").remove();	
			}	
		}
	}

})(Zepto);
/*
 * @name Extend
 * @file 对Zepto做了些扩展，以下所有JS都依赖与此文件
 * @desc 对Zepto一些扩展，组件必须依赖
 * @import core/zepto.js
 */

(function($){
    $.extend($, {
        contains: function(parent, node) {
            /*
             * modified by chenluyang
             * @reason ios4 safari下，无法判断包含文字节点的情况
             * @original return parent !== node && parent.contains(node)
             */
            return parent.compareDocumentPosition
                ? !!(parent.compareDocumentPosition(node) & 16)
                : parent !== node && parent.contains(node)
        }
    });
})(Zepto);


//Core.js
;(function($, undefined) {
    //扩展在Zepto静态类上
    $.extend($, {
        /*
         * @grammar $.toString(obj)  ⇒ string
         * @name $.toString
         * @desc toString转化
         */
        toString: function(obj) {
            return Object.prototype.toString.call(obj);
        },

        /*
         * @desc 从集合中截取部分数据，这里说的集合，可以是数组，也可以是跟数组性质很像的对象，比如arguments
         * @name $.slice
         * @grammar $.slice(collection, [index])  ⇒ array
         * @example (function(){
         *     var args = $.slice(arguments, 2);
         *     console.log(args); // => [3]
         * })(1, 2, 3);
         */
        slice: function(array, index) {
            return Array.prototype.slice.call(array, index || 0);
        },

        /*
         * @name $.later
         * @grammar $.later(fn, [when, [periodic, [context, [data]]]])  ⇒ timer
         * @desc 延迟执行fn
         * **参数:**
         * - ***fn***: 将要延时执行的方法
         * - ***when***: *可选(默认 0)* 什么时间后执行
         * - ***periodic***: *可选(默认 false)* 设定是否是周期性的执行
         * - ***context***: *可选(默认 undefined)* 给方法设定上下文
         * - ***data***: *可选(默认 undefined)* 给方法设定传入参数
         * @example $.later(function(str){
         *     console.log(this.name + ' ' + str); // => Example hello
         * }, 250, false, {name:'Example'}, ['hello']);
         */
        later: function(fn, when, periodic, context, data) {
            return window['set' + (periodic ? 'Interval' : 'Timeout')](function() {
                fn.apply(context, data);
            }, when || 0);
        },

        /*
         * @desc 解析模版
         * @grammar $.parseTpl(str, data)  ⇒ string
         * @name $.parseTpl
         * @example var str = "<p><%=name%></p>",
         * obj = {name: 'ajean'};
         * console.log($.parseTpl(str, data)); // => <p>ajean</p>
         */
        parseTpl: function(str, data) {
            var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' + 'with(obj||{}){__p.push(\'' + str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/<%=([\s\S]+?)%>/g, function(match, code) {
                return "'," + code.replace(/\\'/g, "'") + ",'";
            }).replace(/<%([\s\S]+?)%>/g, function(match, code) {
                    return "');" + code.replace(/\\'/g, "'").replace(/[\r\n\t]/g, ' ') + "__p.push('";
                }).replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\t/g, '\\t') + "');}return __p.join('');";
            var func = new Function('obj', tmpl);
            return data ? func(data) : func;
        },

        /*
         * @desc 减少执行频率, 多次调用，在指定的时间内，只会执行一次。
         * **options:**
         * - ***delay***: 延时时间
         * - ***fn***: 被稀释的方法
         * - ***debounce_mode***: 是否开启防震动模式, true:start, false:end
         *
         * <code type="text">||||||||||||||||||||||||| (空闲) |||||||||||||||||||||||||
         * X    X    X    X    X    X      X    X    X    X    X    X</code>
         *
         * @grammar $.throttle(delay, fn) ⇒ function
         * @name $.throttle
         * @example var touchmoveHander = function(){
         *     //....
         * }
         * //绑定事件
         * $(document).bind('touchmove', $.throttle(250, touchmoveHander));//频繁滚动，每250ms，执行一次touchmoveHandler
         *
         * //解绑事件
         * $(document).unbind('touchmove', touchmoveHander);//注意这里面unbind还是touchmoveHander,而不是$.throttle返回的function, 当然unbind那个也是一样的效果
         *
         */
        throttle: function(delay, fn, debounce_mode) {
            var last = 0,
                timeId;

            if (typeof fn !== 'function') {
                debounce_mode = fn;
                fn = delay;
                delay = 250;
            }

            function wrapper() {
                var that = this,
                    period = Date.now() - last,
                    args = arguments;

                function exec() {
                    last = Date.now();
                    fn.apply(that, args);
                };

                function clear() {
                    timeId = undefined;
                };

                if (debounce_mode && !timeId) {
                    // debounce模式 && 第一次调用
                    exec();
                }

                timeId && clearTimeout(timeId);
                if (debounce_mode === undefined && period > delay) {
                    // throttle, 执行到了delay时间
                    exec();
                } else {
                    // debounce, 如果是start就clearTimeout
                    timeId = setTimeout(debounce_mode ? clear : exec, debounce_mode === undefined ? delay - period : delay);
                }
            };
            // for event bind | unbind
            wrapper._zid = fn._zid = fn._zid || $.proxy(fn)._zid;
            return wrapper;
        },

        /*
         * @desc 减少执行频率, 在指定的时间内, 多次调用，只会执行一次。
         * **options:**
         * - ***delay***: 延时时间
         * - ***fn***: 被稀释的方法
         * - ***t***: 指定是在开始处执行，还是结束是执行, true:start, false:end
         *
         * 非at_begin模式
         * <code type="text">||||||||||||||||||||||||| (空闲) |||||||||||||||||||||||||
         *                         X                                X</code>
         * at_begin模式
         * <code type="text">||||||||||||||||||||||||| (空闲) |||||||||||||||||||||||||
         * X                                X                        </code>
         *
         * @grammar $.debounce(delay, fn[, at_begin]) ⇒ function
         * @name $.debounce
         * @example var touchmoveHander = function(){
         *     //....
         * }
         * //绑定事件
         * $(document).bind('touchmove', $.debounce(250, touchmoveHander));//频繁滚动，只要间隔时间不大于250ms, 在一系列移动后，只会执行一次
         *
         * //解绑事件
         * $(document).unbind('touchmove', touchmoveHander);//注意这里面unbind还是touchmoveHander,而不是$.debounce返回的function, 当然unbind那个也是一样的效果
         */
        debounce: function(delay, fn, t) {
            return fn === undefined ? $.throttle(250, delay, false) : $.throttle(delay, fn, t === undefined ? false : t !== false);
        }
    });

    /*
     * 扩展类型判断
     * @param {Any} obj
     * @see isString, isBoolean, isRegExp, isNumber, isDate, isObject, isNull, isUdefined
     */
    /*
     * @name $.isString
     * @grammar $.isString(val)  ⇒ Boolean
     * @desc 判断变量类型是否为***String***
     * @example console.log($.isString({}));// => false
     * console.log($.isString(123));// => false
     * console.log($.isString('123'));// => true
     */
    /*
     * @name $.isBoolean
     * @grammar $.isBoolean(val)  ⇒ Boolean
     * @desc 判断变量类型是否为***Boolean***
     * @example console.log($.isBoolean(1));// => false
     * console.log($.isBoolean('true'));// => false
     * console.log($.isBoolean(false));// => true
     */
    /*
     * @name $.isRegExp
     * @grammar $.isRegExp(val)  ⇒ Boolean
     * @desc 判断变量类型是否为***RegExp***
     * @example console.log($.isRegExp(1));// => false
     * console.log($.isRegExp('test'));// => false
     * console.log($.isRegExp(/test/));// => true
     */
    /*
     * @name $.isNumber
     * @grammar $.isNumber(val)  ⇒ Boolean
     * @desc 判断变量类型是否为***Number***
     * @example console.log($.isNumber('123'));// => false
     * console.log($.isNumber(true));// => false
     * console.log($.isNumber(123));// => true
     */
    /*
     * @name $.isDate
     * @grammar $.isDate(val)  ⇒ Boolean
     * @desc 判断变量类型是否为***Date***
     * @example console.log($.isDate('123'));// => false
     * console.log($.isDate('2012-12-12'));// => false
     * console.log($.isDate(new Date()));// => true
     */
    /*
     * @name $.isObject
     * @grammar $.isObject(val)  ⇒ Boolean
     * @desc 判断变量类型是否为***Object***
     * @example console.log($.isObject('123'));// => false
     * console.log($.isObject(true));// => false
     * console.log($.isObject({}));// => true
     */
    /*
     * @name $.isNull
     * @grammar $.isNull(val)  ⇒ Boolean
     * @desc 判断变量类型是否为***null***
     * @example console.log($.isNull(false));// => false
     * console.log($.isNull(0));// => false
     * console.log($.isNull(null));// => true
     */
    /*
     * @name $.isUndefined
     * @grammar $.isUndefined(val)  ⇒ Boolean
     * @desc 判断变量类型是否为***undefined***
     * @example
     * console.log($.isUndefined(false));// => false
     * console.log($.isUndefined(0));// => false
     * console.log($.isUndefined(a));// => true
     */
    $.each("String Boolean RegExp Number Date Object Null Undefined".split(" "), function( i, name ){
        var fn;

        if( 'is' + name in $ ) return;//already defined then ignore.

        switch (name) {
            case 'Null':
                fn = function(obj){ return obj === null; };
                break;
            case 'Undefined':
                fn = function(obj){ return obj === undefined; };
                break;
            default:
                fn = function(obj){ return new RegExp(name + ']', 'i').test( toString(obj) )};
        }
        $['is'+name] = fn;
    });

    var toString = $.toString;

})(Zepto);

//Support.js
(function($, undefined) {
    var ua = navigator.userAgent,
        na = navigator.appVersion,
        br = $.browser;

    /*
     * @name $.browser
     * @desc 扩展zepto中对browser的检测
     *
     * **可用属性**
     * - ***qq*** 检测qq浏览器
     * - ***chrome*** 检测chrome浏览器
     * - ***uc*** 检测uc浏览器
     * - ***version*** 检测浏览器版本
     *
     * @example
     * if ($.browser.qq) {      //在qq浏览器上打出此log
     *     console.log('this is qq browser');
     * }
     */
    $.extend( br, {
        qq: /qq/i.test(ua),
        uc: /UC/i.test(ua) || /UC/i.test(na)
    } );

    br.uc = br.uc || !br.qq && !br.chrome && !br.firefox && !/safari/i.test(ua);

    try {
        br.version = br.uc ? na.match(/UC(?:Browser)?\/([\d.]+)/)[1] : br.qq ? ua.match(/MQQBrowser\/([\d.]+)/)[1] : br.version;
    } catch (e) {}


    /*
     * @name $.support
     * @desc 检测设备对某些属性或方法的支持情况
     *
     * **可用属性**
     * - ***orientation*** 检测是否支持转屏事件，UC中存在orientaion，但转屏不会触发该事件，故UC属于不支持转屏事件(iOS 4上qq, chrome都有这个现象)
     * - ***touch*** 检测是否支持touch相关事件
     * - ***cssTransitions*** 检测是否支持css3的transition
     * - ***has3d*** 检测是否支持translate3d的硬件加速
     *
     * @example
     * if ($.support.has3d) {      //在支持3d的设备上使用
     *     console.log('you can use transtion3d');
     * }
     */
    $.support = $.extend($.support || {}, {
        orientation: !(br.uc || (parseFloat($.os.version)<5 && (br.qq || br.chrome))) && !($.os.android && parseFloat($.os.version) > 3) && "orientation" in window && "onorientationchange" in window,
        touch: "ontouchend" in document,
        cssTransitions: "WebKitTransitionEvent" in window,
        has3d: 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix()
    });

})(Zepto);

//Event.js
(function($) {
    /* detect orientation change */
    $(document).ready(function () {
        var getOrt = function(){
                var elem = document.documentElement;
                return elem.clientWidth / Math.max(elem.clientHeight, 320) < 1.1 ? "portrait" : "landscape";
            },
            lastOrt = getOrt(),
            handler = function(e) {
                maxTry = 20;
                clearInterval(timer);
                timer = $.later(function() {
                    var curOrt = getOrt();
                    if (lastOrt !== curOrt) {
                        lastOrt = curOrt;
                        clearInterval(timer);
                        //$(document.body).append(curOrt);
                        $(window).trigger('ortchange');
                    } else if(--maxTry){//最多尝试20次
                        clearInterval(timer);
                    }
                }, 50, true);
            },
            timer, maxTry;
        $(window).bind($.support.orientation ? 'orientationchange' : 'resize', $.debounce(handler));
    });

    /*
     * @name Trigger Events
     * @theme event
     * @desc 扩展的事件
     * - ***scrollStop*** : scroll停下来时触发, 考虑前进或者后退后scroll事件不触发情况。
     * - ***ortchange*** : 当转屏的时候触发，兼容uc和其他不支持orientationchange的设备
     * @example $(document).on('scrollStop', function () {        //scroll停下来时显示scrollStop
     *     console.log('scrollStop');
     * });
     *
     * $(document).on('ortchange', function () {        //当转屏的时候触发
     *     console.log('ortchange');
     * });
     */
    /* dispatch scrollStop */
    function _registerScrollStop(){
        $(window).on('scroll', $.debounce(80, function() {
            $(document).trigger('scrollStop');
        }, false));
    }
    //在离开页面，前进或后退回到页面后，重新绑定scroll, 需要off掉所有的scroll，否则scroll时间不触发
    function _touchstartHander() {
        $(window).off('scroll');
        _registerScrollStop();
    }
    _registerScrollStop();
    $(window).on('pageshow', function(e){
        if(e.persisted) {//如果是从bfcache中加载页面
            $(document).off('touchstart', _touchstartHander).one('touchstart', _touchstartHander);
        }
    });
})(Zepto);

/*
 * @file 所有UI组件的基类，通过它可以简单的快速的创建新的组件。
 * @name UI 基类
 * @short Zepto UI
 * @desc 所有UI组件的基类，通过它可以简单的快速的创建新的组件。
 * @import core/zepto.js, core/zepto.extend.js
 */
(function($, undefined) {
    var id = 1,
        _blankFn = function(){},
        tpl = '<%=name%>-<%=id%>',

        //所有组件实例的记录
        record = (function(){
            var data = {},
                id = 0,
                iKey = "GMUWidget"+(+ new Date()); //internal key.

            return function( obj, key, val){
                var dkey = obj[ iKey ] || ( obj[ iKey ] = ++id ),
                    store = data[dkey] || (data[dkey] = {});

                !$.isUndefined(val) && (store[key] = val);
                $.isNull(val) && delete store[key];

                return store[ key ];
            }
        })();
        
    $.ui = $.ui || {
        version: '2.0.3',

        guid: _guid,

        /*
         * @name $.ui.define
         * @grammar $.ui.define(name, data[, superClass]) ⇒ undefined
         * @desc 定义组件,
         * - ''name'' 组件名称
         * - ''data'' 对象，设置此组件的prototype。可以添加属性或方法
         * - ''superClass'' 基类，指定此组件基于哪个现有组件，默认为Widget基类
         * **示例:**
         * <code type="javascript">
         * $.ui.define('helloworld', {
         *     _data: {
         *         opt1: null
         *     },
         *     enable: function(){
         *         //...
         *     }
         * });
         * </code>
         *
         * **定义完后，就可以通过以下方式使用了**
         *<code type="javascript">
         * var instance = $.ui.helloworld({opt1: true});
         * instance.enable();
         *
         * //或者
         * $('#id').helloworld({opt1:true});
         * //...later
         * $('#id').helloworld('enable');
         * </code>
         *
         * **Tips**
         * 1. 通过Zepto对象上的组件方法，可以直接实例话组件, 如: $('#btn').button({label: 'abc'});
         * 2. 通过Zepto对象上的组件方法，传入字符串this, 可以获得组件实例，如：var btn = $('#btn').button('this');
         * 3. 通过Zepto对象上的组件方法，可以直接调用组件方法，第一个参数用来指定方法名，之后的参数作为方法参数，如: $('#btn').button('setIcon', 'home');
         * 4. 在子类中，如覆写了某个方法，可以在方法中通过this.$super()方法调用父级方法。如：this.$super('enable');
         */
        define: function(name, data, superClass) {
            if(superClass) data.inherit = superClass;
            var Class = $.ui[name] = _createClass(function(el, options) {
                var obj = _createObject(Class.prototype, {
                    _id: $.parseTpl(tpl, {
                        name: name,
                        id: _guid()
                    })
                });

                obj._createWidget.call(obj, el, options,Class.plugins);
                return obj;
            }, data);
            return _zeptoLize(name, Class);
        },

        /*
         * @name $.ui.isWidget()
         * @grammar $.ui.isWidget(obj) ⇒ boolean
         * @grammar $.ui.isWidget(obj, name) ⇒ boolean
         * @desc 判断obj是不是widget实例
         *
         * **参数**
         * - ''obj'' 用于检测的对象
         * - ''name'' 可选，默认监测是不是''widget''(基类)的实例，可以传入组件名字如''button''。作用将变为obj是不是button组件实例。
         * @param obj
         * @param name
         * @example
         *
         * var btn = $.ui.button(),
         *     dialog = $.ui.dialog();
         *
         * console.log($.isWidget(btn)); // => true
         * console.log($.isWidget(dialog)); // => true
         * console.log($.isWidget(btn, 'button')); // => true
         * console.log($.isWidget(dialog, 'button')); // => false
         * console.log($.isWidget(btn, 'noexist')); // => false
         */
        isWidget: function(obj, name){
            return obj instanceof (name===undefined ? _widget: $.ui[name] || _blankFn);
        }
    };
        
    /*
     * generate guid
     */
    function _guid() {
        return id++;
    };

    //创建一个对象，合并__proto__和属性
    function _createObject(proto, data) {
        var obj = {};
        Object.create ? obj = Object.create(proto) : obj.__proto__ = proto;
        return $.extend(obj, data || {});
    }

    function _createClass(Class, data) {
        if (data) {
            _process(Class, data);
            $.extend(Class.prototype, data);
        }
        return $.extend(Class, {
            plugins: [],
            register: function(fn) {
                if ($.isObject(fn)) {
                    $.extend(this.prototype,fn);
                    return;
                }
                this.plugins.push(fn);
            }
        });
    }

    /*
     * handle inherit & _data
     */
    function _process(Class, data) {
        var superClass = data.inherit || _widget,
            proto = superClass.prototype,
            obj;
        obj = Class.prototype = _createObject(proto, {
            $factory: Class,
            $super: function(key) {
                var fn = proto[key];
                return $.isFunction(fn) ? fn.apply(this, $.slice(arguments, 1)) : fn;
            }
        });
        obj._data = $.extend({}, proto._data, data._data);
        delete data._data;
        return Class;
    }

    /*
     * 强制setup模式
     * @grammar $(selector).dialog(opts);
     */
    function _zeptoLize( name ) {
        $.fn[ name ] = function(opts) {
            var ret,
                obj,
                args = $.slice(arguments, 1);

            $.each( this, function( i, el ){

                obj = record( el, name ) || $.ui[name]( el, $.extend( $.isPlainObject(opts) ? opts : {}, {
                    setup: true
                } ) );

                ret = $.isString( opts ) && $.isFunction( obj[ opts ] ) ? obj[opts].apply(obj, args) : undefined;

                if( ret !== undefined && ret !== obj || opts === "this" && ( ret = obj ) ) {
                    return false;
                }
                ret = undefined;
            });
            //ret 为真就是要返回ui实例之外的内容
            //obj 'this'时返回
            //其他都是返回zepto实例
            //修改返回值为空的时，返回值不对的问题
            return ret !== undefined ? ret : this;
        };
    }
    /*
     * @name widget基类
     * @desc GMU所有的组件都是此类的子类，即以下此类里面的方法都可在其他组建中调用。
     */
    var _widget = function() {};
    $.extend(_widget.prototype, {
        _data: {
            status: true
        },

        /*
         * @name data
         * @grammar data(key) ⇒ value
         * @grammar data(key, value) ⇒ value
         * @desc 设置或者获取options, 所有组件中的配置项都可以通过此方法得到。
         * @example
         * $('a#btn').button({label: '按钮'});
         * console.log($('a#btn').button('data', 'label'));// => 按钮
         */
        data: function(key, val) {
            var _data = this._data;
            if ($.isObject(key)) return $.extend(_data, key);
            else return !$.isUndefined(val) ? _data[key] = val : _data[key];
        },

        /*
         * common constructor
         */
        _createWidget: function(el, opts,plugins) {

            if ($.isObject(el)) {
                opts = el || {};
                el = undefined;
            }

            var data = $.extend({}, this._data, opts);
            $.extend(this, {
                _el: el ? $(el) : undefined,
                _data: data
            });

            //触发plugins
            var me = this;
            $.each( plugins, function( i, fn ){
                var result = fn.apply( me );
                if(result && $.isPlainObject(result) ){
                    var plugins = me._data.disablePlugin;
                    if( !plugins || $.isString(plugins) && !~plugins.indexOf() ){
                        delete result.pluginName;
                        $.each(result,function( key, val ){
                            var orgFn;
                            if((orgFn = me[key]) && $.isFunction( val ) ){
                                me[key] = function(){
                                    me[key + 'Org'] = orgFn;
                                    return val.apply(me,arguments);
                                }
                            }else
                                me[key] = val;
                        });
                    }
                }
            });
            // use setup or render
            if(data.setup) this._setup(el && el.getAttribute('data-mode'));
            else this._create();
            this._init();

            var me = this,
                $el = this.trigger('init').root();
            $el.on('tap', function(e) {
                (e['bubblesList'] || (e['bubblesList'] = [])).push(me);
            });

            record( $el[0], me._id.split('-')[0], me );
        },

        /*
         * @interface: use in render mod
         * @name _create
         * @desc 接口定义，子类中需要重新实现此方法，此方法在render模式时被调用。
         *
         * 所谓的render方式，即，通过以下方式初始化组件
         * <code>
         * $.ui.widgetName(options);
         * </code>
         */
        _create: function() {},

        /*
         * @interface: use in setup mod
         * @name _setup
         * @desc 接口定义，子类中需要重新实现此方法，此方法在setup模式时被调用。第一个行参用来分辨时fullsetup，还是setup
         *
         * <code>
         * $.ui.define('helloworld', {
         *     _setup: function(mode){
         *          if(mode){
         *              //为fullsetup模式
         *          } else {
         *              //为setup模式
         *          }
         *     }
         * });
         * </code>
         *
         * 所谓的setup方式，即，先有dom，然后通过选择器，初始化Zepto后，在Zepto对象直接调用组件名方法实例化组件，如
         * <code>
         * //<div id="widget"></div>
         * $('#widget').widgetName(options);
         * </code>
         *
         * 如果用来初始化的element，设置了data-mode="true"，组件将以fullsetup模式初始化
         */
        _setup: function(mode) {},

        /*
         * @name root
         * @grammar root() ⇒ value
         * @grammar root(el) ⇒ value
         * @desc 设置或者获取根节点
         * @example
         * $('a#btn').button({label: '按钮'});
         * console.log($('a#btn').button('root'));// => a#btn
         */
        root: function(el) {
            return this._el = el || this._el;
        },

        /*
         * @name id
         * @grammar id() ⇒ value
         * @grammar id(id) ⇒ value
         * @desc 设置或者获取组件id
         */
        id: function(id) {
            return this._id = id || this._id;
        },

        /*
         * @name destroy
         * @grammar destroy() ⇒ undefined
         * @desc 注销组件
         */
        destroy: function() {
            var me = this,
                $el;
            $el = this.trigger('destroy').off().root();
            $el.find('*').off();
            record( $el[0], me._id.split('-')[0], null);
            $el.off().remove();
            this.__proto__ = null;
            $.each(this, function(key) {
                delete me[key];
            });
        },

        /*
         * @name on
         * @grammar on(type, handler) ⇒ instance
         * @desc 绑定事件，此事件绑定不同于zepto上绑定事件，此On的this只想组件实例，而非zepto实例
         */
        on: function(ev, callback) {
            this.root().on(ev, $.proxy(callback, this));
            return this;
        },

        /*
         * @name off
         * @grammar off(type) ⇒ instance
         * @grammar off(type, handler) ⇒ instance
         * @desc 解绑事件
         */
        off: function(ev, callback) {
            this.root().off(ev, callback);
            return this;
        },

        /*
         * @name trigger
         * @grammar trigger(type[, data]) ⇒ instance
         * @desc 触发事件, 此trigger会优先把options上的事件回调函数先执行，然后给根DOM派送事件。
         * options上回调函数可以通过e.preventDefaualt()来组织事件派发。
         */
        trigger: function(event, data) {
            event = $.isString(event) ? $.Event(event) : event;
            var onEvent = this.data(event.type),result;
            if( onEvent && $.isFunction(onEvent) ){
                event.data = data;
                result = onEvent.apply(this, [event].concat(data));
                if(result === false || event.defaultPrevented){
                    return this;
                }
            }
            this.root().trigger(event, data);
            return this;
        }
    });
})(Zepto);
/**
图片轮播组件
 @class ui.Slider
*/
(function($, undefined) {
    /**
        图片轮播组件
        @method  $(selector).slider(options)
        @param container {selector|zepto} (可选)放置的父容器
        @param content {Array}  (必选)内容,格式为：[ {href:'图片跳转URL', pic:'图片路径', title:'图片下方文字'}, {...}]
        @param viewNum {Number}  (可选, 默认:1) 可以同时看到几张图片
        @param imgInit {Number}  (可选, 默认:2)初始加载几张图片
        @param itemRender {Function} (可选)render模式时，使用的自定义内容构造函数，接受一个从0开始的index参数，返回空值时构造结束
        @param imgZoom {Boolean}  (可选, 默认:false)是否缩放图片,设为true时可以将超出边界的图片等比缩放
        @param loop {Boolean}  (可选, 默认:false)设为true时,播放到最后一张时继续正向播放第一张(无缝滑动)，设为false则反向播放倒数第2张
        @param stopPropagation {Boolean}  (可选, 默认:false)是否在横向滑动的时候阻止冒泡(慎用,会导致上层元素接受不到touchMove事件)
        @param springBackDis {Number} (可选, 默认:15)滑动能够回弹的最大距离
        @param autoPlay {Boolean} ((可选, 默认:true)是否自动播放
        @param autoPlayTime {Number}  (可选, 默认:4000ms)自动播放的间隔
        @param animationTime {Number} (可选, 默认:400ms)滑动动画时间
        @param showArr {Boolean}  (可选, 默认:true)是否展示上一个下一个箭头
        @param showDot {Boolean}  (可选, 默认:true)是否展示页码
        @param slide {Function}  (可选)开始切换页面时执行的函数,第1个参数为Event对象,第2个参数为滑动后的page页码
        @param slideend {Function} (可选)页面切换完成(滑动完成)时执行的函数,第1个参数为Event对象,第2个参数为滑动后的page页码
        @chainable
        @example
            HTML:
                <div id="slider">
                    <div>
                        <a href="#"><img lazyload="statics/images/image1.png"></a>
                        <p>1,让Coron的太阳把自己晒黑—小天</p>
                    </div>
                    <div>
                        <a href="#"><img lazyload="statics/images/image2.png"></a>
                        <p>2,让Coron的太阳把自己晒黑—小天</p>
                    </div>
                    <div>
                        <a href="#"><img lazyload="statics/images/image3.png"></a>
                        <p>3,让Coron的太阳把自己晒黑—小天</p>
                    </div>
                    <div>
                        <a href="#"><img lazyload="statics/images/image4.png"></a>
                        <p>4,让Coron的太阳把自己晒黑—小天</p>
                    </div>
                </div>
            JS:
                $('#slider').slider({
                    autoPlayTime:3000
                });
    */
    $.ui.define('slider', {
        _data:{
            viewNum:                1,
            imgInit:                2,
            itemRender:             null,
            imgZoom:                false,
            loop:                   true,
            stopPropagation:        false,
            springBackDis:          15,
            autoPlay:               true,
            autoPlayTime:           4000,
            animationTime:          400,
            showArr:                false,
            showDot:                true,
            slide:                  null,
            slideend:               null,
            index:                  0,
            _stepLength:            1,
            _direction:             1
        },

        _create:function() {
            var me = this,
                i = 0, j, k = [],
                content = me.data('content');
            me._initConfig();
            (me.root() || me.root($('<div></div>'))).addClass('ui-slider').appendTo(me.data('container') || (me.root().parent().length ? '' : document.body)).html(
            '<div class="ui-slider-wheel"><div class="ui-slider-group">' +
            (function() {
                if(me.data('itemRender')) {
                    var render = me.data('itemRender');
                    while(j = render.call(me, i++)) k.push('<div class="ui-slider-item">' + j + '</div>');
                } else {
                    while(j = content[i++]) k.push('<div class="ui-slider-item"><a href="' + j.href + '"><img lazyload="' + j.pic + '"/></a>' + (j.title ? '<p>' + j.title + '</p>': '') + '</div>');
                }
                k.push(me.data('loop') ? '</div><div class="ui-slider-group">' + k.join('') + '</div></div>' : '</div></div>');
                return k.join('');
            }()));
            me._addDots();
        },

        _setup: function(mode) {
            var me = this,
                root = me.root().addClass('ui-slider');
            me._initConfig();
            if(!mode) {
                var items = root.children(),
                    group = $('<div class="ui-slider-group"></div>').append(items.addClass('ui-slider-item'));
                root.empty().append($('<div class="ui-slider-wheel"></div>').append(group).append(me.data('loop') ? group.clone() : ''));
                me._addDots();
            } else me.data('loop') && $('.ui-slider-wheel', root).append($('.ui-slider-group', root).clone());
        },

        _init:function() {
            var me = this,
                index = me.data('index'),
                root = me.root(),
                _eventHandler = $.proxy(me._eventHandler, me);
            me._setWidth();
            $(me.data('wheel')).on('touchstart touchmove touchend touchcancel webkitTransitionEnd', _eventHandler);
            $(window).on('ortchange', _eventHandler);
            $('.ui-slider-pre', root).on('tap', function() { me.pre() });
            $('.ui-slider-next', root).on('tap', function() { me.next() });
            me.on('destroy',function() {
                clearTimeout(me.data('play'));
                $(window).off('ortchange', _eventHandler);
            });
            me.data('autoPlay') && me._setTimeout();
        },

        /*
         * 初始化参数配置
         */
        _initConfig: function() {
            var o = this._data;
            if(o.viewNum > 1) {
                o.loop = false;
                o.showDot = false;
                o.imgInit = o.viewNum + 1;
            }
        },

        /*
         * 添加底部圆点及两侧箭头
         */
        _addDots:function() {
            var me = this,
                root = me.root(),
                length = $('.ui-slider-item', root).length / (me.data('loop') ? 2 : 1),
                html = [];
            if(me.data('showDot')) {
                html.push('<p class="ui-slider-dots">');
                while(length--) html.push('<b></b>');
                html.push('</p>');
            }
            me.data('showArr') && (html.push('<span class="ui-slider-pre"><b></b></span><span class="ui-slider-next"><b></b></span>'));
            root.append(html.join(''));
        },
        /*
         * 设置轮播条及元素宽度,设置选中dot,设置索引map,加载图片
         */
        _setWidth:function(){
            var me = this,
                o = me._data,
                root = me.root(),
                width = Math.ceil(root.width() / o.viewNum),
                height = root.height(),
                loop = o.loop,
                items = $('.ui-slider-item', root).toArray(),
                length = items.length,
                wheel = $('.ui-slider-wheel', root).width(width * length)[0],
                dots = $('.ui-slider-dots b', root).toArray(),
                allImgs = $('img', root).toArray(),
                lazyImgs = allImgs.concat(),
                dotIndex = {}, i, j,
                l = o.imgInit || length;
            o.showDot && (dots[0].className = 'ui-slider-dot-select');
            if(o.imgZoom) $(lazyImgs).on('load', function() {
                var h = this.height,
                    w = this.width,
                    min_h = Math.min(h, height),
                    min_w = Math.min(w, width);
                if(h/height > w/width) this.style.cssText += 'height:' + min_h + 'px;' + 'width:' + min_h/h * w + 'px;';
                else this.style.cssText += 'height:' + min_w/w * h + 'px;' + 'width:' + min_w + 'px';
                this.onload = null;
            });
            for(i = 0; i < length; i++) {
                items[i].style.cssText += 'width:'+ width + 'px;position:absolute;-webkit-transform:translate3d(' + i * width + 'px,0,0);z-index:' + (900 - i);
                dotIndex[i] = loop ? (i > length/2 - 1 ? i - length/2 : i) : i;
                if(i < l) {
                    j = lazyImgs.shift();
                    j && (j.src = j.getAttribute('lazyload'));
                    if(o.loop) {
                        j = allImgs[i + length/2];
                        j && (j.src = j.getAttribute('lazyload'));
                    }
                }
            }
            me.data({
                root:           root[0],
                wheel:          wheel,
                items:          items,
                lazyImgs:       lazyImgs,
                allImgs:        allImgs,
                length:         length,
                width:          width,
                height:         height,
                dots:           dots,
                dotIndex:       dotIndex,
                dot:            dots[0]
            });
            return me;
        },

        /*
         * 事件管理函数
         */
        _eventHandler:function(e) {
            var me = this;
            switch (e.type) {
                case 'touchmove':
                    me._touchMove(e);
                    break;
                case 'touchstart':
                    me._touchStart(e);
                    break;
                case 'touchcancel':
                case 'touchend':
                    me._touchEnd();
                    break;
                case 'webkitTransitionEnd':
                    me._transitionEnd();
                    break;
                case 'ortchange':
                    me._resize.call(me);
                    break;
            }
        },

        /*
         * touchstart事件
         */
        _touchStart:function(e) {
            var me = this;
            me.data({
                pageX:      e.touches[0].pageX,
                pageY:      e.touches[0].pageY,
                S:          false,      //isScrolling
                T:          false,      //isTested
                X:          0           //horizontal moved
            });
            me.data('wheel').style.webkitTransitionDuration = '0ms';
        },

        /*
         * touchmove事件
         */
        _touchMove:function(e) {
            var o = this._data,
                X = o.X = e.touches[0].pageX - o.pageX;
            if(!o.T) {
                var index = o.index,
                    length = o.length,
                    S = Math.abs(X) < Math.abs(e.touches[0].pageY - o.pageY);
                o.loop && (o.index = index > 0 && (index < length - 1) ? index : (index === length - 1) && X < 0 ? length/2 - 1 : index === 0 && X > 0 ? length/2 : index);
                S || clearTimeout(o.play);
                o.T = true;
                o.S = S;
            }
            if(!o.S) {
                o.stopPropagation && e.stopPropagation();
                e.preventDefault();
                o.wheel.style.webkitTransform = 'translate3d(' + (X - o.index * o.width) + 'px,0,0)';
            }
        },

        /*
         * touchend事件
         */
        _touchEnd:function() {
            var me = this,
                o = me._data;
            if(!o.S) {
                var distance = o.springBackDis,
                stepLength = o.X <= -distance ? Math.ceil(-o.X / o.width) : (o.X > distance) ? -Math.ceil(o.X / o.width) : 0;
                o._stepLength = Math.abs(stepLength);
                me._slide(o.index + stepLength);
            }
        },

        /*
         * 轮播位置判断
         */
        _slide:function(index, auto) {
            var me = this,
                o = me._data,
                length = o.length,
                end = length - o.viewNum + 1;
            if(-1 < index && index < end) {
                me._move(index);
            } else if(index >= end) {
                if(!o.loop) {
                    me._move(end - (auto ? 2 : 1));
                    o._direction = -1;
                } else {
                    o.wheel.style.cssText += '-webkit-transition:0ms;-webkit-transform:translate3d(-' + (length/2 - 1) * o.width + 'px,0,0);';
                    o._direction =  1;
                    $.later(function() {me._move(length/2)}, 20);
                }
            } else {
                if(!o.loop) me._move(auto ? 1 : 0);
                else {
                    o.wheel.style.cssText += '-webkit-transition:0ms;-webkit-transform:translate3d(-' + (length/2) * o.width + 'px,0,0);';
                    $.later(function() {me._move(length/2 - 1)}, 20);
                }
                o._direction =  1;
            }
            return me;
        },

        /*
         * 轮播方法
         */
        _move:function(index) {
            var o = this._data,
                dotIndex = o.dotIndex[index];
            this.trigger('slide', dotIndex);
            if(o.lazyImgs.length) {
                var j = o.allImgs[index];
                j && j.src || (j.src = j.getAttribute('lazyload'));
            }
            if(o.showDot) {
                o.dot.className = '';
                o.dots[dotIndex].className = 'ui-slider-dot-select';
                o.dot = o.dots[dotIndex];
            }
            o.index = index;
            o.wheel.style.cssText += '-webkit-transition:' + o.animationTime + 'ms;-webkit-transform:translate3d(-' + index * o.width + 'px,0,0);';
        },

        /*
         * 滑动结束
         */
        _transitionEnd:function() {
            var me = this,
                o = me._data;
            me.trigger('slideend', o.dotIndex[o.index]);
            if(o.lazyImgs.length){
                for(var length = o._stepLength, i = 0; i< length; i++) {
                    var j = o.lazyImgs.shift();
                    j && (j.src = j.getAttribute('lazyload'));
                    if(o.loop) {
                        j = o.allImgs[o.index + o.length / 2];
                        j && !j.src && (j.src = j.getAttribute('lazyload'));
                    }
                }
                o._stepLength = 1;
            }
            me._setTimeout();
        },

        /*
         * 设置自动播放
         */
        _setTimeout:function() {
            var me = this, o = me._data;
            if(!o.autoPlay) return me;
            clearTimeout(o.play);
            o.play = $.later(function() {
                me._slide.call(me, o.index + o._direction, true);
            }, o.autoPlayTime);
            return me;
        },

        /*
         * 重设容器及子元素宽度
         */
        _resize:function() {
            var me = this,
                o = me._data,
                width = o.root.offsetWidth / o.viewNum, //todo 添加获取隐藏元素大小的方法
                length = o.length,
                items = o.items;
            if(!width) return me;
            o.width = width;
            clearTimeout(o.play);
            for(var i = 0; i < length; i++) items[i].style.cssText += 'width:' + width + 'px;-webkit-transform:translate3d(' + i * width + 'px,0,0);';
            o.wheel.style.removeProperty('-webkit-transition');
            o.wheel.style.cssText += 'width:' + width * length + 'px;-webkit-transform:translate3d(-' + o.index * width + 'px,0,0);';
            o._direction = 1;
            me._setTimeout();
            return me;
        },

        /**
            滚动到上一张
            @method $(selector).slider('pre')
            @chainable
            @example
                $('#slider').slider('pre');
        */
        pre:function() {
            var me = this;
            me._slide(me.data('index') - 1);
            return me;
        },

        /**
            滚动到下一张
            @method $(selector).slider('next')
            @chainable
            @example
                $('#slider').slider('next');
        */
        next:function() {
            var me = this;
            me._slide(me.data('index') + 1);
            return me;
        },

        /**
            停止自动播放
            @method $(selector).slider('stop')
            @chainable
            @example
                $('#slider').slider('stop');
        */
        stop:function() {
            var me = this;
            clearTimeout(me.data('play'));
            me.data('autoPlay', false);
            return me;
        },

        /**
            恢复自动播放
            @method $(selector).slider('resume')
            @chainable
            @example
                $('#slider').slider('resume');
        */
        resume:function() {
            var me = this;
            me.data('_direction',1);
            me.data('autoPlay', true);
            me._setTimeout();
            return me;
        }

        /*
         * @name Trigger Events
         * @theme event
         * @desc 组件内部触发的事件
         * ^ 名称 ^ 处理函数参数 ^ 描述 ^
         * | init | event | 组件初始化的时候触发，不管是render模式还是setup模式都会触发 |
         * | slide | event | 开始切换页面时执行的函数，参数为滑动后的page页码 |
         * | slideend | event | 页面切换完成(滑动完成)时执行的函数，参数为滑动后的page页码 |
         * | destroy | event | 组件在销毁的时候触发 |
         */
    });
})(Zepto);

/**
导航栏组件
 @class ui.Navigator
*/
/**
    导航栏组件初始化
    @method $(selector).navigator()
    @param container      {Selector|Zepto}   (可选)父容器，渲染的元素，默认值：document.body
    @param content        {Array}             (必选)导航tab项的内容，支持fix的元素(设置pos)及自定义属性(设置attr){text:\'\',url:\'\',pos:\'\',attr:{a:\'\',b:\'\'}}
    @param defTab          {Number}            (可选, 默认:0)默认选中的导航tab项的索引，若为默认选中固定tab，则索引值在原来tabs.length上加1，默认值：0
    @param beforetabselect {Function}          (可选)tab选中前的事件，可阻止tab选中
    @param tabselect      {Function}          (可选)tab选中时的事件 
*/
(function ($, undefined) {
     
    var tmpl = '<% for (var i=0, len=left.length; i<len; i++) { %>'
            + '<a href="<%=left[i].url%>" class="ui-navigator-fix ui-navigator-fixleft"><%=left[i].text%></a>'
            + '<% } %>'
            + '<ul class="ui-navigator-list">'
            + '<% for (var i=0, len=mid.length; i<len; i++) { %>'
            + '<li><a href="<%=mid[i].url%>"><%=mid[i].text%></a></li>'
            + '<% } %></ul>'
            + '<% for (var i=0, len=right.length; i<len; i++) { %>'
            + '<a href="<%=right[i].url%>" class="ui-navigator-fix ui-navigator-fixright"><%=right[i].text%></a>'
            + '<% } %>';

    $.ui.define("navigator", {
        _data: {
            container: "",
            content: [],
            defTab: 0,
            beforetabselect: null,
            tabselect: null
        },
        _create: function () {
            var me = this,
                data = me._data,
                $el = me.root(),
                container = $(data.container || document.body).get(0),
                tabObj = {left: [],mid: [],right: []},html;

            $.each(data.content, function () {      //组合数据
                tabObj[this.pos ? this.pos : 'mid'].push(this);
            });

            html = $.parseTpl(tmpl, tabObj)       //解析数据模板
            if ($el) {
                $el.append(html);
                (!$el.parent().length || container !== document.body) && $el.appendTo(container);
            } else {
                me.root($("<div></div>").append(html)).appendTo(container);
            }
        },
        _setup: function (fullMode) {
            var me = this,
                data = me._data,
                defTab = data.defTab,
                $el = me.root();
            if (!fullMode) {
                $el.children('a').addClass('ui-navigator-fix');     //smart模式针对内容添加样式
                $el.children('ul').addClass('ui-navigator-list');
            }
            $el.find('a').each(function (i) {
                defTab === 0 ? $(this).hasClass('cur') && (data.defTab = i) : $(this).removeClass('cur');    //处理同时defTab和写cur class的情况
            });
        },
        _init: function () {
            var me = this,
                data = me._data,
                $el = me.root(),
                content = data.content,
                $tabList = $el.find('a');    //包括fix的tab和可滑动的tab

            $tabList.each(function (i) {
                this.index = i;
                content.length && content[i].attr && $(this).attr(content[i].attr);     //添加自己定义属性
            });
            data._$tabList = $tabList;
            data._lastIndex = -1;

            $el.addClass('ui-navigator').on('click', $.proxy(me._switchTabHandler, me));
            me.switchTo(data.defTab, true);    //设置默认选中的tab
        },
        _switchTabHandler: function (e) {
            var me = this,
                target = e.target;

            $(target).closest('a').get(0) && me.switchTo(target.index, false, e);
            return me;
        },
        /**
            切换到某个tab
            @method $(selector).navigator('switchTo', index)
            @param index      {Number}          (必选)切换的tab下标
            @chainable
            @example
                $('#nav').navigator('switchTo', 1);      //setup模式
                var nav = $.ui.navigator(opts);      //render模式
                nav.switchTo(1);
        */
        switchTo: function (index, isDef, e) {
            var me = this,
                data = me._data,
                lastIndex = data._lastIndex,
                $tabList = data._$tabList,
                beforeSelectEvent = $.Event('beforetabselect');

            me.trigger(beforeSelectEvent, [$tabList[index]]);
            if (beforeSelectEvent.defaultPrevented) {     //阻止默认事件
                e && e.preventDefault();     //若是程序调switchTo，则直接return，若点击调用则preventDefault
                return me;
            };

            //点击同一个tab，若是程序调switchTo，则直接return，若点击调用则preventDefault
            if (lastIndex == index) {
                e && e.preventDefault();
                return me;
            }          //当选中的是同一个tab时，直接返回
            lastIndex >= 0 && $tabList.eq(lastIndex).removeClass("cur");      //修改样式放在跳转后边
            $tabList.eq(index).addClass("cur");
            data._lastIndex = index;

            return me.trigger('tabselect', [$tabList.get(index), index]);
        },
        /**
            获取当前tab
            @method $(selector).navigator('getCurTab')
            @chainable
            @example
                $('#nav').navigator('getCurTab');      //setup模式
                var nav = $.ui.navigator(opts);      //render模式
                nav.getCurTab();     //返回当前tab信息，包括index和当前tab elem
        */
        getCurTab: function () {
            var me = this,
                data = me._data,
                lastIndex = data._lastIndex;

            return {
                index: lastIndex,
                info: data._$tabList[lastIndex]
            }
        }
    });
    
})(Zepto);

/*
 * @file 导航栏组件 － iScroll插件
 * @name Navigator.iscroll
 * @desc <qrcode align="right" title="Live Demo">../gmu/_examples/webapp/naivgator/navigator.html</qrcode>
 * @description navigator iscroll插件，可滚动导航栏
 * @import core/zepto.iscroll.js, widget/navigator.js
 */

(function ($, undefined) {
    /*
     * @name navigator
     * @grammar navigator(options)  ⇒ self
     * @grammar $.ui.navigator([el [,options]])  ⇒ instance
     * @desc
     * **Options**
     * navigator iscroll插件在原来options基础上增加以下参数
     * - ''disablePlugin''    {Boolean|String}:    (可选, 默认false)是否禁用插件，加载了该插件，若需要禁用，可直接设为true
     * - ''isScrollToNext''   {Boolean}:           (必选, 默认true)是否启用点击可视范围内第一个或最后一个跳动
     * - ''isShowShadow''     {Boolean}:           (可选, 默认true)是否启用阴影
     * - ''iScrollOpts''      {Object}:            (可选)配置iScroll中的参数，其中scrollstart,scrollmove,scrollend做为单独事件在组件中派生，可直接绑相应事件
     * - ''scrollstart''      {Function}:          (可选)滑动前触发的事件，对应iScroll中的onScrollStart
     * - ''scrollmove''       {Function}:          (可选)滑动中触发的事件，对应iScroll中的onScrollMove
     * - ''scrollend''        {Function}:          (可选)滑动后触发的事件，对应iScroll中的onScrollEnd
     *
     * **setup方式html规则**
     * <code type="html">
     * <div id="nav-smartSetup">
     *     <a class="ui-navigator-fixleft" href="#test1">fixleft</a>       <!--固定元素，若没有，则不写，可写多个，左边加class="ui-navigator-fixleft"-->
     *     <ul>                                              <!--中间非固定tab-->
     *         <li><a href="#test1">首页</a></li>
     *         <li><a href="javascript:;">电影</a></li>
     *         <li><a class="cur" href="javascript:;">电视剧</a></li>
     *     </ul>
     *     <a class="ui-navigator-fixleft" href="#test1">fixleft</a>    <!--固定元素，若没有，则不写，可写多个，右边加class="ui-navigator-fixright"-->
     * </div>
     * </code>
     * **full setup方式html规则**
     * <code type="html">        <!--需将所有的class都写全-->
     * <div id="nav-smartSetup">
     *     <a class="ui-navigator-fixleft ui-navigator-fix" href="#test1">fixleft</a>       <!--固定元素，若没有，则不写，可写多个，左边加class="ui-navigator-fixleft"-->
     *     <div class="ui-navigator-wrapper" style="overflow:hidden;">
     *         <ul class="ui-navigator-list">                                             <!--中间非固定tab-->
     *             <li><a href="#test1">首页</a></li>
     *             <li><a href="javascript:;">电影</a></li>
     *             <li><a class="cur" href="javascript:;">电视剧</a></li>
     *         </ul>
     *     </div>
     *     <a class="ui-navigator-fixleft ui-navigator-fix" href="#test1">fixleft</a>    <!--固定元素，若没有，则不写，可写多个，右边加class="ui-navigator-fixright"-->
     * </div>
     * </code>
     * **Demo**
     * <codepreview href="../gmu/_examples/widget/navigator/navigator.html">
     * ../gmu/_examples/widget/navigator/navigator.html
     * ../gmu/_examples/widget/navigator/navigator_fix.html
     * </codepreview>
     */

    $.ui.navigator.register(function () {
        return {
            pluginName: 'iscroll',
            _init: function () {
                return this._adjustHtml()._reBindEvent()._initOrg();
            },
            _reBindEvent: function () {
                var me = this,
                    data = me._data;

                data.isScrollToNext = data.isScrollToNext === undefined ? true : data.isScrollToNext ;
                data.isShowShadow = data.isShowShadow === undefined ? true : data.isShowShadow;
                me._loadIscroll();
                $(window).on('ortchange', $.proxy(me._ortChangeHandler, me));
                me.on('destroy', function () {
                    $(window).off('ortchange', me._ortChangeHandler);
                    data.iScroll.destroy();
                });
                return me;
            },
            _adjustHtml: function () {
                var me = this,
                    data = me._data,
                    $el = me.root().addClass('ui-navigator'),
                    $navScroller = $el.find('ul'),
                    $navWrapper = $el.find('.ui-navigator-wrapper'),
                    $navList = $navScroller.find('li'),
                    scrollerSumWidth = [0];

                !$navWrapper.length && $navScroller.wrap('<div class="ui-navigator-wrapper"></div>');    //smart模式
                $navScroller.find('li').each(function (index) {     //记录每个tab长度的累加和，为半个tab滑动用
                    scrollerSumWidth[index] = index ? (scrollerSumWidth[index -1] + this.offsetWidth) :
                        (scrollerSumWidth[index] + this.offsetLeft - $navScroller[0].offsetLeft + this.offsetWidth);
                });
                $.extend(data, {
                    _$navWrapper: $el.find('.ui-navigator-wrapper'),
                    _$navScroller: $navScroller.width(scrollerSumWidth[$navList.length - 1]),
                    _$navList: $navList,
                    _scrollerNum: $navList.length,
                    _scrollerSumWidth: scrollerSumWidth,
                    _$fixElemLeft: $el.find('.ui-navigator-fixleft'),
                    _$fixElemRight: $el.find('.ui-navigator-fixright')
                });

                return me;
            },
            _loadIscroll:function () {
                var me = this,
                    data = me._data;

                data.iScroll = new iScroll(data._$navWrapper.get(0), data.iScrollOpts = $.extend({
                    hScroll:true,
                    vScroll:false,
                    hScrollbar:false,
                    vScrollbar:false
                }, data.iScrollOpts, {
                    onScrollStart:function (e) {
                        me.trigger('scrollstart', e);
                    },
                    onScrollMove:function (e) {
                        me.trigger('scrollmove', e);
                    },
                    onScrollEnd:function (e) {
                        data.isShowShadow && me._setShadow();
                        me.trigger('scrollend', e);
                    }
                }));
                return me;
            },
            _setShadow:function () {
                var me = this,
                    data = me._data,
                    $navWrapper = data._$navWrapper,
                    shadowClass = {
                        left: 'ui-navigator-shadowl',
                        right: 'ui-navigator-shadowr',
                        all: 'ui-navigator-shadowall'
                    },
                    iScroll = data.iScroll,
                    movedX = iScroll.x;

                if (movedX < 0) {
                    $navWrapper.removeClass(shadowClass['left'] + ' ' + shadowClass['right']).addClass(shadowClass['all']);     //开始滑动时
                    if (movedX <= iScroll.maxScrollX) {       //向右滑动到最大
                        $navWrapper.removeClass(shadowClass['all'] + ' ' + shadowClass['right']).addClass(shadowClass['left']);
                    }
                } else {      //向左滑动到最大
                    $navWrapper.removeClass(shadowClass['all'] + ' ' + shadowClass['left']);
                    //转屏后是否可滑动
                    iScroll.hScroll ? $navWrapper.addClass(shadowClass['right']) : $navWrapper.removeClass(shadowClass['all'] + ' ' + shadowClass['left'] + ' ' +shadowClass['right']);
                }

                return me;
            },
            _scrollToNext: function (index, pos) {
                var me = this,
                    data = me._data,
                    scrollerSumWidth = data._scrollerSumWidth,
                    iScroll = data.iScroll;      //iscroll滚动的时间

                iScroll.scrollTo(pos == 'last' ? iScroll.wrapperW - (scrollerSumWidth[index + 1] || scrollerSumWidth[scrollerSumWidth.length - 1]) : pos == 'first' ? (-scrollerSumWidth[index - 2] || 0) : iScroll.x, 0, 400);
                return me;
            },
            _getPos:function (index) {
                var me = this,
                    data = me._data,
                    iScroll = data.iScroll,
                    movedXDis = Math.abs(iScroll.x) || 0,
                    scrollerSumWidth = data._scrollerSumWidth,
                    $navList = data._$navList,
                    thisOffsetDis = scrollerSumWidth[index] - movedXDis,
                    preOffsetDis = scrollerSumWidth[(index - 1) || 0]  - movedXDis,
                    nextOffsetDis = (scrollerSumWidth[index + 1] || scrollerSumWidth[scrollerSumWidth.length - 1]) - movedXDis,
                    wrapperWidth = iScroll.wrapperW;

                return (thisOffsetDis >= wrapperWidth || nextOffsetDis > wrapperWidth) ?   //当前tab为半个tab或者其下一个tab为半个，则视为可显示区的最后一个
                    'last' : (thisOffsetDis <= $navList[index].offsetWidth || preOffsetDis < $navList[index - 1].offsetWidth) ?  //当前tab为半个或者其前面的tab是半个，则视为可显示区的第一个
                    'first' : 'middle';
            },
            _ortChangeHandler:function () {
                var me = this,
                    data = me._data,
                    iScroll = data.iScroll;

                iScroll.refresh();
                me._setShadow();    //增加阴影的转屏处理 traceid:FEBASE-663
                data._$navWrapper.width(iScroll.wrapperW - iScroll.wrapperOffsetLeft);
            },
            switchTo: function (index, isDef, e) {
                var me = this,
                    data = me._data;

                me.switchToOrg(index, isDef, e);
                if (!data._$tabList.eq(index).hasClass('ui-navigator-fix')) {
                    var $fixElemLeft = data._$fixElemLeft,
                        index = index - ($fixElemLeft.length ? $fixElemLeft.length : 0),    //若存在左fix的元素，则滑动的tab的index需相应减去fix tab数量
                        pos = me._getPos(index);

                    isDef && data.isShowShadow && me._setShadow();      //默认defTab设置阴影
                    data.isScrollToNext && me._scrollToNext(index, pos);
                }
                return me;
            }
        }
    });
})(Zepto);

/**
 tab组件
 @class ui.Tab
*/
/**
    tab初始化 （3.3版本之后声明方式变化）
    @method  $(selector).tab(options)
    @param draggable {Boolean} (可选) 是否可以拖拽
    @param onBeforeToggle {Event}  (可选) 切换之前的触发事件
    @param onAfterToggle {Event}  (可选) 切换之后的触发事件
    @example
		//3.3版本之后的建议写法， 兼容以下两种声明方式
		$("#tab_header_container").tab({
			draggable : true,
			onBeforeToggle:function(){//返回true则允许切换Tab
				return true;
			},
			onAfterToggle:function(t){//只有在onBeforeToggle返回true，这个方法才会在Tab切换后被调用
				console.log(t)
			}
		});
		   
		//3.2版本之前的写法
		ui.Tab({
			container:"#tab_header_container",
			draggable : true,
			onBeforeToggle :function(targetId){
				return true; //返回true则允许切换Tab
			},
			onAfterToggle : function(){ //只有在onBeforeToggle返回true，这个方法才会在Tab切换后被调用
			}
		});
*/
(function($, undefined) {
	
	$.ui.define('tab',{
		_data:{
			index:                  0,
	        springBackDis:          15,
			animationTime:          400,
			draggable:				false, 
			onBeforeToggle: 		function(){ return true; },
			onAfterToggle: 			function(){}
		},
		_setup:function() {
			var me = this,
                root = me.root();
			var firstTabId = root.find('[data-role=BTButton]').attr("data-tab");
		    var tabs = $("#"+firstTabId).closest(".ui-tab"),
		    	items = tabs.children();

		    if(tabs.length == 0 ) alert('初始化tab失败,请查看最新版本示例！');
		    tabs.wrapInner("<div class='ui-tab-wheel'>"); 
			me.data({
				tabs : tabs
			});
		},
		_init:function() {
			var me = this,
                index = me.data('index'),
                root = me.root(),
                o = me._data,
                _eventHandler = $.proxy(me._tabEventHandler, me);
             me._setWidth();
             if(o.draggable) $(o.tabs).on('touchstart touchmove touchend touchcancel webkitTransitionEnd', _eventHandler);
             $(".navbar > ul > li ,.navbar table tr td ", root).unbind('tap').bind('tap', function(e){
             	me._navbarEventHandler.call(this, me);
  	    		e.stopPropagation();
    		 });
    		 
		},
		 /*
         * 设置轮播条及元素宽度,设置选中dot,设置索引map,加载图片
         */
        _setWidth:function(){
            var me = this,
                o = me._data,
                root = o.tabs,
                width = root.width(),
                height = root.height(),
                items = $('tab', root).toArray(),
                length = items.length,
                wheel = $('.ui-tab-wheel', root).width(width * length)[0],
	            i, j,
                l = length;
     
            for(i = 0; i < length; i++) {
                items[i].style.cssText += 'width:'+ width + 'px;position:absolute;-webkit-transform:translate3d(' + i * width + 'px,0,0);z-index:' + (80 - i);
            }
            me.data({
                root:           root[0],
                wheel:          wheel,
                items:          items,
                length:         length,
                width:          width,
                height:         height,
                wheelX:     	-width * (length - 1)
            });
            return me;
        },
		_navbarEventHandler:function(tme){
			var me = this,
				o = tme._data;
			var tabId = $(me).find('[data-role=BTButton]').attr("data-tab"),
				index = $(me).closest("ul").find("li").index($(me));
				
    		var res = o.onBeforeToggle(tabId);
    		if(res){
				tme._move(index, 0);
    		}
		},
		_tabEventHandler:function(e){
			var me = this;
            switch (e.type) {
                case 'touchmove':
                    me._touchMove(e);
                    break;
                case 'touchstart':
                    me._touchStart(e);
                    break;
                case 'touchcancel':
                case 'touchend':
                    me._touchEnd();
                    break;
                case 'webkitTransitionEnd':
                    me._transitionEnd();
                    break;
            }
		},
		
		 /*
         * touchstart事件
         */
        _touchStart:function(e) {
            var me = this;
            me.data({
                pageX:      e.touches[0].pageX,
                pageY:      e.touches[0].pageY,
                S:          false,      //isScrolling
                T:          false,      //isTested
                X:          0,           //horizontal moved
                isExecBeforeFunc: false,
                beforeFuncResult: false
            });
            me.data('wheel').style.webkitTransitionDuration = '0ms';
        },

        /*
         * touchmove事件
         */
        _touchMove:function(e) {
            var o = this._data,
                X = o.X = e.touches[0].pageX - o.pageX;
            if(!o.T) {
                var index = o.index,
                    length = o.length,
                    S = Math.abs(X) < Math.abs(e.touches[0].pageY - o.pageY);
    
                o.T = true;
                o.S = S;
            }
            if(!o.S) {
                o.stopPropagation && e.stopPropagation();
                e.preventDefault();
                var x = X - o.index * o.width;
                if(x < 0 && x > o.wheelX ){
                	if(!o.isExecBeforeFunc){
                		o.beforeFuncResult = o.onBeforeToggle();
                		o.isExecBeforeFunc = true;
                	}  		
                	if(o.beforeFuncResult)
	                	o.wheel.style.webkitTransform = 'translate3d(' + x + 'px,0,0)';
                }
                	
            }
        },

        /*
         * touchend事件
         */
        _touchEnd:function() {
            var me = this,
                o = me._data;
            if(!o.S) {
                var distance = o.springBackDis,
                stepLength = o.X <= -distance ? Math.ceil(-o.X / o.width) : (o.X > distance) ? -Math.ceil(o.X / o.width) : 0;
                o._stepLength = Math.abs(stepLength);
                o.beforeFuncResult && me._slide(o.index + stepLength);
            }
        }, 
		/*
         * 位置判断
         */
        _slide:function(index) {
            var me = this,
                o = me._data,
                length = o.length,
                end = length;
            if(-1 < index && index < end) {
                me._move(index);
            } else if(index >= end) {
                me._move(end - 1);
                o._direction = -1;
            } else {
                me._move(0);
                o._direction =  1;
            }
            return me;
        },

        _move:function(index, animationTime) {
            var me = this,
            	o = me._data;
            o.index = index;
            me._toggleNavbar(index, function(){
            	if(animationTime === undefined) animationTime = o.animationTime;
           		 o.wheel.style.cssText += '-webkit-transition:' + animationTime + 'ms;-webkit-transform:translate3d(-' + index * o.width + 'px,0,0);';	
            })
        },

        /*
         * 滑动结束
         */
        _transitionEnd:function() {
            var me = this,
                o = me._data;
            //me.trigger('slideend', o.dotIndex[o.index]);
        },
        _toggleNavbar: function(index, callback){
        	
        	var me = this,
        		o = me._data,
        		root = me.root();
        	    $li = root.find("li:eq(" + index + ')'),
        	    tabId = $li.find('[data-role=BTButton]').attr("data-tab");
        	
 
	    	$li.siblings().find('[data-role=BTButton]').removeClass('btn-active');
    		$li.find('[data-role=BTButton]').addClass('btn-active');
	        callback();
	        
            //不显示的tab iscroll不refresh
            var id = $("section.active").attr("id") || "body";
            var iscrolls = GC.get(id, "iScroll");

            for (var i = iscrolls.length - 1; i >= 0; i -= 1) {
    
                //是当前页iscroll
                if($(iscrolls[i].wrapper).parent("#"+ tabId).length > 0){
                    iscrolls[i].animating = false;
                } else {
                    iscrolls[i].animating = true;
                }
            }

			o.onAfterToggle(tabId);
    	 
        }
	});
	
})(Zepto);

