<template>
    <div id="app">
        <div class="page-on" v-if="model.switch=='on'">
            <div class="name">{{device_name}}</div>
            <div class="fault" v-if="errors.length">
                <span v-for="item in errors" :key="item.code" @click="showAlarmTip(item)">{{item.code}}故障</span>
            </div>
            <a href="" class="btn btn-more" @click.prevent="moreModalVisible = true">
                <i></i>
            </a>
            <!-- 待机 -->
            <div class="circle" v-show="isStandby || isFinish">
                <div class="inner">
                    <div class="title">{{currentModeConfig.text}}模式</div>
                    <template v-if="isStandby">
                        <div class="sub_title">洗衣时间</div>
                        <div class="timeleft" v-html="time_left"></div>
                    </template>
                    <template v-else>
                        <div class="ok"></div>
                        <div class="status">洗衣完成</div>
                    </template>
                </div>
            </div>
            <!-- 运行中 -->
            <div class="circle active" :class="{run:isRun}" v-show="isRun || isPause">
                <div class="inner">
                    <div class="wave wave1"></div>
                    <div class="wave wave2"></div>
                    <div class="title">{{currentModeConfig.text}}模式</div>
                    <template v-if="model.operation == 'reserve'">
                        <div class="sub_title">预约时间</div>
                        <div class="timeleft">{{model.reserve_wash}}
                            <small>时</small>
                        </div>
                    </template>
                    <template v-else>
                        <div class="sub_title">剩余总时间</div>
                        <div class="timeleft" v-html="time_left"></div>
                    </template>
                    <div class="status">{{operationText}}</div>
                    <div class="lock" v-show="childLockSwitch"></div>
                </div>
            </div>
            <!-- 完成 -->
            <div class="btns btns-fn">
                <a href="" class="btn btn-on" @click.prevent="setSwitch('off')">
                    <i></i>关机</a>
                <a href="" class="btn btn-start" v-show="isStandby || isPause || isFinish" @click.prevent="setControl('start')">
                    <i></i>启动</a>
                <a href="" class="btn btn-pause" v-show="isRun" @click.prevent="setControl('halt')">
                    <i></i>暂停</a>
                <a href="" class="btn btn-mode" @click.prevent="modeModalVisible = true">
                    <i></i>模式选择</a>
                <!-- <a href="" class="btn btn-reserve" @click.prevent="reserveModalVisible = true"><i></i>预约洗衣</a> -->
            </div>

            <!-- 模式 -->
            <sub-page title="模式选择" class="modal-w" v-model="modeModalVisible">
                <div class="model-wrap">
                    <div class="group">
                        <div class="title">快洗</div>
                        <div class="btns btns-model">
                            <mode-button mode="high_speed_15m">快速15分钟</mode-button>
                            <mode-button mode="speed_wash_drying">快速洗烘</mode-button>
                        </div>
                    </div>
                    <div class="line"></div>
                    <div class="group">
                        <div class="title">面料</div>
                        <div class="btns btns-model">
                            <mode-button mode="mix">混合</mode-button>
                            <mode-button mode="cotton">棉麻</mode-button>
                            <mode-button mode="synthetic">化纤</mode-button>
                            <mode-button mode="cardigan">羊毛</mode-button>
                        </div>
                    </div>
                    <div class="line"></div>
                    <div class="group">
                        <div class="title">衣物类型</div>
                        <div class="btns btns-model">
                            <mode-button mode="baby_clothes">婴儿服</mode-button>
                            <mode-button mode="underwear">内衣</mode-button>
                            <mode-button mode="cowboy_suit">牛仔</mode-button>
                            <mode-button mode="down_coat">羽绒服</mode-button>
                        </div>
                    </div>
                </div>
            </sub-page>
            <!-- 更多 -->
            <sub-page title="更多" class="modal-w modal-more" v-model="moreModalVisible">
                <div class="more-wrap">
                    <div class="group">
                        <div class="title">更多模式</div>
                        <div class="btns btns-more_model">
                            <mode-button mode="strong_wash">强力</mode-button>
                            <mode-button mode="normal_drying">标准烘干</mode-button>
                            <mode-button mode="spin">单脱水</mode-button>
                            <mode-button mode="rinse_spin">漂洗+脱水</mode-button>
                            <mode-button mode="odor_removal">除味</mode-button>
                            <mode-button mode="antimite">除螨</mode-button>
                        </div>
                    </div>
                    <div class="group">
                        <div class="title">高级设置</div>
                        <div class="selectbox" :class="{active:currentSet==0,disable:isRun||isPause}" v-show="temperatureOptions.length">
                            <div class="hd" @click="toggleSet(0)">
                                <div class="left">水温</div>
                                <div class="right">
                                    <span class="value">{{currentTemperature.text}}</span>
                                    <i class="arrow"></i>
                                </div>
                            </div>
                            <div class="bd">
                                <span class="option" v-for="item in temperatureOptions" :key="item.value" @click="setTemperature(item)" :class="{selected:currentTemperature.value==item.value}">{{item.text}}</span>
                            </div>
                        </div>
                        <div class="selectbox" :class="{active:currentSet==1,disable:isRun||isPause}" v-show="detergentOptions.length">
                            <div class="hd" @click="toggleSet(1)">
                                <div class="left">洗涤剂投放</div>
                                <div class="right">
                                    <span class="value">{{currentDetergent.text}}</span>
                                    <i class="arrow"></i>
                                </div>
                            </div>
                            <div class="bd">
                                <span class="option" v-for="item in detergentOptions" :key="item.value" @click="setDetergent(item)" :class="{selected:currentDetergent.value==item.value}">{{item.text}}</span>
                            </div>
                        </div>
                        <div class="selectbox" :class="{active:currentSet==2,disable:isRun||isPause}" v-show="dryingOptions.length">
                            <div class="hd" @click="toggleSet(2)">
                                <div class="left">烘干</div>
                                <div class="right">
                                    <span class="value">{{currentDrying.text}}</span>
                                    <i class="arrow"></i>
                                </div>
                            </div>
                            <div class="bd">
                                <span class="option" v-for="item in dryingOptions" :key="item.value" @click="setDrying(item)" :class="{selected:currentDrying.value==item.value}">{{item.text}}</span>
                            </div>
                        </div>
                        <div class="selectbox" :class="{disable:!isRun}">
                            <div class="hd">
                                <div class="left">童锁</div>
                                <div class="right sb-wrap">
                                    <switch-button :value="childLockSwitch" :sync="true" :disabled="!isRun" />
                                    <div class="sb-btn" @click="confirmChildLock"></div>
                                </div>
                            </div>
                            <div class="bd1 childlock_confirm" v-show="confirmChildLockVisible">
                                关闭童锁后，所有按键可正常使用。确定关闭？
                                <div class="right">
                                    <a href="" class="cancel" @click.prevent="confirmChildLockVisible = false">取消</a>
                                    <a href="" class="submit" @click.prevent="submitChildLock">关闭</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </sub-page>
            <!-- 预约 -->
            <modal title="预约洗衣" class="modal-w" v-model="reserveModalVisible">
                <div class="reserve-wrap">
                    <span class="text1">将在</span>
                    <span class="text2">小时完成洗衣</span>
                    <picker :slots="numberSlot" @change="onNumberChange" :item-height="itemHeight" :visible-item-count="5"></picker>
                </div>
                <div class="reserve-foot">
                    <a href="" class="cancel" @click.prevent="cancelReserve">取消</a>
                    <a href="" class="submit" @click.prevent="submitReserve">确定</a>
                </div>
            </modal>
        </div>
        <div class="page-off" v-if="model.switch=='off'">
            <div class="name">{{device_name}}</div>
            <div class="tip">已关闭</div>
            <div class="washer"></div>
            <div class="btns btns-fn">
                <a href="" class="btn btn-off" @click.prevent="setSwitch('on')">
                    <i></i>
                </a>
            </div>
        </div>

        <!--初始化失败界面-->
        <div class="page-error" v-if="status=='error' || model.operation=='abnormal'" @click="getSnapShot">
            <div class="error-tip">
                <img src='../../lib/base/washer/assets/init_err.png' />
                <p>加载失败，请点击屏幕刷新</p>
            </div>
        </div>
    </div>
</template>

<style lang="less">
* {
    padding: 0;
    margin: 0;
}
body {
    -webkit-tap-highlight-color: transparent;
    font-size: 24px;
}
a {
    text-decoration: none;
}
.page-on {
    background: #46bcff;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}
.page-off {
    background: #f2f2f2;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}
.name {
    position: absolute;
    left: 0;
    top: 156px;
    width: 100%;
    text-align: center;
    font-size: 30px;
    color: #ffffff;
}
.tip {
    position: absolute;
    left: 0;
    top: 200px;
    width: 100%;
    text-align: center;
    font-size: 30px;
    color: #ffffff;
    opacity: 0.5;
}
.fault {
    position: absolute;
    left: 0;
    top: 141px;

    span {
        box-sizing: border-box;
        border-radius: 0 48px 48px 0;
        width: 252px;
        height: 78px;
        line-height: 78px;
        font-size: 30px;
        color: #333333;
        padding-left: 100px;
        background: #fff url(../../lib/base/washer/assets/washer_icon_msg.png)
            no-repeat 60px center;
        background-size: 30px 30px;
        display: block;
        margin-bottom: 5px;
        white-space: nowrap;
    }
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

.circle {
    width: 460px;
    height: 460px;
    position: absolute;
    left: 50%;
    top: 220px;
    transform: translate(-50%, 0);
    color: #46bcff;
    background-image: url(../../lib/base/washer/assets/washer_bg_initial.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .inner {
        position: absolute;
        left: 15px;
        top: 15px;
        width: 430px;
        height: 430px;
        border-radius: 100%;
        background: #fff;
        overflow: hidden;
        & > div {
            text-align: center;
            position: absolute;
            left: 0;
            width: 100%;
        }
    }
    .wave {
        position: absolute;
        left: 0;
        top: 30px;
        width: 100%;
        height: 100%;
        background-image: url(../../lib/base/washer/assets/washer_img_wave.png);
        background-repeat: repeat-x;
        background-position-y: bottom;
        background-size: 885px 258px;
    }

    .wave1 {
        background-position-x: 0px;
    }
    .wave2 {
        background-position-x: -150px;
    }

    &.active {
        color: #fff;
        .inner {
            background-color: #46bcff;
        }
        .wave {
            display: block;
        }
    }
    &.run {
        .wave1 {
            animation: wave1 5s linear infinite;
        }
        .wave2 {
            animation: wave2 5s linear infinite;
        }
    }
    .title {
        font-size: 36px;
        top: 66px;
    }
    .sub_title {
        font-size: 24px;
        top: 150px;
    }
    .timeleft {
        font-size: 144px;
        top: 160px;
        small {
            font-size: 24px;
        }
    }
    .status {
        font-size: 24px;
        top: 350px;
    }
    .lock {
        background: url(../../lib/base/washer/assets/washer_icon_childlock_normal.png)
            no-repeat;
        background-size: 100% 100%;
        width: 36px !important;
        height: 36px !important;
        left: 50% !important;
        transform: translateX(-50%);
        top: 20px;
    }
    .ok {
        width: 190px !important;
        height: 190px !important;
        left: 120px !important;
        top: 141px;
        background: url(../../lib/base/washer/assets/icon_normal.png) no-repeat;
        background-size: 100% 100%;
    }
}
//关机样式
.page-off .name {
    color: #76787a;
}
.page-off .tip {
    color: #c8cacc;
}
.washer {
    width: 420px;
    height: 420px;
    position: absolute;
    left: 50%;
    top: 252px;
    transform: translate(-50%, 0);
    background: url(../../lib/base/washer/assets/washer_bg_img.png) no-repeat;
    background-size: 100% 100%;
}
//弹框样式

.model-wrap {
    .group {
        .title {
            text-align: center;
            font-size: 28px;
            color: #76787a;
            margin: 60px 0 24px;
            font-weight: bold;
        }
    }
}
.more-wrap {
    .group {
        .title {
            text-align: center;
            font-size: 28px;
            color: #76787a;
            margin: 60px 0 24px;
            font-weight: bold;
        }
    }
}
.selectbox {
    .hd {
        margin: 0 32px;
        padding: 20px 0px;
        height: 40px;
        line-height: 40px;
        border-top: 1px solid #f5f5f5;
        .left {
            float: left;
        }
        .right {
            float: right;
            color: #333333;
        }
        .arrow {
            display: inline-block;
            width: 30px;
            height: 30px;
            background: url(../../lib/base/washer/assets/arrow_down.png)
                no-repeat;
            background-size: 100% 100%;
            vertical-align: -6px;
            margin-left: 10px;
        }
    }
    .bd {
        display: none;
        overflow: hidden;
        padding: 31px 32px;
        background: #fafafa;
        .option {
            display: block;
            padding: 12px 36px;
            color: #76787a;
            &.selected {
                background: #46bcff;
                // border:1px solid #46bcff;
                border-radius: 3px;
                color: #fff;
            }
        }
    }
    .bd1 {
        overflow: hidden;
        padding: 20px 92px;
        background: #fafafa;
        text-align: left;
    }
    &.active {
        .hd {
            .arrow {
                transform: rotate(-180deg);
            }
        }
        .bd {
            display: flex;
        }
    }
    &.disable {
        opacity: 0.5;
    }
}
.sb-wrap {
    position: relative;
}
.sb-btn {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 5;
    width: 100%;
    height: 100%;
    background: red;
    opacity: 0;
}

.reserve-wrap {
    width: 504px;
    margin: 0 auto 60px;
    position: relative;
    .text1 {
        position: absolute;
        left: 5px;
        top: 180px;
        line-height: 90px;
    }
    .text2 {
        position: absolute;
        right: 5px;
        top: 180px;
        line-height: 90px;
    }
}
.reserve-foot {
    display: flex;
    justify-content: center;
    a {
        width: 240px;
        height: 84px;
        border-radius: 6px;
        display: block;
        line-height: 84px;
        margin: 0 12px;
        font-size: 36px;
        box-sizing: border-box;
    }
    .cancel {
        background: #ffffff;
        border: 1px solid #76787a;
        color: #76787a;
    }
    .submit {
        background: #46bcff;
        color: #ffffff;
    }
}
.childlock_confirm {
    text-align: center;
    .right {
        text-align: center;
        margin-top: 15px;
    }
    a {
        width: 100px;
        line-height: 42px;
        border-radius: 6px;
        margin: 0 10px;
        display: inline-block;
        font-size: 28px;
        box-sizing: border-box;
        text-align: center;
    }
    .cancel {
        background: #ffffff;
        border: 1px solid #76787a;
        color: #76787a;
    }
    .submit {
        background: #46bcff;
        border: 1px solid #46bcff;
        color: #ffffff;
    }
}
//按钮样式
.btns {
    display: flex;
    &-fn {
        position: absolute;
        left: 0;
        top: 720px;
        width: 100%;
        justify-content: center;
        .btn {
            margin: 0 50px;
            color: #ffffff;
            i {
                margin-bottom: 24px;
            }
        }
    }
    &-model {
        flex-wrap: wrap;
        padding-left: 20px;
        .btn {
            margin: 0 28px;
        }
    }
    &-more_model {
        flex-wrap: wrap;
        padding-left: 20px;
        .btn {
            margin: 0 28px 50px;
        }
    }
}
.btn {
    display: block;
    text-align: center;
    font-size: 28px;
    color: #76787a;
    i {
        width: 120px;
        height: 120px;
        display: block;
        margin: 0 auto 12px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    //更多
    &-more {
        position: absolute;
        right: 40px;
        top: 132px;
        i {
            width: 96px;
            height: 96px;
            background-image: url(../../lib/base/washer/assets/more_normal.png);
        }
        &:active i {
            background-image: url(../../lib/base/washer/assets/more_active.png);
        }
    }
    //关机
    &-on {
        i {
            background-image: url(../../lib/base/washer/assets/washer_btn_poweroff_normal.png);
        }
        &:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_poweroff_pressed.png);
        }
    }
    //开机
    &-off {
        i {
            background-image: url(../../lib/base/washer/assets/washer_btn_poweron_normal.png);
        }
        &:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_poweron_pressed.png);
        }
    }
    //启动
    &-start {
        i {
            background-image: url(../../lib/base/washer/assets/washer_btn_start_normal.png);
        }
        &:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_start_pressed.png);
        }
        &.disable i {
            background-image: url(../../lib/base/washer/assets/washer_btn_start_disable.png);
        }
    }
    //暂停
    &-pause {
        i {
            background-image: url(../../lib/base/washer/assets/washer_btn_pause_normal.png);
        }
        &:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_pause_pressed.png);
        }
    }
    //模式选择
    &-mode {
        i {
            background-image: url(../../lib/base/washer/assets/washer_btn_mode_normal.png);
        }
        &:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_mode_pressed.png);
        }
    }
    //预约
    &-reserve {
        i {
            background-image: url(../../lib/base/washer/assets/washer_btn_reservation_normal.png);
        }
        &:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_reservation_pressed.png);
        }
        &.disable i {
            background-image: url(../../lib/base/washer/assets/washer_btn_reservation_disable.png);
        }
    }
    //混合
    &-mode-mix {
        i {
            background-image: url(../../lib/base/washer/assets/washer_btn_mixwashing_normal.png);
        }
        &:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_mixwashing_pressed.png);
        }
        &.active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_mixwashing_selected.png);
        }
        &.disable:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_mixwashing_normal.png);
        }
    }
    //棉麻
    &-mode-cotton {
        i {
            background-image: url(../../lib/base/washer/assets/washer_btn_cotton_normal.png);
        }
        &:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_cotton_pressed.png);
        }
        &.active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_cotton_selected.png);
        }
        &.disable:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_cotton_normal.png);
        }
    }
    //化纤
    &-mode-synthetic {
        i {
            background-image: url(../../lib/base/washer/assets/washer_btn_chemicalfiber_normal.png);
        }
        &:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_chemicalfiber_pressed.png);
        }
        &.active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_chemicalfiber_selected.png);
        }
        &.disable:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_chemicalfiber_normal.png);
        }
    }
    //羊毛衫
    &-mode-cardigan {
        i {
            background-image: url(../../lib/base/washer/assets/washer_btn_wool_normal.png);
        }
        &:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_wool_pressed.png);
        }
        &.active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_wool_selected.png);
        }
        &.disable:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_wool_normal.png);
        }
    }
    //羽绒服
    &-mode-down_coat {
        i {
            background-image: url(../../lib/base/washer/assets/washer_btn_eiderdown_normal.png);
        }
        &:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_eiderdown_pressed.png);
        }
        &.active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_eiderdown_selected.png);
        }
        &.disable:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_eiderdown_normal.png);
        }
    }
    //婴儿服
    &-mode-baby_clothes {
        i {
            background-image: url(../../lib/base/washer/assets/washer_btn_baby_normal.png);
        }
        &:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_baby_pressed.png);
        }
        &.active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_baby_selected.png);
        }
        &.disable:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_baby_normal.png);
        }
    }
    //内衣
    &-mode-underwear {
        i {
            background-image: url(../../lib/base/washer/assets/washer_btn_underwear_normal.png);
        }
        &:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_underwear_pressed.png);
        }
        &.active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_underwear_selected.png);
        }
        &.disable:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_underwear_normal.png);
        }
    }
    //牛仔
    &-mode-cowboy_suit {
        i {
            background-image: url(../../lib/base/washer/assets/washer_btn_jeans_normal.png);
        }
        &:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_jeans_pressed.png);
        }
        &.active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_jeans_selected.png);
        }
        &.disable:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_jeans_normal.png);
        }
    }
    //漂洗+脱水
    &-mode-rinse_spin {
        i {
            background-image: url(../../lib/base/washer/assets/washer_btn_rinseanddehydration_normal.png);
        }
        &:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_rinseanddehydration_pressed.png);
        }
        &.active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_rinseanddehydration_selected.png);
        }
        &.disable:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_rinseanddehydration_normal.png);
        }
    }
    //单脱水
    &-mode-spin {
        i {
            background-image: url(../../lib/base/washer/assets/washer_btn_dehydration_normal.png);
        }
        &:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_dehydration_pressed.png);
        }
        &.active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_dehydration_selected.png);
        }
        &.disable:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_dehydration_normal.png);
        }
    }
    //强力洗
    &-mode-strong_wash {
        i {
            background-image: url(../../lib/base/washer/assets/washer_btn_strongwash_normal.png);
        }
        &:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_strongwash_pressed.png);
        }
        &.active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_strongwash_selected.png);
        }
        &.disable:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_strongwash_normal.png);
        }
    }
    //极速15'(15min快速烘干)
    &-mode-high_speed_15m {
        i {
            background-image: url(../../lib/base/washer/assets/washer_btn_quickwash_normal.png);
        }
        &:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_quickwash_pressed.png);
        }
        &.active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_quickwash_selected.png);
        }
        &.disable:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_quickwash_normal.png);
        }
    }
    //除螨
    &-mode-antimite {
        i {
            background-image: url(../../lib/base/washer/assets/washer_btn_acaruskilling_normal.png);
        }
        &:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_acaruskilling_pressed.png);
        }
        &.active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_acaruskilling_selected.png);
        }
        &.disable:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_acaruskilling_normal.png);
        }
    }
    //除味
    &-mode-odor_removal {
        i {
            background-image: url(../../lib/base/washer/assets/washer_btn_deodorize_normal.png);
        }
        &:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_deodorize_pressed.png);
        }
        &.active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_deodorize_selected.png);
        }
        &.disable:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_deodorize_normal.png);
        }
    }
    //快速洗烘
    &-mode-speed_wash_drying {
        i {
            background-image: url(../../lib/base/washer/assets/washer_btn_fashdrying_normal.png);
        }
        &:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_fashdrying_pressed.png);
        }
        &.active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_fashdrying_selected.png);
        }
        &.disable:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_fashdrying_normal.png);
        }
    }
    //标准烘干
    &-mode-only_drying {
        i {
            background-image: url(../../lib/base/washer/assets/washer_btn_drysigle_normal.png);
        }
        &:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_drysigle_pressed.png);
        }
        &.active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_drysigle_selected.png);
        }
        &.disable:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_drysigle_normal.png);
        }
    }
    &-mode-normal_drying {
        i {
            background-image: url(../../lib/base/washer/assets/washer_btn_drysigle_normal.png);
        }
        &:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_drysigle_pressed.png);
        }
        &.active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_drysigle_selected.png);
        }
        &.disable:active i {
            background-image: url(../../lib/base/washer/assets/washer_btn_drysigle_normal.png);
        }
    }
    &.disable {
        opacity: 0.5;
    }
}

.page-error {
    height: 100%;
    background: #f2f2f2;
    text-align: center;
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
}
.error-tip {
    left: 50%;
    top: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
}
.error-tip p {
    min-height: 30px;
    font-size: 30px;
    margin: 24px 0 110px 0;
    opacity: 1;
    position: relative;
}
</style>


<script>
import Modal from "./components/Modal.vue";
import SwitchButton from "./components/SwitchButton.vue";
import Picker from "./components/Picker/picker.vue";
import ModeButton from "./components/ModeButton.vue";
import SubPage from "./components/SubPage.vue";

import {
    MODE_OPTIONS,
    RESERVE_TIME_OPTIONS,
    TEMPERATURE_OPTIONS,
    DRY_OPTIONS,
    DETERGENT_OPTIONS,
    OPERATION_OPTIONS,
    ERROR_CODE,
    DEFAULT_ERROR_MSG
} from "./config";

const radio =
    (document.documentElement.clientWidth || window.innerWidth) / 750 * 75;

function getToggle(val) {
    return val === "on" ? "off" : "on";
}

function formatTime(time) {
    var hour = Math.floor(time / 60);
    var minute = time % 60;
    var result = "";
    if (hour > 0) {
        result += `${hour}<small>时</small>`;
    }
    result += `${minute}<small>分</small>`;
    return result;
}

function findIndex(array, fn) {
    for (var i = 0; i < array.length; i++) {
        if (fn(array[i])) {
            return i;
        }
    }
    return -1;
}

export default {
    components: {
        Modal,
        SwitchButton,
        Picker,
        ModeButton,
        SubPage
    },
    data() {
        return {
            status: "",
            model: {},
            device_name: "",
            moreModalVisible: false,
            modeModalVisible: false,
            reserveModalVisible: false,
            currentReserveTime: 0,
            confirmChildLockVisible: false,
            currentSet: -1,
            number: 0,
            itemHeight: 1.2 * radio,
            errors: []
        };
    },
    watch: {
        isRun(val) {
            if (val) {
                this.currentSet = -1;
            }
        }
        // 'model.mode'(nowval, prevval) {
        //     if(this.isPause && prevval){
        //         this.model.operation = 'none'
        //     }
        // }
    },
    computed: {
        isRun() {
            return this.model.status == "run";
        },
        isPause() {
            return (
                this.model.status == "standby" &&
                this.model.operation != "none" &&
                this.model.operation != "finish"
            );
        },
        isStandby() {
            return (
                this.model.status == "standby" && this.model.operation == "none"
            );
        },
        isFinish() {
            return (
                this.model.status == "standby" &&
                this.model.operation == "finish"
            );
        },
        numberSlot() {
            var values = RESERVE_TIME_OPTIONS.map((item, i) => {
                return `${item}`;
            });
            return [
                {
                    flex: 1,
                    defaultIndex: this.model.reserve_wash
                        ? this.model.reserve_wash - 3
                        : 0,
                    values: values,
                    className: "slot1"
                }
            ];
        },
        time_left() {
            return formatTime(this.model.time_left);
        },
        operationText() {
            return this.isRun
                ? OPERATION_OPTIONS[this.model.operation]
                : "暂停中";
        },
        childLockSwitch() {
            return this.model.child_lock_switch == "on" ? true : false;
        },
        currentModeConfig() {
            return MODE_OPTIONS[this.model.mode];
        },
        temperatureOptions() {
            var temperatureConfig = this.currentModeConfig.temperature;
            return TEMPERATURE_OPTIONS.filter((item, i) => {
                return temperatureConfig.options.indexOf(i) >= 0;
            });
        },
        dryingOptions() {
            var dryingConfig = this.currentModeConfig.drying;
            return DRY_OPTIONS.filter((item, i) => {
                return dryingConfig.options.indexOf(i) >= 0;
            });
        },
        detergentOptions() {
            var detergentConfig = this.currentModeConfig.detergent;
            return DETERGENT_OPTIONS.filter((item, i) => {
                return detergentConfig.options.indexOf(i) >= 0;
            });
        },
        currentTemperature() {
            var result = this.temperatureOptions.filter(item => {
                return item.value == this.model.temperature;
            });
            return result[0] || {};
        },
        currentDrying() {
            var result = this.dryingOptions.filter(item => {
                return item.value == this.model.drying;
            });
            return result[0] || {};
        },
        currentDetergent() {
            var result = this.detergentOptions.filter(item => {
                return item.value == this.model.auto_detergent_switch;
            });
            return result[0] || {};
        }
    },
    methods: {
        controlDevice(attr, val, success, error) {
            // if(this.errors.length){
            //     this.showAlarmTip(this.errors[0])
            //     return
            // }
            if (
                this.model.child_lock_switch == "on" &&
                attr != "child_lock_switch"
            ) {
                HdSmart.UI.toast("请先关闭童锁");
                return;
            }

            var params = {
                [attr]: val
            };

            if (attr == "mode") {
                //要切到待机模式
            }

            HdSmart.Device.control(
                {
                    method: "dm_set",
                    nodeid: `wash_machine.main.${attr}`,
                    params: {
                        attribute: params
                    }
                },
                () => {
                    success && success();
                },
                () => {
                    error && error();
                }
            );
        },
        setSwitch(val) {
            this.controlDevice("switch", val);
        },
        setControl(val) {
            if (this.model.operation == "drying" && val == "halt") {
                HdSmart.UI.toast("烘干时不可暂停");
                return;
            }
            this.controlDevice("control", val);
        },
        setMode(mode) {
            if (this.isRun || this.isPause) {
                return;
            }
            if (this.model.mode == mode) {
                return;
            }
            this.controlDevice("mode", mode, () => {
                this.model.mode = mode;
            });
        },
        setChildLock(val, callback) {
            this.controlDevice("child_lock_switch", val, callback);
        },
        setReserve(time) {
            if (this.isRun) {
                HdSmart.UI.toast("运行中无法设置预约");
                return;
            }
            this.controlDevice("reserve_wash", parseInt(time));
        },
        setTemperature(item) {
            if (this.isRun) {
                return;
            }
            if (item.value == this.currentTemperature.value) {
                return;
            }
            this.controlDevice("temperature", parseInt(item.value), () => {
                this.model.temperature = item.value;
            });
        },
        setDetergent(item) {
            if (this.isRun) {
                return;
            }
            if (item.value == this.currentDetergent.value) {
                return;
            }
            this.controlDevice("auto_detergent_switch", item.value, () => {
                this.model.auto_detergent_switch = item.value;
            });
        },
        setDrying(item) {
            if (this.isRun) {
                return;
            }
            if (item.value == this.currentDrying.value) {
                return;
            }
            this.controlDevice("drying", item.value, () => {
                this.model.drying = item.value;
            });
        },
        cancelReserve() {
            this.reserveModalVisible = false;
            this.setReserve(0);
        },
        submitReserve() {
            this.reserveModalVisible = false;
            this.setReserve(this.number);
        },
        onNumberChange(picker, values) {
            this.number = values[0];
        },
        confirmChildLock() {
            if (this.childLockSwitch) {
                this.confirmChildLockVisible = true;
            } else {
                if (this.isRun) {
                    this.setChildLock("on", () => {
                        this.model.child_lock_switch = "on";
                    });
                } else {
                    HdSmart.UI.toast("运行中才能开启童锁");
                }
            }
        },
        submitChildLock() {
            this.setChildLock("off", () => {
                this.confirmChildLockVisible = false;
                this.model.child_lock_switch = "off";
            });
        },
        toggleSet(index) {
            if (this.isRun || this.isPause) {
                return;
            }
            this.currentSet = this.currentSet == index ? -1 : index;
        },
        getSnapShot(cb) {
            HdSmart.Device.getSnapShot(
                data => {
                    this.onSuccess(data);
                    cb && cb();
                },
                () => {
                    this.onError();
                    cb && cb();
                }
            );
        },
        onSuccess(data) {
            HdSmart.UI.hideLoading();
            this.status = "success";

            this.model = data.attribute;

            this.onAlarm(data.attribute.error);
        },
        onError() {
            this.status = "error";
        },
        onAlarm(errors) {
            errors = errors || [];
            this.errors = errors.filter(item => {
                return item.status == 1;
            });
        },
        doAlarm(attr) {
            var code = attr.error_code;
            // var index = this.errors.indexOf(code)
            var index = findIndex(this.errors, item => {
                return item.code == code;
            });

            if (index >= 0) {
                this.errors.splice(index, 1);
            }

            if (attr.error_status == "open") {
                this.errors.push({
                    code: code,
                    status: attr.error_status
                });
            }
        },
        showAlarmTip(err) {
            var msg = ERROR_CODE[err.code] || DEFAULT_ERROR_MSG;
            HdSmart.UI.alert(
                {
                    title: "故障",
                    message: err.code + " " + msg,
                    cancelText: "",
                    onText: "知道了"
                },
                val => {
                    if (val) {
                        // HdSmart.Device.control({
                        //     method: 'dm_set',
                        //     "nodeid": "wifi.main.alarm_confirm",
                        //     "params": {
                        //         "attribute": {
                        //             "error_code": err.code
                        //         }
                        //     }
                        // }, () => {})
                    }
                }
            );
        },
        inError(error) {
            return (
                findIndex(this.errors, item => {
                    return item.code == error;
                }) >= 0
            );
        }
    },
    created() {
        HdSmart.ready(() => {
            if (window.device_name) {
                this.device_name = window.device_name;
            }
            HdSmart.UI.showLoading();
            this.getSnapShot();
        });
        HdSmart.onDeviceStateChange(data => {
            this.onSuccess(data.result);
        });
        HdSmart.onDeviceAlert(data => {
            this.onAlarm(data.result.attribute.error);
        });
        /*
        HdSmart.onDeviceListen((data) => {
            switch (data.method) {
                case 'dm_set':
                    if(data.code !== 0){
                        this.getSnapShot()
                    }
                    break
                case 'dr_report_dev_alert':
                    if(data.result.attribute.error){
                        this.onAlarm(data.result.attribute.error)
                    }else{
                        this.doAlarm(data.result.attribute)
                    }
                    break;
                case 'da_report_dev_alert':
                    break;
                default:

                    break
            }
        })
        */
    }
};
</script>
