<template class="a">
  <div class="body">
    
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']">
      <topbar 
        :show-right="false"
        :title="device.device_name"
        bak-color="#fff" />
      <div
        v-if="toogleSpeed" 
        class="main center" 
      >
        <div 
          v-show="!isClose&&!isOffline" 
          class="ratiobg111"
          @click="ratiobg2click($event)">
          <div 
            class="ratiobg2" 
          />
          <div 
            class="circle" 
            @touchstart="touchStart($event)"
            @touchmove="touchMove($event)"
            @touchend="touchEnd($event)"/>
            <!-- <div class="an">暗</div>
          <div class="liang">亮</div> -->
        </div>
        <div class="wrap-circle center">
          <!-- <div class="lianggang"/> -->
          <div 
            :class="[{'animation': !isClose }, {'greycircle': isClose }, rotateClass, 'bg']" />
        </div>
      </div>
      <div 
        v-show="!isClose&&!isOffline"
        class="tips">
        <span>亮度 {{ ratio }}%</span>
        <!-- <div class="ratiobg">
          <div class="ratiobg2"/>
          <div 
            class="circle" 
            @touchstart="touchStart($event)"
            @touchmove="touchMove($event)"
            @touchend="touchEnd($event)"/>
          <div class="an">暗</div>
          <div class="liang">亮</div>
        </div> -->
      </div>
      <!-- 按钮 -->
      <div class="panel-btn center">
        <div :class="[{'up-index': !isOffline }, 'btn-wrap']">
          <div 
            :class="[{ 'active': !isClose }, 'btn-swich btn center']"
            @click="setSwitch" />
          <div class="btn-name">关机</div>
        </div>
        <div 
          class="btn-wrap"
          @click="setSpeed(370)">
          <div :class="[{ 'active': deviceAttrs.temperature == 370 }, 'btn btn-rs center']" />
          <div class="btn-name">暖光</div>
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
          <div class="btn-name">白光</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      isOpen: false,
      speedNum: 0,
      speedText: '关',
      time:0,
      dateObj:null,
      toogleSpeed:true,
      ratio:0
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
    }
  },
  watch: {
    // 'device.stateChange'() {
    //   this.$nextTick(() => {
    //     this.toogleSpeed = false
    //     this.$nextTick(() => {
    //       this.toogleSpeed = true
    //     })
    //   })   
    // },
    deviceAttrs: {
      handler(newName) {
        switch (newName.temperature) {
          case "off":
            this.speedNum = 0
            this.speedText = "关"
            break
          case "low":
            this.speedNum = 1
            this.speedText = "柔速"
            break
      
          case "overnormal":
            this.speedNum = 2
            this.speedText = "高速"
            break
          case "high":
            this.speedNum = 3
            this.speedText = "爆炒"
            break
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
      .then(()=>{
        this.ratio = parseInt(this.deviceAttrs.level/254*100) 
        let circle = document.querySelectorAll(".circle")[0]  
        let ratiobg2 = document.querySelectorAll(".ratiobg2")[0]  
        circle.style.top =  this.ratio/100*250 +"px"
        ratiobg2.style.height =  this.ratio/100*250 +"px"
      })
    })
  },
  mounted(){
    
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    setSpeed(val) {
      if (val == this.deviceAttrs.temperature) {
        val = 'off'
      }
      if (this.isClose) return  // 关机状态点击无效
      this.controlDevice('temperature', val)
    },
    setSwitch() {
      let switchStatus = ''
      if (this.deviceAttrs.switch_status == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.controlDevice("switch", switchStatus)
    }, 
    // touchStart(e){
    //   e.stopPropagation()
    //   e.preventDefault()
    //   console.log(e)
    // },
    // touchMove(e){
    //   e.stopPropagation()
    //   e.preventDefault()
    //   let ratiobg = document.querySelectorAll(".ratiobg")[0]
    //   let circle = document.querySelectorAll(".circle")[0]  
    //   let ratiobg2 = document.querySelectorAll(".ratiobg2")[0]  
    //   let w = e.targetTouches[0].pageX - ratiobg.offsetLeft
    //   w=w<=0?0:w
    //   w=w>=300?300:w
    //   circle.style.left =  w +"px"
    //   ratiobg2.style.width = w +"px"
    //   this.ratio = parseInt((w/300)*100)
    //   // console.log(ratio)
    // },
    // touchEnd(e){
    //   e.stopPropagation()
    //   e.preventDefault()
    //   let level = parseInt(this.ratio/100*254) 
    //   this.controlDevice('level', level)
    // },
    touchStart(e){
      console.log(e)
    },
    touchMove(e){
      e.stopPropagation()
      e.preventDefault()
      let ratiobg = document.querySelectorAll(".ratiobg111")[0]
      let circle = document.querySelectorAll(".ratiobg111>.circle")[0]  
      let ratiobg2 = document.querySelectorAll(".ratiobg111>.ratiobg2")[0]  
      // let main = document.querySelectorAll(".main")[0]
      // console.log(main.offsetTop)
      // console.log( ratiobg.offsetTop)
    
      let h = e.targetTouches[0].pageY - ratiobg.offsetTop
      h=h<=0?0:h
      h=h>=250?250:h
      circle.style.top = h + ratiobg2.offsetTop +"px"
      ratiobg2.style.height = h +"px"
     
      // circle.style.left =  w +"px"
      // ratiobg2.style.width = w +"px"
      this.ratio = parseInt((h/250)*100)
    },
    touchEnd(e){
      e.stopPropagation()
      e.preventDefault()
      let level = parseInt(this.ratio/100*254) 
      this.controlDevice('level', level)
    },
    ratiobg2click(e){
      e.stopPropagation()
      e.preventDefault()
      let circle = document.querySelectorAll(".ratiobg111>.circle")[0]  
      let ratiobg2 = document.querySelectorAll(".ratiobg111>.ratiobg2")[0] 
      circle.style.top = e.offsetY +"px"
      ratiobg2.style.height = e.offsetY +"px"
      this.ratio = parseInt(( e.offsetY /250)*100)
      let level = parseInt(this.ratio/100*254) 
      this.controlDevice('level', level)
    }
    , 
    // countdown(){
    //       this.second = Math.floor(this.time  % 60)
    //       this.minute = Math.floor(this.time /  60 % 60)
    //       if (this.minute <= 0 && this.second <= 0) {
    //         clearInterval(this.dateObj)
    //         this.setSwitch()
    //       }
    //       this.time--
    // },
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
@keyframes rotate {
    from {
      transform:rotate(0deg);
    }
    to {
      transform:rotate(360deg);
    }
}
.page{
  height:1280px;
  background-image: radial-gradient(51% -19%, #F5BD36 52%, #F3CF77 52%, #E1AD2E 100%);
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
    color: #fff;
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
  background: url("~@lib/@{imgPath}/btn_ac_mode_e@2x.png") no-repeat;
  // background: #fff;
  background-size: 100% 100%;
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

  background: #ffffff;
  box-shadow: 0 -3px 28px 0 rgba(209, 209, 209, 0.5);
  border-radius: 42px 42px 0px 0px;

  flex-wrap: wrap;
  justify-content: flex-start;

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
    background: #ffffff;
    box-shadow: 0 -3px 28px 0 rgba(209, 209, 209, 0.5);
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
    border: 1px solid #818181;
    border-radius: 50%;

    display: flex;
    flex-direction: column;
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
  &:before {
    content: "";
    position: fixed;
    top: 82PX;

    left: 0;
    bottom: 0;
    right: 0;
    z-index: 999;
    width: 100%;
    background: rgba(0, 0, 0, 0.1);
  }
  &.page {
    background-image: url("~@lib/@{imgPath}/beij@3x.png");
    background-size: 100% 100%;

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
    background: #efefef;
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


