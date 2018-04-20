<!--
    首页
-->
<template>
<div class="page-index"><div class="page-index2">
    <screen-projection-tip class="sp_status_home" />
    <div class="device_name">{{$store.state.device_name}}</div>
    <div class="grid">
        <div class="content-con">
            <div class="span1">
                <div class="swiper">
                    <div v-if="homePageInfo.length === 0" @click="pageInit">
                        <img src="../assets/img_default_recommend.png">
                    </div>
                    <swiper v-if="homePageInfo.length > 0" :options="swiperOption" ref="swiper">
                        <swiper-slide
                            v-for="item in homePageInfo"
                            :key="item.vid">
                            <a href="#"
                               :style="{backgroundImage:'url('+item.pictureUrl+')'}"
                               @click.prevent="showDetailInfo(item)">
                                <span class="title">{{item.title}}</span>
                            </a>
                        </swiper-slide>
                        <div class="swiper-pagination" slot="pagination"></div>
                    </swiper>
                </div>
            </div>
            <div class="span-right">
                <div class="span3">
                    <router-link
                        v-for="item in channels_1"
                        :key="item.channelId"
                        :to="{
                    name: 'list',
                    query: {
                        channelId: item.channelId,
                        channel: item.channel
                    }
                }"
                        :class="['item-'+item.channelId]"
                        class="item"
                    >{{item.channel}}</router-link>
                </div>
                <div class="span3">
                    <router-link
                        v-for="item in channels_2"
                        :key="item.channelId"
                        :to="{
                    name: 'list',
                    query: {
                        channelId: item.channelId,
                        channel: item.channel
                    }
                }"
                        :class="['item-'+item.channelId]"
                        class="item"
                    >{{item.channel}}</router-link>
                </div>
                <div class="span2">
                    <router-link to="/search" class="item item-search">搜索</router-link>
                    <a href="#" @click.prevent="cmd('screenProjectionEvent')" class="item item-tp">投屏</a>
                    <!--<a href="#" @click.prevent="cmd('remoteControlEvent')" class="item item-ykq">遥控器</a>-->
                </div>
            </div>
        </div>
        <div class="control">
            <a href="#" class="shut" @click.prevent="cmd('rcPower')"></a>
            <a href="#" class="volup" v-finger:touch-end="volupEnd" v-finger:touch-move="touchMove" v-finger:long-tap="volupStart" ></a>
            <a href="#" class="voldown" v-finger:touch-end="voldownEnd" v-finger:touch-move="touchMove"  v-finger:long-tap="voldownStart"></a>
            <a href="#" class="home" @click.prevent="cmd('rcHome')"></a>
            <!-- <a href="#" class="menu" @click.prevent="cmd('rcMenu')"></a> -->
            <a href="#" class="back" @click.prevent="cmd('rcBack')"></a>
        </div>
    </div>
</div></div>
</template>

<style lang="less">
    .page-index{
        background:#f2f2f2;
        background-image:linear-gradient(0deg, rgba(200,202,204,0.00) 50%, #c8cacc 100%);
        width: 100%;
        height: 100%;
        position: fixed;
        left: 0;
        top: 0;
    }
    .page-index2{
        position: absolute;
        left: 0;
        top:0;
        width: 100%;
        height: 100%;
    }
    .device_name{
        position: absolute;
        left: 0;
        top: 120px;
        width:100%;
        text-align: center;
        font-size: 30px;
        color:#333333;
    }
    .grid{
        left: 50%;
        top: 200px;
        position: absolute;
        transform: translateX(-50%);
        width: 1750px;
        .content-con{ height: 500px }
        .span1{
            float: left;
            width: 1020px;
            height: 500px;
            border-radius: 6px;
            overflow: hidden;
        }
        .span-right{
            float: right;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 700px;
            height: 500px;
            .span2{
                display: flex;
                height: 158px;
                justify-content: space-between;
                .item{
                    background-color: #fff;
                    color:#75787a;
                    font-size: 36px;
                }
            }
            .span3{
                margin-bottom: 15px;
                display: flex;
                height: 158px;
                justify-content: space-between;
                a.item{
                    height: 158px;
                    width: 332px;
                    display: inline-block;
                }

            }
        }
        .item{
            width: 332px;
            height: 158px;
            line-height: 158px;
            border-radius: 6px;
            background-size: 72px 72px;
            background-position: 36px center;
            background-repeat: no-repeat;
            font-size: 42px;
            box-sizing: border-box;
            text-align: right;
            padding-right: 48px;
            color:#fff;
        }
        .item-search{
            background-image: url(../assets/icn_tv_search.png);
        }
        .item-tp{
            background-image: url(../assets/icn_tv_sync.png);
        }
        .item-ykq{
            background-image: url(../assets/icn_tv_remote.png);
        }
        .item-001{
            background-color: #46bcff;
            background-image: url(../assets/icn_tv_movie.png);
        }
        .item-002{
            background-color: #9e5bf0;
            background-image: url(../assets/icn_tv_tvshow.png);
        }
        .item-003{
            background-color: #13d5dc;
            background-image: url(../assets/icn_tv_comic.png);
        }
        .item-004{
            background-color: #1481ba;
            background-image: url(../assets/icn_tv_entertainment.png);
        }
    }
    .swiper {
        .swiper-slide{
            width: 1020px;
            height: 500px;
            background: url(../assets/img_default_recommend.png) no-repeat;
            background-size: 100%;
        }
        a{
            display: block;
            width: 1020px;
            height: 500px;
            background-repeat: no-repeat;
            background-size: 100%;
            border-radius: 6px;
            overflow: hidden;
        }
        img{
            width: 100%;
            border-radius: 6px;
        }
        .title{
            border-radius:0 0 6px 6px;
            position: absolute;
            left: 0;
            bottom: 0;
            color: #fff;
            font-size: 36px;
            height: 240px;
            width: 100%;
            padding-top: 162px;
            padding-left: 36px;
            background-image:linear-gradient(-180deg, rgba(47,49,51,0.00) 0%, #2f3133 100%);
            box-sizing: border-box;
        }
        .swiper-container-horizontal > .swiper-pagination-bullets{
            width: auto;
            left: auto;
            right: 35px;
            bottom: 23px;
        }
        .swiper-pagination-bullet{
            width: 23px;
            height: 6px;
            opacity: .5;
            background: #fff;
            border-radius: 1.5px;
        }
        .swiper-pagination-bullet-active{
            background: #13d5dc
        }
    }
    /* 强制关闭3d(详情页改成不透明了) */
    /*
    .swiper-container-android .swiper-slide, .swiper-wrapper{
        transform: translate(0, 0);
    }
    .swiper-pagination{
        transform: translate(0, 0);
    }
    */
    .control {
        /*transform: translateY(-50%);*/
        clear: both;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        height: 144px;
        margin-top: 60px;
        a{
            display: block;
            width: 144px;
            height: 144px;
            background-size: 100% 100%;
            border-radius: 144px;
        }
        .home{
            background-image: url(../assets/btn_remote_home_normal.png);
            &:active{
                background-image: url(../assets/btn_remote_home_pressed.png);
            }
        }
        .back{
            background-image: url(../assets/btn_remote_back_normal.png);
            &:active{
                background-image: url(../assets/btn_remote_back_pressed.png);
            }
        }
        .volup{
            background-image: url(../assets/btn_remote_volumeup_normal.png);
            &:active{
                background-image: url(../assets/btn_remote_volumeup_pressed.png);
            }
        }
        .menu{
            background-image: url(../assets/btn_remote_menu_normal.png);
            &:active{
                background-image: url(../assets/btn_remote_menu_pressed.png);
            }
        }
        .voldown{
            background-image: url(../assets/btn_remote_volumedown_normal.png);
            &:active{
                background-image: url(../assets/btn_remote_volumedown_pressed.png);
            }
        }
        .shut{
            background-image: url(../assets/btn_remote_power_normal.png);
            &:active{
                background-image: url(../assets/btn_remote_power_pressed.png);
            }
        }
    }
</style>

<script>

    import * as service from '../service'
    let infoCache = []
    export default {
        data() {
            return {
                timeOutEventUp: 0,
                timeOutEventDown: 0,
                channelId: '',
                vid: '',
                swiperOption: {
                    autoplay: 3000,
                    loop: true,
                    paginationClickable :true,
                    autoplayDisableOnInteraction: false,
                    pagination: '.swiper-pagination',
                    lazyLoading: true
                },
                homePageInfo: [],
                "channels_1": [
                     {
                         "channelId": "001",
                         "channel": "电影"
                     },
                     {
                         "channelId": "002",
                         "channel": "电视剧"
                     }
                 ],
                "channels_2": [
                    {
                        "channelId": "003",
                        "channel": "动漫"
                    },
                    {
                        "channelId": "004",
                        "channel": "综艺"
                    }
                ]
//                ...service.getInitData()
            }
        },
        computed: {
            detailVisible(){
                return this.$store.state.detailVisible
            }
        },
        watch: {
           detailVisible(visible) {
               if(visible){
                    HdSmart.UI.toggleHeadAndFoot(false)
                    this.$refs.swiper.swiper.stopAutoplay()
               }else{
                    HdSmart.UI.toggleHeadAndFoot(true)
                    this.$refs.swiper.swiper.startAutoplay()
               }
           }
        },
        methods: {
            touchMove (e) {
                e.preventDefault()
            },
            volupStart () {
                this.timeOutEventUp = 1
                this.cmd('rcVolumeUpStart')
            },
            voldownStart () {
                this.timeOutEventDown = 1
                this.cmd('rcVolumeDownStart')
            },
            volupEnd () {
                if (this.timeOutEventUp) {
                    this.cmd('rcVolumeUpStop')
                    this.timeOutEventUp = 0
                } else {
                    this.cmd('rcVolumeUp')
                }

            },
            voldownEnd () {
                if (this.timeOutEventDown) {
                    this.cmd('rcVolumeDownStop')
                    this.timeOutEventDown = 0
                } else {
                    this.cmd('rcVolumeDown')
                }
            },
            cmd(name) {
                service.onClickEvent(name)
            },
            showDetailInfo (item) {
                this.$store.dispatch('showDetail', item)
            },
            pageInit() {
                service.getHomePageInfo(data=>{
                    infoCache = data
                    this.homePageInfo = infoCache
                })
            }
        },
        mounted () {
            if(!infoCache.length){
                this.pageInit()
            }else{
                this.homePageInfo = infoCache
            }
        }
    }
</script>
