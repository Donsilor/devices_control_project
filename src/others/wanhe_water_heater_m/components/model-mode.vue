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
          @click="setMode('common')">
          <div class="btn-cold center" />
          <div
            :class="[mode === 'common' ? 'active' : '', 'name']" >普通</div>
        </div>
        <div
          class="btn"
          @click="setMode('adaptive')">
          <div class="btn-heat center" />
          <div
            :class="[mode === 'adaptive' ? 'active' : '', 'name']" >自适应</div>
        </div>
        <div
          class="btn"
          @click="setMode('green')">
          <div class="btn-auto center" />
          <div
            :class="[mode === 'green' ? 'active' : '', 'name']" >节能</div>
        </div>
        <div
          class="btn"
          @click="setMode('kitchen')">
          <div class="btn-wind center" />
          <div
            :class="[mode === 'kitchen' ? 'active' : '', 'name']" >厨房</div>
        </div>
        <div
          class="btn"
          @click="setMode('customize1')">
          <div class="btn-dehumidify center" />
          <div
            :class="[mode === 'customize1' ? 'active' : '', 'name']" >定制1</div>
        </div>
        <div
          class="btn"
          @click="setMode('customize2')">
          <div class="btn-wind center" />
          <div
            :class="[mode === 'customize2' ? 'active' : '', 'name']" >定制2</div>
        </div>
        <div
          class="btn"
          @click="setMode('customize3')">
          <div class="btn-wind center" />
          <div
            :class="[mode === 'customize3' ? 'active' : '', 'name']" >定制3</div>
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
              background-image: linear-gradient(225deg, #FF59DA 0%, #FD30AA 100%);
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
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
        color: #FD30AA;
        background: #1C1C1E;
        border-radius: 10px;
        margin: 0 16px 16px 16px;
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
