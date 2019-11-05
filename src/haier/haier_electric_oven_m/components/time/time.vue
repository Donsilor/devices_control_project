<template>
  <div
    v-if="show"
    class="model"
    @click.self="show = false"
    @touchmove.prevent>
    <div class="main">
      <p class="title">设置烘焙时间</p>
      <time-pick
        class="pickTime"
        @selectedchange="selectedchange"/>
      <div class="wrap-btns">
        <button
          class="submit"
          type="button"
          @click="submit" >确定</button>
        <div
          class="cancel"
          @click=" show = false">取消</div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
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
      height: 726px;

      color: #20282B;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 24px;
      .title{
        font-weight: 900;
        margin: 88px 48px 0;
        font-size: 40px;
        color: #20282B;
      }
      .wrap-btns{
        text-align: center;
      }
      .submit{
        margin-top: 50px;
        outline: none;
        border: none;
        background-image: linear-gradient(-90deg, #FFD500 0%, #FFBF00 100%);
        border-radius: 71px;

        font-size: 32px;
        color: #000000;
        text-align: center;
        width: 542px;
        height: 100px;
        margin: auto;
      }
      .cancel{
        margin-top: 32px;
        color: #FFC700;
        font-size: 32px;
        line-height: 44px;
      }
    }
  }
</style>
<script>
import timePick from './timePick.vue'

export default {
  components: {
    'time-pick': timePick
  },
  props: {
  },

  data() {
    return {
      show: false,
      time: ''
    }
  },
  mounted() {
  },
  methods: {
    selectedchange(val) {
      this.time = val
    },
    submit() {
      let val = [this.time || '0:0', 'time']
      this.$emit('selectedTime', val) //自定义事件，暴露值
      this.time = '0:0'
      this.show = false
    }
  }
}
</script>
