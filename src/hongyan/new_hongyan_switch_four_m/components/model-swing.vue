<template>
  <div
    v-if="show"
    class="model"
    @click.self="show = false"
    @touchmove.prevent>
    <div class="main show">
      <div class="title">请输入开关名称</div>
      <div class="txt">
        <input
          type="text"
          :value="txtVal"
          @blur="reset"
          id="text"
          class="text"
          maxlength="10"
          @input="txt">
      </div>
      <div
        class="hide determine"
        @click="setWind">确定</div>
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
      // bottom: 0;
      z-index: 999999999999;
      width: 85%;
      // height: 381px;
      // color: #20282B;
      background: #fff;
      // border: 1px solid #DDDDDD;
      padding: 88px 64px 20px;
      .title {
        font-size: 46px;
        color: #222A37;
        line-height: 68px;
        margin-bottom: 32px;
      }
      .txt {
        .text {
          height: 104px;
          opacity: 0.5;
          width: 100%;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 0px;
          font-size: 32px;
          padding: 20px;
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
        // flex-direction: column;
        background: #fff;
        .btn{
          padding: 0px 60px;
          width:100%;
          height:120px;
          line-height: 120px;
          // text-align: center;
          font-size:32px;
          // &:first-of-type{
          //   border-bottom:1px solid #F0F2F4;
          // }
          // &.title {
          //   font-size: 40px;
          // }
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
        // margin-top:21px;
        font-size: 32px;
        letter-spacing: 0;
        text-align: center;
        line-height: 100px;
        background: #fff;
      }
      .determine {
        margin-top: 52px;
        background-image: linear-gradient(221deg, #F1CB85 10%, #E1B96E 81%);
        border-radius: 48px;
        border-radius: 0px;
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
  mounted() {
  },
  methods: {
    reset(){
      window.scroll(0,0);
    },
    txt(e) {
      let reg = new RegExp("^[0-9\u4e00-\u9fa5]+$");
      if(reg.test(e.target.value)) {
        this.txtVal = e.target.value
      } else {
        HdSmart.UI.toast('只支持中文和数字')
        e.target.value = e.target.value.replace(/[^0-9\u4e00-\u9fa5]/g, '')
      }
      this.txtVal = e.target.value
    },
    setWind(){
      if (this.txtVal.length === 0) {
        HdSmart.UI.toast('请输入开关名称')
        return
      }
      this.$emit('setWind', this.txtVal)
    }
  }
}
</script>
