<template>
  <div id="app">
    <div 
      v-if="status == 'error' || model.switch_status == 'on'" 
      class="page-on">
      <div class="mainTitle">
        <div class="name">{{ device_name }}
          <icon class="redact-white" />
        </div>
        <div class="tip">
          <p v-show="tip">{{ tip }}</p>
          <p v-show="!tip && remain_tip">{{ remain_tip }}</p>
        </div>
      </div>
      <a 
        v-if="ab.child_lock_switch || ab.negative_ion_switch" 
        href="" 
        class="btn-more" 
        @click.prevent="moreModalVisible = true"/>
      <div class="pm25">
        <div class="circle">
          <span 
            v-for="i in 5" 
            v-show="i==(pm25_level>5?5:pm25_level)" 
            :key="i" 
            :class="'c'+i"/>
        </div>
        <div 
          :style="{transform:'rotate('+ pm25_rotate +'deg)'}" 
          class="arrow"/>
        <div 
          class="value" 
          v-html="pm25_text"/>
        <div 
          class="pic" 
          @click="togglePMPop">PM 2.5</div>
        <div class="attrs">
          <span v-if="model.temperature && model.temperature!='0'">温度：{{ model.temperature }}℃</span>
          <span v-if="model.humidity && model.humidity!='0'">湿度：{{ model.humidity }}%</span>
        </div>
      </div>

      <div class="btns btns-fn">
        <a 
          href="" 
          class="btn-on" 
          @click.prevent="setSwitch('off')">
          <i/> 开关
        </a>
        <a 
          :class="{active:model.control_status == 'sleep'}" 
          href="" 
          class="btn-sleep" 
          @click.prevent="setControl('sleep')">
          <i/> 睡眠
        </a>
        <!-- <a href="" class="btn-sleep"  @click.prevent="setControl('manual')">
                <i></i> 手动
            </a> -->
        <a 
          v-if="model.control_status == 'auto'" 
          href="" 
          class="btn-auto active" 
          @click.prevent="showSpeedModal">
          <i/> 自动
        </a>
        <a 
          v-else-if="model.control_status == 'manual' && model.speed && model.speed != 'sleep'" 
          :class="speedCss" 
          href="" 
          @click.prevent="showSpeedModal">
          <i/> {{ speedText }}
        </a>
        <a 
          v-else 
          href="" 
          class="btn-speed" 
          @click.prevent="showSpeedModal">
          <i/> 风档
        </a>
      </div>

      <modal 
        v-model="speedModalVisible" 
        title="风档" 
        class="windControl">
        <div class="btns btns-speed">
          <a 
            v-for="item in speedItems" 
            :key="item.value" 
            :class="['btn1-speed'+item.className,{active:model.control_status == 'manual' && model.speed == item.value}]" 
            href="" 
            @click.prevent="setSpeed(item.value)">
            <i/> {{ item.text }}
          </a>
          <a 
            :class="{active: model.control_status == 'auto'}" 
            href="" 
            class="btn1-auto" 
            @click.prevent="setControl('auto')">
            <i/> 自动
          </a>
        </div>
      </modal>

      <modal 
        v-model="moreModalVisible" 
        title="更多">
        <div class="btns btns-more">
          <a 
            v-if="ab.negative_ion_switch" 
            :class="{active:model.negative_ion_switch_status == 'on'}" 
            href="" 
            class="btn-ni" 
            @click.prevent="setNegativeIon">
            <i/> 负离子
          </a>
          <a 
            v-if="ab.child_lock_switch" 
            :class="{active:model.child_lock_switch_status == 'on'}" 
            href="" 
            class="btn-cl" 
            @click.prevent="setChildLock">
            <i/> 童锁
          </a>
        </div>
      </modal>
      <sub-page 
        v-model="pmPopVisible" 
        title="PM2.5简介" 
        class="modal-w" 
        @click.prevent="toggleModePop">
        <div class="intro-body">
          <p class="main_text">
            PM2.5指环境空气中空气动力学当量直径小于等于2.5微米的颗粒物。它能较长时间悬浮于空气中，其在空气中含量浓度越高，就代表空气污染越严重。
          </p>
          <div class="pm-range">
            <img src="@lib/base/air_cleaner/assets/PM2.5_scale@3x.png" >
          </div>
        </div>
      </sub-page>

    </div>

    <div 
      v-if="model.switch_status == 'off'" 
      class="page-off">
      <div class="name">{{ device_name }}
        <icon />
      </div>
      <div class="tip">已关闭</div>
      <div class="air_cleaner"/>
      <div class="btns btns-fn">
        <a 
          href="javascript:void(0)" 
          class="btn-off" 
          @click.prevent="setSwitch('on')">
          <i/> 开关
        </a>
        <a 
          href="javascript:void(0)" 
          class="btn-sleep disable">
          <i/> 睡眠
        </a>
        <a 
          href="javascript:void(0)" 
          class="btn-speed disable">
          <i/> 风档
        </a>
      </div>
    </div>

    <!-- <error-tip v-if="status == 'error'" @click.native="getSnapShot" /> -->
  </div>
</template>

<script>
import Modal from '@lib/components/Modal'
import SubPage from '@lib/components/SubPage.vue'
import Icon from '@lib/components/SettingIconMobile.vue'

const SPEED_TEXT1 = [
    { text: '低速', className: '1', value: 'low' },
    { text: '中低速', className: '2', value: 'middle' },
    { text: '中速', className: '3', value: 'high' },
    { text: '中高速', className: '4', value: 'very_high' },
    { text: '高速', className: '5', value: 'super_high' }
]
const SPEED_TEXT2 = [
    { text: '一档', className: '1', value: 'low' },
    { text: '二档', className: '2', value: 'middle' },
    { text: '三档', className: '3', value: 'high' },
    { text: '四档', className: '4', value: 'very_high' }
]
const SPEED_TEXT3 = [
    { text: '低速', className: '1', value: 'low' },
    { text: '中速', className: '3', value: 'middle' },
    { text: '高速', className: '5', value: 'high' }
]
const DEVICE_MODEL = {
    'KJ315F-A1': {
        child_lock_switch: false,
        negative_ion_switch: false
    },
    'KJ400F-A11': {
        child_lock_switch: false,
        negative_ion_switch: false
    },
    'KJ819F-B2': {
        speed: 5
    }
}
const DEVICE_DEFAULT = {
    child_lock_switch: true,
    negative_ion_switch: true,
    speed: 3
}

const PM25_VAL = [0, 35, 75, 115, 150, 250]
const PM25_ANGLE = [-136, -84, -28, 28, 84, 136]

function getToggle(val) {
    return val === 'on' ? 'off' : 'on'
}

function getRotate(val, start, end) {
    var min = PM25_VAL[start]
    var max = PM25_VAL[end]
    var min_r = PM25_ANGLE[start]
    var max_r = PM25_ANGLE[end]
    return min_r + (val - min) / (max - min) * (max_r - min_r)
}

/**
 * 创建并返回一个像节流阀一样的函数，当重复调用函数的时候，最多每隔 wait毫秒调用一次该函数
 * @param func 执行函数
 * @param wait 时间间隔
 * @param options 如果你想禁用第一次首先执行的话，传递{leading: false}，
 *                如果你想禁用最后一次执行的话，传递{trailing: false}
 * @returns {Function}
 */
function throttle(func, wait, options) {
    var context, args, result
    var timeout = null
    var previous = 0
    if (!options) options = {}
    var later = function() {
        previous = options.leading === false ? 0 : new Date().getTime()
        timeout = null
        result = func.apply(context, args)
        if (!timeout) context = args = null
    }
    var wait = wait || 500
    return function() {
        var now = new Date().getTime()
        if (!previous && options.leading === false) previous = now
        var remaining = wait - (now - previous)
        context = this
        args = arguments
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout)
                timeout = null
            }
            previous = now
            result = func.apply(context, args)
            if (!timeout) context = args = null
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining)
        }
        return result
    }
}

export default {
    components: {
        Modal,
        SubPage,
        Icon
    },
    data() {
        return {
            status: '',
            speedModalVisible: false,
            moreModalVisible: false,
            device_name: '',
            model: {},
            tip: '',
            remain_tip: '',
            pm25: '',
            speedItems: SPEED_TEXT3,
            ab: {},
            lastControl: {},
            lastControlTime: 0,
            pmPopVisible: false
        }
    },
    computed: {
        currentSpeed() {
            var item = this.speedItems.filter(item => {
                return item.value == this.model.speed
            })
            if (item.length) {
                return item[0]
            }
            return {}
        },
        speedCss() {
            return ['btn-speed' + this.currentSpeed.className, 'active']
        },
        speedText() {
            return this.currentSpeed.text
        },
        pm25_level() {
            for (var i = PM25_VAL.length - 1; i >= 0; i--) {
                if (this.pm25 > PM25_VAL[i]) {
                    return i + 1
                }
            }
            return 1
        },
        pm25_rotate() {
            var level = this.pm25_level
            if (level == 6) {
                return PM25_ANGLE[5]
            }
            return getRotate(this.pm25, level - 1, level)
        },
        pm25_text() {
            return this.pm25 == 0 ? '--' : this.pm25 + '<small>μg/m³</small>'
        }
    },
    watch: {
        pmPopVisible(val) {
            if (this.pmPopVisible) {
                HdSmart.UI.toggleHeadAndFoot(false)
            } else {
                HdSmart.UI.toggleHeadAndFoot(true)
            }
        }
    },
    methods: {
        togglePMPop() {
            //pm2.5
            this.pmPopVisible = !this.pmPopVisible
        },
        showTip(text) {
            clearTimeout(this.tipTime)
            this.tip = text
            this.tipTime = setTimeout(() => {
                this.tip = ''
            }, 2000)
        },
        controlDevice(attr, val, success, error) {
            var fn = this.confirm
            if (attr == 'child_lock_switch') {
                fn = function(cb) {
                    cb()
                }
            }
            fn(() => {
                HdSmart.Device.control(
                    {
                        method: 'dm_set',
                        nodeid: `air_filter.main.${attr}`,
                        params: {
                            attribute: {
                                [attr]: val
                            }
                        }
                    },
                    () => {
                        this.lastControlTime = Date.now()
                        this.lastControl = {
                            key: attr,
                            value: val
                        }
                        success && success()
                    },
                    () => {
                        error && error()
                        this.showTip('操作失败')
                    }
                )
            })
        },
        setSwitch(val) {
            this.controlDevice('switch', val)
        },
        setControl: throttle(function(val) {
            if (this.model.control_status == val) {
                return
            }
            this.controlDevice('control', val, () => {
                this.model.control_status = val
            })
        }),
        setSpeed: throttle(function(val) {
            if (this.model.control_status == 'manual' && this.model.speed == val) {
                return
            }
            this.controlDevice('speed', val, () => {
                this.model.control_status = 'manual'
                this.model.speed = val
            })
        }),
        setNegativeIon: throttle(function() {
            if (this.model.child_lock_switch_status == 'on') {
                HdSmart.UI.toast('解除童锁后才能控制此设备')
                return
            }
            var val = getToggle(this.model.negative_ion_switch_status)
            this.controlDevice('negative_ion_switch', val, () => {
                this.model.negative_ion_switch_status = val
            })
        }),
        setChildLock: throttle(function() {
            if (this.model.control_status == 'sleep') {
                HdSmart.UI.toast('睡眠模式下不能开启童锁')
                return
            }
            var val = getToggle(this.model.child_lock_switch_status)
            this.controlDevice('child_lock_switch', val, () => {
                this.model.child_lock_switch_status = val
            })
        }),
        showSpeedModal() {
            if (this.model.child_lock_switch_status == 'on') {
                this.confirm()
            } else {
                this.speedModalVisible = true
            }
        },
        getSnapShot(cb) {
            HdSmart.Device.getSnapShot(
                data => {
                    this.onSuccess(data)
                    cb && cb()
                },
                () => {
                    this.onError()
                    cb && cb()
                }
            )
        },
        onSuccess(data) {
            if (Date.now() - this.lastControlTime <= 3000 && data.attribute[this.lastControl.key] != this.lastControl.value) {
                data.attribute[this.lastControl.key] = this.lastControl.value
            }
            this.status = 'success'

            this.model = data.attribute

            if (this.model.filter_time_remaining <= 0) {
                this.remain_tip = '需更换滤网'
            } else if (this.model.filter_time_remaining <= 120) {
                this.remain_tip = `滤芯寿命剩余${this.model.filter_time_remaining}小时`
            } else {
                this.remain_tip = ''
            }

            var pm25 = this.model.air_filter_result.PM25
            this.pm25 = pm25.length == 2 ? pm25[1] : pm25[0]

            // 根据设备型号判断功能点
            // this.ab = Object.assign(DEVICE_DEFAULT, DEVICE_MODEL[this.model.deviceModel] || {})
            this.ab = Object.assign(DEVICE_DEFAULT, {
                speed: 5
            })
            if (this.ab.speed == 5) {
                this.speedItems = SPEED_TEXT1
            } else if (this.ab.speed == 4) {
                this.speedItems = SPEED_TEXT2
            } else {
                this.speedItems = SPEED_TEXT3
            }
        },
        onError() {
            this.status = 'error'
        },
        confirm(done) {
            if (this.model.child_lock_switch_status == 'on') {
                // if(confirm('解除童锁后才能控制此设备，是否解除？')){
                //     this.setChildLock()
                // }
                HdSmart.UI.alert(
                    {
                        title: '解除童锁',
                        message: '解除童锁后才能控制此设备，是否解除？',
                        dialogStyle: 2
                    },
                    val => {
                        if (val) this.setChildLock()
                    }
                )
            } else {
                done()
            }
        }
    },
    created() {
        HdSmart.ready(() => {
            if (window.device_name) {
                this.device_name = window.device_name
            }
            HdSmart.UI.showLoading()
            this.getSnapShot(() => {
                HdSmart.UI.hideLoading()
            })
        })
        HdSmart.onDeviceStateChange(data => {
            this.onSuccess(data.result)
        })
    }
}
</script>
<style lang="less" scoped>
@lib: '../../../lib';
</style>
