<template>
  <div class="body">
    <div :class="[{'offline': isOffline || networkStatus == -1 }, {'close': isClose}, 'page']">
      <!-- 顶部 -->
      <topbar
        :title="device.device_name"
        :room="device.room_name"
        bak-color="#000"
        page-class=".page" />
      <StatusTip/>
      <!-- 灯 -->
      <div class="main center">
        <div class="bg center">

          <div
            v-if="deviceAttrs.list"
            :class="['panel', {'panelActive': deviceAttrs.list[0].chan_status == 'on'}, {'panelOne': deviceAttrs.chan_num == 1 && deviceAttrs.list && deviceAttrs.list.length == 1}, 'panel-left']"
            @click="touchstart('one')"
          >
            <div
              class="panel-btn center">
              <div
                :class="['btn-wrap', 'btn-wrap-four', {'btn-wrap-one': deviceAttrs.chan_num == 1 && deviceAttrs.list && deviceAttrs.list.length == 1}]">
                <div
                  :class="['btn-name', 'tis', {'tisActive': deviceAttrs.list[0].chan_status == 'on'}]"
                />
                <div
                  ref="one"
                  :class="['btn-switch', 'center', {'active': deviceAttrs.list[0].chan_status == 'on'}]"
                />
                <div class="btn-name">{{ deviceAttrs.list[0].chan_name?switchTitle0:'开关1' }}</div>
              </div>
            </div>
          </div>
          <!-- 配置开关 -->
          <!-- <div
            v-else
            :class="['panel']"
          >
            <div
              class="panel-btn center">
              <div class="btn-wrap btn-wrap-four">
                <div class="btn-add center" />
                <div class="add-name">配置灯</div>
              </div>
            </div>
          </div> -->
          <div
            v-if="deviceAttrs.chan_num != 1 && deviceAttrs.list && deviceAttrs.list[1]"
            :class="['panel', {'panelActive': deviceAttrs.list[1].chan_status == 'on'}, 'panel-left']"
            @click="touchstart('two')"
          >
            <div class="panel-btn center">
              <div class="btn-wrap btn-wrap-four">
                <div
                  :class="['btn-name', 'tis', {'tisActive': deviceAttrs.list[1].chan_status == 'on'}]"
                />
                <div
                  ref="two"
                  :class="['btn-switch', 'center', {'active': deviceAttrs.list[1].chan_status == 'on'}]"
                />
                <div class="btn-name">{{ deviceAttrs.list[1].chan_name?switchTitle1:'开关2' }}</div>
              </div>
            </div>
          </div>
          <!-- 配置开关 -->
          <!-- <div
            v-else
            :class="['panel']"
          >
            <div
              class="panel-btn center">
              <div class="btn-wrap btn-wrap-four">
                <div class="btn-add center" />
                <div class="add-name">配置灯</div>
              </div>
            </div>
          </div> -->
          <div
            v-if="deviceAttrs.chan_num != 1 && deviceAttrs.chan_num != 2 && deviceAttrs.list && deviceAttrs.list[2]"
            :class="['panel', {'panelActive': deviceAttrs.list[2].chan_status == 'on'}, 'panel-left']"
            @click="touchstart('three')"
          >
            <div class="panel-btn center">
              <div class="btn-wrap btn-wrap-four">
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
          <!-- 配置开关 -->
          <!-- <div
            v-else
            :class="['panel']"
          >
            <div
              class="panel-btn center">
              <div class="btn-wrap btn-wrap-four">
                <div class="btn-add center" />
                <div class="add-name">配置灯</div>
              </div>
            </div>
          </div> -->
        </div>
      </div>
      <!-- 按钮 -->
      <!--弹框-->
      <model-swing
        ref="swing"
        :num="num"
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
      HdSmart.UI.vibrate()
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
      if(this.num == 'one') return this.controlDevice("chan0_name", val, 'on')
      .then((res) => {
        if(res.code == 0) {
          this.$refs.swing.show = false
          this.$refs.swing.txtVal = ''
        }
        if(res == null){
           HdSmart.UI.toast('请求超时，请重试')
        }
      })
      if(this.num == 'two') return this.controlDevice("chan1_name", val, 'on')
      .then((res) => {
        if(res.code == 0) {
          this.$refs.swing.show = false
          this.$refs.swing.txtVal = ''
        }
        if(res == null){
           HdSmart.UI.toast('请求超时，请重试')
        }
      })
      if(this.num == 'three') return this.controlDevice("chan2_name", val, 'on')
      .then((res) => {
        if(res.code == 0) {
          this.$refs.swing.show = false
          this.$refs.swing.txtVal = ''
        }
        if(res == null){
           HdSmart.UI.toast('请求超时，请重试')
        }
      })
      if(this.num == 'four') return this.controlDevice("chan3_name", val, 'on')
      .then((res) => {
        if(res.code == 0) {
          this.$refs.swing.show = false
          this.$refs.swing.txtVal = ''
        }
        if(res == null){
           HdSmart.UI.toast('请求超时，请重试')
        }
      })
    },
    setSwitchOn(val) {
      if(this.isOffline|| this.networkStatus == -1) return
      if(this.flagOn == false) return
      if(this.deviceAttrs.list[0].chan_status == 'on' && this.deviceAttrs.list[1].chan_status == 'on' && this.deviceAttrs.list[2].chan_status == 'on' && this.deviceAttrs.list[3].chan_status == 'on') return
      this.flagOn = false
      this.controlDevice("switch_chan", val)
      .then((res) => {
        if(res == null){
           HdSmart.UI.toast('请求超时，请重试')
        }
      })
    },
    setSwitchOff(val) {
      if(this.isOffline|| this.networkStatus == -1) return
      if(this.flagOff == false) return
      if(this.deviceAttrs.list[0].chan_status == 'off' && this.deviceAttrs.list[1].chan_status == 'off' && this.deviceAttrs.list[2].chan_status == 'off' && this.deviceAttrs.list[3].chan_status == 'off') return
      this.flagOff = false
      this.controlDevice("switch_chan", val)
      .then((res) => {
        if(res == null){
           HdSmart.UI.toast('请求超时，请重试')
        }
      })
    },
    setSwitch1() {
      if(this.isOffline|| this.networkStatus == -1) return
      if(this.flagOn == false || this.flagOff == false) return
      let switchStatus = ''
      if (this.deviceAttrs.list[0].chan_status == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.controlDevice("switch_chan0", switchStatus)
      .then((res) => {
        if(res == null){
           HdSmart.UI.toast('请求超时，请重试')
        }
      })
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
      this.controlDevice("switch_chan1", switchStatus)
      .then((res) => {
        if(res == null){
           HdSmart.UI.toast('请求超时，请重试')
        }
      })
    },
    setSwitch3() {
      if(this.isOffline|| this.networkStatus == -1) return
      if(this.flagOn == false || this.flagOff == false) return
      let switchStatus = ''
      if (this.deviceAttrs.list[2].chan_status == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.controlDevice("switch_chan2", switchStatus)
      .then((res) => {
        if(res == null){
           HdSmart.UI.toast('请求超时，请重试')
        }
      })
    },
    setSwitch4() {
      if(this.isOffline|| this.networkStatus == -1) return
      if(this.flagOn == false || this.flagOff == false) return
      let switchStatus = ''
      if (this.deviceAttrs.list[3].chan_status == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.controlDevice("switch_chan3", switchStatus)
      .then((res) => {
        if(res == null){
           HdSmart.UI.toast('请求超时，请重试')
        }
      })
    },
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
      // return this.doControlDevice({
      //   nodeid: `switch.main.switch`,
      //   params: {
      //     attribute: {
      //       [attr]: value,
      //       ...param
      //     }
      //   }
      // })
    },
    touchStart(e) {
      console.log(e, 'start')
      e.stopPropagation() //阻止冒泡
      e.preventDefault() //阻止默认行为
    },
    touchMove(e) {
      console.log(e, 'move')
      e.stopPropagation() //阻止冒泡
      e.preventDefault() //阻止默认行为
    },
    touchEnd(e) {
      e.stopPropagation() //阻止冒泡
      e.preventDefault() //阻止默认行为
    },
  },
}
</script>

<style lang="less" scoped>
@imgPath: 'base/honghan_switch/assets';
@imgPath1: 'base/oakes_air_condition/assets';
@100: 100% 100%;
*{ -webkit-tap-highlight-color:transparent; }
// .body {
//   min-height: 100%;
//   height: 100vh;
//   touch-action: manipulation;
//   background: url('~@lib/@{imgPath}/bg02.png');
//   background-size: 100% 100%;
// }
.page {
  // height: 100vh;
  // overflow-x: hidden;
  // position: relative;
  // background: linear-gradient(0deg, #346EE6 0%, #346EE7 100%);
  &::before{
    content: "";
    background-image: url('~@lib/@{imgPath1}/img_bg.png');
    background-repeat:no-repeat;
    background-size: 100% 100%;
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
  .title {
    // min-width: 112.5px;
    min-width: 48PX;
    font-size: 24px;
    text-align: center;
    margin-top: 26px;
    color: #000;
    opacity: 0.2;
  }
  // .zhuyi {
  //   margin-top: 5px;
  //   font-size: 24px;
  //   color: #fff;
  //   line-height: 24px;
  // }
  .main {
    margin-top: 200px;
    position: relative;
    .bg {
      display: flex;
      // justify-content: space-evenly;
      align-items: center;
      flex-wrap: wrap;
      .left {
        height: 550px;
        padding: 0 60px;
        flex-direction: column;
      }
      .middle {
        height: 550px;
        border-left: 1px solid rgba(00,00,00,0.14);
        padding: 0 60px;
        flex-direction: column;
      }
      .right {
        height: 550px;
        border-left: 1px solid rgba(00,00,00,0.14);
        padding: 0 60px;
        flex-direction: column;
      }
      .four {
        padding: 0 40px;
      }
      .sty {
        display: block;
        width: 108px;
        height: 152px;
        background-image: url('~@lib/@{imgPath}/kg2.png');
        background-size: @100;
        text-align: center;
      }
      .img {
        background-image: url('~@lib/@{imgPath}/kg1.png');
      }
      .bright {
        opacity: 1;
      }
    }
  }
  .message {
    margin-top: 36px;
    flex-direction: column;
    .title {
      margin-top: 0;
      margin-bottom: 10px;
      opacity: 1;
    }
  }
  .panel {
    background: rgba(255, 255, 255, 0.5);
    width: 214px;
    height: 632px;
    display: flex;
    margin-bottom: 14px;
    margin-right: 7px;
    border-radius: 4px;
  }
  .panel-left {
    margin-left: 7px;
  }
  .panelActive {
    background: #fff;
  }
  .panelOne {
    width: 294px;
  }
  .panel-btn {
    // position: fixed;
    // bottom: 0;
    // left: 0;
    // right: 0;
    padding: 40px 0;
    z-index: 999;

    background: transparent;
    // box-shadow: 0 -3px 28px 0 rgba(209, 209, 209, 0.5);
    // border-radius: 42px 42px 0px 0px;

    flex-wrap: wrap;
    justify-content: space-evenly;

    .btn {
      margin-top: 24px;
      width: 100%;
      border-radius: 40px 40px 0 0;
      // background: #ffffff;
      background: rgba(0,0,0,0.15);
      // box-shadow: 0 -3px 28px 0 rgba(209, 209, 209, 0.5);
      display: flex;
      // justify-content: space-evenly;
      align-items: center;
    }
  }
  .btn-wrap {
    &.btn-wrap-four {
      width: 214px;
    }
    &.btn-wrap-one {
      width: 294px;
    }
    &.up-index {
      position: relative;
      z-index: 9999;
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
    .bor {
      border: none;
      box-shadow: none;
    }
    .btn-name-top {
      margin-bottom: 60px;
    }
    .btn-name {
      text-align: center;
      color: #000;
      margin-top: 20px;
      font-size: 24px;
      font-weight: lighter;
    }
    .tis {
      margin: 0 auto 442px;
      width: 48px;
      height: 8px;
      border-radius: 5px;
      background: #D8D8D8;
    }
    .tisActive {
      background: #E9BE6E;
    }

    .btn-switch {
      width: 48px;
      height: 48px;
      margin:  0 auto;
      &::before {
        content: "";
        display: block;
        width: 48px;
        height: 48px;
        background-image: url('~@lib/@{imgPath}/kg_btn_off.png');
        background-size: @100;
      }
      &.active {
        &::before {
          background-image: url('~@lib/@{imgPath}/kg_btn_on.png')
        }
      }
    }
    .btn-start {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/@{imgPath}/kg_btn_quankai.png');
        background-size: @100;
      }
      &.active {
        // background-image: linear-gradient(221deg, #F1CB85 10%, #E1B96E 81%);
        background: #E1B96E;
        &::before {
          background-image: url('~@lib/@{imgPath}/kg_btn_quankai.png')
        }
      }
    }
    .btn-close {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/@{imgPath}/kg_btn_quanguan.png');
        background-size: @100;
      }
      &.active {
        // background-image: linear-gradient(221deg, #F1CB85 10%, #E1B96E 81%);
        background: #E1B96E;
        &::before {
          background-image: url('~@lib/@{imgPath}/kg_btn_quanguan.png')
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
      // z-index: 999;
      width: 100%;
      // background: rgba(255, 255, 255,0.1);
    }
    // &.page {
    //   // background: #fff;
    //   // background: linear-gradient(0deg, #346EE6 0%, #346EE7 100%);
    // }
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
    .up-index {
      opacity: 1;
      .btn-name {
        opacity: 0.5;
      }
    }
  }
  .panel-btn-bottom {
    width: 100%;
    position: fixed;
    bottom: 0;
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
