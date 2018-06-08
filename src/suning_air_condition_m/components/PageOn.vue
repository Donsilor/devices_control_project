<template>
    <div class="wrap-on">

        <div class="bg"></div>

        <div class="header">
            <span class="name">{{device.name}}</span>
        </div>

        <div class="current_temp">
            <span class="num">{{temperature}}</span>
            <span class="unit">℃</span>
        </div>

        <transition name="fade">
            <div class="tip" v-show="tipVisible">{{tip}}</div>
        </transition>

        <a href="#" class="btn-minus" @click.prevent="setTemperature(-1, $event)"></a>
        <a href="#" class="btn-add" @click.prevent="setTemperature(1, $event)"></a>

        <a href="#" class="btn-off" @click.prevent="setOff($event)"></a>

        <a href="#" class="btn-toggle" :class="{'btn-toggle-more':toggle}" @click.prevent="showMore()"></a>

        <div class="btns-hold">
            <ul class="btns">
                <li :class="{on:ac.mode==='cold'}">
                    <a href="#" class="btn-cold" :class="{on:ac.mode==='cold'}" @click.prevent="setMode('cold', $event)"></a>
                    制冷
                </li>
                <li :class="{on:ac.mode==='heat'}">
                    <a href="#" class="btn-heat" :class="{on:ac.mode==='heat'}" @click.prevent="setMode('heat', $event)"></a>
                    制热
                </li>
                <li :class="{on:ac.mode==='dehumidify'}">
                    <a href="#" class="btn-dehumidify" :class="{on:ac.mode==='dehumidify'}" @click.prevent="setMode('dehumidify', $event)"></a>
                    除湿
                </li>
                <li :class="{'on':ac.speed==='low'||ac.speed==='normal'||ac.speed==='high'}">
                    <a href="#" class="btn-speed" :class="{'btn-s1':ac.speed==='low','btn-s2':ac.speed==='normal','btn-s3':ac.speed==='high'}" @click.prevent="setSpeed($event)"></a>
                    <span v-show="ac.speed==='low'">低</span>
                    <span v-show="ac.speed==='normal'">中</span>
                    <span v-show="ac.speed==='high'">高</span>
                    <span v-show="ac.speed!=='low'&&ac.speed!=='normal'&&ac.speed!=='high'">风速</span>
                </li>
            </ul>

        </div>

        <div class="mask" v-show="toggle" @click="showMore()"></div>

        <div class="btns-more" v-show="toggle">
            <p>模式</p>
            <ul class="btns">
                <li :class="{on:ac.mode==='auto'}">
                    <a href="#" class="btn-auto" :class="{on:ac.mode==='auto'}" @click.prevent="setMode('auto', $event)"></a>
                    智能
                </li>
                <li :class="{on:ac.mode==='wind'}">
                    <a href="#" class="btn-wind" :class="{on:ac.mode==='wind'}" @click.prevent="setMode('wind', $event)"></a>
                    送风
                </li>
            </ul>
            <p>摆风</p>
            <ul class="btns">
                <li :class="{on:ac.wind_up_down==='on'}">
                    <a href="#" class="btn-vertical" :class="{on:ac.wind_up_down==='on'}" @click.prevent="setWind('wind_up_down', $event)"></a>
                    上下
                </li>
                <li :class="{on:ac.wind_left_right==='on'}" v-if="device.category_id === 1">
                    <a href="#" class="btn-horizontal" :class="{on:ac.wind_left_right==='on'}" @click.prevent="setWind('wind_left_right', $event)"></a>
                    左右
                </li>
            </ul>
        </div>

    </div>
</template>

<script>
const tips = {
    fail: "设置失败",
    temperature: "温度设置成功",
    speed_low: "低风切换成功",
    speed_normal: "中风切换成功",
    speed_high: "高风切换成功",
    speed_auto: "自动风速切换成功",
    mode_cold: "制冷模式切换成功",
    mode_auto: "智能模式切换成功",
    mode_heat: "制热模式切换成功",
    mode_dehumidify: "除湿模式切换成功",
    mode_wind: "送风模式切换成功",
    wind_up_down_on: "上下扫风已启动",
    wind_up_down_off: "上下扫风已关闭",
    wind_left_right_on: "左右扫风已启动",
    wind_left_right_off: "左右扫风已关闭",
    err_temp1: "送风模式下不能设置温度",
    err_temp2: "温度已调至最高",
    err_temp3: "温度已调至最低"
};
const SPEED = ["low", "normal", "high"];
const [MIN_TEMP, MAX_TEMP] = [16, 30];
let tempDelay,
    tempFlag = true;

export default {
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
            tip: ""
        };
    },
    methods: {
        //同步
        syncTemp() {
            if (tempFlag) {
                this.temperature = this.ac.temperature;
            }
        },
        setOff(event) {
            this.control(
                "switch",
                "off",
                event.target,
                () => {},
                this.onSetError()
            );
        },
        setTemperature(val, event) {
            var temp = this.temperature + val;

            if (temp < MIN_TEMP) {
                if (this.temperature == MIN_TEMP) {
                    this.showTip(tips.err_temp3);
                    return;
                } else {
                    temp = MIN_TEMP;
                }
            }

            if (temp > MAX_TEMP) {
                if (this.temperature == MAX_TEMP) {
                    this.showTip(tips.err_temp2);
                    return;
                } else {
                    temp = MAX_TEMP;
                }
            }

            if (this.checkCmd("temperature", temp)) {
                return;
            }
            if (this.ac.mode === "auto") {
                this.showTip("智能模式下不能设置温度");
                return;
            }
            this.temperature = temp;
            clearTimeout(tempDelay);
            tempFlag = false;
            tempDelay = setTimeout(() => {
                tempFlag = true;
                this.control(
                    "temperature",
                    this.temperature,
                    event.target,
                    this.onSetSuccess(tips.temperature),
                    this.onSetError(true)
                );
            }, 500);
        },
        setSpeed(event) {
            if (this.ac.mode == "dehumidify") {
                this.showTip("除湿模式下不可设置风速");
                return;
            }

            var index = SPEED.indexOf(this.ac.speed);
            var next = index === SPEED.length - 1 ? 0 : index + 1;
            var speed = SPEED[next];
            if (this.checkCmd("speed", speed)) {
                return;
            }
            this.control(
                "speed",
                speed,
                event.target,
                this.onSetSuccess(tips["speed_" + speed]),
                this.onSetError()
            );
        },
        setMode(mode, event) {
            if (this.checkCmd("mode", mode)) {
                return;
            }
            this.control(
                "mode",
                mode,
                event.target,
                this.onSetSuccess(tips["mode_" + mode]),
                this.onSetError()
            );
        },
        setWind(attr, event) {
            var val = this.ac[attr] === "on" ? "off" : "on";
            this.control(
                attr,
                val,
                event.target,
                this.onSetSuccess(tips[attr + "_" + val]),
                this.onSetError()
            );
        },
        showMore() {
            this.toggle = !this.toggle;
        },
        showTip(text) {
            if (!text) return;
            this.tip = text;
            this.tipVisible = true;
            clearTimeout(this.tipDelay);
            this.tipDelay = setTimeout(() => {
                this.tipVisible = false;
            }, 3000);
        },
        onSetSuccess(text) {
            return () => {
                this.showTip(text);
            };
        },
        onSetError(isTemp) {
            return () => {
                this.showTip(tips.fail);
                if (isTemp) {
                    this.syncTemp();
                }
            };
        },
        checkCmd(attr, val) {
            var ac = JSON.parse(JSON.stringify(this.ac));
            ac[attr] = val;
            if (
                ac.temperature == MAX_TEMP &&
                ac.speed == "low" &&
                ac.mode == "cold"
            ) {
                return true;
            }
            return false;
        }
    }
};
</script>

<style lang="less" scoped>
.wrap-on {
    color: #fff;
    background: #46bcff;
}
.bg {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 480px;
    width: 100%;
    background: url(../../../lib/base/air_condition/assets/img_bg_aircon_on@2x.png)
        no-repeat;
    background-size: 100%;
}
.header {
    text-align: center;
    width: 100%;
    position: absolute;
    left: 0;
    top: 200px;
    .name {
        font-size: 32px;
        display: block;
    }
}
.current_temp {
    text-align: center;
    width: 100%;
    position: absolute;
    left: 0;
    top: 310px;
    .num {
        font-size: 180px;
        font-family: PingFangSC-Medium;
    }
    .unit {
        font-size: 60px;
        font-family: PingFangSC-Regular;
    }
}
.btn-minus,
.btn-add {
    position: absolute;
    top: 360px;
    width: 96px;
    height: 96px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
}
.btn-minus {
    background-repeat: no-repeat;
    left: 64px;
    background-image: url(../../../lib/base/air_condition/assets/btn_aircon_minus_normal@2x.png);
    &:active {
        background-image: url(../../../lib/base/air_condition/assets/btn_aircon_minus_pressed@2x.png);
    }
}
.btn-add {
    right: 64px;
    background-image: url(../../../lib/base/air_condition/assets/btn_aircon_plus_normal@2x.png);
    &:active {
        background-image: url(../../../lib/base/air_condition/assets/btn_aircon_plus_pressed@2x.png);
    }
}
.btn-off {
    position: absolute;
    left: 50%;
    width: 144px;
    height: 144px;
    margin-left: -72px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    // top: 600px;
    bottom: 140px;
    background-image: url(../../../lib/base/air_condition/assets/btn_aircon_poweroff_normal@2x.png);
    transition: all 1s;
    &:active {
        background-image: url(../../../lib/base/air_condition/assets/btn_aircon_poweroff_pressed@2x.png);
    }
    &-toggle {
        transform: scale(0);
        opacity: 0;
    }
}
.btn-toggle {
    position: absolute;
    right: 32px;
    top: 162px;
    width: 96px;
    height: 96px;
    background-image: url(../../../lib/base/air_condition/assets/btn_aircon_more_normal@2x.png);
    background-size: 100% 100%;
    background-position: center center;
    &:active {
        background-image: url(../../../lib/base/air_condition/assets/btn_aircon_more_pressed@2x.png);
    }
}
.btns {
    display: flex;
    flex-direction: row;
    justify-content: center;
    li {
        // float: left;
        margin: 0 25px;
        text-align: center;
        width: 120px;
        height: 200px;
        font-size: 28px;
        &.on {
            font-weight: bold;
        }
    }
    a {
        width: 120px;
        height: 120px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        display: block;
        margin-bottom: 20px;
    }
}
.btns-hold {
    position: absolute;
    left: 50%;
    bottom: 328px;
    width: 750px;
    transform: translateX(-50%);
    padding: 0 35px;
}
.btns-more {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border-radius: 8px;
    width: 480px;
    color: #75787a;
    p {
        text-align: center;
        font-size: 28px;
        padding: 24px 0;
        color: #c8cacc;
    }
    .on {
        color: #46bcff;
    }
}
.mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
}
.btn-cold {
    background-image: url(../../../lib/base/air_condition/assets/btn_aircon_cool_normal@2x.png);
    &:active {
        background-image: url(../../../lib/base/air_condition/assets/btn_aircon_cool_pressed@2x.png);
    }
    &.on {
        background-image: url(../../../lib/base/air_condition/assets/btn_aircon_cool_active@2x.png);
    }
}
.btn-heat {
    background-image: url(../../../lib/base/air_condition/assets/btn_aircon_heat_normal@2x.png);
    &:active {
        background-image: url(../../../lib/base/air_condition/assets/btn_aircon_heat_pressed@2x.png);
    }
    &.on {
        background-image: url(../../../lib/base/air_condition/assets/btn_aircon_heat_active@2x.png);
    }
}
.btn-dehumidify {
    background-image: url(../../../lib/base/air_condition/assets/btn_aircon_dry_normal@2x.png);
    &:active {
        background-image: url(../../../lib/base/air_condition/assets/btn_aircon_dry_pressed@2x.png);
    }
    &.on {
        background-image: url(../../../lib/base/air_condition/assets/btn_aircon_dry_active@2x.png);
    }
}
.btn-speed {
    background-image: url(../../../lib/base/air_condition/assets/btn_airvolume_auto_normal@2x.png);
    &:active {
        background-image: url(../../../lib/base/air_condition/assets/btn_airvolume_auto_pressed@2x.png);
    }
}
.btn-s1 {
    background-image: url(../../../lib/base/air_condition/assets/btn_airvolume_s_normal@2x.png);
    &:active {
        background-image: url(../../../lib/base/air_condition/assets/btn_airvolume_s_pressed@2x.png);
    }
}
.btn-s2 {
    background-image: url(../../../lib/base/air_condition/assets/btn_airvolume_m_normal@2x.png);
    &:active {
        background-image: url(../../../lib/base/air_condition/assets/btn_airvolume_m_pressed@2x.png);
    }
}
.btn-s3 {
    background-image: url(../../../lib/base/air_condition/assets/btn_airvolume_l_normal@2x.png);
    &:active {
        background-image: url(../../../lib/base/air_condition/assets/btn_airvolume_l_pressed@2x.png);
    }
}
.btn-auto {
    background-image: url(../../../lib/base/air_condition/assets/btn_aircon_ai_normal@2x.png);
    &:active {
        background-image: url(../../../lib/base/air_condition/assets/btn_aircon_ai_pressed@2x.png);
    }
    &.on {
        background-image: url(../../../lib/base/air_condition/assets/btn_aircon_ai_active@2x.png);
    }
}
.btn-wind {
    background-image: url(../../../lib/base/air_condition/assets/btn_aircon_blow_normal@2x.png);
    &:active {
        background-image: url(../../../lib/base/air_condition/assets/btn_aircon_blow_pressed@2x.png);
    }
    &.on {
        background-image: url(../../../lib/base/air_condition/assets/btn_aircon_blow_active@2x.png);
    }
}
.btn-vertical {
    background-image: url(../../../lib/base/air_condition/assets/btn_aircon_vertical_normal@2x.png);
    &:active {
        background-image: url(../../../lib/base/air_condition/assets/btn_aircon_vertical_pressed@2x.png);
    }
    &.on {
        background-image: url(../../../lib/base/air_condition/assets/btn_aircon_vertical_active@2x.png);
    }
}
.btn-horizontal {
    background-image: url(../../../lib/base/air_condition/assets/btn_aircon_horizontal_normal@2x.png);
    &:active {
        background-image: url(../../../lib/base/air_condition/assets/btn_aircon_horizontal_pressed@2x.png);
    }
    &.on {
        background-image: url(../../../lib/base/air_condition/assets/btn_aircon_horizontal_active@2x.png);
    }
}
.tip {
    position: absolute;
    left: 0;
    top: 510px;
    width: 100%;
    text-align: center;
    color: #fff;
    font-size: 28px;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}
.android .btns-hold {
    bottom: 428px;
}
.android .btn-off {
    bottom: 252px;
}
</style>
