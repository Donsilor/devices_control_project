<template>
    <div class="wrap">
        <div class="bg" :style="{transform:'translate3d(-50%,-'+translateX+'px,0)',opacity:opacity}" v-if="is_ready"></div>
        <clothes class="left" :close_percentage="close_percentage" v-if="is_ready"></clothes>
        <clothes class="right" :close_percentage="close_percentage" v-if="is_ready"></clothes>
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
        width: 954px;
        height: 348px;
        background-size: 100% 100%;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate3d(-50%, 0, 0);
        transition:transform 1.0s linear;
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
    let bg_move_distance = 24;
    export default {
        props: {
            close_percentage: Number,
            is_ready: Boolean
        },
        data (){
            return {
                translateX: bg_move_distance - bg_move_distance * this.close_percentage / 100,
                opacity: 1 - 0.7 * this.close_percentage / 100
            }
        },
        watch: {
            close_percentage (){
                this.translateX = bg_move_distance - bg_move_distance * this.close_percentage / 100;
                this.opacity = 1 - 0.7 * this.close_percentage / 100;
            }
        }
    }
</script>