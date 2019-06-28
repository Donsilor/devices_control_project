<template>
  <div>
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, {'filter': showModeBtns }, 'page']">
      <topbar 
        :title="device_name"
        :bak-color="bakColor"/>
      <div class="status">{{ model.status | statusType }}</div>
      <div class="wrap-robot">
        <img 
          class="robot"
          src="../../lib/base/sweeping_robot/assets/saodijiqiren@2x.png">
      </div>


      <!-- <div class="point">
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
      </div> -->

      <div 
        v-show="model.status == 'charging'" 
        class="wrap-filter">
        <!-- <div class="filter">
          <div class="filter-item">{{ model.filter_time_remaining }}<sup>%</sup></div>
          <div class="filter-name">剩余滤芯</div>
        </div> -->
        <div class="filter">
          <div class="filter-item">{{ model.battery_percentage }}<sup>%</sup></div>
          <div class="filter-name">目前电量</div>
        </div>
      </div>

      <div class="wrap-filter detail">
        <!-- <div class="filter">
          <div class="filter-item">{{ model.filter_time_remaining }}<sup>%</sup></div>
          <div class="filter-name">剩余滤芯</div>
        </div> -->
        <div class="filter">
          <div class="filter-item">{{ model.battery_percentage }}<sup>m²</sup></div>
          <div class="filter-name">清扫面积</div>
        </div>
        <div class="filter">
          <div class="filter-item">{{ model.battery_percentage }}<sup>%</sup></div>
          <div class="filter-name">剩余电量</div>
        </div>
        <div class="filter">
          <div class="filter-item">{{ model.working_time }}<sup>，</sup></div>
          <div class="filter-name">已扫时间</div>
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
        <div class="btn-wrap btns">
          <div 
            :class="[model.status == 'charging' ? 'charging' : '', 'btn btn-charging center circleProgress_wrapper']"
            @click="setCharging">
            <div class="wrapper right">
              <div class="circleProgress rightcircle" />
            </div>
            <div class="wrapper left">
              <div class="circleProgress leftcircle" />
            </div>
          </div>
          <div class="btn-name">回充</div>
        </div>

        <div class="btn-wrap">
          <div
            :class="[{'active': model.speed == 'sleep' },'btn btn-clean center']"
            @click="setSleep()" />
          <div class="btn-name">清扫</div>
        </div>

        <div class="btn-wrap">
          <div
            :class="[btnClass, 'btn center btn-plan']"
            @click="handeModeClick" />
          <div class="btn-name">规划</div>
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
      model:  {
        'switch_status': 'on',
        'mode': 'mop',
        'battery_percentage': '100',
        'status': 'working',
        'sweep_direction': 'right',
        'fan_status': 'normall',

        'command': 'stop',
        'frequency': '2',

        'water_level': 'low',
        'remaining': '10',
        'order_time': '01:20',

        'notclean': [],
        'working_time': '60',
        'begin_point': '0',
        'cleaning': '0',
        'cleaned': '0',
        'unclean': '0',

        'alarm_cancel': 'on',
        'wheel_overload': 'on',
        'cliff': 'on',
        'bump': 'on',
        'brush': 'on',
        'dust_box': 'on',
        'battery_overheat': 'on',
        'fan_err': 'on',
        

        'connectivity': 'online'
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
      return 4
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
    setCharging() {

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
.page {
  min-height: 100%;
  overflow-x: hidden;
  position: relative;
  background: #fff;

  &.filter {
    filter: blur(12px);
  }
  .status{
    margin-top: 30px;
    font-size: 24px;
    color: #35353D;
    text-align: center;
  }
  .wrap-robot{
    text-align: center;
    padding-top: 120px;
    .robot{
      width: 446px;
      margin: auto;
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
    margin: 80px 0 109px 0;
    &.detail{
      margin: 120px 0 48px 0;
    }
  }
  .filter {
    color: #35353D;
    margin: 0 38px;
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
      border: 1px solid #B9B9B9;
      border-radius: 50%;

      display: flex;
      flex-direction: column;
      opacity: .5;
      &.active {
        opacity: 1;
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
        background-image: url(../../lib/base/air_cleaner/assets/new-air/swich-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/air_cleaner/assets/new-air/swich-black.png);
        }
      }
    }
    .btn-charging {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/sweeping_robot/assets/huichong1@2x.png);
        background-size: 100% 100%;
      }
    }
    .btn-clean{
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/sweeping_robot/assets/qingsao2@2x.png);
        background-size: 100% 100%;
      }
    }
    .btn-plan{
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/sweeping_robot/assets/huihua@2x.png);
        background-size: 100% 100%;
      }
    }

  }

  .circleProgress_wrapper {
    width: 120px;
    height: 120px;
    margin: 50px auto;
    position: relative;
    .wrapper {
      width: 60px;
      height: 120px;
      position: absolute;
      top: 0;
      overflow: hidden;
    }

    .right {
      right: -1px;
    }

    .left {
      left: -1px;
    }

    .circleProgress {
      box-sizing: border-box;
      width: 120px;
      height: 120px;
      border: 1px solid transparent;
      border-radius: 50%;
      position: absolute;
      top: -1px;
    }
    &.charging {
      .rightcircle {
        border-top: 1px solid yellow;
        border-right: 1px solid yellow;
        right: 0;
        animation: circleRight 5s linear infinite;
      }
      .leftcircle {
        border-bottom: 1px solid yellow;
        border-left: 1px solid yellow;
        left: 0;
        animation: circleLeft 5s linear infinite;
      }
    }
    @keyframes circleRight {
      0% {
        -webkit-transform: rotate(225deg);
      }

      50%,
      100% {
        -webkit-transform: rotate(405deg);
      }
    }

    @keyframes circleLeft {
      0%,
      50% {
        -webkit-transform: rotate(225deg);
      }

      100% {
        -webkit-transform: rotate(405deg);
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
            background-image: url(../../lib/base/air_cleaner/assets/new-air/swich-white.png);
            background-size: 100% 100%;
          }
          &.active {
            &::before {
              background-image: url(../../lib/base/air_cleaner/assets/new-air/swich-white.png);
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
          background-image: url(../../lib/base/air_cleaner/assets/new-air/swich-black.png);
          background-size: 100% 100%;
        }
        &.active {
          &::before {
            background-image: url(../../lib/base/air_cleaner/assets/new-air/swich-black.png);
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
