;(function(window) {

	window.app = window.app || {};
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

})(window);