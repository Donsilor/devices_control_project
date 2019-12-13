<template>
  <div class="body">
    <div
      v-show="deviceAttrs.error=='overheaterro'||deviceAttrs.error=='burnerro'||deviceAttrs.error=='tsensorerro'"
      :style="{top:status_bar_height+44+'px'}"
      class="offline_bar offline_bar_wifi">
      <div class="offline_bar_div">
        <span class="link">{{ errorText }}</span>
      </div>
    </div>
    <div
      v-show="deviceAttrs.error=='overheaterro'||deviceAttrs.error=='burnerro'||deviceAttrs.error=='tsensorerro'"
      :style="{top:status_bar_height+44+'px'}"
      class="bgc"/>
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']">
      <topbar
        :title="device.device_name"
        :room="device.room_name"
        bak-color="#000"/>
      <!-- <div class="c-status">时段预约：6:00-9:00</div> -->
      <div class="main center">
        <div class="wrap-circle">
          <div class="mask-gray">
            <div class="circle-gray" />
          </div>
          <div class="mask">
            <div
              :style="{ transform: 'rotate(' + cRotate + 'deg)'}"
              class="circle" />
          </div>
          <div class="cover">
            <span class="point left" />
            <span :class="['point', 'right', {'rightRed': deviceAttrs.currenttemperature >= 75}]" />
            <span class="txt left">30<sup>°C</sup></span>
            <span class="txt right">{{ deviceAttrs.mode == 'hot' ? 78 : 75 }}<sup>°C</sup></span>
          </div>
        </div>

        <div class="bg center">
          <div
            v-if="isClose||isOffline"
            class="bg2 center">
            <div class="num">--</div>
            <div class="time">--<sup>°C</sup></div>
            <div class="cmode">当前温度</div>
          </div>
          <div
            v-else
            class="bg2 center">
            <div class="num">{{ state }}</div>
            <div class="time">{{ deviceAttrs.currenttemperature ? deviceAttrs.currenttemperature : '--' }}<sup>°C</sup></div>
            <div class="cmode">当前温度</div>
          </div>

          <div
            :style="{ transform: 'rotate(' + arrowRotate + 'deg)'}"
            class="bg2 pos-ab"><i class="circle-arrow" /></div>

        </div>
      </div>

      <div class="control center">
        <div
          v-show="deviceAttrs.mode != 'hot'"
          class="reduce"
          @click="setTemperature(-1)" ><img
            src="~@lib/base/oakes_air_condition/assets/down.png"
            alt=""></div>
        <div
          class="main-control"><i class="icon" /> 预设温度 {{ deviceAttrs.temperature }}°C</div>
        <div
          v-show="deviceAttrs.mode != 'hot'"
          class="add"
          @click="setTemperature(1)" ><img
            src="~@lib/base/oakes_air_condition/assets/up.png"
            alt=""></div>
      </div>
      <div class="chronography">
        <div
          v-show="deviceAttrs.mode == 'timer'"
          class="subscribe-chronography"
          @click="showTime">{{ deviceAttrs.remaining | closeTime }} </div>
          <!-- <div
          v-show="deviceAttrs.mode == 'hot'"
          class="inverted-chronography">45分钟后跳到即热模式</div> -->
      </div>
      <div
        :class="[{'close': isClose }, 'tips-btn']">
        <div
          :class="[{'up-index': isClose }, 'btn-wrap']">
          <div
            :class="[{ 'active': !isClose }, 'btn-swich btn center']"
            @click="setSwitch" />
        </div>
      </div>
      <!-- 按钮 -->
      <div class="panel-btn center">
        <!-- <div
          class="more"
          @click="handleMore">
          <div :class="[isOpen ? 'up': 'down', 'arrow']">></div>
          <div>{{ isOpen ? '收起' : '查看更多' }}</div>
        </div> -->

        <!-- <div :class="[{'up-index': !isOffline }, 'btn-wrap']">
          <div
            :class="[{ 'active': !isClose }, 'btn-swich btn center']"
            @click="setSwitch" />
          <div class="btn-name">关机</div>
        </div> -->

        <div
          class="btn-wrap"
          @click="setMode('instant')">
          <div :class="[{ 'active': deviceAttrs.mode == 'instant' }, 'btn btn-heat center']" />
          <div class="btn-name">即热模式</div>
        </div>
        <div
          class="btn-wrap"
          @click="setMode('timer')">
          <div :class="[ { 'active': deviceAttrs.mode == 'timer' }, 'btn btn-znsw center']" />
          <div class="btn-name">预约模式</div>
        </div>
        <div
          class="btn-wrap"
          @click="setMode('autodown')">
          <div :class="[ { 'active': deviceAttrs.mode == 'autodown' }, 'btn btn-auto center']" />
          <div class="btn-name">自动关机</div>
        </div>
        <div
          class="btn-wrap"
          @click="setMode('hot')">
          <div :class="[ { 'active': deviceAttrs.mode == 'hot' }, 'btn btn-znyj center']" />
          <div class="btn-name">高温抑菌 </div>
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
      <!-- 时间选择 -->
      <SelectTime
        ref="time"
        @selectedTime="setReserve" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import SelectTime from './components/time.vue'
let dpr = /iPad|iPhone|iPod/.test(navigator.userAgent) ? 1 : window.devicePixelRatio
export default {
  components: {
    SelectTime
  },
  data() {
    return {
      isOpen: false,
      disabledVal: false,
      status_bar_height:25,
      errorText:""
    }
  },
  computed: {
    ...mapGetters(['isClose', 'isOffline']),
    ...mapState(['device', 'deviceAttrs']),
    isRun() {
      return this.deviceAttrs.status == 'run'
    },
    cRotate() {
      if (this.isClose||this.isOffline||this.deviceAttrs.currenttemperature<=30) {
        return -45
      } else if(this.deviceAttrs.currenttemperature>=75){
          return 135
      }else if(this.deviceAttrs.mode == 'hot') {
        return (+this.deviceAttrs.currenttemperature - 30) * 3.75 - 45
      } else {
        return (+this.deviceAttrs.currenttemperature - 30) * 4 - 45
      }
    },
    arrowRotate() {
      if (this.isClose||this.isOffline||this.deviceAttrs.currenttemperature<=30) {
        return 0
      } else if(this.deviceAttrs.currenttemperature>=75){
         return 180
      }else if(this.deviceAttrs.mode == 'hot') {
        return (+this.deviceAttrs.currenttemperature - 30) * 3.75
      } else {
        return (+this.deviceAttrs.currenttemperature - 30) * 4
      }
    },
    state() {
      /* eslint-disable no-unreachable */
      switch (this.deviceAttrs.state) {
        case 'standby':
          return '待机中'
          break
        case 'heating':
          return '加热中'
          break
        case 'insulation':
          return '保温中'
          break
        case 'appoint':
          return '预约中'
          break
        default:
          break
      }
    },
  },
  watch: {
   'deviceAttrs.error':{
        handler:function(newValue){
            switch(newValue){
              case "overheaterro":
              this.errorText = "超温故障"
              break
              case "burnerro":
              this.errorText = "干烧故障"
              break
              case "tsensorerro":
              this.errorText = "内胆温度传感器故障"
              break
            }
        },
        immediate: true
    },
    'deviceAttrs.temperature'() {
      if(this.deviceAttrs.temperature) {
        this.disabledVal = false
      }
    }
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
      HdSmart.UI.setStatusBarColor(2)
       if (window.status_bar_height) {
        this.status_bar_height = window.status_bar_height / dpr
      }
    })
    //测试报错
    // setTimeout(()=>{
    //   this.controlDevice("error", 'tsensorerro')
    // },2000)
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    setReserve(time) {
      HdSmart.UI.vibrate()
      console.log(time)
      let h = parseInt(time[0].split(':')[0]) + 1
      // let m = parseInt(time[0].split(':')[1])
      var val = 0
      if(this.getDateTime(new Date(), 'm') < 30) {
        val = (this.getDateTime(new Date(), 'h') * 60) + (h * 60)
      } else {
        val = (this.getDateTime(new Date(), 'h') * 60) + (h * 60) + 60
      }
      if(val > 1440) {
        val = val - 1440
      }
      this.controlDevice('remaining', val)
      .then((res) => {
        if(res.code != 0) {
          HdSmart.UI.toast('操作失败，请确认设备状态')
        }
      })
      .catch(() => {
        HdSmart.UI.toast('操作失败，请确认设备状态')
      })
    },
    showTime() {
      this.$refs.time.show = true
    },
    handleMore() {
      this.isOpen = !this.isOpen
    },
    setMode(val) {
      if (val == this.deviceAttrs.mode) {
        val = 'free'
      }
      if (this.isClose) return
      HdSmart.UI.vibrate()
      this.controlDevice('mode', val)
      .then((res) => {
        if(res.code != 0) {
          HdSmart.UI.toast('操作失败，请确认设备状态')
        }
      })
      .catch(() => {
        HdSmart.UI.toast('操作失败，请确认设备状态')
      })
    },
    setSwitch() {
      HdSmart.UI.vibrate()
      let switchStatus = ''
      if (this.deviceAttrs.switch == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.controlDevice("switch", switchStatus)
       .then((res) => {
        if(res.code != 0) {
          HdSmart.UI.toast('操作失败，请确认设备状态')
        }
      })
      .catch(() => {
        HdSmart.UI.toast('操作失败，请确认设备状态')
      })
    },
    setTemperature(step) {
      if(this.disabledVal == true) return
      HdSmart.UI.vibrate()
      this.disabledVal = true
      let val = +this.deviceAttrs.temperature + step
      if (val > 75) {
        val = 75
        this.disabledVal = false
        return HdSmart.UI.toast('温度最高为75℃')
      } else if (val < 30) {
        val = 30
        this.disabledVal = false
        return HdSmart.UI.toast('温度最低为30℃')
      }
      this.controlDevice('temperature', val)
      .then((res) => {
        if(res.code == 0) {
          // this.disabledVal = false
        }  else {
          this.disabledVal = false
          HdSmart.UI.toast('操作失败，请确认设备状态')
        }
      })
      .catch(() => {
        this.disabledVal = false
        HdSmart.UI.toast('操作失败，请确认设备状态')
      })
    },
    getDateTime(date, type) {
      // 时间格式获取
      if (!date) return
      let d = new Date(+date)
      let year = d.getFullYear()
      let month =
        d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
      let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
      let hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
      let minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
      let seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()
      if (type === 'fulltime') {
        return (
          year +
          '-' +
          month +
          '-' +
          day +
          ' ' +
          hours +
          ':' +
          minutes +
          ':' +
          seconds
        )
      } else if (type === 'hms') {
        return hours + ':' + minutes + ':' + seconds
      } else if (type === 'h') {
        return hours
      } else if (type === 'm') {
        return minutes
      } else if (type === 's') {
        return seconds
      } {
        return year + '-' + month + '-' + day
      }
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
@imgPath3: 'base/honghan_switch/assets';
@imgPath4: 'base/oakes_air_condition/assets';
.offline_bar {
    background: rgba(0, 0, 0, .3);
    position: fixed;
    z-index:1000000;
    width: 100%;
    height: 44PX;
    line-height: 44PX;
    text-align: center;
    color: #fff;
    font-size: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 20PX;
    .offline_bar_div{
      display: flex;
      justify-content: center;
      align-items: center;
       .link{
        font-family: PingFangSC-Light;
        font-size: 32px;
        color: #FFFFFF;
        letter-spacing: 0;
      }
    }
    .offline_bar_p{
      width: 26PX;
      height: 44PX;
      display: flex;
      justify-content:flex-start;
      align-items: center;
    }
}
.bgc{
  position: fixed;
  z-index:99999;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      width: 100%;
      background: rgba(0, 0, 0, 0.1);
}
.body {
  min-height: 100%;
}
.page {
  height: 100vh;
  min-height: 550px;
  overflow-x: hidden;
  position: relative;
  background: url('~@lib/@{imgPath3}/bg02.png');
  background-size: 100% 100%;
  &.close,
  &.offline {
    &:before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 999;
      width: 100%;
      background: rgba(0, 0, 0, 0.1);
    }
  }
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
    // background: #f3f6fd;
    border-radius: 50%;
    padding: 10px;
    .bg2 {
      width: 100%;
      height: 100%;
      background: #fff;
      border-radius: 50%;
      flex-direction: column;
      background: rgba(0, 0, 0, 0.04);
      // box-shadow: inset 0 1px 4px 0 #D6DCEB;
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
      .mask {
        height: 217px;
        // width: 217px;
        overflow: hidden;
      }
      .mask-gray {
        overflow: hidden;
        height: 216px;
        position: absolute;
      }
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
        // position: absolute;
        top: 0;
        border: 4px solid #d8d8d8;
        border-radius: 50%;
        box-sizing: border-box;
        width: 432px;
        height: 432px;
      }
      .cover {
        position: absolute;
        // top: 50%;
        // background: #f4f7fe;
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
          &.rightRed {
            background: #ff210e;
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
          font-size: 6px;
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
        top: 10px;
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
    margin: 40px 0 0;
    .reduce,
    .add {
      position: relative;
      background: rgba(0,0,0,0.05);
      // border: 1px solid #f1f1f1;
      width: 72px;
      height: 72px;
      border-radius: 50%;
      // margin: 0 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      font-weight: 900;
      img{
        width: 50px;
      }
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
      // background: #f3e9f1;
      border-radius: 22px;
      font-size: 24px;
      text-align: center;
      color: #ff210e;
      &::before {
        content: "";
        display: inline-block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/electric_water_heater/assets/new/morez.png');
        background-size: 100% 100%;
        position: relative;
        top: 10px;
      }
    }
  }

  .panel-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 38px 0;
    z-index: 99;

    // background: #ffffff;
    // box-shadow: 0 -3px 28px 0 rgba(209, 209, 209, 0.5);
    // border-radius: 42px 42px 0px 0px;

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
      // background: #ffffff;
      // box-shadow: 0 -3px 28px 0 rgba(209, 209, 209, 0.5);
      display: flex;
      // justify-content: space-evenly;
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
      background: rgba(0,0,0,0.05);
      border-radius: 50%;

      display: flex;
      flex-direction: column;
      &.active {
        background-image: linear-gradient(221deg, #F1CB85 10%, #E1B96E 81%);
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
        background-image: url('~@lib/base/electric_water_heater/assets/new/kt_mode_heat.png');
        background-size: 100% 100%;
      }
    }
    .btn-znsw {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/electric_water_heater/assets/new/btn_ac_time.png');
        background-size: 100% 100%;
      }
    }
    .btn-auto {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/electric_water_heater/assets/new/kt_mode_auto.png');
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
        background-image: url('~@lib/base/electric_water_heater/assets/new/kt_mode_gaowen.png');
        background-size: 100% 100%;
      }
    }

    .btn-swich {
      position: relative;
      z-index:10000;
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/@{imgPath4}/dakai3@2x.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('~@lib/@{imgPath4}/dakai3@2x.png');
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
    // &:before {
    //   content: "";
    //   position: fixed;
    //   top: 64px;
    //   left: 0;
    //   bottom: 0;
    //   right: 0;
    //   z-index: 999;
    //   width: 100%;
    //   background: rgba(0, 0, 0, 0.1);
    // }
    // &.page {
      // background: #fff;
      // .cover {
        // background: #fff;
        // .point {
          // &.left {
            // background: #d8d8d8;
          // }
        // }
      // }
    // }
    // .panel-btn {
      // background: #efefef;
    // }
    .btn-wrap {
      opacity: 0.5;
      &.up-index {
        opacity: 1;
      }
      .btn {
        &.active {
          // background: #fff;
          border: none;
        }
      }
    }
  }
}

.btns-panel {
  // &:before {
  //   content: "";
  //   position: fixed;
  //   top: 0;
  //   left: 0;
  //   bottom: 0;
  //   right: 0;
  //   z-index: 99999;
  //   width: 100%;

  //   background: rgba(0, 0, 0, 0.8);
  // }
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
 .tips-btn{
   position: fixed;
    // margin-top: 100px;
    bottom: 20%;
    margin: 0 auto;
    width: 100%;
    text-align: center;
    font-size: 36px;
    display: flex;
    justify-content: center;
    &.close{
      z-index: 9999
    }
  }
.chronography {
  font-size: 12px;
  color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 40px;
  .subscribe-chronography {
    width: auto;
    &::after {
      content: "";
      display: inline-block;
      width: 30px;
      height: 30px;
      background-image: url('~@lib/base/electric_water_heater/assets/new/btn_ac_bianji.png');
      background-size: 100% 100%;
      position: relative;
      top: 6px;
    }
  }
}
</style>
