<template>
  <div
    v-if="show"
    class="model"
    @click.self="show = false"
    @touchmove.prevent>
    <div class="main show">
      <div class="title">是否解除配置</div>
      <div
        class="hide determine"
        @click="setMode">解除配置</div>
      <div
        class="hide"
        @click.self="show = false">取消</div>
    </div>
  </div>
</template>
<style lang="less" scoped>
@imgPath: 'base/air_condition/assets/new-air';
@imgPath1: "base/hongyan_light/assets";

@keyframes show {
    0% {
      bottom:-380px;
    }
    100% {
       bottom:0;
    }
}
// .show{
//   animation: show .2s linear 0s;
// }

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
      z-index: 999999999999;
      width: 85%;
      background: #1E1E1E;
      padding: 48px 40px 20px;
      border-radius: 10px;
      .title {
        font-size: 36px;
        color: #fff;
        line-height: 30px;
        margin-bottom: 32px;
        text-align: center;
      }
      .txt {
        .text {
          height: 104px;
          opacity: 0.5;
          width: 100%;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          font-size: 32px;
          padding: 20px;
          background: #1E1E1E;
          color: #fff;
        }
      }
      .line {
        padding: 0px 60px;
        width: 90%;
        height: 1px;
        opacity: .1;
        background: #F0F2F4;
      }
      .btns{
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        .btn{
          padding: 0px 60px;
          width:100%;
          height:120px;
          line-height: 120px;
          font-size:32px;
        }
        .img {
          margin: 0 60px 0 0;
          width: 48px;
          height: 48px;
          background: url("~@lib/@{imgPath1}/btn_ac_rihgt.png") no-repeat;
          background-size: 100% 100%;
        }
      }
      .hide{
        width: 100%;
        height: 100px;
        font-size: 32px;
        letter-spacing: 0;
        text-align: center;
        line-height: 100px;
        background: #1E1E1E;
        border-radius: 10px;
        color: #E1B96E;
      }
      .determine {
        margin-top: 52px;
        background-image: linear-gradient(225deg, #F9BB6B 0%, #EF6D5E 100%);
        border-radius: 10px;
        color: #000000;
      }
    }
  }
</style>
<script>
export default {
  props: ['num'],
  data() {
    return {
      show: false,
      txtVal: ''
    }
  },
  watch: {
    'show'() {
      if(this.show == false) {
        this.txtVal = ''
      }
    }
  },
  mounted() {
  },
  methods: {
    setMode(){
      this.$emit('setMode', this.txtVal)
    }
  }
}
</script>
