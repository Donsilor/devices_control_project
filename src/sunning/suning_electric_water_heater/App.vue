<template>
  <div id="app">
    <div 
      v-show="status =='error' || model.switch=='on'" 
      class="page-on">
      <icon class="redact-white" />
      <div class="ani"/>
      <div class="inner">
        <div class="device_name">{{ device_name }}</div>
        <div class="mode-status">{{ `当前模式 : ${modelText}` }}
          <a 
            href="" 
            class="intro-helper" 
            @click.prevent="toggleModePop">
            <i/>
          </a>
        </div>
        <modal 
          v-model="modePopVisible" 
          title="加热模式介绍" 
          class="modal-w" 
          @click.prevent="toggleModePop">
          <div class="intro-body">
            <img src="../../lib/base/electric_water_heater/assets/img_waterheater.png" >
            <div class="intro-content">
              <p>
              <span>速热半胆: </span>加热半胆热水，快速提供适量热水，节能环保</p>
              <p>
              <span>速热全胆: </span>开启下方加热棒整体加热，提供充沛水量，满足全家需求</p>
              <p>
              <span>Max增容: </span>上下两个加热棒一起开启，升温更快</p>
              <p>
              <span>&nbsp;&nbsp;&nbsp;智能浴: </span>自动调节加热方式，使用更便捷</p>
            </div>
          </div>
        </modal>
        <div class="status">{{ statusText }}</div>
        <div class="current_temp">
          <strong>{{ model.temperature }}</strong>
          <small>℃</small>
          <p>当前温度</p>
        </div>
        <div class="set_temp">
          <p>
          <span>预设温度</span>{{ temp }}℃</p>
          <a 
            :class="{disabled:tempDisabled}" 
            href="" 
            class="btn btn-reduce" 
            @click.prevent="setTempDown">
            <i/>
          </a>
          <a 
            :class="{disabled:tempDisabled}" 
            href="" 
            class="btn btn-add" 
            @click.prevent="setTempUp">
            <i/>
          </a>
          <div class="slider">
            <slider 
              ref="tempSlider" 
              v-model="temp" 
              :options="sliderOptions" 
              :disabled="tempDisabled" 
              @change="onTempChange" />
            <span class="min">{{ sliderOptions.range.min }}℃</span>
            <span class="max">{{ sliderOptions.range.max }}℃</span>
          </div>
        </div>
        <div class="btns">
          <a 
            href="" 
            class="btn btn-shut" 
            @click.prevent="setSwitch('off')">
            <i/>
            <span>关闭</span>
          </a>

          <a 
            :class="{active:model.mode=='half_tank'}" 
            href="" 
            class="btn btn-heating_half" 
            @click.prevent="setMode('half_tank')">
            <i/>
            <span>半胆速热</span>
          </a>
          <a 
            :class="{active:model.mode=='full_tank'}" 
            href="" 
            class="btn btn-heating_whole" 
            @click.prevent="setMode('full_tank')">
            <i/>
            <span>整胆加热</span>
          </a>
          <a 
            :class="{active:model.mode=='max_volume'}" 
            href="" 
            class="btn btn-heating_append" 
            @click.prevent="setMode('max_volume')">
            <i/>
            <span>蓄热增容</span>
          </a>
          <a 
            :class="{active:model.mode=='smart'}" 
            href="" 
            class="btn btn-intelligentbath" 
            @click.prevent="setMode('smart')">
            <i/>
            <span>智能沐浴</span>
          </a>
        </div>
      </div>
    </div>

    <div 
      v-show="model.switch=='off'" 
      class="page-off">
      <icon />
      <div class="device_name">{{ device_name }}</div>
      <div class="status">已关闭</div>
      <div class="pic"/>
      <div class="btns">
        <a 
          href="" 
          class="btn btn-turnon" 
          @click.prevent="setSwitch('on')">
          <i/>
        </a>
      </div>
    </div>

    <div 
      v-if="model.fault && model.fault!='normal'" 
      class="alert-wraper">
      <div class="alert">
        <i/> {{ errorText }}
      </div>
    </div>
  </div>
</template>

<script>
import Slider from "./components/Slider.vue"
//TODO可能要从公共组件中引用
import Modal from "../../lib/components/Modal.vue"
import Icon from "../../lib/components/SettingIcon.vue"

const [TEMP_MIN, TEMP_MAX] = [30, 75]
const MODEL_MAP = {
    half_tank: "半胆速热",
    full_tank: "整胆加热",
    max_volume: "蓄热增容",
    smart: "智能沐浴"
}

function createBubble(container, option) {
    if (!container) return

    var el = document.createElement("div")
    el.className = "bubble"
    el.style.left = option.left + "px"
    el.style.top = option.top + "px"
    el.style.width = el.style.height = "50px"

    container.appendChild(el)

    el.addEventListener(
        "transitionend",
        function() {
            container.removeChild(container.firstChild)
        },
        false
    )

    setTimeout(function() {
        el.style.top = "-200px"
        el.style.width = el.style.height = "100px"
    }, 100)
}

export default {
    components: {
        Slider,
        Modal,
        Icon
    },
    data() {
        return {
            model: {},
            temp: 50,
            sliderOptions: {
                connect: [true, false],
                step: 1,
                range: {
                    min: TEMP_MIN,
                    max: TEMP_MAX
                }
            },
            device_name: "",
            status: "",
            modePopVisible: false
        }
    },
    computed: {
        statusText() {
            switch (this.model.heat_status) {
                case "heat":
                    return "正在加热"
                case "keep_warm":
                    return "保温"
                case "reserve":
                    return "预约"
                default:
                    return ""
            }
        },
        modelText() {
            return MODEL_MAP[this.model.mode]
        },
        tempDisabled() {
            return this.model.mode == "max_volume"
        },
        errorText() {
            switch (this.model.fault) {
                case "normal":
                    return "正常"
                case "dry_heat":
                    return "热水器干烧，请检查设备"
                case "sensor_error":
                    return "热水器传感器故障，请检查设备"
                case "over_temperature":
                    return "热水器超温，请检查设备"
                default:
                    return "热水器故障，请检查设备"
            }
        }
    },
    watch: {
        "model.set_temperature"(val) {}
    },
    created() {
        HdSmart.ready(() => {
            if (window.device_name) {
                this.device_name = window.device_name
            }

            this.getSnapShot()
        })

        HdSmart.onDeviceStateChange(data => {
            this.onSuccess(data.result)
        })
    },
    mounted() {
        var el = this.$el.querySelector(".ani")
        var top = document.documentElement.offsetHeight
        var width = document.documentElement.offsetWidth
        setInterval(() => {
            if (this.model.switch == "on") {
                createBubble(el, {
                    left: Math.random() * width,
                    top: top
                })
            }
        }, 1500)
    },
    methods: {
        controlDevice(attr, value) {
            if (this.model.fault && this.model.fault != "normal") {
                HdSmart.UI.toast(this.errorText)
                return
            }
            //切换模式的时候加上温度字段
            let temperature = {}
            if (attr === "mode") {
                let oldVal = this.getOldTemperature(value)
                temperature = oldVal ? { set_temperature: oldVal } : {}
            }

            HdSmart.Device.control(
                {
                    nodeid: `water_heater.main.${attr === "mode" ? "custom" : attr}`,
                    params: {
                        attribute: {
                            [attr]: value,
                            ...temperature
                        }
                    }
                },
                () => {},
                () => {}
            )
        },
        setTempUp() {
            if (this.tempDisabled) {
                return
            }
            if (this.temp < TEMP_MAX) {
                this.temp++
            }
        },
        setTempDown() {
            if (this.tempDisabled) {
                return
            }
            if (this.temp > TEMP_MIN) {
                this.temp--
            }
        },
        onTempChange(val) {
            if (val == this.model.set_temperature) {
                return
            }

            //缓存设置的温度到本地
            this.setOldTemperature(val)
            this.controlDevice("set_temperature", val)
        },
        setSwitch(val) {
            this.controlDevice("switch", val)
        },
        setMode(val) {
            this.$refs.tempSlider.isUpdating = false
            this.controlDevice("mode", val)
        },
        getSnapShot() {
            HdSmart.Device.getSnapShot(
                data => {
                    HdSmart.UI.hideLoading()
                    this.onSuccess(data)
                    //初始化缓存温度
                    this.setOldTemperature(this.model.set_temperature)
                },
                () => {
                    this.status = "error"
                    HdSmart.UI.hideLoading()
                }
            )
        },
        onSuccess(data) {
            this.status = "success"
            this.model = data.attribute
            if (!this.$refs.tempSlider.isUpdating) {
                this.temp = this.model.set_temperature
            }
        },
        //从本地缓存中获取温度数据
        getOldTemperature(mode) {
            return (window.device_uuid && this.getCurrentStorage()[mode]) || 0
        },
        //获取当前device_uuid的缓存object
        getCurrentStorage() {
            return (
                (localStorage.getItem(window.device_uuid) && JSON.parse(localStorage.getItem(window.device_uuid))) || {}
            )
        },
        setOldTemperature(val) {
            if (this.model.mode && window.device_uuid) {
                localStorage.setItem(
                    window.device_uuid,
                    JSON.stringify(
                        Object.assign(this.getCurrentStorage() || {}, {
                            [this.model.mode]: val
                        })
                    )
                )
            }
        },
        toggleModePop() {
            this.modePopVisible = !this.modePopVisible
        }
    },
}
</script>
