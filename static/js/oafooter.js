/**
 * 初始化
 */
;(function(undefined){

})()

function lodingFooter() {
    var footerHtml = '<div class="navbar"><ul class="grid-c" data-menupos="top">'+
        '   <li style="position: relative;">'+
        '     <div data-role="BTButton" class="btn-active" data-theme="a">流程管理</div>'+
        '        <ul class="sonmenu grid-b" style="display: block;width:150%;position: absolute;bottom: 58px;left:0%;background-color: #1e79ac;">'+
        '           <li><div data-role="BTButton" data-theme="a" data-url="oadbsx.html">待办事项</div></li>'+
        '           <li><div data-role="BTButton" data-theme="a" data-url="oaybsx.html">已办事项</div></li>'+
        '        </ul>'+
        '   </li>'+
        '   <li style="position: relative;">'+
        '        <div data-role="BTButton" data-theme="a">值班表</div>'+
        '        <ul class="sonmenu grid-b" style="display: block;width:150%;position: absolute;bottom: 58px;left:-40%;background-color: #1e79ac;">'+
        '           <li><div data-role="BTButton" data-theme="a" data-url="oaldzbb.html">领导值班表</div></li>'+
        '           <li><div data-role="BTButton" data-theme="a" data-url="oazhibanbiao.html">值班表</div></li>'+
        '        </ul>'+
        '   </li>'+
        '   <li style="position: relative;">'+
        '        <div data-role="BTButton" data-theme="a">更多</div>'+
        '        <ul class="sonmenu grid-c" style="display: block;width:230%;position: absolute;bottom: 58px;left:-130%;background-color: #1e79ac;">'+
        '           <li><div data-role="BTButton" data-theme="a" data-url="oa_work_communicate_list.html">工作交流</div></li>'+
        '           <li><div data-role="BTButton" data-theme="a" data-url="oagongzichaxun.html">工资查询</div></li>'+
        '           <li><div data-role="BTButton" data-theme="a" data-url="oa110jqlb.html">重大警情查询</div></li>'+
        '        </ul>'+
        '   </li>'+
        '</ul></div>';

    $(".footer").html(footerHtml);
    $(".footer").uiwidget();

    $(document).tap(function() {
        $(".sonmenu,.angle").hide();
    });
}




