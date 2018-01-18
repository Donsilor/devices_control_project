<template>
<div id="app">
    <div class="page-on" v-if="status == 'success' && model.switch_status == 'on'">
        <div class="name">{{device_name}}</div>
        <div class="tip">
            <p v-show="tip">{{tip}}</p>
            <p v-show="!tip && remain_tip">{{remain_tip}}</p>
        </div>
        <a href="" class="btn-more" @click.prevent="moreModalVisible = true"></a>
        <div class="pm25">
            <div class="circle">
                <span v-for="i in 5" :key="i" :class="'c'+i" v-show="i==(pm25_level>5?5:pm25_level)"></span>
            </div>
            <div class="arrow" :style="{transform:'rotate('+ pm25_rotate +'deg)'}"></div>
            <div class="value">
                {{pm25}}
            </div>
            <div class="pic">PM 2.5</div>
        </div>
        <div class="attrs">
            <span v-if="model.temperature">温度：{{model.temperature}}℃</span>
            <span v-if="model.humidity">湿度：{{model.humidity}}</span>
        </div>
        <div class="btns btns-fn">
            <a href="" class="btn-on" @click.prevent="setSwitch('off')">
                <i></i> 开关
            </a>
            <a href="" class="btn-sleep" :class="{active:model.control_status == 'sleep'}" @click.prevent="setControl('sleep')">
                <i></i> 睡眠
            </a>
            <!-- <a href="" class="btn-sleep"  @click.prevent="setControl('manual')">
                <i></i> 手动
            </a> -->
            <a href="" class="btn-auto active" @click.prevent="speedModalVisible = true" v-if="model.control_status == 'auto'">
                <i></i> 自动
            </a>
            <a href="" :class="speedCss" @click.prevent="speedModalVisible = true" v-else-if="model.control_status == 'manual'">
                <i></i> {{speedText}}
            </a>
            <a href="" class="btn-speed" @click.prevent="speedModalVisible = true" v-else>
                <i></i> 风档
            </a>
        </div>

        <modal title="风档" v-model="speedModalVisible">
            <div class="btns btns-speed">
                <a href="" class="btn1-speed1" :class="{active:model.control_status == 'manual' && model.speed == 'low'}" @click.prevent="setSpeed('low')">
                    <i></i> 低速
                </a>
                <a href="" class="btn1-speed2" :class="{active:model.control_status == 'manual' && model.speed == 'middle'}" @click.prevent="setSpeed('middle')">
                    <i></i> 中低速
                </a>
                <a href="" class="btn1-speed3" :class="{active:model.control_status == 'manual' && model.speed == 'high'}" @click.prevent="setSpeed('high')">
                    <i></i> 中速
                </a>
                <a href="" class="btn1-speed4" :class="{active:model.control_status == 'manual' && model.speed == 'very_high'}" @click.prevent="setSpeed('very_high')">
                    <i></i> 中高速
                </a>
                <a href="" class="btn1-speed5" :class="{active:model.control_status == 'manual' && model.speed == 'super_high'}" @click.prevent="setSpeed('super_high')">
                    <i></i> 高速
                </a>
                <a href="" class="btn1-auto" :class="{active: model.control_status == 'auto'}" @click.prevent="setControl('auto')">
                    <i></i> 自动
                </a>
            </div>
        </modal>

        <modal title="更多" v-model="moreModalVisible">
            <div class="btns btns-more">
                <a href="" class="btn-ni" :class="{active:model.negative_ion_switch_status == 'on'}" @click.prevent="setNegativeIon">
                    <i></i> 负离子
                </a>
                <a href="" class="btn-cl" :class="{active:model.child_lock_switch_status == 'on'}" @click.prevent="setChildLock">
                    <i></i> 童锁
                </a>
            </div>
        </modal>

    </div>

    <div class="page-off" v-if="status == 'success' && model.switch_status == 'off'">
        <div class="name">{{device_name}}</div>
        <div class="tip">已关闭</div>
        <div class="air_cleaner"></div>
        <div class="btns btns-fn">
            <a href="javascript:void(0)" class="btn-off" @click.prevent="setSwitch('on')">
                <i></i> 开关
            </a>
            <a href="javascript:void(0)" class="btn-sleep disable">
                <i></i> 睡眠
            </a>
            <a href="javascript:void(0)" class="btn-speed disable">
                <i></i> 风档
            </a>
        </div>
    </div>

    <error-tip v-if="status == 'error'" @click.native="getSnapShot" />
</div>
</template>

<style lang="less">
*{
    padding: 0;
    margin: 0;
}
body{
    -webkit-tap-highlight-color: transparent;
}
a{
    text-decoration: none;
}
.page-on{
    background:#46bcff;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}
.page-off{
    background:#f2f2f2;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}
.name{
    position: absolute;
    left: 0;
    top: 156px;
    width: 100%;
    text-align: center;
    font-size:30px;
    color:#ffffff;
}
.tip{
   position: absolute;
    left: 0;
    top: 200px;
    width: 100%;
    text-align: center;
    font-size:30px;
    color:#ffffff;
    opacity:0.5;
}
.pm25{
    position: absolute;
    left: 50%;
    top: 252px;
    transform: translate(-50%,0);
    width: 480px;
    .circle{
        width: 480px;
        height: 480px;
        background: url(./assets/img_instrument_airquality.png) no-repeat;
        background-size: 100% 100%;
        span{
            width: 480px;
            height: 480px;
            position: absolute;
            left: 0;
            top: 0;
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }
        .c1{
            background-image: url(./assets/img_instrument_airquality_1.png);
        }
        .c2{
            background-image: url(./assets/img_instrument_airquality_2.png);
        }
        .c3{
            background-image: url(./assets/img_instrument_airquality_3.png);
        }
        .c4{
            background-image: url(./assets/img_instrument_airquality_4.png);
        }
        .c5{
            background-image: url(./assets/img_instrument_airquality_5.png);
        }
    }
    .arrow{
        width: 480px;
        height: 480px;
        position: absolute;
        left: 0;
        top: 0;
        background: url(./assets/img_instrument_airquality_pointer.png) no-repeat;
        background-size: 100% 100%;
        transition: transform 1.5s;
    }
    .value{
        font-family:AbwechselnschriftBold;
        font-size:144px;
        color:#ffffff;
        position: absolute;
        left: 0px;
        top: 120px;
        width: 100%;
        text-align: center;
    }
    .pic{
        border:1px solid rgba(255,255,255,.5);
        border-radius:24px;
        width:122px;
        color:#fff;
        text-align: center;
        font-family:Roboto-Regular;
        font-size:24px;
        line-height: 45px;
        position: absolute;
        left: 178px;
        top: 312px;
    }
}
.attrs{
    position: absolute;
    left: 0;
    top: 666px;
    width: 100%;
    text-align: center;
    color: #fff;
    font-size: 24px;
    span{
        margin: 0 16px;
    }
}
.btn-more{
    position: absolute;
    right: 60px;
    top: 132px;
    width: 96px;
    height: 96px;
    background-image: url(./assets/more_normal.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    &:active{
        background-image: url(./assets/more_active.png);
    }
}
.btns{
    display: flex;
    justify-content: center;
}
.btns a{
    display: block;
    width: 144px;
    height: 216px;
    font-size: 24px;
    color:rgba(255,255,255,.5);
    text-align: center;
    i{
        display: block;
        width: 144px;
        height: 144px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        margin-bottom: 12px;
    }
}
.btn-on{
    i{
        background-image: url(./assets/btn_poweroff_m_normal.png);
    }
    &:active i{
        background-image: url(./assets/btn_poweroff_m_pressed.png);
    }
}
.btn-off{
    i{
        background-image: url(./assets/btn_poweron_m_normal.png);
    }
    &:active i{
        background-image: url(./assets/btn_poweron_m_pressed.png);
    }
}
.btn-sleep{
    i{
        background-image: url(./assets/btn_airpurifier_sleep_normal.png);
    }
    &:active i{
        background-image: url(./assets/btn_airpurifier_sleep_pressed.png);
    }
    &.active i{
        background-image: url(./assets/btn_airpurifier_sleep_active.png);
    }
    &.disable i{
        background-image: url(./assets/btn_airpurifier_sleep_disable.png);
    }
}
.btn-auto{
    i{
        background-image: url(./assets/btn_airpurifier_airvolume_6_normal.png);
    }
    &:active i{
        background-image: url(./assets/btn_airpurifier_airvolume_6_pressed.png);
    }
    &.active i{
        background-image: url(./assets/btn_airpurifier_airvolume_6_active.png);
    }
    &.disable i{
        background-image: url(./assets/btn_airpurifier_airvolume_6_disable.png);
    }
}
.btn-ni{
    i{
        background-image: url(./assets/btn_airpurifier_negative_normal.png);
    }
    &:active i{
        background-image: url(./assets/btn_airpurifier_negative_pressed.png);
    }
    &.active i{
        background-image: url(./assets/btn_airpurifier_negative_active.png);
    }
}
.btn-cl{
    i{
        background-image: url(./assets/btn_airpurifier_lock_normal.png);
    }
    &:active i{
        background-image: url(./assets/btn_airpurifier_lock_pressed.png);
    }
    &.active i{
        background-image: url(./assets/btn_airpurifier_lock_active.png);
    }
}
.btn-speed{
    i{
        background-image: url(./assets/btn_airpurifier_airvolume_normal.png);
    }
    &:active i{
        background-image: url(./assets/btn_airpurifier_airvolume_pressed.png);
    }
    &.disable i{
        background-image: url(./assets/btn_airpurifier_airvolume_disable.png);
    }
}
.btn-speed1{
    // i{
    //     background-image: url(./assets/btn_airpurifier_airvolume_1_normal.png);
    // }
    // &:active i{
    //     background-image: url(./assets/btn_airpurifier_airvolume_1_pressed.png);
    // }
    &.active i{
        background-image: url(./assets/btn_airpurifier_airvolume_1_active.png);
    }
    // &.disable i{
    //     background-image: url(./assets/btn_airpurifier_airvolume_1_disable.png);
    // }
}
.btn-speed2{
    // i{
    //     background-image: url(./assets/btn_airpurifier_airvolume_2_normal.png);
    // }
    // &:active i{
    //     background-image: url(./assets/btn_airpurifier_airvolume_2_pressed.png);
    // }
    &.active i{
        background-image: url(./assets/btn_airpurifier_airvolume_2_active.png);
    }
    // &.disable i{
    //     background-image: url(./assets/btn_airpurifier_airvolume_2_disable.png);
    // }
}
.btn-speed3{
    // i{
    //     background-image: url(./assets/btn_airpurifier_airvolume_3_normal.png);
    // }
    // &:active i{
    //     background-image: url(./assets/btn_airpurifier_airvolume_3_pressed.png);
    // }
    &.active i{
        background-image: url(./assets/btn_airpurifier_airvolume_3_active.png);
    }
    // &.disable i{
    //     background-image: url(./assets/btn_airpurifier_airvolume_3_disable.png);
    // }
}
.btn-speed4{
    // i{
    //     background-image: url(./assets/btn_airpurifier_airvolume_4_normal.png);
    // }
    // &:active i{
    //     background-image: url(./assets/btn_airpurifier_airvolume_4_pressed.png);
    // }
    &.active i{
        background-image: url(./assets/btn_airpurifier_airvolume_4_active.png);
    }
    // &.disable i{
    //     background-image: url(./assets/btn_airpurifier_airvolume_4_disable.png);
    // }
}
.btn-speed5{
    // i{
    //     background-image: url(./assets/btn_airpurifier_airvolume_5_normal.png);
    // }
    // &:active i{
    //     background-image: url(./assets/btn_airpurifier_airvolume_5_pressed.png);
    // }
    &.active i{
        background-image: url(./assets/btn_airpurifier_airvolume_5_active.png);
    }
    // &.disable i{
    //     background-image: url(./assets/btn_airpurifier_airvolume_5_disable.png);
    // }
}
.btn1-speed1{
    i{
        background-image: url(./assets/btn_airpurifier_airvolume_1a_normal.png);
    }
    &:active i{
        background-image: url(./assets/btn_airpurifier_airvolume_1a_pressed.png);
    }
    &.active i{
        background-image: url(./assets/btn_airpurifier_airvolume_1a_active.png);
    }
}
.btn1-speed2{
    i{
        background-image: url(./assets/btn_airpurifier_airvolume_2a_normal.png);
    }
    &:active i{
        background-image: url(./assets/btn_airpurifier_airvolume_2a_pressed.png);
    }
    &.active i{
        background-image: url(./assets/btn_airpurifier_airvolume_2a_active.png);
    }
}
.btn1-speed3{
    i{
        background-image: url(./assets/btn_airpurifier_airvolume_3a_normal.png);
    }
    &:active i{
        background-image: url(./assets/btn_airpurifier_airvolume_3a_pressed.png);
    }
    &.active i{
        background-image: url(./assets/btn_airpurifier_airvolume_3a_active.png);
    }
}
.btn1-speed4{
    i{
        background-image: url(./assets/btn_airpurifier_airvolume_4a_normal.png);
    }
    &:active i{
        background-image: url(./assets/btn_airpurifier_airvolume_4a_pressed.png);
    }
    &.active i{
        background-image: url(./assets/btn_airpurifier_airvolume_4a_active.png);
    }
}
.btn1-speed5{
    i{
        background-image: url(./assets/btn_airpurifier_airvolume_5a_normal.png);
    }
    &:active i{
        background-image: url(./assets/btn_airpurifier_airvolume_5a_pressed.png);
    }
    &.active i{
        background-image: url(./assets/btn_airpurifier_airvolume_5a_active.png);
    }
}
.btn1-auto{
    i{
        background-image: url(./assets/btn_airpurifier_airvolume_6a_normal.png);
    }
    &:active i{
        background-image: url(./assets/btn_airpurifier_airvolume_6a_pressed.png);
    }
    &.active i{
        background-image: url(./assets/btn_airpurifier_airvolume_6a_active.png);
    }
}
.btns-fn{
    position: absolute;
    left: 0;
    top: 720px;
    width: 100%;
    a{
        margin:0 48px;
        i{
            margin-bottom: 24px;
        }
    }
}
.btns-speed{
    flex-wrap: wrap;
    a{
        margin: 0 18px 0;
        color:#76787a;
        &.active{
            color:#46bcff;
        }
    }
}
.btns-more{
    a{
        margin: 0 30px;
        color:#76787a;
        &.active{
            color:#46bcff;
        }
    }
}
.page-off .name{
    color:#76787a;
}
.page-off .tip{
    color:#c8cacc;
    opacity: 1;
}
.page-off .btns a{
    color:#76787a;
}
.air_cleaner{
    position: absolute;
    left: 50%;
    top: 260px;
    width: 420px;
    height: 420px;
    transform: translate(-50%,0);
    background: url(./assets/img_airpurifier_off.png) no-repeat;
    background-size: 100% 100%;
}
</style>

<script>
import Modal from './components/Modal.vue'
import ErrorTip from './components/ErrorTip.vue'

const SPEEDS = {
    'low': {
        index: '1',
        text: '低速'
    },
    'middle': {
        index: '2',
        text: '中低速'
    },
    'high': {
        index: '3',
        text: '中速'
    },
    'very_high': {
        index: '4',
        text: '中高速'
    },
    'super_high': {
        index: '5',
        text: '高速'
    }
}

const PM25_VAL = [0, 35, 75, 115, 150, 250]
const PM25_ANGLE = [-136, -84, -28, 28, 84, 136]

function getToggle(val) {
    return val === 'on' ? 'off' : 'on'
}

function getRotate(val, start, end){
    var min = PM25_VAL[start]
    var max = PM25_VAL[end]
    var min_r = PM25_ANGLE[start]
    var max_r = PM25_ANGLE[end]
    return min_r+(val-min)/(max-min)*(max_r-min_r)
}

export default {
    components: {
        Modal,
        ErrorTip
    },
    data() {
        return {
            status: '',
            speedModalVisible: false,
            moreModalVisible: false,
            device_name: '空气净化器',
            model: {},
            tip: '',
            remain_tip: '',
            pm25: ''
        }
    },
    computed: {
        speedCss() {
            return ['btn-speed' + SPEEDS[this.model.speed].index, 'active']
        },
        speedText() {
            return SPEEDS[this.model.speed].text
        },
        pm25_level() {
            for(var i = PM25_VAL.length-1; i >= 0; i--){
                if(this.pm25 > PM25_VAL[i]){
                    return i + 1
                }
            }
            return 1
        },
        pm25_rotate() {
            var level = this.pm25_level
            if(level == 6){
                return PM25_ANGLE[5]
            }
            return getRotate(this.pm25, level-1, level)
        }
    },
    methods: {
        showTip(text) {
            clearTimeout(this.tipTime)
            this.tip = text
            this.tipTime = setTimeout(() => {
                this.tip = ''
            },2000)
        },
        controlDevice(attr, val, success, error) {
            var fn = this.confirm
            if(attr == 'child_lock_switch' || (attr == 'switch' && val == 'off')){
                fn = function(cb){cb()}
            }
            fn(() => {
                HdSmart.Device.control({
                    method: 'dm_set',
                    nodeid: `air_filter.main.${attr}`,
                    params: {
                        attribute: {
                            [attr]: val
                        }
                    }
                }, () => {
                    success && success()
                    if(attr != 'switch'){
                        this.showTip('设置成功')
                    }
                }, ()=>{
                    error && error()
                    this.showTip('操作失败')
                })
            })
        },
        setSwitch(val) {
            this.controlDevice('switch', val)
        },
        setControl(val) {
            this.controlDevice('control', val)
        },
        setSpeed(val) {
            // if(this.model.control_status != 'manual'){
            //     this.setControl('manual')
            //     setTimeout(()=>{
            //         this.controlDevice('speed', val)
            //     },1000)
            // }else{
                this.controlDevice('speed', val)
            // }
        },
        setNegativeIon() {
            var val = getToggle(this.model.negative_ion_switch_status)
            // if(this.model.control_status != 'manual' && val == 'on'){
            //     this.setControl('manual')
            //     setTimeout(()=>{
            //         this.controlDevice('negative_ion_switch', val)
            //     },1000)
            // }else{
                this.controlDevice('negative_ion_switch', val)
            // }
        },
        setChildLock() {
            var val = getToggle(this.model.child_lock_switch_status)
            this.controlDevice('child_lock_switch', val)
        },
        getSnapShot(cb) {
            HdSmart.Device.getSnapShot((data) => {
                this.onSuccess(data)
                cb && cb()
            }, () => {
                this.onError()
                cb && cb()
            })
        },
        onSuccess(data) {
            if(!data) return
            this.status = 'success'
            if(data.device_name){
                this.device_name = data.device_name
            }
            this.model = data.attribute

            if(this.model.filter_time_remaining <=0){
                this.remain_tip = '需更换滤网'
            }else if(this.model.filter_time_remaining <= 120){
                this.remain_tip = `滤芯寿命剩余${this.model.filter_time_remaining}小时`
            }

            var pm25 = this.model.air_filter_result.PM25
            this.pm25 = pm25.length == 2 ? pm25[1] : pm25[0]
        },
        onError() {
            this.status = 'error'
        },
        confirm(done) {
            if(this.model.child_lock_switch_status == 'on'){
                if(confirm('解除童锁后才能控制此设备，是否解除？')){
                    this.setChildLock()
                }
            }else{
                done()
            }
        }
    },
    created() {
        HdSmart.ready(() => {
            HdSmart.UI.showLoading()
            this.getSnapShot(() => {
                HdSmart.UI.hideLoading()
            })
        })
        HdSmart.onDeviceListen((data) => {
            switch (data.method) {
                case 'dm_set':
                    if(data.code !== 0){
                        this.getSnapShot()
                    }
                    break
                default:
                    this.onSuccess(data.result)
                    break
            }
        })
    }
}
</script>
