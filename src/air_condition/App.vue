<template>
    <div id="app" :class="appClassObj" @click="showMore=false;">
        <p class="title">{{ params.device_name }}</p>
        <p class="tip" v-show="params.switch === 'off'">已关闭</p>
        <!--<transition name="fade-in">-->
        <div v-show="params.switch === 'on'">
            <svg class="bg" xmlns="http://www.w3.org/2000/svg" width="1920" heigth="420" viewBox="0 0 1920 420">
                <defs>
                    <linearGradient id="lg1" gradientUnits="userSpaceOnUse" x1="961.4509" y1="421.0971" x2="961.4509"
                                    y2="1.0971"><!--x1="0%" y1="0%" x2="0%" y2="100%"-->
                        <stop offset="0" style="stop-color:#FFFFFF; stop-opacity:0"/>
                        <stop offset="1" style="stop-color:#FFFFFF; stop-opacity:0.3"/>
                    </linearGradient>
                </defs>
                <!--<path d="M0 420 L0 40 C450 -100 900 300 1920 20 L1920 420 Z" style="fill:url(#linearGradient);" />-->
                <path
                    d="M1321.5,121.1c-320,0-640-120-960-120c-120,0-240,16.9-360,38v382h1920v-382 C1721.5,74.2,1521.5,121.1,1321.5,121.1z"
                    style="fill:url(#lg1);"/>
            </svg>
            <!--温度Start-->
            <div class="temp">
                <ac-button :info="minusBtn" @tap="setTemperature"></ac-button>
                <div class="temp-show"><label class="temp-number">{{ fakeTemp }}</label><label
                    class="temp-unit">℃</label></div>
                <ac-button :info="plusBtn" @tap="setTemperature"></ac-button>
            </div>
            <!--温度End-->
            <p :class="{'tip':true, 'transparent': tip.length == 0}">{{ tip }}</p>
            <!--底部按钮Start-->
            <div class="bottom">
                <ac-button :info="buttonList.cool" :curValue="params[buttonList.cool.type]" @tap="setParam"></ac-button>
                <ac-button :info="buttonList.heat" :curValue="params[buttonList.heat.type]" @tap="setParam"></ac-button>
                <ac-button :info="buttonList.dehumidify" :curValue="params[buttonList.dehumidify.type]"
                           @tap="setParam"></ac-button>
                <ac-button :info="buttonList.on" v-show="params.switch === 'on'" @tap="toggle"></ac-button>
                <ac-button :info="buttonList.low" :curValue="params[buttonList.low.type]" @tap="setParam"></ac-button>
                <ac-button :info="buttonList.normal" :curValue="params[buttonList.normal.type]"
                           @tap="setParam"></ac-button>
                <ac-button :info="buttonList.high" :curValue="params[buttonList.high.type]" @tap="setParam"></ac-button>
            </div>
            <!--底部按钮End-->
            <div class="more" v-show="!showMore" @click.stop="showMore=true;"></div>
            <!--更多子菜单Start-->
            <transition name="fade-in">
                <div class="subMenu" v-show="showMore" @click.stop="">
                    <devider :content="'模式'"></devider>
                    <div class="more-mode">
                        <ac-button :info="buttonList.mode_auto" :curValue="params[buttonList.mode_auto.type]"
                                   @tap="setParam"></ac-button>
                        <ac-button :info="buttonList.wind" :curValue="params[buttonList.wind.type]"
                                   @tap="setParam"></ac-button>
                    </div>
                    <devider :content="'摆风'"></devider>
                    <div class="more-wind-direction">
                        <ac-button v-if="params.deviceSubCategory === 1" :info="lrBtn" @tap="toggle"></ac-button>
                        <ac-button :info="udBtn" @tap="toggle"></ac-button>
                    </div>
                    <devider :content="'定时'"></devider>
                    <div class="more-timing">
                        <!--<ac-switch :title="'开机时间'" :time="params.bootTime" :on="params.bootSwitch"></ac-switch>-->
                        <!--<ac-switch :title="'关机时间'" :time="params.offTime" :on="params.offSwitch"></ac-switch>-->
                        <ac-switch :title="'开机时间'" :time="params.bootTime" :on="params.bootSwitch"
                                   @change="bootTpVisible = params.bootSwitch"
                                   @toggle="toggle('bootSwitch')"></ac-switch>
                        <ac-switch :title="'关机时间'" :time="params.offTime" :on="params.offSwitch"
                                   @change="offTpVisible = params.offSwitch" @toggle="toggle('offSwitch')"></ac-switch>
                    </div>
                </div>
            </transition>
            <!--更多子菜单End-->
            <!--时间选择器Start-->
            <transition name="fade">
                <time-picker v-show="bootTpVisible" :vis="bootTpVisible" :hour="bootHour" :minute="bootMinute"
                             :title="'设置空调开机时间'"
                             @vchange="setBootTimePickerVisibility" @change="setBootTime"></time-picker>
            </transition>
            <transition name="fade">
                <time-picker v-show="offTpVisible" :vis="offTpVisible" :hour="offHour" :minute="offMinute"
                             :title="'设置空调关机时间'"
                             @vchange="setOffTimePickerVisibility" @change="setOffTime"></time-picker>
            </transition>
            <!--时间选择器End-->
        </div>
        <!--</transition>-->
        <!--<transition name="fade-in">-->
        <div v-show="params.switch !== 'on'">
            <div v-if="params.deviceSubCategory === 0" class="hanging"></div>
            <div v-if="params.deviceSubCategory === 1" class="package"></div>
            <p class="tip"></p>
            <svg class="bg" xmlns="http://www.w3.org/2000/svg" width="1920" heigth="420" viewBox="0 0 1920 420">
                <defs>
                    <linearGradient id="lg2" gradientUnits="userSpaceOnUse" x1="961.4509" y1="421.0971" x2="961.4509"
                                    y2="1.0971"><!--x1="0%" y1="0%" x2="0%" y2="100%"-->
                        <stop offset="0" style="stop-color:#FFFFFF; stop-opacity:0"/>
                        <stop offset="1" style="stop-color:#FFFFFF; stop-opacity:0.75"/>
                    </linearGradient>
                </defs>
                <path
                    d="M1321.5,121.1c-320,0-640-120-960-120c-120,0-240,16.9-360,38v382h1920v-382 C1721.5,74.2,1521.5,121.1,1321.5,121.1z"
                    style="fill:url(#lg2);"/>
            </svg>
            <div class="bottom">
                <ac-button :info="buttonList.cool"></ac-button>
                <ac-button :info="buttonList.heat"></ac-button>
                <ac-button :info="buttonList.dehumidify"></ac-button>
                <ac-button v-show="params.switch === 'off'" :info="buttonList.off" @tap="toggle"></ac-button>
                <ac-button :info="buttonList.low"></ac-button>
                <ac-button :info="buttonList.normal"></ac-button>
                <ac-button :info="buttonList.high"></ac-button>
            </div>
        </div>
        <!--</transition>-->
        <!--<div class=""></div>-->
    </div>
</template>

<style>
    * {
        margin: 0;
        padding: 0;
    }

    body {
        font: 24px/1 'NotoSansHans-Regular';
        color: #FFF;
    }

    html, body, .main {
        height: 100%;
    }

    ::-webkit-scrollbar {
        opacity: 0;
    }

    .invisible {
        visibility: hidden;
    }

    .main {
        box-sizing: border-box;
        padding: 155px 0 180px 0;
        text-align: center;
    }

    /*.main.on{*/
    /*background: #0bc0fe url(assets/bg_on.png) no-repeat center bottom;*/
    /*}*/
    .main.on {
        background-color: #0bc0fe;
    }

    .bg {
        position: absolute;
        left: 0;
        bottom: 180px;
        width: 100%;
        height: auto;
    }

    .main.off {
        background-color: #f2f2f2;
    }

    /*.off .imgWrapper{*/
    /*cursor: default;*/
    /*}*/
    .off .imgWrapper img {
        filter: invert(30%);
    }

    .off .switch img {
        filter: invert(0);
    }

    .hanging, .package {
        height: 360px;
    }

    .hanging {
        background: url(./assets/bg_off_hanging.png) no-repeat center;
    }

    .package {
        background: url(./assets/bg_off_package.png) no-repeat center;
        background-size: 540px 360px;
    }

    .title {
        font-size: 30px;
        margin-bottom: 78px;
    }

    .off .title {
        color: #75787a;
        margin-bottom: 0;
    }

    /*温度*/
    .temp {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .temp-show {
        margin: 0 216px 0 240px;
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
        transition: opacity 1s ease;
        position: relative;
    }

    .tip.transparent {
        opacity: 0;
    }

    .off .tip {
        /*color: #c8cacc;*/
        color: #46bcff;
        margin: 25px 0 37px 0;
    }

    .bottom {
        display: flex;
        margin: 0 240px;
        justify-content: space-around;
        align-items: center;
        position: relative;
    }

    /*图片*/
    .temp img, .bottom img {
        width: 144px;
        height: 144px;
    }

    .switch img {
        width: 204px;
        height: 204px;
    }

    .more, .subMenu {
        position: absolute;
        right: 60px;
        top: 131px;
    }

    /*更多*/
    .more {
        width: 96px;
        height: 96px;
        background: url(./assets/more_normal.png) no-repeat center;
        background-size: 100%;
        outline: 0;
        cursor: pointer;
        border-radius: 100%;
    }

    .more:hover {
        background-image: url(./assets/more_active.png);
    }

    /*子菜单*/
    .fade-enter-active, .fade-in-enter-active, .fade-leave-active {
        transition: opacity 0.5s linear;
    }

    .fade-enter, .fade-leave-to, .fade-in-enter, .fade-in-leave-to {
        opacity: 0
    }

    .subMenu {
        opacity: 0.95;
        background: #ffffff;
        box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.10);
        box-sizing: border-box;
        border-radius: 6px;
        padding: 0 24px;
        width: 456px;
        height: 660px;
        color: #75787a;
        font-size: 24px;
    }

    .subMenu .imgWrapper {
        margin: 25px 24px 10px 24px;
    }

    .subMenu img {
        width: 96px;
        height: 96px;
    }

    .subMenu .devider {
        margin-top: 30px;
    }

    .bottom .btnName {
        opacity: 0.5;
    }

    .off .btnName {
        opacity: 0;
    }

    /*选中样式*/
    .on .active .btnName {
        font-size: 30px;
        opacity: 1;
    }

    .subMenu .active .btnName {
        font-size: 24px;
        color: #46bcff;
        opacity: 1;
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
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 144px;
        height: 144px;
        background: url('./assets/buffering_mode_white.png') no-repeat center;
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

    .on .switch.loading:before {
        background: url('./assets/buffering_power_white.png') no-repeat center;
        background-size: 100%;
    }

    .off .switch.loading:before {
        background: url('./assets/buffering_power_blue.png') no-repeat center;
        background-size: 100%;
    }

    .subMenu .loading:before {
        background: url('./assets/buffering_mode_blue.png') no-repeat center;
        background-size: 100%;
        width: 96px;
        height: 96px;
        top: 24px;
        left: 24px;
    }

    .disabled img {
        filter: invert(12%);
    }

    @keyframes circle {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>

<script>
    import AcButton from './components/AcButton.vue';
    import Devider from './components/Devider.vue';
    import TimePicker from './components/TimePicker.vue';
    import AcSwitch from './components/AcSwitch.vue';

    import {getDeviceName} from '../sdk/hdsmart/helper';

    const [MIN_TEMP, MAX_TEMP] = [16, 30];
    const [POWER, MODE, SPEED, TEMPERATURE, WIND_UP_DOWN, WIND_LEFT_RIGHT, BOOT_SWITCH, OFF_SWITCH] =
        ['switch', 'mode', 'speed', 'temperature', 'wind_up_down', 'wind_left_right', 'bootSwitch', 'offSwitch'];
    const [ON, OFF] = ['on', 'off'];
    const NODE_ID = 'airconditioner.main.';
    //连续设置时间判断间隔
    const SPAN = 500;
    //loading效果延迟
    //    const LOADING_DELAY = 300;
    const LOADING_DELAY = 300;
    //loading class
    const LOADING_CLASS = 'loading';

    //Button构造方法
    function Button(title, type, value, imgSrc, imgActiveSrc, tip) {
        this.title = title;
        this.type = type;
        this.value = value;
        this.imgSrc = imgSrc;
        this.imgActiveSrc = imgActiveSrc;
        this.tip = tip;
    }

    export default {
        components: {AcButton, Devider, TimePicker, AcSwitch},
        data() {
            return {
                buttonList: {
                    //模式
                    cool: new Button('制冷', MODE, 'cold', require('./assets/cool_normal.png'), require('./assets/cool_active.png'), '制冷模式切换成功'),
                    heat: new Button('制热', MODE, 'heat', require('./assets/heat_normal.png'), require('./assets/heat_active.png'), '制热模式切换成功'),
                    dehumidify: new Button('除湿', MODE, 'dehumidify', require('./assets/dehumidify_normal.png'), require('./assets/dehumidify_active.png'), '除湿模式切换成功'),
                    mode_auto: new Button('智能', MODE, 'auto', require('./assets/auto_normal.png'), require('./assets/auto_active.png'), '智能模式切换成功'),
                    wind: new Button('送风', MODE, 'wind', require('./assets/wind_normal.png'), require('./assets/wind_active.png'), '送风模式切换成功'),

                    //风速
                    low: new Button('低风', SPEED, 'low', require('./assets/low_normal.png'), require('./assets/low_active.png'), '低风切换成功'),
                    normal: new Button('中风', SPEED, 'normal', require('./assets/medium_normal.png'), require('./assets/medium_active.png'), '中风切换成功'),
                    high: new Button('高风', SPEED, 'high', require('./assets/high_normal.png'), require('./assets/high_active.png'), '高风切换成功'),

                    //电源开关
                    on: new Button('', POWER, '', require('./assets/on_normal.png'), require('./assets/on_active.png'), ''),
                    off: new Button('', POWER, '', require('./assets/off_normal.png'), require('./assets/off_active.png'), '')
                },
                params: {
                    device_name: '',//设备名称
                    deviceSubCategory: null,//空调类型，0：挂机，1：柜机
                    switch: '',//开关
                    temperature: null,//温度
                    mode: '',//模式
                    speed: '',//风速
                    wind_up_down: '',//上下扫风
                    wind_left_right: '',//左右扫风
//                        sleep: false,//睡眠模式
                    bootSwitch: false,
                    offSwitch: false,
                    bootTime: '',//开机时间
                    offTime: ''//关机时间
                },
                tip: '',//提示，3秒后隐藏
                tipTimer: '',//提示计时器
                showMore: false,//更多菜单是否可见
                bootTpVisible: false,//开机时间选择器是否可见
                offTpVisible: false,//关机时间选择器是否可见
                tempFlag: false,
                tempTimer: null,
                fakeTemp: null,
                loadingTimer: null,
                loadingElement: null,
                complete: false
            }
        },
        mounted: function () {
            HdSmart.ready(() => {
                HdSmart.Device.getSnapShot((data) => {
                    this.setState(data.attr);
                    HdSmart.UI.hideLoading();
                    HdSmart.UI.setWebViewTouchRect(0, 0, '100%', '100%');
                }, () => {
                    HdSmart.UI.hideLoading();
                    HdSmart.UI.setWebViewTouchRect(0, 0, '100%', '100%');
                });

                HdSmart.onDeviceListen((data) => {
                    console.log('report: ' + JSON.stringify(data));
                    this.setState(data.result.attr);
                })
            });
        },
        computed: {
            appClassObj: function () {
                let obj = {main: true};
                obj[this.params.switch] = true;
                return obj;
            },
            lrBtn: function () {
                return new Button('左右', WIND_LEFT_RIGHT, this.params.wind_left_right, require('./assets/left_right_normal.png'), require('./assets/left_right_active.png'));
            },
            udBtn: function () {
                return new Button('上下', WIND_UP_DOWN, this.params.wind_up_down, require('./assets/up_down_normal.png'), require('./assets/up_down_active.png'));
            },
            minusBtn: function () {
                return {
                    //降低温度
                    type: TEMPERATURE,
                    imgSrc: require('./assets/minus_normal.png'),
//                    imgSrc: require('./assets/minus_diabled.png'),
                    imgActiveSrc: require('./assets/minus_pressed.png'),
//                    value: this.params.temperature > MIN_TEMP ? this.params.temperature - 1 : this.params.temperature
                    value: this.fakeTemp > MIN_TEMP ? this.fakeTemp - 1 : this.fakeTemp,
                    //送风模式下不能设置温度
                    disabled: this.params.mode === 'wind'
                }
            },
            plusBtn: function () {
                return {
                    //升高温度
                    type: TEMPERATURE,
                    imgSrc: require('./assets/plus_normal.png'),
                    imgActiveSrc: require('./assets/plus_pressed.png'),
                    value: this.fakeTemp < MAX_TEMP ? this.fakeTemp + 1 : this.fakeTemp,
//                    value: this.params.temperature < MAX_TEMP ? this.params.temperature + 1 : this.params.temperature
                    //送风模式下不能设置温度
                    disabled: this.params.mode === 'wind'
                }
            },
            bootHour: function () {
                return this.getHour(this.params.bootTime);
            },
            bootMinute: function () {
                return this.getMinute(this.params.bootTime);
            },
            offHour: function () {
                return this.getHour(this.params.offTime);
            },
            offMinute: function () {
                return this.getMinute(this.params.offTime);
            }
        },
        watch: {
            tempFlag(val){
                if (!val) {
//                    console.log('准备发送请求：' + this.fakeTemp);
                    this.setParam(TEMPERATURE, this.fakeTemp, '温度设置成功');
                }
            }
        },
        methods: {
            setState(attr){//设置空调状态
                if (!attr) {
//                    alert('attr---' + undefined)
                    return;
                }

                if (!this.params.device_name) {
                    this.params.device_name = attr.device_name;
                }
                this.params.switch = attr.switchStatus;
                this.params.temperature = attr.temperature;
                this.fakeTemp = attr.temperature;
                this.params.mode = attr.mode;
                this.params.speed = attr.speed;
                this.params.wind_up_down = attr.wind_up_down;
                this.params.wind_left_right = attr.wind_left_right;
                if (this.params.deviceSubCategory == null) {
                    this.params.deviceSubCategory = attr.deviceSubCategory;
                }

                //TODO: 830后做
                /*let[onTimer, offTimer] = [null, null];
                 if(attr.timer instanceof Array){
                 onTimer = attr.timer.find((v) => { return v.type === 'air_switch_on' });
                 offTimer = attr.timer.find((v) => { return v.type === 'air_switch_off' });
                 }

                 if(onTimer){
                 this.params.bootSwitch = ( onTimer.status === 1);
                 this.params.bootTime = onTimer.time;
                 }
                 else{
                 this.params.bootSwitch = false;
                 this.params.bootTime = '';
                 }

                 if(offTimer){
                 this.params.offSwitch = ( offTimer.status === 1);
                 this.params.offTime = offTimer.time;
                 }
                 else{
                 this.params.offSwitch = false;
                 this.params.offTime = '';
                 }*/
            },
            toggle(type, value, tip, el){
                let str = '';
                let oldValue = this.params[type];
                let newValue;

                if (oldValue === ON) {
                    newValue = OFF;
                    str = '已关闭';
                }
                else if (oldValue === OFF) {
                    newValue = ON;
                    str = '已启动';
                }
                else if (oldValue === true) {
                    str = '已关闭';
                    newValue = false;
                }
                else if (oldValue === false) {
                    str = '已启动';
                    newValue = true;
                }

                if (type === WIND_LEFT_RIGHT) {
                    this.setParam(type, newValue, '左右扫风' + str, el);
                }
                else if (type === WIND_UP_DOWN) {
                    this.setParam(type, newValue, '上下扫风' + str, el);
                }
                else if (type === BOOT_SWITCH) {
                    this.setTimer(BOOT_SWITCH, newValue, this.params.bootTime, '开机时间' + str);
                }
                else if (type === OFF_SWITCH) {
                    this.setTimer(OFF_SWITCH, newValue, this.params.offTime, '关机时间' + str);
                }
                else {
                    this.setParam(type, newValue, tip, el);
                }
            },
            setParam(type, value, tip, el){
                let that = this;
                if (that.params[type] === value) {//如果参数值没有变化，直接返回
                    return;
                }

                this.complete = false;
                if (el) {
                    that.loadingTimer = setTimeout(() => {
                        removeLoading();
                        if(that.complete){
                            return;
                        }
//                        alert('setTimer');
                        that.loadingElement = el;
                        that.loadingElement.classList.add(LOADING_CLASS);
//                        alert(that.complete + '---' + document.querySelector('.loading'));
                    }, LOADING_DELAY);
                }

                let attr = {};
                attr[type] = value;

                HdSmart.Device.instruct('set', NODE_ID + type, attr,
                    () => {
                        this.complete = true;
                        removeLoading();

                        that.params[type] = value;
                        that.setTip(tip);
                    },
                    (data) => {
                        this.complete = true;
                        removeLoading();

                        if (type === TEMPERATURE) {//
                            that.fakeTemp = that.params.temperature;
                        }
                        that.setTip('设置失败');
//                        alert('控制失败：' + JSON.stringify(that.params));
//                        console.log('设置['+ type +']失败: ' + data);
                    }
                );

                //移除loading
                function removeLoading() {
                    clearTimeout(that.loadingTimer);

                    if (that.loadingElement) {
                        that.loadingElement.classList.remove(LOADING_CLASS);
                        that.loadingElement = null;
                    }
                }
            },
            setTimer(switchType, switchValue, time, tip){
                //没有设置时间，不发送指令
                if (!time) {
                    this.params[switchType] = switchValue;
                    this.setTip(tip);
                    return;
                }

                let timerObj = this.getTimerObj(switchValue, time);

                let attr = {};
                attr[POWER] = switchType === BOOT_SWITCH ? ON : OFF;

                HdSmart.Device.instruct('set', NODE_ID + POWER, attr,
                    () => {
                        this.params[switchType] = switchValue;
                        if (switchType === BOOT_SWITCH) {
                            this.params.bootTime = time;
                        }
                        else if (switchType === OFF_SWITCH) {
                            this.params.offTime = time;
                        }
                        this.setTip(tip);
                    },
                    () => {
                        this.setTip('设置失败');
                    },
                    timerObj
                );
            },
            setTemperature(type, value){
                //送风模式不能设置温度
                if (this.params.mode === 'wind') {
                    this.setTip('送风模式下不能设置温度');
                    return;
                }

                this.tempFlag = true;
                this.fakeTemp = value;
                if (this.tempTimer) {
                    clearTimeout(this.tempTimer);
                }
                this.tempTimer = setTimeout(() => {
                    this.tempFlag = false;
                }, SPAN);
            },
            getTimerObj(switchValue, time){
                if (switchValue === true) {//打开开关
                    return {operation: "add", time: time, periodic: 1};
                }
                else {
                    return {operation: "delete"};
                }
            },
            setBootTimePickerVisibility(visible){
                this.bootTpVisible = visible
            },
            setOffTimePickerVisibility(visible){
                this.offTpVisible = visible
            },
            setBootTime(value){
//                this.setParam('bootTime', value);
                if (value !== this.params.bootTime) {
                    this.setTimer(BOOT_SWITCH, true, value, '开机时间设置成功');
                }
                this.bootTpVisible = false;
            },
            setOffTime(value){
//                this.setParam('offTime', value);
                if (value !== this.params.offTime) {
                    this.setTimer(OFF_SWITCH, true, value, '关机时间设置成功');
                }
                this.offTpVisible = false;
            },
            setTip(tip){
                this.tip = tip || '';
                if (this.tipTimer) {
                    clearTimeout(this.tipTimer);
                }
                this.tipTimer = setTimeout(() => {
                    this.tip = '';
                }, 3000);
            },
            getHour(str){
                var arr = str.split(':');
                var s = '';
                if (arr.length > 0) {
                    s = arr[0].trim();
                }

                return s.length > 0 ? s : '12';
            },
            getMinute(str){
                var arr = str.split(':');
                var s = '';

                if (arr.length > 1) {
                    s = arr[1].trim();
                }

                return s.length > 0 ? s : '30';
            }
        }
    }
</script>


