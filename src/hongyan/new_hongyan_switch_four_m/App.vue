<template>
  <div class="body">
    <div :class="[{'offline': isOffline || networkStatus == -1}, {'close': isClose}, 'page']">
      <!-- 顶部 -->
      <NewTopBar
        :title="device.device_name"
        :room="device.room_name"
        :scroll="true"
        bak-color="#000"
        page-class=".page" />
      <StatusTip/>
      <!-- 灯 -->
      <div class="main center">
        <div class="bg center">

          <div
            v-if="deviceAttrs.list && deviceAttrs.chan_num==4"
            :class="['panel', {'panelActive': deviceAttrs.list[1].chan_status == 'on'}, 'panel-left']"
            @touchstart ="touchstart('two')"
            @touchend="touchend('two')"
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
                <div class="btn-name">{{ deviceAttrs.list[1].chan_name?deviceAttrs.list[1].chan_name:'开关2' }}</div>
              </div>
            </div>
          </div>
          <!-- 配置开关 -->
          <div
            v-else
            :class="['panel', 'panel-left']"
          >
            <div
              class="panel-btn center">
              <div class="btn-wrap btn-wrap-four">
                <div class="btn-add center" />
                <div class="add-name">配置灯</div>
              </div>
            </div>
          </div>
          <div
            v-if="deviceAttrs.list && deviceAttrs.chan_num==4"
            :class="['panel', {'panelActive': deviceAttrs.list[2].chan_status == 'on'}, 'panel-left']"
            @touchstart ="touchstart('three')"
            @touchend="touchend('three')"
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
                <div class="btn-name">{{ deviceAttrs.list[2].chan_name?deviceAttrs.list[2].chan_name:'开关3' }}</div>
              </div>
            </div>
          </div>
          <!-- 配置开关 -->
          <div
            v-else
            :class="['panel', 'panel-left']"
          >
            <div
              class="panel-btn center">
              <div class="btn-wrap btn-wrap-four">
                <div class="btn-add center" />
                <div class="add-name">配置灯</div>
              </div>
            </div>
          </div>

          <div
            v-if="deviceAttrs.list && deviceAttrs.chan_num==4"
            :class="['panel', {'panelActive': deviceAttrs.list[0].chan_status == 'on'}, 'panel-left']"
            @touchstart ="touchstart('one')"
            @touchend="touchend('one')"
          >
            <div
              class="panel-btn center">
              <div class="btn-wrap btn-wrap-four">
                <div
                  :class="['btn-name', 'tis', {'tisActive': deviceAttrs.list[0].chan_status == 'on'}]"
                />
                <div
                  ref="one"
                  :class="['btn-switch', 'center', {'active': deviceAttrs.list[0].chan_status == 'on'}]"
                />
                <div class="btn-name">{{ deviceAttrs.list[0].chan_name?deviceAttrs.list[0].chan_name:'开关1' }}</div>
              </div>
            </div>
          </div>
          <!-- 配置开关 -->
          <div
            v-else
            :class="['panel', 'panel-left']"
          >
            <div
              class="panel-btn center">
              <div class="btn-wrap btn-wrap-four">
                <div class="btn-add center" />
                <div class="add-name">配置灯</div>
              </div>
            </div>
          </div>

          <div
            v-if="deviceAttrs.list && deviceAttrs.chan_num==4"
            :class="['panel', {'panelActive': deviceAttrs.list[3].chan_status == 'on'}, 'panel-left']"
            @touchstart ="touchstart('four')"
            @touchend="touchend('four')"
          >
            <div class="panel-btn center">
              <div class="btn-wrap btn-wrap-four">
                <div
                  :class="['btn-name', 'tis', {'tisActive': deviceAttrs.list[3].chan_status == 'on'}]"
                />
                <div
                  ref="four"
                  :class="['btn-switch', 'center', {'active': deviceAttrs.list[3].chan_status == 'on'}]"
                />
                <div class="btn-name">{{ deviceAttrs.list[3].chan_name?deviceAttrs.list[3].chan_name:'开关3' }}</div>
              </div>
            </div>
          </div>
          <!-- 配置开关 -->
          <div
            v-else
            :class="['panel', 'panel-left']"
          >
            <div
              class="panel-btn center">
              <div class="btn-wrap btn-wrap-four">
                <div class="btn-add center" />
                <div class="add-name">配置灯</div>
              </div>
            </div>
          </div>
          <!-- <div class="panel">
            <div class="panel-btn center">
              <div
                v-if="deviceAttrs.list"
                :class="['btn-wrap', 'btn-wrap-four']">
                <div class="btn-name btn-name-top">{{ deviceAttrs.list[0].chan_name?deviceAttrs.list[0].chan_name:'一路开关' }}</div>
                <div
                  :class="[{ 'active': deviceAttrs.list[0].chan_status == 'on' }, 'btn btn-switch center']"
                  @click="setSwitch1"/>
                <div class="btn-name">{{ deviceAttrs.list[0].chan_status == 'on'? '关灯' : '开灯' }}</div>
              </div>
            </div>
          </div> -->
          <!-- <div class="panel">
            <div class="panel-btn center">
              <div
                v-if="deviceAttrs.list"
                :class="['btn-wrap', 'btn-wrap-four']">
                <div class="btn-name btn-name-top">{{ deviceAttrs.list[1].chan_name?deviceAttrs.list[1].chan_name:'二路开关' }}</div>
                <div
                  :class="[{ 'active': deviceAttrs.list[1].chan_status == 'on' }, 'btn btn-switch center']"
                  @click="setSwitch2"/>
                <div class="btn-name">{{ deviceAttrs.list[1].chan_status == 'on'? '关灯' : '开灯' }}</div>
              </div>
            </div>
          </div>
          <div class="panel">
            <div class="panel-btn center">
              <div
                v-if="deviceAttrs.list"
                :class="['btn-wrap', 'btn-wrap-four']">
                <div class="btn-name btn-name-top">{{ deviceAttrs.list[2].chan_name?deviceAttrs.list[2].chan_name:'三路开关' }}</div>
                <div
                  :class="[{ 'active': deviceAttrs.list[2].chan_status == 'on' }, 'btn btn-switch center']"
                  @click="setSwitch3"/>
                <div class="btn-name">{{ deviceAttrs.list[2].chan_status == 'on'? '关灯' : '开灯' }}</div>
              </div>
            </div>
          </div>
          <div class="panel">
            <div class="panel-btn center">
              <div
                v-if="deviceAttrs.list"
                :class="['btn-wrap', 'btn-wrap-four']">
                <div class="btn-name btn-name-top">{{ deviceAttrs.list[3].chan_name?deviceAttrs.list[3].chan_name:'四路开关' }}</div>
                <div
                  :class="[{ 'active': deviceAttrs.list[3].chan_status == 'on' }, 'btn btn-switch center']"
                  @click="setSwitch4"/>
                <div class="btn-name">{{ deviceAttrs.list[3].chan_status == 'on'? '关灯' : '开灯' }}</div>
              </div>
            </div>
          </div> -->
        </div>
      </div>
      <!-- 按钮 -->
      <div class="panel-btn-bottom">
        <div class="panel-btn center">
          <div
            v-if="deviceAttrs.list"
            :class="['btn-wrap', 'btn-wrap-four']"
          >
            <div
              ref="SwitchOn"
              :class="[{ 'active': deviceAttrs.list[0].chan_status == 'on' && deviceAttrs.list[1].chan_status == 'on' && deviceAttrs.list[2].chan_status == 'on' && deviceAttrs.list[3].chan_status == 'on' }, 'btn btn-start center']"
              @touchstart ="touchstart('SwitchOn')"
              @touchend="touchend('SwitchOn')"
            />
            <div class="btn-name">全开</div>
          </div>
          <div
            v-if="deviceAttrs.list"
            :class="['btn-wrap', 'btn-wrap-four']"
          >
            <div
              ref="SwitchOff"
              :class="[{ 'active': deviceAttrs.list[0].chan_status == 'off' && deviceAttrs.list[1].chan_status == 'off' && deviceAttrs.list[2].chan_status == 'off' && deviceAttrs.list[3].chan_status == 'off' }, 'btn btn-close center']"
              @touchstart ="touchstart('SwitchOff')"
              @touchend="touchend('SwitchOff')"
            />
            <div class="btn-name">全关</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      flag: true,
      flagOff: true
    }
  },
  computed: {
    ...mapGetters(['isClose', 'isOffline', 'networkStatus']),
    ...mapState(['device', 'deviceAttrs']),
  },
  watch: {
    'deviceAttrs.list'() {
      if(this.deviceAttrs.list[0].chan_status == 'on' && this.deviceAttrs.list[1].chan_status == 'on' && this.deviceAttrs.list[2].chan_status == 'on' && this.deviceAttrs.list[3].chan_status == 'on') {
        this.flagOn = true
      } else {
        this.flagOn = true
      }
      if(this.deviceAttrs.list[0].chan_status == 'off' && this.deviceAttrs.list[1].chan_status == 'off' && this.deviceAttrs.list[2].chan_status == 'off' && this.deviceAttrs.list[3].chan_status == 'off') {
        this.flagOff = true
      } else {
        this.flagOff = true
      }
    }
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
      if(val == 'one' || val == 'two' || val == 'three' || val == 'four') {
        this.$refs[val].classList.add('bgcStart')
        if(this.flagOn == false || this.flagOff == false) return
      }
      if(val == 'SwitchOn') {
        this.$refs[val].classList.add('yellowExtend')
        if(this.flagOn == false) return
        if(this.deviceAttrs.list[0].chan_status == 'on' && this.deviceAttrs.list[1].chan_status == 'on' && this.deviceAttrs.list[2].chan_status == 'on' && this.deviceAttrs.list[3].chan_status == 'on') return
      }
      if(val == 'SwitchOff') {
        this.$refs[val].classList.add('yellowExtend')
        if(this.flagOff == false) return
        if(this.deviceAttrs.list[0].chan_status == 'off' && this.deviceAttrs.list[1].chan_status == 'off' && this.deviceAttrs.list[2].chan_status == 'off' && this.deviceAttrs.list[3].chan_status == 'off') return
      }
      HdSmart.UI.vibrate()
    },
    touchend(val){
      if(this.isOffline|| this.networkStatus == -1) return
      this.$refs[val].classList.remove('animate1')
      this.$refs[val].classList.add('animate')
      this.$refs[val].classList.remove('bgcStart')
      if(val == 'one') return this.setSwitch1()
      if(val == 'two') return this.setSwitch2()
      if(val == 'three') return this.setSwitch3()
      if(val == 'four') return this.setSwitch4()
      if(val == 'SwitchOn') return this.setSwitchOn('on')
      if(val == 'SwitchOff') return this.setSwitchOff('off')
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
      return this.doControlDevice({
        nodeid: `switch.main.switch`,
        params: {
          attribute: {
            [attr]: value,
            ...param
          }
        }
      })
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
body {
  position: fixed;
}
// .body {
  // min-height: 100%;
  // height: 100vh;
  // touch-action: manipulation;
  // background: url('~@lib/@{imgPath}/bg02.png');
  // background-size: 100% 100%;
// }
.page {
  // height: 100vh;
  // overflow-x: hidden;
  // position: relative;
  // background: linear-gradient(0deg, #346EE6 0%, #346EE7 100%);
  &::before{
    content: "";
    background-image: url('~@lib/@{imgPath1}/img_bg_01@2x.png');
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
    margin-top: 65px;
    position: relative;
    margin-bottom: 212px;
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
    width: 294px;
    height: 412px;
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
      background: rgba(0,0,0,0.05);
      // box-shadow: 0 -3px 28px 0 rgba(209, 209, 209, 0.5);
      display: flex;
      // justify-content: space-evenly;
      align-items: center;
    }
  }
  .btn-wrap {
    &.btn-wrap-four {
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
      margin: 0 auto 222px;
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
        z-index: 100;
        position: relative;
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/@{imgPath}/kg_btn_quankai.png');
        background-size: @100;
      }
      &.active {
        background-image: linear-gradient(221deg, #F1CB85 10%, #E1B96E 81%);
        &::before {
          background-image: url('~@lib/@{imgPath}/kg_btn_quankai.png')
        }
      }
    }
    .btn-close {
      &::before {
        content: "";
        z-index: 100;
        position: relative;
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/@{imgPath}/kg_btn_quanguan.png');
        background-size: @100;
      }
      &.active {
        background-image: linear-gradient(221deg, #F1CB85 10%, #E1B96E 81%);
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
      // .btn {
        // &.active {
        //   background: #fff;
        //   border: 1px solid rgba(32,40,43,0.5);
        // }
      // }
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
    // position: fixed;
    // bottom: 0;
    .panel-btn {
      padding-top: 0;
      padding-bottom: 96px;
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
      background-image: linear-gradient(221deg, #F1CB85 10%, #E1B96E 81%);
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
