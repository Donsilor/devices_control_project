<template>
    <div id="app" :class="{warn:level>=4}">

        <template v-if="success">

        <div class="page-on" :style="inPage('index')" v-if="hasTDS">
            <div class="mainTitle">
                <div class="name">{{device_name}}</div>
                <div class="tip">
                    <p v-if="inError('E3')">
                        <span @click="toggleErrorModal('E3', true)">漏水</span>
                    </p>
                    <p v-else-if="inError('E1')">
                        <span>缺水</span>
                    </p>
                    <p v-else>{{statusTip}}</p>
                </div>
            </div>

            <div class="wash" :class="{washing:washing}">
                <a href="#" @click.prevent="setClean">一键冲洗</a>
                <div class="progress"></div>
            </div>

            <div class="record_panle" v-if="hasTDS" @click="tdsModalVisibleControl">

                <div class="value">{{nowTDS}}</div>
                <div class="pic" :class="{'pic_100':nowTDS>=100}">TDS</div>

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
        </div>
        <!-- 没有TDS的机器的样式 -->
        <div class="hasNotTDs" v-if="!hasTDS" :style="inPage('index')">
            <div class="mainTitle">
                <div class="name">{{device_name}}</div>
                <div class="tip">
                    <p v-if="inError('E3')">
                        <span @click="toggleErrorModal('E3', true)">漏水</span>
                    </p>
                    <p v-else-if="inError('E1')">
                        <span>缺水</span>
                    </p>
                    <p v-else>{{statusTip}}</p>
                </div>
            </div>
            <div class="wash" :class="{washing:washing}">
                <a href="#" @click.prevent="setClean">一键冲洗</a>
                <div class="progress"></div>
            </div>
            <filter-items :items="filterItems" :view-filter="viewFilter" :hasTDS="hasTDS" :toggle-modal-visible="toggleModalVisible" />
        </div>
        <div class="page-sec" :style="inPage('list')" v-if="hasTDS">
            <div class="topbar">
                <div class="left">
                    <a href="" class="arrow" @click.prevent="currentPage='index'"></a>
                </div>
                <div class="title">滤芯寿命</div>
            </div>
            <filter-items :items="filterItems" :view-filter="viewFilter" :nowTDS="nowTDS" :level="level" :hasTDS="hasTDS" v-model="tdsModalVisible" :toggle-modal-visible="toggleModalVisible" />
        </div>

        </template>

        <div class="page-nodata" v-if="!success">
            <div class="mainTitle">
                <div class="name">{{device_name}}</div>
            </div>
            <div class="pic1"></div>
        </div>

        <sub-page title="TDS简介" class="modal-w" v-model="tdsModalVisible">
            <div class="tds">
                <p class="tds_text">
                    对日常自来水而言，TDS是较为常用且有效的水质指标，可以反映出净水器的实际效果， 数值越低代表过滤效果越好。但对于含有致病菌、悬浮物等有害物质的水源，TDS并不适用。
                </p>
                <img src="../../lib/base/water_cleaner/assets/waterpurifier_img_tdsppm@2x.png" />
            </div>
        </sub-page>

        <modal v-for="item in expiredFilter" :key="item.index" title="净水器滤芯到期" v-model="item.timeoutModalVisible" :showCloseBtn="false" :overlayClickable="false">
            <div class="alarm">
                <div class="alert">
                    <i></i>“净水器”的滤芯{{item.index+1}}已到期</div>
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
                <div class="alert">
                    <i></i>检测到净水器漏水！</div>
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
                    <p class="p4">{{currentFilter.remaining | toDays}}<span>天</span></p>
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

<script>
import Modal from "../../lib/components/Modal";
import CirclePie from "./components/CirclePie.vue";
import FilterItems from "./components/FilterItems.vue";
import SubPage from "./components/SubPage.vue";

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
            tdsModalVisible: false, //是否显示“TDS简介”
            timeoutModalVisible: false, //是否显示滤芯过期弹窗
            alarmModalVisible: false, //是否展示报警弹窗
            statusModalVisible: false, //滤芯状态Subpage蒙层
            model: {},
            hasTDS: true,
            oldTDS: "",
            nowTDS: "",
            currentPage: "index",
            currentIndex: -1,
            filterItems: [],
            washing: false,
            isFilterResetActive: false,
            errors: [],
            errorStore: JSON.parse(localStorage.getItem(ERROR_STORE_KEY)) || [],
            expiredStore:
                JSON.parse(localStorage.getItem(EXPIRED_STORE_KEY)) || [],
            success: true
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
        currentFilter() {
            //当前正在查看状态的某个滤芯的状态
            if (this.currentIndex == -1) return {};
            return this.filterItems[this.currentIndex];
        },
        expiredFilter() {
            //净水器滤芯到期
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
        statusTip() {
            //净水器状态
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
        tdsModalVisible(val) {
            if (this.currentPage == "index") {
                HdSmart.UI.toggleHeadAndFoot(!val);
            }
        },
        statusModalVisible(val) {
            if (!val) {
                this.isFilterResetActive = false;
            }
            if (this.currentPage == "index") {
                HdSmart.UI.toggleHeadAndFoot(!val);
            }
        }
    },
    methods: {
        tdsModalVisibleControl() {
            //点击TDS按钮
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
        setClean() {
            //一键冲洗
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
                    HdSmart.UI.hideLoading();
                },
                () => {
                    this.success = false
                    HdSmart.UI.hideLoading();
                }
            );
        },
        onSuccess(result) {

            this.success = true
            var attrs = result.attribute;

            this.model = attrs;

            this.getAlertList(attrs.error);

            var tds = attrs.water_filter_result.TDS;

            if (tds && tds[0] != 65535) {
                this.hasTDS = true; //Todo
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
        toPercent(remaining, total) {
            //剩余寿命百分比转化
            return Math.ceil(remaining / total * 100);
        },
        viewFilter(index) {
            //点击滤芯列表查看某个滤芯的状态
            this.currentIndex = index;
            this.statusModalVisible = true;
        },
        confirmFilterReset() {
            //点击“重置剩余时间”按钮
            this.isFilterResetActive = true;
        },
        submitFilterReset() {
            //点击“确认重置”
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
                    console.log("success", this.filterItems[index].total);
                },
                () => {
                    HdSmart.UI.toast("重置失败");
                    console.log("error");
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
            var error = errors[0];
            //本地缓存处理
            this.errorStore = this.errorStore.filter(item => {
                return !(item == error.code && error.status == 0);
            });

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
            return (
                findIndex(this.errors, item => {
                    return item.code == error;
                }) >= 0
            );
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
                    this.alarmModalVisible = visible; //显示报警模块
                    break;
                default:
                    break;
            }
        },
        viewExpired(item) {
            //点击查看详情
            this.viewFilter(item.index);
            this.confirmExpired(item);
        },
        confirmExpired(item) {
            //点击“知道了”
            item.timeoutModalVisible = false;
            this.expiredStore = this.expiredStore.concat(item.index);
        },
        toggleModalVisible(str) {
            //滤芯列表页点击“TDS按钮”展示TDS介绍页面
            this.tdsModalVisible = true;
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
            if (data.method == "dr_report_dev_alert") {
                this.getAlertList(data.result.attribute.error);
            } else {
                this.onDaAlert(data.result.attribute.error);
            }
        });
    }
};
</script>
