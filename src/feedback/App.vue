<template>
    <div id="app">
        <div class="wapper">
            <div class="contentWapper">
                <textarea  @input="dealContent" ref="content" id="content" placeholder="请输入反馈内容" maxlength="200"></textarea>
                <div class="tips" v-show="overLength">内容超过200字</div>
                <div class="emptyButton" v-show="emptyTipsShow" @click="emptyContent">清空</div>
            </div>
            <div class="picGroup">
                <div class="picAll">
                    <div class="picOne" v-for="item in imgsrc" :key="item.name">
                        <img :src="item"/>
                        <p @click="cutImg(item)"></p>
                    </div>
                </div>
                <div class="addButton">
                    <input type="file"  @change="getFile" ref="file" id="file"  accept="image/*">
                    <span @click="chooseImage">调用APP图片接口</span>
                </div>
                <!-- capture="camera" -->
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
    #app{
        width:100%;
        height: 100%;
        overflow-y:auto;
        box-sizing: border-box;
        padding-top:96px;
        background-color: #F2F2F2;
    }
    .contentWapper{
        width:100%;
        height: auto;
        position: relative;
        .tips{
            font-family: NotoSansHans-Regular;
            font-size: 30px;
            color: #DA3F3F;
            box-sizing: border-box;
            padding-left:32px;
            height: 30px;
            line-height: 30px;
        }
        .emptyButton{
            font-family: NotoSansHans-Regular;
            font-size: 30px;
            color: #DA3F3F;
            position: absolute;
            top:208px;
            right:32px;
        }
    }
    .wapper{
        width:100%;
        height: 100%;
        overflow: hidden;
        #content{
            margin: 32px 0 0 0;
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
            .picAll,.addButton{
                float:left;
            }
            .picAll{
                width:auto;
                height: auto;
                .picOne{
                    width:120px;
                    height: 120px;
                    overflow: hidden;
                    position: relative;
                    margin-right: 19px;
                    float:left;
                    margin-top:32px;
                    img{
                        display: block;
                        width:100%;
                        height: 100%;

                    }
                }
            }
            .addButton{
                margin-top:32px;
                width:120px;
                height:120px;
                background:url('../../lib/base/feedback/assets/add_phone.png') no-repeat center;
                background-size:100% 100%;
                input{
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
            padding-top:88px;
        }
        .contentWapper{
            width:100%;
            height: auto;
            position: relative;
            .tips{
                font-family: NotoSansHans-Regular;
                font-size: 30px;
                color: #DA3F3F;
                box-sizing: border-box;
                padding-left:48px;
                height: 30px;
                line-height: 30px;
            }
            .emptyButton{
                font-family: NotoSansHans-Regular;
                font-size: 30px;
                color: #DA3F3F;
                position: absolute;
                top:174px;
                right:48px;
            }
        }
        .wapper{
            width:100%;
            height: 100%;
            overflow: hidden;
            #content{
                margin-top: 24px;
                min-height: 210px;
                padding:48px;
                font-size: 30px;
            }
            .picGroup{
                padding-left:48px;
                .picAll{
                    .picOne{
                        width:180px;
                        height: 180px;
                        margin-right: 24px;
                        margin-top:40px;
                    }
                }
                .addButton{
                    margin-top:40px;
                    width:180px;
                    height:180px;
                    background:url('../../lib/base/feedback/assets/add_pad.png') no-repeat center;
                    background-size:100% 100%;
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
        };
    },
    watch: {

    },
    computed: {

    },
    mounted() {

        HdSmart.ready(() => {

            HdSmart.Util.getAppInfo((res) => {
                alert(JSON.stringify(res))
            })

            HdSmart.UI.setNavigationBarLeft({
                text: '取消'
            })

            HdSmart.UI.setNavigationBarTitle({
                text: '用户反馈'
            })

            HdSmart.UI.setNavigationBarRight({
                text: '提交',
                color: '#cccccc',
                onClick: function() {
                    alert('我点击了提交按钮')
                }
            })

        })

        axios({
            method: 'post',
            url: 'http://beeossdev.egtest.cn:7777/api/index.php/feedback/add',
            data: {
                "uname": "13691666741",
                "title": "用户反馈",
                "terminal_name": "Zac's iPhone",
                "terminal_type": "iPhone iOS",
                "client_version": "1.0.2",
                "app_version": "10.3.3",
                "content": "内容用户反馈详细内容",
                "img_list": [
                    "aww",
                    "bss",
                    "cxx"
                ],
                "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vYmVlb3NzZGV2LmVndGVzdC5jbi50ZXN0L2F1dGgvbG9naW4iLCJpYXQiOjE1MzAxNzIyNjIsImV4cCI6MTUzMTM4MTg2MiwibmJmIjoxNTMwMTcyMjYyLCJqdGkiOiJkaUxzOFM3MmVZT01tUVFmIiwic3ViIjoxLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.wf54QUO2cN5XukRjYnxdlDlgeqBABr4LdD1Svse3lTw"
            }
        }).then(function(x){
            console.log(8888888,x)
        });
    },
    methods: {
        chooseImage() {
            HdSmart.UI.chooseImage({}, (res) => {
                alert(JSON.stringify(res))
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
       getFile(e){
           if(this.imgsrc.length>=5){
               alert('最多可添加5张图片')
               return
           }
            console.log(999,e.target.files[0])
            let _this = this;
            if (!e || !window.FileReader){
                return  // 看支持不支持FileReader
            }
            var files = e.target.files[0];
            var fileSize=(files.size/1024/1024).toFixed(2);//将文件大小转换为MB，并保留两位小数
            //对文件大小进行检查
            if(fileSize>5){
                alert("文件大小超过了5MB")
                return
            }
            let reader = new FileReader();
            reader.readAsDataURL(files) // 这里是最关键的一步，转换就在这里
            reader.onloadend = function () {
                 _this.imgsrc.push(this.result)
            }
            console.log( _this.imgsrc)
       }
    }
};
</script>


