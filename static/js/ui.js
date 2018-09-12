
/*
 * version:2.1
 * author:pa_dev
 * date:2014-2-14
 * */
var Utils = {
    isPC: function () {
        var userAgentInfo = navigator.userAgent;
        var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
        }
        return flag;
    },
    setViewPort: function () {
        //android viewport
        var viewport = "";
        var userAgent = navigator.userAgent.toLowerCase();

        if (window.devicePlatform == "android") {
            viewport ="width=device-width,initial-scale=1,user-scalable=no,target-densitydpi =240";
        } else if (window.devicePlatform = "iOS") {
        	if(userAgent.match(/ipad/i)){
        		viewport = "width=640,user-scalable=no";
            }else if(userAgent.match(/iphone os/i) == "iphone os"){
            	 viewport = "width=480,user-scalable=no";
            }
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
    }
}
Utils.setViewPort();



/*
 * IScroll extend
 */
var myScroll ;

var  pullSettings = {
		enablePullDown: false,
		enablePullUp:false,
		loadingLabel:"加载中...",
		flipLabel:"释放刷新",
		pullDownlabel:"下拉刷新",
		pullUplabel:"上拉加载更多",
		pullDownAction:function(){},
		pullUpAction:function(){}
};

var IScrollController = {
		set : function(params){
			$.extend(pullSettings,params) ;
		}
}

//var myScroll;
$(function(){
	if( $(".iscroll-wrapper").length ){
		$(".iscroll-wrapper").addClass("iscroll-wrapper-clz") ;
		
		if($(".footer").length){
			$(".iscroll-wrapper").css("bottom", $(".footer").height()+"px" ) ;
		}
		if($(".header").length){
			$(".iscroll-wrapper").css("top", $(".header").height()+"px" ) ;
		}
        //alert($(".iscroll-wrapper").css("padding-top"));
		
		document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);


		var pullContainer = $(".iscroll-wrapper").children();
		var pullDownEl,pullUpEl ;
		var pullDownOffset = pullUpOffset = 0 ;
		if( pullSettings.enablePullDown ){
            pullContainer.css("margin-top", "23px");
			var paddingTop = pullContainer.css("padding-top")||"" ;
			paddingTop = paddingTop.replace("px","") ;
			
			pullDownEl = $('<div id="pullDown"><span class="pullDownIcon"></span><span class="pullDownLabel">下拉刷新</span></div>').prependTo(pullContainer) ;
			//alert($(".header").height());
			pullDownOffset  =  ($(".header").height()||pullDownEl.height())-paddingTop;
			pullDownEl.hide();
		}
		
		if( pullSettings.enablePullUp ){
			pullUpEl = $('<div id="pullUp"><span class="pullUpIcon"></span><span class="pullUpLabel">上拉显示更多</span></div>').appendTo(pullContainer) ;
			pullUpOffset = $(".footer").height() || pullUpEl.height();
			pullUpEl.hide();
		}
		
		var _pervScroll = 0 ;

		var scrollParams = {
				hScrollbar: false, //是否显示水平滚动条  
				vScrollbar: false,
				checkDOMChanges:true,
				useTransition: false ,
				topOffset : pullDownOffset ,
				onRefresh: function () {
					if( pullSettings.enablePullDown && pullDownEl.hasClass("loading")   ){
						pullDownEl.removeClass("loading") ;
						pullDownEl.find(".pullDownLabel").html( pullSettings.pullDownlabel ) ;
						//pullDownEl.hide();
					}else if(  pullSettings.enablePullUp && pullUpEl.hasClass("loading")   ){
						pullUpEl.removeClass("loading") ;
						pullUpEl.find(".pullUpLabel").html( pullSettings.pullUplabel ) ;
						pullUpEl.hide();
					}
				},
				onScrollMove: function () {
					if( pullSettings.enablePullDown ){
						pullDownEl.show();
					}
					if( pullSettings.enablePullUp ){
						pullUpEl.show();
					}
					
					if (pullSettings.enablePullDown && this.y > 10 && !pullDownEl.hasClass('flip')   ) {
						pullDownEl.addClass("flip") ;
						pullDownEl.find(".pullDownLabel").html( pullSettings.flipLabel ) ;
						this.minScrollY = 0;
					} else if (pullSettings.enablePullDown && this.y < 10 && pullDownEl.hasClass('flip')   ) {
						pullDownEl.show().removeClass("flip") ;
						pullDownEl.find(".pullDownLabel").html( pullSettings.pullDownlabel) ;
						this.minScrollY = -pullDownOffset;
					} else if (pullSettings.enablePullUp &&(this.maxScrollY - this.y) >20 && !pullUpEl.hasClass('flip')   ) {
						pullUpEl.addClass("flip") ;
						pullUpEl.find(".pullUpLabel").html( pullSettings.flipLabel ) ;

						//this.maxScrollY = this.maxScrollY;
                        //alert(this.maxScrollY+","+this.y);
					} else if (pullSettings.enablePullUp &&(this.maxScrollY - this.y) < 20 && pullUpEl.hasClass('flip')) {
                        //alert("2");
						pullUpEl.show().removeClass("flip") ;
						pullUpEl.find(".pullUpLabel").html( pullSettings.pullUplabel  ) ;
                        //alert(this.maxScrollY+","+this.y);
					}
                    //alert(this.scrollMaxY);
				},
				onScrollEnd: function () {
					//阻止重复调用
					if( new Date().getTime() - _pervScroll <= 1000 ){
						return ;
					}
					_pervScroll = new Date().getTime() ;
					
					if (pullSettings.enablePullDown&&pullDownEl.hasClass('flip')) {
						pullDownEl.addClass("loading") ;
						pullDownEl.find(".pullDownLabel").html( pullSettings.loadingLabel ) ;
								
						setTimeout(function () {	 
							pullSettings.pullDownAction() ;
							myScroll.refresh();
						}, 1000);	 
					} else if (pullSettings.enablePullUp&&pullUpEl.hasClass('flip')  ) {
						pullUpEl.addClass("loading") ;
						pullUpEl.find(".pullUpLabel").html( pullSettings.loadingLabel ) ;
						
						setTimeout(function () {	 
							pullSettings.pullUpAction() ;
							myScroll.refresh();
						}, 1000);	 
					}
				}
		};
		
		myScroll = new iScroll( $(".iscroll-wrapper")[0] ,scrollParams );
		
		if( pullSettings.enablePullDown ){
			pullDownEl.show();
		}
		
		if( pullSettings.enablePullUp ){
			//pullUpEl.show();
		}
	}

}) ;

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

//UI控件 form list collapse navbar btngroup
(function () {
    window.ui = {};
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
                func && func();
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
        $.uiwidget.init({}, $(this).parent());
    }

    $.pageLoad = { before: [], after: [] };
    $.pageLoad.register = function (type, func) {
        $.pageLoad[type].push(func);
    };

    $(function () {
        $($.pageLoad.before).each(function (index, func) {
            func();
        });

        //控件初始化
        $(document.body).uiwidget();

        $($.pageLoad.after).each(function (index, func) {
            func();
        });
    });

    ui.init = function () {
        $(document.body).uiwidget();
    };
})();

$.pageLoad.after.push(function(){
	if( !$(".iscroll-wrapper").length ){
		 
		if( $("[data-fixed='top']").length  ){
			$(".content").css("padding-top", ($("[data-fixed='top']").height())+"px") ;
		}
		
		if( $("[data-fixed='bottom']").length  ){
			$(".content").css("padding-bottom", ($("[data-fixed='bottom']").height())+"px") ;
		}
	
		$("[data-fixed='top']").addClass("fixed-top");
		$("[data-fixed='left']").addClass("fixed-left") ;
		$("[data-fixed='right']").addClass("fixed-right") ;
		$("[data-fixed='bottom']").addClass("fixed-bottom") ;
	 
	}
});

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
                        app.load({ url: url, params:args.params||args,slideType:args.slideType,progress:args.progress});
                        e.stopPropagation();
                    });
                    
                    
                } else {
                    $(this).bind('tap', function (e) {
                        app.load({url: url, slideType:'left'})
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
$.uiwidget.register(function (selector) {
    $('div[data-role="BTSwitchs"] >[data-role=BTButton]').btbutton("off", 'touchstart touchend');
    //btn-group	
    $('div[data-role="BTSwitchs"]>[data-role=BTButton]').bind('tap', function (e) {
        $(this).addClass('btn-active').siblings().removeClass('btn-active');
        e.stopPropagation();
    })
});

/*
* check.js
* */
/**
  表单元素、日期组件等调用接口
  @class UI
*/
$.bt("check", {

    val: function (data,callback) {
		var len = arguments.length;
	    //参数大于0，即为设值操作
		/**
		  设置checkbox值，<font color='red'>这个方法会先将所有checkbox清空，再根据data参数勾选。<br/>
		  此方法提供给BingoTouch定义的checkbox</font>
		  @method $(selector).btcheck("val",data ,callback)
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
				$("div[name='csex']").btcheck("val",["boy","rao"],function(obj,data){
					//这里做改变状态之前的操作...........
					//obj  selector的DOM对象，data 是传入data参数
					//return true 允许改变状态 ，return  false不允许改变状态
					return true;
				}); 
				//也可以这样设值
				$("div[name='csex']").btcheck("val","rao")
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
		  @method $(selector).btcheck("val")
		  @return {Object} checkbox选中值  ⇒ null | {value:'',label:''} | [{value:'',label:''} ,{value:'',label:''}]
		  @example
			HTML:
				<div data-role="BTCheck" id="checkg" name="csex" value="girl">女</div>
				<div data-role="BTCheck" id="checkb" name="csex" value="boy">男</div>
				<div data-role="BTCheck" id="checkz" name="csex" value="rao">中</div>
			JS:
				//建议这种取值方式
				//return  [{"value":"girl","label":"女"},{"value":"boy","label":"男"}]
				$("div[name='csex']").btcheck("val")
				//也可以这样取值
				//return  {"value":"boy","label":"男"}
				$("#checkb").btcheck("val")
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

			/*if(result.length<1){
			  return null;
			}else if(result.length==1){
			  return result[0];
			}else{
			  return result;
			}*/
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
$.uiwidget.register(function (selector) {
    //collapse的点击事件
    $('.collapse-header > [data-role=BTButton]').bind('tap', function () {
        $(this).toggleClass('btn-active');
        $(this).find('.icon').toggleClass('icon-minus');
        $(this).parent().next().toggle();
    })
    $('.collapse.show').find('.collapse-header [data-role=BTButton]').addClass('btn-active')
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
		  @method $(selector).btselect("val",data ,callback)
		  @param data {JSON对象} 设置的值 ⇒ {value:'',label:''}
		  @param callback {Function} 状态改变<font color='red'>前</font>的操作,当callback返回true时，状态才允许被改变		  
		  @return {Object} 返回当前链式对象
		  @chainable
		  @example
			HTML:
				<div id="BTSelect" data-role="BTSelect"   value="" name="selectsex" data='[{"value":"female","label":"女"},{"value":"male","label":"男"}]' title="请选择性别"><span>请选择性别</span></div>
			JS:		
				//设置选中，参数格式{value:'',label:''}
				$("#BTSelect").btselect("val",{value:'female',label:'女'},function(obj,data){
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
		  @method $(selector).btselect("val")
		  @return {JSON对象} select选中值  ⇒ {value:'',label:''}
		  @example
			HTML:
				<div id="BTSelect" data-role="BTSelect"   value="" name="selectsex" data='[{"value":"female","label":"女"},{"value":"male","label":"男"}]' title="请选择性别"><span>请选择性别</span></div>
			JS:			  
				//return {"value":"female",label:"女"}
				$("#BTSelect").btselect("val")
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

$.uiwidget.register( function (selector) {
	$('div[data-role=BTSelect],div[data-role=BTButton][type="select"]').each(function(){
		
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
			$(self).btselect("val",selected,callback) ;
		}
		
		$(this).unbind('tap').bind('tap',function(e){
			if(value == undefined || value == ''){
				app.wheelSelect.oneSelect(data,function(res){
					//设置Select的值
					$(self).btselect("val",res,callback) ;
                    value = res.value;
				},data[0].key,title);
			}else {
				app.wheelSelect.oneSelect(data,function(res){
					//设置Select的值
					$(self).btselect("val",res,callback) ;
                    value = res.value;
				},value,title);
				
				//$(self).btselect("val",selected,callback) ;
			}
		});
		
	}) ;
	
	//每个select date 的点击效果
	$('div[data-role="BTSelect"]').bind('touchstart', function () {
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
		  @method $(selector).btdatepicker("val",data ,callback)
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
				$("#BTDate").btdatepicker("val","2013-2-30",function(obj,data){
					//obj  selector的DOM对象，data 是传入data参数
					//return true 允许改变状态 ，return  false不允许改变状态
					return true;
				});
				//设置时间
				$("#BTTime").btdatepicker("val","10:30");
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
		  @method $(selector).btdatepicker("val")
		  @return {string} datepicker选中值  
		  @example
			HTML:
				<div id="BTDate" data-role="BTSelect" value="" name="date" data='2013-4-3' type="date"><span>请选择日期</span></div>
				<div id="BTTime" data-role="BTSelect" value="" name="time" data='16:29' type="time"><span>请选择时间</span></div>		 
			JS:
				//日期和时间的取值都是使用这个方法
				//return  "2013-9-4"
				$("#BTDate").btdatepicker("val");
				//return  "10:4"
				$("#BTTime").btdatepicker("val");
		 */
		else{
			var $obj = $(this);
			return $obj.attr('value');		
		}

    }
});

$.uiwidget.register(function (selector) {
    //如果有初始值就把值替换原来的文本提示
    var obj = "div[data-role='BTSelect'][type='date'],div[data-role='BTSelect'][type='wheeldate'],div[data-role='BTSelect'][type='time'],div[data-role='BTSelect'][type='wheeltime'],div[data-role='BTButton'][type='date'],div[data-role='BTButton'][type='wheeldate'],div[data-role='BTButton'][type='time'],div[data-role='BTButton'][type='wheeltime']";
    
    $(obj).each(function () {
    	var callback = $(this).attr('callback');
		callback = callback?eval("("+callback+")"):function(){return true;} ;
    	
        var value = $(this).attr('data');
        if (value != undefined && value != '') {
			$(this).btdatepicker("val",value,callback);
        }
       
		$(this).unbind('tap').bind('tap', function (e) {
			//选中以后的数据 {"year":2013,"month":4,"day":3,"full":"2013-4-3"}
			var self = this;
			var type = $(this).attr('type'); //日期还是时间
			var value = $(this).attr('value');
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
			
			__datepicker(value, action, type);

			function __datepicker(value, action, type) {
				if (value == undefined || value == '') {
					app.dateTimePicker[action](function (res) {
						//设置Select的值
						$(self).btdatepicker("val",res.full,callback);
					});

				} else {
					var dateGroup = [];
					
					var nowDate = {};
					if (type == 'date' || type == 'wheeldate') {
						dateGroup = value.split('-');
						nowDate.year = dateGroup[0];
						nowDate.month = dateGroup[1];
						nowDate.day = dateGroup[2];
					} else {
						dateGroup = value.split(':');
						nowDate.hour = dateGroup[0];
						nowDate.minute = dateGroup[1];
					}

					app.dateTimePicker[action](function (res) {
						//设置Select的值
						$(self).btdatepicker("val", res.full,callback);
					}, nowDate);
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
    $('div[data-role="BTDate"]').bind('touchstart', function () {
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
		  @method $(selector).btdropdown("val",data ,callback)
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
				$("#BTDropdown").btdropdown("val","我是设置",function(obj,data){
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
		  @method $(selector).btdropdown("val")
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
				$("#BTDropdown").btdropdown("val")
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

$.uiwidget.register(function (selector) {
    $('.dropdown > div[data-role="BTButton"]').append('<span class="angle"></span>');
    //点击切换隐藏下拉菜单
    $('.dropdown > div[data-role="BTButton"]').unbind().bind('tap', function (e) {
        $(this).toggleClass('btn-active');
        $(this).find('.angle').toggle();
        $(this).next().toggle();
        e.stopPropagation();
    });
    $('.dropdown > ul div[data-role="BTButton"]').bind('tap', function (e) {
    	
    	var callback = $(this).closest(".dropdown").attr('callback');
		callback = callback?eval("("+callback+")"):function(){return true;} ;
    	

        var obj = $(this).parents('ul').prev();
        var value = $(this).find('.btn-text').text();

        $(obj).btdropdown("val", value,callback);
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
$.uiwidget.register(function (selector) {
    //list-view
    $('.list-view li > [data-role=BTButton]').bind('tap', function (e) {
        $(this).parent().siblings()
			.find('[data-role=BTButton]').removeClass('btn-active');
        //e.stopPropagation();
    })

    //list-collapse 
    $('.list-collapse > li > [data-role=BTButton]').unbind().bind('tap', function () {
        $(this).toggleClass('btn-active')
				.parent().siblings().find('[data-role=BTButton]')
						.removeClass('btn-active');
    })
    //取消绑定头部的事件
    $('.list-collapse.list-view-head > li:first-child > [data-role=BTButton]').unbind();
    //list-collapse data-multipe="true"
    $('.list-collapse[data-multiple="true"] > li > [data-role=BTButton]').unbind().bind('tap', function () {
        $(this).toggleClass('btn-active');
    });
});

/*
* navbar.js
* */
$.uiwidget.register(function (selector) {
    //关闭touchmstart 跟 touchend 事件
    var button = $('.navbar > ul > li >[data-role=BTButton]');
    button.btbutton('off', 'touchstart touchend');
    //navbar
    $('.navbar > ul > li ,.navbar table tr td ').bind('tap', function (e) {
        $(this).siblings()
			.find('[data-role=BTButton]').removeClass('btn-active');
        $(this).find('[data-role=BTButton]').addClass('btn-active');
        e.stopPropagation();
    });
    if ($('.navbar .sonmenu').length > 0) {
        $('.navbar > ul').each(function () {
            //有下拉菜单时，动态添加三角形图标,默认隐藏

            $(this).find('ul').hide().prev().append('<span class="angle"></span>');
            $(this).find('.angle').hide();
        });
        //一级菜单点击
        $('.navbar > ul > li >[data-role="BTButton"]').bind('tap', function (e) {

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
        $('.sonmenu [data-role="BTButton"]').bind('tap', function (e) {
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
		  @method $(selector).btradio("val",data ,callback)
		  @param data {string} 需要选中的radio的value
		  @param callback {Function} 状态改变<font color='red'>前</font>的操作,当callback返回true时，状态才允许被改变		  
		  @return {Object} 返回当前链式对象
		  @chainable
		  @example
			HTML:
				<div data-role="BTRadio" name="rsex"  id="radioboy" class="BTCheck_ON" value="boy">男</div>
				<div data-role="BTRadio" name="rsex"  id="radiogirl" value="girl">女</div>
			JS:
				$("div[name='rsex']").btradio("val","boy",function(obj,data){
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
		  @method $(selector).btradio("val")
		  @return {JSON对象} radio选中值  ⇒ {value:'',label:''}
		  @example
			HTML:
				<div data-role="BTRadio" name="rsex"  id="radioboy" class="BTCheck_ON" value="boy">男</div>
				<div data-role="BTRadio" name="rsex"  id="radiogirl" value="girl">女</div>
			JS:		  
				//建议这样获取radio值
				//return  {"value":"girl","label":"女"}
				$("div[name='rsex']").btradio("val")
				//获取id为radioboy的radio的值，如果被选中，则返回{value:'',label:''}，如果未被选中，则返回null
				//return  {"value":"boy","label":"男"}
				$("#radioboy").btradio("val");
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
		  @method $(selector).btswitch("val",data ,callback)
		  @param data {boolean} switch值  ⇒ true |　false
		  @param callback {Function} 状态改变<font color='red'>前</font>的操作,当callback返回true时，状态才允许被改变		  
		  @return {Object} 返回当前链式对象
		  @chainable
		  @example
			HTML:
				<div  id="btswitch" name="switchB" class="BTCheck_OFF" data-role="BTSwitch" ></div>
			JS:
				//设置为开
				$("#btswitch").btswitch("val",true,function(obj,data){
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
		  @method $(selector).btswitch("val")
		  @return {boolean} switch值   ⇒ true |　false
		  @example
			HTML:
				<div  id="btswitch" name="switchB" class="BTCheck_OFF" data-role="BTSwitch" ></div>
			JS:
				//return  true
				$("#btswitch").btswitch("val")
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

//表单数据 toJSON
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
		var name = $obj.attr("name"), val =$obj.btcheck("val") ;
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
 





