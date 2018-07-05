<template>
    <div id="app">
        <div class="wapper">
            <div class="contentWapper">
                <textarea id="content" placeholder="请输入反馈内容"></textarea>
                <div class="tips">内容超过200字</div>
                <div class="emptyButton">清空</div>
            </div>
            <div class="picGroup">
                <div class="picAll">
                    <div class="picOne" v-for="item in imgsrc" :key="item.name">
                        <img :src="item"/>
                        <p @click="cutImg(item)"></p>
                    </div>
                </div>
                <div class="addButton">
                    <input type="file"  @change="getFile" ref="file" id="file">
                </div>
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
        border:1px solid red;
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
            padding-left:48px;
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
            height: 240px;
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
       
    }
    @media screen and (min-width: 768px) {
        #app{
            width:100%;
            height: 100%;
            overflow-y:auto;
            box-sizing: border-box;
            border:1px solid red;
            padding-top:96px;
            background-color: #F2F2F2;
        }
        .wapper{
            width:100%;
            height: 100%;
            overflow: hidden;
            #content{
                margin-top: 24px;
                width:100%;
                height: 210px;
                border:none;
                box-sizing: border-box;
                padding:48px;
                font-size: 30px;
                font-family: NotoSansHans-Regular;
                position: relative;
                &::-webkit-input-placeholder{
                    color: #CACACA;
                    color:red;
                }
                &:focus{
                    outline: none;
                }
            }
        
        }
    }
</style>
<script>
export default {
    name: "app",
    components: {
        
    },
    data() {
        return {
            imgsrc:[]
        };
    },
    watch: {
        
    },
    computed: {
        
    },
    mounted() {
       
    },
    methods: {
       getFile:function(e){
           if(this.imgsrc.length>=5){
               alert('最多可添加5张图片')
               return
           }
            console.log(999,e.target.files[0])
            let _this = this
            var files = e.target.files[0]
            if (!e || !window.FileReader){
                return  // 看支持不支持FileReader
            } 
            let reader = new FileReader()
            reader.readAsDataURL(files) // 这里是最关键的一步，转换就在这里
            reader.onloadend = function () {
                 _this.imgsrc.push(this.result)
            }
            console.log( _this.imgsrc)
       }
    }
};
</script>


