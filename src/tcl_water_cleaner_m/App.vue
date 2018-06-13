<template>
<div id="app" :class="{warn:level>=4}">


    <div class="page-on" :style="inPage('index')" v-if="isInit && hasTDS">
        <div class="mainTitle">
            <div class="name">{{device_name}}</div>
            <div class="tip">
                <p v-if="inError('E3')"><span @click="toggleErrorModal('E3', true)">漏水</span></p>
                <p v-else-if="inError('E1')"><span>缺水</span></p>
                <p v-else>{{statusTip}}</p>
            </div>
        </div>


        <div class="wash" :class="{washing:washing}">
            <a href="#" @click.prevent="setClean">一键冲洗</a>
            <div class="progress"></div>
        </div>

        <div class="record_panle" v-if="hasTDS" @click="tdsModalVisibleControl">
            <!-- <div class="circle">
                <span v-for="i in 4" :key="i" :class="'c'+i" v-show="i==(level>4?4:level)"></span>
            </div> -->
            <!-- <div class="arrow" :style="{transform:'rotate('+ rotate +'deg)'}"></div> -->
            <div class="value">{{nowTDS}}</div>
            <div class ="pic" :class="{'pic_100':nowTDS>=100}">TDS</div>
            <!-- <div class="valueset" @click.stop="">
                <span>0</span>
                <span>50</span>
                <span>100</span>
                <span>300</span>
                <span>300+</span>
            </div> -->
            <div class="text">
                <span v-if="level==1">过滤后水质可直接饮用</span>
                <span v-else-if="level==2">过滤后水质不建议直接饮用</span>
                <span v-else-if="level==3">过滤后水质不建议直接饮用</span>
                <span v-else>过滤后水质不可直接饮用</span>
            </div>
        </div>

        <div class="water_wave ww1"></div>
        <div class="water_wave ww2"></div>
        <div class="water_wave ww3"></div>
        <a class="view" href="" @click.prevent="currentPage='list'" v-if="hasTDS">
            <span v-if="expired_num > 0">{{expired_num}}个滤芯已过期，点击查看详情</span>
            <span v-else-if="expiring_num > 0">{{expiring_num}}个滤芯将到期，点击查看详情</span>
            <span v-else>查看滤芯寿命</span>
        </a>
        <!-- <filter-items v-if="!hasTDS" :items="filterItems" :view-filter="viewFilter"  /> -->
    </div>
    <!-- 没有TDS的机器的样式 -->
    <div class="hasNotTDs" v-if="!hasTDS" :style="inPage('index')">
        <div class="mainTitle">
            <div class="name">{{device_name}}</div>
            <div class="tip">
                <p v-if="inError('E3')"><span @click="toggleErrorModal('E3', true)">漏水</span></p>
                <p v-else-if="inError('E1')"><span>缺水</span></p>
                <p v-else>{{statusTip}}</p>
            </div>
        </div>
        <div class="wash" :class="{washing:washing}">
            <a href="#" @click.prevent="setClean">一键冲洗</a>
            <div class="progress"></div>
        </div>
        <filter-items  :items="filterItems" :view-filter="viewFilter" :hasTDS="hasTDS" :toggle-modal-visible="toggleModalVisible" />
    </div>
    <div class="page-sec" :style="inPage('list')" v-if="hasTDS">
        <div class="topbar">
            <div class="left"><a href="" class="arrow" @click.prevent="currentPage='index'"></a></div>
            <div class="title">滤芯寿命</div>
        </div>
        <filter-items :items="filterItems" :view-filter="viewFilter" :nowTDS="nowTDS" :level="level" :hasTDS="hasTDS" v-model="tdsModalVisible" :toggle-modal-visible="toggleModalVisible" />
    </div>

    <sub-page title="TDS简介" class="modal-w" v-model="tdsModalVisible">
        <div class="tds">
            <p class="tds_text">
                对日常自来水而言，TDS是较为常用且有效的水质指标，可以反映出净水器的实际效果，
                数值越低代表过滤效果越好。但对于含有致病菌、悬浮物等有害物质的水源，TDS并不适用。
            </p>
            <img src="../../lib/base/water_cleaner/assets/waterpurifier_img_tdsppm@2x.png"/>
        </div>
    </sub-page>

    <modal v-for="item in expiredFilter" :key="item.index" title="净水器滤芯到期" v-model="item.timeoutModalVisible" :showCloseBtn="false" :overlayClickable="false">
        <div class="alarm">
            <div class="alert"><i></i>“净水器”的滤芯{{item.index+1}}已到期</div>
            <div class="text">
                <p>{{getName(item.index)}}寿命已到期，请更换以保证饮水质量！</p>
                <p>请在更换滤芯后重置寿命</p>
            </div>

            <div class="btn">
                <a href="#" class="" @click.prevent="viewExpired(item)">查看详情</a>
                <a href="#" class="btn-default" @click.prevent="confirmExpired(item)">我知道了</a>
            </div>
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
                <a href="" class="btn-default" @click.prevent="confirmError('E3')">我知道了</a>
            </div>
        </div>
    </modal>

    <sub-page title="滤芯状态" class="modal-w" v-model="statusModalVisible">
        <div class="lx_status">
            <div class="p1">滤芯{{currentFilter.index+1}}</div>
            <div class="p2">{{getName(currentFilter.index)}} </div>
            <circle-pie class="pie" :value="toPercent(currentFilter.remaining, currentFilter.total)">
                <p class="p3">预计剩余寿命</p>
                <p class="p4">{{currentFilter.remaining | toDays}}天</p>
                <p class="p5">剩余{{toPercent(currentFilter.remaining, currentFilter.total)}}%</p>
            </circle-pie>
            <div class="msg">更换滤芯后请重置剩余时间</div>
            <div class="btn">
                <div class="btn-block" :class="{active:isFilterResetActive}">
                    <a href="" class="reset" @click.prevent="confirmFilterReset">重置剩余时间</a>
                    <a href="" class="reset_submit" @click.prevent="submitFilterReset">确定重置</a>
                </div>
            </div>


        </div>
    </sub-page>

</div>
</template>

<style lang="less">
* {
    padding: 0;
    margin: 0;
}
body,html {
    width:100%;
    height: 100%;
    overflow-y: auto;
    -webkit-tap-highlight-color: transparent;
    color: #fff;
    font-size: 30px;
}
a {
    text-decoration: none;
}
#app {
    position: relative;
    width: 100%;
    height: 100%;
    color: #1EA0FF;
    position: relative;
    overflow: hidden;
    // background: #46bcff;
    &.warn {//水质污染严重轻情况下的样式
        // background: #d04802;
        .water_wave {
            &.ww1 {
                background-image: url(../../lib/base/water_cleaner/assets/waterpurifier_bg_wave_red1one@2x.png);
                animation: wave1 5s linear infinite;
            }
            &.ww2 {
                background-image: url(../../lib/base/water_cleaner/assets/waterpurifier_bg_wave_red1two@2x.png);
                animation: wave2 8s linear infinite;
            }
            &.ww3 {
                background-image: url(../../lib/base/water_cleaner/assets/waterpurifier_bg_wave_red1there@2x.png);
                animation: wave3 10s linear infinite;
            }
        }
        .mainTitle{
            .name{
                color: #D04802;
            }
            .tip{
                color: #D04802;
            }
        }
        .wash{
            border: 1px solid #D04802;
            border-right:none;
            a{
                color: #D04802;
            }
            .progress{
                background: url(../../lib/base/water_cleaner/assets/btn_aircon_moreorange@2x.png) no-repeat left;
                background-size:auto 100%;
            }

        }
        .record_panle{
            .value{
                color: #D04802;
            }
            .pic{
                right:119px;
                border: 1px solid #D04802;
                color: #D04802;
            }
            .pic_100{
                right:60px;
                border: 1px solid #D04802;
                color: #D04802;
            }
            .text{
                color: #D04802;
            }
        }


    }

}
@keyframes wave1 {
    from {
        background-position-x: 0;
    }
    to {
        background-position-x: -750px;
    }
}
@keyframes wave2 {
    from {
        background-position-x: 300px;
    }
    to {
        background-position-x: -450px;
    }
}
@keyframes wave3 {
    from {
        background-position-x: 600px;
    }
    to {
        background-position-x: -150px;
    }
}
.water_wave {
    position: absolute;
    left: 0;
    bottom: 0px;
    width: 100%;
    background-size: 100% 100%;
    background-repeat: repeat-x;
    height:428px;
    &.ww1 {
        background-image: url(../../lib/base/water_cleaner/assets/wave_level1.png);
        animation: wave1 5s linear infinite;
    }
    &.ww2 {
        background-image: url(../../lib/base/water_cleaner/assets/wave_level2.png);
        animation: wave2 8s linear infinite;
    }
    &.ww3 {
        background-image: url(../../lib/base/water_cleaner/assets/wave_level3.png);
        animation: wave3 10s linear infinite;
    }
}
.page-on,.page-sec,.hasNotTDs{
    position: absolute;
    width:100%;
    height: 100%;
    overflow:hidden;
    box-sizing:border-box;
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
    width:100%;
    height:auto;
    position: absolute;
    left: 0;
    top: 30.7%;
    text-align:center;
    .value {
        font-family: AbwechselnschriftBold;
        font-size: 200px;
        color: #1EA0FF;
        height:240px;
        line-height: 240px;
        width: 100%;
        text-align: center;
    }
    .pic {
        border: 1px solid #1EA0FF;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 43px;
        width: 122px;
        color: #1EA0FF;
        text-align: center;
        font-family: Roboto-Regular;
        font-size: 30px;
        line-height: 56px;
        position: absolute;
        right: 119px;
        top: 130px;
    }
    .pic_100{
        right:60px;
    }
    .text {
        width: 100%;
        text-align: center;
        font-size: 32px;
        color: #1EA0FF;
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
    right:0px;
    top: 19.3%;
    width:158px;
    height: 80px;
    line-height: 80px;
    border: 1px solid #1EA0FF;
    border-right:none;
    border-radius: 48px 0 0 48px;
    overflow: hidden;
    text-align:center;
    a {
        width:100%;
        height: 80px;
        line-height: 80px !important;
        font-size: 28px;
        color: #1EA0FF;
        text-align: center;
        background: rgba(255, 255, 255, 0.2);
        display:block;
    }
    .progress {
        height: 80px;
        width: 0;
        background: url(../../lib/base/water_cleaner/assets/waterpurifier_img_wash@2x.png) no-repeat;
        background-size: 100% 100%;
    }
    &.washing {
        a {
            display: none;
        }
        .progress {
            width: 100%;
            height: 100%;
            transition-property: width;
            transition-duration: 30s;
        }
    }
}
.view {
    position: absolute;
    left: 50%;
    bottom:173px;
    transform: translate(-50%, 0);
    background: rgba(255,255,255,0.20);
    border: 1px solid #FFFFFF;
    border-radius: 40px;
    width: 510px;
    height: 80px;
    font-size: 28px;
    color: #ffffff;
    text-align: center;
    line-height: 80px;
    z-index: 9;
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
.detail_content{
    overflow-y:auto;
    .lx_title {
        text-align: center;
        font-size: 36px;
        color: #ffffff;
        position: relative;
        .main_tips{
            width:100%;
            height: 240px;
            line-height:240px;
            font-size: 200px;
            color: #1EA0FF;
        }
        .levelTips{
            font-size: 32px;
            color: #1EA0FF;
        }
        .pic{
            border: 1px solid #1EA0FF;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 43px;
            width: 124px;
            height:60px;
            color: #1EA0FF;
            text-align: center;
            font-family: Roboto-Regular;
            font-size: 30px;
            line-height: 56px;
            position: absolute;
            right: 119px;
            top: 134px;
        }
        .pic_100{
            right:60px;
        }
    }
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
    &.detailWaing{
        .lx_title{
            .main_tips{
                color: #D04802;
            }
            .levelTips{
                color: #D04802;
            }
            .pic {
                border: 1px solid #D04802;
                color: #D04802;
            }
            .pic_100{
                border: 1px solid #D04802;
                color: #D04802;
            }
        }
        .lx_wrap{
           .lx_item{
               .list_button{
                   color: #D04802;
               }
           }
        }
        .wave_content{
            .waveHigh{
                &.waveHigh1 {
                    background-image: url(../../lib/base/water_cleaner/assets/waterpurifier_bg_wave_red2one@2x.png);
                }
                &.waveHigh2 {
                    background-image: url(../../lib/base/water_cleaner/assets/waterpurifier_bg_wave_red2two@2x.png);
                }
                &.waveHigh3 {
                    background-image: url(../../lib/base/water_cleaner/assets/waterpurifier_bg_wave_red2there@2x.png);
                }
            }
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
/**tds简介样式 start*/
.tds{
    width:100%;
    p.tds_text{
        width:100%;
        color:#333;
        font-size:28px;
        box-sizing:border-box;
        padding:34px 30px 0 30px;
    }
    img{
        display: block;
        width:100%;
        box-sizing:border-box;
        height: auto;
        margin-top:60px;
        padding:0px 20px 0 20px;
    }
}
/**tds简介样式 end*/
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
        margin-top:62px;
        height: 40px;
        line-height:40px;
    }
    .p4 {
        height: 86px;
        line-height:86px;
        font-size: 72px;
        color: #333333;
    }
    .p5 {
        opacity: 0.5;
        font-size: 28px;
        color: #76787A;
        height: 40px;
        line-height: 40px;
        margin-top:10px;
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
    .btn {
        width: 660px;
        height: 84px;
        line-height: 84px;
        margin: 14px auto;
        overflow-x: hidden;
        text-align:center;
        box-sizing: border-box;
        border: 1px solid #46bcff;
        border-radius: 6px;
        .btn-block {
            box-sizing: border-box;
            display: -webkit-box;
            transition: transform 400ms;
            &.active {
                transform: translate(-100%, 0);
            }
        }
        a {
            width:100%;
            height: 100%;
            display: block;
            line-height: 82px;
            font-size: 36px;
            color: #46bcff;
        }
        .reset_submit {
            background: #46bcff;
            color: #ffffff;
        }
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
import Modal from "../../lib/components/Modal";
import CirclePie from "./components/CirclePie.vue";
import FilterItems from "./components/FilterItems.vue";
import SubPage from './components/SubPage.vue';

const TDS_VALUE = [0, 50, 100, 300, 500];
const TDS_ANGLE = [-136, -74, 0, 74, 136];
const ERROR_STORE_KEY = "water_cleaner_error";
const EXPIRED_STORE_KEY = "water_cleaner_expired";

// function getRotate(val, start, end) {
//     var min = TDS_VALUE[start];
//     var max = TDS_VALUE[end];
//     var min_r = TDS_ANGLE[start];
//     var max_r = TDS_ANGLE[end];
//     return min_r + (val - min) / (max - min) * (max_r - min_r);
// }

function getDays(hour) {
    return Math.ceil(hour / 24);
}

function findIndex(array, fn) {
    for (var i = 0; i < array.length; i++) {
        if (fn(array[i])) {
            return i;
        }
    }
    return -1;
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
            tdsModalVisible: false,//是否显示“TDS简介”
            timeoutModalVisible: false,//是否显示滤芯过期弹窗
            alarmModalVisible: false,//是否展示报警弹窗
            statusModalVisible: false,//滤芯状态Subpage蒙层
            model: {},
            hasTDS: true,
            oldTDS: "",
            nowTDS: "",
            currentPage: "index",
            currentIndex: -1,
            filterItems: [],
            washing: false,
            isFilterResetActive: false,
            isInit: false,
            errors: [],
            errorStore: JSON.parse(localStorage.getItem(ERROR_STORE_KEY)) || [],
            expiredStore:
                JSON.parse(localStorage.getItem(EXPIRED_STORE_KEY)) || []
        };
    },
    computed: {
        level() {
            var level;
            for (var i = TDS_VALUE.length - 1; i >= 0; i--) {
                if (this.nowTDS > TDS_VALUE[i]) {
                    return i + 1;
                }
            }
            return 1;
        },
        // rotate() {
        //     var level = this.level;
        //     if (level == 5) {
        //         return TDS_ANGLE[4];
        //     }
        //     return getRotate(this.nowTDS, level - 1, level);
        // },
        //已过期
        expired_num() {
            if (!this.model.filter_time_remaining) return 0;
            return this.model.filter_time_remaining.filter(item => {
                return item <= 0;
            }).length;
        },
        //即将过期
        expiring_num() {
            if (!this.model.filter_time_remaining) return 0;
            return this.model.filter_time_remaining.filter(item => {
                return getDays(item) <= 30;
            }).length;
        },
        currentFilter() {//当前正在查看状态的某个滤芯的状态
            if (this.currentIndex == -1) return {};
            return this.filterItems[this.currentIndex];
        },
        expiredFilter() {//净水器滤芯到期
            var result = [];
            if (!this.model.filter_time_remaining) return result;
            this.model.filter_time_remaining.forEach((item, index) => {
                if (item <= 0 && this.expiredStore.indexOf(index) < 0) {
                    // result.push(index)
                    result.push({
                        index: index,
                        timeoutModalVisible: true
                    });
                }
            });
            return result;
        },
        statusTip() {//净水器状态
            if (this.model.status == "filter") {
                return "制水中...";
            }
            if (this.model.status == "clean") {
                return "冲洗中...";
            }
            if (this.model.status == "standby" && this.hasTDS && this.oldTDS) {
                return "过滤前水质：" + this.oldTDS + " TDS";
            }
            if (this.model.status == "standby") {
                return "待机";
            }
            return "";
        }
    },
    watch: {
        statusModalVisible(val) {//单个滤芯的详情页的显隐控制
            if (!val) {
                this.isFilterResetActive = false;
            }
        },
        currentPage(page) {
            if (page == "index") {
                HdSmart.UI.toggleHeadAndFoot(true);
            } else if (page == "list") {
                HdSmart.UI.toggleHeadAndFoot(false);
            }
        },
        "model.status"(newVal, oldVal) {
            if (oldVal == "clean" && this.washing) {
                var el = this.$el.querySelector(".progress");
                el.style.transitionDuration = "1.2s";
                el.style.width = "100.1%";
                setTimeout(() => {
                    el.style.cssText = "";
                }, 1500);
            }
        },
        tdsModalVisible(val){
            if(this.currentPage == 'index'){
                HdSmart.UI.toggleHeadAndFoot(!val);
            }
        },
        statusModalVisible(val){
            if(this.currentPage == 'index'){
                HdSmart.UI.toggleHeadAndFoot(!val);
            }
        }
    },
    methods: {
        tdsModalVisibleControl() {//点击TDS按钮
            this.tdsModalVisible = !this.tdsModalVisible;
        },
        getName(index) {
            return ["PP棉", "前置活性炭", "RO", "后置活性炭"][index];
        },
        inPage(page) {
            return {
                visibility: this.currentPage == page ? "" : "hidden"
                // display: this.currentPage == page ? "" : "none"
            };
        },
        controlDevice(attr, val, success) {
            if (this.errors.length) {
                return;
            }

            HdSmart.Device.control(
                {
                    method: "dm_set",
                    nodeid: `water_filter.main.${attr}`,
                    params: {
                        attribute: {
                            [attr]: val
                        }
                    }
                },
                () => {
                    success && success();
                },
                () => {}
            );
        },
        setClean() {//一键冲洗
            var el = this.$el.querySelector(".progress");
            var onWash = () => {
                this.washing = false;
                el.washing = false;
                el.removeEventListener("transitionend", onWash, false);
            };

            if (el.washing) {
                return;
            }

            //如果正在冲洗中，只是改变下UI状态
            if (this.model.status == "clean") {
                this.washing = true;
                el.washing = true;
                el.addEventListener("transitionend", onWash, false);
            } else {
                this.controlDevice("control", "clean", () => {
                    this.washing = true;
                    el.washing = true;
                    el.addEventListener("transitionend", onWash, false);
                });
            }
        },
        getSnapShot() {
            HdSmart.Device.getSnapShot(
                data => {
                    this.onSuccess(data);
                },
                () => {}
            );
        },
        onSuccess(result) {
            console.log("resultall",result)
            HdSmart.UI.hideLoading();

            if (!this.isInit) {
                this.isInit = true;
            }

            var attrs = result.attribute;

            this.model = attrs;

            this.getAlertList(attrs.error);

            var tds = attrs.water_filter_result.TDS;

            if (tds && tds[0] != 65535) {
                this.hasTDS = true;//Todo
                // this.hasTDS =false;
                this.oldTDS = tds[0];
                this.nowTDS = tds[1];
            } else {
                this.hasTDS = false;
            }

            this.filterItems = this.model.filter_time_remaining.map(
                (el, index) => {
                    if (el > 0 && this.expiredStore.indexOf(index) >= 0) {
                        this.expiredStore.splice(
                            this.expiredStore.indexOf(index),
                            1
                        );
                    }
                    var total = this.model.filter_time_total[index];
                    return {
                        remaining: el,
                        total: total,
                        index: index
                    };
                }
            );
        },
        toPercent(remaining, total) {//剩余寿命百分比转化
            return Math.ceil(remaining / total * 100);
        },
        viewFilter(index) {//点击滤芯列表查看某个滤芯的状态
            this.currentIndex = index;
            this.statusModalVisible = true;
        },
        confirmFilterReset() {//点击“重置剩余时间”按钮
            this.isFilterResetActive = true;
        },
        submitFilterReset() {//点击“确认重置”
            var index = this.currentIndex;
            this.controlDevice(
                "reset_filter",
                [index + 1],
                () => {
                    HdSmart.UI.toast("重置成功");
                    this.isFilterResetActive = false;
                    this.filterItems[index].remaining = this.filterItems[
                        index
                    ].total;
                    console.log("success",this.filterItems[index].total)
                },
                () => {
                    HdSmart.UI.toast("重置失败");
                    console.log('error')
                }
            );
        },
        getAlertList(errors) {
            errors = errors || [];
            //本地缓存处理
            for (var i = 0; i < this.errorStore.length; i++) {
                var item = errors.filter(el => {
                    return el.code == this.errorStore[i];
                });
                if (item.length == 0 || item[0].status == 0) {
                    this.errorStore.splice(i, 1);
                    i--;
                }
            }
            //当前故障
            this.errors = errors.filter(item => {
                if (item.status == 1) {
                    if (this.errorStore.indexOf(item.code) < 0) {
                        this.toggleErrorModal(item.code, true);
                    }
                    return true;
                }
            });
        },
        onDaAlert(errors) {
            var error = errors[0]
            //本地缓存处理
            this.errorStore = this.errorStore.filter(item => {
                return !(item == error.code && error.status == 0);
            })

            //当前故障
            var index = findIndex(this.errors, item => {
                return item.code == error.code;
            });
            if (index >= 0) {
                this.errors.splice(index, 1);
            }
            if (error.status == 1) {
                this.errors.push(error);
                if (this.errorStore.indexOf(error.code) < 0) {
                    this.toggleErrorModal(error.code, true);
                }
            }
        },
        inError(error) {
            return findIndex(this.errors, item => {
                return item.code == error
            }) >= 0
            // return this.errors.indexOf(error) >= 0;
        },
        confirmError(error) {
            if (this.errorStore.indexOf(error) < 0) {
                this.errorStore.push(error);
            }
            this.toggleErrorModal(error, false);
        },
        toggleErrorModal(error, visible) {
            switch (error) {
                case "E3":
                    this.alarmModalVisible = visible;//显示报警模块
                    break;
                default:
                    break;
            }
        },
        viewExpired(item) {//点击查看详情
            this.viewFilter(item.index);
            this.confirmExpired(item);
        },
        confirmExpired(item) {//点击“知道了”
            item.timeoutModalVisible = false;
            this.expiredStore = this.expiredStore.concat(item.index);
        },
        toggleModalVisible(str){//滤芯列表页点击“TDS按钮”展示TDS介绍页面
            this.tdsModalVisible=true;
        }
    },
    created() {
        this.$watch("errorStore", () => {
            localStorage.setItem(
                ERROR_STORE_KEY,
                JSON.stringify(this.errorStore)
            );
        });

        this.$watch("expiredStore", () => {
            localStorage.setItem(
                EXPIRED_STORE_KEY,
                JSON.stringify(this.expiredStore)
            );
        });

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
        HdSmart.onDeviceAlert(data => {
            if(data.method == 'dr_report_dev_alert'){
                this.getAlertList(data.result.attribute.error);
            }else{
                this.onDaAlert(data.result.attribute.error);
            }
        });
    }
};
</script>
