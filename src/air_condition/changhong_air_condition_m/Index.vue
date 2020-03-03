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
          <!-- 当不可调节温度时，显示这个盒子，可以挡着canvas，使它不能滑动 -->
          <div 
            v-if="deviceAttrs.mode=='wind'||deviceAttrs.mode=='auto'||deviceAttrs.mode=='dehumidify'" 
            class="cover"
            @touchmove.prevent/>
          <!-- 温度圆环 -->
          <div 
            class="container" 
            @touchmove="touchmove($event)">
            <div 
              v-for="(item, index) in count" 
              :key="index" 
              :style="{transform: `rotate(${7*index-105}deg)`}" 
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
                  :style="{background: 2*(itemTemp/10)-33>=index?calculateBg(index):'rgba(255,255,255,0.1)'}" 
                  class="item"/>
              </div>
            </div>
            
            <div
              v-if="isOffline|| deviceAttrs.switchStatus == 'off'||deviceAttrs.mode=='wind'"
              ref="tm"
              class="tm">-- <sup>°C</sup></div>
            <div
              v-else
              ref="tm"
              class="tm">{{ itemTemp | filterTm }}<sup 
                ref="sup" 
                :style="{right: itemTemp ==319 ? -20+'px':8+'px'}">°C</sup>
            </div>
            <div
              v-show="!isOffline&& deviceAttrs.switchStatus == 'on'"
              :class="[deviceAttrs.mode, 'c-mode']">室内温度{{ deviceAttrs.env_temperature | filterTm }}℃</div>
            <div
              v-show="isOffline||deviceAttrs.switchStatus == 'off'"
              :class="[deviceAttrs.mode, 'c-mode']">室内温度--℃</div>
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
              :class="[deviceAttrs.mode,speedClass,'btn center']" />
            <div class="btn-name">{{ speedTxt }}</div>
          </div>
        </div>
        <!-- 强劲 -->
        <div 
          v-show="deviceAttrs.mode=='cold'||deviceAttrs.mode=='heat'" 
          class="bottom">
          <div class="Charging-protection">
            <div>强力</div>
            <div
              style="z-index: 100;">
              <input
                :class="[deviceAttrs.mode,'switch switch-anim']"
                :checked="deviceAttrs.strong_wind=='on'"
                :disabled="disabledLock"
                type="checkbox"
                @click="checkSwitch('strong_wind')">
            </div>
          </div>
        </div>
        <!-- 上下风 -->
        <div class="bottom">
          <div class="Charging-protection">
            <div>上下风</div>
            <div
              style="z-index: 100;">
              <input
                :class="[deviceAttrs.mode,'switch switch-anim']"
                :checked="deviceAttrs.wind_up_down=='on'"
                :disabled="disabledLock"
                type="checkbox"
                @click="checkSwitch('wind_up_down')">
            </div>
          </div>
        </div>
        <!-- 左右风 -->
        <div class="bottom">
          <div class="Charging-protection">
            <div>左右风</div>
            <div
              style="z-index: 100;">
              <input
                :class="[deviceAttrs.mode,'switch switch-anim']"
                :checked="deviceAttrs.wind_left_right=='on'"
                :disabled="disabledLock"
                type="checkbox"
                @click="checkSwitch('wind_left_right')">
            </div>
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
const [MIN_TEMP, MAX_TEMP] = [160, 319]
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
      count: 31,
      now: 0,
      idNum:0,
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
      itemTemp:'',//最终请求的温度
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
        default:
          return ''
      }
    }
  },
  watch: {
    "device.stateChange"(){
      if(!this.moveEnd){}
      // this.draw(`${0.125+0.053*(this.deviceAttrs.temperature/10-16)}`)
    },
       'deviceAttrs.temperature'() {
      if(this.deviceAttrs.temperature) {
        this.setTemperatureDis = false
        // 当返回的温度发生变化时，将温度值赋给itemTemp
        this.itemTemp = this.deviceAttrs.temperature
        // if (this.itemTemp=='319') {
        //   this.$refs.sup.style.right = -20 +'px'
        // }else{
        //   this.$refs.sup.style.right = 12 +'px'
        // }
      }
    },
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
        .then(() => {
          this.itemTemp = this.deviceAttrs.temperature
        })
      HdSmart.UI.setStatusBarColor(2)
    })
  },
  mounted(){
        var barPie__ring__item = document.querySelectorAll('.barPie__ring__item')
    for(let i=0;i<barPie__ring__item.length;i++){
      barPie__ring__item[i].style.transform = `rotate(${7.5*i}deg)`
    }
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    // 温度圆环
      calculateBg(index){
          let color = ''
          if(this.deviceAttrs.switchStatus=='off'){
            color = 'rgba(255,255,255,0.1)'
            return
          }
          if(this.deviceAttrs.mode=='cold'){
            // 制冷模式时的温度颜色
            if (index < 10) {
                color = '#327fdb'
            }else if (index > 20) {
                color = '#20c6ae'
            }else {
                color = `linear-gradient(to right, #327fdb 0%, #28a9c3 ${200-10*index}%, #20c6ae 100%)`
            }
            // console.log(index,'index00000000')
            return color
          }else if(this.deviceAttrs.mode=='heat'){
            // 制热模式时的温度颜色
            if (index < 10) {
                color = '#F9BB6B '
            }else if (index > 20) {
                color = '#EF6D5E'
            }else {
                color = `linear-gradient(to right, #F9BB6B 0%, #ff7524 ${200-10*index}%, #EF6D5E  100%)`
            }
            console.log(index,'index00000000')
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
            console.log(index,'index00000000')
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
      if (this.deviceAttrs.mode=='auto'||this.deviceAttrs.mode=='dehumidify'||this.deviceAttrs.mode=='wind') {
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
        if (this.idNum==30) {
          this.itemTemp = 319
          return
        }else{
          // 滑动的梯子的index和温度之间的关系式
          this.itemTemp = (0.5*this.idNum+16)*10
          var num = this.itemTemp + ""
          console.log(num.lastIndexOf("5"),num,'this.itemTemp未处理之前的温度')
        }
        // 如果最后一位数字是5，则往前进1
        if (num.lastIndexOf("5")==2) {
          this.itemTemp +=5
          console.log('进来了啦啦啦啦啦啦啦啦啦')
          console.log(this.itemTemp,'最终传给后台的温度')   
        }
      }
    },
    touchend(){
      if (this.deviceAttrs.mode=='auto'||this.deviceAttrs.mode=='dehumidify'||this.deviceAttrs.mode=='wind') {
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
    setSwitch(val){
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

      // 送风模式不能设置温度
      if (this.deviceAttrs.mode === 'wind'||this.deviceAttrs.mode === 'auto'||this.deviceAttrs.mode === 'dehumidify') {
        this.setTemperatureDis = false
        return HdSmart.UI.toast('该模式不支持温度调节')
      }
      let temp
      if (this.deviceAttrs.temperature==319) {
        temp = +this.deviceAttrs.temperature+1 + step
      }else{
        temp = +this.deviceAttrs.temperature + step
      }
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
        width: 100%;
        // height: 800px;
        height: 370px;
        margin: 20px auto;
        border: 1px solid #000;
        position: relative;
    }
    .item-container {
        width: 10px;
        height: 270px;
        position: absolute;
        left: 50%;
        top: 0;
        transform-origin: 50% 100%;
        // -webkit-clip-path: polygon(100% 0,75% 100%, 25% 100%, 0 0);
        // clip-path: polygon(100% 0,75% 100%, 25% 100%, 0 0);
        z-index: 99;
    }
    .items{
      width: 32px;
      height: 270px;
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
</style>