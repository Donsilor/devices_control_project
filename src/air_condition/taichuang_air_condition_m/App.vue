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
        bak-color="#000" />
      <StatusTip v-show="device.device_uuid"/>
      <div class="main center">
        <div class="wrap-circle">
          <div class="showtemp">
            <div
              v-if="deviceAttrs.connectivity == 'offline'||deviceAttrs.switchStatus=='off'"
              class="tm">-- <sup>°C</sup></div>
            <div
              v-if="!isOffline&& deviceAttrs.switchStatus == 'on'"
              class="tm">{{ thermography }}<sup>°C</sup>
            </div>
          </div>
          <!-- 当不可调节温度时，显示这个盒子，可以挡着canvas，使它不能滑动 -->
          <div 
            v-if="deviceAttrs.mode=='wind'" 
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
          :class="[{'active': deviceAttrs.switchStatus == 'on'&&!isOffline},' btn-start']"
          @click="setSwitch('switchStatus')"/>
      </div>
      <!-- 模式 -->
      <div
        class="panel-btn center">
        <div
          v-show="modeType.indexOf(2)!==-1"
          class="btn-wrap">
          <div 
            ref="cold" 
            :class="[{ 'active': deviceAttrs.mode == 'cold'&& deviceAttrs.switchStatus == 'on'&&!isOffline }, 'btn btn-cold center']" 
            @click="setMode('cold')" />
          <div class="btn-name">制冷</div>
        </div>
        <div
          v-show="modeType.indexOf(1)!==-1"
          class="btn-wrap">
          <div 
            ref="heat" 
            :class="[ { 'active': deviceAttrs.mode == 'heat'&& deviceAttrs.switchStatus == 'on'&&!isOffline }, 'btn btn-heat center']" 
            @click="setMode('heat')" />
          <div class="btn-name">制热</div>
        </div>
        <div
          v-show="modeType.indexOf(0)!==-1"
          class="btn-wrap">
          <div 
            ref="auto" 
            :class="[ { 'active': deviceAttrs.mode == 'auto'&& deviceAttrs.switchStatus == 'on'&&!isOffline }, 'btn btn-auto center']" 
            @click="setMode('auto')" />
          <div
            class="btn-name" >智能</div>
        </div>
        <div
          v-show="modeType.indexOf(3)!==-1"
          class="btn-wrap">
          <div 
            ref="wind" 
            :class="[{ 'active': deviceAttrs.mode == 'wind'&& deviceAttrs.switchStatus == 'on'&&!isOffline }, 'btn btn-wind center']" 
            @click="setMode('wind')" />
          <div class="btn-name">通风</div>
        </div>
        <div
          v-show="modeType.indexOf(4)!==-1"
          class="btn-wrap">
          <div 
            ref="dehumidify" 
            :class="[{ 'active': deviceAttrs.mode == 'dehumidify'&& deviceAttrs.switchStatus == 'on'&&!isOffline }, 'btn btn-dehumidify center']" 
            @click="setMode('dehumidify')" />
          <div class="btn-name">除湿</div>
        </div>
        <div
          v-show="modeType.indexOf(5)!==-1"
          class="btn-wrap">
          <div 
            ref="breath" 
            :class="[{ 'active': deviceAttrs.mode == 'breath'&& deviceAttrs.switchStatus == 'on'&&!isOffline }, 'btn btn-breath center']" 
            @click="setMode('breath')" />
          <div class="btn-name">换气</div>
        </div>
        <div
          v-show="modeType.indexOf(6)!==-1"
          class="btn-wrap">
          <div 
            ref="sleep" 
            :class="[{ 'active': deviceAttrs.mode == 'sleep'&& deviceAttrs.switchStatus == 'on'&&!isOffline }, 'btn btn-sleep center']" 
            @click="setMode('sleep')" />
          <div class="btn-name">睡眠</div>
        </div>
        <div
          v-show="modeType.indexOf(7)!==-1"
          class="btn-wrap">
          <div 
            ref="fresh" 
            :class="[{ 'active': deviceAttrs.mode == 'fresh'&& deviceAttrs.switchStatus == 'on'&&!isOffline }, 'btn btn-fresh center']" 
            @click="setMode('fresh')" />
          <div class="btn-name">清爽</div>
        </div>
        <!-- <div
          style="visibility:hidden"
          class="btn-wrap"/> -->
      </div>
      <!-- 规格选择 -->
      <!-- 风速 -->
      <div
        class="optionbox">
        <!-- 风速大于4种的时候展示 -->
        <div 
          v-show="speedNum.length > 4" 
          class="option">
          <div class="check">
            <span>风速</span>
            <span 
              class="check" 
              @click="showSpeed">{{ speedName }}
              <img 
                src="../../../lib/base/oakes_air_condition/assets/arrow_in.png">
            </span>
          </div>
        </div>
        <!-- 风速小于等于4种的时候展示 -->
        <div 
          v-show="speedNum.length <= 4" 
          class="option1">
          <div class="check">
            <span>风速</span>
            <!-- <span 
              class="check" 
              @click="showSpeed">{{ speedName }}
              <img 
                src="../../../lib/base/oakes_air_condition/assets/arrow_in.png">
            </span> -->
            <div 
              class="checkBox">
              <div 
                v-show="speedType.indexOf(0)!==-1"
                :class="[{ 'active': deviceAttrs.speed == 'auto'},'speedBtn']" 
                @click="setSpeed('auto')">自动</div>
              <div 
                v-show="speedType.indexOf(1)!==-1"
                :class="[{ 'active': deviceAttrs.speed == 'low'},'speedBtn']" 
                @click="setSpeed('low')">低</div>
              <div 
                v-show="speedType.indexOf(2)!==-1"
                :class="[{ 'active': deviceAttrs.speed == 'normal'},'speedBtn']" 
                @click="setSpeed('normal')">中</div>
              <div 
                v-show="speedType.indexOf(3)!==-1"
                :class="[{ 'active': deviceAttrs.speed == 'high'},'speedBtn']" 
                @click="setSpeed('high')">高</div>
              <div 
                v-show="speedType.indexOf(4)!==-1"
                :class="[{ 'active': deviceAttrs.speed == 'strong'},'speedBtn']" 
                @click="setSpeed('strong')">强</div>
              <div 
                v-show="speedType.indexOf(5)!==-1"
                :class="[{ 'active': deviceAttrs.speed == 'superstrong'},'speedBtn']" 
                @click="setSpeed('superstrong')">超强</div>
              <div 
                v-show="speedType.indexOf(6)!==-1"
                :class="[{ 'active': deviceAttrs.speed == 'stopwind'},'speedBtn']" 
                @click="setSpeed('stopwind')">停风</div>
            </div>
          </div>
        </div>
      </div>
      <SelectTime
        ref="speed"
        :speed-type="speedType"
        @selectedSpeed="setReserve" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import modelSpeed from './components/model-speed'
import SelectTime from './components/time.vue'
// let [MIN_TEMP, MAX_TEMP] = [160, 300]
export default {
  components: {
    // circleProgress,
    // modelSwing,
    // modelMode,
    modelSpeed,
    SelectTime
  },
  data() {
    return {
      timeShow: false,
      typeVal: 'hand',
      brightnessValue: 0,
      rangStyle: '',
      opcityStyle: 'opcity-0',
      //圆的数据
      ox:140,
      oy:140,
      or:130,
      br:10,
      moveFlag:false,
      centigrade:0,//摄氏度
      ctx: '',
      //记录温度
      thermography:16,
      tempType:'',
      speedType:'',
      modeType:'',
      speedNum:'',
      speedcount:'low',
      MIN_TEMP:160,
      MAX_TEMP:300,
      minTemp:'',
      maxTemp:'',
      stepLength:0,//步长
      moveEnd:false,
      setTemperatureDis:false,
    }
  },

  computed: {
    ...mapGetters(['isClose', 'isOffline']),
    ...mapState(['device', 'deviceAttrs', 'ThirddeviceAttrs']),
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
    speedName() {
      /* eslint-disable no-unreachable */
      switch (this.deviceAttrs.speed) {
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
        case 'strong':
          return '强风'
          break
        case 'superstrong':
          return '超强'
          break
         case 'stopwind':
          return '停风'
          break
      }
    },
  },
  watch: {
    "device.stateChange"(){
      if (this.moveEnd == false) {
        if (0.125+(0.75/this.stepLength)*(this.deviceAttrs.temperature/10-this.MIN_TEMP/10)) {
          this.draw(`${0.125+(0.75/this.stepLength)*(this.deviceAttrs.temperature/10-this.MIN_TEMP/10)}`)
        }
        this.moveEnd = false
      }
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
          this.tempType = this.ThirddeviceAttrs.selection.split(";")[0]
          this.minTemp = this.tempType.split(",")[0]*10//160
          this.maxTemp = this.tempType.split(",")[1]*10//300
          //设置最低温和最高温
          this.MIN_TEMP = this.minTemp
          this.MAX_TEMP = this.maxTemp
          //步数
          this.stepLength = this.MAX_TEMP/10 - this.MIN_TEMP/10
          this.speedType = this.ThirddeviceAttrs.selection.split(";")[1]
          this.speedNum = this.speedType.replace(/,/g, "")//取消字符串中出现的所有逗号 
          this.modeType = this.ThirddeviceAttrs.selection.split(";")[2]
          this.draw(`${0.125+(0.75/this.stepLength)*(this.deviceAttrs.temperature/10-this.MIN_TEMP/10)}`)
          let a = `${0.125+0.053*(this.deviceAttrs.temperature/10-16)}`
          let b = `${0.125+(0.75/this.stepLength)*(this.deviceAttrs.temperature/10-this.MIN_TEMP/10)}`
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
        if (this.isOffline||this.isClose) return
          this.moveFlag = false
          if (isMove) {
            this.controlDevice('temperature',this.centigrade)
          }
          this.moveEnd = true
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
      let btn = document.querySelectorAll('.btn')
      for(let i=0;i<btn.length;i++){
        btn[i].classList.remove('animateStart')
        btn[i].classList.remove('bgcStart')
      }  
      this.$refs[val].classList.add('animateEnd')
    },
        // 设置关机时间
    setReserve(speed) {
      console.log(speed)
      if (speed==0) {
        this.speedcount = 'auto'
      }
      if (speed==1) {
        this.speedcount = 'low'
      }
      if (speed==2) {
        this.speedcount = 'overlow'
      }
      if (speed==3) {
        this.speedcount = 'normal'
      }
      if (speed==4) {
        this.speedcount = 'overnormal'
      }
      if (speed==5) {
        this.speedcount = 'high'
      }
      if (speed==6) {
        this.speedcount = 'strong'
      }
        this.controlDevice('speed',this.speedcount)
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
            this.ctx.strokeStyle = "#DA6C00"
          }else if(this.deviceAttrs.mode == 'cold'){
            this.ctx.strokeStyle = "#008CDA"
          }else{
            this.ctx.strokeStyle = "#E1B96E"
          }
      }else if (this.deviceAttrs.switchStatus=='off'||this.isOffline) {
        this.ctx.strokeStyle = "transparent"
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
      // this.ctx.fillText(Math.round((n*(14/0.75))+(16-((14*0.125)/0.75)))+"℃",this.ox,this.oy)
      // this.ctx.fillText(Math.round((n*(this.stepLength/0.75))+(this.MIN_TEMP/10-((this.stepLength*0.125)/0.75)))+"℃",this.ox,this.oy)
      this.thermography = Math.round((n*(this.stepLength/0.75))+(this.MIN_TEMP/10-((this.stepLength*0.125)/0.75)))
      this.centigrade =  this.thermography*10
      this.ctx.fillStyle = "#fff"
      this.ctx.beginPath()
            this.ctx.shadowOffsetX = 0
      this.ctx.shadowOffsetY = 2
      this.ctx.shadowBlur = 4
      this.ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
      let d =  this.offset(n*2*Math.PI,this.or)
      // 关机显示
      if (this.deviceAttrs.switchStatus=='on'&&!this.isOffline) {
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
    // reset() {
    //   this.$nextTick(() => {
    //     // this.$refs.canvas.init()
    //   })
    // },
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
       if (this.isClose||this.isOffline) return
      HdSmart.UI.vibrate()
            this.touchstart(val)
      setTimeout(() => {
        this.touchend(val)
      }, 150)
      this.moveEnd = false
      if (val == this.deviceAttrs.mode) return
      this.controlDevice('mode', val)
        .then((res) => {
          if (res) {
            if(res.code == 0) {
              console.log(res,'code0=========')
              this.deviceAttrs.mode = val
            }
            if (this.deviceAttrs.mode=='wind') {
              // this.progress = 70 /(30 - 16) * (this.deviceAttrs.env_temperature / 10 - 16)
              // this.$refs.$canvas.init()
              this.hide()
              return
            }
            // this.reset()
            this.hide()
          }
          if (res == null) {
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
      this.setTemperatureDis = true
      this.moveEnd = false
      // 送风模式不能设置温度
      // if (this.deviceAttrs.mode === 'wind') {
      //   return HdSmart.UI.toast('送风模式不支持温度调节')
      // }
      let temp = +this.deviceAttrs.temperature + step
      // 最小温度
      if (temp < this.MIN_TEMP) {
        if (this.deviceAttrs.temperature == this.MIN_TEMP) {
          this.setTemperatureDis = false
          return HdSmart.UI.toast('温度已调至最低')
        } else {
          temp = this.MIN_TEMP
        }
      }
      // 最大温度
      if (temp > this.MAX_TEMP) {
        if (this.deviceAttrs.temperature == this.MAX_TEMP) {
          this.setTemperatureDis = false
          return HdSmart.UI.toast('温度已调至最高')
        } else {
          temp = this.MAX_TEMP
        }
      }
      this.controlDevice('temperature', temp)
        .then((res) => {
          if(res.code==0){
            // this.deviceAttrs.temperature = temp
          } else {
            this.setTemperatureDis = false
          }
          // this.reset()
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
    setSpeed(speed, val) {
      if (this.isOffline||this.isClose) return
      HdSmart.UI.vibrate()
      this.moveEnd = false
      this.typeVal = val
      if (this.deviceAttrs.mode=='wind'&&val=='auto') {
        this.typeVal = 'hand'
      }
      // if(this.deviceAttrs.mode == 'wind' && speed == 'auto') {
      //   return HdSmart.UI.toast('送风模式不能设置自动风速')
      // }
      this.controlDevice('speed', speed)
        .then(() =>{
          this.hide()
        })
    },
    controlDevice(attr, value) {
      let param = {}
      if(attr == 'mode' && value == 'wind' && this.deviceAttrs.speed == 'auto'){
        param = { 'speed': 'low'}
      }
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
    // showSwing() {
    //   if (this.isClose) return
    //   this.$refs.swing.show = true
    // },
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
      // if(this.$refs.swing.show) this.$refs.swing.show = false
      if(this.$refs.speed.show) this.$refs.speed.show = false
    },

    getProgress() {
      // 计算温度进度条
      // return 70 /(30 - 16) * (this.deviceAttrs.temperature / 10 - 16)
    }
  }
}
</script>
