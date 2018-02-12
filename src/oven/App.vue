<template>
    <div id="app">
        <div class="fault" v-if="errors.length" @click="showAlarmTip">{{errors[0]}}故障</div>
        <div class="mask" v-if="maskLyerShow"></div>
        <span class="more-btn" @click="showMoreLayer"></span>
        <div class="wrapper">
            <h3 class="main-title">烤箱</h3>
            <div class="pannel">
                <p class="p-model">{{getModeName(allAttribute.mode)}}模式</p>
                <p class="color-gray">(预约中)</p>
                <div class="p-main-time">
                    <p class="p-num"><strong>{{allAttribute.remaining}}</strong>分&nbsp;&nbsp;钟</p>
                    <p class="color-gray">剩余总时间</p>
                </div>
                <p class="color-gray"><span>上下火</span>设定温度<span class="p-wendu">{{allAttribute.temperature}}</span>℃</p>
            </div>
            <div class="controls">
                <button @click="startOven" v-if="allAttribute.status==='stop'"><i class="c-firing"></i></button>
                <button @click="stopOven" v-if="allAttribute.status==='start'"><i class="c-stop"></i></button>
                <button style="margin-left: 100px" @click="showModelLayer"><i class="c-model"></i></button>
            </div>
        </div>
        <div class="model-select-layer oven-layer"  v-if="modelLayerShow">
            <div class="layer-header">
                <h3>模式选择</h3>
                <i class="btn-close" @click="closeModelLayer"></i>
            </div>
            <div class="layer-body" :class="allAttribute.status === 'start' ? 'disable' : ''">
                <ul class="model-list">
                    <li @click="seleteMode(item)" v-for="item in modeList"><a href="javascript:void(0)" :class="item.icon"></a><div class="mode-name">{{item.name}}</div></li>
                </ul>
            </div>
            <div class="layer-bottom-btn" :class="allAttribute.status === 'start' ? 'disable' : ''">
                <button class="cancel" @click="closeModelLayer">取消</button>
                <button class="confirm" @click="setMode">确定</button>
            </div>
        </div>
        <div class="model-more-layer oven-layer" v-if="moreLayerShow">
            <div class="layer-header">
                <h3>更多</h3>
                <i class="btn-close" @click="closeMoreLayer"></i>
            </div>
            <div class="layer-body" :class="allAttribute.status === 'start' ? 'disable' : ''">
                <p class="more-model-title">更多模式</p>
                <div class="up-down-fire">
                    <span><a class="up-fire"></a>上火</span>
                    <span><a class="down-fire"></a>下火</span>
                    <span style="margin-right: 0"><a class="both-fire"></a>上下火</span>
                </div>
                <div class="main-select-con">
                    <div class="select-param" @click="toggleShowSlider('wendu')">
                        <div class="hasDisable">
                            <p>烘烤温度</p>
                            <span class="value-wendu">{{allAttribute.temperature}}℃<i :class="wenduSelectFlag?'icon-arrow-up':'icon-arrow-down'"></i></span>
                        </div>
                    </div>
                    <div class="select-param" @click="toggleShowSlider('time')">
                        <div class="hasDisable">
                            <p>烘烤时长</p>
                            <span class="value-wendu">{{allAttribute.bake_duration}}分钟<i :class="timeSelectFlag?'icon-arrow-up':'icon-arrow-down'"></i></span>
                        </div>
                    </div>
                    <div class="slide-list" v-if="wenduSelectFlag">
                        <div class="slide-list-inner">
                            <a v-for="item in wenduList" @click="selectWendu(item)" :class="item.active?'active':''">{{item.name}}</a>
                        </div>
                    </div>
                    <div class="slide-list" v-if="timeSelectFlag">
                        <div class="slide-list-inner">
                            <a v-for="item in timeList" @click="selectTime(item)" :class="item.active?'active':''">{{item.name}}</a>
                        </div>
                    </div>
                    <div class="select-param">
                        <p>热风对流</p>
                        <switch-button :sync="true" :value="allAttribute.convection==='on'" @change="changeConvection"/>
                    </div>
                    <div class="select-param">
                        <p>烤叉旋转</p>
                        <switch-button :sync="true" :value="allAttribute.rotisserie==='on'" @change="changeRotisserie"/>
                        <i class="switch off"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import * as service from './service'
    import SwitchButton from './components/SwitchButton.vue'
    export default {
        name: 'app',
        components: {
            SwitchButton
        },
        data() {
            return {
                //状态集合
                allAttribute: {
                    mode: 'cake', //模式
                    temperature: 100, //温度
                    bake_duration: 0, //时长
                    switch: 'off',
                    status: 'start',
                    reserve_bake: 1,
                    convection: 'on',
                    rotisserie: 'on',
                    remaining: 88
                },
                //模式
                tempMode: '', //临时变量，点击确认的时候才赋值给真mode
                // 遮罩层
                maskLyerShow: false,
                //模式选择层
                modelLayerShow: false,
                //更多选择层
                moreLayerShow: false,
                //温度可选列表
                wenduList: [],
                //时间可选列表
                timeList: [],
                wenduSelectFlag: false,
                timeSelectFlag: false,
                //模式列表
                modeList: [
                    {
                        name: '面包',
                        icon: 'ico-bread',
                        mode: 'bread'
                    },
                    {
                        name: '饼干',
                        icon: 'ico-biscuit',
                        mode: 'biscuit'
                    },
                    {
                        name: '蛋糕',
                        icon: 'ico-cake',
                        mode: 'cake'
                    },
                    {
                        name: '披萨',
                        icon: 'ico-pizza',
                        mode: 'pizza'
                    },
                    {
                        name: '烤肉',
                        icon: 'ico-barbecue',
                        mode: 'barbecues'
                    },
                    {
                        name: '鱼虾',
                        icon: 'ico-fish',
                        mode: 'fish_shrimp'
                    },
                    {
                        name: '地瓜',
                        icon: 'ico-sweet-potato',
                        mode: 'sweet_potato'
                    },
                    {
                        name: '全鸡',
                        icon: 'ico-chicken',
                        mode: 'chicken'
                    }
                ],
                //出错信息
                errors: [],
                status: ''
            }
        },
        watcher: {
            childLockSwitch(val) {
                console.log(val)
            }
        },
        mounted() {
            this.renderSlideList()
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
                    case 'alarm':
                        this.onFault(data.result.attribute)
                        break;
                    default:
                        this.onSuccess(data.result)
                        break
                }
            })
        },
        methods: {
            closeMoreLayer () {
                this.maskLyerShow = false
                this.moreLayerShow = false
            },
            //取消模式选择
            closeModelLayer () {
                this.maskLyerShow = false
                this.modelLayerShow = false
            },
            showMoreLayer () {
                this.maskLyerShow = true
                this.moreLayerShow = true
            },
            showModelLayer () {
                this.maskLyerShow = true
                this.modelLayerShow = true
                let curMode = this.allAttribute.mode
                if (curMode) {
                    this.modeList.forEach((inner) => {
                        if (inner.mode === curMode) {
                            inner.icon += ' active'
                        } else {
                            if (/active/.test(inner.icon)) {
                                inner.icon = inner.icon.replace(/active/, '')
                            }
                        }
                    })
                } else {
                    this.tempMode = ''
                }
            },
            seleteMode (item) {
                // 如果正在工作 不能选模式
                if (this.allAttribute.status === 'start') {
                    return
                }
                this.tempMode = item.mode
                this.modeList.forEach((inner) => {
                    if (/active/.test(inner.icon)) {
                        inner.icon = inner.icon.replace(/active/, '')
                    }
                })
                item.icon += ' active'
            },
            renderSlideList () {
                const len = 100
                for (let i = 1; i<len; i++) {
                    this.wenduList.push({name: i, value: i, active: false})
                }
                for (let j = 1; j<len; j++) {
                    this.timeList.push({name: j, value: j, active: false})
                }
            },
            toggleShowSlider (val) {
                if (this.allAttribute.status === 'start') {
                    return
                }
                if (val === 'wendu') {
                    this.wenduSelectFlag = !this.wenduSelectFlag
                    if (this.wenduSelectFlag && this.timeSelectFlag) {
                        this.timeSelectFlag = false
                    }
                } else {
                    this.timeSelectFlag = !this.timeSelectFlag
                    if (this.wenduSelectFlag && this.timeSelectFlag) {
                        this.wenduSelectFlag = false
                    }
                }
            },
            selectWendu (item) {
                this.setTemperature(item.value, () => {
                    let wenduList = this.wenduList
                    let len = wenduList.length
                    for (let i=0; i<len; i++) {
                        wenduList[i].active = false
                    }
                    item.active = true
                })
            },
            selectTime (item) {
                this.setDuration(item.value, () => {
                    let timeList = this.timeList
                    let len = timeList.length
                    for (let i=0; i<len; i++) {
                        timeList[i].active = false
                    }
                    item.active = true
                })
            },
            getModeName (val) {
                let text = ''
                let modeList = this.modeList
                modeList.forEach((item) => {
                    if (item.mode === val) {
                        text = item.name
                    }
                })
                return text
            },
            /*发送指令相关..............................................................
             */
            showAlarmTip() {
                let code = this.errors[0]
                // let msg = ERROR_CODE[code] || DEFAULT_ERROR_MSG
                HdSmart.UI.alert({
                    title: '故障',
                    message: code + ' ' + '',
                    cancelText: '',
                    onText: '知道了'
                }, (val) => {})
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
            onFault(attr) {
                let code = attr.error_code
                let index = this.errors.indexOf(code)

                if(index > 0){
                    this.errors.splice(index, 1)
                }
                if(attr.error_status === 'open'){
                    this.errors.push(code)
                }
            },
            onSuccess(data) {
                this.status = 'success'
                let attributes = data.attribute
                let curAttributes = this.allAttribute
                for (let attr in curAttributes) {
                    curAttributes[attr] = attributes[attr]
                }
            },
            onError() {
                this.status = 'error'
            },
            controlDevice(attr, val, success, error) {
                if(this.errors.length){
                    this.showAlarmTip()
                    return
                }
//                if(this.model.child_lock_switch == 'on' && attr != 'child_lock_switch'){
//                    HdSmart.UI.toast('请先关闭童锁')
//                    return
//                }
                HdSmart.Device.control({
                    method: 'dm_set',
                    nodeid: `oven.main.${attr}`,
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
            // 启动
            startOven () {
                const obj = this
                this.controlDevice('control','start', ()=>{
                    obj.allAttribute.status = 'start'
                })
            },
            // 停止
            stopOven () {
                const obj = this
                this.controlDevice('control','stop', ()=>{
                    obj.allAttribute.status = 'stop'
                })
            },
            // 设置模式
            setMode () {
                if (this.allAttribute.status === 'start') {
                    return
                }
                this.maskLyerShow = false
                this.modelLayerShow = false
                this.allAttribute.mode = this.tempMode
                const obj = this
                this.controlDevice('mode',this.allAttribute.mode, ()=>{

                })
            },
            // 设置温度
            setTemperature (val,suc) {
                const obj = this
                this.controlDevice('temperature',val, ()=>{
                    suc && suc()
                })
            },
            // 设置定时
            setDuration (val) {
                const obj = this
                this.controlDevice('bake_duration',val, ()=>{

                })
            },
            // 设置热风对流
            changeConvection (obj) {
                this.controlDevice('convection',obj.value, ()=>{

                })
            },
            // 设置转叉
            changeRotisserie (obj) {
                this.controlDevice('rotisserie',obj.value, ()=>{

                })
            }
        }
    }
</script>
<style lang="less">
    body {
        margin: 0;
        height: 600px;
        font-size: 30px;
        -webkit-tap-highlight-color: transparent;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        background: #f3f3f3;
        color: #333;
        font-family: NotoSansHans-Regular;
    }
    *{ margin: 0; padding: 0}
    #app {

    }
    .mask{
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background:rgba(0,0,0,0.50);
        z-index: 998;
        position: absolute;
    }
    .more-btn{
        position: absolute;
        right: 65px;
        width: 96px;
        height: 96px;
        top: 60px;
        display: block;
        background-image: url("assets/btn_aircon_more.png");
        background-size: 100% 100%;
    }
    .wrapper{
        text-align: center;
        margin-top: 80px;
        height: 600px;
        left: 50%;
        width: 900px;
        position: relative;
        transform: translate(-50%, 0);
        .color-gray{
            color: #999;
        }
        .main-title{
            font-weight: normal;
            height: 80px;
            color: #333;
            opacity: 0.7;
            line-height: 80px;
            margin-bottom: 10px;
        }
        .pannel{
            height: 460px;
            background: #fff;
            border-radius: 38px;
            .p-main-time{
                padding: 50px 0;
                .p-num{
                    color: #46bcff;
                    strong{
                        font-family: Roboto-Medium;
                        position: relative;
                        left: -15px;
                        font-size: 100px;
                    }
                }
                .color-gray{
                    position: relative;
                    top:-10px;
                }
            }

            .p-model{
                padding-top:20px;
                height: 60px;
                line-height: 60px;
                font-size: 36px;
            }
            .p-wendu{
                font-weight: bold;
                opacity: 1;
                color: #46bcff;
            }
        }
        .controls{
            padding-top: 80px;
            button{
                width: 300px;
                height: 130px;
                display: inline-block;
                border-radius: 16px;
                background: #fff;
                border: 0;
                box-shadow:0 6px 10px 0 rgba(0,0,0,0.04);
                i{
                    display: inline-block;
                    width: 165px;
                    height: 58px;
                    background-size: 100% 100%;
                }
                .c-stop{
                    background-image: url("./assets/icon__stop.png");
                }
                .c-model{
                    background-image: url("./assets/icon_selectionpattern.png");
                }
                .c-firing{
                    background-image: url("./assets/icon__firing.png");
                }
            }
        }
    }
    .oven-layer{
        font-size: 24px;
        color: #76787a;
        width: 1300px;
        height: 832px;
        position: absolute;
        z-index: 9999;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background:#ffffff;
        box-shadow:0 3px 12px 0 rgba(0,0,0,0.10);
        border-radius:6px;
        .layer-header{
            height: 84px;
            box-shadow:inset 0 -1px 0 0 #dbdbdb;
            text-align: center;
            position: relative;
            h3{
                height: 100%;
                font-size: 30px;
                font-weight: normal;
                line-height: 84px;
            }
            .btn-close{
                position: absolute;
                right: 25px;
                display: inline-block;
                top: 20px;
                height: 30px;
                width: 30px;
                background-size: 100% 100%;
                background-image: url("assets/btn_close.png");
            }
        }
        .layer-body {
            overflow: hidden;
        }
        .layer-bottom-btn{
            clear: both;
            margin-top: 110px;
            text-align: center;
            button{
                border:1px solid #76787a;
                border-radius:6px;
                width:238px;
                height:82px;
                font-size: 36px;
                line-height: 82px;
                text-align: center;
            }
            .cancel {
                background: #ffffff;
                color: #76787a;
                margin-right: 20px;
            }
            .confirm {
                color: #fff;
                background:#46bcff;
                border: 0;
            }
        }
    }
    .model-select-layer{
        .disable {
            .confirm{
                opacity: 0.3;
            }
            li {
                div.mode-name{opacity: 0.3;}
                a.active{opacity: 0.3;}
                a.ico-bread{
                    background-image: url("assets/btn_bread_g.png")
                }
                a.ico-biscuit{
                    background-image: url("assets/btn_biscuits_g.png")
                }
                a.ico-cake{
                    background-image: url("assets/btn_cake_g.png")
                }
                a.ico-pizza{
                    background-image: url("assets/btn_pizza_g.png")
                }
                a.ico-barbecue{
                    background-image: url("assets/btn_barbecue_g.png")
                }
                a.ico-fish{
                    background-image: url("assets/btn_fishandshrimp_g.png")
                }
                a.ico-sweet-potato{
                    background-image: url("assets/btn_pachyrhizus_g.png")
                }
                a.ico-chicken{
                    background-image: url("assets/btn_chicken_g.png")
                }
            }

        }
        .model-list{
            margin-top: 60px;
            margin-left: 250px;
            li{
                list-style: none;
                text-align: center;
                float: left;
                width: 144px;
                margin-right: 70px;
                padding-bottom: 30px;
                div{
                    margin-top: 5px;
                    height: 40px;
                    line-height: 40px;
                }
                a{
                    display: block;
                    width: 144px;
                    height: 144px;
                    background-size: 100% 100%;
                }
                .ico-bread{
                    background-image: url("assets/btn_bread.png");
                    &.active{
                        background-image: url("assets/btn_bread_selected.png")
                    }
                }
                .ico-biscuit{
                    background-image: url("assets/btn_biscuits.png");
                    &.active{
                        background-image: url("assets/btn_biscuits_selected.png")
                    }
                }
                .ico-cake{
                    background-image: url("assets/btn_cake.png");
                    &.active{
                        background-image: url("assets/btn_cake_selected.png")
                    }
                }
                .ico-pizza{
                    background-image: url("assets/btn_pizza.png");
                    &.active{
                        background-image: url("assets/btn_pizza_selected.png")
                    }

                }
                .ico-barbecue{
                    background-image: url("assets/btn_barbecue.png");
                    &.active{
                        background-image: url("assets/btn_barbecue_selected.png")
                    }

                }
                .ico-fish{
                    background-image: url("assets/btn_fishandshrimp.png");
                    &.active{
                        background-image: url("assets/btn_fishandshrimp_selected.png")
                    }
                }
                .ico-sweet-potato{
                    background-image: url("assets/btn_pachyrhizus.png");
                    &.active{
                        background-image: url("assets/btn_pachyrhizus_selected.png")
                    }

                }
                .ico-chicken{
                    background-image: url("assets/btn_chicken.png");
                    &.active{
                        background-image: url("assets/btn_chicken_selected.png")
                    }

                }
            }
        }
    }
    .model-more-layer{
        height: 849px;
        .more-model-title{
            color: #c8cacc;
            height: 70px;
            text-align: center;
            line-height: 70px;
        }
        .up-down-fire{
            text-align: center;
            padding-bottom: 30px;
            span{
                margin-right: 80px;
                display: inline-block;
                width: 90px;
                line-height: 40px;
            }
            a{
                display: block;
                width: 90px;
                height: 90px;
                background-size: 100% 100%;
            }
            .up-fire{
                background-image: url("assets/btn_up_fire.png");
                &.disable{
                    background-image: url("assets/btn_up_fire_g.png")
                }
            }
            .down-fire{
                background-image: url("assets/btn_down_fire.png");
                &.disable{
                    background-image: url("assets/btn_down_fire_g.png")
                }
            }
            .both-fire{
                background-image: url("assets/btn_conflagration.png");
                &.disable{
                    background-image: url("assets/btn_conflagration_g.png")
                }
            }
        }
        .main-select-con{
            padding: 0 45px;
            .border-both{
                box-shadow:inset 0 -1px 0 0 #dbdbdb, inset 0 1px 0 0 #dbdbdb;
            }
            .select-param{
                border-top:1px solid #d8d8d8;
                position: relative;
                padding:0 45px;
                height: 90px;
                line-height: 90px;
                .value-wendu{
                    color:#46bcff;
                    position: absolute;
                    top: 5px;
                    right: 20px;
                    i{
                        display: inline-block;
                        width: 24px;
                        height: 13px;
                        background-size: 100% 100%;
                        margin-left: 20px;
                    }
                    .icon-arrow-down{
                        background-image: url("assets/arrow_down.png");
                    }
                    .icon-arrow-up{
                        background-image: url("assets/arrow_up.png");
                    }
                }
                .vue-js-switch{
                    position: absolute;
                    right: 18px;
                    top: 25px;
                }
            }
            .slide-list{
                overflow: scroll;
                &::-webkit-scrollbar {display:none}
                padding: 31px 15px;
                .slide-list-inner{
                    margin: 0;
                    width: 9000px;
                    a{
                        display: inline-block;
                        width: 90px;
                        height: 60px;
                        text-align: center;
                        line-height: 60px;

                        &.active{
                            background: #46bcff;
                            border:1px solid #46bcff;
                            color: #fff;
                            border-radius:3px;
                        }
                    }
                }
            }
        }
        .disable{
            .hasDisable{
                opacity: 0.5;
                .value-wendu{
                    color: #76787a;
                }
            }
        }

    }

</style>
