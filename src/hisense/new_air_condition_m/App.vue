<template>
  <div class="body">
    <div 
      :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']" 
    >
      <NewTopBar
        :title="device.device_name"
        :room="device.room_name"
        :scroll="true"
        page-class=".page"
        bak-color="#000"/>
      <StatusTip v-show="device.device_uuid"/>
      <div class="main center">
        <div class="wrap-circle">
          <div class="showtemp">
            <div
              v-if="deviceAttrs.connectivity == 'offline'||deviceAttrs.switchStatus=='off'"
              class="tm">-- <sup>°C</sup></div>
            <div
              v-if="!isOffline&& deviceAttrs.switchStatus == 'on'&&deviceAttrs.mode!=='wind'"
              class="tm">{{ thermography }}<sup>°C</sup>
            </div>
            <div
              v-if="!isOffline&& deviceAttrs.switchStatus == 'on'&&deviceAttrs.mode=='wind'"
              class="tm">{{ deviceAttrs.env_temperature | filterTm }}<sup>°C</sup>
            </div>
            <div
              v-show="!isOffline&& deviceAttrs.switchStatus == 'on'"
              :class="[deviceAttrs.mode, 'c-mode']">室内温度{{ deviceAttrs.env_temperature | filterTm }}℃</div>
            <div
              v-show="isOffline||deviceAttrs.switchStatus == 'off'"
              :class="[deviceAttrs.mode, 'c-mode']">室内温度--℃</div>
          </div>
          <!-- 当不可调节温度时，显示这个盒子，可以挡着canvas，使它不能滑动 -->
          <div 
            v-show="deviceAttrs.mode=='wind'" 
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
      <div
        v-show="deviceAttrs.timer_switch == 'on'&& deviceAttrs.timer_value >0"
        class="status">
        {{ deviceAttrs.timer_value | closeTime }}
      </div>
      <!-- 底部按钮 -->
      <!-- 开关 -->
      <div
        class="starting">
        <div
          ref="switchStatus"
          :class="[{'active': deviceAttrs.switchStatus == 'on'&&!isOffline},'btn-start']"
          @click="setSwitch('switchStatus')"/>
      </div>
      <div
        class="panel-btn center">
        <div
          class="btn-wrap">
          <div 
            ref="cold" 
            :class="[{ 'active': deviceAttrs.mode == 'cold'&& deviceAttrs.switchStatus == 'on'&&!isOffline }, 'btn btn-cold center']" 
            @click="setMode('cold')"/>
          <div class="btn-name">制冷</div>
        </div>
        <div
          class="btn-wrap">
          <div 
            ref="heat" 
            :class="[{ 'active': deviceAttrs.mode == 'heat'&& deviceAttrs.switchStatus == 'on'&&!isOffline }, 'btn btn-heat center']" 
            @click="setMode('heat')"/>
          <div class="btn-name">制热</div>
        </div>
        <div
          class="btn-wrap">
          <div 
            ref="auto" 
            :class="[{ 'active': deviceAttrs.mode == 'auto'&& deviceAttrs.switchStatus == 'on'&&!isOffline }, 'btn btn-auto center']" 
            @click="setMode('auto')"/>
          <div
            class="btn-name" >智能</div>
        </div>
        <div
          class="btn-wrap">
          <div 
            ref="wind" 
            :class="[{ 'active': deviceAttrs.mode == 'wind'&& deviceAttrs.switchStatus == 'on'&&!isOffline }, 'btn btn-wind center']" 
            @click="setMode('wind')"/>
          <div class="btn-name">送风</div>
        </div>
        <div
          class="btn-wrap">
          <div 
            ref="dehumidify" 
            :class="[{ 'active': deviceAttrs.mode == 'dehumidify'&& deviceAttrs.switchStatus == 'on'&&!isOffline }, 'btn btn-dehumidify center']" 
            @click="setMode('dehumidify')"/>
          <div class="btn-name">除湿</div>
        </div>
        <div
          style="visibility:hidden"
          class="btn-wrap"/>
      </div>
      <!-- 规格选择 -->
      <!-- 风速 -->
      <div
        class="optionbox">
        <div class="option1">
          <div class="check">
            <span>风速</span>
            <div 
              class="checkBox">
              <div 
                :class="[{ 'active': deviceAttrs.speed == 'low'},'speedBtn']" 
                @click="setSpeed('low')">低</div>
              <div 
                :class="[{ 'active': deviceAttrs.speed == 'normal'},'speedBtn']" 
                @click="setSpeed('normal')">中</div>
              <div 
                :class="[{ 'active': deviceAttrs.speed == 'high'},'speedBtn']" 
                @click="setSpeed('high')">高</div>
              <div 
                v-show="deviceAttrs.mode!=='wind'"
                :class="[{ 'active': deviceAttrs.speed == 'auto'},'speedBtn']" 
                @click="setSpeed('auto')">自动</div>
            </div>
          </div>
        </div>
        <!-- 摆风 -->
        <div class="option">
          <div>
            <span>摆风</span>
            <span 
              class="check" 
              @click="showSwing">{{ deviceAttrs.wind_up_down=='on'?'上下风 ':'' }}{{ deviceAttrs.wind_left_right=='on'?'左右风':'' }}{{ deviceAttrs.wind_up_down=='off'&&deviceAttrs.wind_left_right=='off'?'设置':'' }}
              <img 
                src="../../../lib/base/oakes_air_condition/assets/arrow_in.png">
            </span>
          </div>
        </div>
      </div>

      <!--选择摆风-->
      <model-swing
        ref="swing"
        :wind_up_down="deviceAttrs.wind_up_down"
        :wind_left_right="deviceAttrs.wind_left_right"
        @setWind="setWind" />
      <!--选择模式-->
      <model-mode
        ref="mode"
        :mode="deviceAttrs.mode"
        @setMode="setMode" />
      <!--选择风速-->
      <model-speed
        ref="speed"
        :speed="deviceAttrs.speed"
        @setSpeed="setSpeed" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import circleProgress from './components/circle-progress'
import modelSwing from './components/model-swing'
import modelMode from './components/model-mode'
import modelSpeed from './components/model-speed'
import SelectTime from './components/time.vue'
const [MIN_TEMP, MAX_TEMP] = [180, 320]
export default {
  components: {
    circleProgress,
    modelSwing,
    modelMode,
    modelSpeed,
    SelectTime
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
            //圆的数据
      ox:140,
      oy:140,
      or:127,
      br:10,
      moveFlag:false,
      centigrade:0,//摄氏度
      ctx: '',
      //记录温度
      thermography:18,
      moveEnd:false,
      setTemperatureDis:false,
    }
  },

  computed: {
    ...mapGetters(['isClose', 'isOffline']),
    ...mapState(['device', 'deviceAttrs']),
    modeIsActive() {
      return this.deviceAttrs.mode == 'auto' || this.deviceAttrs.mode == 'dehumidify' || this.deviceAttrs.mode == 'wind'
    },
    windIsActive() {
      return this.deviceAttrs.wind_up_down == 'on' || this.deviceAttrs.wind_left_right == 'on'
    },
    modeClass() {
      /* eslint-disable no-unreachable */
      switch (this.deviceAttrs.mode) {
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
      switch (this.deviceAttrs.speed) {
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
  },
  watch: {
    "device.stateChange"(){
      if(!this.moveEnd)
      this.draw(`${0.125+0.75/14*(this.deviceAttrs.temperature/10-18)}`)
    },
    'deviceAttrs.temperature'() {
      if(this.deviceAttrs.temperature) {
        this.setTemperatureDis = false
      }
    }
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
        .then(() => {
          this.draw(`${0.125+0.75/14*(this.deviceAttrs.temperature/10-18)}`)
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
          this.moveFlag = true
      },false)

      this.$refs.canvas.addEventListener(on.move, (e)=> {
        if(e.preventDefault){
            e.preventDefault()
        }else{
            e.returnValue = false
        }
        console.log('move')
        isMove = true
          if (this.moveFlag) {
              var k = this.getXY(e,this.$refs.canvas)
              // console.log(e)
              
              // console.log(k.x-this.ox)
              var r = Math.atan2(k.x-this.ox, this.oy-k.y)
              var hd = (Math.PI+r)/(2*Math.PI)
              console.log('k', k)
              console.log('r', r)
              console.log('hd', hd)
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
          if (this.isOffline||this.isClose) return
          this.moveEnd = true
          this.moveFlag = false
          if (isMove) {
            if (this.thermography == 32 && this.deviceAttrs.speed == 'low' && this.deviceAttrs.mode == 'cold') {
              this.draw(`${0.125+0.75/14*(this.deviceAttrs.temperature/10-18)}`)
              return HdSmart.UI.toast('低风、制冷模式下不支持此温度，请调整后重试')
            }
            this.controlDevice('temperature',this.centigrade)
          }
          isMove = false
      }, false)
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    touchstart(val) {
      if (val == 'switchStatus') {
        if (this.isOffline) return
      }else{
        if (this.deviceAttrs.switchStatus=='off'||this.isOffline) return
      }
       if (this.deviceAttrs.temperature== 320 && this.deviceAttrs.speed == 'low'&&val == 'cold') {
        return HdSmart.UI.toast('低风、制冷模式不支持此温度，请调整后重试')
      }
       let btn = document.querySelectorAll('.btn')
      for(let i=0;i<btn.length;i++){
        if (val!=='add'&&val!=='reduce') {
          btn[i].classList.remove('active')
        }
        btn[i].classList.remove('animateEnd')
        btn[i].classList.remove('bgcEnd')

      }  
      this.$refs[val].classList.add('animateStart')
      if(val=='add'||val=="reduce"){
        this.$refs[val].classList.add('bgcStart')
      }else{
        this.$refs[val].classList.add('yellowExtend')
      }
    },
    touchend(val,step){ 
      if (val == 'switchStatus') {
        if (this.isOffline) return
      }else{
        if (this.deviceAttrs.switchStatus=='off'||this.isOffline) return
      }
      if (this.deviceAttrs.temperature== 320 && this.deviceAttrs.speed == 'low'&&val == 'cold') {
        return HdSmart.UI.toast('低风、制冷模式不支持此温度，请调整后重试')
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
      
      this.ctx.clearRect(0,0,this.$refs.canvas.width,this.$refs.canvas.height)
      this.ctx.strokeStyle = "rgba(0,0,0,0.05)"
      this.ctx.lineWidth = 7
      this.ctx.beginPath()
      this.ctx.shadowColor =  "none"
      this.ctx.shadowOffsetX = 0
      this.ctx.shadowOffsetY = 0
      this.ctx.shadowBlur = 0
      this.ctx.lineCap = 'round'
      this.ctx.arc(this.ox,this.oy,this.or,1/4 * Math.PI,3/4 * Math.PI,true)//半圆(逆时针)
      // this.ctx.arc(this.ox,this.oy,this.or,0,2*Math.PI,true);//整圆
      this.ctx.stroke()
      if (this.deviceAttrs.switchStatus=='on'&&!this.isOffline) {
          if (this.deviceAttrs.mode == 'heat') {
            console.log('heat111')
            this.ctx.strokeStyle = "#DA6C00"
          }else if(this.deviceAttrs.mode == 'cold'){
            console.log('cold111')
            this.ctx.strokeStyle = "#008CDA"
          }else if(this.deviceAttrs.mode == 'auto'||this.deviceAttrs.mode=='dehumidify'){
            console.log('else')
            this.ctx.strokeStyle = "#E1B96E"
          }
      }else{
        this.ctx.strokeStyle = "transparent"
      }
      
      this.ctx.lineWidth = 7
      this.ctx.beginPath()
      this.ctx.shadowColor =  "none"
      this.ctx.shadowOffsetX = 0
      this.ctx.shadowOffsetY = 0
      this.ctx.shadowBlur = 0
      this.ctx.arc(this.ox,this.oy,this.or,3/4 *Math.PI,(n*2+0.5)*Math.PI,false)
      // this.ctx.arc(this.ox,this.oy,this.or,0.5*Math.PI,(n*2+0.5)*Math.PI,false);
      this.ctx.stroke()
      this.ctx.fillStyle = "transparent"
      this.ctx.font = "70px PingFangSC-Light"
      this.ctx.textAlign = "center"
      this.ctx.textBaseline = "middle"
      this.ctx.fillText(Math.round((n*(14/0.75))+(18-((14*0.125)/0.75)))+"℃",this.ox,this.oy)
      console.log( Math.round((n*(14/0.75))+(18-((14*0.125)/0.75)))+"℃",'温度')
      this.thermography = Math.round((n*(14/0.75))+(18-((14*0.125)/0.75)))
      this.centigrade = Math.round((n*(14/0.75))+(18-((14*0.125)/0.75)))*10
      this.ctx.fillStyle = "#fff"
      this.ctx.beginPath()
      this.ctx.shadowOffsetX = 0
      this.ctx.shadowOffsetY = 2
      this.ctx.shadowBlur = 4
      this.ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
      let d =  this.offset(n*2*Math.PI,this.or)
      // console.log('d', d)
      // 关机显示
      if (this.deviceAttrs.switchStatus=='on'&&!this.isOffline&&this.deviceAttrs.mode!=='wind') {
        this.ctx.arc(this.ox+d.x,this.oy+d.y,this.br,0,2*Math.PI,true)
      }else{
        //开机显示
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
        this.moveEnd = false
      let switchstatus = ''
      if (this.deviceAttrs.switchStatus=='on') {
        switchstatus = 'off'
      }else{
        switchstatus = 'on'
      }
      this.controlDevice('switch',switchstatus)
    },
    // 设置模式
    setMode(val) {
      if (this.isOffline||this.isClose) return
      HdSmart.UI.vibrate()
      this.touchstart(val)
      setTimeout(() => {
        this.touchend(val)
      }, 150)
      if (this.deviceAttrs.temperature == 320 && this.deviceAttrs.speed == 'low' && val == 'cold') {
        this.setTemperatureDis = false
        return HdSmart.UI.toast('低风、制冷模式不支持此温度，请调整后重试')
      }
      if (val == this.deviceAttrs.mode) return
        this.moveEnd = false
      this.controlDevice('mode', val)
        .then((res) => {
            if (res) {
                if(res.code == 0) {
                this.deviceAttrs.mode = val
              }
              if (this.deviceAttrs.mode=='wind') {
                this.progress = 70 /(30 - 17) * (this.deviceAttrs.env_temperature / 10 - 17)
                // this.$refs.$circle.init()
                this.hide()
                return
              }
              // this.reset()
              this.hide()
            }
            if (res == null) {
              console.log(res,val,'res val=========')
              this.$refs[val].classList.remove('yellowExtend')
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
      // 送风模式不能设置温度
        this.moveEnd = false
        this.setTemperatureDis = true
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
      if (temp == MAX_TEMP && this.deviceAttrs.speed == 'low' && this.deviceAttrs.mode == 'cold') {
        this.setTemperatureDis = false
        return HdSmart.UI.toast('低风、制冷模式不支持此温度，请调整后重试')
      }
      this.controlDevice('temperature', temp)
        .then((res) => {
          if (res.code == 0) {
            // this.deviceAttrs.temperature = temp
          }else{
            this.setTemperatureDis = false
          }
        })
    },
    // 设置摆风
    setWind(attr) {
      if (this.isOffline||this.isClose) return
        this.moveEnd = false

      var val = this.deviceAttrs[attr] === 'on' ? 'off' : 'on'
      // if (this.deviceAttrs.wind_up_down=='on') {
      //   this.controlDevice('wind_left_right','off')
      // }
      // if (this.deviceAttrs.wind_left_right=='on') {
      //    this.controlDevice('wind_up_down','off')
      // }
      this.controlDevice(attr, val)
        .then(() =>{
          this.hide()
        })
    },
    // 设置风速
    setSpeed(speed) {
      if (this.isOffline||this.isClose) return
      HdSmart.UI.vibrate()
        this.moveEnd = false
      if(this.deviceAttrs.mode == 'wind' && speed == 'auto') {
        return HdSmart.UI.toast('送风模式不能设置自动风速')
      }
      if(this.deviceAttrs.mode == 'dehumidify') {
        return HdSmart.UI.toast('除湿模式下无法设定风速')
      }
      // console.log(speed, val)
      // this.typeVal = val
      if (this.deviceAttrs.temperature == MAX_TEMP && this.deviceAttrs.speed == 'low' && this.deviceAttrs.mode == 'cold') {
        return HdSmart.UI.toast('低风、制冷模式下不支持此温度')
      }
      this.controlDevice('speed', speed)
        .then(() =>{
          this.hide()
        })
    },
    controlDevice(attr, value) {
      let param = {}
      // if(attr == 'mode' && value == 'wind' && this.deviceAttrs.speed == 'auto'){
      //   param = { 'speed': 'low'}
      // }
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
    //     // this.$refs.$circle.init()
    //   })
    // },
    showSwing() {
      if (this.isClose) return
      this.$refs.swing.show = true
    },
    showMode() {
      if (this.isClose) return
      this.$refs.mode.show = true
    },
    showSpeed() {
      if (this.isClose) return
      this.$refs.speed.show = true
       
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
      return 70 /(30 - 17) * (this.deviceAttrs.temperature / 10 - 17)
    }
  }
}
</script>
