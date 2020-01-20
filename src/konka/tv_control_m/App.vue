<template>
  <div class="body">
    <div 
      :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']" 
    >
      <NewTopBar
        :title="device.device_name"
        :room="device.room_name"
        :scroll="true"
        :return-back="false"
        bak-color="#000"
        page-class=".page"
      />
      <!-- <StatusTip v-show="device.device_uuid"/> -->
      <div class="main center">
        <div class="btn-wrap">
          <!-- 关机 -->
          <div 
            ref="switchStatus"
            class="btn-off btn" 
            @touchstart="touchstart('switchStatus')"
            @touchend="touchend('switchStatus')"/>
          <!-- 静音 -->
          <div 
            ref="mute"
            :class="[{'active':deviceAttrs.mute==true},'btn-mute btn']" 
            @touchstart="touchstart('mute')"
            @touchend="touchend('mute')"/>
        </div>
        <!-- 外层圆 -->
        <div class="cicleBox center">
          <div 
            ref="upBtn"
            class="direction" 
            @touchstart="controlStart('up')"
            @touchmove="controlMove('up')"
            @touchend="controlEnd('up')"
          >
            <div class="dot"/>
          </div>
          <div 
            ref="rightBtn"
            class="direction"
            @touchstart="controlStart('right')"
            @touchmove="controlMove('right')"
            @touchend="controlEnd('right')"
          >
            <div class="dot"/>
          </div>
          <div 
            ref="downBtn"
            class="direction" 
            @touchstart="controlStart('down')"
            @touchmove="controlMove('down')"
            @touchend="controlEnd('down')"
          >
            <div class="dot"/>
          </div>
          <div 
            ref="leftBtn"
            class="direction" 
            @touchstart="controlStart('left')"
            @touchmove="controlMove('left')"
            @touchend="controlEnd('left')"
          >
            <div class="dot"/>
          </div>
          <div 
            ref="centerbox"
            class="centerbox" 
            @touchstart="controlStart('centerbox')"
            @touchmove="controlMove('centerbox')"
            @touchend="controlEnd('centerbox')"
          >
            <div class="btnok">OK</div>
          </div>
        </div>
      </div>
      <div class="bootom">
        <!-- 返回上一页 -->
        <div class="btn-wrap">
          <div 
            ref="menu"
            class="btn-menu btn" 
            @touchstart="touchstart('menu')"
            @touchend="touchend('menu')"/>
          <div 
            ref="home"
            class="btn-home btn" 
            @touchstart="touchstart('home')"
            @touchend="touchend('home')"
          />
          <div
            ref="back" 
            class="btn-back btn"
            @touchstart="touchstart('back')"
            @touchend="touchend('back')"/>
        </div>
        <!-- 音量加减 -->
        <div
          class="voice bottomBtn">
          <div
            ref="decrease"
            class="btn-decrease center"
            @touchstart="touchstart('decrease')"
            @touchend="touchend('decrease')"
          />
          <div
            ref="increase"
            class="btn-increase center"
            @touchstart="touchstart('increase')"
            @touchend="touchend('increase')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import _ from './utils'
export default {
  data() {
    return {
      loaclVoice:''
    }
  },
  computed: {
    ...mapGetters(['isClose', 'isOffline']),
    ...mapState(['device', 'deviceAttrs']),
  },
  watch: {
    "deviceAttrs"(){
      // 获取刚进入页面时的音量
      this.loaclVoice = this.deviceAttrs.voice
    },
    'deviceAttrs.voice'() {
      if(this.deviceAttrs.voice) {
        this.setVoiceDis = false
      }
    },
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
        .then(() => {
        })
      HdSmart.UI.setStatusBarColor(2)
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    // 滚动事件
    touchstart(val) {
      if (val == 'switchStatus') {
        if (this.isOffline) return
      }else{
        if (this.isOffline) return
      }
      this.$refs[val].classList.add('animateStart')
    },
    touchend(val){ 
      if (val == 'switchStatus') {
        if (this.isOffline) return
      }else{
        if (this.isOffline) return
      }
      this.$refs[val].classList.add('animateEnd')
      this.$refs[val].classList.remove('animateStart')
      setTimeout(() => {
         this.$refs[val].classList.remove('animateEnd')
      }, 500)
      if(val=='switchStatus'){
        this.setSwitch()
      }else if(val=='increase'||val=='decrease'){
        this.setVoice(val)
      }else{
        this.setBack(val)
      }
    },
    // 返回主页
    setBack(val){
      HdSmart.UI.vibrate()
      if (val=='mute') {
        let mutestatus = ''
        if (this.deviceAttrs.mute==true) {
          mutestatus = false
        }else{
          mutestatus = true
        }
        if (this.isClose) return
        
       return this.controlDevice('mute',mutestatus)
      }
      return HdSmart.UI.toast('该功能尚未开放')
      this.controlDevice('button',val)
    },
    // 开关机
    setSwitch(){
      if (this.isOffline) return
      HdSmart.UI.vibrate()
      this.controlDevice('switch','off')
    },
    // 方向盘
    controlStart(val){
      if (this.isOffline) return
      HdSmart.UI.vibrate()
      if (val=='centerbox') {
        this.$refs.centerbox.classList.add('active')
      }else{
        this.$refs[val+"Btn"].classList.add('active')
      }
    },
    controlMove(){
    },
    controlEnd(val){
       if (this.isOffline) return
      if (val== 'centerbox') {
        this.$refs.centerbox.classList.remove('active')
        return HdSmart.UI.toast('该功能尚未开放')
        this.controlDevice('button','confirm')
      }else{
        this.$refs[val+"Btn"].classList.remove('active')
        return HdSmart.UI.toast('该功能尚未开放')
        this.controlDevice('point_move',val)
      }
    },
    // 音量加减
    setVoice:_.debounce(function(val){
      HdSmart.UI.vibrate()
      if (val=='increase') {
        console.log(this.deviceAttrs.voice,'数字');
        if (this.isClose) return
        this.controlDevice('voice',+this.loaclVoice+1)
        .then((res)=>{
          if (res.code==0) {
            this.loaclVoice = +this.loaclVoice+1
          }
        })
      }else{
        if (this.isClose) return
        this.controlDevice('voice',+this.loaclVoice-1)
        .then((res)=>{
          if (res.code==0) {
            this.loaclVoice = +this.loaclVoice-1
          }
        })
      }
      
    },300),
    controlDevice(attr, value) {
      let param = {}
      return this.doControlDevice({
        nodeid: `airconditioner.main.${attr}`,
        params: {
          attribute: {
            [attr]: value,
            ...param
          }
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
@imgPath:"base/konka_tv/assets";
  .page {
    height: 100vh;
  &::before{
    content: "";
    background-image: url('~@lib/@{imgPath}/img_bg.png');
    background-repeat:no-repeat;
    background-size: 100% 100%;
    position: fixed;
    top:0;
    left: 0; 
    right: 0;
    bottom: 0;
    z-index: -1;
  }
  &::-webkit-scrollbar {
		display: none;
	}
  &.filter {
    filter: blur(12px);
  }
      .btn-wrap {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 0 76px;
      .btn {
        box-sizing: border-box;
        width: 120px;
        height: 120px;
        // border: 1px solid #818181;
        background: rgba(0,0,0,0.05);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        &::before {
          position: relative;
          z-index: 100;
          content: "";
          display: block;
          width: 48px;
          height: 48px;
        }
        &.active {
          // background: #E1B96E;
          &.btn-mute{
            &::before {
              position: relative;
              z-index: 100;
              background-image: url('~@lib/@{imgPath}/jingyin.png');
              background-size: 100% 100%;
            }
          }
        }
      }
      .btn-home {
        &::before {
          position: relative;
          z-index: 100;
          background-image: url('~@lib/@{imgPath}/home.png');
          background-size: 100% 100%;
        }
      }
      .btn-off {
        &::before {
          position: relative;
          z-index: 100;
          background-image: url('~@lib/@{imgPath}/off.png');
          background-size: 100% 100%;
        }
      }
      .btn-mute {
        &::before {
          position: relative;
          z-index: 100;
          background-image: url('~@lib/@{imgPath}/mute.png');
          background-size: 100% 100%;
        }
      }
      .btn-back {
        &::before {
          position: relative;
          z-index: 100;
          background-image: url('~@lib/@{imgPath}/back.png');
          background-size: 100% 100%;
        }
      }
      .btn-menu {
        &::before {
          position: relative;
          z-index: 100;
          background-image: url('~@lib/@{imgPath}/menu.png');
          background-size: 100% 100%;
        }
      }
    }
  .main {
    margin-top:100px;
    &.center{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
      /*********** 按钮 ***********/
    .cicleBox{
      width: 534px;
      height: 534px;
      border-radius: 50%;
      background: rgba(0,0,0,0.07);
      margin-top: 48px;
      position: relative;
      overflow: hidden;
      .centerbox{
        width: 260px;
        height: 260px;
        // border-radius: 260px 0 0 0;
        position: absolute;
        transform-origin: 100% 100%;
        border-radius: 50%;
        transform-origin: 0 0;
        background: rgba(255, 255, 255, 0.5);
        z-index: 999;
        &.active{
           background: rgba(255, 255, 255, 0.7);
           .btnok{
             color: #E1B96E;
           }
        }
        .btnok{
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: PingFangSC-Regular;
          font-size: 40px;
          color: #000000;
          border-radius: 50%;
         }
        }
      .direction{
        width: 267px;
        height: 267px;
        border-radius: 267px 0 0 0;
        position: absolute;
        transform-origin: 100% 100%;
        &.active{
          background: -webkit-radial-gradient(right bottom, transparent 35%, rgba(0,0,0,0.03) 35%);
          z-index: 99;
          .dot{
            background-image: linear-gradient(0deg, #E1B96E 0%, #F1CB85 100%);
          }
        }
        .dot{
          width: 24px;
          height: 24px;
          position: absolute;
          left: 50%;
          top: 50%;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255,255,255,0.50);
        }
        &:first-of-type{
          transform: rotate(45deg);
          left: 0px;
          top: 0px;
        }
        &:nth-of-type(2){
          transform: rotate(135deg);
          left: 0px;
          top: 0px;
        }
        &:nth-of-type(3){
          transform: rotate(225deg);
          left: 0px;
          top: 0px;
        }
        &:nth-of-type(4){
          transform: rotate(315deg);
          top: 0px;
          left: 0px;
        }
      }
    }
  }
.bootom{
  margin-top:64px;
  .bottomBtn{
    background: rgba(0,0,0,0.05);
    border-radius: 60px;
    width: 590px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .voice{
    margin: 64px auto 48px;
    .center{
      &::before {
        position: relative;
        z-index: 100;
        content: "";
        display: block;
        width: 48px;
        height: 48px;
        background-size: 100% 100%;
      }
    }
    .btn-decrease{
      width: 294px;
      height: 100%;
      border-right: 1px solid rgba(0,0,0,0.08);
      &::before {
        background-image: url('~@lib/@{imgPath}/reduce.png');
      }
    }
    .btn-increase{
      width: 295px;
      height: 100%;
      &::before{
        background-image: url('~@lib/@{imgPath}/add.png');
      }
    }
  }
  .back{
    margin: 0 auto 208px;
      &::before {
        position: relative;
        z-index: 100;
        content: "";
        display: block;
        width: 48px;
        height: 48px;
        background-image: url('~@lib/@{imgPath}/back.png');
        background-size: 100% 100%;
      }
  }
  }
  /*隐藏掉滚动条*/
	.panel-btn::-webkit-scrollbar {
		display: none;
	}

  &.close,
  &.offline.cover {
    &:before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      width: 100%;
    }
  }
}
</style>