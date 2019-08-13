<template>
  <div
    v-if="show"
    class="model"
    @click.self="show = false"
    @touchmove.prevent>
    <div class="main">
      <p class="title">选择模式</p>
      <div class="items btns">
        <div 
          class="btn" 
          @click="setMode('auto')">
          <div :class="[mode === 'auto' ? 'active' : '', 'btn-auto center']" />
          <div 
            class="name" >智能</div>
        </div>
        <div 
          class="btn"
          @click="setMode('dehumidify')">
          <div :class="[mode === 'dehumidify' ? 'active' : '', 'btn-dehumidify center']" />
          <div class="name">除湿</div>
        </div>
        <div 
          class="btn"
          @click="setMode('wind')">
          <div :class="[mode === 'wind' ? 'active' : '', 'btn-wind center']" />
          <div class="name">送风</div>
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
          margin: 0 32px;
          text-align: center;

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
          .btn-dehumidify{
            width: 120px;
            height: 120px;
            border: 1px solid #818181;
            border-radius: 50%;
            &::before{
              content: '';
              display: block;
              width: 44px;
              height: 44px;
              background-image: url('~@lib/@{imgPath}/dehumidify.png');
              background-size: 100% 100%;
            }
          }
          .btn-wind{
            width: 120px;
            height: 120px;
            border: 1px solid #818181;
            border-radius: 50%;
            &::before{
              content: '';
              display: block;
              width: 44px;
              height: 44px;
              background-image: url('~@lib/@{imgPath}/wind.png');
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
  props: ['mode'],
  data() {
    return {
      show: false
    }
  },
  mounted() {
  },
  methods: {
    setMode(attr){
      this.$emit('setMode', attr)
    }
  }
}
</script>
