<template>
  <div class="page">
    <topbar 
      title="空气检查仪"
      bak-color="#000" />
    <div class="main center">
      <div class="wrap-circle center">
        <div 
          :class="[ rotateClass, 'bg', 'rotate-low']" 
          @click="PMsynopsis()" />
        <div 
          class="PM PM-close">
          <span class="num">26</span>
          <span class="unit">ug/m3</span>
        </div>
        <p 
          class="describe">PM2.5 优</p>
      </div>


      <div class="information first">
        <p>
          <span>  <i class="num">26</i> °C</span>
          <span class="text">温度 凉爽</span> 
        </p>
        <p> 
          <span>  <i class="num">26</i> °C</span>
          <span class="text">温度 凉爽</span> 
        </p>
        <p>
          <span>  <i class="num">26</i> °C</span>
          <span class="text">温度 凉爽</span> 
        </p>      
      </div>


      <div class="information">
        <p>
          <span>  <i class="num">26</i> °C</span>
          <span class="text">温度 凉爽</span> 
        </p>
        <p class="last">
          <span><i class="num">5350</i> °C</span>
          <span class="text">温度 凉爽</span> 
        </p>

      </div>
    </div>
  </div>
</template>
<script>
import mapActions from 'vuex'
export default {
  data(){
    return {

    }
  },
 

  computed:{
    rotateClass(){
      // eslint-disable-next-line no-constant-condition
      if(1 > 2){
        return "aaa"
      }else{
        return 'bbb'
      }
    }
  },
  created() {
    HdSmart.ready(() => {
      // this.getDeviceInfo()
    })
  },
  methods: {
    // ...mapActions(['getDeviceInfo']),
    PMsynopsis(){
      console.log(this.deviceAttrs)
      this.$router.push('/PMsynopsis')
    }
  }
}
</script>

<style lang="less" scoped>
@lib: "../../../../lib/base/haier_hood/assets";
@lib1: "../../../lib";
// @keyframes rotate {
//     from {
//       transform:rotate(0deg);
//     }
//     to {
//       transform:rotate(360deg);
//     }
// }
i{
   font-style:normal
}
  .main {
    flex: 1;
    padding-bottom: 40px;
    &.center {
      flex-direction: column;
    }
    .wrap-circle {
      position: relative;
      margin-top: 60px;
      width: 524px;
      height: 524px;
      flex-direction: column;
      color: #20282B;
      .aaa {
        background: url("@{lib}/yanji_img_animation.png") no-repeat;
        background-size: 100% 100%;
        &.rotate-low{
          animation: rotate 10s linear 0s infinite;
        }
        &.rotate-overlow{
          animation: rotate 8s linear 0s infinite;
        }
        &.rotate-normal{
          animation: rotate 6s linear 0s infinite;
        }
        &.rotate-overnormal{
          animation: rotate 4s linear 0s infinite;
        }
        &.rotate-high{
          animation: rotate 2s linear 0s infinite;
        }
      }
      .bbb{
        background: url("@{lib}/yanji_img_animation.png") no-repeat;
        background-size: 100% 100%;
        &.rotate-low{
          animation: rotate 10s linear 0s infinite;
        }
        &.rotate-overlow{
          animation: rotate 8s linear 0s infinite;
        }
        &.rotate-normal{
          animation: rotate 6s linear 0s infinite;
        }
        &.rotate-overnormal{
          animation: rotate 4s linear 0s infinite;
        }
        &.rotate-high{
          animation: rotate 2s linear 0s infinite;
        }
      }
      .bg{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      .PM {
        &.PM-close{
          display: flex;
          align-items: center;
          height: 152px;
        }
        .num{
          font-size: 120px;
        }
        .unit{
          font-size: 20px;
          position: relative;
          top: -40px;
          left: 10px;
        }
       
      }
       .describe{
          font-size: 32px;
        }
    }
    .information{
      display: flex;
      font-size: 36px;
      width: 720px;
     
      &.first{
        margin-top:60px;
        margin-bottom: 60px;
        border-bottom: 1px #000 solid;
        padding-bottom: 60px;
      }
      p{
        padding: 0 40px;
        border-left: 1px #000 solid;
         flex: 1;
        &:nth-child(1){
          border: 0
        }
        &.last{
          text-align: right
        }
        span{
          display: block
        }
        .num{
          font-size: 72px;
        }
        .text{
          font-size: 24px;
        }
      }
    }
  }
</style>