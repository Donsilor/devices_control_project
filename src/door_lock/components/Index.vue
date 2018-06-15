<template>
    <div class="page-index">

        <div class="name">{{device_name}}</div>
        <div class="lock-status">
            <span class="status" :class="{red:lockedStatus,on:model.switch=='on'}">{{statusText}}</span>
            <span class="battery" :class="{low:lowBattery}">{{model.battery_percentage}}%电量</span>
        </div>
        <div class="lock" :class="[model.switch]"></div>

        <a href="#" class="btn-unlock" :class="{disabled:btnDisabled}" @click.prevent="showPwdInput">开锁</a>

        <router-link :to="{name:'log',query:{device_id:device_id,family_id:family_id, category_id: device_category_id}}" class="btn-golog"></router-link>

        <div class="alert-wraper">
            <div class="alert" :class="{warn:item.key}" v-for="(item,index) in theUnclickAlert" :key="index" v-if="index==0">
                <i></i>{{item.msg}}
                <a class="close" href="javascript:void(0)" @click="closeAlert(item)"></a>
            </div>
        </div>
        <password-input :visible="passwordInputVisible" v-on:close-dialog="passwordInputVisible=false" />

    </div>
</template>

<style lang="less" scoped>
* {
    -webkit-tap-highlight-color: transparent;
}
.page-index {
    padding-top: 96px;
    background: #f2f2f2;
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
}
.name {
    font-size: 30px;
    color: #808080;
    text-align: center;
    margin: 60px auto 6px;
    height: 40px;
}
.lock-status {
    text-align: center;
    font-size: 0;
    .status {
        font-size: 30px;
        margin-right: 12px;
        color: #c8cacc;
        &.red {
            color: #f26161;
        }
        &.on {
            color: #46bcff;
        }
    }
    .battery {
        font-size: 30px;
        color: #c8cacc;
        margin-left: 12px;
        &.low {
            color: #f26161;
        }
    }
}
.lock {
    width: 504px;
    height: 504px;
    margin: 24px auto 0;
    background: url(../../../lib/base/door_lock/assets/img_lock_locked.png)
        no-repeat;
    background-size: 504px;
    text-align: center;
    &.on {
        background-image: url(../../../lib/base/door_lock/assets/img_lock_unlocked.png);
    }
    .pic {
        width: 96px;
        height: 96px;
        background: url(../../../lib/base/door_lock/assets/icn_lock_locked.png)
            no-repeat;
        background-size: 96px;
        margin: 132px auto 60px;
        display: inline-block;
        &.on {
            background-image: url(../../../lib/base/door_lock/assets/icn_lock_unlocked.png);
        }
    }
}
.btn-unlock {
    background: #46bcff;
    width: 144px;
    height: 144px;
    border-radius: 100%;
    margin: 24px auto 0;
    display: block;
    text-align: center;
    line-height: 144px;
    color: #ffffff;
    font-size: 36px;
    &.disabled {
        background: #ffffff;
        color: #c8cacc;
    }
}
.btn-golog {
    position: fixed;
    display: inline-block;
    right: 60px;
    top: 132px;
    width: 96px;
    height: 96px;
    background: url(../../../lib/base/door_lock/assets/btn_record_normal1.png)
        no-repeat;
    background-size: 100% 100%;
    &:active {
        background-image: url(../../../lib/base/door_lock/assets/btn_record_pressed.png);
    }
}
.alert-wraper {
    position: fixed;
    left: 0;
    width: 100%;
    top: 96px;
    .alert {
        background: rgba(51, 51, 51, 0.75);
        width: 100%;
        height: 84px;
        line-height: 84px;
        text-align: center;
        color: #fff;
        font-size: 30px;
        margin-bottom: 4px;
        i {
            display: inline-block;
            width: 34px;
            height: 34px;
            background: url(../../../lib/base/door_lock/assets/icn_notice_white_s.png)
                no-repeat;
            background-size: 34px;
            margin-right: 13px;
            vertical-align: text-bottom;
        }
        .close {
            float: right;
            display: inline-block;
            width: 30px;
            height: 30px;
            background: url(../../../lib/base/door_lock/assets/btn_close_white_normal.png)
                no-repeat;
            background-size: 30px;
            margin-top: 27px;
            margin-right: 26px;
            &:active {
                background-image: url(../../../lib/base/door_lock/assets/btn_close_pressed.png);
            }
        }
        &.warn {
            background: rgba(242, 97, 97, 0.9);
        }
    }
}
</style>

<script>
import PasswordInput from "./PasswordInput.vue";
import { WARN_CODE } from "./const";
/**
 *  {0, "e0", "not fully locked"}, // 未锁好
    {1, "e3", "tamper alarm: "},   // 防拆
    {2, "e4", "hijacked"},         // 挟持
    {3, "e2", "wrong code entry limit"}, // 密码试探
    {4, "e1", "battery low power"},      // 低电量
    {5, "e5", "dead locked"},            // 锁死
    {6, "e6", "dead bolt on"},      //反锁
    {7, "e7", "remote open disabled"} //禁止远程开锁
 */
//switch理解为disabled

let ERROR_STORE_KEY = "";
let isInit = false;

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
        PasswordInput
    },
    data() {
        return {
            hasSnapShot: false,
            device_name: "",
            device_id: "",
            family_id: "",
            passwordInputVisible: false,
            alertModel: [],
            model: {
                switch: "off",
                battery_percentage: "--"
            },
            errorStore: [],
            device_category_id: ""
        };
    },
    computed: {
        lowBattery() {
            return this.model.battery_percentage <= 15;
        },
        btnDisabled() {
            let status = this.model.switch == "on" ? true : false;
            this.alertModel.forEach(function(v, i) {
                status = v.switch || status;
            });
            return status;
        },
        theUnclickAlert() {
            var hasE5 = findIndex(this.alertModel, item => {
                return item.code == "e5";
            });
            var result = this.alertModel.filter(item => {
                if (item.clicked) {
                    return false;
                }
                if (item.code == "e6") {
                    return false;
                }
                if (item.code == "e2" && hasE5 >= 0) {
                    return false;
                }
                return true;
            });
            return result.reverse();
        },
        lockedStatus() {
            var hasE6 = findIndex(this.alertModel, item => {
                return item.code == "e6";
            });
            return hasE6 >= 0;
        },
        statusText() {
            if (this.lockedStatus) {
                return "已反锁";
            }
            if (this.model.switch == "on") {
                return "已打开";
            }
            return "已关闭";
        }
    },
    watch: {
        btnDisabled(val) {
            if (val) {
                this.passwordInputVisible = false;
            }
        }
    },
    methods: {
        showPwdInput() {
            if (this.btnDisabled) {
                return;
            }
            this.passwordInputVisible = true;
        },
        closeAlert(error) {
            let code = error.code;
            if (code == "e4") {
                HdSmart.Device.control({
                    method: "dm_set",
                    nodeid: "doorlock.main.error",
                    params: {
                        attribute: {
                            error: [
                                {
                                    code: "e4",
                                    status: error.status
                                }
                            ]
                        }
                    }
                });
            }
            if (this.errorStore.indexOf(code) < 0) {
                this.errorStore.push(code);
                error.clicked = true;
            }
        },
        onAlarm(attr) {
            let errors = attr.error || [];
            let alertArry = [];
            for (var i = 0; i < this.errorStore.length; i++) {
                var item = errors.filter(el => {
                    return el.code == this.errorStore[i];
                });
                if (item.length == 0 || item[0].status == 0) {
                    this.errorStore.splice(i, 1);
                    i--;
                }
            }

            errors.forEach(el => {
                if (el.status == 1) {
                    alertArry.push({
                        msg: WARN_CODE[el.code].msg,
                        code: el.code,
                        key: 1,
                        switch: WARN_CODE[el.code].switch,
                        clicked: this.errorStore.indexOf(el.code) >= 0,
                        status: el.status
                    });
                }
            });

            this.alertModel = alertArry;
        },
        onAlert(errors) {
            for (var i = 0; i < this.errorStore.length; i++) {
                var item = errors.filter(el => {
                    return el.code == this.errorStore[i] && el.status == 0;
                });
                if (item.length) {
                    this.errorStore.splice(i, 1);
                    i--;
                }
            }
            for (var i = 0; i < errors.length; i++) {
                var el = errors[i];
                var index = findIndex(this.alertModel, item => {
                    return item.code == el.code;
                });
                if (index >= 0) {
                    this.alertModel.splice(index, 1);
                }
                if (el.status == 1) {
                    this.alertModel.push({
                        msg: WARN_CODE[el.code].msg,
                        code: el.code,
                        key: 1,
                        switch: WARN_CODE[el.code].switch,
                        clicked: false,
                        status: el.status
                    });
                }
            }
        },
        onDaAlert(error) {
            var index1 = findIndex(this.errorStore, item => {
                return item == error.code && error.status == 0;
            });
            if (index1 >= 0) {
                this.errorStore.splice(index1, 1);
            }
            //
            var index = findIndex(this.alertModel, item => {
                return item.code == error.code;
            });
            if (index >= 0) {
                this.alertModel.splice(index, 1);
            }
            if (error.status != 0) {
                this.alertModel.push({
                    msg: WARN_CODE[error.code].msg,
                    code: error.code,
                    key: 1,
                    switch: WARN_CODE[error.code].switch,
                    clicked: false,
                    status: error.status
                });
            }
        },
        getSnapShot(cb) {
            HdSmart.Device.getSnapShot(
                data => {
                    this.onSuccess(data);
                },
                () => {
                    HdSmart.UI.hideLoading();
                }
            );
        },
        onSuccess(data) {
            HdSmart.UI.hideLoading();
            if (data.device_id) {
                this.device_id = data.device_id;
            }
            if (data.family_id) {
                this.family_id = data.family_id;
            }
            this.device_category_id = data.device_category_id;
            this.model = data.attribute;
            this.onAlarm(data.attribute);
        },
        onError() {}
    },
    created() {
        // this.$watch('errorStore', () => {
        //     localStorage.setItem(ERROR_STORE_KEY, JSON.stringify(this.errorStore))
        // })
        HdSmart.ready(() => {
            //   ERROR_STORE_KEY = window.device_uuid
            //   this.errorStore = JSON.parse(localStorage.getItem(ERROR_STORE_KEY)) || []
            if (window.device_name) {
                this.device_name = window.device_name;
            }
            HdSmart.UI.showLoading();
            setTimeout(() => {
                this.getSnapShot();
            }, 150);
        });

        // if(!isInit){
        // isInit = true
        HdSmart.onDeviceStateChange(data => {
            this.onSuccess(data.result);
        });
        HdSmart.onDeviceAlert(data => {
            this.onAlert(data.result.attribute.error);
        });
        /*
        HdSmart.onDeviceListen(data => {
            switch (data.method) {
                case "dm_set":
                break;
                case "dr_report_dev_alert":
                    this.onAlert(data.result.attribute.error)
                break;
                case "da_report_dev_alert":
                    this.onDaAlert(data.result.attribute)
                break;
                default:
                    this.onSuccess(data.result);
                break;
            }
        });
        */
        // }
    }
};
</script>
