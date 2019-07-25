<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']">
      <topbar
        :title="device_name"
        bak-color="#000"/>
      <!-- <div class="c-status">时段预约：6:00-9:00</div> -->
      <div
        class="main center">
        <div class="wrap-circle">
          <div class="circle-gray" />
          <div 
            :style="{ transform: 'rotate(' + cRotate + 'deg)'}" 
            class="circle" />
          <div class="cover">
            <span class="point left" />
            <span class="point right" />
            <span class="txt left">35<sup>°C</sup></span>
            <span class="txt right">75<sup>°C</sup></span>
          </div>
        </div>

        <div class="bg center">
          <div class="bg2 center">
            <div class="num">加热中</div>
            <div class="time">{{ model.temperature }}<sup>°C</sup></div>
            <div class="cmode">当前温度</div>
          </div>
          <div 
            :style="{ transform: 'rotate(' + arrowRotate + 'deg)'}"
            class="bg2 pos-ab" ><i class="circle-arrow" /></div>
        </div>
      </div>

      <div class="control center">
        <div 
          class="reduce" 
          @click="setTemperature(-1)"/>
        <div class="main-control"><i class="icon" /> 预设温度 {{ model.set_temperature }}°C</div>
        <div 
          class="add" 
          @click="setTemperature(1)"/>
      </div>

      <!-- 按钮 -->
      <div class="panel-btn center">
        <!-- <div 
          class="more" 
          @click="handleMore">
          <div :class="[isOpen ? 'up': 'down', 'arrow']">></div>
          <div>{{ isOpen ? '收起' : '查看更多' }}</div>
        </div> -->

        <div :class="[{'up-index': !isOffline }, 'btn-wrap']" >
          <div
            :class="[{ 'active': !isClose }, 'btn-swich btn center']"
            @click="setSwitch" />
          <div class="btn-name">关机</div>
        </div>

        
        <div 
          class="btn-wrap" 
          @click="setMode('dy_expansion')">
          <div
            :class="[{ 'active': model.mode == 'dy_expansion' }, 'btn btn-heat center']"/>
          <div class="btn-name">速热增容</div>
        </div>
        <div 
          class="btn-wrap" 
          @click="setMode('heat_keep')">
          <div
            :class="[ { 'active': model.mode == 'heat_keep' }, 'btn btn-znsw center']"/>
          <div class="btn-name">智能水温</div>
        </div>
        <div 
          class="btn-wrap" 
          @click="setMode('sterilization')">
          <div
            :class="[ { 'active': model.mode == 'sterilization' }, 'btn btn-znyj center']"/>
          <div class="btn-name">智能抑菌 </div>
        </div>

        <!-- 
        <div class="btn-wrap">
          <div
            class="btn-time btn center"/>
          <div class="btn-name">时段预约</div>
        </div>

        <div class="btn-wrap">
          <div
            class="btn btn-heat center"/>
          <div class="btn-name">速热增容</div>
        </div>
        <div class="btn-wrap">
          <div
            class="btn btn-znsw center"/>
          <div class="btn-name">智能水温</div>
        </div>

        <div 
          v-show="isOpen" 
          class="btn-wrap">
          <div
            class="btn btn-bpsr center"/>
          <div class="btn-name">变频速热</div>
        </div>
        <div 
          v-show="isOpen" 
          class="btn-wrap">
          <div
            class="btn btn-znyj center"/>
          <div class="btn-name">智能抑菌 </div>
        </div> -->
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false,
      device_name: "",
      model: {
        "reserve": 880,
        "mode": "max_volume",
        "set_temperature": 50,
        "switch": "on",
        "fault": "normal",
        "heat_status": "heat",
        "temperature": 37,
        "deviceModel": "LPB100",
        "manufactureId": "Whirlpool",
        "deviceCategory": "water_heater.sn",
        "deviceSubCategory": 0,
        "connectivity": "online"
      }
    }
  },
  computed: {
    isRun() {
      return this.model.status == 'run'
    },
    isClose() {
      return this.model.switch == 'on' ? false : true
    },
    isOffline() {
      return this.model.connectivity === 'online' ? false : true
    },
    cRotate() {
      return (+this.model.temperature - 35) * 4.5 - 45
    },
    arrowRotate() {
      return (+this.model.temperature - 35) * 4.5
    }
  },
  watch: {
  },
  created() {
    HdSmart.ready(() => {
      if (window.device_name) {
        this.device_name = window.device_name
      }
      if (window.device_uuid) {
        var str_model = window.localStorage.getItem(window.device_uuid)
        if (str_model) {
          try {
            // str_model 有可能不是合法的JSON字符串，便会产生异常
            this.model = JSON.parse(str_model)
          } catch (e) {
            this.model = {}
          }
        }
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
    setMode(val) {
      if(this.isClose) return
      this.controlDevice('mode', val)
    },
    setSwitch() {
      let switchStatus = ''
      if (this.model.switch == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.controlDevice("switch", switchStatus)
    },
    setTemperature(step) {
      let val = +this.model.set_temperature + step
      if(val > 75) {
        val = 75
        HdSmart.UI.toast('温度最高为75℃')
      } else if(val < 35) {
        val = 35
        HdSmart.UI.toast('温度最低为35℃')
      }
      this.controlDevice('set_temperature', val)
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
      this.model = data.attribute
      // 将model 保存在 localStorage
      if (window.device_uuid) {
        window.localStorage.setItem(window.device_uuid, JSON.stringify(data.attribute))
      }
    },
    controlDevice(attr, value) {
      HdSmart.Device.control(
        {
          nodeid: `water_heater.main.${attr}`,
          params: {
            attribute: {
              [attr]: value
            }
          }
        },
        () => { },
        () => { }
      )
    },
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
    margin-top: 30px;
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
      &.pos-ab{
        background: transparent;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    .circle-arrow{
      
      display: block;
      width: 60px;
      height: 60px;
      background-image: url(../../lib/base/electric_water_heater/assets/new/arrow.png);
      background-size: 100% 100%;

      position: absolute;
      top: 50%;
      left: 0;
      transform: translate(-0, -50%);
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
      .circle{
        box-sizing: border-box;
        border: 4px solid;
        border-color: transparent transparent #FF210E #FF210E;
        border-radius: 50%;
        width: 434px;
        height: 434px;

        transform: rotate(90deg);
      }
      .circle-gray{
        position: absolute;
        top: 0;
        border: 4px solid #D8D8D8;
        border-radius: 50%;
        box-sizing: border-box;
        width: 432px;
        height: 432px;
      }
      .cover{
        position: absolute;
        top: 50%;
        background: #F4F7FE;
        width: 100%;
        height: 220px;
        .point{
          display: block;
          background: #FF210E;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          &.left{
            position: absolute;
            top: -8px;
            left: -5px;
            background: #FF210E;
          }
          &.right{
            position: absolute;
            top: -8px;
            right: -5px;
            background: #D8D8D8;
          }
        }
        .txt{
          font-size: 24px;
          color: #000;
          &.left{
            position: absolute;
            top: 28px;
            left: -28px;
          }
          &.right{
            position: absolute;
            top: 28px;
            right: -10px;
          }
        }
        sup{
          font-size: 10px;
          position: absolute;
          top: -2px;
        }
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
      position: relative;
      background: #fff;
      border: 1px solid #F1F1F1;
      width: 72px;
      height: 72px;
      line-height: 72px;

      border-radius: 50%;
      text-align: center;
      margin: 0 32px;
    }
    .reduce{
      &::before{
        font-size: 90px;
        content: '-';
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .add{
      &::before{
        font-size: 70px;
        content: '+';
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
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
    padding: 38px 0;
    z-index: 9999;

    background: #FFFFFF;
    box-shadow: 0 -3px 28px 0 rgba(209,209,209,0.50);
    border-radius: 42px 42px 0px 0px;

    flex-wrap: wrap;
    justify-content: center;

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
    .btn-heat{
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/electric_water_heater/assets/new/heat.png);
        background-size: 100% 100%;
      }
    }
    .btn-znsw{
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/electric_water_heater/assets/new/znsw.png);
        background-size: 100% 100%;
      }
    }
    .btn-bpsr{
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/electric_water_heater/assets/new/bpsr.png);
        background-size: 100% 100%;
      }
    }
    .btn-znyj{
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/electric_water_heater/assets/new/znyj.png);
        background-size: 100% 100%;
      }
    }

    .btn-swich {
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
      .cover{
        background: #fff;
      }
    }
    .panel-btn{
      background: #efefef;
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
