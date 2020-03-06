<template>
  <div class="body">
    <div 
      :class="[{ 'offline': isOffline }, {'close': isClose}, 'page cover',{'scroll44': classTrue}]" 
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
              v-for="(item, index) in count" 
              :key="index" 
              :style="{transform: `rotate(${7.5*index-105}deg)`}" 
              class="item-container">
              <div 
                ref="items" 
                :id="(index)+'item'" 
                class="items" 
                @touchstart="touchstart($event)" 
                @touchmove="touchmove($event)" 
                @touchend="touchend($event)">
                <!-- 小梯形 -->
                <div 
                  ref="item" 
                  :style="{background: 2*(itemTemp/10)-32>=index?calculateBg(index):'rgba(255,255,255,0.1)'}" 
                  class="item"/>
              </div>
            </div>
            
            <div
              v-if="isOffline|| loaclAttr.switchStatus == 'off'||loaclAttr.mode=='wind'||loaclAttr.mode=='auto'"
              class="tm">-- <sup>°C</sup></div>
            <div
              v-if="!isOffline&& loaclAttr.switchStatus == 'on'&&loaclAttr.mode!=='wind'&&loaclAttr.mode!=='auto'"
              class="tm">{{ itemTemp | filterTm }}<sup>°C</sup>
            </div>
          </div>



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
          :class="[loaclAttr.mode,{'active': loaclAttr.switchStatus == 'on'&&!isOffline},'switchColor btn-start']"
          @click="setSwitch('switchStatus')"
        />
      </div>
      <div
        class="panel-btn center">
        <!-- 模式和风速 -->
        <div class="modespeed">
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
import modelMode from './components/model-mode'
import modelSpeed from './components/model-speed'
const [MIN_TEMP, MAX_TEMP] = [160, 300]
export default {
  components: {
    modelMode,
    modelSpeed,
  },
  data() {
    return {
     count: 29,
      now: 0,
      idNum:0,
      moveEnd:false,
      setTemperatureDis:false,
      device_uuid: window.device_uuid||'',
      disabledLock: false,
      itemTemp:'',//最终请求的温度
      hscrolll: 0,
      hscrolltopp: 0,
      classTrue: false,
      loaclAttr: {},
    }
  },

  computed: {
    ...mapGetters(['isClose', 'isOffline']),
    ...mapState(['device', 'deviceAttrs']),
    modeClass() {
      /* eslint-disable no-unreachable */
      switch (this.loaclAttr.mode) {
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
          return ''
      }
    },
    speedClass() {
      /* eslint-disable no-unreachable */
      switch (this.loaclAttr.speed) {
        case 'breeze':
          return 'btn-breeze'
          break
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
      console.log('=============', this.loaclAttr)
    },
       "device.stateChange"() {
      if(this.loaclAttr.temperature) {
        this.setTemperatureDis = false
        // 当返回的温度发生变化时，将温度值赋给itemTemp
        this.itemTemp = this.loaclAttr.temperature
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
          this.itemTemp = this.loaclAttr.temperature
        })
      HdSmart.UI.setStatusBarColor(1)
    })
  },
  mounted(){
     this.$nextTick(()=>{
       setTimeout(()=>{
         window.scrollTo(0,0)
       },200)
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
    // 温度圆环
      calculateBg(index){
          let color = ''
          if(this.loaclAttr.switchStatus=='off'||this.isOffline||this.loaclAttr.mode=='wind'||this.loaclAttr.mode=='auto'){
            color = 'rgba(255,255,255,0.1)'
            return
          }
          if(this.loaclAttr.mode=='cold'){
            // 制冷模式时的温度颜色
            if (index < 10) {
                color = '#327fdb'
            }else if (index > 20) {
                color = '#20c6ae'
            }else {
                color = `linear-gradient(to right, #327fdb 0%, #28a9c3 ${200-10*index}%, #20c6ae 100%)`
            }
            return color
          }else if(this.loaclAttr.mode=='heat'){
            // 制热模式时的温度颜色
            if (index < 10) {
                color = '#F9BB6B '
            }else if (index > 20) {
                color = '#EF6D5E'
            }else {
                color = `linear-gradient(to right, #F9BB6B 0%, #ff7524 ${200-10*index}%, #EF6D5E  100%)`
            }
            return color
          }else{
             // 制热模式时的温度颜色
            if (index < 10) {
                color = '#E1B96E  '
            }else if (index > 20) {
                color = '#F1CB85'
            }else {
                color = `linear-gradient(to right, #E1B96E 0%, #F1CB85 ${200-10*index}%, #F1CB85  100%)`
            }
            return color
          }
      },
    touchstart(e){
      console.log(e,'eeeeeeeee')
    },
    touchmove(e){
      if(e.preventDefault){
          e.preventDefault()
      }else{
          e.returnValue = false
      }
      if (this.loaclAttr.mode=='wind'||this.loaclAttr.mode=='auto') {
        return 
     }
     var touch = e.targetTouches[0]
    //  var ssdd = document.elementsFromPoint(touch.pageX, touch.pageY)
     var ele = document.elementFromPoint(touch.pageX, touch.pageY).id
     this.idNum = parseInt(ele)
     console.log(this.idNum,'小梯形的id')
     this.calculateBg(this.idNum)
     // 如果是NaN,则return
    if(isNaN(this.idNum)==true){
        console.log('return掉了')
        return
      }else{
        // 滑动的梯子的index和温度之间的关系式
        this.itemTemp = (0.5*this.idNum+16)*10
        var num = this.itemTemp + ""

        console.log(num.lastIndexOf("5"),num,'this.itemTemp未处理之前的温度')
        // 如果最后一位数字是5，则往前进1
        if (num.lastIndexOf("5")==2) {
          this.itemTemp -=5
          console.log(this.itemTemp,'最终传给后台的温度')
          
        }
      }
    },
    touchend(){
      if (this.isOffline||this.loaclAttr.switchStatus=='off') return
      if (this.loaclAttr.mode=='wind'||this.loaclAttr.mode=='auto') {
          return HdSmart.UI.toast('该模式不支持温度调节')
      }
      this.controlDevice('temperature',this.itemTemp)
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
      let switchstatus = ''
      if (this.loaclAttr.switchStatus=='on') {
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
      if (this.isOffline||this.isClose) return
      HdSmart.UI.vibrate()
        this.moveEnd = false
        this.setTemperatureDis = true

      // 送风和自动模式不能设置温度
      if (this.loaclAttr.mode === 'wind'||this.loaclAttr.mode === 'auto') {
        this.setTemperatureDis = false
        return HdSmart.UI.toast('该模式不支持温度调节')
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
      if (temp == MAX_TEMP && this.loaclAttr.speed == 'low' && this.loaclAttr.mode == 'cold') {
        this.setTemperatureDis = false
        return HdSmart.UI.toast('低风、制冷模式不支持此温度，请调整后重试')
      }
      this.controlDevice('temperature', temp)
        .then((res) => {
          if (res.code == 0) {
            // this.loaclAttr.temperature = temp
          }else{
            this.setTemperatureDis = false
          }
          // this.reset()
        })
    },
    // 设置风速
    setSpeed(speed, val) {
      if (this.isOffline||this.isClose) return
      HdSmart.UI.vibrate()
        this.moveEnd = false

      this.typeVal = val
      if (this.loaclAttr.mode=='wind'&&val=='auto') {
        this.typeVal = 'hand'
      }
      this.controlDevice('speed', speed)
        .then(() =>{
          this.hide()
        })
    },
    controlDevice(attr, value) {
      let param = {}
      if(attr == 'mode' && value == 'wind' && this.loaclAttr.speed == 'auto'){
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
    showMode() {
      if (this.isClose) return
      this.$refs.mode.show = true
    },
    showSpeed() {
      if (this.isClose) return
      this.$refs.speed.show = true
    },
    hide(){
      if(this.$refs.mode.show) this.$refs.mode.show = false
      if(this.$refs.speed.show) this.$refs.speed.show = false
    },

    getProgress() {
      // 计算温度进度条
      // return 70 /(30 - 16) * (this.loaclAttr.temperature / 10 - 16)
    }
  },
}
</script>
<style lang="less" scoped>
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

</style>