<template>
<div id="app">
    <div class="page-on">
        <div class="device_name">{{device_name}}</div>
        <div class="status">正在加热</div>
        <div class="current_temp">
            <strong>38</strong>
            <small>℃</small>
            <p>当前温度</p>
        </div>
        <div class="set_temp">
            <p><span>预设温度</span>{{temp}}℃</p>
            <a href="" class="btn btn-reduce" @click.prevent="setTempDown"><i></i></a>
            <a href="" class="btn btn-add" @click.prevent="setTempUp"><i></i></a>
            <div class="slider">
                <slider ref="tempSlider" v-model="temp" :options="sliderOptions" @change="onTempChange" />
                <span class="min">{{sliderOptions.range.min}}℃</span>
                <span class="max">{{sliderOptions.range.max}}℃</span>
            </div>
        </div>
        <div class="btns">
            <a href="" class="btn btn-shut" v-if="model.switch=='on'" @click.prevent="setSwitch('off')">
                <i></i>
                <span>关闭</span>
            </a>
            <a href="" class="btn btn-shut" @click.prevent="setSwitch('on')" v-else>
                <i></i>
                <span>开机</span>
            </a>
            <a href="" class="btn btn-heating_half" :class="{active:model.mode=='half_tank'}" @click.prevent="setMode('half_tank')">
                <i></i>
                <span>速热半胆</span>
            </a>
            <a href="" class="btn btn-heating_whole" :class="{active:model.mode=='full_tank'}" @click.prevent="setMode('full_tank')">
                <i></i>
                <span>速热全胆</span>
            </a>
            <a href="" class="btn btn-heating_append" :class="{active:model.mode=='max_volume'}" @click.prevent="setMode('max_volume')">
                <i></i>
                <span>Max增容</span>
            </a>
            <a href="" class="btn btn-intelligentbath" :class="{active:model.mode=='smart'}" @click.prevent="setMode('smart')">
                <i></i>
                <span>智能浴</span>
            </a>
        </div>
    </div>
</div>
</template>

<style lang="less">
*{
    padding: 0;
    margin: 0;
}
#app{
    font-size: 24px;
    color: #fff;
}
a{
    color: #fff;
    text-decoration: none;
}
.page-on{
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background:#1eb0ff;
}
.device_name{
    text-align: center;
    font-size: 30px;
    height: 30px;
    margin-top: 140px;
}
.status{
    text-align: center;
    opacity:0.6;
    height: 30px;
    margin-top: 70px;
}
.current_temp{
    text-align: center;
    strong{
        font-size: 144px;
        font-weight: normal;
        line-height: 1.2;
    }
    small{
        font-size: 28px;
    }
    p{
        opacity:0.6;
    }
}
.set_temp{
    text-align: center;
    height: 160px;
    width: 1200px;
    margin: 70px auto 0;
    position: relative;
    p{
        span{opacity: .6;}
        margin-bottom: 44px;
    }
    .slider{
        span{
            position: absolute;
            width: 50px;
            text-align: center;
            padding-top: 30px;
            color: rgba(0,0,0,.4);
            &:before{
                content: "";
                width: 15px;
                height: 15px;
                background: #fff;
                position: absolute;
                top: -10px;
                left: 50%;
                transform: translateX(-50%);
                border-radius: 100%;
            }
        }
        .min{
            left: -25px;
        }
        .max{
            right: -25px;
        }
    }
}
.btns{
    display: flex;
    justify-content: center;
    .btn{
        margin: 0 48px;
    }
}
.btn{
    text-align: center;
    i{
        display: inline-block;
        width: 144px;
        height: 144px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }
    span{
        display: block;
        line-height: 2;
        opacity: .5;
    }
    &:active span{
        opacity: .45;
    }
    &.active span{
        opacity: 1;
    }
}
.btn-add{
    position: absolute;
    top: 40px;
    right: -130px;
    i{
        background-image: url(./assets/icon_heater_increase.png);
        width: 80px;
        height: 80px;
    }
    &:active{
        opacity: .8;
    }
    &.disabled{
        opacity: .5;
    }
}
.btn-reduce{
    position: absolute;
    top: 40px;
    left: -130px;
    i{
        background-image: url(./assets/icon_heater_subtract.png);
        width: 80px;
        height: 80px;
    }
    &:active{
        opacity: .8;
    }
    &.disabled{
        opacity: .5;
    }
}
.btn-shut{
    i{
        background-image: url(./assets/washer_btn_poweroff_normal.png);
    }
    &:active i{
        background-image: url(./assets/washer_btn_poweroff_pressed.png);
    }
}
.btn-heating_half{
    i{
        background-image: url(./assets/btn_heating_half.png);
    }
    &:active i{
        background-image: url(./assets/btn_heating_half_pressed.png);
    }
    &.active i{
        background-image: url(./assets/btn_heating_half_selected.png);
    }
}
.btn-heating_whole{
    i{
        background-image: url(./assets/btn_heating_whole.png);
    }
    &:active i{
        background-image: url(./assets/btn_heating_whole_pressed.png);
    }
    &.active i{
        background-image: url(./assets/btn_heating_whole_selected.png);
    }
}
.btn-heating_append{
    i{
        background-image: url(./assets/btn_heating_append.png);
    }
    &:active i{
        background-image: url(./assets/btn_heating_append_pressed.png);
    }
    &.active i{
        background-image: url(./assets/btn_heating_append_selected.png);
    }
}
.btn-intelligentbath{
    i{
        background-image: url(./assets/btn_intelligentbath.png);
    }
    &:active i{
        background-image: url(./assets/btn_intelligentbath_pressed.png);
    }
    &.active i{
        background-image: url(./assets/btn_intelligentbath_selected.png);
    }
}
</style>

<script>
import Slider from './components/Slider.vue'

const [TEMP_MIN,TEMP_MAX] = [35, 65]

export default {
    components: {
        Slider
    },
    data() {
        return {
            model: {},
            temp: 50,
            sliderOptions: {
                connect: [true, false],
                step: 1,
                range: {
                    min: TEMP_MIN,
                    max: TEMP_MAX
                }
            },
            device_name: ''
        }
    },
    methods: {
        controlDevice(attr, value) {

            HdSmart.Device.control({
                nodeid: `water_heater.main.${attr}`,
                params: {
                    attribute: {
                        [attr]: value
                    }
                }
            }, () => {

            }, () => {

            })
        },
        setTempUp() {
            if(this.temp < TEMP_MAX){
                this.temp++
            }
        },
        setTempDown() {
            if(this.temp > TEMP_MIN){
                this.temp--
            }
        },
        onTempChange(val) {
            this.controlDevice('temperature', val)
        },
        setSwitch(val) {
            this.controlDevice('switch', val)
        },
        setMode(val) {
            this.controlDevice('mode', val)
        },
        getSnapShot() {
            HdSmart.Device.getSnapShot((data) => {
                this.onSuccess(data)
            })
        },
        onSuccess(data) {
            this.model = data.attribute
            if(data.device_name){
                this.device_name = data.device_name
            }
            HdSmart.UI.hideLoading()
        }
    },
    created() {
        HdSmart.ready(() => {

            this.getSnapShot()

            HdSmart.onDeviceListen((data) => {
                if(data.method == 'dm_set'){
                    if(data.code !== 0) this.getSnapShot()
                }else{
                    this.onSuccess(data.result)
                }
            })
        })
    }
}
</script>
