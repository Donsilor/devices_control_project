<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']">
      <NewTopBar
        :title="device.device_name"
        :shutdown="true"
        :class-name="opcityStyle"
        bak-color="#000"
        @shutdownCallback="shutdowncallback('off')" />
      <!--模式-->
      <div class="main center">
        <div class="status">
          <p>{{ transTime(deviceAttrs.RemainingTime) }}</p>
          <p>
            当前 {{ deviceAttrs.SetTemperature1 }}℃ | 预设 {{ presetTemp }}℃
          </p>
          <p v-if="!isOffline">{{ deviceAttrs.WorkState | modeType }}</p>
          <p v-else>设备离线中</p>
        </div>
      </div>
      <!--开机后按钮-->
      <div class="tool-bar">
        <ul>
          <li style="padding-top: 12px;">
            <div>
              <p class="water-box btn-style" @click="openWaterBox"></p>
              <p>开水箱</p>
            </div>
          </li>
          <li>
            <div v-if="deviceAttrs.PowerSwitchAll === 1">
              <p class="start btn-style"></p>
              <p>启动</p>
            </div>
            <div v-if="deviceAttrs.PowerSwitchAll === 2">
              <p class="pause btn-style" @click="pause"></p>
              <p>暂停</p>
            </div>
          </li>
          <li style="padding-top: 12px;">
            <div>
              <p :class="['light', 'btn-style', {'open-light': lightStatus}]" @click="light"></p>
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
        opcityStyle: 'opcity-0',
        modeList: [
          {
            name: '普通蒸'
          },
          {
            name: '高温蒸'
          },
          {
            name: '解冻'
          },
          {
            name: '除垢'
          }
        ],
        activeMode: 0,
        lightStatus: false,
        presetTemp: ''
      }
    },
    computed: {
      ...mapGetters(['isClose', 'isOffline']),
      ...mapState(['device', 'deviceAttrs'])
    },
    watch: {
      'deviceAttrs.WaterShortage'(val) {
        console.log('缺水监听')
        if (val === '1') {
          this.$router.push({path: '/devicePause'})
        }
      },
      '$route': {
        handler(val) {
          this.presetTemp = val.query.preset
        },
        // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
        immediate: true
      }
    },
    created() {
      HdSmart.ready(() => {
        this.getDeviceInfo()
          .then(() => {

          })
      })
      if (this.deviceAttrs.WaterShortage === '1') {
        this.$router.push({path: '/devicePause'})
      }
    },
    mounted() {
      let pageNode = document.querySelector('.page')
      pageNode.addEventListener('scroll', (e) => {
        // console.log(e.target.scrollTop)
        let scrollHeight = e.target.scrollTop
        if (scrollHeight === 0) {
          this.opcityStyle = 'opcity-0'
        } else if (scrollHeight < 20) {
          this.opcityStyle = 'opcity-20'
        }else if (scrollHeight < 40 ) {
          this.opcityStyle = 'opcity-40'
        }else if (scrollHeight < 60) {
          this.opcityStyle = 'opcity-60'
        }else if (scrollHeight < 80) {
          this.opcityStyle = 'opcity-80'
        }
      })
    },
    methods: {
      ...mapActions(['getDeviceInfo', 'doControlDevice']),
      setRangWidth(val) {
        document.querySelector('.rang_width').style.width = val+"%"
      },
      // 开关机
      shutdowncallback(){
        if (this.isOffline) return
        if (this.deviceAttrs.PowerSwitchAll === 2) {
          this.controlDevice('PowerSwitchAll', {PowerSwitchAll: 0})
        } else if (this.deviceAttrs.PowerSwitchAll === 0) {
          this.controlDevice('PowerSwitchAll', {PowerSwitchAll: 2})
        }
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
      pause() {
        this.controlDevice('WorkState', {WorkState: '1'}).then(res => {
          this.$router.push({
            path:'/devicePause',
            query: {
              preset: this.activeMode === 3 ? 110 : this.presetTemp
            }
          })
        })
        this.$router.push({
          path:'/devicePause',
          query: {
            preset: this.activeMode === 3 ? 110 : this.presetTemp
          }
        })
      },
      openWaterBox() {
        this.controlDevice('openWaterBox', {PushRod: '3'}).then(() => {
          this.$router.push({path:'/waterBoxOpen'})
        })
        this.$router.push({path:'/waterBoxOpen'})
      },
      light() {
        this.lightStatus = !this.lightStatus
      },
      transTime(time) {
        if (!time) {
          return
        }
        let numTime = parseInt(time)
        let h = ''
        let m = ''
        if (numTime >= 60) {
          h = Math.floor(h/60)
          m = numTime % 60 === 0 ? '00' : numTime % 60
        } else {
          h = '00'
          m = numTime < 10 ? '0' + numTime : numTime
        }
        return h + ':' + m
      }
    }
  }
</script>
<style lang="less" scoped>
  @imgPath: 'base/fantai_steam_cooker/assets';
  @imgPath1: 'base/oakes_air_condition/assets';
  .body {
    min-height: 100%;
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
          font-size: 160px;
          height: 160px;
          line-height: 160px;
        }
        p:nth-child(2) {
          font-size: 32px;
          opacity: 0.8;
          height: 44px;
          line-height: 44px;
          padding-top: 20px;
        }
        p:nth-child(3) {
          font-size: 48px;
          padding-top: 40px;
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
        background: url('~@lib/@{imgPath}/zanting@3x.png') no-repeat center center;
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

</style>
