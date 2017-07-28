<template>
    <div id="app">
        <div class="tip" v-if="show && tip">{{tip}}</div>
        <navigator class="navigator" v-once></navigator>
        <curtain class="curtain" :is_ready="is_ready" :open_percentage="target_percentage"
                 :total_time="total_time"></curtain>
        <control class="control" :open_percentage="target_percentage" v-on:onOpen="onOpen"
                 v-on:onPause="onPause" v-on:onClose="onClose" :is_ready="is_ready"
                 @onGoPercentage="onGoPercentage" :show_active_btn="show_active_btn"></control>
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
                //用于确定数据是否加载完成，加载完成后渲染动态的UI
                is_ready: false,
                //当前窗帘打开的幅度，请注意,硬件不修改属性依旧使用close_percentage
                open_percentage: 0,
                //目标幅度，用于动画
                target_percentage: 0,
                //点击中部到指定幅度按钮显示的信息
                tip: '',
                //每帧运动的百分比
                raf_percent: 0,
                //每帧间隔时间
                raf_time: 0,
                //帧数动画id，用于取消
                raf_id: 0,
                //动画总时间，应该从服务器端获取
                total_time: 0,
                //提示显示
                timer: null,
                //是否显示中部按钮提示
                show: false,
                //是否显示选中的百分比(因为80会返回78就停止了，所以需要一个额外的参数来控制）
                show_active_btn: false
            }
        },
        mounted (){
            HdSmart.ready(() => {
                //获取快照
                HdSmart.Device.getSnapShot((data) => {
                    //4500为当前窗帘动画的总时间为hard code，后续版本需要从服务端获取
                    this.total_time = 4500;
                    this.open_percentage = data.attribute.close_percentage;
                    //更新每帧百分比
                    this.changeRafPercent();
                    this.animateToTargetPercentage(this.open_percentage, true);
                    this.is_ready = true;
                    HdSmart.UI.hideLoading();
                }, () => {
                    this.is_ready = true;
                    HdSmart.UI.hideLoading();
                });
                HdSmart.UI.setWebViewTouchRect(0, 0, '100%', '100%');
            });

            HdSmart.onDeviceListen((data) => {
                try {
                    this.open_percentage = data.result.attribute.close_percentage;
                    this.animateToTargetPercentage(this.open_percentage);
                } catch (error) {

                }
            });
            //计算间隔帧数
            this.getAniFramePercentage();
        },
        methods: {
            getAniFramePercentage (){
                //取第10次的值来作为raq的间隔时间。todo 这样取值其实有问题
                let counter = 10;
                let reqId = null;
                let vm = this;
                let fun = function (lastTime) {
                    if (!lastTime) {
                        lastTime = +new Date();
                    } else {
                        let moment = +new Date();
                        counter = counter - 1;
                        if (counter === 0) {
                            //间隔时间
                            vm.raf_time = moment - lastTime;
                            //更新每帧百分比
                            vm.changeRafPercent();
                            return;
                        } else {
                            lastTime = moment;
                        }
                    }
                    reqId = requestAnimationFrame(function () {
                        fun(lastTime);
                    })
                };
                fun();
            },
            onOpen(onFinishCallback){
                this.clearTargetTip();
                HdSmart.Device.control('setZigbeeCurtain', 'setOnoff', {
                    mode: 'on'
                }, (data) => {
                    onFinishCallback();
                }, () => {
                    onFinishCallback();
                });
            },

            animateToTargetPercentage(percent, quite){
                //初次上电会导致返回报错
                if (percent === 255) {
                    return false
                }
                window.cancelAnimationFrame(this.raf_id);
                if (quite) {
                    this.target_percentage = percent;
                } else {
                    let rafFunc = () => {
                        //下一帧数的幅度
                        let nextTargetPercentage = this.target_percentage;
                        //当前的方向
                        let direction = '';
                        //当前幅度小于预计移动的幅度，说明正在关闭
                        if (nextTargetPercentage > percent) {
                            nextTargetPercentage -= this.raf_percent;
                            direction = 'close';
                        } else if (nextTargetPercentage < percent) {
                            nextTargetPercentage += this.raf_percent;
                            direction = 'open';
                        }
                        if (direction === 'close' && nextTargetPercentage < percent) {
                            nextTargetPercentage = percent;
                        } else if (direction === 'open' && nextTargetPercentage > percent) {
                            nextTargetPercentage = percent;
                        } else if (nextTargetPercentage === percent) {
                            this.target_percentage = nextTargetPercentage;
                            window.cancelAnimationFrame(this.raf_id);
                            return false;
                        } else if (nextTargetPercentage <= 0) {
                            this.target_percentage = 0;
                            window.cancelAnimationFrame(this.raf_id);
                            return false;
                        } else if (nextTargetPercentage >= 100) {
                            this.target_percentage = 100;
                            window.cancelAnimationFrame(this.raf_id);
                            return false;
                        }
                        this.target_percentage = nextTargetPercentage;
                        this.raf_id = window.requestAnimationFrame(rafFunc)
                    };
                    this.raf_id = window.requestAnimationFrame(rafFunc)
                }
            },

            onClose(onFinishCallback){
                this.clearTargetTip();
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
            },
            onGoPercentage (percentage){
                clearTimeout(this.timer);
                this.tip = `幅度调至${percentage}%`;
                this.show = true;
                this.show_active_btn = true;
                this.timer = setTimeout(() => {
                    this.show = false;
                }, 2000);
                HdSmart.Device.control('setZigbeeCurtain', 'setLevel', {
                    close_percentage: percentage
                }, () => {
                }, () => {
                });
            },
            clearTargetTip  (){
                this.show = false;
                this.show_active_btn = false;
            },
            changeRafPercent (){
                //watch里做会导致死循环
                if (this.raf_time && this.total_time) {
                    //2.22 = 100(百分比)*100(raf间隔)/4500(总动画时间)
                    //但实际上需要更快的速度，来解决因延时500ms上报的问题。
                    this.raf_percent = 3.9;//this.raf_time * 100 / this.total_time;
                }
            }
        }
    }
</script>
