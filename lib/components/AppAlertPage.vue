<template>
    <div class="content" :class="className">
        <div class="title">
            <div class="backButton" @click="()=>{this.$router.go(-1)}"></div>
            <div class="title_detail">{{haedtTitle}}</div>
        </div>
        <div class="mainList">
            <div class="listOne" v-for="(item,index) in queryInfo">
                <div class="alertTips"><span class="tipImg"></span><span class="tipTitle">{{item.msg}}</span></div>
                <div class="alertDetail">
                    <div class="alertDetail">
                        <p v-for='(i,number) in dealString(item.text)'>
                            {{i}}{{number+1!=dealString(item.text).length?'；':''}}
                        </p>
                    </div>
                </div>
                <div class="closeTips" @click="closeItem(item)">关闭提醒</div>
            </div>
        </div>
    </div>
</template>

<style lang="less">
    html,body{
        width:100%;
        height:100%;
        background: #F2F2F2;
    }
    .content{
        width:100%;
        height:100%;
        background: #F2F2F2;
        overflow-x:hidden;
    }
    .title{
        width:100%;
        height:96px;
        line-height:96px;
        background: #F2F2F2;
        box-shadow: inset 0 -1px 0 0 #DBDBDB;
        position:relative;
        text-align:center;
        font-family: NotoSansHans-Regular;
        font-size: 36px;
        color: #333333;
        .backButton{
            position:absolute;
            width:36px;
            height:36px;
            background:url('./assets/icn_topbar_back_normal@2x.png') center no-repeat;
            background-size:100% 100%;
            top:50%;
            left:24px;
            transform:translate(0,-50%);
        }
    }
    .mainList{
        width:100%;
        height:auto;
        padding:32px 32px 0px 32px;
        .listOne{
            width:686px;
            height:418px;
            background: #FFFFFF;
            box-shadow: 0 0 6px 0 rgba(0,0,0,0.03);
            border-radius: 10px;
            // margin:0px auto;
            box-sizing:border-box;
            padding:32px 32px 0 32px;
            margin-bottom:32px;
            position:relative;
            .alertTips{
                height:60px;
                line-height:60px;
                box-sizing:border-box;
                position:relative;
                margin-bottom:32px;
                font-family: NotoSansHans-Regular;
                font-size: 36px;
                color: #333333;
                text-align:center;
                .tipImg{
                    display:inline-block;
                    vertical-align:top;
                    width:60px;
                    height:100%;
                    background:url('./assets/icn_airouter_alarm.png') center no-repeat;
                    background-size:100% 100%;
                    margin-right:15px;
                }
                .tipTitle{
                    max-width:450px;
                    width:auto;
                    display:inline-block;
                    vertical-align:top;
                }
            }
            .alertDetail{
                font-family: PingFangSC-Regular;
                text-align:left;
                font-size: 28px;
                color: #76787A;
                letter-spacing: 0;
                line-height: 42px;
            }
            .closeTips{
                background: #13D5DC;
                border-radius: 8px;
                width:240px;
                height:84px;
                line-height:84px;
                position:absolute;
                left:50%;
                bottom:36px;
                transform:translate(-50%,0);
                font-family: PingFangSC-Regular;
                font-size: 36px;
                color: #FFFFFF;
                text-align: center;
            }
        }  
    }
</style>

<script>
export default {
    props: {
        title: "",
        value: {
            type: Boolean,
            default: false
        },
        className: "",
        // overlayClickable: {
        //     type: Boolean,
        //     default: true
        // },
        // showCloseBtn: {
        //     type: Boolean,
        //     default: true
        // }
    },
    data() {
        return {
            visible: this.value,
            queryInfo:[],//query返回的告警信息
            errorArray:[],
            localStorageName:this.$route.query.localStorageName,
            haedtTitle:this.$route.query.localStorageName == 'doorlock_errorsStorage'?'智能门锁告警':'净水器告警'
        };
    },
    watch: {
        value(val) {
            this.visible = val;
        },
        visible(val) {
            this.$emit("on-visible-change", val);
        }
    },
    methods: {
        closeItem(itemClicked){
             let code = itemClicked.code;
            if(this.localStorageName === 'doorlock_errorsStorage'){//门锁特殊高警处理
                if (code == "e4") {
                    HdSmart.Device.control({//APP主动消除故障命令
                        method: "dm_set",
                        nodeid: "doorlock.main.error",
                        params: {
                            attribute: {
                                error: [
                                    {
                                        code: "e4",
                                        status: itemClicked.status
                                    }
                                ]
                            }
                        }
                    });
                }
            }
            
            let store = window.localStorage;
            let errorsStorage =  JSON.parse(store.getItem(this.localStorageName)) || [];
            errorsStorage.forEach((item,index)=>{//点击了某一条
                if(item.code === itemClicked.code){
                    item.clicked = true;//已经被点击
                    return
                }
            })
            store.setItem(this.localStorageName,JSON.stringify(errorsStorage))//更新告警信息
            console.log("errorArray",this.errorArray)
            this.queryInfo = errorsStorage.filter((item,index)=>{
                return item.clicked === false
            })
        },
        dealString(str){//处理换行的规则
            console.log(1111,str)
            str = str.replace(/；/g, ';')
            str = str.replace(/\n/g, '')
            str = str.split(';')
            console.log(str)
            return str;
           
        }
    },
    mounted() {
        this.queryInfo = this.$route.query.queryInfo || [],//query返回的告警信息
        this.errorArray = this.queryInfo,
        console.log(888888,this.$route.query.localStorageName)
    },
};
</script>
