<template>
  <div class="body">
    <div :class="[{'offline': isOffline || networkStatus == -1 }, {'close': deviceAttrs.switch_status == 'off'}, 'page']">
      <!-- 顶部 -->
      <new-topbar
        :title="device.device_name"
        :room="device.room_name"
        :scroll="true"
        bak-color="#000"
        page-class=".page" />
      <StatusTip/>
      <!-- <color-picker
        :rgb-val="getRgb"
        :class="{'off': deviceAttrs.switch_status == 'off'}"
        style="margin: 0 auto"
        @rgb="rgb"
      /> -->
      <draw
        :class="[{'draw': deviceAttrs.switch_status != 'on'}]"
        style="textAlign: center;marginTop: 8%;"
        @rgb="rgb"
      />
      <!-- 开关 -->
      <div
        class="starting">
        <div
          ref="setSwitch"
          :class="[{ 'active': deviceAttrs.switch_status == 'on' && !isOffline && networkStatus != -1 }, 'btn btn-start']"
          @click="shutdowncallback"
          @touchstart ="touchstart('setSwitch')"
          @touchend="touchend('setSwitch')" />
          <!-- <div class="btn-name">开机</div> -->
      </div>
      <div
        :class="['footer', {'footer-close': deviceAttrs.switch_status != 'on'}]">
        <div class="txt">
          亮度 <div style="float:right">{{ brightness*10 }}%</div>
        </div>
        <div class="range">
          <input
            :class="[{'range-zero': rangeColor=='on' || doorValue=='off'}]"
            :value="brightness"
            :disabled="deviceAttrs.switch_status != 'on' || isOffline || networkStatus == -1"
            type="range"
            min="0"
            max="10"
            step="1"
            @input="changeSpeedMove"
            @touchend="changeSpeed">
          <p :class="['rang_width', {'rang_bak': doorValue=='off'}]"/>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import colorPicker from './components/color-picker/index.vue'
import draw from './components/draw.vue'

export default {
  components: { colorPicker, draw },
  data() {
    return {
      rangeColor: 'on',
      doorValue: 'on',
      brightness: 0,
      color: '',
      getRgb: ''
    }
  },
  computed: {
    ...mapGetters(['isClose', 'isOffline', 'networkStatus']),
    ...mapState(['device', 'deviceAttrs']),
  },
  watch: {
    // 'deviceAttrs.r'() {
    //   this.getRgb = `rgba(${this.deviceAttrs.r}, ${this.deviceAttrs.g}, ${this.deviceAttrs.b}, 1)`
    // },
    // 'deviceAttrs.g'() {
    //   this.getRgb = `rgba(${this.deviceAttrs.r}, ${this.deviceAttrs.g}, ${this.deviceAttrs.b}, 1)`
    // },
    // 'deviceAttrs.b'() {
    //   this.getRgb = `rgba(${this.deviceAttrs.r}, ${this.deviceAttrs.g}, ${this.deviceAttrs.b}, 1)`
    // },
    'deviceAttrs.level'() {
      this.brightness = this.deviceAttrs.level / 10
      var width = (91.3 / 10 * this.brightness) +"%"
      document.querySelector('.rang_width').style.width = width
    }
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    touchstart(val) {
      this.$refs[val].classList.add('yellowExtend')
      this.$refs[val].classList.remove('animate')
      this.$refs[val].classList.add('animate1')
      HdSmart.UI.vibrate()
    },
    touchend(val) {
      this.$refs[val].classList.remove('animate1')
      this.$refs[val].classList.add('animate')
      this.shutdowncallback()
    },
    // 开关机
    shutdowncallback(){
      if (this.isOffline || this.networkStatus == -1) return
      let switchStatus = ''
      if (this.deviceAttrs.switch_status == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.controlDevice('switch', switchStatus)
    },
    rgb(color){
      this.color = color
      this.controlDevice('r', +this.color.split(",")[0], {'g': +this.color.split(",")[1], 'b': +this.color.split(",")[2]})
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
    },
    changeSpeed(e) {
      if(this.deviceAttrs.switch_status != 'on' || this.isOffline || this.networkStatus == -1) return
      this.brightness = e.target.value
      this.controlDevice('level', this.brightness * 10)
    },
    controlDevice(attr, value, param) {
      if (attr=='switch') {
         return this.doControlDevice({
        nodeid: `bulb.main.${attr}`,
        params: {
          attribute: {
            [attr]: value
          }
        }
      })
      } else if (attr == 'r') {
        return this.doControlDevice({
          nodeid: `bulb.main.rgb`,
          params: {
            attribute: {
              [attr]: value,
              ...param,
              "transition_time":10,
              "need_confirm":true
            }
          }
        })
      } else {
        return this.doControlDevice({
          nodeid: `bulb.main.${attr}`,
          params: {
            attribute: {
              [attr]: value,
              ...param,
              "transition_time":10,
              "need_confirm":true
            }
          }
        })
      }
    },
  },
}
</script>

<style lang="less" scoped>
@imgPath1: 'base/oakes_air_condition/assets';
@imgPath: 'base/honghan_switch/assets';
@100: 100% 100%;
// .body {
//   min-height: 100%;
//   height: 100vh;
//   touch-action: manipulation;
//   background: url('~@lib/@{imgPath}/img_bg_01@2x.png');
//   background-size: 100% 100%;
// }
.page {
  // overflow-x: hidden;
  // height: 100vh;
  // position: relative;
  &::before{
    content: "";
    background-image: url('~@lib/@{imgPath}/bg02.png');
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
  .draw {
    opacity: 0.5;
  }
  .main {
    margin-top: 10%;
    position: relative;
    .bg {
      height: 550px;
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
      z-index: 999;
      width: 100%;
    }
    .starting {
      .btn-start {
        opacity: 0.5;
      }
    }
  }
  .footer {
    // position: fixed;
    width: 100%;
    // bottom: 20%;
    margin-bottom: 30px;
    .txt {
      font-size: 24px;
      color: #000000;
      letter-spacing: 0;
      width: 80%;
      margin: 40px auto;
    }
  }
  .footer-close {
    opacity: 0.2;
  }
  .starting {
    margin-top: 10vh;
     .btn-start{
        z-index: 9999;
        box-sizing: border-box;
        margin: 0 auto;
        width: 120px;
        height: 120px;
        // border: 1px solid #818181;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        position: relative;
        &::before{
          content: "";
          position: absolute;
          z-index: 100;
          left: 50%;
          top: 50%;
          margin-left: -22px;
          margin-top: -22px;
          background-image: url('~@lib/@{imgPath1}/dakai3@2x.png');
          background-size: 100% 100%;
          width: 44px;
          height: 44px;
        }
        &.active {
          background-image: linear-gradient(221deg, #F1CB85 10%, #E1B96E 81%);
          &::before {
            background-image: url('~@lib/@{imgPath1}/dakai3@2x.png');
          }
        }
     }
      .btn-name{
        text-align: center;
        color: #000;
        margin-top: 16px;
        font-size: 24px;
      }
  }
  .off {
    opacity: 0.2;
    &:before {
      content: "";
      z-index: 99999;
      width: 90%;
      height: 50%;
      display: block;
      position: absolute;
    }
  }
}



      input[type="range"] {
        display: block;
        -webkit-appearance: none;
        // background-color: #bdc3c7;
        background: rgba(101,101,101,0.3);
        width: 100%;
        height: 1px;
        border-radius: 5px;
        margin: 0 auto;outline: 0;
        &::before {
            content: "";
            position: absolute;
            top: -24px;
            left: -50px;
            display: block;
            width: 48px;
            height: 48px;
            background-image: url("~@lib/@{imgPath}/btn_ac_on_zron@2x.png");
            background-size: 100% 100%;
          }
          &::after {
            content: "";
            position: absolute;
            top: -24px;
            right: -55px;
            display: block;
            width: 48px;
            height: 48px;
            background-image: url("~@lib/@{imgPath}/btn_ac_on_oneh@2x.png");
            background-size: 100% 100%;
          }
      }
      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        background-color: transparent;
        border: 1px solid #000;
        // width: 76px;
        // height: 52px;
        width: 52px;
        height: 52px;
        border-radius: 50%;
        // border: 2px solid white;
        cursor: pointer;
        // transition: 0.3s ease-in-out;
      }

      .range {
        position: relative;
        width: 80%;
        margin: 0 auto;
        // .range-zero::-webkit-slider-thumb {
        //   background: #EDEDED;
        // }
        // .range-zero {
        //   background: #EDEDED;
        // }
      }
      .tips {
        font-size: 32px;
        color: #000000;
        float: right;
      }
      .tips-bak {
        color: #EDEDED;
      }
      .rang_width {
        position: absolute;
        top: 0;
        left: 0;
        background: #000;
        height: 1px;
        border-radius: 5px 0 0 5px;
        }
        .rang_bak {
          background: #EDEDED;
        }
        // .range-zero {
        //   &::before {
        //     content: "";
        //     display: block;
        //     width: 48px;
        //     height: 48px;
        //     background-image: url("~@lib/@{imgPath}/btn_ac_on_zron@2x.png");
        //     background-size: 100% 100%;
        //   }
        //   &::after {
        //     content: "";
        //     display: block;
        //     width: 48px;
        //     height: 48px;
        //     background-image: url("~@lib/@{imgPath}/btn_ac_on_oneh@2x.png");
        //     background-size: 100% 100%;
        //   }
        // }
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
      background: rgba(0,0,0,0.3);
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
    100% {width: 110%;height: 110%;}
  }
</style>
