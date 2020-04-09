<template>
  <div
    ref="body"
    class="body"
    @touchstart="bodyTouchstart"
    @touchmove="bodyTouchmove"
    @touchend="bodyTouchEnd">
    <div
      :class="[{ 'offline': isOffline }, {'close': isClose}, 'page', {'scroll44': classTrue}]"
    >
      <NewTopBar
        :title="device.device_name"
        :room="device.room_name"
        @hscroll="hscroll"
        @hscrolltop="hscrolltop"/>
      <!-- <StatusTip v-show="device.device_uuid"/> -->
      <div class="main center">
        <div class="wrap-circle">
          <div class="showtemp">
            <div
              v-if="deviceAttrs.connectivity == 'offline'||deviceAttrs.switch=='off'||deviceAttrs.mode=='wind'"
              class="tm">-- <sup>°C</sup></div>
            <div
              v-if="!isOffline&& deviceAttrs.switch == 'on'&&deviceAttrs.mode!=='auto'&&deviceAttrs.mode!='wind'"
              class="tm">{{ thermography }}<sup>°C</sup>
            </div>
            <div
              v-if="!isOffline&& deviceAttrs.switch == 'on'&&deviceAttrs.mode=='auto'"
              class="tm">25<sup>°C</sup>
            </div>
            <div
              v-show="!isOffline&& deviceAttrs.switch == 'on'"
              :class="[deviceAttrs.mode, 'c-mode']">当前温度{{ deviceAttrs.env_temperature | filterTm }}°C</div>
            <div
              v-show="isOffline||deviceAttrs.switch == 'off'"
              :class="[deviceAttrs.mode, 'c-mode']">当前温度--°C</div>
          </div>
          <!-- 当不可调节温度时，显示这个盒子，可以挡着canvas，使它不能滑动 -->
          <div
            v-if="deviceAttrs.mode=='wind'||deviceAttrs.mode=='auto'"
            class="cover"
            @touchmove.prevent/>
          <canvas
            ref="canvas"
            class="canvas"
            width="560"
            height="560"
          />
        </div>
        <div
          class="control-tm center">
          <button
            ref="reduce"
            :disabled="setTemperatureDis"
            class="control reduce btn"
            @click="setTemperature('reduce',-10)"
          />
          <button
            ref="add"
            :disabled="setTemperatureDis"
            class="control add btn"
            @click="setTemperature('add',10)"
          />
        </div>
      </div>
      <!-- 开关 -->
      <div
        class="starting">
        <div
          ref="switchStatus"
          :class="[deviceAttrs.mode,{'active': deviceAttrs.switch == 'on'&&!isOffline},' btn-start switchColor']"
          @click="setSwitch('switchStatus')"
        />
      </div>
      <div
        ref="bottomControl"
        :style="{bottom: bottom1}"
        class="bottom-control">
        <div
          class="panel-btn center">

          <div
            class="bottom noborder"
            @click.stop="showMode">
            <div class="Charging-protection">
              <div>模式</div>
              <div
                style="z-index: 100;">
                <div class="timing-right">{{ custom ? "普通模式" : modeTitle }}</div>
              </div>
            </div>
          </div>
          <!-- 上下风 -->
          <div class="bottom">
            <div class="Charging-protection">
              <div>童锁</div>
              <div
                style="z-index: 100;">
                <input
                  :class="[deviceAttrs.mode,'switch switch-anim']"
                  :checked="deviceAttrs.wind_up_down=='on'"
                  :disabled="disabledLock"
                  type="checkbox"
                  @click="checkSwitch('wind_up_down')">
              </div>
            </div>
          </div>
          <!-- 左右风 -->
          <div class="bottom">
            <div class="Charging-protection">
              <div>智能防冻</div>
              <div
                style="z-index: 100;">
                <input
                  :class="[deviceAttrs.mode,'switch switch-anim']"
                  :checked="deviceAttrs.wind_left_right=='on'"
                  :disabled="disabledLock"
                  type="checkbox"
                  @click="checkSwitch('wind_left_right')">
              </div>
            </div>
          </div>
          <!-- 模式和风速 -->
          <div class="modespeed">
            <div
              class="btn-wrap">
              <div class="title">用气</div>
              <div class="txt">实时 0m³/h</div>
              <div class="txt">累计 14355333330.2m³</div>
            </div>
            <div
              class="btn-wrap">
              <div class="title">用水</div>
              <div class="txt">实时 0m³/h</div>
              <div class="txt">累计 14355333330.2m³</div>
            </div>
          </div>
        </div>
      </div>
      <!--选择模式-->
      <model-mode
        ref="mode"
        :mode="deviceAttrs.mode"
        @setMode="setMode" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import modelMode from './components/model-mode'
const [MIN_TEMP, MAX_TEMP] = [160, 320]
export default {
  components: {
    modelMode,
  },
  data() {
    return {
      ox:140,
      oy:140,
      or:120,
      br:15,
      moveFlag:false,
      centigrade:0,//摄氏度
      ctx: '',
      thermography:16,
      setTemperatureDis:false,
      hscrolll: 0,
      hscrolltopp: 0,
      classTrue: false,
      disabledLock: false,
      linearGradientArr: [
        {
          step: '0',
          color: '#FD30AA'
        },
        {
          step: '1.0',
          color: '#FF59DA'
        }
      ],
      custom: true,
      bottom1: '0',
      touchStartPoint: 0,
      touchEndPoint: 0,
      canMove: false,
      minVisibleHeight:0,
      controlHight:0,
    }
  },

  computed: {
    ...mapGetters(['isOffline']),
    ...mapState(['device', 'deviceAttrs']),
    isClose(){
      return this.deviceAttrs.switch == 'on'?false:true
    },
    isOffline(){
      return this.deviceAttrs.connectivity == 'online'?false:true
    },
  },
  watch: {
    "deviceAttrs"() {
    },
    "device.stateChange"(){
        this.draw(`${0.125+0.046875*(this.deviceAttrs.temperature/10-16)}`)
    },
    "hscrolltopp"() {
      if(this.hscrolltopp >= this.hscrolll) {
        this.classTrue = true
      } else {
        this.classTrue = false
      }
    }
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
        .then(() => {
            this.draw(`${0.125+0.046875*(this.deviceAttrs.temperature/10-16)}`)
          // this.reset()
        })
      HdSmart.UI.setStatusBarColor(2)
    })
    if(document.body.offsetHeight == 568) {
      this.minVisibleHeight = 25
    } else if(document.body.offsetHeight < 620) {
      this.minVisibleHeight = 50
    } else {
      this.minVisibleHeight = 100
    }
  },
  mounted(){
    this.ctx = this.$refs.canvas.getContext("2d")
    this.ctx.scale(2,2)
    this.$nextTick(() => {
      setTimeout(() => {
        window.scrollTo(0, 0)
      }, 200)
      this.resetPosition()
      let isMove = false
      let on = ("ontouchstart" in document)? {
          start: "touchstart", move: "touchmove", end: "touchend"
      } : {
          start: "mousedown", move: "mousemove", end: "mouseup"
      }
        this.$refs.canvas.addEventListener(on.start,(e)=> {
          e.stopPropagation()
        if(e.preventDefault){
            e.preventDefault()
        }else{
            e.returnValue = false
        }
          this.br = 20
          this.moveFlag = true
      },false)

      this.$refs.canvas.addEventListener(on.move, (e)=> {
        e.stopPropagation()
        if(e.preventDefault){
            e.preventDefault()
        }else{
            e.returnValue = false
        }
        isMove = true
          if (this.moveFlag) {
              var k = this.getXY(e,this.$refs.canvas)
              var r = Math.atan2(k.x-this.ox, this.oy-k.y)
              var hd = (Math.PI+r)/(2*Math.PI)
              // 半圆的滑动范围判断
              if (hd <= 0.875 && hd >= 0.125) {
                  console.log('开始运动')
                  this.draw(hd)
              }else{
                return
              }
          }
      }, false)

      this.$refs.canvas.addEventListener(on.end,()=> {
        this.br = 15
        if (this.isOffline||this.isClose) return
          this.moveFlag = false
          if (isMove) {
            this.controlDevice('temperature',this.centigrade)
            .then((res) => {
              if (res) {
                if(res.code == 0) {
                  this.deviceAttrs.temperature = this.centigrade
                  this.draw(`${0.125+0.046875*(this.deviceAttrs.temperature/10-16)}`)
                }
                if (res == null) {
                  HdSmart.UI.toast('操作失败')
                }
              }
            })
          }
        isMove = false
      }, false)
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    resetPosition() {
      this.$nextTick(() => {
        let bottomHeight = this.$refs.bottomControl.offsetHeight
        if (this.controlHight===bottomHeight) return
        let result = document.body.offsetHeight - this.$refs.switchStatus.offsetTop - this.$refs.switchStatus.offsetHeight
        let showHight = this.controlHight?this.controlHight + parseFloat(getComputedStyle(this.$refs.bottomControl).bottom): bottomHeight
        if (result < bottomHeight) {
          this.canMove = true
          if (this.controlHight<bottomHeight) {
            this.bottom1 = this.controlHight? showHight-bottomHeight + 'px':-(bottomHeight - this.minVisibleHeight) + 'px'
          }else {
            if (showHight>= bottomHeight) {
              this.bottom1 = '10px'
            }else {
              this.bottom1 = showHight-bottomHeight + 'px'
            }
          }
        } else {
          if(showHight>=bottomHeight){
            this.bottom1 = '10px'
            this.canMove = false
          }else {
            this.minVisibleHeight = showHight
            this.bottom1 = showHight-bottomHeight + 'px'
            this.canMove = true
          }
        }
        this.controlHight = bottomHeight
      })
    },
    bodyTouchstart(e) {
      this.touchStartPoint = e.touches[0].pageY
      this.touchEndPoint = e.touches[0].pageY
      this.bottom1 = getComputedStyle(this.$refs.bottomControl).bottom
    },
    bodyTouchmove(e) {
      if (!this.canMove) return
      let pageY =  e.changedTouches[0].pageY
      let bottomHeight = this.$refs.bottomControl.offsetHeight
      let IsUp = pageY - this.touchEndPoint < 0
      let bottomOff = parseFloat(this.bottom1)
      let position = bottomOff
      if (IsUp && bottomOff >= -(bottomHeight - this.minVisibleHeight)||(!IsUp && bottomOff <= 10)) {
        position = bottomOff - (pageY - this.touchEndPoint)
      }
      if (position>10) position = 10
      if (position<this.minVisibleHeight-bottomHeight) {
        position = this.minVisibleHeight-bottomHeight
      }
      this.bottom1 = position+ 'px'
      this.touchEndPoint = pageY
    },
    bodyTouchEnd() {
      if (Math.abs(this.touchEndPoint - this.touchStartPoint) > 30) {
        if (this.touchStartPoint - this.touchEndPoint > 0) {
          this.gentlyMove('up')
        } else {
          this.gentlyMove('down')
        }
      }
    },
    gentlyMove(direction = 'up') {
      let bottomOff = parseFloat(getComputedStyle(this.$refs.bottomControl).bottom)
      if (direction === 'down') {
        if (bottomOff > -(this.$refs.bottomControl.offsetHeight - this.minVisibleHeight)) {
          this.bottom1 = bottomOff>=0? bottomOff*0.9- 0.3+ 'px':bottomOff*1.05- 0.5+'px'
          requestAnimationFrame(() => {
            this.gentlyMove(direction)
          })
        } else {
          this.bottom1 = -(this.$refs.bottomControl.offsetHeight - this.minVisibleHeight) + 'px'
        }
      } else {
        if (bottomOff < 0) {
          this.bottom1 = bottomOff*0.9+ 1+ 'px'
          requestAnimationFrame(() => {
            this.gentlyMove(direction)
          })
        } else if (bottomOff<=10) {
          this.bottom1 = bottomOff*1.1+ 1+ 'px'
          requestAnimationFrame(() => {
            this.gentlyMove(direction)
          })
        }else {
          this.bottom1 = '10px'
        }
      }
    },
    hscroll(val) {
      this.hscrolll = val
    },
    hscrolltop(val) {
      this.hscrolltopp = val
    },
    touchstart(val) {
      if (val == 'switchStatus') {
        if (this.isOffline) return
      }else{
        if (this.deviceAttrs.switch=='off'||this.isOffline) return
      }
       let btn = document.querySelectorAll('.btn')
      for(let i=0;i<btn.length;i++){
        if (val!=='add'&&val!=='reduce') {
          btn[i].classList.remove('active')
        }
        btn[i].classList.remove('animateEnd')
        btn[i].classList.remove('bgcEnd')
        btn[i].classList.remove('yellowExtend')
      }
      this.$refs[val].classList.add('animateStart')
      if(val=='add'||val=="reduce"){
        this.$refs[val].classList.add('bgcStart')
      }else{
        // this.$refs[val].classList.add('yellowExtend')
      }
    },
    touchend(val){
      if (val == 'switchStatus') {
        if (this.isOffline) return
      }else{
        if (this.deviceAttrs.switch=='off'||this.isOffline) return
      }
      let btn = document.querySelectorAll('.btn')
      for(let i=0;i<btn.length;i++){
        btn[i].classList.remove('animateStart')
        btn[i].classList.remove('bgcStart')
      }
      this.$refs[val].classList.add('animateEnd')
    },
    offset(r,d) {//根据弧度与距离计算偏移坐标
      return {x: -Math.sin(r)*d, y: Math.cos(r)*d}
    },
    draw(n) {
      console.log(this.$refs.canvas.width,'this.$refs.canvas.width')
      this.ctx.clearRect(0,0,this.$refs.canvas.width,this.$refs.canvas.height)
      this.ctx.strokeStyle = "rgba(151,151,151,0.2)"
      this.ctx.lineWidth = 20
      this.ctx.beginPath()
      this.ctx.shadowColor =  "none"
      this.ctx.shadowOffsetX = 0
      this.ctx.shadowOffsetY = 0
      this.ctx.shadowBlur = 0
      this.ctx.lineCap = 'round'
      this.ctx.arc(this.ox,this.oy,this.or,1/4 * Math.PI,3/4 * Math.PI,true)//半圆(逆时针)
      // this.ctx.arc(this.ox,this.oy,this.or,0,2*Math.PI,true);//整圆
      this.ctx.stroke()
      // 画一个渐变
      var gradient = this.ctx.createLinearGradient(0, this.oy * 2, 2*this.ox, 0)
      this.linearGradientArr.forEach(element => {
        gradient.addColorStop(element.step, element.color)
      })
      this.ctx.strokeStyle = gradient
      if (this.deviceAttrs.switch=='on'&&!this.isOffline) {
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
      this.ctx.lineCap = 'round'
      this.ctx.arc(this.ox,this.oy,this.or,3/4 *Math.PI,(n*2+0.5)*Math.PI,false)
      this.ctx.stroke()
      // console.log( Math.round((n*(16/0.75))+(16-((16*0.125)/0.75)))+"℃",'温度')
      this.thermography = Math.round((n*(16/0.75))+(16-((16*0.125)/0.75)))
      this.centigrade = Math.round((n*(16/0.75))+(16-((16*0.125)/0.75)))*10
      this.ctx.fillStyle = "#fff"
      this.ctx.beginPath()
      this.ctx.shadowOffsetX = 0
      this.ctx.shadowOffsetY = 2
      this.ctx.shadowBlur = 4
      this.ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
      let d =  this.offset(n*2*Math.PI,this.or)
      // console.log('d', d)
      // 开机显示
      if (this.deviceAttrs.switch=='on'&&!this.isOffline&&this.deviceAttrs.mode!=='wind'&&this.deviceAttrs.mode!=='auto') {
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
            x : x - obj.offsetLeft + (document.body.scrollLeft || document.documentElement.scrollLeft)-30,
            y : y - obj.offsetTop  + (document.body.scrollTop || document.documentElement.scrollTop) -145
        }
    },
    // 开关机
    setSwitch(val){
      if (this.isOffline) return
      HdSmart.UI.vibrate()
            this.touchstart(val)
      setTimeout(() => {
        this.touchend(val)
      }, 150)
      let switchstatus = ''
      if (this.deviceAttrs.switch=='on') {
        switchstatus = 'off'
      }else{
        switchstatus = 'on'
      }
      this.controlDevice('switch',switchstatus)
      .then((res) => {
          if (res) {
            if(res.code == 0) {
                this.deviceAttrs.switch = switchstatus
            }
          }
          if(res == null){
            HdSmart.UI.toast('操作失败')
          }
        })
    },
    // 设置模式
    setMode(val) {
      if(this.isClose||this.isOffline) return
      HdSmart.UI.vibrate()
      this.touchstart(val)
      setTimeout(() => {
        this.touchend(val)
      }, 150)
      if (val == this.deviceAttrs.mode ) return
      this.controlDevice('mode', val)
       .then((res) => {
         if (res) {
           if(res.code == 0) {
            this.deviceAttrs.mode = val
            // this.reset()
            this.hide()
           }
         }
        if(res == null){
           HdSmart.UI.toast('操作失败')
           this.$refs[val].classList.remove('yellowExtend')
           this.$refs[this.deviceAttrs.mode].classList.add('active')
        }
       })
    },
    setTemperature(val,step) {
      if (this.isOffline||this.isClose) return
      HdSmart.UI.vibrate()
            this.touchstart(val)
      setTimeout(() => {
        this.touchend(val,temp)
      }, 150)
      this.setTemperatureDis = true
      if(this.deviceAttrs.mode == 'auto') {
        this.setTemperatureDis = false
        return HdSmart.UI.toast('智能模式不支持温度调节')
      }
      // 送风模式不能设置温度
      if (this.deviceAttrs.mode === 'wind') {
        this.setTemperatureDis = false
        return HdSmart.UI.toast('送风模式不支持温度调节')
      }
      let temp = +this.deviceAttrs.temperature + step
      // 最小温度
      if (temp < MIN_TEMP) {
        if (this.deviceAttrs.temperature == MIN_TEMP) {
          this.setTemperatureDis = false
          return HdSmart.UI.toast('温度已调至最低')
        } else {
          temp = MIN_TEMP
        }
      }
      // 最大温度
      if (temp > MAX_TEMP) {
        if (this.deviceAttrs.temperature == MAX_TEMP) {
          this.setTemperatureDis = false
          return HdSmart.UI.toast('温度已调至最高')
        } else {
          temp = MAX_TEMP
        }
      }
      this.controlDevice('temperature', temp)
       .then((res) => {
          if (res) {
            if(res.code == 0) {
              this.deviceAttrs.temperature = temp
              this.setTemperatureDis = false
              this.draw(`${0.125+0.046875*(this.deviceAttrs.temperature/10-16)}`)
            }
          }
        if(res == null){
           HdSmart.UI.toast('操作失败')
        }
       })
    },
    showMode() {
      if (this.isClose) return
      this.$refs.mode.show = true
    },
    hide(){
      if(this.$refs.swing.show) this.$refs.swing.show = false
      if(this.$refs.mode.show) this.$refs.mode.show = false
      if(this.$refs.speed.show) this.$refs.speed.show = false
    },
    controlDevice(attr, value) {
      let param = {}
      return this.doControlDevice({
        nodeid: `airconditioner.main.${attr}`,
        params: {
          attribute: {
            [attr]: value,
            ...param
          }
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
@imgPath: 'base/air_condition/assets/new-air';
@imgPath1: 'base/oakes_air_condition/assets';
@imgPath2: 'base/ch_air_condition/assets';
@font-face{
  font-family: 'Rajdhani-Regular';
  src: url('~@lib/base/ch_air_condition/assets/Rajdhani-Regular.ttf');
  font-weight: normal;
  font-style: normal;
}
.body{
    height: 100vh;
  }
.canvas {
  // width: 560px;
}
.page {
  &::before{
    content: "";
    background: #000;;
    position: fixed;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }
  &::-webkit-scrollbar {
		display: none;
	}
  .control-tm{
    position: relative;
    top: -90px;
    height: 130px;
    z-index: 9;

    width: 380px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .control{
      outline: none;
      border: none;
      width: 88px;
      height: 88px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      &.add{
         width: 88px;
         height: 88px;
         &::before{
           position: relative;
           z-index: 100;
          content: "";
          display: block;
          width: 88px;
          height: 88px;
          background-image: url('~@lib/@{imgPath2}/up.png');
          background-size: 50% 50%;
          background-position: center;
          background-repeat: no-repeat;
         }
      }
      &.reduce{
        width: 88px;
         height: 88px;
         &::before{
          position: relative;
          z-index: 100;
          content: "";
          display: block;
          width: 88px;
          height: 88px;
          background-image: url('~@lib/@{imgPath2}/down.png');
          background-size: 50% 50%;
          background-position: center;
          background-repeat: no-repeat;
         }
      }
    }
  }
  .main {
    // position: relative;
    margin-top:44px;
    &.center {
      flex-direction: column;
    }
    .wrap-circle{
      position: relative;
      zoom: 0.5;
      .showtemp{
        position: absolute;
        top: 45%;
        left: 49.5%;
        width: 280px;
        height: 280px;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
        .tm{
          // margin-top: 60PX;
          font-family: Rajdhani-Regular;
          position: relative;
          font-size: 160px;
          color: #fff;
          text-align: center;
          transform: scale(2);
          sup{
            position: absolute;
            top: -5px;
            right: -22px;
            font-size: 24px;
            color: #fff;
            transform: scale(1);
          }
        }
        .c-mode{
          font-family: Rajdhani-Regular;
          position: absolute;
          transform: translate(-50%,-50%);
          top: 120%;
          left: 50%;
          width: 216px;
          height: 48px;
          font-size: 24px;
          text-align: center;
          line-height: 48px;
          zoom:2;
          color: #fff;
        }
      }
      .cover{
        position: absolute;
        top: 0;
        left: 0;
        width: 560px;
        height: 560px;
      }
    }
  }
  .starting{
    .btn-start{
    z-index: 99;
    box-sizing: border-box;
    margin: 0 auto;
    width: 120px;
    height: 120px;
    background-image: linear-gradient(225deg, #FF59DA 0%, #FD30AA 100%);
    border-radius: 50%;
    position: relative;
    &::before{
      content: "";
      position: absolute;
      z-index: 100;
      left: 50%;
      top: 50%;
      margin-left: -24px;
      margin-top: -24px;
      background-image: url('~@lib/@{imgPath2}/kt_btn_on.png');
      background-size: 100% 100%;
      width: 48px;
      height: 48px;
    }
    }
  }
  .panel-btn {
    flex-direction: column;
    z-index: 9999;
    // margin-top: 60px;
    margin: 0 24px 12px;
    border-radius: 10px;
    font-family: PingFangSC-Light;
    font-size: 32px;
    color: #fff;
    /*适应苹果*/
    -webkit-overflow-scrolling: touch;
    background: rgba(255, 255, 255, 0.1);
  }
  /*隐藏掉滚动条*/
	.panel-btn::-webkit-scrollbar {
		display: none;
	}
  /*********** 按钮 ***********/
  .modespeed{
    width: 100%;
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 0.5px solid #000;
    .btn-wrap {
      padding: 0 40px;
      width: 100%;
      // height: 180px;
      flex-direction: column;
      &:first-of-type{
          border-right: 0.5px solid #000;
      }
      &:nth-of-type(2){
        border-right: 0.5px solid #000;
      }
      &:last-of-type{
        border-right: none;
      }
      .title {
        opacity: 0.5;
        font-family: PingFangSC-Light;
        font-size: 12px;
        color: #FFFFFF;
        letter-spacing: 0;
        margin-bottom: 12px;
      }
      .txt {
        font-family: PingFangSC-Light;
        font-size: 12px;
        color: #FFFFFF;
        letter-spacing: 0;
        margin-bottom: 4px;
      }
    }
  }
  &.close,
  &.offline.cover {
    &:before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      width: 100%;
    }
    &.page {
      .control-tm{
        .control{
          &::before{
            opacity: 0.3;
          }
        }
      }
      .starting{
          .switchColor{
            background: rgba(255, 255, 255, .1);
          }
          .btn-start::before{
            content: "";
            position: absolute;
            z-index: 100;
            left: 50%;
            top: 50%;
            margin-left: -24px;
            margin-top: -24px;
            background-image: url('~@lib/@{imgPath2}/kt_btn_off.png');
            background-size: 100% 100%;
            width: 48px;
            height: 48px;
          }
      }
      .bottom{
        opacity:.3;
      }
    }
    .btn-wrap {
      opacity: .3;
      .btn {
        &.active {
          background: #fff;
          border: 1px solid #818181;
        }
      }
    }
  }
}
.bottom{
  width: 100%;
  height: 120px;
  border-top: 0.5px solid #000;
  &.noborder {
    border-top: none;
  }
}
.timing,.Charging-protection{
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: PingFangSC-Regular;
  font-size: 32px;
  height: 120px;
  line-height: 120px;
  border-top: 1px rgba(0, 0, 0, .1) solid;
  .timing-right {
    display: flex;
    align-items: center;
    height: 64px;
    line-height: 64px;
    font-size: 32px;
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
}
.switch {
  width: 72px;
  height: 40px;
  position: relative;
  border: 1px solid transparent;
  border-radius: 10px;
  background-clip: content-box;
  display: inline-block;
  -webkit-appearance: none;
  user-select: none;
  outline: none;
  background-color: rgba(255, 255, 255, 0.2);

}
.switch:before {
    content: '';
    width: 35px;
    height: 35px;
    position: absolute;
    // top: 1px;
    left: 0;
    border-radius: 50%;
    // box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    background: #fff;
}
    &.switch:checked {
        background-image: linear-gradient(225deg, #FF59DA 0%, #FD30AA 100%);
    }
.switch:checked:before {
    left: 34px;
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
};

.animateStart::before{
  animation: scaleStart 0.15s;
       animation-fill-mode : forwards;

}
@keyframes scaleStart {
  0%{
    transform: scale(1);
  }
  100%{
    transform: scale(0.6);
  }
}

.animateEnd::before{
  animation: scaleEnd 0.3s;
  animation-fill-mode : forwards;

}
@keyframes scaleEnd {
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
      // background-image: linear-gradient(to right, #F1CB85, #E1B96E);
      background: #E1B96E;
      top: 50%;
      left: 50%;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: yellowExtendAnimate .15s 1;
       animation-fill-mode : forwards;
       animation-timing-function: ease-out;
      z-index: 99
    }
  }
  @keyframes yellowExtendAnimate {
    0% {width: 0%;height: 0%;}
    100% {width: 100%;height: 100%;}
  }


  .bgcStart{
    position: relative;
    &::after{
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.3);
      top: 50%;
      left: 50%;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: bgcStart .15s 1;
       animation-fill-mode : forwards;
       animation-timing-function: ease-out;
      z-index: 99
    }
  }
  @keyframes bgcStart {
    0% {width: 100%;height: 100%;}
    100% {width: 110%;height: 110%;}
  }
  .bottom-control {
    position: fixed;
    width: 100%;
    left: 0;
    z-index: 1000;
    background-color: black;
  }
</style>
