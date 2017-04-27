<template>
    <div class="wrap">
        <div class="bg" :style="{transform:'translate3d(-50%,-'+translateX+'px,0)',opacity:opacity}"></div>
        <clothes class="left" :close_percent="close_percent"></clothes>
        <clothes class="right" :close_percent="close_percent"></clothes>
    </div>
</template>
<style scoped lang="scss">
    .wrap {
        width: 1182px;
        height: 480px;
        position: relative;
    }

    .bg {
        background: url('../assets/img_curtain_view.png') center center no-repeat;
        width:954px;
        height:348px;
        background-size: 100% 100%;
        position: absolute;
        bottom: 0;
        left:50%;
        transform: translate3d(-50%,0,0);
    }

    .left {
        position: absolute;
        left: 0;
        top: 0;
        transform-origin: 0 0;
    }

    .right {
        position: absolute;
        right: 0;
        top: 0;
        transform-origin: 100% 0;
    }
</style>
<script>
    export default {
        props: {
            close_percent: Number
        },
        data (){
            return {
                translateX: 30 - 30 * this.close_percent / 100,
                opacity: 1 - 0.7 * this.close_percent / 100
            }
        },
        watch: {
            close_percent (){
                this.translateX = 30 - 30 * this.close_percent / 100;
                this.opacity = 1 - 0.7 * this.close_percent / 100;
            }
        }
    }
</script>