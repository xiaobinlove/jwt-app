
;
(function(window) {
	window.app.caiyun = window.app.caiyun || {};
	app.caiyun.getInfo=function(callback){
		Cordova.exec(callback,null, "MobileCaiyun", "getCaiyunInfo", []);
	}
	app.caiyun.validateToken=function(params,callback){
		params=params||{};
		params.url=params.url||"";
		params.msgname=params.msgname||"getuserinforeq";
		params.msgversion=params.msgversion||"1.0.0";
		params.msgsender=params.msgsender||"ecclient";
		params.token=params.token; 
		Cordova.exec(callback,null, "MobileCaiyun", "validateToken", [params]);
	}
})(window);
