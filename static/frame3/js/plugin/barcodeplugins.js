;
(function(window) {
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
	window.app.barcode = window.app.barcode || {};
	app.barcode.scan=function(success,fail){
		Cordova.exec(success, fail, "BarcodeScanner", "scan", []);
	}
})(window);
