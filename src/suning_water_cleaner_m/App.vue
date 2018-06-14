<template>
    <div id="app">

        <div class="page-on" v-if="isInit && success">
            <div class="mainTitle">
                <div class="name">{{device_name}}</div>
                <div class="tip">
                    <p v-if="model.water_leakage=='on'">
                        <span @click="toggleErrorModal(true)">漏水</span>
                    </p>
                    <p v-else-if="model.water_shortage=='on'">缺水</p>
                    <p v-else-if="model.status=='standby'">待机</p>
                    <p v-else-if="model.status=='filter'">制水中...</p>
                    <p v-else-if="model.status=='clean'">冲洗中...</p>
                    <p v-else-if="model.status=='protect'">保护</p>
                </div>
            </div>

            <filter-items :items="filterItems" :view-filter="viewFilter" />

        </div>

        <div class="page-nodata" v-if="isInit && !success">
            <div class="name">{{device_name}}</div>
            <div class="pic1"></div>
        </div>
        <sub-page title="滤芯状态" class="modal-w" v-model="statusModalVisible">
            <div class="lx_status">
                <div class="p1">滤芯{{currentFilter.index+1}}</div>
                <div class="p2">{{getName(currentFilter.index)}} </div>
                <circle-pie class="pie" :value="toPercent(currentFilter.remaining)">
                    <p class="p3">预计剩余寿命</p>
                    <p class="p4">{{currentFilter.remaining}}%</p>
                </circle-pie>
            </div>
        </sub-page>

        <modal title="漏水警报" v-model="alarmModalVisible" :showCloseBtn="false" :overlayClickable="false">
            <div class="alarm">
                <div class="alert">
                    <i></i>检测到净水器漏水！</div>
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
* {
    padding: 0;
    margin: 0;
}
body,html {
    -webkit-tap-highlight-color: transparent;
    color: #fff;
    font-size: 30px;
    width:100%;
    height: 100%;
}
a {
    text-decoration: none;
}
#app,
.page-on,
.page-nodata {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}
.page-nodata {
    background-image: linear-gradient(-180deg, #fafafa 0%, #f2f2f2 100%);
    .name {
        color: #76787a;
    }
    .pic1 {
        position: absolute;
        top: 320px;
        left: 50%;
        transform: translateX(-50%);
        width: 420px;
        height: 420px;
        background: url(../../lib/base/water_cleaner/assets/waterpurifier_img_offline.png)
            no-repeat;
        background-size: 100% 100%;
    }
}
.page-on {
    // background: #46bcff;
    // &.warn {
    //     background: #d04802;
    // }
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
.mainTitle{
     position: absolute;
    left: 0;
    top: 18.93%;
    width: 100%;
}
.name {
    width: 100%;
    text-align: center;
    font-size: 32px;
    color: #1EA0FF;
}
.tip {
    width: 100%;
    text-align: center;
    font-size: 32px;
    color: #1EA0FF;
    opacity: 0.5;
    height: 80px;
    span {
        display: inline-block;
        height: 80px;
    }
}
.record_panle {
    position: absolute;
    left: 50%;
    top: 304px;
    transform: translate(-50%, 0);
    width: 480px;
    .circle {
        width: 480px;
        height: 480px;
        span {
            width: 480px;
            height: 480px;
            position: absolute;
            left: 0;
            top: 0;
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }
        .c1 {
            background-image: url(../../lib/base/water_cleaner/assets/waterpurifier_img_pure.png);
        }
        .c2 {
            background-image: url(../../lib/base/water_cleaner/assets/waterpurifier_img_purified.png);
        }
        .c3 {
            background-image: url(../../lib/base/water_cleaner/assets/waterpurifier_img_tapwater.png);
        }
        .c4 {
            background-image: url(../../lib/base/water_cleaner/assets/waterpurifier_img_pollutionwater.png);
        }
    }
    .arrow {
        width: 480px;
        height: 480px;
        position: absolute;
        left: 0;
        top: 0;
        background: url(../../lib/base/water_cleaner/assets/img_instrument_airquality_pointer.png)
            no-repeat;
        background-size: 100% 100%;
        transition: transform 1.5s;
    }
    .value {
        font-family: AbwechselnschriftBold;
        font-size: 144px;
        color: #ffffff;
        position: absolute;
        left: 0px;
        top: 120px;
        width: 100%;
        text-align: center;
    }
    .pic {
        border: 1px solid #fff;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 43px;
        width: 122px;
        color: #fff;
        text-align: center;
        font-family: Roboto-Regular;
        font-size: 30px;
        line-height: 56px;
        position: absolute;
        left: 178px;
        top: 312px;
    }
    .text {
        font-size: 24px;
        position: absolute;
        left: 0;
        width: 100%;
        top: 420px;
        text-align: center;
        color: #fff;
    }
    .valueset {
        span {
            color: #fff;
            font-size: 24px;
            position: absolute;
        }
        :nth-child(1) {
            left: 40px;
            top: 400px;
        }
        :nth-child(2) {
            left: -30px;
            top: 150px;
        }
        :nth-child(3) {
            left: 218px;
            top: -35px;
        }
        :nth-child(4) {
            right: -42px;
            top: 150px;
        }
        :nth-child(5) {
            right: 0px;
            top: 400px;
        }
    }
}

.wash {
    position: absolute;
    right: 60px;
    top: 132px;
    border: 1px solid #ffffff;
    border-radius: 53px;
    width: 207px;
    height: 56px;
    overflow: hidden;
    a {
        i {
            background: url(../../lib/base/water_cleaner/assets/waterpurifier_icon_wash_normal.png)
                no-repeat;
            background-size: 100% 100%;
            width: 30px;
            height: 30px;
            display: inline-block;
            vertical-align: middle;
        }
        display: block;
        font-size: 24px;
        color: #ffffff;
        line-height: 56px;
        text-align: center;
        background: rgba(255, 255, 255, 0.2);
        display: block;
    }
    .progress {
        height: 57px;
        width: 0;
        background: url(../../lib/base/water_cleaner/assets/waterpurifier_img_wash.png)
            no-repeat;
        background-size: 207px 100%;
    }
    &.washing {
        a {
            display: none;
        }
        .progress {
            width: 100%;
            transition: width 30s;
        }
    }
}
.view {
    position: absolute;
    left: 50%;
    top: 824px;
    transform: translate(-50%, 0);
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid #ffffff;
    border-radius: 39px;
    width: 398px;
    height: 58px;
    font-size: 24px;
    color: #ffffff;
    text-align: center;
    line-height: 58px;
}
.topbar {
    position: relative;
    .left {
        position: absolute;
    }
    .title {
        text-align: center;
        font-size: 36px;
        color: #2f3133;
        line-height: 96px;
    }
    .arrow {
        width: 100px;
        height: 96px;
        display: inline-block;
        background-repeat: no-repeat;
        background-size: 36px 36px;
        background-position: center center;
        background-image: url(../../lib/base/water_cleaner/assets/icn_topbar_back_normal.png);
        &:active {
            background-image: url(../../lib/base/water_cleaner/assets/icn_topbar_back_pressed.png);
        }
    }
}
//弹窗
.modal {
    color: #76787a;
    z-index: 9;
}
.modal-w .modal {
    width: 1300px;
}
.tds {
    padding: 0 46px;
    text-align: left;
    line-height: 1.6;
    p {
        margin-bottom: 30px;
    }
    img {
        width: 100%;
    }
}
.alarm {
    .alert {
        i {
            display: inline-block;
            width: 30px;
            height: 30px;
            background: url(../../lib/base/water_cleaner/assets/waterpurifier_icon_remind_normal.png)
                no-repeat;
            background-size: 100% 100%;
            vertical-align: -5px;
            margin-right: 10px;
        }
        font-size: 30px;
        color: #333333;
        margin-bottom: 42px;
    }
    .text {
        font-size: 24px;
        color: #76787a;
        line-height: 36px;
        margin-bottom: 80px;
    }
    .btn {
        width: 504px;
        display: flex;
        justify-content: space-between;
        margin: 0 auto;
        a {
            flex: 1;
            border: 1px solid #76787a;
            border-radius: 6px;
            height: 84px;
            margin: 0 12px;
            display: block;
            line-height: 82px;
            font-size: 36px;
            color: #76787a;
        }
        .btn-default {
            border: 1px solid #46bcff;
            background: #46bcff;
            color: #ffffff;
        }
    }
}

 .detail_content{
        width:100%;
        height: 100%;
        overflow-y:auto;
        .lx_wrap {
            position: absolute;
            bottom:0;
            left:0;
            z-index: 9;
            width:100%;
            height: 802px;
            overflow: hidden;
            box-sizing:border-box;
            padding:46px 0 0 32px;
            .time_tips{
                width:100%;
                height: 84px;
                line-height: 84px;
                color:#fff;
                font-size:28px;
                border-bottom:1px solid rgba(255,255,255,0.2);
            }
            .lx_item {
                width:100%;
                height:120px;
                line-height:120px;
                color:#fff;
                border-bottom:1px solid rgba(255,255,255,0.2);
                display:flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                box-sizing:border-box;
                padding-right:32px;
                .list_button{
                    width:50px;
                    height:50px;
                    line-height: 50px;
                    text-align: center;
                    border-radius:50%;
                    background-color:#fff;
                    font-size: 32px;
                    color: #1EA0FF;
                }
                .item-name{
                    font-size: 32px;
                    color: #FFFFFF;
                    flex-grow: 1;
                    box-sizing:border-box;
                    padding-left:30px;
                    text-align: left;
                }
                .item-right{
                    font-size: 32px;
                    color: #FFFFFF;
                    span.angle{
                        display: inline-block;
                        transform: rotate(45deg);
                        height: 13px;
                        width: 13px;
                        border-width: 2px 2px 0 0;
                        border-style: solid;
                        position: relative;
                        color:#fff;
                        vertical-align: 1%;
                    }
                }
                &.active{
                    .list_button{
                        background-color:rgba(255,255,255,0.50);
                    }
                    .item-name{
                        color: rgba(255,255,255,0.50);
                    }
                    .item-right{
                        color: rgba(255,255,255,0.50);
                    }
                }
            }
            .lx_msg {
                position: absolute;
                bottom:0;
                left:32px;
                height: 70px;
                line-height:70px;
                text-align: left;
                font-size: 24px;
                color: rgba(255,255,255,0.50);
            }
        }
        .wave_content{
            width:100%;
            height: 802px;
            box-sizing:border-box;
            position:absolute;
            z-index: -1;
            bottom:0;
            left:0;
            .waveHigh{
                position: absolute;
                left:0;
                bottom:0;
                width:100%;
                height: 100%;
                overflow: hidden;
                background-size: 100% 100%;
                background-repeat: repeat-x;
                &.waveHigh1 {
                    background-image: url(../../lib/base/water_cleaner/assets/waterpurifier_bg_wave_blue2one@2x.png);
                    animation: wave1 5s linear infinite;
                    z-index: -3;
                }
                &.waveHigh2 {
                    background-image: url(../../lib/base/water_cleaner/assets/waterpurifier_bg_wave_blue2two@2x.png);
                    animation: wave2 8s linear infinite;
                    z-index: -2;
                }
                &.waveHigh3 {
                    background-image: url(../../lib/base/water_cleaner/assets/waterpurifier_bg_wave_blue2there@2x.png);
                    animation: wave3 10s linear infinite;
                    z-index: -1;
                }
            }
        }
    }
    .lx_status {
        height: auto;
        overflow:auto;
        .p1 {
            font-size: 28px;
            height: 40px;
            line-height: 40px;
            color: #76787A;
            opacity: 0.5;
            text-align:center;
            margin-top:6.53%;
        }
        .p2 {
            font-size: 36px;
            color: #333333;
            margin-bottom: 30px;
            font-size: 32px;
            color: #333333;
            text-align:center;
        }
        .p3 {
            opacity: 0.5;
            font-size: 28px;
            color: #76787A;
            text-align: center;
            margin-top:72px;
            height: 40px;
            line-height:40px;
        }
        .p4 {
            height: 86px;
            line-height:86px;
            font-size: 72px;
            color: #333333;
            margin-top:20px;
        }
        .pie {
            margin: 0 auto 50px;
        }
        .msg {
            opacity: 0.5;
            font-size: 28px;
            color: #76787A;
            margin-top:60px;
            text-align: center;
            height:40px;
            line-height:40px;
        }
    }
    .subpage {
        z-index:99;
    }
    .overlay{
        z-index:10;
    }
</style>


<script>
import Modal from "../../lib/components/Modal.vue";
import SubPage from "../../lib/components/SubPage";
import CirclePie from "./components/CirclePie.vue";
import FilterItems from "./components/FilterItems.vue";

const TDS_VALUE = [0, 50, 100, 300, 500];
const TDS_ANGLE = [-136, -74, 0, 74, 136];
const ERROR_STORE_KEY = "water_cleaner_error";
const EXPIRED_STORE_KEY = "water_cleaner_expired";

function getRotate(val, start, end) {
    var min = TDS_VALUE[start];
    var max = TDS_VALUE[end];
    var min_r = TDS_ANGLE[start];
    var max_r = TDS_ANGLE[end];
    return min_r + (val - min) / (max - min) * (max_r - min_r);
}

function getDays(hour) {
    return Math.ceil(hour / 24);
}

export default {
    components: {
        Modal,
        CirclePie,
        FilterItems,
        SubPage
    },
    data() {
        return {
            device_name: "",
            statusModalVisible: false,
            model: {},
            currentIndex: -1,
            filterItems: [],
            isInit: false,
            success: false,
            alarmModalVisible: false,
            errorStore: JSON.parse(localStorage.getItem(ERROR_STORE_KEY)) || []
        };
    },
    watch:{
        statusModalVisible(val){
            if(val){
                HdSmart.UI.toggleHeadAndFoot(false);
            }else{
                HdSmart.UI.toggleHeadAndFoot(true);
            }
        }
    },
    computed: {
        currentFilter() {
            if (this.currentIndex == -1) return {};
            return this.filterItems[this.currentIndex];
        }
    },
    methods: {
        getName(index) {
            return ["PP棉", "前置活性炭", "PP棉", "RO", "后置活性炭"][index];
        },
        getSnapShot() {
            HdSmart.Device.getSnapShot(
                data => {
                    this.isInit = true;
                    this.success = true;
                    this.onSuccess(data);
                },
                () => {
                    this.isInit = true;
                    this.success = false;
                }
            );
        },
        onSuccess(result) {
            HdSmart.UI.hideLoading();

            var attrs = result.attribute;

            if (result.device_name) {
                this.device_name = result.device_name;
            }

            this.model = attrs;

            this.filterItems = this.model.filter_lifetime.map((el, index) => {
                return {
                    remaining: el,
                    index: index
                };
            });

            var errIndex = this.errorStore.indexOf("water_leakage");

            switch (this.model.water_leakage) {
                case "on":
                    if (errIndex < 0) {
                        this.toggleErrorModal(true);
                    }
                    break;
                case "off":
                    if (errIndex >= 0) {
                        this.errorStore.splice(errIndex, 1);
                    }
                    break;
                default:
                    break;
            }
        },
        toPercent(remaining) {
            return remaining;
        },
        viewFilter(index) {
            this.currentIndex = index;
            this.statusModalVisible = true;
        },
        toggleErrorModal(visible) {
            this.alarmModalVisible = visible;
        },
        confirmError() {
            this.toggleErrorModal(false);
            if (this.errorStore.indexOf("water_leakage") < 0) {
                this.errorStore.push("water_leakage");
            }
        }
    },
    created() {
        HdSmart.ready(() => {
            if (window.device_name) {
                this.device_name = window.device_name;
            }
            HdSmart.UI.showLoading();
            this.getSnapShot();
        });

        HdSmart.onDeviceStateChange(data => {
            this.onSuccess(data.result);
        });
    }
};
</script>
