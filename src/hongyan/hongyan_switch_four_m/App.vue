<template>
  <div class="body">
    <div :class="[{'offline': isOffline }, {'close': isClose}, 'page']">
      <!-- 顶部 -->
      <topbar
        :title="device.device_name"
        bak-color="#000" />
      <!-- 灯 -->
      <div class="main center">
        <div class="bg center">
          <div class="panel">
            <div class="panel-btn center">
              <div
                v-if="deviceAttrs.list"
                :class="['btn-wrap', 'btn-wrap-four']">
                <div class="btn-name btn-name-top">{{ deviceAttrs.list[0].chan_name?deviceAttrs.list[0].chan_name:'一路开关' }}</div>
                <div
                  :class="[{ 'active': deviceAttrs.list[0].chan_status == 'on' }, 'btn btn-switch center']"
                  @click="setSwitch1"/>
                <div class="btn-name">开关</div>
              </div>
            </div>
          </div>
          <div class="panel">
            <div class="panel-btn center">
              <div
                v-if="deviceAttrs.list"
                :class="['btn-wrap', 'btn-wrap-four']">
                <div class="btn-name btn-name-top">{{ deviceAttrs.list[1].chan_name?deviceAttrs.list[1].chan_name:'二路开关' }}</div>
                <div
                  :class="[{ 'active': deviceAttrs.list[1].chan_status == 'on' }, 'btn btn-switch center']"
                  @click="setSwitch2"/>
                <div class="btn-name">开关</div>
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
                <div class="btn-name">开关</div>
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
                <div class="btn-name">开关</div>
              </div>
            </div>
          </div>
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
              :class="[{ 'active': deviceAttrs.list[0].chan_status == 'on' && deviceAttrs.list[1].chan_status == 'on' && deviceAttrs.list[2].chan_status == 'on' && deviceAttrs.list[3].chan_status == 'on' }, 'btn btn-start center']"
              @click="setSwitchOn('on')"/>
            <div class="btn-name">全开</div>
          </div>
          <div
            v-if="deviceAttrs.list"
            :class="['btn-wrap', 'btn-wrap-four']"
          >
            <div
              :class="[{ 'active': deviceAttrs.list[0].chan_status == 'off' && deviceAttrs.list[1].chan_status == 'off' && deviceAttrs.list[2].chan_status == 'off' && deviceAttrs.list[3].chan_status == 'off' }, 'btn btn-close center']"
              @click="setSwitchOff('off')"/>
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
    ...mapGetters(['isClose', 'isOffline']),
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
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    setSwitchOn(val) {
      if(this.isOffline) return
      if(this.flagOn == false) return
      if(this.deviceAttrs.list[0].chan_status == 'on' && this.deviceAttrs.list[1].chan_status == 'on' && this.deviceAttrs.list[2].chan_status == 'on' && this.deviceAttrs.list[3].chan_status == 'on') return
      this.flagOn = false
      this.controlDevice("switch_chan", val)
    },
    setSwitchOff(val) {
      if(this.isOffline) return
      if(this.flagOff == false) return
      if(this.deviceAttrs.list[0].chan_status == 'off' && this.deviceAttrs.list[1].chan_status == 'off' && this.deviceAttrs.list[2].chan_status == 'off' && this.deviceAttrs.list[3].chan_status == 'off') return
      this.flagOff = false
      this.controlDevice("switch_chan", val)
    },
    setSwitch1() {
      if(this.isOffline) return
      if(this.flagOn == false || this.flagOff == false) return
      let switchStatus = ''
      if (this.deviceAttrs.list[0].chan_status == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.controlDevice("switch_chan0", switchStatus)
    },
    setSwitch2() {
      if(this.isOffline) return
      if(this.flagOn == false || this.flagOff == false) return
      let switchStatus = ''
      if (this.deviceAttrs.list[1].chan_status == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.controlDevice("switch_chan1", switchStatus)
    },
    setSwitch3() {
      if(this.isOffline) return
      if(this.flagOn == false || this.flagOff == false) return
      let switchStatus = ''
      if (this.deviceAttrs.list[2].chan_status == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.controlDevice("switch_chan2", switchStatus)
    },
    setSwitch4() {
      if(this.isOffline) return
      if(this.flagOn == false || this.flagOff == false) return
      let switchStatus = ''
      if (this.deviceAttrs.list[3].chan_status == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.controlDevice("switch_chan3", switchStatus)
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
  },
}
</script>

<style lang="less" scoped>
@imgPath: 'base/honghan_switch/assets';
@100: 100% 100%;
.body {
  min-height: 100%;
  height: 100vh;
  touch-action: manipulation;
  // background: linear-gradient(0deg, #346EE6 0%, #346EE7 100%);
  background: url('~@lib/@{imgPath}/img_bg_01@2x.png');
  background-size: 100% 100%;
}
.page {
  height: 100vh;
  overflow-x: hidden;
  position: relative;
  // background: linear-gradient(0deg, #346EE6 0%, #346EE7 100%);

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
    margin-top: 10%;
    position: relative;
    .bg {
      display: flex;
      justify-content: space-evenly;
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
    background: rgba(255, 255, 255, 0.4);
    width: 332px;
    height: 374px;
    display: flex;
    margin-bottom: 10px;
  }
  .panel-btn {
    // position: fixed;
    // bottom: 0;
    // left: 0;
    // right: 0;
    padding: 38px 0;
    z-index: 9999;

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
      width: 332px;
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
      margin-top: 16px;
      font-size: 24px;
    }
    .btn-switch {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/@{imgPath}/btn_ac_on_cd@3x.png');
        background-size: @100;
      }
      &.active {
        border-color: #000000;
        background: #000000;
        &::before {
          background-image: url('~@lib/@{imgPath}/dakai4@3x.png')
        }
      }
    }
    .btn-start {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/@{imgPath}/kg_btn_allon.png');
        background-size: @100;
      }
      &.active {
        border-color: #000000;
        background: #000000;
        &::before {
          background-image: url('~@lib/@{imgPath}/kg_btn_allon_hl.png')
        }
      }
    }
    .btn-close {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/@{imgPath}/kg_btn_alloff.png');
        background-size: @100;
      }
      &.active {
        border-color: #000000;
        background: #000000;
        &::before {
          background-image: url('~@lib/@{imgPath}/kg_btn_alloff_hl.png')
        }
      }
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
</style>
