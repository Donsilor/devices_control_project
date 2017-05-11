<template>
    <div class="box">
        <div class="on button" v-finger:touch-start="onOpenTouchStart"
             :class="{loading:is_on_loading,normal:!is_on_loading}"></div>
        <div class="pause button" v-finger:touch-start="onPauseTouchStart"
             :class="{loading:is_pause_loading,normal:!is_pause_loading}"></div>
        <div class="off button" v-finger:touch-start="onCloseTouchStart"
             :class="{loading:is_off_loading,normal:!is_off_loading}"></div>
    </div>
</template>
<style lang="scss" scoped>
    .button {
        width: 144px;
        height: 144px;
        background-size: 100% 100% !important;
        margin: 0 45px;
        cursor: pointer;
    }

    .disabled {
        opacity: 0.3;
    }

    .box {
        display: flex;
        flex-direction: row;
    }

    .on {
        background: url('../assets/btn_curtain_open_normal.png') center center no-repeat;
    }

    .on.normal:active {
        background-image: url('../assets/btn_curtain_open_pressed.png');
    }

    .pause {
        background: url('../assets/btn_curtain_pause_normal.png') center center no-repeat;
    }

    .pause.normal:active {
        background-image: url('../assets/btn_curtain_pause_pressed.png');
    }

    .off {
        background: url('../assets/btn_curtain_close_normal.png') center center no-repeat;
    }

    .off.normal:active {
        background-image: url('../assets/btn_curtain_close_pressed.png');
    }

    .loading {
        position: relative;
        background-image: url('../assets/btn_curtain_buffering.png');
    }
    .loading{
        position: relative;
    }

    .loading:before {
        content: '';
        background: url('../assets/icn_buffering_white.gif') center center no-repeat;
        position: absolute;
        width: 72px;
        height: 72px;
        left: 36px;
        top: 36px;
        border-radius: 100%;
        background-size: 100% 100%;
    }

</style>
<script>
    export default {
        props: {
            close_percent: Number
        },
        data (){
            return {
                is_on_loading: false,
                is_off_loading: false,
                is_pause_loading: false
            }
        },
        methods: {
            onOpenTouchStart (){
                this.is_on_loading = true;
                this.is_off_loading = false;
                this.is_pause_loading = false;
                this.$emit('onOpen', () => {
                    this.is_on_loading = false;
                });
            },
            onCloseTouchStart(){
                this.is_on_loading = false;
                this.is_off_loading = true;
                this.is_pause_loading = false;
                this.$emit('onClose', () => {
                    this.is_off_loading = false;
                });
            },
            onPauseTouchStart(){
                this.is_on_loading = false;
                this.is_off_loading = false;
                this.is_pause_loading = true;
                this.$emit('onPause', () => {
                    this.is_pause_loading = false;
                });
            }
        }
    }
</script>