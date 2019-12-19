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
              :class="[loaclAttr.mode, 'c-mode']">室内温度{{ loaclAttr.env_temperature | filterTm }}℃</div>
            <div
              v-show="isOffline||loaclAttr.switchStatus == 'off'"
              :class="[loaclAttr.mode, 'c-mode']">室内温度--℃</div>
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
            @touchstart ="touchstart('reduce')"
            @touchend="touchend('reduce',-10)" 
          />
          <button
            ref="add"
            :disabled="setTemperatureDis"
            class="control add btn"
            @touchstart ="touchstart('add')"
            @touchend="touchend('add',10)" 
          />
        </div>
      </div>
      <!-- 当前状态 -->
      <div
        v-show="loaclAttr.timer_switch == 'on'&& loaclAttr.timer_value >0"
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
          @click="setSwitch"
          @touchstart ="touchstart('switchStatus')"
          @touchend="touchend('switchStatus')"/>
      </div>
      <div
        class="panel-btn center">
        <div
          class="btn-wrap"
          @click="setMode('cold')">
          <div
            ref="cold"
            :class="[{ 'active': loaclAttr.mode == 'cold' && loaclAttr.switchStatus == 'on'&&!isOffline }, 'btn btn-cold center']"
            @touchstart ="touchstart('cold')"
            @touchend="touchend('cold')"/>
          <div class="btn-name">制冷</div>
        </div>
        <div
          class="btn-wrap"
          @click="setMode('heat')">
          <div
            ref="heat"
            :class="[ { 'active': loaclAttr.mode == 'heat' && loaclAttr.switchStatus == 'on'&&!isOffline }, 'btn btn-heat center']"
            @touchstart ="touchstart('heat')"
            @touchend="touchend('heat')"/>
          <div class="btn-name">制热</div>
        </div>
        <div
          class="btn-wrap"
          @click="setMode('auto')">
          <div
            ref="auto"
            :class="[ { 'active': loaclAttr.mode == 'auto' && loaclAttr.switchStatus == 'on'&&!isOffline }, 'btn btn-auto center']"
            @touchstart ="touchstart('auto')"
            @touchend="touchend('auto')"/>
          <div
            class="btn-name" >智能</div>
        </div>
        <div
          class="btn-wrap"
          @click="setMode('wind')">
          <div
            ref="wind"
            :class="[{ 'active': loaclAttr.mode == 'wind' && loaclAttr.switchStatus == 'on'&&!isOffline }, 'btn btn-wind center']"
            @touchstart ="touchstart('wind')"
            @touchend="touchend('wind')"/>
          <div class="btn-name">送风</div>
        </div>
        <div
          class="btn-wrap"
          @click="setMode('dehumidify')">
          <div
            ref="dehumidify"
            :class="[{ 'active': loaclAttr.mode == 'dehumidify' && loaclAttr.switchStatus == 'on'&&!isOffline }, 'btn btn-dehumidify center']"
            @touchstart ="touchstart('dehumidify')"
            @touchend="touchend('dehumidify')"/>
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
                v-if="loaclAttr.mode!='wind'"
                :class="[{ 'active': loaclAttr.speed == 'auto'},'speedBtn']"
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
              @click="showSwing">{{ loaclAttr.wind_up_down=='on'?'上下风 ':'' }}{{ loaclAttr.wind_left_right=='on'?'左右风':'' }}{{ loaclAttr.wind_up_down=='off'&&loaclAttr.wind_left_right=='off'?'设置':'' }}
              <img
                src="../../../lib/base/oakes_air_condition/assets/arrow_in.png">
            </span>
          </div>
        </div>
        <!-- 定时 -->
        <!-- <div class="option">
          <div>
            <span>定时</span>
            <span
              v-if="loaclAttr.timer_switch=='on'&&loaclAttr.timer_value>0"
              class="check"
              @click="showTime">{{ loaclAttr.timer_value | closeTime }}
              <img
                src="../../../lib/base/oakes_air_condition/assets/arrow_in.png">
            </span>
            <span
              v-else
              class="check"
              @click="showTime">设置关机时间
              <img
                src="../../../lib/base/oakes_air_condition/assets/arrow_in.png">
            </span>
          </div>
        </div> -->
      </div>

      <!--选择摆风-->
      <model-swing
        ref="swing"
        :wind_up_down="loaclAttr.wind_up_down"
        :wind_left_right="loaclAttr.wind_left_right"
        @setWind="setWind" />
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
        <!-- 时间选择 -->
        <!-- <SelectTime
        ref="time"
        @selectedTime="setReserve"
        @canceltime="canceltime" /> -->
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
const [MIN_TEMP, MAX_TEMP] = [160, 320]
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
      animation:false,
      loaclAttr: {},
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
      setTemperatureDis:false,
      moveEnd:false,
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
  },
  watch: {
    "deviceAttrs"() {
      this.loaclAttr = this.deviceAttrs
      // this.reset()
      console.log('=============', this.loaclAttr.mode)
    },
    "device.stateChange"(){
        this.draw(`${0.125+0.046875*(this.loaclAttr.temperature/10-16)}`)
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
            .then((res) => {
              if (res) {
                if(res.code == 0) {
                  this.loaclAttr.temperature = this.centigrade
                  this.draw(`${0.125+0.046875*(this.loaclAttr.temperature/10-16)}`)
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
        // btn[i].classList.remove('active')
        btn[i].classList.remove('animateStart')
        btn[i].classList.remove('bgcStart')
        // btn[i].classList.remove('yellowExtend')
      }  
      // this.$refs[val].classList.add('bgcEnd')
      this.$refs[val].classList.add('animateEnd')

      if(val=='switchStatus'){
        this.setSwitch()
      }else if(val=='add'||val=='reduce'){
        this.setTemperature(step)
      }else{
        this.setMode(val)
      }
      // this.$refs[val].classList.add('yellowExtend')
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
            console.log('heat111')
            this.ctx.strokeStyle = "#DA6C00"
          }else if(this.loaclAttr.mode == 'cold'){
            console.log('cold111')
            this.ctx.strokeStyle = "#008CDA"
          }else{
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
      this.ctx.fillText(Math.round((n*(16/0.75))+(16-((16*0.125)/0.75)))+"℃",this.ox,this.oy)
      console.log( Math.round((n*(16/0.75))+(16-((16*0.125)/0.75)))+"℃",'温度')
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
      // 关机显示
      if (this.loaclAttr.switchStatus=='on'&&!this.isOffline) {
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
    setSwitch(){
      if (this.isOffline) return
      HdSmart.UI.vibrate()
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
        }
       })
    },
    setTemperature(step) {
      if (this.isOffline||this.isClose) return
      HdSmart.UI.vibrate()
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
          return HdSmart.UI.toast('温度已调至最低')
        } else {
          temp = MIN_TEMP
        }
      }
      // 最大温度
      if (temp > MAX_TEMP) {
        if (this.loaclAttr.temperature == MAX_TEMP) {
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
.animate::before{
  animation: scale 0.4s;
}
@keyframes scale {
  0%{
    transform: scale(1);
  }
  50%{
    transform: scale(0.6);
  }
    100%{
    transform: scale(1.3);
  }
}
  // 定时展示
  .timeShow {
    text-align: center;
    position: relative;
    font-size: 24px;
    margin-top: 24px;
    color: #20282B;
    .timeShow-img {
      position: relative;
      top: 2px;
      width: 28px;
      height: 28px;
      margin-right: 12px;
    }
  }
.page {
  &::before{
    content: "";
    background-image: url('~@lib/@{imgPath1}/img_bg.png');
    background-repeat:no-repeat;
    background-size: 100% 100%;
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
  }
  .c-status {
    margin-top: 30px;
    font-size: 24px;
    color: #35353d;
    text-align: center;
  }
  .control-tm{
    position: relative;
    top: -40px;
    z-index: 9;

    width: 430px;
    display: flex;
    justify-content: space-between;
    align-items: center;
.control{
      outline: none;
      border: none;
      width: 72px;
      height: 72px;
      background: rgba(0,0,0,0.05);
      border-radius: 50%;
      &.add{
         width: 72px;
         height: 72px;
         &::before{
           position: relative;
           z-index: 100;
          content: "";
          display: block;
          width: 72px;
          height: 72px;
          background-image: url('~@lib/@{imgPath1}/up.png');
          background-size: 70% 70%;
          background-position: center;
         }
      }
      &.reduce{
        width: 72px;
         height: 72px;
         &::before{
                      position: relative;
           z-index: 100;
          content: "";
          display: block;
          width: 72px;
          height: 72px;
          background-image: url('~@lib/@{imgPath1}/down.png');
          background-size: 70% 70%;
          background-position: center;
         }

      }
    }
  }
  .main {
    position: relative;
    margin-top:44px;
    &.center {
      flex-direction: column;
    }
    .wrap-circle{
      position: relative;
      zoom: 0.5;
       .showtemp{
        position: absolute;
        top: 49%;
        left: 49.5%;
        width: 280px;
        height: 280px;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
        .tm{
          // margin-top: 60PX;
          position: relative;
          font-size: 144px;
          color: #000;
          text-align: center;
          transform: scale(2);
          sup{
            position: absolute;
            top: -5px;
            right: -22px;
            font-size: 24px;
            color: #000;
            transform: scale(1);
          }
        }
        .c-mode{
          position: absolute;
          transform: translate(-50%,-50%);
          top: 95%;
          left: 50%;
          width: 216px;
          height: 48px;
          font-size: 24px;
          text-align: center;
          line-height: 48px;
          zoom:2;
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
    margin-top: 120px;
     .btn-start{
        z-index: 999;
        box-sizing: border-box;
        margin: 0 auto;
        width: 132px;
        height: 132px;
        // border: 1px solid #818181;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 50%;
        position: relative;
        &.active{
          // background-image: linear-gradient(to right, #F1CB85, #E1B96E);
          background: #E1B96E;
        }
        &::before{
          content: "";
          position: absolute;
          z-index: 100;
          left: 50%;
          top: 50%;
          margin-left: -24px;
          margin-top: -24px;
          background-image: url('~@lib/@{imgPath1}/dakai3@2x.png');
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
    overflow-x: auto;
    display: -webkit-box;
    z-index: 9999;
    margin-top: 60px;
    /*适应苹果*/
    -webkit-overflow-scrolling: touch;

  }

  /*隐藏掉滚动条*/
	.panel-btn::-webkit-scrollbar {
		display: none;
	}
  /*********** 按钮 ***********/
  .btn-wrap {
    margin: 0 24px 24px;
    &:last-of-type{
      width: 30px;
      height: 120px;
    }
    .btn {
      box-sizing: border-box;
      margin: 0 auto;
      width: 120px;
      height: 120px;
      // border: 1px solid #818181;
      background: rgba(0,0,0,0.05);
      border-radius: 50%;

      display: flex;
      flex-direction: column;
      &::before {
        content: "";
        z-index: 100;
        display: block;
        width: 44px;
        height: 44px;
      }
      &.active {
        // background-image: linear-gradient(to right, #F1CB85, #E1B96E);
        background: #E1B96E;
      }
    }
    .btn-name {
      text-align: center;
      color: #000;
      margin-top: 16px;
      font-size: 24px;
    }

    .btn-swich {
      &::before {
        background-image: url('~@lib/@{imgPath}/swich-black.png');
        background-size: 100% 100%;
      }
    }
    .btn-cold {
      &::before {
        background-image: url('~@lib/@{imgPath1}/cold.png');
        background-size: 100% 100%;
      }
      // &.active::before {
      //   background-image: url('~@lib/@{imgPath1}/cold1.png');
      //   background-size: 100% 100%;
      // }
    }
    .btn-heat {
      &::before {
        background-image: url('~@lib/@{imgPath1}/heat.png');
        background-size: 100% 100%;
      }
      //  &.active::before {
      //   background-image: url('~@lib/@{imgPath1}/heat1.png');
      //   background-size: 100% 100%;
      // }
    }
    .btn-mode {
      &::before {
        background-image: url('~@lib/@{imgPath}/mode.png');
        background-size: 100% 100%;
      }
    }
     .btn-time {
      &::before {
        background-image: url('~@lib/@{imgPath}/time-black.png');
        background-size: 100% 100%;
      }
    }
    .btn-menu {
      &::before {
        background-image: url('~@lib/@{imgPath}/more-black.png');
        background-size: 100% 100%;
      }
    }

    .btn-wind {
      &::before {
        background-image: url('~@lib/@{imgPath1}/wind.png');
        background-size: 100% 100%;
      }
      // &.active::before {
      //   background-image: url('~@lib/@{imgPath1}/wind1.png');
      //   background-size: 100% 100%;
      // }
    }

    .btn-dehumidify {
      &::before {
        background-image: url('~@lib/@{imgPath1}/dehumidify.png');
        background-size: 100% 100%;
      }
      // &.active::before {
      //   background-image: url('~@lib/@{imgPath1}/dehumidify1.png');
      //   background-size: 100% 100%;
      // }
    }
    .btn-low{
      &::before {
        background-image: url('~@lib/@{imgPath}/speed3.png');
        background-size: 100% 100%;
      }
    }
    .btn-normal{
      &::before {
        background-image: url('~@lib/@{imgPath}/speed4.png');
        background-size: 100% 100%;
      }
    }
    .btn-normal{
      &::before {
        background-image: url('~@lib/@{imgPath}/speed4.png');
        background-size: 100% 100%;
      }
    }
    .btn-high{
      &::before {
        background-image: url('~@lib/@{imgPath}/speed5.png');
        background-size: 100% 100%;
      }
    }
    .btn-auto{
      &::before {
        background-image: url('~@lib/@{imgPath1}/auto.png');
        background-size: 100% 100%;
      }
      //  &.active::before {
      //   background-image: url('~@lib/@{imgPath1}/auto1.png');
      //   background-size: 100% 100%;
      // }
    }
    .btn-left{
      &::before {
        background-image: url('~@lib/@{imgPath}/left.png');
        background-size: 100% 100%;
      }
    }
    .btn-up{
      &::before {
        background-image: url('~@lib/@{imgPath}/up.png');
        background-size: 100% 100%;
      }
    }
  }
  .optionbox{
    width: 100%;
    margin-top: 10px;
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
              font-size: 32px;
              margin-right: 20px;
              color: #000;
              opacity: .5;
              font-family: PingFangSC-Light;
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
      input[type="range"] {
        display: block;
        -webkit-appearance: none;
        // background-color: #bdc3c7;
        background: rgba(101,101,101,0.3);
        width: 100%;
        height: 2px;
        border-radius: 5px;
        margin: 0 auto;outline: 0;
      }
      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        background-color: #000;
        width: 52px;
        height: 52px;
        border-radius: 50%;
        // border: 2px solid white;
        cursor: pointer;
        // transition: 0.3s ease-in-out;
      }
      .range {
        position: relative;
        width: 100%;
        margin-bottom: 50px;
        .range-zero::-webkit-slider-thumb {
          background: #EDEDED;
        }
        .range-zero {
          background: #EDEDED;
        }
      }
      .tips {
        font-size: 32px;
        color: #000000;
        float: right;
      }
      .tips-bak {
        color: #EDEDED;
      }
      .rang_width {
        position: absolute;
        top: 0;
        left: 0;
        background: #000;
        height: 2px;
        border-radius: 5px 0 0 5px;
        }
        .rang_bak {
          background: #EDEDED;
        }
    }
  }
      .item{
        animation: box 5s;
      }
      @keyframes box {
        from{height: 0;}
        to{height: 100px;}
      }
  // &.close {
  //   .btn-wrap {
  //     &.up-index{
  //       opacity: 1;
  //     }
  //   }
  // }
  // &.offline {
  //   .btn-wrap {
  //     &.up-index{
  //       opacity: .2;
  //     }
  //   }
  // }
  &.close,
  &.offline {
    &:before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      // z-index: 999;
      width: 100%;
      // background: rgba(0, 0, 0, 0.1);
    }
    &.page {
      // background: #fff;
      .control-tm{
        // background: #fff;
        .reduce,.add {
          opacity: .4;
        }
      }
    }
    .panel-btn {
      // background: #efefef;
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
  }
}
.canvas {
  width: 560px;
}

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

</style>
