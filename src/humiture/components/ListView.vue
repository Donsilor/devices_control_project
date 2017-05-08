<template>
  <div class="ct">
    <!--<div class="scroller" :style="{width : 100 * datalist.length + 'px'}">-->
      <ul class="data-list" :style="{width : 100 * datalist.length + 'px'}">
        <li v-for="(item, index) in datalist" v-bind:class="{curr : index === datalist.length -1 }">
          <time class="i time">{{item.time_stap | _time}}</time>
          <span class="i temperature">{{item.temp | _temp}}</span>
          <span class="i humidity">{{item.hum | _hum}}</span>
        </li>
      </ul>
    <!--</div>-->
  </div>
</template>

<style scoped>
  /*.ct{width : 100%; overflow: hidden;white-space: nowrap; }*/
  .ct{width :1680px ; overflow-x:auto;white-space: nowrap; -webkit-overflow-scrolling: touch;}
  ul.data-list{list-style: none; padding:0;width:100%;margin:0;}
  ul.data-list li{display: inline-block; width : 150px;color:#808080;}
  ul.data-list li.curr{color : #20BCDE;}
  ul.data-list li .i{
    font-family:Roboto-Regular;
    font-size:30px;
    letter-spacing:0;
    line-height:30px;
    text-align:center;
    display: block;
    /*height: 1.8em;color:#808080;*/
  }
  ul.data-list li .time{
    font-size:24px;
    line-height:24px;
    margin : 24px 48px 42px 48px;
  }
  ul.data-list li .temperature,ul.data-list li .humidity{font-size:30px;margin:24px 0 ;}
</style>

<script>
  import { $time_format } from '../utils';
  export default {
    name: 'list-view',
    data (){
      return {
        datalist : []
      }
    },
    filters :{
      _time (val){
        return typeof val === "number" ?
          $time_format(val, 'hh:mm') : val;
      },
      _temp  (val){
        return val ? ((val/100).toFixed(1) + '°C') : '-'
      },
      _hum (val){
        return val ? ((val/100).toFixed(1) + '%') : '-'
      }
    },
    mounted (){
      get_formated_temp_and_hum(new Date()).then(list=>{
        this.datalist = list;
        //滚动到最左边。
        this.$nextTick(()=>{
          this.$el.scrollLeft = 5000;
        });
      });
//      get_formated_temp_and_hum(new Date(), list => {
////        console.log(list);
//        this.datalist = list;
//        //滚动到最左边。
//        this.$nextTick(()=>{
////          console.log(this.$el, this.$el.scrollLeft);
//          this.$el.scrollLeft = 5000;
//        });
//      });
    }
  }

  /**
   * 获取当前时间往前24小时的整点的温湿度值
   */
  function get_formated_temp_and_hum (d = new Date(), fn){
    let year = d.getFullYear(),
      month = d.getMonth(),
      date = d.getDate(),
      hour = d.getHours(),
      now = +d,
      starter = +new Date(year, month, date, hour);

    return Promise.all(
      [get_now_status(now), get_history_status(starter)]
    ).then(data=>{
      let now = data[0],
        history = data[1];
      history.push(now);
      console.log('=========977897896', history);
      return history;
    });

    //获取历史24小时的准点log
    function get_history_status(time){
      return new Promise((resolve, reject)=>{
        HdSmart.Device.getDeviceLogByDay( time, data=>{
          let list = data.result.log.map((item, i)=>{
            let attr = item.attr;
            return {
              time : item.time,
              hum : attr.humidity,
              temp : attr.temperature,
              //基准线，如5点整
              time_stap : starter - i * 3600 * 1000
            }
          });
          resolve(list.reverse());
        }, err=>{
          reject(err);
        });
      });
    }

    //获取当前时间往前的一个log
    function get_now_status (time){
      return new Promise((resolve, reject)=>{
        HdSmart.Device.getDeviceLog({
          start_time : time,
          items_per_page:1,
          direction : 'down'
        },data=>{
          let attr = data.log.attr;
          resolve({
            time : time,
            hum : attr.humidity,
            temp : attr.temperature,
            //基准线，如5点整
            time_stap : '现在'
          });
        }, err=>{
          reject(err);
        });
      });
    }

//    function get_value(time){
//      let get_single_data = direction => {
////        console.log('get_single_data============', new Date(time).toLocaleTimeString());
//        let params = {
//          items_per_page : 1,
//          start_time : +time,
//          direction : direction
//        };
//        return new Promise((resolve)=>{
//          HdSmart.Device.getDeviceLog(params, str=>{
//            let json = JSON.parse(str);
////             console.log('data::', json);
//            if(json.code == 200){
//              let res = null,
//                log = json.result.log[0];
//              if(log){
//                res = {
//                  time : log.time,
//                  hum : log.attr.humidity,
//                  temp : log.attr.temperature,
//                  //基准线，如5点整
//                  time_stap : time
//                }
//              }else{
//                res = { time_stap : time };
//              }
//              resolve(res);
//            }else{
//              resolve({ time_stap : time });
//            }
//          });
//
//          //超时处理
//          setTimeout(()=>{
//            resolve({ time_stap : time });
//          }, 2000);
//        });
//      };
//
//      //虽然两次取值的行为本来可以并行，但是客户端接口问题，只能并行
//      return new Promise(resolve => {
//        get_single_data('down').then(down=>{
////          console.log(`down(${new Date(time).toLocaleTimeString()}):`,down )
//          resolve(down);
////          get_single_data('up').then(up=>{
////            console.info('★★★ up & down:',new Date(time), up, down);
////            //如果前后两个点的时间超过1小时，那么认为当前值无效。
////            if(Math.abs(up.time - down.time) > 60 * 60 * 1000){
////              console.error('间隔时间超过1小时，无效。');
////              resolve({});
////            }
////            let integer_timer = up.time_stap,
////              ratio_hum = (up.hum - down.hum)/(up.time - down.time),
////              hum = up.hum + (integer_timer - up.time) * ratio_hum,
////              ratio_temp = (up.temp - down.temp)/(up.time - down.time),
////              temp = up.temp + (integer_timer - up.time) * ratio_temp;
////
////            resolve({ hum : hum, temp : temp });
////          });
//        }).catch(e=>{
//          console.error(e);
//          resolve({ time_stap : time });
//        });
//      });
//    }
  }



</script>


