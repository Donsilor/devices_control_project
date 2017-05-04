<template>
  <div class="detail-page">
    <div class="top">
      <div class="arr" ref="arr">
        <img src="../assets/arrow2.png" />
      </div>
      <div class="tit">温湿度计</div>
    </div>
    <div class="middle">
      <!-- 温湿度切换 -->
      <!--<div class="swicher"></div>-->
      <!-- 仪表盘 -->
      <dashboard :type="1" :value="temp" unit="°C">温 度</dashboard>
      <dashboard :type="2" :value="humidity" unit="%">湿 度</dashboard>
    </div>
    <div class="bottom">
      <div>
        <span class="tit">过去24小时温湿度</span>
        <div class="line"></div>
        <div class="list-ct">
          <div class="title">
            <div class="tit i">温度</div>
            <div class="tit i">湿度</div>
          </div>
          <div class="cont">
            <list-view></list-view>
          </div>
        </div>
        <div class="line"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .detail-page{ width : 100%; height: 100%; position: relative;}
  .top{
    background:#f2f2f2;
    box-shadow:inset 0 -1px 0 0 #dbdbdb;
    width:100%;
    height:96px;
    /*margin-bottom: 90px;*/
    position: absolute;
    left : 0; right: 0; top : 0; bottom: 0;
  }
  .top .arr{
    color:#333;
    height:96px;
    width:80px;
    padding : 20px 20px;
    float : left;
    /*margin : 24px;*/
  }
  .top .tit{
    font-size:36px;
    color:#333333;
    text-align:center;
  }
  .tit{
    font-family:NotoSansHans-Regular;
    letter-spacing:0;
    text-align:center;
    line-height: 96px;
    font-size:30px;
    color:#d2d2d2;
    text-align:left;
  }

  .middle{
    display: flex;
    position: absolute;
    top : 120px;
    left:120px;
  }
  .bottom{
    color : #ccc;
    font-size : 30px;
    /*margin-top : 36px;*/
    position: absolute;
    top : 720px;
    left : 60px;
    right : 60px;
  }

  .bottom .tit{ height : 72px; }
  .bottom time{font-size : 24px; }
  .line{ border-width : 0px 0 0 0; height : 1px; background: #ccc; margin : 5px 0; }
  .list-ct{ position: relative; margin-bottom : 240px;}
  .list-ct .title{position: absolute;left :0;bottom: 0;top :82px;}
  .list-ct .title .i{
    height : 60px;
    width : 60px;
    line-height: 48px;
  }
  .list-ct .cont{position: absolute;left :90px;}

</style>

<script>
  import { $tap } from '../utils';
export default {
  name: 'detail-page',
  props : {
    //温度，单位：°
    temp : Number,
    //湿度，单位：%
    humidity : Number
  },
  data () {
    return {
      data_list : []
    }
  },
  mounted : function(){
    $tap(this.$refs.arr , ()=>{
      //jump2detail事件注册在App.vue中。
      this.$emit('return2index');
    });

    //下面的部分放开手势操作，因为有touchview.
    HdSmart.UI.setWebViewTouchRect(0,0,'100%','100%');
  }
}
</script>


