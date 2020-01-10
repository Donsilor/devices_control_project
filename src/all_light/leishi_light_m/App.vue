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
      <StatusTip/>
      <!-- 灯泡 -->
      <div class="main center" >
        <div
          class="wrap-circle center">
          <div
            :class="[{'animation': !isClose }, {'greycircle': isClose }, rotateClass, 'bg']" />
          <div
            :class="[{'animation1': !isClose }, rotateClass, 'bg']" />
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
              :value="brightness"
              :disabled="isClose || isOffline || networkStatus == -1"
              type="range"
              min="0"
              max="10"
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
        <div class="footer-line">
          <div class="footer-title">关灯时缓慢变暗</div>
          <input
            class="switch switch-anim"
            type="checkbox"
            @click="lockClose">
        </div>
        <div class="line"/>
        <div class="footer-line">
          <div class="footer-title">开灯时缓慢变亮</div>
          <input
            class="switch switch-anim"
            type="checkbox"
            @click="lockOpen">
        </div>
      </div>
      <div
        style="display: none;"
        class="panel-btn center">
        <div
          class="btn-wrap"
          @touchstart ="touchstart('bc')"
          @touchend="touchend('bc')">
          <div
            ref="bc"
            :class="[ { 'active': deviceAttrs.temperature == 370 && deviceAttrs.switch_status == 'on' && !isOffline && networkStatus != -1 }, 'btn btn-bc center']" />
          <div class="btn-name">暖光</div>
        </div>
        <div
          class="btn-wrap"
          @touchstart ="touchstart('gs')"
          @touchend="touchend('gs')">
          <div
            ref="gs"
            :class="[ { 'active': deviceAttrs.temperature == 240 && deviceAttrs.switch_status == 'on' && !isOffline && networkStatus != -1 }, 'btn btn-gs center']" />
          <div class="btn-name">自然光</div>
        </div>
        <div
          class="btn-wrap"
          @touchstart ="touchstart('rs')"
          @touchend="touchend('rs')">
          <div
            ref="rs"
            :class="[{ 'active': deviceAttrs.temperature == 167 && deviceAttrs.switch_status == 'on' && !isOffline && networkStatus != -1 }, 'btn btn-rs center']" />
          <div class="btn-name">白光</div>
        </div>
      </div>
      <!--模式选择-->
      <model-swing
        ref="swing"
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
      isOpen: false,
      ratio:100,
      ctx: '',
      ox: 120,
      oy: 120,
      or: 110,
      br: 10,
      moveFlag: false,
      brightness: 0,
      rangeColor: 'on',
      doorValue: 'on',
      custom: false,
      vibrate: 0,
      lockCloseVal: false,
      lockOpenVal: false
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
    rotateClass() {
      /* eslint-disable no-unreachable */
      switch (this.deviceAttrs.temperature) {
        case 'low':
          return 'rotate-low'
          break
        case 'overlow':
          return 'rotate-overlow'
          break
        case 'normal':
          return 'rotate-normal'
          break
        case 'overnormal':
          return 'rotate-overnormal'
          break
        case 'high':
          return 'rotate-high'
          break
        case 'auto':
          return 'rotate-low'
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

    },
    'vibrate'() {
      if(this.deviceAttrs.switch_status == 'on' && !this.isOffline&& this.networkStatus != -1) {
        HdSmart.UI.vibrate()
      }
    },
    'deviceAttrs.level'() {
      this.brightness = this.deviceAttrs.level / 25.5
      var width = (91.3 / 10 * this.brightness) +"%"
      document.querySelector('.rang_width').style.width = width
    }
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
      .then(()=>{
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
      this.deviceAttrs.mode = ''
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
      var max = e.target.getAttribute("max")
      var width = (91.3 / max * e.target.value) +"%"
      document.querySelector('.rang_width').style.width = width
      if(e.target.value == 0) {
        this.rangeColor = 'on'
      } else {
        this.rangeColor = 'off'
      }
      this.brightness = e.target.value
      this.vibrate = e.target.value
    },
    changeSpeed(e) {
      if(this.deviceAttrs.switch_status != 'on' || this.isOffline || this.networkStatus == -1) return
      var lowLevel = 0
      this.brightness = e.target.value
      if(this.brightness == 0) {
        lowLevel = 2
      }
      this.controlDevice('level', lowLevel ? lowLevel : this.brightness * 25.5)
    },
    // 亮度
    moveLight(val){
      this.ratio = 100-val
    },
    setSpeed(val) {
      if (this.isClose||this.isOffline|| this.networkStatus == -1) return
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
        if(this.lockCloseVal) return this.controlDevice("mode", '2')
      }
      if(switchStatus == 'on') {
        if(this.lockOpenVal) return this.controlDevice("mode", '1')
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
@keyframes rotate {
    from {
      transform:rotate(0deg);
    }
    to {
      transform:rotate(360deg);
    }
}
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
.tips {
  margin-top: 18%;
  padding-bottom: 40px;
  position: absolute;
  text-align: center;
  font-size: 46px;
  display: flex;
  justify-content: center;
}
.canvas {
  margin-top: 19%;
  z-index: 2;
  position: absolute;
  width: 460px;
  border-radius: 50%;
}
// .mask1 {
//   position: absolute;
//   margin-top: 13%;
//   width: 300px;
//   height: 300px;
//   z-index: 3;
//   border-radius: 50%;
// }
.mask2 {
  position: absolute;
  margin-top: 40%;
  width: 100%;
  height: 300px;
  z-index: 3;
  // background: #000;
}
.mask3 {
  position: absolute;
  margin-top: 19%;
  width: 394px;
  height: 394px;
  z-index: 3;
  // background: #000;
  border-radius: 50%;
}
.small {
  background: url("~@lib/@{imgPath3}/btn_ac_on_zron@2x.png") no-repeat;
  background-size: 100% 100%;
  height: 26px;
  width: 26px;
  position: relative;
  top: 20%;
  left: -115%;
}
.big {
  background: url("~@lib/@{imgPath3}/btn_ac_on_oneh@2x.png") no-repeat;
  background-size: 100% 100%;
  height: 26px;
  width: 26px;
  position: relative;
  top: 11%;
  right: -123%;
}
.scale {
  // position: absolute;
  position: relative;
  // top: -40px;
  left: -13%;
  background: url("~@lib/@{imgPath3}/btn_ac_dengguang@2x.png") no-repeat;
  background-size: 100% 100%;
  width: 568px;
  height: 290px;
}
.scale-close {
  background: url("~@lib/@{imgPath3}/btn_ac_dengguanghui@2x.png") no-repeat;
  background-size: 100% 100%;
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
    .ratiobg{
      position: absolute;
      width: 600px;
      height: 10px;
      background: #ccc;
      top: 160px;
      // left: 50%;
      // transform: translateX(-50%);
      border-radius: 60px;
      .ratiobg2{
        width: 0px;
        height: 100%;
        background:aqua;
        border-radius: 60px;
      }
      .circle{
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background:aqua;
        position: absolute;
        top: -14px;
        left: 0px;
      }
      .an{
        position: absolute;
        top: 20px;
        left: -30px;
      }
      .liang{
        position: absolute;
        top: 20px;
        right: -30px;;
      }
    }

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
.coverlight{
  position:absolute;
  width: 320px;
  height: 450px;
  clip:rect(80px 320px 450px 0px);
}
.greycircle {
  background: url("~@lib/@{imgPath3}/btn_ac_lamp@2x.png") no-repeat;
  background-size: 100% 100%;
}
.lianggang{
  width: 74px;
  height: 16px;
  position: absolute;
  top: 0;
  left: 50%;
    transform: translateX(-50%);
   background: url("~@lib/@{imgPath}/btn_ac_on_lianggang@2x.png") no-repeat;
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

  .more {
    width: 750px;
    color: #9e9e9e;
    font-size: 24px;
    text-align: center;
    position: absolute;
    left: 0;
    top: -75px;
    .arrow {
      display: inline-block;
      font-size: 32px;
      &.up {
        transform: rotate(90deg);
      }
      &.down {
        transform: rotate(-90deg);
      }
    }
  }

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
  // .btn-start {
  //   &::before {
  //     content: "";
  //     display: block;
  //     width: 44px;
  //     height: 44px;
  //     background-image: url("~@lib/@{imgPath1}/btn_ac_on_cd@2x.png");
  //     background-size: 100% 100%;
  //   }
  //   &.active {
  //     &::before {
  //       background-image: url("~@lib/@{imgPath1}/start.png");
  //     }
  //   }
  // }

  .btn-zm {
    &::before {
      content: "";
      display: block;
      width: 44px;
      height: 44px;
      background-image: url("~@lib/@{imgPath}/btn_ac_on_cd@2x.png");
      background-size: 100% 100%;
    }
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
.ratiobg111{
  position: fixed;
  right: 100px;
  top: 200px;
  height: 500px;
  width: 10px;
  background: #ccc;
  .circle{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #fff;
    position: absolute;
    left: -15px;
  }
  .ratiobg2{
    // border-radius: 50%;
    background: rgba(255 ,255, 255, 0.6)
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


