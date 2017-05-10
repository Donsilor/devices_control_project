<template>
  <div class="ct" ref="list_ct" v-show="data_loaded">
    <div ref="list_scroller" :style="{width : 100 * datalist.length + 'px'}">
      <ul class="data-list" :style="{width : 100 * datalist.length + 'px'}">
        <li v-for="(item, index) in datalist">
          <time class="i time">{{item.time_stap | _time}}</time>
          <span class="i temperature">{{item.temp | _temp}}</span>
          <span class="i humidity">{{item.hum | _hum}}</span>
        </li>
        <li class="curr">
          <time class="i time">现在</time>
          <span class="i temperature">{{temp | _temp}}</span>
          <span class="i humidity">{{hum | _hum}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
  .ct{width :1680px ;overflow: hidden; white-space: nowrap;}
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
  }
  ul.data-list li .time{
    font-size:24px;
    line-height:24px;
    /*margin : 24px 48px 42px 48px;*/
    margin : 24px 0 42px 0;
  }
  ul.data-list li .temperature,ul.data-list li .humidity{font-size:30px;margin:24px 0 ;}
</style>

<script>
  import { $time_format, $timeout } from '../utils';
//  import { AlloyTouch } from 'alloytouch';
//  console.log('AlloyTouch:', AlloyTouch);

  import IScroll from 'iscroll/build/iscroll-lite';

  let d = new Date(),
    year = d.getFullYear(),
    month = d.getMonth(),
    date = d.getDate(),
    hour = d.getHours(),
    //当前时间往回去的最近一个整点时间
    last_hour = +new Date(year, month, date, hour),
    //当前时间往回去的最近一个自然日的0点时刻。
    last_date = +new Date(year, month, date)

  export default {
    name: 'list-view',
    props : {
      'temp' : Number,
      'hum' : Number,
      'is_current' : Boolean
//      'page' : String
    },
    data (){
      return {
        datalist : [],
        scroller : null,
        data_loaded : false,
//        last_date : 0
      }
    },
    filters :{
      _time (val){
        if(typeof val === "number"){
          return (val < last_date ? '昨天 ' : '') + $time_format(val, 'hh:mm');
        }else{
          return val;
        }
      },
      _temp  (val){
        return val ? ((val/100).toFixed(1) + '°C') : '-'
      },
      _hum (val){
        return val ? ((val/100).toFixed(1) + '%') : '-'
      }
    },
    watch : {
      is_current (val){
        //当切换到详情页，如果scroller还没有初始化，立即初始化。
        val && (!this.scroller) && this.init_scroller();
      }
    },
    methods : {
      init_scroller (){
        $timeout(200).then(()=>{
          let wp = this.$refs.list_ct;


//          //给element注入transform属性
//          Transform(target,true);
//          new AlloyTouch({
//            touch:wp,//反馈触摸的dom
//            vertical: false,//不必需，默认是true代表监听竖直方向touch
//            target: this.$refs.list_scroller, //运动的对象
//            property: "translateX",  //被运动的属性
////            min: 100, //不必需,运动属性的最小值
////            max: 2000, //不必需,滚动属性的最大值
////            sensitivity: 1,//不必需,触摸区域的灵敏度，默认值为1，可以为负数
////            factor: 1,//不必需,表示触摸位移与被运动属性映射关系，默认值是1
//            step: 45,//用于校正到step的整数倍
//            bindSelf: false,
//            initialValue: 0
//          });
          this.scroller = new IScroll(wp, {
            scrollX : true,
            scrollY : false,
            //TODO:这里需要再看看，为什么差值为1280，而实际上需要1380才对。
            startX : -1380,//wp.clientWidth - wp.firstElementChild.clientWidth,
          });

        });
      }
    },
    mounted (){
      HdSmart.Device.getDeviceLogByDay( last_hour, data=> {
        this.data_loaded = true;
        let list = data.result.log.map((item, i) => {
          let attr = item.attr;
          return {
            time: item.time,
            hum: attr.humidity,
            temp: attr.temperature,
            //基准线，如5点整
            time_stap: last_hour - i * 3600 * 1000
          }
        });
        this.datalist = list.reverse();
      });
    }
  }

</script>


