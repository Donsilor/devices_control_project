<template>
  <div id="app"><!-- v-show="loaded" -->
    <index-page class="page" :temp="temp" :humidity="humidity"
                v-show="data_loaded && page_name === 'index'" @jump2detail="to_detail">
    </index-page>

    <detail-page class="page" :temp="temp" :humidity="humidity" :page="page_name"
                 v-if="detail_init" v-show="page_name === 'detail'" @return2index="to_index">
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
  import { $timeout } from './utils';

  const STORAGE_KEY = 'humiture';

  //保存全局的温湿度
  let temp = 0,
    hum = 0;

  //获取初始温湿度
  let val = (localStorage.getItem(STORAGE_KEY)||"").split('|'),
    t = +val[0],
    h = +val[1];
  !isNaN(t) && (temp = t);
  !isNaN(h) && (hum = h);

  export default {
    data (){
      return {
        page_name : 'index',
        //原始温湿度值
        temp : temp,
        humidity : hum,
        //首页是否加载成功
        data_loaded : false,
        //详情页是否加载成功
        detail_init : false,
      }
    },
    methods : {
      to_detail (){
        this.page_name = 'detail';
        this.detail_init = true;
      },
      to_index (){
        this.page_name = 'index';
      },

      /**
       * 刷新当前温湿度，场景有首次加载、手动下拉、push消息等。
       * @param options {Object} 参数 {t, h}
       */
      set_value (options){
        let t = options.t || this.temp,
          h = options.h || this.humidity;

        // 边界修正
        let t_min = -2000,
          t_max = 6000,
          h_min = 0,
          h_max = 10000;

        if(t < t_min) {
          t = t_min;
        }
        if(t > t_max){
          t = t_max;
        }
        if(h < h_min) {
          h = h_min;
        }
        if(h > h_max){
          h = h_max;
        }

        this.temp = t;
        this.humidity = h;
        localStorage.setItem(STORAGE_KEY, [t, h].join('|'));
        console.info("temp and hum:",t, h);
      },

    },
    watch : {
      page_name (val){
        if(val === 'index'){
          //TODO:这里可能有体验问题，切换时会跳。
          $timeout(0).then(()=>{
            HdSmart.UI.toggleHeadAndFoot(true);
            //首页允许下拉刷新，详情页不允许
            HdSmart.UI.setWebViewTouchRect(0,0,0,0);
          });
        }else{
          HdSmart.UI.toggleHeadAndFoot(false);
          HdSmart.UI.setWebViewTouchRect(0,0,'100%','100%');
        }
      }
    },
    mounted (){
      console.info('组件创建成功：', Date.now() - window.startTime);
      //初始化
      HdSmart.Device.getSnapShot( data =>{
        let attr = data && data.attr;
        if(!attr){
          return false;
        }
        HdSmart.UI.hideLoading();
        this.data_loaded = true;
        this.set_value({
          h : attr.humidity,
          t : attr.temperature
        });
        console.info('getSnapShot返回，页面数据渲染：', Date.now() - window.startTime);
      },()=>{
        HdSmart.UI.hideLoading();
        this.data_loaded = true;
      });

      //接受push消息，调整状态值。
      HdSmart.onDeviceListen(json => {
//        console.warn('listen data:', json);
        let attr = json && json.result && json.result.attr;
        //只有在indexPage需要实时显示状态变化。
        if(this.page_name === 'detail'){
          return true;
        }
        this.set_value({
          h : attr.humidity,
          t : attr.temperature
        });
      })
    }
  }
</script>

