/* eslint-disable vue/no-unused-vars */
<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']">
      <NewTopBar
        :title="device.device_name"
        :shutdown="true"
        bak-color="#000"
        @shutdownCallback="shutdowncallback('close')" />
      <!-- tab切换栏 -->
      <div
        class="main center"
        style="margin-top:52px">
        <div class="bg"><div class="circle"><div class="status">{{ deviceAttrs.switch=='open'?'通电中':'断电中' }}</div></div></div>
      </div>
      <div class="status1">{{ deviceAttrs.countdownOpen | closeTime }}后断电</div>
      <div
        v-show="!isOffline"
        class="panel-btn center">
        <div
          class="btn-wrap"
          @click="setSwitch">
          <div :class="[{ 'btn-source': deviceAttrs.switch == 'close' },{ 'btn-over': deviceAttrs.switch == 'open' } ,'btn btn-source center']" />
          <div class="btn-name">{{ deviceAttrs.switch=='open'?'断电':'通电' }}</div>
        </div>
<<<<<<< HEAD
        <div 
=======
        <div
          class="btn-wrap"
>>>>>>> 88ecc6fbfe7ca3a339541b80865272aee107b87c
          v-if="deviceAttrs.countdownOpen=='0'"
          class="btn-wrap"
          @click="showTime('设置延时断电')">
          <div :class="['btn btn-delay center']" />
          <div class="btn-name">延时断电</div>
        </div>
<<<<<<< HEAD
        <div 
          v-else
          class="btn-wrap">
          <div  
            :class="['btn btn-delay center']"
=======
         <div
         v-else
          class="btn-wrap">
          <div
>>>>>>> 88ecc6fbfe7ca3a339541b80865272aee107b87c
            @touchstart="touchStart($event)"
            @touchmove="touchMove($event)" 
            @touchend="touchEnd($event)" />
          <div class="btn-name">取消延迟</div>
        </div>
<<<<<<< HEAD
        <!-- <div 
=======
        <div
>>>>>>> 88ecc6fbfe7ca3a339541b80865272aee107b87c
          style="visibility:hidden"
          class="btn-wrap"/> -->
      </div>

      <div class="bottom">
        <div class="timing">
          <div>定时</div>
          <div
            v-if="deviceAttrs.switch=='open'"
            class="timing-right"
            @click="showTime('设置关机时间')">{{ deviceAttrs.closeTime | closeTime }} > </div>
          <div
            v-else
            class="timing-right"
            @click="showTime('设置开机时间')">{{ deviceAttrs.closeTime | openTime }} > </div>
        </div>
        <div class="Charging-protection">
          <div>充电保护</div>
          <div><input
            :checked="deviceAttrs.ovp=='open'"
            class="switch switch-anim"
            type="checkbox"
            @click="lock"></div>
        </div>
      </div>
      <!-- 时间选择 -->
      <SelectTime
        ref="time"
        :title="title"
        @selectedTime="setReserve"
        @canceltime="canceltime" />
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper'
import { mapGetters, mapState, mapActions } from 'vuex'
import SelectTime from './components/time.vue'
export default {
 components: {
    SelectTime
  },
  data() {
    return {
      temp:true,
      timeOutEvent:'',
      a:"",
      currentMode:'normal',
      title:""
    }
  },
  computed: {
    ...mapGetters(['isClose','isOffline']),
    ...mapState(['device', 'deviceAttrs']),
    bakColor(){
      return this.isClose ? '#000' : '#fff'
    },

  },
  watch: {
    'device.stateChange'(){
      this.$nextTick(()=>{
        //  this.newRatio()
      })
    },
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
      .then(()=>{

      })
      // HdSmart.UI.setStatusBarColor(2)
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    // 开关机
    setSwitch(){
      console.log(1)
      if (this.isOffline) return
      console.log(2)
      let switchStatus = ''
      if (this.deviceAttrs.switch=='close') {
        switchStatus = 'open'
      }else{
        switchStatus = 'close'
      }
      this.controlDevice('switch',switchStatus)
    },
    // tab切换
    tabMode(t){
      this.temp = t
    },
    // 长按事件
    touchStart(e){
      console.log(e)
      this.timeOutEvent=setTimeout(() => {
        this.longPress()
      }, 1000)
    },
    //如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
    touchMove(e){
      clearTimeout(this.timeOutEvent)
      this.timeOutEvent=0
    },
    touchEnd(e){
      clearTimeout(this.timeOutEvent)//清除定时器
      this.timeOutEvent=0
      if(this.timeOutEvent!=0){
          // alert("你这是点击，不是长按")
        // this.$refs.black.className.add('active')
      }
      return false
    },
    longPress(){
      this.timeOutEvent = 0
      console.log(this.timeOutEvent)
      // alert('长按了')
      this.$nextTick(()=>{
        // 删除延时
        let obj = {
          remove_delay_task: {
            encrptionFlag: '1001'
          }
        }
        this.controlDevice('remove_time',true, obj)
      })
    },
    // 洗涤完成
    finish(){
      this.controlDevice('operation_mode','standby')
    },
    controlDevice(attr, value,params) {
      return this.doControlDevice({
        nodeid: `kongke_plug.main.${attr}`,
        params: {
          attribute: {
            [attr]: value,
            ...params
          }
        }
      })
    },
    lock(e) {
       if (this.isClose) return
      let ovp = ''
      if(e.target.checked){
          ovp = 'open'
      }else{
          ovp = 'close'
      }
       this.controlDevice('ovp',ovp)
      // console.log(e.target.checked)
    },
    showTime(v) {
      console.log('我进来了')
      this.title = v
      // if (this.isClose) return
      this.$refs.time.show = true
    },
    // 设置关机时间
    setReserve(time) {
      console.log(this.title)
      let h = parseInt(time[0].split(':')[0])
      let m = parseInt(time[0].split(':')[1])
      if(this.title=='设置延时断电'){
          let obj = {
            set_delay_task: {
              openEnable: true,
              countdownOpen: h*60+m,
              closeEnable: false,
              countdownClose: 0,
              repeat: '1',
              encrptionFlag: '1001'
            }
          }
          this.controlDevice('countdownOpen',h*60+m, obj)
      }else{
        h = h < 10 ? '0' + h : h
        m = m < 10 ? '0' + m : m
        let time = this.getDateTime(new Date()) + ' ' + h + ':' + m + ':' + '00'
        // 定时开
        let obj1 = {
          set_time_task: {
            openEnable: true,
            openTime: time,
            repeat: "1",
            timerId: "1 ",
            encrptionFlag: '1001',
            timerEnable: false
          }
        }
        // 定时关
        let obj2 = {
          set_time_task: {
            closeEnable: true,
            closeTime: time,
            repeat: "1",
            timerId: "1 ",
            encrptionFlag: '1001',
            timerEnable: false
          }
        }
        let obj3 = this.deviceAttrs.switch === 'on' ? obj1 : obj2
        this.controlDevice('closeTime',h*60+m, obj3)
      }
      console.log(h,m,'hm')
    },
    // 取消定时
    canceltime(){
       this.controlDevice('time',{
            timer_value:0,
            timer_switch:'off'
        }, {
         remove_time_task: {
           timerId: '1',
		       encrptionFlag: '1001'
         }
    })
    },
    getDateTime(date, type) {
      // 时间格式获取
      if (!date) return
      let d = new Date(+date)
      let year = d.getFullYear()
      let month =
        d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
      let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
      let hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
      let minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
      let seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()
      if (type === 'fulltime') {
        return (
          year +
          '-' +
          month +
          '-' +
          day +
          ' ' +
          hours +
          ':' +
          minutes +
          ':' +
          seconds
        )
      } else {
        return year + '-' + month + '-' + day
      }
    }
  }
}
</script>
<style lang="less" scoped>
@imgPath: 'base/new_curtains/assets';
@imgPath1: 'base/dishwasher/assets';
@imgPath2: 'base/kongke_plug/assets';
* { touch-action: pan-y; }
@keyframes progress-bar{
  0% {
      transform: rotate(260deg);
      border: 3px solid transparent;
  }
  100% {
      transform: rotate(358deg);
      border: 3px solid rgba(0, 0, 0, 1);
  }
}
.body {
  min-height: 100%;
}
.page {
  height: 100vh;
  min-height: 550px;
  overflow-x: hidden;
  position: relative;
  background-image: url('~@lib/@{imgPath}/bg_01@2x.png');
  background-size: 100% 100%;
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
      background: #7F7F7F;
  }
  .switch:checked {
      // border-color: #64bd63;
      // box-shadow: #64bd63 0 0 0 16px inset;
      // background-color: #64bd63;
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
  .bottom{
    width: 100%;

    margin-top: 40px;
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
    }

  }
  .main {
    .bg{
      width: 580px;
      height: 580px;
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.1);
      position: relative;
      .circle{
        width: 520px;
        height: 520px;
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, 0.1);
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -260px ;
        margin-top: -260px ;
      }
      .status{
        width: 460px;
        height: 460px;
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, 0.1);
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -230px ;
        margin-top: -230px ;
        font-size: 80px;
        text-align: center;
        line-height: 460px;
      }
    }
  }
  .status1{
    font-size: 28px;
    text-align: center;
    line-height: 28px;
    margin-top: 52px;
  }
  .working{
    margin-top: 20vh;
    .time{
      width: 100%;
      font-size: 146px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 18px;
    }
    .progress{
      font-size:28px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin:24px 0 70px 0;
      .isgray{
        color:#b0b0b0;
        &.ongoing{
          color: #000;
        }
         &.black{
          color: #000;
        }
      }


    }
    .status{
      width: 100%;
      font-size: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .end{
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 20vh;
    .circle{
      width: 140px;
      height: 140px;
      border: 2px solid rgba(0, 0, 0, 0.7);
      border-radius: 50%;
      margin-bottom: 60px;
      &::before{
        display: block;
        content: '√';
        text-align: center;
        line-height: 140px;
      }
    }
    >span{
      font-size: 48px;
    }
    .button{
      width: 90%;
      height: 100px;
      background: #000;
      color: #fff;
      font-size: 32px;
      text-align: center;
      line-height: 100px;
      margin-top: 30vh;
    }
  }
  .closed{
    font-size: 48px;
    text-align: center;
    margin-top: 240px;
  }
  .panel-btn {
    height: auto;
    width: 100%;
    margin-top: 120px;
    position:relative;
    z-index: 99999;
  .btn-wrap {
    margin: 0 24px 24px;
    .btn {
      box-sizing: border-box;
      margin: 0 auto;
      width: 120px;
      height: 120px;
      border: 1px solid #818181;
      border-radius: 50%;
      display: flex;
      justify-content: space-around;
      flex-direction: column;
      position: relative;
      &.btn-source{
        &::before{
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          margin-left: -22px;
          margin-top: -22px;
          background-image: url('~@lib/@{imgPath2}/tongdian.png');
          background-size: 100% 100%;
          width: 44px;
          height: 44px;
        }
      }
      &.btn-over{
        &::before{
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          margin-left: -22px;
          margin-top: -22px;
          background-image: url('~@lib/@{imgPath2}/duandian.png');
          background-size: 100% 100%;
          width: 44px;
          height: 44px;
        }
      }
       &.btn-delay{
        &::before{
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          margin-left: -22px;
          margin-top: -22px;
          background-image: url('~@lib/@{imgPath2}/yanshi.png');
          background-size: 100% 100%;
          width: 44px;
          height: 44px;
        }
      }
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
      }
      &.active {
        background: #000;
      }
    }
    .btn-name {
      text-align: center;
      color: #000;
      margin-top: 16px;
      font-size: 24px;
    }
  }
    &.center{
      display: flex;
      align-items: center;
    }
  }
  /*********** 按钮 ***********/
  .btn-wrap {
    margin: 0 34px 40px;
    position: relative;
    .progressBar {
      &::before{
        content: "";
        display: block;
        width: 200px;
        height: 200px;
        border-radius: 50%;
        position: absolute;
        top: -30px;
        left: -23%;
        // transform: translateX(-50%) rotate(260deg);
        border: 3px solid rgba(0, 0, 0, 1);
        clip: rect(0px 200px 40px 0px);
        animation: progress-bar 1s linear infinite;
      }
    }
    .mask {
      &::before{
        content: "";
        display: block;
        width: 200px;
        height: 200px;
        border-radius: 50%;
        position: absolute;
        top: -30px;
        left: -23%;
        border: 3px solid transparent;
        z-index: 10;
        clip: rect(40px 80px 200px 0px);
      }
    }
      .press{
        &::before{
          content: "";
          display: block;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          border: 3px solid rgba(136, 138, 137, 0.8);
          clip: rect(0px 200px 40px 0px);
        }
      }
    .btn {
      box-sizing: border-box;
      margin: 0px auto;
      width: 140px;
      height: 140px;
      border-radius: 50%;

      display: flex;
      flex-direction: column;
      &.btn-over{
        &.active{
          background:#000;
        }
      }
    &.btn-swich {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: rgba(136, 138, 137,.4);
      &::before {
        background-image: url('~@lib/@{imgPath1}/yiguanbi.png');
        background-size: 100% 100%;
        width: 80px;
        height: 80px;
      }
    }
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
      }
      &.active {
        &.btn-start::before{
          background-image: url('~@lib/@{imgPath1}/zanting.png');
          background-size: 100% 100%;
          width: 88px;
          height: 102px;
        }
        &.btn-over::before{
          background-image: url('~@lib/@{imgPath1}/jieshu2.png');
          background-size: 100% 100%;
          width: 96px;
          height: 96px;
        }
      }
    }
    .btn-name {
      text-align: center;
      color: #000;
      margin-top: 16px;
      font-size: 28px;
      line-height: 40px;
      // opacity: .5;
    }

    .btn-over {
      &::before {
        background-image: url('~@lib/@{imgPath1}/jieshu.png');
        background-size: 100% 100%;
        width: 96px;
        height: 96px;
      }
    }
    .btn-start {
      &::before {
        background-image: url('~@lib/@{imgPath1}/qidong@2x.png');
        background-size: 100% 100%;
        width: 88px;
        height: 102px;
      }
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
      ul{
        li{
          opacity: 0;
        }
      }
      .swiper-container{
        opacity: .2;
      }
      .swiper-container1{
        opacity: .2;
      }
    }
    .btn-wrap {
      &.up-index {
        opacity: 1;
        .btn-open{
          z-index:999999;
        }
      }
      .btn {
        &.active {
           &.active {
        background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
        border-color: #ffbf00;
      }
        }

      }
    }
    .timing-right{
      position: relative;
      z-index: 999;
    }
  }
</style>
