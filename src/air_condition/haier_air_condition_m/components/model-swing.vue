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
      <div class="items btns">
        <div 
          class="btn" 
          @click="setWind('wind_up_down')">上下风
        </div>
        <div 
          class="btn"
          @click="setWind('wind_left_right')">左右风
        </div>
      </div>
      <div 
        class="hide" 
        @click.self="show = false">取消</div>
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
      height: 381px;
      color: #20282B;
      background: #eee;
      border: 1px solid #DDDDDD;
      .btns{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background: #fff;
        .btn{
          width:100%;
          height:120px;
          line-height: 120px;
          text-align: center;
          font-size:32px;
          &:first-of-type{
            border-bottom:1px solid #F0F2F4;
          }
        }
      }
      .hide{
        width: 100%;
        height: 120px;
        margin-top:21px;
        font-size: 32px;
        letter-spacing: 0;
        text-align: center;
        line-height: 120px;
        background: #fff;
      }
    }
  }
</style>
<script>
export default {
  props: ['wind_up_down', 'wind_left_right', 'btn_wind_up_down', 'btn_wind_left_right'],
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
