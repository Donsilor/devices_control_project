<!--
    首页
-->
<template>
<div class="page-index">
    <div class="grid" v-once>
        <div class="span1">
            <div class="swiper">
                <swiper :options="swiperOption" ref="swiper">
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
        </div>
        <div class="span2">
            <router-link to="/search" class="item item-search">搜索</router-link>
            <a href="#" @click.prevent="cmd('screenProjectionEvent')" class="item item-tp">投屏</a>
            <a href="#" @click.prevent="cmd('remoteControlEvent')" class="item item-ykq">遥控器</a>
        </div>
        <div class="span3">
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
        </div>
    </div>

    <div class="control">
        <a href="#" class="home" @click.prevent="cmd('rcHome')"></a>
        <a href="#" class="volup" @click.prevent="cmd('rcVolumeUp')"></a>
        <a href="#" class="voldown" @click.prevent="cmd('rcVolumeDown')"></a>
        <a href="#" class="shut" @click.prevent="cmd('rcPower')"></a>
    </div>
    <!-- 详情页 -->
    <detail :vid="vid" :channel-id="channelId" @onClose="onDetailClose" ref="detail"></detail>
</div>
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
    .grid{  
        left: 50%;
        top: 50%;
        position: absolute;
        transform: translate(-50%,-50%);
        margin-top: -60px;
        width: 1364px;
        .span1{
            float: left;
            width: 1020px;
            height: 500px;
            border-radius: 6px;
            overflow: hidden;
        }
        .span2{ 
            float: right;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 332px;
            height: 500px;
            .item{  
                width: 332px;
                height: 160px;
                line-height: 160px;
                background-color: #fff;
                color:#75787a;
                font-size: 36px;
            }
        }
        .span3{ 
            clear: left;
            padding-top: 12px;
            display: flex;
            justify-content: space-between;
        }
        .item{
            width: 332px;
            height: 180px;
            line-height: 180px;
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
        position: absolute;
        right: 70px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 700px;
        margin-top: -60px;
        a{  
            display: block;
            width: 144px;
            height: 144px;
            background-size: 100% 100%;
            background-color: #fff;
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

    .grid{  
        margin-left: -90px;
    }
    .control{
        margin-right: 90px;
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
                //初始化数据，由app首次加载注入
                ...service.getInitData()
            }
        },
        methods: {
            cmd(name) {
                service.onClickEvent(name)
            },
            showDetailInfo(channelId, vid) {
                this.channelId = channelId
                this.vid = vid
                this.$refs.detail.visible = true
                HdSmart.UI.toggleHeadAndFoot(false)
                this.$refs.swiper.swiper.stopAutoplay()
            },
            onDetailClose(){    
                HdSmart.UI.toggleHeadAndFoot(true)
                this.$refs.swiper.swiper.startAutoplay()
            }
        }
    }
</script>