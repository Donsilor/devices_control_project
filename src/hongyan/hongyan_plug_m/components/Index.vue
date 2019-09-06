<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, {'close': isClose},'page']">
      <topbar 
        :title="device.device_name"
        bak-color= "#000" />
      <div class="main center">
        <div class="wrap-circle">
          <div class="bg isgray">
            <div class="plug">
              <img 
                src="../../../../lib/base/blend/assets/btn-mode8.png">
            </div>
          </div>
        </div>
      </div>
      <!-- 当前状态 -->
      <div 
        v-show="deviceAttrs.switch == 'on'&& deviceAttrs.connectivity == 'online'"
        class="status">
        {{ deviceAttrs.mode | modeType }}开启中...
      </div>
      <div 
        class="electricity">
        <div class="electric">
          <div 
            v-if="deviceAttrs.switch == 'on'&& deviceAttrs.connectivity == 'online'"
            class="current">2.1 <span>A</span></div>
          <div 
            v-else 
            class="current1">_ _<span>A</span></div>
          <p>实时电流</p>
        </div>
        <div class="electric">
          <div 
            v-if="deviceAttrs.switch == 'on'&& deviceAttrs.connectivity == 'online'"
            class="current">5.0 <span>V</span></div>
          <div 
            v-else 
            class="current1">_ _<span>V</span></div>
          <p>实时电压</p>
        </div>
      </div>
      <!-- 底部按钮 -->
      <div class="panel-btn center">
        <div :class="[{'up-index': !isOffline }, 'btn-wrap']">
          <div 
            :class="[{ 'active': !isClose }, 'btn-swich btn center']"
            @click="setSwitch" />
          <div class="btn-name">开关</div>
        </div>
        <div 
          class="btn-wrap"
          @click="setTime">
          <div :class="[ { 'active': deviceAttrs.order_time > 0}, 'btn btn-time center']" />
          <div class="btn-name">定时 </div>
        </div>
        <div 
          class="btn-wrap"
          @click="setMode('child')">
          <div :class="[{ 'active': deviceAttrs.mode == 'child' }, 'btn btn-cold center']" />
          <div class="btn-name">童锁</div>
        </div>
      </div>
      <!-- 定时展示 -->
      <!-- <div
        v-show="timeShow"
        class="timeShow">
        <img
          class="timeShow-img"
          src="../../../lib/base/blend/assets/time-black.png">
        {{ deviceAttrs.order_time | time_H }}
      </div> -->
      <!--选择摆风-->
      <!-- 定时 -->
      <!-- <SelectTime 
        ref="time" 
        :order_time="deviceAttrs.order_time"
        @selectedTime="setReserve" /> -->
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
// import SelectTime from './components/time/time.vue'
export default {
  components: {
    // SelectTime
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
      backgroundColor: '#ececec',
      timeShow: false,
    }
  },
  computed: {
    ...mapGetters(['isClose', 'isOffline']),
    ...mapState(['device', 'deviceAttrs']),
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
      // HdSmart.UI.setStatusBarColor(2)
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    setSwitch() {
      let switchStatus = ''
      if (this.deviceAttrs.switch == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.controlDevice("switch", switchStatus)
    },
    setMode(val) {
      if (val == this.deviceAttrs.mode || this.isClose) return
      this.controlDevice('mode', val)
        .then(() => {
          this.deviceAttrs.mode = val
          this.reset()
          this.hide()
        })
    },
    setTime(){
      this.$router.push({ path: '/log' })
    },
    // setReserve(time) {
    //   let h = parseInt(time[0].split(':')[0])
    //   let m = parseInt(time[0].split(':')[1])
    //    this.controlDevice(
    //     "order_time",
    //     ((h*60)+m)*60
    //   )

    //   if(this.deviceAttrs.order_time > 0) {
    //     this.timeShow = true
    //   } else {
    //     this.timeShow = false
    //   }
    // },
    controlDevice(attr, value) {
      return this.doControlDevice({
        nodeid: `hongyan_plug.main.${attr}`,
        params: {
          attribute: {
            [attr]: value
          }
        }
      })
    },
    // showTime() {
    //   if (this.isClose) return
    //   this.$refs.time.show = true
    // },
    // hide(){
    //   if(this.$refs.mode.show) this.$refs.mode.show = false
    // },
  }
}
</script>
<style lang="less" scoped>
@imgPath: 'base/air_condition/assets/new-air';

.body {
  min-height: 100%;
}
  // 定时展示
  .timeShow {
    text-align: center;
    position: relative;
    font-size: 24px;
    margin-top: 24px;
    color: #20282B;
    .timeShow-img {
      position: relative;
      top: 2px;
      width: 28px;
      height: 28px;
      margin-right: 12px;
    }
  }
.page {
  height: 100vh;
  min-height: 550px;
  overflow-x: hidden;
  position: relative;
  background: #006cff;
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
      .bg{
        width: 460px;
        height: 460px;
        background: transparent;
        border: 4px solid rgba(255,255,255,0.60); 
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        .plug {
          width: 424px;
          height: 424px;
          background: #fff;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
  }
  .status{
    text-align: center;
    font-size: 24px;
    color: #fff;
    margin: 80px auto;
  }
  .panel-btn {
    height: 306px;
    width: 100%;
    position: fixed;
    bottom: 0;
    background: #ffffff;
    box-shadow: 0 -3px 28px 0 rgba(209, 209, 209, 0.5);
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
  /*********** 按钮 ***********/
  .btn-wrap {
    margin: 0 34px 40px;
    .btn {
      box-sizing: border-box;
      margin: 0px auto;
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
      line-height: 40px;
      opacity: .5;
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
    }
     .btn-time {
      &::before {
        background-image: url('~@lib/@{imgPath}/time-black.png');
        background-size: 100% 100%;
      }
    }
  }
  // &.close {
  //   .btn-wrap {
  //     &.up-index{
  //       opacity: 1;
  //     }
  //   }
  // }
  // &.offline {
  //   .btn-wrap {
  //     &.up-index{
  //       opacity: .2;
  //     }
  //   }
  // }
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
      // background: rgba(0, 0, 0, 0.1);
    }
    &.page {
      background: #fff;
      .isgray {
        width: 460px;
        height: 460px;
        background: transparent;
        border: 4px solid #D8D8D8; 
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        .plug {
          width: 424px;
          height: 424px;
          background: #D8D8D8;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      .electricity {
        margin-top: 160px;
        .electric {
          color:#20282B;
          .current1 {
            color: #20282B;
            opacity: .5;
            line-height: 0;
            position: relative;
            >span {
              position: absolute;
              top: 20px;
            }
          }
          >p {
            opacity: .5;
            font-size: 24px;
          }
        }
      }
      .panel-btn {
        background: #fff;
      }
    }
    .panel-btn {
      background: #efefef;
    }
    .btn-wrap {
      opacity: .2;
      &.up-index {
        opacity: 1;
      }
      .btn {
        &.active {
          background: #fff;
          border: 1px solid #818181;
        }
      }
    }
  }

  .electricity {
    width:100%;
    height:120px;
    display:flex;
    justify-content: space-around;
    color: #FFFFFF;
    text-align: center;
    padding: 0 100px;
    .electric {
      > div {
        height: 90px;
        font-size: 80px;
        position: relative;
        >span {
          font-size: 24px;
          position: absolute;
          top: 0;
          right: -20px;
        }
      }
      >p {
        opacity: .5;
        font-size: 24px;
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
        margin-top: 16px;
        font-size: 24px;
        color: #20282B;
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
  }
}
</style>
