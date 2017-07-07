<template>
    <div class="wrap" :class="{visible:is_ready}">
        <div class="bg"
             :style="{transform:'translate3d(-50%,-'+translateX+'px,0)',opacity:bg_opacity,transitionDuration:time+'ms'}"
             ref="c_bg"></div>
        {{times}}
        <div class="box left" :style="{transform:'scale3d('+percent+',1,1)',transitionDuration:time+'ms'}">
            <div class="clothes"></div>
            <div class="folding" :style="{opacity: opacity,transitionDuration:time+'ms'}"></div>
        </div>

        <div class="box right" :style="{transform:'scale3d('+percent+',1,1)',transitionDuration:time+'ms'}">
            <div class="clothes"></div>
            <div class="folding" :style="{opacity: opacity,transitionDuration:time+'ms'}"></div>
        </div>
    </div>
</template>
<style scoped lang="scss">
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
    let BGMOVEDISTANCE = 24;
    let TOTALCLOSETIME = 5000;
    export default {
        props: {
            close_percentage: Number,
            is_ready: Boolean,
        },
        computed: {
            translateX (){
                return BGMOVEDISTANCE - BGMOVEDISTANCE * this.close_percentage / 100
            },
            bg_opacity (){
                return 1 - 0.7 * this.close_percentage / 100;
            },
            percent (){
                return 0.2 + 0.8 * this.close_percentage / 100;
            },
            opacity (){
                return 1 - 0.9 * this.close_percentage / 100;
            }
        },
        data (){
            return {
                resourceBottom: 0,
                time: 0,
                firstRender: true,
                times: []
            }
        },
        mounted (){
            let rect = this.$refs.c_bg.getBoundingClientRect();
            this.resourceBottom = rect.bottom;
        },
        watch: {
            close_percentage (){
                if (this.$refs.c_bg) {
                    let rect = this.$refs.c_bg.getBoundingClientRect();
                    //计算要从当前位置移动到this.translateX需要的实际时间
                    if(this.firstRender){
                        this.time = 0;
                        this.firstRender = false;
                    }else{
                        this.time = Math.abs((BGMOVEDISTANCE - this.translateX + this.resourceBottom - rect.bottom) * TOTALCLOSETIME / BGMOVEDISTANCE);
                    }
                }
                this.times.push(this.close_percentage);
            }
        }
    }
</script>