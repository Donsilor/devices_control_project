<template>
  <div
    v-if="show"
    class="model"
    @click.self="show = false"
    @touchmove.prevent>
    <div class="main">
      <p class="title">选择风速</p>
      <div class="items btns">
        <div 
          class="btn" 
          @click="setSpeed('low')">
          <div :class="[speed === 'low' ? 'active' : '', 'btn-low center']" />
          <div 
            class="name" >低风</div>
        </div>
        <div 
          class="btn"
          @click="setSpeed('normal')">
          <div :class="[speed === 'normal' ? 'active' : '', 'btn-normal center']" />
          <div class="name">中风</div>
        </div>
        <div 
          class="btn" 
          @click="setSpeed('high')">
          <div :class="[speed === 'high' ? 'active' : '', 'btn-high center']" />
          <div 
            class="name" >高风</div>
        </div>
        <div 
          class="btn"
          @click="setSpeed('auto')">
          <div :class="[speed === 'auto' ? 'active' : '', 'btn-auto center']" />
          <div class="name">自动</div>
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
        margin-top: 68px;
        .btn{
          margin: 0 10px;
          text-align: center;
          .btn-low{
            width: 120px;
            height: 120px;
            border: 1px solid #818181;
            border-radius: 50%;
            &::before{
              content: '';
              display: block;
              width: 44px;
              height: 44px;
              background-image: url('~@lib/@{imgPath}/speed3.png');
              background-size: 100% 100%;
            }
          }
          .btn-normal{
            width: 120px;
            height: 120px;
            border: 1px solid #818181;
            border-radius: 50%;
            &::before{
              content: '';
              display: block;
              width: 44px;
              height: 44px;
              background-image: url('~@lib/@{imgPath}/speed4.png');
              background-size: 100% 100%;
            }
          }
          .btn-high{
            width: 120px;
            height: 120px;
            border: 1px solid #818181;
            border-radius: 50%;
            &::before{
              content: '';
              display: block;
              width: 44px;
              height: 44px;
              background-image: url('~@lib/@{imgPath}/speed5.png');
              background-size: 100% 100%;
            }
          }
          .btn-auto{
            width: 120px;
            height: 120px;
            border: 1px solid #818181;
            border-radius: 50%;
            &::before{
              content: '';
              display: block;
              width: 44px;
              height: 44px;
              background-image: url('~@lib/@{imgPath}/auto.png');
              background-size: 100% 100%;
            }
          }
          .active{
            background-image: linear-gradient(90deg, #FFD500 0%, #FFBF00 100%);
            border: none;
          }
          .name{
            margin-top: 16px;
            font-size: 24px;
            color: #20282B;
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
  props: ['speed'],
  data() {
    return {
      show: false
    }
  },
  mounted() {
  },
  methods: {
    setSpeed(attr){
      this.$emit('setSpeed', attr)
    }
  }
}
</script>
