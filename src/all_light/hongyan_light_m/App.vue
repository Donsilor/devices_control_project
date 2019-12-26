<template class="a">
  <div class="body">
    <div
      :class="[{ 'offline': isOffline || networkStatus == -1 }, {'close': isClose}, 'page']" >
      <new-topbar
        :title="device.device_name"
        :room="device.room_name"
        :scroll="true"
        bak-color="#000"
        page-class=".page"
      />
      <StatusTip/>
      <div
        v-if="toogleSpeed"
        class="main center"
      >
        <div
          class="wrap-circle center">
          <div
            :class="[{'animation': !isClose }, {'greycircle': isClose }, rotateClass, 'bg']" />
          <div
            :style="{opacity: brightness/100}"
            :class="[{'animation1': !isClose }, rotateClass, 'bg']" />
          <div class="small"/>
          <div class="big"/>
        </div>
        <canvas
          ref="canvas"
          class="canvas"
          width="480"
          height="480"
        />
        <!-- <canvas
          v-show="isClose"
          class="canvas"
          width="240"
          height="240"
        /> -->
        <!-- <div class="mask1"/> -->
        <div class="mask2"/>
        <div class="mask3"/>
        <div class="tips">
          <span
            v-if="!isClose"
            class="txt"
          >{{ brightness }}%</span>
        </div>
        <div
          :style="{opacity: brightness/100}"
          :class="['scale', {'scale-close': isClose}]" />

      </div>
      <!-- <canvas
        v-show="!isClose"
        ref="canvas"
        class="canvas"
        width="240"
        height="240"
      /> -->
      <div
        class="tips-btn">
        <div
          :class="[{'up-index': !isOffline && networkStatus != -1 }, 'btn-wrap']">
          <div
            ref="switch"
            :class="[{ 'active': !isClose }, 'btn-swich btn center']"
            @touchstart ="touchstart('switch')"
            @touchend="touchend('switch')" />
            <!-- <div class="btn-name">{{ isClose||isOffline?'开灯':'关灯' }}</div> -->
        </div>
        <!-- <span v-if="!isClose">亮度 {{ ratio }}%</span> -->
      </div>
      <!-- 按钮 -->
      <div
        class="panel-btn center">
        <!-- <div :class="[{'up-index': !isOffline }, 'btn-wrap']">
          <div
            :class="[{ 'active': !isClose }, 'btn-swich btn center']"
            @click="setSwitch" />
          <div class="btn-name">{{ isClose||isOffline?'开灯':'关灯' }}</div>
        </div> -->
        <div
          class="btn-wrap"
          @touchstart ="touchstart('bc')"
          @touchend="touchend('bc')">
          <div
            ref="bc"
            :class="[ { 'active': deviceAttrs.temperature == 370 && deviceAttrs.switch_status == 'on' && !isOffline && networkStatus != -1 }, 'btn btn-bc center']" />
          <div class="btn-name">暖光</div>
        </div>
        <div
          class="btn-wrap"
          @touchstart ="touchstart('gs')"
          @touchend="touchend('gs')">
          <div
            ref="gs"
            :class="[ { 'active': deviceAttrs.temperature == 240 && deviceAttrs.switch_status == 'on' && !isOffline && networkStatus != -1 }, 'btn btn-gs center']" />
          <div class="btn-name">自然光</div>
        </div>
        <div
          class="btn-wrap"
          @touchstart ="touchstart('rs')"
          @touchend="touchend('rs')">
          <div
            ref="rs"
            :class="[{ 'active': deviceAttrs.temperature == 167 && deviceAttrs.switch_status == 'on' && !isOffline && networkStatus != -1 }, 'btn btn-rs center']" />
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
      toogleSpeed:true,
      ratio:100,
      ctx: '',
      ox: 120,
      oy: 120,
      or: 110,
      br: 10,
      moveFlag: false,
      brightness: 100,
    }
  },
  computed: {
    ...mapGetters(['isClose', 'isOffline', 'networkStatus']),
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
    },
  },
  watch: {
    'device.stateChange'() {
      this.draw(`${((this.deviceAttrs.level/2.55)+50)/200}`)
    },
    'brightness'() {
      if(this.deviceAttrs.switch_status == 'on' && !this.isOffline&& this.networkStatus != -1) {
        HdSmart.UI.vibrate()
      }
    }
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
      .then(()=>{
        this.draw(`${((this.deviceAttrs.level/2.55)+50)/200}`)
      })
      .catch((err) => {
        if(err.code == -90004) {
          HdSmart.UI.toast('网络超时，请重试')
        }
      })
      HdSmart.UI.setStatusBarColor(2)
    })
  },
  mounted(){
    this.ctx = this.$refs.canvas.getContext("2d")
    this.ctx.scale(2,2)
    this.$nextTick(() => {
      let on = ("ontouchstart" in document)? {
          start: "touchstart", move: "touchmove", end: "touchend"
      } : {
          start: "mousedown", move: "mousemove", end: "mouseup"
      }
        this.$refs.canvas.addEventListener(on.start,()=> {
          this.moveFlag = true
      },false)

      this.$refs.canvas.addEventListener(on.move, (e)=> {
          if(e.preventDefault){
              e.preventDefault()
          }else{
              e.returnValue = false
          }
          if (this.moveFlag) {
              var k = this.getXY(e,this.$refs.canvas)
              var r = Math.atan2(k.x-this.ox, this.oy-k.y)
              var hd = (Math.PI+r)/(2*Math.PI)
              // 半圆的滑动范围判断
              if (hd <= 0.75 && hd >= 0.25) {
                  this.draw(hd)
              }else if (hd > 0.75) {
                this.draw(0.75)
              } else if (hd < 0.25) {
                this.draw(0.25)
              }
          }
      }, false)
      this.$refs.canvas.addEventListener(on.end,()=> {
          if (this.isOffline||this.isClose|| this.networkStatus == -1) return
          this.moveFlag = false
          this.controlDevice('level',parseInt(this.brightness*2.55))
      }, false)
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    touchstart(val) {
      if(this.isClose && val=='switch') {
        this.$refs[val].classList.remove('animate')
        this.$refs[val].classList.add('animate1')
        this.$refs[val].classList.add('yellowExtend')
        HdSmart.UI.vibrate()
        return
      }
      if(this.isClose||this.isOffline|| this.networkStatus == -1) return
      this.$refs[val].classList.remove('animate')
      this.$refs[val].classList.add('animate1')
      this.$refs[val].classList.add('yellowExtend')
      HdSmart.UI.vibrate()
    },
    touchend(val){
      if(this.isClose && val=='switch') {
        this.$refs[val].classList.remove('animate1')
        this.$refs[val].classList.add('animate')
        this.setSwitch()
        return
      }
      if(this.isClose||this.isOffline|| this.networkStatus == -1) return
      this.$refs[val].classList.remove('animate1')
      this.$refs[val].classList.add('animate')
      if(val == 'bc') return this.setSpeed(370)
      if(val == 'gs') return this.setSpeed(240)
      if(val == 'rs') return this.setSpeed(167)
      if(val == 'switch') return this.setSwitch()
    },
    offset(r,d) {//根据弧度与距离计算偏移坐标
      return {x: -Math.sin(r)*d, y: Math.cos(r)*d}
    },
    draw(n) {
      this.ctx.clearRect(0,0,this.$refs.canvas.width, this.$refs.canvas.height)
      this.ctx.strokeStyle = "#ccc"
      this.ctx.lineWidth = 5
      this.ctx.beginPath()
      this.ctx.arc(this.ox,this.oy,this.or,0,Math.PI,true)//半圆
      // this.ctx.arc(ox,oy,or,0,2*Math.PI,true);//整圆
      this.ctx.stroke()
      if(this.deviceAttrs.switch_status=="on") {
        this.ctx.strokeStyle = "#E7BB6A"
      } else {
        this.ctx.strokeStyle = "transparent"
      }
      this.ctx.lineWidth = 5
      this.ctx.beginPath()
      this.ctx.arc(this.ox,this.oy,this.or,Math.PI,(n*2+0.5)*Math.PI,false)
      this.ctx.stroke()
      this.ctx.fillStyle = "transparent"
      this.ctx.font = "80px Arial"
      this.ctx.textAlign = "center"
      this.ctx.textBaseline = "middle"
      // this.ctx.fillText(Math.round(n*200-50)+"%",this.ox,this.oy)
      this.brightness = (Math.round(n*200-50))
      this.ctx.fillStyle = "#E7BB6A"
      this.ctx.beginPath()
      var d =  this.offset(n*2*Math.PI,this.or)
      // 开机显示
      if (this.deviceAttrs.switch_status == 'on' && !this.isOffline&&this.networkStatus != -1) {
        this.ctx.arc(this.ox+d.x,this.oy+d.y,this.br,0,2*Math.PI,true)
      }else{
        //关机显示
        this.ctx.arc(0,0,0,0,0,true)
      }
      this.ctx.fill()
    },
    getXY(e,obj) {
      let et = e.touches? e.touches[0] : e
      let x = et.clientX
      let y = et.clientY
      return {
          x : x - obj.offsetLeft + (document.body.scrollLeft || document.documentElement.scrollLeft),
          y : y - obj.offsetTop  + (document.body.scrollTop || document.documentElement.scrollTop)
      }
    },
    // 亮度
    moveLight(val){
      this.ratio = 100-val
    },
    //
    endLight(val){
      if(val == 0) return this.controlDevice('level', val)
      if(val <= 15) {
        this.controlDevice('level', 15)
      } else {
        this.controlDevice('level', val)
      }
    },
    newLevel(){
    },
    setSpeed(val) {
      if (this.isClose||this.isOffline|| this.networkStatus == -1) return
      this.controlDevice('temperature', val)
    },
    setSwitch() {
      if (this.isOffline|| this.networkStatus == -1) return false
      let switchStatus = ''
      if (this.deviceAttrs.switch_status == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.controlDevice("switch", switchStatus)
    },
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
@imgPath3: 'base/honghan_switch/assets';
@imgPath4: 'base/oakes_air_condition/assets';
@keyframes rotate {
    from {
      transform:rotate(0deg);
    }
    to {
      transform:rotate(360deg);
    }
}
*{ -webkit-tap-highlight-color:transparent; }
.page{
  // height:100vh;
  // background: url('~@lib/@{imgPath3}/bg02.png');
  // background-size: 100% 100%;
  &::before{
    content: "";
    background-image: url('~@lib/@{imgPath3}/bg02.png');
    background-repeat:no-repeat;
    background-size: 100% 100%;
    position: fixed;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }
}
.main{
  margin-top: 85px;
  // position: relative;
  height: 400px;
  margin-bottom: 470px;
}
.wrap-circle {
  position: relative;
  left: 36%;
  top: 35%;
  // position: absolute;
  // margin-top: 60px;
  // width: 320px;
  // height: 450px;
  width: 208px;
  height: 290px;
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
.tips {
  margin-top: 18%;
  padding-bottom: 40px;
  position: absolute;
  text-align: center;
  font-size: 46px;
  display: flex;
  justify-content: center;
}
.canvas {
  margin-top: 19%;
  z-index: 2;
  position: absolute;
  width: 460px;
  border-radius: 50%;
}
// .mask1 {
//   position: absolute;
//   margin-top: 13%;
//   width: 300px;
//   height: 300px;
//   z-index: 3;
//   border-radius: 50%;
// }
.mask2 {
  position: absolute;
  margin-top: 40%;
  width: 100%;
  height: 300px;
  z-index: 3;
  // background: #000;
}
.mask3 {
  position: absolute;
  margin-top: 19%;
  width: 394px;
  height: 394px;
  z-index: 3;
  // background: #000;
  border-radius: 50%;
}
.small {
  background: url("~@lib/@{imgPath3}/btn_ac_on_zron@2x.png") no-repeat;
  background-size: 100% 100%;
  height: 26px;
  width: 26px;
  position: relative;
  top: 20%;
  left: -115%;
}
.big {
  background: url("~@lib/@{imgPath3}/btn_ac_on_oneh@2x.png") no-repeat;
  background-size: 100% 100%;
  height: 26px;
  width: 26px;
  position: relative;
  top: 11%;
  right: -123%;
}
.scale {
  // position: absolute;
  position: relative;
  // top: -40px;
  left: -13%;
  background: url("~@lib/@{imgPath3}/btn_ac_dengguang@2x.png") no-repeat;
  background-size: 100% 100%;
  width: 568px;
  height: 290px;
}
.scale-close {
  background: url("~@lib/@{imgPath3}/btn_ac_dengguanghui@2x.png") no-repeat;
  background-size: 100% 100%;
}
 .tips-btn{
  //  position: fixed;
    // margin-top: 100px;
    // bottom: 20%;
    margin: 0 auto;
    width: 100%;
    text-align: center;
    font-size: 36px;
    // color: #fff;
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
  background: url("~@lib/@{imgPath3}/btn_ac_lamp@2x.png") no-repeat;
  background-size: 100% 100%;
}
.animation1 {
  background: url("~@lib/@{imgPath3}/btn_ac_lampnuan@2x.png") no-repeat;
  background-size: 100% 100%;
}
.coverlight{
  position:absolute;
  width: 320px;
  height: 450px;
  clip:rect(80px 320px 450px 0px);
}
.greycircle {
  background: url("~@lib/@{imgPath3}/btn_ac_lamp@2x.png") no-repeat;
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
  // position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  // padding: 40px 30px 30px;
  margin-top: 66px;
  padding: 0 30px 96px;
  z-index: 9999;
  width: 100%;
  // height: 306px;
  // background: #ffffff;
  // box-shadow: 0 -3px 28px 0 rgba(209, 209, 209, 0.5);
  border-radius: 42px 42px 0px 0px;

  flex-wrap: wrap;
  justify-content: center;

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
    background: rgba(0,0,0,0.1);
    // box-shadow: 0 -3px 28px 0 rgba(209, 209, 209, 0.5);
    display: flex;
    // justify-content: space-evenly;
    align-items: center;
  }
}
.disabled {
  opacity: 0.2;
}
.btn-wrap {
  margin: 0 24px;
  &.up-index {
    position: relative;
    z-index: 9999;
  }
  .btn {
    box-sizing: border-box;
    margin: 0 auto;
    width: 120px;
    height: 120px;
    // border: 1px solid #818181;
    border-radius: 50%;

    display: flex;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.1);
    &::before {
      position: relative;
      z-index: 100;
    }
    &.active {
      // background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
      // border-color: #ffbf00;
      // background: #000;
      // background-image: linear-gradient(221deg, #F1CB85 10%, #E1B96E 81%);
      background: #E1B96E;
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
      width: 48px;
      height: 48px;
      background-image: url("~@lib/@{imgPath3}/btn_ac_on_baiguang@2x.png");
      background-size: 100% 100%;
    }
    &.active::before{
      display: block;
      width: 48px;
      height: 48px;
      // background-image: url("~@lib/base/yiyun_light/assets/nuanguang2@2x.png");
      background-size: 100% 100%;

    }
  }

  .btn-gs {
    &::before {
      content: "";
      display: block;
      width: 48px;
      height: 48px;
      background-image: url("~@lib/@{imgPath3}/btn_ac_on_ziranguang@2x.png");
      background-size: 100% 100%;
    }
    &.active::before{
      display: block;
      width: 48px;
      height: 48px;
      // background-image: url("~@lib/base/yiyun_light/assets/ziranguang2@2x.png");
      background-size: 100% 100%;

    }
  }
  .btn-bc {
    &::before {
      content: "";
      display: block;
      width: 48px;
      height: 48px;
      background-image: url("~@lib/@{imgPath3}/btn_ac_on_cd@2x.png");
      background-size: 100% 100%;
    }
    &.active::before{
      display: block;
      width: 48px;
      height: 48px;
      // background-image: url("~@lib/base/yiyun_light/assets/baiguanfg2@2x.png");
      background-size: 100% 100%;

    }
  }

  .btn-swich {
    &::before {
      content: "";
      display: block;
      width: 48px;
      height: 48px;
      background-image: url("~@lib/@{imgPath4}/dakai3@2x.png");
      background-size: 100% 100%;
    }
    &.active {
      &::before {
        background-image: url("~@lib/@{imgPath4}/dakai3@2x.png");
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
  overflow: hidden;
  .btn-wrap {
    &.up-index{
      opacity: .2;
    }
  }
}
&.close,
&.offline {
  // background-image: url("~@lib/@{imgPath}/beij@3x.png");
  //   background-size: 100% 100%;
  // &:before {
    // content: "";
    // position: fixed;
    // top: 82PX;

    // left: 0;
    // bottom: 0;
    // right: 0;
    // z-index: 999;
    // width: 100%;
    // background: rgba(0, 0, 0, 0.1);
  // }
  &.page {
    // background-image: url("~@lib/@{imgPath}/beij@3x.png");
    // background-size: 100% 100%;

    .cover {
      background: #fff;
      .point {
        &.left {
          background: #d8d8d8;
        }
      }
    }
  }
  // .panel-btn {
    // background: #efefef;
  // }
  .btn-wrap {
    opacity: .2;
    // .btn {
    //   &.active {
    //     background: #fff;
    //     border: 1px solid #818181;
    //   }
    // }
  }
  .btn-wrap-light{
    opacity: 1;
    .btn {
      &.active {
        // background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
        border-color: #ffbf00;
        background: #E1B96E;
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
.animate::before{
  animation: scale 0.3s;
}
.animate1::before{
  animation: scale1 0.15s;
  animation-fill-mode : forwards;
}
@keyframes scale1 {
  0%{
    transform: scale(1);
  }
  100%{
    transform: scale(0.6);
  }
}
@keyframes scale {
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
      // background-image: linear-gradient(221deg, #F1CB85 10%, #E1B96E 81%);
      background: #E1B96E;
      top: 50%;
      left: 50%;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: yellowExtendAnimate .15s 1;
      animation-fill-mode: forwards;
      animation-timing-function: ease-out;
      z-index: 99
    }
  }
  @keyframes yellowExtendAnimate {
    0% {width: 0%;height: 0%;}

    100% {width: 100%;height: 100%;}
  }
</style>


