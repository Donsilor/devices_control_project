<template>
  <div class="body">
    <div 
      :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']" 
    >
      <NewTopBar
        :title="device.device_name"
        :room="device.room_name"
        :scroll="true"
        bak-color="#000"
        page-class=".page"
      />
      <StatusTip v-show="device.device_uuid"/>
      <div class="main center"> 
        <div class="box">上升</div>
        <div class="box">暂停</div>
        <div class="box">下降</div>
      </div>
      <div class="bottom">
        <div class="light">
          <div class="light_left">照明</div>
          <div class="light_right">
            <input
              :checked="checkboxVal"
              class="switch switch-anim"
              type="checkbox"
              @click="lock">
          </div>
        </div>
        <div class="air_drying">2</div>
        <div class="sterilization">3</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      checkboxVal: true
    }
  },
  computed: {
    ...mapGetters(['isClose', 'isOffline']),
    ...mapState(['device', 'deviceAttrs']),
  },
  watch: {
    "device.stateChange"(){
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
        if (this.deviceAttrs.switchStatus=='off'||this.isOffline) return
      }
      this.$refs[val].classList.add('animateStart')
    },
    touchend(val){ 
      if (val == 'switchStatus') {
        if (this.isOffline) return
      }else{
        if (this.deviceAttrs.switchStatus=='off'||this.isOffline) return
      }
      this.$refs[val].classList.add('animateEnd')
      this.$refs[val].classList.remove('animateStart')
      setTimeout(() => {
         this.$refs[val].classList.remove('animateEnd')
      }, 300)
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
      this.controlDevice('button',val)
    },
    // 开关机
    setSwitch(){
      if (this.isOffline) return
      HdSmart.UI.vibrate()
      let switchstatus = ''
      if (this.deviceAttrs.switchStatus=='on') {
        switchstatus = 'off'
      }else{
        switchstatus = 'on'
      }
      this.controlDevice('switch',switchstatus)
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
    lock(e) {
      HdSmart.UI.vibrate()
      console.log(e.target.checked, '==========')
    },
    controlEnd(val){
      if (val== 'centerbox') {
        this.$refs.centerbox.classList.remove('active')
        this.controlDevice('button','confirm')
      }else{
        this.$refs[val+"Btn"].classList.remove('active')
        this.controlDevice('point_move',val)
      }
    },
    // 音量加减
    setVoice(val){
      HdSmart.UI.vibrate()
      this.controlDevice('voice',val)
    },
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
  .main {
    margin-top:100px;
    .box{
      width: 192px;
      height: 192px;
      background: rgba(0,0,0,0.04);
      border-radius: 50%;
      text-align: center;
      line-height: 192px;
      font-size: 64px;
      margin-bottom: 20px
    }
    &.center{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
      /*********** 按钮 ***********/
  }
}
  .bottom{
  
      padding: 0 40px;

    .light{
      display: flex;
      justify-content: space-between
    }
  }




  .switch {
            width: 74px;
            height: 28px;
            position: relative;
            border: 1px solid transparent;
            // background-color: #fdfdfd;
            box-shadow: #dfdfdf 0 0 0 0 inset;
            border-radius: 20px;
            background-clip: content-box;
            display: inline-block;
            -webkit-appearance: none;
            user-select: none;
            outline: none;
            background-color: rgba(0, 0, 0, 0.1);
        }
        .switch:before {
            content: '';
            width: 40px;
            height: 40px;
            position: absolute;
            top: -8px;
            left: 0;
            border-radius: 20px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
            background: #000;
        }
        .switch:checked {
            border-color: #E1B96E;
            box-shadow: #E1B96E 0 0 0 16px inset;
            background-color: #E1B96E;
        }
        .switch:checked:before {
            left: 30px;
            background: #000000;
        }
        .switch.switch-anim {
            transition: border cubic-bezier(0, 0, 0, 1) 0.4s, box-shadow cubic-bezier(0, 0, 0, 1) 0.4s;
        }
        .switch.switch-anim:before {
            transition: left 0.3s;
        }
        .switch.switch-anim:checked {
            // box-shadow: #64bd63 0 0 0 16px inset;
            // background-color: #64bd63;
            transition: border ease 0.4s, box-shadow ease 0.4s, background-color ease 1.2s;
        }
        .switch.switch-anim:checked:before {
            transition: left 0.3s;
        }
</style>