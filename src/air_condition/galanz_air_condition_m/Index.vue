<template>
  <div class="body">
    <div 
      :class="[{ 'offline': isOffline }, {'close': isClose}, 'page cover']" 
      @touchstart.prevent="slideBoxStart"
      @touchmove.prevent="slideBoxMove"
      @touchend.prevent="slideBoxEnd"
    >
      <NewTopBar
        :title="device.device_name"
        :room="device.room_name"
        :scroll="true"
        page-class=".page"
        @hscroll="hscroll"
        @hscrolltop="hscrolltop"
      />
      <StatusTip @OfflineHelpPage="OfflineHelpPage"/>
      <div class="main center">
        <div class="wrap-circle">
          <!-- 温度圆环 -->
          <div 
            class="container"
            @touchmove="touchmove($event)">
            <div 
              class="cover"
              @touchmove.prevent
            />>
            <div 
              v-for="(item, index) in count" 
              :key="index" 
              :style="{transform: `rotate(${7.24*index-105}deg)`}" 
              class="item-container" 
            >
              <div 
                ref="items" 
                :id="(index)+'items'" 
                class="items" 
                @touchmove.stop="touchmove($event)" 
                @touchend.stop="touchend($event)">
                <!-- 小梯形 -->
                <div 
                  ref="item" 
                  :id="(index)+'item'"
                  :style="{background: 2*(itemTemp/10)-33>=index?calculateBg(index):'rgba(255,255,255,0.1)'}" 
                  class="item"
                />
              </div>
            </div>
            
            <div
              v-if="isOffline|| deviceAttrs.switchStatus == 'off'"
              class="tm">-- <sup>°C</sup></div>
            <div
              v-else
              class="tm">{{ itemTemp | filterTm }}<sup 
                ref="sup"
                :style="{right: (itemTemp/10)%1 == 0 ? 8+'px': -20 +'px'}">°C</sup>
            </div>
          </div>
        </div>
        <!-- 温度按钮 -->
        <div
          class="control-tm center">
          <button
            ref="reduce"
            :disabled="setTemperatureDis"
            :class="[deviceAttrs.mode,{'animateStart':isReduceStart==true},{'animateEnd':isReduceEnd==true},'control reduce btn']"
            @touchstart.stop ="startAnimate('reduce')"
            @touchend.stop="endAnimate('reduce',-10)"
          />
          <button
            ref="add"
            :disabled="setTemperatureDis"
            :class="[deviceAttrs.mode,{'animateStart':isAddStart==true},{'animateEnd':isAddEnd==true},'control add btn']"
            @touchstart.stop ="startAnimate('add')"
            @touchend.stop="endAnimate('add',10)"
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
          :class="[deviceAttrs.mode,{'active': deviceAttrs.switchStatus == 'on'&&!isOffline},{'animateStart':isStart==true},{'animateEnd':isEnd==true},'switchColor btn-start']"
          @touchstart ="startAnimate('switchStatus')"
          @touchend="endAnimate('switchStatus')"
        />
      </div>
      <div 
        ref="panelBox" 
        class="panelBox">
        <!-- 底部 -->
        <div
          ref="panel"
          class="panel-btn center">
          <!-- 模式和风速 -->
          <div class="modespeed">
            <!-- 模式 -->
            <div 
              class="btn-wrap center" 
              @click="showMode">
              <div 
                :class="[modeClass,'btn  center']" 
              />
              <div class="btn-name">{{ modeTxt }}</div>
            </div>
            <!-- 风速 -->
            <div 
              class="btn-wrap center" 
              @click="showSpeed">
              <div 
                :class="[deviceAttrs.mode,speedClass,'btn center']" />
              <div class="btn-name">{{ speedTxt }}</div>
            </div>
            <!-- 定时 -->
            <div 
              class="btn-wrap center" 
              @click="showTime">
              <div 
                :class="[deviceAttrs.mode,'clock btn center']" 
              />
              <div class="btn-name">定时</div>
            </div>
          </div>
          <!-- 上下风 -->
          <div 
            class="bottom" 
            @click="showSwing">
            <div class="Charging-protection">
              <div v-if="deviceAttrs.wind_up=='on'">向上</div>
              <div v-else-if="deviceAttrs.wind_mid_up=='on'">中上</div>
              <div v-else-if="deviceAttrs.wind_middle=='on'">正中</div>
              <div v-else-if="deviceAttrs.wind_mid_down=='on'">中下</div>
              <div v-else-if="deviceAttrs.wind_down=='on'">向下</div>
              <div v-else-if="deviceAttrs.wind_auto=='on'">自动</div>
              <div v-else>摆风</div>
              <div
                style="z-index: 100;" 
                class="showWind"/>
            </div>
          </div>
          <!-- 电加热开关 -->
          <div 
            v-if="deviceAttrs.mode=='heat'" 
            class="bottom">
            <div class="Charging-protection">
              <div>电加热</div>
              <div
                style="z-index: 100;">
                <input
                  :class="[deviceAttrs.mode,'switch switch-anim']"
                  :checked="deviceAttrs.auxiliary_heating_mode=='on'"
                  :disabled="disabledLock"
                  type="checkbox"
                  @click="checkSwitch('auxiliary_heating_mode')">
              </div>
            </div>
          </div>
        </div>
        <!-- 屏幕显示 -->
        <div class="screen">
          <div class="Charging-protection">
            <div>空调屏幕画面</div>
            <div
              style="z-index: 100;">
              <input
                :class="[deviceAttrs.mode,'switch switch-anim']"
                :checked="deviceAttrs.digital_display=='on'"
                :disabled="disabledLock"
                type="checkbox"
                @click="checkSwitch('digital_display')">
            </div>
          </div>
        </div>
      </div>
      <!-- 规格选择 -->

      <!--选择摆风-->
      <model-swing
        ref="swing"
        :swing_wind="deviceAttrs"
        @setWind="setWind" />
      <!--选择模式-->
      <model-mode
        ref="mode"
        :mode="deviceAttrs.mode"
        @setMode="setMode" />
      <!--选择风速-->
      <model-speed
        ref="speed"
        :mode="deviceAttrs.mode"
        :speed="deviceAttrs.speed"
        @setSpeed="setSpeed" />
      <!-- 时间选择 -->
      <SelectTime
        ref="time"
        :device-attrs="deviceAttrs"
        @selectedTime="setReserve"
        @canceltime="canceltime" />
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
const [MIN_TEMP, MAX_TEMP] = [160, 310]
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
      count: 30,
      now: 0,
      idNum:0,
      moveEnd:false,
      setTemperatureDis:false,
      device_uuid: window.device_uuid||'',
      disabledLock: false,
      itemTemp:'',//最终请求的温度
      flagVal: false,
      hscrolll: 0,
      hscrolltopp: 0,
      classTrue: false,
      isMove:false,
      isStart:false,//按钮是否动画开始
      isEnd:false,//按钮是否动画开始
      isReduceStart:false,
      isReduceEnd:false,
      isAddStart:false,
      isAddEnd:false,
      slideUp:false,
      slideNum:'',
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
          return 'btn-breeze'
          break
        case 'normal':
          return 'btn-low'
          break
        case 'high':
          return 'btn-normal'
          break
        case 'strong':
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
        case 'strong':
          return '强力'
          break
        default:
          return ''
      }
    }
  },
  watch: {
    'device.stateChange'() {
        this.flagVal = false
      },
    'deviceAttrs.temperature'() {
      if(this.deviceAttrs.temperature) {
        this.setTemperatureDis = false
        // 当返回的温度发生变化时，将温度值赋给itemTemp
        this.itemTemp = this.deviceAttrs.temperature
      }
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
          this.itemTemp = this.deviceAttrs.temperature
        })
      HdSmart.UI.setStatusBarColor(1)
    })
  },
  mounted() {
    this.$nextTick(()=>{
      console.log()
      setTimeout(()=>{
        window.scrollTo(0,0)
      },200)
    },)
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    hscroll(val) {
      this.hscrolll = val
    },
    hscrolltop(val) {
      this.hscrolltopp = val
    },
    // 按钮动画开始
    startAnimate(val){
      if(val=='switchStatus'){
        if (this.isOffline) return
        this.isStart = true
      }else if(val=='reduce'){
        if (this.isOffline||this.isClose) return
        this.isReduceStart = true
      }else{
        if (this.isOffline||this.isClose) return
        this.isAddStart = true
      }
    },
    // 按钮动画结束
    endAnimate(val){
      if(val=='switchStatus'){
        if (this.isOffline) return
        this.isEnd = true
        this.setSwitch()
      }else if(val=='reduce'){
        if (this.isOffline||this.isClose) return
        this.isReduceEnd = true
        this.setTemperature(val,-10)
      }else{
        if (this.isOffline||this.isClose) return
        this.isAddEnd = true
        this.setTemperature(val,10)
      }
    },
    // 温度圆环
    calculateBg(index){
        let color = ''
        if(this.deviceAttrs.switchStatus=='off'||this.isOffline){
          color = 'rgba(255,255,255,0.1)'
          return
        }
        if(this.deviceAttrs.mode=='heat'){
          // 制热模式时的温度颜色
          if (index < 10) {
              color = '#EF6D5E '
          }else if (index > 20) {
              color = '#F9BB6B'
          }else {
              color = `linear-gradient(to right, #EF6D5E 0%, #ff7524 ${200-10*index}%, #F9BB6B  100%)`
          }
              
          return color
        }else{
          if (index < 10) {
              color = '#327fdb'
          }else if (index > 20) {
              color = '#20c6ae'
          }else {
              color = `linear-gradient(to right, #327fdb 0%, #28a9c3 ${200-10*index}%, #20c6ae 100%)`
          }
          return color
        }
    },
    touchstart(e){
      console.log(e,'eeeeeeeee')
    },
    touchmove(e){
      //isMove是用来判断是否是滑动
      this.isMove = true
      if(e.preventDefault){
          e.preventDefault()
      }else{
          e.returnValue = false
      }
      if (this.deviceAttrs.mode=='auto'||this.deviceAttrs.mode=='dehumidify'||this.deviceAttrs.mode=='wind') {
        return 
     }
     //  滑动限制处理
      //  if(this.flagVal == true) return
     var touch = e.targetTouches[0]
     var ele = document.elementFromPoint(touch.clientX, touch.clientY).id
     this.idNum = parseInt(ele)
      // 如果是NaN,则return
      if(isNaN(this.idNum)==true){
          console.log('return掉了')
          return
        }else{
          // 滑动的梯子的index和温度之间的关系式
          this.itemTemp = (0.5*this.idNum+16)*10
          var num = this.itemTemp + ""
          // console.log(num.lastIndexOf("5"),num,'this.itemTemp未处理之前的温度')
          // 如果最后一位数字是5，则往前进1
          if (num.lastIndexOf("5")==2) {
            this.itemTemp +=5
            console.log(this.itemTemp,'最终传给后台的温度')
            
          }
        }
    },
    touchend(){
      if (this.deviceAttrs.mode=='auto'||this.deviceAttrs.mode=='dehumidify'||this.deviceAttrs.mode=='wind') {
          return HdSmart.UI.toast('该模式不支持温度调节')
      }
      if(this.isMove == false) return
      this.flagVal = true
      this.setTemperatureDis = true
      this.controlDevice('temperature',this.itemTemp)
      .then((res) => {
        // this.setTemperatureDis = false
        if(res.code != 0) {
          this.flagVal = false
        }
      })
      .catch(() => {
        this.flagVal = false
      })
      this.isMove = false
    },
    OfflineHelpPage(){
        this.$router.push({
         path:"/OfflineHelpPage"
       })
    },
    // 开关机
    setSwitch(){
      if (this.isOffline) return
      HdSmart.UI.vibrate()
      this.moveEnd = false
      setTimeout(()=>{
         this.isStart = false
        this.isEnd = false
      },500)
      let switchstatus = ''
      if (this.deviceAttrs.switchStatus=='on') {
        switchstatus = 'off'
      }else{
        switchstatus = 'on'
      }
      this.controlDevice('switch',switchstatus)
    },
        // 设置关机时间
    setReserve(time) {
      console.log(time,'888888')
      
        this.controlDevice('time',{
            timer_switch:'on',
            time_value:time*2
        })
    },
    // 取消定时
    canceltime(){
       this.controlDevice('close_time','true')
      //  .then((res) => {
      //    if(res.code == 0) {
      //      this.loaclAttr.close_time = true
      //    } else {
      //      HdSmart.UI.toast('操作失败')
      //    }
      //  })
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
      if (this.isOffline||this.isClose) return
      setTimeout(()=>{
        this.isReduceStart = false
        this.isAddStart = false
        this.isReduceEnd = false
        this.isAddEnd = false
      },500)
      HdSmart.UI.vibrate()
        this.moveEnd = false
        this.setTemperatureDis = true
      // 送风模式不能设置温度
      if (this.deviceAttrs.mode === 'wind'||this.deviceAttrs.mode === 'auto'||this.deviceAttrs.mode === 'dehumidify') {
        this.setTemperatureDis = false
        return HdSmart.UI.toast('该模式不支持温度调节')
      }
      // let temp = +this.deviceAttrs.temperature + step
      let temp = +this.itemTemp + step
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
      // if(this.deviceAttrs.mode == 'wind' && speed == 'auto') {
      //   return HdSmart.UI.toast('送风模式不能设置自动风速')
      // }
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
    // 页面滑动，展示底部盒子
    slideBoxStart(e){
      console.log(e,'touch开始')
      this.startY = e.targetTouches[0].clientY
    },
    slideBoxMove(e){
      console.log(e,'move开始')
      this.endY = e.targetTouches[0].clientY
      if(this.startY - this.endY > 0){
        this.slideUp = true
      }else{
        this.slideUp = false
      }
      this.slideNum = parseInt(this.$refs.panel.style.marginTop) 
      if(this.slideUp== true&&this.slideNum== -140) return
      if(this.slideUp== true && this.startY - this.endY >0){
        // this.$refs.panel.style.marginTop = this.endY - this.startY+'px'
        // if(this.startY - this.endY>=50){
        //   this.$refs.panel.style.marginTop = -140+'px'
        // }
      }else if(this.slideUp== false && this.startY - this.endY <0){
        console.log(this.endY - this.startY,'this.endY - this.startY')
        console.log(this.slideNum,'this.slideNum')
        // this.$refs.panel.style.marginTop = this.endY - this.startY -140 +'px'
        // if(this.startY - this.endY <= -50){
        //   this.$refs.panel.style.marginTop = 0+'px'
        // }
      }
    },
    slideBoxEnd(e){
      console.log(e,'end结束')
      // this.$refs.panel.top = 
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
      if (this.deviceAttrs.mode == 'dehumidify') {
        return HdSmart.UI.toast('除湿模式不可调节风速')
      }
      if (this.deviceAttrs.strong_wind=='on') {
        return HdSmart.UI.toast('强力模式下不可调节风速')
      }
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
.panelBox{
  position:relative;
  z-index:100;
  background:#000;
  width:100%;
}
.page {
  .main{
    .wrap-circle {
      .tm {
        width: 240px;
        sup{
          right: 16px;
        }
      }
    }
  }
}
    .container {
        width: 80%;
        // height: 470px;
        height: 370px;
        margin: 20px auto;
        border: 1px solid #000;
        position: relative;
    }
    .item-container {
        width: 10px;
        height: 270px;
        // height: 330px;
        position: absolute;
        left: 50%;
        top: 0;
        transform-origin: 50% 100%;
        z-index: 99;
    }
    .items{
      width: 32px;
      height: 270px;
      // height: 330px;
      z-index: 99;
    }
    .item {
        width: 12px;
        height: 64px;
        background-color: rgba(255,255,255,0.1);
        -webkit-clip-path: polygon(100% 0,75% 100%, 25% 100%, 0 0);
        clip-path: polygon(100% 0,75% 100%, 25% 100%, 0 0);
    }
    .showWind{
      width: 40px;
      height: 40px;
      position: relative;
      &::before{
        display: block;
        content: "";
        background-image: url('../../../lib/base/oakes_air_condition/assets/arrow_in2.png');
        background-size: 100% 100%;
        height: 100%;
        width: 100%;
      }
    }
    .control-tm{
      .wind.control,.auto.control,.dehumidify.control{
        &::before{
          opacity: 0.3;
        }
      }
    }
    .coverPannel{
      &:before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      width: 100%;
    }
    }
</style>