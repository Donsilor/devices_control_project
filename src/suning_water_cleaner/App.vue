<template>
<div id="app">
    <div class="water_wave ww1"></div>
    <div class="water_wave ww2"></div>
    <div class="water_wave ww3"></div>

    <div class="page-on" v-if="isInit">
        <div class="name">{{device_name}}</div>
        <div class="tip">
            <p v-if="model.water_leakage=='on'"><span @click="toggleErrorModal(true)">漏水</span></p>
            <p v-else-if="model.water_shortage=='on'">缺水</p>
            <p v-else-if="model.status=='standby'">待机</p>
            <p v-else-if="model.status=='filter'">制水中...</p>
            <p v-else-if="model.status=='clean'">冲洗中...</p>
        </div>

        <filter-items :items="filterItems" :view-filter="viewFilter" />
    </div>

    <modal title="滤芯状态" class="modal-w" v-model="statusModalVisible">
        <div class="lx_status">
            <div class="p1">滤芯{{currentFilter.index+1}}</div>
            <div class="p2"> </div>
            <circle-pie class="pie" :value="toPercent(currentFilter.remaining)">
                <p class="p3">预计剩余寿命</p>
                <p class="p4">{{currentFilter.remaining}}%</p>
            </circle-pie>
        </div>
    </modal>

    <modal title="漏水警报" v-model="alarmModalVisible" :showCloseBtn="false" :overlayClickable="false">
        <div class="alarm">
            <div class="alert"><i></i>检测到净水器漏水！</div>
            <div class="text">
                <p>请先排查管道、台盆、机器，确定漏水位置；</p>
                <p>非机器漏水，请擦干报警器并将净水器断电重启；</p>
                <p>若净水器漏水，请及时关闭电源和水源。</p>
            </div>
            <div class="btn">
                <a href="" class="btn-default" @click.prevent="confirmError()">我知道了</a>
            </div>
        </div>
    </modal>

</div>
</template>

<style lang="less">
*{
    padding: 0;
    margin: 0;
}
body{
    -webkit-tap-highlight-color: transparent;
    color:#fff;
    font-size: 30px;
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
    bottom: 170px;
    width: 100%;
    background-size: 100% 100%;
    background-repeat: repeat-x;
    &.ww1{
        background-image: url(./assets/waterpurifier_bg_wave_one.png);
        height: 185px;
        animation: wave1 10s linear infinite;
    }
    &.ww2{
        background-image: url(./assets/waterpurifier_bg_wave_two.png);
        height: 201px;
        animation: wave2 15s linear infinite;
    }
    &.ww3{
        background-image: url(./assets/waterpurifier_bg_wave_three.png);
        height: 226px;
        animation: wave3 20s linear infinite;
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
        display: block;
    }
    .progress{
        height: 57px;
        width: 0;
        background: url(./assets/waterpurifier_img_wash.png) no-repeat;
        background-size: 207px 100%;
    }
    &.washing{
        a{
            display: none;
        }
        .progress{
            width: 100%;
            transition: width 30s;
        }
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
.topbar{
    position: relative;
    .left{
        position: absolute;
    }
    .title{
        text-align: center;
        font-size:36px;
        color:#2f3133;
        line-height: 96px;
    }
    .arrow{
            width: 100px;
            height: 96px;
            display: inline-block;
            background-repeat: no-repeat;
            background-size: 36px 36px;
            background-position: center center;
            background-image: url(./assets/icn_topbar_back_normal.png);
            &:active{
                background-image: url(./assets/icn_topbar_back_pressed.png);
            }
        }
}
.lx_title{
    position: absolute;
    left: 0;
    top: 288px;
    width:100%;
    text-align: center;
    font-size:36px;
    color:#ffffff;
}
.lx_wrap{
    position: absolute;
    left: 6%;
    top: 400px;
    width: 88%;
    display: flex;
    justify-content: space-around;
}
.lx_item{
    width: 302px;
    height: 302px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-image: url(./assets/waterpurifier_btn_filter_normal.png);
    &:active{
        background-image: url(./assets/waterpurifier_btn_filter_pressed.png);
    }
    &.active{
        background-image: url(./assets/waterpurifier_btn_expiredfilter_normal.png);
        &:active{
            background-image: url(./assets/waterpurifier_btn_expiredfilter_pressed.png);
        }
        .item-name{
            color: rgba(74,144,226,.5);
            i{
                background-image: url(./assets/waterpurifier_icon_nexttwo_normal.png)
            }
        }
        .item-left{
            color:#4a90e2;
        }
    }
    .item-name{
        margin-top: 100px;
        text-align: center;
        font-size:30px;
        color:rgba(255,255,255,0.5);
        margin-bottom: 10px;
        i{
            width: 22px;
            height: 22px;
            display: inline-block;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-image: url(./assets/waterpurifier_icon_nextone_normal.png);
        }
    }
    .item-left{
        text-align: center;
        font-size:36px;
    }
}
.lx_msg{
    position: absolute;
    left: 0;
    width: 100%;
    top: 832px;
    text-align: center;
    font-size:30px;
    color:#ffffff;
}
//弹窗
.modal{
    color:#76787a;
    z-index: 9;
}
.modal-w .modal{
    width:1300px;
}
.tds{
    padding: 0 46px;
    text-align: left;
    line-height: 1.6;
    p{margin-bottom: 30px}
    img{width: 100%}
}
.alarm{
    .alert{
        i{
            display: inline-block;
            width: 30px;
            height: 30px;
            background:url(./assets/waterpurifier_icon_remind_normal.png) no-repeat;
            background-size: 100% 100%;
            vertical-align: -5px;
            margin-right: 10px;
        }
        font-size:30px;
        color:#333333;
        margin-bottom: 42px;
    }
    .text{
        font-size:24px;
        color:#76787a;
        line-height:36px;
        margin-bottom: 80px;
    }
    .btn{
        width:504px;
        display: flex;
        justify-content: space-between;
        margin: 0 auto;
        a{
            flex: 1;
            border:1px solid #76787a;
            border-radius:6px;
            height:84px;
            margin: 0 12px;
            display: block;
            line-height: 82px;
            font-size:36px;
            color:#76787a;
        }
        .btn-default{
            border:1px solid #46bcff;
            background:#46bcff;
            color:#ffffff;
        }
    }
}
.lx_status{
    .p1{
        font-size:30px;
        color:#76787a;
        opacity:0.5;
    }
    .p2{
        font-size:36px;
        color:#333333;
        margin-bottom: 30px;
    }
    .p3{
        margin-top: 80px;
        font-size:30px;
        color:#76787a;
        opacity:0.5;
    }
    .p4{
        font-size:72px;
        color:#333333;
        line-height: 1.6
    }
    .p5{
        font-size:30px;
        color:#76787a;
        opacity:0.5;
    }
    .pie{
        margin:0 auto 50px;
    }
    .btn{
        width:658px;
        margin: 0 auto 20px;
        overflow: hidden;
        .btn-block{
            display:-webkit-box;
            transition: transform 400ms;
            &.active{
                transform: translate(-100%,0);
            }
        }
        a{
            border:1px solid #46bcff;
            border-radius:6px;
            width:656px;
            height:82px;
            display: block;
            line-height: 82px;
            font-size:36px;
            color:#46bcff;
        }
        .reset_submit{
            background:#46bcff;
            color:#ffffff;
        }
    }
    .msg{
        font-size:30px;
        color:rgba(118,120,122,0.50);
    }
}
</style>


<script>

import Modal from './components/Modal.vue'
import CirclePie from './components/CirclePie.vue'
import FilterItems from './components/FilterItems.vue'

const TDS_VALUE = [0,50,100,300,500]
const TDS_ANGLE = [-136, -74, 0, 74, 136]
const ERROR_STORE_KEY = 'water_cleaner_error'
const EXPIRED_STORE_KEY = 'water_cleaner_expired'

function getRotate(val, start, end){
    var min = TDS_VALUE[start]
    var max = TDS_VALUE[end]
    var min_r = TDS_ANGLE[start]
    var max_r = TDS_ANGLE[end]
    return min_r+(val-min)/(max-min)*(max_r-min_r)
}

function getDays(hour) {
    return Math.ceil(hour/24)
}

export default {
    components: {
        Modal,
        CirclePie,
        FilterItems
    },
    data() {
        return {
            device_name: '智能净水器',
            statusModalVisible: false,
            model: {},
            currentIndex: -1,
            filterItems: [],
            isInit: false,
            alarmModalVisible: false,
            errorStore: JSON.parse(localStorage.getItem(ERROR_STORE_KEY)) || [],
        }
    },
    computed: {
        currentFilter() {
            if(this.currentIndex == -1) return {}
            return this.filterItems[this.currentIndex]
        }
    },
    methods: {
        getSnapShot() {
            HdSmart.Device.getSnapShot((data) => {
                this.onSuccess(data)
            },() => {})
        },
        onSuccess(result) {

            if(!this.isInit){
                 this.isInit = true
            }
            HdSmart.UI.hideLoading()

            var attrs = result.attribute

            if(result.device_name){
                this.device_name = result.device_name
            }

            this.model = attrs

            this.filterItems = this.model.filter_lifetime.map((el ,index) => {
                return {
                    remaining: el,
                    index: index
                }
            })

            var errIndex = this.errorStore.indexOf('water_leakage')

            switch(this.model.water_leakage){
                case 'on':
                    if(errIndex < 0){
                        this.toggleErrorModal(true)
                    }
                    break;
                case 'off':
                    if(errIndex >= 0){
                        this.errorStore.splice(errIndex, 1)
                    }
                    break;
                default:
                    break;
            }

        },
        toPercent(remaining) {
            return remaining
        },
        viewFilter(index) {
            this.currentIndex = index
            this.statusModalVisible = true
        },
        toggleErrorModal(visible) {
            this.alarmModalVisible = visible
        },
        confirmError() {
            this.toggleErrorModal(false)
            if(this.errorStore.indexOf('water_leakage') < 0){
                this.errorStore.push('water_leakage')
            }
        }
    },
    created() {

        HdSmart.ready(() => {
            HdSmart.UI.showLoading()
            this.getSnapShot()
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
