<!-- 暂不开发 -->
<template>
<div class="statusbar" v-show="visible">
    <i></i> 正在播放 摔跤吧！爸爸！ 00:00:000/00:00:00
</div> 
</template>

<style lang="less">
    .statusbar{ 
        height: 84px;
        line-height: 84px;
        background: rgba(0,0,0,.6);
        color:#13d5dc;
        text-align: center;
        i{  
            background: url(../assets/icn_playing_blue_s.png) no-repeat;
            display: inline-block;
            width: 36px;
            height: 36px;
            background-size: 100% 100%;
            vertical-align: middle;
            margin-top: -4px;
        }
    }
</style>

<script>
    export default {    
        data() {    
            return {    
                visible: false
            }
        },
        mounted() {
            
        }
    }
</script>