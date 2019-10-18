/* eslint-disable vue/no-unused-vars */
<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']">
      <NewTopBar
        :title="device.device_name"
        :shutdown="true"
        bak-color="#000"
        @shutdownCallback="shutdowncallback('off')" />
      <!-- tab切换栏 -->
      <div
        class="main center"
        style="margin-top:52px">
        <div class="bg"><div class="circle"><div class="status">断电中</div></div></div>
      </div>
      <div class="status1">05:23:17后断电</div>
      <!-- <div 
        v-show="!isOffline&&!isClose" 
        class="panel-btn center">
        <div 
          class="btn-wrap"
          @click="setMode('wind')">
          <div :class="[{ 'active': deviceAttrs.mode == 'wind' }, 'btn btn-wind center']" />
          <div class="btn-name">断电</div>
        </div>
        <div 
          class="btn-wrap"
          @click="setMode('dehumidify')">
          <div :class="[{ 'active': deviceAttrs.mode == 'dehumidify' }, 'btn btn-dehumidify center']" />
          <div class="btn-name">延时通电</div>
        </div>
        <div 
          style="visibility:hidden"
          class="btn-wrap"/>
      </div>
      <div
        v-if="!isClose&&!isOffline"
        class="panel-btn center">
        <div
          class="btn-wrap">
          <div
            :class="[{'active':deviceAttrs.control == 'start'},'btn-start btn center']"
            @click="setStart" />
          <div class="btn-name">启动</div>
        </div>
      </div> -->
      <div class="bottom">
        <div class="timing"> 
          <div>定时</div>
          <div 
            class="timing-right" 
            @click="showTime">{{ deviceAttrs.timer_value | closeTime }} > </div>
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
  // 初始化swiper
   mounted(){
        var mySwiper = new Swiper('.swiper-container', {
          width:384,
          autoplay:false,
          centeredSlides: true,
          loop:true,
          slidesPerView: 4,
          paginationClickable: true,
          observer:true,//修改swiper自己或子元素时，自动初始化swiper
          observeParents:true,//修改swiper的父元素时，自动初始化swiper
        })
      },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    // 开关机
    shutdowncallback(val){
      if (this.isOffline) return 
      this.controlDevice('switch',val)
    },
    // tab切换
    tabMode(t){
      this.temp = t
    },
    // 启动
    setStart() {
      let controlStatus = ''
      if (this.deviceAttrs.control == 'start') {
        controlStatus = 'halt'
      } else {
        controlStatus = 'start'
        this.currentMode = document.querySelectorAll('.swiper-slide-active>div>span')[1].innerHTML
        let value
        let arr = this.tableware.concat(this.foodList)
        for(let i=0;i<arr.length;i++){
          if(this.currentMode ==arr[i].name ){
            value = arr[i].english
          }
        }
        this.controlDevice("control",controlStatus,{'mode':value})
          this.$router.push({ path: '/Washing' })
        return
      }
      this.controlDevice("control",controlStatus )
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
        this.controlDevice('remain_washtime',0)
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
    showTime() {
      if (this.isClose) return
      this.$refs.time.show = true
    },
    // 设置关机时间
    setReserve(time) {
      let h = parseInt(time[0].split(':')[0])
      let m = parseInt(time[0].split(':')[1])
      console.log(h,m,'hm')
        this.controlDevice('time',{
            timer_value:h*60+m,
            timer_switch:'on'
        })
    },
    // 取消定时
    canceltime(){
       this.controlDevice('time',{
            timer_value:0,
            timer_switch:'off'
        })
    },
  }
}
</script>
<style lang="less" scoped>
@imgPath: 'base/new_curtains/assets';
@imgPath1: 'base/dishwasher/assets';
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
    position: fixed;
    bottom: 130px;
    z-index: 99999;
    .btn {
      margin-top: 24px;
      width: 100%;
      height: 306px;
      border-radius: 40px 40px 0 0;
      background: rgba(136, 138, 137,.4);
      overflow: hidden;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
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
  }
</style>
