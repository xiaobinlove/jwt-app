
;
(function(window) {
	window.app.bistore = window.app.bistore || {};
	app.bistore.login=function(params,success,fail){
		params=params||{};
		var successCallback = function(result) {
			success(app.utils.toJSON(result));
		};
		fail=fail||function(result){
			app.alert(result);
		}
		Cordova.exec(successCallback, fail, "BIStore", "login", [params]);
	}
	app.bistore.logout=function(success,fail){
		var successCallback = function(result) {
			success(app.utils.toJSON(result));
		};
		fail=fail||function(result){
			app.alert(result);
		}
		Cordova.exec(successCallback, fail, "BIStore", "logout", []);
	}
})(window);
