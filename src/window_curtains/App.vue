<template>
    <div id="app">
        <navigator class="navigator" v-if="close_percent !== null"></navigator>
        <curtain class="curtain" v-if="close_percent !== null" :close_percent="close_percent"></curtain>
        <control class="control" v-if="close_percent !== null" :close_percent="close_percent" v-on:onOpen="onOpen"
                 v-on:onPause="onPause" v-on:onClose="onClose"></control>
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
    var percentPerSecond = 3.9;
    export default {
        name: 'app',
        data (){
            var close_percent = localStorage.getItem('close_percent');
            if (isNaN(close_percent)) {
                close_percent = null;
                localStorage.removeItem('close_percent');
            }
            return {
                close_percent: close_percent,
//                close_percent: 0,
                rafId: 0
            }
        },
        mounted (){
            HdSmart.Device.getSnapShot((data) => {
                var close_percent = parseInt(localStorage.getItem('close_percent'));
                if (isNaN(close_percent)) {
                    close_percent = null;
                    localStorage.removeItem('close_percent');
                }
                this.close_percent = close_percent === null ? data.attr.close_percentage : close_percent;
//                this.close_percent = 0;
                localStorage.setItem('close_percent', this.close_percent);
            });

            HdSmart.UI.setWebViewTouchRect(0, 0, '100%', '100%');
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
                    this.rafId = window.requestAnimationFrame(onOpen);
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
                    this.rafId = window.requestAnimationFrame(onClose);
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
