<template>
    <div class="page-index">
        <div class="mainTitle">
            <div class="name">{{device_name}}
                <icon />
            </div>
            <div class="lock-status">
                <span class="status" :class="{red:lockedStatus,on:model.switch=='on'}">{{statusText}}</span>
                <span class="battery" :class="{low:lowBattery}">{{model.battery_percentage}}%电量</span>
            </div>
        </div>

        <div class="lock" :class="[model.switch]"></div>

        <a href="#" class="btn-unlock" :class="{disabled:btnDisabled}" @click.prevent="showPwdInput">开锁</a>

        <router-link :to="{name:'log',query:{device_id:device_id,family_id:family_id, category_id: device_category_id}}" class="btn-golog"></router-link>

        <!--
        <div class="alert-wraper">
            <div class="alert" :class="{warn:item.key}" v-for="(item,index) in theUnclickAlert" :key="index" v-if="index==0">
                <i></i>{{item.msg}}
                <a class="close" href="javascript:void(0)" @click="closeAlert(item)"></a>
            </div>
        </div>
        -->
        <password-input :visible="passwordInputVisible" v-on:close-dialog="passwordInputVisible=false" />
        <!-- 告警按钮-->
        <alert-button-mobile :alertModel="alertModel" v-on:goAlertpage = "goAlertpage('doorlock_errorsStorage')"></alert-button-mobile>
    </div>
</template>

<script>
import PasswordInput from "./PasswordInput.vue";
import Icon from "../../../lib/components/SettingIconMobile.vue";
import { WARN_CODE } from "./const";
import AlertButtonMobile from '../../../lib/components/AlertButtonMobile'

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
        PasswordInput,
        Icon,
        AlertButtonMobile
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
            // errorStore: [],
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
        // theUnclickAlert() {
        //     var hasE5 = findIndex(this.alertModel, item => {
        //         return item.code == "e5";
        //     });
        //     var result = this.alertModel.filter(item => {
        //         if (item.clicked) {
        //             return false;
        //         }
        //         if (item.code == "e6") {
        //             return false;
        //         }
        //         if (item.code == "e2" && hasE5 >= 0) {
        //             return false;
        //         }
        //         return true;
        //     });
        //     return result.reverse();
        // },
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
        },
        //JOINT-1195：门锁在线，门锁页面一直显示门锁已打开状态。小概率出现
        "model.switch"(val) {
            clearTimeout(this.switchTimer);
            if (val == "on") {
                this.switchTimer = setTimeout(() => {
                    this.model.switch = "off";
                }, 8000);
            }
        }
    },
    methods: {
        goAlertpage(localStorageName){
           //要传入给页面的alert信息
            this.$store.commit('showAlertpage',{queryInfo:this.alertModel,localStorageName:localStorageName})
            this.$router.push({path: '/AlertPage'})
        },
        showPwdInput() {
            if (this.btnDisabled) {
                return;
            }
            this.passwordInputVisible = true;
        },
        // closeAlert(error) {
        //     let code = error.code;
        //     if (code == "e4") {
        //         HdSmart.Device.control({
        //             method: "dm_set",
        //             nodeid: "doorlock.main.error",
        //             params: {
        //                 attribute: {
        //                     error: [
        //                         {
        //                             code: "e4",
        //                             status: error.status
        //                         }
        //                     ]
        //                 }
        //             }
        //         });
        //     }
        //     if (this.errorStore.indexOf(code) < 0) {
        //         this.errorStore.push(code);
        //         error.clicked = true;
        //     }
        // },
        // onAlarm(attr) {
        //     let errors = attr.error || [];
        //     let alertArry = [];
        //     for (var i = 0; i < this.errorStore.length; i++) {
        //         var item = errors.filter(el => {
        //             return el.code == this.errorStore[i];
        //         });
        //         if (item.length == 0 || item[0].status == 0) {
        //             this.errorStore.splice(i, 1);
        //             i--;
        //         }
        //     }

        //     errors.forEach(el => {
        //         if (el.status == 1) {
        //             alertArry.push({
        //                 msg: WARN_CODE[el.code].msg,
        //                 code: el.code,
        //                 key: 1,
        //                 switch: WARN_CODE[el.code].switch,
        //                 clicked: this.errorStore.indexOf(el.code) >= 0,
        //                 status: el.status
        //             });
        //         }
        //     });

        //     this.alertModel = alertArry;
        // },
        // onAlert(errors) {
        //     for (var i = 0; i < this.errorStore.length; i++) {
        //         var item = errors.filter(el => {
        //             return el.code == this.errorStore[i] && el.status == 0;
        //         });
        //         if (item.length) {
        //             this.errorStore.splice(i, 1);
        //             i--;
        //         }
        //     }
        //     for (var i = 0; i < errors.length; i++) {
        //         var el = errors[i];
        //         var index = findIndex(this.alertModel, item => {
        //             return item.code == el.code;
        //         });
        //         if (index >= 0) {
        //             this.alertModel.splice(index, 1);
        //         }
        //         if (el.status == 1) {
        //             this.alertModel.push({
        //                 msg: WARN_CODE[el.code].msg,
        //                 code: el.code,
        //                 key: 1,
        //                 switch: WARN_CODE[el.code].switch,
        //                 clicked: false,
        //                 status: el.status
        //             });
        //         }
        //     }
        // },
         onAlertError(err){//单个的错误上报
            console.log(222222,err)
            // err={
            //     "family_id": 1,
            //     "device_id": 111222233333,
            //     "device_uuid":"112233445566778810",
            //     "device_category_id": 'xxx',
            //     "code":"e0",
            //     "level": 1,
            //     "status":1,    // 0：告警消除，1：新告警，2：自动恢复告警，3：手工恢复，4：忽略
            //     "updated_at": 1498047283,
            // }
            if(err){
                let store = window.localStorage;
                let errorsStorage = [];
                if(store.getItem('doorlock_errorsStorage')){//本地已经有存储
                    errorsStorage =  JSON.parse(store.getItem('doorlock_errorsStorage'));//得到本地缓存
                    this.storageDeal(err,errorsStorage)//对这一项（err）进行处理，内存中值保存status为1的告警信息，返回新的内存信息
                    store.setItem('doorlock_errorsStorage',JSON.stringify(errorsStorage))//设置新的告警信息
                }else{//本地缓存为空
                    if(parseInt(err.status,10)===1){
                        errorsStorage.push({
                            msg: WARN_CODE[err.code].msg,
                            text:WARN_CODE[err.code].text,
                            code: err.code,
                            key: 1,
                            switch: WARN_CODE[err.code].switch,
                            clicked: false,
                            status: err.status
                        })
                    }else{
                        return
                    }     
                    console.log(9999999999,JSON.parse(window.localStorage.getItem('doorlock_errorsStorage')))  
                    store.setItem('doorlock_errorsStorage',JSON.stringify(errorsStorage))//设置新的告警信息
                }
                this.alertModel = errorsStorage.filter((item,index)=>{
                    return item.clicked === false
                });
                console.log("this.alertModel32222",this.alertModel)
            }
        },
        onAlarmError(attr){//status全为1，设备自动发送告警信息
            let errors = attr.error;//设备上报的错误
            errors=[{
                "family_id": 1,
                "device_id": 111222233333,
                "device_uuid":"112233445566778810",
                "device_category_id": 'xxx',
                "code":"e2",
                "level": 1,
                "status":1,    // 0：告警消除，1：新告警，2：自动恢复告警，3：手工恢复，4：忽略
                "updated_at": 1498047283,
            },{
                "family_id": 1,
                "device_id": 111222233333,
                "device_uuid":"112233445566778810",
                "device_category_id": 'xxx',
                "code":"e4",
                "level": 1,
                "status":1,    // 0：告警消除，1：新告警，2：自动恢复告警，3：手工恢复，4：忽略
                "updated_at": 1498047283,
            }]
            let store = window.localStorage;
            let errorsStorage = [];
            console.log(11112,errors)
            if(errors && errors.length>0){
                if(store.getItem('doorlock_errorsStorage')){//本地已经有存储
                    errorsStorage =  JSON.parse(store.getItem('doorlock_errorsStorage')) || [];//得到本地缓存
                    this.dealErrors(errors,errorsStorage)//只保留尚存的告警，内存里的其他告警一并删除
                    console.log(88888,errorsStorage)
                    errors.forEach((item,index)=>{
                        this.storageDeal(item,errorsStorage)//对这一项（item）进行处理，内存中值保存status为1的告警信息，返回新的内存信息
                    })
                    store.setItem('doorlock_errorsStorage',JSON.stringify(errorsStorage))//设置新的告警信息
                }else{//本地缓存为空
                    errors.forEach((item,index)=>{
                        console.log("empty",index,item)
                        if(parseInt(item.status,10)===1){
                            errorsStorage.push({
                                msg: WARN_CODE[item.code].msg,
                                text:WARN_CODE[item.code].text,
                                code: item.code,
                                key: 1,
                                switch: WARN_CODE[item.code].switch,
                                clicked: false,
                                status: item.status
                            })
                        }else{
                            return
                        }     
                    })    
                    store.setItem('doorlock_errorsStorage',JSON.stringify(errorsStorage))//设置新的告警信息
                }
                console.log(99999,JSON.parse(window.localStorage.getItem('doorlock_errorsStorage')))
                this.alertModel = errorsStorage.filter((item,index)=>{
                    return item.clicked === false
                });
                console.log("this.alertModel11111",this.alertModel)
            }else{//没有告警
                store.setItem('doorlock_errorsStorage',JSON.stringify([]));
                this.alertModel = [];
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
                }else{}
                
            }
            return errorsStorage
        },
        dealErrors(errors,errorsStorage){
            let arr=[];//保存内存和告警相同的项
            for(let i=0;i<errors.length;i++){
                for(let j=0;j<errorsStorage.length;j++){
                    if(errors[i].code === errorsStorage[j].code && errors[i].status == 1 ){//status为0，告警已经解除的也一并删除
                        arr.push(errors[i].code)
                    }
                }
            }
            if(arr && arr.length>0){
                errorsStorage.forEach((item,index)=>{
                    for(let x=0;x<arr.length;x++){
                        if(arr[x] !== item.code){
                            errorsStorage.splice(item,1)
                        }
                    }
                })
            }else{
                errorsStorage = [];
            }
        },
        getSnapShot(cb) {
            HdSmart.Device.getSnapShot(
                data => {
                    this.onSuccess(data);
                    HdSmart.UI.hideLoading();
                },
                () => {
                    HdSmart.UI.hideLoading();
                }
            );
        },
        onSuccess(data) {
            if (data.device_id) {
                this.device_id = data.device_id;
            }
            if (data.family_id) {
                this.family_id = data.family_id;
            }
            this.device_category_id = data.device_category_id;
            this.model = data.attribute;
            // this.onAlarm(data.attribute);
            this.onAlarmError(data.attribute);
        },
        onError() {}
    },
    created() {
        HdSmart.ready(() => {
            if (window.device_name) {
                this.device_name = window.device_name;
            }
            HdSmart.UI.showLoading();
            setTimeout(() => {
                this.getSnapShot();
            }, 150);
        });

        HdSmart.onDeviceStateChange(data => {
            this.onSuccess(data.result);
        });
        HdSmart.onDeviceAlert(data => {
            // this.onAlert(data.result.attribute.error);
            this.onAlertError(data.result);//得到错误信息，单条上报
        });
    },
    mounted(){
        let errorsStorage =  JSON.parse(window.localStorage.getItem('doorlock_errorsStorage')) || [];//得到本地缓存
        this.alertModel = errorsStorage.filter((item,index)=>{
            return item.clicked === false
        });
    }
};
</script>
