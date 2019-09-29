<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, {'close': isClose},'page']">
      <topbar 
        v-if="deviceAttrs.switch == 'on'&& deviceAttrs.connectivity == 'online'"
        :title="device.device_name"
        :bak-color="bakColor"
        white />
      <topbar 
        v-else
        :title="device.device_name"
        bak-color="#000" />
      <div class="main center">
        <img 
          v-if="deviceAttrs.switch == 'on'&& deviceAttrs.connectivity == 'online'"
          class="bg"
          src="../../../../lib/base/hongyan_plug/assets/plug_on.png">
        <img 
          v-else
          class="isgray"
          src="../../../../lib/base/hongyan_plug/assets/plug_off.png">
      </div>
      <!-- 当前状态 -->
      <div 
        class="status">
        <div 
          v-show="!isOffline&&deviceAttrs.child == 'on'" 
        >童锁开启中...</div>
      </div>
      <div 
        class="electricity">
        <div class="electric">
          <div 
            v-if="deviceAttrs.switch == 'on'&& deviceAttrs.connectivity == 'online'"
            class="current">{{ deviceAttrs.current.toFixed(1) }} <span>A</span></div>
          <div 
            v-else 
            class="current1">_ _<span>A</span></div>
          <p>实时电流</p>
        </div>
        <div class="electric">
          <div 
            v-if="deviceAttrs.switch == 'on'&& deviceAttrs.connectivity == 'online'"
            class="current">{{ deviceAttrs.voltage.toFixed(1) }} <span>V</span></div>
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
            :class="[{ 'active': !isClose&&!isOffline }, 'btn-swich btn center']"
            @click="setSwitch" />
          <div class="btn-name">开关</div>
        </div>
        <!-- <div 
          class="btn-wrap"
          @click="setTime">
          <div :class="[ { 'active': deviceAttrs.order_time > 0}, 'btn btn-time center']" />
          <div class="btn-name">定时 </div>
        </div> -->
        <div 
          :class="[{'up-index': !isOffline }, 'btn-wrap']"
          @click="childLockSwitch">
          <div :class="[{ 'active': deviceAttrs.child == 'on'&&!isOffline }, 'btn btn-lock center']" />
          <div class="btn-name">童锁</div>
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
    }
  },
  computed: {
    ...mapGetters(['isClose','isOffline']),
    ...mapState(['device', 'deviceAttrs']),
    // isClose(){
    //   return this.deviceAttrs.switch === 'on' ? false : true
    // },
    bakColor(){
      return this.isClose ? '#000' : '#fff'
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
    setSwitch() {
      if (this.isOffline) return
      if (this.deviceAttrs.child == 'on') {
         return HdSmart.UI.toast('请先关闭童锁')
      }
      let switchStatus = ''
      if (this.deviceAttrs.switch == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.controlDevice("switch", switchStatus)
    },
    // 童锁
    childLockSwitch() {
      let childLockStatus = ''
      if (this.deviceAttrs.child == 'on') {
        childLockStatus = 'off'
      } else {
        childLockStatus = 'on'
      }
      this.controlDevice("child", childLockStatus)
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
@imgPath: 'base/air_condition/assets/new-air';

.body {
  min-height: 100%;
}
.icon-more::before{
  // background-image: url(~@lib/base/fridge/assets/add.png);
  background-image: url(~@lib/base/img/detail1.png)!important
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
  .main {
    position: relative;
    &.center {
      flex-direction: column;
    }
    .bg{
      width: 110%;
      height: 110%;
      margin-top: -100px;
    }
    .isgray {
      width: 452px;
      margin-top: 8vh;
    }
  }
  .status{
    text-align: center;
    font-size: 24px;
    color: #fff;
    margin: -80px auto 30px auto;
    width: 100%;
    height: 14px;
  }
  .panel-btn {
    height: 306px;
    width: 100%;
    position: fixed;
    bottom: 0;
    background: #ffffff;
    z-index: 99999;
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
    &.center{
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
    .btn-lock {
      &::before {
        background-image: url(~@lib/base/hongyan_plug/assets/lock.png);
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
      .status {
        z-index: 99999;
        position: relative;
        top: 140px;
        color: #20282B;
        opacity: .8;
      }
    }
    .panel-btn {
      background: #efefef;
    }
    .btn-wrap {
      opacity: .2;
      &.up-index {
        opacity: 1;
        .btn-swich{
          z-index:999999;
        }
      }
      .btn {
        &.active {
           &.active {
        background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
        border-color: #ffbf00;
      }
          // background: #fff;
          // border: 1px solid #818181;
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
        margin-top: 30px;
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
</style>
