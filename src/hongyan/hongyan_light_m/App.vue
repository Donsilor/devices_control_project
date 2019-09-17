<template class="a">
  <div class="body">
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']">
      <topbar 
        :show-right="false"
        :title="device.device_name"
        bak-color="#fff" />
      <!-- :title="device.device_name" -->
      <div
        v-if="toogleSpeed" 
        class="main center" >
        <div class="wrap-circle center">
          <div class="lianggang"/>
          <div 
            :class="[{'animation': !isClose }, {'greycircle': isClose }, rotateClass, 'bg']" />
            <!-- <p class="wind">风速档位</p>
          <p 
            v-if="!isClose&&!isOffline"
            class="speed">{{ speedNum }}</p> -->
            <!-- <div 
            v-else 
            class="speed speed-close">
            <span/>
            <span/>
          </div> -->
            <!-- <p 
            v-if="!isClose&&!isOffline"
            class="switch">{{ speedText }}</p> --> 
        </div>
      </div>
      <div 
        v-show="!isClose&&!isOffline"
        class="tips">
        <span>亮度 {{ deviceAttrs.level }}%</span>
      </div>
      <!-- <div 
        v-show="deviceAttrs.delay == 'on'&&deviceAttrs.switch=='on'"
        class="tips tips2">
        <i />
        <span>延迟关机中</span>
      </div> -->

      <!-- 按钮 -->
      <div class="panel-btn center">
        <div :class="[{'up-index': !isOffline }, 'btn-wrap']">
          <div 
            :class="[{ 'active': !isClose }, 'btn-swich btn center']"
            @click="setSwitch" />
          <div class="btn-name">关机</div>
        </div>
        <div 
          class="btn-wrap"
          @click="setSpeed(3000)">
          <div :class="[{ 'active': deviceAttrs.temperature == 3000 }, 'btn btn-rs center']" />
          <div class="btn-name">暖光</div>
        </div>
        <div 
          class="btn-wrap"
          @click="setSpeed(5000)">
          <div :class="[ { 'active': deviceAttrs.temperature == 5000 }, 'btn btn-gs center']" />
          <div class="btn-name">自然光</div>
        </div>
        <div 
          class="btn-wrap"
          @click="setSpeed(6500)">
          <div :class="[ { 'active': deviceAttrs.temperature == 6500 }, 'btn btn-bc center']" />
          <div class="btn-name">白光</div>
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
      // minute: '--',
      // second: '--',
      toogleSpeed:true
    }
  },
  computed: {
    ...mapGetters(['isClose', 'isOffline']),
    ...mapState(['device', 'deviceAttrs']),
    rotateClass() {
      /* eslint-disable no-unreachable */
      switch (this.deviceAttrs.temperature) {
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
      // if(this.deviceAttrs.delay == 'on'){
      //   this.time = 3*60
      //   this.countdown()
      //   clearInterval(this.dateObj)
      //   this.dateObj = setInterval(this.countdown, 1000)
      // }else{
      //    clearInterval(this.dateObj)
      // }     
    },
    deviceAttrs: {
      handler(newName) {
        switch (newName.temperature) {
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
      if (val == this.deviceAttrs.temperature) {
        val = 'off'
      }
      if (this.isClose) return  // 关机状态点击无效
      this.controlDevice('temperature', val)
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
    // countdown(){
    //       this.second = Math.floor(this.time  % 60)
    //       this.minute = Math.floor(this.time /  60 % 60)
    //       if (this.minute <= 0 && this.second <= 0) {
    //         clearInterval(this.dateObj)
    //         this.setSwitch()
    //       }
    //       this.time--
    // },
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
@imgPath: "base/hongyan_light/assets";
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
.page{
  height:1280px;
  background-image: radial-gradient(51% -19%, #F5BD36 52%, #F3CF77 52%, #E1AD2E 100%);
}
.wrap-circle {
  position: relative;
  margin-top: 60px;
  width: 320px;
  height: 450px;
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
 .tips{
    margin-top: 40px;
    text-align: center;
    font-size: 12px;
    color: #fff;
  }
.animation {
  background: url("~@lib/@{imgPath}/btn_ac_mode_e@2x.png") no-repeat;
  // background: #fff;
  background-size: 100% 100%;
}
.greycircle {
  background: url("~@lib/@{imgPath}/btn_ac_mode_h@2x.png") no-repeat;
  background-size: 100% 100%;
}
.lianggang{
  width: 74px;
  height: 16px;
  position: absolute;
  top: 0;
  left: 50%;
    transform: translateX(-50%);
   background: url("~@lib/@{imgPath}/btn_ac_on_lianggang@2x.png") no-repeat;
  background-size: 100% 100%;
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
  // .btn-start {
  //   &::before {
  //     content: "";
  //     display: block;
  //     width: 44px;
  //     height: 44px;
  //     background-image: url("~@lib/@{imgPath1}/btn_ac_on_cd@2x.png");
  //     background-size: 100% 100%;
  //   }
  //   &.active {
  //     &::before {
  //       background-image: url("~@lib/@{imgPath1}/start.png");
  //     }
  //   }
  // }

  .btn-zm {
    &::before {
      content: "";
      display: block;
      width: 44px;
      height: 44px;
      background-image: url("~@lib/@{imgPath}/btn_ac_on_cd@2x.png");
      background-size: 100% 100%;
    }
  }
  .btn-rs {
    &::before {
      content: "";
      display: block;
      width: 44px;
      height: 44px;
      background-image: url("~@lib/@{imgPath}/nuanguan@2x.png");
      background-size: 100% 100%;
    }
  }

  .btn-gs {
    &::before {
      content: "";
      display: block;
      width: 44px;
      height: 44px;
      background-image: url("~@lib/@{imgPath}/ziranguang@2x.png");
      background-size: 100% 100%;
    }
  }
  .btn-bc {
    &::before {
      content: "";
      display: block;
      width: 44px;
      height: 44px;
      background-image: url("~@lib/@{imgPath}/baiguang@2x.png");
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
    background-image: url("~@lib/@{imgPath}/beij@3x.png");
    background-size: 100% 100%;

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


