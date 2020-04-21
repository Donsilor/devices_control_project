/*
 * @Author: Hykleri
 * @Date: 2020-01-06 10:25:00
 * @Last Modified by: Hykleri
 * @Last Modified time: 2020-04-21 15:56:26
 */
<template>
  <div
    class="body">
    <div :class="[{ 'offline': isOffline }, 'page']">
      <newtopbar
        :reset="true"
        :title="device.device_name"
        :room="device.room_name"
        :scroll="true"
        bak-color="#000"
        page-class=".page" />
      <StatusTip @OfflineHelpPage="OfflineHelpPage"/>
      <!-- 主体部分 -->
      <div
        v-if="load"
        class="main">
        <div class="headline">{{ titleName == '洗便烘干' ? '洗便烘干' : titleName == '妇洗烘干' ? '妇洗烘干' : headline }}</div>
        <div
          v-show="headline == '准备就绪'"
          :class="['subheading', {'isMin': isMin}]">
          <div class="subheading_tips">风温 | {{ wind_temperatureTitle }}</div>
          <div class="subheading_tips margin-tips">水温 | {{ water_temperatureTitle }}</div>
          <div class="subheading_tips">座温 | {{ seat_temperatureTitle }}</div>
        </div>
        <div
          v-show="headline != '准备就绪' && combination == '洗便妇洗' && oneFlagToilet == false && oneFlagWoman == false"
          :class="['subheading', {'isMin': isMin}]">
          <div
            :class="['subheading_tips', 'stateless', {'stateful': (headline == '正在洗便' || headline == '正在妇洗') && combination == '洗便妇洗'}]">{{ titleName == '洗便烘干' ? '洗便' : '妇洗' }}</div>
          <div class="subheading_tips tips-margin stateless">——</div>
          <div
            :class="['subheading_tips', 'stateless', {'stateful': headline == '正在冲水' && combination == '洗便妇洗'}]"> 冲水</div>
          <div class="subheading_tips tips-margin stateless">——</div>
          <div
            :class="['subheading_tips', 'stateless', {'stateful': headline == '正在烘干' && combination == '洗便妇洗'}]"> 烘干</div>
        </div>
        <div
          v-show="headline != '准备就绪' && combination != '洗便妇洗'"
          :class="['subheading', {'isMin': isMin}]">
          <div class="subheading_tips-big">{{ headline.slice(2) }}</div>
        </div>
      </div>

      <!-- 冲水动画 -->
      <div
        v-if="load"
        v-show="headline == '正在冲水'"
        class="box center">
        <div
          :class="['fox', {'isStart': isStart}]">
          <div class="wave wave1"/>
          <div class="wave wave2"/>
          <div class="wave wave3"/>
        </div>

      </div>

      <!-- 按钮 -->
      <div
        v-if="load"
        v-show="headline == '准备就绪'"
        class="panel-btn center">
        <div
          class="btn-wrap"
          @click ="touchstart('toilet_wash')">
          <div
            ref="toilet_wash"
            :class="[{ 'active': deviceAttrs.toilet_wash == 'true' }, 'btn-cold btn center']"/>
          <div class="btn-name">洗便</div>
        </div>

        <div
          class="btn-wrap"
          @click ="touchstart('woman_wash')">
          <div
            ref="woman_wash"
            :class="[{ 'active': deviceAttrs.woman_wash == 'true' }, 'btn btn-freeze center']" />
          <div class="btn-name">妇洗</div>
        </div>

        <div
          class="btn-wrap"
          @click ="touchstart('dry')">
          <div
            ref="dry"
            :class="[ { 'active': deviceAttrs.dry == 'true' }, 'btn btn-auto center']" />
          <div class="btn-name">烘干</div>
        </div>

        <div
          class="btn-wrap"
          @click ="touchstart('flushing')">
          <div
            ref="flushing"
            :class="[ { 'active': deviceAttrs.flushing == 'true' }, 'btn btn-holiday center']" />
          <div class="btn-name">冲水</div>
        </div>
      </div>
      <div
        v-if="load"
        v-show="headline == '准备就绪'"
        class="panel-btn center">
        <div
          ref="auto_toilet_wash"
          class="btn-wrap-ellipse"
          @click="touchstart('auto_toilet_wash')"
        >
          <div
            :class="['btn-ellipse']"/>
          <div class="btn-name">洗便烘干</div>
        </div>

        <div
          ref="auto_woman_wash"
          class="btn-wrap-ellipse"
          @click="touchstart('auto_woman_wash')"
        >
          <div :class="['btn-ellipse icon']" />
          <div class="btn-name">妇洗烘干</div>
        </div>
      </div>

      <!-- 菜单选择 -->
      <div
        v-if="load"
        class="footer">
        <div
          v-show="headline == '正在烘干' || headline == '准备就绪'"
          class="line"/>
        <div
          v-show="headline == '正在烘干' || headline == '准备就绪'"
          class="footer-line">
          <div class="footer-title">风温</div>
          <div class="footer-nav">
            <div
              :class="['footer-nav-btn', {'active': deviceAttrs.wind_temperature == '00'}]"
              @click="wind_temperature('00')">关</div>
            <div
              :class="['footer-nav-btn', {'active': deviceAttrs.wind_temperature == '01'}]"
              @click="wind_temperature('01')">低</div>
            <div
              :class="['footer-nav-btn', {'active': deviceAttrs.wind_temperature == '02'}]"
              @click="wind_temperature('02')">中</div>
            <div
              :class="['footer-nav-btn', {'active': deviceAttrs.wind_temperature == '03'}]"
              @click="wind_temperature('03')">高</div>
          </div>
        </div>
        <div
          v-show="headline == '正在妇洗' || headline == '正在洗便' || headline == '准备就绪'"
          class="line"/>
        <div
          v-show="headline == '正在妇洗' || headline == '正在洗便' || headline == '准备就绪'"
          class="footer-line">
          <div class="footer-title">水温</div>
          <div class="footer-nav">
            <div
              :class="['footer-nav-btn', {'active': deviceAttrs.water_temperature == '00'}]"
              @click="water_temperature('00')">关</div>
            <div
              :class="['footer-nav-btn', {'active': deviceAttrs.water_temperature == '01'}]"
              @click="water_temperature('01')">低</div>
            <div
              :class="['footer-nav-btn', {'active': deviceAttrs.water_temperature == '02'}]"
              @click="water_temperature('02')">中</div>
            <div
              :class="['footer-nav-btn', {'active': deviceAttrs.water_temperature == '03'}]"
              @click="water_temperature('03')">高</div>
          </div>
        </div>
        <div
          v-show="headline == '准备就绪'"
          class="line"/>
        <div
          v-show="headline == '准备就绪'"
          class="footer-line">
          <div class="footer-title">座温</div>
          <div class="footer-nav">
            <div
              :class="['footer-nav-btn', {'active': deviceAttrs.seat_temperature == '00'}]"
              @click="seat_temperature('00')">关</div>
            <div
              :class="['footer-nav-btn', {'active': deviceAttrs.seat_temperature == '01'}]"
              @click="seat_temperature('01')">低</div>
            <div
              :class="['footer-nav-btn', {'active': deviceAttrs.seat_temperature == '02'}]"
              @click="seat_temperature('02')">中</div>
            <div
              :class="['footer-nav-btn', {'active': deviceAttrs.seat_temperature == '03'}]"
              @click="seat_temperature('03')">高</div>
          </div>
        </div>
        <div
          v-show="headline == '正在妇洗' || headline == '正在洗便' || headline == '准备就绪'"
          class="line"/>
        <div
          v-show="headline == '正在妇洗' || headline == '正在洗便' || headline == '准备就绪'"
          class="footer-line">
          <div class="footer-title">清洗水压</div>
          <div class="footer-nav">
            <div
              :class="['footer-nav-btn', {'active': deviceAttrs.hydraulic_pressure == '01'}]"
              @click="hydraulic_pressure('01')">弱</div>
            <div
              :class="['footer-nav-btn', {'active': deviceAttrs.hydraulic_pressure == '02'}]"
              @click="hydraulic_pressure('02')">中</div>
            <div
              :class="['footer-nav-btn', {'active': deviceAttrs.hydraulic_pressure == '03'}]"
              @click="hydraulic_pressure('03')">强</div>
          </div>
        </div>
        <div
          v-show="headline == '正在妇洗' || headline == '正在洗便' || headline == '准备就绪'"
          class="line"/>
        <div
          v-show="headline == '正在妇洗' || headline == '正在洗便' || headline == '准备就绪'"
          class="footer-line">
          <div class="footer-title">出水位置</div>
          <div class="footer-nav">
            <div
              :class="['footer-nav-btn', {'active': deviceAttrs.spray_gun == '03'}]"
              @click="spray_gun('03')">前</div>
            <div
              :class="['footer-nav-btn', {'active': deviceAttrs.spray_gun == '02'}]"
              @click="spray_gun('02')">中</div>
            <div
              :class="['footer-nav-btn', {'active': deviceAttrs.spray_gun == '01'}]"
              @click="spray_gun('01')">后</div>
          </div>
        </div>
        <div
          v-show="headline == '正在妇洗' || headline == '正在洗便' || headline == '准备就绪'"
          class="line"/>
        <div
          v-show="headline == '正在妇洗' || headline == '正在洗便' || headline == '准备就绪'"
          class="footer-line">
          <div class="footer-title">按摩模式</div>
          <input
            :checked="massageVal"
            :disabled="massageDisabled"
            class="switch switch-anim"
            type="checkbox"
            @click="massage">
        </div>
        <div
          v-show="headline == '准备就绪'"
          class="line"/>
        <div
          v-show="headline == '准备就绪'"
          class="footer-line">
          <div class="footer-title">夜灯</div>
          <input
            :checked="night_lightVal"
            :disabled="night_lightDisabled"
            class="switch switch-anim"
            type="checkbox"
            @click="night_light">
        </div>
        <div
          v-show="headline == '准备就绪'"
          class="line"/>
        <div
          v-show="headline == '准备就绪'"
          class="footer-line">
          <div class="footer-title">自动冲水</div>
          <input
            :checked="auto_flushingVal"
            :disabled="auto_flushingDisabled"
            class="switch switch-anim"
            type="checkbox"
            @click="auto_flushing">
        </div>
        <div
          v-show="headline != '正在冲水' && oneFlagToilet == false && oneFlagWoman == false"
          class="line"/>
      </div>

      <!-- 停止按钮 -->
      <div
        v-if="load"
        v-show="headline != '准备就绪' && headline != '正在冲水'"
        class="panel-btn center stop">
        <div
          class="btn-wrap"
          @click ="touchstart('stop')">
          <div
            ref="stop"
            :class="[{ 'active': deviceAttrs.stop == 'true' }, 'btn-stop btn center']"/>
          <div class="btn-name">停止</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      massageVal: false,
      night_lightVal: false,
      auto_flushingVal: false,
      massageDisabled: false,
      night_lightDisabled: false,
      auto_flushingDisabled: false,
      headline: '准备就绪',
      combination: '',
      flag: false,
      judge: '',
      monitor: true,
      time1: '',
      time2: '',
      time3: '',
      titleName: '',
      oneFlagToilet: false,
      oneFlagWoman: false,
      isMin: false,
      isStart: false,
      noOne: false,
      load: false,
    }
  },
  computed: {
    ...mapGetters(['isOffline']),
    ...mapState(['device', 'deviceAttrs']),
    wind_temperatureTitle() {
      /* eslint-disable no-unreachable */
      switch (this.deviceAttrs.wind_temperature) {
        case '00':
          return '关'
          break
        case '01':
          return '低'
          break
        case '02':
          return '中'
          break
        case '03':
          return '高'
          break
        default:
          return ''
      }
    },
    water_temperatureTitle() {
      /* eslint-disable no-unreachable */
      switch (this.deviceAttrs.water_temperature) {
        case '00':
          return '关'
          break
        case '01':
          return '低'
          break
        case '02':
          return '中'
          break
        case '03':
          return '高'
          break
        default:
          return ''
      }
    },
    seat_temperatureTitle() {
      /* eslint-disable no-unreachable */
      switch (this.deviceAttrs.seat_temperature) {
        case '00':
          return '关'
          break
        case '01':
          return '低'
          break
        case '02':
          return '中'
          break
        case '03':
          return '高'
          break
        default:
          return ''
      }
    },
  },
  watch: {
    'device.stateChange'() {
      if(this.deviceAttrs.reset == 'true') {
        HdSmart.UI.toast('该设备已被复位，请删除设备后重新添加')
      }
      this.flag = false
      if(this.deviceAttrs.auto_toilet_wash == 'false') {
        this.oneFlagToilet = false
      }
      if(this.deviceAttrs.auto_woman_wash == 'false') {
        this.oneFlagWoman = false
      }
      if(this.deviceAttrs.auto_toilet_wash == 'false' && this.deviceAttrs.auto_woman_wash == 'false') {
        console.log('双false进来了')
        this.noOne = true
        clearTimeout(this.time1)
        clearTimeout(this.time2)
        clearTimeout(this.time3)
        this.titleName = ''
        this.combination = ''
      }
      // if(this.monitor == true) {
        if(this.deviceAttrs.toilet_wash == 'true') {
          this.headline = '正在洗便'
        } else if(this.deviceAttrs.woman_wash == 'true') {
          this.headline = '正在妇洗'
        } else if(this.deviceAttrs.dry == 'true') {
          this.headline = '正在烘干'
        } else if(this.deviceAttrs.flushing == 'true') {
          this.headline = '正在冲水'
        } else  if(this.deviceAttrs.auto_toilet_wash == 'true') {
          this.combination = '洗便妇洗'
        } else if(this.deviceAttrs.auto_woman_wash == 'true') {
          this.combination = '洗便妇洗'
        } else {
          this.headline = '准备就绪'
          this.titleName = ''
          this.combination = ''
        }
      // }

      if(this.deviceAttrs.massage) {
        this.massageVal = this.deviceAttrs.massage == 'true' ? true : false
      }
      if(this.deviceAttrs.night_light) {
        this.night_lightVal = this.deviceAttrs.night_light == 'true' ? true : false
      }
      if(this.deviceAttrs.auto_flushing) {
        this.auto_flushingVal = this.deviceAttrs.auto_flushing == 'true' ? true : false
      }
      // 坐落检测
      if(this.judge == 'toilet_wash') {
        if(this.deviceAttrs.toilet_wash == 'false') HdSmart.UI.toast('请先落座')
      } else if(this.judge == 'woman_wash') {
        if(this.deviceAttrs.woman_wash == 'false') HdSmart.UI.toast('请先落座')
      } else if(this.judge == 'dry') {
        if(this.deviceAttrs.dry == 'false') HdSmart.UI.toast('请先落座')
      } else if(this.judge == 'auto_toilet_wash') {
        if(this.deviceAttrs.auto_toilet_wash == 'false') HdSmart.UI.toast('请先落座')
      } else if(this.judge == 'auto_woman_wash') {
        if(this.deviceAttrs.auto_woman_wash == 'false') HdSmart.UI.toast('请先落座')
      }
      this.judge = ''
    },
    'deviceAttrs.massage'() {
      this.massageDisabled = false
    },
    'deviceAttrs.night_light'() {
      this.night_lightDisabled = false
    },
    'deviceAttrs.auto_flushing'() {
      this.auto_flushingDisabled = false
    },
    'deviceAttrs.auto_woman_wash'() {
      if(this.deviceAttrs.auto_woman_wash == 'true' && this.noOne == true) {
        this.startAuto_woman_wash()
      }
    },
    'deviceAttrs.auto_toilet_wash'() {
      console.log('监听进来了')
      if(this.deviceAttrs.auto_toilet_wash == 'true' && this.noOne == true) {
        console.log('动画执行')
        this.startAuto_toilet_wash()
      }
    }
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
      .then(() => {
        if(this.deviceAttrs.reset == 'true') {
          HdSmart.UI.toast('该设备已被复位，请删除设备后重新添加')
        }
        this.load = true
        if(this.deviceAttrs.massage) {
          this.massageVal = this.deviceAttrs.massage == 'true' ? true : false
        }
        if(this.deviceAttrs.night_light) {
          this.night_lightVal = this.deviceAttrs.night_light == 'true' ? true : false
        }
        if(this.deviceAttrs.auto_flushing) {
          this.auto_flushingVal = this.deviceAttrs.auto_flushing == 'true' ? true : false
        }
        if(this.deviceAttrs.toilet_wash == 'true') {
          this.headline = '正在洗便'
        } else if(this.deviceAttrs.woman_wash == 'true') {
          this.headline = '正在妇洗'
        } else if(this.deviceAttrs.dry == 'true') {
          this.headline = '正在烘干'
        } else if(this.deviceAttrs.flushing == 'true') {
          this.headline = '正在冲水'
        } else if(this.deviceAttrs.auto_toilet_wash == 'true') {
          console.log('初始化')
          this.headline = '洗便烘干'
          this.combination = '洗便妇洗'
          this.oneFlagToilet = true
          this.noOne == false
        } else if(this.deviceAttrs.auto_woman_wash == 'true') {
          this.headline = '妇洗烘干'
          this.combination = '洗便妇洗'
          this.oneFlagWoman = true
          this.noOne == false
        } else {
          this.headline = '准备就绪'
        }
      })
      .catch((err) => {
        if(err.code == -90004) {
          HdSmart.UI.toast('网络超时，请重试')
        }
      })
      HdSmart.UI.setStatusBarColor(2)
    })
    if(document.body.clientHeight/document.body.clientWidth < 2) {
      this.isMin = true
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(()=>{
        // 头部位置错乱
        window.scrollTo(0,0)
      },100)
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo','doControlDevice']),
    // 路由跳转
    OfflineHelpPage(){
      this.$router.push({
        path:"/OfflineHelpPage"
      })
    },
    // touch动画
    touchstart(val) {
      if(this.isClose||this.isOffline|| this.networkStatus == -1) return
      if(this.flag == true) return
      this.flag = true
      if(val == 'auto_toilet_wash' || val == 'auto_woman_wash') {
        this.$refs[val].classList.remove('animateLong')
        this.$refs[val].classList.add('animate1Long')
        this.$refs[val].classList.add('yellowExtend1')
      } else {
        this.$refs[val].classList.remove('animate')
        this.$refs[val].classList.add('animate1')
        this.$refs[val].classList.add('yellowExtend')
      }
      HdSmart.UI.vibrate()
      setTimeout(()=>{
        this.touchend(val)
      },300)
    },
    touchend(val){
      if(this.isClose||this.isOffline|| this.networkStatus == -1) return
      this.$refs[val].classList.remove('animate1')
      this.$refs[val].classList.remove('animate1Long')
      this.$refs[val].classList.remove('yellowExtend')
      this.$refs[val].classList.remove('yellowExtend1')
      this.$refs[val].classList.add('animate')
      this.$refs[val].classList.add('animateLong')
      setTimeout(()=>{
        this.$refs[val].classList.remove('animate')
        this.$refs[val].classList.remove('animateLong')
      },300)
      if(val == 'stop') {
        this.$refs['auto_toilet_wash'].classList.remove('yellowExtend1')
        this.$refs['auto_woman_wash'].classList.remove('yellowExtend1')
        return this.stopMode('stop')
      }
      if(val == 'toilet_wash') return this.setMode('toilet_wash')
      if(val == 'woman_wash') return this.setMode('woman_wash')
      if(val == 'dry') return this.setMode('dry')
      if(val == 'flushing') return this.setMode('flushing')
      if(val == 'auto_toilet_wash') return this.setMode('auto_toilet_wash')
      if(val == 'auto_woman_wash') return this.setMode('auto_woman_wash')
    },
    startAuto_toilet_wash() {
      this.headline = '正在洗便'
      this.titleName = '洗便烘干'
      this.combination = '洗便妇洗'
      this.time1 = setTimeout(() => {
        this.headline = '正在冲水'
        this.time2 = setTimeout(() => {
          this.headline = '正在烘干'
        }, 1000 * 16)
      }, 1000 * 60)
    },
    startAuto_woman_wash() {
      this.headline = '正在妇洗'
            this.titleName = '妇洗烘干'
            this.combination = '洗便妇洗'
            this.time1 = setTimeout(() => {
              this.headline = '正在冲水'
              this.time2 = setTimeout(() => {
                this.headline = '正在烘干'
                // this.time3 = setTimeout(() => {
                //   // this.monitor = true
                //   this.headline = '准备就绪'
                //   this.titleName = ''
                //   this.combination = ''
                //   // this.controlDevice('auto_woman_wash', 'false')
                //   // .then((res) => {
                //     // if(res.code == 0) {
                //       window.scrollTo(0,0)
                //       // this.judge = 'auto_woman_wash'
                //     // }
                //   // })
                // }, 1000 * 170)
              }, 1000 * 16)
            }, 1000 * 60)
    },
    // 模式控制
    setMode(val) {
      if (this.isClose) return
      if(this.isOffline) return HdSmart.UI.toast('设备已离线')
      if(val == 'flushing') {
        this.controlDevice(val, 'true')
        .then((res) =>{
          if(res.code == 0) {
            // window.scrollTo(0,0)
            this.judge = 'flushing'
          }
        })
      } else if(val == 'auto_toilet_wash') {
        this.controlDevice(val, 'true')
        .then((res) =>{
          if(res.code == 0) {
            // window.scrollTo(0,0)
            this.judge = val
          }
        })
      } else if(val == 'auto_woman_wash') {
        this.controlDevice(val, 'true')
        .then((res) =>{
          if(res.code == 0) {
            // window.scrollTo(0,0)
            this.judge = val
          }
        })
      } else {
        this.controlDevice(val, 'true')
        .then((res) => {
          if(res.code == 0) {
            // window.scrollTo(0,0)
            this.judge = val
          }
        })
      }
    },
    //停止控制
    stopMode() {
      if (this.isClose) return
      if(this.isOffline) return HdSmart.UI.toast('设备已离线')
      var copy = ''
      if(this.deviceAttrs.toilet_wash == 'true') {
        copy = 'toilet_wash'
      } else if(this.deviceAttrs.woman_wash == 'true') {
        copy = 'woman_wash'
      } else if(this.deviceAttrs.dry == 'true') {
        copy = 'dry'
      } else if(this.deviceAttrs.flushing == 'true') {
        copy = 'flushing'
      } else if(this.deviceAttrs.auto_toilet_wash == 'true') {
        copy = 'auto_toilet_wash'
      } else if(this.deviceAttrs.auto_woman_wash == 'true') {
        copy = 'auto_woman_wash'
      }
      this.controlDevice(copy, 'false')
      .then((res) =>{
        if(res.code == 0) {
          this.controlDevice('stop', 'true')
          .then((res) => {
            if(res.code == 0) {
              window.scrollTo(0,0)
              clearTimeout(this.time1)
              clearTimeout(this.time2)
              clearTimeout(this.time3)
              this.titleName = ''
              this.combination = ''
              this.judge = ''
            }
          })
        }
      })

    },
    // 风温控制
    wind_temperature(val) {
      if(this.isClose||this.isOffline|| this.networkStatus == -1) return
      HdSmart.UI.vibrate()
      this.controlDevice('wind_temperature', val)
    },
    // 水温控制
    water_temperature(val) {
      if(this.isClose||this.isOffline|| this.networkStatus == -1) return
      HdSmart.UI.vibrate()
      this.controlDevice('water_temperature', val)
    },
    // 座温控制
    seat_temperature(val) {
      if(this.isClose||this.isOffline|| this.networkStatus == -1) return
      HdSmart.UI.vibrate()
      this.controlDevice('seat_temperature', val)
    },
    // 水压控制
    hydraulic_pressure(val) {
      if(this.isClose||this.isOffline|| this.networkStatus == -1) return
      HdSmart.UI.vibrate()
      this.controlDevice('hydraulic_pressure', val)
    },
    // 水位控制
    spray_gun(val) {
      if(this.isClose||this.isOffline|| this.networkStatus == -1) return
      HdSmart.UI.vibrate()
      this.controlDevice('spray_gun', val)
    },
    // 按摩控制
    massage(e) {
      if(this.isClose||this.isOffline|| this.networkStatus == -1) return
      this.massageDisabled = true
      HdSmart.UI.vibrate()
      this.controlDevice('massage', e.target.checked == true ? 'true' : 'false')
    },
    // 夜灯控制
    night_light(e) {
      if(this.isClose||this.isOffline|| this.networkStatus == -1) return
      this.night_lightDisabled = true
      HdSmart.UI.vibrate()
      this.controlDevice('night_light', e.target.checked == true ? 'true' : 'false')
    },
    // 自动冲水控制
    auto_flushing(e) {
      if(this.isClose||this.isOffline|| this.networkStatus == -1) return
      this.auto_flushingDisabled = true
      HdSmart.UI.vibrate()
      this.controlDevice('auto_flushing', e.target.checked == true ? 'true' : 'false')
    },
    fail() {
      if(this.isClose||this.isOffline|| this.networkStatus == -1) return
      HdSmart.UI.toast('功能开发中^_^', 1000)
    },
    controlDevice(attr, value) {
      return this.doControlDevice({
        nodeid: `water_heater.main.${attr}`,
        params: {
          attribute: {
            [attr]: value
          }
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
@backgroundPath: "base/img";
@imgPath3: 'base/honghan_switch/assets';
@keyframes wave1 {
    from {
        background-position-x: 0;
    }
    to {
        background-position-x: -600px;
    }
}
@keyframes wave2 {
    from {
        background-position-x: -600px;
    }
    to {
        background-position-x: 0;
    }
}
@keyframes wave3 {
    from {
        top: 0;
    }
    to {
        top: 250px;
    }
}
.page {
  &::before{
    content: "";
    background-image: url('~@lib/@{backgroundPath}/bg02.png');
    background-repeat:no-repeat;
    background-size: 100% 100%;
    position: fixed;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }
  .main{
      margin-top: 60px;
    .headline {
      font-size: 112px;
      color: #000000;
      text-align: center;
    }
    .subheading {
      margin: 50px 0 150px;
      display: flex;
      justify-content: center;
      .subheading_tips {
        font-size: 24px;
        color: #000000;
        text-align: center;
        &.margin-tips {
          margin: 0 80px;
        }
        &.tips-margin {
          margin: 0 45px;
        }
        &.stateless {
          opacity: 0.3;
        }
        &.stateful {
          opacity: 1;
        }
      }
      .subheading_tips-big {
        font-size: 34px;
        color: #000000;
        text-align: center;
      }
      &.isMin {
        margin-bottom: 30px;
      }
    }
    .line{
      width: 100%;
      height: 1px;
      background: #000;
      opacity: 0.1;
      margin-bottom: 40px;
    }
  }
  .box {
    position: relative;
    width: 410px;
    height: 410px;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 50%;
    margin: 0 auto;
    overflow: hidden;
    .fox {
      position: relative;
      width: 410px;
      height: 410px;
      &.isStart {
        animation: wave3 2s linear 1;
        animation-fill-mode: forwards;
      }
      .wave {
        position: absolute;
        left: 0;
        top: 90px;
        width: 1004px;
        height: 320px;
        background-size: 100% 100%;
        background-repeat: repeat-x;
        background-position-y: bottom;
      }
      .wave1 {
        background-image: url(~@lib/base/closestool/assets/mt_img_03.png);
        background-size: 1004px 350px;
        background-position-x: 0px;
        animation: wave1 2s linear infinite;
        animation-direction:alternate;
        -webkit-animation-direction:alternate;
      }
      .wave2 {
        background-image: url(~@lib/base/closestool/assets/mt_img_02.png);
        background-size: 1004px 200px;
        background-position-x: 0px;
        animation: wave2 2s linear infinite;
        animation-direction:alternate;
        -webkit-animation-direction:alternate;
      }
      .wave3 {
        background-image: url(~@lib/base/closestool/assets/mt_img_01.png);
        background-size: 1004px 250px;
        background-position-x: 0px;
        animation: wave1 1.5s linear infinite;
        animation-direction:alternate;
        -webkit-animation-direction:alternate;
      }
    }
  }
  .panel-btn {
    padding: 0px 38px 0;
    z-index: 9999;
    background: transparent;
    flex-wrap: wrap;
    justify-content: space-around;
    &.stop {
      position: fixed;
      bottom: 90px;
      left: 0;
      right: 0;
    }
  }
  /*********** 按钮 ***********/
  .btn-wrap {
    margin: 0 24px 0px;
    .btn {
      box-sizing: border-box;
      margin: 0 auto;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      background: rgba(0,0,0,0.04);
      &::before {
        content: "";
        display: block;
        width: 48px;
        height: 48px;
        z-index: 100;
      }
    }
    .btn-name {
      text-align: center;
      color: #000;
      margin-top: 16px;
      font-size: 24px;
    }
    .btn-freeze {
      &::before {
        background-image: url(~@lib/base/closestool/assets/mt_btn_fuxi.png);
        background-size: 100% 100%;
      }
    }
    .btn-cold {
      &::before {
        background-image: url(~@lib/base/closestool/assets/mt_btn_xibian.png);
        background-size: 100% 100%;
      }
    }
    .btn-stop {
      &::before {
        background-image: url(~@lib/base/closestool/assets/lyj_btn_zanting.png);
        background-size: 100% 100%;
      }
    }
    .btn-auto {
      &::before {
        background-image: url(~@lib/base/closestool/assets/mt_btn_honggan.png);
        background-size: 100% 100%;
      }
    }
    .btn-holiday {
      &::before {
        background-image: url(~@lib/base/closestool/assets/mt_btn_chongshui.png);
        background-size: 100% 100%;
      }
    }
  }
  .btn-wrap-ellipse {
    box-sizing: border-box;
    margin: 40px auto 0;
    width: 314px;
    height: 120px;
    border-radius: 60px;
    background: rgba(0,0,0,0.04);
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    .btn-ellipse {
      z-index: 100;
      width: 48px;
      height: 48px;
      background: url(~@lib/base/closestool/assets/mt_btn_xibianhonggan.png);
      background-size: 100% 100%;
      &.icon {
        background: url(~@lib/base/closestool/assets/mt_btn_fuxihonggan.png);
        background-size: 100% 100%;
      }
    }
    .btn-name {
      z-index: 100;
      font-size: 24px;
      color: #000000;
    }
  }
  .footer {
    margin-top: 60px;
    .line {
      width: 100%;
      height: 1px;
      opacity: .1;
      background: #000000;
    }
    .footer-line {
      padding: 0px 60px;
      height: 118px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .footer-title {
        font-size: 32px;
        color: #000000;
      }
      .footer-nav {
        display: flex;
        .footer-nav-btn {
          height: 64px;
          line-height: 64px;
          font-size: 28px;
          color: #000000;
          text-align: center;
          margin-left: 64px;
          opacity: 0.5;
          &.active {
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
      .switch {
            width: 74px;
            height: 28px;
            position: relative;
            border: 1px solid transparent;
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
            background: #000;
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
        }
    }
  }
  /*********** 离线和关机 ***********/
}
  .animate::before{
    animation: scale 0.3s;
  }
  .animate1::before{
    animation: scale1 0.15s;
    animation-fill-mode : forwards;
  }
  .animateLong {
    .btn-name,
    .btn-ellipse {
      animation: scale 0.3s;
    }
  }
  .animate1Long {
    .btn-name,
    .btn-ellipse {
      animation: scale1 0.15s;
      animation-fill-mode : forwards;
    }
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
      // background-image: linear-gradient(221deg, #F1CB85 10%, #E1B96E 81%);
      background: #E1B96E;
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

  .yellowExtend1{
    position: relative;
    &::after{
      content: '';
      position: absolute;
      width: 70%;
      height: 70%;
      // background-image: linear-gradient(221deg, #F1CB85 10%, #E1B96E 81%);
      background: #E1B96E;
      top: 50%;
      left: 50%;
      border-radius: 60px;
      transform: translate(-50%, -50%);
      animation: yellowExtendAnimate .15s 1;
      animation-fill-mode: forwards;
      animation-timing-function: ease-out;
      z-index: 99
    }
  }
</style>
