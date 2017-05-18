<template>
    <div class="box">
        <div class="on button" v-finger:touch-start="onOpenTouchStart"
             :class="[loading_type=='on' ? 'loading':'normal']"></div>
        <div class="pause button" v-finger:touch-start="onPauseTouchStart"
             :class="[loading_type=='pause' ? 'loading':'normal']"></div>
        <div class="off button" v-finger:touch-start="onCloseTouchStart"
             :class="[loading_type=='off' ? 'loading':'normal']"></div>
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

    .loading {
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
    const LOADING_DELAY = 500;//ms
    export default {
        props: {
            close_percent: Number,
            is_ready: Boolean
        },
        data (){
            return {
                loading_type: '',
                timer: null,
            }
        },
        methods: {
            stopLoading (){
                this.loading_type = '';
                clearTimeout(this.timer);
            },
            delayLoading  (callback){
                this.timer = setTimeout(() => {
                    callback()
                }, LOADING_DELAY);
            },
            onOpenTouchStart (){
                if (!this.is_ready) return false;
                if(this.loading_type != 'on'){
                    this.stopLoading();
                    this.delayLoading(()=>{
                        this.loading_type = 'on';
                    });
                    this.$emit('onOpen', () => {
                        this.stopLoading();
                    });
                }
            },
            onCloseTouchStart(){
                if (!this.is_ready) return false;
                if(this.loading_type != 'off'){
                    this.stopLoading();
                    this.delayLoading(()=>{
                        this.loading_type = 'off';
                    });
                    this.$emit('onClose', () => {
                        this.stopLoading();
                    });
                }
            },
            onPauseTouchStart(){
                if (!this.is_ready) return false;
                if(this.loading_type != 'pause'){
                    this.stopLoading();
                    this.delayLoading(()=>{
                        this.loading_type = 'pause';
                    });
                    this.$emit('onPause', () => {
                        this.stopLoading();
                    });
                }
            }
        }
    }
</script>