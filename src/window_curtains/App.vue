<template>
    <div id="app">
        <div class="tip" v-if="tip">{{tip}}</div>
        <navigator class="navigator"></navigator>
        <curtain class="curtain" :is_ready="is_ready" :close_percentage="close_percentage"></curtain>
        <control class="control" :close_percentage="close_percentage" v-on:onOpen="onOpen"
                 v-on:onPause="onPause" v-on:onClose="onClose" :is_ready="is_ready"
                 @onGoPercentage="onGoPercentage"></control>
    </div>
</template>


<style lang="less">
    body {
        margin: 0;
        height: 100%;
        -webkit-tap-highlight-color: transparent;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    #app {
        background-image: linear-gradient(-180deg, #2499ff 0%, #13d5dc 100%);
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 170px;;
    }

    .navigator {
        margin: 160px auto 0 auto;
    }

    .curtain {
        margin: 4px auto 24px auto;
    }

    .tip {
        position: absolute;
        left: 0;
        top: 120px;
        width: 100%;
        text-align: center;
        font-size: 24px;
        line-height: 24px;
        color: #ffffff;
        font-family: NotoSansHans-DemiLight;
    }
</style>
<script>
    export default {
        name: 'app',
        data (){
            return {
                is_ready: false,
                mqtt_percentage: 0,
                close_percentage: 0,
                direction: '',
                tip: '',
                target_percentage: null
            }
        },
        mounted (){
            HdSmart.ready(() => {
                HdSmart.Device.getSnapShot((data) => {
                    this.is_ready = true;
                    this.mqtt_percentage = data.attr.close_percentage;
                    HdSmart.UI.hideLoading();
                }, () => {
                    this.is_ready = true;
                    HdSmart.UI.hideLoading();
                });
                HdSmart.UI.setWebViewTouchRect(0, 0, '100%', '100%');
            });
            HdSmart.onDeviceListen((data) => {
                try {
                    this.mqtt_percentage = data.result.attr.close_percentage;
                } catch (error) {

                }
            })
        },
        methods: {
            onOpen(onFinishCallback){
                this.clearTargetTip();
                HdSmart.Device.control('setZigbeeCurtain', 'setOnoff', {
                    mode: 'on'
                }, () => {
                    this.target_percentage = 0;
                    onFinishCallback();
                }, () => {
                    onFinishCallback();
                });
            },

            onClose(onFinishCallback){
                this.clearTargetTip();
                HdSmart.Device.control('setZigbeeCurtain', 'setOnoff', {
                    mode: 'off'
                }, () => {
                    this.target_percentage = 100;
                    onFinishCallback();
                }, () => {
                    onFinishCallback();
                });
            },
            onPause(onFinishCallback){
                this.clearTargetTip();
                HdSmart.Device.control('setZigbeeCurtain', 'setOnoff', {
                    mode: 'pause'
                }, () => {
                    onFinishCallback();
                }, () => {
                    onFinishCallback();
                });
            },
            onGoPercentage (percentage){
                HdSmart.Device.control('setZigbeeCurtain', 'setLevel', {
                    attr: {
                        close_percentage: percentage
                    }
                }, () => {
                    this.tip = `幅度调至${percentage}%`;
                    this.close_percentage = percentage;
                });
            },
            clearTargetTip  (){
                this.tip = '';
            }
        },
        watch: {
            mqtt_percentage (newValue, oldValue){
                this.close_percentage = newValue;
                console.log(newValue, oldValue);
            }
        }
    }
</script>
