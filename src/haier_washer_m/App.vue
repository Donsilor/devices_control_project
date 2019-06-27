<template>
  <div 
    id="app" 
    :class="[{ 'offline': isOffline }, { 'close': isClose }]">
    <div class="page">
      <topbar
        :title="device_name"
        :bak-color="bakColor"/>
      <!-- 离线提示 原生实现了 该功能注释掉-->
      <!-- <div 
        v-show="isOffline"
        class="tips">
        <i class="attention" />
        设备已离线，查看帮助
      </div> -->

      <div class="main">
        <div class="mode">{{ model.mode | modeType }}模式 </div>
        <div class="time">{{ model.time_left }}</div>
        <div class="time-unit">分</div>
        <div class="status">{{ model.operation | operationType }}</div>
        <!-- <div class="reserve"><i/>14点25分将启动洗衣</div> -->
      </div>

      <div :class="[{ 'run': isRun }, 'wrap-wave']">
        <div class="wave wave1"/>
        <div class="wave wave2"/>
        <div class="bubbles">
          <ul class="items">
            <li class="bubble bubble1 ps1"/>
            <li class="bubble bubble2 ps2"/>
            <li class="bubble bubble3 ps3"/>
            <li class="bubble bubble4 ps4"/>
            <li class="bubble bubble5 ps5"/>
            <li class="bubble bubble4 ps6"/>
            <li class="bubble bubble1 ps7"/>
            <li class="bubble bubble5 ps8"/>
            <li class="bubble bubble3 ps9 "/>
            <li class="bubble bubble4 ps10"/>
          </ul>
        </div>
        <div class="wrap-btns">
          <div class="btns center">
            <div 
              class="btn  btn-swich center"
              @click.stop="setSwitch('off')"/>
            <div 
              class="btn btn-start center"
              @click.stop="setControl"/>
            <div 
              :class="[modeBtnClass, 'btn center']"
              @click.stop="showModelPanel"/>
            <div 
              class="btn btn-time center"
              @click.stop="showTime"/>
          </div>
          <div class="wrap-txt center">
            <div class="name">开关</div>
            <div class="name">{{ isRun ? '暂停' : '启动' }}</div>
            <div class="name">模式</div>
            <div class="name">预约</div>
          </div>
        </div>
      </div>

      <SelectTime 
        ref="time" 
        @selectedTime="setReserve" />
    </div>

    <!-- 更多 -->
    <sub-page 
      v-model="modeModalVisible" 
      title="模式" 
      class="modal-w modal-more backControl">
      <div class="more-wrap">
        <div class="mode-group">
          <div class="title">洗涤清洁</div>
          <div class="btns">
            <div 
              class="btn-wrap" 
              @click="setMode('strong_wash')">
              <div :class="[{ 'active': model.mode == 'strong_wash' }, 'btn btn-mode center']" />
              <div class="btn-name">标准洗</div>
            </div>

            <div 
              class="btn-wrap"
              @click="setMode('high_speed_15m')">
              <div :class="[{ 'active': model.mode == 'high_speed_15m' }, 'btn btn-mode-15 center']"/>
              <div class="btn-name">速洗15′</div>
            </div>

            <div 
              class="btn-wrap"
              @click="setMode('spin')">
              <div :class="[{ 'active': model.mode == 'spin' }, 'btn btn-ts center']"/>
              <div class="btn-name">单脱水</div>
            </div>
            <div 
              class="btn-wrap"
              @click="setMode('odor_removal')">
              <div :class="[{ 'active': model.mode == 'odor_removal' }, 'btn btn-jzj center']"/>
              <div class="btn-name">筒自洁</div>
            </div>
          </div>
        </div>

        <div class="mode-group">
          <div class="title">洗涤清洁</div>
          <div class="btns">
            <div 
              class="btn-wrap"
              @click="setMode('mix')">
              <div :class="[{ 'active': model.mode == 'mix' }, 'btn btn-hh center']" />
              <div class="btn-name">混合</div>
            </div>

            <div 
              class="btn-wrap"
              @click="setMode('cotton')">
              <div :class="[{ 'active': model.mode == 'cotton' }, 'btn btn-ms center']"/>
              <div class="btn-name">棉麻</div>
            </div>

            <div 
              class="btn-wrap"
              @click="setMode('synthetic')">
              <div :class="[{ 'active': model.mode == 'synthetic' }, 'btn btn-hq center']" />
              <div class="btn-name">化纤</div>
            </div>

            <div 
              class="btn-wrap"
              @click="setMode('cardigan')">
              <div :class="[{ 'active': model.mode == 'cardigan' }, 'btn btn-ym center']"/>
              <div class="btn-name">羊毛</div>
            </div>
            <div 
              class="btn-wrap"
              @click="setMode('cowboy_suit')">
              <div :class="[{ 'active': model.mode == 'cowboy_suit' }, 'btn btn-nz center']"/>
              <div class="btn-name">牛仔</div>
            </div>

            <div 
              class="btn-wrap"
              @click="setMode('down_coat')">
              <div :class="[{ 'active': model.mode == 'down_coat' }, 'btn btn-ylf center']"/>
              <div class="btn-name">羽绒服</div>
            </div>
          </div>
        </div>
      </div>
    </sub-page>

    <!-- 弹框 -->
    <modal 
      v-model="showModel" 
      title="预约洗衣" 
      class="modal-w">
      <div class="reserve-wrap">
        content
      </div>
      <div class="reserve-foot">
        <a 
          href="" 
          class="cancel" 
          @click.prevent="cancelReserve">取消</a>
        <a 
          href="" 
          class="submit" 
          @click.prevent="submitReserve">确定</a>
      </div>
    </modal>

  </div>
</template>


<script>
import SelectTime from '../../lib/components/time/time.vue'
import Modal from '../../lib/components/Modal.vue'
import SubPage from './components/SubPage.vue'

import {
  MODE_OPTIONS,
  RESERVE_TIME_OPTIONS,
  TEMPERATURE_OPTIONS,
  DRY_OPTIONS,
  DETERGENT_OPTIONS,
  OPERATION_OPTIONS,
  ERROR_CODE,
  DEFAULT_ERROR_MSG
} from './config'

const radio = (document.documentElement.clientWidth || window.innerWidth) / 750 * 75

// function getToggle(val) {
//     return val === 'on' ? 'off' : 'on';
// }

function formatTime(time) {
  var hour = Math.floor(time / 60)
  var minute = time % 60
  var result = ''
  if (hour > 0) {
    result += `${hour}<small>时</small>`
  }
  result += `${minute}<small>分</small>`
  return result
}

function findIndex(array, fn) {
  for (var i = 0; i < array.length; i++) {
    if (fn(array[i])) {
      return i
    }
  }
  return -1
}

export default {
  components: {
    SelectTime,
    Modal,
    SubPage,

  },
  data() {
    return {
      showModel: false,

      status: '',
      model: {},
      device_name: '',
      moreModalVisible: false,
      modeModalVisible: false,

      currentReserveTime: 0,
      confirmChildLockVisible: false,
      currentSet: -1,
      number: 0,
      itemHeight: 1.2 * radio,
      errors: []
    }
  },
  computed: {
    isOffline() {
      let status = this.model.connectivity === 'online' ? false : true
      return status
    },
    isClose() {
      return this.model.switch == 'off'
    },
    bakColor() {
      return this.isClose ? '#fff' : '#000'
    },
    isRun() {
      return this.model.status == 'run'
    },
    isPause() {
      return this.model.status == 'standby' && this.model.operation != 'none' && this.model.operation != 'finish'
    },
    isStandby() {
      return this.model.status == 'standby' && this.model.operation == 'none'
    },
    isFinish() {
      return this.model.status == 'standby' && this.model.operation == 'finish'
    },
    numberSlot() {
      var values = RESERVE_TIME_OPTIONS.map((item) => {
        return `${item}`
      })
      return [
        {
          flex: 1,
          defaultIndex: this.model.reserve_wash ? this.model.reserve_wash - 3 : 0,
          values: values,
          className: 'slot1'
        }
      ]
    },
    time_left() {
      return formatTime(this.model.time_left)
    },
    operationText() {
      return this.isRun ? OPERATION_OPTIONS[this.model.operation] : '暂停中'
    },
    childLockSwitch() {
      return this.model.child_lock_switch == 'on' ? true : false
    },
    currentModeConfig() {
      return MODE_OPTIONS[this.model.mode]
    },
    temperatureOptions() {
      var temperatureConfig = this.currentModeConfig.temperature
      return TEMPERATURE_OPTIONS.filter((item, i) => {
        return temperatureConfig.options.indexOf(i) >= 0
      })
    },
    dryingOptions() {
      var dryingConfig = this.currentModeConfig.drying
      return DRY_OPTIONS.filter((item, i) => {
        return dryingConfig.options.indexOf(i) >= 0
      })
    },
    detergentOptions() {
      var detergentConfig = this.currentModeConfig.detergent
      return DETERGENT_OPTIONS.filter((item, i) => {
        return detergentConfig.options.indexOf(i) >= 0
      })
    },
    currentTemperature() {
      var result = this.temperatureOptions.filter(item => {
        return item.value == this.model.temperature
      })
      return result[0] || {}
    },
    currentDrying() {
      var result = this.dryingOptions.filter(item => {
        return item.value == this.model.drying
      })
      return result[0] || {}
    },
    currentDetergent() {
      var result = this.detergentOptions.filter(item => {
        return item.value == this.model.auto_detergent_switch
      })
      return result[0] || {}
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
    isRun(val) {
      if (val) {
        this.currentSet = -1
      }
    },
    moreModalVisible(val) {
      if (val) {
        HdSmart.UI.toggleHeadAndFoot(false) //隐藏app头部
      } else {
        HdSmart.UI.toggleHeadAndFoot(true) //显示app头部
      }
    },
    modeModalVisible(val) {
      if (val) {
        HdSmart.UI.toggleHeadAndFoot(false) //隐藏app头部
      } else {
        HdSmart.UI.toggleHeadAndFoot(true) //显示app头部
      }
    }
  },
  created() {
    // get localStorage 保存的数据
    var str_model = window.localStorage.getItem("washer_model_attr")
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
      this.getSnapShot()
    })
    HdSmart.onDeviceStateChange(data => {
      this.onSuccess(data.result)
    })
    HdSmart.onDeviceAlert(data => {
      if (data.method == 'dr_report_dev_alert') {
        this.getAlertList(data.result.attribute.error)
      } else {
        this.onDaAlert(data.result.attribute.error)
      }
    })
  },
  methods: {
    showModelPanel() {
      if(!this.isClose) this.modeModalVisible = true
    },
    showTime() {
      if(!this.isClose) this.$refs.time.show = true
    },
    controlDevice(attr, val, success, error) {
      // if(this.errors.length){
      //     this.showAlarmTip(this.errors[0])
      //     return
      // }
      if (this.model.child_lock_switch == 'on' && attr != 'child_lock_switch') {
        HdSmart.UI.toast('请先关闭童锁')
        return
      }

      var params = {
        [attr]: val
      }

      if (attr == 'mode') {
        //要切到待机模式
      }

      HdSmart.Device.control(
        {
          method: 'dm_set',
          nodeid: `wash_machine.main.${attr}`,
          params: {
            attribute: params
          }
        },
        () => {
          success && success()
        },
        () => {
          error && error()
        }
      )
    },
    setSwitch() {
      let switchStatus = ''
      if (this.model.switch == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.controlDevice('switch', switchStatus)
    },
    setControl() {
      if(this.isClose) return

      let val = ''
      if(this.isRun){
        val = 'halt'
      } else {
        val = 'start'
      }
      if (this.model.operation == 'drying' && val == 'halt') {
        HdSmart.UI.toast('烘干时不可暂停')
        return
      }
      this.controlDevice('control', val)
    },
    setMode(mode) {
      // if (this.isRun || this.isPause) {
      //   return
      // }
      // if (this.model.mode == mode) {
      //   return
      // }
      this.controlDevice('mode', mode, () => {
        this.model.mode = mode
      })
    },
    setChildLock(val, callback) {
      this.controlDevice('child_lock_switch', val, callback)
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
    setTemperature(item) {
      if (this.isRun) {
        return
      }
      if (item.value == this.currentTemperature.value) {
        return
      }
      this.controlDevice('temperature', parseInt(item.value), () => {
        this.model.temperature = item.value
      })
    },
    setDetergent(item) {
      if (this.isRun) {
        return
      }
      if (item.value == this.currentDetergent.value) {
        return
      }
      this.controlDevice('auto_detergent_switch', item.value, () => {
        this.model.auto_detergent_switch = item.value
      })
    },
    setDrying(item) {
      if (this.isRun) {
        return
      }
      if (item.value == this.currentDrying.value) {
        return
      }
      this.controlDevice('drying', item.value, () => {
        this.model.drying = item.value
      })
    },
    cancelReserve() {
      this.reserveModalVisible = false
      this.setReserve(0)
    },
    submitReserve() {
      this.reserveModalVisible = false
      this.setReserve(this.number)
    },
    onNumberChange(picker, values) {
      this.number = values[0]
    },
    confirmChildLock() {
      if (this.childLockSwitch) {
        // this.confirmChildLockVisible = true;
        HdSmart.UI.alert(
          {
            message: '关闭童锁后，所有按键可正常使用。确定关闭？'
          },
          val => {
            if (val) {
              this.submitChildLock()
            }
          }
        )
      } else {
        if (this.isRun) {
          this.setChildLock('on', () => {
            this.model.child_lock_switch = 'on'
          })
        } else {
          HdSmart.UI.toast('运行中才能开启童锁')
        }
      }
    },
    submitChildLock() {
      this.setChildLock('off', () => {
        // this.confirmChildLockVisible = false;
        this.model.child_lock_switch = 'off'
      })
    },
    toggleSet(index) {
      if (this.isRun || this.isPause) {
        return
      }
      this.currentSet = this.currentSet == index ? -1 : index
    },
    getSnapShot(cb) {
      HdSmart.Device.getSnapShot(
        data => {
          this.onSuccess(data)
          cb && cb()
        },
        () => {
          this.onError()
          cb && cb()
        }
      )
    },
    onSuccess(data) {
      HdSmart.UI.hideLoading()
      this.status = 'success'

      this.model = data.attribute
      // 将model 保存在 localStorage
      window.localStorage.setItem('washer_model_attr', JSON.stringify(data.attribute))

      this.getAlertList(data.attribute.error)
    },
    onError() {
      this.status = 'error'
    },
    getAlertList(errors) {
      errors = errors || []
      this.errors = errors.filter(item => {
        return item.status == 1
      })
    },
    onDaAlert(errors) {
      var error = errors[0]
      //当前故障
      var index = findIndex(this.errors, item => {
        return item.code == error.code
      })
      if (index >= 0) {
        this.errors.splice(index, 1)
      }
      if (error.status == 1) {
        this.errors.push(error)
      }
    },
    showAlarmTip(err) {
      var msg = ERROR_CODE[err.code] || DEFAULT_ERROR_MSG
      HdSmart.UI.alert(
        {
          title: '故障',
          message: err.code + ' ' + msg,
          cancelText: '',
          onText: '知道了'
        },
        val => {
          if (val) {
            // HdSmart.Device.control({
            //     method: 'dm_set',
            //     "nodeid": "wifi.main.alarm_confirm",
            //     "params": {
            //         "attribute": {
            //             "error_code": err.code
            //         }
            //     }
            // }, () => {})
          }
        }
      )
    },
    inError(error) {
      return (
        findIndex(this.errors, item => {
          return item.code == error
        }) >= 0
      )
    }
  },
}
</script>
<style lang="less" scoped>
@keyframes wave1 {
    from {
        background-position-x: 0;
    }
    to {
        background-position-x: -885px;
    }
}
@keyframes wave2 {
    from {
        background-position-x: 200px;
    }
    to {
        background-position-x: -685px;
    }
}

@keyframes animX1{
   0% {left: 506px;}
	100% {left: 546px;}
}
@keyframes animX2{
   0% {left: 224px;}
	100% {left: 284px;}
}
@keyframes animX3{
   0% {left: 458px;}
	100% {left: 480px;}
}
@keyframes animX4{
   0% {left: 422px;}
	100% {left: 482px;}
}
@keyframes animX5{
   0% {left: 184px;}
	100% {left: 244px;}
}
@keyframes animX6{
   0% {left: 200px;}
	100% {left: 260px;}
}
@keyframes animX7{
   0% {left: 540px;}
	100% {left: 580px;}
}
@keyframes animX8{
   0% {left: 262px;}
	100% {left: 342px;}
}
@keyframes animX9{
   0% {left: 492px;}
	100% {left: 510px;}
}

@keyframes animY{
   0% {top: 640px;}
	100% {top: 0px;}
}

#app{
  background: #fff;
  .page{
    min-height: 100%;
    background: #fff;
  }
  .tips {
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.3);
    position: fixed;
    top: 64PX;
    left: 0;
    z-index: 999;

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
      background-image: url(../../lib/base/air_condition/assets/new-air/icon-tips.png);
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

  .main{
    position: absolute;
    top: 0; 
    left:50%;
    transform: translate(-50%, 0);
    z-index: 1;

    box-sizing: border-box;
    margin: 192px auto;
    padding: 122px 0;
    width: 548px;
    height: 548px;
    
    background-image: url(../../lib/base/haier_washer/assets/bg-circle.png);
    background-size: 100% 100%;
    color: #000;
    font-size: 24px;
    text-align: center;
    .mode{
      margin-bottom: 10px;
    }
    .time{
      line-height: 1;
      font-size: 200px;
    }
    .time-unit{
      position: absolute;
      top:190px;
      left: 394px;
      width: 40px;
      color: #20282B;
    }
    .status{
      color: #fff;
      margin-top: 40px;
    }
    .reserve{
      font-size: 24px;
      color: #FFC600;

      display: flex;
      justify-content: center;
      align-items: center;
      line-height: 1;
      i{
        display: block;
        width: 30px;
        height: 30px;
        background-image: url(../../lib/base/haier_washer/assets/icon-time.png);
        background-size: 100% 100%;
      }
    }
  }
  .wrap-wave{
    position: relative;
    width: 100%;
    height: 850px;
    margin-top:336px;
  }
  .wave {
    position: absolute;
    left: 0;
    top: 30px;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position-y: top;
    background-size: 250% 100%;
  }
  .wave1 {
    background-image: url(../../lib/base/haier_washer/assets/wave1.png);
    background-position-x: -560px;
  }
  .wave2 {
    background-image: url(../../lib/base/haier_washer/assets/wave2.png);
    background-position-x: -520px;
  }

  .bubbles{
    position: absolute;
    top: 48px;
    width: 100%;
    height: 545px;
    overflow: hidden;
    .items{
      list-style: none;
    }
    .bubble{
      background-image: url(../../lib/base/haier_washer/assets/bubble.png);
      background-size: 100% 100%;
      &.bubble1{
        width: 18px;
        height: 18px;
        position: absolute;
        left: 170px;
      }
      &.bubble2{
        width: 28px;
        height: 28px;
        position: absolute; 
        left: 170px;
      }
      &.bubble3{
        width: 38px;
        height: 38px;
        position: absolute;
        left: 170px;
      }
      &.bubble4{
        width: 45px;
        height: 45px;
        position: absolute;
        top: 550px;
        left: 170px;
      }
      &.bubble5{
        width: 58px;
        height: 58px;
        position: absolute;
        top: 550px;
        left: 170px;
      }
      &.ps1{
        top: 120px;
        left: 506px;
      }
      &.ps2{
        top: 172px;
        left: 224px;
      }
      &.ps3{
        top: 234px;
        left: 458px;
      }
      &.ps4{
        top: 266px;
        left: 302px;
      }
      &.ps5{
        top: 358px;
        left: 184px;
      }
      &.ps6{
        top: 368px;
        left: 540px;
      }
      &.ps7{
        top: 522px;
        left: 262px;
      }
      &.ps8{
        top: 510px;
        left: 492px;
      }
      &.ps9{
        top: 606px;
        left: 392px;
      }
      &.ps10{
        top: 626px;
        left: 402px;
      }
    }
  }

  .run {
    .wave1 {
      animation: wave1 2s linear 0s infinite;
    }
    .wave2 {
      animation: wave2 2s linear -.5s infinite;
    }
    .bubbles .bubble{
      &.ps1{
        animation: animX1 .5s ease-in-out 0s infinite alternate, animY 4s ease-in-out 0s infinite;
      }
      &.ps2{
        animation: animX2 .5s ease-in-out -.5s infinite alternate, animY 4s ease-in-out -.5s infinite;
      }
      &.ps3{
        animation: animX3 .5s ease-in-out -1s infinite alternate, animY 4s ease-in-out -1s infinite;
      }
      &.ps4{
        animation: animX4 .5s ease-in-out -1.5s infinite alternate, animY 4s ease-in-out -1.5s infinite;
      }
      &.ps5{
        animation: animX5 .5s ease-in-out -2s infinite alternate, animY 4s ease-in-out -2s infinite;
      }
      &.ps6{
        animation: animX6 .5s ease-in-out -2.5s infinite alternate, animY 4s ease-in-out -2.5s infinite;
      }
      &.ps7{
        animation: animX7 .5s ease-in-out -3s infinite alternate, animY 4s ease-in-out -3s infinite;
      }
      &.ps8{
        animation: animX8 .5s ease-in-out -3.5s infinite alternate, animY 4s ease-in-out -3.5s infinite;
      }
      &.ps9{
        animation: animX9 .5s ease-in-out -3.7s infinite alternate, animY 4s ease-in-out -3.7s infinite;
      }
    }
  }

  .wrap-btns{
    position: absolute;
    bottom: 0;
    left: 31px;
    padding: 48px 0;
  }
  .btns {
    padding-top: 48px;
    border-top: 1px solid #ccc;
    .btn {
      box-sizing: border-box;
      margin: 0 24px;
      width: 120px;
      height: 120px;
      border: 1px solid #fff;
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

    .btn-mode-15 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/haier_washer/assets/btn-mode-white15.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/haier_washer/assets/btn-mode-black15.png);
        }
      }
    }
    .btn-ts{
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/haier_washer/assets/ts-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/haier_washer/assets/ts-black.png);
        }
      }
    }
    .btn-jzj{
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/haier_washer/assets/jzj-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/haier_washer/assets/jzj-black.png);
        }
      }
    }
    .btn-hh{
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/haier_washer/assets/hh-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/haier_washer/assets/hh-black.png);
        }
      }
    }
    .btn-ms{
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/haier_washer/assets/ms-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/haier_washer/assets/ms-black.png);
        }
      }
    }
    .btn-hq{
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/haier_washer/assets/hq-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/haier_washer/assets/hq-black.png);
        }
      }
    }
    .btn-ym{
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/haier_washer/assets/ym-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/haier_washer/assets/ym-black.png);
        }
      }
    }
    .btn-nz{
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/haier_washer/assets/nz-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/haier_washer/assets/nz-black.png);
        }
      }
    }
    .btn-ylf{
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/haier_washer/assets/ylf-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/haier_washer/assets/ylf-black.png);
        }
      }
    }
    .btn-others{
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/haier_washer/assets/btn-others.png);
        background-size: 100% 100%;
      }
    }
  }

  .wrap-txt{
    display: flex;
    .name{
      flex: 1;
      text-align: center;
      margin-top: 8px;
      font-size: 20px;
      color: #fff;
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
      z-index: 999;
      width: 100%;

      background: rgba(46, 46, 46, .8);
    }
    .wrap-btns{
      z-index: 9999;
      .btns, .wrap-txt{
        border-color: #5f5f5f;
        .btn{
          opacity: .2;
        }
        .btn-swich{
          opacity: 1;
        }
      }
    }

    // .wave1 {
    //   background-image: url(../../lib/base/haier_washer/assets/wave-close1.png);
    //   background-position-x: -560px;
    // }
    // .wave2 {
    //   background-image: url(../../lib/base/haier_washer/assets/wave-close2.png);
    //   background-position-x: -520px;
    // }
    .btns {
      .btn-swich {
        position: relative;
        z-index: 10;
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
    }
  }
  &.offline {
    .wrap-btns{
      z-index: 0;
      .btns .btn-swich {
        position: relative;
        z-index: 0;
        opacity: .2;
      }
    }
    .canclick {
      z-index: 0;
    }

  }

  .mode-group{
    font-size: 24px;
    color: #fff;
    .title{
      padding: 48px;
      color: #A4A9AF;
    }
    .btns{
      padding: 0 10px;
      border-top: none;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .btn-wrap{
        margin: 0 29px 50px;
        .btn{
          margin: 0;
          border: 1PX solid #20282B;
          &.active{
            border: none;
          }
        }
        .btn-name{
          color: #20282B;
          margin-top: 16px;
          text-align: center;
        }
        .btn-mode{
          &::before {
            background-image: url(../../lib/base/haier_washer/assets/btn-mode-black58.png);
            background-size: 100% 100%;
          }
        }
        .btn-mode-15 {
          &::before {
            background-image: url(../../lib/base/haier_washer/assets/btn-mode-black15.png);
            background-size: 100% 100%;
          }
    
        }
        .btn-ts{
          &::before {
            background-image: url(../../lib/base/haier_washer/assets/ts-black.png);
            background-size: 100% 100%;
          }
        }
        .btn-jzj{
          &::before {
            background-image: url(../../lib/base/haier_washer/assets/jzj-black.png);
            background-size: 100% 100%;
          }
        }
        .btn-hh{
          &::before {
            background-image: url(../../lib/base/haier_washer/assets/hh-black.png);
            background-size: 100% 100%;
          }
        }
        .btn-ms{
          &::before {
            background-image: url(../../lib/base/haier_washer/assets/ms-black.png);
            background-size: 100% 100%;
          }
        }
        .btn-hq{
          &::before {
            background-image: url(../../lib/base/haier_washer/assets/hq-black.png);
            background-size: 100% 100%;
          }
        }
        .btn-ym{
          &::before {
            background-image: url(../../lib/base/haier_washer/assets/ym-black.png);
            background-size: 100% 100%;
          }
        }
        .btn-nz{
          &::before {
            background-image: url(../../lib/base/haier_washer/assets/nz-black.png);
            background-size: 100% 100%;
          }
        }
        .btn-ylf{
          &::before {
            background-image: url(../../lib/base/haier_washer/assets/ylf-black.png);
            background-size: 100% 100%;
          }
        }
      }

    }
  }
}

</style>