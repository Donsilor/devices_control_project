<template class="a">
  <div class="body">
    <div
      :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']" >
      <new-topbar
        :shutdown="!isClose"
        :title="device.device_name"
        bak-color="#000"
        @shutdownCallback="setSwitch()"
      />
      <div
        v-if="toogleSpeed"
        class="main center"
      >
        <div
          class="wrap-circle center">
          <div
            :class="[{'animation': !isClose }, {'greycircle': isClose }, rotateClass, 'bg']" />
          <!-- touch组件 -->
          <parcent-Light
            :brightness="deviceAttrs.temperature"
            :switch_status="deviceAttrs.switch_status"
            @moveLight="moveLight"
            @endLight="endLight"/>
        </div>
      </div>
      <div
        class="tips">
        <div
          v-if="isClose"
          :class="[{'up-index': !isOffline }, 'btn-wrap']">
          <div

            :class="[{ 'active': !isClose }, 'btn-swich btn center']"
            @click="setSwitch" />
          <div class="btn-name">{{ isClose||isOffline?'开灯':'关灯' }}</div>
        </div>
        <span v-if="!isClose">亮度 {{ ratio }}%</span>
      </div>
      <!-- 按钮 -->
      <div
        v-if="!isClose"
        class="panel-btn center">
        <!-- <div :class="[{'up-index': !isOffline }, 'btn-wrap']">
          <div
            :class="[{ 'active': !isClose }, 'btn-swich btn center']"
            @click="setSwitch" />
          <div class="btn-name">{{ isClose||isOffline?'开灯':'关灯' }}</div>
        </div> -->
        <div
          class="btn-wrap"
          @click="setSpeed(370)">
          <div :class="[{ 'active': deviceAttrs.temperature == 370 }, 'btn btn-rs center']" />
          <div class="btn-name">白光</div>
        </div>
        <div
          class="btn-wrap"
          @click="setSpeed(240)">
          <div :class="[ { 'active': deviceAttrs.temperature == 240 }, 'btn btn-gs center']" />
          <div class="btn-name">自然光</div>
        </div>
        <div
          class="btn-wrap"
          @click="setSpeed(167)">
          <div :class="[ { 'active': deviceAttrs.temperature == 167}, 'btn btn-bc center']" />
          <div class="btn-name">暖光</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import parcentLight from './parcentLight'
export default {
  components: {parcentLight},
  data() {
    return {
      isOpen: false,
      toogleSpeed:true,
      ratio:100,
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
    isClose(){
      return this.deviceAttrs.switch_status=="on"?false:true
    },
  },
  watch: {
    'device.stateChange'() {
      this.$nextTick(() => {
         this.newLevel()
      })
    }
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
      .then(()=>{
        this.newLevel()
      })
      HdSmart.UI.setStatusBarColor(1)
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    // 亮度
    moveLight(val){
      this.ratio = 100-val
    },
    //
    endLight(val){
      if(val == 0) return this.controlDevice('level', val)
      if(val <= 15) {
        this.controlDevice('level', 15)
      } else {
        this.controlDevice('level', val)
      }
    },
    newLevel(){
      this.ratio = Math.round(this.deviceAttrs.level/254*100)
      let touchbox = document.querySelectorAll(".touchbox")[0]
      let coverlight = document.querySelectorAll(".coverlight")[0]
      touchbox.style.top = ((100-this.ratio)/100*185)/37.5 +"rem"
      coverlight.style.clip = `rect(${((100-this.ratio)/100*185)/37.5 +"rem"} ${320/37.5 +'rem'} ${450/37.5 +'rem'} 0)`
    },
    setSpeed(val) {
      if (this.isClose||this.isOffline) return
      this.controlDevice('temperature', val)
    },
    setSwitch() {
      if (this.isOffline) return false
      let switchStatus = ''
      if (this.deviceAttrs.switch_status == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.controlDevice("switch", switchStatus)
    },
    controlDevice(attr, value) {
      if(attr=='switch'){
         return this.doControlDevice({
        nodeid: `bulb.main.${attr}`,
        params: {
          attribute: {
            [attr]: value
          }
        }
      })
      }else{
        return this.doControlDevice({
        nodeid: `bulb.main.${attr}`,
        params: {
          attribute: {
            [attr]: value,
            "transition_time":2,
            "need_confirm":true
          }
        }
      })
      }

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
@imgPath3: 'base/honghan_switch/assets';
@keyframes rotate {
    from {
      transform:rotate(0deg);
    }
    to {
      transform:rotate(360deg);
    }
}
.page{
  height:100vh;
  background: url('~@lib/@{imgPath3}/img_bg_01@2x.png');
  background-size: 100% 100%;
}
.main{
  margin-top: 5vh;
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
   position: relative;
    margin-top: 100px;
    text-align: center;
    font-size: 36px;
    // color: #fff;
    display: flex;
    justify-content: center;
    .ratiobg{
      position: absolute;
      width: 600px;
      height: 10px;
      background: #ccc;
      top: 160px;
      // left: 50%;
      // transform: translateX(-50%);
      border-radius: 60px;
      .ratiobg2{
        width: 0px;
        height: 100%;
        background:aqua;
        border-radius: 60px;
      }
      .circle{
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background:aqua;
        position: absolute;
        top: -14px;
        left: 0px;
      }
      .an{
        position: absolute;
        top: 20px;
        left: -30px;
      }
      .liang{
        position: absolute;
        top: 20px;
        right: -30px;;
      }
    }

  }
.animation {
  background: url("~@lib/@{imgPath}/btn_ac_mode_h@2x.png") no-repeat;
  // background: #fff;
  background-size: 100% 100%;
}
.coverlight{
  position:absolute;
  width: 320px;
  height: 450px;
  clip:rect(80px 320px 450px 0px);
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
  width: 100%;
  height: 306px;
  // background: #ffffff;
  // box-shadow: 0 -3px 28px 0 rgba(209, 209, 209, 0.5);
  border-radius: 42px 42px 0px 0px;

  flex-wrap: wrap;
  justify-content: center;

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
    background: rgba(0,0,0,0.1);
    // box-shadow: 0 -3px 28px 0 rgba(209, 209, 209, 0.5);
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
    // border: 1px solid #818181;
    border-radius: 50%;

    display: flex;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.1);
    &.active {
      // background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
      // border-color: #ffbf00;
      background: #000;
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
    &.active::before{
      display: block;
      width: 44px;
      height: 44px;
      background-image: url("~@lib/base/yiyun_light/assets/nuanguang2@2x.png");
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
    &.active::before{
      display: block;
      width: 44px;
      height: 44px;
      background-image: url("~@lib/base/yiyun_light/assets/ziranguang2@2x.png");
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
    &.active::before{
      display: block;
      width: 44px;
      height: 44px;
      background-image: url("~@lib/base/yiyun_light/assets/baiguanfg2@2x.png");
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
  // background-image: url("~@lib/@{imgPath}/beij@3x.png");
  //   background-size: 100% 100%;
  &:before {
    // content: "";
    // position: fixed;
    // top: 82PX;

    // left: 0;
    // bottom: 0;
    // right: 0;
    // z-index: 999;
    // width: 100%;
    // background: rgba(0, 0, 0, 0.1);
  }
  &.page {
    // background-image: url("~@lib/@{imgPath}/beij@3x.png");
    // background-size: 100% 100%;

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
    // background: #efefef;
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
.ratiobg111{
  position: fixed;
  right: 100px;
  top: 200px;
  height: 500px;
  width: 10px;
  background: #ccc;
  .circle{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #fff;
    position: absolute;
    left: -15px;
  }
  .ratiobg2{
    // border-radius: 50%;
    background: rgba(255 ,255, 255, 0.6)
  }
}
</style>


