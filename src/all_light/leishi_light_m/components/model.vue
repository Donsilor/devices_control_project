<template>
  <div
    v-if="show"
    class="speedl"
    @click.self="show = false"
    @touchmove.prevent>
    <div
      v-if="show"
      class="main show">
      <div class="items btns">
        <div
          class="btn"
          @click="setModel(0)">
          <div class="btn-low center" />
          <div
            :class="[temperature === 0 ? 'active' : '','name']" >暖光</div>
        </div>
        <div
          class="btn"
          @click="setModel(145)">
          <div class="btn-normal center" />
          <div
            :class="[temperature === 145 ? 'active' : '','name']" >自然光</div>
        </div>
        <div
          class="btn"
          @click="setModel(255)">
          <div class="btn-high center" />
          <div
            :class="[temperature === 255 ? 'active' : '','name']" >白光</div>
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
      height: auto;
      font-family: PingFangSC-Light;
      color: #fff;
      .btns{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
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
               color:rgb(193, 113, 83);
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
        color: rgb(193, 113, 83);
        background: #1C1C1E;
        border-radius: 10px;
        margin: 0 16px 16px 16px;
      }
    }
  }
</style>
<script>
export default {
  props: ['temperature'],
  data() {
    return {
      show: false
    }
  },
  mounted() {
  },
  methods: {
    setModel(attr){
      this.$emit('setModel', attr)
    }
  }
}
</script>
