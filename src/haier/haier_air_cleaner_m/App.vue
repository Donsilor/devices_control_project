<template>
  <div>
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, {'filter': showModeBtns }, 'page']">
      <topbar
        :title="device_name"
        :bak-color="bakColor"/>
      <div
        class="main"
        @click="toSubPage">
        <div class="bg">
          <img
            class="circle"
            src="../../../lib/base/air_cleaner/assets/new-air/yuanquan@2x.png">
          <img
            v-if="current==0"
            class="pointer-excellent"
            src="../../../lib/base/air_cleaner/assets/new-air/jiejing@2x.png"
          >
          <img
            v-if="current==1"
            class="pointer-good"
            src="../../../lib/base/air_cleaner/assets/new-air/lianghao@2x.png"
          >
          <img
            v-if="current==2"
            class="pointer-light"
            src="../../../lib/base/air_cleaner/assets/new-air/qingdu@2x.png"
          >
          <img
            v-if="current==3"
            class="pointer-moderate"
            src="../../../lib/base/air_cleaner/assets/new-air/zhongdu@2x.png"
          >
          <img
            v-if="current==4"
            class="pointer-severe"
            src="../../../lib/base/air_cleaner/assets/new-air/zhongduz@2x.png"
          >
        </div>
        <div class="block">
          <div class="num">{{ model.air_filter_result.PM25[0] }}<sup class="nuit">μg/m³</sup></div>
          <div class="txt">室内空气 优</div>
        </div>
      </div>
      <div class="point">
        <span class="sport sport1" />
        <span class="sport sport2" />
        <span class="sport sport3" />
        <span class="sport sport4" />
        <span class="sport sport5" />
        <span class="sport sport6" />
        <span class="sport sport7" />
        <span class="sport sport8" />
        <span class="sport sport9" />
        <span class="sport sport10" />
        <span class="sport sport11" />
        <span class="sport sport12" />
        <span class="sport sport13" />
        <span class="sport sport1" />
      </div>

      <div class="wrap-filter">
        <!-- <div class="filter">
          <div class="filter-item">{{ model.filter_time_remaining }}<sup>%</sup></div>
          <div class="filter-name">剩余滤芯</div>
        </div> -->
        <div class="filter">
          <div class="filter-item">{{ model.filter_time_remaining }}<sup>小时</sup></div>
          <div class="filter-name">滤芯剩余寿命</div>
        </div>
      </div>

      <!-- 按钮 -->
      <div class="panel-btn center">
        <div :class="[{'up-index': !isOffline }, 'btn-wrap']" >
          <div
            :class="[{'active': !isClose && !isOffline }, 'btn btn-swich center']"
            @click="setSwitch" />
          <div class="btn-name">开关</div>
        </div>

        <div class="btn-wrap">
          <div
            :class="[{'active': model.speed == 'sleep' },'btn btn-mode center']"
            @click="setSleep()" />
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
        <!-- <div
          :class="[{ 'item5': animation }, {' btn-loading': btnLoading.auto },'btn btn-super_high center']"
          @click.stop="setSpeed('super_high')">
          <div class="name">极速挡</div>
        </div> -->
        <div
          :class="[ { 'item6': animation }, btnClass,'btn center active']"
          @click.stop />
      </div>
    </div>

    <!-- PM2.5简介 -->
    <sub-page
      v-model="showSubPage"
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
        "filter_time_remaining": "--",
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
      showSubPage: false
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
          return 'btn-low'
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
          return '低挡'
          break
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
@lib: '../../../lib/base/air_cleaner/assets/new-air';
.page {
  min-height: 100%;
  overflow-x: hidden;
  position: relative;
  background: rgba(230, 255, 243, 1);

  &.filter {
    filter: blur(12px);
  }
  .main {
    position: relative;

    width: 540px;
    height: 540px;
    margin: 90px auto 0;
    .bg{
      position: absolute;
      top: 0;
      left: 0;
    }
    .circle {
      width: 100%;
      height: 100%;
      // transform: rotateY(180deg);
    }
    .pointer-excellent {
      position: absolute;
      left: 155px;
      top: 6px;

      width: 136px;
      height: 26px;
      transform: rotate(348deg);
    }
    .pointer-good {
      position: absolute;
      left: -54px;
      top: 230px;
      width: 136px;
      height: 26px;
      transform: rotate(276deg);
    }
    .pointer-light {
      position: absolute;
      left: 70px;
      top: 476px;
      width: 136px;
      height: 26px;
      transform: rotate(211deg);
    }
    .pointer-moderate {
      position: absolute;
      left: 408px;
      top: 410px;
      width: 136px;
      height: 26px;
      transform: rotate(127deg);
    }
    .pointer-severe {
      position: absolute;
      left: 456px;
      top: 236px;
      width: 136px;
      height: 26px;
      transform: rotate(85deg);
    }
    .block {
      padding-top: 115px;
      color: #03fd05;
      text-align: center;
      .num {
        font-size: 160px;
      }
      .txt {
        font-size: 24px;
        font-weight: 900;
      }
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
  .point{
    .sport {
      display: inline-block;
      border-radius: 50%;
      width: 13px;
      height: 13px;
      opacity: 0.84;
      background: #03fd05;
      position: absolute;
    }
    .sport1 {
      top: 192px;
      left: 460px;

    }
    .sport2 {
      top: 208px;
      left: 472px;
    }
    .sport3 {
      top: 230px;
      left: 384px;
    }
    .sport4 {
      top: 265px;
      left: 368px;
    }
    .sport5 {
      top: 376px;
      left: 70px;
    }
    .sport6 {
      top: 374px;
      left: 276px;
    }
    .sport7 {
      top: 390px;
      left: 616px;
    }
    .sport8 {
      top: 400px;
      left: 238px;
    }
    .sport9 {
      top: 482px;
      left: 670px;
    }
    .sport10 {
      top: 468px;
      left: 646px;
    }
    .sport11 {
      top: 708px;
      left: 142px;
    }
    .sport12 {
      top: 690px;
      left: 502px;
    }
    .sport13 {
      top: 774px;
      left: 300px;
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
      text-align: center;
      sup {
        white-space: nowrap;
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
        border-color: #FFBF00;
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
        background-image: url('@{lib}/swich-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib}/swich-black.png');
        }
      }
    }
    .btn-mode {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/btn_ac_mode_heat@2x.png');
        background-size: 100% 100%;
      }
    }
    .btn-low {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/speed1.png');
        background-size: 100% 100%;
      }
    }
    .btn-middle {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/speed2.png');
        background-size: 100% 100%;
      }
    }
    .btn-high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/speed3.png');
        background-size: 100% 100%;
      }
    }
    .btn-very_high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/speed4.png');
        background-size: 100% 100%;
      }
    }
    .btn-super_high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/speed5.png');
        background-size: 100% 100%;
      }
    }
    .btn-more {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/more.png');
        background-size: 100% 100%;
      }
    }
  }
  &.close,   &.offline {
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

          &::before {
            content: "";
            display: block;
            width: 44px;
            height: 44px;
            background-image: url('@{lib}/swich-white.png');
            background-size: 100% 100%;
          }
          &.active {
            &::before {
              background-image: url('@{lib}/swich-white.png');
            }
          }
        }
      }
    }
  }
  &.offline{
    .btn-wrap {
      .btn-swich{
        background: transparent;
        border: 1px solid #000;

        &::before {
          content: "";
          display: block;
          width: 44px;
          height: 44px;
          background-image: url('@{lib}/swich-black.png');
          background-size: 100% 100%;
        }
        &.active {
          &::before {
            background-image: url('@{lib}/swich-black.png');
          }
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
        background-image: url('@{lib}/swich-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib}/swich-black.png');
        }
      }
    }

    .btn-low {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/speed1-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib}/speed1.png');
        }
      }
    }
    .btn-middle {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/speed2-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib}/speed2.png');
        }
      }
    }
    .btn-high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/speed3-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib}/speed3.png');
        }
      }
    }
    .btn-very_high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/speed4-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib}/speed4.png');
        }
      }
    }
    .btn-super_high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/speed5-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib}/speed5.png');
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
