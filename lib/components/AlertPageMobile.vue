<template>
    <div class="content" :class="className">
        <div class="title">
            <div class="backButton" @click="()=>{this.$router.go(-1)}"></div>
            <div class="title_detail">{{title}}</div>
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

<style lang="less" scoped>
    .content{
        position: fixed;
        left: 0;
        top: 0;
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
        localStorageName:'',
        queryInfo:{
            type: Array,
            default: []
        },//返回的告警信息
    },
    data() {
        return {
            visible: this.value,
        };
    },
    watch: {
        value(val) {
            this.visible = val;
        },
        visible(val) {
           
        }
    },
    methods: {
        closeItem(itemClicked){
            this.$emit('closeItem',itemClicked)
        },
        dealString(str){//处理换行的规则
            str = str.replace(/；/g, ';')
            str = str.replace(/\n/g, '')
            str = str.split(';')
            return str;
        }
    },
    mounted() {

    },
};
</script>
