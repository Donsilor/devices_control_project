<template>
<div id="app">
    <div class="page-on" v-if="1">
        <div class="name">{{device_name}}</div>
        <div class="fault">E15故障</div>
        <a href="" class="btn btn-more" @click.prevent="moreModalVisible = true"><i></i></a>
        <div class="circle active">
            <div class="inner">
                <div class="title">快速洗烘模式</div>
                <div class="sub_title">洗衣时间</div>
                <div class="timeleft">1<small>时</small>30<small>分</small></div>
                <div class="status">预约中</div>
            </div>
        </div>
        <div class="btns btns-fn">
            <a href="" class="btn btn-on" @click.prevent="setControl('off')"><i></i>关机</a>
            <a href="" class="btn btn-start" @click.prevent="setControl('start')"><i></i>启动</a>
            <a href="" class="btn btn-pause" @click.prevent="setControl('halt')"><i></i>暂停</a>
            <a href="" class="btn btn-mode" @click.prevent="modeModalVisible = true"><i></i>模式选择</a>
            <a href="" class="btn btn-reserve" @click.prevent="reserveModalVisible = true"><i></i>预约洗衣</a>
        </div>

        <!-- 模式 -->
        <modal title="模式选择" class="modal-w" v-model="modeModalVisible">
            <div class="model-wrap">
            <div class="group">
                <div class="title">快洗</div>
                <div class="btns btns-model">
                    <a href="" class="btn btn-mode-high_speed_15m" :class="{active:model.mode=='high_speed_15m'}" @click.prevent="setMode('high_speed_15m')"><i></i>快速15分钟</a>
                    <a href="" class="btn btn-mode-speed_wash_drying" :class="{active:model.mode=='speed_wash_drying'}" @click.prevent="setMode('speed_wash_drying')"><i></i>快速洗烘</a>
                </div>
            </div>
            <div class="line"></div>
            <div class="group">
                <div class="title">面料</div>
                <div class="btns btns-model">
                    <a href="" class="btn btn-mode-mix" :class="{active:model.mode=='mix'}" @click.prevent="setMode('mix')"><i></i>混合</a>
                    <a href="" class="btn btn-mode-cotton" :class="{active:model.mode=='cotton'}" @click.prevent="setMode('cotton')"><i></i>棉麻</a>
                    <a href="" class="btn btn-mode-synthetic" :class="{active:model.mode=='synthetic'}" @click.prevent="setMode('synthetic')"><i></i>化纤</a>
                    <a href="" class="btn btn-mode-cardigan" :class="{active:model.mode=='cardigan'}" @click.prevent="setMode('cardigan')"><i></i>羊毛</a>
                </div>
            </div>
            <div class="line"></div>
            <div class="group">
                <div class="title">衣物类型</div>
                <div class="btns btns-model">
                    <a href="" class="btn btn-mode-baby_clothes" :class="{active:model.mode=='baby_clothes'}" @click.prevent="setMode('baby_clothes')"><i></i>婴儿服</a>
                    <a href="" class="btn btn-mode-underwear" :class="{active:model.mode=='underwear'}" @click.prevent="setMode('underwear')"><i></i>内衣</a>
                    <a href="" class="btn btn-mode-cowboy_suit" :class="{active:model.mode=='cowboy_suit'}" @click.prevent="setMode('cowboy_suit')"><i></i>牛仔</a>
                    <a href="" class="btn btn-mode-down_coat" :class="{active:model.mode=='down_coat'}" @click.prevent="setMode('down_coat')"><i></i>羽绒服</a>
                </div>
            </div>
            </div>
        </modal>
        <!-- 更多 -->
        <modal title="更多" class="modal-w" v-model="moreModalVisible">
            <div class="more-wrap">
                <div class="group">
                    <div class="title">更多模式</div>
                    <div class="btns btns-more_model">
                        <a href="" class="btn btn-mode-strong_wash" :class="{active:model.mode=='strong_wash'}" @click.prevent="setMode('strong_wash')"><i></i>强力</a>
                        <a href="" class="btn btn-mode-normal_drying" :class="{active:model.mode=='normal_drying'}" @click.prevent="setMode('normal_drying')"><i></i>单烘干</a>
                        <a href="" class="btn btn-mode-spin" :class="{active:model.mode=='spin'}" @click.prevent="setMode('spin')"><i></i>单脱水</a>
                        <a href="" class="btn btn-mode-rinse_spin" :class="{active:model.mode=='rinse_spin'}" @click.prevent="setMode('rinse_spin')"><i></i>漂洗+脱水</a>
                        <a href="" class="btn btn-mode-odor_removal" :class="{active:model.mode=='odor_removal'}" @click.prevent="setMode('odor_removal')"><i></i>除味</a>
                        <a href="" class="btn btn-mode-antimite" :class="{active:model.mode=='antimite'}" @click.prevent="setMode('antimite')"><i></i>除螨</a>
                    </div>
                </div>
                <div class="group">
                    <div class="title">高级设置</div>
                    <switch-button v-model="child_lock_flag" @change="setChildLock" />
                </div>
            </div>
        </modal>
        <!-- 预约 -->
        <modal title="预约洗衣" class="modal-w" v-model="reserveModalVisible">

        </modal>
    </div>
    <div class="page-off" v-if="0">
        <div class="name">{{device_name}}</div>
        <div class="tip">已关闭</div>
        <div class="washer"></div>
        <div class="btns btns-fn">
            <a href="" class="btn btn-off" @click.prevent="setControl('halt')"><i></i></a>
        </div>
    </div>
</div>
</template>

<style lang="less">
*{
    padding: 0;
    margin: 0;
}
body{
    -webkit-tap-highlight-color: transparent;
    font-size: 24px;
}
a{
    text-decoration: none;
}
.page-on{
    background:#46bcff;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}
.page-off{
    background:#f2f2f2;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}
.name{
    position: absolute;
    left: 0;
    top: 156px;
    width: 100%;
    text-align: center;
    font-size:30px;
    color:#ffffff;
}
.tip{
   position: absolute;
    left: 0;
    top: 200px;
    width: 100%;
    text-align: center;
    font-size:30px;
    color:#ffffff;
    opacity:0.5;
}
.fault{
    box-sizing: border-box;
    border-radius:0 48px 48px 0;
    width:252px;
    height:78px;
    line-height: 78px;
    font-size:30px;
    color:#333333;
    padding-left: 100px;
    position: absolute;
    left: 0;
    top: 141px;
    background:#fff url(./assets/washer_icon_msg.png) no-repeat 60px center;
    background-size: 30px 30px;
}
.circle{
    width:460px;
    height:460px;
    position: absolute;
    left: 50%;
    top: 220px;
    transform: translate(-50%, 0);
    background-image: url(./assets/washer_bg_initial.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    color:#46bcff;
    &.active{
        background-image: url(./assets/washer_bg_startup.png);
        color: #fff;
    }
    & > div{
        text-align: center;
    }
    .title{
        font-size:36px;
        margin-top: 72px;
    }
    .sub_title{
        font-size:24px;
        margin-top: 40px;
    }
    .timeleft{
        font-size: 144px;
        small{
            font-size: 24px;
        }
    }
    .status{
        font-size:24px;
    }
}
//关机样式
.page-off .name{
    color:#76787a;
}
.page-off .tip{
    color:#c8cacc;
}
.washer{
    width: 420px;
    height: 420px;
    position: absolute;
    left: 50%;
    top:252px;
    transform: translate(-50%, 0);
    background: url(./assets/washer_bg_img.png) no-repeat;
    background-size: 100% 100%;
}
//弹框样式
.modal-w .modal{
    width: 1300px;
}
.model-wrap{
    display: flex;
    justify-content: center;
    .line{
        width: 1px;
        border-left: 1px solid #f0f0f0;
        height:370px;
        margin-top: 60px;
    }
    .group{
        padding: 0 50px;
        .title{
            font-size:24px;
            color:#c8cacc;
            margin-bottom: 23px;
        }
    }
}
.more-wrap{
    .group{
        .title{
            font-size:24px;
            color:#c8cacc;
        }
    }
}
//按钮样式
.btns{
    display: flex;
    justify-content: center;
    &-fn{
        position: absolute;
        left: 0;
        top: 720px;
        width: 100%;
        .btn{
            margin: 0 50px;
            color:#ffffff;
            i{
                margin-bottom: 24px;
            }
        }
    }
    &-model{
        flex-wrap: wrap;
        .btn{
            margin: 0 18px 46px;
        }
    }
    &-more_model{

    }
}
.btn{
    display: block;
    text-align: center;
    color:#76787a;
    font-size:24px;
    i{
        width: 144px;
        height: 144px;
        display: block;
        margin-bottom: 12px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    //更多
    &-more{
        position: absolute;
        right: 60px;
        top: 132px;
        i{
            width: 96px;
            height: 96px;
            background-image: url(./assets/more_normal.png);
        }
        &:active i{background-image: url(./assets/more_active.png);}
    }
    //关机
    &-on{
        i{background-image: url(./assets/washer_btn_poweroff_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_poweroff_pressed.png)}
    }
    //开机
    &-off{
        i{background-image: url(./assets/washer_btn_poweron_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_poweron_pressed.png)}
    }
    //启动
    &-start{
        i{background-image: url(./assets/washer_btn_start_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_start_pressed.png)}
        &.disable i{background-image: url(./assets/washer_btn_start_disable.png)}
    }
    //暂停
    &-pause{
        i{background-image: url(./assets/washer_btn_pause_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_pause_pressed.png)}
    }
    //模式选择
    &-mode{
        i{background-image: url(./assets/washer_btn_mode_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_mode_pressed.png)}
    }
    //预约
    &-reserve{
        i{background-image: url(./assets/washer_btn_reservation_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_reservation_pressed.png)}
        &.disable i{background-image: url(./assets/washer_btn_reservation_disable.png)}
    }
    //混合
    &-mode-mix{
        i{background-image: url(./assets/washer_btn_mixwashing_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_mixwashing_pressed.png)}
        .active i{background-image: url(./assets/washer_btn_mixwashing_selected.png)}
    }
    //棉麻
    &-mode-cotton{
        i{background-image: url(./assets/washer_btn_cotton_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_cotton_pressed.png)}
        .active i{background-image: url(./assets/washer_btn_cotton_selected.png)}
    }
    //化纤
    &-mode-synthetic{
        i{background-image: url(./assets/washer_btn_chemicalfiber_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_chemicalfiber_pressed.png)}
        .active i{background-image: url(./assets/washer_btn_chemicalfiber_selected.png)}
    }
    //羊毛衫
    &-mode-cardigan{
        i{background-image: url(./assets/washer_btn_wool_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_wool_pressed.png)}
        .active i{background-image: url(./assets/washer_btn_wool_selected.png)}
    }
    //羽绒服
    &-mode-down_coat{
        i{background-image: url(./assets/washer_btn_eiderdown_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_eiderdown_pressed.png)}
        .active i{background-image: url(./assets/washer_btn_eiderdown_selected.png)}
    }
    //婴儿服
    &-mode-baby_clothes{
        i{background-image: url(./assets/washer_btn_baby_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_baby_pressed.png)}
        .active i{background-image: url(./assets/washer_btn_baby_selected.png)}
    }
    //内衣
    &-mode-underwear{
        i{background-image: url(./assets/washer_btn_underwear_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_underwear_pressed.png)}
        .active i{background-image: url(./assets/washer_btn_underwear_selected.png)}
    }
    //牛仔
    &-mode-cowboy_suit{
        i{background-image: url(./assets/washer_btn_jeans_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_jeans_pressed.png)}
        .active i{background-image: url(./assets/washer_btn_jeans_selected.png)}
    }
    //漂洗+脱水
    &-mode-rinse_spin{
        i{background-image: url(./assets/washer_btn_rinseanddehydration_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_rinseanddehydration_pressed.png)}
        .active i{background-image: url(./assets/washer_btn_rinseanddehydration_selected.png)}
    }
    //单脱水
    &-mode-spin{
        i{background-image: url(./assets/washer_btn_dehydration_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_dehydration_pressed.png)}
        .active i{background-image: url(./assets/washer_btn_dehydration_selected.png)}
    }
    //强力洗
    &-mode-strong_wash{
        i{background-image: url(./assets/washer_btn_strongwash_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_strongwash_pressed.png)}
        .active i{background-image: url(./assets/washer_btn_strongwash_selected.png)}
    }
    //极速15'(15min快速烘干)
    &-mode-high_speed_15m{
        i{background-image: url(./assets/washer_btn_quickwash_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_quickwash_pressed.png)}
        .active i{background-image: url(./assets/washer_btn_quickwash_selected.png)}
    }
    //除螨
    &-mode-antimite{
        i{background-image: url(./assets/washer_btn_acaruskilling_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_acaruskilling_pressed.png)}
        .active i{background-image: url(./assets/washer_btn_acaruskilling_selected.png)}
    }
    //除味
    &-mode-odor_removal{
        i{background-image: url(./assets/washer_btn_deodorize_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_deodorize_pressed.png)}
        .active i{background-image: url(./assets/washer_btn_deodorize_pressed.png)}
    }
    //快速洗烘
    &-mode-speed_wash_drying{
        i{background-image: url(./assets/washer_btn_fashdrying_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_fashdrying_pressed.png)}
        .active i{background-image: url(./assets/washer_btn_fashdrying_selected.png)}
    }
    //标准烘干
    &-mode-normal_drying{
        i{background-image: url(./assets/washer_btn_drysigle_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_drysigle_pressed.png)}
        .active i{background-image: url(./assets/washer_btn_drysigle_selected.png)}
    }
}
</style>


<script>
import Modal from './components/Modal.vue'
import SwitchButton from './components/SwitchButton.vue'
import TimePicker from './components/TimePicker.vue'

function getToggle(val) {
    return val === 'on' ? 'off' : 'on'
}

export default {
    components: {
        Modal,
        SwitchButton,
        TimePicker
    },
    data() {
        return {
            status: '',
            tip: '',
            model: {},
            device_name: '',
            child_lock_flag: false,
            moreModalVisible: false,
            modeModalVisible: false,
            reserveModalVisible: false
        }
    },
    methods: {
        controlDevice(attr, val, success, error) {
            var fn = this.confirm
            if(attr == 'child_lock_switch'){
                fn = function(cb){cb()}
            }

            fn(() => {
                HdSmart.Device.control({
                    method: 'dm_set',
                    nodeid: `wash_machine.main.${attr}`,
                    params: {
                        attribute: {
                            [attr]: val
                        }
                    }
                }, () => {
                    success && success()
                }, () => {
                    error && error()
                })
            })
        },
        confirm(done) {
            if(this.model.child_lock_switch == 'on'){//HdSmart.UI.alert
                if(confirm('解除童锁后才能控制此设备，是否解除？')){
                    this.setChildLock()
                }
            }else{
                done()
            }
        },
        setControl(val) {
            this.controlDevice('control', val)
        },
        setMode(mode) {
            this.controlDevice('mode', mode)
        },
        setChildLock() {
            var val = getToggle(this.model.child_lock_switch)
            this.controlDevice('child_lock_switch', val)
        },
        setReserve(time) {
            this.controlDevice('reserve_wash', time)
        },
        setTemperature(temp){
            this.controlDevice('temperature', temp)
        },
        getSnapShot(cb) {
            HdSmart.Device.getSnapShot((data) => {
                this.onSuccess(data)
                cb && cb()
            }, () => {
                this.onError()
                cb && cb()
            })
        },
        onSuccess(data) {
            this.status = 'success'
            this.device_name = data.device_name
            this.model = data.attribute
            this.child_lock_flag = this.model.child_lock_switch == 'on' ? true : false
        },
        onError() {
            this.status = 'error'
        },
    },
    created() {
        HdSmart.ready(() => {
            HdSmart.UI.showLoading()
            this.getSnapShot(() => {
                HdSmart.UI.hideLoading()
            })
        })
        HdSmart.onDeviceListen((data) => {
            switch (data.method) {
                case 'dm_set':
                    if(data.code !== 0){
                        this.getSnapShot()
                    }
                    break
                default:
                    this.onSuccess(data.result)
                    break
            }
        })
    }
}
</script>
