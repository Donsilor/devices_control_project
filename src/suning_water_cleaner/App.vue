<template>
<div id="app" :class="{warn:level>=4}">
    <div class="water_wave ww1"></div>
    <div class="water_wave ww2"></div>
    <div class="water_wave ww3"></div>

    <div class="page-on" :style="inPage('list')" v-if="isInit">
        <div class="name">{{device_name}}</div>
        <div class="tip">
            <p v-if="inError('E3')"><span @click="toggleErrorModal('E3', true)">漏水</span></p>
            <p v-else-if="inError('E1')"><span>缺水</span></p>
            <p v-else-if="model.status=='maintain'">检修</p>
            <p v-else-if="model.status=='filter'">制水中...</p>
            <p v-else-if="model.status=='clean'">冲洗中...</p>
            <p v-else-if="hasTDS && oldTDS">过滤前水质：{{oldTDS}} TDS</p>
        </div>

        <div class="wash" :class="{washing:washing}">
            <a href="#" @click.prevent="setClean"><i></i>一键冲洗</a>
            <div class="progress"></div>
        </div>

        <div class="record_panle" v-if="hasTDS" @click="tdsModalVisible = true">
            <div class="circle">
                <span v-for="i in 4" :key="i" :class="'c'+i" v-show="i==(level>4?4:level)"></span>
            </div>
            <div class="arrow" :style="{transform:'rotate('+ rotate +'deg)'}"></div>
            <div class="value">{{nowTDS}}</div>
            <div class="pic">TDS</div>
            <div class="valueset">
                <span>0</span>
                <span>50</span>
                <span>100</span>
                <span>300</span>
                <span>300+</span>
            </div>
            <div class="text">
                <span v-if="level==1">过滤后水质可直接饮用</span>
                <span v-else-if="level==2">过滤后水质不建议直接饮用</span>
                <span v-else-if="level==3">过滤后水质不建议直接饮用</span>
                <span v-else>过滤后水质不可直接饮用</span>
            </div>
        </div>
        <a class="view" href="" @click.prevent="currentPage='list'" v-if="hasTDS">
            <span v-if="expired_num > 0">{{expired_num}}个滤芯已过期，点击查看详情</span>
            <span v-else-if="expiring_num > 0">{{expiring_num}}个滤芯将到期，点击查看详情</span>
            <span v-else>查看滤芯寿命</span>
        </a>

        <filter-items v-if="!hasTDS" :items="filterItems" :view-filter="viewFilter" />
    </div>

    <div class="page-sec" :style="inPage('index')">
        <div class="topbar">
            <!--<div class="left"><a href="" class="arrow" @click.prevent="currentPage='index'"></a></div>-->
            <div class="title">滤芯寿命</div>
        </div>
        <filter-items :items="filterItems" :view-filter="viewFilter" />
    </div>

    <modal title="TDS简介" class="modal-w" v-model="tdsModalVisible">
        <div class="tds">
            <p>
                对日常自来水而言，TDS是较为常用且有效的水质指标，可以反映出净水器的实际效果，
                数值越低代表过滤效果越好。但对于含有致病菌、悬浮物等有害物质的水源，TDS并不适用。
            </p>
            <img src="./assets/waterpurifier_img_tdsppm.png"/>
        </div>
    </modal>

    <modal title="净水器滤芯到期" v-model="timeoutModalVisible" :showCloseBtn="false" :overlayClickable="false">
        <div class="alarm">
            <div class="alert"><i></i>{{expiredFilterText}}已到期</div>
            <div class="text">
                <p>前置活性炭寿命已到期，请更换以保证饮水质量！</p>
                <p>请在更换滤芯后重置寿命</p>
            </div>

            <div class="btn">
                <a href="#" class="" @click.prevent="viewExpired">查看详情</a>
                <a href="#" class="btn-default" @click.prevent="confirmExpired">我知道了</a>
            </div>
        </div>
    </modal>

    <modal title="漏水警报" v-model="alarmModalVisible" :showCloseBtn="false" :overlayClickable="false">
        <div class="alarm">
            <div class="alert"><i></i>检测净水器到漏水！</div>
            <div class="text">
                <p>请先排查管道、台盆、机器，确定漏水位置；</p>
                <p>非机器漏水，请擦干报警器并将净水器断电重启；</p>
                <p>若净水器漏水，请及时关闭电源和水源。</p>
            </div>
            <div class="btn">
                <a href="" class="btn-default" @click.prevent="confirmError('E3')">我知道了</a>
            </div>
        </div>
    </modal>

    <modal title="滤芯状态" class="modal-w" v-model="statusModalVisible">
        <div class="lx_status">
            <div class="p1">滤芯{{currentFilter.index+1}}</div>
            <div class="p2"> </div>
            <circle-pie class="pie" :value="toPercent(currentFilter.remaining, currentFilter.total)">
                <p class="p3">预计剩余寿命</p>
                <p class="p4">{{currentFilter.remaining}}%</p>
            </circle-pie>
            <!--<div class="btn">-->
                <!--<div class="btn-block" :class="{active:isFilterResetActive}">-->
                    <!--<a href="" class="reset" @click.prevent="confirmFilterReset">复位剩余时间</a>-->
                    <!--<a href="" class="reset_submit" @click.prevent="submitFilterReset">确定重置</a>-->
                <!--</div>-->
            <!--</div>-->

            <!--<div class="msg">更换滤芯后请重置剩余时间</div>-->
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
            tdsModalVisible: false,
            timeoutModalVisible: false,
            alarmModalVisible: false,
            statusModalVisible: false,
            model: {},
            hasTDS: true,
            oldTDS: '',
            nowTDS: '',
            currentPage: 'index',
            currentIndex: -1,
            filterItems: [],
            washing: false,
            isFilterResetActive: false,
            isInit: false,
            errors: [],
            errorStore: JSON.parse(localStorage.getItem(ERROR_STORE_KEY)) || [],
            expiredStore: JSON.parse(localStorage.getItem(EXPIRED_STORE_KEY)) || [],
        }
    },
    computed: {
        level() {
            for(var i = TDS_VALUE.length-1; i >= 0; i--){
                if(this.nowTDS > TDS_VALUE[i]){
                    return i + 1
                }
            }
            return 1
        },
        rotate() {
            var level = this.level
            if(level == 5){
                return TDS_ANGLE[4]
            }
            return getRotate(this.nowTDS, level-1, level)
        },
        //已过期
        expired_num() {
            if(!this.model.filter_lifetime) return 0
            return this.model.filter_lifetime.filter((item) => {
                return item <= 0
            }).length
        },
        //即将过期
        expiring_num() {
            if(!this.model.filter_lifetime) return 0
            return this.model.filter_lifetime.filter((item) => {
                return getDays(item) <= 30
            }).length
        },
        currentFilter() {
            if(this.currentIndex == -1) return {}
            return this.filterItems[this.currentIndex]
        },
        expiredFilter() {
            var result = []
            if(!this.model.filter_lifetime) return result
            this.model.filter_lifetime.forEach((item, index) => {
                if(item <= 0 && this.expiredStore.indexOf(index) < 0){
                    result.push(index)
                }
            })
            return result
        },
        expiredFilterText() {
            return this.expiredFilter.map((item) => {
                return '滤芯' + (item + 1)
            }).join('、')
        }
    },
    watch: {
        statusModalVisible(val) {
            if(!val){
                this.isFilterResetActive = false
            }
        },
        currentPage(page) {
            if(page == 'index'){
                HdSmart.UI.toggleHeadAndFoot(true)
            }else if(page == 'list'){
                HdSmart.UI.toggleHeadAndFoot(false)
            }
        }
    },
    methods: {
        inPage(page) {
            return {
                visibility: this.currentPage==page ? '' : 'hidden'
            }
        },
        controlDevice(attr, val, success) {

            if(this.errors.length){
                return
            }

            HdSmart.Device.control({
                method: 'dm_set',
                nodeid: `water_filter.main.${attr}`,
                params: {
                    attribute: {
                        [attr]: val
                    }
                }
            }, () => {
                success && success()
            }, () => {

            })
        },
        setClean() {

            var el = this.$el.querySelector('.progress')

            var onWash = () => {
                this.washing = false
                el.removeEventListener('transitionend', onWash, false)
            }

            this.controlDevice('control', 'clean', () => {
                this.washing = true
                el.addEventListener('transitionend', onWash, false)
            })
        },
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

//            var tds = attrs.water_filter_result.TDS
//            if(tds && tds[0] != 65535){
//                this.hasTDS = true
//                this.oldTDS = tds[0]
//                this.nowTDS = tds[1]
//            }else{
//                this.hasTDS = false
//            }

            this.filterItems = this.model.filter_lifetime.map((el ,index) => {
                if(el > 0 && this.expiredStore.indexOf(index) >= 0){
                    this.expiredStore.splice(this.expiredStore.indexOf(index), 1)
                }
                // var total = this.model.filter_time_total[index]
                return {
                    remaining: el,
                    // total: total,
                    index: index
                }
            })

        },
        toPercent(remaining, total) {
            // Math.ceil(remaining/total*100)
            return parseInt(remaining/total*100)
        },
        viewFilter(index) {
            this.currentIndex = index
            this.statusModalVisible = true
        },
        confirmFilterReset() {
            this.isFilterResetActive = true
        },
        submitFilterReset() {
            var index = this.currentIndex
            this.controlDevice('reset_filter', [index+1], () => {
                HdSmart.UI.toast('重置成功')
                this.isFilterResetActive = false
                // this.filterItems[index].remaining = this.filterItems[index].total
            },() => {
                HdSmart.UI.toast('重置失败')
            })
        },
        onAlarm(attr) {
            var code = attr.error_code
            var index = this.errors.indexOf(code)
            var storeIndex = this.errorStore.indexOf(code)

            if(index >= 0){
                this.errors.splice(index, 1)
            }

            if(attr.error_status == 'open'){
                this.errors.push(code)
                if(storeIndex < 0){
                    this.toggleErrorModal(code, true)
                }
            }else{
                if(storeIndex >= 0){
                    this.errorStore.splice(storeIndex, 1)
                }
            }
        },
        inError(error){
            return this.errors.indexOf(error) >= 0
        },
        confirmError(error) {
            this.toggleErrorModal(error, false)
            if(this.errorStore.indexOf(error) < 0){
                this.errorStore.push(error)
            }
        },
        toggleErrorModal(error, visible) {
            switch(error){
                case 'E3':
                    this.alarmModalVisible = visible
                    break;
                default:
                    break;
            }
        },
        viewExpired() {
            if(this.expiredFilter.length == 1){
                this.viewFilter(this.expiredFilter[0])
            }else{
                if(this.hasTDS){
                    this.currentPage = 'list'
                }
            }
            this.confirmExpired()
        },
        confirmExpired() {
            this.timeoutModalVisible = false
            this.expiredStore = this.expiredStore.concat(this.expiredFilter)
        }
    },
    created() {
        this.$watch('errorStore.length', () => {
            localStorage.setItem(ERROR_STORE_KEY, JSON.stringify(this.errorStore))
        })

        this.$watch('expiredStore.length', () => {
            localStorage.setItem(EXPIRED_STORE_KEY, JSON.stringify(this.expiredStore))
        })

        this.$watch('expiredFilter.length', (val) => {
            if(val){
                this.timeoutModalVisible = true
            }
        })

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
                case 'dr_report_dev_alert':
                    this.onAlarm(data.result.attribute)
                    break;
                default:
                    this.onSuccess(data.result)
                    break
            }
        })
    }
}
</script>
