<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']">
      <topbar
        :title="device.device_name"
        bak-color="#000" />
      <!-- <div class="c-status">时段预约：6:00-9:00</div> -->
      <div class="main center">
        <div class="wrap-circle">
          <div class="circle-gray" />
          <div
            :style="{ transform: 'rotate(' + cRotate + 'deg)'}"
            class="circle" />
          <div class="cover">
            <span class="point left" />
            <span class="point right" />
            <span class="txt left">35<sup>°C</sup></span>
            <span class="txt right">{{ deviceAttrs.mode == 'sterilization' ? 80 : 75 }}<sup>°C</sup></span>
          </div>
        </div>

        <div class="bg center">
          <div
            v-if="isClose"
            class="bg2 center">
            <div class="num">--</div>
            <div class="time">--<sup>°C</sup></div>
            <div class="cmode">当前温度</div>
          </div>
          <div
            v-else
            class="bg2 center">
            <div class="num">{{ deviceAttrs.work_status == 'heat' ? '加热' : '保温' }}中</div>
            <div class="time">{{ deviceAttrs.temperature }}<sup>°C</sup></div>
            <div class="cmode">当前温度</div>
          </div>

          <div
            :style="{ transform: 'rotate(' + arrowRotate + 'deg)'}"
            class="bg2 pos-ab"><i class="circle-arrow" /></div>

        </div>
      </div>

      <div class="control center">
        <div
          v-show="!deviceAttrs.mode || deviceAttrs.mode == 'free'"
          class="reduce"
          @click="setTemperature(-1)" >-</div>
        <div class="main-control"><i class="icon" /> 预设温度 {{ deviceAttrs.set_temperature }}°C</div>
        <div
          v-show="!deviceAttrs.mode || deviceAttrs.mode == 'free'"
          class="add"
          @click="setTemperature(1)" >+</div>
      </div>

      <!-- 按钮 -->
      <div class="panel-btn center">
        <!-- <div
          class="more"
          @click="handleMore">
          <div :class="[isOpen ? 'up': 'down', 'arrow']">></div>
          <div>{{ isOpen ? '收起' : '查看更多' }}</div>
        </div> -->

        <div :class="[{'up-index': !isOffline }, 'btn-wrap']">
          <div
            :class="[{ 'active': !isClose }, 'btn-swich btn center']"
            @click="setSwitch" />
          <div class="btn-name">关机</div>
        </div>

        <div
          class="btn-wrap"
          @click="setMode('dy_expansion')">
          <div :class="[{ 'active': deviceAttrs.mode == 'dy_expansion' }, 'btn btn-heat center']" />
          <div class="btn-name">速热增容</div>
        </div>
        <div
          class="btn-wrap"
          @click="setMode('heat_keep')">
          <div :class="[ { 'active': deviceAttrs.mode == 'heat_keep' }, 'btn btn-znsw center']" />
          <div class="btn-name">智能温水</div>
        </div>
        <div
          class="btn-wrap"
          @click="setMode('sterilization')">
          <div :class="[ { 'active': deviceAttrs.mode == 'sterilization' }, 'btn btn-znyj center']" />
          <div class="btn-name">智能抑菌 </div>
        </div>

        <!--
        <div class="btn-wrap">
          <div
            class="btn-time btn center"/>
          <div class="btn-name">时段预约</div>
        </div>

        <div class="btn-wrap">
          <div
            class="btn btn-heat center"/>
          <div class="btn-name">速热增容</div>
        </div>
        <div class="btn-wrap">
          <div
            class="btn btn-znsw center"/>
          <div class="btn-name">智能水温</div>
        </div>

        <div
          v-show="isOpen"
          class="btn-wrap">
          <div
            class="btn btn-bpsr center"/>
          <div class="btn-name">变频速热</div>
        </div>
        <div
          v-show="isOpen"
          class="btn-wrap">
          <div
            class="btn btn-znyj center"/>
          <div class="btn-name">智能抑菌 </div>
        </div> -->
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      isOpen: false,
    }
  },
  computed: {
    ...mapGetters(['isClose', 'isOffline']),
    ...mapState(['device', 'deviceAttrs']),
    isRun() {
      return this.deviceAttrs.status == 'run'
    },
    cRotate() {
      if (this.isClose) {
        return -45
      } else {
        return (+this.deviceAttrs.temperature - 35) * 4.5 - 45
      }
    },
    arrowRotate() {
      if (this.isClose) {
        return 0
      } else {
        return (+this.deviceAttrs.temperature - 35) * 4.5
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
  height: 100vh;
  min-height: 550px;
  overflow-x: hidden;
  position: relative;
  background: #f4f7fe;

  &.filter {
    filter: blur(12px);
  }
  .c-status {
    margin-top: 30px;
    font-size: 24px;
    color: #35353d;
    text-align: center;
  }
  .bg {
    position: relative;
    z-index: 1;

    width: 370px;
    height: 370px;
    background: #f3f6fd;
    border-radius: 50%;
    padding: 10px;
    .bg2 {
      width: 100%;
      height: 100%;
      background: #fff;
      border-radius: 50%;
      flex-direction: column;
      &.pos-ab {
        background: transparent;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    .circle-arrow {
      display: block;
      width: 60px;
      height: 60px;
      background-image: url('~@lib/base/electric_water_heater/assets/new/arrow.png');
      background-size: 100% 100%;

      position: absolute;
      top: 50%;
      left: 0;
      transform: rotate(25deg) translate(-0, -50%);
    }
  }
  .main {
    margin-top: 80px;
    position: relative;
    &.center {
      flex-direction: column;
    }
    .wrap-circle {
      position: absolute;
      top: -31px;
      border-radius: 50%;
      .circle {
        box-sizing: border-box;
        border: 4px solid;
        border-color: transparent transparent #ff210e #ff210e;
        border-radius: 50%;
        width: 434px;
        height: 434px;

        transform: rotate(90deg);
      }
      .circle-gray {
        position: absolute;
        top: 0;
        border: 4px solid #d8d8d8;
        border-radius: 50%;
        box-sizing: border-box;
        width: 432px;
        height: 432px;
      }
      .cover {
        position: absolute;
        top: 50%;
        background: #f4f7fe;
        width: 100%;
        height: 220px;
        .point {
          display: block;
          background: #ff210e;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          &.left {
            position: absolute;
            top: -8px;
            left: -5px;
            background: #ff210e;
          }
          &.right {
            position: absolute;
            top: -8px;
            right: -5px;
            background: #d8d8d8;
          }
        }
        .txt {
          font-size: 24px;
          color: #000;
          &.left {
            position: absolute;
            top: 28px;
            left: -28px;
          }
          &.right {
            position: absolute;
            top: 28px;
            right: -10px;
          }
        }
        sup {
          font-size: 10px;
          position: absolute;
          top: -2px;
        }
      }
    }

    .num {
      font-size: 24px;
      color: #000;
      text-align: center;
      margin-bottom: 30px;
    }
    .time {
      font-size: 112px;
      color: #20282b;
      text-align: center;
      position: relative;
      sup {
        font-size: 24px;
        color: #2e2e2e;
        position: absolute;
        top: 30px;
      }
    }
    .cmode {
      margin-top: 20px;
      font-size: 24px;
      color: #000;
      text-align: center;
    }

    .nuit {
      opacity: 0.5;
      color: #03fd05;
      font-size: 24px;
      letter-spacing: 0;
      text-align: center;
      position: absolute;
      top: 145px;
    }
  }
  .status {
    margin-top: 60px;
    font-size: 24px;
    color: #20282b;
    text-align: center;
  }
  .control {
    margin: 40px 0;
    .reduce,
    .add {
      position: relative;
      background: #fff;
      border: 1px solid #f1f1f1;
      width: 72px;
      height: 72px;
      border-radius: 50%;
      margin: 0 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      font-weight: 900
    }
    // .reduce {
    //   &::before {
    //     font-size: 90px;
    //     content: "-";
    //     position: absolute;
    //     // top: 45%;
    //     // left: 50%;
    //     // transform: translate(-50%, -50%);
    //   }
    // }
    // .add {
    //   &::before {
    //     font-size: 70px;
    //     content: "+";
    //     position: absolute;
    //     text-align: center;
    //     // top: 45%;
    //     // left: 50%;
    //     // transform: translate(-50%, -50%);
    //   }
    // }

    .main-control {
      width: 276px;
      height: 72px;

      line-height: 72px;
      background: #f3e9f1;
      border-radius: 22px;
      font-size: 24px;
      text-align: center;
      color: #ff210e;
    }
  }

  .panel-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 38px 0;
    z-index: 9999;

    background: #ffffff;
    box-shadow: 0 -3px 28px 0 rgba(209, 209, 209, 0.5);
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
      top: -100px;
      .arrow {
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
      background: #ffffff;
      box-shadow: 0 -3px 28px 0 rgba(209, 209, 209, 0.5);
      display: flex;
      justify-content: space-evenly;
      align-items: center;
    }
  }

  .btn-wrap {
    margin: 0 24px 24px;
    &.up-index {
      position: relative;
      z-index: 9999;
    }
    .btn {
      box-sizing: border-box;
      margin: 0 auto;
      width: 120px;
      height: 120px;
      border: 1px solid #818181;
      border-radius: 50%;

      display: flex;
      flex-direction: column;
      &.active {
        background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
        border-color: #ffbf00;
      }
    }
    .btn-name {
      text-align: center;
      color: #000;
      margin-top: 16px;
      font-size: 24px;
    }
    .btn-start {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/blend/assets/start.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/blend/assets/start.png');
        }
      }
    }
    .btn-stop {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/blend/assets/btn-stop.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/blend/assets/btn-stop.png');
        }
      }
    }
    .btn-time {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/blend/assets/time-black.png');
        background-size: 100% 100%;
      }
    }
    .btn-heat {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/electric_water_heater/assets/new/heat.png');
        background-size: 100% 100%;
      }
    }
    .btn-znsw {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/electric_water_heater/assets/new/znsw.png');
        background-size: 100% 100%;
      }
    }
    .btn-bpsr {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/electric_water_heater/assets/new/bpsr.png');
        background-size: 100% 100%;
      }
    }
    .btn-znyj {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/electric_water_heater/assets/new/znyj.png');
        background-size: 100% 100%;
      }
    }

    .btn-swich {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/air_cleaner/assets/new-air/swich-black.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/air_cleaner/assets/new-air/swich-black.png');
        }
      }
    }
    .btn-mode {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/blend/assets/btn-mode1.png');
        background-size: 100% 100%;
      }
    }
    .btn-low {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/air_cleaner/assets/new-air/speed1.png');
        background-size: 100% 100%;
      }
    }
    .btn-middle {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/air_cleaner/assets/new-air/speed2.png');
        background-size: 100% 100%;
      }
    }
    .btn-high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/air_cleaner/assets/new-air/speed3.png');
        background-size: 100% 100%;
      }
    }
    .btn-very_high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/air_cleaner/assets/new-air/speed4.png');
        background-size: 100% 100%;
      }
    }
    .btn-super_high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/air_cleaner/assets/new-air/speed5.png');
        background-size: 100% 100%;
      }
    }
    .btn-more {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/air_cleaner/assets/new-air/more.png');
        background-size: 100% 100%;
      }
    }
  }
  &.close,
  &.offline {
    &:before {
      content: "";
      position: fixed;
      top: 80PX;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 999;
      width: 100%;
      background: rgba(0, 0, 0, 0.1);
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

.btns-panel {
  &:before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 99999;
    width: 100%;

    background: rgba(0, 0, 0, 0.8);
  }
  .items {
    position: fixed;
    left: 510px;
    top: 950px;
    z-index: 999999;

    width: 750px;
    min-height: 160px;
    .btn {
      transition: all 0.3s ease-in-out;
      position: absolute;
      top: 0;
      left: 0;
    }
    .item1 {
      top: -122px;
      left: 88px;
    }
    .item2 {
      top: -122px;
      left: -76px;
    }
    .item3 {
      top: 20px;
      left: -150px;
    }
    .item4 {
      top: 155px;
      left: -94px;
    }
    .item5 {
      top: 150px;
      left: 50px;
    }
  }
  &.more {
    .items {
      left: 384px;
    }
  }
  .btns {
    justify-content: flex-start;
    transition: all 0.3s ease-in-out;
    margin-top: 57px;
    .btn {
      margin-right: 40px;
      width: 120px;
      height: 120px;
      border: 1px solid #fff;
      border-radius: 50%;

      display: flex;
      flex-direction: column;

      .name {
        margin-top: 8px;
        font-size: 20px;
        color: #fff;
      }
      &.active {
        background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
        border-color: #ffbf00;
      }
    }
    .btn-swich {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/air_cleaner/assets/new-air/swich-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/air_cleaner/assets/new-air/swich-black.png');
        }
      }
    }

    .btn-low {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/air_cleaner/assets/new-air/speed1-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/air_cleaner/assets/new-air/speed1.png');
        }
      }
    }
    .btn-middle {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/air_cleaner/assets/new-air/speed2-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/air_cleaner/assets/new-air/speed2.png');
        }
      }
    }
    .btn-high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/air_cleaner/assets/new-air/speed3-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/air_cleaner/assets/new-air/speed3.png');
        }
      }
    }
    .btn-very_high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/air_cleaner/assets/new-air/speed4-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/air_cleaner/assets/new-air/speed4.png');
        }
      }
    }
    .btn-super_high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/air_cleaner/assets/new-air/speed5-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/air_cleaner/assets/new-air/speed5.png');
        }
      }
    }
  }
}
.items {
  margin-bottom: 30px;
  .btns {
    display: flex;
    justify-content: center;
    justify-content: flex-start;
    padding: 10px 30px;
    .btn-wrap {
      margin-right: 20px;
    }

    .btn-name {
      margin-top: 16px;
      font-size: 24px;
      color: #20282b;
      text-align: center;
    }

    .btn {
      box-sizing: border-box;
      margin: 0 5px;
      width: 110px;
      height: 110px;
      border: 1px solid #20282b;
      border-radius: 50%;

      display: flex;
      flex-direction: column;
      &.active {
        background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
        border: none;
      }
    }
    .btn-swich {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/air_condition/assets/new-air/swich-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/air_condition/assets/new-air/swich-black.png');
        }
      }
    }
    .btn-start {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/haier_washer/assets/btn-start.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/haier_washer/assets/btn-stop.png');
        }
      }
    }
    .btn-stop {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/haier_washer/assets/btn-stop.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/haier_washer/assets/btn-stop.png');
        }
      }
    }
    .btn-mode {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/haier_washer/assets/btn-mode-white58.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/haier_washer/assets/btn-mode-black58.png');
        }
      }
    }
    .btn-time {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/air_condition/assets/new-air/time-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/air_condition/assets/new-air/time-black.png');
        }
      }
      &.btn-current {
        border-color: #ffc600;
        &::before {
          background-image: url('~@lib/base/air_condition/assets/new-air/time-yellow.png');
        }
        .name {
          color: #ffc600;
        }
      }
    }

    .btn-mode1 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/blend/assets/btn-mode1.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/blend/assets/btn-mode1.png');
        }
      }
    }
    .btn-mode2 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/blend/assets/btn-mode2.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/blend/assets/btn-mode2.png');
        }
      }
    }
    .btn-mode3 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/blend/assets/btn-mode3.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/blend/assets/btn-mode3.png');
        }
      }
    }
    .btn-mode4 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/blend/assets/btn-mode4.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/blend/assets/btn-mode4.png');
        }
      }
    }
    .btn-mode5 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/blend/assets/btn-mode5.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/blend/assets/btn-mode5.png');
        }
      }
    }
    .btn-mode6 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/blend/assets/btn-mode6.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/blend/assets/btn-mode6.png');
        }
      }
    }
    .btn-mode7 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/blend/assets/btn-mode7.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/blend/assets/btn-mode7.png');
        }
      }
    }
    .btn-mode8 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/blend/assets/btn-mode8.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/blend/assets/btn-mode8.png');
        }
      }
    }
    .btn-mode9 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/blend/assets/btn-mode9.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/blend/assets/btn-mode9.png');
        }
      }
    }
    .btn-mode10 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/blend/assets/btn-mode10.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/blend/assets/btn-mode10.png');
        }
      }
    }
  }
}
</style>
