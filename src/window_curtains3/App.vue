<style scoped="less">
    .container {
        padding: 100px;
    }

    .box {
        position: relative;
        width: 1000px;
        height: 100px;
        margin: 50px;
    }

    .rect {
        position: absolute;
        width: 100px;
        height: 100px;
        left: -50px;
        background: red;
        transition-timing-function: linear;
    }

    button {
        margin: 20px;
    }
</style>
<template>
    <div class="container">
        <div>
            <button @click="onOpen">open</button>
            <button @click="onClose">close</button>
            <button @click="onPause">pause</button>
        </div>
        <div>
            <button @click="onGoPercentage(20)">20%</button>
            <button @click="onGoPercentage(50)">50%</button>
            <button @click="onGoPercentage(80)">80%</button>
            <button @click="onGoPercentage(100)">100%</button>
        </div>
        <div class="box" ref="box">
            <div class="rect" ref='rect'
                 :style="style"></div>
        </div>
    </div>
</template>
<script>
    const TOTAL = 4500;
    export default {
        name: 'app',
        data (){
            return {
                firstRun: true,
                close_percentage: null,
                width: 0,
                pxPerMs: 0,
                style: {}
            }
        },
        mounted (){
            HdSmart.ready(() => {
                HdSmart.Device.getSnapShot((data) => {
                    this.is_ready = true;
                    this.close_percentage = data.attribute.close_percentage;
                    HdSmart.UI.hideLoading();
                }, () => {
                    this.is_ready = true;
                    HdSmart.UI.hideLoading();
                });
                HdSmart.UI.setWebViewTouchRect(0, 0, '100%', '100%');
            });
            HdSmart.onDeviceListen((data) => {
                try {
                    this.close_percentage = data.result.attribute.close_percentage;
                } catch (error) {

                }
            });

            this.width = (this.$refs.box.getBoundingClientRect()).width;
            this.pxPerMs = TOTAL / this.width;
        },
        methods: {
            onOpen(){
                this.clearTargetTip();
                HdSmart.Device.control('setZigbeeCurtain', 'setOnoff', {
                    mode: 'on'
                }, (data) => {
                }, () => {
                });
            },

            onClose(){
                this.clearTargetTip();
                HdSmart.Device.control('setZigbeeCurtain', 'setOnoff', {
                    mode: 'off'
                }, () => {
                }, () => {
                });
            },
            onPause(){
                HdSmart.Device.control('setZigbeeCurtain', 'setOnoff', {
                    mode: 'pause'
                }, () => {
                }, () => {
                });
            },
            onGoPercentage (percentage){
                HdSmart.Device.control('setZigbeeCurtain', 'setLevel', {
                    close_percentage: percentage
                }, () => {
                    this.tip = `幅度调至${percentage}%`;
                }, () => {

                });
            },
            clearTargetTip  (){
                this.tip = '';
            },
            getTargetLeft (){
                return this.width * this.close_percentage / 100;
            },
            setStyle (left = 0, time = 0){
                this.style = {
                    transform: `translate3d(${left}px,0,0)`,
                    transitionDuration: `${time}ms`
                };
            },
            clearStyle (){
                this.style = {};
            }
        },

        watch: {
            close_percentage (){
                let targetLeft = this.getTargetLeft();
                if (this.firstRun) {
                    this.firstRun = false;
                    this.setStyle(targetLeft);
                } else {
                    let rect = this.$refs.rect.getBoundingClientRect();
                    console.error(rect,window.getComputedStyle(this.$refs.rect).transform)
                    let time = Math.abs(targetLeft - rect.left) * this.pxPerMs;
                    this.setStyle(targetLeft, time);
                }
//                console.log(this.close_percentage)
//                if (this.firstRun) {
//                    this.firstRun = false;
//                    this.left = this.getTargetLeft();
//                } else {
//                    let targetLeft = this.getTargetLeft();
//                    if (this.left !== targetLeft) {
//                        let rect = this.$refs.rect.getBoundingClientRect();
////                        this.left = rect.left;
//                        console.error(`位置:${rect.left},当前目标:${this.left}下一个:${targetLeft}`);
//                        this.time = Math.abs(targetLeft - rect.left) * this.pxPerMs;
//                        this.left = targetLeft;
//                    }
//                }
            }
        }
    }
</script>
