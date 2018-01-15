<template>
    <div class="wrap" :class="{visible:is_ready}">
        <div class="bg"></div>
        <div class="box left" ref="leftBox">
            <div class="clothes" :style="{width:width}">
                <div class="folding"></div>
            </div>
        </div>

        <div class="box right" ref="rightBox">
            <div class="clothes" :style="{width:width}">
                <div class="folding"></div>
            </div>
            <!-- 做校准用 -->
            <div class="clothes test" :style="{width:w1}"></div>
        </div>
    </div>
</template>
<style scoped lang="less">
    .wrap {
        width: 622px;
        height: 400px;
        position: relative;
        visibility: hidden;
    }

    .wrap.visible {
        visibility: visible;
    }

    .bg {
        background: url('../assets/img_curtain_view@2x.png') center center no-repeat;
        width: 591px;
        height: 376px;
        background-size: 100% 100%;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate3d(-50%, 0, 0);
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

    .box {
        width: 310px;
        height: 400px;
        position: absolute;
    }

    .clothes {
        background: url('../assets/img_curtain_clothes@2x.png') center center no-repeat;
        width: 100%;
        height: 100%;
        background-size: 100% 100%;
    }

    .folding {
        background: url('../assets/img_curtain_folding@2x.png') center center no-repeat;
        width: 100%;
        height: 100%;
        background-size: 100% 100%;
        // position: absolute;
        // top: 0;
    }
    .left > div{
        left: 0;
    }
    .right > div{
        right: 0;
        float: right;
    }
    .test{
        height: 1px;
        background: none;
    }
</style>
<script>
    export default {
        props: {
            open_percentage: Number,
            is_ready: Boolean,
            test: Number
        },
        computed: {
            width (){
                return (100 - 0.8 * this.open_percentage) + '%'
            },
            w1 (){
                return (100 - 0.8 * this.test) + '%'
            }
        }
    }
</script>
