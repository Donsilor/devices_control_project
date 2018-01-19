<template>
<div id="app">
    <div class="page-on" v-if="model.switch=='on'">
        <div class="name">{{device_name}}</div>
        <div class="fault" v-if="0">E15故障</div>
        <a href="" class="btn btn-more" @click.prevent="moreModalVisible = true"><i></i></a>
        <div class="circle" v-show="model.status=='halt'">
            <div class="inner">
                <div class="wave wave1"></div>
                <div class="wave wave2"></div>
                <div class="title">{{current_mode_text}}模式</div>
                <div class="sub_title">洗衣时间</div>
                <div class="timeleft" v-html="use_time"></div>
            </div>
        </div>
        <div class="circle active" v-show="model.status=='start'">
            <div class="inner">
                <div class="wave wave1"></div>
                <div class="wave wave2"></div>
                <div class="title">{{current_mode_text}}模式</div>
                <div class="sub_title">剩余总时间</div>
                <div class="timeleft" v-html="left_time"></div>
                <div class="status">{{model.operation}}</div>
            </div>
        </div>
        <div class="btns btns-fn">
            <a href="" class="btn btn-on" @click.prevent="setSwitch('off')"><i></i>关机</a>
            <a href="" class="btn btn-start" v-show="model.status=='halt'" @click.prevent="setControl('start')"><i></i>启动</a>
            <a href="" class="btn btn-pause" v-show="model.status=='start'" @click.prevent="setControl('halt')"><i></i>暂停</a>
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
                        <a href="" class="btn btn-mode-only_drying" :class="{active:model.mode=='only_drying'}" @click.prevent="setMode('only_drying')"><i></i>单烘干</a>
                        <a href="" class="btn btn-mode-spin" :class="{active:model.mode=='spin'}" @click.prevent="setMode('spin')"><i></i>单脱水</a>
                        <a href="" class="btn btn-mode-rinse_spin" :class="{active:model.mode=='rinse_spin'}" @click.prevent="setMode('rinse_spin')"><i></i>漂洗+脱水</a>
                        <a href="" class="btn btn-mode-odor_removal" :class="{active:model.mode=='odor_removal'}" @click.prevent="setMode('odor_removal')"><i></i>除味</a>
                        <a href="" class="btn btn-mode-antimite" :class="{active:model.mode=='antimite'}" @click.prevent="setMode('antimite')"><i></i>除螨</a>
                    </div>
                </div>
                <div class="group">
                    <div class="title">高级设置</div>
                    <div class="selectbox" :class="{active:currentSet==0}" v-show="temperature_options.length">
                        <div class="hd" @click="toggleSet(0)">
                            <div class="left">水温</div>
                            <div class="right">
                                <span class="value">{{current_temperature.text}}</span>
                                <i class="arrow"></i>
                            </div>
                        </div>
                        <div class="bd">
                            <span class="option"
                                v-for="item in temperature_options" :key="item.value"
                                :class="{selected:current_temperature.value==item.value}">{{item.text}}</span>
                        </div>
                    </div>
                    <div class="selectbox" :class="{active:currentSet==1}" v-show="detergent_options.length">
                        <div class="hd" @click="toggleSet(1)">
                            <div class="left">洗涤剂投放</div>
                            <div class="right">
                                <span class="value">{{current_detergent.text}}</span>
                                <i class="arrow"></i>
                            </div>
                        </div>
                        <div class="bd">
                            <span class="option"
                                v-for="item in detergent_options" :key="item.value"
                                :class="{selected:current_detergent.value==item.value}">{{item.text}}</span>
                        </div>
                    </div>
                    <div class="selectbox" :class="{active:currentSet==2}" v-show="drying_options.length">
                        <div class="hd" @click="toggleSet(2)">
                            <div class="left">烘干</div>
                            <div class="right">
                                <span class="value">{{current_drying.text}}</span>
                                <i class="arrow"></i>
                            </div>
                        </div>
                        <div class="bd">
                            <span class="option"
                                v-for="item in drying_options" :key="item.value"
                                :class="{selected:current_drying.value==item.value}">{{item.text}}</span>
                        </div>
                    </div>
                    <div class="selectbox active">
                        <div class="hd">
                            <div class="left">童锁</div>
                            <div class="right sb-wrap">
                                <switch-button :value="childLockSwitch" :sync="true" />
                                <div class="sb-btn" @click="confirmChildLock">111</div>
                            </div>
                        </div>
                        <div class="bd childlock_confirm" v-show="confirmChildLockVisible">
                            关闭童锁后，所有按键可正常使用。确定关闭？
                            <div class="right">
                                <a href="" class="cancle" @click.prevent="confirmChildLockVisible = false">取消</a>
                                <a href="" class="submit" @click.prevent="submitChildLock">关闭</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </modal>
        <!-- 预约 -->
        <modal title="预约洗衣" class="modal-w" v-model="reserveModalVisible">
            <div class="reserve-wrap">
                <span class="text1">将在</span>
                <span class="text2">小时完成洗衣</span>
                <picker :slots="numberSlot" @change="onNumberChange" :item-height="itemHeight" :visible-item-count="5"></picker>
            </div>
            <div class="reserve-foot">
                <a href="" class="cancle" @click.prevent="cancleReserve">取消</a>
                <a href="" class="submit" @click.prevent="submitReserve">确定</a>
            </div>
        </modal>
    </div>
    <div class="page-off" v-if="model.switch=='off'">
        <div class="name">{{device_name}}</div>
        <div class="tip">已关闭</div>
        <div class="washer"></div>
        <div class="btns btns-fn">
            <a href="" class="btn btn-off" @click.prevent="setSwitch('on')"><i></i></a>
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
@keyframes wave1 {
    from {
        background-position-x: 0;
    }
    to {
        background-position-x: -885px;
    }
}
@keyframes wave2 {
    from {
        background-position-x: 200px;
    }
    to {
        background-position-x: -685px;
    }
}

.circle{
    width:460px;
    height:460px;
    position: absolute;
    left: 50%;
    top: 220px;
    transform: translate(-50%, 0);
    color:#46bcff;
    background-image: url(./assets/washer_bg_initial.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    // border: 15px solid rgba(255,255,255,.75);
    // border-radius: 100%;
    // -webkit-mask-image: url(./assets/washer_bg_initial.png);
    // -webkit-mask-size: 100% 100%;

    .inner{
        position: absolute;
        left: 15px;
        top: 15px;
        width: 430px;
        height: 430px;
        border-radius: 100%;
        background: #fff;
        overflow: hidden;
        &>div{
            text-align: center;
            position: absolute;
            left: 0;
            width: 100%;
        }
    }
    .wave{
        position: absolute;
        left: 0;
        top: 30px;
        width: 100%;
        height: 100%;
        background-image: url(./assets/washer_img_wave.png);
        background-repeat: repeat-x;
        background-position-y: bottom;
        background-size: 885px 258px;
    }
    .wave1{
        background-position-x: 0px;
        animation: wave1 5s linear infinite;
    }
    .wave2{
        background-position-x: 0px;
        animation: wave2 5s linear infinite;
    }
    &.active{
        color: #fff;
        .inner{
            background-color: #46bcff
        }
        .wave{
            display: block;
        }
    }
    .title{
        font-size:36px;
        top: 66px;
    }
    .sub_title{
        font-size:24px;
        top: 150px;
    }
    .timeleft{
        font-size: 144px;
        top: 160px;
        small{
            font-size: 24px;
        }
    }
    .status{
        font-size:24px;
        top: 350px
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
            margin-bottom: 24px;
        }
    }
}
.more-wrap{
    .group{
        .title{
            font-size:24px;
            color:#c8cacc;
            margin-bottom: 24px;
        }
    }
}
.selectbox{
    .hd{
        margin: 0 46px;
        padding: 25px 46px;
        height: 40px;
        line-height: 40px;
        border-top: 1px solid #f5f5f5;
        .left{
            float: left;
        }
        .right{
            float: right;
            color:#333333;
        }
        .arrow{
            display: inline-block;
            width: 30px;
            height: 30px;
            background: url(./assets/arrow_down.png) no-repeat;
            background-size: 100% 100%;
            vertical-align: -6px;
            margin-left: 10px;
        }
    }
    .bd{
        display: none;
        overflow: hidden;
        padding:31px 92px;
        background:#fafafa;
        .option{
            display: block;
            padding: 12px 36px;
            color:#76787a;
            &.selected{
                background:#46bcff;
                // border:1px solid #46bcff;
                border-radius:3px;
                color:#fff;
            }
        }
    }
    &.active{
        .hd{
            .arrow{
                transform: rotate(-180deg);
            }
        }
        .bd{
            display: flex;
        }
    }
}
.sb-wrap{
    position: relative;
}
.sb-btn{
    position: absolute;
    left: 0;
    top: 0;
    z-index: 5;
    width: 100%;
    height: 100%;
    background: red;
    opacity: 0;
}

.reserve-wrap{
    width: 504px;
    margin: 0 auto 90px;
    position: relative;
    .text1{
        position: absolute;
        left: 5px;
        top: 180px;
        line-height: 90px;
    }
    .text2{
        position: absolute;
        right: 5px;
        top: 180px;
        line-height: 90px;
    }
}
.reserve-foot{
    display: flex;
    justify-content: center;
    a{
        width:240px;
        height:84px;
        border-radius:6px;
        display: block;
        line-height: 84px;
        margin: 0 12px;
        font-size:36px;
        box-sizing: border-box;
    }
    .cancle{
        background:#ffffff;
        border:1px solid #76787a;
        color:#76787a;
    }
    .submit{
        background:#46bcff;
        color:#ffffff;
    }
}
.childlock_confirm{
    .right{
        float: right;
    }
    a{
        width:178px;
        height:68px;
        border-radius:6px;
        display: block;
        line-height: 84px;
        margin: 0 12px;
        font-size:36px;
        box-sizing: border-box;
    }
    .cancle{
        background:#ffffff;
        border:1px solid #76787a;
        color:#76787a;
    }
    .submit{
        background:#46bcff;
        color:#ffffff;
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
        .btn{
            margin:0 55px 36px;
           i{
               width: 90px;
               height: 90px;
           }
        }
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
        margin:0 auto 12px;
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
        &.active i{background-image: url(./assets/washer_btn_mixwashing_selected.png)}
    }
    //棉麻
    &-mode-cotton{
        i{background-image: url(./assets/washer_btn_cotton_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_cotton_pressed.png)}
        &.active i{background-image: url(./assets/washer_btn_cotton_selected.png)}
    }
    //化纤
    &-mode-synthetic{
        i{background-image: url(./assets/washer_btn_chemicalfiber_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_chemicalfiber_pressed.png)}
        &.active i{background-image: url(./assets/washer_btn_chemicalfiber_selected.png)}
    }
    //羊毛衫
    &-mode-cardigan{
        i{background-image: url(./assets/washer_btn_wool_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_wool_pressed.png)}
        &.active i{background-image: url(./assets/washer_btn_wool_selected.png)}
    }
    //羽绒服
    &-mode-down_coat{
        i{background-image: url(./assets/washer_btn_eiderdown_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_eiderdown_pressed.png)}
        &.active i{background-image: url(./assets/washer_btn_eiderdown_selected.png)}
    }
    //婴儿服
    &-mode-baby_clothes{
        i{background-image: url(./assets/washer_btn_baby_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_baby_pressed.png)}
        &.active i{background-image: url(./assets/washer_btn_baby_selected.png)}
    }
    //内衣
    &-mode-underwear{
        i{background-image: url(./assets/washer_btn_underwear_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_underwear_pressed.png)}
        &.active i{background-image: url(./assets/washer_btn_underwear_selected.png)}
    }
    //牛仔
    &-mode-cowboy_suit{
        i{background-image: url(./assets/washer_btn_jeans_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_jeans_pressed.png)}
        &.active i{background-image: url(./assets/washer_btn_jeans_selected.png)}
    }
    //漂洗+脱水
    &-mode-rinse_spin{
        i{background-image: url(./assets/washer_btn_rinseanddehydration_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_rinseanddehydration_pressed.png)}
        &.active i{background-image: url(./assets/washer_btn_rinseanddehydration_selected.png)}
    }
    //单脱水
    &-mode-spin{
        i{background-image: url(./assets/washer_btn_dehydration_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_dehydration_pressed.png)}
        &.active i{background-image: url(./assets/washer_btn_dehydration_selected.png)}
    }
    //强力洗
    &-mode-strong_wash{
        i{background-image: url(./assets/washer_btn_strongwash_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_strongwash_pressed.png)}
        &.active i{background-image: url(./assets/washer_btn_strongwash_selected.png)}
    }
    //极速15'(15min快速烘干)
    &-mode-high_speed_15m{
        i{background-image: url(./assets/washer_btn_quickwash_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_quickwash_pressed.png)}
        &.active i{background-image: url(./assets/washer_btn_quickwash_selected.png)}
    }
    //除螨
    &-mode-antimite{
        i{background-image: url(./assets/washer_btn_acaruskilling_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_acaruskilling_pressed.png)}
        &.active i{background-image: url(./assets/washer_btn_acaruskilling_selected.png)}
    }
    //除味
    &-mode-odor_removal{
        i{background-image: url(./assets/washer_btn_deodorize_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_deodorize_pressed.png)}
        &.active i{background-image: url(./assets/washer_btn_deodorize_selected.png)}
    }
    //快速洗烘
    &-mode-speed_wash_drying{
        i{background-image: url(./assets/washer_btn_fashdrying_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_fashdrying_pressed.png)}
        &.active i{background-image: url(./assets/washer_btn_fashdrying_selected.png)}
    }
    //标准烘干
    &-mode-only_drying{
        i{background-image: url(./assets/washer_btn_drysigle_normal.png)}
        &:active i{background-image: url(./assets/washer_btn_drysigle_pressed.png)}
        &.active i{background-image: url(./assets/washer_btn_drysigle_selected.png)}
    }
}
</style>


<script>
import Modal from './components/Modal.vue'
import SwitchButton from './components/SwitchButton.vue'
import Picker from './components/Picker/picker.vue'

const radio = (document.documentElement.clientWidth || window.innerWidth) / 1920 * 75
const MODE_OPTIONS = {
    mix: {
        text: '混合',
        temperature: {
            options: [0,1,2,3],
            default: 0
        },
        drying: {
            options: [0,1,2,3,4],
            default: 0
        },
        detergent: {
            options: [0,1,2],
            default: 0
        }
    },
    cotton: {
        text: '棉麻',
        temperature: {
            options: [0,1,2,3,4,5],
            default: 0
        },
        drying: {
            options: [0,1,2,3,4],
            default: 0
        },
        detergent: {
            options: [0,1,2],
            default: 0
        }
    },
    synthetic: {
        text: '化纤',
        temperature: {
            options: [0,1,2,3,4,],
            default: 0
        },
        drying: {
            options: [0,1,2,3,4],
            default: 0
        },
        detergent: {
            options: [0,1,2],
            default: 0
        }
    },
    cardigan: {
        text: '羊毛衫',
        temperature: {
            options: [0,1,2,3],
            default: 0
        },
        drying: {
            options: [],
            default: 0
        },
        detergent: {
            options: [0,1,2],
            default: 0
        }
    },
    down_coat: {
        text: '羽绒服',
        temperature: {
            options: [0,1,2,3],
            default: 2
        },
        drying: {
            options: [0,1,2,3,4],
            default: 0
        },
        detergent: {
            options: [0,1,2],
            default: 0
        }
    },
    baby_clothes: {
        text: '婴儿服',
        temperature: {
            options: [0,1,2,3,4],
            default: 2
        },
        drying: {
            options: [0,1,2,3,4],
            default: 0
        },
        detergent: {
            options: [0,1,2],
            default: 0
        }
    },
    underwear: {
        text: '内衣',
        temperature: {
            options: [0,1,2,3],
            default: 3
        },
        drying: {
            options: [0,1,2,3,4],
            default: 0
        },
        detergent: {
            options: [0,1,2],
            default: 0
        }
    },
    cowboy_suit: {
        text: '牛仔',
        temperature: {
            options: [0,1,2,3],
            default: 2
        },
        drying: {
            options: [0,1,2,3,4],
            default: 0
        },
        detergent: {
            options: [0,1,2],
            default: 0
        }
    },
    rinse_spin: {
        text: '漂洗+脱水',
        temperature: {
            options: [0],
            default: 0
        },
        drying: {
            options: [0,1,2,3,4],
            default: 0
        },
        detergent: {
            options: [],
            default: 0
        }
    },
    spin: {
        text: '单脱水',
        temperature: {
            options: [0],
            default: 0
        },
        drying: {
            options: [0,1,2,3,4],
            default: 0
        },
        detergent: {
            options: [],
            default: 0
        }
    },
    strong_wash: {
        text: '强力洗',
        temperature: {
            options: [0,1,2,3,4],
            default: 3
        },
        drying: {
            options: [0,1,2,3,4],
            default: 0
        },
        detergent: {
            options: [0,1,2],
            default: 0
        }
    },
    high_speed_15m: {
        text: '极速15',
        temperature: {
            options: [0],
            default: 0
        },
        drying: {
            options: [0,1,2,3,4],
            default: 0
        },
        detergent: {
            options: [0,1,2],
            default: 0
        }
    },
    antimite: {
        text: '除螨',
        temperature: {
            options: [],
            default: 0
        },
        drying: {
            options: [4],
            default: 0
        },
        detergent: {
            options: [],
            default: 0
        }
    },
    odor_removal: {
        text: '除味',
        temperature: {
            options: [],
            default: 0
        },
        drying: {
            options: [4],
            default: 0
        },
        detergent: {
            options: [],
            default: 0
        }
    },
    speed_wash_drying: {
        text: '快速洗烘',
        temperature: {
            options: [0],
            default: 0
        },
        drying: {
            options: [1],
            default: 0
        },
        detergent: {
            options: [0,1,2],
            default: 0
        }
    },
    normal_drying: {
        text: '标准烘干',
        temperature: {
            options: [],
            default: 0
        },
        drying: {
            options: [1,2,3,4],
            default: 0
        },
        detergent: {
            options: [],
            default: 0
        }
    },
    only_drying: {
        text: '单烘干',
        temperature: {
            options: [],
            default: 0
        },
        drying: {
            options: [1,2,3,4],
            default: 0
        },
        detergent: {
            options: [],
            default: 0
        }
    },
}
const RESERVE_TIME_OPTIONS = [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
const TEMPERATURE_OPTIONS = [
    {value: '0', text:'冷洗'},
    {value: '20', text:'20℃'},
    {value: '30', text:'30℃'},
    {value: '40', text:'40℃'},
    {value: '60', text:'60℃'},
    {value: '95', text:'95℃'},
]
const DRY_OPTIONS = [
    {value: 'no_drying', text: '不烘干'},
    {value: 'normal_drying', text: '标准'},
    {value: 'strong_drying', text: '特干'},
    {value: 'air_drying', text: '晾干'},
    {value: 'time_drying', text: '定时'},
]
const DETERGENT_OPTIONS = [
    {value: 'non_condensed', text: '非浓缩'},
    {value: 'condensed', text: '浓缩'},
    {value: 'non_auto', text: '非自动'}
]

function getToggle(val) {
    return val === 'on' ? 'off' : 'on'
}

function formatTime(time) {
    var hour = Math.floor(time / 60)
    var minute = time % 60
    var result = ''
    if(hour > 0){
        result += `${hour}<small>时</small>`
    }
    result += `${minute}<small>分</small>`
    return result
}

export default {
    components: {
        Modal,
        SwitchButton,
        Picker
    },
    data() {
        return {
            status: '',
            tip: '',
            model: {},
            device_name: '',
            moreModalVisible: false,
            modeModalVisible: false,
            reserveModalVisible: false,
            currentReserveTime: 0,
            childLockSwitch: false,
            confirmChildLockVisible: false,
            currentSet: -1,
            // numberSlot: [{
            //     flex: 1,
            //     defaultIndex: 0,
            //     values: makeArray(3, 24),
            //     className: 'slot1'
            // }],
            number: 0,
            itemHeight: 1.2 * radio,
            current_temperature: {},
            current_drying: {},
            current_detergent: {},
            temperature_options: [],
            drying_options: [],
            detergent_options: [],
            current_mode_text: '',
        }
    },
    computed: {
        numberSlot() {
            // var now = new Date()
            // var currentHour = now.getHours()
            // var currentMinute = now.getMinutes()
            var values = RESERVE_TIME_OPTIONS.map((item, i) => {
                // var hour = currentHour + item
                // if(hour >= 24){
                //     hour = `次日${hour-24}`
                // }
                // return `${hour} : ${currentMinute}`
                return `${item}`
            })
            return [{
                flex: 1,
                defaultIndex: 0,
                values: values,
                className: 'slot1'
            }]
        },
        use_time() {
            return formatTime(this.model.time_use)
        },
        left_time() {
            return formatTime(this.model.time_left)
        }
    },
    watch: {
        'model.mode'() {
            this.onModeChange()
        }
    },
    methods: {
        onModeChange() {
            if(!this.model.mode || !MODE_OPTIONS[this.model.mode]){
                return
            }
            var currentModeConfig = MODE_OPTIONS[this.model.mode]
            var temperatureConfig = currentModeConfig.temperature
            var dryingConfig = currentModeConfig.drying
            var detergentConfig = currentModeConfig.detergent

            this.current_mode_text = currentModeConfig.text

            this.temperature_options = TEMPERATURE_OPTIONS.filter((item, i) => {
                return temperatureConfig.options.indexOf(i) >= 0
            })
            if(this.temperature_options.length){
                this.current_temperature = this.temperature_options[temperatureConfig.default]
            }else{
                this.current_temperature = {}
            }

            this.drying_options = DRY_OPTIONS.filter((item, i) => {
                return dryingConfig.options.indexOf(i) >= 0
            })
            if(this.drying_options.length){
                this.current_drying = this.drying_options[dryingConfig.default]
            }else{
                this.current_drying = {}
            }

            this.detergent_options = DETERGENT_OPTIONS.filter((item, i) => {
                return detergentConfig.options.indexOf(i) >= 0
            })
            if(this.detergent_options.length){
                this.current_detergent = this.detergent_options[detergentConfig.default]
            }else{
                this.current_detergent = {}
            }

        },
        controlDevice(attr, val, success, error) {
            if(attr != 'child_lock_switch' && this.model.child_lock_switch == 'on'){
                HdSmart.UI.toast('请先关闭童锁')
                return
            }

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
        },
        setSwitch(val) {
            this.controlDevice('switch', val)
        },
        setControl(val) {
            this.controlDevice('control', val)
        },
        setMode(mode) {
            this.controlDevice('mode', mode)
        },
        setChildLock(val) {
            // var val = getToggle(this.model.child_lock_switch)
            this.controlDevice('child_lock_switch', val)
        },
        setReserve(time) {
            this.controlDevice('reserve_wash', time)
        },
        setTemperature(temp){
            this.controlDevice('temperature', temp)
        },
        cancleReserve() {
            this.reserveModalVisible = false
        },
        submitReserve() {
            this.reserveModalVisible = false
            this.setReserve(this.number)
        },
        onNumberChange(picker, values) {
            this.number = values[0]
        },
        confirmChildLock() {
            if(this.childLockSwitch){
                this.confirmChildLockVisible = true
            }else{
                this.setChildLock('on')
            }
        },
        submitChildLock() {
            this.confirmChildLockVisible = false
            this.setChildLock('off')
        },
        toggleSet(index) {
            this.currentSet = this.currentSet == index ? -1 : index
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
            if(data.device_name){
                this.device_name = data.device_name
            }
            this.model = data.attribute
            this.childLockSwitch = this.model.child_lock_switch == 'on' ? true : false
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
