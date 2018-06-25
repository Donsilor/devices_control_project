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

        <div class="pickerContent" v-show="dateModalVisible">
            <div id="dataPicker" title="选择日期" >
                <div class="modal-header">
                    <div class="modal-title">选择日期</div>
                    <div class="modal-close"  @click="close"></div>
                </div>
                <div class="modal-body">
                    <mt-datetime-picker ref="picker2" type="date" v-model="date" :start-date="startDate" :end-date="endDate" :visible-item-count='3' @confirm="handleChange">
                    </mt-datetime-picker>
                    <div class="buttongroup">
                        <div class="cancle" @click="close">取消</div>
                        <div class="sure" @click="handleChange2">确定</div>
                    </div>
                </div>
            </div>
        </div>
        <log-list :current-date="currentDate" :data="list" v-show="!firstLoad" />
        <div class="loadmore" v-if="!isLoading && more">
            <a href="" @click.prevent="loadMore">加载更多</a>
        </div>
        <div class="loadmore" v-if="isLoading && more">
            <a href="">加载中</a>
        </div>
        <div class="nomore" v-if="list.length && !more">已加载完全部</div>
        <a href="javascript:void(0)" class="btn-cale" @click.prevent="showCalendar"></a>
    </div>
</template>

<style lang="less" scoped>
.page-log {
    padding-top: 96px;
}
.topbar {
    background: #f2f2f2;
    height: 95px;
    border-bottom: 1px solid #dbdbdb;
    position: relative;
    .left {
        position: absolute;
        top: 0;
        left: 0;
    }
    .right {
        position: absolute;
        top: 0;
        right: 0;
    }
    .title {
        text-align: center;
        line-height: 95px;
        font-size: 0;
        a {
            font-size: 30px;
            color: #2f3133;
            font-weight: 400;
            margin-left: 20px;
            margin-right: 20px;
            &.active {
                color: #13d5dc;
            }
        }
    }
    .icon {
        width: 100px;
        height: 96px;
        display: inline-block;
        background-repeat: no-repeat;
        background-size: 36px 36px;
        background-position: center center;
    }
    .icon-arrow {
        background-image: url(../../../lib/base/door_lock/assets/icn_topbar_back_normal.png);
        &:active {
            background-image: url(../../../lib/base/door_lock/assets/icn_topbar_back_pressed.png);
            -webkit-tap-highlight-color: transparent;
        }
    }
    .icon-del {
        background-image: url(../../../lib/base/door_lock/assets/icn_topbar_delete_normal.png);
        &:active {
            background-image: url(../../../lib/base/door_lock/assets/icn_topbar_delete_pressed.png);
            -webkit-tap-highlight-color: transparent;
        }
    }
}
.topbar-fixed {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 100;
}
.btn-cale {
    position: fixed;
    right: 60px;
    bottom: 80px;
    width: 96px;
    height: 96px;
    background: url(../../../lib/base/door_lock/assets/btn_calendar_normal.png)
        no-repeat;
    background-size: 100% 100%;
    &:active {
        background-image: url(../../../lib/base/door_lock/assets/btn_calendar_pressed.png);
        -webkit-tap-highlight-color: transparent;
    }
}
.loadmore,
.nomore {
    text-align: center;
    font-size: 24px;
    padding: 30px 0;
}
.loadmore a {
    color: #2f3133;
}
.nomore {
    color: #ccc;
}
/**picker样式整改 start*/
.pickerContent{
    width:100%;
    height: 100%;
    position: fixed;
    top:0;
    left:0;
    background:rgba(0,0,0,0.5);
    z-index: 9;
}
#dataPicker{
    width:600px;
    height: 582px;
    overflow:hidden;
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    border-radius:2px;
    .modal-header {
        top:0;
        left:0;
        z-index: 9999999999;
        height: 84px;
        border-bottom: 1px solid #dbdbdb;
        position: relative;
        background: #fff;
        .modal-close{
            position: absolute;
            top: 0px;
            right: 0px;
            width:84px;
            height: 84px;
            background: url(../../../lib/base/air_cleaner/assets/btn_close.png) no-repeat center center;
            background-size:36px 36px;
        }
    }
    .modal-title {
        font-size: 30px;
        color: #76787a;
        text-align: center;
        line-height: 84px;
    }
    .modal-close {
        position: absolute;
        top: 0px;
        right: 0px;
        width: 84px;
        height: 84px;
        background: url(../../../lib/base/air_cleaner/assets/btn_close.png) no-repeat center center;
        background-size: 36px 36px;
    }
    .mint-popup-bottom{
        position: absolute;
        top:0px;
        left:0;
        right:auto;
        bottom:auto;
        width:100%;
        box-sizing:border-box;
        padding:53px 70px 50px 70px;
        transform: translate(0,0);

    }
    .modal-body{
        position: absolute;
        width:100%;
        height:498px;
        top:84px;
        left:0;
        overflow-y:auto;
        background-color:#fff;
        padding:0;
        box-sizing:border-box;
       .buttongroup{
           position: absolute;
           bottom:50px;
           left:0;
           width:100%;
           height:auto;
           display: flex;
           justify-content: center;
           align-items: center;
           .cancle,.sure{
               width:240px;
               height: 84px;
               line-height:84px;
               text-align: center;
               font-size: 36px;
               border-radius: 6px;
           }
           .cancle{
               color: #76787A;
               border: 1px solid #76787A;
               margin-right:24px;
               box-sizing:border-box;
           }
           .sure{
                background: #13D5DC;
                color:#fff;
           }
       }
    }
}
/**picker样式整改 end*/
</style>

<script>
import Vue from "vue";
import LogList from "./LogList";
// import DatetimePicker from './DatePicker'
import { Popup, Picker, DatetimePicker } from "mint-ui";
import "mint-ui/lib/style.css";

import { WARN_CODE, OPEN_TYPE } from "./const";
import _ from "./utils";

Vue.component(DatetimePicker.name, DatetimePicker);
Vue.component(Popup.name, Popup);
Vue.component(Picker.name, Picker);

function fillz(num) {
    num = "" + num;
    return num.length == 1 ? "0" + num : num;
}

function getDateStr(date) {
    return (
        date.getFullYear() + fillz(1 + date.getMonth()) + fillz(date.getDate())
    );
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
            dateModalVisible:false,//日历modal显示控制
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
            this.dateModalVisible = true;
            this.$refs.picker2.open();
        },
        close(){//关闭日历空间
            this.dateModalVisible = false;
        },
        handleChange(value) {
            this.getLogData(undefined, this.type);
        },
        handleChange2() {
            this.$refs.picker2.confirm();
            // this.$refs.picker2.confirm.call(this.$refs.picker2, this.$refs.picker2.currentValue);
            this.dateModalVisible = false;
        },
        // loadMore() {
        //     this.getLogData(true);
        // },
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
                        // timestamp: Math.floor(+new Date() / 1000),
                        params: {
                            device_id: this.device_id,
                            family_id: this.family_id,
                            date_start: getDateStr(this.date),
                            date_end: getDateStr(this.date),
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
                            date: getDateStr(this.date),
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
                        // data.result.list.forEach(item => {
                        //     if(item.report_msg){
                        //         item.attribute = item.report_msg
                        //     }
                        // });
                        // var list = data.result.list.filter((item) => {
                        //     return item.attribute && item.attribute.switch == 'on' && item.attribute.is_user_operate == 1
                        // })
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
                // if (list.length && !more) {
                //     HdSmart.UI.toast("已加载全部");
                //     return;
                // }
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
    },
    destroyed() {
        window.removeEventListener("scroll", this.loadMore);
    }
};
</script>
