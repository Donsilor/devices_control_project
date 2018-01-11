<template>
<div id="app">
    <div class="page-on" v-if="1">
        <div class="bg">
            <div class="cloud"></div>
        </div>

        <div class="name">{{device_name}}</div>

        <div class="tip">
            <p>
                <span v-show="tip">{{tip}}</span>
                <span v-show="!tip && tip2">{{tip2}}</span>&nbsp;
            </p>
            <p v-show="drying == 'on'">正在烘干 将于{{drying_remain}}分钟后结束</p>
            <p v-show="air_drying == 'on'">正在风干 将于{{air_drying_remain}}分钟后结束</p>
            <!-- <p v-show="(drying == 'on' || air_drying == 'on') && sterilization == 'on'">杀菌 将于{{timeleft}}分钟后开始</p> -->
            <p v-show="sterilization == 'on'">正在杀菌 将于{{sterilization_remain}}分钟后结束</p>
        </div>

        <div class="entity">
            <div class="top"></div>
            <div class="center" ref="ani"></div>
            <div class="bottom"></div>
            <div class="light" v-show="light == 'on'"></div>
            <div class="wind" v-show="air_drying == 'on'"></div>
            <div class="hotdry" v-show="drying == 'on'"></div>
            <div class="slight" v-show="sterilization == 'on'"></div>
        </div>

        <div class="control">
            <a href="#" class="btn-up" @click.prevent="setUp"></a>
            <a href="#" class="btn-pause" @click.prevent="setPause"></a>
            <a href="#" class="btn-down" @click.prevent="setDown"></a>
            <a href="#" class="btn-light" :class="{'on':light == 'on'}" @click.prevent="setLight"></a>
        </div>

        <a href="#" class="btn-mode" @click.prevent="toggleModal(true)"></a>

        <div class="modal" v-show="modal_visible">
            <div class="modal-header">
                <div class="modal-title">模式</div>
                <span class="modal-close" @click="toggleModal(false)"></span>
            </div>
            <div class="modal-body">
                <a href="#" class="btn-wind" :class="{'on':air_drying == 'on'}" @click.prevent="setWind">
                    <i></i> 风干
                </a>
                <a href="#" class="btn-bake" :class="{'on':drying == 'on'}" @click.prevent="setBake">
                    <i></i> 烘干
                </a>
                <a href="#" class="btn-sterilize" :class="{'on':sterilization == 'on'}" @click.prevent="setSterilize">
                    <i></i> 杀菌
                </a>
            </div>
        </div>

        <!-- <transition name="fade"> -->
        <div class="overlay" v-show="modal_visible" @click.prevent="toggleModal(false)"></div>
        <!-- </transition> -->
    </div>

    <div class="page-error" v-if="0">
        <div class="error-tip">
            <img src='./assets/init_err.png' />
            <p>加载失败，请点击屏幕刷新</p>
        </div>
    </div>
</div>
</template>

<style lang="less">
*{
    padding: 0;
    margin: 0;
}
a{
    text-decoration: none;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to{
  opacity: 0
}
#app{
    position: relative;
}
.bg,.cloud{
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
}
.bg{
    background-image: linear-gradient(-180deg, #2499ff 0%, #13d5dc 100%);
}
.cloud{
    background: url(./assets/img_clould.png) repeat-x left 180px;
    background-size: 1660px;
}
.name{
    font-size: 30px;
    color:#ffffff;
    position: absolute;
    top: 144px;
    left: 0;
    text-align: center;
    width: 100%;
}
.tip{
    font-size: 28px;
    color: #fff;
    position: absolute;
    top: 195px;
    left: 0;
    text-align: center;
    width: 100%;
    line-height:40px;
}
.entity{
    position: absolute;
    left: 0%;
    top: 344px;
    width: 100%;
    .top{
        width: 644px;
        height: 60px;
        margin: 0 auto;
        background: url(./assets/group_up.png) no-repeat;
        background-size: 100% 100%;
    }
    .center{
        width: 609px;
        height: 240px;
        min-height: 60px;
        max-height: 240px;
        transition: height 5s;
        margin: -30px auto 0;
        background: url(./assets/group_down02.png) no-repeat;
        background-size: 100% 100%;
    }
    .bottom{
        width: 939px;
        height: 85px;
        margin: 0 auto;
        background: url(./assets/group_down.png) no-repeat;
        background-size: 100% 100%;
    }
    .light{
        position: absolute;
        left: 50%;
        top: 34px;
        width: 898px;
        height: 298px;
        transform: translate(-50%,0);
        background: url(./assets/img_light.png) no-repeat;
        background-size: 100% 100%;
    }
    .wind{
        position: absolute;
        left: 50%;
        top: 64px;
        width: 464px;
        height: 92px;
        transform: translate(-50%,0);
        background: url(./assets/img_wind.png) no-repeat;
        background-size: 100% 100%;
    }
    .hotdry{
        position: absolute;
        left: 50%;
        top: 34px;
        width: 898px;
        height: 562px;
        transform: translate(-50%,0);
        background: url(./assets/img_hotdry.png) no-repeat;
        background-size: 100% 100%;
    }
    .slight{
        position: absolute;
        left: 50%;
        top: 36px;
        width: 224px;
        height: 15px;
        transform: translate(-50%,0);
        background: url(./assets/img_sj.png) no-repeat;
        background-size: 100% 100%;
    }
}
.control{
    position: absolute;
    left: 0;
    top: 744px;
    width: 100%;
    display: flex;
    justify-content: center;
    a{
        width:144px;
        height:144px;
        margin:0 45px;
        display: block;
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }
    .btn-up{
        background-image: url(./assets/btn_open12.png);
        &:active{
            background-image: url(./assets/btn_open08.png);
        }
    }
    .btn-pause{
        background-image: url(./assets/btn_pause10.png);
        &:active{
            background-image: url(./assets/btn_pause06.png);
        }
    }
    .btn-down{
        background-image: url(./assets/btn_open_copy11.png);
        &:active{
            background-image: url(./assets/btn_open_copy07.png);
        }
    }
    .btn-light{
        background-image: url(./assets/btn_pause_copy09.png);
        &:active{
            background-image: url(./assets/btn_pause_copy05.png);
        }
        &.on{
            background-image: url(./assets/btn_pause_copy01.png);
        }
    }
}
.modal{
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    background: #fff;
    width: 752px;
    border-radius: 6px;
    z-index: 99;
    &-header{
        height: 84px;
        border-bottom: 1px solid #dbdbdb;
        position: relative;
    }
    &-title{
        font-size:30px;
        color:#76787a;
        text-align: center;
        line-height: 84px;
    }
    &-close{
        position: absolute;
        top: 0px;
        right: 0px;
        width: 84px;
        height: 84px;
        background: url(./assets/btn_close.png) no-repeat center center;
        background-size: 20px 20px;
    }
    &-body{
        padding: 75px 0 91px;
        text-align: center;
        display: flex;
        justify-content: center;
        a{
            display: block;
            font-size:24px;
            color:#76787a;
            margin: 0 48px;
            i{
                width: 120px;
                height: 120px;
                display: block;
                margin-bottom: 18px;
                background-size: 100% 100%;
                background-repeat: no-repeat;
            }
            &.on{
                color:#46bcff;
            }
        }
    }
    .btn-wind{
        i{
            background-image: url(./assets/btn_clothes_hanger_hotdry_normal1.png);
        }
        &:active{
            i{
                background-image: url(./assets/btn_clothes_hanger_hotdry_disable2.png);
            }
        }
        &.on{
            i{
                background-image: url(./assets/btn_clothes_hanger_hotdry_active3.png);
            }
        }
    }
    .btn-bake{
        i{
            background-image: url(./assets/btn_clothes_hanger_hotdry_normal4.png);
        }
        &:active{
            i{
                background-image: url(./assets/btn_clothes_hanger_hotdry_disable5.png);
            }
        }
        &.on{
            i{
                background-image: url(./assets/btn_clothes_hanger_hotdry_active6.png);
            }
        }
    }
    .btn-sterilize{
        i{
            background-image: url(./assets/btn_clothes_hanger_hotdry_normal7.png);
        }
        &:active{
            i{
                background-image: url(./assets/btn_clothes_hanger_hotdry_disable8.png);
            }
        }
        &.on{
            i{
                background-image: url(./assets/btn_clothes_hanger_hotdry_active9.png);
            }
        }
    }
}
.overlay{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.5);
}
.btn-mode{
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
.page-error{
        height: 100%;
        background: #f2f2f2;
        text-align: center;
        width: 100%;
        position: fixed;
        left: 0;
        top: 0;
    }
    .error-tip{
        left: 50%;
        top: 50%;
        position: absolute;
        transform: translate(-50%,-50%);
    }
    .error-tip p{
        min-height: 30px;
        font-size: 30px;
        margin: 24px 0 110px 0;
        opacity: 1;
        position: relative;
    }
</style>

<script>
const tips = {
    moving_up: '正在上升',
    moved_up: '已上升至顶部',
    moving_down: '正在下降',
    moved_down: '已下降至底部',
    move_pause: '已暂停',
    // wind_drying: '正在风干',
    // wind_drying_finish: '风干 将于{time}分钟后结束',
    wind_dryed: '风干已完成',
    wind_dry_cancle: '风干已取消',
    // bake_drying: '正在烘干',
    // bake_drying_finish: '烘干 将于{time}分钟后结束',
    bake_dryed: '烘干已完成',
    bake_dry_cancle: '烘干已取消',
    // sterilize_will: '杀菌 将于{time}分钟后开始',
    // sterilize_finish: '杀菌 将于{time}分钟后结束',
    // sterilizing: '正在杀菌',
    sterilized: '杀菌已完成',
    sterilize_cancle: '杀菌已取消'
}

const duration = 28000
const radio = (document.documentElement.clientWidth || window.innerWidth) / 1920 * 30

function getToggle(val) {
    return val === 'on' ? 'off' : 'on'
}

function setDuration(el, dir) {
    var percentage
    var height = el.style.height
    if(height.indexOf('px') >= 0){
        height = parseInt(height)/radio
    }else{
        height = parseInt(height)
    }
    if(dir == 'up'){
        percentage = (height-2)/6*duration
    }else{
        percentage = (8-height)/6*duration
    }
    el.style.transitionDuration = percentage + 'ms'
}

function setPosition(el, pos){
    if(!el) return
    switch (pos){
        case 'top':
            el.style.height = '2rem'
            el.style.transitionDuration = '0ms'
            break;
        case 'up':
            el.style.height = '2rem'
            break;
        case 'bottom':
            el.style.height = '8rem'
            el.style.transitionDuration = '0ms'
            break;
        case 'down':
            el.style.height = '8rem'
            break;
        case 'pause':
            var computedStyle = document.defaultView.getComputedStyle( el, null )
            el.style.height = computedStyle.getPropertyValue( "height" )
            break;
    }
    if(!el.init){
        el.init = true
        if(pos == 'pause'){
            el.style.height = '5rem'
        }
        el.style.transitionDuration = '0ms'
    }
}

export default {
    data() {
        return {
            device_name: '',
            tip: '',
            tip2: '',
            modal_visible: false,
            timeleft: 0,
            light: '', //on/off
            sterilization: '',
            drying: '',
            air_drying: '',
            status: '', //top/bottom/up/down/pause
            drying_remain: 0,
            air_drying_remain: 0,
            sterilization_remain: 0
        }
    },
    methods: {
        showTip(text, fade){
            this.tip = text
            clearTimeout(this.tipTime)
            if(fade){
                this.tipTime = setTimeout(()=>{
                    this.tip = ''
                },2000)
            }
        },
        showTip2(text, fade){
            this.tip2 = text
            clearTimeout(this.tipTime2)
            if(fade){
                this.tipTime2 = setTimeout(()=>{
                    this.tip2 = ''
                },2000)
            }
        },
        toggleModal(visible) {
            this.modal_visible = visible
        },
        controlDevice(attr, val, success) {
            HdSmart.Device.control({
                method: 'dm_set',
                nodeid: `clothes_hanger.main.${attr}`,
                params: {
                    attribute: {
                        [attr]: val
                    }
                }
            }, () => {
                success && success()
            }, () => {
                this.showTip('操作失败', true)
            })
        },
        setUp() {
            if(this.status == 'top' || this.status == 'up'){
                return
            }
            setDuration(this.$refs.ani, 'up')
            this.controlDevice('control', 'up')
        },
        setDown() {
            if(this.status == 'bottom' || this.status == 'down'){
                return
            }
            setDuration(this.$refs.ani, 'down')
            this.controlDevice('control', 'down')
        },
        setPause() {
            if(this.status == 'pause' || this.status == 'top' || this.status == 'bottom'){
                return
            }
            this.controlDevice('control', 'pause')
        },
        setLight() {
            var val = getToggle(this.light)
            this.controlDevice('light', val)
        },
        setWind() {
            var val = getToggle(this.air_drying)
            this.controlDevice('air_drying', val, () => {
                // if(val == 'off'){
                //     this.showTip(tips.wind_dry_cancle, true)
                // }
            })
        },
        setBake() {
            var val = getToggle(this.drying)
            this.controlDevice('drying', val, () => {
                // if(val == 'off'){
                //     this.showTip(tips.bake_dry_cancle, true)
                // }
            })
        },
        setSterilize() {
            var val = getToggle(this.sterilization)
            if(val == 'on' && this.status != 'top'){
                this.showTip2('未上升至顶部', true)
                return
            }
            this.controlDevice('sterilization', val, () => {
                // if(val == 'off'){
                //     this.showTip(tips.sterilize_cancle, true)
                // }
            })
        },
        setMoveTip(attrs) {
            if(attrs.status == 'up'){
                this.showTip2(tips.moving_up)
                return
            }
            if(attrs.status == 'top' && this.status == 'up'){
                this.showTip2(tips.moved_up, true)
                return
            }
            if(attrs.status == 'down'){
                this.showTip2(tips.moving_down)
                return
            }
            if(attrs.status == 'bottom' && this.status == 'down'){
                this.showTip2(tips.moved_down, true)
                return
            }
            if(attrs.status == 'pause' && (this.status == 'up' || this.status == 'down')){
                this.showTip2(tips.move_pause, true)
                return
            }
        },
        setModeTip(attrs) {

            if(attrs.air_drying == 'off' && this.air_drying == 'on'){
                if(attrs.air_drying_remain == 0 && this.air_drying_remain == 1){
                    this.showTip(tips.wind_dryed, true)
                }else{
                    this.showTip(tips.wind_dry_cancle, true)
                }
                return
            }

            if(attrs.drying == 'off' && this.drying == 'on'){
                if(attrs.drying_remain == 0 && this.drying_remain == 1){
                    this.showTip(tips.bake_dryed, true)
                }else{
                    this.showTip(tips.bake_dry_cancle, true)
                }
                return
            }

            if(attrs.sterilization == 'off' && this.sterilization == 'on'){
                if(attrs.sterilization_remain == 0 && this.sterilization_remain == 1){
                    this.showTip(tips.sterilized, true)
                }else{
                    this.showTip(tips.sterilize_cancle, true)
                }
                return
            }

            // var tip = ''
            // if(attrs.air_drying == 'on' || attrs.drying == 'on' || attrs.sterilization == 'on'){
            //     tip = '正在'
            //     if(attrs.air_drying == 'on'){
            //         tip += '风干'
            //     }
            //     if(attrs.drying == 'on'){
            //         tip += '烘干'
            //     }
            //     if(attrs.sterilization == 'on'){
            //         tip += '杀菌'
            //     }
            //     this.showTip(tip)
            // }else{
            //     this.showTip('')
            // }
        },
        onSuccess(result) {

            var attrs = result.attribute

            this.setModeTip(attrs)
            this.setMoveTip(attrs)

            this.device_name = result.device_name
            this.light = attrs.light
            this.air_drying = attrs.air_drying
            this.drying = attrs.drying
            this.sterilization = attrs.sterilization
            this.status = attrs.status
            this.drying_remain = attrs.drying_remain
            this.air_drying_remain = attrs.air_drying_remain
            this.sterilization_remain = attrs.sterilization_remain

            setPosition(this.$refs.ani, attrs.status)
        },
        getSnapShot(cb) {
            HdSmart.Device.getSnapShot((data) => {
                this.onSuccess(data)
                cb && cb()
            },()=>{})
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
