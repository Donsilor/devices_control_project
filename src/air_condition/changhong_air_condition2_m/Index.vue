<template>
  <div class="body">
    <div 
      :class="[{ 'offline': isOffline }, {'close': isClose}, 'page cover']" 
    >
      <NewTopBar
        :title="device.device_name"
        :room="device.room_name"
        :scroll="true"
        page-class=".page"
      />
      <StatusTip @OfflineHelpPage="OfflineHelpPage"/>
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
            v-if="deviceAttrs.mode=='wind'" 
            class="cover"
            @touchmove.prevent/>
          <div class="htmleaf-container">
		
		<div data-to-value='77' data-items-count='32' id="p1_barPie" class="barPie barPie--radio">
		  <span class="barPie__value">0</span>
		  <div class="barPie__ring">
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem31" value="100" hidden="hidden"/>
		    <label for="p1_barPieItem31" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem30" value="96.875" hidden="hidden"/>
		    <label for="p1_barPieItem30" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem29" value="93.75" hidden="hidden"/>
		    <label for="p1_barPieItem29" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem28" value="90.625" hidden="hidden"/>
		    <label for="p1_barPieItem28" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem27" value="87.5" hidden="hidden"/>
		    <label for="p1_barPieItem27" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem26" value="84.375" hidden="hidden"/>
		    <label for="p1_barPieItem26" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem25" value="81.25" hidden="hidden"/>
		    <label for="p1_barPieItem25" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem24" value="78.125" hidden="hidden"/>
		    <label for="p1_barPieItem24" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem23" value="75" hidden="hidden"/>
		    <label for="p1_barPieItem23" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem22" value="71.875" hidden="hidden"/>
		    <label for="p1_barPieItem22" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem21" value="68.75" hidden="hidden"/>
		    <label for="p1_barPieItem21" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem20" value="65.625" hidden="hidden"/>
		    <label for="p1_barPieItem20" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem19" value="62.5" hidden="hidden"/>
		    <label for="p1_barPieItem19" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem18" value="59.375" hidden="hidden"/>
		    <label for="p1_barPieItem18" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem17" value="56.25" hidden="hidden"/>
		    <label for="p1_barPieItem17" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem16" value="53.125" hidden="hidden"/>
		    <label for="p1_barPieItem16" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem15" value="50" hidden="hidden"/>
		    <label for="p1_barPieItem15" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem14" value="46.875" hidden="hidden"/>
		    <label for="p1_barPieItem14" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem13" value="43.75" hidden="hidden"/>
		    <label for="p1_barPieItem13" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem12" value="40.625" hidden="hidden"/>
		    <label for="p1_barPieItem12" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem11" value="37.5" hidden="hidden"/>
		    <label for="p1_barPieItem11" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem10" value="34.375" hidden="hidden"/>
		    <label for="p1_barPieItem10" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem9" value="31.25" hidden="hidden"/>
		    <label for="p1_barPieItem9" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem8" value="28.125" hidden="hidden"/>
		    <label for="p1_barPieItem8" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem7" value="25" hidden="hidden"/>
		    <label for="p1_barPieItem7" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem6" value="21.875" hidden="hidden"/>
		    <label for="p1_barPieItem6" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem5" value="18.75" hidden="hidden"/>
		    <label for="p1_barPieItem5" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem4" value="15.625" hidden="hidden"/>
		    <label for="p1_barPieItem4" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem3" value="12.5" hidden="hidden"/>
		    <label for="p1_barPieItem3" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem2" value="9.375" hidden="hidden"/>
		    <label for="p1_barPieItem2" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem1" value="6.25" hidden="hidden"/>
		    <label for="p1_barPieItem1" class="barPie__ring__item"></label>
		    <input type="radio" name="barPieRadioGroup" id="p1_barPieItem0" value="3.125" hidden="hidden"/>
		    <label for="p1_barPieItem0" class="barPie__ring__item"></label>
		  </div>
		</div>
		
	</div>


          

          <!-- <canvas 
            ref="canvas"
            class="canvas" 
            width="560" 
            height="560"
          /> -->
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
          :class="[deviceAttrs.mode,{'active': deviceAttrs.switchStatus == 'on'&&!isOffline},'switchColor btn-start']"
          @click="setSwitch('switchStatus')"
        />
      </div>
      <div
        class="panel-btn center">
        <!-- 模式和风速 -->
        <div class="modespeed">
            <div class="btn-wrap center" @click="showMode">
              <div 
                :class="[modeClass,'btn  center']" 
                />
              <div class="btn-name">{{modeTxt}}</div>
           </div>
           <div class="btn-wrap center"  @click="showSpeed">
              <div 
                :class="[deviceAttrs.mode,speedClass,'btn center']" />
              <div class="btn-name">{{speedTxt}}</div>
           </div>
        </div>
        <!-- 强劲 -->
        <div class="bottom">
          <div class="Charging-protection">
            <div>数显</div>
            <div
              style="z-index: 100;">
              <input
                :class="['switch switch-anim']"
                :checked="deviceAttrs.digital_display=='on'"
                :disabled="disabledLock"
                type="checkbox"
                @click="checkSwitch('digital_display')">
            </div>
          </div>
        </div>
        <!-- 上下风 -->
        <div class="bottom">
          <div class="Charging-protection">
            <div>数显111</div>
            <div
              style="z-index: 100;">
              <input
                :class="['switch switch-anim']"
                :checked="deviceAttrs.digital_display=='on'"
                :disabled="disabledLock"
                type="checkbox"
                @click="checkSwitch('digital_display')">
            </div>
          </div>
        </div>
        <!-- 左右风 -->
        <div class="bottom">
          <div class="Charging-protection">
            <div>数显</div>
            <div
              style="z-index: 100;">
              <input
                :class="['switch switch-anim']"
                :checked="deviceAttrs.digital_display=='on'"
                :disabled="disabledLock"
                type="checkbox"
                @click="checkSwitch('digital_display')">
            </div>
          </div>
        </div>
      </div>
      <!-- 屏幕显示 -->
      <div class="screen">
          <div class="Charging-protection">
            <div>数显</div>
            <div
              style="z-index: 100;">
              <input
                :class="['switch switch-anim']"
                :checked="deviceAttrs.digital_display=='on'"
                :disabled="disabledLock"
                type="checkbox"
                @click="checkSwitch('digital_display')">
            </div>
          </div>
        </div>
      <!-- 规格选择 -->

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
// import circleProgress from './components/circle-progress'
import modelSwing from './components/model-swing'
import modelMode from './components/model-mode'
import modelSpeed from './components/model-speed'
import SelectTime from './components/time.vue'
const [MIN_TEMP, MAX_TEMP] = [160, 300]
export default {
  components: {
    // circleProgress,
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
      radiusds: 12,
      progress: 30, // 0~70
      duration: 0,
      delay: 0,
      // barColor: '#D8D8D8',
      dotColor:'#fff',
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
      device_uuid: window.device_uuid||'',
      disabledLock: false,

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
        case 'cold':
          return 'btn-cold'
          break
          case 'heat':
          return 'btn-heat'
          break
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
          return 'btn-cold'
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
          return 'btn-auto1'
          break
        default:
          return ''
      }
    },
    modeTxt(){
        /* eslint-disable no-unreachable */
      switch (this.deviceAttrs.mode) {
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
          return '制冷'
      }
    },
    speedTxt(){
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
        default:
          return '低风'
      }
    }
  },
  watch: {
    "device.stateChange"(){
      if(!this.moveEnd)
      this.draw(`${0.125+0.053*(this.deviceAttrs.temperature/10-16)}`)
    },
       'deviceAttrs.temperature'() {
      if(this.deviceAttrs.temperature) {
        this.setTemperatureDis = false
      }
    },
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
        .then(() => {
          this.draw(`${0.125+0.053*(this.deviceAttrs.temperature/10-16)}`)
          // this.reset()
        })
      HdSmart.UI.setStatusBarColor(2)
    })
  },
  mounted(){
    var barPie__ring__item = document.querySelectorAll('.barPie__ring__item')
    for(let i=0;i<barPie__ring__item.length;i++){
      barPie__ring__item[i].style.transform = `rotate(${7.5*i}deg)`
    }
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
        this.moveEnd = true
          this.moveFlag = false
          if (isMove) {
            if (this.thermography == 30 && this.deviceAttrs.speed == 'low' && this.deviceAttrs.mode == 'cold') {
              this.draw(`${0.125+0.053*(this.deviceAttrs.temperature/10-16)}`)
              this.setTemperatureDis = false
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
      if (this.isClose ||this.isOffline) return
      this.controlDevice('mode', val)
      .then(() =>{
          this.hide()
        })
    },
    setTemperature(val,step) {
      console.log(step,'温度')
      
      if (this.isOffline||this.isClose) return
      HdSmart.UI.vibrate()
      this.touchstart(val)
      setTimeout(() => {
        this.touchend(val,temp)
      }, 150)
        this.moveEnd = false
        this.setTemperatureDis = true
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
      if (this.deviceAttrs.temperature == 300 && speed == 'low' && this.deviceAttrs.mode == 'cold') {
        return HdSmart.UI.toast('低风、制冷模式下不支持此温度，请调整后重试')
      }
      if(this.deviceAttrs.mode == 'wind' && speed == 'auto') {
        return HdSmart.UI.toast('送风模式不能设置自动风速')
      }
      this.controlDevice('speed', speed)
        .then(() =>{
          this.hide()
        })
    },
        // check开关切换
    checkSwitch(val) {
      // console.log(e.target.checked)
      this.disabledLock = true
      if (this.isOffline||this.isClose) return
      let checkSwitchStatus = ''
      if (this.deviceAttrs[val] == 'on') {
        checkSwitchStatus = 'off'
      } else {
        checkSwitchStatus = 'on'
      }
      if (val=='digital_display'&&this.deviceAttrs.mode=='heat') {
        this.controlDevice('digital_display', checkSwitchStatus,{'auxiliary_heating_mode':this.deviceAttrs.auxiliary_heating_mode})
        .then(() => {
          this.disabledLock = false
        })
        .catch(() => {
          this.disabledLock = false
        })
        return
      }
      if (val=='auxiliary_heating_mode') {
         this.controlDevice('auxiliary_heating_mode', checkSwitchStatus,{'digital_display':this.deviceAttrs.digital_display})
        .then(() => {
          this.disabledLock = false
        })
        .catch(() => {
          this.disabledLock = false
        })
        return
      }
      this.controlDevice(val, checkSwitchStatus)
      .then(() => {
        this.disabledLock = false
      })
      .catch(() => {
        this.disabledLock = false
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
      // return 70 /(30 - 16) * (this.deviceAttrs.temperature / 10 - 16)
    }
  },
}
</script>

<style lang="less" scoped>

.wrap-circle{
  width: 100%;
  height: 1000px;
}
.barPie--radio {
  margin: 20px;
  width: 1000px;
  height: 1000px;
  text-align: center;
  font: 700 50px 'Open Sans Condensed', sans-serif;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}

.barPie {
  -webkit-perspective: 1000px;
          perspective: 1000px;
}
.barPie__value {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
      -ms-flex-pack: center;
          justify-content: center;
  /* align horizontal */
  -webkit-box-align: center;
  -webkit-align-items: center;
      -ms-flex-align: center;
          align-items: center;
  /* align vertical */
  width: 50%;
  height: 50%;
  margin: auto;
  position: relative;
  top: 50%;
  margin-top: -25%;
  z-index: 1;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.5em;
  text-shadow: 0 1px rgba(0, 0, 0, 0.5), 0 2px rgba(0, 0, 0, 0.4), 0 3px 1px rgba(0, 0, 0, 0.2);
}
.barPie__value::after {
  content: '%';
  display: inline-block;
  opacity: .3;
  font-size: .5em;
  margin-left: .1em;
}
.barPie__ring {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  -webkit-transform: rotate(245deg);
          transform: rotate(245deg);
}
.barPie__ring label {
  cursor: pointer;
}
.barPie__ring__item {
  // background: red; ss
  position: absolute;
  width: 34px;
  height: 50%;
  top: 0;
  left: 50%;
  margin-left: -17px;
  -webkit-transform-origin: 50% 100%;
      -ms-transform-origin: 50% 100%;
          transform-origin: 50% 100%;
  -webkit-transition: .1s;
          transition: .1s;
}
.barPie__ring__item::before {
  content: '';
  display: block;
  width: 50%;
  height: 30%;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.15);
      background-image: linear-gradient(225deg, #1DD3A6 0%, #347ADF 100%);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05), 0 0 4px rgba(0, 0, 0, 0.33) inset;
  -webkit-transition: .3s;
          transition: .3s;
}
.barPie__ring__item:hover::before {
  opacity: .7;
}
.barPie__ring__item:hover::before,
.barPie__ring__item:hover ~ .barPie__ring__item::before {
  background: rgba(255, 255, 255, 0.4);
  -webkit-transition: 0s !important;
          transition: 0s !important;
}
.barPie__ring__item:nth-of-type(1) {
  -webkit-transform: rotate(11.25deg);
      -ms-transform: rotate(11.25deg);
          transform: rotate(11.25deg);
}
.barPie__ring__item:nth-of-type(1)::before {
  -webkit-transition-delay: 12ms;
          transition-delay: 12ms;
}
.barPie__ring__item:nth-of-type(2) {
  -webkit-transform: rotate(22.5deg);
      -ms-transform: rotate(22.5deg);
          transform: rotate(22.5deg);
}
.barPie__ring__item:nth-of-type(2)::before {
  -webkit-transition-delay: 24ms;
          transition-delay: 24ms;
}
.barPie__ring__item:nth-of-type(3) {
  -webkit-transform: rotate(33.75deg);
      -ms-transform: rotate(33.75deg);
          transform: rotate(33.75deg);
}
.barPie__ring__item:nth-of-type(3)::before {
  -webkit-transition-delay: 36ms;
          transition-delay: 36ms;
}
.barPie__ring__item:nth-of-type(4) {
  -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
          transform: rotate(45deg);
}
.barPie__ring__item:nth-of-type(4)::before {
  -webkit-transition-delay: 48ms;
          transition-delay: 48ms;
}
.barPie__ring__item:nth-of-type(5) {
  -webkit-transform: rotate(56.25deg);
      -ms-transform: rotate(56.25deg);
          transform: rotate(56.25deg);
}
.barPie__ring__item:nth-of-type(5)::before {
  -webkit-transition-delay: 60ms;
          transition-delay: 60ms;
}
.barPie__ring__item:nth-of-type(6) {
  -webkit-transform: rotate(67.5deg);
      -ms-transform: rotate(67.5deg);
          transform: rotate(67.5deg);
}
.barPie__ring__item:nth-of-type(6)::before {
  -webkit-transition-delay: 72ms;
          transition-delay: 72ms;
}
.barPie__ring__item:nth-of-type(7) {
  -webkit-transform: rotate(78.75deg);
      -ms-transform: rotate(78.75deg);
          transform: rotate(78.75deg);
}
.barPie__ring__item:nth-of-type(7)::before {
  -webkit-transition-delay: 84ms;
          transition-delay: 84ms;
}
.barPie__ring__item:nth-of-type(8) {
  -webkit-transform: rotate(90deg);
      -ms-transform: rotate(90deg);
          transform: rotate(90deg);
}
.barPie__ring__item:nth-of-type(8)::before {
  -webkit-transition-delay: 96ms;
          transition-delay: 96ms;
}
.barPie__ring__item:nth-of-type(9) {
  -webkit-transform: rotate(101.25deg);
      -ms-transform: rotate(101.25deg);
          transform: rotate(101.25deg);
}
.barPie__ring__item:nth-of-type(9)::before {
  -webkit-transition-delay: 108ms;
          transition-delay: 108ms;
}
.barPie__ring__item:nth-of-type(10) {
  -webkit-transform: rotate(112.5deg);
      -ms-transform: rotate(112.5deg);
          transform: rotate(112.5deg);
}
.barPie__ring__item:nth-of-type(10)::before {
  -webkit-transition-delay: 120ms;
          transition-delay: 120ms;
}
.barPie__ring__item:nth-of-type(11) {
  -webkit-transform: rotate(123.75deg);
      -ms-transform: rotate(123.75deg);
          transform: rotate(123.75deg);
}
.barPie__ring__item:nth-of-type(11)::before {
  -webkit-transition-delay: 132ms;
          transition-delay: 132ms;
}
.barPie__ring__item:nth-of-type(12) {
  -webkit-transform: rotate(135deg);
      -ms-transform: rotate(135deg);
          transform: rotate(135deg);
}
.barPie__ring__item:nth-of-type(12)::before {
  -webkit-transition-delay: 144ms;
          transition-delay: 144ms;
}
.barPie__ring__item:nth-of-type(13) {
  -webkit-transform: rotate(146.25deg);
      -ms-transform: rotate(146.25deg);
          transform: rotate(146.25deg);
}
.barPie__ring__item:nth-of-type(13)::before {
  -webkit-transition-delay: 156ms;
          transition-delay: 156ms;
}
.barPie__ring__item:nth-of-type(14) {
  -webkit-transform: rotate(157.5deg);
      -ms-transform: rotate(157.5deg);
          transform: rotate(157.5deg);
}
.barPie__ring__item:nth-of-type(14)::before {
  -webkit-transition-delay: 168ms;
          transition-delay: 168ms;
}
.barPie__ring__item:nth-of-type(15) {
  -webkit-transform: rotate(168.75deg);
      -ms-transform: rotate(168.75deg);
          transform: rotate(168.75deg);
}
.barPie__ring__item:nth-of-type(15)::before {
  -webkit-transition-delay: 180ms;
          transition-delay: 180ms;
}
.barPie__ring__item:nth-of-type(16) {
  -webkit-transform: rotate(180deg);
      -ms-transform: rotate(180deg);
          transform: rotate(180deg);
}
.barPie__ring__item:nth-of-type(16)::before {
  -webkit-transition-delay: 192ms;
          transition-delay: 192ms;
}
.barPie__ring__item:nth-of-type(17) {
  -webkit-transform: rotate(191.25deg);
      -ms-transform: rotate(191.25deg);
          transform: rotate(191.25deg);
}
.barPie__ring__item:nth-of-type(17)::before {
  -webkit-transition-delay: 204ms;
          transition-delay: 204ms;
}
.barPie__ring__item:nth-of-type(18) {
  -webkit-transform: rotate(202.5deg);
      -ms-transform: rotate(202.5deg);
          transform: rotate(202.5deg);
}
.barPie__ring__item:nth-of-type(18)::before {
  -webkit-transition-delay: 216ms;
          transition-delay: 216ms;
}
.barPie__ring__item:nth-of-type(19) {
  -webkit-transform: rotate(213.75deg);
      -ms-transform: rotate(213.75deg);
          transform: rotate(213.75deg);
}
.barPie__ring__item:nth-of-type(19)::before {
  -webkit-transition-delay: 228ms;
          transition-delay: 228ms;
}
.barPie__ring__item:nth-of-type(20) {
  -webkit-transform: rotate(225deg);
      -ms-transform: rotate(225deg);
          transform: rotate(225deg);
}
.barPie__ring__item:nth-of-type(20)::before {
  -webkit-transition-delay: 240ms;
          transition-delay: 240ms;
}
.barPie__ring__item:nth-of-type(21) {
  -webkit-transform: rotate(236.25deg);
      -ms-transform: rotate(236.25deg);
          transform: rotate(236.25deg);
}
.barPie__ring__item:nth-of-type(21)::before {
  -webkit-transition-delay: 252ms;
          transition-delay: 252ms;
}
.barPie__ring__item:nth-of-type(22) {
  -webkit-transform: rotate(247.5deg);
      -ms-transform: rotate(247.5deg);
          transform: rotate(247.5deg);
}
.barPie__ring__item:nth-of-type(22)::before {
  -webkit-transition-delay: 264ms;
          transition-delay: 264ms;
}
.barPie__ring__item:nth-of-type(23) {
  -webkit-transform: rotate(258.75deg);
      -ms-transform: rotate(258.75deg);
          transform: rotate(258.75deg);
}
.barPie__ring__item:nth-of-type(23)::before {
  -webkit-transition-delay: 276ms;
          transition-delay: 276ms;
}
.barPie__ring__item:nth-of-type(24) {
  -webkit-transform: rotate(270deg);
      -ms-transform: rotate(270deg);
          transform: rotate(270deg);
}
.barPie__ring__item:nth-of-type(24)::before {
  -webkit-transition-delay: 288ms;
          transition-delay: 288ms;
}
.barPie__ring__item:nth-of-type(25) {
  -webkit-transform: rotate(281.25deg);
      -ms-transform: rotate(281.25deg);
          transform: rotate(281.25deg);
}
.barPie__ring__item:nth-of-type(25)::before {
  -webkit-transition-delay: 300ms;
          transition-delay: 300ms;
}
.barPie__ring__item:nth-of-type(26) {
  -webkit-transform: rotate(292.5deg);
      -ms-transform: rotate(292.5deg);
          transform: rotate(292.5deg);
}
.barPie__ring__item:nth-of-type(26)::before {
  -webkit-transition-delay: 312ms;
          transition-delay: 312ms;
}
.barPie__ring__item:nth-of-type(27) {
  -webkit-transform: rotate(303.75deg);
      -ms-transform: rotate(303.75deg);
          transform: rotate(303.75deg);
}
.barPie__ring__item:nth-of-type(27)::before {
  -webkit-transition-delay: 324ms;
          transition-delay: 324ms;
}
.barPie__ring__item:nth-of-type(28) {
  -webkit-transform: rotate(315deg);
      -ms-transform: rotate(315deg);
          transform: rotate(315deg);
}
.barPie__ring__item:nth-of-type(28)::before {
  -webkit-transition-delay: 336ms;
          transition-delay: 336ms;
}
.barPie__ring__item:nth-of-type(29) {
  -webkit-transform: rotate(326.25deg);
      -ms-transform: rotate(326.25deg);
          transform: rotate(326.25deg);
}
.barPie__ring__item:nth-of-type(29)::before {
  -webkit-transition-delay: 348ms;
          transition-delay: 348ms;
}
.barPie__ring__item:nth-of-type(30) {
  -webkit-transform: rotate(337.5deg);
      -ms-transform: rotate(337.5deg);
          transform: rotate(337.5deg);
}
.barPie__ring__item:nth-of-type(30)::before {
  -webkit-transition-delay: 360ms;
          transition-delay: 360ms;
}
.barPie__ring__item:nth-of-type(31) {
  -webkit-transform: rotate(348.75deg);
      -ms-transform: rotate(348.75deg);
          transform: rotate(348.75deg);
}
.barPie__ring__item:nth-of-type(31)::before {
  -webkit-transition-delay: 372ms;
          transition-delay: 372ms;
}
.barPie__ring__item:nth-of-type(32) {
  -webkit-transform: rotate(360deg);
      -ms-transform: rotate(360deg);
          transform: rotate(360deg);
}
.barPie__ring__item:nth-of-type(32)::before {
  -webkit-transition-delay: 384ms;
          transition-delay: 384ms;
}
.barPie__ring :checked ~ .barPie__ring__item::before {
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
  -webkit-transition: 0s;
          transition: 0s;
}
</style>
