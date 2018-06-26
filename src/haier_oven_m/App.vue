<template>
    <div id="app">
        <!-- off -->
        <div class="page-off wrapper" v-if="model.switch==='off'">
            <div class="name">{{device_name}}</div>
            <div class="tip">已关闭</div>
            <div class="oven"></div>
            <div class="off_button">
                <a href="" class="btn btn-off" @click.prevent="setSwitch('on')">
                    <i></i>
                </a>
            </div>
        </div>
        <!-- on -->
        <div class="page-on wrapper" v-if="model.switch==='on'">
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
            <div class="offButton">
                <button @click="stopOven">
                    <i class="c-stop"></i>停止</button>
            </div>
            <div class="controls">
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
             <!-- 预约烘烤时间弹窗 -->
            <modal v-model="barbicueTimeAlert" title="预约烧烤结束时间" class="subpagebakControl2">
                <mt-datetime-picker day-format="{value}"
                    hour-format="{value} 时"
                    minute-format="{value} 分" ref='picker' type="clock" :clockStartData="barbicueTimestart" :clockEndData="barbicueTimeend"  :item-height="50"
                    :visible-item-count="5" 
                    @confirm="selectBarbicueTime">
                </mt-datetime-picker>
                <div class="buttongroup">
                    <div class="cancle" @click="barbicueTimeAlert = false">取消</div>
                    <div class="sure" @click="handleChange">确定</div>
                </div>
            </modal>
        </div>

        <sub-page class="model-select-layer backControl" v-model="modelLayerShow" title="模式">
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
                            <i class="icon-arrow-down"></i>
                        </span>
                    </div>
                </div>
                <modal title="烘烤温度" class="modalControl" v-model="wenduSelectFlag">
                    <picker :slots="wenduSlot" @change="selectWendu" :valueKey="'value'" :item-height="40" :visible-item-count="7"></picker>
                    <div class="button_temperature" @click="wenduSelectFlag = false">完成</div>
                </modal>
                <!-- <div class="slide-list" v-show="wenduSelectFlag">
                    <picker :slots="wenduSlot" @change="selectWendu" :valueKey="'value'" :item-height="30" :visible-item-count="3"></picker>
                </div> -->
                <div class="select-param" @click="toggleShowSlider('time')">
                    <div class="hasDisable">
                        <p>烘烤时长</p>
                        <span class="value-wendu">{{allAttribute.bake_duration}}分钟
                            <i class="icon-arrow-down"></i>
                        </span>
                    </div>
                </div>
                <modal title="烘烤时长" class="modalControl" v-model="timeSelectFlag">
                    <picker :slots="timeSlot" @change="selectTime" :valueKey="'value'" :item-height="40" :visible-item-count="7"></picker>
                    <div class="button_temperature" @click="timeSelectFlag = false">预约</div>
                </modal>
                <!-- <div class="slide-list" v-show="timeSelectFlag">
                    <picker :slots="timeSlot" @change="selectTime" :valueKey="'value'" :item-height="30" :visible-item-count="3"></picker>
                </div> -->
                <div class="sureButtongroup">
                    <div class="cancle">取消</div>
                    <div class="sure">确定</div>
                </div>
            </div>
        </sub-page>

        <sub-page v-model="moreLayerShow" title="更多" class="subpagebakControl">
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
            </div>
        </sub-page>
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
import Picker from "../../lib/components/Picker/picker";
import AllConfig from "./config";
import SubPage from "../../lib/components/SubPage";
import ModeButton from "./components/ModeButton.vue";
import Modal from "../../lib/components/Modal";
import Vue from 'vue';
import DatetimePicker from '../../lib/components/datetime-picker';

Vue.component(DatetimePicker.name, DatetimePicker);


export default {
    name: "app",
    components: {
        SwitchButton,
        Picker,
        SubPage,
        ModeButton,
        Modal,
        DatetimePicker
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
            barbicueTimeAlert:false,//烘烤预约时间蒙层，
            barbicueTimestart:'',
            barbicueTimeend:'',
            //更多选择层
            moreLayerShow: false, //todo
            wenduSelectFlag: false,
            timeSelectFlag: false,
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
        showModelBarbicueTime() {//预约烘烤时间
            //todo
            this.$refs.picker.open();//显示时间控件
            this.barbicueTimeAlert = true;
            this.barbicueTimeSlot = true;
            var timeNow = new Date().getTime(); //当前时间戳
            var total = this.allAttribute.remaining; //单位：分钟
            var totalChange = total * 60 * 1000; //将当前模式时间转化为毫秒
            var startTime = timeNow + totalChange; //预约开始时间节点
            var endTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 当前时间+24小时
            var list = [];
            var endTimestamp = new Date().setDate(new Date().getDate() + 1)
        
            this.barbicueTimestart=String(startTime);
            this.barbicueTimeend=String(endTime);
            console.log(1, startTime);
            console.log(2, endTime);
        },
        selectBarbicueTime(value) {
            console.log(value,88888888888)
        },
        handleChange(){
            this.$refs.picker.confirm();
            // this.$refs.picker.confirm.call(this.$refs.picker2, this.$refs.picker2.currentValue);
            this.barbicueTimeAlert = false;
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
            console.log("wendu", values);
            if (values.length && values[0] && this.wenduSelectFlag) {
                this.allAttribute.temperature = values[0].value;
            }
        },
        selectTime(picker, values) {
            console.log("time", values);
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
        position: absolute;
        left: 0;
        top: 168px;
        width: 100%;
        height: 45px;
        line-height: 45px;
        text-align: center;
        font-size: 32px;
        color: #76787a;
    }
    .tip {
        position: absolute;
        left: 0;
        top: 212px;
        width: 100%;
        text-align: center;
        font-size: 30px;
        // opacity: 0.5;
        font-size: 28px;
        color: #c8cacc;
    }
    //关机样式
    .oven {
        width: 360px;
        height: 360px;
        position: absolute;
        left: 50%;
        top: 33.6%;
        transform: translate(-50%, 0);
        background: url(../../lib/base/haier_oven/assets/img_ovenline@2x.png)
            no-repeat;
        background-size: 100% 100%;
    }
    .off_button {
        position: absolute;
        bottom: 18%;
        left: 50%;
        transform: translateX(-50%);
        width: 144px;
        height: 144px;
        a {
            width: 100%;
            height: 100%;
            display: block;
            i {
                width: 100%;
                height: 100%;
                display: block;
                background: url(../../lib/base/washer/assets_m/btn_power@2x.png)
                    no-repeat center;
                background-size: 100% 100%;
            }
        }
    }
}

.more-btn {
    position: absolute;
    right: 65px;
    width: 36px;
    height: 36px;
    top: 166px;
    background-image: url("../../lib/base/oven/assets/btn_more@2x.png");
    background-size: 100% 100%;
}
.wrapper {
    width: 100%;
    min-height: 100%;
    height: auto;
    overflow-y: auto;
    text-align: center;
    margin: 0 auto;
    padding:88px 0 0 0;
    box-sizing: border-box;
    position: absolute;
    .color-gray {
        color: #999;
    }
    .main-title {
        font-weight: normal;
        margin:80px auto 10%;
        margin-bottom: 10%;
        font-size: 32px;
        color: #76787a;
    }
    .pannel {
        height: 480px;
        width: 510px;
        margin: 0 auto;
        background: #fff;
        border-radius: 38px;
        overflow: hidden;
        position: relative;
        .p-main-time {
            height: 120px;
            line-height: 120px;
            color: #46bcff;
            margin: 118px 0 0 0;
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
            margin-top: 72px;
        }
        .p-model {
            padding-top: 48px;
            height: 32px;
            line-height: 32px;
            color: #2f3133;
            font-size: 32px;
        }
        .p-status {
            position: absolute;
            width: 100%;
            top: 101px;
            left: 0;
            text-align: center;
            height: 28px;
            line-height: 28px;
            font-size: 28px;
            color: #b5b5b5;
        }
        .p-wendu {
            font-weight: bold;
            opacity: 1;
            color: #46bcff;
        }
    }
    .controls {
        width: 100%;
        box-sizing: border-box;
        padding: 0 60px;
        justify-content: space-between;
        margin-bottom: 42px;
    }
    .offButton {
        justify-content: center;
    }
    .controls,
    .offButton {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        padding-top: 6%;
        align-items: center;
        button {
            // flex-grow: 1;
            outline: none;
            width: 140px;
            height: auto;
            display: inline-block;
            background: none;
            border: 0;
            color: #76787a;
            text-align: center;
            // margin: 0 25px;
            i {
                display: inline-block;
                width: 120px;
                height: 120px;
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
        padding: 79px 0 0 23px;
        overflow: hidden;
        margin-bottom: 26px;
        li {
            list-style: none;
            text-align: center;
            float: left;
            width: 120px;
            margin: 0 28px;
            padding-bottom: 54px;
            div {
                margin-top: 20px;
                font-size: 28px;
                color: #76787a;
            }
            a {
                display: block;
                width: 120px;
                height: 120px;
                background-size: 100% 100%;
            }
            .traditional-baking {
                background-image: url("../../lib/base/haier_oven/assets/icn_traditionalbaking_norma.png");
                &.active {
                    background-image: url("../../lib/base/haier_oven/assets/icn_traditionalbaking_active@2x.png");
                }
            }
            .ico-3d {
                background-image: url("../../lib/base/haier_oven/assets/icn_3Dhotair_normal@2x.png");
                &.active {
                    background-image: url("../../lib/base/haier_oven/assets/icn_3Dhotair_active@2x.png");
                }
            }
            .ico-convective-baking {
                background-image: url("../../lib/base/haier_oven/assets/icn_convectionbake_normal@2x.png");
                &.active {
                    background-image: url("../../lib/base/haier_oven/assets/icn_convectionbake_active@2x.png");
                }
            }
            .ico-barking {
                background-image: url("../../lib/base/haier_oven/assets/icn_baking_normal@2x.png");
                &.active {
                    background-image: url("../../lib/base/haier_oven/assets/icn_baking_active@2x.png");
                }
            }
            .ico-hot-air-barbecue {
                background-image: url("../../lib/base/haier_oven/assets/icn_hotairbarbecue_normal@2x.png");
                &.active {
                    background-image: url("../../lib/base/haier_oven/assets/icn_hotairbarbecue_active@2x.png");
                }
            }
            .ico-up-barbecue {
                background-image: url("../../lib/base/haier_oven/assets/icn_upthebarbecue_normal@2x.png");
                &.active {
                    background-image: url("../../lib/base/haier_oven/assets/icn_upthebarbecue_active@2x.png");
                }
            }
            .ico-whole-barbecue {
                background-image: url("../../lib/base/haier_oven/assets/icn_wholebarbecue_normal@2x.png");
                &.active {
                    background-image: url("../../lib/base/haier_oven/assets/icn_wholebarbecue_active@2x.png");
                }
            }
            .ico-pizza {
                background-image: url("../../lib/base/haier_oven/assets/icn_pizzamode_normal@2x.png");
                &.active {
                    background-image: url("../../lib/base/haier_oven/assets/icn_pizzamode_active@2x.png");
                }
            }
            .ico-pizza {
                background-image: url("../../lib/base/haier_oven/assets/icn_pizzamode_normal@2x.png");
                &.active {
                    background-image: url("../../lib/base/haier_oven/assets/icn_pizzamode_active@2x.png");
                }
            }
            .ico-pizza {
                background-image: url("../../lib/base/haier_oven/assets/icn_pizzamode_normal@2x.png");
                &.active {
                    background-image: url("../../lib/base/haier_oven/assets/icn_pizzamode_active@2x.png");
                }
            }
            .ico-upper-fermentation {
                background-image: url("../../lib/base/haier_oven/assets/icn_fermentation_normal@2x.png");
                &.active {
                    background-image: url("../../lib/base/haier_oven/assets/icn_fermentation_active@2x.png");
                }
            }
            .icon-thaw {
                background-image: url("../../lib/base/haier_oven/assets/icn_thaw_normal@2x.png");
                &.active {
                    background-image: url("../../lib/base/haier_oven/assets/icn_thaw_active@2x.png");
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
    height: 120px;
    line-height: 120px;
    box-sizing: border-box;
    border-bottom: 1px solid #dbdbdb;
    position: relative;
    margin: 0 0 0 32px;
    padding: 0 32px 0 0;
    overflow: hidden;
    p {
        float: left;
        font-size: 32px;
        color: #2f3133;
    }
    .value-wendu {
        color: #46bcff;
        float: right;
        font-size: 32px;
        i {
            display: inline-block;
            width: 24px;
            height: 13px;
            background-size: 100% 100%;
            margin-left: 5px;
            vertical-align: 5%;
        }
        .icon-arrow-down {
            transform: rotate(-90deg);
            background-image: url("../../lib/base/oven/assets/arrow_down.png");
        }
        .icon-arrow-up {
            background-image: url("../../lib/base/oven/assets/arrow_up.png");
        }
    }
    .vue-js-switch {
        float: right;
        margin-top: 8px;
    }
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
    // padding-top: 90px;
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
.android {
    .backControl {
        box-sizing: border-box;
        padding-bottom: 120px;
    }
    #app{
        padding-bottom: 120px;
        box-sizing: border-box;
    }
}
#app .subpagebakControl {
    background-color: #f4f4f8;
    .buttonchoose {
        width: 100%;
        height: 322px;
        background-color: #fff;
        margin-bottom: 16px;
        box-sizing: border-box;
        text-align: center;
        overflow: hidden;
        .chooseTitle {
            width: 100%;
            height: 40px;
            line-height: 40px;
            font-size: 28px;
            color: #76787a;
            margin: 52px 0 24px 0;
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
                margin-right: 56px;
            }
            i {
                display: block;
                width: 120px;
                height: 120px;
                overflow: hidden;
                margin-bottom: 20px;
            }
            span {
                display: block;
                font-size: 28px;
                color: #76787a;
            }
            .c-lighting {
                background: url(../../lib/base/haier_oven/assets/icn_illumination_normal@2x.png)
                    no-repeat center center;
                background-size: 100% 100%;
            }
            .c-time {
                background: url(../../lib/base/haier_oven/assets/icn_timesynchronization_normal@2x.png)
                    no-repeat center center;
                background-size: 100% 100%;
            }
        }
    }
    .selectbox {
        &.lockDetail {
            margin: 20px auto 83px;
            background-color: #fff;
            .hd .left {
                font-size: 32px;
                color: #2f3133;
            }
        }
        .hd {
            padding: 20px 0;
            margin: 0 32px;
            height: 80px;
            line-height: 80px;
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
        width: 600px;
        height: auto;
        overflow-y:auto;
        box-sizing: border-box;
        .picker-item{
            margin-left:0;
            margin-right:0;
        }
    }
    .modal-body{
        position: relative;
        width:100%;
        height:auto;
        overflow-y:auto;
        top:0;
        left:0;
        overflow-y:auto;
        background-color:#fff;
        padding:0 0 36px 0;
        box-sizing:border-box;
        .mint-popup-bottom{
            position: relative;
            top:0;
            left:0;
            right:auto;
            bottom:auto;
            width:100%;
            box-sizing:border-box;
            padding:50px 0px 60px 0px;
            transform: translate3d(0,0,0);

        }
        .buttongroup{
            width:100%;
            height:auto;
            display: flex;
            justify-content: center;
            align-items: center;
            .cancle,.sure{
                width:240px;
                height: 84px;
                line-height:84px;
                text-align: center;
                font-size: 36px;
                border-radius: 6px;
                box-sizing:border-box;
            }
            .cancle{
                background: #FFFFFF;
                border: 1px solid #76787A;
                margin-right: 24px;
            }
            .sure{
                background: #46BCFF;
                color:#fff;
            }
        }
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
    margin: 60px auto;
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
        box-sizing:border-box;
    }
    .sure {
        background: #46bcff;
        color: #ffffff;
    }
}
.disable {
    opacity: 0.5;
}
// 日期组件样式调整
.picker-toolbar{
    display: none !important;
}
.v-modal{
    display:none;
}

</style>
