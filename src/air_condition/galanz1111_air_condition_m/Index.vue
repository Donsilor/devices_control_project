<template>
  <div 
    class="body" 
    @touchstart="bodyTouchstart"
    @touchmove="bodyTouchmove"
    @touchend="bodyTouchEnd">
    <div
      :class="[{ 'offline': isOffline }, {'close': isClose}, 'page cover']"
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
        <div
          class="wrap-circle"
          @touchmove="touchmove($event)">
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
                @touchstart.stop="touchstart($event)"
                @touchmove.stop="touchmove($event)"
                @touchend="touchend($event)">
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
        ref="bottomControl"
        :style="{bottom: bottom1}"
        class="bottom-control">
        <!-- 底部 -->
        <div
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
      minVisibleHeight:100,
      controlHight:0,
      deControlTemp: null,
      positionRecord: 0,
      canMove: false,
      bottom1: '0',
      touchStartPoint: 0,
      touchEndPoint: 0,
      returnTemp:'',
      isTouchStart:false,
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
    }
  },

  computed: {
    ...mapGetters(['isClose', 'isOffline']),
    ...mapState(['device', 'deviceAttrs']),
    bottemOff() {
        return -(this.$refs.bottomControl.offsetHeight - 135) + 'px'
    },
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
      'deviceAttrs.mode'() {
        this.resetPosition(true)
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
      setTimeout(()=>{
        window.scrollTo(0,0)
      },200)
      this.resetPosition()
    },)
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
      resetPosition(isReset = false) {
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
      hideMemu() {
        if (!this.canMove) return
        this.bottom1 = -(this.$refs.bottomControl.offsetHeight - this.minVisibleHeight) + 'px'
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
      bodyTouchEnd(e) {
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
      this.isTouchStart = true
      console.log(this.isTouchStart,'start')
    },
    touchmove(e){
      if(this.isTouchStart == false) return
      console.log(this.isTouchStart,'move')
      //isMove是用来判断是否是滑动
      if(this.isClose) return
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
     var ele = document.elementFromPoint(touch.clientX, touch.clientY)&&document.elementFromPoint(touch.clientX, touch.clientY).id
     this.idNum = parseInt(ele)
      // 如果是NaN,则return
      if(isNaN(this.idNum)==true){
          console.log(this.itemTemp,'return掉了return发的温度是')
          this.returnTemp = this.itemTemp
        }else{
            // 滑动的梯子的index和温度之间的关系式
            this.itemTemp = (0.5*this.idNum+16)*10
            var num = this.itemTemp + ""

            // 如果最后一位数字是5，则往前进1
            if (num.lastIndexOf("5")==2) {
              console.log(num,'numnum')
              this.itemTemp +=5
              this.returnTemp = this.itemTemp
              console.log(this.itemTemp,'最终传给后台的温度2222222')
            }else{
              this.itemTemp = (0.5*this.idNum+16)*10
              this.returnTemp = this.itemTemp
              console.log(num,'传的没有小数的温度')
            }
      }
    },
    touchend(){
      this.isTouchStart = false
      console.log(this.itemTemp,'温度touchend')
      if (this.deviceAttrs.mode=='auto'||this.deviceAttrs.mode=='dehumidify'||this.deviceAttrs.mode=='wind') {
          return HdSmart.UI.toast('该模式不支持温度调节')
      }
      if(this.isMove == false||this.isClose) return
      this.flagVal = true
      this.setTemperatureDis = true
      this.controlDevice('temperature',this.returnTemp)
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
 .body{
    height: 100vh;
  }
.bottom-control {
    position: fixed;
    width: 100%;
    left: 0;
    z-index: 1000;
    background-color: black;
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
    // .container {
    //     width: 85%;
    //     // height: 470px;
    //     height: 370px;
    //     margin: 20px auto;
    //     border: 1px solid #000;
    //     position: relative;
    // }
    // .item-container {
    //     width: 10px;
    //     // height: 270px;
    //     height: 350px;
    //     position: absolute;
    //     left: 50%;
    //     // top: 0;
    //     top: -80px;
    //     transform-origin: 50% 100%;
    //     z-index: 99;
    //     .items{
    //       width: 32px;
    //       // height: 270px;
    //       height: 350px;
    //       z-index: 99;
    //       .item {
    //         width: 12px;
    //         height: 64px;
    //         background-color: rgba(255,255,255,0.1);
    //         -webkit-clip-path: polygon(100% 0,75% 100%, 25% 100%, 0 0);
    //         clip-path: polygon(100% 0,75% 100%, 25% 100%, 0 0);
    //         margin-top:80px;
    //       }
    //     }
    // }
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
    .pannelCover{
      position:absolute;
      top:0;
      bottom:0;
      left:0;
      right:0;
    }
</style>
