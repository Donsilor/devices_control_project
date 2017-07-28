<template>
    <div class="wrap" :class="{visible:is_ready}">
        <div class="bg"
             :style="{transform:'translate3d(-50%,-'+moveX+'px,0)',opacity:bg_opacity,transitionDuration:time+'ms'}"></div>
        <div class="box left" :style="{transform:'scale3d('+scaleRate+',1,1)',transitionDuration:time+'ms'}"
             ref="leftBox">
            <div class="clothes"></div>
            <div class="folding" :style="{opacity: opacity,transitionDuration:time+'ms'}"></div>
        </div>

        <div class="box right" :style="{transform:'scale3d('+scaleRate+',1,1)',transitionDuration:time+'ms'}">
            <div class="clothes"></div>
            <div class="folding" :style="{opacity: opacity,transitionDuration:time+'ms'}"></div>
        </div>
    </div>
</template>
<style scoped lang="less">
    .wrap {
        width: 1182px;
        height: 468px;
        position: relative;
        visibility: hidden;
    }

    .wrap.visible {
        visibility: visible;
    }

    .bg {
        background: url('../assets/img_curtain_view.png') center center no-repeat;
        width: 954px;
        height: 348px;
        background-size: 100% 100%;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate3d(-50%, 0, 0);
        transition-property: transform, opacity;
        transition-timing-function: linear;
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
        height: 468px;
        position: absolute;
        width: 588px;
        transition-property: transform;
        transition-timing-function: linear;
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
        transition-property: opacity;
        transition-timing-function: linear;
    }
</style>
<script>
    const BGMOVEDISTANCE = 24;
    export default {
        props: {
            open_percentage: Number,
            is_ready: Boolean
        },
        computed: {
            //背景图移动的距离
            moveX (){
                return BGMOVEDISTANCE * this.open_percentage / 100
            },
            //云背景的透明度
            bg_opacity (){
                return 0.7 + 0.3 * this.open_percentage / 100;
            },
            //窗帘缩放的比例
            scaleRate (){
                return 1 - 0.8 * this.open_percentage / 100;
            },
            //窗帘黑色背景图的透明度
            opacity (){
                return 0.1 + 0.9 * this.open_percentage / 100;
            },
            //每次open_percentage变更后，到达指定位置所需的时间

        },
        data (){
            return {
                //左边窗帘的长度
                width: 0,
                //是否第一次渲染，是的话时间为0
                firstRender: true,
//                time: 0
            }
        },
        mounted (){
            let rect = this.$refs.leftBox.getBoundingClientRect();
            this.width = rect.width;
        }
    }
</script>