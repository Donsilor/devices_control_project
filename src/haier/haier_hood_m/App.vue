<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']">
      <topbar 
        :title="device.device_name"
        bak-color="#000" />
      <div
        v-if="toogleSpeed" 
        class="main center" >
        <div class="wrap-circle center">
          <div 
            :class="[{'animation': !isClose }, {'greycircle': isClose }, rotateClass, 'bg']" />
          <p class="wind">风速档位</p>
          <p 
            v-if="!isClose&&!isOffline"
            class="speed">{{ speedNum }}</p>
          <div 
            v-else 
            class="speed speed-close">
            <span/>
            <span/>
          </div>
          <p 
            v-if="!isClose&&!isOffline"
            class="switch">{{ speedText }}</p>
        </div>
      </div>
      <div 
        v-show="deviceAttrs.light == 'on'"
        class="tips">
        <i />
        <span>照明已开启</span>
      </div>
      <div 
        v-show="deviceAttrs.delay == 'on'&&deviceAttrs.switch=='on'"
        class="tips tips2">
        <i />
        <span>{{ minute }}分{{ second }}秒后关机</span>
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
          <div class="btn-name">关机</div>
        </div>
        <div 
          class="btn-wrap"
          @click="setSpeed('low')">
          <div :class="[{ 'active': deviceAttrs.speed == 'low' }, 'btn btn-rs center']" />
          <div class="btn-name">柔速</div>
        </div>
        <div 
          class="btn-wrap"
          @click="setSpeed('overnormal')">
          <div :class="[ { 'active': deviceAttrs.speed == 'overnormal' }, 'btn btn-gs center']" />
          <div class="btn-name">高速</div>
        </div>
        <div 
          class="btn-wrap"
          @click="setSpeed('high')">
          <div :class="[ { 'active': deviceAttrs.speed == 'high' }, 'btn btn-bc center']" />
          <div class="btn-name">爆炒</div>
        </div>
        <div 
          v-show="isOpen"
          class="btn-wrap btn-wrap-light"
          @click="setLight()">
          <div :class="[{ 'active': deviceAttrs.light == 'on' },'btn-zm', 'btn' ,'center']" />
          <div class="btn-name">照明</div>
        </div>

        <div 
          v-show="isOpen"
          :class="['btn-wrap']"
          @click="setDelay()">
          <div :class="[{ 'active': deviceAttrs.delay == 'on' },{ 'disabled': deviceAttrs.speed == 'off' },'btn', 'btn-yc' ,'center']" />
          <div class="btn-name">延迟</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      isOpen: false,
      speedNum: 0,
      speedText: '关',
      time:0,
      dateObj:null,
      minute: '--',
      second: '--',
      toogleSpeed:true
    }
  },
  computed: {
    ...mapGetters(['isClose', 'isOffline']),
    ...mapState(['device', 'deviceAttrs']),
    rotateClass() {
      /* eslint-disable no-unreachable */
      switch (this.deviceAttrs.speed) {
        case 'low':
          return 'rotate-low'
          break
        case 'overlow':
          return 'rotate-overlow'
          break
        case 'normal':
          return 'rotate-normal'
          break
        case 'overnormal':
          return 'rotate-overnormal'
          break
        case 'high':
          return 'rotate-high'
          break
        case 'auto':
          return 'rotate-low'
          break 
        default:
          return ''
      }
    },
  },
  watch: {
    'device.stateChange'() {
      this.$nextTick(() => {
        this.toogleSpeed = false
        this.$nextTick(() => {
          this.toogleSpeed = true
        })
      })
      if(this.deviceAttrs.delay == 'on'){
        this.time = 3*60
        this.countdown()
        clearInterval(this.dateObj)
        this.dateObj = setInterval(this.countdown, 1000)
      }else{
         clearInterval(this.dateObj)
      }     
    },
    deviceAttrs: {
      handler(newName) {
        switch (newName.speed) {
          case "off":
            this.speedNum = 0
            this.speedText = "关"
            break
          case "low":
            this.speedNum = 1
            this.speedText = "柔速"
            break
      
          case "overnormal":
            this.speedNum = 2
            this.speedText = "高速"
            break
          case "high":
            this.speedNum = 3
            this.speedText = "爆炒"
            break
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    setSpeed(val) {
      if (val == this.deviceAttrs.speed) {
        val = 'off'
      }
      if (this.isClose) return  // 关机状态点击无效
      this.controlDevice('speed', val)
    },
    setSwitch() {
      let switchStatus = ''
      if (this.deviceAttrs.switch == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.controlDevice("switch", switchStatus)
    },
    setLight() {
      // if (this.isClose) return  // 关机状态点击无效
      let switchStatus = ''
      if (this.deviceAttrs.light == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.controlDevice("light", switchStatus)
        .then(() => {
          console.log('setLight success')
        })
    },
    setDelay() {
      if (this.isClose || this.deviceAttrs.speed == 'off' ) return  // 关机状态点击无效
      let switchStatus = ''
      if (this.deviceAttrs.delay == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.controlDevice("delay", switchStatus)
    },
    countdown(){
          this.second = Math.floor(this.time  % 60)
          this.minute = Math.floor(this.time /  60 % 60)
          if (this.minute <= 0 && this.second <= 0) {
            clearInterval(this.dateObj)
            this.setSwitch()
          }
          this.time--
    },
    controlDevice(attr, value) {
      return this.doControlDevice({
        nodeid: `haier_hood.main.${attr}`,
        params: {
          attribute: {
            [attr]: value
          }
        }
      })
    },
    handleMore() {
      this.isOpen = !this.isOpen
    }
  },

}
</script>

<style lang="less" scoped>
@imgPath: "base/haier_hood/assets";
@imgPath1: "base/blend/assets";
@imgPath2: "base/air_cleaner/assets/new-air";
@keyframes rotate {
    from {
      transform:rotate(0deg);
    }
    to {
      transform:rotate(360deg);
    }
}
.wrap-circle {
  position: relative;
  margin-top: 60px;
  width: 524px;
  height: 524px;
  flex-direction: column;
  color: #20282B;
  .bg{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .wind {
    margin-bottom: 30px;
    font-size: 24px;
  }
  .speed {
    font-size: 120px;
    &.speed-close{
      display: flex;
      align-items: center;
      height: 152px;
      margin-bottom: 20px;
      span{
        margin: 0 10px;
        display: inline-block;
        background:#757575;
        width: 70px;
        height: 10px;
      }
    }
  }
  .switch {
    margin-top: 20px;
    font-size: 32px;
  }
}
.animation {
  background: url("~@lib/@{imgPath}/yanji_img_animation.png") no-repeat;
  background-size: 100% 100%;
  &.rotate-low{
    animation: rotate 10s linear 0s infinite;
  }
  &.rotate-overlow{
    animation: rotate 8s linear 0s infinite;
  }
  &.rotate-normal{
    animation: rotate 6s linear 0s infinite;
  }
  &.rotate-overnormal{
    animation: rotate 6s linear 0s infinite;
  }
  &.rotate-high{
    animation: rotate 4s linear 0s infinite;
  }
}
.greycircle {
  background: url("~@lib/@{imgPath}/yanji_img_greycircle.png") no-repeat;
  background-size: 100% 100%;
}
.tips {
  margin-top: 20px;
  font-size: 20px;
  text-align: center;
  i {
    vertical-align: sub;
    display: inline-block;
    width: 30px;
    height: 30px;
    background-image: url("~@lib/@{imgPath}/yanji_ico_light.png");
    background-size: 100% 100%;
  }
  span {
    width: 100px;
  }
}
.tips2 {
  i {
    background-image: url("~@lib/@{imgPath1}/time-black.png");
  }
}
.panel-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px 30px 30px;
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
.disabled {
  opacity: 0.2;
}
.btn-wrap {
  margin: 0 24px 24px;
  &.up-index {
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
  .btn-start {
    &::before {
      content: "";
      display: block;
      width: 44px;
      height: 44px;
      background-image: url("~@lib/@{imgPath1}/start.png");
      background-size: 100% 100%;
    }
    &.active {
      &::before {
        background-image: url("~@lib/@{imgPath1}/start.png");
      }
    }
  }

  .btn-zm {
    &::before {
      content: "";
      display: block;
      width: 44px;
      height: 44px;
      background-image: url("~@lib/@{imgPath}/yanji_btn_light.png");
      background-size: 100% 100%;
    }
  }
  .btn-yc {
    &::before {
      content: "";
      display: block;
      width: 44px;
      height: 44px;
      background-image: url("~@lib/@{imgPath1}/time-black.png");
      background-size: 100% 100%;
    }
  }

  .btn-rs {
    &::before {
      content: "";
      display: block;
      width: 44px;
      height: 44px;
      background-image: url("~@lib/@{imgPath}/yanji_btn_fan01.png");
      background-size: 100% 100%;
    }
  }
  .btn-bc {
    &::before {
      content: "";
      display: block;
      width: 44px;
      height: 44px;
      background-image: url("~@lib/@{imgPath}/yanji_btn_baochao.png");
      background-size: 100% 100%;
    }
  }
  .btn-bpsr {
    &::before {
      content: "";
      display: block;
      width: 44px;
      height: 44px;
      background-image: url("~@lib/@{imgPath}/yanji_btn_fan03.png");
      background-size: 100% 100%;
    }
  }
  .btn-gs {
    &::before {
      content: "";
      display: block;
      width: 44px;
      height: 44px;
      background-image: url("~@lib/@{imgPath}/yanji_btn_fan03.png");
      background-size: 100% 100%;
    }
  }

  .btn-swich {
    &::before {
      content: "";
      display: block;
      width: 44px;
      height: 44px;
      background-image: url("~@lib/@{imgPath2}/swich-black.png");
      background-size: 100% 100%;
    }
    &.active {
      &::before {
        background-image: url("~@lib/@{imgPath2}/swich-black.png");
      }
    }
  }
}
&.close {
  .btn-wrap {
    &.up-index{
      opacity: 1;
    }
  }
}
&.offline {
  .btn-wrap {
    &.up-index{
      opacity: .2;
    }
  }
}
&.close,
&.offline {
  &:before {

    content: "";
    position: fixed;
    top: 82PX;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 999;
    width: 100%;
    background: rgba(0, 0, 0, 0.1);
  }
  &.page {
    background: #fff;
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
    opacity: .2;
    .btn {
      &.active {
        background: #fff;
        border: 1px solid #818181;
      }
    }
  }
  .btn-wrap-light{
    opacity: 1;
    .btn {
      &.active {
        background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
        border-color: #ffbf00;
      }
    }
  }
}
</style>


