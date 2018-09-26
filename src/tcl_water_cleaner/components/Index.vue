<template>
    <div id="app" :class="{warn:level>=4}">

        <template v-if="success">

            <div class="page-on" :style="inPage('index')">

                <div class="water_wave ww1"></div>
                <div class="water_wave ww2"></div>
                <div class="water_wave ww3"></div>
                <icon class="redact-white" />
                <div class="name">{{device_name}} </div>

                <div class="wash" :class="{washing:washing}">
                    <a href="#" @click.prevent="setClean">
                        <i></i>一键冲洗</a>
                    <div class="progress"></div>
                </div>

                <div class="record_panle" v-if="hasTDS" @click="tdsModalVisible = true">
                    <div class="circle">
                        <span v-for="i in 4" :key="i" :class="'c'+i" v-show="i==(level>4?4:level)"></span>
                    </div>
                    <div class="arrow" :style="{transform:'rotate('+ rotate +'deg)'}"></div>
                    <div class="value">{{nowTDS}}</div>
                    <div class="pic">TDS</div>
                    <div class="valueset" @click.stop="">
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

                <div class="tip">
                    <!--
                    <p v-if="inError('E3')">
                        <span @click="toggleErrorModal('E3', true)">漏水</span>
                    </p>
                    <p v-else-if="inError('E1')">
                        <span>缺水</span>
                    </p>
                    <p v-else>{{statusTip}}</p>-->
                    <p>{{statusTip}}</p>
                </div>

                <a class="view" href="" @click.prevent="currentPage='list'" v-if="hasTDS">
                    <span v-if="expired_num > 0">{{expired_num}}个滤芯已过期，点击查看详情</span>
                    <span v-else-if="expiring_num > 0">{{expiring_num}}个滤芯将到期，点击查看详情</span>
                    <span v-else>查看滤芯寿命</span>
                </a>

                <filter-items v-if="!hasTDS" :items="filterItems" :view-filter="viewFilter" />
                <!-- 告警按钮-->
                <div class="alertButton" v-if="alertModel.length>0" @click = "goAlertpage('water_cleaner_error')">
                    <div class="outer">
                        <div class="inner"> 
                            <img src="../../../lib/components/assets/btn_airouter_alarm_white.png" />
                            <p class="errorCount" v-show="alertModel.length>=2">{{alertModel.length}}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="page-sec" :style="inPage('list')" v-if="hasTDS">
                <div class="topbar">
                    <div class="left">
                        <a href="" class="arrow" @click.prevent="currentPage='index'"></a>
                    </div>
                    <div class="title">滤芯详情</div>
                </div>
                <filter-items :items="filterItems" :view-filter="viewFilter" />
            </div>

        </template>

        <div class="page-nodata" v-if="!success">
            <icon />
            <div class="name">{{device_name}}</div>
            <div class="pic1"></div>
        </div>

        <modal title="TDS简介" class="modal-w" v-model="tdsModalVisible">
            <div class="tds">
                <p>
                    对日常自来水而言，TDS是较为常用且有效的水质指标，可以反映出净水器的实际效果， 数值越低代表过滤效果越好。但对于含有致病菌、悬浮物等有害物质的水源，TDS并不适用。
                </p>
                <img src="../../../lib/base/water_cleaner/assets/waterpurifier_img_tdsppm@2x.png" />
            </div>
        </modal>

        <modal v-for="item in expiredFilter" :key="item" title="净水器滤芯到期" v-model="item.timeoutModalVisible" :showCloseBtn="false" :overlayClickable="false">
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

        <!--
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
        -->
        <modal title="滤芯状态" class="modal-w" v-model="statusModalVisible">
            <div class="lx_status">
                <div class="p1">滤芯{{currentFilter.index+1}}</div>
                <div class="p2">{{getName(currentFilter.index)}} </div>
                <circle-pie class="pie" :value="toPercent(currentFilter.remaining, currentFilter.total)">
                    <p class="p3">预计剩余寿命</p>
                    <p class="p4">{{currentFilter.remaining | toDays}}天</p>
                    <p class="p5">剩余{{toPercent(currentFilter.remaining, currentFilter.total)}}%</p>
                </circle-pie>
                <div class="btn">
                    <div class="btn-block" :class="{active:isFilterResetActive}">
                        <a href="" class="reset" @click.prevent="confirmFilterReset">重置剩余时间</a>
                        <a href="" class="reset_submit" @click.prevent="submitFilterReset">确定重置</a>
                    </div>
                </div>

                <div class="msg">更换滤芯后请重置剩余时间</div>
            </div>
        </modal>

    </div>
</template>


<script>
import Modal from "../../../lib/components/Modal.vue";
import CirclePie from "./CirclePie.vue";
import FilterItems from "./FilterItems.vue";
import Icon from "../../../lib/components/SettingIcon.vue";
import { WARN_CODE } from "./consts";

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
        Icon
    },
    data() {
        return {
            device_name: "",
            tdsModalVisible: false,
            timeoutModalVisible: false,
            alarmModalVisible: false,
            statusModalVisible: false,
            model: {},
            hasTDS: false,
            oldTDS: "",
            nowTDS: "",
            currentPage: "index",
            currentIndex: -1,
            filterItems: [],
            washing: false,
            isFilterResetActive: false,
            errors: [],
            errorStore: JSON.parse(localStorage.getItem(ERROR_STORE_KEY)) || [],
            expiredStore: JSON.parse(localStorage.getItem(EXPIRED_STORE_KEY)) || [],
            success: true,
            alertModel:[],//告警信息存放数组
        };
    },
    computed: {
        level() {
            for (var i = TDS_VALUE.length - 1; i >= 0; i--) {
                if (this.nowTDS > TDS_VALUE[i]) {
                    return i + 1;
                }
            }
            return 1;
        },
        rotate() {
            var level = this.level;
            if (level == 5) {
                return TDS_ANGLE[4];
            }
            return getRotate(this.nowTDS, level - 1, level);
        },
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
            if (this.currentIndex == -1) return {};
            return this.filterItems[this.currentIndex];
        },
        expiredFilter() {
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
        statusModalVisible(val) {
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
        }
    },
    methods: {
        goAlertpage(localStorageName){
            console.log(7777,this.$router)
            //要传入给页面的alert信息
            this.$store.commit('showAlertpage',{queryInfo:this.alertModel,localStorageName:localStorageName})
            this.$router.push({path: '/Alertpage'})
        },
        getName(index) {
            return ["PP棉", "前置活性炭", "RO", "后置活性炭"][index];
        },
        inPage(page) {
            return {
                visibility: this.currentPage == page ? "" : "hidden"
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
                    this.success = false;
                    HdSmart.UI.hideLoading();
                }
            );
        },
        onSuccess(result) {
            this.success = true;
            var attrs = result.attribute;

            this.model = attrs;

            // this.getAlertList(attrs.error);
            this.getAlertListErr(attrs.error);//主动获取,得到的是一个数组
             this.onDaAlertErr(result);//上报，//Todo

            var tds = attrs.water_filter_result.TDS;
            if (tds && tds[0] != 65535) {
                this.hasTDS = true;
                this.oldTDS = tds[0];
                this.nowTDS = tds[1];
            } else {
                this.hasTDS = false;
            }

            this.filterItems = this.model.filter_time_remaining.map((el, index) => {
                if (el > 0 && this.expiredStore.indexOf(index) >= 0) {
                    this.expiredStore.splice(this.expiredStore.indexOf(index), 1);
                }
                var total = this.model.filter_time_total[index];
                return {
                    remaining: el,
                    total: total,
                    index: index
                };
            });
        },
        toPercent(remaining, total) {
            return Math.ceil(remaining / total * 100);
        },
        viewFilter(index) {
            this.currentIndex = index;
            this.statusModalVisible = true;
        },
        confirmFilterReset() {
            this.isFilterResetActive = true;
        },
        submitFilterReset() {
            var index = this.currentIndex;
            this.controlDevice(
                "reset_filter",
                [index + 1],
                () => {
                    HdSmart.UI.toast("重置成功");
                    this.isFilterResetActive = false;
                    this.filterItems[index].remaining = this.filterItems[index].total;
                },
                () => {
                    HdSmart.UI.toast("重置失败");
                }
            );
        },
        // getAlertList(errors) {
        //     errors = errors || [];
        //     //本地缓存处理
        //     for (var i = 0; i < this.errorStore.length; i++) {
        //         var item = errors.filter(el => {
        //             return el.code == this.errorStore[i];
        //         });
        //         if (item.length == 0 || item[0].status == 0) {//删除告警已经解除了的项
        //             this.errorStore.splice(i, 1);
        //             i--;
        //         }
        //     }
        //     //当前故障
        //     this.errors = errors.filter(item => {
        //         if (item.status == 1) {
        //             if (this.errorStore.indexOf(item.code) < 0) {//内存中不存在这个错误
        //                 this.toggleErrorModal(item.code, true);
        //             }
        //             return true;
        //         }
        //     });
        // },
        // onDaAlert(err) {//错误是单条上报的
        //     var error = errors[0];
        //     //本地缓存处理
        //     this.errorStore = this.errorStore.filter(item => {//删除告警已经解除（statis=0）的告警信息
        //         return !(item == error.code && error.status == 0);
        //     });

        //     //当前故障
        //     var index = findIndex(this.errors, item => {
        //         return item.code == error.code;
        //     });
        //     if (index >= 0) {
        //         this.errors.splice(index, 1);
        //     }
        //     if (error.status == 1) {
        //         this.errors.push(error);
        //         if (this.errorStore.indexOf(error.code) < 0) {
        //             this.toggleErrorModal(error.code, true);
        //         }
        //     }
        // },
        // inError(error) {
        //     return (
        //         findIndex(this.errors, item => {
        //             return item.code == error;
        //         }) >= 0
        //     );
        //     // return this.errors.indexOf(error) >= 0;
        // },
        // confirmError(error) {
        //     if (this.errorStore.indexOf(error) < 0) {
        //         this.errorStore.push(error);
        //     }
        //     this.toggleErrorModal(error, false);
        // },
        // toggleErrorModal(error, visible) {
        //     switch (error) {
        //         case "E3":
        //             this.alarmModalVisible = visible;
        //             break;
        //         default:
        //             break;
        //     }
        // },
        viewExpired(item) {
            this.viewFilter(item.index);
            this.confirmExpired(item);
        },
        confirmExpired(item) {
            item.timeoutModalVisible = false;
            this.expiredStore = this.expiredStore.concat(item.index);
        },
        onDaAlertErr(err){
            // err={
            //     "family_id": 1,
            //     "device_id": 111222233333,
            //     "device_uuid":"112233445566778810",
            //     "device_category_id": 'xxx',
            //     "code":"BIT0",
            //     "level": 1,
            //     "status":1,    // 0：告警消除，1：新告警，2：自动恢复告警，3：手工恢复，4：忽略
            //     "updated_at": 1498047283,
            // }
            // debugger
            if(err){
                let store = window.localStorage;
                // let errorsStorage = [];
                if(this.errorStore){//本地已经有存储
                    // errorsStorage =  JSON.parse(store.getItem('ERROR_STORE_KEY'));//得到本地缓存
                    this.storageDeal(err,this.errorStore)//对这一项（err）进行处理，内存中值保存status为1的告警信息，返回新的内存信息
                    store.setItem(ERROR_STORE_KEY,JSON.stringify(this.errorStore))//设置新的告警信息
                }else{//本地缓存为空
                    if(parseInt(err.status,10)===1){
                        console.log(222,WARN_CODE[item.code])
                        console.log(222,WARN_CODE[item.code].msg)
                        this.errorStore.push({
                            msg: WARN_CODE[err.code].msg,
                            text:WARN_CODE[err.code].text,
                            code: err.code,
                            key: 1,
                            clicked: false,
                            status: err.status
                        })
                    }else{
                        return
                    }     
                    store.setItem(ERROR_STORE_KEY,JSON.stringify(this.errorStore))//设置新的告警信息
                     console.log(9999999999,JSON.parse(window.localStorage.getItem(ERROR_STORE_KEY)))  
                }
                this.alertModel = this.errorStore.filter((item,index)=>{
                    // console.log(index,item.clicked)
                    return item.clicked === false
                });
                console.log("this.alertModel32222",this.alertModel)
            }
        },
        getAlertListErr(errors){
            // var errors = errors;
            // errors=[{
            //     "family_id": 1,
            //     "device_id": 111222233333,
            //     "device_uuid":"112233445566778810",
            //     "device_category_id": 'xxx',
            //     "code":"BIT2",
            //     "level": 1,
            //     "status":1,    // 0：告警消除，1：新告警，2：自动恢复告警，3：手工恢复，4：忽略
            //     "updated_at": 1498047283,
            // }]
        // debugger;
            if(errors && errors.length>0){
                let store = window.localStorage;
                // let errorsStorage = [];
                if(this.errorStore){//本地已经有存储
                    // errorsStorage =  JSON.parse(store.getItem(ERROR_STORE_KEY));//得到本地缓存
                    errors.forEach((item,index)=>{
                        this.storageDeal(item,this.errorStore)//对这一项（item）进行处理，内存中值保存status为1的告警信息，返回新的内存信息
                    })
                    store.setItem(ERROR_STORE_KEY,JSON.stringify(this.errorStore))//设置新的告警信息
                }else{//本地缓存为空
                    errors.forEach((item,index)=>{
                        if(parseInt(item.status,10)===1){
                            this.errorStore.push({
                                msg: WARN_CODE[item.code].msg,
                                text:WARN_CODE[item.code].text,
                                code: item.code,
                                key: 1,
                                clicked: false,
                                status: item.status
                            })
                        }else{
                            return
                        }     
                    })    
                    store.setItem(ERROR_STORE_KEY,JSON.stringify(this.errorStore))//设置新的告警信息
                }
                console.log(99999,JSON.parse(window.localStorage.getItem(ERROR_STORE_KEY)))
                this.alertModel = this.errorStore.filter((item,index)=>{
                    return item.clicked === false
                });
                console.log("this.alertModel11111",this.alertModel)
            }
        },
        storageDeal(item,errorsStorage){//用来判断内存中(errorsStorage)是否存在某个error(item)的方法
            let isHave = false;//标记内存中是否存在这个告警
            for(let i=0;i<errorsStorage.length;i++){
                if(item.code ==errorsStorage[i].code){
                    isHave = true;
                    break;
                }else{
                    isHave = false;
                }
            }
            console.log("isHave",isHave)
            if(isHave){//已经存在这个错误，并且已经保存在内存中
                if(parseInt(item.status,10)===1){//告警没有解除，再次触发,但clicked状态若是true的要变为false
                    errorsStorage.forEach((err,i)=>{
                        console.log(err,"这一项还存在内存中，但是被关闭过提醒！")
                        if(item.code == err.code){//说明这一项曾经告警过，切被关闭了提醒，要再次变成false
                           err.clicked = false;
                        }
                    })
                }else if(parseInt(item.status,10)===0){//0：告警消除，把他从内存里面删除
                    console.log(item,"这个告警解除了！")
                    errorsStorage.forEach((err,i)=>{
                        console.log(i,err)
                        if(item.code == err.code){//说明这个告警已经解除，将其从localstorage里删除
                            errorsStorage.splice(i,1)
                        }
                    })
                }
            }else{//没有存在这个告警，如果是1存在内存中吗，0则退出
                if(parseInt(item.status,10)===1){//新增的告警，添加到内存中
                    console.log(111,WARN_CODE)
                    console.log(WARN_CODE[item.code])
                    console.log(WARN_CODE[item.code].msg)
                    errorsStorage.push({
                        msg: WARN_CODE[item.code].msg,
                        text:WARN_CODE[item.code].text,
                        code: item.code,
                        key: 1,
                        switch: WARN_CODE[item.code].switch,
                        clicked: false,
                        status: item.status
                    })
                }else if(parseInt(item.status,10)===0){//0：告警消除，把他从里面删除
                    console.log(item,"这个告警没有存在过")
                    return
                }
                
            }
            return errorsStorage
        },
    },
    created() {
        this.$watch("errorStore", () => {
            localStorage.setItem(ERROR_STORE_KEY, JSON.stringify(this.errorStore));
        });

        this.$watch("expiredStore", () => {
            localStorage.setItem(EXPIRED_STORE_KEY, JSON.stringify(this.expiredStore));
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
            console.log("data88888",data)
            // if (data.method == "dr_report_dev_alert") {//设备状态变化后主动上报
            //     this.getAlertList(data.result.attribute.error);
            // } else {
            //     this.onDaAlert(data.result.attribute.error);//上报
            // }
            this.onDaAlertErr(data.result);//上报
        });
    },
    mounted() {
        this.alertModel = this.errorStore.filter((item,index)=>{
            return item.clicked === false
        });
    },
};
</script>
