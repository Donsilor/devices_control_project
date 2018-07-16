<template>
    <div id="app">
        <div class="wapper">
            <div class="contentWapper">
                <textarea  @input="dealContent" ref="content" id="content" placeholder="输入反馈内容" maxlength="200"></textarea>
                <div class="emptyButton" v-show="emptyTipsShow" @click="emptyContent">清空</div>
            </div>
            <div class="tips" v-show="overLength">内容超过200字</div>
            <div class="concactWay">
                <input ref="contact" id="contact" type="text" placeholder="输入联系方式，便于我们与你联系" maxlength="30"/>
            </div>
            <div class="picGroup">  
                <div class="picOne" v-for="(item,index) in imgsrc" :key="item.name">
                    <img :src="'data:image/png;base64,'+item"/>
                    <a @click="cutImg(index)"></a>
                </div>
                <a class="addButton" v-show="imgsrc.length<5">
                    <!--<input type="file"  @change="getFile" ref="file" id="file"  accept="image/*">-->
                    <span @click="chooseImage">调用APP图片接口</span>
                </a>
            </div>
            <div class="picTips">最多上传5张照片，每张照片不超过5MB</div>
        </div>
    </div>
</template>
<style lang='less'>
    *{
        padding:0;
        margin: 0;
    }
    html,body{
        width:100%;
        height: 100%;
    }
    a{
        text-decoration : none;
        -webkit-tap-highlight-color:rgba(0,0,0,0);
    }
    #app{
        width:100%;
        height: 100%;
        overflow-y:auto;
        box-sizing: border-box;
        padding-top:0px;
        background-color: #F2F2F2;
    }
    .contentWapper{
        width:100%;
        height: 240px;
        padding:0;
        overflow: hidden;
        position: relative;
         margin: 32px 0 0 0;
        .emptyButton{
            font-family: NotoSansHans-Regular;
            font-size: 30px;
            color: #DA3F3F;
            position: absolute;
            top:190px;
            right:32px;
        }
    }
    .tips{
            font-family: NotoSansHans-Regular;
            font-size: 30px;
            color: #DA3F3F;
            box-sizing: border-box;
            padding-left:32px;
            height: 30px;
            line-height: 30px;
            margin-top:21px;
        }
    .concactWay{
        width:100%;
        height: 120px;
        line-height: 120px;
        font-size:32px;
        box-sizing:border-box;
        margin-top:32px;
        
        input{
            width:100%;
            height: 100%;
            border:none;
            box-sizing:border-box;
            padding:0 32px;
            font-size:32px;
            &::-webkit-input-placeholder{
                color:#c8cacc;  
            }
            &:focus{
                outline: none;
            }
        }
    }
    .wapper{
        width:100%;
        height: 100%;
        overflow: hidden;
        #content{
            width:100%;
            min-height: 240px;
            height: auto;
            overflow-y: auto;
            border:none;
            box-sizing: border-box;
            padding:32px;
            font-family:PingFangSC-Regular;
            font-size:32px;
            position: relative;
            &::-webkit-input-placeholder{
                color: #CACACA;
            }
            &:focus{
                outline: none;
            }
        }
        .picGroup{
            width:100%;
            height: auto;
            overflow: hidden;
            box-sizing: border-box;
            padding-left:32px;
            .addButton{
                display: block;
                float:left;
            }
            .picOne{
                width:120px;
                height: 120px;
                overflow: hidden;
                position: relative;
                margin-right: 19px;
                float:left;
                margin-top:40px;
                img{
                    display: block;
                    width:100%;
                    height: 100%;
                    object-fit: cover;
                }
                a{
                    width:30px;
                    height:30px;
                    display: block;
                    position:absolute;
                    top:5px;
                    right:3px;
                    border-radius:50%;
                    // background:rgba(0,0,0,0.8);
                    background: url('../../lib/base/feedback/assets/btn_input_delete_normal@2x.png') no-repeat center;
                    color:white;
                    background-size:100% 100%;
                    &:active{
                        background: url('../../lib/base/feedback/assets/btn_input_delete_pressed@2x.png') no-repeat center;
                        background-size:100% 100%;
                    }
                }
            }
            .addButton{
                display: block;
                margin-top:40px;
                width:120px;
                height:120px;
                background:url('../../lib/base/feedback/assets/add_phone.png') no-repeat center;
                background-size:100% 100%;
                &:active{
                    background:url('../../lib/base/feedback/assets/btn_add_pressed@2x.png') no-repeat center;
                    background-size:100% 100%;
                }
                span{
                    display: block;
                    opacity: 0;
                    width:100%;
                    height: 100%;
                    // visibility: hidden;
                }
            }
        }
        .picTips{
            font-family:PingFangSC-Regular;
            font-size:28px;
            color:#c8cacc;
            margin-top:20px;
            padding-left:32px;
            box-sizing: border-box;
        }

    }
    @media screen and (min-width: 768px) {
        #app{
            padding-top:0px;
        }
        .contentWapper{
            width:100%;
            height: 210px;
            position: relative;
            margin-top: 24px;
            .emptyButton{
                font-family: NotoSansHans-Regular;
                font-size: 30px;
                color: #DA3F3F;
                position: absolute;
                top:156px;
                right:48px;
            }
        }
        .tips{
            font-family: NotoSansHans-Regular;
            font-size: 30px;
            color: #DA3F3F;
            box-sizing: border-box;
            padding-left:48px;
            height: 30px;
            line-height: 30px;
            margin-top:21px;
        }
        .concactWay{
            width:100%;
            height: 120px;
            line-height: 120px;
            font-size:30px;
            box-sizing:border-box;
            margin-top:32px;
            input{
                width:100%;
                height: 100%;
                border:none;
                box-sizing:border-box;
                padding:0 48px;
                font-size:30px;
                &::-webkit-input-placeholder{
                    color:#c8cacc;  
                }
                &:focus{
                    outline: none;
                }
            }
        }
        .wapper{
            width:100%;
            height: 100%;
            overflow: hidden;
            #content{
                min-height: 210px;
                padding:48px;
                font-size: 30px;
            }
            .picGroup{
                padding-left:48px;
                .picOne{
                    width:180px;
                    height: 180px;
                    margin-right: 24px;
                    margin-top:40px;
                    a{
                        width:35px;
                        height: 35px;
                    }
                }
                .addButton{
                    margin-top:40px;
                    width:180px;
                    height:180px;
                    background:url('../../lib/base/feedback/assets/add_pad.png') no-repeat center;
                    background-size:100% 100%;
                    &:active{
                        background:url('../../lib/base/feedback/assets/btn_add_presse.png') no-repeat center;
                        background-size:100% 100%;
                    }
                }
            }
            .picTips{
                font-size:28px;
                color:#c8cacc;
                margin-top:24px;
                padding-left:30px;
                box-sizing: border-box;
            }

        }


    }
</style>
<script>
import axios from 'axios';
export default {
    name: "app",
    components: {

    },
    data() {
        return {
            imgsrc:[],//图片上传列表
            emptyTipsShow:false,
            overLength:false,
            params:{
                "uname": "",
                "title":"",
                "terminal_name": "",
                "terminal_type": "",
                "client_version": "",
                "app_version": "",
                "content": "",//内容用户反馈详细内容
                "contact":"",//联系方式
                "img_list": [],
                "token":''
            }
        };
    },
    watch: {

    },
    computed: {

    },
    mounted() {
        
        document.title=this.getQueryValue('title') ? decodeURI(this.getQueryValue('title')) : '用户反馈';
        this.params.title = document.title;
        HdSmart.ready(() => {
            var that=this;
            HdSmart.Util.getAppInfo((res) => {
                console.log('appInfo',res)
                this.params.uname = res.uname;
                this.params.terminal_name = res.terminal_name;
                this.params.terminal_type = res.terminal_type;
                this.params.client_version=res.client_version;
                this.params.app_version=res.app_version;
                this.params.token = res.token;
            })

            HdSmart.UI.setNavigationBarLeft({
                text: '取消',
                icon:''
            })
            // HdSmart.UI.setNavigationBarTitle({
            //     text: '用户反馈'
            // })
            HdSmart.UI.setNavigationBarRight({
                text: '提交',
                color: '#13d5dc',
                onClick: function() {
                    if(!that.$refs.content.value){
                        HdSmart.UI.toast('反馈内容不能为空',1000);
                        return;
                    }
                    HdSmart.UI.showLoading();
                    that.params.content = that.$refs.content.value;
                    that.params.contact = that.$refs.contact.value;
                    axios({
                        method: 'post',
                        url: 'http://dev-hpcore.egtest.cn:18088/api/feedback/add',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data:JSON.stringify(that.params),
                    }).then(function(data){
                        HdSmart.UI.hideLoading();
                        if(data.data.code === 0){
                            HdSmart.UI.toast('提交成功',1000)
                            setTimeout(()=>{
                                HdSmart.UI.popWindow(); 
                            },1500)
                        }else{
                           HdSmart.UI.toast(data.data.message,2000) 
                        }
                       
                    });
                }
            })
        })
    },
    methods: {
        chooseImage() {
            var that=this;
            var countNow=this.imgsrc.length;// 剩余的可提交图片
            HdSmart.UI.chooseImage({count:5-countNow}, (res) => {
                var fileArry;
                if(res.code == 0){
                    var formData = new FormData()
                    var dataGetIos=res.imgData;
                    
                    for(var i=0;i<dataGetIos.length;i++){
                        var blob=that.convertBase64UrlToBlob('data:image/png;base64,'+dataGetIos[i])
                        var files=new File([blob], "oss_load"+i+".png",{type:blob.type});
                        that.imgsrc.push(dataGetIos[i]);
                        formData.append('files['+i+']',files)
                    }
                    formData.append('token',that.params.token)
                    //将从手机获得的图片上传到云端,并取得obj
                    axios({
                        method: 'post',
                        url: 'http://dev-hpcore.egtest.cn:18088/api/ossUpload',
                        data:formData
                    }).then(function(data){
                        var results=data.data.result;
                        for(var i=0;i<results.length;i++){
                            that.params.img_list.push(results[i].object)//将返回的object返回给img_list
                        }
                    });
                }else{
                    HdSmart.UI.toast('照片添加失败')
                }
            })
        },
        dealContent(e){
           if(e.target.value.length>=1){
               this.emptyTipsShow=true;
           }else{
               this.emptyTipsShow=false;
           }
           if(e.target.value.length>=200){
                this.overLength=true;
           }

        },
        emptyContent(){
            this.$refs.content.value='';
            this.emptyTipsShow=false;
            this.overLength=false;
        },
        cutImg(index){
           this.imgsrc.splice(index,1);
           this.params.img_list.splice(index,1);
        },
        convertBase64UrlToBlob(urlData){  //将以base64的图片url数据转换为Blob  
            var bytes=window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte  
            //处理异常,将ascii码小于0的转换为大于0  
            var ab = new ArrayBuffer(bytes.length);  
            var ia = new Uint8Array(ab);  
            for (var i = 0; i < bytes.length; i++) {  
                ia[i] = bytes.charCodeAt(i);  
            }  

            return new Blob( [ab] , {type : 'image/png'});  
        },
        getQueryValue(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)",'i');
            var res = window.location.search.substr(1).match(reg);
            if(res && res[2]){
            return res[2];
            }else{
                return null;
            }
        }
    },
        
};
</script>


 