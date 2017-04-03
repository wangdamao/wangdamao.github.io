
function ajax(json) {
  var ajax = new XMLHttpRequest();
  var settings = {
    url: json.url || '',
    data: json.data || {},
    method: json.method || 'get',
    dataType: json.dataType || 'json',
    success: json.success || function () {
    },
    fail: json.fail || function () {
    }
  };
  var arr = [];
  for (var attr in settings.data) {
    arr.push(attr + '=' + settings.data[attr]);
  }

  settings.data = arr.join('&');

  switch (settings.method.toLowerCase()) {
    case 'get':
      ajax.open(settings.method, settings.url + '?' + settings.data);
      ajax.send();
      break;
    case 'post':
      ajax.open(settings.method, settings.url);
      ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      ajax.send(settings.data);
      break;
    default:
      ajax.open('get', settings.url + '?' + settings.data);
      ajax.send();
      break;
  }

  ajax.onreadystatechange = function () {
    if (ajax.readyState === 4) {
      if (ajax.status >= 200 && ajax.status <= 207) {
        switch (settings.dataType) {
          case 'json':
            settings.success(JSON.parse(ajax.responseText));
            break;
          case 'xml':
            settings.success(ajax.responseXML);
            break;
          case 'str':
            settings.success(ajax.responseText);
            break;
        }
      } else {
        settings.fail(ajax.status);
      }
    }
  }
}

var mt = mt || {};

mt = {    // mt.$()
  /**
   @description: 获取样式封装
   @augments:   {obj}    需要获取元素的选择器  #box .qwe tag
   @augments:   {obj}  获取obj下的元素  默认为document
   */
  $: function (name, obj) {
    obj = obj || document;
    if (name.charAt(0) == '.') {
      var arr = [];
      var eles = obj.getElementsByTagName('*');
      for (var i = 0; i < eles.length; i++) {
        var s = eles[i].className.split(' ');
        for (var j = 0; j < s.length; j++) {
          if (s[j] == name.slice(1)) {
            arr.push(eles[i]);
          }
        }
        // if (eles[i].className.indexOf(name.slice(1)) != -1) {
        //     arr.push(eles[i]);
        // }
      }
      return arr;
      //return obj.getElementsByClassName(name.slice(1)); 兼容性有问题 最好获取tagName做处理
    }
    else if (name.charAt(0) == '#') {
      return obj.getElementById(name.slice(1));
    }
    else {
      return obj.getElementsByTagName(name);
    }
  },
  /**
   @description: 添加类名 classList
   @augments:    {obj}    需要修改的对象
   {str}  需要添加的类名

   */
  addCN: function (obj, cName) {
    if (!obj.className) {
      obj.className = cName;
    } else {
      for (var i = 0; i < obj.className.split(' ').length; i++) {
        if (obj.className.split(' ')[i] == cName) {
          return;
        }
      }
      obj.className += ' ' + cName;
    }
    return true;
  },
  /**
   @description: 删除类名
   @augments:    {obj}        需要修改的对象
   {str}    需要删除的类名

   */
  removeCN: function (obj, cName) {
    if (!obj.className) {
      obj.className = cName;
    } else {
      for (var i = 0; i < obj.className.split(' ').length; i++) {
        if (obj.className.split(' ')[i] == cName) {
          return;
        }
      }
      obj.className += ' ' + cName;
    }
    return true;
  },
  /**
   @description: 拖拽
   @augments:    {obj} 需要拖拽的对象
   */
  drag: function (obj) {
    obj.onmousedown = function (ev) {
      obj.style.transition = '';//test
      var ev = ev || event;
      ev.preventDefault();
      var reL = ev.pageX - obj.getBoundingClientRect().left;
      var reT = ev.pageY - obj.getBoundingClientRect().top;
      var disL = obj.offsetParent.getBoundingClientRect().left;
      var disT = obj.offsetParent.getBoundingClientRect().top;
      document.onmousemove = function (ev) {
        var ev = ev || event;
        obj.style.left = ev.pageX - disL - reL + 'px';
        obj.style.top = ev.pageY - disT - reT + 'px';
      };
      document.onmouseup = function () {
        document.onmousemove = document.onmouseup = null;
      };
    };
  },
  /**
   @description: 碰撞检测
   @augments:    {obj} 拖动元素
   {obj} 被碰撞元素
   */
  collisionDetection: function (obj1, obj2) {
    var pos1 = obj1.getBoundingClientRect();
    var pos2 = obj2.getBoundingClientRect();
    return pos1.right < pos2.left || pos1.bottom < pos2.top || pos1.left > pos2.right || pos1.top > pos2.bottom ? false : true;
  },
  mouseCollisionDetection: function (mouseEvent, obj) {
    var pos = obj.getBoundingClientRect();
    return mouseEvent.clientX > pos.left && mouseEvent.clientX < pos.left + pos.width && mouseEvent.clientY < pos.top + pos.height && mouseEvent.clientY > pos.top;
  },
  /**
   @description: 鼠标滚轮事件
   @augments:    {obj}绑定鼠标滚轮事件的对象;
   {function} upFn, 向上滚动事件;
   {function} downFn, 向下滚动事件；
   */
  mouseWheel: function (obj, upFn, downFn) {
    if (obj.length) {
      obj.forEach(function (item) {
        item.onmousewheel = fn;
        item.addEventListener('DOMMouseScroll', fn);
      })
    }
    else {
      obj.onmousewheel = fn;
      obj.addEventListener('DOMMouseScroll', fn);
    }
    function fn(ev) {
      var isDown = null;
      if (ev.wheelDelta) {//chrome/IE
        isDown = ev.wheelDelta > 0 ? false : true;
      }
      else {//Firefox
        isDown = ev.detail > 0 ? true : false;
      }
      if (isDown) {//向下
        if (typeof downFn === "function") {
          downFn && downFn();
        }
      }
      else {//向上
        if (typeof upFn === "function") {
          upFn && upFn();
        }
      }
      ev.preventDefault();
    }
  },
  /**
   * @description: 抖动函数
   * @augments:    {obj} 需要抖动的元素
   *                {obj} 抖动属性值
   *                {function} 回调函数
   * */
  shake: function (obj, attr, endFn) {
    var arr = [];
    var timer = null;
    var n = 0;
    if (!obj.num) {
      obj.num = parseFloat(getComputedStyle(obj)[attr]);
    }
    //拿到一组数字，抖动的幅度。
    for (var i = 20; i > 0; i -= 2) {
      arr.push(i, -i);
    }
    arr.push(0);
    //用定时器来实现抖动效果。
    clearInterval(timer);
    timer = setInterval(function () {
      n++;
      if (n > arr.length - 1) {
        clearInterval(timer);
        endFn && endFn();
      }
      obj.style[attr] = arr[n] + obj.num + 'px';
    }, 30);
  },
  /**
   * @description: 设置cookie
   */
  setCookie: function (name, value, day) {
    if (day) {
      var exp = new Date();
      exp.setTime(exp.getTime() + day * 24 * 60 * 60 * 1000);
      document.cookie = name + "=" + value + ";expires=" + exp.toGMTString();
    } else {
      document.cookie = name + "=" + value;
    }
  },
  /**
   * @description: 获取cookie
   */
  getCookie: function (name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
      return arr[2];
    else
      return null;
  },
  /**
   * @description: 格式化时间
   * @example: formatDate(12353453, 'yyyy-MM-dd hh:mm:ss')
   * @return:  2017-03-12 23:00:00
   * */
  formatDate: function (date, fmt) {
    function padLeftZero(str) {
      return ('00' + str).substr(str.length);
    }

    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    };
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + '';
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
      }
    }
    return fmt;
  }
};
function getAnimationend() {
  let div = document.createElement('div'),
    style = div.style,
    animationNames = ['animation', 'WebkitAnimation', 'OAnimation', 'msAnimation', 'MozAnimation'],
    animationName = (() => {
      for (let key of animationNames) {
        if (style[key] !== undefined) return key;
      }
      return false;
    })(),
    aniEndName = {
      animation: 'animationend',
      WebkitAnimation: 'webkitAnimationEnd',
      OAnimation: 'oAnimationEnd',
      msAnimation: 'MSAnimationEnd',
      MozAnimation: 'mozAnimationEnd'
    }[animationName];
  div = style = animationNames = animationName = null;
  return aniEndName;
}
function getTransitionend() {
  let div = document.createElement('div'),
    style = div.style,
    transitionNames = ['transition', 'WebkitTransition', 'OTransition', 'msTransition', 'MozTransition'],
    transitionName = (() => {
      for (let key of transitionNames) {
        if (style[key] !== undefined) return key;
      }
      return false;
    })(),
    traEndName = {
      transition: 'transitionend',
      WebkitTransition: 'webkitTransitionEnd',
      OTransition: 'oTransitionEnd',
      msTransition: 'MSTransitionEnd',
      MozTransition: 'mozTransitionEnd'
    }[transitionName];
  div = style = transitionNames = transitionName = null;
  return traEndName;
}

