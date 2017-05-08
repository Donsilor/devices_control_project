<template>
    <div class="pull-to-refresh-wrapper">
        <div class="pull_bar" ref="pull" :class="[pullStatus]">
        </div>
        <div class="box" ref="box">
            <div class="scroll" ref="scroller">
                <div class="loading"></div>
                <slot></slot>
            </div>
        </div>
        <div class="push_bar" ref="push" :class="[pushStatus]">
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .pull-to-refresh-wrapper {
        overflow: hidden;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        position: absolute;
    }

    .loading{

        animation:loading 1600ms linear infinite;
    }

    .box {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .pull_bar,
    .push_bar {
        text-align: center;
        color: #808080;
        position: absolute;
        z-index: 10;
        height: 90px;
        line-height: 90px;
        width: 100%;
        font-size: 24px;
        background: #fafafa;
    }

    .pull_bar {
        top: -90px;
    }

    .push_bar {
        bottom: -90px;
    }

    .pull_bar.none:before {
        content: '下拉刷新';
    }

    .push_bar.none:before {
        content: '上拉刷新';
    }

    .pull_bar.release:before,
    .push_bar.release:before {
        content: '松手刷新';
    }

    .pull_bar.loading:before,
    .push_bar.loading:before {
        content: '刷新中';
    }

    .pull_bar.done:before,
    .push_bar.done:before {
        content: '刷新完成';
    }

    .scroll {
        position: absolute;
        z-index: 1;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        width: 100%;
        -webkit-transform: translateZ(0);
        -moz-transform: translateZ(0);
        -ms-transform: translateZ(0);
        -o-transform: translateZ(0);
        transform: translateZ(0);
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-text-size-adjust: none;
        -moz-text-size-adjust: none;
        -ms-text-size-adjust: none;
        -o-text-size-adjust: none;
        text-size-adjust: none;
    }

    @keyframes loading {
        0%{
            background-image: url('../assets/icn_loading_01.png');
        }
    }
</style>
<script>
    import AlloyTouch from '../assets/alloy_touch';
    import Transform from '../assets/transformjs/transform'
    export default {
        props: {
            enablePush: Boolean
        },
        data (){
            return {
                min: 0,
                isLoading: false,
                pullStatus: 'none',
                pushStatus: 'none',
                value: 0
            }
        },
        mounted (){
            let _this = this;
            let scroller = this.$refs.scroller;
            let pull = this.$refs.pull;
            let push = this.$refs.push;
            Transform(scroller, true);
            Transform(pull, true);
            Transform(push, true);
            let clientHeight = this.$refs.box.getBoundingClientRect().height;
            let pullBarHeight = pull.getBoundingClientRect().height;
            let pushBarHeight = push.getBoundingClientRect().height;
            let scrollHeight = 0;
            let getTouchMin = function () {
                scrollHeight = scroller.getBoundingClientRect().height;
                let min = scrollHeight - clientHeight;
                if (min < 0) {
                    min = 0;
                }
                return min;
            };
            _this.min = getTouchMin();
            let at = new AlloyTouch({
                touch: this.$refs.box,
                vertical: true,
                target: scroller,
                property: 'translateY',
                initialValue: 0,
                max: 0,
                min: -_this.min,
                change (value){
                    pull.translateY = value > pullBarHeight ? pullBarHeight : value;
                    if(_this.enablePush){
                        if (clientHeight > scrollHeight) {
                            push.translateY = value <= -pushBarHeight ? -pushBarHeight : value;
                        } else {
                            push.translateY = value + scrollHeight - clientHeight;
                        }
                    }else{
                        push.translateY = value + scrollHeight;
                    }
                    _this.value = value;
                },
                touchStart (){
                    _this.min = -getTouchMin();
                    at.min = _this.min;
                },
                touchMove (evt, value){
                    if (value >= pullBarHeight) {
                        _this.pullStatus = 'release';
                    } else if (value < pullBarHeight && pullBarHeight >= 0) {
                        _this.pullStatus = 'none';
                    }

                    if (value <= -_this.min - pushBarHeight) {
//                        _this.pushStatus = 'release';
                    } else if (value < _this.min && value > _this.min - pushBarHeight) {
                        _this.pushStatus = 'none';
                    }
                },
                touchEnd (evt, value){
                    if (value >= pullBarHeight) {
                        at.to(pullBarHeight);
                        _this.pullStatus = 'loading';
                        _this.$emit('onPull', () => {
                            _this.pullStatus = 'done';
                            _this.min = -getTouchMin();
                            at.min = _this.min;
//                            setTimeout(() => {
                                if (_this.value >= pullBarHeight) {
                                    at.to(at.initialValue);
                                }
//                            }, 1000);
                        });
                        return false;
                    }
                    let lastLine = _this.min - pushBarHeight;
                    if (value <= lastLine && _this.enablePush) {
                        at.to(lastLine);
                        _this.pushStatus = 'loading';
                        _this.$emit('onPush', () => {
                            _this.pushStatus = 'done';
                            _this.min = -getTouchMin();
                            at.min = _this.min;
//                            setTimeout(() => {
                                if (_this.value <= lastLine) {
                                    at.to(lastLine + pushBarHeight);
                                }
//                            }, 1000);
                        });
                        return false;
                    }
                }
            });
            _this.goToTop = function () {
                at.to(0, 0);
                _this.min = -getTouchMin();
                at.min = _this.min;
            }
        },
        methods: {}
    }
</script>