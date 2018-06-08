<template>
    <div class="wrap" :class="{visible:is_ready}">
        <div class="bg" :style="{transform:'translate3d(-50%,-'+moveX+'px,0)',opacity:bg_opacity}"></div>
        <div class="box left" ref="leftBox">
            <div class="clothes" :style="{width:width}">
                <div class="folding" :style="{opacity: opacity}"></div>
            </div>
        </div>

        <div class="box right" ref="rightBox">
            <div class="clothes" :style="{width:width}">
                <div class="folding" :style="{opacity: opacity}"></div>
            </div>
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
    background: url("../../../lib/base/curtains/assets/img_curtain_view.png")
        center center no-repeat;
    width: 1140px;
    height: 408px;
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
    height: 468px;
    position: absolute;
    width: 588px;
}

.clothes {
    background: url("../../../lib/base/curtains/assets/img_curtain_clothes.png")
        center center no-repeat;
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    // transition: width 5s;
}

.folding {
    background: url("../../../lib/base/curtains/assets/img_curtain_folding.png")
        center center no-repeat;
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    // position: absolute;
    // top: 0;
    // transition: width 5s;
}
.left > div {
    left: 0;
}
.right > div {
    right: 0;
    float: right;
}
.test {
    height: 1px;
    background: none;
}
</style>
<script>
const BGMOVEDISTANCE = 24;
export default {
    props: {
        open_percentage: Number,
        is_ready: Boolean,
        test: Number
    },
    computed: {
        //背景图移动的距离
        moveX() {
            return BGMOVEDISTANCE * this.open_percentage / 100;
        },
        //云背景的透明度
        bg_opacity() {
            return 0.7 + 0.3 * this.open_percentage / 100;
        },
        //窗帘黑色背景图的透明度
        opacity() {
            return 0.1 + 0.9 * this.open_percentage / 100;
        },
        width() {
            return 100 - 0.8 * this.open_percentage + "%";
        },
        w1() {
            return 100 - 0.8 * this.test + "%";
        }
    }
};
</script>
