;
(function(window) {
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
	window.app.notification = window.app.notification || {};
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
})(window);
