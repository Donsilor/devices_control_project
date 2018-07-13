<template>
    <div id="app">
        <div class="page-on">
            <div class="bg">
                <div class="cloud"></div>
            </div>

            <div class="name">{{device_name}}
                <icon className="redact-white" />
            </div>

            <div class="tip">
                <p>
                    <span v-show="tip">{{tip}}</span>
                    <span v-show="!tip && tip2">{{tip2}}</span>&nbsp;
                </p>
                <p v-show="drying == 'on' && drying_remain > 0">正在烘干 将于{{drying_remain}}分钟后结束</p>
                <p v-show="air_drying == 'on' && air_drying_remain > 0">正在风干 将于{{air_drying_remain}}分钟后结束</p>
                <!-- <p v-show="(drying == 'on' || air_drying == 'on') && sterilization == 'on'">杀菌 将于{{timeleft}}分钟后开始</p> -->
                <p v-show="sterilization == 'on' && sterilization_remain > 0">正在杀菌 将于{{sterilization_remain}}分钟后结束</p>
            </div>

            <div class="entity">
                <div class="top"></div>
                <div class="center" ref="ani"></div>
                <div class="bottom"></div>
                <div class="light" v-show="light == 'on'"></div>
                <div class="wind" v-show="air_drying == 'on'"></div>
                <div class="hotdry" v-show="drying == 'on'"></div>
                <div class="slight" v-show="sterilization == 'on'"></div>
            </div>

            <div class="control">
                <a href="#" class="btn-up" @click.prevent="setUp"></a>
                <a href="#" class="btn-pause" @click.prevent="setPause"></a>
                <a href="#" class="btn-down" @click.prevent="setDown"></a>
                <a href="#" class="btn-light" :class="{'on':light == 'on'}" @click.prevent="setLight"></a>
            </div>

            <a href="#" class="btn-mode" @click.prevent="toggleModal(true)"></a>

            <modal title="模式" v-model="modal_visible">
                    <a href="#" class="btn-wind" :class="{'on':air_drying == 'on'}" @click.prevent="setWind">
                        <i></i> 风干
                    </a>
                    <a href="#" class="btn-bake" :class="{'on':drying == 'on'}" @click.prevent="setBake">
                        <i></i> 烘干
                    </a>
                    <a href="#" class="btn-sterilize" :class="{'on':sterilization == 'on'}" @click.prevent="setSterilize">
                        <i></i> 杀菌
                    </a>
            </modal>
        </div>

        <!-- <div class="page-error" v-if="0">
        <div class="error-tip">
            <img src='../../lib/base/clothes_hanger/assets/init_err.png' />
            <p>加载失败，请点击屏幕刷新</p>
        </div>
    </div> -->
    </div>
</template>


<script>
import Modal from '../../lib/components/Modal.vue'
import Icon from '../../lib/components/ToAppDeviceDetailIcon.vue';
const tips = {
    moving_up: '正在上升',
    moved_up: '已上升至顶部',
    moving_down: '正在下降',
    moved_down: '已下降至底部',
    move_pause: '已暂停',
    // wind_drying: '正在风干',
    // wind_drying_finish: '风干 将于{time}分钟后结束',
    wind_dryed: '风干已完成',
    wind_dry_cancle: '风干已取消',
    // bake_drying: '正在烘干',
    // bake_drying_finish: '烘干 将于{time}分钟后结束',
    bake_dryed: '烘干已完成',
    bake_dry_cancle: '烘干已取消',
    // sterilize_will: '杀菌 将于{time}分钟后开始',
    // sterilize_finish: '杀菌 将于{time}分钟后结束',
    // sterilizing: '正在杀菌',
    sterilized: '杀菌已完成',
    sterilize_cancle: '杀菌已取消'
};

const radio = (document.documentElement.clientWidth || window.innerWidth) / 750 * 75;

function getToggle(val) {
    return val === 'on' ? 'off' : 'on';
}

const duration = 28000;
const start_pos = 0.5; //最小高度
const end_pos = 2.16; //最大高度
const ch_height = 1.66; //

var speed = ch_height / duration * 20;
var moveRAF;

function setMove(el, dir) {
    cancelAnimationFrame(moveRAF);
    var start = Date.now();
    var height = getHeight(el.style.height);
    var move = function() {
        var end = Date.now();
        var p = (end - start) / 20;
        if (p == 0) p = 1;
        start = end;
        if (dir == 'up') {
            height -= speed * p;
            el.style.height = height + 'rem';
            if (height > start_pos) {
                moveRAF = requestAnimationFrame(move);
            } else {
                cancelAnimationFrame(moveRAF);
            }
        } else if (dir == 'down') {
            height += speed * p;
            el.style.height = height + 'rem';
            if (height < end_pos) {
                moveRAF = requestAnimationFrame(move);
            } else {
                cancelAnimationFrame(moveRAF);
            }
        }
    };
    moveRAF = requestAnimationFrame(move);
}

function setStop(el, height) {
    if (height) {
        el.style.height = height;
    }
    cancelAnimationFrame(moveRAF);
}

function getHeight(height) {
    if (height.indexOf('px') >= 0) {
        height = height.replace('px', '') * 1 / radio;
    } else {
        height = height.replace('rem', '') * 1;
    }
    return height;
}

function setDuration(el, dir) {
    var percentage;
    var height = el.style.height;
    if (height.indexOf('px') >= 0) {
        height = height.replace('px', '') * 1 / radio;
    } else {
        height = height.replace('rem', '') * 1;
    }
    if (dir == 'up') {
        percentage = (height - start_pos) / ch_height * duration;
    } else {
        percentage = (end_pos - height) / ch_height * duration;
    }
    el.style.transitionDuration = percentage + 'ms';
}

function setPosition(el, pos) {
    if (!el) return;
    switch (pos) {
        case 'top':
            setStop(el, start_pos + '01rem');
            // el.style.height = start_pos+'01rem'
            // el.style.transitionDuration = '1000ms'
            break;
        case 'up':
            setMove(el, 'up');
            // el.style.height = start_pos+'rem'
            break;
        case 'bottom':
            setStop(el, end_pos + '01rem');
            // el.style.height = end_pos+'01rem'
            // el.style.transitionDuration = '1000ms'
            break;
        case 'down':
            setMove(el, 'down');
            // el.style.height = end_pos+'rem'
            break;
        case 'pause':
            setStop();
            // var computedStyle = document.defaultView.getComputedStyle( el, null )
            // el.style.height = computedStyle.getPropertyValue( "height" )
            break;
    }
    if (!el.init) {
        el.init = true;
        if (pos == 'pause') {
            el.style.height = '2rem';
        }
        // el.style.transitionDuration = '0ms'
    }
}

let pauseTipTimer;

export default {
    components: { Icon , Modal },
    data() {
        return {
            device_name: '',
            tip: '',
            tip2: '',
            modal_visible: false,
            timeleft: 0,
            light: '', //on/off
            sterilization: '',
            drying: '',
            air_drying: '',
            status: '', //top/bottom/up/down/pause
            drying_remain: 0,
            air_drying_remain: 0,
            sterilization_remain: 0
        };
    },
    watch: {
        status(cur, prev) {
            if (cur == 'up') {
                // setDuration(this.$refs.ani, 'up')
            } else if (cur == 'down') {
                // setDuration(this.$refs.ani, 'down')
            }
        }
    },
    methods: {
        showTip(text, fade) {
            this.tip = text;
            clearTimeout(this.tipTime);
            if (fade) {
                this.tipTime = setTimeout(() => {
                    this.tip = '';
                }, 2000);
            }
        },
        showTip2(text, fade) {
            this.tip2 = text;
            clearTimeout(this.tipTime2);
            if (fade) {
                this.tipTime2 = setTimeout(() => {
                    this.tip2 = '';
                }, 2000);
            }
        },
        toggleModal(visible) {
            this.modal_visible = visible;
        },
        controlDevice(attr, val, success) {
            HdSmart.Device.control(
                {
                    method: 'dm_set',
                    nodeid: `clothes_hanger.main.${attr}`,
                    params: {
                        attribute: {
                            [attr]: val
                        }
                    }
                },
                () => {
                    success && success();
                },
                () => {
                    this.showTip('操作失败', true);
                }
            );
        },
        setUp() {
            if (this.status == 'top' || this.status == 'up') {
                if (this.status == 'top') {
                    this.showTip2('已上升至顶部', true);
                }
                return;
            }
            this.controlDevice('control', 'up', () => {
                // this.status = 'up'
            });
        },
        setDown() {
            if (this.status == 'bottom' || this.status == 'down') {
                if (this.status == 'bottom') {
                    this.showTip2('已下降至底部', true);
                }
                return;
            }
            this.controlDevice('control', 'down', () => {
                // this.status = 'down'
            });
        },
        setPause() {
            if (this.status == 'pause' || this.status == 'top' || this.status == 'bottom') {
                return;
            }
            this.controlDevice('control', 'pause', () => {
                // this.status = 'pause'
                // this.showTip2(tips.move_pause, true)
            });
        },
        setLight() {
            var val = getToggle(this.light);
            this.controlDevice('light', val, () => {
                this.light = val;
            });
        },
        setWind() {
            var val = getToggle(this.air_drying);
            this.controlDevice('air_drying', val, () => {
                this.air_drying = val;
            });
        },
        setBake() {
            var val = getToggle(this.drying);
            this.controlDevice('drying', val, () => {
                this.drying = val;
            });
        },
        setSterilize() {
            var val = getToggle(this.sterilization);
            if (val == 'on' && this.status != 'top') {
                HdSmart.UI.toast('请先将晾衣机升至顶部，再进行杀菌');
                // this.showTip('请先将晾衣机升至顶部，再进行杀菌', true)
                return;
            }
            this.controlDevice('sterilization', val, () => {
                this.sterilization = val;
            });
        },
        setMoveTip(attrs) {
            if (pauseTipTimer) {
                clearTimeout(pauseTipTimer);
            }
            if (attrs.connectivity && attrs.connectivity === 'offline') {
                attrs.status = 'pause';
            }
            if (attrs.status == 'up') {
                this.showTip2(tips.moving_up);
                return;
            }
            if (attrs.status == 'top' && this.status == 'up') {
                this.showTip2(tips.moved_up, true);
                return;
            }
            if (attrs.status == 'down') {
                this.showTip2(tips.moving_down);
                return;
            }
            if (attrs.status == 'bottom' && this.status == 'down') {
                this.showTip2(tips.moved_down, true);
                return;
            }
            if (attrs.status == 'pause' && (this.status == 'up' || this.status == 'down')) {
                pauseTipTimer = setTimeout(() => {
                    this.showTip2(tips.move_pause, true);
                }, 500);
                return;
            }
        },
        setModeTip(attrs) {
            if (attrs.air_drying == 'off' && this.air_drying == 'on') {
                if (attrs.air_drying_remain == 0 && this.air_drying_remain == 1) {
                    this.showTip(tips.wind_dryed, true);
                } else {
                    this.showTip(tips.wind_dry_cancle, true);
                }
                return;
            }

            if (attrs.drying == 'off' && this.drying == 'on') {
                if (attrs.drying_remain == 0 && this.drying_remain == 1) {
                    this.showTip(tips.bake_dryed, true);
                } else {
                    this.showTip(tips.bake_dry_cancle, true);
                }
                return;
            }

            if (attrs.sterilization == 'off' && this.sterilization == 'on') {
                if (attrs.sterilization_remain == 0 && this.sterilization_remain == 1) {
                    this.showTip(tips.sterilized, true);
                } else {
                    this.showTip(tips.sterilize_cancle, true);
                }
                return;
            }

            // var tip = ''
            // if(attrs.air_drying == 'on' || attrs.drying == 'on' || attrs.sterilization == 'on'){
            //     tip = '正在'
            //     if(attrs.air_drying == 'on'){
            //         tip += '风干'
            //     }
            //     if(attrs.drying == 'on'){
            //         tip += '烘干'
            //     }
            //     if(attrs.sterilization == 'on'){
            //         tip += '杀菌'
            //     }
            //     this.showTip(tip)
            // }else{
            //     this.showTip('')
            // }
        },
        onSuccess(result) {
            if (!result) return;

            var attrs = result.attribute;

            this.setModeTip(attrs);
            this.setMoveTip(attrs);

            // connectivity

            this.light = attrs.light;
            this.air_drying = attrs.air_drying;
            this.drying = attrs.drying;
            this.sterilization = attrs.sterilization;
            this.status = attrs.status;
            this.drying_remain = attrs.drying_remain;
            this.air_drying_remain = attrs.air_drying_remain;
            this.sterilization_remain = attrs.sterilization_remain;

            setPosition(this.$refs.ani, attrs.status);
        },
        getSnapShot(cb) {
            HdSmart.Device.getSnapShot(
                data => {
                    this.onSuccess(data);
                    cb && cb();
                },
                () => {}
            );
        }
    },
    created() {
        HdSmart.ready(() => {
            if (window.device_name) {
                this.device_name = window.device_name;
            }
            HdSmart.UI.hideLoading();
            this.getSnapShot();
        });

        HdSmart.onDeviceStateChange(data => {
            this.onSuccess(data.result);
        });
    }
};
</script>
