;
(function (window) {
    /**
        Link专属插件类
        @class app.link
    */
    window.app.link = window.app.link || {};

    /**
     该接口用于分享到link
     @param   var params =  {"type":"website","title":"xxx","content":"xx","icon":"xxx"}
     @example  app.link.share(params)
     */
    app.link.share= function (params) {
        Cordova.exec(null, null, "LinkPlugin", "share", [params]);
    }

    /**
     该接口用于分享到link
     @param   var params =  {"type":"website","title":"xxx","content":"xx","icon":"xxx"}
     @example  app.link.shareToBlog(params)
     */
    app.link.shareToBlog = function (params) {
        Cordova.exec(null, null, "LinkPlugin", "shareToBlog", [params]);
    }

    /**
     只适用于v4.1.3或以上版本
     @method:重新打开页面，目前只适用于首页
     */
    app.link.recreateWebView = function () {
        Cordova.exec(null,null, "LinkPlugin", "recreateWebView", []);
    }


    /**
     该接口用于选文件
     @method app.link.chooseFile
     @static
     @param callback {Function} 回调函数，返回文件物理地址字符串
     @example
     app.link.chooseFile(function(result){
				app.alert(result);
			});
     */
    app.link.chooseFile = function (callback) {
        Cordova.exec(callback,null, "LinkPlugin", "chooseFile", []);
    }

    /**
     根据部门id获取该部门的信息
     @method app.link.getDeptInfoByOrgId
     @static
     @param callback {Function} 回调函数，返回部门信息
     @param orgId {String} 部门id
     */
    app.link.getDeptInfoByOrgId=function(callback,orgId){
        Cordova.exec(callback,null , "LinkPlugin", "getDeptInfoByOrgId", [orgId]);
    }

    /**
        该接口用于获取Link登陆后的用户信息，具体包括：loginID,password,userId,db_loginId,email,userName,telephone,orgName,sex,pictureUrl,picture_local等信息。
        @method app.link.getLoginInfo
        @static
        @param callback {Function} 回调函数，返回json对象
        @example 
            app.link.getLoginInfo(function(result){
                app.alert(result); 
            });
    */
    app.link.getLoginInfo = function (callback) {
        var successCallback = function (result) {
            callback(app.utils.toJSON(result));
        };
        Cordova.exec(successCallback, null, "LinkPlugin", "getLoginInfo", []);
    }

    /**
        该接口用于获取Link指定的用户信息，具体包括：userId,userName,telephone,orgName,sex,pictureUrl,pic_local等信息。
        @method app.link.getUserInfo
        @static
        @param callback {Function} 成功回调函数，返回json对象
        @param failCallback {Function} 失败回调函数，返回错误字符串
        @param userId {String} 指定用户的id
        @example
            app.link.getUserInfo(function(result){  
                app.alert(result.userName);
            },
            function(error){
                app.alert(error);
            },
            'ebdfe3b1-ed9c-425b-aac3-aa6c61d05d0e'
            );
    */
    app.link.getUserInfo = function (callback, failCallback, userId) {
	        var successCallback = function (result) {
            callback(app.utils.toJSON(result));
        };
        Cordova.exec(successCallback, failCallback, "LinkPlugin", "getUserInfo", [userId]);
    }


    /**
        该接口用于获取登录用户的AccessToken
        @method app.link.getToken
        @static
        @param callback {Function} 回调函数,返回json对象
        @example 
            app.link.getToken(function (result) {
                 app.alert(result.accessToken,null,"获取accesstoken");
            });
    */
    app.link.getToken = function (callback) {
        var successCallback = function (result) {
            callback(app.utils.toJSON(result));
        };
        Cordova.exec(successCallback, null, "LinkPlugin", "getToken", []);
    }

    /**
        该接口用于调用Link里面用户的名片页面
        @method app.link.startUserCard
        @static
        @param userId {String} 用户id
        @example
            app.link.startUserCard('ebdfe3b1-ed9c-425b-aac3-aa6c61d05d0e');
    */
    app.link.startUserCard = function (userId) {
        Cordova.exec(null, null, "LinkPlugin", "startUserCard", [userId]);
    }

    /**
        该接口用于调用Link里面群组的名片页面
        @method app.link.startGroupCard
        @static
        @param groupId {String} 群组id
        @example
            app.link.startGroupCard('1456fa37-ebc9-4123-88c0-8b494bab7377');
    */
    app.link.startGroupCard = function (groupId) {
        Cordova.exec(null, null, "LinkPlugin", "startGroupCard", [groupId]);
    }

    /**
        该接口用于调用Link的用户聊天页面
        @method app.link.startUserChat
        @static
        @param userId {String} 用户id
        @param userName {String} 用户名称(可选)
        @example 
            app.link.startUserChat('ebdfe3b1-ed9c-425b-aac3-aa6c61d05d0e');
    */
    app.link.startUserChat = function (userId, userName) {
        Cordova.exec(null, null, "LinkPlugin", "startUserChat", [userId, userName]);
    }

    /**
        该接口用于调用Link的群组聊天页面
        @method app.link.startGroupChat
        @static 
        @param groupId {String} 群组id
        @param groupName {String} 群组名称(可选)
        @example
            app.link.startGroupChat(‘1456fa37-ebc9-4123-88c0-8b494bab7377’);
    */
    app.link.startGroupChat = function (groupId, groupName) {
        Cordova.exec(null, null, "LinkPlugin", "startGroupChat", [groupId, groupName]);
    }

    /**
        该接口用于调用Link选人页面(单选)
        @method app.link.startContactSingleSelector
        @static
        @param successCallback {Function} 成功回调函数,返回json对象
        @param failCallback {Function} 失败回调函数，返回错误字符串
        @param title {String} 选人窗口文字说明
        @param dataType {String} 选择范围：1为用户,4为部门/组织,5为用户+组织
        @param extraParams json对象，方便后面扩展，目前有isIncludeDisableUser(是否包含禁用的用户，默认false)
        @example 
            app.link.startContactSingleSelector(function(result){
                    app.alert(result);
            },function(){} ,'请选择用户','1');

    */
    app.link.startContactSingleSelector = function (successCallback, failCallback,title, dataType,extraParams) {
         extraParams = $.extend({
            isIncludeDisableUser:false
        }, extraParams);
        Cordova.exec(successCallback, failCallback, "LinkPlugin", "startContactSingleSelector", [title, dataType,extraParams]);
    }

    /**
        该接口用于调用Link选人界面(多选)
        @method app.link.startContactMulitSelector
        @static
        @param successCallback {Function} 成功回调函数,返回json对象
        @param failCallback {Function} 失败回调函数，返回错误字符串
        @param title {String} 选人窗口文字说明
        @param dataType {String} 选择范围：1为用户,4为部门/组织,5为用户+组织
        @param extraParams {Object} json对象,具体可以传入哪些请参看代码
        @example 
            app.link.startContactMulitSelector(

                    function(result){
                        app.alert(result);
                        //todo
                    },
                    function(error){
                        //app.alert(error);
                    },
                    '请选择用户/群组(多选)',
                    '1',
                    {   
                        userSelected: [],
                        groupSelected: [],
                        organizationSelected: [],
                        userIgnore: [],
                        groupIgnore: [],
                        organizationIgnore: [],
						isIncludeDisableUser:false
                    }
                );
    */
    app.link.startContactMulitSelector = function (successCallback, failCallback, title, dataType, extraParams) {
        extraParams = $.extend({
            userSelected: [],
            groupSelected: [],
            organizationSelected: [],
            userIgnore: [],
            groupIgnore: [],
            organizationIgnore: [],
            isIncludeDisableUser:false
        }, extraParams);
        Cordova.exec(successCallback, failCallback, "LinkPlugin", "startContactMulitSelector", [title, dataType, extraParams]);
    }
	

})(window);

