<template xmlns:v-longpress="http://www.w3.org/1999/xhtml">
  <div class="body">
    <div :class="[{'offline': isOffline || networkStatus == -1 }, {'close': isClose}, 'page']">
      <!-- 顶部 -->
      <topbar
        :title="device.device_name"
        :room="argv_is_mock?'':device.room_name"
        :show-right="argv_is_mock?false:true"
        page-class=".page" />
      <StatusTip @OfflineHelpPage="OfflineHelpPage"/>
      <!-- 灯 -->
      <div class="main center">
        <div class="bg center">

          <div
            v-longpress:[one]="showMode"
            v-if="deviceAttrs.list"
            :class="['panel', {'panelActive': deviceAttrs.list[0].chan_status == 'on'}, {'panelOne': (deviceAttrs.chan_num == 1 || deviceAttrs.chan_num == 2) && deviceAttrs.list && (deviceAttrs.list.length == 1 || deviceAttrs.list.length == 2)}, {'raidusOne': deviceAttrs.chan_num == 1 && deviceAttrs.list && deviceAttrs.list.length == 1}, 'panel-left']"
            data-id="one"
            @click="touchstart('one')"
          >
            <div
              class="panel-btn center">
              <div
                :class="['btn-wrap', 'btn-wrap-four', {'btn-wrap-one': (deviceAttrs.chan_num == 1 || deviceAttrs.chan_num == 2) && deviceAttrs.list && (deviceAttrs.list.length == 1 || deviceAttrs.list.length == 2)}]">
                <div
                  :class="['btn-name', 'tis', {'tisActive': deviceAttrs.list[0].chan_status == 'on'}]"
                />
                <div
                  ref="one"
                  :class="['btn-switch', 'center', {'active': deviceAttrs.list[0].chan_status == 'on'}]"
                />
                <div class="btn-name">{{ deviceAttrs.list[0].chan_name?switchTitle0:'左键' }}</div>
              </div>
            </div>
          </div>
          <div
            v-longpress:[two]="showMode"
            v-if="deviceAttrs.chan_num != 1 && deviceAttrs.list && deviceAttrs.list[1]"
            :class="['panel', {'panelActive': deviceAttrs.list[1].chan_status == 'on'}, 'radiusTwo', {'panelTwo': deviceAttrs.chan_num == 2 && deviceAttrs.list && deviceAttrs.list.length == 2}, 'panel-left']"
            data-id="two"
            @click="touchstart('two')"
          >
            <div class="panel-btn center">
              <div :class="['btn-wrap', 'btn-wrap-four', {'btn-wrap-two': deviceAttrs.chan_num == 2 && deviceAttrs.list && deviceAttrs.list.length == 2}]">
                <div
                  :class="['btn-name', 'tis', {'tisActive': deviceAttrs.list[1].chan_status == 'on'}]"
                />
                <div
                  ref="two"
                  :class="['btn-switch', 'center', {'active': deviceAttrs.list[1].chan_status == 'on'}]"
                />
                <div class="btn-name">{{ deviceAttrs.list[1].chan_name?switchTitle1:'右键' }}</div>
              </div>
            </div>
          </div>
          <div
            v-longpress:[three]="showMode"
            v-if="deviceAttrs.chan_num != 1 && deviceAttrs.chan_num != 2 && deviceAttrs.list && deviceAttrs.list[2]"
            :class="['panel', {'panelActive': deviceAttrs.list[2].chan_status == 'on'}, {'panelThree': deviceAttrs.chan_num == 3 && deviceAttrs.list && deviceAttrs.list.length == 3}, 'panel-left', 'panel-right']"
            data-id="three"
            @click="touchstart('three')"
          >
            <div class="panel-btn center">
              <div :class="['btn-wrap', 'btn-wrap-four', {'btn-wrap-three': deviceAttrs.chan_num == 3 && deviceAttrs.list && deviceAttrs.list.length == 3}]">
                <div
                  :class="['btn-name', 'tis', {'tisActive': deviceAttrs.list[2].chan_status == 'on'}]"
                />
                <div
                  ref="three"
                  :class="['btn-switch', 'center', {'active': deviceAttrs.list[2].chan_status == 'on'}]"
                />
                <div class="btn-name">{{ deviceAttrs.list[2].chan_name?switchTitle2:'开关3' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 按钮 -->
      <!--弹框-->
      <model-swing
        ref="swing"
        :num="num"
        :argv_is_mock="argv_is_mock"
        @setWind="setWind" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import modelSwing from './components/model-swing'

export default {
  components: {
    modelSwing
  },
  data() {
    return {
      argv_is_mock: false,
      flag: true,
      flagOff: true,
      timeOutEvent: '',
      timeOutEventOK: false,
      num: ''
    }
  },
  computed: {
    ...mapGetters(['isClose', 'isOffline', 'networkStatus']),
    ...mapState(['device', 'deviceAttrs']),
    switchTitle0() {
      if(this.deviceAttrs.list[0].chan_name) {
        if(this.deviceAttrs.list[0].chan_name.length > 6) {
          return this.deviceAttrs.list[0].chan_name.slice(0,6) + '...'
        } else {
          return this.deviceAttrs.list[0].chan_name
        }
      }
    },
    switchTitle1() {
      if(this.deviceAttrs.list[1].chan_name) {
        if(this.deviceAttrs.list[1].chan_name.length > 6) {
          return this.deviceAttrs.list[1].chan_name.slice(0,6) + '...'
        } else {
          return this.deviceAttrs.list[1].chan_name
        }
      }
    },
    switchTitle2() {
      if(this.deviceAttrs.list[2].chan_name) {
        if(this.deviceAttrs.list[2].chan_name.length > 6) {
          return this.deviceAttrs.list[2].chan_name.slice(0,6) + '...'
        } else {
          return this.deviceAttrs.list[2].chan_name
        }
      }
    },
    switchTitle3() {
      if(this.deviceAttrs.list[3].chan_name) {
        if(this.deviceAttrs.list[3].chan_name.length > 6) {
          return this.deviceAttrs.list[3].chan_name.slice(0,6) + '...'
        } else {
          return this.deviceAttrs.list[3].chan_name
        }
      }
    },
  },
  watch: {
  },
  created() {
    this.argv_is_mock = argv_is_mock
    HdSmart.ready(() => {
      this.getDeviceInfo()
      .catch((err) => {
        if(err.code == -90004) {
          HdSmart.UI.toast('网络超时，请重试')
        }
      })
      HdSmart.UI.setStatusBarColor(2)
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    // 路由跳转
    OfflineHelpPage(){
        this.$router.push({
         path:"/OfflineHelpPage"
       })
    },
    touchstart(val) {
      if(this.isOffline|| this.networkStatus == -1) return
      this.$refs[val].classList.remove('animate')
      this.$refs[val].classList.add('animate1')
      this.$refs[val].classList.add('bgcStart')
      if(val == 'SwitchOn') {
        this.$refs[val].classList.add('yellowExtend')
      }
      if(val == 'SwitchOff') {
        this.$refs[val].classList.add('yellowExtend')
      }
      argv_is_mock ? HdSmart.UI.vibrate(true) : HdSmart.UI.vibrate()
      setTimeout(()=>{
        this.touchend(val)
      },300)
    },
    touchend(val){
      if(this.isOffline|| this.networkStatus == -1) return
      this.$refs[val].classList.remove('animate1')
      this.$refs[val].classList.add('animate')
      this.$refs[val].classList.remove('bgcStart')
      if(this.$refs.swing.show == true) return
      if(val == 'one') return this.setSwitch1()
      if(val == 'two') return this.setSwitch2()
      if(val == 'three') return this.setSwitch3()
      if(val == 'four') return this.setSwitch4()
      if(val == 'SwitchOn') return this.setSwitchOn('on')
      if(val == 'SwitchOff') return this.setSwitchOff('off')
    },
    showMode(val) {
      this.num = val
      this.$refs.swing.show = true
      // this.timeOutEventOK = false
    },
    setWind(val) {
      if(this.num == 'one') {
        this.deviceAttrs.list[0].chan_name = val
        this.$refs.swing.show = false
      }
      if(this.num == 'two') {
        this.deviceAttrs.list[1].chan_name = val
        this.$refs.swing.show = false
      }
      // if(this.num == 'one') return this.controlDevice("chan0_name", val, 'on')
      // .then((res) => {
      //   if(res.code == 0) {
      //     this.$refs.swing.show = false
      //   }
      //   if(res == null){
      //      HdSmart.UI.toast('请求超时，请重试')
      //   }
      // })
      // if(this.num == 'two') return this.controlDevice("chan1_name", val, 'on')
      // .then((res) => {
      //   if(res.code == 0) {
      //     this.$refs.swing.show = false
      //   }
      //   if(res == null){
      //      HdSmart.UI.toast('请求超时，请重试')
      //   }
      // })
      // if(this.num == 'three') return this.controlDevice("chan2_name", val, 'on')
      // .then((res) => {
      //   if(res.code == 0) {
      //     this.$refs.swing.show = false
      //   }
      //   if(res == null){
      //      HdSmart.UI.toast('请求超时，请重试')
      //   }
      // })
      // if(this.num == 'four') return this.controlDevice("chan3_name", val, 'on')
      // .then((res) => {
      //   if(res.code == 0) {
      //     this.$refs.swing.show = false
      //   }
      //   if(res == null){
      //      HdSmart.UI.toast('请求超时，请重试')
      //   }
      // })
    },
    // setSwitchOn(val) {
    //   if(this.isOffline|| this.networkStatus == -1) return
    //   if(this.flagOn == false) return
    //   if(this.deviceAttrs.list[0].chan_status == 'on' && this.deviceAttrs.list[1].chan_status == 'on' && this.deviceAttrs.list[2].chan_status == 'on' && this.deviceAttrs.list[3].chan_status == 'on') return
    //   this.flagOn = false
    //   this.controlDevice("switch_chan", val)
    //   .then((res) => {
    //     if(res == null){
    //        HdSmart.UI.toast('请求超时，请重试')
    //     }
    //   })
    // },
    // setSwitchOff(val) {
    //   if(this.isOffline|| this.networkStatus == -1) return
    //   if(this.flagOff == false) return
    //   if(this.deviceAttrs.list[0].chan_status == 'off' && this.deviceAttrs.list[1].chan_status == 'off' && this.deviceAttrs.list[2].chan_status == 'off' && this.deviceAttrs.list[3].chan_status == 'off') return
    //   this.flagOff = false
    //   this.controlDevice("switch_chan", val)
    //   .then((res) => {
    //     if(res == null){
    //        HdSmart.UI.toast('请求超时，请重试')
    //     }
    //   })
    // },
    setSwitch1() {
      if(this.isOffline|| this.networkStatus == -1) return
      if(this.flagOn == false || this.flagOff == false) return
      let switchStatus = ''
      if (this.deviceAttrs.list[0].chan_status == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.deviceAttrs.list[0].chan_status = switchStatus
      // this.controlDevice("switch_chan0", switchStatus)
      // .then((res) => {
      //   if(res == null){
      //      HdSmart.UI.toast('请求超时，请重试')
      //   }
      // })
    },
    setSwitch2() {
      if(this.isOffline|| this.networkStatus == -1) return
      if(this.flagOn == false || this.flagOff == false) return
      let switchStatus = ''
      if (this.deviceAttrs.list[1].chan_status == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.deviceAttrs.list[1].chan_status = switchStatus
      // this.controlDevice("switch_chan1", switchStatus)
      // .then((res) => {
      //   if(res == null){
      //      HdSmart.UI.toast('请求超时，请重试')
      //   }
      // })
    },
    // setSwitch3() {
    //   if(this.isOffline|| this.networkStatus == -1) return
    //   if(this.flagOn == false || this.flagOff == false) return
    //   let switchStatus = ''
    //   if (this.deviceAttrs.list[2].chan_status == 'on') {
    //     switchStatus = 'off'
    //   } else {
    //     switchStatus = 'on'
    //   }
    //   this.controlDevice("switch_chan2", switchStatus)
    //   .then((res) => {
    //     if(res == null){
    //        HdSmart.UI.toast('请求超时，请重试')
    //     }
    //   })
    // },
    // setSwitch4() {
    //   if(this.isOffline|| this.networkStatus == -1) return
    //   if(this.flagOn == false || this.flagOff == false) return
    //   let switchStatus = ''
    //   if (this.deviceAttrs.list[3].chan_status == 'on') {
    //     switchStatus = 'off'
    //   } else {
    //     switchStatus = 'on'
    //   }
    //   this.controlDevice("switch_chan3", switchStatus)
    //   .then((res) => {
    //     if(res == null){
    //        HdSmart.UI.toast('请求超时，请重试')
    //     }
    //   })
    // },
    controlDevice(attr, value, param) {
      if(param) {
        return this.doControlDevice({
          nodeid: `switch.main.chan_config`,
          params: {
            attribute: {
              [attr]: value
            }
          }
        })
      } else {
        return this.doControlDevice({
          nodeid: `switch.main.switch`,
          params: {
            attribute: {
              [attr]: value
            }
          }
        })
      }
    },
  },
}
</script>

<style lang="less" scoped>
@imgPath: 'base/honghan_switch/assets';
@imgPath1: 'base/oakes_air_condition/assets';
@100: 100% 100%;
*{ -webkit-tap-highlight-color:transparent; }
.page {
  &::before{
    content: "";
    // background-image: url('~@lib/@{imgPath1}/img_bg.png');
    // background-repeat:no-repeat;
    // background-size: 100% 100%;
    background: #000;
    position: fixed;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }
  &.filter {
    filter: blur(12px);
  }
  .main {
    margin-top: 200px;
    position: relative;
    .bg {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }
  }
  .panel {
    background: rgba(255,255,255,0.1);
    width: 208px;
    height: 632px;
    display: flex;
    margin-bottom: 14px;
    margin-right: 2px;
    border-radius: 15px 0 0 15px;
    border: 0.5px solid rgba(255,255,255,0.15);
  }
  .panel-right {
    margin-right: 0;
  }
  .raidusOne {
    border-radius: 15px;
  }
  .radiusTwo {
    border-radius: 0;
  }
  .panelActive {
    background: rgba(255,255,255,0.15);
    border: 0.5px solid rgba(255,255,255,0.2);
  }
  .panelOne {
    width: 314px;
  }
  .panelTwo {
    width: 314px;
    border-radius: 0 15px 15px 0;
  }
  .panelThree {
    border-radius: 0 15px 15px 0;
  }
  .panel-btn {
    padding: 40px 0;
    z-index: 999;
    background: transparent;
    flex-wrap: wrap;
    justify-content: space-evenly;
    .btn {
      margin-top: 24px;
      width: 100%;
      border-radius: 40px 40px 0 0;
      background: rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
    }
  }
  .btn-wrap {
    &.btn-wrap-four {
      width: 208px;
    }
    &.btn-wrap-one {
      width: 314px;
    }
    &.btn-wrap-two {
      width: 314px;
    }
    .btn {
      box-sizing: border-box;
      margin: 0 auto;
      width: 120px;
      height: 120px;
      border: 1px solid rgba(0,0,0,0);
      border-radius: 50%;
      display: flex;
      flex-direction: column;
    }
    .btn-name {
      text-align: center;
      color: rgba(255, 255, 255, 0.3);
      margin-top: 20px;
      font-size: 24px;
      font-weight: lighter;
    }
    .tis {
      margin: 0 auto 442px;
      width: 32px;
      height: 32px;
      &::before {
        content: "";
        display: block;
        width: 32px;
        height: 32px;
        background-image: url('~@lib/@{imgPath}/new_kg_img_off.png');
        background-size: @100;
      }
    }
    .tisActive {
      &::before {
        background-image: url('~@lib/@{imgPath}/new_kg_img_on.png')
      }
    }
    .btn-switch {
      width: 40px;
      height: 40px;
      margin:  0 auto;
      &::before {
        content: "";
        display: block;
        width: 40px;
        height: 40px;
        background-image: url('~@lib/@{imgPath}/new_kg_btn_off.png');
        background-size: @100;
      }
      &.active {
        &::before {
          background-image: url('~@lib/@{imgPath}/new_kg_btn_on.png')
        }
      }
    }
  }
  &.offline {
    overflow: hidden;
    &:before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      width: 100%;
    }
    .panel-btn {
      background: transparent;
    }
    .btn-wrap {
      opacity: 0.2;
      .btn {
        &.active {
          background: #fff;
          border: 1px solid rgba(32,40,43,0.5);
        }
      }
    }
  }
}
.btn-add {
  &::before {
    content: "";
    display: block;
    width: 48px;
    height: 48px;
    background-image: url('~@lib/@{imgPath}/kg_btn_peizhi.png');
    background-size: @100;
  }
  &.active {
    &::before {
      background-image: url('~@lib/@{imgPath}/kg_btn_peizhi.png')
    }
  }
}
.add-name {
  margin-top: 20px;
  font-size: 24px;
  color: #000000;
  text-align: center;
}
.animate::before{
  animation: scale 0.3s;
}
.animate1::before{
  animation: scale1 0.15s;
  animation-fill-mode : forwards;
}
@keyframes scale1 {
  0%{
    transform: scale(1);
  }
  100%{
    transform: scale(0.6);
  }
}
@keyframes scale {
  0%{
    transform: scale(0.6);
  }
  66%{
    transform: scale(1.2);
  }
  100%{
  transform: scale(1);
  }
}


  .yellowExtend{
    position: relative;
    &::after{
      content: '';
      position: absolute;
      width: 70%;
      height: 70%;
      // background-image: linear-gradient(221deg, #F1CB85 10%, #E1B96E 81%);
      background: #E1B96E;
      top: 50%;
      left: 50%;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: yellowExtendAnimate .15s 1;
      animation-fill-mode: forwards;
      animation-timing-function: ease-out;
      z-index: 99
    }
  }
  @keyframes yellowExtendAnimate {
    0% {width: 0%;height: 0%;}

    100% {width: 100%;height: 100%;}
  }
  .bgcStart{
    position: relative;
    &::after{
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.1);
      top: 50%;
      left: 50%;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: bgcStart .15s 1;
       animation-fill-mode : forwards;
       animation-timing-function: ease-out;
      z-index: 99
    }
  }
  @keyframes bgcStart {
    0% {width: 100%;height: 100%;}
    100% {width: 170%;height: 170%;}
  }
</style>
