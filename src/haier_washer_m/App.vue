<template>
  <div 
    id="app" 
    :class="[{ 'offline': isOffline }, { 'close': isClose }]">
    <div class="page">
      <topbar
        :bg-black="true"
        title="大人的洗衣机" />
      <!-- 离线提示 -->
      <div 
        v-show="isOffline"
        class="tips">
        <i class="attention" />
        设备已离线，查看帮助
      </div>

      <div 
        class="main" 
        @click="isOffline = !isOffline">
        <div class="mode">标准洗模式</div>
        <div class="time">58</div>
        <div class="time-unit">分</div>
        <div class="status">洗衣待启动</div>
      </div>

      <div class="wrap-wave">
        <div class="wave wave1"/>
        <div class="wave wave2"/>
        <div class="bubbles">
          <ul class="items">
            <li class="bubble bubble1 ps1"/>
            <li class="bubble bubble2 ps2"/>
            <li class="bubble bubble3 ps3"/>
            <li class="bubble bubble4 ps4"/>
            <li class="bubble bubble3 ps5"/>
            <li class="bubble bubble2 ps6"/>
            <li class="bubble bubble4 ps7"/>
            <li class="bubble bubble2 ps8"/>
            <li class="bubble bubble1 ps9 "/>
          </ul>
        </div>
        <div class="wrap-btns">
          <div class="btns center">
            <div 
              class="btn  btn-swich center"
              @click.stop="setSwitch($event)"/>
            <div 
              class="btn btn-start center"
              @click.stop="setMode('heat', $event)"/>
            <div 
              class="btn btn-mode center"
              @click.stop="setMode('heat', $event)"/>
            <div 
              class="btn btn-time center"
              @click.stop="showTime"/>
          </div>
          <div class="wrap-txt center">
            <div class="name">开关</div>
            <div class="name">启动</div>
            <div class="name">模式</div>
            <div class="name">预约</div>
          </div>
        </div>
      </div>

      <SelectTime ref="time" />
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
            <div class="btn-wrap">
              <div class="btn"/>
              <div class="btn-name">标准洗</div>
            </div>
          </div>
        </div>

        <div class="mode-group">
          <div class="title">衣服类型</div>
          <div class="btns">
            <div class="btn-wrap">
              <div class="btn"/>
              <div class="btn-name">标准洗</div>
            </div>
          </div>
        </div>
      </div>
    </sub-page>
  </div>
</template>


<script>
import SelectTime from '../../lib/components/time/time.vue'


import Modal from '../../lib/components/Modal.vue';
import SwitchButton from '../../lib/components/SwitchButton.vue';
import Picker from '../../lib/components/Picker/picker.vue';
import ModeButton from './components/ModeButton.vue';
import SubPage from '../../lib/components/SubPage.vue';
import Icon from '../../lib/components/SettingIconMobile.vue';

import {
  MODE_OPTIONS,
  RESERVE_TIME_OPTIONS,
  TEMPERATURE_OPTIONS,
  DRY_OPTIONS,
  DETERGENT_OPTIONS,
  OPERATION_OPTIONS,
  ERROR_CODE,
  DEFAULT_ERROR_MSG
} from './config';

const radio = (document.documentElement.clientWidth || window.innerWidth) / 750 * 75;

// function getToggle(val) {
//     return val === 'on' ? 'off' : 'on';
// }

function formatTime(time) {
  var hour = Math.floor(time / 60);
  var minute = time % 60;
  var result = '';
  if (hour > 0) {
    result += `${hour}<small>时</small>`;
  }
  result += `${minute}<small>分</small>`;
  return result;
}

function findIndex(array, fn) {
  for (var i = 0; i < array.length; i++) {
    if (fn(array[i])) {
      return i;
    }
  }
  return -1;
}

export default {
  components: {
    SelectTime,
    Modal,
    SwitchButton,
    Picker,
    ModeButton,
    SubPage,
    Icon
  },
  data() {
    return {
      isOffline: false,
      isClose: false,


      status: '',
      model: {},
      device_name: '',
      moreModalVisible: false,
      modeModalVisible: true,
      reserveModalVisible: false,
      currentReserveTime: 0,
      confirmChildLockVisible: false,
      currentSet: -1,
      number: 0,
      itemHeight: 1.2 * radio,
      errors: []
    };
  },
  computed: {
    isRun() {
      return this.model.status == 'run';
    },
    isPause() {
      return this.model.status == 'standby' && this.model.operation != 'none' && this.model.operation != 'finish';
    },
    isStandby() {
      return this.model.status == 'standby' && this.model.operation == 'none';
    },
    isFinish() {
      return this.model.status == 'standby' && this.model.operation == 'finish';
    },
    numberSlot() {
      var values = RESERVE_TIME_OPTIONS.map((item) => {
        return `${item}`;
      });
      return [
        {
          flex: 1,
          defaultIndex: this.model.reserve_wash ? this.model.reserve_wash - 3 : 0,
          values: values,
          className: 'slot1'
        }
      ];
    },
    time_left() {
      return formatTime(this.model.time_left);
    },
    operationText() {
      return this.isRun ? OPERATION_OPTIONS[this.model.operation] : '暂停中';
    },
    childLockSwitch() {
      return this.model.child_lock_switch == 'on' ? true : false;
    },
    currentModeConfig() {
      return MODE_OPTIONS[this.model.mode];
    },
    temperatureOptions() {
      var temperatureConfig = this.currentModeConfig.temperature;
      return TEMPERATURE_OPTIONS.filter((item, i) => {
        return temperatureConfig.options.indexOf(i) >= 0;
      });
    },
    dryingOptions() {
      var dryingConfig = this.currentModeConfig.drying;
      return DRY_OPTIONS.filter((item, i) => {
        return dryingConfig.options.indexOf(i) >= 0;
      });
    },
    detergentOptions() {
      var detergentConfig = this.currentModeConfig.detergent;
      return DETERGENT_OPTIONS.filter((item, i) => {
        return detergentConfig.options.indexOf(i) >= 0;
      });
    },
    currentTemperature() {
      var result = this.temperatureOptions.filter(item => {
        return item.value == this.model.temperature;
      });
      return result[0] || {};
    },
    currentDrying() {
      var result = this.dryingOptions.filter(item => {
        return item.value == this.model.drying;
      });
      return result[0] || {};
    },
    currentDetergent() {
      var result = this.detergentOptions.filter(item => {
        return item.value == this.model.auto_detergent_switch;
      });
      return result[0] || {};
    }
  },
  watch: {
    isRun(val) {
      if (val) {
        this.currentSet = -1;
      }
    },
    moreModalVisible(val) {
      if (val) {
        HdSmart.UI.toggleHeadAndFoot(false); //隐藏app头部
      } else {
        HdSmart.UI.toggleHeadAndFoot(true); //显示app头部
      }
    },
    modeModalVisible(val) {
      if (val) {
        HdSmart.UI.toggleHeadAndFoot(false); //隐藏app头部
      } else {
        HdSmart.UI.toggleHeadAndFoot(true); //显示app头部
      }
    }
  },
  created() {
    HdSmart.ready(() => {
      if (window.device_name) {
        this.device_name = window.device_name;
      }
      HdSmart.UI.showLoading();
      this.getSnapShot();
    });
    HdSmart.onDeviceStateChange(data => {
      this.onSuccess(data.result);
    });
    HdSmart.onDeviceAlert(data => {
      if (data.method == 'dr_report_dev_alert') {
        this.getAlertList(data.result.attribute.error);
      } else {
        this.onDaAlert(data.result.attribute.error);
      }
    });
  },
  methods: {
    showTime() {
      this.$refs.time.show = true
    },
    controlDevice(attr, val, success, error) {
      // if(this.errors.length){
      //     this.showAlarmTip(this.errors[0])
      //     return
      // }
      if (this.model.child_lock_switch == 'on' && attr != 'child_lock_switch') {
        HdSmart.UI.toast('请先关闭童锁');
        return;
      }

      var params = {
        [attr]: val
      };

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
          success && success();
        },
        () => {
          error && error();
        }
      );
    },
    setSwitch() {
      this.isClose = !this.isClose
      // let switchStatus = ''
      // if (this.deviceInfo.attribute.switchStatus == 'on') {
      //   switchStatus = 'off'
      // } else {
      //   switchStatus = 'on'
      // }
      // this.controlDevice('switch', switchStatus, event.target, () => { }, () => { })
    },
    setControl(val) {
      if (this.model.operation == 'drying' && val == 'halt') {
        HdSmart.UI.toast('烘干时不可暂停');
        return;
      }
      this.controlDevice('control', val);
    },
    setMode(mode) {
      if (this.isRun || this.isPause) {
        return;
      }
      if (this.model.mode == mode) {
        return;
      }
      this.controlDevice('mode', mode, () => {
        this.model.mode = mode;
      });
    },
    setChildLock(val, callback) {
      this.controlDevice('child_lock_switch', val, callback);
    },
    setReserve(time) {
      if (this.isRun) {
        HdSmart.UI.toast('运行中无法设置预约');
        return;
      }
      this.controlDevice('reserve_wash', parseInt(time));
    },
    setTemperature(item) {
      if (this.isRun) {
        return;
      }
      if (item.value == this.currentTemperature.value) {
        return;
      }
      this.controlDevice('temperature', parseInt(item.value), () => {
        this.model.temperature = item.value;
      });
    },
    setDetergent(item) {
      if (this.isRun) {
        return;
      }
      if (item.value == this.currentDetergent.value) {
        return;
      }
      this.controlDevice('auto_detergent_switch', item.value, () => {
        this.model.auto_detergent_switch = item.value;
      });
    },
    setDrying(item) {
      if (this.isRun) {
        return;
      }
      if (item.value == this.currentDrying.value) {
        return;
      }
      this.controlDevice('drying', item.value, () => {
        this.model.drying = item.value;
      });
    },
    cancelReserve() {
      this.reserveModalVisible = false;
      this.setReserve(0);
    },
    submitReserve() {
      this.reserveModalVisible = false;
      this.setReserve(this.number);
    },
    onNumberChange(picker, values) {
      this.number = values[0];
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
              this.submitChildLock();
            }
          }
        );
      } else {
        if (this.isRun) {
          this.setChildLock('on', () => {
            this.model.child_lock_switch = 'on';
          });
        } else {
          HdSmart.UI.toast('运行中才能开启童锁');
        }
      }
    },
    submitChildLock() {
      this.setChildLock('off', () => {
        // this.confirmChildLockVisible = false;
        this.model.child_lock_switch = 'off';
      });
    },
    toggleSet(index) {
      if (this.isRun || this.isPause) {
        return;
      }
      this.currentSet = this.currentSet == index ? -1 : index;
    },
    getSnapShot(cb) {
      HdSmart.Device.getSnapShot(
        data => {
          this.onSuccess(data);
          cb && cb();
        },
        () => {
          this.onError();
          cb && cb();
        }
      );
    },
    onSuccess(data) {
      HdSmart.UI.hideLoading();
      this.status = 'success';

      this.model = data.attribute;

      this.getAlertList(data.attribute.error);
    },
    onError() {
      this.status = 'error';
    },
    getAlertList(errors) {
      errors = errors || [];
      this.errors = errors.filter(item => {
        return item.status == 1;
      });
    },
    onDaAlert(errors) {
      var error = errors[0];
      //当前故障
      var index = findIndex(this.errors, item => {
        return item.code == error.code;
      });
      if (index >= 0) {
        this.errors.splice(index, 1);
      }
      if (error.status == 1) {
        this.errors.push(error);
      }
    },
    showAlarmTip(err) {
      var msg = ERROR_CODE[err.code] || DEFAULT_ERROR_MSG;
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
      );
    },
    inError(error) {
      return (
        findIndex(this.errors, item => {
          return item.code == error;
        }) >= 0
      );
    }
  },
};
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

#app{
  background: #20282b;
  .page{
    min-height: 100%;
    background: #20282b;
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
    color: #fff;
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
      color: #ccc;
    }
    .status{
      margin-top: 40px;
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
    background-repeat: repeat-x;
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
    height: 566px;
    overflow: hidden;
    .items{
      list-style: none;
    }
    .bubble{
      background-image: url(../../lib/base/haier_washer/assets/bubble.png);
      background-size: 100% 100%;
      &.bubble1{
        width: 28px;
        height: 28px;
        position: absolute;
        left: 170px;
      }
      &.bubble2{
        width: 18px;
        height: 18px;
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
        width: 48px;
        height: 48px;
        position: absolute;
        top: 550px;
        left: 170px;
      }
      &.ps1{
        top: 220px;
        left: 506px;
      }
      &.ps2{
        top: 316px;
        left: 224px;
      }
      &.ps3{
        top: 378px;
        left: 458px;
      }
      &.ps4{
        top: 302px;
        left: 422px;
      }
      &.ps5{
        top: 512px;
        left: 184px;
      }
      &.ps6{
        top: 512px;
        left: 184px;
      }
      &.ps7{
        top: 514px;
        left: 540px;
      }
      &.ps8{
        top: 644px;
        left: 262px;
      }
      &.ps9{
        top: 636px;
        left: 492px;
      }
    }
  }

  .wrap-btns{
    position: absolute;
    bottom: 0;
    left: 31px;
    padding: 48px 0;
    .btns {
      padding-top: 48px;
      border-top: 1px solid #ccc;
      .btn {
        box-sizing: content-box;
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

      background: rgba(0, 0, 0, 0.7);
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

    .wave1 {
      background-image: url(../../lib/base/haier_washer/assets/wave-close1.png);
      background-position-x: -560px;
    }
    .wave2 {
      background-image: url(../../lib/base/haier_washer/assets/wave-close2.png);
      background-position-x: -520px;
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
    .canclick {
      z-index: 0;
    }
    .btns .btn-swich {
      position: relative;
      z-index: 0;
    }
  }
}

</style>