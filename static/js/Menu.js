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
    var $sectionContainer,$sectionMask, duration = 200;
    var init = function(options){

        options.duration && (duration = options.duration);
        $sectionContainer = options.sectionId ? $("#" +　options.sectionId) : $("section");
        $("#section_container_mask").remove();
        $sectionMask = $('<div id="section_container_mask"></div>').appendTo('#section_container');

        //添加各种关闭事件
        $sectionMask.on('tap',hideMenu);
     
        
        $sectionContainer.find("[data-aside]").each(function(i, elem){
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
        var $aside = $(selector).addClass('active'),
            transition = $aside.data('transition'),// push overlay  reveal
            position = $aside.data('position') || 'left',
            width = $aside.width(),
            translateX = position == 'left'?width+'px':'-'+width+'px';
  

        //aside中可能需要scroll组件
        //ui.IScroll.init($aside); 这里不帮忙加，开发者自己如果需要就自己加上

        if(transition == 'overlay'){
            ui.anim($aside,{translateX : '0%'},duration);
        }else if(transition == 'reveal'){
            ui.anim($sectionContainer,{translateX : translateX},duration);
        }else{//默认为push
            ui.anim($aside,{translateX : '0%'},duration);
            ui.anim($sectionContainer,{translateX : translateX},duration);
        }
        $('#section_container_mask').show();
        ui.hasMenuOpen = true;
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
        var $aside = $('#section_container aside.active'),
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