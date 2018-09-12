/*
 * version:2.1
 * author:pa_dev
 * date:2014-9-27
 * */
;
(function(window) {
	window.app = window.app || {};
	
	window.app.page= window.app.page|| {}; 
	/*========================page=======================================*/
	//页面dom结构完成后的事件
	app.page.onReady=function(){}
	//页面加载完成后执行的事件
	app.page.onLoad=function(){}
	//页面遇到脚本错误时候的事件
	app.page.onError=function(msg,url,line){
		//alert("Error:"+msg+"     Line:"+line);
	}
	
	/* ===========================utils=================================== */
	window.app.utils = window.utils || {};
	//将json字符串转成json对象
	app.utils.toJSON = function(param) {
		return typeof (param) == "string"? eval('(' + param + ')') : param;
	}
	//判断是否在PC上
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
	//发送Ajax请求
	app.ajax = function(params) {
		params = params || {};
		params.data = app.utils.toJSON(params.data);
		params.method = params.method || "GET";
		if (typeof (params.async) == "undefined") {
			params.async = true;
		}
		params.contentType = params.contentType || "";
		params.headers = params.headers || {};
		params.timeout = params.timeout || 30000;
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
	
	//发请求调用WSDL
	app.ajaxWSDL=function(params){
		params.data=params.data||{};
		params.async=params.async||true;
		Cordova.exec(params.success, params.fail, "HttpRequest", "ajaxWSDL", [params.method,params.data,params.namespace,params.endpoint,params.async]);
	}
	
	//发送POST请求
	app.post = function(url, data, success, fail) {
		app.ajax({
			"url" : url,
			"data" : data,
			"method" : "POST",
			// application/json
			"contentType" : "application/x-www-form-urlencoded",
			"success" : success,
			"fail" : fail
		});
	}
	
	//发送GET请求
	app.get = function(url, data, success, fail) {
		app.ajax({
			"url" : url,
			"data" : data,
			"method" : "GET",
			"success" : success,
			"fail" : fail
		});
	}

	//退出应用 (just android and ios for link)
	app.exit = function() {
		Cordova.exec(null, null, "ExtendApp", "exit", []);
	}
	
	//检测是否存在某个app
	// android:传入包名 eg: bingo.touch.debugger
	// ios:urlSchemes eg: bingo-debugger://
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
	
	// 执行第三方的应用
	// appId:
	// android: package name eg: bingo.touch.debugger
	// ios: urlSchemes eg: http://www.baidu.com open safari
	// data:启动参数  init data,json format
	app.run = function(appId, data) {
		if (typeof (data) == "undefined" || data == "") {
			data = {};
		}
		Cordova.exec(null, null, "ExtendApp", "runApp", [ appId, data ]);
	}
	
	// 打开文件:如office文件
	// filePath:document path
	// mime: mime type
	app.openFile = function(filePath, mime, success, fail) {
		filePath = filePath || "";
		mime = mime || "";
		success = success || function(result) {};
		fail = fail || function(result) {
			app.hint("没有找到合适的程序打开该文件");
		};
		Cordova.exec(success, fail, "ExtendApp", "openFile",[ filePath, mime ]);
	}
	
	// 获取app安装后的相关目录
	app.getAppDirectoryEntry = function(callback) {
		var success = function(result) {
			callback(app.utils.toJSON(result));
		}
		Cordova.exec(success, null, "ExtendApp", "getAppDirectoryEntry",[ app.id ]);
	}
	
	// 显示提示信息
	app.hint = function(message, position) {
		message = message || "Hello BingoTouch!";
		position = position || "bottom";
		Cordova.exec(null, null, "ExtendApp", "hint", [ message, position ]);
	}
	
	// 控制屏幕旋转 (just for android)
	app.rotation = function(type) {
		Cordova.exec(null, null, "RotationPlugin", "setRotation", [ type ]);
	}
	
	//加载一个新的页面
	//params: {url:"http://www.baidu.com",{param1:"value1", param2:"value2"}, slideType:"left",progress:{show:"false", title:"your title", message:"your message" }}
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
		params.appId = app.id;
		Cordova.exec(null, null, "Page", "loadUrl", [ params ]);
	}
	
	//加载一个新的页面
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
	
	// 获取页面传递的参数
	app.getPageParams = function(callback) {
		var success = function(result) {
			callback(app.utils.toJSON(result));
		}
		Cordova.exec(success, null, "Page", "getPageParams", [ app.id ]);
	}
	
	// 返回上个页面
	app.back = function(callback) {
		if(typeof callback=="undefined"){
			callback="";
		}
		if($.isFunction(callback)){
			callback="("+callback.toString()+")()";
		}
		Cordova.exec(null, null, "Page", "back", [ callback ]);
	}
	
	// 刷新当前页面
	app.refresh = function() {
		Cordova.exec(null, null, "Page", "refresh", []);
	}
	
	// 获取页面uri
	app.getCurrentUri = function(callback) {
		Cordova.exec(callback, null, "Page", "getCurrentUri", []);
	}
	
	// 获取app相关信息:id,versionCode,versionName
	app.getInfo = function(callback) {
		var success = function(result) {
			callback(app.utils.toJSON(result));
		}
		// 如果是集成到link的应用，需要手动设置appid
		Cordova.exec(success, null, "ExtendApp", "getInfo", []);
	}
	
	// 获取设备的尺寸
	app.getSize = function(callback) {
		var success = function(result) {
			callback(app.utils.toJSON(result));
		}
		Cordova.exec(success, null, "ExtendApp", "getSize", []);
	}
	
	// 弹出提示框
	app.alert = function(message, callback, title, buttonName) {
		callback = callback || function(res) {};
		title = title || "提示";
		buttonName = buttonName || "确定";
		if (typeof (message) == "object") {
			message = JSON.stringify(message);
		}
		navigator.notification.alert(message, callback, title, buttonName);
	}
	
	// 弹出确认框
	app.confirm = function(message, callback, title, buttonNames) {
		callback = callback || function(res) {};
		title = title || "提示";
		var buttons = [];
		buttonNames = buttonNames || [ "确认,取消" ];
		if (typeof (buttonNames) == "string") {
			buttons = buttonNames.split(',');
		} else {
			buttons = buttonNames;
		}
		navigator.notification.confirm(message, callback, title, buttons);
	}
	
	// 安装应用 (just android)
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
	
	// 保存运行时变量
	app.setGlobalVariable = function(key, value) {
		key = app.id + "_" + key;
		Cordova.exec(null, null, "ExtendApp", "setVariable", [ key, value ]);
	}
	
	// 读取运行时变量
	app.getGlobalVariable = function(key, callback) {
		key = app.id + "_" + key;
		Cordova.exec(callback, null, "ExtendApp", "getVariable", [ key ]);
	}
	
	// 扫描二维码(just android)
	app.getBarcode = function(success, fail) {
		if (window.devicePlatform == "android") {
			Cordova.exec(success, fail, "BarcodeScanner", "scan", []);
		} else if (window.devicePlatform == "iOS") {
			app.alert("iOS platform do not support this api!");
		}
	}

	/* =============================app settings========================== */
	window.app.setting = window.app.setting || {};
	
	// 持久化保存配置信息
	app.setting.set = function(name, value) {
		if (typeof (name) == "undefined" || typeof (value) == "undefined") {
			app.alert("name and value is necessary!");
			return;
		}
		Cordova.exec(null, null, "Setting", "set", [ name, value, app.id ]);
	}
	
	// 获取配置信息
	app.setting.get = function(name, defaultValue, callback) {
		if (name == "" || typeof name == "undefined") {
			app.alert("name is necessary!");
			return;
		}
		defaultValue = defaultValue || "";
		callback = callback || function(result) {
			app.alert(result);
		}
		Cordova.exec(callback, null, "Setting", "get", [ name, defaultValue,app.id ]);
	}
	
	// 删除某配置信息
	app.setting.remove = function(name) {
		if (typeof (name) == "undefined") {
			app.alert("name is necessary!");
			return;
		}
		Cordova.exec(null, null, "Setting", "remove", [ name, app.id ]);
	}
	
	// 清除所有配置：慎用
	app.setting.clear = function() {
		Cordova.exec(null, null, "Setting", "clear", [ app.id ]);
	}
	
	// 获取所有配置信息
	app.setting.getAll = function(callback) {
		var success = function(result) {
			callback(app.utils.toJSON(result));
		}
		Cordova.exec(success, null, "Setting", "load", [ app.id ]);
	}

	/* ==============================app hasmap=========================== */
	window.app.hashmap = window.app.hashmap || {};
	// 持久化存储数据,独立文件的形式 (just android)
	app.hashmap.set = function(id, key, value) {
		if (typeof id == "undefined" || id == "") {
			app.alert("Hashmap id is necessary!");
			return;
		}
		if (typeof key == "undefined" || key == "") {
			app.alert("key is necessary!");
			return;
		}
		
		if (window.devicePlatform == "android") {
			value = value || "";
			Cordova.exec(null, null, "HashMapFile", "set", [ id, key, value ]);

		} else if (window.devicePlatform == "iOS") {
			app.alert("iOS platform do not support this api!");
		}
	}

	//获取hashmap 数据(just android)
	// keys: [key1,key2,key3]
	app.hashmap.get = function(id, keys, callback) {
		if (typeof id == "undefined" || id == "") {
			app.alert("Hashmap id is necessary!");
			return;
		}
		if (typeof keys == "undefined") {
			app.alert("keys is necessary!");
			return;
		}
		// whether is an array
		if (!$.isArray(keys)) {
			app.alert("keys must be an array!");
			return;
		}
		if (window.devicePlatform == "android") {
			Cordova.exec(callback, null, "HashMapFile", "get", [ id, keys ]);
		} else if (window.devicePlatform == "iOS") {
			app.alert("iOS platform do not support this api!");
		}
	}

	//移除hasmap数据(just android)
	app.hashmap.remove = function(id, keys) {
		if (typeof id == "undefined" || id == "") {
			app.alert("Hashmap id is necessary!");
			return;
		}
		if (typeof keys == "undefined") {
			app.alert("keys is necessary!");
			return;
		}
		// whether is an array
		if (!$.isArray(keys)) {
			app.alert("keys must be an array!");
			return;
		}
		if (window.devicePlatform == "android") {
			Cordova.exec(null, null, "HashMapFile", "remove", [ id, keys ]);
		} else if (window.devicePlatform == "iOS") {
			app.alert("iOS platform do not support this api!");
		}
	}

	//清除hashmap数据(just android)
	app.hashmap.clear = function(id) {
		if (typeof id == "undefined" || id == "") {
			app.alert("Hashmap id is necessary!");
			return;
		}
		if (window.devicePlatform == "android") {
			Cordova.exec(null, null, "HashMapFile", "clear", [ id ]);
		} else if (window.devicePlatform == "iOS") {
			app.alert("iOS platform do not support this api!");
		}
	}

	// 获取所有hashmap数据(just android)
	app.hashmap.readAll = function(id, callback) {
		if (typeof id == "undefined" || id == "") {
			app.alert("Hashmap id is necessary!");
			return;
		}
		if (window.devicePlatform == "android") {
			Cordova.exec(callback, null, "HashMapFile", "readAll", [ id ]);
		} else if (window.devicePlatform == "iOS") {
			app.alert("iOS platform do not support this api!");
		}
	}

	// 获取hashmap所有的key (just android)
	app.hashmap.readKeys = function(id, callback) {
		if (typeof id == "undefined" || id == "") {
			app.alert("Hashmap id is necessary!");
			return;
		}
		if (window.devicePlatform == "android") {
			Cordova.exec(callback, null, "HashMapFile", "readKeys", [ id ]);
		} else if (window.devicePlatform == "iOS") {
			app.alert("iOS platform do not support this api!");
		}
	}

	//获取hashmap所有的value(just android)
	app.hashmap.readValues = function(id, callback) {
		if (typeof id == "undefined" || id == "") {
			app.alert("Hashmap id is necessary!");
			return;
		}
		if (window.devicePlatform == "android") {
			Cordova.exec(callback, null, "HashMapFile", "readValues", [ id ]);
		} else if (window.devicePlatform == "iOS") {
			app.alert("iOS platform do not support this api!");
		}
	}
	
	/* ============================app file ============================== */
	window.app.file = window.app.file || {};
	//读取文件内容(just android)
	app.file.readAsString = function(uri, success, fail) {
		if (typeof uri == "undefined" || uri == "") {
			app.alert("File's uri is necessary!");
			return;
		}
		success = success || function(result) {};
		fail = fail || function(result) {};
		if (window.devicePlatform == "android") {
			Cordova.exec(success, fail, "FilePlugin", "readAsString", [ uri ]);
		} else if (window.devicePlatform == "iOS") {
			app.alert("iOS platform do not support this api!");
		}
	}
	
	//内容写入文件(just android)
	app.file.writeAsString = function(uri, content, success, fail) {
		if (typeof content == "undefined" || typeof uri == "undefined"|| uri == "") {
			app.alert("Content and uri are necessary!");
			return;
		}
		success = success || function(result) {};
		fail = fail || function(result) {};
		
		if (window.devicePlatform == "android") {
			Cordova.exec(success, fail, "FilePlugin", "writeAsString", [ uri,content ]);
		} else if (window.devicePlatform == "iOS") {
			app.alert("iOS platform do not support this api!");
		}
	}
	
	//删除文件(just android)
	app.file.remove = function(uri, success, fail) {
		if (typeof uri == "undefined" || uri == "") {
			app.alert("File's uri is necessary!");
			return;
		}
		success = success || function(result) {};
		fail = fail || function(result) {};
		if (window.devicePlatform == "android") {
			Cordova.exec(success, fail, "FilePlugin", "removeFile", [ uri ]);
		} else if (window.devicePlatform == "iOS") {
			app.alert("iOS platform do not support this api!");
		}
	}

	/* =============================app progress========================== */
	window.app.progress = window.app.progress || {};
	
	// 显示进度条
	app.progress.start = function(title, message) {
		title = title || "";
		message = message || "";
		Cordova.exec(null, null, "ExtendApp", "progressStart",[ title, message ]);
	}
	
	// 停止进度条
	app.progress.stop = function() {
		Cordova.exec(null, null, "ExtendApp", "progressStop", []);
	}
	
	/* ==============================dateTimePicker============================ */
	window.app.dateTimePicker = window.app.dateTimePicker || {};
	// 日期控件 datepicker(just android)
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
			app.alert("iOS platform do not support this api!");
		}
	};
	
	// 时间控件 timepicker(just android)
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
			app.alert("iOS platform do not support this api!");
		}
	};
	
	// 日期滚轮
	app.dateTimePicker.wheelSelectDate = function(callback, defaultDate,
			format, range) {
		var toDate = new Date();
		defaultDate = defaultDate || {
			"year" : toDate.getFullYear(),
			"month" : toDate.getMonth() + 1,
			"day" : toDate.getDate()
		};
		defaultDate.month = defaultDate.month - 1;
		format = format || "yyyy-MM-dd";
		range = range || {
			"minYear" : 2000,
			"maxYear" : 2046
		};
		var success = function(result) {
			callback(app.utils.toJSON(result));
		}
		Cordova.exec(success, null, "WheelSelectPlugin", "date", [ defaultDate,format, range ]);
	}
	
	// 时间滚轮
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
	window.app.wheelSelect = window.app.wheelSelect || {};
	// 滚轮单选
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
	window.app.phone = window.app.phone || {};
	// 发送短信
	app.phone.sendSMS = function(phone, message) {
		Cordova.exec(null, null, "PhonePlugin", "sms", [ phone, message ]);
	}
	// 打电话
	app.phone.dial = function(phone) {
		Cordova.exec(null, null, "PhonePlugin", "dial", [ phone ]);
	}
	
	/* ==============================Dialog====================================== */
	window.app.dialog = window.app.dialog || {};
	// 窗口展示图片 (just android)
	app.dialog.showPicture = function(fileUri, mode) {
		fileUri = fileUri || "";
		mode = mode || "dialog";
		if (window.devicePlatform == "android") {
			Cordova.exec(null, null, "DialogPlugin", "showPic",[ fileUri, mode ]);
		} else if (window.devicePlatform == "iOS") {
			app.alert("iOS platform do not support this api!");
		}
	}
	
	/* ======================================SSO====================================== */
	window.app.sso = window.app.sso || {};
	// sso登陆
	// param:{credential_type:"password",username:"tony",password:"1",get_spec_secret:"y",get_service_ticket:"y"}
	// credential_type: password or specsecret
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
	
	// sso注销
	app.sso.logout = function(success, fail) {
		success = success || function(response) {
		};
		fail = fail || function(response) {
		};
		Cordova.exec(success, fail, "SSOPlugin", "logout", []);
	}
	
	// 判断是否已经登陆
	app.sso.isLogined = function(success) {
		Cordova.exec(success, null, "SSOPlugin", "isLogined", []);
	}

	// 刷新token
	app.sso.refreshToken = function(success, fail) {
		Cordova.exec(success, fail, "SSOPlugin", "refreshToken", []);
	}
	
	// 获取loginTicket
	app.sso.loginTicket = function(success, fail) {
		success = success || function(response) {
		};
		fail = fail || function(response) {
		};
		Cordova.exec(success, fail, "SSOPlugin", "loginTicket", []);
	}
	
	// 获取serviceTicket
	app.sso.serviceTicket = function(success, fail) {
		success = success || function(response) {
		};
		fail = fail || function(response) {
		};
		Cordova.exec(success, fail, "SSOPlugin", "serviceTicket", []);
	}

	/* ==========================Sqlite Database====================== */
	window.app.database = window.app.database || {};
	// 打开数据库，如果不存在会默认创建
	app.database.open = function(name, version, size) {
		if (name == "" || typeof name == "undefined") {
			app.alert("name is necessary!");
			return null;
		}
		// 数据库名字默认加上应用标志,用于数据隔离
		name = app.id + "_" + name;
		return window.openDatabase(name, version, name, size);
	}
	
	// 执行sql: create,drop,insert,update,delete.
	// 支持批量
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
	
	// 执行查询
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

	/* ======================Notification========================== */
	window.app.notification = window.app.notification || {};
	//本地消息提醒
	app.notification.notify = function(params) {
		params = params || {};
		params.title = params.title || "";
		params.subTitle = params.subTitle || "系统提示";
		params.message = params.message || "";
		
		if (window.devicePlatform == "android") {
			Cordova.exec(null, null, "LocalNotification", "addNotification",[ params ]);
		} else if (window.devicePlatform == "iOS") {
			app.alert("iOS platform do not support this api!");
		}		
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

//页面完整加载完成：onload的时候获取相关属性值
window.onload=function(){
	//应用标志|版本|应用名称|页面uri|页面参数|应用目录|应用size
	app.id = "";
	app.version = "";
	app.name = "";
	app.pageUri = "";
	app.pageParams = {};
	app.directory = {}
	app.size = {};
	
	// 页面初始化的时候先把这些常用数据拿到
	document.addEventListener("deviceready", function() {
		// 获取当前页面要接收的参数
		app.getPageParams(function(result) {
			if (result != null) {
				app.pageParams = result;
			}
		});
		// 获取应用相关信息
		app.getInfo(function(result) {
			app.id = result.id;
			app.version = result.versionName;
			app.name = result.appName;
		});
		// 获取应用高度宽度
		app.getSize(function(result) {
			app.size = result;
		});
		// 获取当前页面uri
		app.getCurrentUri(function(result) {
			app.pageUri = result;
		});
		// 获取应用相关目录
		app.getAppDirectoryEntry(function(result) {
			app.directory = result;
		});
		
		//声明页面事件
		app.page.onLoad();
		
	}, false);
}();


