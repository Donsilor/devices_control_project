<template>
  <div
    v-if="show"
    class="model"
    @click.self="show = false"
    @touchmove.prevent>
    <div class="main show">
      <!-- <p class="title">选择模式</p> -->
      <div class="items btns">
        <div class="btn title">选择模式</div>
      </div>
      <div class="line"/>
      <div class="items btns">
        <div
          class="btn"
          @click="setWind()">自定义
        </div>
        <div
          v-show="custom||mode=='0'"
          class="img"/>
      </div>
      <div class="line"/>
      <div class="items btns">
        <div
          class="btn"
          @click="setWind('3')">阅读
        </div>
        <div
          v-show="!custom&&mode=='3'"
          class="img"/>
      </div>
      <div class="line"/>
      <div class="items btns">
        <div
          class="btn"
          @click="setWind('5')">温暖
        </div>
        <div
          v-show="!custom&&mode=='5'"
          class="img"/>
      </div>
      <div class="line"/>
      <div class="items btns">
        <div
          class="btn"
          @click="setWind('6')">夜灯
        </div>
        <div
          v-show="!custom&&mode=='6'"
          class="img"/>
      </div>
      <div class="line"/>
      <div class="items btns">
        <div
          class="btn"
          @click="setWind('4')">影院
        </div>
        <div
          v-show="!custom&&mode=='4'"
          class="img"/>
      </div>
      <!-- <div
        class="hide"
        @click.self="show = false">取消</div> -->
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
      color: #20282B;
      background: #eee;
      border: 1px solid #DDDDDD;
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
          &.title {
            font-size: 40px;
          }
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
  props: ['mode', 'custom'],
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
