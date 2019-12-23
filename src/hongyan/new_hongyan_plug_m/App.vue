<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, {'close': isClose},'page']">
      <NewTopBar
        :title="device.device_name"
        :room="device.room_name"
        :scroll="true"
        page-class=".page"
        bak-color="#000"/>
      <StatusTip v-show="device.device_uuid"/>
      <div class="main center">
        <div class="bg">
          <div class="circle">
            <!-- <div class="dotOne"/>
            <div class="dotTwo"/> -->
            <div class="status">
              <div class="electric">
                <span>实时电流</span>
                <div
                  v-if="!isClose&& deviceAttrs.connectivity == 'online'"
                  class="current">{{ deviceAttrs.current.toFixed(1) }}</div>
                <div
                  v-else
                  class="current1">ㅡㅡ</div>
              </div>
              <div class="voltage">
                <span> 实时电压</span>
                <span
                  v-if="!isClose&& deviceAttrs.connectivity == 'online'"
                  class="current">
                  {{ deviceAttrs.voltage?deviceAttrs.voltage.toFixed(1):220 }}V
                </span>
                <span
                  v-else
                  class="current1">ㅡㅡV</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 插座状态 -->
      <div class="switchStatus">{{ deviceAttrs.switch=='on'?'通电中':'已断电' }}</div>
      <!-- 开关 -->
      <div
        class="starting">
        <div
          ref="starting"
          :class="[{'active': deviceAttrs.switch == 'on'&&!isOffline},'btn btn-start']"
          @click="setSwitch('starting')" />
      </div>
      <div class="bottom" style="position: fixed;bottom: 0;">
        <div class="Charging-protection">
          <div>禁用设备开关</div>
          <div
            style="z-index: 100;">
            <input
              :class="['switch switch-anim']"
              :checked="lockVal"
              :disabled="disabledLock"
              type="checkbox"
              @click="childLockSwitch">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  components: {
    // SelectTime
  },
  data() {
    return {
      timeShow: false,
      lockVal: false,
      disabledLock: false,
    }
  },
  computed: {
    ...mapGetters(['isOffline']),
    ...mapState(['device', 'deviceAttrs']),
    isClose(){
      return this.deviceAttrs.switch === 'on' || this.deviceAttrs.usb === 'on'? false : true
    },
  },
  watch:{
    'deviceAttrs.child'() {
      this.disabledLock = false
      if(this.deviceAttrs.child == 'on') {
        this.lockVal = true
      } else {
        this.lockVal = false
      }
    }
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
      // HdSmart.UI.setStatusBarColor(2)
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    // usbSwitch(){
    //   if (this.isOffline) return
    //   if (this.deviceAttrs.child == 'on') {
    //      return HdSmart.UI.toast('请先关闭童锁')
    //   }
    //   let usbStatus = ''
    //   if (this.deviceAttrs.usb == 'on') {
    //     usbStatus = 'off'
    //   } else {
    //     usbStatus = 'on'
    //   }
    //   this.controlDevice("usb", usbStatus)
    // },
      touchstart(val) {
       this.$refs[val].classList.remove('active')
      this.$refs[val].classList.add('animateStart')

      this.$refs[val].classList.add('yellowExtend')
    },
    touchend(val){
      this.$refs[val].classList.add('animateEnd')
    },
    setSwitch(val){
      if (this.isOffline) return
      HdSmart.UI.vibrate()
      if (this.deviceAttrs.child == 'on') {
         return HdSmart.UI.toast('请停止禁用开关')
      }
      this.touchstart(val)
      setTimeout(() => {
        this.touchend(val)
      }, 150)
      let switchstatus = ''
      if (this.deviceAttrs.switch=='on') {
        switchstatus = 'off'
      }else{
        switchstatus = 'on'
      }
      this.controlDevice('switch',switchstatus)
    },
    // 童锁
    childLockSwitch() {
      // console.log(e.target.checked)
      this.disabledLock = true
      let childLockStatus = ''
      if (this.deviceAttrs.child == 'on') {
        childLockStatus = 'off'
      } else {
        childLockStatus = 'on'
      }
      this.controlDevice("child", childLockStatus)
      .then(() => {
        this.disabledLock = false
      })
      .catch(() => {
        this.disabledLock = false
      })
    },
    // setTime(){
    //   if (this.isClose) return
    //   if (this.deviceAttrs.child == 'on') {
    //      HdSmart.UI.toast('请先关闭童锁')
    //      return
    //   }
    //   this.$router.push({ path: '/log' })
    // },
    controlDevice(attr, value) {
      return this.doControlDevice({
        nodeid: `plug.main.${attr}`,
        params: {
          attribute: {
            [attr]: value
          }
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
@imgPath: 'base/hongyan_plug/assets';

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
  background-image: url('~@lib/@{imgPath}/img_bg.png');
  background-size: 100% 100%;
  .main {
    position: relative;
    margin-top: 3vh;
    &.center {
      flex-direction: column;
    }
    .bg{
      width: 580px;
      height: 580px;
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.1);
      position: relative;
      .circle{
        width: 510px;
        height: 510px;
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, 0.1);
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -255px ;
        margin-top: -255px ;
        // .dotOne,.dotTwo{
        //   position: absolute;
        //   width: 20px;
        //   height: 20px;
        //   border-radius: 50%;
        //   background: rgba(0, 0, 0, .5);
        // }
        // .dotOne{
        //   right: 40px;
        //   top: 90px;
        // }
      }
      .status{
        width: 420px;
        height: 420px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -210px ;
        margin-top: -210px ;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        color: #000;
        .electric {
            display:flex;
            justify-content: center;
            flex-direction: column;
            font-family: PingFangSC-Light;
            color: #000000;
            text-align: center;
            >span{
              font-size: 24px;
            }
            > div {
              // height: 90px;
              font-size: 77px;
              position: relative;
            }
            .current{
              margin: 20px 0 40px 0;
              font-size: 144px;
              font-family: PingFangSC-Light;
              &::before{
                position: absolute;
                right: -15px;
                content: "A";
                font-size: 12px;
              }
            }
            .current1{
              margin: 50px 0;
              &::before{
                position: absolute;
                right: -20px;
                top: -30px;
                content: "A";
                font-size: 12px;
              }
            }
          }
          .voltage{
            font-family: PingFangSC-Light;
            font-size: 24px;
            color: #000000;
            text-align: center;
          }
        // .electricity {
        //   width: 300px;;
        //   height:33px;
        //   display:flex;
        //   justify-content: center;
        //   color: #000;
        //   text-align: center;
        //   // padding: 0 100px;
        //   margin-top: 60px;
        //   .electric {
        //     display:flex;
        //     justify-content: center;
        //     >span{
        //       font-size: 24px;
        //     }
        //     > div {
        //       // height: 90px;
        //       font-size: 24px;
        //       position: relative;
        //       // margin-top: 40px;
        //     }
        //   }
        // }
      }
    }
  }
  .switchStatus{
    font-family: PingFangSC-Light;
    font-size: 28px;
    color: #000000;
    text-align: center;
    width: 100%;
    height: 40px;
    margin-top: 56px;
  }
    .switch {
    width: 74px;
    height: 28px;
    position: relative;
    border: 1px solid transparent;
    // background-color: #fdfdfd;
    box-shadow: #dfdfdf 0 0 0 0 inset;
    border-radius: 20px;
    background-clip: content-box;
    display: inline-block;
    -webkit-appearance: none;
    user-select: none;
    outline: none;
    background-color: rgba(0, 0, 0, 0.1);
  }
  .switch:before {
      content: '';
      width: 40px;
      height: 40px;
      position: absolute;
      top: -8px;
      left: 0;
      border-radius: 20px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
      background: #000;
  }
  .switch:checked {
      border-color: #E1B96E;
      box-shadow: #E1B96E 0 0 0 16px inset;
      background-color: #E1B96E;
  }
  .switch:checked:before {
      left: 30px;
      background: #000000;
  }
  .switch.switch-anim {
      transition: border cubic-bezier(0, 0, 0, 1) 0.4s, box-shadow cubic-bezier(0, 0, 0, 1) 0.4s;
  }
  .switch.switch-anim:before {
      transition: left 0.3s;
  }
  .switch.switch-anim:checked {
      // box-shadow: #64bd63 0 0 0 16px inset;
      // background-color: #64bd63;
      transition: border ease 0.4s, box-shadow ease 0.4s, background-color ease 1.2s;
  }
  .switch.switch-anim:checked:before {
      transition: left 0.3s;
  };
    .starting{
    margin-top: 90px;
     .btn-start{
        z-index: 999;
        box-sizing: border-box;
        margin: 0 auto;
        width: 132px;
        height: 132px;
        // border: 1px solid #818181;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 50%;
        position: relative;
        &.active{
          // background-image: linear-gradient(to right, #F1CB85, #E1B96E);
          background: #E1B96E;
        }
        &::before{
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          margin-left: -24px;
          margin-top: -24px;
          background-image: url('~@lib/@{imgPath}/dakai3@2x.png');
          background-size: 100% 100%;
          width: 48px;
          height: 48px;
          z-index: 999;
        }
     }
  }
  .bottom{
    width: 100%;

    margin-top: 50px;
    .timing,.Charging-protection{
       padding: 0 40px;
      display: flex;
      justify-content: space-between;
      font-family: PingFangSC-Regular;
      font-size: 32px;
      color: #000000;
      height: 120px;
      line-height: 120px;
      border-top: 1px rgba(0, 0, 0, .1) solid;
      // border-bottom: 1px rgba(0, 0, 0, .1) solid;
    }

  }
  // .status{
  //   text-align: center;
  //   font-size: 24px;
  //   color: #fff;
  //   margin: -100px auto 30px auto;
  //   width: 100%;
  //   height: 14px;
  // }
}
  /*********** 按钮 ***********/
  &.close{
    z-index: 99;
  }
  &.offline{
    z-index: 200;
  }
  &.close,
  &.offline {
    &:before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;

      width: 100%;
      // background: rgba(0, 0, 0, 0.1);
    }
    .electricity {
        // margin-top: 160px;
        margin-top: 140px;
        .electric {
          color:#20282B;
          >span{
            font-size: 24px;
          }
          .current1 {
            color: #20282B;
            line-height: 24px;
          }
        }
      }
  }

.animateStart::before{
  animation: scaleStart 0.15s;
       animation-fill-mode : forwards;

}
@keyframes scaleStart {
  0%{
    transform: scale(1);
  }
  100%{
    transform: scale(0.6);
  }
}

.animateEnd::before{
  animation: scaleEnd 0.3s;
       animation-fill-mode : forwards;

}
@keyframes scaleEnd {
  0%{
    transform: scale(0.6);
  }
  66%{
    transform: scale(1.2);
  }
  100%{
    transform: scale(1);
  }
}


  .yellowExtend{
    position: relative;
    &::after{
      content: '';
      position: absolute;
      width: 70%;
      height: 70%;
      // background-image: linear-gradient(to right, #F1CB85, #E1B96E);
      background: #E1B96E;
      top: 50%;
      left: 50%;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: yellowExtendAnimate .15s 1;
       animation-fill-mode : forwards;
       animation-timing-function: ease-out;
      z-index: 99
    }
  }
  @keyframes yellowExtendAnimate {
    0% {width: 0%;height: 0%;}
    100% {width: 100%;height: 100%;}
  }


  .bgcStart{
    position: relative;
    &::after{
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.3);
      top: 50%;
      left: 50%;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: bgcStart .15s 1;
       animation-fill-mode : forwards;
       animation-timing-function: ease-out;
      z-index: 99
    }
  }
  @keyframes bgcStart {
    0% {width: 100%;height: 100%;}
    100% {width: 110%;height: 110%;}
  }


</style>
