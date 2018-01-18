<template>
    <div class="control-container">
        <div class="box tap-box">
            <div class="tap" @click="onGo(20)">20%</div>
            <div class="tap" @click="onGo(50)">50%</div>
            <div class="tap" @click="onGo(80)">80%</div>
            <div class="tap" @click="onGo(100)">100%</div>
        </div>
        <div class="box button-box">
            <div class="off button" @click="onCloseTouchStart"
                 :class="[loading_type=='off' ? 'loading':'normal']"></div>
            <div class="pause button" @click="onPauseTouchStart"
                 :class="[loading_type=='pause' ? 'loading':'normal']"></div>
            <div class="on button" @click="onOpenTouchStart"
                 :class="[loading_type=='on' ? 'loading':'normal']"></div>
        </div>
    </div>
</template>
<style lang="less" scoped>
    .button {
        width: 144px;
        height: 144px;
        background-size: 100% 100% !important;
        margin: 0 32px;
        cursor: pointer;
    }

    .disabled {
        opacity: 0.3;
    }

    .control-container {
        width: 100%;
    }

    .button-box {
        margin-top: 64px;
    }

    .box {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .on {
        background: url('../assets/btn_curtain_open_normal@2x.png') center center no-repeat;
    }

    .on.normal:active {
        background-image: url('../assets/btn_curtain_open_pressed@2x.png');
    }

    .pause {
        background: url('../assets/btn_curtain_pause_normal@2x.png') center center no-repeat;
    }

    .pause.normal:active {
        background-image: url('../assets/btn_curtain_pause_pressed@2x.png');
    }

    .off {
        background: url('../assets/btn_curtain_close_normal@2x.png') center center no-repeat;
    }

    .off.normal:active {
        background-image: url('../assets/btn_curtain_close_pressed@2x.png');
    }

    .loading {
        position: relative;
        background-image: url('../assets/btn_curtain_buffering@2x.png');
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

    .tap {
        width: 144px;
        height: 56px;
        line-height: 56px;
        font-size: 28px;
        color: #ffffff;
        font-family: Roboto-Regular;
        text-align: center;
        margin: 0 24px;
    }

    .tap:active {
        background: #ffffff;
        border-radius: 27px;
        color: #46bcff;
    }

</style>
<script>
    export default {
        props: {
            is_ready: Boolean
        },
        data (){
            return {
                loading_type: '',
                timer: null
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
                }, 300);
            },
            onOpenTouchStart (){
                if (!this.is_ready) return false;
                if (this.loading_type != 'on') {
                    this.stopLoading();
                    this.delayLoading(() => {
                        this.loading_type = 'on';
                    });
                    this.$emit('onOpen', () => {
                        this.stopLoading();
                    });
                }
            },
            onCloseTouchStart(){
                if (!this.is_ready) return false;
                if (this.loading_type !== 'off') {
                    this.stopLoading();
                    this.delayLoading(() => {
                        this.loading_type = 'off';
                    });
                    this.$emit('onClose', () => {
                        this.stopLoading();
                    });
                }
            },
            onPauseTouchStart(){
                if (!this.is_ready) return false;
                if (this.loading_type !== 'pause') {
                    this.stopLoading();
                    this.delayLoading(() => {
                        this.loading_type = 'pause';
                    });
                    this.$emit('onPause', () => {
                        this.stopLoading();
                    });
                }
            },
            onGo (target_percentage){
                //return () => {
                    if (!this.is_ready) return false;
                    this.stopLoading();
                    this.$emit('onGoPercentage', target_percentage);
                //}
            }
        }
    }
</script>
