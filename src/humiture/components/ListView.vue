<template>
  <div class="ct" ref="listct">
    <div :style="{width : 100 * datalist.length + 'px'}">
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
  import { $time_format, $timeout } from '../utils';
  import IScroll from 'iscroll/build/iscroll-lite';

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
        scroller : null
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
    watch : {
      is_current (val){
        //当切换到详情页，如果scroller还没有初始化，立即初始化。
        val && (!this.scroller) && this.init_scroller();
      }
    },
    methods : {
      init_scroller (){
        $timeout(200).then(()=>{
          let wp = this.$refs.listct;
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
      let d = new Date(),
        year = d.getFullYear(),
        month = d.getMonth(),
        date = d.getDate(),
        hour = d.getHours(),
        starter = +new Date(year, month, date, hour);

      HdSmart.Device.getDeviceLogByDay( starter, data=> {
//        console.info(JSON.stringify(data, null, 2));
        let list = data.result.log.map((item, i) => {
          let attr = item.attr;
          return {
            time: item.time,
            hum: attr.humidity,
            temp: attr.temperature,
            //基准线，如5点整
            time_stap: starter - i * 3600 * 1000
          }
        });
        this.datalist = list.reverse();
      });
    }
  }

</script>


