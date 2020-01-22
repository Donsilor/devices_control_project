<template class="a">
  <div class="body">
    <div
      :class="[{ 'offline': isOffline || networkStatus == -1 }, {'close': isClose}, 'page']" >
      <new-topbar
        :title="device.device_name"
        :room="device.room_name"
        :scroll="true"
        bak-color="#000"
        page-class=".page"
      />
      <StatusTip @OfflineHelpPage="OfflineHelpPage"/>
      <!-- 灯泡 -->
      <div class="main center" >
        <div
          class="wrap-circle center">
          <div
            :class="[{'animation': !isClose }, {'greycircle': isClose }, 'bg']" />
          <div
            :class="[{'animation1': switchOn || !isClose }, 'bg']" />
        </div>
      </div>
      <!-- 开关按钮 -->
      <div
        class="tips-btn">
        <div
          :class="[{'up-index': !isOffline && networkStatus != -1 }, 'btn-wrap']">
          <div
            ref="switch"
            :class="[{ 'active': !isClose }, 'btn-swich btn center']"
            @touchstart ="touchstart('switch')"
            @touchend="touchend('switch')" />
        </div>
      </div>
      <!-- 底部菜单 -->
      <div class="footer">
        <div class="line"/>
        <div
          :class="['footer-line', {'opa': isClose || isOffline}]"
          @click="showMode()">
          <div
            :class="['footer-title']">模式</div>
          <div class="timing-right">{{ custom ? "自定义" : modeTitle }}</div>
        </div>
        <div class="line"/>
        <div
          v-show="custom || deviceAttrs.mode == '0'"
          :class="['footer-line', {'opa': isClose || isOffline}]">
          <div class="footer-title">亮度</div>
          <div class="range">
            <input
              :class="[{'range-zero': rangeColor || doorValue=='off'}]"
              :value="localBrightness"
              :disabled="isClose || isOffline || networkStatus == -1 || rangeDisabled"
              type="range"
              min="1"
              max="100"
              step="1"
              @input="changeSpeedMove"
              @touchend="changeSpeed">
            <p :class="['rang_width', {'rang_bak': doorValue=='off'}]"/>
          </div>
        </div>
        <div
          v-show="custom || deviceAttrs.mode == '0'"
          class="line"/>
        <div
          v-show="custom || deviceAttrs.mode == '0'"
          :class="['footer-line', {'opa': isClose || isOffline}]">
          <div class="footer-title">色温</div>
          <div class="footer-nav">
            <div
              :class="['footer-nav-btn', {'active': deviceAttrs.temperature == 255}]"
              @click="setSpeed(255)">冷光</div>
            <div
              :class="['footer-nav-btn', {'active': deviceAttrs.temperature == 145}]"
              @click="setSpeed(145)">自然光</div>
            <div
              :class="['footer-nav-btn', {'active': deviceAttrs.temperature == 0}]"
              @click="setSpeed(0)">暖光</div>
          </div>
        </div>
        <div
          v-show="custom || deviceAttrs.mode == '0'"
          class="line"/>
        <div
          v-show="deviceAttrs.switch_status == 'on'"
          class="footer-line">
          <div class="footer-title">关灯时缓慢变暗</div>
          <input
            :checked="lockCloseVal"
            class="switch switch-anim"
            type="checkbox"
            @click="lockClose">
        </div>
        <!-- <div
          v-show="deviceAttrs.switch_status == 'on'"
          class="line"/> -->
        <div
          v-show="deviceAttrs.switch_status == 'off'"
          class="footer-line">
          <div class="footer-title">开灯时缓慢变亮</div>
          <input
            :checked="lockOpenVal"
            class="switch switch-anim"
            type="checkbox"
            @click="lockOpen">
        </div>
      </div>
      <!--模式选择-->
      <model-swing
        ref="swing"
        :mode="deviceAttrs.mode"
        :custom="custom"
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
      brightness: 0,
      rangeColor: 'on',
      doorValue: 'on',
      custom: false,
      vibrate: 0,
      lockCloseVal: false,
      lockOpenVal: false,
      rangeDisabled: false,
      speedDisabled: false,
      localBrightness: 0,
      switchOn: false
    }
  },
  computed: {
    ...mapGetters(['isClose', 'isOffline', 'networkStatus']),
    ...mapState(['device', 'deviceAttrs']),
    modeTitle() {
      /* eslint-disable no-unreachable */
      switch (this.deviceAttrs.mode) {
        case '0':
         return '自定义'
         break
        case '3':
          return '阅读'
          break
        case '4':
          return '影院'
          break
        case '5':
          return '温暖'
          break
        case '6':
          return '夜灯'
          break
        default:
          return ''
      }
    },
    isClose(){
      return this.deviceAttrs.switch_status=="on"?false:true
    },
  },
  watch: {
    'device.stateChange'() {
      this.rangeDisabled = false
      this.speedDisabled = false
      if(this.deviceAttrs.mode == '0' || this.deviceAttrs.mode == '1' || this.deviceAttrs.mode == '2') {
        this.custom = true
      } else {
        this.custom = false
      }
      if(this.deviceAttrs.mode != '1') {
        this.switchOn = false
      }
      this.localBrightness = this.deviceAttrs.level / 2.55
      var width = (91.3 / 100 * this.localBrightness) +"%"
      document.querySelector('.rang_width').style.width = width
    },
    // 'deviceAttrs.level'() {
    //   this.localBrightness = this.deviceAttrs.level / 2.55
    //   var width = (91.3 / 100 * this.localBrightness) +"%"
    //   document.querySelector('.rang_width').style.width = width
    // }
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
      .then(()=>{
        this.localBrightness = this.deviceAttrs.level / 2.55
        var width = (91.3 / 100 * this.localBrightness) +"%"
        document.querySelector('.rang_width').style.width = width
        if(this.deviceAttrs.mode == '1') {
          this.lockOpenVal = true
          this.custom = true
        }
        if(this.deviceAttrs.mode == '2') {
          this.lockCloseVal = true
          this.custom = true
        }
      })
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
    // touch动画
    touchstart(val) {
      if(this.isClose && val=='switch') {
        this.$refs[val].classList.remove('animate')
        this.$refs[val].classList.add('animate1')
        this.$refs[val].classList.add('yellowExtend')
        HdSmart.UI.vibrate()
        return
      }
      if(this.isClose||this.isOffline|| this.networkStatus == -1) return
      this.$refs[val].classList.remove('animate')
      this.$refs[val].classList.add('animate1')
      this.$refs[val].classList.add('yellowExtend')
      HdSmart.UI.vibrate()
    },
    touchend(val){
      if(this.isClose && val=='switch') {
        this.$refs[val].classList.remove('animate1')
        this.$refs[val].classList.add('animate')
        this.setSwitch()
        return
      }
      if(this.isClose||this.isOffline|| this.networkStatus == -1) return
      this.$refs[val].classList.remove('animate1')
      this.$refs[val].classList.add('animate')
      if(val == 'bc') return this.setSpeed(370)
      if(val == 'gs') return this.setSpeed(240)
      if(val == 'rs') return this.setSpeed(167)
      if(val == 'switch') return this.setSwitch()
    },
    // 显示模式弹框
    showMode() {
      if (this.isClose || this.isOffline || this.networkStatus == -1) return
      this.$refs.swing.show = true
    },
    // 模式选择
    setWind(attr) {
      HdSmart.UI.vibrate()
      // this.deviceAttrs.mode = ''
      if(!attr) {
        if(this.$refs.swing.show) this.$refs.swing.show = false
        this.custom = true
        return
      }
      if(attr) return this.controlDevice("mode", attr)
      .then((res) => {
        if(res.code == 0) {
          this.custom = false
          if(this.$refs.swing.show) this.$refs.swing.show = false
        }
      })
    },
    lockClose(e) {
      HdSmart.UI.vibrate()
      this.lockCloseVal = e.target.checked
    },
    lockOpen(e) {
      HdSmart.UI.vibrate()
      this.lockOpenVal = e.target.checked
    },
    changeSpeedMove(e) {
      if(this.rangeDisabled == true) return
      HdSmart.UI.vibrate()
      var max = e.target.getAttribute("max")
      var width = (91.3 / max * e.target.value) +"%"
      document.querySelector('.rang_width').style.width = width
      if(e.target.value == 0) {
        this.rangeColor = 'on'
      } else {
        this.rangeColor = 'off'
      }
      this.brightness = e.target.value
      this.localBrightness = e.target.value
    },
    changeSpeed(e) {
      if(this.rangeDisabled == true) return
      this.rangeDisabled = true
      if(this.deviceAttrs.switch_status != 'on' || this.isOffline || this.networkStatus == -1) return
      var lowLevel = 0
      this.brightness = e.target.value
      this.localBrightness = e.target.value
      if(this.brightness == 0) {
        lowLevel = 2
      } else if(this.brightness == 100) {
        lowLevel = 255
      }
      this.controlDevice('level', lowLevel ? lowLevel : parseInt(this.brightness * 2.55))
    },
    setSpeed(val) {
      if (this.isClose||this.isOffline|| this.networkStatus == -1) return
      if(this.speedDisabled == true) return
      this.speedDisabled = true
      HdSmart.UI.vibrate()
      this.controlDevice('temperature', val)
    },
    setSwitch() {
      if (this.isOffline|| this.networkStatus == -1) return false
      let switchStatus = ''
      if (this.deviceAttrs.switch_status == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      if(switchStatus == 'off') {
        if(this.lockCloseVal) {
          if(this.deviceAttrs.mode == '2') return HdSmart.UI.toast('关灯中，立刻关灯需取消缓慢模式')
          return this.controlDevice("mode", '2')
        }
      }
      if(switchStatus == 'on') {
        if(this.lockOpenVal) {
          if(this.deviceAttrs.mode == '1') return
          return this.controlDevice("mode", '1')
          .then((res) => {
            if(res.code == 0) {
              this.switchOn = true
            }
          })
        }
      }
      if(this.deviceAttrs.mode == '1' || this.deviceAttrs.mode == '2') {
        return this.controlDevice("switch", switchStatus, {'level': this.deviceAttrs.level})
      }
      this.controlDevice("switch", switchStatus)
    },
    controlDevice(attr, value, param) {
      if(attr=='switch'){
         return this.doControlDevice({
          nodeid: `bulb.main.${attr}`,
          params: {
            attribute: {
              [attr]: value,
              ...param
            }
          }
        })
      }else{
        return this.doControlDevice({
          nodeid: `bulb.main.${attr}`,
          params: {
            attribute: {
              [attr]: value,
              ...param
              // "transition_time":2,
              // "need_confirm":true
            }
          }
        })
      }
    },
  },

}
</script>

<style lang="less" scoped>
@imgPath: "base/hongyan_light/assets";
@imgPath1: "base/blend/assets";
@imgPath2: "base/air_cleaner/assets/new-air";
@imgPath3: 'base/honghan_switch/assets';
@imgPath4: 'base/oakes_air_condition/assets';
*{ -webkit-tap-highlight-color:transparent; }
.page{
  // height:100vh;
  // background: url('~@lib/@{imgPath3}/bg02.png');
  // background-size: 100% 100%;
  &::before{
    content: "";
    background-image: url('~@lib/@{imgPath3}/bg02.png');
    background-repeat:no-repeat;
    background-size: 100% 100%;
    position: fixed;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }
}
.main{
  margin-top: 85px;
  // position: relative;
  height: 400px;
  // margin-bottom: 470px;
}
.wrap-circle {
  position: relative;
  // left: 36%;
  // top: 35%;
  // position: absolute;
  // margin-top: 60px;
  // width: 320px;
  // height: 450px;
  width: 208px;
  height: 290px;
  flex-direction: column;
  color: #20282B;
  .bg{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .wind {
    margin-bottom: 30px;
    font-size: 24px;
  }
  .speed {
    font-size: 120px;
    &.speed-close{
      display: flex;
      align-items: center;
      height: 152px;
      margin-bottom: 20px;
      span{
        margin: 0 10px;
        display: inline-block;
        background:#757575;
        width: 70px;
        height: 10px;
      }
    }
  }

  .switch {
    margin-top: 20px;
    font-size: 32px;
  }
}
 .tips-btn{
  //  position: fixed;
    // margin-top: 100px;
    // bottom: 20%;
    margin: 0 auto;
    width: 100%;
    text-align: center;
    font-size: 36px;
    // color: #fff;
    display: flex;
    justify-content: center;
  }
  .footer {
    margin-top: 60px;
    .line {
      width: 100%;
      height: 1px;
      opacity: .1;
      background: #000000;
    }
    .footer-line {
      padding: 0px 60px;
      height: 118px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &.opa {
          opacity: 0.5;
        }
      .footer-title {
        font-size: 32px;
        color: #000000;
      }
      .timing-right {
        // position: relative;
        // z-index: 999;
        display: flex;
        align-items: center;
        height: 64px;
        line-height: 64px;
        font-size: 28px;
        color: #000000;
        &::after {
          content: "";
          display: inline-block;
          background-image: url('~@lib/base/oakes_air_condition/assets/arrow_in.png');
          background-size: 100% 100%;
          width: 32px;
          height: 32px;
          // position: relative;
          // top: 2px;
        }
      }
      input[type="range"] {
        display: block;
        -webkit-appearance: none;
        // background-color: #bdc3c7;
        background: rgba(101,101,101,0.3);
        width: 100%;
        height: 2px;
        border-radius: 5px;
        margin: 0 auto;outline: 0;
        // &::before {
        //     content: "";
        //     position: absolute;
        //     top: -24px;
        //     left: -50px;
        //     display: block;
        //     width: 48px;
        //     height: 48px;
        //     background-image: url("~@lib/@{imgPath3}/btn_ac_on_zron@2x.png");
        //     background-size: 100% 100%;
        //   }
        //   &::after {
        //     content: "";
        //     position: absolute;
        //     top: -24px;
        //     right: -55px;
        //     display: block;
        //     width: 48px;
        //     height: 48px;
        //     background-image: url("~@lib/@{imgPath3}/btn_ac_on_oneh@2x.png");
        //     background-size: 100% 100%;
        //   }
      }
      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        background-color: #E1B96E;
        border: 1px solid #E1B96E;
        // width: 76px;
        // height: 52px;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        // border: 2px solid white;
        cursor: pointer;
        // transition: 0.3s ease-in-out;
      }

      .range {
        position: relative;
        width: 80%;
        // margin: 0 auto;
        // .range-zero::-webkit-slider-thumb {
        //   background: #EDEDED;
        // }
        // .range-zero {
        //   background: #EDEDED;
        // }
        .rang_width {
        position: absolute;
        top: 0;
        left: 0;
        background: #E1B96E;
        height: 2px;
        border-radius: 5px 0 0 5px;
        }
      }
      .footer-nav {
        display: flex;
        // width: 480px;
        .footer-nav-btn {
          // width: 120px;
          height: 64px;
          line-height: 64px;
          // background: rgba(0,0,0,0.04);
          font-size: 28px;
          color: #000000;
          text-align: center;
          margin-left: 64px;
          opacity: 0.5;
          &.active {
            opacity: 1;
            position: relative;
            &::before{
              display: block;
              content: "";
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #000;
              position: absolute;
              bottom: 0;
              left: 50%;
              margin-left: -4px;
            }
          }
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
    }
  }
.animation {
  background: url("~@lib/@{imgPath3}/btn_ac_lamp@2x.png") no-repeat;
  background-size: 100% 100%;
}
.animation1 {
  background: url("~@lib/@{imgPath3}/btn_ac_lampnuan@2x.png") no-repeat;
  background-size: 100% 100%;
}
.greycircle {
  background: url("~@lib/@{imgPath3}/btn_ac_lamp@2x.png") no-repeat;
  background-size: 100% 100%;
}
.panel-btn {
  // position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  // padding: 40px 30px 30px;
  margin-top: 66px;
  padding: 0 30px 96px;
  z-index: 9999;
  width: 100%;
  // height: 306px;
  // background: #ffffff;
  // box-shadow: 0 -3px 28px 0 rgba(209, 209, 209, 0.5);
  border-radius: 42px 42px 0px 0px;

  flex-wrap: wrap;
  justify-content: center;

  .btn {
    margin-top: 24px;
    width: 100%;
    border-radius: 40px 40px 0 0;
    background: rgba(0,0,0,0.1);
    // box-shadow: 0 -3px 28px 0 rgba(209, 209, 209, 0.5);
    display: flex;
    // justify-content: space-evenly;
    align-items: center;
  }
}
.disabled {
  opacity: 0.2;
}
.btn-wrap {
  margin: 0 24px;
  &.up-index {
    position: relative;
    z-index: 9999;
  }
  .btn {
    box-sizing: border-box;
    margin: 0 auto;
    width: 120px;
    height: 120px;
    // border: 1px solid #818181;
    border-radius: 50%;

    display: flex;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.1);
    &::before {
      position: relative;
      z-index: 100;
    }
    &.active {
      // background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
      // border-color: #ffbf00;
      // background: #000;
      // background-image: linear-gradient(221deg, #F1CB85 10%, #E1B96E 81%);
      background: #E1B96E;
    }
  }
  .btn-name {
    text-align: center;
    color: #000;
    margin-top: 16px;
    font-size: 24px;
  }
  .btn-rs {
    &::before {
      content: "";
      display: block;
      width: 48px;
      height: 48px;
      background-image: url("~@lib/@{imgPath3}/btn_ac_on_baiguang@2x.png");
      background-size: 100% 100%;
    }
    &.active::before{
      display: block;
      width: 48px;
      height: 48px;
      // background-image: url("~@lib/base/yiyun_light/assets/nuanguang2@2x.png");
      background-size: 100% 100%;

    }
  }

  .btn-gs {
    &::before {
      content: "";
      display: block;
      width: 48px;
      height: 48px;
      background-image: url("~@lib/@{imgPath3}/btn_ac_on_ziranguang@2x.png");
      background-size: 100% 100%;
    }
    &.active::before{
      display: block;
      width: 48px;
      height: 48px;
      // background-image: url("~@lib/base/yiyun_light/assets/ziranguang2@2x.png");
      background-size: 100% 100%;

    }
  }
  .btn-bc {
    &::before {
      content: "";
      display: block;
      width: 48px;
      height: 48px;
      background-image: url("~@lib/@{imgPath3}/btn_ac_on_cd@2x.png");
      background-size: 100% 100%;
    }
    &.active::before{
      display: block;
      width: 48px;
      height: 48px;
      // background-image: url("~@lib/base/yiyun_light/assets/baiguanfg2@2x.png");
      background-size: 100% 100%;

    }
  }

  .btn-swich {
    &::before {
      content: "";
      display: block;
      width: 48px;
      height: 48px;
      background-image: url("~@lib/@{imgPath4}/dakai3@2x.png");
      background-size: 100% 100%;
    }
    &.active {
      &::before {
        background-image: url("~@lib/@{imgPath4}/dakai3@2x.png");
      }
    }
  }
}
&.close {
  .btn-wrap {
    &.up-index{
      opacity: 1;
    }
  }
}
&.offline {
  overflow: hidden;
  .btn-wrap {
    &.up-index{
      opacity: .2;
    }
  }
}
&.close,
&.offline {
  // background-image: url("~@lib/@{imgPath}/beij@3x.png");
  //   background-size: 100% 100%;
  // &:before {
    // content: "";
    // position: fixed;
    // top: 82PX;

    // left: 0;
    // bottom: 0;
    // right: 0;
    // z-index: 999;
    // width: 100%;
    // background: rgba(0, 0, 0, 0.1);
  // }
  &.page {
    // background-image: url("~@lib/@{imgPath}/beij@3x.png");
    // background-size: 100% 100%;

    .cover {
      background: #fff;
      .point {
        &.left {
          background: #d8d8d8;
        }
      }
    }
  }
  // .panel-btn {
    // background: #efefef;
  // }
  .btn-wrap {
    opacity: .2;
    // .btn {
    //   &.active {
    //     background: #fff;
    //     border: 1px solid #818181;
    //   }
    // }
  }
  .btn-wrap-light{
    opacity: 1;
    .btn {
      &.active {
        // background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
        border-color: #ffbf00;
        background: #E1B96E;
      }
    }
  }


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
</style>


