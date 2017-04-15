window.onload = function(){
	var winW = window.innerWidth;
	var winH = window.innerHeight;
	var bar_img = document.getElementsByClassName('bar-imgs')[0];
	var bar_img_divs = bar_img.getElementsByTagName('div');
	bar_img_divs = Array.from(bar_img_divs);
	
	bar_img_divs.forEach(function(a,b,c){
		a.style.left = 80*b + 'px';
	})
	bar_img.style.left = -(3600 - winW)/2 + 'px';

/*-------------nav跳转---------------*/
	(function(){
		var nav = document.getElementById('nav');
		var btns = nav.getElementsByTagName('a');
		btns[0].addEventListener('click',function(){
			location.href = 'https://github.com/wangxiaoyu2012/';
		});
		btns[1].addEventListener('click',function(){
			location.href = 'https://zhongxuyang.github.io/Faces-of-Power/';
		});
		btns[2].addEventListener('click',function(){
			location.href = 'https://zhongxuyang.github.io/Faces-of-Power/';
		});
	})();

/*-------------loading---------------*/
	(function(){
		var loading = document.getElementById('loading');
		var star = loading.getElementsByClassName('blue-star')[0];
		var prog = loading.getElementsByClassName('prog')[0];
		
		//五角星旋转
		star.style.transform = 'rotate(36000deg)';
		
		//红白条的运动
		setTimeout(function(){
			prog.style.transition = '3s';
			prog.style.left = '100vw';
		},1000);
		setTimeout(function(){
			prog.style.transition = 'none';
			prog.style.left = '-100vw';
		},4000)
		setTimeout(function(){
			prog.style.transition = '3s';
			prog.style.left = '100vw';
		},5000);
		
		//loading页面消失，welcome显示
		setTimeout(function(){
			loading.style.opacity = 0;
			setTimeout(function(){
				loading.style.display = 'none';
			},1000);
			welcome.style.zIndex = '200';
			welcomeFn();
		},9000);
	})();
	
/*-------------welcome----------------*/
	//生成svg图
	function welcomeFn(){
		var welcome = document.getElementById('welcome');
		var paths = welcome.getElementsByTagName('path');
		var canvas = welcome.getElementsByClassName('canvas')[0];
		canvas.style.backgroundColor = 'rgb(88, 94, 113)';
		for(var i=0;i<sculpture.length;i++){
			paths[i].setAttribute('d',sculpture[i].d);
			paths[i].setAttribute('fill',sculpture[i].fill);
			paths[i].setAttribute('fill-opacity',sculpture[i]['fill-opacity']);
		}
		sloganChange();
	}
	
	//slogan的运动函数
	function sloganChange(){
		var welcome = document.getElementById('welcome');
		var slogan = welcome.getElementsByClassName('slogan')[0];
		var divs = slogan.getElementsByTagName('div');
		var btn = welcome.getElementsByClassName('btn')[0];
		var mask = welcome.getElementsByClassName('mask')[0];
		
		//红白条运动
		divs[2].style.left = '100vw';
		
		//在红白条运动的时候，更换slogan
		setTimeout(function(){
			divs[1].style.display = 'block';
		},2000);
		
		//添加遮罩层以及显示按钮
		setTimeout(function(){
			mask.style.opacity = '0.5';
			btn.style.opacity = 1;
			btn.style.transform = 'scale(1)';
		},3000);
		
		//按钮点击
		btn.addEventListener('click',welcomeBtn)
	}
	
	//按钮点击函数
	function welcomeBtn(){
		var welcome = document.getElementById('welcome');
		welcome.style.opacity = '0';
		setTimeout(function(){
			welcome.style.display = 'none';
		},1000);
	}
	
/*-------------personage----------------*/
	var content = document.getElementById('content');
	var personage = document.getElementById('personage');
	(function(){
		personage.btn_onOff = true;
		
		//面向对象方式给按钮添加点击事件
		function BtnClick(obj1,obj2,direction,num){
			var that = this;
			this.btn = document.getElementById(obj1);//按钮
			this.ele = [];
			obj2.forEach(function(a,b,c){
				var e = document.getElementById(a);
				that.ele.push( e );//谁发生改变
			});
			this.dir = direction;//改变left还是top
			this.num = num;//新位置坐标
			this.onOff = true;//nav的开关
		}
		//给按钮的原型绑定事件监听方法
		BtnClick.prototype.addEvent = function(){
			var that = this;
			this.btn.addEventListener('click',function(){
				that.btnFn(that);
			});
		}
		BtnClick.prototype.btnFn = function(that){
			if( that.onOff ){
				that.onOff = false;
				that.ele.forEach(function(a,b,c){
					a.style[that.dir[b]] = that.num[b];
				});
			}else{
				that.onOff = true;
				that.ele.forEach(function(a,b,c){
					a.style[that.dir[b]] = '';
				});
			}
		}
		
		//NAV的点击事件
		function NavClick(obj1,obj2,direction,num){
			//属性继承
			BtnClick.call(this,obj1,obj2,direction,num);
		};
		
		//NAV点击事件的方法继承
		function Buffer1(){};
		Buffer1.prototype = BtnClick.prototype;
		var buffer1 = new Buffer1;
		NavClick.prototype = buffer1;
		NavClick.prototype.constructor = NavClick;
		
		//NAV独有的新方法
		NavClick.prototype.down = function(){
			var that = this;
			var spans = this.btn.getElementsByTagName('span');
			this.btn.addEventListener('click',function(){
				if( that.onOff ){
					spans[0].style.top = '14px';
					spans[2].style.top = '14px';
					spans[1].style.transform = 'rotate(90deg)';
					that.btn.style.transform = 'rotate(45deg)';
					content.style.top = '15%';
				}else{
					spans[0].style.top = '';
					spans[2].style.top = '';
					spans[1].style.transform = '';
					that.btn.style.transform = '';
					content.style.top = '';
				}
			});
		};
		
		var navClick = new NavClick('nav_btn',['nav'],['top'],['0']);
		navClick.down();
		navClick.addEvent();
		
		
		//右侧两个按钮的点击事件
		function TwoBtnClick(obj1,obj2,direction,num){
			//属性继承
			BtnClick.call(this,obj1,obj2,direction,num);
			this.btns = personage.getElementsByClassName('info')[0].getElementsByClassName('btn');
			this.btns = Array.prototype.slice.call(this.btns);//类数组转数组
		};
		
		//右侧两个按钮点击事件的方法继承
		function Buffer2(){};
		Buffer2.prototype = BtnClick.prototype;
		var buffer2 = new Buffer2;
		TwoBtnClick.prototype = buffer2;
		TwoBtnClick.prototype.constructor = TwoBtnClick;
		
		//两个点击按钮独有的新方法
		TwoBtnClick.prototype.disappear = function(){
			var that = this;
			this.btn.addEventListener('click',function(){
				var h3 = document.getElementsByTagName('h3')[0];
				move(h3,{'left':'20','top':'-100'},1000,'linear');
				h3.style.transform = 'scale(0.8)';
				h3.style.textShadow = '10px 10px 50px #000';
				that.btns.forEach(function(a,b,c){
					a.style.opacity = '0';
				});
			});
		};
		TwoBtnClick.prototype.btnFn = function(that){
			that.ele.forEach(function(a,b,c){
				a.style[that.dir[b]] = that.num[b];
			});
		}
		var twoBtnClick1 = new TwoBtnClick('info_btn',['resume','official'],['left','bottom'],['0','0']);
		twoBtnClick1.disappear();
		twoBtnClick1.addEvent();
		var twoBtnClick2 = new TwoBtnClick('elections_btn',['resume','official'],['left','bottom'],['0','0']);
		twoBtnClick2.disappear();
		twoBtnClick2.addEvent();
		
		//关闭按钮的点击事件
		function CloseClick(obj1,obj2,direction,num){
			//属性继承
			BtnClick.call(this,obj1,obj2,direction,num);
			this.btns = personage.getElementsByClassName('info')[0].getElementsByClassName('btn');
			this.btns = Array.prototype.slice.call(this.btns);//类数组转数组
		};
		
		//CLOSE点击事件的方法继承
		function Buffer3(){};
		Buffer3.prototype = BtnClick.prototype;
		var buffer3 = new Buffer3;
		CloseClick.prototype = buffer3;
		CloseClick.prototype.constructor = CloseClick;
		
		//CLOSE独有的新方法
		CloseClick.prototype.show = function(){
			var that = this;
			this.btn.addEventListener('click',function(){
//				var canvas = personage.getElementsByClassName('canvas')[0];
//				canvas.style.cssText = '';
				var h3 = document.getElementsByTagName('h3')[0];
				move(h3,{'left':'','top':''},1000,'linear');
				h3.style.transform = '';
				h3.style.textShadow = '';
				that.btns.forEach(function(a,b,c){
					a.style.opacity = '';
				});
			});
		};
		
		var closeClick = new CloseClick('official',['resume','official'],['left','bottom'],['','']);
		closeClick.show();
		closeClick.addEvent();
	})();
	
/*-------------personage-canvas---------------*/
	
	//点击换图
	(function(){
		var canvas = personage.getElementsByClassName('canvas')[0];
		var svgs = canvas.getElementsByTagName('svg');
		var clipPaths = canvas.getElementsByTagName('clipPath');
		var bg = canvas.getElementsByClassName('bg')[0];
		var paths = canvas.getElementsByTagName('path');
		var bar_btns = document.getElementById('bar-btn').getElementsByTagName('div');//获取上一张下一张的点击按钮
		var imgs = personage.getElementsByClassName('bar-imgs')[0].getElementsByTagName('div');
		var stars = document.getElementsByClassName('stars');
		var nowL = 0;//记录当前点击图片的位置
		imgs = Array.from(imgs);//类数组转数组
		svgs = Array.from(svgs);
		paths = Array.from(paths);
		clipPaths = Array.from(clipPaths);
		var onOff = true;//防止下面的小图没有运动完就点击，不然图会错乱
		
		//上一张
		bar_btns[0].addEventListener('click',function(){
			if( onOff ){
				imgs.forEach(function(a,b,c){
					if( a.offsetLeft == 1760 ){
						if( a.previousElementSibling ){//如果有上一个兄弟节点
							var name = a.previousElementSibling.id;
						}else{
							console.log(c[c.length-1])
							var name = c[c.length-1].id;
						}
						nowL = 1680;
						location.hash = 'name=' + name;
						return;
					}
				});
			}
		});
		//下一张
		bar_btns[1].addEventListener('click',function(){
			if( onOff ){
				imgs.forEach(function(a,b,c){
					if( a.offsetLeft == 1760 ){
						if( a.nextElementSibling ){//如果有下一个兄弟节点
							var name = a.nextElementSibling.id;
						}else{
							var name = c[0].id;
						}
						nowL = 1840;
						location.hash = 'name=' + name;
						return;
					}
				});
			}
		});
		
		//当hash改变换图
		window.onhashchange = function(){
			var hash = location.hash.split('=')[1];
			clickFn(hash);
			changeInfo(hash);
		}
		
		imgs.forEach(function(a,b,c){
			a.addEventListener('click',function(ev){
				if( onOff ){
					location.hash = 'name=' + ev.target.id;
					nowL = ev.target.offsetLeft;//当前点击图片的位置
				}
			});
		});
		function clickFn(hash){
			if( onOff ){
				onOff = false;
				//给点击的小图重新定位
				var disL = nowL - 1760;//移动距离(1760是中心位置)
				imgs.forEach(function(a,b,c){
					var oldL = a.offsetLeft;
					var newL = oldL - disL;
					a.style.zIndex = '';
					if( newL == 1760 ){
						a.className = '';
					}else{
						a.className = 'gray';
					}
					if( newL < 0 ){
						newL = 3520 - disL + oldL;
						a.style.zIndex = '-1';
					}
					if( newL > a.offsetWidth*44 ){
						newL = newL - 3520;
						a.style.zIndex = '-1';
					}
					a.style.left = newL + 'px';
				});
				
				
				//修改svg
	//			svgs.forEach(function(a,b,c){
	//				a.setAttribute('viewBox',data[name].other.viewBox);
	//			});
				clipPaths.forEach(function(a,b,c){
					a.children[0].setAttribute('width',data[hash].other.width);
					a.children[0].setAttribute('height',data[hash].other.height);
				});
				canvas.style.backgroundColor = data[hash].other.fill;
				bg.setAttribute('width',data[hash].other.width);
				bg.setAttribute('height',data[hash].other.height);
				bg.setAttribute('fill',data[hash].other.fill);
				paths.forEach(function(a,b,c){
					a.setAttribute('d',data[hash].svg['p'+(b+1)].d);
					a.setAttribute('fill',data[hash].svg['p'+(b+1)].fill);
					a.setAttribute('fill-opacity',data[hash].svg['p'+(b+1)]['fill-opacity']);
				});
				setTimeout(function(){
					onOff = true;
				},1100);
			}
		};
		//人物信息改变
		function changeInfo( who ){
			var name = document.getElementsByClassName('name')[0];
			var resume = document.getElementById('resume');
			var ul = resume.getElementsByTagName('ul')[0];
			var info = document.getElementsByClassName('info')[0];
			var left = info.getElementsByClassName('left')[0];
			var right = info.getElementsByClassName('right')[0];
			var year = right.getElementsByTagName('strong')[0];
			var p = left.getElementsByTagName('p')[0];
			
			info.style.color = data[who].info.color;
			year.innerHTML = data[who].info.date;
			name.innerHTML = data[who].info.first + '<strong> ' + data[who].info.last + '</strong>';
			p.innerHTML = data[who].info.word;
			var str = '';
			for(var attr in data[who].info){
				if( attr != 'first' && attr != 'last' && attr != 'word' && attr != 'date' && attr != 'color' ){
					str += '<li>' + attr + ': ' + data[who].info[attr] + '</li>';
				}
			}
			ul.innerHTML = str;
		};
		
		
		/*-------------face随鼠标移动----------------*/		
		
		document.addEventListener('mousemove',move);
		function move(ev){
			var t = (ev.pageY - winH/2)*0.008;
			var l = (ev.pageX - winW/2)*0.008;
			
			svgs[0].style.left = -l + 'px';
			svgs[0].style.top = -t + 'px';
			
			for(var i=1;i<svgs.length;i++){
				svgs[i].style.left = l + 'px';
				svgs[i].style.top = t + 'px';
			}
			
			
			for(var i=0;i<stars.length;i++){
				if( i%2 == 0 ){
					stars[i].style.transform = 'translate(' + t + 'px,' + l + 'px)';
				}else{
					stars[i].style.transform = 'translate(-' + t + 'px,-' + l + 'px)';
				}
			}
		}
	})();
}


