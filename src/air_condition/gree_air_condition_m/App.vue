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
              v-if="loaclAttr.connectivity == 'offline'||loaclAttr.switchStatus=='off'||loaclAttr.mode=='auto'||loaclAttr.mode=='wind'"
              class="tm">-- <sup>°C</sup></div>
            <div
              v-if="!isOffline&& loaclAttr.switchStatus == 'on'&&loaclAttr.mode!=='auto'&&loaclAttr.mode!=='wind'"
              class="tm">{{ thermography }}<sup>°C</sup>
            </div>
            <div
              v-if="!loaclAttr.switchStatus&&!loaclAttr.connectivity"
              class="tm">-- <sup>°C</sup></div>
          </div>
          <!-- 当不可调节温度时，显示这个盒子，可以挡着canvas，使它不能滑动 -->
          <div
            v-if="loaclAttr.mode=='auto'||loaclAttr.mode=='wind'"
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
        v-show="loaclAttr.timer_switch == 'off'&& loaclAttr.timer_value >0"
        class="status">
        {{ loaclAttr.timer_value | closeTime }}
      </div>
      <!-- 底部按钮 -->
      <!-- 开关 -->
      <div
        class="starting">
        <div
          ref="switchStatus"
          :class="[{'active': loaclAttr.switchStatus == 'on'&&!isOffline},'btn-start']"
          @click="setSwitch('switchStatus')" />
      </div>
      <div
        class="panel-btn center">
        <!-- <div :class="[{'up-index': !isOffline }, 'btn-wrap']">
          <div
            :class="[{ 'active': !isClose }, 'btn-swich btn center']"
            @click="setSwitch" />
          <div class="btn-name">开关</div>
        </div> -->
        <div
          class="btn-wrap">
          <div
            ref="cold"
            :class="[{ 'active': loaclAttr.mode == 'cold' && loaclAttr.switchStatus == 'on'&&!isOffline }, 'btn btn-cold center']"
            @click="setMode('cold')" />
          <div class="btn-name">制冷</div>
        </div>
        <div
          class="btn-wrap">
          <div
            ref="heat"
            :class="[ { 'active': loaclAttr.mode == 'heat' && loaclAttr.switchStatus == 'on'&&!isOffline }, 'btn btn-heat center']"
            @click="setMode('heat')"/>
          <div class="btn-name">制热</div>
        </div>
        <div
          class="btn-wrap">
          <div
            ref="auto"
            :class="[ { 'active': loaclAttr.mode == 'auto' && loaclAttr.switchStatus == 'on'&&!isOffline }, 'btn btn-auto center']"
            @click="setMode('auto')"/>
          <div
            class="btn-name" >自动</div>
        </div>
        <div
          class="btn-wrap">
          <div
            ref="wind"
            :class="[{ 'active': loaclAttr.mode == 'wind' && loaclAttr.switchStatus == 'on'&&!isOffline }, 'btn btn-wind center']"
            @click="setMode('wind')" />
          <div class="btn-name">送风</div>
        </div>
        <div
          class="btn-wrap">
          <div
            ref="dehumidify"
            :class="[{ 'active': loaclAttr.mode == 'dehumidify' && loaclAttr.switchStatus == 'on'&&!isOffline }, 'btn btn-dehumidify center']"
            @click="setMode('dehumidify')" />
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
                :class="[{ 'active': loaclAttr.speed == 'low'},'speedBtn']"
                @click="setSpeed('low')">低</div>
              <div
                :class="[{ 'active': loaclAttr.speed == 'normal'},'speedBtn']"
                @click="setSpeed('normal')">中</div>
              <div
                :class="[{ 'active': loaclAttr.speed == 'high'},'speedBtn']"
                @click="setSpeed('high')">高</div>
              <div
                :class="[{ 'active': loaclAttr.speed == 'auto'},'speedBtn']"
                @click="setSpeed('auto')">自动</div>
            </div>
          </div>
        </div>
      </div>
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
import circleProgress from './components/circle-progress'
import modelMode from './components/model-mode'
import modelSpeed from './components/model-speed'
const [MIN_TEMP, MAX_TEMP] = [160, 300]
export default {
  components: {
    circleProgress,
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
      animation:false,
      loaclAttr: {},
      setTemperatureDis: false,
      moveEnd:false
    }
  },

  computed: {
    ...mapGetters(['isClose', 'isOffline']),
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
  },
  watch: {
    "deviceAttrs"() {

      this.loaclAttr = this.deviceAttrs
      // this.reset()
      console.log('=============', this.loaclAttr.mode)
    },
    "device.stateChange"(){
       if(!this.moveEnd){
            this.draw(`${0.125+0.75/14*(this.loaclAttr.temperature/10-16)}`)
       }
       this.moveEnd = false
    }
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
        .then(() => {
          // this.reset()
          this.draw(`${0.125+0.053*(this.loaclAttr.temperature/10-16)}`)

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
        this.$refs[val].classList.add('yellowExtend')
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
      if (this.loaclAttr.switchStatus=='on'&&!this.isOffline) {
          if (this.loaclAttr.mode == 'heat') {
            this.ctx.strokeStyle = "#DA6C00"
          }else if(this.loaclAttr.mode == 'cold'){
            this.ctx.strokeStyle = "#008CDA"
          }else if(this.loaclAttr.mode == 'dehumidify'){
            this.ctx.strokeStyle = "#E1B96E"
          }
      }else{
        this.ctx.strokeStyle = "none"
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
      this.ctx.fillText(Math.round((n*(14/0.75))+(16-((14*0.125)/0.75)))+"℃",this.ox,this.oy)
      console.log( Math.round((n*(14/0.75))+(16-((14*0.125)/0.75)))+"℃",'温度')
      this.thermography = Math.round((n*(14/0.75))+(16-((14*0.125)/0.75)))
      this.centigrade = Math.round((n*(14/0.75))+(16-((14*0.125)/0.75)))*10
      this.ctx.fillStyle = "#fff"
      this.ctx.beginPath()
      this.ctx.shadowOffsetX = 0
      this.ctx.shadowOffsetY = 2
      this.ctx.shadowBlur = 4
      this.ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
      let d =  this.offset(n*2*Math.PI,this.or)
      // 开机显示
      if (this.loaclAttr.switchStatus=='on'&&!this.isOffline&&this.loaclAttr.mode!=='auto'&&this.loaclAttr.mode!=='wind') {
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
        this.moveEnd = false
        if (this.isOffline||this.isClose) return
      HdSmart.UI.vibrate()
      this.touchstart(val)
      setTimeout(() => {
        this.touchend(val)
      }, 150)
      if (val == this.loaclAttr.mode) return
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
        }
       })
      //  .catch(() => {
      //    HdSmart.UI.toast('操作失败')
      //  })
    },
    setTemperature(val,step) {
      if (this.isOffline||this.isClose) return
      HdSmart.UI.vibrate()
      this.touchstart(val)
      setTimeout(() => {
        this.touchend(val,temp)
      }, 150)
        this.moveEnd = false
      this.setTemperatureDis = true

      if(this.loaclAttr.mode == 'auto') {
        this.setTemperatureDis = false
        return HdSmart.UI.toast('自动模式不支持温度调节')
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
        this.moveEnd = false

      // if(this.deviceAttrs.mode == 'wind' && speed == 'auto') {
      //   return HdSmart.UI.toast('送风模式不能设置自动风速')
      // }
      this.controlDevice('speed', speed)
        .then((res) => {
         if (res) {
           if(res.code == 0) {
            this.loaclAttr.speed = speed
            this.hide()
           }
         }
        if(res == null){
           HdSmart.UI.toast('操作失败')
        }
       })
    },
    controlDevice(attr, value) {
      console.log(this.loaclAttr,'-------------------------------------')
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
    showMode() {
      if (this.isClose) return
      this.$refs.mode.show = true
    },
    // showSpeed() {
    //   if (this.isClose) return
    //   this.$refs.speed.show = true
    //   this.$nextTick(()=>{
    //     this.animation = true
    //   },0)
    // },
    // showTime() {
    //   if (this.isClose) return
    //   this.$refs.time.show = true
    // },
    hide(){
      if(this.$refs.mode.show) this.$refs.mode.show = false
    },

    getProgress() {
      // 计算温度进度条
      // if (this.deviceAttrs.mode=='auto') {
      //   return 70 /(30 - 16) * (240 / 10 - 16)
      // }else if(this.deviceAttrs.mode=='wind') {
      //   return 70 /(30 - 16) * (MIN_TEMP / 10 - 16)
      // }else{
        return 70 /(30 - 16) * (this.loaclAttr.temperature / 10 - 16)
      // }
    }
  }
}
</script>
