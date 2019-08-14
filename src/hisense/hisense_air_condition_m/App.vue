<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']">
      <topbar 
        :title="device.device_name"
        bak-color="#000" />
      <div class="main center">
        <div class="wrap-circle">
          <div class="bg">
            <div class="tm">{{ deviceAttrs.temperature | filterTm }}<sup>°C</sup></div>
            <i :class="[deviceAttrs.mode, 'c-mode']"/>
          </div>
          <circle-progress
            v-if="isShow"
            id="myId"
            ref="$circle"
            key="animation-model"
            :is-animation="true"
            :is-round="true"
            :width="width"
            :radius="radius"
            :progress="progress"
            :bar-color="barColor"
            :duration="duration"
            :delay="delay"
            :background-color="backgroundColor"
            class="progress"
          />
        </div>
        <div class="control-tm center">
          <button 
            class="control reduce" 
            @click="setTemperature(-10)"/>
          <button 
            class="control add" 
            @click="setTemperature(10)"/>
        </div>
      </div>
      <!-- 当前状态 -->
      <div 
        class="status">
        <i class="icon-status" />
        正在{{ deviceAttrs.mode | modeType }}
        {{ deviceAttrs.wind_up_down === 'on' ? '上下扫风':'' }}
        {{ deviceAttrs.wind_left_right === 'on' ? '左右扫风': '' }}
      </div>
      <!-- 底部按钮 -->
      <div class="panel-btn center">
        <div 
          class="more" 
          @click="handleMore">
          <span :class="[isOpen ? 'up': 'down', 'arrow']">></span>
          <div>{{ isOpen ? '收起' : '查看更多' }}</div>
        </div>
        <div :class="[{'up-index': !isOffline }, 'btn-wrap']">
          <div 
            :class="[{ 'active': !isClose }, 'btn-swich btn center']"
            @click="setSwitch" />
          <div class="btn-name">开关</div>
        </div>
        <div 
          class="btn-wrap"
          @click="setMode('cold')">
          <div :class="[{ 'active': deviceAttrs.mode == 'cold' }, 'btn btn-cold center']" />
          <div class="btn-name">制冷</div>
        </div>
        <div 
          class="btn-wrap"
          @click="setMode('heat')">
          <div :class="[ { 'active': deviceAttrs.mode == 'heat' }, 'btn btn-heat center']" />
          <div class="btn-name">制热</div>
        </div>
        <div 
          class="btn-wrap"
          @click="showMode">
          <div :class="[ { 'active': modeIsActive }, modeClass, 'btn center']" />
          <div class="btn-name">模式 </div>
        </div>
        <div 
          v-show="isOpen" 
          class="btn-wrap"
          @click="showSpeed">
          <div :class="[ { 'active': speedIsActive }, speedClass, 'btn center']" />
          <div class="btn-name">风速</div>
        </div>
        <div 
          v-show="isOpen"
          class="btn-wrap"
          @click="showSwing">
          <div :class="[ { 'active': windIsActive }, 'btn btn-up center']" />
          <div class="btn-name">摆风 </div>
        </div>
      </div>
      <!--选择摆风-->
      <model-swing 
        ref="swing"
        :wind_up_down="deviceAttrs.wind_up_down"
        :wind_left_right="deviceAttrs.wind_left_right"
        @setWind="setWind" />
      <!--选择模式-->
      <model-mode 
        ref="mode"
        :mode="deviceAttrs.mode"
        @setMode="setMode" />
      <!--选择风速-->
      <model-speed 
        ref="speed"
        :speed="deviceAttrs.speed"
        @setSpeed="setSpeed" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import circleProgress from './components/circle-progress'
import modelSwing from './components/model-swing'
import modelMode from './components/model-mode'
import modelSpeed from './components/model-speed'
const [MIN_TEMP, MAX_TEMP] = [160, 300]
export default {
  components: {
    circleProgress,
    modelSwing,
    modelMode,
    modelSpeed,
  },
  data() {
    return {
      isOpen: false,
      isShow: true,
      width: 220,
      radius: 8,
      progress: 30, // 0~70
      duration: 0,
      delay: 0,
      barColor: '#D8D8D8',
      backgroundColor: '#ececec',
    }
  },
  computed: {
    ...mapGetters(['isClose', 'isOffline']),
    ...mapState(['device', 'deviceAttrs']),
    modeIsActive() {
      return this.deviceAttrs.mode == 'auto' || this.deviceAttrs.mode == 'dehumidify' || this.deviceAttrs.mode == 'wind'
    },
    speedIsActive() {
      if(this.deviceAttrs.mode == 'wind') {
        return false
      } else {
        return true
      }
    },
    windIsActive() {
      return this.deviceAttrs.wind_up_down == 'on' || this.deviceAttrs.wind_left_right == 'on' 
    },
    modeClass() {
      /* eslint-disable no-unreachable */
      switch (this.deviceAttrs.mode) {
        case 'auto':
          return 'btn-auto'
          break
        case 'dehumidify':
          return 'btn-dehumidify'
          break
        case 'wind':
          return 'btn-wind'
          break
        default:
          return 'btn-wind'
      }
    },
    speedClass() {
      /* eslint-disable no-unreachable */
      switch (this.deviceAttrs.speed) {
        case 'low':
          return 'btn-low'
          break
        case 'normal':
          return 'btn-normal'
          break
        case 'high':
          return 'btn-high'
          break
        case 'auto':
          return 'btn-auto'
          break
        default:
          return 'btn-low'
      }
    },
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
        .then(() => {
          this.reset()
        })
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    handleMore() {
      if (this.isClose) return
      this.isOpen = !this.isOpen
    },
    setMode(val) {
      if (val == this.deviceAttrs.mode || this.isClose) return
      this.controlDevice('mode', val)
        .then(() => {
          this.deviceAttrs.mode = val
          this.reset()
          this.hide()
        })
    },
    setSwitch() {
      let switchStatus = ''
      if (this.deviceAttrs.switch == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.controlDevice("switch", switchStatus)
    },
    setTemperature(step) {
      // 送风模式不能设置温度
      if (this.deviceAttrs.mode === 'wind') {
        return HdSmart.UI.toast('送风模式下不能设置温度')
      }
      let temp = +this.deviceAttrs.temperature + step
      // 最小温度
      if (temp < MIN_TEMP) {
        if (this.deviceAttrs.temperature == MIN_TEMP) {
          return HdSmart.UI.toast('温度已调至最低')
        } else {
          temp = MIN_TEMP
        }
      }
      // 最大温度
      if (temp > MAX_TEMP) {
        if (this.deviceAttrs.temperature == MAX_TEMP) {
          return HdSmart.UI.toast('温度已调至最高')
        } else {
          temp = MAX_TEMP
        }
      }
      this.controlDevice('temperature', temp)
        .then(() => {
          this.deviceAttrs.temperature = temp
          this.reset()
        })
    },
    setWind(attr) {
      if (this.isClose) return
      var val = this.deviceAttrs[attr] === 'on' ? 'off' : 'on'
      this.controlDevice(attr, val)
        .then(() =>{
          this.hide()
        })
    },
    setSpeed(speed) {
      if (this.deviceAttrs.temperature == MAX_TEMP && this.deviceAttrs.speed == 'low' && this.deviceAttrs.mode == 'cold') {
        return HdSmart.UI.toast('低风、制冷模式下不支持此温度')
      }
      if(this.deviceAttrs.mode == 'wind' && speed == 'auto') {
        return HdSmart.UI.toast('送风模式不能设置自动风速')
      }
      this.controlDevice('speed', speed)
        .then(() =>{
          this.hide()
        })
    },
    controlDevice(attr, value) {
      return this.doControlDevice({
        nodeid: `airconditioner.main.${attr}`,
        params: {
          attribute: {
            [attr]: value
          }
        }
      })
    },
    // 重置动画
    reset() {
      this.barColor = this.getBarColor()
      this.progress = this.getProgress()
      this.$nextTick(() => {
        this.$refs.$circle.init()
      })
    },
    showSwing() {
      if (this.isClose) return
      this.$refs.swing.show = true
    },
    showMode() {
      if (this.isClose) return
      this.$refs.mode.show = true
    },
    showSpeed() {
      if (this.isClose) return
      this.$refs.speed.show = true
    },
    hide(){
      if(this.$refs.swing.show) this.$refs.swing.show = false
      if(this.$refs.mode.show) this.$refs.mode.show = false
      if(this.$refs.speed.show) this.$refs.speed.show = false
    },
    getBarColor() {
      if(this.isClose || this.isOffline) return '#D8D8D8'
      /* eslint-disable no-unreachable */
      switch (this.deviceAttrs.mode) {
        case 'cold':
          return '#00D5FF'
          break
        case 'heat':
          return '#FF5F00'
          break
        default:
          return '#0FDC66'
      }
    },
    getProgress() {
      // 计算温度进度条
      return 70 /(30 - 16) * (this.deviceAttrs.temperature / 10 - 16)
    }
  }
}
</script>
<style lang="less" scoped>
@imgPath: 'base/air_condition/assets/new-air';

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
  .progress{
    transform: rotate(-126deg);
  }
  .c-status {
    margin-top: 30px;
    font-size: 24px;
    color: #35353d;
    text-align: center;
  }
  .control-tm{
    position: relative;
    top: -40px;
    z-index: 9;

    width: 190PX;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .control{
      outline: none;
      border: none;
      width: 72px;
      height: 72px;
      background:#efefef;
      border-radius: 50%;
      &.add{
        background-image: url(~@lib/base/fridge/assets/add.png);
        background-size: 100% 100%;
      }
      &.reduce{
        background-image: url(~@lib/base/fridge/assets/reduce.png);
        background-size: 100% 100%;
      }
    }
  }
  .main {
    margin-top: 5vh;
    position: relative;
    &.center {
      flex-direction: column;
    }
    .wrap-circle{
      position: relative;
      .bg{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        background: #FFFFFF;
        box-shadow: inset 0 0 16px 0 rgba(0,0,0,0.10);
        border-radius: 50%;
        width: 84%;
        height: 84%;
        .tm{
          margin-top: 60PX;
          position: relative;
          font-size: 144px;
          color: #20282B;
          text-align: center;
          sup{
            opacity: .5;
            position: absolute;
            top: 20px;
            font-size: 24px;
            color: #20282B;
          }
        }
        .c-mode{
          margin: auto;
          display: block;
          margin-top: 20PX;
          width: 33px;
          height: 33px;
          &.cold{
            background-image: url('~@lib/@{imgPath}/icon-cold.png');
            background-size: 100% 100%;
          }
          &.wind{
            background-image: url('~@lib/@{imgPath}/icon-wind.png');
            background-size: 100% 100%;
          }
          &.dehumidify{
            background-image: url('~@lib/@{imgPath}/icon-dehumidify.png');
            background-size: 100% 100%;
          }
          &.heat{
            background-image: url('~@lib/@{imgPath}/icon-heat.png');
            background-size: 100% 100%;
          }
          &.auto{
            background-image: url('~@lib/@{imgPath}/icon-auto.png');
            background-size: 100% 100%;
          }
        }
      }
    }
  }
  .status{
    text-align: center;
    font-size: 24px;
    color: #20282B;
  }
  .panel-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px 38px 0;
    z-index: 9999;

    background: #ffffff;
    box-shadow: 0 -3px 28px 0 rgba(209, 209, 209, 0.5);
    border-radius: 42px 42px 0px 0px;

    flex-wrap: wrap;
    justify-content: flex-start;
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
  }
  /*********** 按钮 ***********/
  .btn-wrap {
    margin: 0 24px 24px;
    .btn {
      box-sizing: border-box;
      margin: 0 auto;
      width: 120px;
      height: 120px;
      border: 1px solid #818181;
      border-radius: 50%;

      display: flex;
      flex-direction: column;
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
      }
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

    .btn-swich {
      &::before {
        background-image: url('~@lib/@{imgPath}/swich-black.png');
        background-size: 100% 100%;
      }
    }
    .btn-cold {
      &::before {
        background-image: url('~@lib/@{imgPath}/cold.png');
        background-size: 100% 100%;
      }
    }
    .btn-heat {
      &::before {
        background-image: url('~@lib/@{imgPath}/heat.png');
        background-size: 100% 100%;
      }
    }
    .btn-mode {
      &::before {
        background-image: url('~@lib/@{imgPath}/mode.png');
        background-size: 100% 100%;
      }
    }

    .btn-menu {
      &::before {
        background-image: url('~@lib/@{imgPath}/more-black.png');
        background-size: 100% 100%;
      }
    }

    .btn-wind {
      &::before {
        background-image: url('~@lib/@{imgPath}/wind.png');
        background-size: 100% 100%;
      }
    }

    .btn-dehumidify {
      &::before {
        background-image: url('~@lib/@{imgPath}/dehumidify-black.png');
        background-size: 100% 100%;
      }
    }
    .btn-low{
      &::before {
        background-image: url('~@lib/@{imgPath}/speed3.png');
        background-size: 100% 100%;
      }
    }
    .btn-normal{
      &::before {
        background-image: url('~@lib/@{imgPath}/speed4.png');
        background-size: 100% 100%;
      }
    }
    .btn-normal{
      &::before {
        background-image: url('~@lib/@{imgPath}/speed4.png');
        background-size: 100% 100%;
      }
    }
    .btn-high{
      &::before {
        background-image: url('~@lib/@{imgPath}/speed5.png');
        background-size: 100% 100%;
      }
    }
    .btn-auto{
      &::before {
        background-image: url('~@lib/@{imgPath}/auto.png');
        background-size: 100% 100%;
      }
    }
    .btn-left{
      &::before {
        background-image: url('~@lib/@{imgPath}/left.png');
        background-size: 100% 100%;
      }
    }
    .btn-up{
      &::before {
        background-image: url('~@lib/@{imgPath}/up.png');
        background-size: 100% 100%;
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
    .btn-wrap {
      &.up-index{
        opacity: .2;
      }
    }
  }
  &.close,
  &.offline {
    &:before {
      content: "";
      position: fixed;
      top: 64PX;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 999;
      width: 100%;
      background: rgba(0, 0, 0, 0.1);
    }
    &.page {
      background: #fff;
      .control-tm{
        background: #fff;
      }
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
      opacity: .2;
      .btn {
        &.active {
          background: #fff;
          border: 1px solid #818181;
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
        margin-top: 16px;
        font-size: 24px;
        color: #20282B;
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
        background-image: url(~@lib/base/air_cleaner/assets/new-air/swich-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(~@lib/base/air_cleaner/assets/new-air/swich-black.png);
        }
      }
    }

    .btn-low {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(~@lib/base/air_cleaner/assets/new-air/speed1-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(~@lib/base/air_cleaner/assets/new-air/speed1.png);
        }
      }
    }
    .btn-middle {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(~@lib/base/air_cleaner/assets/new-air/speed2-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(~@lib/base/air_cleaner/assets/new-air/speed2.png);
        }
      }
    }
    .btn-high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(~@lib/base/air_cleaner/assets/new-air/speed3-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(~@lib/base/air_cleaner/assets/new-air/speed3.png);
        }
      }
    }
    .btn-very_high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(~@lib/base/air_cleaner/assets/new-air/speed4-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(~@lib/base/air_cleaner/assets/new-air/speed4.png);
        }
      }
    }
    .btn-super_high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(~@lib/base/air_cleaner/assets/new-air/speed5-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(~@lib/base/air_cleaner/assets/new-air/speed5.png);
        }
      }
    }
  }
}
</style>
