<template>
    <div class="control-container">
        <div class="box tap-box">
            <div class="tap" v-finger:touch-start="onGo(20)"
                 :class="{active:target_percentage === 20  && show_active_btn}">20%
            </div>
            <div class="tap" v-finger:touch-start="onGo(50)"
                 :class="{active:target_percentage === 50 && show_active_btn}">50%
            </div>
            <div class="tap" v-finger:touch-start="onGo(80)"
                 :class="{active:target_percentage === 80 && show_active_btn}">80%
            </div>
            <div class="tap" v-finger:touch-start="onGo(100)"
                 :class="{active:target_percentage === 100 && show_active_btn}">100%
            </div>
        </div>
        <div class="box button-box">
            <div class="on button" v-finger:touch-start="onOpenTouchStart"
                 :class="[loading_type=='on' ? 'loading':'normal']"></div>
            <div class="pause button" v-finger:touch-start="onPauseTouchStart"
                 :class="[loading_type=='pause' ? 'loading':'normal']"></div>
            <div class="off button" v-finger:touch-start="onCloseTouchStart"
                 :class="[loading_type=='off' ? 'loading':'normal']"></div>
        </div>
    </div>
</template>
<style lang="less" scoped>
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

    .control-container {
        width: 100%;
    }


    @media all and (max-height: 799px) {
        .button-box {
            margin-top: 15px !important;
        }
    }

    .button-box {
        margin-top: 36px;
    }

    .box {
        display: flex;
        flex-direction: row;
        justify-content: center;
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

    .tap {
        width: 144px;
        height: 54px;
        line-height: 54px;
        font-size: 30px;
        color: #ffffff;
        font-family: Roboto-Regular;
        text-align: center;
        margin: 0 24px;
    }

    .tap.active {
        background: #ffffff;
        border-radius: 27px;
        color: #46bcff;
    }

</style>
<script>
    export default {
        props: {
            open_percentage: Number,
            is_ready: Boolean,
            show_active_btn: Boolean
        },
        data (){
            return {
                loading_type: '',
                timer: null,
                target_percentage: ''
            }
        },
        methods: {
            stopLoading (){
                this.target_percentage = '';
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
                return () => {
                    if (!this.is_ready) return false;
                    this.stopLoading();
                    this.target_percentage = target_percentage;
                    this.$emit('onGoPercentage', target_percentage);
                }
            }
        }
    }
</script>