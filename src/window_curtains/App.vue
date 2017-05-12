<template>
    <div id="app">
        <navigator class="navigator"></navigator>
        <curtain class="curtain" :is_ready="is_ready" :close_percent="close_percent"></curtain>
        <control class="control" :close_percent="close_percent" v-on:onOpen="onOpen"
                 v-on:onPause="onPause" v-on:onClose="onClose" :is_ready="is_ready"></control>
    </div>
</template>


<style lang="scss">
    html {
        font-size: 20px;
        height: 100%;
    }

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
            var close_percent = parseInt(localStorage.getItem('close_percent'));
            if (isNaN(close_percent)) {
                close_percent = null;
                localStorage.removeItem('close_percent');
            }
            return {
                is_ready: false,
                close_percent: close_percent,
                rafId: 0
            }
        },
        mounted (){
            HdSmart.ready(() => {
                HdSmart.Device.getSnapShot((data) => {
                    this.is_ready = true;
                    HdSmart.UI.hideLoading();
                    var close_percent = parseInt(localStorage.getItem('close_percent'));
                    if (isNaN(close_percent)) {
                        close_percent = null;
                        localStorage.removeItem('close_percent');
                    }
                    this.close_percent = close_percent === null ? data.attr.close_percentage : close_percent;
                    localStorage.setItem('close_percent', this.close_percent);
                }, () => {
                    this.is_ready = true;
                    HdSmart.UI.hideLoading();
                });
                HdSmart.UI.setWebViewTouchRect(0, 0, '100%', '100%');
            });
        },
        methods: {
            onOpen(onFinishCallback){
                let onOpen = () => {
                    let percent = this.close_percent - percentPerSecond;
                    if (percent <= 0) {
                        percent = 0;
                    }
                    if (percent === 0) {
                        cancelAnimationFrame(this.rafId);
                    } else {
                        this.rafId = window.requestAnimationFrame(onOpen);
                    }
                    this.close_percent = percent;
                    localStorage.setItem('close_percent', this.close_percent);
                };
                HdSmart.Device.control('setZigbeeCurtain', 'setOnoff', {
                    mode: 'on'
                }, (data) => {
                    cancelAnimationFrame(this.rafId);
                    onFinishCallback();
                    onOpen();
                });
            },

            onClose(onFinishCallback){
                let onClose = () => {
                    let percent = this.close_percent + percentPerSecond;
                    if (percent >= 100) {
                        percent = 100;
                    }
                    if (percent === 100) {
                        cancelAnimationFrame(this.rafId);
                    } else {
                        this.rafId = window.requestAnimationFrame(onClose);
                    }
                    this.close_percent = percent;
                    localStorage.setItem('close_percent', this.close_percent);
                };
                HdSmart.Device.control('setZigbeeCurtain', 'setOnoff', {
                    mode: 'off'
                }, (data) => {
                    cancelAnimationFrame(this.rafId);
                    onFinishCallback();
                    onClose();
                });
            },
            onPause(onFinishCallback){
                HdSmart.Device.control('setZigbeeCurtain', 'setOnoff', {
                    mode: 'pause'
                }, (data) => {
                    cancelAnimationFrame(this.rafId);
                    onFinishCallback();
                    localStorage.setItem('close_percent', this.close_percent);
                });
            }
        }
    }
</script>
