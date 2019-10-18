/* eslint-disable vue/no-unused-vars */
<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']">
      <NewTopBar
        :title="device.device_name"
        :shutdown="true"
        bak-color="#000"
        @shutdownCallback="shutdowncallback('off')" />
      <!-- tab切换栏 -->
      <div
        class="main center"
        style="margin-top:52px">
        <div class="bg"><div class="circle"><div class="status">{{ deviceAttrs.switch=='on'?'通电中':'断电中' }}</div></div></div>
      </div>
      <div class="status1">05:23:17后断电</div>
      <div 
        v-show="!isOffline" 
        class="panel-btn center">
        <div 
          class="btn-wrap"
          @click="setSwitch">
          <div :class="[{ 'btn-source': deviceAttrs.switch == 'off' },{ 'btn-over': deviceAttrs.switch == 'on' } ,'btn btn-source center']" />
          <div class="btn-name">{{ deviceAttrs.switch=='on'?'断电':'通电' }}</div>
        </div>
        <div 
          class="btn-wrap"
          @click="setMode('dehumidify')">
          <div :class="[{ 'active': deviceAttrs.mode == 'dehumidify' }, 'btn btn-delay center']" />
          <div class="btn-name">延时通电</div>
        </div>
        <div 
          style="visibility:hidden"
          class="btn-wrap"/>
      </div>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper'
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      temp:true,
      timeOutEvent:'',
      a:"",
      currentMode:'normal',
    }
  },
  computed: {
    ...mapGetters(['isClose','isOffline']),
    ...mapState(['device', 'deviceAttrs']),
    bakColor(){
      return this.isClose ? '#000' : '#fff'
    },

  },
  watch: {
    'device.stateChange'(){
      this.$nextTick(()=>{
        //  this.newRatio()
      })
    },
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
      .then(()=>{

      })
      // HdSmart.UI.setStatusBarColor(2)
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    // 开关机
    setSwitch(){
      if (this.isOffline) return 
      let switchStatus = ''
      if (this.deviceAttrs.switch=='on') {
        switchStatus = 'off'
      }else{
        switchStatus = 'on'
      }
      this.controlDevice('switch',switchStatus)
    },
    // tab切换
    tabMode(t){
      this.temp = t
    },
    // 启动
    setStart() {
      let controlStatus = ''
      if (this.deviceAttrs.control == 'start') {
        controlStatus = 'halt'
      } else {
        controlStatus = 'start'
        this.currentMode = document.querySelectorAll('.swiper-slide-active>div>span')[1].innerHTML
        let value
        let arr = this.tableware.concat(this.foodList)
        for(let i=0;i<arr.length;i++){
          if(this.currentMode ==arr[i].name ){
            value = arr[i].english
          }
        }
        this.controlDevice("control",controlStatus,{'mode':value})
          this.$router.push({ path: '/Washing' })
        return
      }
      this.controlDevice("control",controlStatus )
    },
    // 长按事件
    touchStart(e){
      console.log(e)
      this.timeOutEvent=setTimeout(() => {
        this.longPress()
      }, 1000)
    },
    //如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
    touchMove(e){
      clearTimeout(this.timeOutEvent)
      this.timeOutEvent=0
    },
    touchEnd(e){
      clearTimeout(this.timeOutEvent)//清除定时器
      this.timeOutEvent=0
      if(this.timeOutEvent!=0){
          // alert("你这是点击，不是长按")
        // this.$refs.black.className.add('active')
      }
      return false
    },
    longPress(){
      this.timeOutEvent = 0
      console.log(this.timeOutEvent)
      // alert('长按了')
      this.$nextTick(()=>{
        this.controlDevice('remain_washtime',0)
      })
    },
    // 洗涤完成
    finish(){
      this.controlDevice('operation_mode','standby')
    },
    controlDevice(attr, value,params) {
      return this.doControlDevice({
        nodeid: `curtain.main.${attr}`,
        params: {
          attribute: {
            [attr]: value,
            ...params
          }
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
@imgPath: 'base/new_curtains/assets';
@imgPath1: 'base/dishwasher/assets';
@imgPath2: 'base/kongke_plug/assets';
@keyframes progress-bar{
  0% {
      transform: rotate(260deg);
      border: 3px solid transparent;
  }
  100% {
      transform: rotate(358deg);
      border: 3px solid rgba(0, 0, 0, 1);
  }
}
.body {
  min-height: 100%;
}
.page {
  height: 100vh;
  min-height: 550px;
  overflow-x: hidden;
  position: relative;
  background-image: url('~@lib/@{imgPath}/bg_01@2x.png');
  background-size: 100% 100%;
  .main {
    .bg{
      width: 580px;
      height: 580px;
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.1);
      position: relative;
      .circle{
        width: 520px;
        height: 520px;
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, 0.1);
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -260px ; 
        margin-top: -260px ; 
      }
      .status{
        width: 460px;
        height: 460px;
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, 0.1);
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -230px ; 
        margin-top: -230px ; 
        font-size: 80px;
        text-align: center;
        line-height: 460px;
      }
    }
  }
  .status1{
    font-size: 28px;
    text-align: center;
    line-height: 28px;
    margin-top: 52px;
  }
  .working{
    margin-top: 20vh;
    .time{
      width: 100%;
      font-size: 146px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 18px;
    }
    .progress{
      font-size:28px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin:24px 0 70px 0;
      .isgray{
        color:#b0b0b0;
        &.ongoing{
          color: #000;
        }
         &.black{
          color: #000;
        }
      }
      
      
    }
    .status{
      width: 100%;
      font-size: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .end{
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 20vh;
    .circle{
      width: 140px;
      height: 140px;
      border: 2px solid rgba(0, 0, 0, 0.7);
      border-radius: 50%;
      margin-bottom: 60px;
      &::before{
        display: block;
        content: '√';
        text-align: center;
        line-height: 140px;
      }
    }
    >span{
      font-size: 48px;
    }
    .button{
      width: 90%;
      height: 100px;
      background: #000;
      color: #fff;
      font-size: 32px;
      text-align: center;
      line-height: 100px;
      margin-top: 30vh;
    }
  }
  .closed{
    font-size: 48px;
    text-align: center;
    margin-top: 240px;
  }
  .panel-btn {
    height: auto;
    width: 100%;
    margin-top: 120px;
    z-index: 99999;
  .btn-wrap {
    margin: 0 24px 24px;
    &:last-of-type{
      width: 30px;
      height: 120px;
    }
    .btn {
      box-sizing: border-box;
      margin: 0 auto;
      width: 120px;
      height: 120px;
      border: 1px solid #818181;
      border-radius: 50%;
      display: flex;
      justify-content: space-around;
      flex-direction: column;
      position: relative;
      &.btn-source{
        &::before{
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          margin-left: -22px;
          margin-top: -22px;
          background-image: url('~@lib/@{imgPath2}/tongdian.png');
          background-size: 100% 100%;
          width: 44px;
          height: 44px;
        }   
      }
      &.btn-over{
        &::before{
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          margin-left: -22px;
          margin-top: -22px;
          background-image: url('~@lib/@{imgPath2}/duandian.png');
          background-size: 100% 100%;
          width: 44px;
          height: 44px;
        }   
      }
       &.btn-delay{
        &::before{
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          margin-left: -22px;
          margin-top: -22px;
          background-image: url('~@lib/@{imgPath2}/yanshi.png');
          background-size: 100% 100%;
          width: 44px;
          height: 44px;
        }   
      }
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
      }
      &.active {
        background: #000;
      }
    }
    .btn-name {
      text-align: center;
      color: #000;
      margin-top: 16px;
      font-size: 24px;
    }
  }
    &.center{
      display: flex;
      align-items: center;
    }
  }
  /*********** 按钮 ***********/
  .btn-wrap {
    margin: 0 34px 40px;
    position: relative;
    .progressBar {
      &::before{
        content: "";
        display: block;
        width: 200px;
        height: 200px;
        border-radius: 50%;
        position: absolute;
        top: -30px;
        left: -23%;
        // transform: translateX(-50%) rotate(260deg);
        border: 3px solid rgba(0, 0, 0, 1);
        clip: rect(0px 200px 40px 0px);
        animation: progress-bar 1s linear infinite;
      }
    }
    .mask {
      &::before{
        content: "";
        display: block;
        width: 200px;
        height: 200px;
        border-radius: 50%;
        position: absolute;
        top: -30px;
        left: -23%;
        border: 3px solid transparent;
        z-index: 10;
        clip: rect(40px 80px 200px 0px);
      }
    }
      .press{
        &::before{
          content: "";
          display: block;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          border: 3px solid rgba(136, 138, 137, 0.8);
          clip: rect(0px 200px 40px 0px);
        }
      }
    .btn {
      box-sizing: border-box;
      margin: 0px auto;
      width: 140px;
      height: 140px;
      border-radius: 50%;

      display: flex;
      flex-direction: column;
      &.btn-over{
        &.active{
          background:#000;
        }
      }
    &.btn-swich {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: rgba(136, 138, 137,.4);
      &::before {
        background-image: url('~@lib/@{imgPath1}/yiguanbi.png');
        background-size: 100% 100%;
        width: 80px;
        height: 80px;
      }
    }
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
      }
      &.active {
        &.btn-start::before{
          background-image: url('~@lib/@{imgPath1}/zanting.png');
          background-size: 100% 100%;
          width: 88px;
          height: 102px;
        }
        &.btn-over::before{
          background-image: url('~@lib/@{imgPath1}/jieshu2.png');
          background-size: 100% 100%;
          width: 96px;
          height: 96px;
        }
      }
    }
    .btn-name {
      text-align: center;
      color: #000;
      margin-top: 16px;
      font-size: 28px;
      line-height: 40px;
      // opacity: .5;
    }

    .btn-over {
      &::before {
        background-image: url('~@lib/@{imgPath1}/jieshu.png');
        background-size: 100% 100%;
        width: 96px;
        height: 96px;
      }
    }
    .btn-start {
      &::before {
        background-image: url('~@lib/@{imgPath1}/qidong@2x.png');
        background-size: 100% 100%;
        width: 88px;
        height: 102px;
      }
    }
    }
  }
  &.close,
  &.offline {
    &:before {
      content: "";
      position: fixed;
      top: 64PX;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 999;
      width: 100%;
      // background: rgba(0, 0, 0, 0.1);
    }
    &.page {
      ul{
        li{
          opacity: 0;
        }
      }
      .swiper-container{
        opacity: .2;
      }
      .swiper-container1{
        opacity: .2;
      }
    }
    .btn-wrap {
      &.up-index {
        opacity: 1;
        .btn-open{
          z-index:999999;
        }
      }
      .btn {
        &.active {
           &.active {
        background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
        border-color: #ffbf00;
      }
        }

      }
    }
  }
</style>
