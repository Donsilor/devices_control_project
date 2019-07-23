<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, {'filter': showModeBtns }, 'page']">
      <topbar
        :title="device_name"
        bak-color="#000"/>
      <div class="c-status">时段预约：6:00-9:00</div>

      <div
        class="main center"
        @click="toSubPage">
        <div class="wrap-circle">
          <div class="circle" />
          <div class="cover" />
          <span class="point left" />
          <span class="point right" />
        </div>

        <div class="bg center">
          <div class="bg2 center">
            <div class="num">加热中</div>
            <div class="time">38<sup>°C</sup></div>
            <div class="cmode">当前温度</div>
          </div>
        </div>
      </div>

      <div class="control center">
        <div class="reduce">-</div>
        <div class="main-control"><i class="icon" /> 预设温度 60°C</div>
        <div class="add">+</div>
      </div>

      <!-- 按钮 -->
      <div class="panel-btn center">
        <div 
          class="more" 
          @click="handleMore">
          <div :class="[isOpen ? 'up': 'down', 'arrow']">></div>
          <div>{{ isOpen ? '收起' : '查看更多' }}</div>
        </div>

        <div :class="[{'up-index': !isOffline }, 'btn-wrap']" >
          <div
            :class="[ isRun ? 'btn-stop': 'btn-start', 'btn center']"
            @click="setSwitch" />
          <div class="btn-name">启动</div>
        </div>

        <div class="btn-wrap">
          <div
            :class="[modeBtnClass, 'btn center']"
            @click="showMode" />
          <div class="btn-name">模式</div>
        </div>

        <div class="btn-wrap">
          <div
            class="btn btn-time center"
            @click="showTime" />
          <div class="btn-name">预约</div>
        </div>
        <div class="btn-wrap">
          <div
            class="btn btn-time center"
            @click="showTime" />
          <div class="btn-name">预约</div>
        </div>

        <div 
          v-show="isOpen" 
          class="btn-wrap">
          <div
            class="btn btn-time center"
            @click="showTime" />
          <div class="btn-name">预约</div>
        </div>
        <div 
          v-show="isOpen" 
          class="btn-wrap">
          <div
            class="btn btn-time center"
            @click="showTime" />
          <div class="btn-name">预约</div>
        </div>
      </div>

    </div>
    <!-- 模式选择弹框 -->
    <Modal 
      v-model="showModeBtns" 
      title="选择模式">
      <div class="items">
        <div class="btns">
          <div 
            class="btn-wrap" 
            @click="setMode('strong_wash')">
            <div :class="[{ 'active': model.mode == 'strong_wash' }, 'btn btn-mode1 center']" />
            <div class="btn-name">五谷</div>
          </div>

          <div 
            class="btn-wrap"
            @click="setMode('high_speed_15m')">
            <div :class="[{ 'active': model.mode == 'mode2' }, 'btn btn-mode2 center']"/>
            <div class="btn-name">米糊</div>
          </div>

          <div 
            class="btn-wrap"
            @click="setMode('spin')">
            <div :class="[{ 'active': model.mode == 'spin' }, 'btn btn-mode3 center']"/>
            <div class="btn-name">绵粥</div>
          </div>
          <div 
            class="btn-wrap"
            @click="setMode('odor_removal')">
            <div :class="[{ 'active': model.mode == 'odor_removal' }, 'btn btn-mode4 center']"/>
            <div class="btn-name">浓汤</div>
          </div>
        </div>
      </div>
      <div class="items">
        <div class="btns">
          <div 
            class="btn-wrap" 
            @click="setMode('strong_wash')">
            <div :class="[{ 'active': model.mode == 'mode2' }, 'btn btn-mode5 center']" />
            <div class="btn-name">蒸煮</div>
          </div>

          <div 
            class="btn-wrap"
            @click="setMode('high_speed_15m')">
            <div :class="[{ 'active': model.mode == 'high_speed_15m' }, 'btn btn-mode6 center']"/>
            <div class="btn-name">研磨</div>
          </div>

          <div 
            class="btn-wrap"
            @click="setMode('spin')">
            <div :class="[{ 'active': model.mode == 'spin' }, 'btn btn-mode7 center']"/>
            <div class="btn-name">果蔬</div>
          </div>
          <div 
            class="btn-wrap"
            @click="setMode('odor_removal')">
            <div :class="[{ 'active': model.mode == 'odor_removal' }, 'btn btn-mode8 center']"/>
            <div class="btn-name">奶昔</div>
          </div>
        </div>
      </div>
      <div class="items">
        <div class="btns">
          <div 
            class="btn-wrap" 
            @click="setMode('strong_wash')">
            <div :class="[{ 'active': model.mode == 'mode2' }, 'btn btn-mode9 center']" />
            <div class="btn-name">沙冰</div>
          </div>
          <div 
            class="btn-wrap"
            @click="setMode('high_speed_15m')">
            <div :class="[{ 'active': model.mode == 'high_speed_15m' }, 'btn btn-mode10 center']"/>
            <div class="btn-name">温热</div>
          </div>
        </div>
      </div>
    </Modal>
    <!-- 时间选择 -->
    <SelectTime 
      ref="time" 
      @selectedTime="setReserve" />

  </div>
</template>

<script>
import SelectTime from '../../lib/components/time/time.vue'
import Modal from '../../lib/components/Modal.vue'

export default {
  components: {
    SelectTime,
    Modal
  },
  data() {
    return {
      isOpen: false,
      device_name: "",
      model: {
        "progress": 60,
        "machine_mode": 'grains',
        "order_time": 440,
        "step": 3,
        "speed_tem": 10,
        "run_time": 40,
        "machine_status": 'standby',
        "order_mode": 'gruel',
        "realtime_tem": 79,
        "realtime_speed": 3,
        "no_cup": 'on',
        "dry_heat": 'on',
        "connectivity": "online"
      },
      showModeBtns: false,
      animation: false,
      btnLoading: {
        switch: false,
        auto: false,
        cold: false,
        heat: false,
        dehumidify: false,
        wind: false,
        wind_up_down: false,
        wind_left_right: false
      },
      showSubPage: false
    }
  },
  computed: {
    isRun() {
      return this.model.status == 'run'
    },
    isClose() {
      return this.model.switch_status !== 'on' ? false : true 
    },
    isOffline() {
      return this.model.connectivity === 'online' ? false : true
    },
    btnClass() {
      /* eslint-disable no-unreachable */
      switch (this.model.speed) {
        case 'low':
          return 'btn-low'
          break
        case 'middle':
          return 'btn-middle'
          break
        case 'high':
          return 'btn-high'
          break
        case 'very_high':
          return 'btn-very_high'
          break
        case 'super_high':
          return 'btn-super_high'
          break
        case 'sleep':
          return 'btn-low'
          break
      }
    },
    btnTxt() {
      /* eslint-disable no-unreachable */
      switch (this.model.speed) {
        case 'low':
          return '低挡'
          break
        case 'middle':
          return '中档'
          break
        case 'high':
          return '高档'
          break
        case 'very_high':
          return '超高档'
          break
        case 'super_high':
          return '极速挡'
          break
        case 'sleep':
          return '低挡'
          break
      }
    },
    modeBtnClass(){
      /* eslint-disable no-unreachable */
      switch(this.model.mode) {
        case 'strong_wash':
          return 'btn-mode'
          break
        case 'high_speed_15m':
          return 'btn-mode-15'
          break
        case 'spin':
          return 'btn-ts'
          break
        case 'odor_removal':
          return 'btn-jzj'
          break

        case 'mix':
            return 'btn-hh'
            break
        case 'cotton':
            return 'btn-ms'
            break
          case 'synthetic':
            return 'btn-hq'
            break
          case 'cardigan':
            return 'btn-ym'
            break
          case 'cowboy_suit':
            return 'btn-nz'
            break
          case 'down_coat':
            return 'btn-ylf'
            break 
          default:
            return 'btn-others'
      }
    }
  },
  watch: {
  },
  created() {
    var str_model = window.localStorage.getItem("cleaner_model_attr")
    if(str_model){
      try {
        // str_model 有可能不是合法的JSON字符串，便会产生异常
        this.model =JSON.parse(str_model)
      } catch (e) {
        this.model = {}
      }
    }
    HdSmart.ready(() => {
      if (window.device_name) {
        this.device_name = window.device_name
      }
      HdSmart.UI.showLoading()
      this.getSnapShot(() => {
        HdSmart.UI.hideLoading()
      })
    })

    HdSmart.onDeviceStateChange(data => {
      this.onSuccess(data.result)
    })
  },
  methods: {
    handleMore() {
      this.isOpen = !this.isOpen
    },
    showMode() {
      this.showModeBtns = true
    },
    showTime() {
      if(!this.isClose) this.$refs.time.show = true
    },
    setReserve(time) {
      if (this.isRun) {
        HdSmart.UI.toast('运行中无法设置预约')
        return
      }
      let h = parseInt(time.split(':')[0])
      let m = parseInt(time.split(':')[1]) > 0 ? 0.5 : 0
      this.controlDevice('reserve_wash', h + m)
    },

    setSwitch() {
      let switchStatus = ''
      if (this.model.switch_status == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.controlDevice("switch", switchStatus)
    },
    handeModeClick() {
      this.showModeBtns = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.animation = true
        }, 0)
      })
    },
    hide() {
      this.showModeBtns = false
      this.animation = false
    },
    toSubPage() {
      console.log('showSubPage')
      this.showSubPage = true
    },
    showTip(text) {
      clearTimeout(this.tipTime)
      this.tip = text
      this.tipTime = setTimeout(() => {
        this.tip = ""
      }, 2000)
    },
    controlDevice(attr, val, param, success, error) {
      var fn = this.confirm
      var params = Object.assign(
        {
          [attr]: val
        },
        param
      )

      if (attr == "child_lock_switch") {
        fn = function(cb) {
          cb()
        }
      }

      fn(() => {
        HdSmart.Device.control(
          {
            method: "dm_set",
            nodeid: `air_filter.main.${attr}`,
            params: {
              attribute: params
            }
          },
          () => {
            success && success()
          },
          () => {
            error && error()
            this.showTip("操作失败")
          }
        )
      })
    },

    setControl() {
      let val = ''
      if(this.model.control_status == 'sleep'){
        val = 'manual'
      } else {
        val = 'sleep'
      }

      this.controlDevice("control", val, () => {
        this.model.control_status = val
      })
    },
    setSleep() {
      let speed = ''
      if(this.model.speed == 'sleep'){
        speed = 'low'
      } else {
         speed = 'sleep'
      }
      this.setSpeed(speed)
    },
    setSpeed(val) {
      this.controlDevice("speed", val, {}, () => {
        this.hide()
        this.model.speed = val
      })
    },
    setChildLock() {
      if (this.model.control_status == "sleep") {
        HdSmart.UI.toast("睡眠模式下不能开启童锁")
        return
      }
      var val = this.model.child_lock_switch_status == "on" ? "off" : "on"
      this.controlDevice(
        "child_lock_switch",
        val,
        { control: this.model.control_status },
        () => {},
        () => {}
      )
    },
    getSnapShot(cb) {
      HdSmart.Device.getSnapShot(
        data => {
          this.onSuccess(data)
          cb && cb()
        },
        () => {
          cb && cb()
        }
      )
    },
    onSuccess(data) {
      this.status = "success"
      this.model = data.attribute

      // 将model 保存在 localStorage
      window.localStorage.setItem('cleaner_model_attr', JSON.stringify(data.attribute))
    },
    confirm(done) {
      if (this.model.child_lock_switch_status == "on") {
        HdSmart.UI.alert(
          {
            title: "解除童锁",
            message: "解除童锁后才能控制此设备，\n是否解除？",
            dialogStyle: 2
          },
          val => {
            if (val) this.setChildLock()
          }
        )
      } else {
        done()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.body{
  min-height: 100%;
}
.page {
  height: 100vh;
  min-height: 550px;
  overflow-x: hidden;
  position: relative;
  background: #F4F7FE;

  &.filter {
    filter: blur(12px);
  }
  .c-status{
    font-size: 24px;
    color: #35353D;
    text-align: center;
  }
  .bg{
    position: relative;
    z-index: 1;

    width: 370px;
    height: 370px;
    background: #F3F6FD;
    border-radius: 50%;
    padding: 10px;
    .bg2{
      width: 100%;
      height: 100%;
      background: #fff;
      border-radius: 50%;
      flex-direction: column;
    }
  }
  .main {
    margin-top: 80px;
    position: relative;
    &.center{
      flex-direction: column;
    }
    .wrap-circle{
      position: absolute;
      top: -31px;
      border-radius: 50%;
      background: #000;
      .circle{
        box-sizing: border-box;
        border: 4px solid #FF210E;
        border-radius: 50%;

        border-color: transparent transparent#FF210E #FF210E;
        width: 432px;
        height: 432px;
      }
      .cover{
        position: absolute;
        top: 50%;
        background: #F4F7FE;
        width: 100%;
        height: 216px;
      }
    }

    .num {
      font-size: 24px;
      color: #000;
      text-align: center;
    }
    .time {
      font-size: 112px;
      color: #20282B;
      text-align: center;
      position: relative;
      sup {
        font-size: 24px;
        color: #2E2E2E;
        position: absolute;
        top: 30px;
      }
    }
    .cmode{
      font-size: 24px;
      color: #000;
      text-align: center;
    }

    .nuit {
      opacity: 0.5;
      color: #03FD05;
      font-size: 24px;
      letter-spacing: 0;
      text-align: center;
      position: absolute;
      top: 145px;
    }
  }
  .status{
    margin-top: 60px;
    font-size: 24px;
    color: #20282B;
    text-align: center;
  }
  .control{
    margin: 40px 0;
    .reduce, .add{
      background: #fff;
      border: 1px solid #F1F1F1;
      width: 72px;
      height: 72px;
      line-height: 72px;

      border-radius: 50%;
      text-align: center;
      margin: 0 32px;

      font-size: 86px;
    }
    .main-control{
      width: 276px;
      height: 72px;

      line-height: 72px;
      background: #F3E9F1;
      border-radius: 22px;
      font-size: 24px;
      text-align: center;
      color: #FF210E;
    }
  }


  .panel-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 38px 0 30px 40px;

    background: #FFFFFF;
    box-shadow: 0 -3px 28px 0 rgba(209,209,209,0.50);
    border-radius: 42px 42px 0px 0px;

    flex-wrap: wrap;
    justify-content: flex-start;

    .more{
      width: 750px;
      color: #9E9E9E;
      font-size: 24px;
      text-align: center;
      position: absolute;
      left: 0;
      top: -100px;
      .arrow{
        font-size: 32px;
        &.up{
          transform: rotate(90deg)
        }
        &.down{
          transform: rotate(-90deg)
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
    &.up-index{
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
        background-image: linear-gradient(-90deg, #FFD500 0%, #FFBF00 100%);
        border-color: #FFBF00;
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
        background-image: url(../../lib/base/blend/assets/start.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/blend/assets/start.png);
        }
      }
    }
    .btn-stop {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-stop.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/blend/assets/btn-stop.png);
        }
      }
    }
    .btn-time {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/time-black.png);
        background-size: 100% 100%;
      }
    }


    .btn-swich {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/air_cleaner/assets/new-air/swich-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/air_cleaner/assets/new-air/swich-black.png);
        }
      }
    }
    .btn-mode {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode1.png);
        background-size: 100% 100%;
      }
    }
    .btn-low {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/air_cleaner/assets/new-air/speed1.png);
        background-size: 100% 100%;
      }
    }
    .btn-middle {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/air_cleaner/assets/new-air/speed2.png);
        background-size: 100% 100%;
      }
    }
    .btn-high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/air_cleaner/assets/new-air/speed3.png);
        background-size: 100% 100%;
      }
    }
    .btn-very_high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/air_cleaner/assets/new-air/speed4.png);
        background-size: 100% 100%;
      }
    }
    .btn-super_high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/air_cleaner/assets/new-air/speed5.png);
        background-size: 100% 100%;
      }
    }
    .btn-more {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/air_cleaner/assets/new-air/more.png);
        background-size: 100% 100%;
      }
    }
  }
  &.close,  &.offline {
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
    &.page{
      background: #fff;
      .bg .bg2{
        background-image: url(../../lib/base/blend/assets/bg2.png);
        background-size: 100% 100%;
      }
    }
    .btn-wrap{
      opacity: .2;
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
  .btns{
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
        background-image: url(../../lib/base/air_cleaner/assets/new-air/swich-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/air_cleaner/assets/new-air/swich-black.png);
        }
      }
    }

    .btn-low {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/air_cleaner/assets/new-air/speed1-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/air_cleaner/assets/new-air/speed1.png);
        }
      }
    }
    .btn-middle {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/air_cleaner/assets/new-air/speed2-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/air_cleaner/assets/new-air/speed2.png);
        }
      }
    }
    .btn-high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/air_cleaner/assets/new-air/speed3-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/air_cleaner/assets/new-air/speed3.png);
        }
      }
    }
    .btn-very_high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/air_cleaner/assets/new-air/speed4-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/air_cleaner/assets/new-air/speed4.png);
        }
      }
    }
    .btn-super_high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/air_cleaner/assets/new-air/speed5-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/air_cleaner/assets/new-air/speed5.png);
        }
      }
    }
  }
}
.items{
  margin-bottom: 30px;
  .btns {
    display: flex;
    justify-content: center;
    justify-content: flex-start;
    padding: 10px 30px;
    .btn-wrap{
      margin-right: 20px;
    }

    .btn-name{
      margin-top: 16px;
      font-size: 24px;
      color: #20282B;
      text-align: center;
    }
    
    .btn {
      box-sizing: border-box;
      margin: 0 5px;
      width: 110px;
      height: 110px;
      border: 1px solid #20282B;
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
        background-image: url(../../lib/base/air_condition/assets/new-air/swich-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/air_condition/assets/new-air/swich-black.png);
        }
      }
    }
    .btn-start {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/haier_washer/assets/btn-start.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/haier_washer/assets/btn-stop.png);
        }
      }
    }
    .btn-stop {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/haier_washer/assets/btn-stop.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/haier_washer/assets/btn-stop.png);
        }
      }
    }
    .btn-mode {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/haier_washer/assets/btn-mode-white58.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/haier_washer/assets/btn-mode-black58.png);
        }
      }
    }
    .btn-time {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/air_condition/assets/new-air/time-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/air_condition/assets/new-air/time-black.png);
        }
      }
      &.btn-current {
        border-color: #FFC600;
        &::before {
          background-image: url(../../lib/base/air_condition/assets/new-air/time-yellow.png);
        }
        .name{
          color: #FFC600;
        }
      }
    }

    .btn-mode1 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode1.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/blend/assets/btn-mode1.png);
        }
      }
    }
    .btn-mode2 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode2.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/blend/assets/btn-mode2.png);
        }
      }
    }
    .btn-mode3 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode3.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/blend/assets/btn-mode3.png);
        }
      }
    }
    .btn-mode4 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode4.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/blend/assets/btn-mode4.png);
        }
      }
    }
    .btn-mode5 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode5.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/blend/assets/btn-mode5.png);
        }
      }
    }
    .btn-mode6 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode6.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/blend/assets/btn-mode6.png);
        }
      }
    }
    .btn-mode7 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode7.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/blend/assets/btn-mode7.png);
        }
      }
    }
    .btn-mode8 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode8.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/blend/assets/btn-mode8.png);
        }
      }
    }
    .btn-mode9 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode9.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/blend/assets/btn-mode9.png);
        }
      }
    }
    .btn-mode10 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode10.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/blend/assets/btn-mode10.png);
        }
      }
    }


  }
}

</style>
