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

<template>
  <div id="app">
    <index-page class="page" :temp="temp" :humidity="humidity"
                v-if="page_name === 'index'" v-on:jump2detail="to_detail">
    </index-page>

    <detail-page class="page" :temp="temp" :humidity="humidity"
                 v-if="page_name === 'detail'" v-on:return2index="to_index">
    </detail-page>
  </div>
</template>

<script>

  import status from './config/status-desc';
  import {timeout} from './utils';
  console.info(1);
  export default {
    data (){
      return {
        page_name : '',
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
      }
    },
    watch : {
      page_name (val){
        if(val === 'detail'){
          HdSmart.UI.toggleHeadAndFoot(false);
        }else{
          timeout(100).then(()=>{
            HdSmart.UI.toggleHeadAndFoot(true);
          });
        }
      }
    },
    mounted (){
      console.info(2);
      this.page_name = 'index';
      HdSmart.Device.getSnapShot(data => {

        let attr = data.attr,
          temp = (attr.temperature/100).toFixed(1) - 0,
          humidity = (attr.humidity/100).toFixed(1) - 0;

        //边界修正
        let t_min = status[0].temp_range[0],
          t_max = status[2].temp_range[1],
          h_min = 0,
          h_max = 100;

        (temp < t_min) && (temp = t_min);
        (temp > t_max) && (temp = t_max);
        (humidity < h_min) && (humidity = h_min);
        (humidity > h_max) && (humidity = h_max);

        console.log(temp, humidity,'调整后的值');
        this.temp = temp;
        this.humidity = humidity;
      });
    }
  }
</script>

