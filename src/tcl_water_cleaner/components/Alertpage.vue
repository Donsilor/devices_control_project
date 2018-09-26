<template>
    <alert-page :title="title" :queryInfo="queryInfo" v-on:closeItem="closeItem"></alert-page>
</template>

<script>
import Vue from "vue";
import AlertPage from '../../../lib/components/AlertPage'
export default {
    components: {
       AlertPage,
    },
    data() {
        return {
            title:'智能门锁告警',
            queryInfo:[],
            localStorageName:''
        };
    },
    watch: {
        
    },
    methods: {
        closeItem(itemClicked){
            // let code = itemClicked.code;
            // if (code == "e4") {
            //     HdSmart.Device.control({//APP主动消除故障命令
            //         method: "dm_set",
            //         nodeid: "doorlock.main.error",
            //         params: {
            //             attribute: {
            //                 error: [
            //                     {
            //                         code: "e4",
            //                         status: itemClicked.status
            //                     }
            //                 ]
            //             }
            //         }
            //     });
            // }
            let store = window.localStorage;
            let errorsStorage =  JSON.parse(store.getItem(this.localStorageName)) || [];
            errorsStorage.forEach((item,index)=>{//点击了某一条
                if(item.code === itemClicked.code){
                    item.clicked = true;//已经被点击
                    return
                }
            })
            store.setItem(this.localStorageName,JSON.stringify(errorsStorage))//更新告警信息
            this.queryInfo = errorsStorage.filter((item,index)=>{
                return item.clicked === false
            })
        }
    },
    created() {
        this.queryInfo = this.$store.state.errStore.queryInfo || []//返回的告警信息
        this.localStorageName = this.$store.state.errStore.localStorageName//告警的localStorage字段名
        console.log(99999,this.title,this.queryInfo,this.localStorageName)
    },
    mounted() {
       
    },
    destroyed() {
        
    }
};
</script>
