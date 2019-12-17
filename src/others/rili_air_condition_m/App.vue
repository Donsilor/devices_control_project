<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']">
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
            <!-- 如果模式是从制热模式最低17度切换模式,温度应该展示为19 -->
            <div 
              v-if="!isOffline&& deviceAttrs.switchStatus == 'on'&&deviceAttrs.mode!=='heat'" 
              class="tm">{{ (centigrade < 190 ? 190: centigrade) | filterTm }}<sup>°C</sup></div>

            <div 
              v-if="!isOffline&& deviceAttrs.switchStatus == 'on'&&deviceAttrs.mode=='heat'"
              class="tm">{{ thermography }}<sup>°C</sup>
            </div>
            <div 
              v-show="!isOffline&& deviceAttrs.switchStatus == 'on'" 
              :class="[deviceAttrs.mode, 'c-mode']">室内温度{{ deviceAttrs.env_temperature | filterTm }}℃</div>
            <div
              v-show="isOffline||deviceAttrs.switchStatus == 'off'"
              :class="[deviceAttrs.mode, 'c-mode']">室内温度--℃</div>
          </div>
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
            :class="[{ 'active': deviceAttrs.mode == 'cold'&& deviceAttrs.switchStatus == 'on'&&!isOffline }, 'btn btn-cold center']" 
            @touchstart ="touchstart('cold')" 
            @touchend="touchend('cold')"/>
          <div class="btn-name">制冷</div>
        </div>
        <div
          class="btn-wrap"
          @click="setMode('heat')">
          <div 
            ref="heat" 
            :class="[ { 'active': deviceAttrs.mode == 'heat' && deviceAttrs.switchStatus == 'on'&&!isOffline}, 'btn btn-heat center']" 
            @touchstart ="touchstart('heat')" 
            @touchend="touchend('heat')"/>
          <div class="btn-name">制热</div>
        </div>
        <div
          class="btn-wrap"
          @click="setMode('wind')">
          <div 
            ref="wind" 
            :class="[{ 'active': deviceAttrs.mode == 'wind' && deviceAttrs.switchStatus == 'on'&&!isOffline}, 'btn btn-wind center']" 
            @touchstart ="touchstart('wind')" 
            @touchend="touchend('wind')"/>
          <div class="btn-name">送风</div>
        </div>
        <div
          class="btn-wrap"
          @click="setMode('dehumidify')">
          <div 
            ref="dehumidify" 
            :class="[{ 'active': deviceAttrs.mode == 'dehumidify' && deviceAttrs.switchStatus == 'on'&&!isOffline}, 'btn btn-dehumidify center']" 
            @touchstart ="touchstart('dehumidify')" 
            @touchend="touchend('dehumidify')"/>
          <div class="btn-name">除湿</div>
        </div>
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
import circleProgress from './components/circle-progress'
import modelSwing from './components/model-swing'
import modelMode from './components/model-mode'
import modelSpeed from './components/model-speed'
import SelectTime from './components/time.vue'
const [MIN_TEMP, MAX_TEMP] = [170, 300]
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
      width: 230,
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
      moveEnd:false,
      setTemperatureDis:false,
    }
  },

  computed: {
    ...mapGetters(['isClose', 'isOffline']),
    ...mapState(['device', 'deviceAttrs']),
    modeIsActive() {
      return this.deviceAttrs.mode == 'dehumidify' || this.deviceAttrs.mode == 'wind'
    },
    windIsActive() {
      return this.deviceAttrs.wind_up == 'on'
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
    getBarColor() {
      if(this.isClose || this.isOffline) return '#D8D8D8'
            /* eslint-disable no-unreachable */
      switch (this.deviceAttrs.mode) {
        case 'cold':
          return '#00A3FF'
          break
        case 'heat':
          return '#FF5F00'
          break
        default:
          return '#000'
      }
    },
  },
  watch: {
    "device.stateChange"(){
      if (this.moveEnd == false) {
        if (this.deviceAttrs.mode == 'heat') {
        this.draw(`${0.125+0.0577*(this.deviceAttrs.temperature/10-17)}`)
        // console.log(0.125+0.0577*(this.deviceAttrs.temperature/10-17),'11111111111')//0.125
        }else{
          if (0.125+0.0682*(this.deviceAttrs.temperature/10-19)<0.125) {
            this.draw(0.125)
          }else{
            this.draw(`${0.125+0.0682*(this.deviceAttrs.temperature/10-19)}`)
          }
          // console.log(0.125+0.0682*(this.deviceAttrs.temperature/10-19),'22222222222')//假设温度是17，结果是个负数  
        }
      }
    }
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
        .then(() => {
          this.draw(`${0.125+0.0577*(this.deviceAttrs.temperature/10-17)}`)
          // console.log(`${0.125+0.0577*(this.deviceAttrs.temperature/10-17)}`,'000000000')//0.125
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
      console.log(n,'nnnnnnnnnnnn')
      
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
      this.ctx.lineCap = 'round'
      this.ctx.arc(this.ox,this.oy,this.or,3/4 *Math.PI,(n*2+0.5)*Math.PI,false)
      // this.ctx.arc(this.ox,this.oy,this.or,0.5*Math.PI,(n*2+0.5)*Math.PI,false);
      this.ctx.stroke()
      this.ctx.fillStyle = "transparent"
      this.ctx.font = "70px PingFangSC-Light"
      this.ctx.textAlign = "center"
      this.ctx.textBaseline = "middle"
      // 制热模式最低温度为17，其他模式最低19
      if (this.deviceAttrs.mode == 'heat') {
         this.ctx.fillText(Math.round((n*(13/0.75))+(17-((13*0.125)/0.75)))+"℃",this.ox,this.oy)
        this.thermography = Math.round((n*(13/0.75))+(17-((13*0.125)/0.75)))
        console.log('3333333333333')
        
      }else{
       this.ctx.fillText(Math.round((n*(11/0.75))+(19-((11*0.125)/0.75)))+"℃",this.ox,this.oy)
        this.thermography = Math.round((n*(11/0.75))+(19-((11*0.125)/0.75)))
        console.log('44444444444444')
        
      }

      this.centigrade = this.thermography*10
      this.ctx.fillStyle = "#fff"
      this.ctx.beginPath()
            this.ctx.shadowOffsetX = 0
      this.ctx.shadowOffsetY = 2
      this.ctx.shadowBlur = 4
      this.ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
      let d =  this.offset(n*2*Math.PI,this.or)
      // console.log('d', d)
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
    // 开关机
    setSwitch(){
      if (this.isOffline) return
      HdSmart.UI.vibrate()
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
      if (val == this.deviceAttrs.mode) return
      this.moveEnd = false
      this.controlDevice('mode', val)
        .then((res) => {
          if (res) {
            if(res.code == 0) {
              this.deviceAttrs.mode = val
                        // this.reset()
              this.hide()
             }
          }
          if (res == null) {
            console.log(res,val,'res val=========')
            this.$refs[val].classList.remove('yellowExtend')
        }
        })
    },
    setTemperature(step) {
      if (this.isOffline||this.isClose) return
      HdSmart.UI.vibrate()
      this.setTemperatureDis = true
      this.moveEnd = false
      let temp = +this.deviceAttrs.temperature + step
      if (step== 10) {
        if (this.deviceAttrs.mode!=='heat'&&this.deviceAttrs.temperature == 170) {
         temp = +this.deviceAttrs.temperature + step + 20
        }
        if (this.deviceAttrs.mode!=='heat'&&this.deviceAttrs.temperature == 180) {
          temp = +this.deviceAttrs.temperature + step + 10
        }
      }else{
        if (this.deviceAttrs.mode!=='heat'&&this.deviceAttrs.temperature == 200) {
           temp = +this.deviceAttrs.temperature + step - 20
        }
        if (this.deviceAttrs.mode!=='heat'&&this.deviceAttrs.temperature == 190) {
           temp = +this.deviceAttrs.temperature + step - 30
        }
        if (this.deviceAttrs.mode!=='heat'&&this.deviceAttrs.temperature == 180) {
           temp = +this.deviceAttrs.temperature + step - 40
        }
      }
      // 最小温度
      if (temp < MIN_TEMP) {
        if (this.deviceAttrs.temperature == MIN_TEMP) {
          return HdSmart.UI.toast('温度已调至最低')
        } else {
          temp = MIN_TEMP
        }
      }
      // 最大温度
      if (temp > MAX_TEMP) {
        if (this.deviceAttrs.temperature == MAX_TEMP) {
          return HdSmart.UI.toast('温度已调至最高')
        } else {
          temp = MAX_TEMP
        }
      }
      this.controlDevice('temperature', temp)
        .then((res) => {
          if(res.code == 0) {
            this.deviceAttrs.temperature = temp
            this.setTemperatureDis = false
          }  
          // this.reset()
        })
    },
    // 设置风速
    setSpeed(speed) {
      if (this.isOffline||this.isClose) return
      HdSmart.UI.vibrate()
      this.moveEnd = false
      this.controlDevice('speed', speed)
        .then(() =>{
          this.hide()
          // this.setRangWidth(93)
        })
    },
    controlDevice(attr, value,param) {
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
    showSwing() {
      if (this.isClose) return
      this.$refs.swing.show = true
    },
    showMode() {
      if (this.isClose) return
      this.$refs.mode.show = true
    },
    // showSpeed() {
    //   if (this.isClose) return
    //   this.$refs.speed.show = true
    // },
    showTime() {
      if (this.isClose) return
      this.$refs.time.show = true
    },
    hide(){
      // if(this.$refs.swing.show) this.$refs.swing.show = false
      // if(this.$refs.mode.show) this.$refs.mode.show = false
      // if(this.$refs.speed.show) this.$refs.speed.show = false
    },

    // getProgress() {
    //   // 计算温度进度条
    //   if (this.deviceAttrs.temperature > MAX_TEMP) {
    //     return 70 /(30 - 19) * (MAX_TEMP / 10 - 19)
    //   }
    //   if (this.deviceAttrs.mode=='heat') {
    //     return 70 /(30 - 17) * (this.deviceAttrs.temperature / 10 - 17)
    //   }else{
    //     let wendu = this.deviceAttrs.temperature
    //     if (wendu < 190) {
    //       wendu = 190
    //     }
    //      return 70 /(30 - 19) * (wendu / 10 - 19)
    //   }  
    // }
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
        background: rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        position: relative;
        &.active{
          // background-image: linear-gradient(to right, #F1CB85, #E1B96E);
          background: #E1B96E;
        }
        &::before{
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          margin-left: -24px;
          margin-top: -24px;
          background-image: url('~@lib/@{imgPath1}/dakai3@2x.png');
          background-size: 100% 100%;
          width: 48px;
          height: 48px;
          z-index:100;
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
    margin-top: 130px;
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
        display: block;
        width: 44px;
        height: 44px;
        z-index:100;
      }
      &.active {
        //  background-image: linear-gradient(to right, #F1CB85, #E1B96E);
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
    //    z-index: 1;
    //   position: absolute;
    //   top: 0px;
    //   left:40%;
    //   overflow: hidden;
    //   &::after{
    //   background-color: rgba(0, 0, 0,1);
    //   content: '';
    //   position: absolute;
    //   top: 0;
    //   bottom: 0;
    //   left: 0;
    //   right: 0;
    //   z-index: -1;
    //   background: url('~@lib/@{imgPath1}/bg_01.png') 0 / cover fixed;
    //   filter: blur(20px);
    //   margin: -30px;
    // }
      &::before {
        background-image: url('~@lib/@{imgPath1}/cold.png');
        background-size: 100% 100%;
      }
    }
    .btn-heat {
      &::before {
        background-image: url('~@lib/@{imgPath1}/heat.png');
        background-size: 100% 100%;
      }
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
    }

    .btn-dehumidify {
      &::before {
        background-image: url('~@lib/@{imgPath1}/dehumidify.png');
        background-size: 100% 100%;
      }
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
        background-image: url('~@lib/@{imgPath}/auto.png');
        background-size: 100% 100%;
      }
       &.active::before {
        background-image: url('~@lib/@{imgPath1}/auto1.png');
        background-size: 100% 100%;
      }
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
    .option{
      width: 100%;
      height: 120px;
      border-top: 1px solid rgba(0, 0, 0, 0.05);
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
            justify-content: space-between;
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
      .cover {
        background: #fff;
        .point {
          &.left {
            background: #d8d8d8;
          }
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
  }
}
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
  90%{
    transform: scale(1.3);
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
      animation: yellowExtendAnimate .1s 1;
       animation-fill-mode : forwards;
       animation-timing-function: ease-out;
      z-index: 99
    }
  }
  @keyframes yellowExtendAnimate {
    0% {width: 50%;height: 50%;}
    
    100% {width: 100%;height: 100%;}
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
