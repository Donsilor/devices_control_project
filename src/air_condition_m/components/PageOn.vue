<template>
<div class="wrap-on">

    <div class="bg"></div>

    <div class="header">
        <span class="name">{{device.name}}</span>
    </div>

    <div class="current_temp">
        <span class="num">{{temperature}}</span>
        <span class="unit">℃</span>
    </div>

    <a href="#" class="btn-minus" @click.prevent="setTemperature(-1, $event)"></a>
    <a href="#" class="btn-add" @click.prevent="setTemperature(1, $event)"></a>

    <a href="#" class="btn-off" @click.prevent="setOff($event)" :class="{'btn-off-toggle':toggle}"></a>

    <div class="btns">
        <a href="#" class="btn-toggle" :class="{'btn-toggle-more':toggle}"  @click.prevent="showMore()"></a>
        <ul>
            <li :class="{on:ac.mode==='cold'}">
                <a href="#" class="btn-cold" :class="{on:ac.mode==='cold'}" @click.prevent="setMode('cold', $event)"></a>
                制冷
            </li>
            <li :class="{on:ac.mode==='heat'}">
                <a href="#" class="btn-heat" :class="{on:ac.mode==='heat'}" @click.prevent="setMode('heat', $event)"></a>
                制热
            </li>
            <li :class="{on:ac.mode==='dehumidify'}">
                <a href="#" class="btn-dehumidify" :class="{on:ac.mode==='dehumidify'}" @click.prevent="setMode('dehumidify', $event)"></a>
                除湿
            </li>
            <li :class="{'on':ac.speed==='low'||ac.speed==='normal'||ac.speed==='high'}">
                <a href="#" class="btn-speed" :class="{'btn-s1':ac.speed==='low','btn-s2':ac.speed==='normal','btn-s3':ac.speed==='high'}" @click.prevent="setSpeed($event)"></a>
                <span v-show="ac.speed==='low'">低</span>
                <span v-show="ac.speed==='normal'">中</span>
                <span v-show="ac.speed==='high'">高</span>
                <span v-show="ac.speed!=='low'&&ac.speed!=='normal'&&ac.speed!=='high'">风速</span>
            </li>
        </ul>
        <ul class="btns-ul" :class="{'btns-ul-toggle':toggle}">
            <li :class="{on:ac.mode==='auto'}">
                <a href="#" class="btn-auto" :class="{on:ac.mode==='auto'}" @click.prevent="setMode('auto', $event)"></a>
                智能
            </li>
            <li :class="{on:ac.mode==='wind'}">
                <a href="#" class="btn-wind" :class="{on:ac.mode==='wind'}" @click.prevent="setMode('wind', $event)"></a>
                送风
            </li>
            <li :class="{on:ac.wind_up_down==='on'}">
                <a href="#" class="btn-vertical" :class="{on:ac.wind_up_down==='on'}" @click.prevent="setWind('wind_up_down', $event)"></a>
                上下
            </li>
            <li :class="{on:ac.wind_left_right==='on'}">
                <a href="#" class="btn-horizontal" :class="{on:ac.wind_left_right==='on'}" @click.prevent="setWind('wind_left_right', $event)"></a>
                左右
            </li>
        </ul>
    </div>
</div>
</template>

<script>
const SPEED = ['low', 'normal', 'high']
const [MIN_TEMP,MAX_TEMP] = [16,30]
let tempDelay, tempFlag = true
export default {
    props: {
        control: {
            type: Function
        },
        device: {
            type: Object
        },
        ac: {
            type: Object
        }
    },
    data() {
        return {
            temperature: this.ac.temperature,
            toggle: false
        }
    },
    methods: {
        syncTemp() {
            if(tempFlag){
                this.temperature = this.ac.temperature
            }
        },
        setOff(event) {
            this.control('switch', 'off', event.target)
        },
        setTemperature(val, event) {
            if((val > 0 && this.temperature === MAX_TEMP) || (val < 0 && this.temperature === MIN_TEMP)){
                return
            }
            if(this.checkCmd('temperature',this.temperature+val)){
                return
            }
            if(this.ac.mode === 'wind'){
                return
            }
            this.temperature += val
            clearTimeout(tempDelay)
            tempFlag = false
            tempDelay = setTimeout(()=>{
                tempFlag = true
                this.control('temperature', this.temperature, event.target, (data)=>{},()=>{
                    this.temperature = this.ac.temperature
                })
            },300)
        },
        setSpeed(event) {
            var index = SPEED.indexOf(this.ac.speed)
            var next = index === SPEED.length-1 ? 0 : index+1
            if(this.checkCmd('speed',SPEED[next])){
                return
            }
            this.control('speed', SPEED[next], event.target)
        },
        setMode(mode, event) {
            if(this.checkCmd('mode',mode)){
                return
            }
            this.control('mode', mode, event.target)
        },
        setWind(attr, event) {
            this.control(attr, this.ac[attr]==='on' ? 'off' : 'on', event.target)
        },
        showMore() {
            this.toggle = !this.toggle
        },
        checkCmd(attr, val) {
            var ac = JSON.parse(JSON.stringify(this.ac))
            ac[attr] = val
            if(ac.temperature===30 && ac.speed==='low' && ac.mode==='cold'){
                return true
            }
            return false
        }
    }
}
</script>

<style lang="less" scoped>
.wrap-on{
    color: #fff;
    background:#46bcff;
}
.bg{
    position: absolute;
    bottom: 0;
    left: 0;
    height: 480px;
    width: 100%;
    background: url(../assets/img_bg_aircon_on@2x.png) no-repeat;
    background-size: 100%;
}
.header{
    text-align: center;
    width: 100%;
    position: absolute;
    left: 0;
    top: 208px;
    .name{
        font-size: 32px;
    }
}
.current_temp{
    text-align: center;
    width: 100%;
    position: absolute;
    left: 0;
    top: 320px;
    .num{
        font-size: 200px;
        font-family:PingFangSC-Medium;
    }
    .unit{
        font-size: 60px;
        font-family: PingFangSC-Regular;
    }
}
.btn-minus,.btn-add{
    position: absolute;
    top: 372px;
    width: 96px;
    height: 96px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
}
.btn-minus{background-repeat: no-repeat;
    left: 64px;
    background-image: url(../assets/btn_aircon_minus_normal@2x.png);
    &:active{
       background-image: url(../assets/btn_aircon_minus_pressed@2x.png);
    }
}
.btn-add{
    right: 64px;
    background-image: url(../assets/btn_aircon_plus_normal@2x.png);
    &:active{
        background-image: url(../assets/btn_aircon_plus_pressed@2x.png);
    }
}
.btn-off{
    position: absolute;
    left: 50%;
    width: 144px;
    height: 144px;
    margin-left: -72px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    top: 600px;
    background-image: url(../assets/btn_aircon_poweroff_normal@2x.png);
    transition: all 1s;
    &:active {
        background-image: url(../assets/btn_aircon_poweroff_pressed@2x.png);
    }
    &-toggle{
        transform: scale(0);
        opacity: 0;
    }
}
.btns{
    position: absolute;
    left: 50%;
    bottom: 100px;
    width: 750px;
    transform: translateX(-50%);
    padding: 0 35px;
    .btns-ul{
        height:0px;
        opacity: 0;
        transition: all 1s;
        overflow: hidden;
        &-toggle{
            height: 200px;
            opacity: 1;
        }
    }
    ul{
        clear: both;
    }
    li{
        float: left;
        margin: 0 25px;
        text-align: center;
        width: 120px;
        height: 200px;
        &.on{
            font-weight: bold;
        }
    }
    a{
        width: 120px;
        height: 120px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        display: block;
        margin-bottom: 20px;
    }
}
.btn-toggle{
    position: absolute;
    left: 50%;
    // transform: translate(-50%,-66px);
    width: 60px !important;
    height: 60px !important;
    margin-top: -80px;
    margin-left: -30px;
    transition: transform 1s;
    background-image: url(../assets/btn_unfold@2x.png);
    background-size: 40px 40px !important;
    background-position: center center;
    &-more{
        // background-image: url(../assets/btn_collapse@2x.png);
        transform: rotate(180deg)
    }
}
.btn-cold{
    background-image: url(../assets/btn_aircon_cool_normal@2x.png);
    &:active{
        background-image: url(../assets/btn_aircon_cool_pressed@2x.png);
    }
    &.on{
        background-image: url(../assets/btn_aircon_cool_active@2x.png);
    }
}
.btn-heat{
    background-image: url(../assets/btn_aircon_heat_normal@2x.png);
    &:active{
        background-image: url(../assets/btn_aircon_heat_pressed@2x.png);
    }
    &.on{
        background-image: url(../assets/btn_aircon_heat_active@2x.png);
    }
}
.btn-dehumidify{
    background-image: url(../assets/btn_aircon_dry_normal@2x.png);
    &:active{
        background-image: url(../assets/btn_aircon_dry_pressed@2x.png);
    }
    &.on{
        background-image: url(../assets/btn_aircon_dry_active@2x.png);
    }
}
.btn-speed{
    background-image: url(../assets/btn_airvolume_auto_normal@2x.png);
    &:active{
        background-image: url(../assets/btn_airvolume_auto_pressed@2x.png);
    }
}
.btn-s1{
    background-image: url(../assets/btn_airvolume_s_normal@2x.png);
    &:active{
        background-image: url(../assets/btn_airvolume_s_pressed@2x.png);
    }

}
.btn-s2{
    background-image: url(../assets/btn_airvolume_m_normal@2x.png);
    &:active{
        background-image: url(../assets/btn_airvolume_m_pressed@2x.png);
    }
}
.btn-s3{
    background-image: url(../assets/btn_airvolume_l_normal@2x.png);
    &:active{
        background-image: url(../assets/btn_airvolume_l_pressed@2x.png);
    }
}
.btn-auto{
    background-image: url(../assets/btn_aircon_ai_normal@2x.png);
    &:active{
        background-image: url(../assets/btn_aircon_ai_pressed@2x.png);
    }
    &.on{
        background-image: url(../assets/btn_aircon_ai_active@2x.png);
    }
}
.btn-wind{
    background-image: url(../assets/btn_aircon_blow_normal@2x.png);
    &:active{
        background-image: url(../assets/btn_aircon_blow_pressed@2x.png);
    }
    &.on{
        background-image: url(../assets/btn_aircon_blow_active@2x.png);
    }
}
.btn-vertical{
    background-image: url(../assets/btn_aircon_vertical_normal@2x.png);
    &:active{
        background-image: url(../assets/btn_aircon_vertical_pressed@2x.png);
    }
    &.on{
        background-image: url(../assets/btn_aircon_vertical_active@2x.png);
    }
}
.btn-horizontal{
    background-image: url(../assets/btn_aircon_horizontal_normal@2x.png);
    &:active{
        background-image: url(../assets/btn_aircon_horizontal_pressed@2x.png);
    }
    &.on{
        background-image: url(../assets/btn_aircon_horizontal_active@2x.png);
    }
}
</style>
