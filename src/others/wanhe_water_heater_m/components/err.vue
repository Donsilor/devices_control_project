<template>
  <div
    v-if="show"
    class="model"
    @touchmove.prevent>
    <div class="main show">
      <div class="title">热水器停止工作</div>
      <div
        class="hide">{{ error == '128' ? '连续放水时间超过40分钟关水后重新开水可解除' : error }}</div>
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
      // width: 85%;
      width: 670px;
      height: 620px;
      background: rgba(37,37,37,0.80);
      box-shadow: 0 0 0 0 rgba(255,255,255,0.10);
      // padding: 48px 40px 20px;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .title {
        font-size: 46px;
        color: #fff;
        line-height: 46px;
        margin-bottom: 50px;
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
        width: 370px;
        font-size: 32px;
        letter-spacing: 0;
        text-align: center;
        line-height: 42px;
        color: rgba(255,255,255,0.8);
      }
      .determine {
        // margin-top: 52px;
        // background-image: linear-gradient(225deg, #F9BB6B 0%, #EF6D5E 100%);
        // border-radius: 10px;
        // color: #000000;
      }
    }
  }
</style>
<script>
export default {
  props: ['error'],
  data() {
    return {
      show: false,
      txtVal: ''
    }
  },
  watch: {
    'show'() {
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>
