<template>
  <div
    :class="[ac.mode]"
    class="wrap-on"
  >
    <!-- <div class="topbar topbar-fixed">
      <div class="left">
        <div
          href="#/"
          class="icon-return"
          @click.prevent="back"/>
      </div>
      <div class="title">{{ device.name }}</div>
      <div class="right">
        <div
          href=""
          class="icon-more"
          @click.prevent="goDetail"/>
      </div>

    </div> -->

    <topbar
      :title="device.name"
      :transparent="true"
    />

    <div class="bg" />

    <div class="header">
      <!--<p class="name">{{device.name}}
                <icon class="redact-white"/>
            </p>-->
      <p class="status">
        {{ modeText }} {{ speedText }} {{ ac.env_temperature ? '环境温度' + ac.env_temperature/10 + '℃' : '' }}
      </p>
    </div>

    <div class="current_temp">
      <template v-if="temperature">
        <span class="num">{{ temperature }}</span>
        <span class="unit">℃</span>
      </template>
      <template v-else>
        <span class="line" />
        <span class="line" />
      </template>
    </div>

    <transition name="fade">
      <div
        v-show="tipVisible"
        class="tip"
      >{{ tip }}</div>
    </transition>

    <div
      :class="{disabled:ac.mode=='wind'}"
      
      class="btn-minus icon-less"
      @click.prevent="setTemperature(-1, $event)"
    />
    <div
      :class="{disabled:ac.mode=='wind'}"
      
      class="btn-add icon-plus"
      @click.prevent="setTemperature(1, $event)"
    />

    <div
      :class="{'btn-toggle-more':toggle}"
      class="btn-toggle a-link"
      @click="showMore()"
    />

    <div class="btns-hold">
      <ul class="btns">
        <li>
          <div
            class="btn-mode icon-mode a-link"
            @click="modeDialogShow=true"
          />
          模式
        </li>
        <li>
          <!--<div  class="btn-mode" @click.prevent="modeDialogShow=true"></div>-->
          <div
            class="btn-off icon-switch a-link"
            @click.prevent="setOff($event)"
          />
          关闭
        </li>
        <li>
          <div
            class="btn-speed2 icon-speed a-link"
            @click="speedDialogShow=true"
          />
          风速
        </li>
      </ul>
      <!-- <ul class="btns">
                <li :class="{on:ac.mode==='cold'}">
                    <div  class="btn-cold" :class="{on:ac.mode==='cold'}" @click.prevent="setMode('cold', $event)"></div>
                    制冷
                </li>
                <li :class="{on:ac.mode==='heat'}">
                    <div  class="btn-heat" :class="{on:ac.mode==='heat'}" @click.prevent="setMode('heat', $event)"></div>
                    制热
                </li>
                <li :class="{on:ac.mode==='dehumidify'}">
                    <div  class="btn-dehumidify" :class="{on:ac.mode==='dehumidify'}" @click.prevent="setMode('dehumidify', $event)"></div>
                    除湿
                </li>
                <li :class="{'on':ac.speed==='low'||ac.speed==='normal'||ac.speed==='high'}">
                    <div  class="btn-speed" :class="{'btn-s1':ac.speed==='low','btn-s2':ac.speed==='normal','btn-s3':ac.speed==='high'}" @click.prevent="setSpeed($event)"></div>
                    <span v-show="ac.speed==='low'">低</span>
                    <span v-show="ac.speed==='normal'">中</span>
                    <span v-show="ac.speed==='high'">高</span>
                    <span v-show="ac.speed!=='low'&&ac.speed!=='normal'&&ac.speed!=='high'">风速</span>
                </li>
            </ul> -->

    </div>

    <!--<div  class="btn-off" @click.prevent="setOff($event)"></div>-->

    <sub-page
      v-model="toggle"
      class="btns-more"
      title="更多"
      @close="onModalClose"
    >
      <!-- <p>模式</p>
            <ul class="btns">
                <li :class="{on:ac.mode==='auto'}">
                    <div  class="btn-auto" :class="{on:ac.mode==='auto'}" @click.prevent="setMode('auto', $event)"></div>
                    智能
                </li>
                <li :class="{on:ac.mode==='wind'}">
                    <div  class="btn-wind" :class="{on:ac.mode==='wind'}" @click.prevent="setMode('wind', $event)"></div>
                    送风
                </li>
            </ul> -->
      <!--<p>摆风</p>-->
      <ul class="btns">
        <li :class="{on:ac.wind_up_down==='on'}">
          <div
            :class="{on:ac.wind_up_down==='on'}"
            
            class="icon-vertical a-link"
            @click.prevent="setWind('wind_up_down', $event)"
          />
          上下
        </li>
        <!-- <li :class="{on:ac.wind_left_right==='on'}">
                    <div  class="btn-horizontal" :class="{on:ac.wind_left_right==='on'}" @click.prevent="setWind('wind_left_right', $event)"></div>
                    左右
                </li> -->
      </ul>
    </sub-page>

    <!-- 模式 -->
    <sub-page
      v-model="modeDialogShow"
      class="btns-more"
      title="模式"
      @close="onModalClose"
    >
      <ul class="btns">
        <li :class="{on:ac.mode==='auto'}">
          <div
            :class="{on:ac.mode==='auto'}"
            
            class="icon-auto a-link"
            @click.prevent="setMode('auto', $event)"
          />
          智能
        </li>
        <li :class="{on:ac.mode==='cold'}">
          <div
            :class="{on:ac.mode==='cold'}"
            
            class="icon-cold a-link"
            @click.prevent="setMode('cold', $event)"
          />
          制冷
        </li>
        <li :class="{on:ac.mode==='heat'}">
          <div
            :class="{on:ac.mode==='heat'}"
            
            class="icon-heat a-link"
            @click.prevent="setMode('heat', $event)"
          />
          制热
        </li>
        <li :class="{on:ac.mode==='dehumidify'}">
          <div
            :class="{on:ac.mode==='dehumidify'}"
            
            class="icon-dehumidify a-link"
            @click.prevent="setMode('dehumidify', $event)"
          />
          除湿
        </li>
        <li :class="{on:ac.mode==='wind'}">
          <div
            :class="{on:ac.mode==='wind'}"
            
            class="icon-wind a-link"
            @click.prevent="setMode('wind', $event)"
          />
          送风
        </li>
      </ul>
    </sub-page>

    <!-- 风速 -->
    <sub-page
      v-model="speedDialogShow"
      class="btns-more"
      title="风速"
      @close="onModalClose"
    >
      <ul class="btns">
        <li :class="{'on':ac.speed==='low'}">
          <div
            :class="{'on':ac.speed==='low'}"
            
            class="icon-s1 a-link"
            @click.prevent="setSpeed($event,'low')"
          />
          <span>低</span>
        </li>
        <li :class="{'on':ac.speed==='normal'}">
          <div
            :class="{'on':ac.speed==='normal'}"
            
            class="icon-s2 a-link"
            @click.prevent="setSpeed($event,'normal')"
          />
          <span>中</span>
        </li>
        <li :class="{'on':ac.speed==='high'}">
          <div
            :class="{'on':ac.speed==='high'}"
            
            class="icon-s3 a-link"
            @click.prevent="setSpeed($event,'high')"
          />
          <span>高</span>
        </li>
      </ul>
    </sub-page>

  </div>
</template>

<script>
import Modal from '../../../lib/components/Modal.vue'
import SubPage from './SubPage.vue'
import Icon from '../../../lib/components/SettingIconMobile.vue'

const tips = {
  fail: '设置失败',
  temperature: '温度设置成功',
  speed_low: '低风切换成功',
  speed_normal: '中风切换成功',
  speed_high: '高风切换成功',
  speed_auto: '自动风速切换成功',
  mode_cold: '制冷模式切换成功',
  mode_auto: '智能模式切换成功',
  mode_heat: '制热模式切换成功',
  mode_dehumidify: '除湿模式切换成功',
  mode_wind: '送风模式切换成功',
  wind_up_down_on: '上下扫风已启动',
  wind_up_down_off: '上下扫风已关闭',
  wind_left_right_on: '左右扫风已启动',
  wind_left_right_off: '左右扫风已关闭',
  err_temp1: '送风模式下不能设置温度',
  err_temp2: '温度已调至最高',
  err_temp3: '温度已调至最低'
}
// const SPEED = ['low', 'normal', 'high']
const [MIN_TEMP, MAX_TEMP] = [16, 30]
let tempDelay

let tempFlag = true

export default {
  components: {
    Modal,
    Icon,
    SubPage
  },
  props: {
    control: {
      type: Function
    },
    device: {
      type: Object
    },
    ac: {
      type: Object
    }
  },
  data() {
    return {
      temperature: this.ac.temperature,
      toggle: false,
      tipVisible: false,
      modeDialogShow: false,
      speedDialogShow: false,
      tip: ''
    }
  },
  computed: {
    modeText() {
      return {
        cold: '制冷',
        heat: '制热',
        dehumidify: '除湿',
        auto: '智能',
        wind: '送风'
      }[this.ac.mode]
    },
    speedText() {
      return {
        low: '低风',
        overlow: '低风',
        normal: '中风',
        overnormal: '中风',
        high: '高风'
        // 'auto': '自动'
      }[this.ac.speed]
    }
  },
  mounted() {
    this.changeStatus(false)
    this.$watch('toggle', this.changeStatus)
    this.$watch('modeDialogShow', this.changeStatus)
    this.$watch('speedDialogShow', this.changeStatus)
    window.addEventListener('hashchange', this.onHashChange)
  },
  beforeDestroy() {
    window.removeEventListener('hashchange', this.onHashChange)
  },
  methods: {
    onHashChange() {
      let hash = location.hash
      if (!hash) {
        this.toggle = false
        this.modeDialogShow = false
        this.speedDialogShow = false
      }
    },
    onModalClose() {
      // history.go(-1)
    },
    changeStatus(val) {
      HdSmart.UI.setStatusBarColor(val ? 2 : 1)
    },
    goDetail() {
      HdSmart.UI.goDeviceDetail()
    },
    back() {
      HdSmart.UI.popWindow()
    },
    // 同步
    syncTemp() {
      if (tempFlag) {
        this.temperature = this.ac.temperature
      }
    },
    setOff(event) {
      this.control('switch', 'off', event.target, () => { }, this.onSetError())
    },
    setTemperature(val, event) {
      if (this.ac.mode === 'wind') {
        this.showTip(tips.err_temp1)
        return
      }

      var temp = this.temperature + val

      if (temp < MIN_TEMP) {
        if (this.ac.temperature == MIN_TEMP) {
          this.showTip(tips.err_temp3)
          return
        } else {
          temp = MIN_TEMP
        }
      }

      if (temp > MAX_TEMP) {
        if (this.ac.temperature == MAX_TEMP) {
          this.showTip(tips.err_temp2)
          return
        } else {
          temp = MAX_TEMP
        }
      }

      this.temperature = temp
      clearTimeout(tempDelay)
      tempFlag = false
      tempDelay = setTimeout(() => {
        tempFlag = true
        if (this.checkCmd('temperature', temp)) {
          this.syncTemp()
          return
        }
        this.control(
          'temperature',
          this.temperature,
          event.target,
          this.onSetSuccess(tips.temperature),
          this.onSetError(true)
        )
      }, 500)
    },
    setSpeed(event, speed) {
      // var index = SPEED.indexOf(this.ac.speed);
      // var next = index === SPEED.length - 1 ? 0 : index + 1;
      // var speed = SPEED[next];
      if (this.checkCmd('speed', speed)) {
        return
      }
      this.control('speed', speed, event.target, this.onSetSuccess(tips['speed_' + speed]), this.onSetError())
    },
    setMode(mode, event) {
      if (this.checkCmd('mode', mode)) {
        return
      }
      this.control('mode', mode, event.target, this.onSetSuccess(tips['mode_' + mode]), this.onSetError())
    },
    setWind(attr, event) {
      var val = this.ac[attr] === 'on' ? 'off' : 'on'
      this.control(attr, val, event.target, this.onSetSuccess(tips[attr + '_' + val]), this.onSetError())
    },
    showMore() {
      this.toggle = !this.toggle
    },
    showTip(text) {
      if (!text) return
      this.tip = text
      this.tipVisible = true
      clearTimeout(this.tipDelay)
      this.tipDelay = setTimeout(() => {
        this.tipVisible = false
      }, 3000)
    },
    onSetSuccess(text) {
      return () => {
        this.showTip(text)
      }
    },
    onSetError(isTemp) {
      return () => {
        this.showTip(tips.fail)
        if (isTemp) {
          this.syncTemp()
        }
      }
    },
    checkCmd(attr, val) {
      var ac = JSON.parse(JSON.stringify(this.ac))
      ac[attr] = val

      if (attr != 'temperature') {
        ac.temperature = this.temperature
      }

      if (ac.temperature == MAX_TEMP && ac.speed == 'low' && ac.mode == 'cold') {
        this.showTip('低风、制冷模式下不支持此温度，请调整后重试')
        return true
      }
      return false
    }
  }
}
</script>
