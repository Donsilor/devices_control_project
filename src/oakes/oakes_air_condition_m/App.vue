<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']">
      <NewTopBar
        :title="device.device_name"
        :shutdown="isClose == false || isOffline == true"
        :class-name="opcityStyle"
        bak-color="#000"
        @shutdownCallback="shutdowncallback('off')" />
      <div class="main center">
        <div class="wrap-circle">
          <div class="bg">
            <div
              v-if="deviceAttrs.connectivity == 'offline'||deviceAttrs.switchStatus=='off'||deviceAttrs.mode=='wind'"
              class="tm">-- <sup>°C</sup></div>
            <div
              v-if="!isOffline&& deviceAttrs.switchStatus == 'on'&&deviceAttrs.mode!=='auto'&&deviceAttrs.mode!=='wind'"
              class="tm">{{ deviceAttrs.temperature | filterTm }}<sup>°C</sup>
            </div>
            <div
              v-if="!isOffline&& deviceAttrs.switchStatus == 'on'&&deviceAttrs.mode=='auto'"
              class="tm">{{ deviceAttrs.env_temperature | filterTm }}<sup>°C</sup>
            </div>
            <div
              v-show="!isOffline&& deviceAttrs.switchStatus == 'on'"
              :class="[deviceAttrs.mode, 'c-mode']">室内温度{{ deviceAttrs.env_temperature | filterTm }}℃</div>
            <div
              v-show="isOffline||deviceAttrs.switchStatus == 'off'"
              :class="[deviceAttrs.mode, 'c-mode']">室内温度--℃</div>
          </div>
          <circle-progress
            v-if="isShow"
            id="myId"
            ref="$circle"
            key="animation-model"
            :is-animation="false"
            :is-round="true"
            :width="width"
            :radius="radius"
            :progress="progress"
            :bar-color="getBarColor"
            :duration="duration"
            :delay="delay"
            :background-color="backgroundColor"
            class="progress"
          />
        </div>
        <div
          v-show="!isOffline&&!isClose"
          class="control-tm center">
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
        v-show="deviceAttrs.timer_switch == 'on'&& deviceAttrs.timer_value >0"
        class="status">
        {{ deviceAttrs.timer_value | closeTime }}
      </div>
      <!-- 底部按钮 -->
      <!-- 开关 -->
      <div
        v-show="isOffline||isClose"
        class="starting">
        <div
          class="btn btn-start"
          @click="shutdowncallback('on')" />
        <div class="btn-name">开机</div>
      </div>
      <div
        v-show="!isOffline&&!isClose"
        class="panel-btn center">
        <!-- <div :class="[{'up-index': !isOffline }, 'btn-wrap']">
          <div
            :class="[{ 'active': !isClose }, 'btn-swich btn center']"
            @click="setSwitch" />
          <div class="btn-name">开关</div>
        </div> -->
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
          @click="setMode('auto')">
          <div :class="[ { 'active': deviceAttrs.mode == 'auto' }, 'btn btn-auto center']" />
          <div
            class="btn-name" >智能</div>
        </div>
        <div
          class="btn-wrap"
          @click="setMode('wind')">
          <div :class="[{ 'active': deviceAttrs.mode == 'wind' }, 'btn btn-wind center']" />
          <div class="btn-name">送风</div>
        </div>
        <div
          class="btn-wrap"
          @click="setMode('dehumidify')">
          <div :class="[{ 'active': deviceAttrs.mode == 'dehumidify' }, 'btn btn-dehumidify center']" />
          <div class="btn-name">除湿</div>
        </div>
        <div
          style="visibility:hidden"
          class="btn-wrap"/>
      </div>
      <!-- 规格选择 -->
      <!-- 风速 -->
      <div
        v-show="!isClose&&!isOffline"
        class="optionbox">
        <div class="option1">
          <div>
            <span>风速</span>
            <span @click="showSpeed">{{ typeVal=='auto'?'自动':'手动＞' }}</span>
          </div>
          <div
            v-show="typeVal!=='auto'"
            class="range">
            <input
              :value="brightnessValue"
              type="range"
              min="0"
              max="4"
              step="1"
              @input="changeSpeed">
            <p :class="['rang_width']"/>
          </div>
        </div>
        <!-- 摆风 -->
        <div class="option">
          <div>
            <span>摆风</span>
            <span @click="showSwing">{{ deviceAttrs.wind_up_down=='on'?'上下风＞':'' }}{{ deviceAttrs.wind_left_right=='on'?'左右风＞':'' }}{{ deviceAttrs.wind_up_down=='off'&&deviceAttrs.wind_left_right=='off'?'设置＞':'' }}</span>
          </div>
        </div>
        <!-- 定时 -->
        <div class="option">
          <div>
            <span>定时</span>
            <span
              v-if="deviceAttrs.timer_switch=='on'&&deviceAttrs.timer_value>0"
              @click="showTime">{{ deviceAttrs.timer_value | closeTime }}＞</span>
            <span
              v-else
              @click="showTime">设置关机时间＞</span>
          </div>
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
      <!-- 时间选择 -->
      <SelectTime
        ref="time"
        @selectedTime="setReserve"
        @canceltime="canceltime" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import circleProgress from './components/circle-progress'
import modelSwing from './components/model-swing'
import modelMode from './components/model-mode'
import modelSpeed from './components/model-speed'
import SelectTime from './components/time.vue'
const [MIN_TEMP, MAX_TEMP] = [160, 320]
export default {
  components: {
    circleProgress,
    modelSwing,
    modelMode,
    modelSpeed,
    SelectTime
  },
  data() {
    return {
      isOpen: false,
      isShow: true,
      width: 230,
      radius: 8,
      progress: 30, // 0~70
      duration: 0,
      delay: 0,
      // barColor: '#D8D8D8',
      backgroundColor: '#ececec',
      timeShow: false,
      typeVal: 'hand',
      brightnessValue: 0,
      rangStyle: '',
      opcityStyle: 'opcity-0'
    }
  },

  computed: {
    ...mapGetters(['isClose', 'isOffline']),
    ...mapState(['device', 'deviceAttrs']),
    modeIsActive() {
      return this.deviceAttrs.mode == 'auto' || this.deviceAttrs.mode == 'dehumidify' || this.deviceAttrs.mode == 'wind'
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
          return '#000'
      }
    },
  },
  watch: {
    "deviceAttrs.speed"() {
      if(this.deviceAttrs.speed == 'low') {
        this.brightnessValue = 1
        this.setRangWidth(23.25)
      }
      if(this.deviceAttrs.speed == 'normal') {
        this.brightnessValue = 2
        this.setRangWidth(46.5)
      }
      if(this.deviceAttrs.speed == 'high') {
        this.brightnessValue = 3
        this.setRangWidth(69.75)
      }
      if(this.deviceAttrs.speed == 'auto') {
        this.brightnessValue = 4
        this.setRangWidth(93)
      }
    }
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
        .then(() => {
          this.reset()
        })
      HdSmart.UI.setStatusBarColor(2)
    })
  },
  mounted() {
    let pageNode = document.querySelector('.page')
    pageNode.addEventListener('scroll', (e) => {
      // console.log(e.target.scrollTop)
      let scrollHeight = e.target.scrollTop
      if (scrollHeight === 0) {
        this.opcityStyle = 'opcity-0'
      } else if (scrollHeight < 20) {
        this.opcityStyle = 'opcity-20'
      }else if (scrollHeight < 40 ) {
        this.opcityStyle = 'opcity-40'
      }else if (scrollHeight < 60) {
        this.opcityStyle = 'opcity-60'
      }else if (scrollHeight < 80) {
        this.opcityStyle = 'opcity-80'
      }
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    setRangWidth(val) {
      document.querySelector('.rang_width').style.width = val+"%"
    },
    // 设置关机时间
    setReserve(time) {
      let h = parseInt(time[0].split(':')[0])
      let m = parseInt(time[0].split(':')[1])
      console.log(h,m,'hm')
        this.controlDevice('time',{
            timer_value:h*60+m,
            timer_switch:'on'
        })
    },
    // 取消定时
    canceltime(){
       this.controlDevice('time',{
            timer_value:0,
            timer_switch:'off'
        })
    },
    // 开关机
    shutdowncallback(val){
      if (this.isOffline) return
      this.controlDevice('switch',val)
    },
    // range调风速
    changeSpeed(e) {
      var max = e.target.getAttribute("max")
      var width = (93 / max * e.target.value) +"%"
      document.querySelector('.rang_width').style.width = width
      if(e.target.value == 0) {
        this.rangeColor = true
      } else {
        this.rangeColor = false
      }
      this.brightness = e.target.value
      console.log(e.target.value,'我在这里')

      if (this.brightness=='1') {
        this.controlDevice('speed','low')
      }
      if (this.brightness=='2') {
        this.controlDevice('speed','normal')
      }
      if (this.brightness=='3') {
        this.controlDevice('speed','high')
      }
      if (this.brightness=='4') {
        if (this.deviceAttrs.mode=='wind') return HdSmart.UI.toast('送风模式不能设置自动风速')
        this.controlDevice('speed','auto')
      }
    },
    // 设置模式
    setMode(val) {
      if (val == this.deviceAttrs.mode || this.isClose) return
      this.controlDevice('mode', val)
        .then(() => {
          this.deviceAttrs.mode = val
          if (this.deviceAttrs.mode=='auto') {
            this.progress = 70 /(32 - 16) * (this.deviceAttrs.env_temperature / 10 - 16)
            this.$refs.$circle.init()
            this.hide()
            return
          }
          this.reset()
          this.hide()
        })
    },
    setTemperature(step) {
      if(this.deviceAttrs.mode == 'auto') {
        return HdSmart.UI.toast('智能模式不支持温度调节')
      }
      // 送风模式不能设置温度
      if (this.deviceAttrs.mode === 'wind') {
        return HdSmart.UI.toast('送风模式不支持温度调节')
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
    // 设置摆风
    setWind(attr) {
      if (this.isClose) return
      var val = this.deviceAttrs[attr] === 'on' ? 'off' : 'on'
      // if (this.deviceAttrs.wind_up_down=='on') {
      //   this.controlDevice('wind_left_right','off')
      // }
      // if (this.deviceAttrs.wind_left_right=='on') {
      //    this.controlDevice('wind_up_down','off')
      // }
      this.controlDevice(attr, val)
        .then(() =>{
          this.hide()
        })
    },
    // 设置风速
    setSpeed(speed, val) {
      this.typeVal = val
      if (this.deviceAttrs.mode=='wind'&&val=='auto') {
        this.typeVal = 'hand'
      }
      if(this.deviceAttrs.mode == 'wind' && speed == 'auto') {
        return HdSmart.UI.toast('送风模式不能设置自动风速')
      }
      this.controlDevice('speed', speed)
        .then(() =>{
          this.hide()
          this.setRangWidth(93)
        })
    },
    controlDevice(attr, value) {
      let param = {}
      if(attr == 'mode' && value == 'wind' && this.deviceAttrs.speed == 'auto'){
        param = { 'speed': 'low'}
      }
      return this.doControlDevice({
        nodeid: `airconditioner.main.${attr}`,
        params: {
          attribute: {
            [attr]: value,
            ...param
          }
        }
      })
    },
    // 重置动画
    reset() {
      // this.barColor = this.getBarColor()
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
    showTime() {
      if (this.isClose) return
      this.$refs.time.show = true
    },
    hide(){
      if(this.$refs.swing.show) this.$refs.swing.show = false
      if(this.$refs.mode.show) this.$refs.mode.show = false
      if(this.$refs.speed.show) this.$refs.speed.show = false
    },

    getProgress() {
      // 计算温度进度条
      return 70 /(32 - 16) * (this.deviceAttrs.temperature / 10 - 16)
    }
  }
}
</script>
<style lang="less" scoped>
@imgPath: 'base/air_condition/assets/new-air';
@imgPath1: 'base/oakes_air_condition/assets';
.body {
  min-height: 100%;
}
  // 定时展示
  .timeShow {
    text-align: center;
    position: relative;
    font-size: 24px;
    margin-top: 24px;
    color: #20282B;
    .timeShow-img {
      position: relative;
      top: 2px;
      width: 28px;
      height: 28px;
      margin-right: 12px;
    }
  }
.page {
  height: 100vh;
  min-height: 550px;
  overflow-x: hidden;
  position: relative;
  background-image: url('~@lib/@{imgPath1}/img_bg_01@2x.png');
  background-size: 100% 100%;
  &::-webkit-scrollbar {
		display: none;
	}
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
      background: rgba(0,0,0,0.04);
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
    margin-top: 2vh;
    position: relative;
    &.center {
      flex-direction: column;
    }
    .wrap-circle{
      position: relative;
      .bg{
        position: absolute;
        top: 49%;
        left: 49.5%;
        transform: translate(-50%, -50%);
        width: 84%;
        height: 81%;
        display: flex;
        justify-content: center;
        align-items: center;
        .tm{
          // margin-top: 60PX;
          position: relative;
          font-size: 144px;
          color: #20282B;
          text-align: center;
          sup{
            opacity: .5;
            position: absolute;
            top: 15px;
            right: -20px;
            font-size: 24px;
            color: #20282B;
          }
        }
        .c-mode{
          position: absolute;
          transform: translate(-50%,-50%);
          top: 80%;
          left: 50%;
          width: 216px;
          height: 48px;
          font-size: 24px;
          background: rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.05);
          border-radius: 24px;
          border-radius: 24px;
          text-align: center;
          line-height: 48px;
        }
      }
    }
  }
  .status{
    text-align: center;
    font-size: 24px;
    color: #20282B;
  }
  .starting{
    margin-top: 15vh;
     .btn-start{
        z-index: 999999;
        box-sizing: border-box;
        margin: 0 auto;
        width: 120px;
        height: 120px;
        border: 1px solid #818181;
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
  .panel-btn {
    overflow-x: auto;
    display: -webkit-box;
    z-index: 9999;
    margin-top: 130px;
    /*适应苹果*/
    -webkit-overflow-scrolling: touch;

  }

  /*隐藏掉滚动条*/
	.panel-btn::-webkit-scrollbar {
		display: none;
	}
  /*********** 按钮 ***********/
  .btn-wrap {
    margin: 0 24px 24px;
    &:last-of-type{
      width: 30px;
      height: 120px;
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
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
      }
      &.active {
        background: #000;
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
        background-image: url('~@lib/@{imgPath1}/cold.png');
        background-size: 100% 100%;
      }
      &.active::before {
        background-image: url('~@lib/@{imgPath1}/cold1.png');
        background-size: 100% 100%;
      }
    }
    .btn-heat {
      &::before {
        background-image: url('~@lib/@{imgPath1}/heat.png');
        background-size: 100% 100%;
      }
       &.active::before {
        background-image: url('~@lib/@{imgPath1}/heat1.png');
        background-size: 100% 100%;
      }
    }
    .btn-mode {
      &::before {
        background-image: url('~@lib/@{imgPath}/mode.png');
        background-size: 100% 100%;
      }
    }
     .btn-time {
      &::before {
        background-image: url('~@lib/@{imgPath}/time-black.png');
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
        background-image: url('~@lib/@{imgPath1}/wind.png');
        background-size: 100% 100%;
      }
      &.active::before {
        background-image: url('~@lib/@{imgPath1}/wind1.png');
        background-size: 100% 100%;
      }
    }

    .btn-dehumidify {
      &::before {
        background-image: url('~@lib/@{imgPath1}/dehumidify.png');
        background-size: 100% 100%;
      }
      &.active::before {
        background-image: url('~@lib/@{imgPath1}/dehumidify1.png');
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
       &.active::before {
        background-image: url('~@lib/@{imgPath1}/auto1.png');
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
  .optionbox{
    width: 100%;
    margin-top: 10px;
    margin: 10px 0 30px 0;
    .option{
      width: 100%;
      height: 120px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      padding: 0 40px;
      >div{
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 32px;
        color: #000;
        >span{
          display: inline-block;
          line-height: 120px;
          height: 120px;
          &:last-of-type{
            color: rgba(0, 0, 0, 0.5);
          }
        }
      }
    }
    .option1{
      padding: 0 40px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      >div{
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 32px;
        color: #000;
        >span{
          display: inline-block;
          line-height: 120px;
          height: 120px;
          &:last-of-type{
            color: rgba(0, 0, 0, 0.5);
          }
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
      }
      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        background-color: #000;
        width: 52px;
        height: 52px;
        border-radius: 50%;
        // border: 2px solid white;
        cursor: pointer;
        // transition: 0.3s ease-in-out;
      }
      .range {
        position: relative;
        width: 100%;
        margin-bottom: 50px;
        .range-zero::-webkit-slider-thumb {
          background: #EDEDED;
        }
        .range-zero {
          background: #EDEDED;
        }
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
        height: 2px;
        border-radius: 5px 0 0 5px;
        }
        .rang_bak {
          background: #EDEDED;
        }
    }
  }

  // &.close {
  //   .btn-wrap {
  //     &.up-index{
  //       opacity: 1;
  //     }
  //   }
  // }
  // &.offline {
  //   .btn-wrap {
  //     &.up-index{
  //       opacity: .2;
  //     }
  //   }
  // }
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
      // background: rgba(0, 0, 0, 0.1);
    }
    &.page {
      // background: #fff;
      .control-tm{
        // background: #fff;
        .reduce,.add {
          opacity: .4;
        }
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
      &.up-index {
        opacity: 1;
      }
      .btn {
        &.active {
          background: #fff;
          border: 1px solid #818181;
        }
      }
    }
  }
}

</style>
