<template>
<div id="app">
    <div class="page-on" v-show="status =='error' || model.switch=='on'">
        <div class="ani"></div>
        <div class="inner">
            <div class="device_name">{{device_name}}</div>
            <div class="status">{{statusText}}</div>
            <div class="current_temp">
                <strong>{{model.temperature}}</strong>
                <small>℃</small>
                <p>当前温度</p>
            </div>
            <div class="set_temp">
                <p><span>预设温度</span>{{temp}}℃</p>
                <a href="" class="btn btn-reduce" :class="{disabled:tempDisabled}" @click.prevent="setTempDown"><i></i></a>
                <a href="" class="btn btn-add" :class="{disabled:tempDisabled}" @click.prevent="setTempUp"><i></i></a>
                <div class="slider">
                    <slider ref="tempSlider" v-model="temp" :options="sliderOptions" @change="onTempChange" :disabled="tempDisabled" />
                    <span class="min">{{sliderOptions.range.min}}℃</span>
                    <span class="max">{{sliderOptions.range.max}}℃</span>
                </div>
            </div>
            <div class="btns">
                <a href="" class="btn btn-shut" @click.prevent="setSwitch('off')">
                    <i></i>
                    <span>关闭</span>
                </a>

                <a href="" class="btn btn-heating_half" :class="{active:model.mode=='half_tank'}" @click.prevent="setMode('half_tank')">
                    <i></i>
                    <span>半胆速热</span>
                </a>
                <a href="" class="btn btn-heating_whole" :class="{active:model.mode=='full_tank'}" @click.prevent="setMode('full_tank')">
                    <i></i>
                    <span>整胆加热</span>
                </a>
                <a href="" class="btn btn-heating_append" :class="{active:model.mode=='max_volume'}" @click.prevent="setMode('max_volume')">
                    <i></i>
                    <span>蓄热增容</span>
                </a>
                <a href="" class="btn btn-intelligentbath" :class="{active:model.mode=='smart'}" @click.prevent="setMode('smart')">
                    <i></i>
                    <span>智能沐浴</span>
                </a>
            </div>
        </div>
    </div>

    <div class="page-off" v-show="model.switch=='off'">
        <div class="device_name">{{device_name}}</div>
        <div class="status">已关闭</div>
        <div class="pic"></div>
        <div class="btns">
            <a href="" class="btn btn-turnon" @click.prevent="setSwitch('on')">
                <i></i>
            </a>
        </div>
    </div>

    <div class="alert-wraper" v-if="model.fault && model.fault!='normal'">
        <div class="alert">
            <i></i> {{errorText}}
        </div>
    </div>
</div>
</template>

<style lang="less">
* {
    padding: 0;
    margin: 0;
}
html,
body {
    overflow: hidden;
}
body {
    -webkit-tap-highlight-color: transparent;
}
#app {
    font-size: 24px;
    color: #fff;
}
a {
    color: #fff;
    text-decoration: none;
}
.page-on {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: #1eb0ff;
    overflow: hidden;
}
.page-off {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-image: linear-gradient(-180deg, #fafafa 0%, #f2f2f2 100%);
    .device_name {
        color: #76787a;
    }
    .status {
        color: #c8cacc;
    }
    .pic {
        width: 450px;
        height: 450px;
        background: url(./assets/img_heater_off2.png) no-repeat;
        background-size: 100% 100%;
        margin: 0 auto;
    }
}
.inner {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}
.device_name {
    text-align: center;
    font-size: 30px;
    height: 30px;
    margin-top: 140px;
}
.status {
    text-align: center;
    opacity: 0.6;
    height: 30px;
    margin-top: 20px;
}
.current_temp {
    text-align: center;
    margin-top: 30px;
    strong {
        font-size: 144px;
        font-weight: normal;
        line-height: 1.2;
    }
    small {
        font-size: 28px;
    }
    p {
        opacity: 0.6;
    }
}
.set_temp {
    text-align: center;
    height: 160px;
    width: 1200px;
    margin: 70px auto 0;
    position: relative;
    p {
        span {
            opacity: 0.6;
        }
        margin-bottom: 44px;
    }
    .slider {
        span {
            position: absolute;
            width: 50px;
            text-align: center;
            padding-top: 30px;
            color: rgba(0, 0, 0, 0.4);
            &:before {
                content: "";
                width: 15px;
                height: 15px;
                background: #fff;
                position: absolute;
                top: -10px;
                left: 50%;
                transform: translateX(-50%);
                border-radius: 100%;
            }
        }
        .min {
            left: -25px;
        }
        .max {
            right: -25px;
        }
    }
}
.btns {
    display: flex;
    justify-content: center;
    .btn {
        margin: 0 48px;
    }
}
.btn {
    text-align: center;
    i {
        display: inline-block;
        width: 144px;
        height: 144px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }
    span {
        display: block;
        line-height: 2;
        opacity: 0.5;
    }
    &:active span {
        opacity: 0.45;
    }
    &.active span {
        opacity: 1;
    }
    &.disabled {
        opacity: 0.6;
    }
}
.btn-add {
    position: absolute;
    top: 40px;
    right: -130px;
    i {
        background-image: url(./assets/icon_heater_increase.png);
        width: 80px;
        height: 80px;
    }
    &:active {
        opacity: 0.8;
    }
    &.disabled {
        opacity: 0.5;
    }
}
.btn-reduce {
    position: absolute;
    top: 40px;
    left: -130px;
    i {
        background-image: url(./assets/icon_heater_subtract.png);
        width: 80px;
        height: 80px;
    }
    &:active {
        opacity: 0.8;
    }
    &.disabled {
        opacity: 0.5;
    }
}
.btn-turnon {
    i {
        background-image: url(./assets/washer_btn_poweron_normal.png);
    }
    &:active i {
        background-image: url(./assets/washer_btn_poweron_pressed.png);
    }
}
.btn-shut {
    i {
        background-image: url(./assets/washer_btn_poweroff_normal.png);
    }
    &:active i {
        background-image: url(./assets/washer_btn_poweroff_pressed.png);
    }
}
.btn-heating_half {
    i {
        background-image: url(./assets/btn_heating_half.png);
    }
    &:active i {
        background-image: url(./assets/btn_heating_half_pressed.png);
    }
    &.active i {
        background-image: url(./assets/btn_heating_half_selected.png);
    }
}
.btn-heating_whole {
    i {
        background-image: url(./assets/btn_heating_whole.png);
    }
    &:active i {
        background-image: url(./assets/btn_heating_whole_pressed.png);
    }
    &.active i {
        background-image: url(./assets/btn_heating_whole_selected.png);
    }
}
.btn-heating_append {
    i {
        background-image: url(./assets/btn_heating_append.png);
    }
    &:active i {
        background-image: url(./assets/btn_heating_append_pressed.png);
    }
    &.active i {
        background-image: url(./assets/btn_heating_append_selected.png);
    }
}
.btn-intelligentbath {
    i {
        background-image: url(./assets/btn_intelligentbath.png);
    }
    &:active i {
        background-image: url(./assets/btn_intelligentbath_pressed.png);
    }
    &.active i {
        background-image: url(./assets/btn_intelligentbath_selected.png);
    }
}
.ani {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
}
.bubble {
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(255, 255, 255, 0.1);
    width: 62px;
    height: 62px;
    border-radius: 100%;
    transition: all 20s;
    transform: translateX(-50%);
}

.alert-wraper {
    position: fixed;
    left: 0;
    width: 100%;
    top: 96px;
    .alert {
        background: rgba(51, 51, 51, 0.75);
        width: 100%;
        height: 84px;
        line-height: 84px;
        text-align: center;
        color: #fff;
        font-size: 30px;
        margin-bottom: 4px;
        i {
            display: inline-block;
            width: 34px;
            height: 34px;
            background: url(./assets/icn_notice_white_s.png) no-repeat;
            background-size: 34px;
            margin-right: 13px;
            vertical-align: text-bottom;
        }
        .close {
            float: right;
            display: inline-block;
            width: 30px;
            height: 30px;
            background: url(./assets/btn_close_white_normal.png) no-repeat;
            background-size: 30px;
            margin-top: 27px;
            margin-right: 26px;
            &:active {
                background-image: url(./assets/btn_close_pressed.png);
            }
        }
        &.warn {
            background: rgba(242, 97, 97, 0.9);
        }
    }
}
</style>

<script>
import Slider from "./components/Slider.vue";

const [TEMP_MIN, TEMP_MAX] = [30, 75];

function createBubble(container, option) {
    if (!container) return;

    var el = document.createElement("div");
    el.className = "bubble";
    el.style.left = option.left + "px";
    el.style.top = option.top + "px";
    el.style.width = el.style.height = "50px";

    container.appendChild(el);

    el.addEventListener(
        "transitionend",
        function() {
            container.removeChild(container.firstChild);
        },
        false
    );

    setTimeout(function() {
        el.style.top = "-200px";
        el.style.width = el.style.height = "100px";
    }, 100);
}

export default {
    components: {
        Slider
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
            status: ''
        };
    },
    computed: {
        statusText() {
            switch (this.model.heat_status) {
                case "heat":
                    return "正在加热";
                case "keep_warm":
                    return "保温";
                case "reserve":
                    return "预约";
                default:
                    return "";
            }
        },
        tempDisabled() {
            return this.model.mode == "max_volume";
        },
        errorText() {
            switch (this.model.fault) {
                case "normal":
                    return "正常";
                case "dry_heat":
                    return "热水器干烧，请检查设备";
                case "sensor_error":
                    return "热水器传感器故障，请检查设备";
                case "over_temperature":
                    return "热水器超温，请检查设备";
                default:
                    return "热水器故障，请检查设备";
            }
        }
    },
    watch: {
        "model.set_temperature"(val) {}
    },
    methods: {
        controlDevice(attr, value) {
            if (this.model.fault && this.model.fault != "normal") {
                HdSmart.UI.toast(this.errorText);
                return;
            }
            //切换模式的时候加上温度字段
            let temperature = {};
            if (attr === "mode") {
                let oldVal = this.getOldTemperature(value);
                temperature = oldVal ? { set_temperature: oldVal } : {};
            }

            HdSmart.Device.control(
                {
                    nodeid: `water_heater.main.${
                        attr === "mode" ? "custom" : attr
                    }`,
                    params: {
                        attribute: {
                            [attr]: value,
                            ...temperature
                        }
                    }
                },
                () => {},
                () => {}
            );
        },
        setTempUp() {
            if (this.tempDisabled) {
                return;
            }
            if (this.temp < TEMP_MAX) {
                this.temp++;
            }
        },
        setTempDown() {
            if (this.tempDisabled) {
                return;
            }
            if (this.temp > TEMP_MIN) {
                this.temp--;
            }
        },
        onTempChange(val) {
            if (val == this.model.set_temperature) {
                return;
            }

            //缓存设置的温度到本地
            this.setOldTemperature(val);
            this.controlDevice("set_temperature", val);
        },
        setSwitch(val) {
            this.controlDevice("switch", val);
        },
        setMode(val) {
            this.$refs.tempSlider.isUpdating = false;
            this.controlDevice("mode", val);
        },
        getSnapShot() {
            HdSmart.Device.getSnapShot(data => {
                HdSmart.UI.hideLoading();
                this.onSuccess(data);
                //初始化缓存温度
                this.setOldTemperature(this.model.set_temperature);
            }, () => {
                this.status = 'error'
                HdSmart.UI.hideLoading();
            });
        },
        onSuccess(data) {
            this.status = 'success'
            this.model = data.attribute;
            if (!this.$refs.tempSlider.isUpdating) {
                this.temp = this.model.set_temperature;
            }
        },
        //从本地缓存中获取温度数据
        getOldTemperature(mode) {
            return (window.device_uuid && this.getCurrentStorage()[mode]) || 0;
        },
        //获取当前device_uuid的缓存object
        getCurrentStorage() {
            return (
                (localStorage.getItem(window.device_uuid) &&
                    JSON.parse(localStorage.getItem(window.device_uuid))) ||
                {}
            );
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
                );
            }
        }
    },
    created() {
        HdSmart.ready(() => {
            if (window.device_name) {
                this.device_name = window.device_name;
            }

            this.getSnapShot();
        });

        HdSmart.onDeviceStateChange(data => {
            this.onSuccess(data.result);
        });
    },
    mounted() {
        var el = this.$el.querySelector(".ani");
        var top = document.documentElement.offsetHeight;
        var width = document.documentElement.offsetWidth;
        setInterval(() => {
            if (this.model.switch == "on") {
                createBubble(el, {
                    left: Math.random() * width,
                    top: top
                });
            }
        }, 1500);
    }
};
</script>
