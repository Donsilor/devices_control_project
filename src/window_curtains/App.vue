<template>
    <div id="app">
        <navigator class="navigator"></navigator>
        <curtain class="curtain" :is_ready="is_ready" :close_percentage="close_percentage"></curtain>
        <control class="control" :close_percentage="close_percentage" v-on:onOpen="onOpen"
                 v-on:onPause="onPause" v-on:onClose="onClose" :is_ready="is_ready"></control>
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
        display: flex;
        align-items: center;
        background-image: linear-gradient(-180deg, #2499ff 0%, #13d5dc 100%);
        flex-direction: column;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 170px;;
    }

    .navigator {
        margin-top: 190px;
    }

    .curtain {
        margin: 4px 0 60px 0;
    }
</style>
<script>
    let percentPerSecond = 3.9;
    export default {
        name: 'app',
        data (){
            return {
                is_ready: false,
                close_percentage: 0
            }
        },
        mounted (){
            HdSmart.ready(() => {
                HdSmart.Device.getSnapShot((data) => {
                    this.is_ready = true;
                    this.close_percentage = data.attr.close_percentage;
                    HdSmart.UI.hideLoading();
                }, () => {
                    this.is_ready = true;
                    HdSmart.UI.hideLoading();
                });
                HdSmart.UI.setWebViewTouchRect(0, 0, '100%', '100%');
            });
            HdSmart.onDeviceListen((data) => {
                try{
                    if(this.close_percentage !== data.result.attr.close_percentage){
                        this.close_percentage = data.result.attr.close_percentage;
                    }
                }catch (error){

                }
            })
        },
        methods: {
            onOpen(onFinishCallback){
                HdSmart.Device.control('setZigbeeCurtain', 'setOnoff', {
                    mode: 'on'
                }, () => {
                    onFinishCallback();
                }, () => {
                    onFinishCallback();
                });
            },

            onClose(onFinishCallback){
                HdSmart.Device.control('setZigbeeCurtain', 'setOnoff', {
                    mode: 'off'
                }, () => {
                    onFinishCallback();
                }, () => {
                    onFinishCallback();
                });
            },
            onPause(onFinishCallback){
                HdSmart.Device.control('setZigbeeCurtain', 'setOnoff', {
                    mode: 'pause'
                }, () => {
                    onFinishCallback();
                }, () => {
                    onFinishCallback();
                });
            }
        }
    }
</script>
