<template>
  <div
    v-if="show"
    class="model"
    @click.self="show = false"
    @touchmove.prevent>
    <div 
      v-if="show"
      class="main show">
      <!-- <p class="title">选择摆风</p> -->
      <div :class="[swing_wind.mode,'items btns']">
        <div 
          class="btn"
          @click="setWind('wind_up')">
          <div class="btn-cold center" />
          <div 
            :class="[swing_wind.wind_up=== 'on' ? 'active' : '', 'name']" >向上</div>
        </div>
        <div 
          class="btn"
          @click="setWind('wind_mid_up')">
          <div class="btn-heat center" />
          <div 
            :class="[swing_wind.wind_mid_up === 'on' ? 'active' : '', 'name']" >中上</div>
        </div>
        <div 
          class="btn" 
          @click="setWind('wind_middle')">
          <div class="btn-auto center" />
          <div 
            :class="[swing_wind.wind_middle === 'on' ? 'active' : '', 'name']" >正中</div>
        </div>
        <div 
          class="btn"
          @click="setWind('wind_mid_down')">
          <div class="btn-wind center" />
          <div 
            :class="[swing_wind.wind_mid_down === 'on' ? 'active' : '', 'name']" >中下</div>
        </div>
        <div 
          class="btn"
          @click="setWind('wind_down')">
          <div class="btn-dehumidify center" />
          <div 
            :class="[swing_wind.wind_down === 'on' ? 'active' : '', 'name']" >向下</div>
        </div>
        <div 
          class="btn"
          @click="setWind('wind_auto')">
          <div class="btn-dehumidify center" />
          <div 
            :class="[swing_wind.wind_auto === 'on' ? 'active' : '', 'name']" >自动</div>
        </div>
      </div>
      <div 
        :class="[swing_wind.mode, 'hide']" 
        @click.self="show = false"><span @click.self="show = false">取消</span></div>
    </div>
  </div>
</template>
<style lang="less" scoped>
@imgPath: 'base/air_condition/assets/new-air';
@keyframes show {
    0% {
      bottom:-380px;
    }
    100% {
       bottom:0;
    }
}
.show{
  animation: show .2s linear 0s;
}
  .model{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    z-index: 99999;

    display: flex;
    align-items: center;
    justify-content: center;

    &:before{
      position: absolute;
      top: 0;
      left: 0;
      content: '';
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
    }
    .main{
      position: absolute;
      bottom: 0;
      z-index: 999999999999;
      width: 100%;
      // height: 381px;
      height: auto;
      font-family: PingFangSC-Light;
      color: #fff;
      // background: #eee;
      // border: 1px solid #DDDDDD;
      .btns{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        // background: rgba(37,37,37,0.80);
        background: #1C1C1E;
        border-radius: 10px;
        margin: 0 16px 16px 16px;
         &.cold,
          &.auto,
          &.dehumidify,
          &.wind{
            .active{
              background-image: linear-gradient(225deg, #1DD3A6 0%, #347ADF 100%);
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
            }
          }
          &.heat{
            .active{
              background-image: linear-gradient(225deg, #F9BB6B 0%, #EF6D5E 100%);
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
            }
          }
        .btn{
          width:100%;
          height:120px;
          line-height: 120px;
          text-align: center;
          font-size:32px;
          border-bottom: 0.5px solid rgba(255,255,255,.1);
        }
      }
      .hide{
        height: 120px;
        margin-top:21px;
        font-size: 32px;
        letter-spacing: 0;
        text-align: center;
        line-height: 120px;
        background: #1C1C1E;
        border-radius: 10px;
        margin: 0 16px 16px 16px;
      }
      .cold.hide,.dehumidify.hide,.wind.hide,.auto.hide{
        span{
          background-image: linear-gradient(225deg, #1DD3A6 0%, #347ADF 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      }
      .heat.hide{
        span{
          background-image: linear-gradient(225deg, #F9BB6B 0%, #EF6D5E 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      }
    }
  }
</style>
<script>
export default {
  props: ['swing_wind'],
  data() {
    return {
      show: false
    }
  },
  mounted() {
  },
  methods: {
    setWind(attr){
      this.$emit('setWind', attr)
    }
  }
}
</script>
