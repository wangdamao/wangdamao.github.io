var songKey = null;
function jsonCallback(data){
	songKey = data.key;
}
/*
 	功能：
 		1.播放，暂停，上一首，下一首
 		2.本地歌词同步
 		3.歌曲进度条拖拽
 		4.在线搜歌
 		5.播放列表超出滚动
 * 
 * */
function Music(){
	//音频标签
	this.audio = $('#audio')[0];
	//歌曲src
	this.songSrc = ['song/G.E.M. 邓紫棋 (Gem Tang) - 喜欢你.mp3','song/朴树 - 平凡之路.mp3','song/紫菱 - 逆流成河.mp3'];
	//歌词src
	this.songLrc = ['songLrc/G.E.M. 邓紫棋 (Gem Tang) - 喜欢你.lrc','songLrc/朴树 - 平凡之路.lrc','songLrc/紫菱 - 逆流成河.lrc'];
	//控制播放第几首
	this.songNum = 0;
	this.prve_song = $('#prve_song');
	this.play_song = $('#play_song');
	this.next_song = $('#next_song');
	this.timer = null;
	this.timing = $('#timing');
	this.timed = $('#timed');
	this.song_drag = $('#song_drag');
	this.gqbt = $('#gqbt');
	this.song_lrc = $('#song_lrc');
	//存放歌词
	this.lrcArr = '';
	this.scrT = $('.scrT');
	this.scrllTop = $('#scrTiao');
	this.musicList = $('.musicList');
	this.scroll = $('#scroll');
	this.searchBtn = $('#search-btn');
	this.searchTxt = $('#q-search');
	this.searchList = $('#searchList');
	this.p = $('.m-right');
	this.p2 = $('.m-f-jdt');
	this.songImg = [
		{
			img:'images/dzq.jpg',
			song:'喜欢你',
			name:'邓紫棋',
			zj:'妙味课堂'
		},
		{
			img:'images/ps.jpg',
			song:'平凡之路',
			name:'朴树',
			zj:'妙味课堂'
		},
		{
			img:'images/zl.jpg',
			song:'逆流成河',
			name:'紫菱',
			zj:'妙味课堂'
		}
	];
	this.ylBtn = $('.yl');
	this.ylScroll = $('.ylScroll');
	this.page = $('.page');
	this.pageNum = 1;
	this.close = $('#close');
}
Music.prototype = {
	constructor:Music,
	//初始化
	init:function(){
		var _this = this;
		//上一首
		this.prve_song.click(function(){
			 _this.prveSong();
		})
		//播放按钮
		this.play_song.click(function(){
			 _this.playSong();
		})
		//下一首
		this.next_song.click(function(){
			 _this.nextSong();
		})
		//检测歌总时间改变
		this.audio.ondurationchange = function(){
			_this.timed.html(_this.changeTime(_this.audio.duration));
		}
		//当前播放完跳下一首
		this.audio.addEventListener('ended',function(){
			_this.autoNext();
		})
		//歌曲进度条
		this.song_drag.mousedown(function(ev){
			_this.songDrag(ev);
		});
		//歌曲列表滚动条
		this.scrllTop.mousedown(function(ev){
			ev.preventDefault();
			_this.scrTiao(ev);
		})
		//判断歌曲滚动条是否显示
		this.getHeight();
		//搜索按钮
		this.searchBtn.click(function(){
			_this.searchList.html('');
			_this.pageNum = 1;
			_this.searchSong(_this.searchTxt.val(),_this.pageNum);
		});
		//回车搜索
		this.searchTxt.keydown(function(ev){
			if (ev.keyCode != 13) return;
			_this.searchList.html('');
			_this.pageNum = 1;
			_this.searchSong(_this.searchTxt.val(),_this.pageNum);
		});
		//歌曲播放列表点击播放
		this.musicList.find('li').off().click(function(){
			_this.clickSong($(this));
		});
		//音量
		this.ylBtn.click(function(){
			if (_this.audio.muted) {
				_this.audio.muted = 0;
				_this.ylScroll.animate({
					left:50
				},500);
			}else{
				_this.audio.muted = 0.5;
				_this.ylScroll.animate({
					left:0
				},500);
			}
		});
		//音量拖拽
		this.ylScroll.mousedown(function(ev){
			_this.ylTuo(ev);
		});
		this.close.click(function(){
//			$(this).closest('#musicIframe').css('left',$(window).width())
//			console.log($(this).closest('#musicIframe'))
		})
	},
	//上一首
	prveSong:function(){
		var _this = this;
		this.lrcArr = '';
		this.songNum--;
		if (this.songNum < 0) {
			this.songNum = this.songSrc.length-1;
		}
		this.ajaxLrc(this.songNum);
		//给音频播放地址
		this.audio.src = this.songSrc[this.songNum];
		this.play_song.css('background','url(images/play_song.png)');
		//音频播放
		this.audio.play();
		this.timer = setInterval(function(){
			if (_this.lrcArr != '') {
				var time = Math.ceil(audio.currentTime);
				$.each(_this.lrcArr, function(index,ele) {
					if (time == _this.lrcArr[index].time) {
						_this.song_lrc.html(_this.lrcArr[index].clause);
					}
				});
			} else{
				_this.song_lrc.html('暂无歌词');
			}
			_this.timing.html(_this.changeTime(_this.audio.currentTime));
			var scale = _this.audio.currentTime/_this.audio.duration;
			_this.song_drag.css('left',scale*(600 - _this.song_drag.width()));
		},1000)
		this.setStarr(this.songNum);
	},
	//播放按钮
	playSong:function(){
		var _this = this;
		this.lrcArr = '';
		if (this.audio.paused) {
			this.ajaxLrc(this.songNum);
			this.timer = setInterval(function(){
				if (_this.lrcArr != '') {
					var time = Math.ceil(audio.currentTime);
					$.each(_this.lrcArr, function(index,ele) {
						if (time == _this.lrcArr[index].time) {
							_this.song_lrc.html(_this.lrcArr[index].clause);
						}
					});
				} else{
					_this.song_lrc.html('暂无歌词');
				}
				_this.timing.html(_this.changeTime(_this.audio.currentTime));
				var scale = _this.audio.currentTime/_this.audio.duration;
				_this.song_drag.css('left',scale*(600 - _this.song_drag.width()));
			},1000)
			this.audio.play();
			this.play_song.css('background','url(images/play_song.png)');
			this.setStarr(this.songNum);
		}else{
			this.audio.pause();
			this.play_song.css('background','url(images/pause_song.png)');
			clearInterval(this.timer);
		}
		this.timed.html(this.changeTime(this.audio.duration));
	},
	//下一首
	nextSong:function(){
		var _this = this;
		this.lrcArr = '';
		this.songNum++;
		if (this.songNum > this.songSrc.length-1) {
			this.songNum = 0;
		}
		this.ajaxLrc(this.songNum);
		this.audio.src = this.songSrc[this.songNum];
		this.p2.find('span').eq(0).html(this.songImg[this.songNum].song);
		this.p2.find('span').eq(1).html(this.songImg[this.songNum].name);
		this.play_song.css('background','url(images/play_song.png)');
		this.audio.play();
		this.timer = setInterval(function(){
			if (_this.lrcArr != '') {
				var time = Math.ceil(audio.currentTime);
				$.each(_this.lrcArr, function(index,ele) {
					if (time == _this.lrcArr[index].time) {
						_this.song_lrc.html(_this.lrcArr[index].clause);
					}
				});
			} else{
				_this.song_lrc.html('暂无歌词');
			}
			_this.timing.html(_this.changeTime(_this.audio.currentTime));
			var scale = _this.audio.currentTime/_this.audio.duration;
			_this.song_drag.css('left',scale*(600 - _this.song_drag.width()));
		},1000);
		this.setStarr(this.songNum);
	},
	//时间处理
	changeTime:function(iNum){
		iNum = parseInt( iNum );
		var iM = this.toZero(Math.floor(iNum%3600/60));
		var iS = this.toZero(Math.floor(iNum%60));
		return iM + ':' + iS;
	},
	//补0
	toZero:function(n){
		return n<10?'0'+n:''+n;
	},
	//歌曲进度条
	songDrag:function(ev){
		var _this = this;
		var disX = ev.pageX - this.song_drag[0].offsetLeft;
		$(document).mousemove(function(ev){
			var L = ev.pageX - disX;
			var MaxL = 600 - _this.song_drag.width();
			if (L < 0) {
				L = 0;
			}
			if (L > MaxL) {
				L = MaxL;
			}
			_this.song_drag.css('left',L);
//			_this.gqbt.css('width',Le);
			var scale = L / MaxL;
			_this.audio.currentTime = scale*_this.audio.duration;
			_this.timing.html(_this.changeTime(_this.audio.currentTime));
			var time = Math.ceil(_this.audio.currentTime);
			$.each(_this.lrcArr, function(index,ele) {
				if (time == _this.lrcArr[index].time) {
					_this.song_lrc.html(_this.lrcArr[index].clause);
				}
			});
		})
		$(document).mouseup(function(){
			$(document).off();
		})
		return false;
	},
	//正则匹配歌词
	parseLyric:function(lrc){
		var lyrics = lrc.split('\n');
		var lrcArr = [];
		for (var i=0; i<lyrics.length; i++) {
			var lrcObj = {};
			lrcObj.id = i;
			var lyric = lyrics[i];
			var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
			var timeArr = lyric.match(timeReg);
			if (!timeArr) {
				continue;
			}
			lrcObj.clause = lyric.replace(timeReg,'');
			for (var k=0; k<timeArr.length; k++) {
				var t = timeArr[k];
				var m = Number(String(t.match(/\[\d*/i)).slice(1)),
					s = Number(String(t.match(/\:\d*/i)).slice(1));
					lrcObj.time = m * 60 + s;
				}
				lrcArr.push(lrcObj);
		}
		return lrcArr;
	},
	//请求本地歌词
	ajaxLrc:function(m){
		var _this = this;
		$.ajax({
			url:''+this.songLrc[m]+'',
			contentType: "application/x-www-form-urlencoded; charset=utf-8", 
			success:function(data){
				_this.lrcArr = _this.parseLyric(data); 
			}
		});
	},
	//歌曲滚动条拖拽
	scrTiao:function(ev){
		var _this = this;
		var disY = ev.pageY - this.scrllTop[0].offsetTop;
		$(document).mousemove(function(ev){
			var L = ev.pageY - disY;
			var maxT = _this.scrT.height() - _this.scrllTop.height(); 
			if (L < 0) {
				L = 0;
			}
			if(L > maxT){
				L = maxT;
			}
			_this.scrllTop.css('top',L);
			var maxRT = _this.scroll.height() - _this.musicList.height();
			var scale = L/maxT;
			_this.musicList.css('top',scale*maxRT);
		})
		$(document).mouseup(function(){
			$(document).off();
		})
		return false;
	},
	//设置歌曲滚动条的高度
	getHeight:function(){
		if (this.musicList.height() <= this.scroll.height()) {
			this.scrllTop.css('display','none');
		}else{
//			var h = this.scrT.height()*this.musicList.height()/this.scroll.height();
//			this.scrllTop.height(h);
			this.scrllTop.css('display','block');
		}
	},
	//搜索歌曲
	searchSong:function(val,num){
		var _this = this;
		$.ajax({
			url:"https://c.y.qq.com/soso/fcgi-bin/client_search_cp?qqmusic_ver=1298&remoteplace=txt.yqq.center&searchid=45910627775131910&t=0&aggr=1&cr=1&catZhida=1&lossless=0&flag_qc=0&g_tk=237712356&jsonpCallback=?&loginUin=252949842&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0",
			dataType:'jsonp',
			data:{
				w:val,
				p:num,
				n:7
			},
			success:function(data){
				$.each(data.data.song.list, function(index,ele) {
					_this.searchList.append($(`
						<li class="clear">
							<span class="song">${ele.songname.substring(0,17)}</span>
							<span class="singer">${ele.singer[0].name.substring(0,7)}</span>
							<span>${_this.changeTime(ele.interval)}</span>
						</li>
					`))
				});
				_this.searchList.find('li').off().click(function(){
					_this.song_lrc.html('暂无歌词');
					clearInterval(_this.timer);
					var songID = data.data.song.list[$(this).index()].songmid;
					var albummid = data.data.song.list[$(this).index()].albummid;
					var img = 'http://imgcache.qq.com/music/photo/mid_album_180/'+albummid.charAt(12)+'/'+albummid.charAt(13)+'/'+albummid+'.jpg';
					_this.audio.src = 'http://ws.stream.qqmusic.qq.com/C200'+songID+'.m4a?vkey='+songKey+'&guid=0&fromtag=30';
					_this.audio.load();
					_this.audio.play();
					_this.play_song.css('background','url(images/play_song.png)');
					_this.timer = setInterval(function(){
						_this.timing.html(_this.changeTime(_this.audio.currentTime));
						var scale = _this.audio.currentTime/_this.audio.duration;
						_this.song_drag.css('left',scale*(600 - _this.song_drag.width()));
					},1000);
					($(`
						<li class="clear">
							<span class="song">${$(this).find('span').eq(0).html()}</span>
							<span class="singer">${$(this).find('span').eq(1).html()}</span>
							<span>${$(this).find('span').eq(2).html()}</span>
						</li>
					`)).appendTo(_this.musicList).off().click(function(){
						_this.clickSong($(this));
					});
					_this.songSrc.push(_this.audio.src);
					_this.songLrc.push('');
					_this.getHeight();
					_this.p.find('img').attr('src',img);
					_this.p.find('span').eq(0).html(data.data.song.list[$(this).index()].songname.substring(0,8));
					_this.p.find('span').eq(1).html(data.data.song.list[$(this).index()].singer[0].name);
					_this.p.find('span').eq(2).html(data.data.song.list[$(this).index()].albumname.substring(0,7));
					_this.p2.find('span').eq(0).html(data.data.song.list[$(this).index()].songname);
					_this.p2.find('span').eq(1).html(data.data.song.list[$(this).index()].singer[0].name);
					_this.songImg.push({
						img:img,
						song:data.data.song.list[$(this).index()].songname.substring(0,8),
						name:data.data.song.list[$(this).index()].singer[0].name,
						zj:data.data.song.list[$(this).index()].albumname.substring(0,7)
					});
				})
				_this.getPage({
					now:_this.pageNum,
					all:Math.ceil(data.data.song.totalnum/7),
					parent:_this.page[0],
					len:5,
					callback:function(num){
						_this.pageNum = num;
						_this.searchSong(_this.searchTxt.val(),_this.pageNum);
					}
				});
			}
		});
	},
	//歌曲播放列表点击播放
	clickSong:function(that){
		var _this = this;
		this.lrcArr = '';
		this.audio.src = this.songSrc[that.index()];
		this.play_song.css('background','url(images/play_song.png)');
		this.audio.play();
		this.songNum = that.index();
		this.ajaxLrc(this.songNum);
		this.timer = setInterval(function(){
			if (_this.lrcArr != '') {
				var time = Math.ceil(audio.currentTime);
				$.each(_this.lrcArr, function(index,ele) {
					if (time == _this.lrcArr[index].time) {
						_this.song_lrc.html(_this.lrcArr[index].clause);
					}
				});
			} else{
				_this.song_lrc.html('暂无歌词');
			}
			_this.timing.html(_this.changeTime(_this.audio.currentTime));
			var scale = _this.audio.currentTime/_this.audio.duration;
			_this.song_drag.css('left',scale*(600 - _this.song_drag.width()));
		},1000);
		this.setStarr(that.index());
	},
	//音量拖拽
	ylTuo:function(ev){
		var _this = this;
		var disX = ev.pageX - this.ylScroll[0].offsetLeft;
		$(document).mousemove(function(ev){
			var L = ev.pageX - disX;
			var maxL = 100 - _this.ylScroll.width();
			if (L < 0) {
				L = 0;
			}
			if (L > maxL) {
				L = maxL;
			}
			_this.ylScroll.css('left',L);
			var scale = L/maxL;
			_this.audio.volume = scale;
		})
		$(document).mouseup(function(){
			$(document).off();
		})
		return false;
	},
	//搜索列表分页
	getPage:function(json){
		const _this = this;
		const now = json.now;
		const len = json.len;
		const all = json.all;
		const callback = json.callback;
		const mid = len%2?Math.ceil(len/2):(Math.ceil(len/2)+1);
		const parent = json.parent;
		parent.innerHTML = '';
		if(all < now || all < len){
			for(var i=1;i<=all;i++){
				var oA = document.createElement('a');
				oA.href = 'javascript:;';
				oA.innerHTML = i;
				if(i == now){
					oA.className = 'active';
				}
				parent.appendChild(oA);
			}
		}else{
			if(now <= mid){
				for(var i=1;i<=len;i++){
					var oA = document.createElement('a');
					oA.href = 'javascript:;';
					oA.innerHTML = i;
					if(i == now){
						oA.className = 'active';
					}
					parent.appendChild(oA);
				}
			}else{
				for(var i=1;i<=len;i++){
					var oA = document.createElement('a');
					oA.href = 'javascript:;';
					if(now > (all - mid + 1)){
						oA.innerHTML = (all - len + i);
						if(now == (all - len + i)){
							oA.className = 'active';
						}
					}else{
						oA.innerHTML = (now - mid + i);
						if(now == (now - mid + i)){
							oA.className = 'active';
						}
					}
					parent.appendChild(oA);
				}
			}
			
		}
		//分页点击;
		parent.onclick = function(ev){
			_this.searchList.html('');
			if(ev.target.tagName == 'A'){
				callback((ev.target.innerHTML)*1);
				_this.getPage({
					now:(ev.target.innerHTML)*1,
					all:all,
					len:len,
					parent:parent,
					callback:callback
				});
			}
		}
	},
	//设置图片，专辑
	setStarr:function(m){
		this.p2.find('span').eq(0).html(this.songImg[m].song);
		this.p2.find('span').eq(1).html(this.songImg[m].name);
		this.p.find('img').attr('src',this.songImg[m].img);
		this.p.find('span').eq(0).html(this.songImg[m].song);
		this.p.find('span').eq(1).html(this.songImg[m].name);
		this.p.find('span').eq(2).html(this.songImg[m].zj);
	},
	//播放完当前自动跳下一首
	autoNext:function(){
		var _this = this;
		this.lrcArr = '';
		this.songNum++;
		if (this.songNum > this.songSrc.length-1) {
			this.songNum = 0;
		}
		this.audio.src = this.songSrc[this.songNum];
		this.ajaxLrc(_this.songNum);
		this.audio.play();
		this.timer = setInterval(function(){
			if (_this.lrcArr != '') {
				var time = Math.ceil(audio.currentTime);
				$.each(_this.lrcArr, function(index,ele) {
					if (time == _this.lrcArr[index].time) {
						_this.song_lrc.html(_this.lrcArr[index].clause);
					}
				});
			} else{
				_this.song_lrc.html('暂无歌词');
			}
			_this.timing.html(_this.changeTime(_this.audio.currentTime));
			var scale = _this.audio.currentTime/_this.audio.duration;
			_this.song_drag.css('left',scale*(600 - _this.song_drag.width()));
		},1000);
		this.setStarr(this.songNum);
	}
}
var music = new Music();
music.init();
