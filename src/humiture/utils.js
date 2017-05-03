/**
 * Created by 041908110 on 2017/4/25.
 */

//TODO:hack一个Array#find的问题，后面再优化
if(typeof Array.prototype.find !== 'function'){
  Array.prototype.find = function(iterator){
    for(let i=0,l=this.length; i < l; i++){
      let item = this[i];
      if(iterator(item, i) === true){
        return item;
      }
    }
    return null;
  }
}

/**
 * setTimeout的Promise写法
 * setTimeout(fn, 5000); => timeout(5000).then(fn);
 */
let timeout = function (delay){
  return new Promise(resolve=>{
    setTimeout(()=>{
      resolve();
    }, delay);
  });
};

let interval = function(duration){
  return new Promise(resolve=>{
    setInterval(()=>{
      resolve();
    }, duration);
  });
};

/**
 * 格式化时间
 * @param date {Date}
 */
let time_format = function (date = new Date, formater){
  if(typeof date === 'number'){
    date = new Date(date);
  }
  if(!+date){
    return console.error('参数不合法');
  }
  var _date_format = /(Y{2,4})|(M{1,2})|(D{1,2})|(h{1,2})|(m{1,2})|(s{1,2})/g;
  return formater.replace(_date_format, function(self, Y, M, D, h, m, s){
    var txt;
    switch(true){
      case !!Y :
        txt = date.getFullYear().toString();
        return txt.substr(txt.length - Y.length);
      case !!M :
        txt = "0" + (date.getMonth() + 1);
        return txt.substr(txt.length - M.length);
      case !!D :
        txt = "0" + date.getDate();
        return txt.substr(txt.length - D.length);
      case !!h :
        txt = "0" + date.getHours();
        return txt.substr(txt.length - h.length);
      case !!m :
        txt = "0" + date.getMinutes();
        return txt.substr(txt.length - m.length);
      case !!s :
        txt = "0" + date.getSeconds();
        return txt.substr(txt.length - s.length);
      default : return "";
    }
  });
}

/**
 * 简易的tap事件
 */
let tap = function(el, fn){
  let moved = null,
    _start = () => { moved = false; },
    _move = () => { moved = true; },
    _end = event => {
      if(!moved){
        fn.call(el, event);
      }
      moved = false;
  };

  el.addEventListener('touchstart', _start, false);
  el.addEventListener('touchmove',  _move,  false);
  el.addEventListener('touchend',   _end,   false);
  el.addEventListener('touchcancel',_end,   false);
};

export { interval, timeout, time_format, tap };
