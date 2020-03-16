<template>
  <div>
    <div
      v-if="show"
      class="model"
      @click.self="show = false"
      @touchmove.prevent/>
    <div
      v-if="show"
      :class="[deviceAttrs.mode,'main show']">
      <div class="overtime">
        <span 
          v-if="deviceAttrs.timer_switch == 'on'&& deviceAttrs.time_value >0" 
          class="title">{{ deviceAttrs.time_value | closeTime }}</span>
        <span 
          v-else 
          class="title">设置关机时间</span>
        <span
          v-if="deviceAttrs.timer_switch == 'on'&& deviceAttrs.time_value >0"
          class="canceltime"
          @click="canceltime">取消定时</span>
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
@keyframes show {
    0% {
      bottom:-380px;
    }
    100% {
       bottom:0;
    }
}
.show{
  animation: show .1s linear 0s;
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
  }
        .cold,.dehumidify,.wind,.auto{
          .canceltime,.cancel{
            background-image: linear-gradient(225deg, #1DD3A6 0%, #347ADF 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            font-size: 32px;
          }
          .submit{
            background-image: linear-gradient(225deg, #1DD3A6 0%, #347ADF 100%);
          }
        } 
        .heat{
          .canceltime,.cancel{
            background-image: linear-gradient(225deg, #F9BB6B 0%, #EF6D5E 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            font-size: 32px;
          }
          .submit{
            background-image: linear-gradient(225deg, #F9BB6B 0%, #EF6D5E 100%);
          }
        }
      .main{
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 999999999999;
      width: 100%;
      height: 896px;
      color: #fff;
      background: #1C1C1E;
      border-radius: 24px 24px 0 0;
      .overtime{
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 0 24px;
        align-items: center;
        height: 122px;
        border-bottom: 0.5px solid rgba(255, 255, 255, 0.1);
        .title{
          font-size: 32px;
          color: #fff;
        }
        
      }

      .wrap-btns{
        text-align: center;
        margin-top: 100px;
        padding: 0 24px;
      }
      .submit{
        margin-top: 50px;
        outline: none;
        border-radius: 10px;  
        font-size: 32px;
        color:#000;
        text-align: center;
        width: 100%;
        height: 100px;
        margin: auto;
        border: 0;
      }
      .cancel{
        margin-top: 32px;
        font-size: 32px;
        line-height: 44px;
      }
    }
</style>
<script>
import timePick from './timePick.vue'

export default {
  components: {
    'time-pick': timePick
  },
  props: ['deviceAttrs'],
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
      let val = [this.time || '1']
      this.$emit('selectedTime', val) //自定义事件，暴露值
      this.time = '1'
      this.show = false
    },
    canceltime(){
      this.$emit('canceltime') //自定义事件，暴露值
      this.show = false
    }
  }
}
</script>
