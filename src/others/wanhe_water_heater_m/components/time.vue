<template>
  <div
    v-if="show"
    class="model"
    @click.self="show = false"
    @touchmove.prevent>
    <div class="main">
      <div class="overtime">
        <span class="title">选择预约时间</span>
      </div>
      <time-pick
        class="pickTime"
        @selectedchange="selectedchange" />

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
      position: absolute;
      bottom: 0;
      z-index: 999999999999;
      width: 100%;
      height: 896px;
      color: #fff;
      background: #fff;
      // background: #373E41;
      // box-shadow: 0 10px 78px -8px rgba(0,0,0,0.64);
      // border-radius: 24px;
      .overtime{
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 0 40px;
        align-items: center;
        height: 122px;
        border-bottom: 1px solid rgba(0,0,0,0.1);
        .title{
          font-size: 40px;
          color: #000;
        }
        .canceltime{
          font-size: 32px;
          color: #E1B96E;
        }
      }

      .wrap-btns{
        text-align: center;
        margin-top: 100px;
      }
      .submit{
        margin-top: 50px;
        outline: none;
        background: #000;
        font-size: 32px;
        color: #fff;
        text-align: center;
        width: 650px;
        height: 100px;
        margin: auto;
      }
      .cancel{
        margin-top: 32px;
        color: #FFC700;
        font-size: 32px;
        line-height: 44px;
        color: #000;
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
    title:{
      type: String
    },
    // switchStatus:{type: String}
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
    },
    canceltime(){
      this.$emit('canceltime') //自定义事件，暴露值
      this.show = false
    }
  }
}
</script>
