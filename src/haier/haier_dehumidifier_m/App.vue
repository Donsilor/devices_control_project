<template>
  <div>
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, {'filter': showGearBtns || showModeBtns }, 'page']">
      <topbar
        :bak-color="bakColor"
        :title="device_name" />
      <!-- 数值展示 -->
      <div class="wrap-filter">
        <div class="filter">
          <div class="filter-item">{{ model.env_humidity }}<sup>%</sup></div>
          <div class="filter-name">相对湿度</div>
        </div>
        <div class="filter">
          <div class="filter-item">{{ model.env_temperature }}<sup>℃</sup></div>
          <div class="filter-name">室内温度</div>
        </div>
      </div>
      <div class="main">
        <!-- 离线提示 -->
        <!-- <div
          v-show="isOffline"
          class="tips"
          @click="tips">
          <i class="attention" />
          <div class="tips-txt">设备已离线，查看帮助</div>
        </div> -->

        <!-- 圆圈 -->
        <div class="bg">
          <img
            v-show="model.switch_status == 'on'"
            class="circle"
            src="../../../lib/base/dehumidifier/assets/animation_dh_circle.png">
          <img
            v-show="model.switch_status == 'off'"
            class="circle"
            src="../../../lib/base/dehumidifier/assets/animation_dh_circle_black.png"
            alt="">
        </div>
        <div class="block">
          <div class="num">{{ model.mode_status == 'auto' ? '自动模式' : model.mode_status == 'dehumidification' ? '除湿模式' : '干衣模式' }}</div>
          <div class="txt">{{ model.switch_status == 'on' ? '已启动' : '未启动' }}</div>
        </div>
        <!-- 光点定位 -->
        <div
          v-show="model.switch_status == 'on'"
          class="point">
          <ul>
            <li class="sport sport1"/>
            <li class="sport sport2"/>
            <li class="sport sport3"/>
            <li class="sport sport4"/>
            <li class="sport sport5"/>
            <li class="sport sport6"/>
            <li class="sport sport7"/>
            <li class="sport sport8"/>
            <li class="sport sport9"/>
          </ul>
        </div>
        <!-- 定时展示 -->
        <div
          v-show="timeShow"
          class="timeShow">
          <img
            class="timeShow-img"
            src="../../../lib/base/dehumidifier/assets/icon-time.png">
          {{ model.time | time_H }}
        </div>
      </div>

      <!-- 底部tab -->
      <div class="panel-btn center">
        <div :class="[{'up-index': !isOffline }, 'btn-wrap']" >
          <div
            :class="[{'active': !isClose && !isOffline }, {'btn-loading': btnLoading.switch && model.switch_status=='on' }, {'btn-loading-blue': btnLoading.switch && model.switch_status=='off' }, 'btn btn-swich center']"
            @click="setSwitch('switch')" />
          <div class="btn-name">开关</div>
        </div>

        <div class="btn-wrap">
          <div
            :class="['btn center', 'panel-'+btnModeClass]"
            @click="handeModeClick" />
          <div class="btn-name">模式</div>
        </div>

        <div class="btn-wrap">
          <div
            :class="[btnClass, 'btn center']"
            @click="handeGearClick" />
          <div class="btn-name">档位{{ model.speed=='low'?1:model.speed=='normal'?2:3 }}</div>
        </div>

        <div class="btn-wrap">
          <div
            :class="[{'btn-loading-blue': btnLoading.time }, 'btn-more', 'btn center']"
            @click="showTime" />
          <div class="btn-name">定时</div>
        </div>
      </div>
      <!-- 定时弹框 -->
      <SelectTime
        ref="time"
        @selectedTime="setReserve" />
    </div>
    <!-- 模式选择弹框 -->
    <div
      v-show="showModeBtns"
      class="btns-panel-mode center"
      @touchmove.prevent
      @click="hide">
      <div class="items btns">
        <div
          :class="[{ 'item1': animation }, {'btn-loading': btnLoading.dehumidification }, { 'active': btnModeClass=='btn-dehumidification' }, 'btn btn-dehumidification center']"
          @click.stop="setMode('dehumidification')">
          <div class="name">除湿</div>
        </div>
        <div
          :class="[{ 'item2': animation }, {'btn-loading': btnLoading.dry }, { 'active': btnModeClass=='btn-dry' },'btn btn-dry center']"
          @click.stop="setMode('dry')">
          <div class="name">干衣</div>
        </div>
        <div
          :class="[{ 'item3': animation }, {'btn-loading': btnLoading.auto }, { 'active': btnModeClass=='btn-auto' }, 'btn btn-auto center']"
          @click.stop="setMode('auto')">
          <div class="name">自动</div>
        </div>

        <div
          :class="[ { 'item6': animation }, 'panel-'+btnModeClass,'btn center active-yellow ']"
          @click.stop />
      </div>
    </div>
    <!-- 档位选择弹框 -->
    <div
      v-show="showGearBtns"
      class="btns-panel center"
      @touchmove.prevent
      @click="hide">
      <div class="items btns">
        <div
          :class="[{ 'item1': animation }, {'btn-loading': btnLoading.low }, { 'active': btnClass=='btn-low' }, 'btn btn-low center']"
          @click.stop="setSpeed('low')">
          <div class="name">低挡</div>
        </div>
        <div
          :class="[{ 'item2': animation }, {'btn-loading': btnLoading.normal }, { 'active': btnClass=='btn-normal' },'btn btn-normal center']"
          @click.stop="setSpeed('normal')">
          <div class="name">中档</div>
        </div>
        <div
          :class="[{ 'item3': animation }, {'btn-loading': btnLoading.high }, { 'active': btnClass=='btn-high' }, 'btn btn-high center']"
          @click.stop="setSpeed('high')">
          <div class="name">高档</div>
        </div>

        <div
          :class="[ { 'item6': animation }, btnClass,'btn center active']"
          @click.stop />
      </div>
    </div>
  </div>
</template>

<script>
import SelectTime from './time/time.vue'

export default {
  components: {
    SelectTime,
  },
  data() {
    return {
      device_name: "",
      model: {
        "switch_status": "on",// 开/关机
        "anion_status": "off",// U V +负离子状态
        "childlock_status": "off",// 童锁状态
        "mode_status": "auto",// 工作模式：自动/除湿/干衣
        "speed": "normal",// 风速：低/中/高
        "defrost": "off",// 除霜状态
        "sleep_mode": "off",// 睡眠模式：开/关
        "wind_direction": "off",// 摆角：未使用/45度/90度/自动
        "target_humidity": "50",// 目标湿度%
        "time_mode": "off",// 定时模式：开/关/无定时
        "time": "0",// 设定定时:0是无定时(秒)
        "env_humidity": "30",// 室内湿度%
        "env_temperature": "24",// 当前环境温度：只读, 单位为0.1摄氏度, 188就是18.8摄氏度
        "error_code": "normal",// 正常/水满报警/温湿度传感器故障/湿度传感器故障/温度传感器故障/自动关机保护/盘管传感器故障
        "alarm_cancel": "on",// 告警解除
        "water_full": "off",// 水满报警：告警触发/告警解除
        "th_fault": "off",// 温湿度传感器故障：告警触发/告警解除
        "temperature_fault": "off",// 湿度传感器故障：告警触发/告警解除
        "humidity_fault": "off",// 温度传感器故障：告警触发/告警解除
        "power_off": "off",// 自动关机保护：告警触发/告警解除
        "coil_fault": "off",// 盘管传感器故障：告警触发/告警解除
        "connectivity": "online"
      },
      showGearBtns: false,
      showModeBtns: false,
      animation: false,
      btnLoading: {
        switch: false,
        auto: false,
        dry: false,
        dehumidification: false,
        low: false,
        normal: false,
        high: false,
        time: false,
      },
      timeShow: false,
    }
  },
  computed: {
    isClose() {
      return this.model.switch_status == 'on' ? false : true
    },
    bakColor() {
      return this.isClose ? '#20282B' : '#20282B'
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
        case 'normal':
          return 'btn-normal'
          break
        case 'high':
          return 'btn-high'
          break
      }
    },
    btnModeClass() {
      /* eslint-disable no-unreachable */
      switch (this.model.mode_status) {
        case 'auto':
          return 'btn-auto'
          break
        case 'dehumidification':
          return 'btn-dehumidification'
          break
        case 'dry':
          return 'btn-dry'
          break
      }
    }
  },
  watch: {
  },
  created() {
    var str_model = window.localStorage.getItem("dehumidifier_model_attr")
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
    showTime() {
      if(!this.isClose) this.$refs.time.show = true
    },
    setReserve(time) {
      let h = parseInt(time[0].split(':')[0])
      let m = parseInt(time[0].split(':')[1])
      this.controlDevice(
        "time_mode",
        ((h*60)+m)*60==0?'no_time':'on',
        {"time": ((h*60)+m)*60},
        () => {},
        () => {},
        time[1]
      )
    },
    timeAssignment() {
      if(this.model.time_mode == 'on') {
        this.timeShow = true
      } else {
        this.timeShow = false
      }
    },
    setSwitch(val) {
      let switchStatus = ''
      if (this.model.switch_status == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.controlDevice(
        "switch",
        switchStatus,
        {"time_mode": "off"},
        () => {},
        () => {},
        val
      )
    },
    handeModeClick() {
      this.showModeBtns = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.animation = true
        }, 0)
      })
    },
    handeGearClick() {
      this.showGearBtns = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.animation = true
        }, 0)
      })
    },
    hide() {
      this.showGearBtns = false
      this.showModeBtns = false
      this.animation = false
    },
    showTip(text) {
      clearTimeout(this.tipTime)
      this.tip = text
      this.tipTime = setTimeout(() => {
        this.tip = ""
      }, 2000)
    },
    controlDevice(attr, val, param, success, error, btnAttr) {
      this.showBtnLoading(btnAttr)
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
            this.hideBtnLoading(btnAttr)
            success && success()
          },
          () => {
            this.hideBtnLoading(btnAttr)
            error && error()
            this.showTip("操作失败")
          }
        )
      })
    },
    showBtnLoading(attr) {
      this.btnLoading[attr] = true
    },
    hideBtnLoading(attr) {
      this.btnLoading[attr] = false
    },
    setMode(val) {
      this.controlDevice(
        "mode_status",
        val,
        {},
        () => {
          this.hide()
          this.model.mode_status = val
        },
        () => {},
        val
      )
    },
    setSpeed(val) {
      this.controlDevice(
        "speed",
        val,
        {},
        () => {
          this.hide()
          this.model.speed = val
        },
        () => {},
        val
      )
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
      window.localStorage.setItem('dehumidifier_model_attr', JSON.stringify(data.attribute))
      this.timeAssignment()
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
@lib: '../../../lib/base/dehumidifier/assets';
@lib1: '../../../lib/base/air_condition/assets';
@lib2: '../../../lib/base/air_cleaner/assets/new-air';
.page {
  min-height: 100%;
  overflow-x: hidden;
  position: relative;
  background: #ffffff;

  &.filter {
    filter: blur(12px);
  }
  // 数值展示
  .wrap-filter {
    margin: 0 48px;
    display: flex;
    justify-content: space-around;
    border-bottom: 1px solid rgba(216, 216, 216, 0.5);
    .filter {
      color: #20282B;
      margin: 48px 0 37px;
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
        opacity: 0.5;
        text-align: center;
        color: #20282B;
        font-size: 24px;
      }
    }
  }

  .main {
    position: relative;
    width: 450px;
    height: 450px;
    margin: 173px auto 298px;
    // 离线提示
    .tips {
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
      .tips-txt {
        z-index: 99;
      }
      .attention {
        display: inline-block;
        width: 36px;
        height: 36px;
        background-image: url('@{lib1}/new-air/icon-tips.png');
        background-size: 100% 100%;
        margin-right: 12px;
        z-index: 99;
      }
      &:after {
        z-index: 99;
        position: absolute;
        right: 120px;
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
      &:before {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        background: rgba(0, 0, 0, 0.8);
      }
    }

    // 圆圈样式
    .bg {
      position: absolute;
      top: 0;
      left: 0;
    }
    .circle {
      position: absolute;
      width: 636px;
      top: -94px;
      left: -92px;;
    }
    .block {
      padding: 184px 0 362px;
      color: #20282B;
      text-align: center;
      .num {
        font-size: 48px;
      }
      .txt {
        padding-top: 15px;
        opacity: 0.5;
        font-size: 24px;
        font-weight: 900;
        line-height: 40px;
      }
    }
  }
  // 光点定位
  .point {
    .sport {
      border-radius: 50%;
      position: absolute;
      display: inline-block;
      background-image: url('@{lib}/animation_dh_bubble.png');
    }
    .sport1 {
      top: -50px;
      left: 10px;
      width: 88px;
      height: 88px;
      background-size: 88px 88px;
    }
    .sport2 {
      top: -50px;
      left: 145px;
      width: 48px;
      height: 48px;
      background-size: 48px 48px;
    }
    .sport3 {
      top: 40px;
      left: 395px;
      width: 68px;
      height: 68px;
      background-size: 68px 68px;
    }
    .sport4 {
      top: 240px;
      left: -45px;
      width: 28px;
      height: 28px;
      background-size: 28px 28px;
    }
    .sport5 {
      top: 290px;
      left: 445px;
      width: 28px;
      height: 28px;
      background-size: 28px 28px;
    }
    .sport6 {
      top: 330px;
      left: -25px;
      width: 28px;
      height: 28px;
      background-size: 28px 28px;
    }
    .sport7 {
      top: 410px;
      left: 5px;
      width: 48px;
      height: 48px;
      background-size: 48px 48px;
    }
    .sport8 {
      top: 420px;
      left: 285px;
      width: 48px;
      height: 48px;
      background-size: 48px 48px;
    }
    .sport9 {
      top: 390px;
      left: 365px;
      width: 68px;
      height: 68px;
      background-size: 68px 68px;
    }
  }
  // 定时展示
  .timeShow {
    text-align: center;
    position: relative;
    font-size: 24px;
    color: #FFC600;
    .timeShow-img {
      position: relative;
      top: 2px;
      width: 28px;
      height: 28px;
      margin-right: 12px;
    }
  }
  // 底部tab
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
      border: 1px solid rgba(32, 40, 43, 0.5);
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
      color: rgba(32, 40, 43, 0.5);
      margin-top: 14px;
      font-size: 24px;
    }
    .btn-swich {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib2}/swich-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib2}/swich-black.png');
        }
      }
    }
    .panel-btn-dehumidification {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/btn_dh_mode_dry_hl.png');
        background-size: 100% 100%;
      }
    }
    .panel-btn-dry {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/btn_dh_mode_drycloth_hl.png');
        background-size: 100% 100%;
      }
    }
    .panel-btn-auto {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/auto-black.png');
        background-size: 100% 100%;
      }
    }
    .btn-low {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib2}/speed1.png');
        background-size: 100% 100%;
      }
    }
    .btn-normal {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib2}/speed2.png');
        background-size: 100% 100%;
      }
    }
    .btn-high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib2}/speed3.png');
        background-size: 100% 100%;
      }
    }
    .btn-more {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/time-black.png');
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
      background: rgba(255, 255, 255, 0.9);
    }
    .btn-wrap {
      &.up-index {
        .btn-swich{
          background: transparent;
          border: 1px solid rgba(32, 40, 43, 0.5);

          &::before {
            content: "";
            display: block;
            width: 44px;
            height: 44px;
            background-image: url('@{lib2}/swich-black.png');
            background-size: 100% 100%;
          }
        }
        .btn-name {
          color: rgba(32, 40, 43, 0.5)
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
          background-image: url('@{lib2}/swich-black.png');
          background-size: 100% 100%;
        }
        &.active {
          &::before {
            background-image: url('@{lib2}/swich-black.png');
          }
        }
      }
    }
  }
}
// 档位选择弹框
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
    left: 394px;
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
      border: 1px solid rgba(255, 255, 255, 0.5);
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
        .name {
          color: #20282B;
        }
      }
    }
    .btn-swich {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib2}/swich-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib2}/swich-black.png');
        }
      }
    }

    .btn-low {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib2}/speed1-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib2}/speed1.png');
        }
      }
    }
    .btn-normal {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib2}/speed2-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib2}/speed2.png');
        }
      }
    }
    .btn-high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib2}/speed3-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib2}/speed3.png');
        }
      }
    }
    .btn-very_high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib2}/speed4-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib2}/speed4.png');
        }
      }
    }
    .btn-super_high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib2}/speed5-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib2}/speed5.png');
        }
      }
    }
  }
}
// 模式选择弹框
.btns-panel-mode {
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
    left: 230px;
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
      top: -180px;
    }
    .item2 {
      top: -134px;
      left: 134px;
    }
    .item3 {
      left: 180px;
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
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 50%;

      display: flex;
      flex-direction: column;

      .name {
        margin-top: 8px;
        font-size: 20px;
        color: #fff;
      }
      &.active {
        border-color: rgba(255, 198, 0, 0.5);
        .name {
          color: rgba(255, 198, 0, 1);
        }
      }
      &.active-yellow {
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
        background-image: url('@{lib2}/swich-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib2}/swich-black.png');
        }
      }
    }

    .btn-dehumidification {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/btn_dh_mode_dry.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib}/btn_dh_mode_dry_chose.png');
        }
      }
    }
    .btn-dry {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/btn_dh_mode_drycloth.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib}/btn_dh_mode_drycloth_chose.png');
        }
      }
    }
    .btn-auto {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/auto-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib}/auto-yellow.png');
        }
      }
    }
    .panel-btn-dehumidification {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/btn_dh_mode_dry_hl.png');
        background-size: 100% 100%;
      }
    }
    .panel-btn-dry {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/btn_dh_mode_drycloth_hl.png');
        background-size: 100% 100%;
      }
    }
    .panel-btn-auto {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/auto-black.png');
        background-size: 100% 100%;
      }
    }
  }
}
.btn-loading {
  position: relative;
  &:after{
    width: 90%;
    height: 90%;
    content: '';
    background-image: url('@{lib1}/buffering_mode_white.gif');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.btn-loading-blue {
  position: relative;
  &:after{
    width: 90%;
    height: 90%;
    content: '';
    background-image: url('@{lib1}/buffering_mode_blue.gif');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
