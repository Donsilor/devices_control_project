<template>
    <div id="app" :class="appClassObj" @click="screenClick">
        <p class="title" v-show="!initErr">{{ params.device_name }}</p>
        <p class="tip" v-show="(!initErr) && params.switch === 'off'">已关闭</p>

        <!--开机界面-->
        <div v-show="(!initErr) && params.switch === 'on'">
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
                    <!--TODO:830以后做-->
                    <!--<devider :content="'定时'"></devider>-->
                    <!--<div class="more-timing">-->
                        <!--<ac-switch :title="'开机时间'" :time="params.bootTime" :on="params.bootSwitch"-->
                                   <!--@change="bootTpVisible = params.bootSwitch"-->
                                   <!--@toggle="toggle('bootSwitch')"></ac-switch>-->
                        <!--<ac-switch :title="'关机时间'" :time="params.offTime" :on="params.offSwitch"-->
                                   <!--@change="offTpVisible = params.offSwitch" @toggle="toggle('offSwitch')"></ac-switch>-->
                    <!--</div>-->
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

        <!--关机界面-->
        <div v-show="(!initErr) && params.switch === 'off'">
            <!--<p class="tip"></p>-->
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
            <div v-if="params.deviceSubCategory === 0" class="hanging"></div>
            <div v-if="params.deviceSubCategory === 1" class="package"></div>
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

        <!--初始化失败界面-->
        <div v-show="initErr">
            <img src='./assets/init_err.png' />
            <p class="tip">加载失败，请点击屏幕刷新</p>
        </div>
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

    /*main样式*/
    .main {
        box-sizing: border-box;
        padding: 155px 0 180px 0;
        text-align: center;
    }
    .main.on {
        background-color: #0bc0fe;
    }
    .main.off {
        background-color: #f2f2f2;
    }
    .main.err{
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
    .bottom .imgWrapper{
        margin-bottom: 10px;
    }

    .hanging, .package {
        height: 360px;
        margin-bottom: 45px;
    }
    .hanging {
        background: url(./assets/bg_off_hanging.png) no-repeat center;
    }
    .package {
        background: url(./assets/bg_off_package.png) no-repeat center;
        background-size: 540px 360px;
    }

    /*title样式*/
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
        transition: opacity 1s linear;
        position: relative;
    }
    .tip.transparent {
        opacity: 0;
    }
    .off .tip {
        /*color: #c8cacc;*/
        color: #46bcff;
        margin: 24px 0;
        /*margin: 25px 0 37px 0;*/
    }
    .err .tip{
        margin-top: 36px;
        color: #c8cacc;
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
    .off .imgWrapper img {
        filter: invert(30%);
    }
    .off .switch img {
        filter: invert(0);
    }
    .err img{
        width: 360px;
        height: 360px;
    }

    /*更多*/
    .more, .subMenu {
        position: absolute;
        right: 60px;
        top: 132px;
    }
    .more {
        width: 96px;
        height: 96px;
        background: url(./assets/more_normal.png) no-repeat center;
        background-size: 96px 96px;
        outline: 0;
        cursor: pointer;
        border-radius: 100%;
        /*扩展点击范围*/
        padding: 24px;
        top: 108px;
        right: 36px;
    }
    .more:hover {
        background-image: url(./assets/more_active.png);
    }

    /*!*动画样式*!*/
    /*.fade-enter-active, .fade-in-enter-active, .fade-leave-active {*/
        /*transition: opacity 0.5s linear;*/
    /*}*/
    /*.fade-enter, .fade-leave-to, .fade-in-enter, .fade-in-leave-to {*/
        /*opacity: 0*/
    /*}*/

    /*子菜单*/
    .subMenu {
        opacity: 0.95;
        background: #ffffff;
        box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.10);
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
    .subMenu .imgWrapper {
        margin: 0 24px 18px 24px;
    }
    .subMenu img {
        /*width: 96px;*/
        /*height: 96px;*/
        width: 120px;
        height: 120px;
    }
    .subMenu .devider {
        /*margin-top: 30px;*/
        margin: 30px 0;
    }
    .more-timing {
        font-size: 30px;
        margin-top: 12px;
    }

    /*按钮底部文字样式*/
    .bottom .btnName {
        opacity: 0.5;
        line-height: 30px;
        display: inline-block;
    }
    .off .btnName {
        opacity: 0;
    }
    .on .active .btnName {
        font-size: 30px;
        opacity: 1;
    }
    .subMenu .active .btnName {
        font-size: 24px;
        color: #46bcff;
        opacity: 1;
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
        background: url('./assets/buffering_mode_white.gif') no-repeat center;
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
        background: url('./assets/buffering_power_white.gif') no-repeat center;
        background-size: 100%;
    }
    .off .switch.loading:before {
        background: url('./assets/buffering_power_blue.gif') no-repeat center;
        background-size: 100%;
    }
    .subMenu .loading:before {
        background: url('./assets/buffering_submenu_blue.gif') no-repeat center;
        background-size: 100%;
        width: 120px;
        height: 120px;
        top: 0;
        left: 24px;
    }

    /*按钮点击样式*/
    .pressed img{
        filter: opacity(0.67);
    }
    .subMenu .pressed .imgWrapper{
        background: rgba(0,0,0,0.1);
    }
    .pressed.switch img{
        filter: opacity(1);
    }
    /*.pressed.switch .imgWrapper{*/
        /*border-radius: 100%;*/
        /*border: 1px solid transparent;*/
    /*}*/
    .on .pressed.switch .imgWrapper, .temp .pressed .imgWrapper{
        background-color: rgba(255,255,255,0.5)
    }
    .off .pressed.switch .imgWrapper{
        background-color: rgba(70,188,255,0.5);
    }
    .off .pressed.switch .img-normal{
        display: none;
    }
    .off .pressed.switch .img-active{
        display: inline-block;
    }

    /*disabled样式*/
    .disabled img {
        filter: invert(12%);
    }

    /*.pageTip{
        opacity:0.8;
        background: #333;
        width:100%;
        line-height:84px;
        position: absolute;
        top: 155px;
        left: 0;
        font-size: 30px;
    }
    .pageTip:before{
        content: '';
        display: inline-block;
        width: 34px;
        height: 84px;
        margin-right: 10px;
        vertical-align: middle;
        background: url(./assets/icn_notice_white.png) no-repeat center;
        background-size: 100%;
    }*/
    /*刷新*/
    /*.refresh{*/
        /*cursor: pointer;*/
        /*color: #46bcff;*/
    /*}*/
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
    const SPAN = 300;
    //loading效果延迟
    const LOADING_DELAY = 600;
    //loading class
    const LOADING_CLASS = 'loading';
    //pressed class
    const PRESSED_CLASS = 'pressed';
    //提示持续时间--3s
    const TIP_DURATION = 3000;

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
//                    mode_auto: new Button('智能', MODE, 'auto', require('./assets/auto_normal.png'), require('./assets/auto_active.png'), '智能模式切换成功'),
//                    wind: new Button('送风', MODE, 'wind', require('./assets/wind_normal.png'), require('./assets/wind_active.png'), '送风模式切换成功'),
                    mode_auto: new Button('智能', MODE, 'auto', require('./assets/mode_auto_normal.png'), require('./assets/mode_auto_active.png'), '智能模式切换成功'),
                    wind: new Button('送风', MODE, 'wind', require('./assets/mode_air_normal.png'), require('./assets/mode_air_active.png'), '送风模式切换成功'),

                    //风速
                    low: new Button('低风', SPEED, 'low', require('./assets/low_normal.png'), require('./assets/low_active.png'), '低风切换成功'),
                    normal: new Button('中风', SPEED, 'normal', require('./assets/medium_normal.png'), require('./assets/medium_active.png'), '中风切换成功'),
                    high: new Button('高风', SPEED, 'high', require('./assets/high_normal.png'), require('./assets/high_active.png'), '高风切换成功'),

                    //电源开关
                    on: new Button('', POWER, '', require('./assets/on_normal.png'), require('./assets/on_active.png'), ''),
                    off: new Button('', POWER, '', require('./assets/off_normal.png'), require('./assets/off_active.png'), '')
                },
                params: {
                    //设备名称
                    device_name: '',
                    //空调类型，0：挂机，1：柜机
                    deviceSubCategory: null,
                    //开关
                    switch: '',
                    //温度
                    temperature: null,
                    //模式
                    mode: '',
                    //风速
                    speed: '',
                    //上下扫风
                    wind_up_down: '',
                    //左右扫风
                    wind_left_right: '',
//                        sleep: false,//睡眠模式
                    bootSwitch: false,
                    offSwitch: false,
                    //开机时间
                    bootTime: '',
                    //关机时间
                    offTime: ''
                },
                //提示，3秒后隐藏
                tip: '',
                //提示计时器
                tipTimer: '',
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
                complete: false,
                //当前点击的按钮
                curButton: null,
                //页面初始化失败
                initErr: false,
                //获取快照是否完成
                initComplete: false
            }
        },
        computed: {
            appClassObj: function () {
                let obj = {main: true};
                obj[this.params.switch] = true;
                obj['err'] = this.initErr;
                return obj;
            },
            lrBtn: function () {
//                return new Button('左右', WIND_LEFT_RIGHT, this.params.wind_left_right, require('./assets/left_right_normal.png'), require('./assets/left_right_active.png'));
                return new Button('左右', WIND_LEFT_RIGHT, this.params.wind_left_right, require('./assets/horizontal_normal.png'), require('./assets/horizontal_active.png'));
            },
            udBtn: function () {
//                return new Button('上下', WIND_UP_DOWN, this.params.wind_up_down, require('./assets/up_down_normal.png'), require('./assets/up_down_active.png'));
                return new Button('上下', WIND_UP_DOWN, this.params.wind_up_down, require('./assets/vertical_normal.png'), require('./assets/vertical_active.png'));
            },
            minusBtn: function () {
                return {
                    //降低温度
                    type: TEMPERATURE,
                    imgSrc: require('./assets/minus_normal.png'),
                    imgActiveSrc: require('./assets/minus_pressed.png'),
//                    value: this.fakeTemp > MIN_TEMP ? this.fakeTemp - 1 : this.fakeTemp,
                    value: this.fakeTemp - 1,
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
                    value: this.fakeTemp + 1,
//                    value: this.fakeTemp < MAX_TEMP ? this.fakeTemp + 1 : this.fakeTemp,
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
                    this.setParam(TEMPERATURE, this.fakeTemp, '温度设置成功', this.curButton);
                }
            }
        },
        mounted: function () {
            let that = this;
            HdSmart.ready(() => {
                that.init();

                //监听设备状态report
                HdSmart.onDeviceListen((data) => {
                    console.log('report: ' + JSON.stringify(data));
                    if(data.result){
                        if(this.initErr){
                            //初始化失败之后的第一次report，重新获取快照
                            that.init();
                        }
                        else{
                            if(this.initComplete){
                                that.setState(data.result.attr);
                            }
                        }
                    }
                })
            });
        },
        methods: {
            //初始化，获取设备快照
            init(){
                HdSmart.Device.getSnapShot(
                    (data) => {
//                        alert(JSON.stringify(data));
                        this.setState(data.attr);
                        setWebView();
                        this.initComplete = true;
                    },
                    () => {
                        this.initErr = true;
                        setWebView();
                        this.initComplete = true;
                    });

                function setWebView(){
                    HdSmart.UI.hideLoading();
                    HdSmart.UI.setWebViewTouchRect(0, 0, '100%', '100%');
                }
            },
            //设置全量状态
            setState(attr){//设置空调状态
                if (!attr) {
//                    alert('attr---' + undefined)
                    return;
                }

                this.initErr = false;

                if(attr.device_name != undefined){
                    this.params.device_name = attr.device_name;
                }
                if (attr.deviceSubCategory != undefined) {
                    this.params.deviceSubCategory = attr.deviceSubCategory;
                }

                this.params.switch = attr.switchStatus;
                this.params.temperature = attr.temperature;
                this.fakeTemp = attr.temperature;
                this.params.mode = attr.mode;
                this.params.speed = attr.speed;
                this.params.wind_up_down = attr.wind_up_down;
                this.params.wind_left_right = attr.wind_left_right;

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
                that.addPressedClass(el);

                //初始化失败，则按钮不能操作
                if(that.initErr){
                    that.removePressedClass(el);
                    return;
                }

                that.curButton = el;
                //如果参数值没有变化，直接返回(设置温度除外)
                if (that.params[type] === value) {
                    that.removePressedClass(that.curButton);
                    if(type !== TEMPERATURE){
                        return;
                    }
                }

                that.addLoading(el);
                /*that.complete = false;
                if (el) {
                    that.loadingTimer = setTimeout(() => {
                        if(that.complete){
                            return;
                        }
//                        alert('setTimer');
                        that.removeLoading();
                        that.loadingElement = el;
                        that.removePressedClass(that.loadingElement);
                        that.loadingElement.classList.add(LOADING_CLASS);
//                        alert(that.complete + '---' + document.querySelector('.loading'));
                    }, LOADING_DELAY);
                }*/

                let attr = {};
                attr[type] = value;
                //发送指令
                HdSmart.Device.instruct('set', NODE_ID + type, attr,
                    () => {
//                        that.complete = true;
                        that.removeLoading();
                        that.removePressedClass(that.curButton);

                        that.params[type] = value;
                        that.setTip(tip);
                    },
                    (data) => {
//                        that.complete = true;
                        that.removeLoading();
                        that.removePressedClass(that.curButton);

                        if (type === TEMPERATURE) {//
                            that.fakeTemp = that.params.temperature;
                        }
                        that.setTip('设置失败');
//                        alert('控制失败：' + JSON.stringify(that.params));
                    }
                );
            },
            //添加loading效果
            addLoading(el){
                if (!el) {
                    return;
                }

                this.removeLoading();
                this.loadingTimer = setTimeout(() => {
//                    this.removeLoading();

                    this.loadingElement = el;
                    this.removePressedClass(this.loadingElement);
                    this.loadingElement.classList.add(LOADING_CLASS);
//                        alert(this.complete + '---' + document.querySelector('.loading'));
                }, LOADING_DELAY);
            },
            //移除按钮loading
            removeLoading(){
                clearTimeout(this.loadingTimer);

                if (this.loadingElement) {
                    this.loadingElement.classList.remove(LOADING_CLASS);
                    this.loadingElement = null;
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
            setTemperature(type, value, tip, el){
//                if(this.curButton && this.curButton != el){
//                    this.removePressedClass(this.curButton);
//                }
//                this.curButton = el;
                this.addPressedClass(el);

                //送风模式不能设置温度
                if (this.params.mode === 'wind') {
                    this.setTip('送风模式下不能设置温度');
                    this.removePressedClass(this.curButton);
                    return;
                }
                //限制温度范围16-30℃
                if(value < MIN_TEMP || value > MAX_TEMP){
                    this.removePressedClass(this.curButton);
                    return;
                }

                this.tempFlag = true;
                this.fakeTemp = value;
                //设置timer
                clearTimeout(this.tempTimer);
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
            },
            setTip(tip){
                this.tip = tip || '';
                clearTimeout(this.tipTimer);
                this.tipTimer = setTimeout(() => {
                    this.tip = '';
                }, TIP_DURATION);
            },
            addPressedClass(el){
                if(el && this.curButton != el){
                    this.removePressedClass(this.curButton);
                    this.curButton = el;
                    el.classList.add(PRESSED_CLASS);
                }
            },
            removePressedClass(el){
                if(el){
                    el.classList.remove(PRESSED_CLASS);
                }
            },
            screenClick(){
                if(this.initErr) { //初始化失败，点击屏幕，重新获取数据
                    HdSmart.UI.showLoading();
                    this.init();
                }
                else{//其他情况，点击屏幕，隐藏子菜单
                    this.showMore = false;
                }
            }
        }
    }
</script>


