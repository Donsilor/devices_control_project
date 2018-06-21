<template>
    <div id="app">
        <!-- off -->
        <div class="page-off" v-if="model.switch==='on'">
            <div class="name">{{device_name}}</div>
            <!-- <div class="tip">已关闭</div> -->
            <div class="oven"></div>
            <div class="off_button">
                <a href="" class="btn btn-off" @click.prevent="setSwitch('on')">
                    <i></i>
                </a>
            </div>
        </div>
        <!-- on -->
        <div class="page-on wrapper" v-if="model.switch==='off'">
            <h3 class="main-title">{{device_name}}</h3>
            <div class="pannel">
                <p class="p-model">{{getModeName(allAttribute.mode)}}模式</p>
                <p class="color-gray p-status">
                    <!-- todo back -->
                    <!-- <span v-if="allAttribute.status==='start'">({{allAttribute.step === 'bake' ? '烘烤中' : '预约中'}})</span> -->
                    <span>({{allAttribute.step === 'bake' ? '烘烤中' : '预约中'}})</span>
                </p>
                <div class="p-main-time">
                    <p class="p-num" v-html="remainingText"></p>
                    <!-- todo cut -->
                    <!-- <p class="color-gray">{{allAttribute.status==='start'? '剩余时间' : '总时间'}}</p> -->
                </div>
                <p class="color-gray tempDetail">
                    <span>{{allAttribute.fire}}</span>
                    设定温度
                    <span class="p-wendu">{{allAttribute.temperature}}</span>℃
                </p>
            </div>
            <div class="controls">
                <button @click="stopOven">
                    <i class="c-stop"></i>停止</button>
                <button @click="startOven" v-if="allAttribute.status==='stop'">
                    <i class="c-firing"></i>启动</button>
                <button @click="showModelLayer">
                    <i class="c-model"></i>模式设定</button>
                <button @click="showModelLayer">
                    <i class="c-preheat"></i>辅助预热</button>
                <button @click="showModelBarbicueTime">
                    <i class="c-barbicue"></i>预约烧烤</button>
            </div>
            <!-- 查看更多的按钮 -->
            <span class="more-btn" @click="showMoreLayer"></span>
        </div>

        <modal class="model-select-layer backControl" v-model="modelLayerShow" title="模式选择">
            <div class="layer-body" :class="allAttribute.status === 'start' ? 'disable' : ''">
                <ul class="model-list">
                    <li @click="seleteMode(item)" v-for="item in modeList" :key="`${item.name}`">
                        <a href="javascript:void(0)" :class="[item.icon,allAttribute.mode==item.mode?'active':'']"></a>
                        <div class="mode-name">{{item.name}}</div>
                    </li>
                </ul>
                <div class="select-param" @click="toggleShowSlider('wendu')">
                    <div class="hasDisable">
                        <p>烘烤温度</p>
                        <span class="value-wendu">{{allAttribute.temperature}}℃
                            <!-- <i class="icon-arrow-down"></i> -->
                            <i :class="wenduSelectFlag?'icon-arrow-up':'icon-arrow-down'"></i>

                        </span>
                    </div>
                </div>
                <div class="slide-list" v-show="wenduSelectFlag">
                    <picker :slots="wenduSlot" @change="selectWendu" :valueKey="'value'" :item-height="60" :visible-item-count="5"></picker>
                </div>
                <div class="select-param" @click="toggleShowSlider('time')">
                    <div class="hasDisable">
                        <p>烘烤时长</p>
                        <span class="value-wendu">{{allAttribute.bake_duration}}分钟
                            <!-- <i class="icon-arrow-down"></i> -->
                            <i :class="wenduSelectFlag?'icon-arrow-up':'icon-arrow-down'"></i>

                        </span>
                    </div>
                </div>
                <div class="slide-list" v-show="timeSelectFlag">
                    <picker :slots="timeSlot" @change="selectTime" :valueKey="'value'" :item-height="60" :visible-item-count="5"></picker>
                </div>
                <div class="sureButtongroup">
                    <div class="cancle">取消</div>
                    <div class="sure">确定</div>
                </div>
            </div>
        </modal>

        <modal v-model="moreLayerShow" title="更多" class="subpagebakControl">
            <div class="buttonchoose">
                <div class="chooseTitle">更多模式</div>
                <div class="pattern">
                    <!-- 照明模式 -->
                    <div @click="lighting" class="lighting">
                        <i class="c-lighting"></i>
                        <span>照明</span>
                    </div>
                    <!-- 时间同步 -->
                    <div @click="timeSynchronization">
                        <i class="c-time"></i>
                        <span>时间同步</span>
                    </div>
                </div>
            </div>
            <div class="selectbox lockDetail" :class="{disable:!isRun}">
                <div class="hd">
                    <div class="left">童锁</div>
                    <div class="right sb-wrap">
                        <switch-button :value="childLockSwitch" :sync="true" :disabled="!isRun" />
                        <div class="sb-btn" @click="confirmChildLock"></div>
                    </div>
                </div>
                <div class="locktips">开启童锁后除照明和开机外其他操作均不可用</div>
            </div>
        </modal>
        <!-- 预约烘烤时间弹窗 -->
        <modal v-model="barbicueTimeAlert" title="预约烧烤结束时间" class="subpagebakControl2">
            <picker :slots="barbicueTimeSlot" @change="selectBarbicueTime" :valueKey="'value'" :item-height="60" :visible-item-count="5"></picker>
        </modal>
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

import SwitchButton from "../../lib/components/SwitchButton.vue";
import Picker from "./components/Picker/picker.vue";
import AllConfig from "./config";
import SubPage from "../../lib/components/SubPage";
import ModeButton from "./components/ModeButton.vue";
import Modal from "../../lib/components/Modal";

// import IScroll from 'iscroll/build/iscroll-lite';

export default {
    name: "app",
    components: {
        SwitchButton,
        Picker,
        SubPage,
        ModeButton,
        Modal
    },
    data() {
        return {
            model: {}, //数据
            //状态集合
            allAttribute: {
                mode: "", //模式
                temperature: 0, //温度
                bake_duration: 0, //时长
                step: "", // 模式是烘烤中(bake)还是预约中(reserve)
                switch: "off",
                status: "stop", //开关机状态，stop或者start
                reserve_bake: 0, //预约时间
                convection: "on", // 热风对流
                rotisserie: "on", //烤叉
                remaining: 0, //剩余总时间
                wenduList: [],
                timeList: []
            },
            //模式选择层
            modelLayerShow: false, //todo
            //更多选择层
            moreLayerShow: false, //todo
            wenduSelectFlag: false,
            timeSelectFlag: false,
            barbicueTimeAlert: false, //预约烧烤结束时间弹窗
            list2: [],
            //模式列表
            modeList: [
                //todo.mode的名称还待定
                {
                    name: "传统烘焙",
                    icon: "traditional-baking",
                    mode: "bread"
                },
                {
                    name: "3D热风",
                    icon: "ico-3d",
                    mode: "biscuit"
                },
                {
                    name: "对流烘焙",
                    icon: "ico-convective-baking",
                    mode: "cake"
                },
                {
                    name: "烘焙",
                    icon: "ico-barking",
                    mode: "barking"
                },
                {
                    name: "热风烧烤",
                    icon: "ico-hot-air-barbecue",
                    mode: "barbecues"
                },
                {
                    name: "上烧烤",
                    icon: "ico-up-barbecue",
                    mode: "fish_shrimp"
                },
                {
                    name: "全烧烤",
                    icon: "ico-whole-barbecue",
                    mode: "sweet_potato"
                },
                {
                    name: "披萨模式",
                    icon: "ico-pizza",
                    mode: "pizza"
                },
                {
                    name: "上发酵",
                    icon: "ico-upper-fermentation",
                    mode: "fermentation"
                },
                {
                    name: "解冻",
                    icon: "icon-thaw",
                    mode: "thaw"
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
        isRun() {
            console.log("run", this.model.status == "run");
            return this.model.status == "run"; //正在运行
        },
        childLockSwitch() {
            return this.model.child_lock_switch == "on" ? true : false;
        },
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
            console.log(current);
            console.log(99999999999999999, [
                {
                    flex: 1,
                    defaultIndex: current,
                    values: this.allAttribute.timeList,
                    className: "slot2"
                }
            ]);
            return [
                {
                    flex: 1,
                    defaultIndex: current,
                    values: this.allAttribute.timeList,
                    className: "slot2"
                }
            ];
        },
        barbicueTimeSlot() {
            //todo
            return [
                {
                    flex: 1,
                    defaultIndex: 1,
                    values: this.list2,
                    className: "slot3"
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
        setSwitch(val) {
            //烤箱开关的控制
            console.log("开关", val);
            this.controlDevice("switch", val);
        },
        controlDevice(attr, val, success, error) {
            if (
                this.model.child_lock_switch == "on" &&
                attr != "child_lock_switch"
            ) {
                HdSmart.UI.toast("请先关闭童锁");
                return;
            }

            var params = {
                [attr]: val
            };

            if (attr == "mode") {
                //要切到待机模式
            }

            HdSmart.Device.control(
                {
                    method: "dm_set",
                    nodeid: `oven.main.custom.${attr}`,
                    params: {
                        attribute: params
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
        setMode(mode) {
            console.log("mode", mode);
            if (this.isRun || this.isPause) {
                return;
            }
            if (this.model.mode == mode) {
                return;
            }
            this.controlDevice("mode", mode, () => {
                this.model.mode = mode;
            });
        },
        confirmChildLock() {
            //童锁的设置
            console.log("童锁设置");
            if (this.childLockSwitch) {
                // this.confirmChildLockVisible = true;
            } else {
                if (this.isRun) {
                    this.setChildLock("on", () => {
                        this.model.child_lock_switch = "on";
                    });
                } else {
                    HdSmart.UI.toast("运行中才能开启童锁");
                }
            }
        },
        lighting() {
            console.log("lighting");
        },
        timeSynchronization() {
            console.log("timeSynchronization");
        },
        closeMoreLayer() {
            this.moreLayerShow = false;
        },
        closeModelLayer() {
            this.modelLayerShow = false;
        },
        showMoreLayer() {
            this.moreLayerShow = true;
        },
        showModelLayer() {
            this.modelLayerShow = true;
        },
        showModelBarbicueTime() {
            //todo
            this.barbicueTimeAlert = true;
            var timeNow = new Date().getTime(); //当前时间戳
            var total = this.allAttribute.remaining; //单位：分钟
            var totalChange = total * 60 * 1000; //将当前模式时间转化为毫秒
            var startTime = timeNow + totalChange; //预约开始时间节点
            var endTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 当前时间+24小时
            var list = [];
            console.log(1, startTime);
            console.log(2, endTime);
            while (startTime < endTime) {
                startTime += 60 * 1000; //调整幅度为一分钟
                var hour = new Date(startTime).getHours();
                var minutes = new Date(startTime).getMinutes();
                var value = hour + "时" + " " + minutes + "分";
                list.push({
                    active: false,
                    value: value,
                    name: value
                });
            }
            console.log("list", list);
            this.list2 = list;
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
        selectBarbicueTime(picker, values) {
            //预约烧烤结束时间
            console.log("barbicuetime", values);
            if (values.length && values[0] && this.timeSelectFlag) {
                this.allAttribute.bake_duration = values[0].value;
                this.allAttribute.remaining = values[0].value;
            }
        },
        getModeName(val) {
            let text = "";
            // var modeList = this.modeList.concat(this.elseModeList);
            var modeList = this.modeList;
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
                    console.log(1111);
                    this.onSuccess(data);
                    cb && cb();
                },
                () => {
                    cb && cb();
                }
            );
        },
        onSuccess(data) {
            console.log("dataall", data);
            HdSmart.UI.hideLoading();
            let attributes = data.attribute;
            this.model = attributes;
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
        // controlDevice(paramObj, success, error) {
        //     HdSmart.Device.control(
        //         {
        //             method: "dm_set",
        //             nodeid: `oven.main.custom`,
        //             params: {
        //                 attribute: paramObj
        //             }
        //         },
        //         () => {
        //             success && success();
        //         },
        //         () => {
        //             error && error();
        //         }
        //     );
        // },
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
html,
body {
    margin: 0;
    height: 100%;
    overflow-y: auto;
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
strong {
    font-weight: normal;
}
#app {
    width: 100%;
    min-height: 100%;
    height: auto;
    overflow: auto;
    position: relative;
}
.page-off {
    background: #f2f2f2;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    .name {
        color: #76787a;
    }
    // .tip{
    //     position: absolute;
    //     left: 0;
    //     top: 17.7%;
    //     width: 100%;
    //     text-align: center;
    //     font-size: 30px;
    //     // opacity: 0.5;
    //     font-size: 28px;
    //     color: #C8CACC;
    // }
    //关机样式
    .oven {
        width: 420px;
        height: 420px;
        position: absolute;
        left: 50%;
        top: 20%;
        transform: translate(-50%, 0);
        background: url(../../lib/base/haier_oven/assets/img_ovenline.png)
            no-repeat;
        background-size: 100% 100%;
    }
    .off_button {
        position: absolute;
        bottom: 18%;
        left: 50%;
        transform: translateX(-50%);
        width: 192px;
        height: 192px;
        a {
            width: 100%;
            height: 100%;
            display: block;
            i {
                width: 100%;
                height: 100%;
                display: block;
                background: url(../../lib/base/haier_oven/assets/btn_power@2x.png)
                    no-repeat center;
                background-size: 100% 100%;
            }
        }
    }
}
.name {
    position: absolute;
    left: 0;
    top: 7%;
    width: 100%;
    height: 45px;
    line-height: 45px;
    text-align: center;
    font-size: 32px;
}
.more-btn {
    position: absolute;
    right: 65px;
    width: 96px;
    height: 96px;
    top: 3%;
    background-image: url("../../lib/base/haier_oven/assets/more_button.png");
    background-size: 100% 100%;
}
.wrapper {
    width: 100%;
    min-height: 100%;
    height: auto;
    overflow-y: auto;
    text-align: center;
    margin: 0 auto;
    padding: 3% 0 0 0;
    box-sizing: border-box;
    position: absolute;
    .color-gray {
        color: #999;
    }
    .main-title {
        font-weight: normal;
        margin-bottom: 5%;
        font-size: 32px;
        color: #76787a;
    }
    .pannel {
        height: 460px;
        width: 900px;
        margin: 0 auto;
        background: #fff;
        border-radius: 38px;
        overflow: hidden;
        position: relative;
        .p-main-time {
            height: 120px;
            line-height: 120px;
            color: #46bcff;
            margin: 86px 0 0 0;
            font-size: 36px;
            text-align: center;
            .p-num {
                color: #46bcff;
                strong {
                    font-family: Roboto-Medium;
                    position: relative;
                    left: -15px;
                    font-size: 120px;
                }
            }
        }
        .tempDetail {
            font-size: 30px;
            color: #b5b5b5;
            margin-top: 92px;
        }
        .p-model {
            padding-top: 48px;
            height: 36px;
            line-height: 36px;
            color: #2f3133;
            font-size: 36px;
        }
        .p-status {
            position: absolute;
            width: 100%;
            top: 100px;
            left: 0;
            text-align: center;
            height: 32px;
            line-height: 32px;
            font-size: 32px;
            color: #b5b5b5;
        }
        .p-wendu {
            font-weight: bold;
            opacity: 1;
            color: #46bcff;
        }
    }
    .controls {
        width: 900px;
        margin: 0 auto;
        box-sizing: border-box;
        justify-content: space-between;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        padding-top: 8%;
        align-items: center;
        button {
            outline: none;
            width: 168px;
            height: auto;
            display: inline-block;
            background: none;
            border: 0;
            color: #76787a;
            text-align: center;
            font-size: 30px;
            i {
                display: inline-block;
                width: 168px;
                height: 168px;
                background-size: 100% 100%;
            }
            .c-stop {
                background-image: url("../../lib/base/haier_oven/assets/icn_shutdown_active@2x.png");
                &.disable {
                    background-image: url("../../lib/base/haier_oven/assets/icn_shutdown_disabled@2x.png");
                }
            }
            .c-model {
                background-image: url("../../lib/base/haier_oven/assets/icn_modepreset_active@2x.png");
            }
            .c-firing {
                background-image: url("../../lib/base/haier_oven/assets/icn_open_active@2x.png");
            }
            .c-preheat {
                background-image: url("../../lib/base/haier_oven/assets/icn_Auxiliarywa-up_active@2x.png");
            }
            .c-barbicue {
                background-image: url("../../lib/base/haier_oven/assets/icn_reservebaking_active@2x.png");
            }
        }
    }
}
.disabled .c-model {
    filter: grayscale(1);
    opacity: 0.5;
}

.model-select-layer {
    .disable {
        .confirm {
            opacity: 0.3;
        }
        li {
            div.mode-name {
                font-size: 28px;
                color: #76787a;
                opacity: 0.3;
            }
            a.active {
                opacity: 0.3;
            }
            a.traditional-baking {
                background-image: url("../../lib/base/oven/assets/btn_bread_g.png");
            }
            a.ico-3d {
                background-image: url("../../lib/base/oven/assets/btn_biscuits_g.png");
            }
            a.ico-convective-baking {
                background-image: url("../../lib/base/oven/assets/btn_cake_g.png");
            }
            a.ico-barking {
                background-image: url("../../lib/base/oven/assets/btn_pizza_g.png");
            }
            a.ico-hot-air-barbecue {
                background-image: url("../../lib/base/oven/assets/btn_barbecue_g.png");
            }
            a.ico-up-barbecue {
                background-image: url("../../lib/base/oven/assets/btn_fishandshrimp_g.png");
            }
            a.ico-whole-barbecue {
                background-image: url("../../lib/base/oven/assets/btn_pachyrhizus_g.png");
            }
            a.ico-pizza {
                background-image: url("../../lib/base/oven/assets/btn_chicken_g.png");
            }
        }
    }
    .model-list {
        padding: 0 0 0 115px;
        overflow: hidden;
        margin-bottom: 36px;
        li {
            list-style: none;
            text-align: center;
            float: left;
            width: 144px;
            margin: 36px 35px 0;
            // padding-bottom: 54px;
            div {
                margin-top: 12px;
                font-size: 24px;
                color: #76787a;
            }
            a {
                display: block;
                width: 144px;
                height: 144px;
                background-size: 100% 100%;
            }
            .traditional-baking {
                background-image: url("../../lib/base/haier_oven/assets/icn_traditionalbaking_normal.png");
                &.active {
                    background-image: url("../../lib/base/haier_oven/assets/icn_traditionalbaking_active.png");
                }
            }
            .ico-3d {
                background-image: url("../../lib/base/haier_oven/assets/icn_3Dhotair_normal.png");
                &.active {
                    background-image: url("../../lib/base/haier_oven/assets/icn_3Dhotair_active.png");
                }
            }
            .ico-convective-baking {
                background-image: url("../../lib/base/haier_oven/assets/icn_convectionbake_normal.png");
                &.active {
                    background-image: url("../../lib/base/haier_oven/assets/icn_convectionbake_active.png");
                }
            }
            .ico-barking {
                background-image: url("../../lib/base/haier_oven/assets/icn_baking_normal.png");
                &.active {
                    background-image: url("../../lib/base/haier_oven/assets/icn_baking_active.png");
                }
            }
            .ico-hot-air-barbecue {
                background-image: url("../../lib/base/haier_oven/assets/icn_hotairbarbecue_normal.png");
                &.active {
                    background-image: url("../../lib/base/haier_oven/assets/icn_hotairbarbecue_active.png");
                }
            }
            .ico-up-barbecue {
                background-image: url("../../lib/base/haier_oven/assets/icn_upthebarbecue_normal.png");
                &.active {
                    background-image: url("../../lib/base/haier_oven/assets/icn_upthebarbecue_active.png");
                }
            }
            .ico-whole-barbecue {
                background-image: url("../../lib/base/haier_oven/assets/icn_wholebarbecue_normal.png");
                &.active {
                    background-image: url("../../lib/base/haier_oven/assets/icn_wholebarbecue_active.png");
                }
            }
            .ico-pizza {
                background-image: url("../../lib/base/haier_oven/assets/icn_pizzamode_normal.png");
                &.active {
                    background-image: url("../../lib/base/haier_oven/assets/icn_pizzamode_active.png");
                }
            }
            .ico-upper-fermentation {
                background-image: url("../../lib/base/haier_oven/assets/icn_fermentation_normal.png");
                &.active {
                    background-image: url("../../lib/base/haier_oven/assets/icn_fermentation_active.png");
                }
            }
            .icon-thaw {
                background-image: url("../../lib/base/haier_oven/assets/icn_thaw_normal.png");
                &.active {
                    background-image: url("../../lib/base/haier_oven/assets/icn_thaw_active.png");
                }
            }
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
}

.select-param {
    height: 90px;
    line-height: 90px;
    box-sizing: border-box;
    border-top: 1px solid #dbdbdb;
    position: relative;
    margin: 0 39px 0 53px;
    padding: 0 46px;
    overflow: hidden;
    p {
        float: left;
        font-size: 24px;
        color: #76787a;
    }
    .value-wendu {
        color: #46bcff;
        float: right;
        font-size: 24px;
        i {
            display: inline-block;
            width: 24px;
            height: 13px;
            background-size: 100% 100%;
            margin-left: 5px;
            vertical-align: 3%;
        }
        .icon-arrow-down {
            transform: rotate(-90deg);
            background-image: url("../../lib/base/oven/assets/arrow_down.png");
        }
        .icon-arrow-up {
            background-image: url("../../lib/base/oven/assets/arrow_down.png");
        }
    }
    .vue-js-switch {
        float: right;
        margin-top: 8px;
    }
}
.slide-list {
    border-top: 1px solid #dbdbdb;
    margin: 0 39px 0 53px;
}
.model-select-layer .disable li {
    .hasDisable {
        opacity: 0.5;
        .value-wendu {
            color: #76787a;
        }
    }
}
.noborder {
    border-top: 0;
}
//subpage样式的特殊处理
#app .backControl {
    // background-color: #f4f4f8;
    height: auto;
    min-height: 100%;
    position: absolute;
    .modal {
        width: 1300px;
        height: 906px;
        overflow: hidden;
        box-zizing: border-box;
    }
    .modal-body {
        height: 824px;
        overflow-y: auto;
        padding: 0;
        // border:1px solid red;
    }
    .topbar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 1;
    }
    .subpage-body {
        margin-top: 100px;
        background-color: #fff;
    }
}
.android .backControl {
    box-sizing: border-box;
    padding-bottom: 120px;
}
#app .subpagebakControl {
    background-color: #f4f4f8;
    .modal {
        width: 1300px;
        height: 728px;
        overflow: hidden;
        box-zizing: border-box;
    }
    .modal-body {
        padding: 24px 46px;
    }
    .buttonchoose {
        width: 100%;
        height: 234px;
        background-color: #fff;
        margin-bottom: 16px;
        box-sizing: border-box;
        text-align: center;
        overflow: hidden;
        .chooseTitle {
            width: 100%;
            height: 40px;
            line-height: 40px;
            font-size: 24px;
            color: #c8cacc;
            margin: 0 auto 24px;
        }
        .pattern {
            width: 100%;
            display: flex;
            height: auto;
            justify-content: center;
            div {
                width: auto;
            }
            .lighting {
                margin-right: 80px;
            }
            i {
                display: block;
                width: 90px;
                height: 90px;
                overflow: hidden;
                margin-bottom: 20px;
            }
            span {
                display: block;
                font-size: 24px;
                color: #76787a;
            }
            .c-lighting {
                background: url(../../lib/base/haier_oven/assets/icn_illumination_normal.png)
                    no-repeat center center;
                background-size: 100% 100%;
            }
            .c-time {
                background: url(../../lib/base/haier_oven/assets/icn_timesynchronization_normal.png)
                    no-repeat center center;
                background-size: 100% 100%;
            }
        }
    }
    .selectbox {
        &.lockDetail {
            // margin: 20px auto 83px;
            background-color: #fff;
            border-top: 2px solid #dbdbdb;
            .hd .left {
                font-size: 24px;
                color: #76787a;
            }
            .locktips {
                font-size: 24px;
                color: #c8cacc;
                margin-top: 24px;
            }
        }
        .hd {
            // padding: 20px 0;
            margin: 0 32px;
            height: 90px;
            line-height: 90px;
            border-top: 1px solid #f5f5f5;
            .left {
                float: left;
                font-size: 32px;
                color: #2f3133;
            }
            .right {
                float: right;
                color: #333333;
                font-size: 32px;
            }
            .arrow {
                display: inline-block;
                width: 30px;
                height: 30px;
                background: url(../../lib/base/washer/assets/arrow_down.png)
                    no-repeat;
                background-size: 100% 100%;
                vertical-align: -6px;
                margin-left: 10px;
            }
        }
        .bd {
            display: none;
            overflow: hidden;
            padding: 31px 32px;
            background: #fafafa;
            .option {
                display: block;
                padding: 12px 36px;
                color: #76787a;
                &.selected {
                    background: #46bcff;
                    // border:1px solid #46bcff;
                    border-radius: 3px;
                    color: #fff;
                }
            }
        }
        .bd1 {
            overflow: hidden;
            padding: 20px 92px;
            background: #fafafa;
            text-align: left;
        }
        &.active {
            .hd {
                .arrow {
                    transform: rotate(-180deg);
                }
            }
            .bd {
                display: flex;
            }
        }
        &.disable {
            opacity: 0.5; //todo
        }
    }
}
#app .subpagebakControl2 {
    .modal {
        width: 1300px;
        height: 675px;
        overflow: hidden;
        box-zizing: border-box;
    }
}
//modal特殊样式处理
.modal {
    .picker-item {
        font-size: 30px;
        color: #c8cacc;
        margin-left: 60px;
        margin-right: 60px;
        width: auto;
        &.picker-selected {
            // border-top:1px solid  #DBDBDB;
            // border-bottom:1px solid  #DBDBDB;
            font-size: 36px;
            color: #000000;
        }
    }
    .button_temperature {
        width: 240px;
        height: 84px;
        line-height: 84px;
        text-align: center;
        color: #fff;
        font-size: 36px;
        background: #46bcff;
        border-radius: 6px;
        margin: 55px auto 0;
    }
}
.sureButtongroup {
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    margin: 40px auto 36px;
    .cancle,
    .sure {
        width: 240px;
        height: 84px;
        line-height: 84px;
        text-align: center;
        border-radius: 6px;
        font-size: 36px;
    }
    .cancle {
        background: #ffffff;
        border: 1px solid #76787a;
        color: #76787a;
        margin-right: 24px;
    }
    .sure {
        background: #46bcff;
        color: #ffffff;
    }
}
.disable {
    opacity: 0.5;
}
</style>
