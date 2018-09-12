/*!Extend zepto.iscroll.js*/
/*
 * iScroll v4.2.2 ~ Copyright (c) 2012 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
(function(h,E){var u=Math,o=[],l=E.createElement("div").style,z=(function(){var H="webkitT,MozT,msT,OT,t".split(","),G,F=0,m=H.length;for(;F<m;F++){G=H[F]+"ransform";if(G in l){return H[F].substr(0,H[F].length-1)}}return false})(),D=z?"-"+z.toLowerCase()+"-":"",k=s("transform"),x=s("transitionProperty"),j=s("transitionDuration"),n=s("transformOrigin"),B=s("transitionTimingFunction"),e=s("transitionDelay"),A=(/android/gi).test(navigator.appVersion),r=(/hp-tablet/gi).test(navigator.appVersion),i=s("perspective") in l,y="ontouchstart" in h&&!r,d=!!z,f=s("transition") in l,g="onorientationchange" in h?"orientationchange":"resize",b=y?"touchstart":"mousedown",t=y?"touchmove":"mousemove",c=y?"touchend":"mouseup",w=y?"touchcancel":"mouseup",a=(function(){if(z===false){return false}var m={"":"transitionend",webkit:"webkitTransitionEnd",Moz:"transitionend",O:"otransitionend",ms:"MSTransitionEnd"};return m[z]})(),q=(function(){return h.requestAnimationFrame||h.webkitRequestAnimationFrame||h.mozRequestAnimationFrame||h.oRequestAnimationFrame||h.msRequestAnimationFrame||function(m){return setTimeout(m,1)}})(),p=(function(){return h.cancelRequestAnimationFrame||h.webkitCancelAnimationFrame||h.webkitCancelRequestAnimationFrame||h.mozCancelRequestAnimationFrame||h.oCancelRequestAnimationFrame||h.msCancelRequestAnimationFrame||clearTimeout})(),C=i?" translateZ(0)":"",v=function(G,m){var H=this,F;H.wrapper=typeof G=="object"?G:E.getElementById(G);H.wrapper.style.overflow="hidden";H.scroller=H.wrapper.children[0];H.translateZ=C;H.options={hScroll:true,vScroll:true,x:0,y:0,bounce:true,bounceLock:false,momentum:true,lockDirection:true,useTransform:true,useTransition:false,topOffset:0,checkDOMChanges:false,handleClick:true,onRefresh:null,onBeforeScrollStart:function(I){I.preventDefault()},onScrollStart:null,onBeforeScrollMove:null,onScrollMove:null,onBeforeScrollEnd:null,onScrollEnd:null,onTouchEnd:null,onDestroy:null};for(F in m){H.options[F]=m[F]}H.x=H.options.x;H.y=H.options.y;H.options.useTransform=d&&H.options.useTransform;H.options.useTransition=f&&H.options.useTransition;H.scroller.style[x]=H.options.useTransform?D+"transform":"top left";H.scroller.style[j]="0";H.scroller.style[n]="0 0";if(H.options.useTransition){H.scroller.style[B]="cubic-bezier(0.33,0.66,0.66,1)"}if(H.options.useTransform){H.scroller.style[k]="translate("+H.x+"px,"+H.y+"px)"+C}else{H.scroller.style.cssText+=";position:absolute;top:"+H.y+"px;left:"+H.x+"px"}H.refresh();H._bind(g,h);H._bind(b);if(H.options.checkDOMChanges){H.checkDOMTime=setInterval(function(){H._checkDOMChanges()},500)}};v.prototype={enabled:true,x:0,y:0,steps:[],scale:1,currPageX:0,currPageY:0,pagesX:[],pagesY:[],aniTime:null,isStopScrollAction:false,handleEvent:function(F){var m=this;switch(F.type){case b:if(!y&&F.button!==0){return}m._start(F);break;case t:m._move(F);break;case c:case w:m._end(F);break;case g:m._resize();break;case a:m._transitionEnd(F);break}},_checkDOMChanges:function(){if(this.moved||this.animating||(this.scrollerW==this.scroller.offsetWidth*this.scale&&this.scrollerH==this.scroller.offsetHeight*this.scale)){return}this.refresh()},_resize:function(){var m=this;setTimeout(function(){m.refresh()},A?200:0)},_pos:function(m,F){m=this.hScroll?m:0;F=this.vScroll?F:0;if(this.options.useTransform){this.scroller.style[k]="translate("+m+"px,"+F+"px) scale("+this.scale+")"+C}else{m=u.round(m);F=u.round(F);this.scroller.style.left=m+"px";this.scroller.style.top=F+"px"}this.x=m;this.y=F},_start:function(K){var J=this,F=y?K.touches[0]:K,G,m,L,I,H;if(!J.enabled){return}if(J.options.onBeforeScrollStart){J.options.onBeforeScrollStart.call(J,K)}if(J.options.useTransition){J._transitionTime(0)}J.moved=false;J.animating=false;J.distX=0;J.distY=0;J.absDistX=0;J.absDistY=0;J.dirX=0;J.dirY=0;J.isStopScrollAction=false;if(J.options.momentum){if(J.options.useTransform){G=getComputedStyle(J.scroller,null)[k].replace(/[^0-9\-.,]/g,"").split(",");m=+G[4];L=+G[5]}else{m=+getComputedStyle(J.scroller,null).left.replace(/[^0-9-]/g,"");L=+getComputedStyle(J.scroller,null).top.replace(/[^0-9-]/g,"")}if(m!=J.x||L!=J.y){J.isStopScrollAction=true;if(J.options.useTransition){J._unbind(a)}else{p(J.aniTime)}J.steps=[];J._pos(m,L);if(J.options.onScrollEnd){J.options.onScrollEnd.call(J)}}}J.startX=J.x;J.startY=J.y;J.pointX=F.pageX;J.pointY=F.pageY;J.startTime=K.timeStamp||Date.now();if(J.options.onScrollStart){J.options.onScrollStart.call(J,K)}J._bind(t,h);J._bind(c,h);J._bind(w,h)},_move:function(K){var H=this,F=y?K.touches[0]:K,G=F.pageX-H.pointX,m=F.pageY-H.pointY,L=H.x+G,J=H.y+m,I=K.timeStamp||Date.now();if(H.options.onBeforeScrollMove){H.options.onBeforeScrollMove.call(H,K)}H.pointX=F.pageX;H.pointY=F.pageY;if(L>0||L<H.maxScrollX){L=H.options.bounce?H.x+(G/2):L>=0||H.maxScrollX>=0?0:H.maxScrollX}if(J>H.minScrollY||J<H.maxScrollY){J=H.options.bounce?H.y+(m/2):J>=H.minScrollY||H.maxScrollY>=0?H.minScrollY:H.maxScrollY}H.distX+=G;H.distY+=m;H.absDistX=u.abs(H.distX);H.absDistY=u.abs(H.distY);if(H.absDistX<6&&H.absDistY<6){return}if(H.options.lockDirection){if(H.absDistX>H.absDistY+5){J=H.y;m=0}else{if(H.absDistY>H.absDistX+5){L=H.x;G=0}}}H.moved=true;H._beforePos?H._beforePos(J,m)&&H._pos(L,J):H._pos(L,J);H.dirX=G>0?-1:G<0?1:0;H.dirY=m>0?-1:m<0?1:0;if(I-H.startTime>300){H.startTime=I;H.startX=H.x;H.startY=H.y}if(H.options.onScrollMove){H.options.onScrollMove.call(H,K)}},_end:function(K){if(y&&K.touches.length!==0){return}var I=this,O=y?K.changedTouches[0]:K,L,N,G={dist:0,time:0},m={dist:0,time:0},H=(K.timeStamp||Date.now())-I.startTime,M=I.x,J=I.y,F;I._unbind(t,h);I._unbind(c,h);I._unbind(w,h);if(I.options.onBeforeScrollEnd){I.options.onBeforeScrollEnd.call(I,K)}if(!I.moved){if(y&&this.options.handleClick&&!I.isStopScrollAction){I.doubleTapTimer=setTimeout(function(){I.doubleTapTimer=null;L=O.target;while(L.nodeType!=1){L=L.parentNode}if(L.tagName!="SELECT"&&L.tagName!="INPUT"&&L.tagName!="TEXTAREA"){N=E.createEvent("MouseEvents");N.initMouseEvent("click",true,true,K.view,1,O.screenX,O.screenY,O.clientX,O.clientY,K.ctrlKey,K.altKey,K.shiftKey,K.metaKey,0,null);N._fake=true;L.dispatchEvent(N)}},0)}I._resetPos(400);if(I.options.onTouchEnd){I.options.onTouchEnd.call(I,K)}return}if(H<300&&I.options.momentum){G=M?I._momentum(M-I.startX,H,-I.x,I.scrollerW-I.wrapperW+I.x,I.options.bounce?I.wrapperW:0):G;m=J?I._momentum(J-I.startY,H,-I.y,(I.maxScrollY<0?I.scrollerH-I.wrapperH+I.y-I.minScrollY:0),I.options.bounce?I.wrapperH:0):m;M=I.x+G.dist;J=I.y+m.dist;if((I.x>0&&M>0)||(I.x<I.maxScrollX&&M<I.maxScrollX)){G={dist:0,time:0}}if((I.y>I.minScrollY&&J>I.minScrollY)||(I.y<I.maxScrollY&&J<I.maxScrollY)){m={dist:0,time:0}}}if(G.dist||m.dist){F=u.max(u.max(G.time,m.time),10);I.scrollTo(u.round(M),u.round(J),F);if(I.options.onTouchEnd){I.options.onTouchEnd.call(I,K)}return}I._resetPos(200);if(I.options.onTouchEnd){I.options.onTouchEnd.call(I,K)}},_resetPos:function(G){var m=this,H=m.x>=0?0:m.x<m.maxScrollX?m.maxScrollX:m.x,F=m.y>=m.minScrollY||m.maxScrollY>0?m.minScrollY:m.y<m.maxScrollY?m.maxScrollY:m.y;if(H==m.x&&F==m.y){if(m.moved){m.moved=false;if(m.options.onScrollEnd){m.options.onScrollEnd.call(m)}if(m._afterPos){m._afterPos()}}return}m.scrollTo(H,F,G||0)},_transitionEnd:function(F){var m=this;if(F.target!=m.scroller){return}m._unbind(a);m._startAni()},_startAni:function(){var K=this,F=K.x,m=K.y,I=Date.now(),J,H,G;if(K.animating){return}if(!K.steps.length){K._resetPos(400);return}J=K.steps.shift();if(J.x==F&&J.y==m){J.time=0}K.animating=true;K.moved=true;if(K.options.useTransition){K._transitionTime(J.time);K._pos(J.x,J.y);K.animating=false;if(J.time){K._bind(a)}else{K._resetPos(0)}return}G=function(){var L=Date.now(),N,M;if(L>=I+J.time){K._pos(J.x,J.y);K.animating=false;if(K.options.onAnimationEnd){K.options.onAnimationEnd.call(K)}K._startAni();return}L=(L-I)/J.time-1;H=u.sqrt(1-L*L);N=(J.x-F)*H+F;M=(J.y-m)*H+m;K._pos(N,M);if(K.animating){K.aniTime=q(G)}};G()},_transitionTime:function(m){m+="ms";this.scroller.style[j]=m},_momentum:function(L,F,J,m,N){var K=0.0006,G=u.abs(L)*(this.options.speedScale||1)/F,H=(G*G)/(2*K),M=0,I=0;if(L>0&&H>J){I=N/(6/(H/G*K));J=J+I;G=G*J/H;H=J}else{if(L<0&&H>m){I=N/(6/(H/G*K));m=m+I;G=G*m/H;H=m}}H=H*(L<0?-1:1);M=G/K;return{dist:H,time:u.round(M)}},_offset:function(m){var G=-m.offsetLeft,F=-m.offsetTop;while(m=m.offsetParent){G-=m.offsetLeft;F-=m.offsetTop}if(m!=this.wrapper){G*=this.scale;F*=this.scale}return{left:G,top:F}},_bind:function(G,F,m){o.concat([F||this.scroller,G,this]);(F||this.scroller).addEventListener(G,this,!!m)},_unbind:function(G,F,m){(F||this.scroller).removeEventListener(G,this,!!m)},destroy:function(){var G=this;G.scroller.style[k]="";G._unbind(g,h);G._unbind(b);G._unbind(t,h);G._unbind(c,h);G._unbind(w,h);if(G.options.useTransition){G._unbind(a)}if(G.options.checkDOMChanges){clearInterval(G.checkDOMTime)}if(G.options.onDestroy){G.options.onDestroy.call(G)}for(var F=0,m=o.length;F<m;){o[F].removeEventListener(o[F+1],o[F+2]);o[F]=null;F=F+3}o=[];var H=E.createElement("div");H.appendChild(this.wrapper);H.innerHTML="";G.wrapper=G.scroller=H=null},refresh:function(){var m=this,F;m.wrapperW=m.wrapper.clientWidth||1;m.wrapperH=m.wrapper.clientHeight||1;m.minScrollY=-m.options.topOffset||0;m.scrollerW=u.round(m.scroller.offsetWidth*m.scale);m.scrollerH=u.round((m.scroller.offsetHeight+m.minScrollY)*m.scale);m.maxScrollX=m.wrapperW-m.scrollerW;m.maxScrollY=m.wrapperH-m.scrollerH+m.minScrollY;m.dirX=0;m.dirY=0;if(m.options.onRefresh){m.options.onRefresh.call(m)}m.hScroll=m.options.hScroll&&m.maxScrollX<0;m.vScroll=m.options.vScroll&&(!m.options.bounceLock&&!m.hScroll||m.scrollerH>m.wrapperH);F=m._offset(m.wrapper);m.wrapperOffsetLeft=-F.left;m.wrapperOffsetTop=-F.top;m.scroller.style[j]="0";m._resetPos(400)},scrollTo:function(m,L,K,J){var I=this,H=m,G,F;I.stop();if(!H.length){H=[{x:m,y:L,time:K,relative:J}]}for(G=0,F=H.length;G<F;G++){if(H[G].relative){H[G].x=I.x-H[G].x;H[G].y=I.y-H[G].y}I.steps.push({x:H[G].x,y:H[G].y,time:H[G].time||0})}I._startAni()},scrollToElement:function(m,G){var F=this,H;m=m.nodeType?m:F.scroller.querySelector(m);if(!m){return}H=F._offset(m);H.left+=F.wrapperOffsetLeft;H.top+=F.wrapperOffsetTop;H.left=H.left>0?0:H.left<F.maxScrollX?F.maxScrollX:H.left;H.top=H.top>F.minScrollY?F.minScrollY:H.top<F.maxScrollY?F.maxScrollY:H.top;G=G===undefined?u.max(u.abs(H.left)*2,u.abs(H.top)*2):G;F.scrollTo(H.left,H.top,G)},scrollToPage:function(G,F,I){var H=this,m,J;I=I===undefined?400:I;if(H.options.onScrollStart){H.options.onScrollStart.call(H)}m=-H.wrapperW*G;J=-H.wrapperH*F;if(m<H.maxScrollX){m=H.maxScrollX}if(J<H.maxScrollY){J=H.maxScrollY}H.scrollTo(m,J,I)},disable:function(){this.stop();this._resetPos(0);this.enabled=false;this._unbind(t,h);this._unbind(c,h);this._unbind(w,h)},enable:function(){this.enabled=true},stop:function(){if(this.options.useTransition){this._unbind(a)}else{p(this.aniTime)}this.steps=[];this.moved=false;this.animating=false},isReady:function(){return !this.moved&&!this.animating}};function s(m){if(z===""){return m}m=m.charAt(0).toUpperCase()+m.substr(1);return z+m}l=null;if(typeof exports!=="undefined"){exports.iScroll=v}else{h.iScroll=v}(function(H){if(!H){return}var G=v,I=0,F={};function m(K,J){var L="iscroll"+I++;K.data("_iscroll_",L);return F[L]=new G(K[0],J)}h.iScroll=function(K,J){return m(H(typeof K=="string"?"#"+K:K),J)};H.fn.iScroll=function(K){var J=[];this.each(function(N,O){if(typeof K=="string"){var M=F[H(O).data("_iscroll_")],P;if(M&&(P=M[K])){var L=H.isFunction(P)?P.apply(M,Array.prototype.slice.call(arguments,1)):P;if(L!==M&&L!==undefined){J.push(L)}}}else{if(!H(O).data("_iscroll_")){m(H(O),K)}}});return J.length?J:this}})(h.Zepto||null)})(window,document);

/**
 * @file 导航栏组件 － iScroll插件
 * @name Navigator.iscroll
 * @desc <qrcode align="right" title="Live Demo">../gmu/_examples/webapp/naivgator/navigator.html</qrcode>
 * navigator iscroll插件，可滚动导航栏
 * @import core/zepto.iscroll.js, widget/navigator.js
 */

(function ($, undefined) {
    /**
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

                data.iScroll = iScroll(data._$navWrapper.get(0), data.iScrollOpts = $.extend({
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
