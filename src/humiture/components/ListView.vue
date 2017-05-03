<template>
  <div class="ct">
    <!--<div class="scroller" :style="{width : 100 * datalist.length + 'px'}">-->
      <ul class="data-list" :style="{width : 100 * datalist.length + 'px'}">
        <li v-for="(item, index) in datalist" v-bind:class="{curr : index === datalist.length -1 }">
          <time class="i">{{item.time_stap | _time}}</time>
          <span class="i temperature">{{item.temp | _temp}}</span>
          <span class="i humidity">{{item.hum | _hum}}</span>
        </li>
      </ul>
    <!--</div>-->
  </div>
</template>

<style scoped>
  /*.ct{width : 100%; overflow: hidden;white-space: nowrap; }*/
  .ct{width : 100%; overflow-x:auto;white-space: nowrap; overflow-scrolling : touch;}
  ul.data-list{list-style: none; padding:0;width:100%;}
  ul.data-list li{display: inline-block; width : 150px;}
  ul.data-list li.curr{color : #20BCDE;}
  ul.data-list li .i{display: block;height: 1.8em;}
  ul.data-list li .temperature,ul.data-list li .humidity{font-size:30px;}
</style>

<script>
  import { time_format } from '../utils';
  export default {
    name: 'list-view',
    data (){
      return {
        datalist : []
      }
    },
    filters :{
      _time (val){
        return time_format(val, 'hh:mm');
      },
      _temp  (val){
        return val ? ((val/100).toFixed(1) + '°C') : '-'
      },
      _hum (val){
        return val ? ((val/100).toFixed(1) + '%') : '-'
      }
    },
    mounted (){
      //滚动到最左边。
      console.log(this.$el, this.$el.scrollLeft);
      this.$el.scrollLeft = 5000;

//      console.log(this.$refs.container.clientWidth, this.$refs.container.clientHeight);
      get_formated_temp_and_hum(new Date(), list => {
        console.log(list);
        this.datalist = list;
      });

//      get_formated_temp_and_hum().then(list=>{
//        list.unshift(['', '温度', '湿度']);
//        console.log(list);
//        this.datalist = list;
//      });
    }
  }

  /**
   * 获取当前时间往前24小时的整点的温湿度值
   * TODO:这个helper函数不应该放在这里，后面优化。
   */
  function get_formated_temp_and_hum (d = new Date(), fn){
    let year = d.getFullYear(),
      month = d.getMonth(),
      date = d.getDate(),
      hour = d.getHours();

    let starter = new Date(year, month, date, hour);

    let promise_list = [],
      i = 0;
    while(i < 24){
      //      promise_litst.push(g(i++));
      let time = (starter - (i++) * 3600 * 1000);
      promise_list.push(get_value(time));
    }

    Promise.all(promise_list).then(list=>{
//      console.warn(list);
      fn(list.sort((a, b)=>{
        return a.time_stap > b.time_stap ? 1 : -1;
      }));
    });
//    return Promise.all(promise_list);


//         // Promise.resolve([
//         //   ['10:00', 21.5, 49], ['11:00',23, 49], ['12:00', 21, 49], ['13:00', 21, 49], ['14:00',21, 49],['15:00',21, 49],
//         //   ['16:00', 21.5, 49], ['17:00',23, 49], ['18:00', 21, 49], ['19:00', 21, 49], ['20:00',21, 49],['21:00',null, null],
//         //   ['22:00', 21.5, 49], ['23:00',23, 49], ['00:00', 21, 49], ['01:00', 21, 49], ['02:00',21, 49],['03:00',21, 49, true],
//         //   ['04:00', 21.5, 49], ['05:00',23, 49], ['06:00', 21, 49], ['07:00', 21, 49], ['08:00',21, 49],['09:00',21, 49]
//         // ]);
//
//    function g(n){
//      return get_value( starter - n * 3600 * 1000 ).then((obj)=>{
//        timeout(n * 100).then(()=>{
//          Promise.resolve(obj);
//        });
//      });
//    }
    function get_value(time){ //
      let get_single_data = direction => {
//        console.log('get_single_data============', new Date(time).toLocaleTimeString());
        let params = {
          items_per_page : 1,
          start_time : +time,
          direction : direction
        };
        return new Promise((resolve)=>{
          HdSmart.Device.getDeviceLog(params, str=>{
            let json = JSON.parse(str);
//             console.log('data::', json);
            if(json.code == 200){
              let res = null,
                log = json.result.log[0];
              if(log){
                res = {
                  time : log.time,
                  hum : log.attr.humidity,
                  temp : log.attr.temperature,
                  //基准线，如5点整
                  time_stap : time
                }
              }else{
                res = { time_stap : time };
              }
              resolve(res);
            }else{
              resolve({ time_stap : time });
            }
          });

          //超时处理
          setTimeout(()=>{
            resolve({ time_stap : time });
          }, 2000);
        });
      };

      //虽然两次取值的行为本来可以并行，但是客户端接口问题，只能并行
      return new Promise(resolve => {
        get_single_data('down').then(down=>{
//          console.log(`down(${new Date(time).toLocaleTimeString()}):`,down )
          resolve(down);
//          get_single_data('up').then(up=>{
//            console.info('★★★ up & down:',new Date(time), up, down);
//            //如果前后两个点的时间超过1小时，那么认为当前值无效。
//            if(Math.abs(up.time - down.time) > 60 * 60 * 1000){
//              console.error('间隔时间超过1小时，无效。');
//              resolve({});
//            }
//            let integer_timer = up.time_stap,
//              ratio_hum = (up.hum - down.hum)/(up.time - down.time),
//              hum = up.hum + (integer_timer - up.time) * ratio_hum,
//              ratio_temp = (up.temp - down.temp)/(up.time - down.time),
//              temp = up.temp + (integer_timer - up.time) * ratio_temp;
//
//            resolve({ hum : hum, temp : temp });
//          });
        }).catch(e=>{
          console.error(e);
          resolve({ time_stap : time });
        });
      });
    }
  }

</script>


