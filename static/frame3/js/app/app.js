//之所以不放在app.page.onLoad 里，是为了页面也能在PC上调试
$(function(){
	//单页的声明
	ui.run({
  		appType : 'single',
  		showPageLoading : true,
  		//初始化的操作
  		init : function(){
  			//设置皮肤,打成安装包才会真正持久化数据
            var color = localStorage.getItem("skin-color");
            if (color == ""||color==null) {
                color = "#3498DB";
            }

			ui.Skin.init({
				bgColor : color,
				iconFontColor : color, 
				iconFontColorSelector :[".thumbnail [class^='icon-']", ".list-view .icon"]
			});

			//跳转到此页
			//http://localhost/bt/index.html?url=modules/ui-component/slider_section.html
			var url = ui.Utils.getUrlQueryString("url");
			if(url){
				ui.load({
					url : url
				});
			}
  		}
	});	
});

