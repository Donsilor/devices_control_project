<template>
    <div id="app" :class="appClassObj">
        <p class="title">{{ params.name }}</p>
        <div class="temp">
            <ac-button :info="minusBtn" :curValue="params.temperature" @click="setParam"></ac-button>
            <div class="temp-show"><label class="temp-number">{{params.temperature}}</label><label class="temp-unit">℃</label></div>
            <ac-button :info="plusBtn" :curValue="params.temperature" @click="setParam"></ac-button>
        </div>
        <p class="tip">{{ tip }}</p>
        <div class="bottom">
            <ac-button v-for="btn in bottomBtnList" :info = "btn" :curValue="params[btn.type]" @click="setParam"></ac-button>
        </div>
        <div class="more" v-show="!showMore"></div>
        <div class="subMenu" v-show="showMore">
            <devider :content="'模式'"></devider>
            <div class="more-mode">
                <ac-button :info="buttonList.mode_auto" :curValue="params[buttonList.mode_auto.type]" @click="setParam"></ac-button>
                <ac-button :info="buttonList.wind" :curValue="params[buttonList.wind.type]" @click="setParam"></ac-button>
            </div>
            <devider :content="'摆风'"></devider>
            <div class="more-wind-direction">
                <ac-button :info="buttonList.leftRight" :curValue="params[buttonList.leftRight.type]" @click="setParam"></ac-button>
                <ac-button :info="buttonList.upDown" :curValue="params[buttonList.upDown.type]" @click="setParam"></ac-button>
            </div>
            <devider :content="'定时'"></devider>
            <div class="more-timing">
                <time-setter :title="'设置空调开机时间'" :value="params.bootTime"></time-setter>
            </div>
        </div>
    </div>
</template>

<style>
    *{
        margin: 0;
        padding: 0;
    }
    /*html{*/
        /*font-size: 20px;*/
    /*}*/
    body{
        font: 24px/1 'NotoSansHans-Regular';
        color: #FFF;
    }
    html, body, .main{
        height: 100%;
    }
    .main{
        background: #0bc0fe url(assets/bg_on.png) no-repeat center bottom;
        box-sizing: border-box;
        padding: 155px 0 180px 0;
        text-align: center;
    }

    .title{
        font-size: 30px;
        margin-bottom: 78px;
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
        font-size: 30px;
        margin: 24px 0 110px 0;
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
        padding: 0 36px;
        width: 456px;
        height: 660px;
        color: #75787a;
        font-size: 24px;
    }
    .subMenu img{
        width: 96px;
        height: 96px;
    }
    .subMenu .devider{
        margin-top: 30px;
    }
    .more-mode, .more-wind-direction{
        text-align: left;
    }
</style>

<script>
    import AcButton from './components/AcButton.vue';
    import Devider from './components/Devider.vue';
    import TimeSetter from './components/TimeSetter.vue';

    const [MIN_TEMP, MAX_TEMP] = [16, 30];
    const [POWER, MODE, SPEED, TEMPERATURE, WIND_UP_DOWN, WIND_LEFT_RIGHT] =
        ['switch', 'mode', 'speed', 'temperature', 'wind_up_down', 'wind_left_right'];
//    const [minus_btn_name, plus_btn_name] = ['tempMinus', 'tempPlus'];
    const [ON, OFF] = ['on', 'off'];
    export default {
        components: {AcButton, Devider, TimeSetter},
        data() {
            return {
                buttonList: {
                    //模式
                    cool: {//制冷
                        imgSrc: require('./assets/cool_normal.png'),
                        imgActiveSrc: require('./assets/cool_active.png'),
                        title: '制冷',
                        type: MODE,
                        value: 'cold'
                    },
                    heat: {//制热
                        imgSrc: require('./assets/heat_normal.png'),
                        imgActiveSrc: require('./assets/heat_active.png'),
                        title: '制热',
                        type: MODE,
                        value: 'heat'
                    },
                    dehumidify: {//除湿
                        imgSrc: require('./assets/dehumidify_normal.png'),
                        imgActiveSrc: require('./assets/dehumidify_active.png'),
                        title: '除湿',
                        type: MODE,
                        value: 'dehumidify'
                    },
                    mode_auto: {//智能模式
                        imgSrc: require('./assets/auto_normal.png'),
                        imgActiveSrc: require('./assets/auto_active.png'),
                        title: '智能',
                        type: MODE,
                        value: 'auto'
                    },
                    wind: {//送风模式
                        imgSrc: require('./assets/wind_normal.png'),
                        imgActiveSrc: require('./assets/wind_active.png'),
                        title: '送风',
                        type: MODE,
                        value: 'wind'
                    },

                    //风速
                    low: {//低风
                        imgSrc: require('./assets/low_normal.png'),
                        imgActiveSrc: require('./assets/low_active.png'),
                        title: '低风',
                        type: SPEED,
                        value: 'low'
                    },
                    normal: {//中风
                        imgSrc: require('./assets/medium_normal.png'),
                        imgActiveSrc: require('./assets/medium_active.png'),
                        title: '中风',
                        type: SPEED,
                        value: 'normal'
                    },
                    high: {//高风
                        imgSrc: require('./assets/high_normal.png'),
                        imgActiveSrc: require('./assets/high_active.png'),
                        title: '高风',
                        type: SPEED,
                        value: 'high'
                    },

                    //电源开关
                    on: {//开
                        imgSrc: require('./assets/on_normal.png'),
                        imgActiveSrc: require('./assets/on_active.png'),
                        type: POWER,
                        value: ON
                    },
                    off: {//关
                        imgSrc: require('./assets/off_normal.png'),
                        imgActiveSrc: require('./assets/off_active.png'),
                        type: POWER,
                        value: OFF
                    },

                    //风向
                    upDown: {//上下扫风
                        imgSrc: require('./assets/up_down_normal.png'),
                        imgActiveSrc: require('./assets/up_down_active.png'),
                        type: WIND_UP_DOWN,
                        value: OFF,
                        title: '上下'
                    },
                    leftRight: {//左右扫风
                        imgSrc: require('./assets/left_right_normal.png'),
                        imgActiveSrc: require('./assets/left_right_active.png'),
                        type: WIND_LEFT_RIGHT,
                        value: OFF,
                        title: '左右'
                    }
                },
                params: {
                    name: '挂式空调',
                    switch: ON,
                    temperature: 26,//温度
                    mode: 'cold',//模式
                    speed: 'auto',//风速
                    wind_up_down: OFF,//上下扫风
                    wind_left_right: OFF,//左右扫风
//                        sleep: false,//睡眠模式
                    bootTime: '08:00',//开机时间
                    offTime: ''//关机时间
                },
                tip: 'XXX切换成功',
                showMore: true
            }
        },
        mounted: function () {
//            HdSmart.UI.hideLoading();
//            HdSmart.UI.setWebViewTouchRect(0, 0, '100%', '100%');
        },
        computed: {
            appClassObj: function () {
                let obj = { main: true };
                obj[this.params.switch] = true;
                return obj;
            },
            minusBtn: function () {
                return {
                    //降低温度
//                    key: minus_btn_name,
                    type: TEMPERATURE,
                    imgSrc: require('./assets/minus_normal.png'),
                    imgActiveSrc: require('./assets/minus_pressed.png'),
                    value: this.params.temperature > MIN_TEMP ? this.params.temperature - 1 : this.params.temperature
                }
            },
            plusBtn: function () {
                return {
                    //升高温度
//                    key: plus_btn_name,
                    type: TEMPERATURE,
                    imgSrc: require('./assets/plus_normal.png'),
                    imgActiveSrc: require('./assets/plus_pressed.png'),
                    value: this.params.temperature < MAX_TEMP ? this.params.temperature + 1 : this.params.temperature
                }
            },
            bottomBtnList: function () {
                let t = [];
                t.push(this.buttonList.cool, this.buttonList.heat, this.buttonList.dehumidify, this.buttonList.on, this.buttonList.low, this.buttonList.normal, this.buttonList.high);
                return t;
            }
        },
        methods: {
            setParam(type, value){
                this.params[type] = value;
//                alert(this.params.mode + '--' + this.params.speed)
            }
        }
    }
</script>
