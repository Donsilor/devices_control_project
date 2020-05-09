<template class="a">
  <div class="body">
    <div
      :class="[{ 'offline': isOffline || networkStatus == -1 }, {'close': isClose}, 'page']" >
      <new-topbar
        :title="device.device_name"
        :room="device.room_name"
        :scroll="true"
        page-class=".page"
      />
      <StatusTip @OfflineHelpPage="OfflineHelpPage"/>
      <!-- 灯泡 -->
      <div
        class="main center"
      >
        <canvas
          ref="canvas"
          class="canvas"
          width="570"
          height="570"
        />
        <div
          class="light-txt">{{ deviceAttrs.switch_status=='on' ? brightness : '_ _' }}</div>
        <div
          v-show="deviceAttrs.switch_status=='on'"
          :class="['light-mode', {'none': temperatureTxt}]"
          @click="showTemperature">{{ temperatureTxt }}</div>
      </div>
      <!-- 开关按钮 -->
      <div
        class="tips-btn">
        <div
          :class="[{'up-index': !isOffline && networkStatus != -1 }, 'btn-wrap']">
          <div
            ref="switch"
            :class="[{ 'active': !isClose }, 'btn-swich btn center']"
            @touchstart ="touchstart('switch')"
            @touchend="touchend('switch')" />
        </div>
      </div>
      <!-- 底部菜单 -->
      <div class="footer">
        <div class="line"/>
        <div
          :class="['footer-line', {'opa': isClose || isOffline}]"
          @click="showMode()">
          <div
            :class="['footer-title']">模式</div>
          <div class="timing-right">{{ custom ? "自定义" : modeTitle }}</div>
        </div>
        <div class="line"/>
        <div
          v-show="deviceAttrs.switch_status == 'on'"
          class="footer-line">
          <div class="footer-title">关灯时缓慢变暗</div>
          <input
            :checked="lockCloseVal"
            class="switch switch-anim"
            type="checkbox"
            @click="lockClose">
        </div>
        <div
          v-show="deviceAttrs.switch_status == 'off'"
          class="footer-line">
          <div class="footer-title">开灯时缓慢变亮</div>
          <input
            :checked="lockOpenVal"
            class="switch switch-anim"
            type="checkbox"
            @click="lockOpen">
        </div>
      </div>
      <!--模式选择-->
      <model-swing
        ref="swing"
        :mode="deviceAttrs.mode"
        :custom="custom"
        @setWind="setWind" />
      <!-- 色温选择 -->
      <model
        ref="model"
        :temperature="deviceAttrs.temperature"
        @setModel="setModel"/>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapState, mapActions } from 'vuex'
  import modelSwing from './components/model-swing'
  import model from './components/model'
  export default {
    components: {
      modelSwing,
      model
    },
    data() {
      return {
        custom: false,
        vibrate: 0,
        lockCloseVal: false,
        lockOpenVal: false,
        ctx: '',
        ox: 140,
        oy: 140,
        or: 120,
        br: 15,
        moveFlag: false,
        brightness: '_ _',
        linearGradientArr: [
          {
            step: '0',
            color: '#EF6D5E'
          },
          {
            step: '1.0',
            color: '#F9BB6B'
          }
        ],
        allHD: 0,
        touch: false,
        threshold: 0,
        relieve: false,
      }
    },
    computed: {
      ...mapGetters(['isClose', 'isOffline', 'networkStatus']),
      ...mapState(['device', 'deviceAttrs']),
      modeTitle() {
        /* eslint-disable no-unreachable */
        switch (this.deviceAttrs.mode) {
          case '0':
            return '自定义'
            break
          case '3':
            return '阅读'
            break
          case '4':
            return '影院'
            break
          case '5':
            return '温暖'
            break
          case '6':
            return '夜灯'
            break
          default:
            return ''
        }
      },
      temperatureTxt() {
        /* eslint-disable no-unreachable */
        switch (this.deviceAttrs.temperature) {
          case '0':
            return '暖光'
            break
          case '145':
            return '自然光'
            break
          case '255':
            return '白光'
            break
          default:
            return '色温'
        }
      },
      isClose(){
        return this.deviceAttrs.switch_status=="on"?false:true
      },
    },
    watch: {
      'device.stateChange'() {
        if(this.deviceAttrs.mode == '0' || this.deviceAttrs.mode == '1' || this.deviceAttrs.mode == '2') {
          this.custom = true
        } else {
          this.custom = false
        }
        if(this.deviceAttrs.level == 0 || this.deviceAttrs.level >= 254) {
          this.relieve = false
        }
        if(this.allHD) {
          this.draw(this.allHD)
        } else {
          this.draw(`${this.deviceAttrs.level/255}`)
        }
        this.allHD = 0
      },
    },
    created() {
      HdSmart.ready(() => {
        this.getDeviceInfo()
          .then(()=>{
            this.draw(`${this.deviceAttrs.level/255}`)
            if(this.deviceAttrs.mode == '1') {
              this.lockOpenVal = true
              this.custom = true
            }
            if(this.deviceAttrs.mode == '2') {
              this.lockCloseVal = true
              this.custom = true
            }
          })
          .catch((err) => {
            if(err.code == -90004) {
              HdSmart.UI.toast('网络超时，请重试')
            }
          })
        HdSmart.UI.setStatusBarColor(1)
      })
    },
    mounted(){
      this.ctx = this.$refs.canvas.getContext("2d")
      this.ctx.scale(2,2)
      this.$nextTick(() => {
        setTimeout(()=>{
          window.scrollTo(0,0)
        },200)
        let on = ("ontouchstart" in document)? {
          start: "touchstart", move: "touchmove", end: "touchend"
        } : {
          start: "mousedown", move: "mousemove", end: "mouseup"
        }
        this.$refs.canvas.addEventListener(on.start,(e)=> {
          this.br = 20
          this.moveFlag = true
          if (this.moveFlag) {
            var k = this.getXY(e,this.$refs.canvas)
            var r = Math.atan2(k.x-this.ox, this.oy-k.y)
            var hd = (Math.PI+r)/(2*Math.PI)
            // 半圆的滑动范围判断
            this.flag = hd
            this.threshold = hd
            if(this.deviceAttrs.level == 0 && this.threshold < 0.985) {
              this.relieve = true
            }
            if(this.deviceAttrs.level >= 254 && this.threshold > 0.015) {
              this.relieve = true
            }
            if(hd > (this.deviceAttrs.level/255 - 0.015) && hd < (this.deviceAttrs.level/255 + 0.015)) {
              this.touch = true
              return
            }
            if(this.deviceAttrs.level == 0 && (hd == 1 || hd >= 0.985)) {
              this.touch = true
              return
            }
            if(this.deviceAttrs.level >= 252 && (hd == 0 || hd <= 0.015)) {
              this.touch = true
              return
            }
            this.touch = false
            if (hd <= 1 && hd >= 0) {
              this.draw(hd)
              this.allHD = hd
            }else{
              return
            }
          }
          argv_is_mock ? HdSmart.UI.vibrate(true) : HdSmart.UI.vibrate()
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
            if(this.deviceAttrs.level == 0 && (this.threshold >= 0.5) && !this.relieve) {
              this.threshold = hd
              this.flag = hd
              return
            }
            if(this.deviceAttrs.level >= 254 && (this.threshold <= 0.5) && !this.relieve) {
              this.threshold = hd
              this.flag = hd
              return
            }
            this.touch = false
            if(this.flag-hd>0.5){
              hd = 1
            }
            if(hd-this.flag>0.5){
              hd = 0
            }
            this.flag = hd
            if (hd <= 1 && hd >= 0) {
              this.draw(hd)
              this.allHD = hd
            }else{
              return
            }
          }
        }, false)

        this.$refs.canvas.addEventListener(on.end,()=> {
          if (this.isOffline||this.isClose|| this.networkStatus == -1) return
          this.br = 15
          if(this.touch) return
          // this.draw(this.brightness/100)
          this.draw(this.allHD)
          this.moveFlag = false
          this.controlDevice('level',parseInt(this.brightness*2.55))
        }, false)
      })
    },
    methods: {
      ...mapActions(['getDeviceInfo', 'doControlDevice']),
      // 路由跳转
      OfflineHelpPage(){
        this.$router.push({
          path:"/OfflineHelpPage"
        })
      },
      offset(r,d) {//根据弧度与距离计算偏移坐标
        return {x: -Math.sin(r)*d, y: Math.cos(r)*d}
      },
      draw(n) {
        this.ctx.clearRect(0,0,this.$refs.canvas.width,this.$refs.canvas.height)
        // this.ctx.stroke()
        this.ctx.beginPath()
        this.ctx.fillStyle = 'rgba(37,37,37,0.8)'
        this.ctx.arc(this.ox, this.oy, 90, 0, 2*Math.PI)
        this.ctx.fill()
        // this.ctx.stroke()
        this.ctx.strokeStyle = "rgba(151,151,151,0.2)"
        this.ctx.lineWidth = 20
        this.ctx.beginPath()
        this.ctx.shadowColor =  "none"
        this.ctx.shadowOffsetX = 0
        this.ctx.shadowOffsetY = 0
        this.ctx.shadowBlur = 0
        this.ctx.lineCap = 'round'
        // this.ctx.arc(this.ox,this.oy,this.or,1/4 * Math.PI,3/4 * Math.PI,true)//半圆(逆时针)
        this.ctx.arc(this.ox,this.oy,this.or,0,2*Math.PI,true)//整圆
        this.ctx.stroke()
        // 画一个渐变
        var gradient = this.ctx.createLinearGradient(0, this.oy * 2, 2*this.ox, 0)
        this.linearGradientArr.forEach(element => {
          gradient.addColorStop(element.step, element.color)
        })
        this.ctx.strokeStyle = gradient
        if (this.deviceAttrs.switch_status=="on") {
          this.ctx.strokeStyle = gradient
        }else{
          this.ctx.strokeStyle = "transparent"
        }
        this.ctx.lineWidth = 20
        this.ctx.beginPath()
        this.ctx.shadowColor =  "none"
        this.ctx.shadowOffsetX = 0
        this.ctx.shadowOffsetY = 0
        this.ctx.shadowBlur = 0
        this.ctx.arc(this.ox,this.oy,this.or,2/4 *Math.PI,(n*2+0.5)*Math.PI,false)
        this.ctx.stroke()
        this.brightness = (Math.round(n*100))
        this.ctx.fillStyle = "#fff"
        this.ctx.beginPath()
        this.ctx.shadowOffsetX = 0
        this.ctx.shadowOffsetY = 2
        this.ctx.shadowBlur = 4
        this.ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
        let d =  this.offset(n*2*Math.PI,this.or)
        // 开机显示
        if (this.deviceAttrs.switch_status=="on") {
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
          x : x - obj.offsetLeft,
          y : y - obj.offsetTop
        }
      },
      // touch动画
      touchstart(val) {
        if(this.isClose && val=='switch') {
          this.$refs[val].classList.remove('animate')
          this.$refs[val].classList.add('animate1')
          // this.$refs[val].classList.add('yellowExtend')
          HdSmart.UI.vibrate()
          return
        }
        if(this.isClose||this.isOffline|| this.networkStatus == -1) return
        this.$refs[val].classList.remove('animate')
        this.$refs[val].classList.add('animate1')
        // this.$refs[val].classList.add('yellowExtend')
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
        if(val == 'switch') return this.setSwitch()
      },
      // 显示模式弹框
      showMode() {
        if (this.isClose || this.isOffline || this.networkStatus == -1) return
        this.$refs.swing.show = true
      },
      // 显示色温弹框
      showTemperature() {
        if (this.isClose || this.isOffline || this.networkStatus == -1) return
        this.$refs.model.show = true
      },
      // 模式选择
      setWind(attr) {
        HdSmart.UI.vibrate()
        // this.deviceAttrs.mode = ''
        if(!attr) {
          if(this.$refs.swing.show) this.$refs.swing.show = false
          this.custom = true
          return
        }
        if(attr) return this.controlDevice("mode", attr)
          .then((res) => {
            if(res.code == 0) {
              this.custom = false
              if(this.$refs.swing.show) this.$refs.swing.show = false
            }
          })
      },
      // 色温选择
      setModel(attr) {
        return this.controlDevice("temperature", attr)
        .then((res) => {
          if(res.code == 0) {
            if(this.$refs.model.show) this.$refs.model.show = false
          }
        })
      },
      lockClose(e) {
        HdSmart.UI.vibrate()
        this.lockCloseVal = e.target.checked
      },
      lockOpen(e) {
        HdSmart.UI.vibrate()
        this.lockOpenVal = e.target.checked
      },
      setSwitch() {
        if (this.isOffline|| this.networkStatus == -1) return false
        let switchStatus = ''
        if (this.deviceAttrs.switch_status == 'on') {
          switchStatus = 'off'
        } else {
          switchStatus = 'on'
        }
        if(switchStatus == 'off') {
          if(this.lockCloseVal) {
            if(this.deviceAttrs.mode == '2') return HdSmart.UI.toast('关灯中，立刻关灯需取消缓慢模式')
            return this.controlDevice("mode", '2')
          }
        }
        if(switchStatus == 'on') {
          if(this.lockOpenVal) {
            if(this.deviceAttrs.mode == '1') return HdSmart.UI.toast('缓慢开灯中')
            return this.controlDevice("mode", '1')
            .then(() => {
            })
          } else {
            if(this.deviceAttrs.mode == '1') {
              return this.controlDevice("switch", 'off', {'level': this.deviceAttrs.level})
              then(() => {
              })
            }
          }
        }
        if(this.deviceAttrs.mode == '1' || this.deviceAttrs.mode == '2') {
          return this.controlDevice("switch", switchStatus, {'level': this.deviceAttrs.level})
        }
        this.controlDevice("switch", switchStatus)
      },
      controlDevice(attr, value, param) {
        if(attr=='switch'){
          return this.doControlDevice({
            nodeid: `bulb.main.${attr}`,
            params: {
              attribute: {
                [attr]: value,
                ...param
              }
            }
          })
        }else{
          return this.doControlDevice({
            nodeid: `bulb.main.${attr}`,
            params: {
              attribute: {
                [attr]: value,
                ...param
                // "transition_time":2,
                // "need_confirm":true
              }
            }
          })
        }
      },
    },

  }
</script>

<style lang="less" scoped>
@font-face{
  font-family: 'Rajdhani-Regular';
  src: url('~@lib/base/ch_air_condition/assets/Rajdhani-Regular.ttf');
  font-weight: normal;
  font-style: normal;
}
  @imgPath: "base/hongyan_light/assets";
  @imgPath3: 'base/honghan_switch/assets';
  *{ -webkit-tap-highlight-color:transparent; }
  .page{
    &::before{
      content: "";
      background: #000;
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
    height: 400px;
    margin-bottom: 260px;
    .light-txt{
      padding-top: 16px;
      font-family: 'Rajdhani-Regular';
      text-align: center;
      font-size: 140px;
      position: absolute;
      margin-top: 40px;
      z-index: 9999;
      color: #fff;
      &:after {
        content: '%';
        font-size: 40px;
        position: absolute;
        bottom: 24px;
      }
    }
    .light-mode{
      padding-top: 16px;
      width: 250px;
      height: 140px;
      text-align: center;
      font-size: 32px;
      color:#D9BA45;
      position: absolute;
      margin-top: 180px;
      z-index: 9999;
      border-top: 1px solid rgba(255,255,255,0.1);

      &.none {
        &:after{
          display:block;
          content:'';
          border-width:8px 8px 8px 8px;
          border-style:solid;
          border-color:#D9BA45 transparent transparent transparent;
          position:absolute;
          left:46%;
          top:45%;
        }
      }
    }
  }
  .canvas {
    margin-top: 80px;
    z-index: 2;
    position: absolute;
    // width: 521px;
    width: 570px;
    height: 570px;
    border-radius: 50%;
  }
  .tips-btn{
    margin: 0 auto;
    width: 100%;
    text-align: center;
    font-size: 36px;
    // color: #fff;
    display: flex;
    justify-content: center;
  }
  .footer {
    margin-top: 60px;
    .line {
      width: 100%;
      height: 1px;
      opacity: .1;
      background: #000000;
    }
    .footer-line {
      padding: 0px 60px;
      height: 118px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &.opa {
        opacity: 0.5;
      }
      .footer-title {
        font-size: 32px;
        color: #fff;
      }
      .timing-right {
        display: flex;
        align-items: center;
        height: 64px;
        line-height: 64px;
        font-size: 28px;
        color: #fff;
        opacity: 0.5;
        &::after {
          content: "";
          margin-left: 10px;;
          display: inline-block;
          border-top: 1px solid;
          border-right: 1px solid;
          width: 10px;
          height: 10px;
          transform: rotate(45deg);
        }
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
        background-color: rgba(255,255,255,0.19);
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
        background: #fff;
      }
      .switch:checked {
        // border-color: #EF6D5E;
        // box-shadow: #E1B96E 0 0 0 16px inset;
        background-image: linear-gradient(45deg, #EF6D5E 0%, #F9BB6B 100%);
      }
      .switch:checked:before {
        left: 30px;
        background: #fff;
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
      }
    }
  }
  .btn-wrap {
    margin: 0 24px;
    &.up-index {
      position: relative;
      z-index: 9999;
    }
    .btn {
      position: relative;
      left: 50%;
      transform: translateX(-50%);
      box-sizing: border-box;
      margin: 0 auto;
      width: 120px;
      height: 120px;
      border-radius: 50%;

      display: flex;
      flex-direction: column;
      background: rgba(255,255,255,0.1);
      &::before {
        position: relative;
        z-index: 100;
      }
      &.active {
        background-image: linear-gradient(45deg, #EF6D5E 0%, #F9BB6B 100%);
      }
    }
    .btn-swich {
      &::before {
        content: "";
        display: block;
        width: 48px;
        height: 48px;
        background-image: url("~@lib/@{imgPath3}/new_kg_btn_off.png");
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url("~@lib/@{imgPath}/btn_ac_on_cd@2x.png") !important;
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
    .btn-wrap {
      opacity: .2;
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


