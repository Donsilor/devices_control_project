
<template>
  <div class="app">
    <div :class="[{ 'offline': isOffline }, { 'close': isClose }, { 'loading': isLoading }, {'filter': showModeBtns }, {'filter': showMoreBtns },'wrap']">
      <topbar 
        :transparent="true"
        :title="device.name"
        bak-color="#fff" />

      <div class="page">
        <!-- 离线提示 app自带 注释掉 -->
        <!-- <div 
          v-show="isOffline"
          class="tips">
          <i class="attention" />
          设备已离线，查看帮助
        </div> -->

        <!-- msg 提示 -->
        <transition name="fade">
          <div 
            v-show="isShowMsg"
            class="err-tips">{{ msg }}</div>
        </transition>

        <!-- 温度 -->
        <div class="temperature">
          <div class="unit">温度，℃</div>

          <div 
            v-if="deviceInfo.attribute.mode !=='wind'" 
            class="num">{{ temp }}</div>
          <!-- 送风模式显示环境温度 -->
          <div 
            v-else 
            class="num">{{ env_temp }}</div>
        </div>

        <!-- msg 滑动设置温度 -->
        <div 
          v-finger:swipe="swipe"
          :class="[{'temperatureUp': isSetTemperature === 'Up'},{'temperatureDown': isSetTemperature === 'Down'}]"
          class="dial "
          @touchmove.prevent />

        <!-- 状态 -->
        <div class="bottom">
          <!-- <div class="time">
            <i class="icon-time" />
            2小时25分后关机
          </div> -->
          <div 
            class="status">
            <i class="icon-status" />
            正在{{ deviceInfo.attribute.mode | modeType }}
            {{ deviceInfo.attribute.wind_up_down === 'on' ? '上下扫风':'' }}
            {{ deviceInfo.attribute.wind_left_right === 'on' ? '左右扫风': '' }}
          </div>
          <!-- 按钮 -->
          <div class="btns center">
            <div 
              :class="[{'active': !isClose && !isOffline }, {' btn-loading': btnLoading.switch }, 'btn btn-swich center']"
              @click="setSwitch" />
            <div 
              :class="[ btnClass, 'btn btn-mode center']"
              @click="handeModeClick" />
            <div 
              class="btn btn-menu center"
              @click="handeMoreClick" />
          </div>
          <!-- 风速 -->
          <div class="speed">
            <i :class="[speedClass, 'small']" />
            <div :class="[deviceInfo.attribute.speed === 'auto' ? 'auto': '', 'swich']">
              <div class="up mask-item center">
                <div 
                  class="item"
                  @click="setSpeed('low')" />
                <div 
                  class="item"
                  @click="setSpeed('normal')" />
                <div 
                  class="item last"
                  @click="setSpeed('high')" />
              </div>

              <div class="dowm mask-item center">
                <div 
                  class="item"
                  @click="setSpeed('low')" />
                <div 
                  class="item"
                  @click="setSpeed('normal')" />
                <div 
                  class="item last"
                  @click="setSpeed('high')" />
              </div>

              <div :class="[speedClass, 'current']" />
            </div>
            <div 
              v-show="deviceInfo.attribute.mode !== 'wind'"
              :class="[speedClass, 'btn btn-big center']"
              @click="setSpeed('auto')"/>
          </div>
        </div>
      </div>
    </div>
    <!-- 模式选择弹框 -->
    <div 
      v-show="showModeBtns"
      class="btns-mode center"
      @touchmove.prevent
      @click="hide">
      <div class="items btns">
        <div 
          :class="[{ 'item1': animation }, { 'btn-current': deviceInfo.attribute.mode === 'wind' }, {' btn-loading': btnLoading.wind }, 'btn btn-wind center']"
          @click.stop="setMode('wind')">
          <div class="name">送风</div>
        </div>
        <div 
          :class="[{ 'item2': animation }, { 'btn-current': deviceInfo.attribute.mode === 'heat' }, {' btn-loading': btnLoading.heat },'btn btn-heat center']"
          @click.stop="setMode('heat')">
          <div class="name">制热</div>
        </div>
        <div 
          :class="[{ 'item3': animation }, { 'btn-current': deviceInfo.attribute.mode === 'dehumidify' }, {' btn-loading': btnLoading.dehumidify }, 'btn btn-dehumidify center']"
          @click.stop="setMode('dehumidify')">
          <div class="name">除湿</div>
        </div>
        <div 
          :class="[{ 'item4': animation }, { 'btn-current': deviceInfo.attribute.mode === 'cold' }, {' btn-loading': btnLoading.cold },'btn btn-cold center']"
          @click.stop="setMode('cold')">
          <div class="name">制冷</div>
        </div>
        <div 
          :class="[{ 'item5': animation }, { 'btn-current': deviceInfo.attribute.mode === 'auto' }, {' btn-loading': btnLoading.auto },'btn btn-auto center']"
          @click.stop="setMode('auto')">
          <div class="name">智能</div>
        </div>
        <div 
          :class="[ { 'item6': animation }, btnClass,'btn center active']"
          @click.stop />
      </div>
    </div>

    <!-- 更多功能 -->
    <div 
      v-show="showMoreBtns"
      class="btns-mode more center"
      @touchmove.prevent
      @click="hide">
      <div class="items btns">
        <!-- <div 
          :class="[{ 'item2': animation }, { 'btn-current': deviceInfo.attribute.timer}, 'btn btn-time center']"
          @click.stop="showTime">
          <div class="name">定时</div>
        </div> -->
        <div 
          :class="[{ 'item3': animation }, { 'btn-current': deviceInfo.attribute.wind_up_down === 'on' || deviceInfo.attribute.wind_left_right === 'on' }, 'btn btn-swing center']"
          @click.stop="showSwing">
          <div class="name">扫风</div>
        </div>
        <div 
          :class="[{ 'item6': animation }, 'btn btn-menu center active']"
          @click.stop />
      </div>
    </div>

    <model-swing 
      ref="swing"
      :wind_up_down="deviceInfo.attribute.wind_up_down"
      :wind_left_right="deviceInfo.attribute.wind_left_right"
      :btn_wind_up_down="btnLoading.wind_up_down"
      :btn_wind_left_right="btnLoading.wind_left_right"
      @setWind="setWind" />

    <model-time ref="time" />
  </div>
</template>
<script>
import model from './components/model.vue'
import time from './components/time/time.vue'

const [MIN_TEMP, MAX_TEMP] = [160, 300]
var tempDelay
var timer = {}

const tips = {
  fail: '设置失败',
  temperature: '温度设置成功',
  speed_low: '低风切换成功',
  speed_normal: '中风切换成功',
  speed_high: '高风切换成功',
  speed_auto: '自动风速切换成功',
  mode_cold: '制冷模式切换成功',
  mode_auto: '智能模式切换成功',
  mode_heat: '制热模式切换成功',
  mode_dehumidify: '除湿模式切换成功',
  mode_wind: '送风模式切换成功',
  wind_up_down_on: '上下扫风已启动',
  wind_up_down_off: '上下扫风已关闭',
  wind_left_right_on: '左右扫风已启动',
  wind_left_right_off: '左右扫风已关闭',
  err_temp1: '送风模式下不能设置温度',
  err_temp2: '温度已调至最高',
  err_temp3: '温度已调至最低',
  err_temp4: '送风模式不能设置自动风速',
  err_temp5: '低风、制冷模式下不支持此温度'
}

export default {
  components: {
    'model-swing': model,
    'model-time': time
  },
  data() {
    return {
      tempFlag: true,
      isShowMsg: false,
      msg: '',
      isLoading: true,

      showModeBtns: false,
      showMoreBtns: false,
      animation: false,

      temperature: 16,
      deviceInfo: {
        attribute: {
          switchStatus: 'off',
          temperature: 165,
          env_temperature: 240,
          mode: 'cold',
          speed: 'low',
          wind_up_down: 'off',
          wind_left_right: 'off',
          sleep_mode: 'on',
          deviceModel: 'KFRd-26GW/FE22BpA',
          manufactureId: 'tcl',
          deviceCategory: 'airconditioner.new',
          deviceSubCategory: 0,
          connectivity: 'online'
        }
      },
      deg: 0,
      isSetTemperature: '',

      device: {},
      btnLoading: {
        switch: false,
        auto: false,
        cold: false,
        heat: false,
        dehumidify: false,
        wind: false,
        wind_up_down: false,
        wind_left_right: false
      }

    }
  },
  computed: {
    temp() {
      let tmp = this.deviceInfo.attribute.temperature / 10
      tmp = tmp.toFixed(0)
      return +tmp
    },
    env_temp() {
      let tmp = this.deviceInfo.attribute.env_temperature / 10
      tmp = tmp.toFixed(0)
      return +tmp
    },
    isClose() {
      let status = this.deviceInfo.attribute.switchStatus === 'on' ? false : true
      return status
    },
    isOffline() {
      let status = this.deviceInfo.attribute.connectivity === 'online' ? false : true
      return status
    },
    btnClass() {
      /* eslint-disable no-unreachable */
      switch (this.deviceInfo.attribute.mode) {
        case 'auto':
          return 'btn-auto'
          break
        case 'cold':
          return 'btn-cold'
          break
        case 'heat':
          return 'btn-heat'
          break
        case 'dehumidify':
          return 'btn-dehumidify'
          break
        case 'wind':
          return 'btn-wind'
          break
      }
    },
    speedClass() {
      /* eslint-disable no-unreachable */
      switch (this.deviceInfo.attribute.speed) {
        case 'low':
          return 'low'
          break
        case 'normal':
          return 'normal'
          break
        case 'high':
          return 'high'
          break
        case 'auto':
          return 'active'
          break  
      }
    },
  },
  mounted() {
    // get localStorage 保存的数据
    var str_model = window.localStorage.getItem("air_model_attr")
    if(str_model){
      try {
        // str_model 有可能不是合法的JSON字符串，便会产生异常
        this.deviceInfo.attribute =JSON.parse(str_model)
      } catch (e) {
        this.deviceInfo.attribute = {}
      }
    }
    // 获取云端数据
    this.init()
  },
  methods: {
    init() {
      HdSmart.onDeviceStateChange(res => {
        this.onSuccess(res.result)
      })

      HdSmart.ready(() => {
        HdSmart.UI.showLoading()
        if (window.device_name) {
            this.device.name = window.device_name
        }
        this.getSnapShot()
      })

      this.$nextTick(() => {
        setTimeout(() => {
          this.isLoading = false
        }, 0)
      })
    },
    // 滑动
    swipe(e) {
      // 离线和关闭不能设置温度
      if(this.isClose || this.isOffline) return
      // 设置温度中
      if(this.isSetTemperature) return

      // 送风模式不能设置温度
      if (this.deviceInfo.attribute.mode === 'wind' && this.tempFlag) {
        return this.showMsg(tips.err_temp1)
      }

      // 一圈 360deg = 30 摄氏度  1deg = 12℃
      if (e.direction === 'Up') {
        if (this.temp < 30) {
          // this.deviceInfo.attribute.temperature += 10
          this.setTemperature(10, e.direction)
        } else {
          this.showMsg(tips['err_temp2'])
        }
      } else if (e.direction === 'Down') {
        if (this.temp > 16) {
          // this.deviceInfo.attribute.temperature -= 10
          this.setTemperature(-10, e.direction)
        } else {
          this.showMsg(tips['err_temp3'])
        }
      }
    },
    hide() {
      this.animation = false
      this.showModeBtns = false
      this.showMoreBtns = false
    },
    handeModeClick() {
      // document.scrollingElement.scrollTop = document.body.scrollHeight
      document.scrollingElement.scrollTop = 0
      this.showModeBtns = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.animation = true
        }, 0)
      })
    },
    handeMoreClick() {
      document.scrollingElement.scrollTop = 0
      this.showMoreBtns = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.animation = true
        }, 0)
      })
    },
    showTime() {
      this.hide()
      this.$refs.time.show = true
    },
    showSwing() {
      this.hide()
      this.$refs.swing.show = true
    },
    getSnapShot() {
      HdSmart.Device.getSnapShot(
        res => {
          HdSmart.UI.hideLoading()
          this.onSuccess(res)
        },
        () => {
          HdSmart.UI.hideLoading()
          this.onError()
        }
      )
    },
    onSuccess(data) {
      this.deviceInfo = data

      // 将model 保存在 localStorage
      window.localStorage.setItem('air_model_attr', JSON.stringify(data.attribute))
    },
    controlDevice(attr, val, btnAttr, success, error) {
      this.showBtnLoading(btnAttr)
      // 送风模式 风速如果是自动，切换为低风速
      let param = {}
      if(attr == 'mode' && val == 'wind' && this.deviceInfo.attribute.speed == 'auto'){
        param = { 'speed': 'low'}
      }
      var params = Object.assign(
        {
          [attr]: val
        },
        param
      )

      HdSmart.Device.control(
        {
          method: "dm_set",
          nodeid: `airconditioner.main.${attr}`,
          params: {
            attribute: params
          }
        },
        () => {
          this.hideBtnLoading(btnAttr)
          if (attr == "switch") {
            this.deviceInfo.attribute.switchStatus = val
          } else {
            this.deviceInfo.attribute[attr] = val
          }
          success && success()
        },
        () => {
          this.hideBtnLoading(btnAttr)
          error && error()
        }
      )
    },
    showBtnLoading(attr) {
      this.btnLoading[attr] = true
    },
    hideBtnLoading(attr) {
      this.btnLoading[attr] = false
    },
    showMsg(msg) {
      if (!msg) return
      clearTimeout(timer)
      this.msg = msg
      this.isShowMsg = true
      this.$nextTick(() => {
        timer = setTimeout(() => {
          this.isShowMsg = false
        }, 3000)
      })

    },

    setMode(mode) {
      if (this.checkCmd('mode', mode)) return this.showModeBtns = false

      this.controlDevice('mode', mode, mode,
       () => {
          if(this.showModeBtns) this.showModeBtns = false
          this.showMsg(tips['mode_' + mode])
       }, () => { })
    },
    setSwitch() {
      let switchStatus = ''
      if (this.deviceInfo.attribute.switchStatus == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.controlDevice('switch', switchStatus, 'switch', () => { }, () => { })
    },
    setTemperature(val, direction) {
      var temp = this.deviceInfo.attribute.temperature + val
      // 最小温度
      if (temp < MIN_TEMP) {
        if (this.deviceInfo.attribute.temperature == MIN_TEMP) {
          this.showMsg(tips.err_temp3)
          return
        } else {
          temp = MIN_TEMP
        }
      }
      // 最大温度
      if (temp > MAX_TEMP) {
        if (this.deviceInfo.attribute.temperature == MAX_TEMP) {
          this.showMsg(tips.err_temp2)
          return
        } else {
          temp = MAX_TEMP
        }
      }

      clearTimeout(tempDelay)

      if (this.checkCmd('temperature', temp)) return
      this.tempFlag = false
      this.isSetTemperature = direction

      tempDelay = setTimeout(() => {
        this.tempFlag = true
        this.controlDevice(
          'temperature',
          temp,
          '',
          () => {
            this.isSetTemperature = ''
            // if (val > 0) {
            //   this.deg += 24
            // } else {
            //   this.deg -= 24
            // }
            this.showMsg(tips.temperature)
          },
          () => {
            this.isSetTemperature = ''
            this.tempFlag = true
          },
        )
      }, 500)
    },
    setSpeed(speed) {
      if (this.checkCmd('speed', speed)) return

      if(this.deviceInfo.attribute.mode == 'wind' && speed == 'auto') {
        return this.showMsg(tips['err_temp4'])
      }


      this.controlDevice('speed', speed, '',
        () => {
          this.showMsg(tips['speed_' + speed])
        },
        () => { }
      )
    },
    setWind(attr) {
      var val = this.deviceInfo.attribute[attr] === 'on' ? 'off' : 'on'

      this.controlDevice(attr, val, attr,
        () => {
          this.showMsg(tips[attr + '_' + val])
          this.$refs.swing.show = false
        },
        () => { })
    },
    checkCmd(attr, val) {
      let ac = Object.assign({
        temperature: this.deviceInfo.attribute.temperature,
        speed: this.deviceInfo.attribute.speed,
        mode: this.deviceInfo.attribute.mode,
      }, {
        [attr]: val 
      })
      console.log(ac)

      if (ac.temperature == MAX_TEMP && ac.speed == 'low' && ac.mode == 'cold') {
        this.showMsg(tips.err_temp5)
        return true
      }
      return false
    }
  },
}
</script>
<style lang="less" scoped>
@imgPath: 'base/air_condition/assets/new-air';

@bgColor: #20282b;
@yellow: #ffbf00;

@keyframes temperatureUp {
    from {
        transform: rotate(0deg);;
    }
    to {
        transform: rotate(360deg);;
    }
}
@keyframes temperatureDown {
    from {
        transform: rotate(0deg);;
    }
    to {
        transform: rotate(-360deg);;
    }
}
.app{
  background: @bgColor;
  min-height: 100%;
}
.btns {
  justify-content: flex-start;
  transition: all 0.3s ease-in-out;
  margin-top: 57px;
  .btn {
    margin-right: 40px;
    width: 120px;
    height: 120px;
    border: 1PX solid #fff;
    border-radius: 50%;
    display: flex;
    flex-direction: column;

    .name {
      margin-top: 8px;
      font-size: 20px;
      color: #fff;
    }
    &::before {
      content: "";
      display: block;
      width: 44px;
      height: 44px;
    }
    &.active {
      background-image: linear-gradient(-90deg, #ffd500 0%, @yellow 100%);
      border-color: @yellow;
    }
  }
  .btn-swich {
    &::before {
      background-image: url('~@lib/@{imgPath}/swich-white.png');
      background-size: 100% 100%;
    }
    &.active {
      &::before {
        background-image: url('~@lib/@{imgPath}/swich-black.png');
      }
    }
  }
  .btn-mode {
    &::before {
      background-image: url('~@lib/@{imgPath}/heat-white.png');
      background-size: 100% 100%;
    }
    &.active {
      &::before {
        background-image: url('~@lib/@{imgPath}/heat-black.png');
      }
    }
  }
  .btn-menu {
    &::before {
      background-image: url('~@lib/@{imgPath}/more-white.png');
      background-size: 100% 100%;
    }
    &.active {
      &::before {
        background-image: url('~@lib/@{imgPath}/more-black.png');
      }
    }
  }

  .btn-wind {
    &::before {
      background-image: url('~@lib/@{imgPath}/wind-white.png');
      background-size: 100% 100%;
    }
    &.active {
      &::before {
        background-image: url('~@lib/@{imgPath}/wind-black.png');
      }
    }
    &.btn-current {
      border-color: #FFC600;
      &::before {
        background-image: url('~@lib/@{imgPath}/wind-yellow.png');
      }
      .name{
        color: #FFC600;
      }
    }
  }
  .btn-heat {
    &::before {
      background-image: url('~@lib/@{imgPath}/heat-white.png');
      background-size: 100% 100%;
    }
    &.active {
      &::before {
        background-image: url('~@lib/@{imgPath}/heat-black.png');
      }
    }
    &.btn-current {
      border-color: #FFC600;
      &::before {
        background-image: url('~@lib/@{imgPath}/heat-yellow.png');
      }
      .name{
        color: #FFC600;
      }
    }
  }
  .btn-dehumidify {
    &::before {
      background-image: url('~@lib/@{imgPath}/dehumidify-white.png');
      background-size: 100% 100%;
    }
    &.active {
      &::before {
        background-image: url('~@lib/@{imgPath}/dehumidify-black.png');
      }
    }
    &.btn-current {
      border-color: #FFC600;
      &::before {
        background-image: url('~@lib/@{imgPath}/dehumidify-yellow.png');
      }
      .name{
        color: #FFC600;
      }
    }
  }
  .btn-cold {
    &::before {
      background-image: url('~@lib/@{imgPath}/cold-white.png');
      background-size: 100% 100%;
    }
    &.active {
      &::before {
        background-image: url('~@lib/@{imgPath}/cold-black.png');
      }
    }
    &.btn-current {
      border-color: #FFC600;
      &::before {
        background-image: url('~@lib/@{imgPath}/cold-yellow.png');
      }
      .name{
        color: #FFC600;
      }
    }
  }
  .btn-auto {
    &::before {
      background-image: url('~@lib/@{imgPath}/auto-white.png');
      background-size: 100% 100%;
    }
    &.active {
      &::before {
        background-image: url('~@lib/@{imgPath}/auto-black.png');
      }
    }
    &.btn-current {
      border-color: #FFC600;
      &::before {
        background-image: url('~@lib/@{imgPath}/auto-yellow.png');
      }
      .name{
        color: #FFC600;
      }
    }
  }
  .btn-time {
    &::before {
      background-image: url('~@lib/@{imgPath}/time-white.png');
      background-size: 100% 100%;
    }
    &.active {
      &::before {
        background-image: url('~@lib/@{imgPath}/time-black.png');
      }
    }
    &.btn-current {
      border-color: #FFC600;
      &::before {
        background-image: url('~@lib/@{imgPath}/time-yellow.png');
      }
      .name{
        color: #FFC600;
      }
    }
  }
  .btn-swing {
    &::before {
      background-image: url('~@lib/@{imgPath}/wind-dir-w.png');
      background-size: 100% 100%;
    }
    &.active {
      &::before {
        background-image: url('~@lib/@{imgPath}/wind-dir-b.png');
      }
    }
    &.btn-current {
      border-color: #FFC600;
      &::before {
        background-image: url('~@lib/@{imgPath}/wind-dir-y.png');
      }
      .name{
        color: #FFC600;
      }
    }
  }
}

.btns-mode {
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
    left: 216px;
    // bottom: 358px;
    top: 895px;
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
      top: 132px;
      left: 132px;
    }
    .item2 {
      top: 0;
      left: 204px;
    }
    .item3 {
      top: -132px;
      left: 132px;
    }
    .item4 {
      top: -204px;
      left: 0;
    }
    .item5 {
      top: -132px;
      left: -132px;
    }
  }
  &.more {
    .items {
      left: 384px;
    }
  }
}

.wrap {
  * {
    transition: all 0.3s ease-in-out;
  }
  &.filter {
    filter: blur(12px);
  }
  .page {
    position: relative;
    padding-top: 298px;
    padding-left: 48px;
    padding-bottom: 60px;
    overflow: hidden;
    .tips {
      background: rgba(0, 0, 0, 0.3);
      position: fixed;
      top: 64PX;
      left: 0;
      z-index: 99;

      padding-left: 48px;
      display: flex;
      align-items: center;
      width: 100%;
      height: 88px;
      line-height: 88px;

      font-size: 32px;
      color: #fff;
      .attention {
        display: inline-block;
        width: 36px;
        height: 36px;
        background-image: url('~@lib/@{imgPath}/icon-tips.png');
        background-size: 100% 100%;
        margin-right: 12px;
      }
      &:after {
        position: absolute;
        right: 50px;
        top: 50%;
        display: inline-block;
        content: "";
        width: 15px;
        height: 15px;
        border: 2px solid #fff;
        border-width: 2px 2px 0 0;
        -webkit-transform: translate(0, -50%) rotate(45deg);
        transform: translate(0, -50%) rotate(45deg);
      }
    }
    .err-tips {
      position: absolute;
      top: 150px;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 26px;
      color: #ffc600;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s;
    }
    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }


    .dial {
      transition: all 0.3s ease-in-out;
      transform: rotate(180deg);

      position: absolute;
      top: 0;
      left: 472px;

      width: 1080px;
      height: 1080px;

      border-radius: 50%;
      background-image: url('~@lib/base/air_condition/assets/new-air/dial-yellow.png');
      background-size: 100% 100%;

      &.temperatureUp {
        animation: temperatureUp 6s linear 0s infinite;
      }
      &.temperatureDown {
        animation: temperatureDown 6s linear 0s infinite;
      }
    }

    .temperature {
      transition: all 0.3s ease-in-out;
      position: relative;
      left: 0;

      .unit {
        font-size: 32px;
        color: #fff;
      }
      .num {
        margin-top: 30px;
        font-family: PingFangSC-;
        font-size: 280px;
        color: #fff;
      }
    }

    .bottom {
      position: relative;
      bottom: 0;
    }

    .time {
      margin-top: 100px;
      display: flex;
      align-items: center;
      font-size: 24px;
      color: #ffc600;
      .icon-time {
        display: inline-block;
        width: 36px;
        height: 36px;
        background-image: url('~@lib/@{imgPath}/icon-time.png');
        background-size: 100% 100%;
        margin-right: 12px;
      }
    }
    .status {
      margin-top: 23px;
      font-size: 24px;
      color: #d8d8d8;
      height: 100px;
      line-height: 100%;

      display: flex;
      align-items: center;
      .icon-status {
        display: inline-block;
        width: 12px;
        height: 12px;

        border-radius: 50%;
        content: "";
        color: #d8d8d8;
        background: #d8d8d8;
      }
    }
    .speed {
      margin-top: 150px;
      display: flex;
      align-items: center;

      min-height: 60px;
      .small {
        display: inline-block;
        width: 36px;
        height: 36px;
        margin-right: 17px;
        &.low{
          background-image: url('~@lib/@{imgPath}/icon-min.png');
          background-size: 100% 100%;
        }
        &.normal {
          background-image: url('~@lib/@{imgPath}/icon-normal.png');
          background-size: 100% 100%;
        }
        &.high {
          background-image: url('~@lib/@{imgPath}/icon-big.png');
          background-size: 100% 100%;
        }
        &.auto {
           background-image: url('~@lib/@{imgPath}/icon-min.png');
          background-size: 100% 100%;
        }
      }
      .swich {
        display: flex;
        align-items: center;
        position: relative;
        width: 502px;
        display: flex;
        .mask-item {
          position: absolute;

          width: 502px;
        }
        .up {
          transform-origin: 0% 0%;
          transform: rotate(-0.5deg);
          .last {
            border-top-right-radius: 50px;
          }
        }
        .dowm {
          transform-origin: 0% 0%;
          transform: rotate(0.5deg);
          .last {
            border-bottom-right-radius: 50px;
          }
        }
        .item {
          height: 10px;
          flex: 1;
          background-image: linear-gradient(-90deg, #ffd500 0%, @yellow 100%);
          margin-right: 1PX;
        }
        &.auto .item{
           background: #a4a9af;
        }
      }
      .btn-big {
        margin-left: 48px;
        border: 1PX solid #fff;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        &::before {
          content: "";
          display: block;
          width: 34px;
          height: 34px;
          background-image: url('~@lib/@{imgPath}/speed-white.png');
          background-size: 100% 100%;
        }
        &.active{
          background-image: linear-gradient(-90deg, #ffd500 0%, @yellow 100%);
          border-color: @yellow;
          &::before {
            background-image: url('~@lib/@{imgPath}/speed-black.png');
            background-size: 100% 100%;
          }
        }
      }
      .current {
        position: absolute;
        top: -25px;

        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #ffffff;
        border: 2px solid @bgColor;
        &.auto {
          left: -4px;
        }
        &.low {
          left: 145px;
        }
        &.normal {
          left: 310px;
        }
        &.high {
          left: 450px;
        }
      }
    }

    .canclick {
      position: relative;
      z-index: 9999;
    }
  }
  &.offline,
  &.close {
    &:before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 9;
      width: 100%;

      background: rgba(0, 0, 0, 0.7);
    }
    .speed .swich .item {
      background: #fff;
    }
    .speed .btn-big {
      background: rgba(0, 0, 0, 0);
      border: 1PX solid #fff;
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/@{imgPath}/speed-white.png');
        background-size: 100% 100%;
      }
    }
    .speed .current {
      border: 2px solid#a4a9af;
    }
    .dial {
      z-index: 999;
      background-image: url('~@lib/@{imgPath}/dial-off.png');
    }
    .btns {
      .btn-swich {
        position: relative;
        z-index: 10;
        &::before {
          content: "";
          display: block;
          width: 44px;
          height: 44px;
          background-image: url('~@lib/@{imgPath}/swich-white.png');
          background-size: 100% 100%;
        }
        &.active {
          &::before {
            background-image: url('~@lib/@{imgPath}/swich-black.png');
          }
        }
      }
    }
  }
  &.offline {
    .canclick {
      z-index: 0;
    }
    .btns .btn-swich {
      position: relative;
      z-index: 0;
    }
  }

  &.loading {
    .dial {
      left: 750px;
    }
    .temperature {
      left: -750px;
    }
    .bottom {
      bottom: -600px;
    }
  }
}

</style>
