<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']">
      <NewTopBar
        :title="device.device_name"
        bak-color="#000"
        @shutdownCallback="shutdowncallback('off')" />
      <!--模式-->
      <div class="main center">
        <div class="status">
          <!--          <p>水箱已打开</p>-->
          <p>{{ deviceAttrs.PushRod == 0 ? '水箱已关闭' : deviceAttrs.PushRod == 1 ? '水箱已打开' : '' }}</p>
          <p v-if="deviceAttrs.PushRod == 1">关闭水箱后可以继续使用</p>
        </div>
      </div>
      <!--开机后按钮-->
      <div class="tool-bar">
        <ul>
          <li style="padding-top: 12px;">
            <div>
              <p
                class="water-box btn-styl"
                @click="closeWaterBox"
                @touchstart="touchstart"
                @touchend="touchend"
              />
              <p>{{ deviceAttrs.PushRod == 0 ? '开水箱' : deviceAttrs.PushRod == 1 ? '关水箱' : '' }}</p>
            </div>
          </li>
          <li>
            <div>
              <p
                class="pause btn-style"
                @click="continueCook"/>
              <p>继续</p>
            </div>
          </li>
          <li style="padding-top: 12px;">
            <div>
              <p
                :class="['light', {'btn-style': deviceAttrs.Light == 0}, {'open-light': deviceAttrs.Light == 1}]"
                @click="light"/>
              <p>照明</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapState, mapActions } from 'vuex'
  import TempTimePick from './tempTimePick.vue'
  export default {
    components: {
      TempTimePick
    },
    data() {
      return {
        lightStatus: false,
        presetTemp: '',
        activeMode: ''
      }
    },

    computed: {
      ...mapGetters(['isClose', 'isOffline']),
      ...mapState(['device', 'deviceAttrs'])
    },
    watch: {
      '$route': {
        handler(val) {
          this.activeMode = +val.query.activeMode
        },
        // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
        immediate: true
      },
      'deviceAttrs'(val) {
        console.log('水箱上报接收中', (+new Date().getMinutes()) + 1 + ':' + (+new Date().getSeconds()) + 1)
        console.log(val)
      },
      'deviceAttrs.PushRod'(val) {
        if (val == 0) {
          if (this.deviceAttrs.WorkState == 4) {
            setTimeout(() => {
              this.$router.push('/deviceStatus')
            }, 1000)
          } else if (this.deviceAttrs.WorkState == 1) {
            setTimeout(() => {
              this.$router.push('/devicePause')
            }, 1000)
          } else if (this.deviceAttrs.WorkState == 2) {
            setTimeout(() => {
              this.$router.push('/deviceStatus')
            }, 1000)
          } else {
            setTimeout(() => {
              this.$router.push('/')
            }, 1000)
          }
        }
      },
      'deviceAttrs.WorkState'(val) {
        if (val == 0) {
          if (Math.floor(this.deviceAttrs.RemainingTime) == 0) {
            this.$router.push({path: '/deviceFinish'})
          } else {
            this.$router.push({path: '/'})
          }
        } else if (val == 2 || val == 4) {
          this.$router.push({path: '/deviceStatus'})
        }  else if (val == 1) {
          this.$router.push({path: '/devicePause'})
        }
      }
    },
    created() {
      HdSmart.UI.setStatusBarColor(2)
    },
    mounted() {
    },
    methods: {
      touchstart(e) {
        e.target.classList.add('test')
        e.target.classList.add('yellowExtend')
        setTimeout(() => {
          e.target.classList.remove('yellowExtend')
        }, 400)
        console.log('start', e)
      },
      touchend(e) {
        setTimeout(() => {
          e.target.classList.remove('test')
          // e.target.classList.remove('yellowExtend')
        }, 500)
      },
      ...mapActions(['getDeviceInfo', 'doControlDevice']),
      setRangWidth(val) {
        document.querySelector('.rang_width').style.width = val+"%"
      },
      // 开关机
      shutdowncallback(){
        if (this.isOffline) return
        // if (this.deviceAttrs.PowerSwitchAll == 2) {
        //   this.controlDevice('PowerSwitchAll', {PowerSwitchAll: 0})
        // } else if (this.deviceAttrs.PowerSwitchAll == 0) {
        //   this.controlDevice('PowerSwitchAll', {PowerSwitchAll: 2})
        // }
        this.controlDevice('WorkState', {WorkState: 2}).then(res => {
          this.$router.push('/')
        })
      },
      controlDevice(attr, param={}) {
        return this.doControlDevice({
          nodeid: `airconditioner.main.${attr}`,
          params: {
            attribute: {
              ...param
            }
          }
        })
      },
      light() {
        // if (this.deviceAttrs.Light == 0) {
        //   this.controlDevice('Light', {Light: 1})
        // } else {
        //   this.controlDevice('Light', {Light: 0})
        // }
        this.controlDevice('Light', {Light: 2})
      },
      continueCook() {
        // 如果没有启动 回到首页 如果启动回到状态页
        // if (this.deviceAttrs.PowerSwitchAll == 2) {
        //   this.controlDevice('WorkState',{WorkState: 0}).then(res => {
        //     this.$router.push({
        //       path: '/deviceStatus',
        //       query: {
        //         preset: this.activeMode === 3 ? 110 : this.presetTemp,
        //         activeMode : this.activeMode
        //       }
        //     })
        //   })
        // } else {
        //   this.$router.push({path: '/'})
        // }
        this.$router.go(-1)
      },
      closeWaterBox() {
        // if (this.deviceAttrs.PushRod == 3) {
        //   this.controlDevice('openWaterBox', {PushRod: 0}).then(() => {
        //     this.$router.push({path:'/waterBoxOpen'})
        //   })
        // } else {
        //   this.controlDevice('openWaterBox', {PushRod: 3}).then(() => {
        //     this.$router.push({path:'/waterBoxOpen'})
        //   })
        // }
        this.controlDevice('openWaterBox', {PushRod: 3})
      }
    }
  }
</script>
<style lang="less" scoped>
  @imgPath: 'base/fantai_steam_cooker/assets';
  @imgPath1: 'base/oakes_air_condition/assets';
  .body {
    min-height: 100%;
    touch-action: none;
  }
  .page {
    height: 100vh;
    min-height: 550px;
    overflow-x: hidden;
    position: relative;
    background-image: url('~@lib/@{imgPath1}/img_bg_01@2x.png');
    background-size: 100% 100%;
    &::-webkit-scrollbar {
      display: none;
    }
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
        background: rgba(0,0,0,0.04);
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
      margin-top: 300px;
      &.center {
        flex-direction: column;
      }
      .mode {
        display: flex;
        font-size: 32px;
        width: 90%;
        margin: 0 auto;
        border-bottom: 4px solid rgba(0,0,0,0.08);
        li{
          width: 25%;
          text-align: center;
          padding: 20px 0;
          opacity: 0.5;
          &.active{
            color: #000000;
            opacity: 1 !important;
            position:relative;
            &::before{
              content: '';
              width: 100%;
              height: 0.07rem;
              background-color: #000000;
              position: absolute;
              left:50%;
              transform:translateX(-50%);
              bottom: -3px;
            }
          }
        }
      }
      .status{
        width: 84%;
        margin: 0 auto;
        text-align: center;
        p:nth-child(1) {
          font-size: 92px;
          height: 160px;
          line-height: 160px;
        }
        p:nth-child(2) {
          font-size: 48px;
          opacity: 0.5;
          height: 48px;
          line-height: 48px;
          padding-top: 20px;
        }
      }
    }
    .tool-bar {
      /*position: absolute;*/
      /*bottom: 15vw;*/
      width: 80%;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 121px;
      ul {
        width: 100%;
        margin: 0 auto;
        display: flex;
        font-size: 24px;
        justify-content: space-around;
        li{
          width: 16vw;
          text-align: center;
          p:first-of-type{
            width: 120px;
            height: 120px;
            border-radius: 50%;
            &::before{
              content:'';
              position:absolute;
              top:0;
              left:0;
              right:0;
              bottom:0;
              filter:blur(100px) contrast(.8);
              z-index:-1;
            }
          }
          p:last-child{
            padding-top: 1.4vh;
          }
        }
        li:nth-child(2) {
          font-size: 28px;
          width: 18.5vw;
          p{
            width: 140px;
            height: 140px;
          }
        }
      }
      .water-box{
        background: url('~@lib/@{imgPath}/btn_ac_on_cda@2x.png') no-repeat center center;
        background-size: 48px 48px;
      }
      .start{
        background: url('~@lib/@{imgPath}/qidong@3x.png') no-repeat center center;
        background-size: 80px 80px;
      }
      .light{
        background: url('~@lib/@{imgPath}/btn_ac_on_cdb@2x.png') no-repeat center center;
        background-size: 48px 48px;
      }
      .pause{
        background: url('~@lib/@{imgPath}/qidong@3x.png') no-repeat center center;
        background-size: 80px 80px;
      }
      .open-light {
        background: url('~@lib/@{imgPath}/btn_ac_on_cdbb@2x.png') no-repeat center center;
        background-color: #000;
        background-size: 48px 48px;
      }
    }
    .close-style{
      opacity: 0.2;
    }
  }
  .test {
    animation: iconScale .5s;
    animation-timing-function: ease;
  }
  .yellowExtend{
    position: relative;
    &::after{
      content: '';
      position: absolute;
      width: 70%;
      height: 70%;
      background-image: linear-gradient(221deg, #F1CB85 10%, #E1B96E 81%);
      top: 50%;
      left: 50%;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: yellowExtendAnimate .5s 1;
      z-index: -99;
    }
  }
  @keyframes iconScale {
    0% {background-size: 48px 48px;}
    15% {background-size: 22px 22px;}
    50% {background-size: 48px 48px;}
    95% {background-size: 56px 56px;}
    100% {background-size: 60px 60px;}
  }
  @keyframes yellowExtendAnimate {
    0% {width: 80%;height: 80%;}
    50% {width: 90%;height: 90%;}
    100% {width: 100%;height: 100%;}
  }
</style>
