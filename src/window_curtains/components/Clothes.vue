<template>
    <div class="box" :style="{transform:'scale3d('+percent+',1,1)'}">
        <div class="clothes"></div>
        <div class="folding" :style="{opacity: opacity}"></div>
    </div>
</template>
<style scoped lang="less">
    .box {
        height: 480px;
        position: absolute;
        width: 588px;
        transition:transform 1.0s linear;
    }

    .clothes {
        background: url('../assets/img_curtain_clothes.png') center center no-repeat;
        width: 100%;
        height: 100%;
        background-size: 100% 100%;
    }

    .folding {
        background: url('../assets/img_curtain_folding.png') center center no-repeat;
        width: 100%;
        height: 100%;
        background-size: 100% 100%;
        position: absolute;
        top: 0;
        transition:opacity 1.0s linear;
    }
</style>
<script>
    export default {
        props: {
            close_percentage: Number
        },
        data (){
            return {
                percent: 0.2 + 0.8 * this.close_percentage / 100,
                opacity: 1 - 0.9 * this.close_percentage / 100
            }
        },
        watch: {
            close_percentage (){
                this.percent = 0.2 + 0.8 * this.close_percentage / 100;
                this.opacity = 1 - 0.9 * this.close_percentage / 100;
            }
        }
    }
</script>