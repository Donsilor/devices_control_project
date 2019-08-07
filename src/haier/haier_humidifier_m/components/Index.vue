<template>
  <div>
    <div :class="[{ 'offline': isOffline }, { 'close': isClose },{'filter': showModeBtns }, 'page']">
      <div class="bg">
        <topbar
          :transparent="true"
          bak-color="#000"
          title="卧室的加湿器" />
        <!-- 离线提示 -->
        <!-- <div 
          v-show="isOffline"
          class="offline">
          <i class="attention" />
          设备已离线，查看帮助
        </div> -->

        <div class="main">
          <div class="wrap-num">
            <div class="num-item">
              <div class="num">46.4<sup>%</sup></div>
              <div>室外湿度</div>
            </div>
            <div class="num-item">
              <i class="icon" />
              <div class="num">26<sup>℃</sup></div>
              <div>室内温度</div>
            </div>
          </div>

          <div class="content center">
            <div class="status">
              <i :class="[rankClass, 'status-img']" />
              <div class="num">{{ attr.current_humidity }}<sup>%</sup></div>
              <div>室内湿度，{{ rankTxt }}</div>
            </div>
            <div class="list">
              <ul>
                <li 
                  v-for="i in 19"
                  :class="['circle' + i, i === rank ? 'active' : '']"
                  :key="i"/>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="panel-btn">
        <div 
          class="btn-wrap btns swich"
          @click="setSwitch" >
          <div class="btn btn-swich center"/>
          <div class="btn-name">开关</div>
        </div>

        <div 
          class="btn-wrap btns" 
          @click="handeModeClick">
          <div :class="[btnClass,'btn center']"/>
          <div class="btn-name">档位</div>
        </div>

        <!-- <div 
          class="btn-wrap btns" 
          @click="showTime">
          <div class="btn btn-time center"/>
          <div class="btn-name">2′25″后关机</div>
        </div> -->
      </div>
      <model-time 
        ref="time" 
        @selectedTime="setReserve" />
    </div>

    <!-- 模式选择弹框 -->
    <div
      v-show="showModeBtns"
      class="btns-panel center"
      @touchmove.prevent
      @click="hide">
      <div class="items btns">
        <div
          :class="[{ 'item1': animation }, 'btn btn-low center']"
          @click.stop="setSpeed('1')">
          <div class="name">低挡</div>
        </div>
        <div
          :class="[{ 'item2': animation }, 'btn btn-middle center']"
          @click.stop="setSpeed('2')">
          <div class="name">中档</div>
        </div>
        <div
          :class="[{ 'item3': animation }, 'btn btn-high center']"
          @click.stop="setSpeed('3')">
          <div class="name">高档</div>
        </div>
        <div
          :class="[ { 'item6': animation }, btnClass,'btn center active']"
          @click.stop />
      </div>
    </div>
  </div>
</template>

<script>
import time from './time/time.vue'

export default {
  components: {
    'model-time': time
  },
  data() {
    return {
      showModeBtns: false,
      animation: false,

      attr: {
        switchStatus: "on",
        constant_humidity: "on",
        status_fog: "2",
        current_humidity: "60",
        heat_switch: "on",
        target_humidity: "90",
        water_status: "on",
        uv: "on",
        light_switch: "on",
        error_code: "normal",
        alarm_cancel: "on",
        no_atomizing_head: "on",
        cover_not_closed: "on",
        connectivity: 'online'
      },
      tdsModalVisible: false
    }
  },
  computed: {
    isClose() {
      let status = this.attr.switchStatus === 'on' ? false : true
      return status
    },
    isOffline() {
      let status = this.attr.connectivity === 'online' ? false : true
      return status
    },
    rank(){
      return Math.round(this.attr.current_humidity/10) * 2
    },
    rankTxt() {
      if(this.attr.current_humidity < 40 ) {
        return '干燥'
      } else if(this.attr.current_humidity < 70 ) {
        return '舒适'
      } else {
        return '潮湿'
      }
    },
    rankClass() {
      if(this.attr.current_humidity < 40 ) {
        return 'hot'
      } else if(this.attr.current_humidity < 70 ) {
        return 'comfortable'
      } else {
        return 'wet'
      }
    },
    btnClass() {
      /* eslint-disable no-unreachable */
      switch (this.attr.status_fog) {
        case '1':
          return 'btn-low'
          break
        case '2':
          return 'btn-middle'
          break
        case '3':
          return 'btn-high'
          break
        case '4':
          return 'btn-very_high'
          break
        case '5':
          return 'btn-super_high'
          break
      }
    },
  },
  watch: {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      HdSmart.ready(() => {
        this.getSnapShot()
      })
      HdSmart.onDeviceStateChange(res => {
        this.onSuccess(res.result)
      })
    },
    tdsModalVisibleControl() {
        //点击TDS按钮
        this.tdsModalVisible = !this.tdsModalVisible
    },
    getSnapShot() {
      HdSmart.Device.getSnapShot(
        data => {
          console.log(data)
          this.onSuccess(data)
        },
        () => {
        }
      )
    },
    onSuccess(data) {
      this.attr = data.attribute
    },
    controlDevice(attr, val, success) {
      HdSmart.Device.control(
        {
          method: 'dm_set',
          nodeid: `water_filter.main.${attr}`,
          params: {
              attribute: {
                  [attr]: val
              }
          }
        },
        () => {
          success && success()
        },
        () => {}
      )
    },
    showTime() {
      this.$refs.time.show = true
    },
    setSwitch() {
      let switchStatus = ''
      if (this.attr.switchStatus == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.controlDevice('switch', switchStatus, () => { }, () => { })
    },
    setReserve(time) {
      let dealTime = parseInt(time.split(':')[0])
      console.log(dealTime)
    },
    setSpeed(val) {
      this.controlDevice("status_fog", val, () => {
        this.hide()
        this.attr.status_fog = val
      })
    },
    hide() {
      this.showModeBtns = false
      this.animation = false
    },
    handeModeClick() {
      this.showModeBtns = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.animation = true
        }, 0)
      })
    }
  }
}
</script>
<style lang="less" scoped>
@lib: '../../../../lib/base/haier_humidifier/assets';
@lib1: '../../../../lib/base/air_condition/assets/new-air';
@lib2: '../../../../lib//base/air_cleaner/assets/new-air';
.page{
  min-height: 100%;
  background: #fff;
  color: #20282B;
  text-align: center;
  &.filter {
    filter: blur(12px);
  }
  .offline {
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.3);
    position: fixed;
    top: 64PX;
    left: 0;
    z-index: 999;

    padding-left: 48px;
    display: flex;
    align-items: center;
    width: 100%;
    height: 88px;
    line-height: 88px;

    font-size: 32px;
    color: #20282B;
    .attention {
      display: inline-block;
      width: 36px;
      height: 36px;
      background-image: url('@{lib1}/icon-tips.png');
      background-size: 100% 100%;
      margin-right: 12px;
    }
    &:after {
      position: absolute;
      right: 50px;
      top: 50%;
      display: inline-block;
      content: "";
      width: 15px;
      height: 15px;
      border: 2px solid #fff;
      border-width: 2px 2px 0 0;
      -webkit-transform: translate(0, -50%) rotate(45deg);
      transform: translate(0, -50%) rotate(45deg);
    }
  }

  .main{
    padding: 0 48px;
    font-size: 24px;
    color: #20282B;
    .wrap-num{
      display: flex;
      justify-content: center;
      border-bottom: 1px solid #737373;
      .num-item{
        padding: 30px 86px;
        .num{
          position: relative;
          font-size: 80px;
        }
      }
    }
    .content{
      margin: 26px 0;
    }
    .status{
      margin-right: 167px;
      .status-img{
        display: block;
        width: 48px;
        height: 48px;
        margin: auto;
        &.comfortable{
          background-image: url('@{lib}/comfortable.png');
          background-size: 100% 100%;
        }
        &.hot{
          background-image: url('@{lib}/hot.png');
          background-size: 100% 100%;
        }
        &.wet{
          background-image: url('@{lib}/wet.png');
          background-size: 100% 100%;
        }
      }
      .num{
        position: relative;
        line-height: 1;
        font-size: 280px;
        sup{
          font-size: 32px;
          top: 25px;
        }
      }
    }
    sup{
      position: absolute;
      top: 10px;
      right: 10;
      font-size: 24px;
    }

    .list ul{
      list-style: none;
      // background-image: linear-gradient(0deg, #FF670B 0%, #02BD78 50%, #0289BD 100%);
      li{
        margin: 20px auto;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        &.circle1{
          background: #f66a0f;
        }
        &.circle2{
          background: #f66a0f;
          &.active{
            background-image: url('@{lib}/ico_hm_10.png');
            background-size: 100% 100%;
          }
        }
        &.circle3{
          background: #c57a24;
        }
        &.circle4{
          background: #c57a24;
          &.active{
            background-image: url('@{lib}/ico_hm_20.png');
            background-size: 100% 100%;
          }
        }
        &.circle5{
          background: #b3812c;
        }
        &.circle6{
          background: #b3812c;
          &.active{
            background-image: url('@{lib}/ico_hm_30.png');
            background-size: 100% 100%;
          }
        }
        &.circle7{
          background: #649c4e;
        }
        &.circle8{
          background: #649c4e;
          &.active{
            background-image: url('@{lib}/ico_hm_40.png');
            background-size: 100% 100%;
          }
        }
        &.circle9{
          background: #37ab61;
        }
        &.circle10{
          background: #37ab61;
          &.active{
            background-image: url('@{lib}/ico_hm_50.png');
            background-size: 100% 100%;
          }
        }
        &.circle11{
          background: #02bc7a;
        }
        &.circle12{
          background: #02bc7a;
          &.active{
            background-image: url('@{lib}/ico_hm_60.png');
            background-size: 100% 100%;
          }
        }
        &.circle13{
          background: #02b681;
        }
        &.circle14{
          background: #02b681;
          &.active{
            background-image: url('@{lib}/ico_hm_70.png');
            background-size: 100% 100%;
          }
        }
        &.circle15{
          background: #029ea1;
        }
        &.circle16{
          background: #029ea1;
          &.active{
            background-image: url('@{lib}/ico_hm_80.png');
            background-size: 100% 100%;
          }
        }
        &.circle17{
          background: #0294ae;
        }
        &.circle18{
          background: #0294ae;
          &.active{
            background-image: url('@{lib}/ico_hm_90.png');
            background-size: 100% 100%;
          }
        }
        &.circle19{
          background: #028bba;
        }

        &.circle1, &.circle19{
          width: 2px;
          height: 2px;
        }
        &.circle2, &.circle18{
          width: 4px;
          height: 4px;
        }
        &.circle3, &.circle17{
          width: 6px;
          height: 6px;
        }
        &.circle4, &.circle16{
          width: 8px;
          height: 8px;
        }
        &.circle5, &.circle15{
          width: 10px;
          height: 10px;
        }
        &.circle6, &.circle14{
          width: 12px;
          height: 12px;
        }
        &.circle7, &.circle13{
          width: 14px;
          height: 14px;
        }
        &.circle8, &.circle12{
          width: 16px;
          height: 16px;
        }
        &.circle9, &.circle11{
          width: 18px;
          height: 18px;
        }
        &.circle10{
          width: 20px;
          height: 20px;
        }
        &.active{
          width: 44px;
          height: 68px;
          background: none;
        }
      }
    }
  }

  .panel-btn{
    background: #fff;
    box-shadow: 0 -30px 56px 0 rgba(17,17,17,0.10);
    border-radius: 42px 42px 0px 0px;
    display: flex;
    justify-content: center;

  }

  .btns {
    
    margin: 0 36px;
    padding-top: 40px;
    .btn {
      box-sizing: border-box;
      margin: 0 auto;
      width: 120px;
      height: 120px;
      border: 1px solid #20282B;
      box-shadow: 0 -3px 28px 0 rgba(209, 209, 209, 0.5);
      border-radius: 50%;

      display: flex;
      flex-direction: column;
      &.active {
        background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
        border: none;
      }
    }
    .btn-name{
      margin-top: 14px;
      font-size: 24px;
    }
    .btn-swich{
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/swich-black.png');
        background-size: 100% 100%;
      }
    }
    .btn-time{
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/time-black.png');
        background-size: 100% 100%;
      }
    }
    .btn-high{
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/speed3.png');
        background-size: 100% 100%;
      }
    }
    .btn-middle{
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/speed2.png');
        background-size: 100% 100%;
      }
    }
    .btn-low{
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/speed1.png');
        background-size: 100% 100%;
      }
    }
  }

  &.offline,
  &.close {
    &:before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 999;
      width: 100%;

      background: rgba(46, 46, 46, .8);
    }
    .panel-btn .btns {
      &.swich{
        z-index: 999;
      }
      .btn-swich {
        position: relative;
        z-index: 10;
        border: 1px solid #fff;
        background-image: none;

        &::before {
          content: "";
          display: block;
          width: 44px;
          height: 44px;
          background-image: url('@{lib1}/swich-white.png');
          background-size: 100% 100%;
        }
        &.active {
          &::before {
            background-image: url('@{lib1}/swich-white.png');
          }
        }
      }
    }
  }

  &.offline{
    .panel-btn .btns {
      &.swich{
        z-index: 9;
      }
      .btn-swich{
        border: 1px solid #20282B;
        &::before {
          content: "";
          display: block;
          width: 44px;
          height: 44px;
          background-image: url('@{lib}/swich-black.png');
          background-size: 100% 100%;
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
    left: 410px;
    top: 999px;
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
  .btns{
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
        background-image: url('@{lib2}/swich-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib2}/swich-black.png');
        }
      }
    }

    .btn-low {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib2}/speed1-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib2}/speed1.png');
        }
      }
    }
    .btn-middle {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib2}/speed2-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib2}/speed2.png');
        }
      }
    }
    .btn-high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib2}/speed3-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib2}/speed3.png');
        }
      }
    }
    .btn-very_high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib2}/speed4-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib2}/speed4.png');
        }
      }
    }
    .btn-super_high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib2}/speed5-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib2}/speed5.png');
        }
      }
    }
  }
}
</style>
