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
                    <div class="picOne" v-for="(item,index) in imgsrc" :key="item.name">
                        <img :src="'data:image/png;base64,'+item"/>
                        <p @click="cutImg(index)">x</p>
                    </div>
                </div>
                <div class="addButton" v-show="imgsrc.length<5">
                    <!-- <input type="file"  @change="getFile" ref="file" id="file"  accept="image/*">-->
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
                    p{
                        width:30px;
                        height:30px;
                        position:absolute;
                        top:3px;
                        right:3px;
                        border-radius:50%;
                        background:rgba(0,0,0,0.8);
                        color:white;
                        font-size:14px;
                        text-align:center;
                        line-height:30px;
                    }
                }
            }
            .addButton{
                margin-top:32px;
                width:120px;
                height:120px;
                background:url('../../lib/base/feedback/assets/add_phone.png') no-repeat center;
                background-size:100% 100%;
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
            params:{
                "uname": "",
                "title": "用户反馈",
                "terminal_name": "",
                "terminal_type": "",
                "client_version": "",
                "app_version": "",
                "content": "",//内容用户反馈详细内容
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
        // var that=this;
        // axios({
        //                 method: 'post',
        //                 url: 'http://dev-hpcore.egtest.cn:18088/api/feedback/add',
        //                 data: that.params
        //             }).then(function(data){
        //                 console.log(8888888,data)
        //             });
        HdSmart.ready(() => {
            var that=this;
            console.log(9999,this)
            HdSmart.Util.getAppInfo((res) => {
                console.log('appInfo',res)
                // alert(JSON.stringify(res)) 
                this.params.uname = res.uname;
                this.params.terminal_name = res.terminal_name;
                this.params.terminal_type = res.terminal_type;
                this.params.client_version=res.client_version;
                this.params.app_version=res.app_version;
                this.params.token = res.token;
                console.log("参数",this.params)

            })

            HdSmart.UI.setNavigationBarLeft({
                text: '取消'
            })

            HdSmart.UI.setNavigationBarTitle({
                text: '用户反馈'
            })
            console.log('that.params',that.params)
            HdSmart.UI.setNavigationBarRight({
                text: '提交',
                color: '#cccccc',
                onClick: function() {
                    console.log('我点击了提交按钮')
                    console.log(JSON.stringify(that.params))
                    axios({
                        method: 'post',
                        url: 'http://dev-hpcore.egtest.cn:18088/api/feedback/add',
                        data: JSON.stringify(that.params)
                    }).then(function(data){
                        console.log(888999,JSON.stringify(that.params))
                        console.log(8888888,data)
                    });
                }
            })

        })

        
    },
    methods: {
        chooseImage() {
            var that=this;
            var countNow=this.params.img_list.length;

            console.log(23333,5-countNow)
            HdSmart.UI.chooseImage({count:5-countNow}, (res) => {
                // console.log(JSON.stringify(res))
                console.log("res",res)
                
                if(res.code == 0){
                    var dataGet=res.localIds;
                    console.log(123,dataGet.length)
                    for(var i=0;i<dataGet.length;i++){
                        that.params.img_list.push(dataGet[i]);
                        that.imgsrc.push(dataGet[i]);
                    }
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
           
           console.log('cutindex',index)
           this.imgsrc.splice(index,1);
           console.log('this.imgSrc',this.imgsrc)
           this.params.img_list.splice(index,1);
           console.log("lllllllllll",this.params.img_list)
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
            console.log('files',files)
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


