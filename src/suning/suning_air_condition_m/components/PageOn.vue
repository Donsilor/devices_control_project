<template>
  <div class="wrap-on">

    <div class="bg"/>

    <div class="header">
      <span class="name">{{ device.name }}
        <icon class="redact-white" />
      </span>
      <span class="status">
        {{ modeText }} {{ speedText }} {{ ac.env_temperature ? '环境温度' + ac.env_temperature/10 + '℃' : '' }}
      </span>
    </div>

    <div class="current_temp">
      <template v-if="temperature">
        <span class="num">{{ temperature }}</span>
        <span class="unit">℃</span>
      </template>
      <template v-else>
        <span class="line"/>
        <span class="line"/>
      </template>
    </div>

    <transition name="fade">
      <div 
        v-show="tipVisible" 
        class="tip">{{ tip }}</div>
    </transition>

    <a 
      :class="{disabled:ac.mode=='auto'}" 
      href="#" 
      class="btn-minus" 
      @click.prevent="setTemperature(-1, $event)"/>
    <a 
      :class="{disabled:ac.mode=='auto'}" 
      href="#" 
      class="btn-add" 
      @click.prevent="setTemperature(1, $event)"/>

    <a 
      href="#" 
      class="btn-off" 
      @click.prevent="setOff($event)"/>

    <a 
      :class="{'btn-toggle-more':toggle}" 
      href="#" 
      class="btn-toggle" 
      @click.prevent="showMore()"/>

    <div class="btns-hold">
      <ul class="btns">
        <li :class="{on:ac.mode==='cold'}">
          <a 
            :class="{on:ac.mode==='cold'}" 
            href="#" 
            class="btn-cold" 
            @click.prevent="setMode('cold', $event)"/>
          制冷
        </li>
        <li :class="{on:ac.mode==='heat'}">
          <a 
            :class="{on:ac.mode==='heat'}" 
            href="#" 
            class="btn-heat" 
            @click.prevent="setMode('heat', $event)"/>
          制热
        </li>
        <li :class="{on:ac.mode==='dehumidify'}">
          <a 
            :class="{on:ac.mode==='dehumidify'}" 
            href="#" 
            class="btn-dehumidify" 
            @click.prevent="setMode('dehumidify', $event)"/>
          除湿
        </li>
        <li :class="{'on':ac.speed==='low'||ac.speed==='normal'||ac.speed==='high'}">
          <a 
            :class="{'btn-s1':ac.speed==='low','btn-s2':ac.speed==='normal','btn-s3':ac.speed==='high'}" 
            href="#" 
            class="btn-speed" 
            @click.prevent="setSpeed($event)"/>
          <span v-show="ac.speed==='low'">低</span>
          <span v-show="ac.speed==='normal'">中</span>
          <span v-show="ac.speed==='high'">高</span>
          <span v-show="ac.speed!=='low'&&ac.speed!=='normal'&&ac.speed!=='high'">风速</span>
        </li>
      </ul>

    </div>

    <modal 
      v-model="toggle" 
      class="btns-more" 
      title="更多">
      <p>模式</p>
      <ul class="btns">
        <li :class="{on:ac.mode==='auto'}">
          <a 
            :class="{on:ac.mode==='auto'}" 
            href="#" 
            class="btn-auto" 
            @click.prevent="setMode('auto', $event)"/>
          智能
        </li>
        <li :class="{on:ac.mode==='wind'}">
          <a 
            :class="{on:ac.mode==='wind'}" 
            href="#" 
            class="btn-wind" 
            @click.prevent="setMode('wind', $event)"/>
          送风
        </li>
      </ul>
      <p>摆风</p>
      <ul class="btns">
        <li :class="{on:ac.wind_up_down==='on'}">
          <a 
            :class="{on:ac.wind_up_down==='on'}" 
            href="#" 
            class="btn-vertical" 
            @click.prevent="setWind('wind_up_down', $event)"/>
          上下
        </li>
        <li 
          v-if="device.category_id == 1 || device.category_id == 5001" 
          :class="{on:ac.wind_left_right==='on'}">
          <a 
            :class="{on:ac.wind_left_right==='on'}" 
            href="#" 
            class="btn-horizontal" 
            @click.prevent="setWind('wind_left_right', $event)"/>
          左右
        </li>
      </ul>
    </modal>

  </div>
</template>

<script>
import Modal from '@lib/components/Modal.vue'
import Icon from '@lib/components/SettingIconMobile.vue'

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
const SPEED = ['low', 'normal', 'high']
const [MIN_TEMP, MAX_TEMP] = [16, 30]
let tempDelay,
    tempFlag = true

export default {
    components: {
        Modal,
        Icon
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
            tip: ''
        }
    },
    computed: {
        modeText() {
            return {
                cold: '制冷模式',
                heat: '制热模式',
                dehumidify: '除湿模式',
                auto: '智能模式',
                wind: '送风模式'
            }[this.ac.mode]
        },
        speedText() {
            return {
                low: '低风',
                overlow: '低风',
                normal: '中风',
                overnormal: '中风',
                high: '高风'
                // 'auto': '自动风'
            }[this.ac.speed]
        }
    },
    methods: {
        //同步
        syncTemp() {
            if (tempFlag) {
                this.temperature = this.ac.temperature
            }
        },
        setOff(event) {
            this.control('switch', 'off', event.target, () => {}, this.onSetError())
        },
        setTemperature(val, event) {
            if (this.ac.mode === 'auto') {
                this.showTip('智能模式下不能设置温度')
                return
            }

            var temp = this.temperature + val

            if (temp < MIN_TEMP) {
                if (this.temperature == MIN_TEMP) {
                    this.showTip(tips.err_temp3)
                    return
                } else {
                    temp = MIN_TEMP
                }
            }

            if (temp > MAX_TEMP) {
                if (this.temperature == MAX_TEMP) {
                    this.showTip(tips.err_temp2)
                    return
                } else {
                    temp = MAX_TEMP
                }
            }

            if (this.checkCmd('temperature', temp)) {
                return
            }

            this.temperature = temp
            clearTimeout(tempDelay)
            tempFlag = false
            tempDelay = setTimeout(() => {
                tempFlag = true
                this.control(
                    'temperature',
                    this.temperature,
                    event.target,
                    this.onSetSuccess(tips.temperature),
                    this.onSetError(true)
                )
            }, 500)
        },
        setSpeed(event) {
            if (this.ac.mode == 'dehumidify') {
                this.showTip('除湿模式下不可设置风速')
                return
            }

            var index = SPEED.indexOf(this.ac.speed)
            var next = index === SPEED.length - 1 ? 0 : index + 1
            var speed = SPEED[next]
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
            if (ac.temperature == MAX_TEMP && ac.speed == 'low' && ac.mode == 'cold') {
                return true
            }
            return false
        }
    }
}
</script>
