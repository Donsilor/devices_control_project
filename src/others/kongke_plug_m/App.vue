/* eslint-disable vue/no-unused-vars */
<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline || networkStatus == -1 }, {'close': isClose}, 'page']">
      <NewTopBar
        :title="device.device_name"
        :room="device.room_name"
        :scroll="true"
        bak-color="#000"
        page-class=".page" />
      <StatusTip/>
      <!-- tab切换栏 -->
      <!-- <mt-datetime-picker
        ref="picker"
        v-model="pickerValue"
        :start-hour="openPickerH"
        type="time"
        hour-format="{value} 时"
        minute-format="{value} 分"
      /> -->
      <!-- <div
        class="main center"
        style="margin-top:52px"> -->
      <div
        class="main center">
        <div :class="['bg', {'move': switchValue=='open' && !isOffline && networkStatus != -1}]">
          <div class="circle">

            <div class="dianL"/>
          </div>
          <div class="dianW"/>
          <!-- <i><span/></i> -->
        </div>
        <div class="status">{{ switchValue=='open'?'通电中':'断电中' }}</div>
      </div>
      <!-- <div
        v-if="delayClose.countdownClose && delayClose.closeEnable=='y'"
        class="status1">{{ delayClose.countdownClose | delayTime }}后延时断电</div>
      <div
        v-else-if="delayOpen.countdownOpen && delayOpen.openEnable=='y'"
        class="status1">{{ delayOpen.countdownOpen | delayTime }}后延时通电</div> -->
      <!-- <div
        class="status1">&nbsp;</div> -->
      <div
        class="panel-btn center">
        <div
          class="btn-wrap"
          @click="setSwitch"
          @touchstart ="touchstart('switch')"
          @touchend="touchend('switch')">
          <div
            ref="switch"
            :class="[{ 'btn-source': switchValue == 'close' },{ 'btn-over': switchValue == 'open' && !isOffline && networkStatus != -1} ,'btn btn-source center']" />
            <!-- <div class="btn-name">{{ switchValue=='open'?'断电':'通电' }}</div> -->
        </div>
        <!-- <div
          v-if="(delayOpen.openEnable=='y' && switchValue == 'close') || (delayClose.closeEnable=='y' && switchValue == 'open')"
          class="btn-wrap">
          <div
            :class="[{'progress':timeOutEvent != 0},'btn btn-delay center circleProgress_wrapper']"
            @touchstart="touchStart($event)"
            @touchmove="touchMove($event)"
            @touchend="touchEnd($event)" >
            <div class="wrapper right">
              <div class="circleProgress rightcircle" />
            </div>
            <div class="wrapper left">
              <div class="circleProgress leftcircle" />
            </div>
          </div>
          <div class="btn-name">取消延迟</div>
        </div> -->
        <!-- <div
          v-else-if="switchValue == 'open'"
          class="btn-wrap"
          @click="showTime('设置延时断电')">
          <div :class="['btn btn-delay center']" />
          <div class="btn-name">延时断电</div>
        </div>
        <div
          v-else-if="switchValue == 'close'"
          class="btn-wrap"
          @click="showTime('设置延时通电')">
          <div :class="['btn btn-delay center']" />
          <div class="btn-name">延时通电</div>
        </div> -->

      </div>

      <div class="bottom">
        <div
          v-if="(delayOpen.openEnable=='y' && switchValue == 'close') || (delayClose.closeEnable=='y' && switchValue == 'open')"
          class="timing"
          @click="showMode">
          <div>取消延迟</div>
          <div
            v-if="delayClose.countdownClose && delayClose.closeEnable=='y'"
            class="timing-right">{{ delayClose.countdownClose | delayTime }}后延时断电 </div>
          <div
            v-else-if="delayOpen.countdownOpen && delayOpen.openEnable=='y'"
            class="timing-right">{{ delayOpen.countdownOpen | delayTime }}后延时通电 </div>
        </div>
        <div
          v-else-if="switchValue=='open'"
          class="timing"
          @click="showTime('设置延时断电')">
          <div>延时断电</div>
          <div
            class="timing-right"/>
        </div>
        <div
          v-else-if="switchValue == 'close'"
          class="timing"
          @click="showTime('设置延时通电')">
          <div>延时通电</div>
          <div
            class="timing-right"/>
        </div>
      </div>

      <div class="bottom margin-none">
        <!-- <div
          v-if="switchValue=='open'"
          class="timing"
          @click="showTime('设置断电时间')">
          <div>定时</div>
          <div
            class="timing-right">{{ timer.closeEnable == 'y'?timer.closeTime + ' 断电':'' }}＞ </div>
        </div>
        <div
          v-else
          class="timing"
          @click="showTime('设置通电时间')">
          <div>定时</div>
          <div
            class="timing-right">{{ timer.openEnable == 'y'?timer.openTime + ' 通电':'' }}＞ </div>
        </div> -->
        <!-- <div class="timing">
          <div>定时</div>
          <div
            v-if="switchValue=='open'"
            class="timing-right"
            @click="showTime('设置断电时间')">{{ timer.closeEnable == 'y'?timer.closeTime + ' 断电':'' }}＞ </div>
          <div
            v-else
            class="timing-right"
            @click="showTime('设置通电时间')">{{ timer.openEnable == 'y'?timer.openTime + ' 通电':'' }}＞ </div>
        </div> -->
        <!-- <div class="Charging-protection">
          <div>充电保护</div>
          <div
            style="z-index: 999;"><input
              :checked="ovp"
              :disabled="ovpDisabled"
              class="switch switch-anim"
              type="checkbox"
              @click="lock"></div>
        </div> -->
      </div>
      <!-- 时间选择 -->
      <SelectTime
        ref="time"
        :title="title"
        @selectedTime="setReserve"
        @canceltime="canceltime" />
      <!--取消延时-->
      <model-swing
        ref="swing"
        @setWind="setWind" />
    </div>
  </div>
</template>

<script>
// import Swiper from 'swiper'
import { mapGetters, mapState, mapActions } from 'vuex'
import SelectTime from './components/time.vue'
import modelSwing from './components/model-swing'
export default {
 components: {
    SelectTime,
    modelSwing
  },
  data() {
    return {
      temp:true,
      timeOutEvent:'',
      currentMode:'normal',
      title:"",
      ovp: false,
      ovpDisabled: false,
      switchValue: 'close',
      delayClose: {
        countdownClose: ''
      },
      delayOpen: {
        countdownOpen: ''
      },
      timeOutDelay: '',
      timer: {},
      pickerValue: '',
      openPickerH: 0,
      closeLocalTime: '',
      openLocalTime: '',
      timeValue: ''
    }
  },
  computed: {
    ...mapGetters(['isOffline', 'networkStatus', 'networkStatus']),
    ...mapState(['device', 'deviceAttrs']),
    isClose(){
      return this.switchValue=='close'?true:false
    },
    bakColor(){
      return this.isClose ? '#000' : '#fff'
    },

  },
  watch: {
    'device.stateChange'(){
      this.$nextTick(()=>{
        //  this.newRatio()
      })
    },
    'deviceAttrs'() {
      // this.timer = this.deviceAttrs.timer
      // this.closeLocalTime = this.deviceAttrs.timer.closeTime
      // this.openLocalTime = this.deviceAttrs.timer.openTime
    },
    'deviceAttrs.ovp'() {
      this.ovpDisabled = false
      if(this.deviceAttrs.ovp == 'open') {
        this.ovp = true
      }
      if(this.deviceAttrs.ovp == 'close') {
        this.ovp = false
      }
    },
    'deviceAttrs.switch'() {
      //获取时间格式转换时间戳对比作定时处理，变量局部使用
      if(this.deviceAttrs.timer.openTime) {
        let beforeDate = this.deviceAttrs.timer.openTime.substring(0,10)
        let afterDate = this.deviceAttrs.timer.openTime.substring(11)
        let mergeDate = beforeDate + ' ' + afterDate
        let currentDate = this.getDateTime(new Date(), 'fulltime')
        let returnTimestamp = (new Date(mergeDate.replace(/-/g, "/"))).getTime()
        let currentTimestamp = (new Date(currentDate.replace(/-/g, "/"))).getTime()
        if(returnTimestamp < currentTimestamp) {
          this.timer.openEnable = 'n'
        }
      }
      //获取时间格式转换时间戳对比作定时处理，变量局部使用
      if(this.deviceAttrs.timer.closeTime) {
        let beforeDate = this.deviceAttrs.timer.closeTime.substring(0,10)
        let afterDate = this.deviceAttrs.timer.closeTime.substring(11)
        let mergeDate = beforeDate + ' ' + afterDate
        let currentDate = this.getDateTime(new Date(), 'fulltime')
        let returnTimestamp = (new Date(mergeDate.replace(/-/g, "/"))).getTime()
        let currentTimestamp = (new Date(currentDate.replace(/-/g, "/"))).getTime()
        if(returnTimestamp < currentTimestamp) {
          this.timer.closeEnable = 'n'
        }
      }
      if(this.deviceAttrs.switch == 'open') {
        this.switchValue = 'open'
      }
      if(this.deviceAttrs.switch == 'close') {
        this.switchValue = 'close'
      }
    },
    'deviceAttrs.delayClose.closeTime'() {
      //获取时间格式转换时间戳对比作倒计时处理，变量局部使用
      // if(this.deviceAttrs.delayClose.closeTime) {
      //   let beforeDate = this.deviceAttrs.delayClose.closeTime.substring(0,10)
      //   let afterDate = this.deviceAttrs.delayClose.closeTime.substring(11)
      //   let mergeDate = beforeDate + ' ' + afterDate
      //   let currentDate = this.getDateTime(new Date(), 'fulltime')
      //   let returnTimestamp = (new Date(mergeDate.replace(/-/g, "/"))).getTime()
      //   let currentTimestamp = (new Date(currentDate.replace(/-/g, "/"))).getTime()
      //   if(returnTimestamp > currentTimestamp) {
      //     let timeVal = (returnTimestamp - currentTimestamp) / 1000
      //     this.delayClose.countdownClose = timeVal
      //     this.timeIntDelay('countdownClose')
      //   }
      // }
    },
    'deviceAttrs.delayOpen.openTime'() {
      //获取时间格式转换时间戳对比作倒计时处理，变量局部使用
      // if(this.deviceAttrs.delayOpen.openTime) {
      //   let beforeDate = this.deviceAttrs.delayOpen.openTime.substring(0,10)
      //   let afterDate = this.deviceAttrs.delayOpen.openTime.substring(11)
      //   let mergeDate = beforeDate + ' ' + afterDate
      //   let currentDate = this.getDateTime(new Date(), 'fulltime')
      //   let returnTimestamp = (new Date(mergeDate.replace(/-/g, "/"))).getTime()
      //   let currentTimestamp = (new Date(currentDate.replace(/-/g, "/"))).getTime()
      //   if(returnTimestamp > currentTimestamp) {
      //     let timeVal = (returnTimestamp - currentTimestamp) / 1000
      //     this.delayOpen.countdownOpen = timeVal
      //     this.timeIntDelay('countdownOpen')
      //   }
      // }
    },
    'deviceAttrs.timer.openTime'() {
      //获取时间格式转换时间戳对比作定时处理，变量局部使用
      let beforeDate = this.deviceAttrs.timer.openTime.substring(0,10)
      let afterDate = this.deviceAttrs.timer.openTime.substring(11)
      let mergeDate = beforeDate + ' ' + afterDate
      let currentDate = this.getDateTime(new Date(), 'fulltime')
      let returnTimestamp = (new Date(mergeDate.replace(/-/g, "/"))).getTime()
      let currentTimestamp = (new Date(currentDate.replace(/-/g, "/"))).getTime()
      if(returnTimestamp < currentTimestamp) {
        this.timer.openEnable = 'n'
      }
    },
    'deviceAttrs.timer.closeTime'() {
      //获取时间格式转换时间戳对比作定时处理，变量局部使用
      let beforeDate = this.deviceAttrs.timer.closeTime.substring(0,10)
      let afterDate = this.deviceAttrs.timer.closeTime.substring(11)
      let mergeDate = beforeDate + ' ' + afterDate
      let currentDate = this.getDateTime(new Date(), 'fulltime')
      let returnTimestamp = (new Date(mergeDate.replace(/-/g, "/"))).getTime()
      let currentTimestamp = (new Date(currentDate.replace(/-/g, "/"))).getTime()
      if(returnTimestamp < currentTimestamp) {
        this.timer.closeEnable = 'n'
      }
    }
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
      .then(() => {
        this.timer = this.deviceAttrs.timer
        console.log(this.timer)
        this.closeLocalTime = this.deviceAttrs.timer.closeTime
        this.openLocalTime = this.deviceAttrs.timer.openTime
        if(this.deviceAttrs.delayClose) {
          this.delayClose = Object.assign(this.delayClose, this.deviceAttrs.delayClose)
        }
        if(this.deviceAttrs.delayOpen) {
          this.delayOpen = Object.assign(this.delayOpen, this.deviceAttrs.delayOpen)
        }
        //获取时间格式转换时间戳对比作定时处理，变量局部使用
        if(this.deviceAttrs.timer.openTime) {
          let beforeDate = this.deviceAttrs.timer.openTime.substring(0,10)
          let afterDate = this.deviceAttrs.timer.openTime.substring(11)
          let mergeDate = beforeDate + ' ' + afterDate
          let currentDate = this.getDateTime(new Date(), 'fulltime')
          let returnTimestamp = (new Date(mergeDate.replace(/-/g, "/"))).getTime()
          let currentTimestamp = (new Date(currentDate.replace(/-/g, "/"))).getTime()
          if(returnTimestamp < currentTimestamp) {
            this.timer.openEnable = 'n'
          }
        }
        //获取时间格式转换时间戳对比作定时处理，变量局部使用
        if(this.deviceAttrs.timer.closeTime) {
          let beforeDate = this.deviceAttrs.timer.closeTime.substring(0,10)
          let afterDate = this.deviceAttrs.timer.closeTime.substring(11)
          let mergeDate = beforeDate + ' ' + afterDate
          let currentDate = this.getDateTime(new Date(), 'fulltime')
          let returnTimestamp = (new Date(mergeDate.replace(/-/g, "/"))).getTime()
          let currentTimestamp = (new Date(currentDate.replace(/-/g, "/"))).getTime()
          if(returnTimestamp < currentTimestamp) {
            this.timer.closeEnable = 'n'
          }
        }
        //获取时间格式转换时间戳对比作倒计时处理，变量局部使用
        if(this.deviceAttrs.delayClose.closeEnable == 'y') {
          let beforeDate = this.deviceAttrs.delayClose.closeTime.substring(0,10)
          let afterDate = this.deviceAttrs.delayClose.closeTime.substring(11)
          let mergeDate = beforeDate + ' ' + afterDate
          let currentDate = this.getDateTime(new Date(), 'fulltime')
          let returnTimestamp = (new Date(mergeDate.replace(/-/g, "/"))).getTime()
          let currentTimestamp = (new Date(currentDate.replace(/-/g, "/"))).getTime()
          if(returnTimestamp > currentTimestamp) {
            let timeVal = (returnTimestamp - currentTimestamp) / 1000
            this.delayClose.countdownClose = timeVal
            this.timeIntDelay('countdownClose')
          } else {
            this.delayOpen.openEnable = 'n'
            this.delayClose.closeEnable = 'n'
          }
        }
        //获取时间格式转换时间戳对比作倒计时处理，变量局部使用
        if(this.deviceAttrs.delayOpen.openEnable == 'y') {
          let beforeDate = this.deviceAttrs.delayOpen.openTime.substring(0,10)
          let afterDate = this.deviceAttrs.delayOpen.openTime.substring(11)
          let mergeDate = beforeDate + ' ' + afterDate
          let currentDate = this.getDateTime(new Date(), 'fulltime')
          let returnTimestamp = (new Date(mergeDate.replace(/-/g, "/"))).getTime()
          let currentTimestamp = (new Date(currentDate.replace(/-/g, "/"))).getTime()
          if(returnTimestamp > currentTimestamp) {
            let timeVal = (returnTimestamp - currentTimestamp) / 1000
            this.delayOpen.countdownOpen = timeVal
            this.timeIntDelay('countdownOpen')
          } else {
            this.delayOpen.openEnable = 'n'
            this.delayClose.closeEnable = 'n'
          }
        }
      })
      HdSmart.UI.setStatusBarColor(2)
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    touchstart(val) {
      if(this.isClose && val=='switch') {
        this.$refs[val].classList.add('yellowExtend')
        this.$refs[val].classList.remove('animate')
        this.$refs[val].classList.add('animate1')
        HdSmart.UI.vibrate()
        return
      }
      if(this.isClose||this.isOffline|| this.networkStatus == -1) return
      this.$refs[val].classList.remove('animate')
      this.$refs[val].classList.add('animate1')
      HdSmart.UI.vibrate()
    },
    touchend(val){
      if(this.isClose && val=='switch') {
        this.$refs[val].classList.remove('animate1')
        this.$refs[val].classList.add('animate')
        this.setSwitch()
        return
      }
      if(this.isClose||this.isOffline|| this.networkStatus == -1) return
      this.$refs[val].classList.remove('animate1')
      this.$refs[val].classList.add('animate')
      if(val == 'switch') return this.setSwitch()
    },
    showMode() {
      this.$refs.swing.show = true
    },
    // 取消延时
    setWind() {
      this.longPress()
    },
    // openPicker() {
    //   let time = this.getDateTime(new Date(), 'picker')
    //   this.openPickerH = time + 1
    //   this.$refs.picker.open()
    // },
    // 开关机
    setSwitch(){
      if (this.isOffline|| this.networkStatus == -1) return
      let switchStatus = {}
      if (this.switchValue=='close') {
        switchStatus = {
          "switch": "open"
        }
      }else{
        switchStatus = {
          "switch": "close"
        }
      }
      this.controlDevice('switch',switchStatus)
      .then((res) => {
        if(res.code == 0) {
          // clearInterval(this.timeOutDelay)
          // this.delayClose = {}
          // this.delayOpen = {}
          if(switchStatus.switch == 'open') {
            this.switchValue = 'open'
          }
          if(switchStatus.switch == 'close') {
            this.switchValue = 'close'
          }
        } else {
          HdSmart.UI.toast('操作失败')
        }
      })
      .catch(() => {
        HdSmart.UI.toast('操作失败')
      })
    },
    // tab切换
    tabMode(t){
      this.temp = t
    },
    // 长按事件
    touchStart(){
      this.timeOutEvent=setTimeout(() => {
        this.longPress()
      }, 1000)
    },
    //如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
    touchMove(){
      clearTimeout(this.timeOutEvent)
      this.timeOutEvent=0
    },
    touchEnd(){
      clearTimeout(this.timeOutEvent)//清除定时器
      this.timeOutEvent=0
      // if(this.timeOutEvent!=0){
          // alert("你这是点击，不是长按")
        // this.$refs.black.className.add('active')
      // }
      return false
    },
    longPress(){
      this.timeOutEvent = 0
      // alert('长按了')
      // this.$nextTick(()=>{
        // 删除延时
        let obj = {
          "remove_delay_task": {
            "encrptionFlag": "1000"
          }
        }
        this.controlDevice('remove_time', obj)
        .then((res) => {
          if(this.$refs.swing.show) this.$refs.swing.show = false
          if(res.code == 0) {
            clearTimeout(this.timeOutDelay)
            this.timeOutEvent = 0
            this.delayClose = {}
            this.delayOpen = {}
          } else {
           HdSmart.UI.toast('操作失败')
         }
        })
        .catch(() => {
          HdSmart.UI.toast('操作失败')
        })
        // this.controlDevice('countdownClose',0)
      // })
    },
    // controlDevice(attr, value,params) {
    //   return this.doControlDevice({
    //     nodeid: `kongke_plug.main.${attr}`,
    //     params: {
    //       attribute: {
    //         [attr]: value,
    //         ...params
    //       }
    //     }
    //   })
    // },
    controlDevice(attr, params) {
      return this.doControlDevice({
        nodeid: `kongke_plug.main.${attr}`,
        params: {
          attribute: {
            ...params
          }
        }
      })
    },
    lock(e) {
      this.ovpDisabled = true
      let ovp = ''
      if(e.target.checked){
          ovp = {
            "ovp": "open"
          }
      }else{
          ovp = {
            "ovp": "close"
          }
      }
       this.controlDevice('ovp',ovp)
       .then((res) => {
         if(res.code == 0) {
           if(ovp.ovp == 'open') {
             this.ovp = true
             this.controlDevice('switch',{"switch": "open"})
           }
           if(ovp.ovp == 'close') {
             this.ovp = false
           }
         } else {
           HdSmart.UI.toast('操作失败')
         }
         this.ovpDisabled = false
       })
       .catch(() => {
         this.ovpDisabled = false
         HdSmart.UI.toast('操作失败')
       })
    },
    showTime(v) {
      this.title = v
      // if (this.isClose) return
      this.$refs.time.show = true
    },
    timeIntDelay(val) {
      clearInterval(this.timeOutDelay)
      if(val == 'countdownClose') {
        this.timeOutDelay=setInterval(() => {
        console.log('定时关')
          this.delayClose.countdownClose = this.delayClose.countdownClose - 1
          if(this.delayClose.countdownClose == 0) {
            clearInterval(this.timeOutDelay)
            this.delayClose.closeEnable = 'n'
            this.delayOpen.openEnable = 'n'
          }
        }, 1000)
      }
      if(val == 'countdownOpen') {
        this.timeOutDelay=setInterval(() => {
        console.log('定时开')
          this.delayOpen.countdownOpen = this.delayOpen.countdownOpen - 1
          if(this.delayOpen.countdownOpen == 0) {
            clearInterval(this.timeOutDelay)
            this.delayOpen.openEnable = 'n'
            this.delayClose.closeEnable = 'n'
          }
        }, 1000)
      }
    },
    // 设置关机时间
    setReserve(time) {
      let h = parseInt(time[0].split(':')[0])
      let m = parseInt(time[0].split(':')[1])
      if(this.title=='设置延时断电' || this.title=='设置延时通电'){
        if(this.switchValue === 'open'){
          //延时关
          let obj = {
            "set_delay_task": {
              "openEnable": "false",
              "countdownOpen": h*60+m,
              "closeEnable": "true",
              "countdownClose": h*60+m,
              "repeat": 1,
              "encrptionFlag": '1000'
            }
          }
          this.controlDevice('countdownClose', obj)
          .then((res) => {
            if(res.code == 0) {
              this.delayOpen = {}
              this.delayClose = obj.set_delay_task
              this.delayClose.openEnable = 'n'
              this.delayClose.closeEnable = 'y'
              this.delayClose.countdownClose = this.delayClose.countdownClose * 60
              this.timeIntDelay('countdownClose')
            } else {
              HdSmart.UI.toast('操作失败')
            }
          })
          .catch(() => {
            HdSmart.UI.toast('操作失败')
          })
        } else {
          //延时开
          let obj = {
            "set_delay_task": {
              "openEnable": "true",
              "countdownOpen": h*60+m,
              "closeEnable": "false",
              "countdownClose": h*60+m,
              "repeat": 1,
              "encrptionFlag": '1000'
            }
          }
          this.controlDevice('countdownOpen', obj)
          .then((res) => {
            if(res.code == 0) {
              this.delayClose = {}
              this.delayOpen = obj.set_delay_task
              this.delayOpen.openEnable = 'y'
              this.delayOpen.closeEnable = 'n'
              this.delayOpen.countdownOpen = this.delayOpen.countdownOpen * 60
              this.timeIntDelay('countdownOpen')
            } else {
              HdSmart.UI.toast('操作失败')
            }
          })
          .catch(() => {
            HdSmart.UI.toast('操作失败')
          })
        }
      }else{
        let hours = h < 10 ? '0' + h : h
        let min = m < 10 ? '0' + m : m
        let time = this.getDateTime(new Date()) + '-' + hours + ':' + min + ':' + '00'
        let Htime = this.getDateTime(new Date(), 'h')
        let Mtime = this.getDateTime(new Date(), 'm')
        //获取时间格式转换时间戳对比，作日期选择，变量局部使用
        if(h < Htime) {
          let beforeDate = time.substring(0,10)
          let returnTimestamp = (new Date(beforeDate.replace(/-/g, "/"))).getTime() + 86400000//当天时间戳 + 1 天
          let timeVal = returnTimestamp + (h * (60 * 60 * 1000)) + (m * (60 * 1000))
          this.timeValue = this.getDateTime(new Date(timeVal)) + '-' + hours + ':' + min + ':' + '00'
          HdSmart.UI.toast('当前设定时间为明天')
        } else if(h == Htime) {
          if(m <= Mtime) {
            let beforeDate = time.substring(0,10)
            let returnTimestamp = (new Date(beforeDate.replace(/-/g, "/"))).getTime() + 86400000//当天时间戳 + 1 天
            let timeVal = returnTimestamp + (h * (60 * 60 * 1000)) + (m * (60 * 1000))
            this.timeValue = this.getDateTime(new Date(timeVal)) + '-' + hours + ':' + min + ':' + '00'
            HdSmart.UI.toast('当前设定时间为明天')
          }
        }
        if(this.switchValue === 'close'){
          this.closeLocalTime = this.timeValue?this.timeValue:time
           // 定时开
          let obj1 = {
            "set_time_task": {
              "openEnable": "true",
              "openTime": this.timeValue?this.timeValue:time,
              "closeEnable": "false",
              "closeTime": this.openLocalTime,
              "repeat": "0",
              "timerId": "100",
              "encrptionFlag": "1000",
              "timerEnable": "true"
            }
          }
          this.controlDevice('openTime', obj1)
          .then((res) => {
            if(res.code == 0) {
              this.timer = obj1.set_time_task
              this.timer.openEnable = 'y'
              this.timer.closeEnable = 'n'
              this.timer.timerEnable = 'y'
              this.timeValue = ''
            } else {
              HdSmart.UI.toast('操作失败')
              this.timeValue = ''
            }
          })
          .catch(() => {
            HdSmart.UI.toast('操作失败')
            this.timeValue = ''
          })
        }else{
          this.openLocalTime = this.timeValue?this.timeValue:time
          // 定时关
          let obj2 = {
            "set_time_task": {
              "openEnable": "false",
              "openTime": this.closeLocalTime,
              "closeEnable": "true",
              "closeTime": this.timeValue?this.timeValue:time,
              "repeat": "0",
              "timerId": "100",
              "encrptionFlag": "1000",
              "timerEnable": "true"
            }
          }
           this.controlDevice('closeTime', obj2)
           .then((res) => {
             if(res.code == 0) {
                this.timer = obj2.set_time_task
                this.timer.openEnable = 'n'
                this.timer.closeEnable = 'y'
                this.timer.timerEnable = 'y'
                this.timeValue = ''
              } else {
                HdSmart.UI.toast('操作失败')
                this.timeValue = ''
              }
           })
           .catch(() => {
            HdSmart.UI.toast('操作失败')
            this.timeValue = ''
          })
        }
      }
    },
    // 取消定时
    canceltime(){
      this.controlDevice('remove_time_task', {
        "remove_time_task": {
          "timerId": "100",
          "encrptionFlag" : "1000"
        }
      })
      .then((res) => {
        if(res.code == 0) {
          this.timer = {}
        } else {
          HdSmart.UI.toast('操作失败')
        }
      })
      .catch(() => {
        HdSmart.UI.toast('操作失败')
      })
    },
    getDateTime(date, type) {
      // 时间格式获取
      if (!date) return
      let d = new Date(+date)
      let year = d.getFullYear()
      let month =
        d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
      let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
      let hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
      let minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
      let seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()
      if (type === 'fulltime') {
        return (
          year +
          '-' +
          month +
          '-' +
          day +
          ' ' +
          hours +
          ':' +
          minutes +
          ':' +
          seconds
        )
      } else if (type === 'hms') {
        return hours + ':' + minutes + ':' + seconds
      } else if (type === 'h') {
        return hours
      } else if (type === 'm') {
        return minutes
      } else if (type === 's') {
        return seconds
      } {
        return year + '-' + month + '-' + day
      }
    }
  }
}
</script>
<style lang="less" scoped>
@imgPath: 'base/new_curtains/assets';
@imgPath1: 'base/dishwasher/assets';
@imgPath2: 'base/kongke_plug/assets';
@imgPath3: 'base/honghan_switch/assets';
@imgPath4: 'base/oakes_air_condition/assets';
* { touch-action: pan-y; }
@keyframes circleRoate{
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes progress-bar{
  0% {
      transform: rotate(260deg);
      border: 3px solid transparent;
  }
  100% {
      transform: rotate(358deg);
      border: 3px solid rgba(0, 0, 0, 1);
  }
}
// .body {
  // min-height: 100%;
// }
.page {
  // height: 100vh;
  // min-height: 550px;
  // overflow-x: hidden;
  // position: relative;
  // background-image: url('~@lib/@{imgPath3}/bg02.png');
  // background-size: 100% 100%;
  &::before{
    content: "";
    background-image: url('~@lib/@{imgPath3}/bg02.png');
    background-repeat:no-repeat;
    background-size: 100% 100%;
    position: fixed;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }
  .switch {
    width: 74px;
    height: 28px;
    position: relative;
    border: 1px solid transparent;
    // background-color: #fdfdfd;
    box-shadow: #dfdfdf 0 0 0 0 inset;
    border-radius: 20px;
    background-clip: content-box;
    display: inline-block;
    -webkit-appearance: none;
    user-select: none;
    outline: none;
    background-color: rgba(0, 0, 0, 0.1);
  }
  .switch:before {
      content: '';
      width: 40px;
      height: 40px;
      position: absolute;
      top: -8px;
      left: 0;
      border-radius: 20px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
      background: #7F7F7F;
  }
  .switch:checked {
      border-color: #E1B96E;
      box-shadow: #E1B96E 0 0 0 16px inset;
      background-color: #E1B96E;
  }
  .switch:checked:before {
      left: 30px;
      background: #000000;
  }
  .switch.switch-anim {
      transition: border cubic-bezier(0, 0, 0, 1) 0.4s, box-shadow cubic-bezier(0, 0, 0, 1) 0.4s;
  }
  .switch.switch-anim:before {
      transition: left 0.3s;
  }
  .switch.switch-anim:checked {
      // box-shadow: #64bd63 0 0 0 16px inset;
      // background-color: #64bd63;
      transition: border ease 0.4s, box-shadow ease 0.4s, background-color ease 1.2s;
  }
  .switch.switch-anim:checked:before {
      transition: left 0.3s;
  };
  .bottom{
    width: 100%;
    z-index: 999;
    margin-top: 60px;
    &.margin-none {
      height: 20px;
      margin-top: 0;
      margin-bottom: 20px;
      .timing {
        border-top: none;
      }
    }
    .timing,.Charging-protection{
      z-index: 999;
      padding: 0 40px;
      display: flex;
      justify-content: space-between;
      font-family: PingFangSC-Regular;
      font-size: 32px;
      color: #000000;
      height: 120px;
      line-height: 120px;
      border-top: 1px rgba(0, 0, 0, .1) solid;
      border-bottom: 1px rgba(0, 0, 0, .1) solid;
      font-weight: lighter;
    }

  }
  .main {
    margin-top: 63px;
    position: relative;
    .bg{
      width: 580px;
      height: 580px;
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.1);
      position: relative;
      &.move {
        animation:circleRoate 3s infinite linear;
      }
      .dianW {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background:#CCCCCC;
        margin: -10px auto 0px;
      }
      // i {
      //   width: 580px;
      //   height: 580px;
      //   position: absolute;
      //   animation:circleRoate 5s infinite linear;
      //   span {
      //     position: absolute;
      //     left: 280px;
      //     top: -10px;
      //     width: 20px;
      //     height: 20px;
      //     border-radius: 50%;
      //     background:#ff6200;
      //   }
      // }
      .circle{
        width: 500px;
        height: 500px;
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, 0.1);
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -250px ;
        margin-top: -250px ;
        .dianL {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background:#CCCCCC;
          margin: -10px auto 0px;
          position: absolute;
          bottom: -10px;
          left: 48%;
        }
      }
      // .status{
      //   width: 420px;
      //   height: 420px;
      //   border-radius: 50%;
      //   // border: 1px solid rgba(0, 0, 0, 0.1);
      //   position: absolute;
      //   top: 50%;
      //   left: 50%;
      //   margin-left: -210px ;
      //   margin-top: -210px ;
      //   font-size: 100px;
      //   text-align: center;
      //   line-height: 420px;
      //   font-weight: lighter;
      // }
    }
    .status{
        width: 420px;
        height: 420px;
        border-radius: 50%;
        // border: 1px solid rgba(0, 0, 0, 0.1);
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -210px ;
        margin-top: -210px ;
        font-size: 100px;
        text-align: center;
        line-height: 420px;
        font-weight: lighter;
      }
  }
  .status1{
    font-size: 28px;
    text-align: center;
    line-height: 28px;
    // margin-top: 52px;
    position: relative;
    top: 40px;
  }
  .closed{
    font-size: 48px;
    text-align: center;
    margin-top: 240px;
  }
  .circleProgress_wrapper {
    width: 120px;
    height: 120px;
    margin: 50px auto;
    position: relative;
    // &.recharge {
    //   &::before{
    //     background-image: url('~@lib/@{imgPath}chongdianzhong.png');
    //   }
    // }
    .wrapper {
      width: 60px;
      height: 120px;
      position: absolute;
      top: 0;
      overflow: hidden;
    }
    .right {
      right: -1px;
    }

    .left {
      left: -1px;
    }

    .circleProgress {
      box-sizing: border-box;
      width: 120px;
      height: 120px;
      border: 1px solid transparent;
      border-radius: 50%;
      position: absolute;
      top: -1px;
    }
    &.progress {
      .rightcircle {
        border-top: 1px solid #000;
        border-right: 1px solid #000;
        right: 0;
        animation: circleRight 1s linear infinite;
      }
      .leftcircle {
        border-bottom: 1px solid #000;
        border-left: 1px solid #000;
        left: 0;
        animation: circleLeft 1s linear infinite;
      }
      // &::before {
      //   background-image: url('~@lib/@{imgPath}chongdianzhong.png');
      // }
    }
    @keyframes circleRight {
      0% {
        -webkit-transform: rotate(225deg);
      }

      50%,
      100% {
        -webkit-transform: rotate(405deg);
      }
    }

    @keyframes circleLeft {
      0%,
      50% {
        -webkit-transform: rotate(225deg);
      }

      100% {
        -webkit-transform: rotate(405deg);
      }
    }
  }
  .panel-btn {
    height: auto;
    width: 100%;
    margin-top: 232px;
    position:relative;
    z-index: 9999;
  .btn-wrap {
    margin: 0 24px 0;
    .btn {
      box-sizing: border-box;
      margin: 0 auto;
      width: 132px;
      height: 132px;
      // border: 1px solid #818181;
      border-radius: 50%;
      display: flex;
      justify-content: space-around;
      flex-direction: column;
      position: relative;
      &::before {
        position: relative;
        z-index: 100;
      }
      &.btn-source{
        background: rgba(0,0,0,0.05);
        &::before{
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          margin-left: -24px;
          margin-top: -24px;
          background-image: url('~@lib/@{imgPath4}/dakai3@2x.png');
          background-size: 100% 100%;
          width: 48px;
          height: 48px;
        }
      }
      &.btn-over{
        background-image: linear-gradient(221deg, #F1CB85 10%, #E1B96E 81%);
        &::before{
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          margin-left: -24px;
          margin-top: -24px;
          background-image: url('~@lib/@{imgPath4}/dakai3@2x.png');
          background-size: 100% 100%;
          width: 48px;
          height: 48px;
        }
      }
       &.btn-delay{
        &::before{
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          margin-left: -24px;
          margin-top: -24px;
          background-image: url('~@lib/@{imgPath2}/yanshi.png');
          background-size: 100% 100%;
          width: 48px;
          height: 48px;
        }
      }
      &::before {
        content: "";
        display: block;
        width: 48px;
        height: 48px;
      }
      &.active {
        background: #000;
      }
    }
    .btn-name {
      text-align: center;
      color: #000;
      margin-top: 16px;
      font-size: 24px;
    }
  }
    &.center{
      display: flex;
      align-items: center;
    }
  }
  /*********** 按钮 ***********/
  .btn-wrap {
    margin: 0 34px 40px;
    position: relative;
    .progressBar {
      &::before{
        content: "";
        display: block;
        width: 200px;
        height: 200px;
        border-radius: 50%;
        position: absolute;
        top: -30px;
        left: -23%;
        // transform: translateX(-50%) rotate(260deg);
        border: 3px solid rgba(0, 0, 0, 1);
        clip: rect(0px 200px 40px 0px);
        animation: progress-bar 1s linear infinite;
      }
    }
    .btn {
      box-sizing: border-box;
      margin: 0px auto;
      width: 140px;
      height: 140px;
      border-radius: 50%;

      display: flex;
      flex-direction: column;
      &.btn-over{
        &.active{
          background:#000;
        }
      }
      &::before {
        content: "";
        display: block;
        width: 48px;
        height: 48px;
      }
      &.active {
        &.btn-start::before{
          background-image: url('~@lib/@{imgPath1}/zanting.png');
          background-size: 100% 100%;
          width: 88px;
          height: 102px;
        }
        &.btn-over::before{
          background-image: url('~@lib/@{imgPath1}/jieshu2.png');
          background-size: 100% 100%;
          width: 96px;
          height: 96px;
        }
      }
    }
    .btn-name {
      text-align: center;
      color: #000;
      margin-top: 16px;
      font-size: 28px;
      line-height: 40px;
      // opacity: .5;
    }

    .btn-over {
      &::before {
        background-image: url('~@lib/@{imgPath1}/jieshu.png');
        background-size: 100% 100%;
        width: 96px;
        height: 96px;
      }
    }
    .btn-start {
      &::before {
        background-image: url('~@lib/@{imgPath1}/qidong@2x.png');
        background-size: 100% 100%;
        width: 88px;
        height: 102px;
      }
    }
    }
  }
  &.offline {
    overflow: hidden;
     &:before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      // z-index: 999;
      width: 100%;
      opacity: 0.5;
    }
  }
  &.close,
  &.offline {
    // &:before {
    //   content: "";
    //   position: fixed;
    //   top: 64PX;
    //   left: 0;
    //   bottom: 0;
    //   right: 0;
    //   z-index: 999;
    //   width: 100%;
    //   background: rgba(0, 0, 0, 0.1);
    // }
    &.page {
      ul{
        li{
          opacity: 0;
        }
      }
      .swiper-container{
        opacity: .2;
      }
      .swiper-container1{
        opacity: .2;
      }
    }
    .btn-wrap {
      &.up-index {
        opacity: 1;
        .btn-open{
          z-index:9999;
        }
      }
      .btn {
        &.active {
           &.active {
        background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
        border-color: #ffbf00;
      }
        }

      }
    }

  }
  .timing-right{
      position: relative;
      z-index: 999;
      &::after {
        content: "";
        display: inline-block;
        background-image: url('~@lib/@{imgPath3}/arrow_in.png');
        background-size: 100% 100%;
        width: 32px;
        height: 32px;
        position: relative;
        top: 2px;
      }
    }
.animate::before{
  animation: scale 0.3s;
}
.animate1::before{
  animation: scale1 0.15s;
  animation-fill-mode : forwards;
}
@keyframes scale1 {
  0%{
    transform: scale(1);
  }
  100%{
    transform: scale(0.6);
  }
}
@keyframes scale {
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
      background-image: linear-gradient(221deg, #F1CB85 10%, #E1B96E 81%);
      top: 50%;
      left: 50%;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: yellowExtendAnimate .15s 1;
      animation-fill-mode: forwards;
      animation-timing-function: ease-out;
      z-index: 99
    }
  }
  @keyframes yellowExtendAnimate {
    0% {width: 0%;height: 0%;}

    100% {width: 100%;height: 100%;}
  }
</style>
