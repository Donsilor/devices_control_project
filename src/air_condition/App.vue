<template>
    <div id="app" :class="appClassObj" @click="screenClick">
        <p class="title">{{ deviceName }}</p>
        <p class="status" v-show="params.switch === 'on'">
            {{modeText}}
            {{speedText}}
            {{params.env_temperature ? '环境温度' + params.env_temperature/10 + '℃' : ''}}
        </p>
        <p class="tip" v-show="params.switch === 'off'">已关闭</p>

        <svg class="bg" xmlns="http://www.w3.org/2000/svg" width="1920" heigth="420" viewBox="0 0 1920 420">
            <defs>
                <linearGradient id="lg1" gradientUnits="userSpaceOnUse" x1="961.4509" y1="421.0971" x2="961.4509" y2="1.0971">
                    <stop offset="0" style="stop-color:#FFFFFF; stop-opacity:0" />
                    <stop offset="1" style="stop-color:#FFFFFF; stop-opacity:0.3" />
                </linearGradient>
            </defs>
            <path d="M1321.5,121.1c-320,0-640-120-960-120c-120,0-240,16.9-360,38v382h1920v-382 C1721.5,74.2,1521.5,121.1,1321.5,121.1z" style="fill:url(#lg1);" />
        </svg>

        <!--开机界面-->
        <div v-if="initErr || params.switch === 'on'">
            <!--温度Start-->
            <div class="temp">

                <ac-button class="minus" :class="{disabled:params.mode=='wind'}" :info="buttonList.minusBtn" @tap="setTemperature"></ac-button>
                <div class="temp-show">
                    <label class="temp-number">{{ fakeTemp }}</label>
                    <label class="temp-unit">℃</label>
                </div>
                <ac-button class="plus" :class="{disabled:params.mode=='wind'}" :info="buttonList.plusBtn" @tap="setTemperature"></ac-button>
            </div>
            <!--温度End-->

            <p :class="{'tip':true, 'transparent': tip.length == 0}">{{ tip }}</p>

            <!--底部按钮Start-->
            <div class="bottom">

                <ac-button class="cool" :class="{active:params.mode=='cold'}" :info="buttonList.cool" @tap="setParam"></ac-button>
                <ac-button class="heat" :class="{active:params.mode=='heat'}" :info="buttonList.heat" @tap="setParam"></ac-button>
                <ac-button class="dehumidify" :class="{active:params.mode=='dehumidify'}" :info="buttonList.dehumidify" @tap="setParam"></ac-button>
                <ac-button class="switch on" :info="buttonList.on" @tap="toggle"></ac-button>
                <ac-button class="low" :class="{active:params.speed=='low'}" :info="buttonList.low" @tap="setParam"></ac-button>
                <ac-button class="normal" :class="{active:params.speed=='normal'}" :info="buttonList.normal" @tap="setParam"></ac-button>
                <ac-button class="high" :class="{active:params.speed=='high'}" :info="buttonList.high" @tap="setParam"></ac-button>
            </div>
            <!--底部按钮End-->

            <div class="more" v-show="!showMore" @click.stop="showMore=true;"></div>
            <!--更多子菜单Start-->
            <transition name="fade-in">
                <div class="subMenu" v-show="showMore" @click.stop="">
                    <devider :content="'模式'"></devider>
                    <div class="more-mode">
                        <ac-button class="mode_auto" :class="{active:params.mode=='auto'}" :info="buttonList.mode_auto" @tap="setParam"></ac-button>
                        <ac-button class="wind" :class="{active:params.mode=='wind'}" :info="buttonList.wind" @tap="setParam"></ac-button>
                    </div>
                    <devider :content="'摆风'"></devider>
                    <div class="more-wind-direction">
                        <!-- <ac-button class="lr" :class="{active:params.wind_left_right=='on'}" :info="buttonList.lrBtn" @tap="toggle"></ac-button> -->
                        <ac-button class="ud" :class="{active:params.wind_up_down=='on'}" :info="buttonList.udBtn" @tap="toggle"></ac-button>
                    </div>
                </div>
            </transition>

        </div>

        <!--关机界面-->
        <div v-if="params.switch === 'off'">

            <div class="hanging"></div>
            <!-- <div class="package"></div> -->

            <div class="bottom">

                <ac-button class="cool disabled"></ac-button>
                <ac-button class="heat disabled"></ac-button>
                <ac-button class="dehumidify disabled"></ac-button>
                <ac-button class="switch off" :info="buttonList.off" @tap="toggle" />
                <ac-button class="low disabled"></ac-button>
                <ac-button class="normal disabled"></ac-button>
                <ac-button class="high disabled"></ac-button>

            </div>
        </div>

        <!--初始化失败界面-->
        <div class="alert" v-if="initErr">
            <p v-show="!loading" @click="init">
                <i class="error"></i>连接异常，请点击此处刷新</p>
            <p v-show="loading">
                <i class="spin"></i>刷新中...</p>
            <!-- <img src='../../lib/base/air_condition/assets/init_err.png' />
            <p class="tip">加载失败，请点击屏幕刷新</p> -->
        </div>
    </div>
</template>

<script>
import AcButton from "./components/AcButton.vue";
import Devider from "./components/Devider.vue";

import watermark from "../../lib/watermark";

const [MIN_TEMP, MAX_TEMP] = [16, 30];
const [
    POWER,
    MODE,
    SPEED,
    TEMPERATURE,
    WIND_UP_DOWN,
    WIND_LEFT_RIGHT,
    BOOT_SWITCH,
    OFF_SWITCH
] = [
    "switch",
    "mode",
    "speed",
    "temperature",
    "wind_up_down",
    "wind_left_right",
    "bootSwitch",
    "offSwitch"
];
const [ON, OFF] = ["on", "off"];
const NODE_ID = "airconditioner.main.";
//连续设置时间判断间隔
const SPAN = 600;
//loading效果延迟
const LOADING_DELAY = 800;
//loading class
const LOADING_CLASS = "loading";
//提示持续时间--3s
const TIP_DURATION = 3000;

//Button构造方法
function Button(title, type, value, tip) {
    return {
        title,
        type,
        value,
        tip
    };
}

var temperatureRadio = 1;

export default {
    components: { AcButton, Devider },
    data() {
        return {
            buttonList: {
                //模式
                cool: Button("制冷", MODE, "cold", "制冷模式切换成功"),
                heat: Button("制热", MODE, "heat", "制热模式切换成功"),
                dehumidify: Button(
                    "除湿",
                    MODE,
                    "dehumidify",
                    "除湿模式切换成功"
                ),
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
            },
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
                offTime: ""
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
            fakeTemp: null,
            loadingTimer: null,
            loadingElement: null,
            //当前点击的按钮
            curButton: null,
            //页面初始化失败
            initErr: false,
            loading: false
        };
    },
    computed: {
        appClassObj: function() {
            // let obj = {main: true};
            // obj.page_on =
            // obj['page_'+this.params.switch] = true;
            // obj['err'] = this.initErr;
            return {
                main: true,
                page_on: this.params.switch == "on" || this.initErr,
                page_off: this.params.switch == "off"
            };
        },
        modeText() {
            return {
                cold: "制冷模式",
                heat: "制热模式",
                dehumidify: "除湿模式",
                auto: "智能模式",
                wind: "送风模式"
            }[this.params.mode];
        },
        speedText() {
            return {
                low: "低风",
                overlow: "低风",
                normal: "中风",
                overnormal: "中风",
                high: "高风"
                // 'auto': '自动风'
            }[this.params.speed];
        },
        envTempText() {
            return
        }
    },
    watch: {
        tempFlag(val) {
            if (!val) {
                this.setParam(
                    TEMPERATURE,
                    this.fakeTemp,
                    "温度设置成功",
                    this.curButton
                );
            }
        }
    },
    //        mounted: function () {
    created: function() {
        let that = this;
        HdSmart.ready(() => {
            if (window.device_name) {
                this.deviceName = window.device_name;
            }

            if (window.user_name && window.phone) {
                watermark({ el: "#app" });
            }

            that.init();

            //监听设备状态report
            HdSmart.onDeviceStateChange(data => {
                that.onSuccess(data.result);
            });
        });
    },
    methods: {
        //初始化，获取设备快照
        init() {
            this.loading = true;
            HdSmart.Device.getSnapShot(
                data => {
                    this.loading = false;
                    HdSmart.UI.hideLoading();
                    this.onSuccess(data);
                },
                () => {
                    this.loading = false;
                    HdSmart.UI.hideLoading();
                    this.onError();
                }
            );
        },
        onSuccess(data) {
            if (data && data.attribute) {
                //设备故障
                if (data.attribute.operation == "abnormal") {
                    this.onError();
                } else {
                    this.initErr = false;
                    this.setState(data.attribute);
                    this.deviceCategory = data.attribute.deviceSubCategory;
                }
            }
        },
        onError() {
            this.initErr = true;
            this.fakeTemp = "--";
        },
        //设置全量状态
        setState(attr) {
            //设置空调状态
            if (!attr) {
                return;
            }

            if (attr.temperature > 100) {
                temperatureRadio = 10;
            }

            for (var k in attr) {
                if (this.operationFlag && k == this.operationKey) {
                    continue;
                }
                switch (k) {
                    case "switchStatus":
                        this.params.switch = attr.switchStatus;
                        break;
                    case "temperature":
                        this.params.temperature =
                            attr.temperature / temperatureRadio;
                        this.fakeTemp = attr.temperature / temperatureRadio;
                        break;
                    default:
                        this.params[k] = attr[k];
                        break;
                }
            }

            if (this.params.mode == "wind" && attr.env_temperature) {
                this.fakeTemp =
                    attr.env_temperature >= 100
                        ? attr.env_temperature / 10
                        : attr.env_temperature;
            }
        },
        toggle(type, value, tip, el) {
            let str = "";
            let newValue = this.negation(this.params[type]);

            if (newValue === OFF || newValue === false) {
                str = "已关闭";
            } else if (newValue === ON || newValue === true) {
                str = "已启动";
            } else {
                str = "";
            }

            switch (type) {
                case WIND_LEFT_RIGHT:
                    this.setParam(type, newValue, "左右扫风" + str, el);
                    break;
                case WIND_UP_DOWN:
                    this.setParam(type, newValue, "上下扫风" + str, el);
                    break;
                default:
                    this.setParam(type, newValue, tip, el);
                    break;
            }
        },
        setParam(type, value, tip, el) {
            let that = this;

            //初始化失败，则按钮不能操作
            if (that.initErr) {
                return;
            }

            //如果参数值没有变化，直接返回(设置温度除外)
            if (that.params[type] === value && type !== TEMPERATURE) {
                return;
            }

            //判断是否为重置命令
            if (that.isResetCommand(type, value)) {
                //如果当前设置的是温度，需要改回去
                if (type === TEMPERATURE) {
                    that.fakeTemp = that.params.temperature;
                }
                return;
            }

            if (el && el.classList.contains("disabled")) {
                return;
            }

            that.addLoading(el);

            let attr = {};
            attr[type] = type == TEMPERATURE ? value * temperatureRadio : value;

            clearTimeout(this.operationDelay);
            this.operationFlag = true;
            this.operationKey = type;
            this.operationValue = attr[type];
            this.operationDelay = setTimeout(() => {
                this.operationFlag = false;
            }, 1500);
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
                    that.removeLoading();

                    that.params[type] = value;
                    that.setTip(tip);
                },
                data => {
                    that.removeLoading();

                    if (type === TEMPERATURE) {
                        that.fakeTemp = that.params.temperature;
                    }
                    that.setTip("设置失败");
                }
            );
        },
        //添加loading效果
        addLoading(el) {
            if (!el) {
                return;
            }

            this.removeLoading();
            this.loadingTimer = setTimeout(() => {
                //                    this.removeLoading();

                this.loadingElement = el;
                this.loadingElement.classList.add(LOADING_CLASS);
            }, LOADING_DELAY);
        },
        //移除按钮loading
        removeLoading() {
            clearTimeout(this.loadingTimer);

            if (this.loadingElement) {
                this.loadingElement.classList.remove(LOADING_CLASS);
                this.loadingElement = null;
            }
        },
        setTemperature(type, value, tip, el) {
            if (this.initErr) {
                return;
            }

            value = this.fakeTemp + value;

            //送风模式不能设置温度
            if (this.params.mode === "wind") {
                this.setTip("送风模式下不能设置温度");
                return;
            }

            //限制温度范围16-30℃。TODO：智能模式19-25，24-30
            if (value < MIN_TEMP) {
                if (this.params.temperature == MIN_TEMP) {
                    this.setTip("温度已调至最低");
                    return;
                } else {
                    value = MIN_TEMP;
                }
            }

            if (value > MAX_TEMP) {
                if (this.params.temperature == MAX_TEMP) {
                    this.setTip("温度已调至最高");
                    return;
                } else {
                    value = MAX_TEMP;
                }
            }

            this.tempFlag = true;
            this.fakeTemp = value;
            this.curButton = el;
            //设置timer
            clearTimeout(this.tempTimer);
            this.tempTimer = setTimeout(() => {
                this.tempFlag = false;
            }, SPAN);
        },
        setTip(tip) {
            this.tip = tip || "";
            clearTimeout(this.tipTimer);
            this.tipTimer = setTimeout(() => {
                this.tip = "";
            }, TIP_DURATION);
        },
        screenClick() {
            this.showMore = false;
        },
        //取反
        negation(value) {
            switch (value) {
                case ON:
                    return OFF;
                case OFF:
                    return ON;
                case true:
                    return false;
                case false:
                    return true;
                default:
                    return value;
            }
        },
        isResetCommand(type, value) {
            let obj = {};
            obj[TEMPERATURE] = this.params[TEMPERATURE];
            obj[SPEED] = this.params[SPEED];
            obj[MODE] = this.params[MODE];
            obj[type] = value;

            if (
                obj[TEMPERATURE] === MAX_TEMP &&
                obj[SPEED] === "low" &&
                obj[MODE] === "cold"
            ) {
                return true;
            }

            return false;
        }
    }
};
</script>

<style lang="less">
* {
    margin: 0;
    padding: 0;
}

body {
    font: 24px/1 "NotoSansHans-Regular";
    color: #fff;
}
html,
body,
.main {
    height: 100%;
}
::-webkit-scrollbar {
    opacity: 0;
}

/*main样式*/
.main {
    box-sizing: border-box;
    padding: 155px 0 180px 0;
    text-align: center;
}
.main.page_on {
    background-color: #0bc0fe;
}
.main.page_off {
    background-color: #f2f2f2;
}
.main.err {
    padding-top: 264px;
    background: #f2f2f2;
}
.bg {
    position: absolute;
    left: 0;
    bottom: 180px;
    width: 100%;
    height: auto;
}

/*bottom样式*/
.bottom {
    display: flex;
    margin: 0 240px;
    justify-content: space-around;
    align-items: center;
    position: relative;
}
.bottom .imgWrapper {
    margin-bottom: 10px;
}

.hanging,
.package {
    height: 360px;
    margin-bottom: 45px;
}
.hanging {
    background: url(../../lib/base/air_condition/assets/bg_off_hanging.png)
        no-repeat center;
}
.package {
    background: url(../../lib/base/air_condition/assets/bg_off_package.png)
        no-repeat center;
    background-size: 540px 360px;
}

/*title样式*/
.title {
    font-size: 30px;
}
.page_off .title {
    color: #75787a;
}

/*温度*/
.temp {
    display: flex;
    justify-content: center;
    align-items: center;
}
.temp-show {
    width: 680px;
    text-align: center;
}
.temp-number {
    font-size: 240px;
    font-family: RobotoCondensed-Regular;
}
.temp-unit {
    font-size: 72px;
}

/*提示*/
.tip {
    min-height: 30px;
    font-size: 30px;
    margin: 24px 0 110px 0;
    opacity: 1;
    transition: opacity 1s linear;
    position: relative;
}
.tip.transparent {
    opacity: 0;
}
.page_off .tip {
    /*color: #c8cacc;*/
    color: #46bcff;
    margin: 24px 0;
    /*margin: 25px 0 37px 0;*/
}
.page_on .status {
    color: rgba(255, 255, 255, 0.6);
    margin: 24px 0 30px;
    font-size: 30px;
}
.err .tip {
    margin-top: 36px;
    color: #c8cacc;
}

/*图片*/
.temp img,
.bottom img {
    width: 144px;
    height: 144px;
}
.switch img {
    width: 204px;
    height: 204px;
}

.err img {
    width: 360px;
    height: 360px;
}

/*更多*/
.more,
.subMenu {
    position: absolute;
    right: 60px;
    top: 132px;
}
.more {
    width: 96px;
    height: 96px;
    background: url(../../lib/base/air_condition/assets/more_normal.png)
        no-repeat center;
    background-size: 96px 96px;
    outline: 0;
    cursor: pointer;
    /*扩展点击范围*/
    padding: 24px;
    top: 108px;
    right: 36px;
}
.more:hover {
    background-image: url(../../lib/base/air_condition/assets/more_active.png);
}

/*子菜单*/
.subMenu {
    opacity: 0.95;
    background: #ffffff;
    box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    border-radius: 6px;
    padding: 0 24px;
    /*width: 456px;*/
    /*height: 660px;*/
    width: 408px;
    height: 558px;
    color: #75787a;
    font-size: 24px;
}
.subMenu .button .imgWrapper {
    width: 117px;
    height: 117px;
    margin: 0 24px 18px 24px;
}
.subMenu .devider {
    /*margin-top: 30px;*/
    margin: 30px 0;
}
.more-timing {
    font-size: 30px;
    margin-top: 12px;
}

/*loading样式*/
.loading {
    position: relative;
}
.loading:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 144px;
    height: 144px;
    background: url("../../lib/base/air_condition/assets/buffering_mode_white.gif")
        no-repeat center;
    background-size: 100%;
    /*transform: translate3d(0,0,0);*/
    /*animation: circle 1s linear infinite;*/
}
.switch.loading:before {
    top: 12px;
    left: 12px;
    width: 180px;
    height: 180px;
}
.page_on .switch.loading:before {
    background: url("../../lib/base/air_condition/assets/buffering_power_white.gif")
        no-repeat center;
    background-size: 100%;
}
.page_off .switch.loading:before {
    background: url("../../lib/base/air_condition/assets/buffering_power_blue.gif")
        no-repeat center;
    background-size: 100%;
}
.subMenu .loading:before {
    background: url("../../lib/base/air_condition/assets/buffering_submenu_blue.gif")
        no-repeat center;
    background-size: 100%;
    width: 120px;
    height: 120px;
    top: 0;
    left: 24px;
}

.button {
    display: inline-block;
    .imgWrapper {
        width: 144px;
        height: 144px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }
    &:active {
        opacity: 0.8;
    }
    &.active {
        .btnName {
            opacity: 1;
        }
    }
}

/*按钮底部文字样式*/
.bottom .btnName {
    opacity: 0.5;
    line-height: 30px;
    display: inline-block;
}
.bottom .active .btnName {
    font-size: 30px;
}

.page_on .disabled .imgWrapper {
    opacity: 0.5;
}

.page_off .disabled .imgWrapper {
    filter: invert(18%);
}

.cool {
    .imgWrapper {
        background-image: url(../../lib/base/air_condition/assets/cool_normal.png);
    }
    &.active .imgWrapper {
        background-image: url(../../lib/base/air_condition/assets/cool_active.png);
    }
}
.heat {
    .imgWrapper {
        background-image: url(../../lib/base/air_condition/assets/heat_normal.png);
    }
    &.active .imgWrapper {
        background-image: url(../../lib/base/air_condition/assets/heat_active.png);
    }
}
.dehumidify {
    .imgWrapper {
        background-image: url(../../lib/base/air_condition/assets/dehumidify_normal.png);
    }
    &.active .imgWrapper {
        background-image: url(../../lib/base/air_condition/assets/dehumidify_active.png);
    }
}
.on {
    .imgWrapper {
        width: 204px;
        height: 204px;
        background-image: url(../../lib/base/air_condition/assets/on_normal.png);
    }
    &:active .imgWrapper {
        background-image: url(../../lib/base/air_condition/assets/on_active.png);
    }
}
.off {
    .imgWrapper {
        width: 204px;
        height: 204px;
        background-image: url(../../lib/base/air_condition/assets/off_normal.png);
    }
    &:active .imgWrapper {
        background-image: url(../../lib/base/air_condition/assets/off_active.png);
    }
}
.low {
    .imgWrapper {
        background-image: url(../../lib/base/air_condition/assets/low_normal.png);
    }
    &.active .imgWrapper {
        background-image: url(../../lib/base/air_condition/assets/low_active.png);
    }
}
.normal {
    .imgWrapper {
        background-image: url(../../lib/base/air_condition/assets/medium_normal.png);
    }
    &.active .imgWrapper {
        background-image: url(../../lib/base/air_condition/assets/medium_active.png);
    }
}
.high {
    .imgWrapper {
        background-image: url(../../lib/base/air_condition/assets/high_normal.png);
    }
    &.active .imgWrapper {
        background-image: url(../../lib/base/air_condition/assets/high_active.png);
    }
}
.minus {
    .imgWrapper {
        background-image: url(../../lib/base/air_condition/assets/minus_normal.png);
    }
    &:active .imgWrapper {
        background-image: url(../../lib/base/air_condition/assets/minus_pressed.png);
    }
}
.plus {
    .imgWrapper {
        background-image: url(../../lib/base/air_condition/assets/plus_normal.png);
    }
    &:active .imgWrapper {
        background-image: url(../../lib/base/air_condition/assets/plus_pressed.png);
    }
}
.mode_auto {
    .imgWrapper {
        background-image: url(../../lib/base/air_condition/assets/mode_auto_normal.png);
    }
    &.active .imgWrapper {
        background-image: url(../../lib/base/air_condition/assets/mode_auto_active.png);
    }
}
.wind {
    .imgWrapper {
        background-image: url(../../lib/base/air_condition/assets/mode_air_normal.png);
    }
    &.active .imgWrapper {
        background-image: url(../../lib/base/air_condition/assets/mode_air_active.png);
    }
}
.lr {
    .imgWrapper {
        background-image: url(../../lib/base/air_condition/assets/vertical_normal.png);
    }
    &.active .imgWrapper {
        background-image: url(../../lib/base/air_condition/assets/vertical_active.png);
    }
}
.ud {
    .imgWrapper {
        background-image: url(../../lib/base/air_condition/assets/horizontal_normal.png);
    }
    &.active .imgWrapper {
        background-image: url(../../lib/base/air_condition/assets/horizontal_active.png);
    }
}

.alert {
    position: fixed;
    left: 0;
    top: 96px;
    width: 100%;
    background: #fff7d9;
    height: 84px;
    line-height: 84px;
    font-size: 30px;
    color: #000000;
    text-align: center;
    overflow: hidden;
    i {
        display: inline-block;
        width: 36px;
        height: 36px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        vertical-align: -4px;
        margin-right: 10px;
    }
    .error {
        background-image: url(../../lib/base/air_condition/assets/icn_warn_s.png);
    }
    .spin {
        background-image: url(../../lib/base/air_condition/assets/buffering_updating.png);
        animation: rotate 1s linear infinite;
    }
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
