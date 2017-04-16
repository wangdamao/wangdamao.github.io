function Baidu(){
	this.bd_search = $('#bd-search');
	this.bd_searchBtn = $('#bd-searchBtn');
	this.searchList = $('.searchList');
	this.num = 0;
}
Baidu.prototype = {
	constructor:Baidu,
	init:function(){
		var _this = this;
		this.searchList.hide();
		this.bd_search.keydown(function(ev){
			var event = window.ev || ev;
			var key = event.keyCode || event.which;
			_this.searchList.fadeIn(300);
			_this.searchList.html('');
			_this.keyDown($(this).val());
			if ($(this).val() == '') {
				_this.searchList.fadeOut(500);
			}
			if (key == 13) {
				_this.searchBtnFn($(this).val());
			}
		})
		this.bd_searchBtn.click(function(){
			_this.searchBtnFn(_this.bd_search.val());
		})
	},
	keyDown:function(val){
		var _this = this;
		$.ajax({
			type:"get",
			url:"https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?cb=?",
			data:{
				wd:val
			},
			dataType:'jsonp',
			success:function(data){
				console.log(data)
				$.each(data.s, function(index,ele) {
					$(`<li>${ele}</li>`).appendTo(_this.searchList).click(function(){
						window.open('https://www.baidu.com/s?wd='+$(this).text()+'&rsv_spt=1&rsv_iqid=0xf4da60070000b57e&issp=1&f=8&rsv_bp=1&rsv_idx=2&ie=utf-8&rqlang=cn&tn=baiduhome_pg&rsv_enter=0&oq='+$(this).text());
					})
				});
			}
		});
	},
	searchBtnFn:function(val){
		window.open('https://www.baidu.com/s?wd='+val+'&rsv_spt=1&rsv_iqid=0xf4da60070000b57e&issp=1&f=8&rsv_bp=1&rsv_idx=2&ie=utf-8&rqlang=cn&tn=baiduhome_pg&rsv_enter=0&oq='+val);
	}
}
var baidu = new Baidu().init();
