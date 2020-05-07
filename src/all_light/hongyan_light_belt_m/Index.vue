<template class="a">
  <div
    class="body">
    <div
      :class="[{ 'offline': isOffline || networkStatus == -1 }, {'close': isClose}, 'page']" >
      <new-topbar
        :title="device.device_name"
        :room="device.room_name"
        :scroll="true"
        page-class=".page"
      />
      <StatusTip @OfflineHelpPage="OfflineHelpPage"/>
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
          class="light-mode"
          @click="showMode">{{ temperatureTxt }}</div>
      </div>
      <!-- 按钮 -->
      <div
        class="panel-btn center">
        <div
          class="btn-wrap"
          @touchstart ="touchstart('switch')"
          @touchend="touchend('switch')">
          <div
            ref="switch"
            :class="[switchStatus, 'btn', 'btn-switch center']"/>
        </div>
      </div>
    </div>
    <!-- 色温选择 -->
    <model
      ref="model"
      :temperature="deviceAttrs.temperature"
      @setModel="setModel"/>
  </div>
</template>

<script>
  import { mapGetters, mapState, mapActions } from 'vuex'
  import model from './components/model'
  export default {
    components: {
      model
    },
    data() {
      return {
        flag: 0,
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
      }
    },
    computed: {
      ...mapGetters(['isClose', 'isOffline', 'networkStatus']),
      ...mapState(['device', 'deviceAttrs']),
      temperatureTxt() {
        /* eslint-disable no-unreachable */
        switch (this.deviceAttrs.temperature) {
          case 167:
            return '暖光'
            break
          case 240:
            return '自然光'
            break
          case 370:
            return '白光'
            break
          default:
            return ''
        }
      },
      isClose(){
        return this.deviceAttrs.switch_status=="on"?false:true
      },
      switchStatus() {
        return this.deviceAttrs.switch_status == 'on' && !this.isOffline && this.networkStatus != -1 ? 'active' : 'noactive'
      }
    },
    watch: {
      'device.stateChange'() {
        if(this.allHD) {
          this.draw(this.allHD)
        } else {
          this.draw(`${this.deviceAttrs.level/255}`)
        }
        this.allHD = 0
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
          .then(() => {
            this.draw(`${this.deviceAttrs.level/255}`)
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
            if (hd <= 1 && hd >= 0) {
              this.draw(hd)
              this.allHD = hd
            }else{
              return
            }
          }
          HdSmart.UI.vibrate()
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
          // this.draw(this.brightness/100)
          this.draw(this.allHD)
          this.moveFlag = false
          if(parseInt(this.brightness*2.55) <= 15 && parseInt(this.brightness*2.55) > 0) return this.controlDevice('level',15)
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
        if(val == 'bc') return this.setSpeed(167)
        if(val == 'gs') return this.setSpeed(240)
        if(val == 'rs') return this.setSpeed(370)
        if(val == 'switch') return this.setSwitch()
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
        // this.ctx.fillStyle = "#fff"
        // this.ctx.font = "70px Rajdhani-Regular"
        // this.ctx.textAlign = "center"
        // this.ctx.textBaseline = "middle"
        this.brightness = (Math.round(n*100))
        // if (this.deviceAttrs.switch_status=="on") {
        //   this.ctx.fillText(Math.round(n*100)+"%",this.ox,this.oy)
        // } else {
        //   this.ctx.fillText("--",this.ox,this.oy)
        // }
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
      // 显示模式弹框
      showMode() {
        if (this.isClose || this.isOffline || this.networkStatus == -1) return
        this.$refs.model.show = true
      },
      // 模式选择
      setModel(attr) {
        HdSmart.UI.vibrate()
        if(!attr) {
          if(this.$refs.model.show) this.$refs.model.show = false
          return
        }
        if(attr) return this.controlDevice("temperature", attr)
        .then((res) => {
          if(res.code == 0) {
            if(this.$refs.model.show) this.$refs.model.show = false
          }
        })
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
    &::before{
      content: "";
      // background-image: url('~@lib/@{imgPath3}/bg02.png');
      // background-repeat:no-repeat;
      background: #000;
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
    height: 400px;
    margin-bottom: 260px;
    /*position: relative;*/
    // zoom: 0.5;
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
  .canvas {
    margin-top: 80px;
    z-index: 2;
    position: absolute;
    // width: 521px;
    width: 570px;
    height: 570px;
    border-radius: 50%;
  }
  .panel-btn {
    bottom: 0;
    left: 0;
    right: 0;
    margin-top: 66px;
    padding: 0 30px 96px;
    z-index: 9999;
    width: 100%;
    border-radius: 42px 42px 0px 0px;
    flex-wrap: wrap;
    justify-content: center;
    .btn {
      margin-top: 24px;
      width: 100%;
      border-radius: 40px 40px 0 0;
      display: flex;
      align-items: center;
    }
  }
  .btn-wrap {
    margin: 0 24px;
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
      &::before {
        position: relative;
        z-index: 100;
      }
      &.active {
        background-image: linear-gradient(45deg, #EF6D5E 0%, #F9BB6B 100%);
      }
      &.noactive{
        background: rgba(37,37,37,0.8);
      }
    }
    .btn-switch {
      &::before {
        content: "";
        display: block;
        width: 48px;
        height: 48px;
        background-size: 100% 100%;
        background-image: url("~@lib/@{imgPath3}/new_kg_btn_off.png");
      }
      &.active::before{
        display: block;
        width: 48px;
        height: 48px;
        background-image: url("~@lib/@{imgPath}/btn_ac_on_cd@2x.png") !important;
        background-size: 100% 100%;
      }
    }
  }
  &.offline {
    overflow: hidden;
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
      background-image: linear-gradient(45deg, #EF6D5E 0%, #F9BB6B 100%);
      // background: #E1B96E;
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


