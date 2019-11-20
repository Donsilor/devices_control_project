<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']">
      <NewTopBar
        :title="device.device_name"
        :shutdown="isClose == false || isOffline == true"
        :class-name="opcityStyle"
        bak-color="#000"
        @shutdownCallback="shutdowncallback('off')" />
      <!--模式-->
      <div class="main center">
        <ul 
          v-if="deviceAttrs.PowerSwitchAll === 2" 
          class="mode">
          <li 
            v-for="(v, i) in modeList" 
            :key="v.name" 
            :class="[{'active': activeMode === i}]" 
            @click="activeMode = i">{{ v.name }}</li>
        </ul>
        <!-- 时间选择器-->
        <temp-time-pick 
          v-if="activeMode != 3" 
          ref="tempTimePick" 
          :class="{'close-style': deviceAttrs.PowerSwitchAll != 2}" 
          :active-mode="activeMode" 
          style="width: 90%;"/>
        <div 
          v-if="activeMode === 3" 
          class="clear-dash">
          <div>
            <p class="clear-dash-time">1小时11分钟</p>
            <p class="clear-dash-text">除垢用时</p>
          </div>
          <div class="clear-dash-tips">
            <p>请在水箱内加入1包除垢剂</p>
            <p>添加水至除垢水位</p>
          </div>
        </div>
      </div>
      <div 
        v-if="activeMode != 3" 
        :class="{'close-style': deviceAttrs.PowerSwitchAll != 2}" 
        style="position: relative;top: -20px;">
        <ul class="tips">
          <li>烹饪温度</li>
          <li class="padl">烹饪时长</li>
        </ul>
      </div>
      <!-- 开机键-->
      <div 
        v-if="deviceAttrs.PowerSwitchAll === 0" 
        class="openDeviceBtn-box">
        <p 
          class="openDeviceBtn" 
          @click="tuenOn"/>
        <p>开机</p>
      </div>
      <!--开机后按钮-->
      <div 
        v-if="deviceAttrs.PowerSwitchAll === 2" 
        class="tool-bar">
        <ul>
          <li style="padding-top: 12px;">
            <div>
              <p class="water-box"/>
              <p>开水箱</p>
            </div>
          </li>
          <li>
            <div>
              <p 
                class="start" 
                @click="startWork"/>
              <p>启动</p>
            </div>
          </li>
          <li style="padding-top: 12px;">
            <div>
              <p class="light"/>
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
        activeMode: 0
      }
    },

    computed: {
      ...mapGetters(['isClose', 'isOffline']),
      ...mapState(['device', 'deviceAttrs'])
    },
    watch: {

    },
    created() {
      HdSmart.ready(() => {
        this.getDeviceInfo()
          .then(() => {

          })
      })
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
      shutdowncallback(val){
        if (this.isOffline) return
        this.controlDevice('switch',val)
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
      // 开机
      tuenOn() {
        this.controlDevice('PowerSwitchAll', {PowerSwitchAll: 2})
      },
      //启动
      startWork() {
        if (!this.$refs['tempTimePick'].time) {
          HdSmart.UI.toast('请设定时长')
          return
        }
        if (this.activeMode !== 3) {
          var data = this.$refs['tempTimePick'].time.split(':')
          var [tempIndex, h, m] = data
          var temp = this.activeMode === 0 ? +tempIndex + 30 : this.activeMode === 1 ? +tempIndex + 110 : this.activeMode === 2 ? +tempIndex + 40 : this.activeMode === 3 ? +tempIndex + 110 : ''
        }
        let mode = this.activeMode === 0 || this.activeMode === 1 ? 1 : this.activeMode === 2 ? 4 :this.activeMode === 3 ? 3 : ''
        let obj = {
            WorkMode: mode,
            SetTemperature1: this.activeMode === 3 ? 110 : temp,
            SetWorkTime: this.activeMode === 3 ? 71 : h*60 +(+m),
            WorkState: 0
        }
        this.controlDevice('startWork', obj).then(res => {
          this.$router.push('/deviceStatus')
        })
        this.$router.push({path: '/deviceStatus'})
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
      margin-top: 7vh;
      position: relative;
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
    }
    .tips {
      display: flex;
      width: 90%;
      margin: 0 auto;
      li {
        font-size: 32px;
        opacity: 0.8;
        &:first-of-type{
          // width: 37%;
          padding-left: 20px;
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
            border: 1px solid #ccc;
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
    }
    .close-style{
      opacity: 0.2;
    }
    .openDeviceBtn-box{
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 380px;
      p:last-child{
        font-size: 24px;
        text-align: center;
        padding-top: 16px;
      }
    }
    .openDeviceBtn{
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 1px solid #ccc;
      background: url('~@lib/@{imgPath}/yiguanbi@2x.png') no-repeat center center;
      background-size: 76px 76px;
    }
    .clear-dash{
      width: 75%;
      margin: 0 auto;
      margin-top: 10vh;
      .clear-dash-time{
        font-size: 92px;
        text-align: center;
      }
      .clear-dash-text{
        font-size: 48px;
        opacity: 0.5;
        text-align: center;
        margin-top: 2vh;
      }
      .clear-dash-tips{
        font-size: 28px;
        text-align: center;
        margin-top: 15vh;
      }
    }
  }
.padl{
  padding-left: 170px;
}
</style>
