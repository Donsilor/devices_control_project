<template>
  <div 
    id="app" 
    :class="appClassObj">
    <icon class="[params.switch==='off'?'':'redact-white']" />
    <p class="title">{{ deviceName }} </p>
    <p 
      v-show="params.switch === 'on'" 
      class="status">
      {{ modeText }} {{ speedText }} {{ params.env_temperature ? '环境温度' + params.env_temperature/10 + '℃' : '' }}
    </p>
    <p 
      v-show="params.switch === 'off'" 
      class="tip">已关闭</p>

    <svg 
      class="bg" 
      xmlns="http://www.w3.org/2000/svg" 
      width="1920" 
      heigth="420" 
      viewBox="0 0 1920 420">
      <defs>
        <linearGradient 
          id="lg1" 
          gradientUnits="userSpaceOnUse" 
          x1="961.4509" 
          y1="421.0971" 
          x2="961.4509" 
          y2="1.0971">
          <stop 
            offset="0" 
            style="stop-color:#FFFFFF; stop-opacity:0" />
          <stop 
            offset="1" 
            style="stop-color:#FFFFFF; stop-opacity:0.3" />
        </linearGradient>
      </defs>
      <path 
        d="M1321.5,121.1c-320,0-640-120-960-120c-120,0-240,16.9-360,38v382h1920v-382 C1721.5,74.2,1521.5,121.1,1321.5,121.1z" 
        style="fill:url(#lg1);" />
    </svg>

    <!--开机界面-->
    <div v-if="params.switch === 'on'">
      <!-- <div class="mode_img" v-if="params.mode=='auto'">
                <img src="@lib/base/air_condition/assets/icn_smart.png">
            </div> -->
      <div class="temp">
        <ac-button 
          :class="{disabled:params.mode=='auto'}" 
          :info="buttonList.minusBtn" 
          class="minus" 
          @tap="setTemperature"/>
        <div class="temp-show">
          <label class="temp-number">{{ fakeTemp }}</label>
          <label class="temp-unit">℃</label>
        </div>
        <ac-button 
          :class="{disabled:params.mode=='auto'}" 
          :info="buttonList.plusBtn" 
          class="plus" 
          @tap="setTemperature"/>
      </div>

      <!--温度End-->

      <p :class="{'tip':true, 'transparent': tip.length == 0}">{{ tip }}</p>

      <!--底部按钮Start-->
      <div class="bottom">

        <ac-button 
          :class="{active:params.mode=='cold'}" 
          :info="buttonList.cool" 
          class="cool" 
          @tap="setParam"/>
        <ac-button 
          :class="{active:params.mode=='heat'}" 
          :info="buttonList.heat" 
          class="heat" 
          @tap="setParam"/>
        <ac-button 
          :class="{active:params.mode=='dehumidify'}" 
          :info="buttonList.dehumidify" 
          class="dehumidify" 
          @tap="setParam"/>
        <ac-button 
          :info="buttonList.on" 
          class="switch on" 
          @tap="toggle"/>
        <ac-button 
          :class="{active:params.speed=='low'||params.speed=='overlow',disabled:params.mode=='dehumidify'}" 
          :info="buttonList.low" 
          class="low" 
          @tap="setParam"/>
        <ac-button 
          :class="{active:params.speed=='normal'||params.speed=='overnormal',disabled:params.mode=='dehumidify'}" 
          :info="buttonList.normal" 
          class="normal" 
          @tap="setParam"/>
        <ac-button 
          :class="{active:params.speed=='high',disabled:params.mode=='dehumidify'}" 
          :info="buttonList.high" 
          class="high" 
          @tap="setParam"/>
      </div>
      <!--底部按钮End-->

      <div 
        class="more" 
        @click.stop="showMore=true;"/>
      <!--更多子菜单Start-->
      <modal 
        v-model="showMore" 
        class="subMenu" 
        title="更多">
        <devider :content="'模式'"/>
        <div class="more-mode">
          <ac-button 
            :class="{active:params.mode=='auto'}" 
            :info="buttonList.mode_auto" 
            class="mode_auto" 
            @tap="setParam"/>
          <ac-button 
            :class="{active:params.mode=='wind'}" 
            :info="buttonList.wind" 
            class="wind" 
            @tap="setParam"/>
            <!-- <ac-button class="sleep" :class="{active:params.sleep_mode=='on',disabled:params.mode=='auto'||params.mode=='wind'||params.mode=='dehumidify'}" :info="buttonList.sleepMode" @tap="toggle"></ac-button> -->
        </div>
        <devider :content="'摆风'"/>
        <div class="more-wind-direction">
          <ac-button 
            :class="{active:params.wind_left_right=='on'}" 
            :info="buttonList.lrBtn" 
            class="lr" 
            @tap="toggle"/>
          <ac-button 
            :class="{active:params.wind_up_down=='on'}" 
            :info="buttonList.udBtn" 
            class="ud" 
            @tap="toggle"/>
        </div>
      </modal>

    </div>

    <!--关机界面-->
    <div v-if="params.switch === 'off'">

      <div class="ac_img">
        <div 
          v-if="deviceCategory == 1 || deviceCategory == 5001" 
          class="package"/>
        <div 
          v-else 
          class="hanging"/>
      </div>
      <div class="bottom">

        <ac-button class="cool disabled"/>
        <ac-button class="heat disabled"/>
        <ac-button class="dehumidify disabled"/>
        <ac-button 
          :info="buttonList.off" 
          class="switch off" 
          @tap="toggle" />
        <ac-button class="low disabled"/>
        <ac-button class="normal disabled"/>
        <ac-button class="high disabled"/>

      </div>
    </div>

    <!--初始化失败界面-->
    <div 
      v-if="initErr" 
      class="alert">
      <p 
        v-show="!loading" 
        @click="init">
      <i class="error"/>连接异常，请点击此处刷新</p>
      <p v-show="loading">
      <i class="spin"/>刷新中...</p>
      <!-- <img src='@lib/base/air_condition/assets/init_err.png' />
            <p class="tip">加载失败，请点击屏幕刷新</p> -->
    </div>
  </div>
</template>

<script>
import Modal from "@lib/components/Modal.vue"
import AcButton from "./components/AcButton.vue"
import Devider from "./components/Devider.vue"
import Icon from "@lib/components/SettingIcon.vue"

import watermark from "@lib/watermark"

const [MIN_TEMP, MAX_TEMP] = [16, 30]
const [POWER, MODE, SPEED, TEMPERATURE, WIND_UP_DOWN, WIND_LEFT_RIGHT, BOOT_SWITCH, OFF_SWITCH, SLEEP_MODE] = [
    "switch",
    "mode",
    "speed",
    "temperature",
    "wind_up_down",
    "wind_left_right",
    "bootSwitch",
    "offSwitch",
    "sleep_mode"
]
const [ON, OFF] = ["on", "off"]
const NODE_ID = "airconditioner.main."
//连续设置时间判断间隔
const SPAN = 600
//loading效果延迟
const LOADING_DELAY = 800
//loading class
const LOADING_CLASS = "loading"
//提示持续时间--3s
const TIP_DURATION = 3000

//Button构造方法
function Button(title, type, value, tip) {
    return {
        title,
        type,
        value,
        tip
    }
}

var temperatureRadio = 10

export default {
    components: { AcButton, Devider, Modal, Icon },
    data() {
        this.buttonList = {
            //模式
            cool: Button("制冷", MODE, "cold", "制冷模式切换成功"),
            heat: Button("制热", MODE, "heat", "制热模式切换成功"),
            dehumidify: Button("除湿", MODE, "dehumidify", "除湿模式切换成功"),
            mode_auto: Button("智能", MODE, "auto", "智能模式切换成功"),
            wind: Button("送风", MODE, "wind", "送风模式切换成功"),

            //风速
            low: Button("低风", SPEED, "low", "低风切换成功"),
            normal: Button("中风", SPEED, "normal", "中风切换成功"),
            high: Button("高风", SPEED, "high", "高风切换成功"),

            //电源开关
            on: Button("", POWER, "", ""),
            off: Button("", POWER, "", ""),

            //扫风
            lrBtn: Button("左右", WIND_LEFT_RIGHT, ""),
            udBtn: Button("上下", WIND_UP_DOWN, ""),

            //睡眠
            sleepMode: Button("静眠", SLEEP_MODE, "", ""),

            //温度
            minusBtn: {
                type: TEMPERATURE,
                value: -1,
                continuousClick: true
            },
            plusBtn: {
                type: TEMPERATURE,
                value: 1,
                continuousClick: true
            }
        }

        this.loadingTimer = null
        this.loadingElement = null
        this.curButton = null

        return {
            //设备名称
            deviceName: "",
            //空调类型，0：挂机，1：柜机
            deviceCategory: -1,
            params: {
                //开关
                switch: "",
                //温度
                temperature: null,
                //模式
                mode: "",
                //风速
                speed: "",
                //上下扫风
                wind_up_down: "",
                //左右扫风
                wind_left_right: "",
                //                        sleep: false,//睡眠模式
                bootSwitch: false,
                offSwitch: false,
                //开机时间
                bootTime: "",
                //关机时间
                offTime: "",
                sleep_mode: ""
            },
            //提示，3秒后隐藏
            tip: "",
            //提示计时器
            tipTimer: "",
            //更多菜单是否可见
            showMore: false,
            //开机时间选择器是否可见
            bootTpVisible: false,
            //关机时间选择器是否可见
            offTpVisible: false,
            tempFlag: false,
            tempTimer: null,
            fakeTemp: "--",
            //页面初始化失败
            initErr: false,
            loading: false
        }
    },
    computed: {
        appClassObj: function() {
            return {
                main: true,
                page_on: this.params.switch == "on",
                page_off: this.params.switch == "off"
            }
        },
        modeText() {
            return {
                cold: "制冷模式",
                heat: "制热模式",
                dehumidify: "除湿模式",
                auto: "智能模式",
                wind: "送风模式"
            }[this.params.mode]
        },
        speedText() {
            return {
                low: "低风",
                overlow: "低风",
                normal: "中风",
                overnormal: "中风",
                high: "高风"
                // 'auto': '自动风'
            }[this.params.speed]
        }
    },
    watch: {
        tempFlag(val) {
            if (!val) {
                this.setParam(TEMPERATURE, this.fakeTemp, "温度设置成功", this.curButton)
            }
        }
    },
    //        mounted: function () {
    created: function() {
        let that = this
        HdSmart.ready(() => {
            if (window.device_name) {
                this.deviceName = window.device_name
            }

            if (window.user_name && window.phone) {
                watermark({ el: "#app" })
            }

            that.init()

            //监听设备状态report
            HdSmart.onDeviceStateChange(data => {
                that.onSuccess(data.result)
            })
        })
    },
    methods: {
        //初始化，获取设备快照
        init() {
            this.loading = true
            HdSmart.Device.getSnapShot(
                data => {
                    this.loading = false
                    HdSmart.UI.hideLoading()
                    this.onSuccess(data)
                },
                () => {
                    this.loading = false
                    HdSmart.UI.hideLoading()
                    this.onError()
                }
            )
        },
        onSuccess(data) {
            if (data && data.attribute) {
                //设备故障
                if (data.attribute.operation === "abnormal") {
                    this.onError()
                } else {
                    this.initErr = false
                    this.setState(data.attribute)
                    this.deviceCategory = data.attribute.deviceSubCategory
                }
            }
        },
        onError() {
            this.initErr = true
            this.params.switch = "on"
            this.fakeTemp = "--"
        },
        //设置全量状态
        setState(attr) {
            //设置空调状态
            if (!attr) {
                return
            }

            for (var k in attr) {
                // if (this.operationFlag && k == this.operationKey) {
                //     continue;
                // }
                switch (k) {
                    case "switchStatus":
                        this.params.switch = attr.switchStatus
                        break
                    case "temperature":
                        this.params.temperature = attr.temperature / temperatureRadio
                        break
                    default:
                        this.params[k] = attr[k]
                        break
                }
            }

            if (!this.tempFlag) {
                this.fakeTemp = this.params.temperature
            }

            if (attr.enforce_mode == "on") {
                this.params.speed = "high"
            }
        },
        toggle(type, value, tip, el) {
            let str = ""
            let newValue = this.negation(this.params[type])

            if (newValue === OFF || newValue === false) {
                str = "已关闭"
            } else if (newValue === ON || newValue === true) {
                str = "已启动"
            } else {
                str = ""
            }

            switch (type) {
                case WIND_LEFT_RIGHT:
                    this.setParam(type, newValue, "左右扫风" + str, el)
                    break
                case WIND_UP_DOWN:
                    this.setParam(type, newValue, "上下扫风" + str, el)
                    break
                case SLEEP_MODE:
                    this.setParam(type, newValue, "静眠模式" + str, el)
                    break
                default:
                    this.setParam(type, newValue, tip, el)
                    break
            }
        },
        setParam(type, value, tip, el) {
            let that = this

            //初始化失败，则按钮不能操作
            if (that.initErr) {
                return
            }

            if (type == "speed" && that.params.mode == "dehumidify") {
                that.setTip("除湿模式下不可设置风速")
                return
            }

            //如果参数值没有变化，直接返回(设置温度除外)
            if (that.params[type] === value && type !== TEMPERATURE) {
                return
            }

            if (el && el.classList.contains("disabled")) {
                return
            }

            that.addLoading(el)

            let attr = {}
            attr[type] = type == TEMPERATURE ? value * temperatureRadio : value

            // clearTimeout(this.operationDelay);
            // this.operationFlag = true;
            // this.operationKey = type;
            // this.operationValue = attr[type];
            // this.operationDelay = setTimeout(() => {
            //     this.operationFlag = false;
            // }, 1500);

            //发送指令
            HdSmart.Device.control(
                {
                    method: "dm_set",
                    nodeid: NODE_ID + type,
                    params: {
                        attribute: attr
                    }
                },
                () => {
                    that.removeLoading()
                    if (type != "temperature") {
                        that.params[type] = value
                    }
                    that.setTip(tip)
                },
                data => {
                    that.removeLoading()

                    if (type === TEMPERATURE) {
                        that.fakeTemp = that.params.temperature
                    }
                    that.setTip("设置失败")
                }
            )
        },
        //添加loading效果
        addLoading(el) {
            if (!el) {
                return
            }

            this.removeLoading()
            this.loadingTimer = setTimeout(() => {
                //                    this.removeLoading();

                this.loadingElement = el
                this.loadingElement.classList.add(LOADING_CLASS)
            }, LOADING_DELAY)
        },
        //移除按钮loading
        removeLoading() {
            clearTimeout(this.loadingTimer)

            if (this.loadingElement) {
                this.loadingElement.classList.remove(LOADING_CLASS)
                this.loadingElement = null
            }
        },
        setTemperature(type, value, tip, el) {
            value = this.fakeTemp + value

            if (this.params.mode === "auto") {
                this.setTip("智能模式下不能设置温度")
                return
            }

            //限制温度范围16-30℃。TODO：智能模式19-25，24-30
            if (value < MIN_TEMP) {
                if (this.params.temperature == MIN_TEMP) {
                    this.setTip("温度已调至最低")
                    return
                } else {
                    value = MIN_TEMP
                }
            }

            if (value > MAX_TEMP) {
                if (this.params.temperature == MAX_TEMP) {
                    this.setTip("温度已调至最高")
                    return
                } else {
                    value = MAX_TEMP
                }
            }

            this.tempFlag = true
            this.fakeTemp = value
            this.curButton = el
            //设置timer
            clearTimeout(this.tempTimer)
            this.tempTimer = setTimeout(() => {
                this.tempFlag = false
            }, SPAN)
        },
        setTip(tip) {
            this.tip = tip || ""
            clearTimeout(this.tipTimer)
            this.tipTimer = setTimeout(() => {
                this.tip = ""
            }, TIP_DURATION)
        },
        screenClick() {
            if (this.initErr) {
                //初始化失败，点击屏幕，重新获取数据
                HdSmart.UI.showLoading()
                this.init()
            } else {
                //其他情况，点击屏幕，隐藏子菜单
                this.showMore = false
            }
        },
        //取反
        negation(value) {
            switch (value) {
                case ON:
                    return OFF
                case OFF:
                    return ON
                case true:
                    return false
                case false:
                    return true
                default:
                    return value
            }
        },
        isResetCommand(type, value) {
            let obj = {}
            obj[TEMPERATURE] = this.params[TEMPERATURE]
            obj[SPEED] = this.params[SPEED]
            obj[MODE] = this.params[MODE]
            obj[type] = value

            if (type != TEMPERATURE) {
                obj[TEMPERATURE] = this.fakeTemp
            }

            if (obj[TEMPERATURE] === MAX_TEMP && obj[SPEED] === "low" && obj[MODE] === "cold") {
                if (type == TEMPERATURE) {
                    this.fakeTemp = this.params[TEMPERATURE]
                }
                return true
            }

            return false
        }
    }
}
</script>
<style lang="less" scoped>
@lib: '../../../lib';
</style>
