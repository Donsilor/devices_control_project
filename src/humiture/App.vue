<template>
  <div id="app">
    <index-page class="page" :temp="temp" :humidity="humidity" :page="page_name"
                v-show="page_name === 'index'" @jump2detail="to_detail" @set_h="set_humidity" @set_t="set_temp">
    </index-page>

    <detail-page class="page" :temp="temp" :humidity="humidity" :page="page_name"
                 v-show="page_name === 'detail'" @return2index="to_index">
    </detail-page>
  </div>
</template>

<style>
  html, body{
    padding: 0;
    margin : 0;
    width : 100%;
    height : 100%;
    font-size: 20px;
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  *{
    box-sizing: border-box;
  }
  #app {
    height:100%;
  }
  #app .page{
    width : 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
</style>

<script>
  import status_desc from './config/status-desc';
  import { $timeout } from './utils';
  export default {
    data (){
      return {
        page_name : 'index',
        temp : 0,
        humidity : 0
      }
    },
    methods : {
      to_detail (){
        this.page_name = 'detail';
      },
      to_index (){
        this.page_name = 'index';
      },
      set_temp (t){
          this.set_value({t : t});
      },
      set_humidity (h){
          this.set_value({h : h});
      },
      set_value (options){
        let temp = this.temp,
          humidity = this.humidity;
        if(options.t){
          temp = (options.t/100).toFixed(1) - 0;
        }
        if(options.h){
          humidity = (options.h/100).toFixed(1) - 0;
        }

        // 边界修正
        let t_min = status_desc[0].temp_range[0],
          t_max = status_desc[2].temp_range[1],
          h_min = 0,
          h_max = 100;

        (temp < t_min) && (temp = t_min);
        (temp > t_max) && (temp = t_max);
        (humidity < h_min) && (humidity = h_min);
        (humidity > h_max) && (humidity = h_max);

        this.temp = temp;
        this.humidity = humidity;
        console.info("temp and hum:",temp, humidity);
      }
    },
    watch : {
      page_name (val){
        if(val === 'detail'){
          HdSmart.UI.toggleHeadAndFoot(false);
        }else{
          $timeout(100).then(()=>{
            HdSmart.UI.toggleHeadAndFoot(true);
          });
        }
      }
    },
    mounted (){
      console.log('start to get data:');
      HdSmart.Device.getSnapShot( data =>{
        HdSmart.UI.hideLoading();
        let attr = data.attr;
        console.log('first data:', attr);
        this.set_value({
          h : attr.humidity,
          t : attr.temperature
        });
      });
    }
  }
</script>

