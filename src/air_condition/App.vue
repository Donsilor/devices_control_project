<template>
    <div id="app" :class="appClassObj" @click="showMore=false;">
        <p class="title">{{ deviceName }}</p>
        <div v-show="params.switch === 'on'">
            <!--温度Start-->
            <div class="temp">
                <ac-button :info="minusBtn" @click="setParam"></ac-button>
                <div class="temp-show"><label class="temp-number">{{params.temperature}}</label><label class="temp-unit">℃</label></div>
                <ac-button :info="plusBtn" @click="setParam"></ac-button>
            </div>
            <!--温度End-->
            <p class="tip">{{ tip }}</p>
            <!--底部按钮Start-->
            <div class="bottom">
                <ac-button :info="buttonList.cool" :curValue="params[buttonList.cool.type]" @click="setParam"></ac-button>
                <ac-button :info="buttonList.heat" :curValue="params[buttonList.heat.type]" @click="setParam"></ac-button>
                <ac-button :info="buttonList.dehumidify" :curValue="params[buttonList.dehumidify.type]" @click="setParam"></ac-button>
                <ac-button :info="buttonList.on" v-show="params.switch === 'on'" @click="toggle"></ac-button>
                <ac-button :info="buttonList.low" :curValue="params[buttonList.low.type]" @click="setParam"></ac-button>
                <ac-button :info="buttonList.normal" :curValue="params[buttonList.normal.type]" @click="setParam"></ac-button>
                <ac-button :info="buttonList.high" :curValue="params[buttonList.high.type]" @click="setParam"></ac-button>
            </div>
            <!--底部按钮End-->
            <div class="more" v-show="!showMore" @click.stop="showMore=true;"></div>
            <!--更多子菜单Start-->
            <div class="subMenu" v-show="showMore" @click.stop="">
                <devider :content="'模式'"></devider>
                <div class="more-mode">
                    <ac-button :info="buttonList.mode_auto" :curValue="params[buttonList.mode_auto.type]" @click="setParam"></ac-button>
                    <ac-button :info="buttonList.wind" :curValue="params[buttonList.wind.type]" @click="setParam"></ac-button>
                </div>
                <devider :content="'摆风'"></devider>
                <div class="more-wind-direction">
                    <ac-button v-if="params.deviceSubCategory === 1" :info="lrBtn" @click="toggle"></ac-button>
                    <ac-button :info="udBtn" @click="toggle"></ac-button>
                </div>
                <devider :content="'定时'"></devider>
                <div class="more-timing">
                    <div class="timing-item">
                        <span class="timing-desc">开机时间</span>
                        <span :class="{'timing-time':true, 'invisible':!params.bootSwitch}" @click="bootTpVisible = params.bootSwitch">{{ params.bootTime }}</span>
                        <div :class="{'timing-switch': true, 'timer-on': params.bootSwitch}" @click="toggle('bootSwitch')">
                            <div class="timing-switch-circle"></div>
                        </div>
                        <!--@click="params.bootSwitch = !params.bootSwitch"-->
                    </div>
                    <div class="timing-item">
                        <span class="timing-desc">关机时间</span>
                        <span :class="{'timing-time':true, 'invisible':!params.offSwitch}" @click="offTpVisible = params.offSwitch">{{ params.offTime }}</span>
                        <div :class="{'timing-switch': true, 'timer-on': params.offSwitch}" @click="toggle('offSwitch')">
                            <div class="timing-switch-circle"></div>
                        </div>
                    </div>
                </div>
            </div>
            <!--更多子菜单End-->
            <!--时间选择器Start-->
            <time-picker v-show="bootTpVisible" :hour="bootHour" :minute="bootMinute" :title="'设置空调开机时间'"
                         @vchange="setBootTimePickerVisibility" @change="setBootTime"></time-picker>
            <time-picker v-show="offTpVisible" :hour="offHour" :minute="offMinute" :title="'设置空调关机时间'"
                         @vchange="setOffTimePickerVisibility" @change="setOffTime"></time-picker>
            <!--时间选择器End-->
        </div>
        <div v-show="params.switch !== 'on'">
            <div v-if="params.deviceSubCategory === 0" class="hanging"></div>
            <div v-if="params.deviceSubCategory === 1" class="package"></div>
            <p class="tip">已关闭</p>
            <div class="bottom">
                <ac-button v-show="params.switch === 'off'" :info="buttonList.off" @click="toggle"></ac-button>
            </div>
        </div>
    </div>
</template>

<style>
    * {
        margin: 0;
        padding: 0;
    }
    body{
        font: 24px/1 'NotoSansHans-Regular';
        color: #FFF;
    }
    html, body, .main{
        height: 100%;
    }
    .invisible{
        visibility: hidden;
    }

    .main{
        box-sizing: border-box;
        padding: 155px 0 180px 0;
        text-align: center;
    }
    .main.on{
        background: #0bc0fe url(assets/bg_on.png) no-repeat center bottom;
    }
    .main.off{
        background-color: #f2f2f2;
    }
    .hanging, .package{
        height: 360px;
    }
    .hanging{
        background: url(./assets/bg_off_hanging.png) no-repeat center;
    }
    .package{
        background: url(./assets/bg_off_package.png) no-repeat center;
    }

    .title{
        font-size: 30px;
        margin-bottom: 78px;
    }
    .off .title{
        color: #75787a;
    }

    /*温度*/
    .temp{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .temp-show{
        margin: 0 216px 0 240px;
    }
    .temp-number{
        font-size: 240px;
        font-family: RobotoCondensed-Regular;
    }
    .temp-unit{
        font-size: 72px;
    }

    .tip{
        min-height: 30px;
        font-size: 30px;
        margin: 24px 0 110px 0;
    }
    .off .tip{
        color: #c8cacc;
        margin: 25px 0 37px 0;
    }

    .bottom{
        display: flex;
        margin: 0 240px;
        justify-content: space-around;
        align-items: center;
    }

    /*图片*/
    .temp img, .bottom img{
        width: 144px;
        height: 144px;
    }

    .more, .subMenu{
        position: absolute;
        right: 60px;
        top: 131px;
    }
    /*更多*/
    .more{
        width: 96px;
        height: 96px;
        background: url(./assets/more_normal.png) no-repeat center;
        outline: 0;
        cursor: pointer;
        border-radius: 100%;
    }
    .more:hover{
        background-image: url(./assets/more_active.png);
    }

    /*子菜单*/
    .subMenu{
        opacity: 0.95;
        background: #ffffff;
        box-shadow: 0 3px 12px 0 rgba(0,0,0,0.10);
        box-sizing: border-box;
        border-radius: 6px;
        padding: 0 24px;
        width: 456px;
        height: 660px;
        color: #75787a;
        font-size: 24px;
    }
    .subMenu .imgWrapper{
        margin: 25px 24px 10px 24px;
    }
    .subMenu img{
        width: 96px;
        height: 96px;
    }
    .subMenu .devider{
        margin-top: 30px;
    }

    /*选中样式*/
    .active .btnName{
        font-size: 30px;
    }
    .subMenu .active .btnName{
        font-size: 24px;
        color: #46bcff;
    }

    .more-timing{
        font-size: 30px;
        margin-top: 12px;
    }
    .timing-item{
        line-height: 84px;
    }
    .timing-time{
        min-height: 84px;
    }
    .timing-desc, .timing-time, .timing-switch{
        display: inline-block;
        vertical-align: middle;
    }
    .timing-time{
        width: 58px;
        padding: 0 36px 0 80px;
    }
    .timing-switch{
        width: 72px;
        height: 48px;
        border-radius: 24px;
        background: #c8cacc;
        /*vertical-align: middle;*/
        position: relative;
    }
    .timing-switch-circle{
        position: absolute;
        width: 42px;
        height: 42px;
        border-radius: 100%;
        left: 2px;
        top: 3px;
        background: #fff;
    }
    .timing-switch.timer-on{
        background: #46bcff;
    }
    .timer-on .timing-switch-circle{
        left: auto;
        right: 2px;
    }
</style>

<script>
    import AcButton from './components/AcButton.vue';
    import Devider from './components/Devider.vue';
    import TimePicker from './components/TimePicker.vue';
    import { getDeviceName } from '../sdk/hdsmart/helper';

    const [MIN_TEMP, MAX_TEMP] = [16, 30];
    const [POWER, MODE, SPEED, TEMPERATURE, WIND_UP_DOWN, WIND_LEFT_RIGHT, BOOT_SWITCH, OFF_SWITCH] =
        ['switch', 'mode', 'speed', 'temperature', 'wind_up_down', 'wind_left_right', 'bootSwitch', 'offSwitch'];
    const [ON, OFF] = ['on', 'off'];
    const NODE_ID = 'airconditioner.main.';

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
        components: { AcButton, Devider, TimePicker },
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
                    low: new  Button('低风', SPEED, 'low', require('./assets/low_normal.png'), require('./assets/low_active.png'), '低风切换成功'),
                    normal: new Button('中风', SPEED, 'normal', require('./assets/medium_normal.png'), require('./assets/medium_active.png'), '中风切换成功'),
                    high: new Button('高风', SPEED, 'high', require('./assets/high_normal.png'), require('./assets/high_active.png'), '高风切换成功'),

                    //电源开关
                    on: new Button('', POWER, '', require('./assets/on_normal.png'), require('./assets/on_active.png'), ''),
                    off: new Button('', POWER, '', require('./assets/off_normal.png'), require('./assets/off_active.png'), '')
                },
                params: {
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
                deviceName: ''//设备名
            }
        },
        mounted: function () {
//            this.deviceName = getDeviceName();
            this.deviceName = '挂式空调';
            HdSmart.ready(()=>{
                HdSmart.Device.getSnapShot((data) => {
                    this.setState(data.attr);
                    HdSmart.UI.hideLoading();
                    HdSmart.UI.setWebViewTouchRect(0, 0, '100%', '100%');
                }, () => {
                    HdSmart.UI.hideLoading();
                    HdSmart.UI.setWebViewTouchRect(0, 0, '100%', '100%');
                });

//                HdSmart.onDeviceListen((data) => {
//                    try {
//                        this.setState(data.result.attr);
//                    }
//                    catch (err) {
//                    }
//                })
//                this.params.name = '挂式空调';
//                this.params.type = PAC;
//                this.params.switch = ON;
//                this.params.temperature = 26;
//                this.params.mode = 'cold';
//                this.params.speed = 'auto';
//                this.params.wind_up_down = OFF;
//                this.params.wind_left_right = ON;
//                this.params.bootTime = '20:00';
//                this.params.offTime= '';
            });
        },
        computed: {
            appClassObj: function () {
                let obj = { main: true };
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
                    imgActiveSrc: require('./assets/minus_pressed.png'),
                    value: this.params.temperature > MIN_TEMP ? this.params.temperature - 1 : this.params.temperature
                }
            },
            plusBtn: function () {
                return {
                    //升高温度
                    type: TEMPERATURE,
                    imgSrc: require('./assets/plus_normal.png'),
                    imgActiveSrc: require('./assets/plus_pressed.png'),
                    value: this.params.temperature < MAX_TEMP ? this.params.temperature + 1 : this.params.temperature
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
        methods: {
            setState(attr){//设置空调状态
                this.params.switch = attr.switch;
                this.params.temperature = attr.temperature;
                this.params.mode = attr.mode;
                this.params.speed = attr.speed;
                this.params.wind_up_down = attr.wind_up_down;
                this.params.wind_left_right = attr.wind_left_right;
                this.params.deviceSubCategory = attr.deviceSubCategory;

                let[onTimer, offTimer] = [null, null];
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
                }
            },
            toggle(type){
                let str = '';
                let oldValue = this.params[type];
                let newValue;

                if(oldValue === ON){
                    newValue = OFF;
                    str = '已关闭';
                }
                else if(oldValue === OFF){
                    newValue = ON;
                    str = '已启动';
                }
                else if(oldValue === true){
                    str = '已关闭';
                    newValue = false;
                }
                else if (oldValue === false){
                    str = '已启动';
                    newValue = true;
                }

                if(type === WIND_LEFT_RIGHT){
                    this.setParam(type, newValue, '左右扫风' + str);
                }
                else if (type === WIND_UP_DOWN){
                    this.setParam(type, newValue, '上下扫风' + str);
                }
                else if (type === BOOT_SWITCH){
                    //this.setTip('开机时间' + str);
//                    this.setParam(POWER, ON, '开机时间' + str, this.getTimerObj(BOOT_SWITCH, newValue, this.params.bootTime));
                    this.setTimer(BOOT_SWITCH, newValue, this.params.bootTime, '开机时间' + str);
                }
                else if (type === OFF_SWITCH){
//                    this.setTip('关机时间' + str);
//                    this.setParam(POWER, OFF, '关机时间' + str, this.getTimerObj(OFF_SWITCH, newValue, this.params.offTime));
                    this.setTimer(OFF_SWITCH, newValue, this.params.offTime, '关机时间' + str);
                }
                else {
                    this.setParam(type, newValue);
                }
            },
            setParam(type, value, tip){
                if(this.params[type] === value){//如果参数值没有变化，直接返回
                    return;
                }

                let attr = {};
                attr[type] = value;
                HdSmart.Device.instruct('set', NODE_ID + type, attr,
                    () => {
                        this.params[type] = value;
                        this.setTip(tip);
                    },
                    () => {
                        //错误提示，未完待续。。。
                        this.setTip('设置失败');
                    }
                );
            },
            setTimer(switchType, switchValue, time, tip){
                //开关打开，但是没有设置时间
                if(switchValue && !time){
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
                        if(switchType === BOOT_SWITCH){
                            this.params.bootTime = time;
                        }
                        else if (switchType === OFF_SWITCH){
                            this.params.offTime = time;
                        }
                        this.setTip(tip);
                    },
                    () => {
                        //错误提示，未完待续。。。
                        this.setTip('设置失败');
                    },
                    timerObj
                );
            },
            getTimerObj(switchValue, time){
                if(switchValue === true){//打开开关
                    /*if(switchType === BOOT_SWITCH){
                        //没有设置时间，或者时间没有改变，返回null
//                        !time || this.params.bootTime === time
                        return !time ? null : { operation: "add", time: time, periodic: 1 };
                    }
                    else if(switchType === OFF_SWITCH){
                        //没有设置时间，或者时间没有改变，返回null
                        return !time ? null : { operation: "add", time: time, periodic: 1 };
                    }
                    else{
                        return null;
                    }*/

                    return { operation: "add", time: time, periodic: 1 };
                }
                else{
                    return { operation: "delete" };
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
                if(value !== this.params.bootTime){
                    this.setTimer(BOOT_SWITCH, true, value, '开机时间设置成功');
                }
                this.bootTpVisible = false;
            },
            setOffTime(value){
//                this.setParam('offTime', value);
                if(value !== this.params.offTime){
                    this.setTimer(OFF_SWITCH, true, value, '关机时间设置成功');
                }
                this.offTpVisible = false;
            },
            setTip(tip){
                this.tip = tip || '';
                if(this.tipTimer){
                    clearTimeout(this.tipTimer);
                }
                this.tipTimer = setTimeout(() => { this.tip = ''; }, 3000);
            },
            getHour(str){
                var arr = str.split(':');
                var s = '';
                if(arr.length > 0){
                    s = arr[0].trim();
                }

                return s.length > 0 ? s : '12';
            },
            getMinute(str){
                var arr = str.split(':');
                var s = '';

                if(arr.length > 1){
                    s = arr[1].trim();
                }

                return s.length > 0 ? s : '30';
            }
        }
    }
</script>
