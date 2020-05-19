<template>
   <!-- 告警按钮-->
    <div class="alertButton" v-if="alertModel.length>0" @click = "goAlertpage">
        <div class="outer">
            <div class="inner"> 
                <img src="./assets/btn_airouter_alarm_red.png" />
                <p class="errorCount" v-show="alertModel.length>=2">{{alertModel.length}}</p>
            </div>
        </div>
        
    </div>
</template>
<style lang="less">
    /* 告警图标样式和动画*/
    .alertButton{
        position:fixed;
        top:258px;
        right:30px;
        width:156px;
        height: 156px;
        display:flex;
        justify-content: center;
        align-items: center;
        .outer{
            width:96px;
            height: 96px;
            display:flex;
            justify-content: center;
            align-items: center;
            border-radius:50%;
            position: relative;
            z-index:1;
            border-radius: 50%;
            animation-duration: 1s;
            animation-timing-function: ease-out;
            animation-iteration-count: infinite;
            animation-fill-mode: forwards;
            animation-name: outer;
            // opacity: 0.25;
            // background: #F26161;
            background:rgba(242,97,97,0.25);
            .inner{
                width:96px;
                height: 96px;
                position: relative;
                img{
                    width:100%;
                    height: 100%;
                    display: block;
                }
            }
            .errorCount{
                position:absolute;
                top:-10px;
                right:-10px;
                width:30px;
                height: 30px;
                box-sizing: border-box;
                border-radius:50%;
                color:#fff;
                line-height: 26px;
                text-align: center;
                background: #F26161;
                border: 2px solid #FFFFFF;
                z-index: 3;
                font-size:20px;
            }
            &::before,
            &::after {
                content: "";
                box-sizing: border-box;
                display: block;
                position: absolute;
                top:50%;
                left:50%;
                transform: translate(-50%,-50%);
                border-radius: 50%;
                animation-duration: 1s;
                animation-timing-function: ease-out;
                animation-iteration-count: infinite;
                animation-fill-mode: forwards;
            }
            &::before {
                z-index:-2;
                height: 116px;
                width: 116px;
                animation-name: upstep-first;
                opacity: 0.15;
                background: #F26161;
            }
            &::after {
                z-index: -4;
                height: 136px;
                width: 136px;
                opacity: 0.05;
                background: #F26161;
                animation-name: upstep-second;
            }
        }
        @keyframes outer {
            0% {
            width: 96px;
            height: 96px;
            }
            50% {
            width: 116px;
            height: 116px;
            }
            100% {
                width: 96px;
                height: 96px;
            }
        }
        @keyframes upstep-first {
            0%{
                width: 116px;
                height: 116px;
            }
            50% {
                width: 136px;
                height: 136px;
            }
            100%{
                width: 116px;
                height: 116px;
            }
        }
        @keyframes upstep-second {
            0%{
                width: 136px;
                height: 136px;
            }
            50% {
            width: 156px;
            height: 156px;
            }
            100%{
                width: 136px;
                height: 136px;
            }
        }

    }

</style>
<script>
export default {
    props: {
       alertModel:{
           type:Array,
           default:[]
       }
    },
    data() {
        return {
            
        };
    },
    watch: {
      
    },
    methods: {
       goAlertpage(){
           this.$emit("goAlertpage")
       }
    },
    mounted() {
  
    },
};
</script>

