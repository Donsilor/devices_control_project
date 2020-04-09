<template>
  <div class="body">
    <div
      :class="[{ 'offline': isOffline }, {'close': isClose}, 'page', {'scroll44': classTrue}]"
    >
      <NewTopBar
        :title="device.device_name"
        :room="device.room_name"
        :scroll="true"
        @hscroll="hscroll"
        @hscrolltop="hscrolltop"/>
      <!-- <StatusTip v-show="device.device_uuid"/> -->
      <div class="main center">
        <div class="wrap-circle">
          <div class="showtemp">
            <div
              v-if="loaclAttr.connectivity == 'offline'||loaclAttr.switchStatus=='off'||loaclAttr.mode=='wind'"
              class="tm">-- <sup>°C</sup></div>
            <div
              v-if="!isOffline&& loaclAttr.switchStatus == 'on'&&loaclAttr.mode!=='auto'&&loaclAttr.mode!='wind'"
              class="tm">{{ thermography }}<sup>°C</sup>
            </div>
            <div
              v-if="!isOffline&& loaclAttr.switchStatus == 'on'&&loaclAttr.mode=='auto'"
              class="tm">25<sup>°C</sup>
            </div>
            <div
              v-show="!isOffline&& loaclAttr.switchStatus == 'on'"
              :class="[loaclAttr.mode, 'c-mode']">当前温度{{ loaclAttr.env_temperature | filterTm }}°C</div>
            <div
              v-show="isOffline||loaclAttr.switchStatus == 'off'"
              :class="[loaclAttr.mode, 'c-mode']">当前温度--°C</div>
          </div>
          <!-- 当不可调节温度时，显示这个盒子，可以挡着canvas，使它不能滑动 -->
          <div
            v-if="loaclAttr.mode=='wind'||loaclAttr.mode=='auto'"
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
      <!-- 当前状态 -->
      <!-- <div
        v-show="loaclAttr.timer_switch == 'on'&& loaclAttr.timer_value >0"
        class="status">
        {{ loaclAttr.timer_value | closeTime }}
      </div> -->
      <!-- 底部按钮 -->
      <!-- 开关 -->
      <div
        class="starting">
        <div
          ref="switchStatus"
          :class="[loaclAttr.mode,{'active': loaclAttr.switchStatus == 'on'&&!isOffline},' btn-start switchColor']"
          @click="setSwitch('switchStatus')"
        />
      </div>
      <div
        class="panel-btn center">
        <!-- 模式和风速 -->
        <!-- <div class="modespeed">
          <div
            class="btn-wrap center"
            @click="showMode">
            <div
              :class="[modeClass,'btn  center']"
            />
            <div class="btn-name">{{ modeTxt }}</div>
          </div>
          <div
            class="btn-wrap center"
            @click="showSpeed">
            <div
              :class="[loaclAttr.mode,speedClass,'btn center']" />
            <div class="btn-name">{{ speedTxt }}</div>
          </div>
        </div> -->
        <div class="bottom">
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
                :class="[loaclAttr.mode,'switch switch-anim']"
                :checked="loaclAttr.wind_up_down=='on'"
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
                :class="[loaclAttr.mode,'switch switch-anim']"
                :checked="loaclAttr.wind_left_right=='on'"
                :disabled="disabledLock"
                type="checkbox"
                @click="checkSwitch('wind_left_right')">
            </div>
          </div>
        </div>
      </div>
      <!-- 规格选择 -->
      <!-- 风速 -->

      <!--选择模式-->
      <model-mode
        ref="mode"
        :mode="loaclAttr.mode"
        @setMode="setMode" />
      <!--选择风速-->
      <model-speed
        ref="speed"
        :speed="loaclAttr.speed"
        @setSpeed="setSpeed" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import modelMode from './components/model-mode'
import modelSpeed from './components/model-speed'
const [MIN_TEMP, MAX_TEMP] = [160, 320]
export default {
  components: {
    modelMode,
    modelSpeed,
  },
  data() {
    return {
      isOpen: false,
      isShow: true,
      width: 250,
      radius: 8,
      progress: 30, // 0~70
      duration: 0,
      delay: 0,
      // barColor: '#D8D8D8',
      backgroundColor: '#ececec',
      timeShow: false,
      typeVal: 'hand',
      brightnessValue: 0,
      rangStyle: '',
      opcityStyle: 'opcity-0',
      animation:false,
      loaclAttr: {},
            //圆的数据
      ox:140,
      oy:140,
      or:120,
      br:15,
      moveFlag:false,
      centigrade:0,//摄氏度
      ctx: '',
      //记录温度
      thermography:16,
      setTemperatureDis:false,
      moveEnd:false,
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
    }
  },

  computed: {
    ...mapGetters(['isOffline']),
    ...mapState(['device', 'deviceAttrs']),
    isClose(){
      return this.loaclAttr.switchStatus == 'on'?false:true
    },
    isOffline(){
      return this.loaclAttr.connectivity == 'online'?false:true
    },
    modeIsActive() {
      return this.loaclAttr.mode == 'auto' || this.loaclAttr.mode == 'dehumidify' || this.loaclAttr.mode == 'wind'
    },
    windIsActive() {
      return this.loaclAttr.wind_up_down == 'on' || this.loaclAttr.wind_left_right == 'on'
    },
    modeClass() {
      /* eslint-disable no-unreachable */
      switch (this.loaclAttr.mode) {
        case 'auto':
          return 'btn-auto'
          break
        case 'dehumidify':
          return 'btn-dehumidify'
          break
        case 'wind':
          return 'btn-wind'
          break
        default:
          return 'btn-wind'
      }
    },
    speedClass() {
      /* eslint-disable no-unreachable */
      switch (this.loaclAttr.speed) {
        case 'low':
          return 'btn-low'
          break
        case 'normal':
          return 'btn-normal'
          break
        case 'high':
          return 'btn-high'
          break
        case 'auto':
          return 'btn-auto'
          break
        default:
          return 'btn-low'
      }
    },
    modeTxt(){
        /* eslint-disable no-unreachable */
      switch (this.loaclAttr.mode) {
        case 'cold':
          return '制冷'
          break
          case 'heat':
          return '制热'
          break
        case 'auto':
          return '智能'
          break
        case 'dehumidify':
          return '除湿'
          break
        case 'wind':
          return '送风'
          break
        default:
          return ''
      }
    },
    speedTxt(){
        /* eslint-disable no-unreachable */
      switch (this.loaclAttr.speed) {
        case 'breeze':
          return '微风'
          break
         case 'low':
          return '低风'
          break
        case 'normal':
          return '中风'
          break
        case 'high':
          return '高风'
          break
        case 'auto':
          return '自动风'
          break
        default:
          return ''
      }
    }
  },
  watch: {
    "deviceAttrs"() {
      this.loaclAttr = this.deviceAttrs
      // this.reset()
      console.log('=============', this.loaclAttr.mode)
    },
    "device.stateChange"(){
        this.draw(`${0.125+0.046875*(this.loaclAttr.temperature/10-16)}`)
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
            this.draw(`${0.125+0.046875*(this.loaclAttr.temperature/10-16)}`)
          // this.reset()
        })
      HdSmart.UI.setStatusBarColor(2)
    })
  },
  mounted(){
    this.ctx = this.$refs.canvas.getContext("2d")
    this.ctx.scale(2,2)
    this.$nextTick(() => {
      let isMove = false
      let on = ("ontouchstart" in document)? {
          start: "touchstart", move: "touchmove", end: "touchend"
      } : {
          start: "mousedown", move: "mousemove", end: "mouseup"
      }
        this.$refs.canvas.addEventListener(on.start,(e)=> {
          this.br = 20
          this.moveFlag = true
      },false)

      this.$refs.canvas.addEventListener(on.move, (e)=> {
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
                  this.loaclAttr.temperature = this.centigrade
                  this.draw(`${0.125+0.046875*(this.loaclAttr.temperature/10-16)}`)
                  console.log(this.loaclAttr.temperature,'-------------------------------------')
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
        if (this.deviceAttrs.switchStatus=='off'||this.isOffline) return
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
        if (this.deviceAttrs.switchStatus=='off'||this.isOffline) return
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
      if (this.loaclAttr.switchStatus=='on'&&!this.isOffline) {
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
      if (this.loaclAttr.switchStatus=='on'&&!this.isOffline&&this.deviceAttrs.mode!=='wind'&&this.deviceAttrs.mode!=='auto') {
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
    // 设置关机时间
    // setReserve(time) {
    //   let h = parseInt(time[0].split(':')[0])
    //   let m = parseInt(time[0].split(':')[1]) > 0 ? 1: 0
    //   console.log(h,m,'hm')
    //     this.controlDevice('time',{
    //         timer_value:h*2+m,
    //         timer_switch:'off'
    //     })
    // },
    // // 取消定时
    // canceltime(){
    //    this.controlDevice('close_time','true')
    //    .then((res) => {
    //      if(res.code == 0) {
    //        this.loaclAttr.close_time = true
    //      } else {
    //        HdSmart.UI.toast('操作失败')
    //      }
    //    })
    //    .catch(() => {
    //      HdSmart.UI.toast('操作失败')
    //    })
    // },
    // 开关机
    setSwitch(val){
      // console.log(document.documentElement.scrollTop,'===========')

      if (this.isOffline) return
      HdSmart.UI.vibrate()
            this.touchstart(val)
      setTimeout(() => {
        this.touchend(val)
      }, 150)
      let switchstatus = ''
      if (this.loaclAttr.switchStatus=='on') {
        switchstatus = 'off'
      }else{
        switchstatus = 'on'
      }
      this.controlDevice('switch',switchstatus)
      .then((res) => {
          if (res) {
            if(res.code == 0) {
                this.loaclAttr.switchStatus = switchstatus
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
      if (val == this.loaclAttr.mode ) return
      this.controlDevice('mode', val)
       .then((res) => {
         if (res) {
           if(res.code == 0) {
            this.loaclAttr.mode = val
            // this.reset()
            this.hide()
           }
         }
        if(res == null){
           HdSmart.UI.toast('操作失败')
           this.$refs[val].classList.remove('yellowExtend')
           this.$refs[this.loaclAttr.mode].classList.add('active')
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
      if(this.loaclAttr.mode == 'auto') {
        this.setTemperatureDis = false
        return HdSmart.UI.toast('智能模式不支持温度调节')
      }
      // 送风模式不能设置温度
      if (this.loaclAttr.mode === 'wind') {
        this.setTemperatureDis = false
        return HdSmart.UI.toast('送风模式不支持温度调节')
      }
      let temp = +this.loaclAttr.temperature + step
      // 最小温度
      if (temp < MIN_TEMP) {
        if (this.loaclAttr.temperature == MIN_TEMP) {
          this.setTemperatureDis = false
          return HdSmart.UI.toast('温度已调至最低')
        } else {
          temp = MIN_TEMP
        }
      }
      // 最大温度
      if (temp > MAX_TEMP) {
        if (this.loaclAttr.temperature == MAX_TEMP) {
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
              this.loaclAttr.temperature = temp
              this.setTemperatureDis = false
              this.draw(`${0.125+0.046875*(this.loaclAttr.temperature/10-16)}`)
            }
          }
        if(res == null){
           HdSmart.UI.toast('操作失败')
        }
       })
    },
    // 设置摆风
    setWind(attr) {
      if (this.isClose) return
      var val = this.loaclAttr[attr] === 'on' ? 'off' : 'on'
      // if (this.deviceAttrs.wind_up_down=='on') {
      //   this.controlDevice('wind_left_right','off')
      // }
      // if (this.deviceAttrs.wind_left_right=='on') {
      //    this.controlDevice('wind_up_down','off')
      // }
      console.log(attr,val,'2222222222222222222222')

      this.controlDevice(attr, val)
        .then((res) => {
         if (res) {
           if(res.code == 0) {
            this.loaclAttr[attr] = val
            this.hide()
           }
         }
         if(res == null){
           HdSmart.UI.toast('操作失败')
         }
       })
    },
    // 设置风速
    setSpeed(speed) {
      if (this.isOffline||this.isClose) return
      HdSmart.UI.vibrate()
      if(this.loaclAttr.mode == 'wind' && speed == 'auto') {
        return HdSmart.UI.toast('送风模式不能设置自动风速')
      }
      this.controlDevice('speed', speed)
        .then((res) => {
          if(res.code == 0) {
            this.loaclAttr.speed = speed
            this.hide()
         } else {
           HdSmart.UI.toast('操作失败')
         }
       })
       .catch(() => {
         HdSmart.UI.toast('操作失败')
       })
    },
    controlDevice(attr, value) {
      // console.log(this.loaclAttr,'-------------------------------------')

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
    // 重置动画
    // reset() {
    //   // this.barColor = this.getBarColor()
    //   this.progress = this.getProgress()
    //   this.$nextTick(() => {
    //     this.$refs.$circle.init()
    //   })
    // },
    showSwing() {
      if (this.isClose||this.isOffline) return
      this.$refs.swing.show = true
    },
    showMode() {
      if (this.isClose) return
      this.$refs.mode.show = true
    },
    showSpeed() {
      if (this.isClose) return
      this.$refs.speed.show = true
      this.$nextTick(()=>{
        this.animation = true
      },0)
    },
    showTime() {
      if (this.isClose) return
      this.$refs.time.show = true
    },
    hide(){
      if(this.$refs.swing.show) this.$refs.swing.show = false
      if(this.$refs.mode.show) this.$refs.mode.show = false
      if(this.$refs.speed.show) this.$refs.speed.show = false
    },

    getProgress() {
      // 计算温度进度条
      if (this.loaclAttr.mode=='auto') {
        return 70 /(32 - 16) * (250 / 10 - 16)
      }else if(this.loaclAttr.mode=='wind'){
        return 0
      }else{
        return 70 /(32 - 16) * (this.loaclAttr.temperature / 10 - 16)
      }
    }
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
.canvas {
  // width: 560px;
}
.page {
  &::before{
    content: "";
    // background-image: url('~@lib/@{imgPath1}/img_bg.png');
    // background-repeat:no-repeat;
    // background-size: 100% 100%;
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
  &.filter {
    filter: blur(12px);
  }
  .progress{
    transform: rotate(-126deg);
    position: relative;
  }
  .c-status {
    margin-top: 30px;
    font-size: 24px;
    color: #35353d;
    text-align: center;
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
        //  &.wind,&.auto{
        //   &::before{
        //     opacity: 0.3;
        //   }
        //  }
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
  .status{
    text-align: center;
    font-size: 24px;
    color: #20282B;
  }
  .starting{
    // margin-top: 100px;
    margin-bottom: 86px;
     .btn-start{
        z-index: 99;
        box-sizing: border-box;
        margin: 0 auto;
        width: 120px;
        height: 120px;
        // border: 1px solid #818181;
        background-image: linear-gradient(225deg, #FF59DA 0%, #FD30AA 100%);
        border-radius: 50%;
        position: relative;
        // &.active{
        //   // background-image: linear-gradient(to right, #F1CB85, #E1B96E);
        //   background: #E1B96E;
        // }
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
      .btn-name{
        text-align: center;
        color: #000;
        margin-top: 16px;
        font-size: 24px;
        font-family: PingFangSC-Light;
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
    .btn-wrap {
        width: 100%;
        height: 180px;
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
        .btn {
          box-sizing: border-box;
          margin: 0 auto;
          width: 44px;
          height: 44px;
          // border: 1px solid #818181;
          background: rgba(0,0,0,0.05);

          display: flex;
          flex-direction: column;
          &::before {
            position: relative;
            z-index: 100;
            content: "";
            display: block;
            width: 44px;
            height: 44px;
          }
        //   &.active {
        //     // background-image: linear-gradient(to right, #F1CB85, #E1B96E);
        //     background: #E1B96E;
        //   }
        }
        .btn-name {
          text-align: center;
          color: #fff;
          margin-top: 16px;
          font-size: 32px;
        }
        .cold,.dehumidify,.wind,.auto{
            &.btn-breeze{
                position: relative;
                z-index: 100;
                background-image: url('~@lib/@{imgPath2}/kt_mode_fan01_b.png');
                background-size: 100% 100%;
              }
              &.btn-low{
                position: relative;
                z-index: 100;
                background-image: url('~@lib/@{imgPath2}/kt_mode_fan02_b.png');
                background-size: 100% 100%;
              }
              &.btn-normal{
                position: relative;
                z-index: 100;
                background-image: url('~@lib/@{imgPath2}/kt_mode_fan03_b.png');
                background-size: 100% 100%;
              }
              &.btn-high{
                position: relative;
                z-index: 100;
                background-image: url('~@lib/@{imgPath2}/kt_mode_fan04_b.png');
                background-size: 100% 100%;
              }
              &.btn-auto1{
                position: relative;
                z-index: 100;
                background-image: url('~@lib/@{imgPath2}/kt_mode_fan05_b.png');
                background-size: 100% 100%;
              }
              &.btn-strong{
                position: relative;
                z-index: 100;
                background-image: url('~@lib/@{imgPath2}/kt_mode_fan06_b.png');
                background-size: 100% 100%;
              }
              &.clock{
                position: relative;
                z-index: 100;
                background-image: url('~@lib/@{imgPath2}/kt_btn_time_b.png');
                background-size: 100% 100%;
              }
        }
        .heat{
            &.btn-breeze{
                position: relative;
                z-index: 100;
                background-image: url('~@lib/@{imgPath2}/kt_mode_fan01_r.png');
                background-size: 100% 100%;
              }
              &.btn-low{
                position: relative;
                z-index: 100;
                background-image: url('~@lib/@{imgPath2}/kt_mode_fan02_r.png');
                background-size: 100% 100%;
              }
              &.btn-normal{
                position: relative;
                z-index: 100;
                background-image: url('~@lib/@{imgPath2}/kt_mode_fan03_r.png');
                background-size: 100% 100%;
              }
              &.btn-high{
                position: relative;
                z-index: 100;
                background-image: url('~@lib/@{imgPath2}/kt_mode_fan04_r.png');
                background-size: 100% 100%;
              }
              &.btn-auto1{
                position: relative;
                z-index: 100;
                background-image: url('~@lib/@{imgPath2}/kt_mode_fan05_r.png');
                background-size: 100% 100%;
              }
              &.btn-strong{
                position: relative;
                z-index: 100;
                background-image: url('~@lib/@{imgPath2}/kt_mode_fan06_r.png');
                background-size: 100% 100%;
              }
              &.clock{
                position: relative;
                z-index: 100;
                background-image: url('~@lib/@{imgPath2}/kt_btn_time_r.png');
                background-size: 100% 100%;
              }
        }
        .btn-cold {
          &::before {
            position: relative;
            z-index: 100;
            background-image: url('~@lib/@{imgPath2}/kt_mode_cold.png');
            background-size: 100% 100%;
          }
        }
        .btn-heat {
          &::before {
            position: relative;
            z-index: 100;
            background-image: url('~@lib/@{imgPath2}/kt_mode_heat.png');
            background-size: 100% 100%;
          }
        }
        .btn-time {
          &::before {
            position: relative;
            z-index: 100;
            background-image: url('~@lib/@{imgPath2}/kt_mode_cold.png');
            background-size: 100% 100%;
          }
        }
        .btn-wind {
          &::before {
            position: relative;
            z-index: 100;
            background-image: url('~@lib/@{imgPath2}/kt_mode_songfeng.png');
            background-size: 100% 100%;
          }
        }

        .btn-dehumidify {
          &::before {
            position: relative;
            z-index: 100;
            background-image: url('~@lib/@{imgPath2}/kt_mode_dry.png');
            background-size: 100% 100%;
          }
        }
        .btn-auto{
          &::before {
            position: relative;
            z-index: 100;
            background-image: url('~@lib/@{imgPath2}/kt_mode_auto.png');
            background-size: 100% 100%;
          }
        }
        .btn-breath {
          &::before {
            background-image: url('~@lib/@{imgPath2}/kt_mode_cold.png');
            background-size: 100% 100%;
          }
        }
        .btn-sleep {
          &::before {
            background-image: url('~@lib/@{imgPath2}/kt_mode_cold.png');
            background-size: 100% 100%;
          }
        }
        .btn-fresh {
          &::before {
            background-image: url('~@lib/@{imgPath2}/kt_mode_cold.png');
            background-size: 100% 100%;
          }
        }
      }
  }
  .optionbox{
    width: 100%;
    margin: 10px 0 90px 0;
    font-family: PingFangSC-Light;
    .option{
      width: 100%;
      height: 120px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      padding: 0 40px;
      >div{
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 32px;
        color: #000;
        >span{
          display: inline-block;
          line-height: 120px;
          height: 120px;
          &:last-of-type{
            color: rgba(0, 0, 0, 0.5);
          }
          &.check{
            display: flex;
            align-items: center;
            >img{
              width: 32px;
            }
          }
        }
      }
    }
    .option1{
      padding: 0 40px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
            .check{
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 32px;
        color: #000;
        >span{
          display: inline-block;
          line-height: 120px;
          height: 120px;
          font-size: 32px;
          color: #000;
        }
        .checkBox{
            display: flex;
            align-items: center;
            justify-content: space-between;
            .speedBtn{
              width: 96px;
              height: 64px;
              text-align: center;
              line-height: 64px;
              font-family: PingFangSC-Light;
              font-size: 32px;
              margin-right: 20px;
              color: #000;
              opacity: .5;
              &:last-of-type{
                margin-right: 0px;
              }
              &.active{
                opacity: 1;
                position: relative;
                &::before{
                  display: block;
                  content: "";
                  width: 8px;
                  height: 8px;
                  border-radius: 50%;
                  background: #000;
                  position: absolute;
                  bottom: 0;
                  left: 50%;
                  margin-left: -4px;
                }
              }
            }
          }
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
      .screen{
          .Charging-protection{
              opacity: 0.3;
          }
      }
    }
    .btn-wrap {
      opacity: .3;
      &.up-index {
        opacity: 1;
      }
      .btn {
        &.active {
          background: #fff;
          border: 1px solid #818181;
        }
      }
    }
    .optionbox{
      opacity: .3;
    }
    // .bottom{
    //   opacity: .3;
    // }
  }
}
.bottom{
  width: 100%;
  height: 120px;
  border-top: 0.5px solid #000;
}
.screen{
  height: 120px;
  margin: 12px 24px 12px;
  background: rgba(255,255,255,.1);
  border-radius: 10px;
  color: #fff;
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
        // position: relative;
        // z-index: 999;
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
          // opacity: 0.5;
          // position: relative;
          // top: 2px;
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
  // 90%{
  //   transform: scale(1.3);
  // }
  //   100%{
  //   transform: scale(1);
  // }
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
</style>
