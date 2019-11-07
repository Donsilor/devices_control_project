<template>
  <div class="body">
    <div :class="[{'offline': isOffline }, {'close': deviceAttrs.switch_status == 'off'}, 'page']">
      <!-- 顶部 -->
      <topbar
        :title="device.device_name"
        :shutdown="deviceAttrs.switch_status == 'on' || isOffline == true"
        bak-color="#000"
        @shutdownCallback="shutdowncallback('off')" />
      <color-picker
        :rgb-val="getRgb"
        :class="{'off': deviceAttrs.switch_status == 'off'}"
        style="margin: 0 auto"
        @rgb="rgb"
      />
      <!-- 开关 -->
      <div
        v-show="deviceAttrs.switch_status == 'off'"
        class="starting">
        <div
          class="btn btn-start"
          @click="shutdowncallback('on')" />
        <div class="btn-name">开机</div>
      </div>
      <div
        v-show="deviceAttrs.switch_status == 'on'"
        class="footer">
        <div class="txt">
          亮度 {{ brightness*10 }}%
        </div>
        <div class="range">
          <input
            :class="[{'range-zero': rangeColor=='on' || doorValue=='off'}]"
            :value="brightness"
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

export default {
  components: { colorPicker },
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
    ...mapGetters(['isClose', 'isOffline']),
    ...mapState(['device', 'deviceAttrs']),
  },
  watch: {
    'deviceAttrs.r'() {
      this.getRgb = `rgba(${this.deviceAttrs.r}, ${this.deviceAttrs.g}, ${this.deviceAttrs.b}, 1)`
    },
    'deviceAttrs.g'() {
      this.getRgb = `rgba(${this.deviceAttrs.r}, ${this.deviceAttrs.g}, ${this.deviceAttrs.b}, 1)`
    },
    'deviceAttrs.b'() {
      this.getRgb = `rgba(${this.deviceAttrs.r}, ${this.deviceAttrs.g}, ${this.deviceAttrs.b}, 1)`
    },
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
    // 开关机
    shutdowncallback(val){
      if (this.isOffline) return
      this.controlDevice('switch', val)
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
      this.brightness = e.target.value
      this.controlDevice('level', this.brightness * 10)
    },
    controlDevice(attr, value, param) {
      if(attr=='switch'){
         return this.doControlDevice({
        nodeid: `bulb.main.${attr}`,
        params: {
          attribute: {
            [attr]: value
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
              "transition_time":2,
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
.body {
  min-height: 100%;
  height: 100vh;
  touch-action: manipulation;
  background: url('~@lib/@{imgPath}/img_bg_01@2x.png');
  background-size: 100% 100%;
}
.page {
  overflow-x: hidden;
  height: 100vh;
  // position: relative;

  &.filter {
    filter: blur(12px);
  }
  .main {
    margin-top: 10%;
    position: relative;
    .bg {
      height: 550px;
    }
  }
  &.offline {
    &:before {
      content: "";
      position: fixed;
      top: 64px;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 999;
      width: 100%;
    }
  }
  .footer {
    position: fixed;
    width: 100%;
    bottom: 20%;
    .txt {
      font-size: 28px;
      color: #000000;
      letter-spacing: 0;
      width: 80%;
      margin: 40px auto;
    }
  }
  .starting {
    margin-top: 15vh;
     .btn-start{
        z-index: 999999;
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
          left: 50%;
          top: 50%;
          margin-left: -22px;
          margin-top: -22px;
          background-image: url('~@lib/@{imgPath1}/dakai3@2x.png');
          background-size: 100% 100%;
          width: 44px;
          height: 44px;
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
        height: 10px;border-radius: 5px;
        margin: 0 auto;outline: 0;
      }
      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        background-color: #000;
        width: 76px;
        height: 52px;
        border-radius: 25px;
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
        height: 10px;
        border-radius: 5px 0 0 5px;
        }
        .rang_bak {
          background: #EDEDED;
        }

</style>
