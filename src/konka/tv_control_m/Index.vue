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
        page-class=".page"
      />
      <StatusTip @OfflineHelpPage="OfflineHelpPage"/>
      <div class="main center">
        <div class="btn-wrap">
          <!-- 关机 -->
          <div
            ref="switchStatus"
            class="btn-off btn"
            @touchstart="setSwitchStart('switchStatus')"
            @touchend="setSwitchEnd('switchStatus')"/>
          <!-- 静音 -->
          <div
            ref="mute"
            class="btn-mute btn"
            @touchstart="setBackStart('mute')"
            @touchend="setBackEnd('mute')"/>
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
            @touchstart="setBackStart('menu')"
            @touchend="setBackEnd('menu')"/>
          <div
            ref="home"
            class="btn-home btn"
            @touchstart="setBackStart('home')"
            @touchend="setBackEnd('home')"
          />
          <div
            ref="back"
            class="btn-back btn"
            @touchstart="setBackStart('back')"
            @touchend="setBackEnd('back')"/>
        </div>
        <!-- 音量加减 -->
        <div
          class="voice bottomBtn">
          <div
            ref="decrease"
            class="btn-decrease center"
            @touchstart="setVoiceStart('decrease')"
            @touchend="setVoiceEnd('decrease')"
          />
          <div
            ref="increase"
            class="btn-increase center"
            @touchstart="setVoiceStart('increase')"
            @touchend="setVoiceEnd('increase')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
// import _ from './utils'
export default {
  data() {
    return {
      loaclAttrs:{},
      flag:false,
      time: 0
    }
  },
  computed: {
    ...mapGetters(['isClose', 'isOffline']),
    ...mapState(['device', 'deviceAttrs']),
  },
  watch: {
    'device.stateChange'() {
      // 获取刚进入页面时的音量
      console.log('=========123')
      if(this.flag == false) {
        this.loaclAttrs = this.deviceAttrs
      }
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
          this.loaclAttrs = this.deviceAttrs
        })
      HdSmart.UI.setStatusBarColor(2)
    })
  },
  mounted() {
    this.$nextTick(()=>{
      // 针对不同手机调整按钮的位置
          let btnHeight = document.documentElement.clientHeight
          let main = document.querySelectorAll('.main')[0]
          let bottomBtn = document.querySelectorAll('.bootom')[0]
          // let Btn = document.documentElement.className('.btn')
          if (btnHeight>=812) {
            main.style.transform =  "scale(1)"
          }else if(btnHeight>=667){
            main.style.transform =  "scale(0.9)"
            main.style.marginTop =  "10px"
            bottomBtn.style.marginTop =  0
            bottomBtn.style.transform =  "scale(0.9)"
          }else{
            main.style.transform =  "scale(0.9)"
            main.style.marginTop =  "0px"
            bottomBtn.style.marginTop =  0
            bottomBtn.style.transform =  "scale(0.9)"
          }
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    OfflineHelpPage(){
        this.$router.push({
         path:"/OfflineHelpPage"
       })
    },
    // 返回主页,静音
    setBackStart(val){
      HdSmart.UI.vibrate()
        this.$refs[val].classList.add('active')
    },
    setBackEnd(val){
      this.$refs[val].classList.remove('active')
      if (this.isOffline||this.deviceAttrs.switch=='off') return
      if (val=='mute') {
      let mutestatus = ''
      if (this.deviceAttrs.mute==true) {
        mutestatus = false
      }else{
        mutestatus = true
      }
      if (this.isClose) return

      this.controlDevice('mute',mutestatus)
        .then((res)=>{
          if (res.code==0) {
            this.loaclAttrs.mute = mutestatus
          }else{
            return HdSmart.UI.toast('操作失败,请稍后再试')
          }
        })
        return
      }else if(val=='menu'){
        if (this.isClose) return
        this.controlDevice('tv_key','82')
      }else if(val=='home'){
        if (this.isClose) return
        this.controlDevice('tv_key','3')
      }else{
        if (this.isClose) return
        this.controlDevice('tv_key','4')
      }
    },
    // 开关机
    setSwitchStart(val){
      HdSmart.UI.vibrate()
      this.$refs[val].classList.add('active')
    },
     setSwitchEnd(val){
      this.$refs[val].classList.remove('active')
      if (this.isOffline||this.deviceAttrs.switch=='off') return
      this.controlDevice('switch','off')
      .then((res)=>{
        if (res.code != 0) {
          return HdSmart.UI.toast('操作失败,请稍后再试')
        }
      })
    },
    // 方向盘
    controlStart(val){
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
      if (val== 'centerbox') {
        this.$refs.centerbox.classList.remove('active')
        if (this.isClose) return
        this.controlDevice('tv_key','66')
      }else{
        this.$refs[val+"Btn"].classList.remove('active')
        if(val=='up'){
          if (this.isClose) return
          this.controlDevice('tv_key','19')
        }else if(val=='down'){
          if (this.isClose) return
          this.controlDevice('tv_key','20')
        }else if(val=='left'){
          if (this.isClose) return
          this.controlDevice('tv_key','21')
        }else{
          if (this.isClose) return
          this.controlDevice('tv_key','22')
        }
      }
    },
    // 音量加减
    setVoiceStart(val){
      HdSmart.UI.vibrate()
      this.$refs[val].classList.add('active')
    },
    setVoiceEnd(val){
      this.$refs[val].classList.remove('active')
      if (this.isOffline||this.deviceAttrs.switch=='off') return
        this.flag = true
      clearTimeout(this.time)
      this.time = setTimeout(() =>{
        this.flag = false
      }, 500)
      if (val=='increase') {
        console.log(this.deviceAttrs.voice,'数字')
        if (this.isClose || this.loaclAttrs.voice >=100) return
        this.controlDevice('voice',+this.loaclAttrs.voice+1)
        .then((res)=>{
          if (res.code != 0) {
            return HdSmart.UI.toast('操作失败,请稍后再试')
          }
        })
        this.loaclAttrs.voice = +this.loaclAttrs.voice+1
      }else{
        if (this.isClose || this.loaclAttrs.voice <=0) return
        this.controlDevice('voice',+this.loaclAttrs.voice-1)
        .then((res)=>{
          if (res.code != 0) {
            return HdSmart.UI.toast('操作失败,请稍后再试')
          }
        })
        this.loaclAttrs.voice = +this.loaclAttrs.voice-1
      }
    },
    controlDevice(attr, value) {
      console.log(attr,value,'ccccccccccc')

      let param = {}
      return this.doControlDevice({
        nodeid: `airconditioner.main.${attr}`,
        params: {
          attribute: {
            [attr]: value,
            ...param
          }
        },
        // hideLoading:true
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
    // background-image: url('~@lib/@{imgPath}/img_bg.png');
    // background-repeat:no-repeat;
    // background-size: 100% 100%;
    background: #000000;
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
        background: rgba(225,225,225,0.1);
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
          background-size: 100% 100%;
        }
        &.active {
          &.btn-mute{
            &::before {
              background-image: url('~@lib/@{imgPath}/tv_btn_jingyin_pressed.png');
            }
          }
          &.btn-home{
            &::before {
              background-image: url('~@lib/@{imgPath}/tv_btn_home_pressed.png');
            }
          }
          &.btn-off{
            &::before {
              background-image: url('~@lib/@{imgPath}/tv_btn_switch_pressed.png');
            }
          }
          &.btn-back{
            &::before {
              background-image: url('~@lib/@{imgPath}/tv_btn_back_pressed.png');
            }
          }
          &.btn-menu{
            &::before {
              background-image: url('~@lib/@{imgPath}/tv_btn_menu_pressed.png');
            }
          }
        }
      }
      .btn-home {
        &::before {
          background-image: url('~@lib/@{imgPath}/tv_btn_home.png');
        }
      }
      .btn-off {
        &::before {
          background-image: url('~@lib/@{imgPath}/tv_btn_switch.png');
        }
      }
      .btn-mute {
        &::before {
          background-image: url('~@lib/@{imgPath}/tv_btn_jingyin.png');
        }
      }
      .btn-back {
        &::before {
          background-image: url('~@lib/@{imgPath}/tv_btn_back.png');
        }
      }
      .btn-menu {
        &::before {
          background-image: url('~@lib/@{imgPath}/tv_btn_menu.png');
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
      background: rgba(255, 255, 255, 0.06);
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
        background: rgba(255, 255, 255, 0.06);
        z-index: 999;
        &.active{
          //  background: rgba(255, 255, 255, 0.7);
           .btnok{
             background-image: linear-gradient(225deg, #F9BB6B 0%, #EF6D5E 100%);
             -webkit-background-clip: text;
             background-clip: text;
             color: transparent;
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
          color: #fff;
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
          background: -webkit-radial-gradient(right bottom, transparent 35%, rgba(255,255,255,0.03) 35%);
          z-index: 99;
          .dot{
            background-image: linear-gradient(225deg, #F9BB6B 0%, #EF6D5E 100%);
          }
        }
        .dot{
          width: 16px;
          height: 16px;
          position: absolute;
          left: 50%;
          top: 50%;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255,255,255,0.1);
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
    background: rgba(255,255,255,0.1);
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
      &.active::before {
        background-image: url('~@lib/@{imgPath}/tv_btn_voicelow_pressed.png');
      }
      &::before {
        background-image: url('~@lib/@{imgPath}/tv_btn_voicelow.png');
      }
    }
    .btn-increase{
      width: 295px;
      height: 100%;
      &.active::before {
        background-image: url('~@lib/@{imgPath}/tv_btn_voicehigh_pressed.png');
      }
      &::before{
        background-image: url('~@lib/@{imgPath}/tv_btn_voicehigh.png');
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
