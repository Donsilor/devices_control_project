<template>
  <div>
    <div :class="[{'close': isClose}, {'filter': showModeBtns }, 'page']">
      <topbar 
        :title="device_name"
        :bak-color="bakColor"/>
      <div 
        class="main"
        @click="togglePMPop">
        <div>
          <img 
            class="circle"
            src="../../lib/base/air_cleaner/assets/new-air/yuanquan@2x.png"
            alt="">
          <img 
            v-show="current==0"
            class="pointer-excellent"
            src="../../lib/base/air_cleaner/assets/new-air/jiejing@2x.png"
            alt="">
          <img 
            v-show="current==1"
            class="pointer-good"
            src="../../lib/base/air_cleaner/assets/new-air/lianghao@2x.png"
            alt="">
          <img 
            v-show="current==2"
            class="pointer-light"
            src="../../lib/base/air_cleaner/assets/new-air/qingdu@2x.png"
            alt="">
          <img 
            v-show="current==3"
            class="pointer-moderate"
            src="../../lib/base/air_cleaner/assets/new-air/zhongdu@2x.png"
            alt="">
          <img 
            v-show="current==4"
            class="pointer-severe"
            src="../../lib/base/air_cleaner/assets/new-air/zhongduz@2x.png"
            alt="">
        </div>
        <div class="block">
          <div class="num">{{ model.air_filter_result.PM25[0] }}</div>
          <div class="txt">室内空气 优</div>
        </div>
        <span class="nuit">μg/m³</span>
        <span class="sport" />
        <span class="sport1" />
        <span class="sport2" />
        <span class="sport3" />
        <span class="sport4" />
        <span class="sport5" />
        <span class="sport6" />
        <span class="sport7" />
        <span class="sport8" />
        <span class="sport9" />
        <span class="sport10" />
        <span class="sport11" />
        <span class="sport12" />
        <span class="sport13" />
      </div>

      <div class="wrap-filter">
        <div class="filter">
          <div class="filter-item">{{ model.filter_time_remaining }}<sup>%</sup></div>
          <div class="filter-name">剩余滤芯</div>
        </div>
        <div class="filter">
          <div class="filter-item">{{ model.filter_time_used }}<sup>天</sup></div>
          <div class="filter-name">滤芯寿命</div>
        </div>
      </div>

      <!-- 按钮 -->
      <div class="panel-btn center">
        <div class="btn-wrap up-index">
          <div
            :class="[{'active': !isClose && !isOffline }, 'btn btn-swich center']"
            @click="setSwitch" />
          <div class="btn-name">开关</div>
        </div>

        <div class="btn-wrap">
          <div
            :class="[{'active': model.control_status == 'sleep' },'btn btn-mode center']"
            @click="setControl" />
          <div class="btn-name">睡眠</div>
        </div>

        <div class="btn-wrap">
          <div
            :class="[btnClass, 'btn center']"
            @click="handeModeClick" />
          <div class="btn-name">{{ btnTxt }}</div>
        </div>
      </div>

    </div>
    <!-- 模式选择弹框 -->
    <div 
      v-show="showModeBtns"
      class="btns-panel center"
      @touchmove.prevent
      @click="hide">
      <div class="items btns">
        <div 
          :class="[{ 'item1': animation }, {' btn-loading': btnLoading.wind }, 'btn btn-low center']"
          @click.stop="setSpeed('low')">
          <div class="name">低挡</div>
        </div>
        <div 
          :class="[{ 'item2': animation }, {' btn-loading': btnLoading.heat },'btn btn-middle center']"
          @click.stop="setSpeed('middle')">
          <div class="name">中档</div>
        </div>
        <div 
          :class="[{ 'item3': animation }, {' btn-loading': btnLoading.dehumidify }, 'btn btn-high center']"
          @click.stop="setSpeed('high')">
          <div class="name">高档</div>
        </div>
        <div 
          :class="[{ 'item4': animation }, {' btn-loading': btnLoading.cold },'btn btn-very_high center']"
          @click.stop="setSpeed('very_high')">
          <div class="name">超高档</div>
        </div>
        <div 
          :class="[{ 'item5': animation }, {' btn-loading': btnLoading.auto },'btn btn-super_high center']"
          @click.stop="setSpeed('super_high')">
          <div class="name">极速挡</div>
        </div>
        <div 
          :class="[ { 'item6': animation }, btnClass,'btn center active']"
          @click.stop />
      </div>
    </div>

    <!-- PM2.5简介 -->
    <sub-page 
      v-model="pmPopVisible"
      title="PM2.5简介"
      class="modal-w">
      <div class="pm2">
        <p>
          PM2.5指环境空气动力学当量直径小于等于2.5微米的颗粒物。它能较长时间悬浮于空气中，其在空气中含量浓度越高，就代表空气污染越严重。
        </p>
        <p class="sub-title">
          PM2.5数值范围说明
        </p>
        <div class="items">
          <div class="item item1">优</div>
          <div class="item item2">良</div>
          <div class="item item3">轻度</div>
          <div class="item item3">中度</div>
          <div class="item item4">重度</div>
          <div class="item item5">严重</div>
        </div>
        <ul class="ruler">
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
        </ul>
        <ul class="name">
          <li>0</li>
          <li>35</li>
          <li>75</li>
          <li>115</li>
          <li>150</li>
          <li>250+</li>
          <li />
        </ul>
      </div>
    </sub-page>
  </div>
</template>

<script>
import SubPage from "./SubPage"
export default {
  components: {
    SubPage
  },
  data() {
    return {
      device_name: "",
      model: {
        "air_filter_result": {
          "air_quality": [
            "very_high"
          ],
          "PM25": [
            0
          ]
        },
        "switch_status": "on",
        "child_lock_switch_status": "off",
        "negative_ion_switch_status": "off",
        "speed": "low",
        "control_status": "manual",
        "filter_time_used": "2114",
        "filter_time_remaining": "46",
        "temperature": "0",
        "humidity": "0",
        "deviceModel": "KJ819F-B2",
        "manufactureId": "tcl",
        "deviceCategory": "air_filter.main",
        "deviceSubCategory": 0,
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
      pmPopVisible: false,
    }
  },
  computed: {
    isClose() {
      return this.model.switch_status == 'on' ? false : true
    },
    bakColor() {
      return this.isClose ? '#fff' : '#000'
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
          return 'btn-sleep'
          break 
      }
    },
    current() {
      let pm2 = this.model.air_filter_result.PM25[0]
      if (pm2 < 35) {
        return 0
      } else if (pm2 < 75) {
        return 1
      } else if (pm2 < 115) {
        return 2
      } else if (pm2 >= 150) {
        return 3
      } else if (pm2 >= 250) {
        return 4
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
          return '睡眠'
          break 
      }
    }
  },
  watch: {
  },
  created() {
    HdSmart.ready(() => {
      if (window.device_name) {
        this.device_name = window.device_name
      }
      HdSmart.UI.showLoading()
      HdSmart.UI.toggleHeadAndFoot(true)
      this.getSnapShot(() => {
        HdSmart.UI.hideLoading()
      })
    })

    HdSmart.onDeviceStateChange(data => {
      this.onSuccess(data.result)
    })
  },
  methods: {
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
    togglePMPop() {
      //pm2.5
      this.pmPopVisible = !this.pmPopVisible
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
      if (this.model.negative_ion_switch_status == "on") {
        this.controlDevice("negative_ion_switch", "off", { control: "sleep" }, () => {
          this.model.control_status = "sleep"
        })
      } else {
        this.setControl("sleep")
      }
    },
    setSpeed(val) {
      this.controlDevice("speed", val, { control: "manual" }, () => {
        this.hide()
        this.model.control_status = "manual"
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
.page {
  min-height: 100%;
  overflow-x: hidden;
  position: relative;
  background: rgba(230, 255, 243, 1);

  &.filter {
    filter: blur(12px);
  }
  .main {
    width: 540px;
    height: 540px;
    margin: 90px auto 0;
    .circle {
      width: 100%;
      height: 100%;
      // transform: rotateY(180deg);
    }
    .pointer-excellent {
      position: relative;
      left: 110px;
      top: -594px;
      width: 136px;
      height: 26px;
      transform: rotate(339deg);
    }
    .pointer-good {
      position: relative;
      left: -50px;
      top: -394px;
      width: 136px;
      height: 26px;
      transform: rotate(278deg);
    }
    .pointer-light {
      position: relative;
      left: 120px;
      top: -116px;
      width: 136px;
      height: 26px;
      transform: rotate(200deg);
    }
    .pointer-moderate {
      position: relative;
      left: 392px;
      top: -190px;
      width: 136px;
      height: 26px;
      transform: rotate(131deg);
    }
    .pointer-severe {
      position: relative;
      left: 436px;
      top: -456px;
      width: 136px;
      height: 26px;
      transform: rotate(67deg);
    }
    .block {
      position: relative;
      left: 176px;
      top: -520px;
      width: 184px;
      height: 224px;
      color: #03fd05;
      text-align: center;
      font-family: PingFangSC-Regular;
      .num {
        font-size: 160px;
      }
      .txt {
        font-size: 24px;
        letter-spacing: -0.2px;
        position: relative;
        top: -24px;
        font-weight: 900;
      }
    }
    .nuit {
      opacity: 0.5;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #03fd05;
      letter-spacing: 0;
      text-align: center;
      position: relative;
      left: 370px;
      top: -760px;
    }
    .sport {
      display: inline-block;
      border-radius: 50%;
      width: 13px;
      height: 13px;
      opacity: 0.84;
      background: #03fd05;
      position: relative;
      left: 170px;
      top: -930px;
    }
    .sport1 {
      display: inline-block;
      border-radius: 50%;
      width: 13px;
      height: 13px;
      opacity: 0.55;
      background: #03fd05;
      position: relative;
      left: 156px;
      top: -960px;
    }
    .sport2 {
      display: inline-block;
      border-radius: 50%;
      width: 10px;
      height: 10px;
      opacity: 0.62;
      background: #03fd05;
      position: relative;
      left: 208px;
      top: -996px;
    }
    .sport3 {
      display: inline-block;
      border-radius: 50%;
      width: 13px;
      height: 13px;
      opacity: 0.5;
      background: #03fd05;
      position: relative;
      left: 190px;
      top: -980px;
    }
    .sport4 {
      display: inline-block;
      border-radius: 50%;
      width: 11px;
      height: 11px;
      opacity: 0.4;
      background: #03fd05;
      position: relative;
      left: 200px;
      top: -900px;
    }
    .sport5 {
      display: inline-block;
      border-radius: 50%;
      width: 8px;
      height: 8px;
      opacity: 0.54;
      background: #03fd05;
      position: relative;
      left: -280px;
      top: -870px;
    }
    .sport6 {
      display: inline-block;
      border-radius: 50%;
      width: 8px;
      height: 8px;
      opacity: 1;
      background: #03fd05;
      position: relative;
      left: -120px;
      top: -846px;
    }
    .sport7 {
      display: inline-block;
      border-radius: 50%;
      width: 8px;
      height: 8px;
      opacity: 1;
      background: #03fd05;
      position: relative;
      left: -190px;
      top: -820px;
    }
    .sport8 {
      display: inline-block;
      border-radius: 50%;
      width: 11px;
      height: 11px;
      opacity: 0.66;
      background: #03fd05;
      position: relative;
      left: 136px;
      top: -824px;
    }
    .sport9 {
      display: inline-block;
      border-radius: 50%;
      width: 11px;
      height: 11px;
      opacity: 0.57;
      background: #03fd05;
      position: relative;
      left: 170px;
      top: -720px;
    }
    .sport10 {
      display: inline-block;
      border-radius: 50%;
      width: 8px;
      height: 8px;
      opacity: 1;
      background: #03fd05;
      position: relative;
      left: 116px;
      top: -630px;
    }
    .sport11 {
      display: inline-block;
      border-radius: 50%;
      width: 8px;
      height: 8px;
      opacity: 0.57;
      background: #03fd05;
      position: relative;
      left: -410px;
      top: -500px;
    }
    .sport12 {
      display: inline-block;
      border-radius: 50%;
      width: 8px;
      height: 8px;
      opacity: 0.51;
      background: #03fd05;
      position: relative;
      left: -70px;
      top: -500px;
    }
    .sport13 {
      display: inline-block;
      border-radius: 50%;
      width: 8px;
      height: 8px;
      opacity: 0.7;
      background: #03fd05;
      position: relative;
      left: -336px;
      top: -430px;
    }
  }
  .wrap-filter {
    display: flex;
    justify-content: center;
  }
  .filter {
    color: #232323;
    margin: 60px 38px;
    .filter-item {
      position: relative;
      font-size: 80px;
      sup {
        font-size: 24px;
        position: absolute;
        top: 15px;
      }
    }
    .filter-name {
      text-align: center;
      color: #35353D;
      font-size: 24px;
    }
  }

  .panel-btn {
    height: 306px;
    background: #FFFFFF;
    box-shadow: 0 -3px 28px 0 rgba(209,209,209,0.50);
    border-radius: 42px 42px 0px 0px;
    .btn {
      margin-top: 24px;
      width: 100%;
      height: 306px;
      border-radius: 40px 40px 0 0;
      background: #ffffff;
      box-shadow: 0 -3px 28px 0 rgba(209, 209, 209, 0.5);
      display: flex;
      justify-content: space-evenly;
      align-items: center;
    }
  }

  .btn-wrap {
    margin: 50px 24px 0;
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
        border: none;
      }
    }
    .btn-name {
      text-align: center;
      color: #000;
      margin-top: 14px;
      font-size: 24px;
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
    .btn-mode {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/air_cleaner/assets/new-air/btn_ac_mode_heat@2x.png);
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
    .btn-wrap {
      &.up-index {
        .btn-swich{
          background: transparent;
          border: 1px solid #fff;
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
    left: 556px;
    // bottom: 358px;
    bottom: 150px;
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
      top: -150px;
      left: 50px;
    }
    .item2 {
      top: -122px;
      left: -104px;
    }
    .item3 {
      top: 0px;
      left: -180px;
    }
    .item4 {
      top: 122px;
      left: -104px;
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

.modal-w.subpage {
  background: #fff;
}
.pm2 {
  padding: 56px 48px;
  font-size: 28px;
  color: #35353D;
  text-align: justify;
  .sub-title {
    padding: 48px 0;
  }
  .items {
    display: flex;
    justify-content: space-between;
    .item {
      width: 124px;
      height: 96px;
      line-height: 96px;
      border-radius: 10px;

      font-size: 24px;
      color: #fff;
      text-align: center;
      margin: 0 1px;
      &.item1 {
        background: #03FD05;
      }
      &.item2 {
        background: #FFF100;
      }
      &.item3 {
        background: #F99F03;
      }
      &.item4 {
        background: #FE0408;
      }
      &.item5 {
        background: #7E0023;
      }
    }
  }
  .ruler {
    margin-top: 26px;
    list-style: none;
    opacity: 0.3;

    border-radius: 4px;

    border-bottom: 1px solid #35353D;

    display: flex;
    justify-content: space-between;
    li {
      background: #35353D;
      width: 1px;
      height: 12px;
    }
  }
  .name {
    margin-top: 8px;
    list-style: none;
    display: flex;
    justify-content: space-between;
  }
}
</style>
