<!--
    首页
-->
<template>
<div class="page-index">

    <router-link to="/search" class="search">输入片名、导演、演员搜索</router-link>

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
                    @click.prevent="showDetailInfo(item.channelId,item.vid)">
                    <span class="title">{{item.title}}</span>
                </a>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
    </div>

    <div class="control">
        <a href="#" class="shut" @click.prevent="cmd('rcPower')"></a>
        <a href="#" class="home" @click.prevent="cmd('rcHome')"></a>
        <a href="#" class="voldown" @click.prevent="cmd('rcVolumeDown')"></a>
        <a href="#" class="volup" @click.prevent="cmd('rcVolumeUp')"></a>
        <a href="#" class="back" @click.prevent="cmd('rcBack')"></a>
    </div>

    <div class="icon_grid">
        <div class="icon_grid_inner">
            <router-link
                v-for="item in channels"
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

            <a href="#" @click.prevent="cmd('screenProjectionEvent')" class="item item-tp">投屏</a>
            <a href="#" @click.prevent="cmd('remoteControlEvent')" class="item item-ykq">遥控器</a>
        </div>
    </div>

    <!-- 详情页 -->
    <detail :vid="vid" :channel-id="channelId" @onClose="onDetailClose" ref="detail"></detail>
</div>
</template>

<style lang="less">
    .page-index{
        background:#fafafa;
        padding-top: 88px;
    }
    .search{
        background:#ffffff  url(../assets/icn_topbar_search_pressed@2x.png) no-repeat 25px center;
        background-size: 36px 36px;
        border:1px solid #dbdbdb;
        border-radius:32px;
        width:702px;
        height:64px;
        line-height: 64px;
        margin: 12px auto 24px;
        display: block;
        font-size:32px;
        color:#c8cacc;
        padding-left: 68px;
    }
    .icon_grid{
        overflow: hidden;
        .icon_grid_inner{
            display: flex;
            flex-wrap: wrap;
            margin-top: -1px;
            margin-left: -1px;
        }
        .item{
            display: block;
            width: 250px;
            height: 250px;
            border-left: 1px solid #dbdbdb;
            border-top: 1px solid #dbdbdb;
            background-color: #fff;
            background-size: 96px 96px;
            background-position: center 48px;
            background-repeat: no-repeat;
            font-size: 28px;
            text-align: center;
            color:#75787a;
            padding-top: 168px;
            &:active{
                background-color: #ebebeb;
            }
        }
        .item-tp{
            background-image: url(../assets/icn_TV_sync@2x.png);
        }
        .item-ykq{
            background-image: url(../assets/icn_TV_remote@2x.png);
        }
        .item-001{
            background-image: url(../assets/icn_TV_movie@2x.png);
        }
        .item-002{
            background-image: url(../assets/icn_TV_tvshow@2x.png);
        }
        .item-003{
            background-image: url(../assets/icn_TV_comic@2x.png);
        }
        .item-004{
            background-image: url(../assets/icn_TV_entertainment@2x.png);
        }
    }
    .swiper {
        margin-bottom: 20px;
        .swiper-slide{
            width: 750px;
            height: 368px;
            background: url(../assets/img_default_recommend.png) no-repeat;
            background-size: 100%;
        }
        a{
            display: block;
            width: 750px;
            height: 368px;
            background-repeat: no-repeat;
            background-size: 100%;
            overflow: hidden;
        }
        img{
            width: 100%;
        }
        .title{
            position: absolute;
            left: 0;
            bottom: 0;
            color: #fff;
            font-size: 32px;
            height: 120px;
            width: 100%;
            padding-top: 50px;
            padding-left: 30px;
            background-image:linear-gradient(-180deg, rgba(47,49,51,0.00) 0%, #2f3133 100%);
        }
        .swiper-container-horizontal > .swiper-pagination-bullets{
            width: auto;
            left: auto;
            right: 30px;
            bottom: 23px;
        }
        .swiper-pagination-bullet{
            width: 16px;
            height: 4px;
            opacity: .5;
            background: #fff;
            border-radius: 1px;
        }
        .swiper-pagination-bullet-active{
            background: #13d5dc
        }
    }
    .control {
        display: flex;
        justify-content: space-between;
        margin: 0 30px 20px;
        a{
            display: block;
            width: 120px;
            height: 120px;
            background-size: 100% 100%;
        }
        .home{
            background-image: url(../assets/btn_TV_home_normal@2x.png);
            &:active{
                background-image: url(../assets/btn_TV_home_pressed@2x.png);
            }
        }
        .back{
            background-image: url(../assets/btn_TV_back_normal@2x.png);
            &:active{
                background-image: url(../assets/btn_TV_back_pressed@2x.png);
            }
        }
        .volup{
            background-image: url(../assets/btn_TV_volumeup_normal@2x.png);
            &:active{
                background-image: url(../assets/btn_TV_volumeup_pressed@2x.png);
            }
        }
        .voldown{
            background-image: url(../assets/btn_TV_volumedown_normal@2x.png);
            &:active{
                background-image: url(../assets/btn_TV_volumedown_pressed@2x.png);
            }
        }
        .shut{
            background-image: url(../assets/btn_TV_power_normal@2x.png);
            &:active{
                background-image: url(../assets/btn_TV_power_pressed@2x.png);
            }
        }
    }
</style>

<script>

    import * as service from '../service'

    export default {
        data() {
            return {
                channelId: '',
                vid: '',
                swiperOption: {
                    autoplay: 2000,
                    loop: true,
                    autoplayDisableOnInteraction: false,
                    pagination: '.swiper-pagination',
                    //lazyLoading: true
                },
                homePageInfo: [],
                ...service.getInitData()
            }
        },
        methods: {
            cmd(name) {
                service.onClickEvent(name)
            },
            showDetailInfo (channelId, vid) {
                this.channelId = channelId
                this.vid = vid
                this.$refs.detail.visible = true
                HdSmart.UI.toggleHeadAndFoot(false)
                this.$refs.swiper.swiper.stopAutoplay()
            },
            onDetailClose() {
                HdSmart.UI.toggleHeadAndFoot(true)
                this.$refs.swiper.swiper.startAutoplay()
            },
            pageInit() {
                service.getHomePageInfo(data=>{
                    this.homePageInfo = Object.freeze(data)
                })
            }
        },
        mounted () {
            this.pageInit()
        }
    }
</script>
