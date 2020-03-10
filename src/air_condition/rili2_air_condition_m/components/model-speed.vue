<template>
  <div
    v-if="show"
    class="speedl"
    @click.self="show = false"
    @touchmove.prevent>
    <div 
      v-if="show"
      class="main show">
      <!-- <p class="title">选择摆风</p> -->
      <div class="items btns">
        <div 
          class="btn"
          @click="setSpeed('low')">
          <div class="btn-low center" />
          <div 
            :class="[speed === 'low' ? 'active' : '','name']" >低风</div>
        </div>
        <div 
          class="btn" 
          @click="setSpeed('normal')">
          <div class="btn-normal center" />
          <div 
            :class="[speed === 'normal' ? 'active' : '','name']" >中风</div>
        </div>
        <div 
          class="btn" 
          @click="setSpeed('high')">
          <div class="btn-high center" />
          <div 
            :class="[speed === 'high' ? 'active' : '','name']" >高风</div>
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
  .speedl{
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
        .btn{
          width:100%;
          height:120px;
          line-height: 120px;
          text-align: center;
          font-size:32px;
          border-bottom: 0.5px solid rgba(255,255,255,.1);
          .name{
            &.active{
               color:#E1B96E;
            }
          }
        }
      }
      .hide{
        height: 120px;
        margin-top:21px;
        font-size: 32px;
        letter-spacing: 0;
        text-align: center;
        line-height: 120px;
        color: #E1B96E;
        background: #1C1C1E;
        border-radius: 10px;
        margin: 0 16px 16px 16px;
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
