<template>
<div id="app" :class="{warn:level==4}">
    <div class="water_wave ww1"></div>
    <div class="water_wave ww2"></div>
    <div class="water_wave ww3"></div>
    <div class="page-on">
        <div class="name">{{device_name}}</div>
        <div class="tip">
            <p v-show="tip">{{tip}}</p>
        </div>
        <div class="wash">
            <a href="#"><i></i>一键冲洗</a>
            <!-- <div class="progress"></div> -->
        </div>
        <div class="record_panle">
            <div class="circle">
                <span v-for="i in 4" :key="i" :class="'c'+i" v-show="i==level"></span>
            </div>
            <div class="arrow" :style="{transform:'rotate('+ rotate +'deg)'}"></div>
            <div class="value">100</div>
            <div class="pic">TDS</div>
            <div class="valueset">
                <span>0</span>
                <span>50</span>
                <span>100</span>
                <span>300</span>
                <span>300+</span>
            </div>
            <div class="text">过滤后水质不可直接饮用</div>
        </div>
        <a class="view">1个滤芯已过期，点击查看详情</a>
    </div>

    <div class="page-sec"></div>
</div>
</template>

<style lang="less" scoped>
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
#app{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background:#46bcff;
    &.warn{
        background:#d04802;
    }
}
@keyframes wave1 {
    from {
        background-position-x: 0;
    }
    to {
        background-position-x: -1920px;
    }
}
@keyframes wave2 {
    from {
        background-position-x: 300px;
    }
    to {
        background-position-x: -1620px;
    }
}
@keyframes wave3 {
    from {
        background-position-x: 600px;
    }
    to {
        background-position-x: -1320px;
    }
}
.water_wave{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-size: 100% 100%;
    background-repeat: repeat-x;
    &.ww1{
        background-image: url(./assets/waterpurifier_bg_wave_one.png);
        height: 185px;
        animation: wave1 15s linear infinite;
    }
    &.ww2{
        background-image: url(./assets/waterpurifier_bg_wave_two.png);
        height: 201px;
        animation: wave2 20s linear infinite;
    }
    &.ww3{
        background-image: url(./assets/waterpurifier_bg_wave_three.png);
        height: 226px;
        animation: wave3 25s linear infinite;
    }
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
.record_panle{
    position: absolute;
    left: 50%;
    top: 304px;
    transform: translate(-50%,0);
    width: 480px;
    .circle{
        width: 480px;
        height: 480px;
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
            background-image: url(./assets/waterpurifier_img_pure.png);
        }
        .c2{
            background-image: url(./assets/waterpurifier_img_purified.png);
        }
        .c3{
            background-image: url(./assets/waterpurifier_img_tapwater.png);
        }
        .c4{
            background-image: url(./assets/waterpurifier_img_pollutionwater.png);
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
        border:1px solid #fff;
        background:rgba(255,255,255,0.20);
        border-radius: 43px;
        width:122px;
        color:#fff;
        text-align: center;
        font-family:Roboto-Regular;
        font-size: 30px;
        line-height: 56px;
        position: absolute;
        left: 178px;
        top: 312px;
    }
    .text{
        font-size: 24px;
        position: absolute;
        left: 0;
        width: 100%;
        top: 420px;
        text-align: center;
        color: #fff;
    }
    .valueset{
        span{
            color:#fff;
            font-size: 24px;
            position: absolute
        }
        :nth-child(1){
            left: 40px;
            top: 400px;
        }
        :nth-child(2){
            left: -30px;
            top: 150px;
        }
        :nth-child(3){
            left: 218px;
            top: -35px;
        }
        :nth-child(4){
            right: -42px;
            top: 150px;
        }
        :nth-child(5){
            right: 0px;
            top: 400px;
        }
    }
}

.wash{
position: absolute;
right: 60px;
top: 132px;
border:1px solid #ffffff;
border-radius:53px;
width:207px;
height:56px;
overflow: hidden;
a{
    i{
        background: url(./assets/waterpurifier_icon_wash_normal.png) no-repeat;
        background-size: 100% 100%;
        width: 30px;
        height: 30px;
        display: inline-block;
        vertical-align: middle;
    }
    display: block;
    font-size:24px;
    color:#ffffff;
    line-height: 56px;
    text-align: center;
    background:rgba(255,255,255,0.20);
}
.progress{
    height: 57px;
    width: 0;
    background: url(./assets/waterpurifier_img_wash.png) no-repeat;
    background-size: 207px 100%;
    transition: width 30s;
}
}
.view{
position: absolute;
left: 50%;
top: 824px;
transform: translate(-50%,0);
background:rgba(255,255,255,0.20);
border:1px solid #ffffff;
border-radius:39px;
width:398px;
height:58px;
font-size:24px;
color:#ffffff;
text-align: center;
line-height: 58px;
}
</style>


<script>
export default {
    data() {
        return {
            device_name: '智能净水器',
            tip: '过滤前水质：422 TDS'
        }
    },
    computed: {
        level() {
            return 1
        },
        rotate() {
            return '180deg'
        }
    },
    methods: {

    }
}
</script>
