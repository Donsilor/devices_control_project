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

/**
 * 获取当前时间往前24小时的整点的温湿度值
 * TODO:这个helper函数不应该放在这里，后面优化。
 */
let get_formated_temp_and_hum = (d = new Date())=>{
  let year = d.getFullYear(),
    month = d.getMonth(),
    date = d.getDate(),
    hour = d.getHours();

  let starter = new Date(year, month, date, hour);

  let promise_litst = [],
    i = 0;
  while(i < 24){
    promise_litst.push(g(i++));
  }

  return Promise.all(promise_litst);

  //TODO:再优化
  // return g(0).then(g(1)).then(g(2)).then(g(3)).then(g(4)).then(g(5)).then(g(6)).then(g(7))
  //   .then(g(8)).then(g(9)).then(g(10)).then(g(11)).then(g(12)).then(g(13)).then(g(14)).then(g(15))
  //   .then(g(16)).then(g(17)).then(g(18)).then(g(19)).then(g(20)).then(g(21)).then(g(22)).then(g(23)).then(()=>{
  //     console.log(";;;;;;;;;", arguments);
  //     // Promise.resolve([
  //     //   ['10:00', 21.5, 49], ['11:00',23, 49], ['12:00', 21, 49], ['13:00', 21, 49], ['14:00',21, 49],['15:00',21, 49],
  //     //   ['16:00', 21.5, 49], ['17:00',23, 49], ['18:00', 21, 49], ['19:00', 21, 49], ['20:00',21, 49],['21:00',null, null],
  //     //   ['22:00', 21.5, 49], ['23:00',23, 49], ['00:00', 21, 49], ['01:00', 21, 49], ['02:00',21, 49],['03:00',21, 49, true],
  //     //   ['04:00', 21.5, 49], ['05:00',23, 49], ['06:00', 21, 49], ['07:00', 21, 49], ['08:00',21, 49],['09:00',21, 49]
  //     // ]);
  //   });
  function g(n){
    get_value( starter - n * 3600 * 1000 ).then((obj)=>{
      timeout(n * 100).then(()=>{
        Promise.resolve(obj);
      });
    });
  }
  function get_value(time){ //
    let get_single_data = direction => {

      let params = {
        items_per_page : 1,
        start_time : +time,
        direction : direction
      };
      return new Promise((resolve)=>{
        HdSmart.Device.getDeviceLog(params, str=>{
          let json = JSON.parse(str);
          // console.log('data::', json);
          if(json.code == 200){
            let log = json.result.log[0],
              res = log ? {
                time : log.time,
                hum : log.attr.humidity,
                temp : log.attr.temperature,
                //基准线，如5点整
                time_stap : params.start_time
              } : {};
            resolve(res);
          }else{
            resolve({});
          }
        });
      });
    };

    //虽然两次取值的行为本来可以并行，但是客户端接口问题，只能并行
    return new Promise(resolve => {
      get_single_data('down').then(down=>{
        get_single_data('up').then(up=>{
          console.info('★★★ up & down:',new Date(time), up, down);
          //如果前后两个点的时间超过1小时，那么认为当前值无效。
          if(Math.abs(up.time - down.time) > 60 * 60 * 1000){
            console.error('间隔时间超过1小时，无效。');
            resolve({});
          }
          let integer_timer = up.time_stap,
            ratio_hum = (up.hum - down.hum)/(up.time - down.time),
            hum = up.hum + (integer_timer - up.time) * ratio_hum,
            ratio_temp = (up.temp - down.temp)/(up.time - down.time),
            temp = up.temp + (integer_timer - up.time) * ratio_temp;

          resolve({ hum : hum, temp : temp });
        });
      }).catch(e=>{
        console.error(e);
        resolve({});
      });
    });
    // return Promise.all([get_single_data('up'), get_single_data('down')]);
  }
}

export { interval, timeout, time_format, tap, get_formated_temp_and_hum };
