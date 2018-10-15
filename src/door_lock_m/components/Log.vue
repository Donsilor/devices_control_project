<template>
    <div class="page-log">
        <!-- 顶部条 -->
        <div class="topbar topbar-fixed">
            <div class="left">
                <router-link to="/" class="icon icon-arrow"></router-link>
            </div>
            <div class="title">
                <a href="javascript:void(0)" :class="{active:type!=='warn'}" @click.prevent="switchLog('open')">开锁记录</a>
                <a href="#" @click.prevent="switchLog('warn')" :class="{active:type=='warn'}">预警记录</a>
            </div>
            <div class="right">
                <a href="" class="icon icon-del" @click.prevent="clearLog"></a>
            </div>
        </div>

        <mt-datetime-picker ref="picker2" type="date" v-model="date" :start-date="startDate" :end-date="endDate" :visible-item-count='3'  @confirm="handleChange">
        </mt-datetime-picker>

        <log-list :current-date="currentDate" :data="list" v-show="!firstLoad" />
        <div class="loadmore" v-if="!isLoading && more">
            <a href="" @click.prevent="loadMore2">加载更多</a>
        </div>
        <div class="loadmore" v-if="isLoading && more">
            <a href="">加载中</a>
        </div>
        <div class="nomore" v-if="!isLoading && list.length && !more">已加载完全部</div>
        <a href="javascript:void(0)" class="btn-cale" @click.prevent="showCalendar"></a>
    </div>
</template>

<script>
import Vue from "vue";
import LogList from "./LogList";
import { Popup,Picker } from "mint-ui";
import DatetimePicker from './DatePicker'
import "mint-ui/lib/style.css";

import { WARN_CODE, OPEN_TYPE } from "./const";
import _ from "./utils";

Vue.component(DatetimePicker.name, DatetimePicker);
Vue.component(Popup.name, Popup);
Vue.component(Picker.name, Picker);

var isDatePicked = false

function fillz(num) {
    num = "" + num;
    return num.length == 1 ? "0" + num : num;
}

function getDateParam(date) {
    if(isDatePicked){
        return date.getFullYear() + fillz(1 + date.getMonth()) + fillz(date.getDate());
    }
    return undefined
}

export default {
    components: {
        LogList,
    },
    data() {
        var now = new Date();
        var query = this.$route.query;

        return {
            device_id: query.device_id,
            family_id: query.family_id,
            device_category_id: parseInt(query.category_id),
            date: now,
            startDate: new Date(
                now.getFullYear() - 1,
                now.getMonth(),
                now.getDate()
            ),
            endDate: now,
            currentDate: now,
            list: [],
            firstLoad: true,
            isLoading: false,
            size: 20,
            begin: 0,
            more: 0,
            type: "open",
        };
    },
    watch: {
        isLoading(val) {
            if (val) {
                HdSmart.UI.showLoading();
            } else {
                HdSmart.UI.hideLoading();
            }
        }
    },
    methods: {
        showCalendar() {
            this.$refs.picker2.open();
        },
        handleChange(value) {
            isDatePicked = true
            this.getLogData(undefined, this.type);
        },
        loadMore2() {
            this.getLogData(true);
        },
        getLogData(more, type) {
            if (!more) {
                this.begin = 0;
                this.more = 0;
            } else {
                this.begin += this.size;
            }

            this.isLoading = true;

            if (type == "warn") {
                HdSmart.Device.control(
                    {
                        method: "da_get_dev_alert_list",
                        params: {
                            device_id: this.device_id,
                            family_id: this.family_id,
                            date_start: getDateParam(this.date),
                            date_end: getDateParam(this.date),
                            status: [1],
                            page: {
                                size: this.size,
                                begin: this.begin
                            }
                        }
                    },
                    data => {
                        this.isLoading = false;
                        this.firstLoad = false;
                        var list = this.formatListData(data.result.list, type);
                        if (!more) {
                            this.list = list;
                        } else {
                            this.list = this.list.concat(list);
                        }
                        this.more = data.result.more;
                        this.currentDate = this.date;
                    },
                    data => {
                        this.isLoading = false;
                        this.currentDate = this.date;
                        if (data && data.code == -15032) {
                            this.firstLoad = false;
                            this.list = [];
                        } else {
                            HdSmart.UI.toast(JSON.stringify(data));
                        }
                    }
                );
            } else {
                HdSmart.Device.control(
                    {
                        method: "dr_get_dev_status_list",
                        params: {
                            device_id: this.device_id,
                            family_id: this.family_id,
                            date: getDateParam(this.date),
                            type: "switch",
                            page: {
                                size: this.size,
                                begin: this.begin
                            }
                        }
                    },
                    data => {
                        this.isLoading = false;
                        this.firstLoad = false;

                        var list = this.formatListData(data.result.list, type);
                        if (!more) {
                            this.list = list;
                        } else {
                            this.list = this.list.concat(list);
                        }
                        this.more = data.result.more;
                        this.currentDate = this.date;
                    },
                    data => {
                        this.isLoading = false;
                        this.currentDate = this.date;
                        if (data && data.code == -15032) {
                            this.firstLoad = false;
                            this.list = [];
                        } else {
                            HdSmart.UI.toast(JSON.stringify(data));
                        }
                    }
                );
            }
        },
        getOpenType(type) {
            return OPEN_TYPE[type];
        },

        formatListData(list, type) {
            if (type == "warn") {
                return list.map(item => {
                    return {
                        log: WARN_CODE[item.code].msg,
                        ...item
                    };
                });
            } else {
                return list.map(item => {
                    return {
                        log: `${
                            item.attribute.user_name
                                ? item.attribute.user_name
                                : item.attribute.user_identify == 255
                                    ? ""
                                    : item.attribute.user_identify
                        } 通过${this.getOpenType(item.attribute.open_type)}`,
                        isOpen: true,
                        ...item
                    };
                });
            }
        },

        switchLog(type) {
            this.type = type;
            this.getLogData(undefined, type);
        },
        loadMore: _.debounce(function() {
            var scrollTop =
                document.documentElement.scrollTop ||
                window.pageYOffset ||
                document.body.scrollTop;
            if (
                scrollTop > 0 &&
                scrollTop + window.innerHeight >=
                    document.documentElement.scrollHeight - 15
            ) {
                if (this.isLoading || this.loadState === "NO_DATA") {
                    return;
                }
                if (list.length && !more) {
                    // HdSmart.UI.toast("已加载全部");
                    return;
                }
                this.getLogData(true, this.type);
            }
        }, 200),
        clearLog() {
            //TODO
            HdSmart.UI.alert(
                {
                    title: "删除日志",
                    message: "是否要删除所有日志？",
                    dialogStyle: 2
                },
                val => {
                    if (this.type == "warn" && val) {
                        HdSmart.Device.control(
                            {
                                method: "da_delete_dev_alert",
                                params: {
                                    device_id: this.device_id,
                                    family_id: this.family_id,
                                    del_time: Math.floor(+new Date() / 1000)
                                }
                            },
                            data => {
                                HdSmart.UI.toast("删除成功");
                                setTimeout(() => {
                                    this.getLogData(undefined, this.type);
                                }, 1000)
                            },
                            data => {
                                HdSmart.UI.toast("删除失败");
                                setTimeout(() => {
                                    this.getLogData(undefined, this.type);
                                }, 1000)
                            }
                        );
                    } else if (val) {
                        HdSmart.Device.control(
                            {
                                method: "dr_delete_dev_status",
                                params: {
                                    device_id: this.device_id,
                                    family_id: this.family_id,
                                    device_category_id:
                                        this.device_category_id || "",
                                    del_time: Math.floor(+new Date() / 1000)
                                }
                            },
                            data => {
                                HdSmart.UI.toast("删除成功");
                                this.getLogData(undefined, this.type);
                            },
                            data => {
                                HdSmart.UI.toast("删除失败");
                                this.getLogData(undefined, this.type);
                            }
                        );
                    }
                }
            );
        }
    },
    created() {},
    mounted() {
        HdSmart.ready(() => {
            setTimeout(() => {
                this.getLogData(undefined, this.type);
            }, 300);
        });
        window.addEventListener("scroll", this.loadMore);
        isDatePicked = false;
    },
    destroyed() {
        window.removeEventListener("scroll", this.loadMore);
    }
};
</script>
