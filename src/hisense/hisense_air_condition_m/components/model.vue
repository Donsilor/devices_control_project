<template>
  <div
    v-if="show"
    class="model"
    @click.self="show = false"
    @touchmove.prevent>
    <div class="main">
      <p class="title">选择摆风</p>
      <div class="items btns">
        <div 
          class="btn" 
          @click="setWind('wind_up_down')">
          <div :class="[wind_up_down === 'on' ? 'active' : '', {'btn-loading': btn_wind_up_down }, 'btn-swing center']" />
          <div 
            class="name" >上下风</div>
        </div>
        <div 
          class="btn"
          @click="setWind('wind_left_right')">
          <div :class="[wind_left_right === 'on' ? 'active' : '', {'btn-loading': btn_wind_left_right }, 'btn-swing horizontal center']" />
          <div class="name">左右风</div>
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
      position: relative;
      z-index: 999999999999;
      width: 638px;
      height: 542px;

      color: #20282B;
      background: #FFFFFF;
      border: 1px solid #DDDDDD;
      border-radius: 24px;
      border-radius: 24px;
      .title{
        margin: 88px 48px 48px;
        font-weight: bold;
        font-size: 40px;
        color: #20282B;
      }
      .btns{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 78px;
        .btn{
          margin: 0 54px;
          text-align: center;
          .btn-swing{
            width: 120px;
            height: 120px;
            border: 1px solid #818181;
            border-radius: 50%;
            &::before{
              content: '';
              display: block;
              width: 44px;
              height: 44px;
              background-image: url('~@lib/@{imgPath}/up.png');
              background-size: 100% 100%;
            }
            &.active{
              background-image: linear-gradient(90deg, #FFD500 0%, #FFBF00 100%);
              border: none;
            }
            &.horizontal{
              transform: rotate(90deg)
            }
          }
          .name{
            margin-top: 20px;
            font-size: 24px;
            color: #fff;
          }
        }
      }
      .hide{
        margin-top:61px;
        font-size: 32px;
        color: #FFC800;
        letter-spacing: 0;
        text-align: center;
        line-height: 44px;
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
