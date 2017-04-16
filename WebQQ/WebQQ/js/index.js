function Computer(){
	this.pcList = $('.fileList').find('li');
	this.disX = 0;
	this.disY = 0;
	this.musicBtn = $('#music');
	this.musicIframe = $('#musicIframe');
	this.date = $('.date');
	this.dateTime = $('#dateTime');
	this.baiduIframe = $('#baiduIframe');
	this.baiduBtn = $('#baidu');
	this.closeBaidu = $('#closeBaidu');
	this.closeMusic = $('#closeMusic');
}
Computer.prototype = {
	constructor:Computer,
	init:function(){
		var _this = this;
		this.closeMusic.hide();
		this.closeBaidu.hide();
		this.musicIframe.css({
			left:$(window).innerWidth()
		})
		this.baiduIframe.css({
			top:-$(window).innerHeight()
		})
		this.setLT();
		this.posi();
		$.each(this.pcList, function(i,e) {
			_this.drag(e);
		});
		this.musicBtn.dblclick(function(){
			_this.musicIframe.animate({
				left:0
			},700,function(){
				_this.closeMusic.fadeIn(1000);
			})
		})
		this.date.css({
			left:$(window).innerWidth() - this.date.width()-25,
			top:$(window).innerHeight()
		})
		this.dateTime.dblclick(function(){
			_this.date.animate({
				left:$(window).innerWidth() - _this.date.width()-25,
				top:$(window).innerHeight() - _this.date.height()
			},800)
		})
		this.baiduBtn.dblclick(function(){
			_this.baiduIframe.animate({
				top:0
			},800,function(){
				_this.closeBaidu.fadeIn(1000);
			})
		})
		this.closeBaidu.click(function(){
			$(this).hide();
			_this.baiduIframe.animate({
				top:-$(window).innerHeight()
			},700)
		})
		this.closeMusic.click(function(){
			$(this).hide();
			_this.musicIframe.animate({
				left:$(window).innerWidth()
			},700)
		})
	},
	drag:function(obj){
		var _this = this;
		$(obj).mousedown(function(ev){
			_this.disX = ev.pageX - $(this).offset().left;
			_this.disY = ev.pageY - $(this).offset().top;
			$(document).mousemove(function(ev){
				$(obj).css({
					left:ev.pageX - _this.disX,
					top:ev.pageY - _this.disY
				})
			})
			$(document).mouseup(function(){
				$(document).off();
			})
			return false;
		})
	},
	posi:function(){
		$.each(this.pcList, function(i,e) {
			$(e).css('position','absolute');
		});
	},
	setLT:function(){
		$.each(this.pcList, function(i,e) {
			$(e).css({
				left:$(e).offset().left,
				top:$(e).offset().top
			});
		});
	}
}
var pc = new Computer().init();


function DateTime(){
	this.timeO = $('.timeO').find('span');
	this.timeT = $('.timeT');
	this.year = $('.d_header').find('span');
	this.timeNum = 0;
	this.dateList = $('.dateList');
	this.dateNext = $('#dateNext');
	this.datePrev = $('#datePrev');
	this.closeTime = $('#closeTime');
	this.date = $('.date');
}
DateTime.prototype = {
	constructor:DateTime,
	control:function(){
		var _this = this;
		this.init();
		this.dateShow();
		this.datePrev.click(function(){
			_this.dateList.html('');
			_this.timeNum++;
			_this.dateShow();
		})
		this.dateNext.click(function(){
			_this.dateList.html('');
			_this.timeNum--;
			_this.dateShow();
		})
		this.closeTime.click(function(){
			_this.date.animate({
				top:$(window).innerHeight()
			},800)
		})
	},
	init:function(){
		var _this = this;
		setInterval(function(){
			var date = new Date();
			var H = date.getHours();
			var M = date.getMinutes();
			var S = date.getSeconds();
			_this.timeO.html(_this.toZero(H)+':'+_this.toZero(M)+':'+_this.toZero(S));
		},1000)
		var da = new Date();
		var Y = da.getFullYear();
		var Moth = da.getMonth()+1;
		var D = da.getDate();
		var Day = da.getDay();
		var H = da.getHours();
		var M = da.getMinutes();
		var S = da.getSeconds();
		switch (Day){
			case 0:
				Day = '星期日';
				break;
			case 1:
				Day = '星期一';
				break;
			case 2:
				Day = '星期二';
				break;
			case 3:
				Day = '星期三';
				break;
			case 4:
				Day = '星期四';
				break;
			case 5:
				Day = '星期五';
				break;
			case 6:
				Day = '星期六';
				break;
			default:
				break;
		}
		this.timeT.html(Y+'年'+Moth+'月'+D+'日,'+Day);
		this.year.html(Y+'年'+Moth+'月');
	},
	toZero:function(n){
		return n<10?'0'+n:''+n;
	},
	dateShow:function(){
		var date=new Date();//时间戳
		date.setDate(1);//每月都有1号
		date.setMonth(date.getMonth()+this.timeNum)//获取下一个月
		var n1=date.getDay()//获取本月或者每月是星期几
		if(n1==0){//如果获取到的是周日就让排在第七位
			n1=7;
		}
		this.year.html(date.getFullYear()+'年'+(date.getMonth()+1)+'月');
		var date=new Date();
		date.setDate(1);//每月都有1号
		date.setMonth(date.getMonth()+this.timeNum+1)//设置下一个月
		date.setDate(0);
		var n2=date.getDate();//本月的 天数   
		var date=new Date();
		var n3=date.getDate();//获取今天是第几号
		for(var i=1;i<n1;i++){
			this.dateList.append($('<li></li>'));
		}
		for(var i=0;i<n2;i++){//获取本月的天数
			this.dateList.append('<li>'+(i+1)+'</li>');
		}
		var dateList = this.dateList.find('li');
		for(var i=0;i<dateList.length;i++){
			if(i==n3+n1-2){
				dateList.eq(n3+n1-2).attr('class','hover').siblings().attr('class','');
			}
		}
	}
}
var date = new DateTime().control();
