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
              :style="{transform: `rotate(${210/(count-1)*index-105}deg)`}" 
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
                  :style="{background: 2*(itemTemp/10)-(2*(minTemp/10)+1)>=index?calculateBg(index):'rgba(255,255,255,0.1)'}" 
                  class="item"/>
              </div>
            </div>
            <div 
              v-if="deviceAttrs.connectivity == 'offline'||deviceAttrs.switchStatus=='off'" 
              class="tm">-- <sup>°C</sup></div>
            <div 
              v-if="!isOffline&& deviceAttrs.switchStatus == 'on'"
              class="tm">{{ itemTemp | filterTm }}<sup>°C</sup>
            </div>
          </div>



        </div>
        <div
          class="control-tm center">
          <button
            ref="reduce"
            :disabled="setTemperatureDis"
            :class="[deviceAttrs.mode,{'animateStart':isReduceStart==true},{'animateEnd':isReduceEnd==true},'control reduce btn']"
            @touchstart ="startAnimate('reduce')"
            @touchend="endAnimate('reduce',-10)"
          />
          <button
            ref="add"
            :disabled="setTemperatureDis"
            :class="[deviceAttrs.mode,{'animateStart':isAddStart==true},{'animateEnd':isAddEnd==true},'control add btn']"
            @touchstart ="startAnimate('add')"
            @touchend="endAnimate('add',10)"
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
          :class="[deviceAttrs.mode,{'active': deviceAttrs.switchStatus == 'on'&&!isOffline},{'animateStart':isStart==true},{'animateEnd':isEnd==true},'switchColor btn-start']"
          @touchstart ="startAnimate('switchStatus')"
          @touchend="endAnimate('switchStatus')"
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
        :mode-type="modeType"
        :mode="loaclAttr.mode"
        @setMode="setMode" />
      <!--选择风速-->
      <model-speed
        ref="speed"
        :speed-type="speedType"
        :speed="loaclAttr.speed"
        :mode="loaclAttr.mode"
        @setSpeed="setSpeed" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import modelMode from './components/model-mode'
import modelSpeed from './components/model-speed'
// const [MIN_TEMP, MAX_TEMP] = [160, 300]
export default {
  components: {
    modelMode,
    modelSpeed,
  },
  data() {
    return {
      returnTemp:'',
      isTouchStart:false,
      count: 0,
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
      tempType:'',
      speedType:'',
      modeType:'',
      isMove:false,
      isStart:false,//按钮是否动画开始
      isEnd:false,//按钮是否动画开始
      isReduceStart:false,
      isReduceEnd:false,
      isAddStart:false,
      isAddEnd:false,
      minTemp:'',
      maxTemp:'',
    }
  },

  computed: {
    ...mapGetters(['isClose', 'isOffline']),
    ...mapState(['device', 'deviceAttrs','ThirddeviceAttrs']),
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
         case 'breath':
          return 'btn-breath'
          break
        case 'sleep':
          return 'btn-sleep'
          break
        case 'fresh':
          return 'btn-fresh'
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
        case 'strong':
          return 'btn-strong'
          break
        case 'superstrong':
          return 'btn-superstrong'
          break
        case 'stopwind':
          return 'btn-stopwind'
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
          return '通风'
          break
        case 'breath':
          return '换气'
          break
        case 'sleep':
          return '睡眠'
          break
        case 'fresh':
          return '清爽'
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
          return '自动'
          break
        case 'strong':
          return '强风'
          break
        case 'superstrong':
          return '超强风'
          break
        case 'stopwind':
          return '停风'
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
          console.log(this.count)
          this.itemTemp = this.loaclAttr.temperature
          this.tempType = this.ThirddeviceAttrs.selection.split(";")[0]
          this.minTemp = this.tempType.split(",")[0]*10//160
          this.maxTemp = this.tempType.split(",")[1]*10//300
          //设置最低温和最高温
          this.MIN_TEMP = this.minTemp
          this.MAX_TEMP = this.maxTemp
          this.count = (this.MAX_TEMP/10-this.MIN_TEMP/10)*2
          console.log(this.count,'this.count')
          this.speedType = this.ThirddeviceAttrs.selection.split(";")[1]
          console.log(this.speedType,'speedType')
          this.speedNum = this.speedType.replace(/,/g, "")//取消字符串中出现的所有逗号 
          this.modeType = this.ThirddeviceAttrs.selection.split(";")[2]
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
          if(this.loaclAttr.switchStatus=='off'||this.isOffline){
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
                  // color="#f38f63"
              }
              return color

            }else{
                // 制冷模式时的温度颜色
              if (index < 10) {
                  color = '#327fdb'
              }else if (index > 20) {
                  color = '#20c6ae'
              }else {
                  color = `linear-gradient(to right, #327fdb 0%, #28a9c3 ${200-10*index}%, #20c6ae 100%)`
              }
              // console.log(index,11111111111)
              return color
            }
      },
    touchstart(e){
      console.log(e,'eeeeeeeee')
      this.isTouchStart = true
    },
    touchmove(e){
      if(this.isTouchStart == false) return
      //isMove是用来判断是否是滑动
      this.isMove = true
      if(e.preventDefault){
          e.preventDefault()
      }else{
          e.returnValue = false
      }
      var touch = e.targetTouches[0]
      //  var ssdd = document.elementsFromPoint(touch.pageX, touch.pageY)
      var ele = document.elementFromPoint(touch.clientX, touch.clientY)&&document.elementFromPoint(touch.pageX, touch.pageY).id
      this.idNum = parseInt(ele)
      console.log(this.idNum,'小梯形的id')
      this.calculateBg(this.idNum)
      // 如果是NaN,则return
      if(isNaN(this.idNum)==true){
          console.log(this.itemTemp,'return掉了return发的温度是')
          this.returnTemp = this.itemTemp
        }else{
          // 滑动的梯子的index和温度之间的关系式
          this.itemTemp = (0.5*this.idNum+(this.MIN_TEMP/10+0.5))*10
          var num = this.itemTemp + ""

          console.log(num.lastIndexOf("5"),num,'this.itemTemp未处理之前的温度')
          // 如果最后一位数字是5，则往前进1
          if (num.lastIndexOf("5")==2) {
            this.itemTemp -=5
            this.returnTemp = this.itemTemp
            console.log(this.itemTemp,'最终传给后台的温度')
          }else{
            this.itemTemp = (0.5*this.idNum+(this.MIN_TEMP/10+0.5))*10
            this.returnTemp = this.itemTemp
            console.log(num,'传的没有小数的温度')
          }
        }
    },
    touchend(){
      this.isTouchStart = false
      if (this.isOffline||this.loaclAttr.switchStatus=='off') return
      console.log(this.isMove,'this.isMove')
      if(this.isMove == false) return
      this.controlDevice('temperature',this.returnTemp)
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
    // 设置模式
    setMode(val) {
      if (this.isClose ||this.isOffline) return
      // if (val == 'heat') {
      //   this.count = 26
      // }else{
      //   this.count = 22
      // }
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
      setTimeout(()=>{
        this.isReduceStart = false
        this.isAddStart = false
        this.isReduceEnd = false
        this.isAddEnd = false
      },500)
      let temp = +this.itemTemp + step
      
      // 最小温度
      if (temp < this.MIN_TEMP) {
        if (this.loaclAttr.temperature == this.MIN_TEMP) {
          this.setTemperatureDis = false
          return HdSmart.UI.toast('温度已调至最低')
        } else {
          temp = this.MIN_TEMP
        }
      }
      // 最大温度
      if (temp > this.MAX_TEMP) {
        if (this.loaclAttr.temperature == this.MAX_TEMP) {
          this.setTemperatureDis = false
          return HdSmart.UI.toast('温度已调至最高')
        } else {
          temp = this.MAX_TEMP
        }
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