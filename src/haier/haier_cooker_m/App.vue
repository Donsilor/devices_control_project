<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']">
      <topbar 
        :title="device.device_name"
        bak-color="#20282B" />

      <div class="main center">
        <div class="wrap-circle">
          <div class="circle-left">
            <div :class="[{'active': leftStatus !== 'no'}, 'circle-gray']">
              <circle-pie 
                :left-status="leftStatus" 
                class="pie">
                <p class="icon">
                  <img 
                    v-show="leftStatus == 'no'" 
                    src="../../../lib/base/haier_cooker/assets/no_fire.png" >
                  <img 
                    v-show="leftStatus == 'low' || leftStatus == 'low_60'" 
                    src="../../../lib/base/haier_cooker/assets/small_fire.png" >
                  <img 
                    v-show="leftStatus == 'nomal'" 
                    src="../../../lib/base/haier_cooker/assets/middle_fire.png" >
                  <img 
                    v-show="leftStatus == 'high' || leftStatus == 'high_30'" 
                    src="../../../lib/base/haier_cooker/assets/big_fire.png" >
                </p>
              </circle-pie>
            </div>
            <div class="left-cooker">
              <div class="cooker-name">左灶</div>
              <div class="fire">{{ leftTxt }}</div>
            </div>
          </div>
          <div class="circle-right">
            <div :class="[{'active': rightStatus !== 'no'}, 'circle-gray']">
              <circle-pie 
                :right-status="leftStatus" 
                class="pie">
                <p class="icon">
                  <img 
                    v-show="rightStatus == 'no'" 
                    src="../../../lib/base/haier_cooker/assets/no_fire.png" >
                  <img 
                    v-show="rightStatus == 'low' || rightStatus == 'low_60'" 
                    src="../../../lib/base/haier_cooker/assets/small_fire.png" >
                  <img 
                    v-show="rightStatus == 'nomal'" 
                    src="../../../lib/base/haier_cooker/assets/middle_fire.png" >
                  <img 
                    v-show="rightStatus == 'high' || rightStatus == 'high_30'" 
                    src="../../../lib/base/haier_cooker/assets/big_fire.png" >
                </p>
              </circle-pie>
            </div>
            <div class="right-cooker">
              <div class="cooker-name">右灶</div>
              <div class="fire">{{ rightTxt }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <p>温馨提示：国家规定不能远程控制燃气灶，</p>
        <p>请不要远离开火的燃气灶太久。</p>
      </div>
    </div>
  </div>
</template>

<script>
import CirclePie from "./components/CirclePie.vue"
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  components: {CirclePie},
  data() {
    return {
      isOpen: false,
    }
  },
  computed: {
    ...mapGetters(['isClose', 'isOffline']),
    ...mapState(['device', 'deviceAttrs']),
    leftTxt() {
       if(!this.deviceAttrs.fire_status) return
      /* eslint-disable no-unreachable */
       switch(this.deviceAttrs.fire_status.stove_0) {
        case 'no':
          return '无火'
          break
        case 'low':
          return '小火'
          break
        case 'nomal':
          return '中火'
          break
        case 'high':
          return '大火'
          break
        case 'high_30':
          return '大火'
          break
        case 'low_60':
          return '小火'
          break
        // default:
        //   return 
      }
    },
    rightTxt() {
       if(!this.deviceAttrs.fire_status) return
      /* eslint-disable no-unreachable */
       switch(this.deviceAttrs.fire_status.stove_1) {
        case 'no':
          return '无火'
          break
        case 'low':
          return '小火'
          break
        case 'nomal':
          return '中火'
          break
        case 'high':
          return '大火'
          break
        case 'high_30':
          return '大火'
          break
        case 'low_60':
          return '小火'
          break
        // default:
        //   return 
      }
    },
    leftStatus() {
      if(this.deviceAttrs.fire_status) return this.deviceAttrs.fire_status.stove_0
    },
    rightStatus() {
      if(this.deviceAttrs.fire_status) return this.deviceAttrs.fire_status.stove_1
    },
  },
  created() {
  },
  mounted() {
  },
  methods: {
    ...mapActions(['doControlDevice']),





    handleMore() {
      this.isOpen = !this.isOpen
    },
    setMode(val) {
      if (val == this.deviceAttrs.mode) {
        val = 'free'
      }
      if (this.isClose) return
      this.controlDevice('mode', val)
    },
    setSwitch() {
      let switchStatus = ''
      if (this.deviceAttrs.switch == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.controlDevice("switch", switchStatus)
        .then(() => {
          console.log('setSwitch success')
        })
    },
    setTemperature(step) {
      let val = +this.deviceAttrs.set_temperature + step
      if (val > 75) {
        val = 75
        return HdSmart.UI.toast('温度最高为75℃')
      } else if (val < 35) {
        val = 35
        return HdSmart.UI.toast('温度最低为35℃')
      }
      this.controlDevice('set_temperature', val)
    },
    controlDevice(attr, value) {
      return this.doControlDevice({
        nodeid: `water_heater.main.${attr}`,
        params: {
          attribute: {
            [attr]: value
          }
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
.body {
  min-height: 100%;
}
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-height: 550px;
  overflow-x: hidden;
  position: relative;
  background: #f4f7fe;

  &.filter {
    filter: blur(12px);
  }
  .main {
    flex: 1;
    padding-bottom: 40px;
    &.center {
      flex-direction: column;
    }
    .wrap-circle {
      width: 100%;
      display:flex;
      justify-content: space-around;
      .circle-gray {
        border: 2px solid #BFBFBF;
        border-radius: 50%;
        box-sizing: border-box;
        width: 276px;
        height: 276px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 40px;
        .icon {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          >img{
            width: 92px;
          }
        }
      }
      .circle-gray.active {
        border:2px solid #ff6026;
      }
      .cooker-name {
        font-size: 28px;
        margin-bottom: 14px;
        color: #000000;
        text-align: center;
      }
      .fire {
        font-size: 40px;
        color: #000000;
        text-align: center;
      }
    }
  }
  .footer {
    font-size: 28px;
    color: #A4A9AF;
    letter-spacing: 0;
    line-height: 40px;
    height: 336px;
    text-align: center;
  }
  &.close,
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
    &.page {
      background: #fff;
      .cover {
        background: #fff;
        .point {
          &.left {
            background: #d8d8d8;
          }
        }
      }
    }
    .panel-btn {
      background: #efefef;
    }
    .btn-wrap {
      opacity: 0.2;
      .btn {
        &.active {
          background: #fff;
          border: none;
        }
      }
    }
  }
}

</style>
