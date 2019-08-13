<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']">
      <topbar 
        :title="device.device_name"
        bak-color="#000" />
      <!-- <div class="c-status">时段预约：6:00-9:00</div> -->
      <div class="main center">
        <div class="wrap-circle">
          <div class="bg">
            <div class="tm">28<sup>°C</sup></div>
            <i class="c-mode"/>
          </div>
          <circle-progress
            v-if="isShow"
            id="myId"
            ref="$circle"
            key="animation-model"
            :is-animation="true"
            :is-round="true"
            :width="width"
            :radius="radius"
            :progress="progress"
            :bar-color="barColor"
            :duration="duration"
            :delay="delay"
            :background-color="backgroundColor"
            class="progress"
          />
        </div>
        <div class="control-tm center">
          <button 
            class="control reduce" 
            @click="setTemperature('tempContainer', -10, [20, 80])"/>
          <button 
            class="control add" 
            @click="setTemperature('tempContainer', 10, [20, 80])"/>
        </div>
      </div>


      <div 
        class="status">
        <i class="icon-status" />
        正在{{ deviceAttrs.mode | modeType }}
        {{ deviceAttrs.wind_up_down === 'on' ? '上下扫风':'' }}
        {{ deviceAttrs.wind_left_right === 'on' ? '左右扫风': '' }}
      </div>
      <!-- 按钮 -->
      <div class="panel-btn center">
        <div 
          class="more" 
          @click="handleMore">
          <span :class="[isOpen ? 'up': 'down', 'arrow']">></span>
          <div>{{ isOpen ? '收起' : '查看更多' }}</div>
        </div>

        <div :class="[{'up-index': !isOffline }, 'btn-wrap']">
          <div 
            :class="[{ 'active': !isClose }, 'btn-swich btn center']"
            @click="setSwitch" />
          <div class="btn-name">开关</div>
        </div>

        <div 
          class="btn-wrap"
          @click="setMode('dy_expansion')">
          <div :class="[{ 'active': deviceAttrs.mode == 'dy_expansion' }, 'btn btn-cold center']" />
          <div class="btn-name">制冷</div>
        </div>
        <div 
          class="btn-wrap"
          @click="setMode('heat_keep')">
          <div :class="[ { 'active': deviceAttrs.mode == 'heat_keep' }, 'btn btn-heat center']" />
          <div class="btn-name">制热</div>
        </div>
        <div 
          class="btn-wrap"
          @click="setMode('sterilization')">
          <div :class="[ { 'active': deviceAttrs.mode == 'sterilization' }, 'btn btn-wind center']" />
          <div class="btn-name">模式 </div>
        </div>
        <div 
          v-show="isOpen" 
          class="btn-wrap">
          <div
            class="btn btn-speed5 center"/>
          <div class="btn-name">风速</div>
        </div>
        <div 
          v-show="isOpen"
          class="btn-wrap"
          @click="showSwing">
          <div
            class="btn btn-up center"/>
          <div class="btn-name">摆风 </div>
        </div>
      </div>

      <model-swing 
        ref="swing"
        :wind_up_down="deviceAttrs.wind_up_down"
        :wind_left_right="deviceAttrs.wind_left_right"
        @setWind="setWind" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import CircleProgress from './components/circle-progress'
import model from './components/model'

export default {
  components: {
    CircleProgress,
    'model-swing': model,
  },
  data() {
    return {
      isOpen: false,

      isShow: true,
      width: 220,
      radius: 8,
      progress: 30, // 0~70
      duration: 0,
      delay: 0,
      barColor: '#0FDC66',
      backgroundColor: '#ececec',
    }
  },
  computed: {
    ...mapGetters(['isClose', 'isOffline']),
    ...mapState(['device', 'deviceAttrs']),
    // barColor() {
    //   if(this.isClose || this.isOffline) return '#D8D8D8'
    //   /* eslint-disable no-unreachable */
    //   switch (this.deviceAttrs.mode) {
    //     case 'cold':
    //       return ' #00D5FF;'
    //       break
    //     case 'heat':
    //       return '#FF5F00'
    //       break

    //     default:
    //       return '#0FDC66'
    //   }
    // },
  },
  created() {
  },
  methods: {
    ...mapActions(['doControlDevice']),
    handleMore() {
      this.isOpen = !this.isOpen
    },
    setMode(val) {
      if (val == this.deviceAttrs.mode) {
        val = 'free'
      }
      if (this.isClose) return
      this.controlDevice('mode', val)
    },
    setSwitch() {
      let switchStatus = ''
      if (this.deviceAttrs.switch == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.controlDevice("switch", switchStatus)
        .then(() => {
          console.log('setSwitch success')
        })
    },
    setTemperature(step) {
      let val = +this.deviceAttrs.set_temperature + step
      if (val > 75) {
        val = 75
        return HdSmart.UI.toast('温度最高为75℃')
      } else if (val < 35) {
        val = 35
        return HdSmart.UI.toast('温度最低为35℃')
      }
      this.controlDevice('set_temperature', val)
        .then(() => {
          this.progress = 60
          this.reset()
        })
    },
    controlDevice(attr, value) {
      return this.doControlDevice({
        nodeid: `water_heater.main.${attr}`,
        params: {
          attribute: {
            [attr]: value
          }
        }
      })
    },
    // 重置动画
    reset() {
      this.isShow = false
      this.$nextTick(() => {
        this.isShow = true
      })
    },
    showSwing() {
      this.$refs.swing.show = true
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
  }
}
</script>
<style lang="less" scoped>
@imgPath: 'base/air_condition/assets/new-air';

.body {
  min-height: 100%;
}
.page {
  height: 100vh;
  min-height: 550px;
  overflow-x: hidden;
  position: relative;
  background: #f4f7fe;

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
      background:#efefef;
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
    margin-top: 5vh;
    position: relative;
    &.center {
      flex-direction: column;
    }
    .wrap-circle{
      position: relative;
      .bg{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        background: #FFFFFF;
        box-shadow: inset 0 0 16px 0 rgba(0,0,0,0.10);
        border-radius: 50%;
        width: 84%;
        height: 84%;
        .tm{
          margin-top: 60PX;
          position: relative;
          font-size: 144px;
          color: #20282B;
          text-align: center;
          sup{
            opacity: .5;
            position: absolute;
            top: 20px;
            font-size: 24px;
            color: #20282B;
          }
        }
        .c-mode{
          margin: auto;
          display: block;
          margin-top: 20PX;
          width: 33px;
          height: 33px;
          background-image: url('~@lib/@{imgPath}/icon-wind.png');
          background-size: 100% 100%;
        }
      }
    }
  }
  .status{
    text-align: center;
    font-size: 24px;
    color: #20282B;
  }
  .panel-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px 38px 0;
    z-index: 9999;

    background: #ffffff;
    box-shadow: 0 -3px 28px 0 rgba(209, 209, 209, 0.5);
    border-radius: 42px 42px 0px 0px;

    flex-wrap: wrap;
    justify-content: flex-start;
    .more {
      width: 750px;
      color: #9e9e9e;
      font-size: 24px;
      text-align: center;
      position: absolute;
      left: 0;
      top: -75px;
      .arrow {
        display: inline-block;
        font-size: 32px;
        &.up {
          transform: rotate(90deg);
        }
        &.down {
          transform: rotate(-90deg);
        }
      }
    }
  }
  /*********** 按钮 ***********/
  .btn-wrap {
    margin: 0 24px 24px;
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
        background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
        border-color: #ffbf00;
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
        background-image: url('~@lib/@{imgPath}/cold.png');
        background-size: 100% 100%;
      }
    }
    .btn-heat {
      &::before {
        background-image: url('~@lib/@{imgPath}/heat.png');
        background-size: 100% 100%;
      }
    }
    .btn-mode {
      &::before {
        background-image: url('~@lib/@{imgPath}/mode.png');
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
        background-image: url('~@lib/@{imgPath}/wind.png');
        background-size: 100% 100%;
      }
    }

    .btn-dehumidify {
      &::before {
        background-image: url('~@lib/@{imgPath}/dehumidify-black.png');
        background-size: 100% 100%;
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

    .btn-speed5{
      &::before {
        background-image: url('~@lib/@{imgPath}/speed5.png');
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
      background: rgba(0, 0, 0, 0.1);
    }
    &.page {
      background: #fff;
      .control-tm{
        background: #fff;
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
      opacity: 0.2;
      .btn {
        &.active {
          background: #fff;
          border: none;
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
  .btns {
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
        background-image: url(~@lib/base/air_cleaner/assets/new-air/swich-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(~@lib/base/air_cleaner/assets/new-air/swich-black.png);
        }
      }
    }

    .btn-low {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(~@lib/base/air_cleaner/assets/new-air/speed1-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(~@lib/base/air_cleaner/assets/new-air/speed1.png);
        }
      }
    }
    .btn-middle {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(~@lib/base/air_cleaner/assets/new-air/speed2-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(~@lib/base/air_cleaner/assets/new-air/speed2.png);
        }
      }
    }
    .btn-high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(~@lib/base/air_cleaner/assets/new-air/speed3-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(~@lib/base/air_cleaner/assets/new-air/speed3.png);
        }
      }
    }
    .btn-very_high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(~@lib/base/air_cleaner/assets/new-air/speed4-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(~@lib/base/air_cleaner/assets/new-air/speed4.png);
        }
      }
    }
    .btn-super_high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(~@lib/base/air_cleaner/assets/new-air/speed5-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(~@lib/base/air_cleaner/assets/new-air/speed5.png);
        }
      }
    }
  }
}
</style>
