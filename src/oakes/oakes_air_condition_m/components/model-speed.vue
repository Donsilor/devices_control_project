<template>
  <div
    v-if="show"
    class="model"
    @click.self="show = false"
    @touchmove.prevent>
    <div class="main">
      <!-- <p class="title">选择摆风</p> -->
      <div class="items btns">
        <div 
          class="btn" 
          @click="setWind('auto', 'auto')">自动
        </div>
        <div 
          class="btn"
          @click="setWind(speed, 'hand')">手动
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
      position: absolute;
      bottom: 0;
      z-index: 999999999999;
      width: 100%;
      height: 381px;
      color: #20282B;
      background: #eee;
      border: 1px solid #DDDDDD;
      .btns{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background: #fff;
        .btn{
          width:100%;
          height:120px;
          line-height: 120px;
          text-align: center;
          font-size:32px;
          &:first-of-type{
            border-bottom:1px solid #F0F2F4;
          }
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
  props: ['speed'],
  data() {
    return {
      show: false,
    }
  },
  mounted() {
  },
  methods: {
    setWind(attr, val){
      this.$emit('setSpeed', attr, val)
    }
  }
}
</script>
