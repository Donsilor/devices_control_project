<template>
    <div id="app">
        <div class="mask" v-show="maskLyerShow" @click="maskLayerClick"></div>
        <span class="more-btn" @click="showMoreLayer"></span>
        <div class="wrapper">
            <h3 class="main-title">{{device_name}}</h3>
            <div class="pannel">
                <p class="p-model">{{getModeName(allAttribute.mode)}}模式</p>
                <p class="color-gray p-status">
                    <span v-if="allAttribute.status==='start'">({{allAttribute.step === 'bake' ? '烘烤中' : '预约中'}})</span>
                </p>
                <div class="p-main-time">
                    <p class="p-num" v-html="remainingText"></p>
                    <p class="color-gray">{{allAttribute.status==='start'? '剩余时间' : '总时间'}}</p>
                </div>
                <p class="color-gray">
                    <span>{{allAttribute.fire}}</span>
                    设定温度
                    <span class="p-wendu">{{allAttribute.temperature}}</span>℃</p>
            </div>
            <div class="controls">
                <button @click="startOven" v-if="allAttribute.status==='stop'">
                    <i class="c-firing"></i>
                </button>
                <button @click="stopOven" v-if="allAttribute.status==='start'">
                    <i class="c-stop"></i>
                </button>
                <button style="margin-left: 100px" @click="showModelLayer">
                    <i class="c-model"></i>
                </button>
            </div>
        </div>
        <div class="model-select-layer oven-layer" v-show="modelLayerShow">
            <div class="layer-header">
                <h3>模式设定</h3>
                <i class="btn-close" @click="closeModelLayer"></i>
            </div>
            <div class="layer-body" :class="allAttribute.status === 'start' ? 'disable' : ''">
                <ul class="model-list">
                    <li @click="seleteMode(item)" v-for="item in modeList">
                        <a href="javascript:void(0)" :class="[item.icon,allAttribute.mode==item.mode?'active':'']"></a>
                        <div class="mode-name">{{item.name}}</div>
                    </li>
                    <li @click="seleteMode(item)" v-for="item in elseModeList">
                        <a href="javascript:void(0)" :class="[item.icon,allAttribute.mode==item.mode?'active':'']"></a>
                        <div class="mode-name">{{item.name}}</div>
                    </li>
                </ul>
                <div class="select-param" @click="toggleShowSlider('wendu')">
                    <div class="hasDisable">
                        <p>烘烤温度</p>
                        <span class="value-wendu">{{allAttribute.temperature}}℃
                            <i :class="wenduSelectFlag?'icon-arrow-up':'icon-arrow-down'"></i>
                        </span>
                    </div>
                </div>
                <div class="slide-list" v-show="wenduSelectFlag">
                    <picker :slots="wenduSlot" @change="selectWendu" :valueKey="'value'" :item-height="30" :visible-item-count="3"></picker>
                </div>
                <div class="select-param" @click="toggleShowSlider('time')">
                    <div class="hasDisable">
                        <p>烘烤时长</p>
                        <span class="value-wendu">{{allAttribute.bake_duration}}分钟
                            <i :class="timeSelectFlag?'icon-arrow-up':'icon-arrow-down'"></i>
                        </span>
                    </div>
                </div>
                <div class="slide-list" v-show="timeSelectFlag">
                    <picker :slots="timeSlot" @change="selectTime" :valueKey="'value'" :item-height="30" :visible-item-count="3"></picker>
                </div>
            </div>

        </div>
        <div class="model-more-layer oven-layer" v-show="moreLayerShow">
            <div class="layer-header">
                <h3>更多设置</h3>
                <i class="btn-close" @click="closeMoreLayer"></i>
            </div>
            <div class="layer-body">
                <div class="main-select-con" :class="{disable:allAttribute.status!='start'}">
                    <br><br>
                    <div class="select-param noborder hasDisable">
                        <p>热风对流</p>
                        <switch-button :sync="true" :disabled="allAttribute.status!='start'" :value="allAttribute.convection==='on'" @change="changeConvection" />
                    </div>
                    <div class="select-param hasDisable">
                        <p>烤叉旋转</p>
                        <switch-button :sync="true" :disabled="allAttribute.status!='start'" :value="allAttribute.rotisserie==='on'" @change="changeRotisserie" />
                        <i class="switch off"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
const getWenduList = (begin, end) => {
    let arr = [];
    for (let i = begin; i <= end; i += 5) {
        arr.push({ name: i, value: i, active: false });
    }
    return arr;
};
const getTimeList = (begin, end) => {
    let arr = [];
    for (let i = begin; i <= end; i++) {
        arr.push({ name: i, value: i, active: false });
    }
    return arr;
};

function findIndex(array, fn) {
    for (var i = 0; i < array.length; i++) {
        if (fn(array[i])) {
            return i;
        }
    }
    return -1;
}

import SwitchButton from "./components/SwitchButton.vue";
import Picker from "./components/Picker/picker.vue";
import AllConfig from "./config";
// import IScroll from 'iscroll/build/iscroll-lite';

export default {
    name: "app",
    components: {
        SwitchButton,
        Picker
    },
    data() {
        return {
            //状态集合
            allAttribute: {
                mode: "", //模式
                temperature: 0, //温度
                bake_duration: 0, //时长
                step: "", // 模式是烘烤中(bake)还是预约中(reserve)
                switch: "off",
                status: "stop", //开关机状态
                reserve_bake: 0, //预约时间
                convection: "on", // 热风对流
                rotisserie: "on", //烤叉
                remaining: 0, //剩余总时间
                wenduList: [],
                timeList: []
            },
            // 遮罩层
            maskLyerShow: false,
            //模式选择层
            modelLayerShow: false,
            //更多选择层
            moreLayerShow: false,
            wenduSelectFlag: false,
            timeSelectFlag: false,
            //模式列表
            modeList: [
                {
                    name: "面包",
                    icon: "ico-bread",
                    mode: "bread"
                },
                {
                    name: "饼干",
                    icon: "ico-biscuit",
                    mode: "biscuit"
                },
                {
                    name: "蛋糕",
                    icon: "ico-cake",
                    mode: "cake"
                },
                {
                    name: "披萨",
                    icon: "ico-pizza",
                    mode: "pizza"
                },
                {
                    name: "烤肉",
                    icon: "ico-barbecue",
                    mode: "barbecues"
                },
                {
                    name: "鱼虾",
                    icon: "ico-fish",
                    mode: "fish_shrimp"
                },
                {
                    name: "地瓜",
                    icon: "ico-sweet-potato",
                    mode: "sweet_potato"
                },
                {
                    name: "全鸡",
                    icon: "ico-chicken",
                    mode: "chicken"
                }
            ],
            elseModeList: [
                {
                    name: "上火",
                    icon: "up-fire",
                    mode: "broil"
                },
                {
                    name: "下火",
                    icon: "down-fire",
                    mode: "bake"
                },
                {
                    name: "上下火",
                    icon: "both-fire",
                    mode: "roast"
                }
            ],
            device_name: ""
        };
    },
    watch: {
        "allAttribute.status"(val) {
            if (val == "start") {
                this.wenduSelectFlag = false;
                this.timeSelectFlag = false;
                if (this.modelLayerShow) {
                    this.closeModelLayer();
                }
            }
        }
    },
    computed: {
        wenduSlot() {
            var current = findIndex(this.allAttribute.wenduList, item => {
                return this.allAttribute.temperature == item.value;
            });

            return [
                {
                    flex: 1,
                    defaultIndex: current,
                    values: this.allAttribute.wenduList,
                    className: "slot1"
                }
            ];
        },
        timeSlot() {
            var current = findIndex(this.allAttribute.timeList, item => {
                return this.allAttribute.bake_duration == item.value;
            });

            return [
                {
                    flex: 1,
                    defaultIndex: current,
                    values: this.allAttribute.timeList,
                    className: "slot2"
                }
            ];
        },
        remainingText() {
            var total = this.allAttribute.remaining;
            if (
                this.allAttribute.status == "start" &&
                this.allAttribute.step == "reserve"
            ) {
                total = total - this.allAttribute.bake_duration;
            }
            var h = Math.floor(total / 60);
            var m = total % 60;
            var s = "";
            if (h > 0) {
                s += `<strong>${h}</strong>小时 &nbsp;&nbsp;`;
            }
            if (m > 0) {
                s += `<strong>${m}</strong>分钟`;
            }
            return s;
        }
    },
    mounted() {
        HdSmart.ready(() => {
            if (window.device_name) {
                this.device_name = window.device_name;
            }
            // HdSmart.UI.setWebViewTouchRect(0, 0, '100%', '100%');
            HdSmart.UI.showLoading();
            this.getSnapShot();
        });
        HdSmart.onDeviceStateChange(data => {
            this.onSuccess(data.result);
        });
    },
    methods: {
        closeMoreLayer() {
            this.maskLyerShow = false;
            this.moreLayerShow = false;
        },
        maskLayerClick() {
            this.maskLyerShow = false;
            this.moreLayerShow = false;
            this.modelLayerShow = false;
        },
        //取消模式选择
        closeModelLayer() {
            this.maskLyerShow = false;
            this.modelLayerShow = false;
        },
        showMoreLayer() {
            this.maskLyerShow = true;
            this.moreLayerShow = true;
        },
        showModelLayer() {
            this.maskLyerShow = true;
            this.modelLayerShow = true;
        },
        seleteMode(item) {
            // 如果正在工作 不能选模式
            if (this.allAttribute.status === "start") {
                return;
            }
            this.allAttribute.mode = item.mode;
            let currentData = AllConfig[item.mode];
            for (let attr in currentData) {
                this.allAttribute[attr] = currentData[attr];
            }
            this.allAttribute.remaining = this.allAttribute.bake_duration;
        },
        toggleShowSlider(val) {
            if (this.allAttribute.status === "start") {
                return;
            }
            if (val === "wendu") {
                this.wenduSelectFlag = !this.wenduSelectFlag;
                if (this.wenduSelectFlag && this.timeSelectFlag) {
                    this.timeSelectFlag = false;
                }
            } else {
                this.timeSelectFlag = !this.timeSelectFlag;
                if (this.wenduSelectFlag && this.timeSelectFlag) {
                    this.wenduSelectFlag = false;
                }
            }
        },
        selectWendu(picker, values) {
            if (values.length && values[0] && this.wenduSelectFlag) {
                this.allAttribute.temperature = values[0].value;
            }
        },
        selectTime(picker, values) {
            if (values.length && values[0] && this.timeSelectFlag) {
                this.allAttribute.bake_duration = values[0].value;
                this.allAttribute.remaining = values[0].value;
            }
        },
        getModeName(val) {
            let text = "";
            var modeList = this.modeList.concat(this.elseModeList);
            var currentMode = modeList.filter(item => {
                return item.mode == val;
            });
            if (currentMode.length) {
                return currentMode[0].name;
            }
            return "";
        },
        getSnapShot(cb) {
            HdSmart.Device.getSnapShot(
                data => {
                    this.onSuccess(data);
                    cb && cb();
                },
                () => {
                    cb && cb();
                }
            );
        },
        onSuccess(data) {
            HdSmart.UI.hideLoading();
            let attributes = data.attribute;
            let curAttributes = this.allAttribute;
            let config = AllConfig[attributes.mode || "barbecues"];
            //剩余时间设置为烘干时间，避免没有该字段显示异常
            config.remaining = config.bake_duration;

            if (attributes.mode) {
                //烘烤时间设置为默认时间，设备不保存，上报bake_duration为剩余时间
                attributes.bake_duration = config.bake_duration;
            }
            attributes = Object.assign({}, config, attributes);

            for (let attr in attributes) {
                if (attributes[attr]) {
                    curAttributes[attr] = attributes[attr];
                }
            }
        },
        controlDevice(paramObj, success, error) {
            HdSmart.Device.control(
                {
                    method: "dm_set",
                    nodeid: `oven.main.custom`,
                    params: {
                        attribute: paramObj
                    }
                },
                () => {
                    success && success();
                },
                () => {
                    error && error();
                }
            );
        },
        // 启动
        startOven() {
            const obj = this;
            let curParam = this.allAttribute;
            let paramObj = {
                control: "start",
                mode: curParam.mode,
                bake_duration: curParam.bake_duration * 60,
                temperature: curParam.temperature
                //                    reserve_bake: curParam.reserve_bake,
                //                    convection: curParam.convection,
                //                    rotisserie: curParam.rotisserie
                //                    remaining: curParam.remaining
            };
            this.controlDevice(paramObj);
        },
        // 停止
        stopOven() {
            const obj = this;
            this.controlDevice({ control: "stop" });
        },
        // 设置热风对流
        changeConvection(obj) {
            let self = this;
            this.controlDevice({ convection: obj.value ? "on" : "off" }, () => {
                self.allAttribute.convection = self.value ? "on" : "off";
            });
        },
        // 设置转叉
        changeRotisserie(obj) {
            let self = this;
            this.controlDevice({ rotisserie: obj.value ? "on" : "off" }, () => {
                self.allAttribute.rotisserie = self.value ? "on" : "off";
            });
        }
    }
};
</script>
<style lang="less">
body {
    margin: 0;
    height: 600px;
    font-size: 30px;
    /*-webkit-tap-highlight-color: transparent;*/
    /*-webkit-user-select: none;*/
    /*-moz-user-select: none;*/
    /*-ms-user-select: none;*/
    /*user-select: none;*/
    background: #f3f3f3;
    color: #333;
    font-family: NotoSansHans-Regular;
    -webkit-tap-highlight-color: transparent;
}
* {
    margin: 0;
    padding: 0;
}
ul {
    list-style: none;
}
#app {
}
.mask {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
    position: absolute;
}
.more-btn {
    position: absolute;
    right: 65px;
    width: 96px;
    height: 96px;
    top: 132px;
    display: block;
    background-image: url("../../lib/base/oven/assets/btn_aircon_more.png");
    background-size: 100% 100%;
}
.wrapper {
    text-align: center;
    margin-top: 120px;
    height: 600px;
    left: 50%;
    width: 900px;
    position: relative;
    transform: translate(-50%, 0);
    .color-gray {
        color: #999;
    }
    .main-title {
        font-weight: normal;
        height: 80px;
        color: #333;
        opacity: 0.7;
        line-height: 80px;
        margin-bottom: 10px;
    }
    .pannel {
        height: 460px;
        background: #fff;
        border-radius: 38px;
        .p-main-time {
            padding: 50px 0;
            .p-num {
                color: #46bcff;
                strong {
                    font-family: Roboto-Medium;
                    position: relative;
                    left: -15px;
                    font-size: 100px;
                }
            }
            .color-gray {
                position: relative;
                top: -10px;
            }
        }

        .p-model {
            padding-top: 20px;
            height: 60px;
            line-height: 60px;
            font-size: 36px;
        }
        .p-status {
            height: 30px;
        }
        .p-wendu {
            font-weight: bold;
            opacity: 1;
            color: #46bcff;
        }
    }
    .controls {
        padding-top: 80px;
        button {
            outline: none;
            width: 300px;
            height: 130px;
            display: inline-block;
            border-radius: 16px;
            background: #fff;
            border: 0;
            box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.04);
            i {
                display: inline-block;
                width: 165px;
                height: 58px;
                background-size: 100% 100%;
            }
            .c-stop {
                background-image: url("../../lib/base/oven/assets/icon__stop.png");
            }
            .c-model {
                background-image: url("../../lib/base/oven/assets/icon_selectionpattern.png");
            }
            .c-firing {
                background-image: url("../../lib/base/oven/assets/icon__firing.png");
            }
        }
    }
}
.disabled .c-model {
    filter: grayscale(1);
    opacity: 0.5;
}
.oven-layer {
    font-size: 24px;
    color: #76787a;
    width: 1300px;
    height: 800px;
    position: absolute;
    z-index: 9999;
    left: 50%;
    top: 80px;
    transform: translate(-50%, 0);
    background: #ffffff;
    /*box-shadow:0 3px 12px 0 rgba(0,0,0,0.10);*/
    border-radius: 6px;
    .layer-header {
        height: 84px;
        box-shadow: inset 0 -1px 0 0 #dbdbdb;
        text-align: center;
        position: relative;
        h3 {
            height: 100%;
            font-size: 30px;
            font-weight: normal;
            line-height: 84px;
        }
        .btn-close {
            position: absolute;
            right: 28px;
            display: inline-block;
            top: 26px;
            height: 30px;
            width: 30px;
            background-size: 100% 100%;
            background-image: url("../../lib/base/oven/assets/btn_close.png");
        }
    }
    .layer-body {
        overflow: hidden;
    }
    .layer-bottom-btn {
        clear: both;
        margin-top: 60px;
        text-align: center;
        button {
            border: 1px solid #76787a;
            border-radius: 6px;
            width: 238px;
            height: 82px;
            font-size: 36px;
            line-height: 82px;
            text-align: center;
        }
        .cancel {
            background: #ffffff;
            color: #76787a;
            margin-right: 20px;
        }
        .confirm {
            color: #fff;
            background: #46bcff;
            border: 0;
        }
    }
}
.model-select-layer {
    .disable {
        .confirm {
            opacity: 0.3;
        }
        li {
            div.mode-name {
                opacity: 0.3;
            }
            a.active {
                opacity: 0.3;
            }
            a.ico-bread {
                background-image: url("../../lib/base/oven/assets/btn_bread_g.png");
            }
            a.ico-biscuit {
                background-image: url("../../lib/base/oven/assets/btn_biscuits_g.png");
            }
            a.ico-cake {
                background-image: url("../../lib/base/oven/assets/btn_cake_g.png");
            }
            a.ico-pizza {
                background-image: url("../../lib/base/oven/assets/btn_pizza_g.png");
            }
            a.ico-barbecue {
                background-image: url("../../lib/base/oven/assets/btn_barbecue_g.png");
            }
            a.ico-fish {
                background-image: url("../../lib/base/oven/assets/btn_fishandshrimp_g.png");
            }
            a.ico-sweet-potato {
                background-image: url("../../lib/base/oven/assets/btn_pachyrhizus_g.png");
            }
            a.ico-chicken {
                background-image: url("../../lib/base/oven/assets/btn_chicken_g.png");
            }
        }
    }
    .model-list {
        width: 1180px;
        margin: 30px auto 0;
        overflow: hidden;
        li {
            list-style: none;
            text-align: center;
            float: left;
            width: 130px;
            margin: 0 30px;
            padding-bottom: 25px;
            div {
                margin-top: 5px;
                height: 40px;
                line-height: 40px;
            }
            a {
                display: block;
                width: 130px;
                height: 130px;
                background-size: 100% 100%;
            }
            .ico-bread {
                background-image: url("../../lib/base/oven/assets/btn_bread.png");
                &.active {
                    background-image: url("../../lib/base/oven/assets/btn_bread_selected.png");
                }
            }
            .ico-biscuit {
                background-image: url("../../lib/base/oven/assets/btn_biscuits.png");
                &.active {
                    background-image: url("../../lib/base/oven/assets/btn_biscuits_selected.png");
                }
            }
            .ico-cake {
                background-image: url("../../lib/base/oven/assets/btn_cake.png");
                &.active {
                    background-image: url("../../lib/base/oven/assets/btn_cake_selected.png");
                }
            }
            .ico-pizza {
                background-image: url("../../lib/base/oven/assets/btn_pizza.png");
                &.active {
                    background-image: url("../../lib/base/oven/assets/btn_pizza_selected.png");
                }
            }
            .ico-barbecue {
                background-image: url("../../lib/base/oven/assets/btn_barbecue.png");
                &.active {
                    background-image: url("../../lib/base/oven/assets/btn_barbecue_selected.png");
                }
            }
            .ico-fish {
                background-image: url("../../lib/base/oven/assets/btn_fishandshrimp.png");
                &.active {
                    background-image: url("../../lib/base/oven/assets/btn_fishandshrimp_selected.png");
                }
            }
            .ico-sweet-potato {
                background-image: url("../../lib/base/oven/assets/btn_pachyrhizus.png");
                &.active {
                    background-image: url("../../lib/base/oven/assets/btn_pachyrhizus_selected.png");
                }
            }
            .ico-chicken {
                background-image: url("../../lib/base/oven/assets/btn_chicken.png");
                &.active {
                    background-image: url("../../lib/base/oven/assets/btn_chicken_selected.png");
                }
            }

            .up-fire {
                background-image: url("../../lib/base/oven/assets/btn_up_fire.png");
                &.active {
                    background-image: url("../../lib/base/oven/assets/btn_up_fire_selected.png");
                }
            }
            .down-fire {
                background-image: url("../../lib/base/oven/assets/btn_down_fire.png");
                &.active {
                    background-image: url("../../lib/base/oven/assets/btn_down_fire_selected.png");
                }
            }
            .both-fire {
                background-image: url("../../lib/base/oven/assets/btn_conflagration.png");
                &.active {
                    background-image: url("../../lib/base/oven/assets/btn_conflagration_selected.png");
                }
            }
        }
    }
}
.model-more-layer {
    height: 400px;
    top: 200px;
    .more-model-title {
        color: #c8cacc;
        height: 70px;
        text-align: center;
        line-height: 70px;
    }
    .main-select-con {
        padding: 0 45px;
        .border-both {
            box-shadow: inset 0 -1px 0 0 #dbdbdb, inset 0 1px 0 0 #dbdbdb;
        }
    }
}

.up-down-fire {
    text-align: center;
    padding-bottom: 30px;
    span {
        margin-right: 80px;
        display: inline-block;
        width: 90px;
        line-height: 40px;
    }
    a {
        display: block;
        width: 90px;
        height: 90px;
        background-size: 100% 100%;
    }
    .up-fire {
        background-image: url("../../lib/base/oven/assets/btn_up_fire.png");
        &.active {
            background-image: url("../../lib/base/oven/assets/btn_up_fire_selected.png");
        }
    }
    .down-fire {
        background-image: url("../../lib/base/oven/assets/btn_down_fire.png");
        &.active {
            background-image: url("../../lib/base/oven/assets/btn_down_fire_selected.png");
        }
    }
    .both-fire {
        background-image: url("../../lib/base/oven/assets/btn_conflagration.png");
        &.active {
            background-image: url("../../lib/base/oven/assets/btn_conflagration_selected.png");
        }
    }
}

.select-param {
    border-top: 1px solid #dbdbdb;
    position: relative;
    margin: 0 45px;
    padding: 10px 0;
    line-height: 2;
    overflow: hidden;
    p {
        float: left;
    }
    .value-wendu {
        color: #46bcff;
        float: right;
        i {
            display: inline-block;
            width: 24px;
            height: 13px;
            background-size: 100% 100%;
            margin-left: 20px;
        }
        .icon-arrow-down {
            background-image: url("../../lib/base/oven/assets/arrow_down.png");
        }
        .icon-arrow-up {
            background-image: url("../../lib/base/oven/assets/arrow_up.png");
        }
    }
    .vue-js-switch {
        float: right;
    }
}
.slide-list {
    padding: 0px 45px;
    background: #fafafa;
    .slide-scroller {
        position: relative;
        // height: 60px;
        // overflow: hidden;
    }
    .slide-list-inner {
        margin: 0 auto;
        width: 150px;
        height: 150px;
        overflow-y: auto;
        // display: -webkit-box;
        // -webkit-box-orient: horizontal;
        // overflow: auto;
        li {
            display: block;
            // float: left;
            width: 90px;
            height: 50px;
            text-align: center;
            line-height: 50px;
            &.active {
                background: #46bcff;
                border: 1px solid #46bcff;
                color: #fff;
                border-radius: 3px;
            }
        }
    }
}

.model-select-layer .disable li {
    .hasDisable {
        opacity: 0.5;
        .value-wendu {
            color: #76787a;
        }
    }
    a.up-fire {
        background-image: url("../../lib/base/oven/assets/btn_up_fire_g.png");
    }
    a.down-fire {
        background-image: url("../../lib/base/oven/assets/btn_down_fire_g.png");
    }
    a.both-fire {
        background-image: url("../../lib/base/oven/assets/btn_conflagration_g.png");
    }
    .up-down-fire {
        color: #ccc;
    }
}
.noborder {
    border-top: 0;
}
</style>
