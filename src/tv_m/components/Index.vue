<!--
    首页
-->
<template>
    <div class="page-index">
        <div class="topbar topbar-fixed">
            <div class="left">
                <a href="#/" class="icon-return" @click.prevent="back"/>
            </div>
            <div class="title">电视</div>
            <div class="right">
                <!--<a href="" class="icon-more"></a>-->
            </div>

        </div>
        <!--<div class="page-header"></div>-->
        <!-- <div class="page-body"> -->
        <!--<div class="device_name" v-if="$store.state.device_name">{{$store.state.device_name}}
            <icon />
        </div>-->
        <!-- <div class="status-tip-placeholder" v-show="$store.state.tvStatus.screenProjectType!=0 || $store.state.tvStatus.tvOnlineStatus!=1"></div> -->
        <status-tip class="sp_status_home" />

        <div class="search-box">
            <router-link to="/search" class="search icon-search">输入片名、导演、演员搜索</router-link>
        </div>

        <div class="swiper">
            <div v-if="homePageInfo.length === 0" @click="pageInit">
                <img src="../../../lib/base/tv/assets/img_default_recommend.png">
            </div>
            <swiper v-if="homePageInfo.length" :options="swiperOption" ref="swiper">
                <swiper-slide v-for="item in homePageInfo" :key="item.vid">
                    <a href="javascript:void(0)" :style="{backgroundImage:'url('+item.pictureUrl+')'}">
                        <span class="title">{{item.title}}</span>
                    </a>
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
        </div>

        <div class="control">
            <a href="#" class="icon-shut" :class="{spec:!$store.state.online && !$store.state.detailVisible}" @click.prevent="cmd('rcPower')"></a>
            <a href="#" class="icon-home" @click.prevent="cmd('rcHome')"></a>
            <!--// <a href="#" class="voldown" @click.prevent="cmd('rcVolumeDown')"></a>
            // <a href="#" class="volup" @click.prevent="cmd('rcVolumeUp')"></a>-->
            <a href="#" class="icon-volup" v-finger:touch-end="volupEnd" v-finger:touch-move="touchMove" v-finger:long-tap="volupStart"></a>
            <a href="#" class="icon-voldown" v-finger:touch-end="voldownEnd" v-finger:touch-move="touchMove" v-finger:long-tap="voldownStart"></a>
            <a href="#" class="icon-back" @click.prevent="cmd('rcBack')"></a>
        </div>

        <div class="icon_grid">
            <div class="icon_grid_inner">
                <router-link v-for="item in channels" :key="item.channelId" :to="{
                    name: 'list',
                    query: {
                        channelId: item.channelId,
                        channel: item.channel
                    }
                }" :class="['icon-'+item.channelId]" class="item">{{item.channel}}</router-link>

                <a href="#" @click.prevent="cmd('screenProjectionEvent')" class="item icon-screening">投屏</a>
                <a href="#" @click.prevent="cmd('remoteControlEvent')" class="item icon-control">遥控器</a>
            </div>
            <!-- </div> -->
        </div>
        <offline-mask page="index" v-if="!$store.state.detailVisible" />
    </div>
</template>

<style lang="less">
.page-index {
    background: #f7f8fa;
    padding-top: 139px;
    padding-bottom: 220px;
}
.page-header {
    width: 100%;
    z-index: 999;
    height: 100px;
    position: fixed;
    left: 0;
    top: 0;
    background: #fafafa;
}

.page-body {
    height: 100%;
    padding-bottom: 120px;
    overflow-y: auto;
}
.device_name {
    text-align: center;
    font-size: 32px;
    padding: 30px 0 20px;
}
.search-box {
    background-color: #fff;
    padding: 24px 0;
}
.search {
    background-color: #f0f0f0;
    border: 1px solid #dbdbdb;
    border-radius: 32px;
    width: 702px;
    height: 64px;
    line-height: 64px;
    margin: 0 auto;
    display: block;
    font-size: 32px;
    color: #b4b4b4;
    padding-left: 68px;
    position: relative;
    &:before {
        position: absolute;
        top: 0;
        left: 28px;
        font-size: 36px;
        line-height: 38px;
        color: rgba(0, 0, 0, .2);
    }
}
.icon_grid {
    overflow: hidden;
    .icon_grid_inner {
        display: flex;
        flex-wrap: wrap;
        margin-top: -1px;
        margin-left: -1px;
    }
    .item {
        position: relative;
        display: block;
        width: 33.33%;
        height: 250px;
        box-shadow: inset 1px 1px 1px -1px #dbdbdb;
        background-color: #fff;
        font-size: 28px;
        text-align: center;
        color: #75787a;
        padding-top: 168px;
        &:active {
            background-color: #ebebeb;
        }

        &:before {
            position: absolute;
            top: 55px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 40px;
            width: 82px;
            height: 82px;
            line-height: 50px;
            background-color: #3478f6;
            border-radius: 50%;
            color: #fff;
        }
    }
    .icon-001:before,
    .icon-screening:before{
        background-color: #3478f6;
    }
    .icon-002:before,
    .icon-control:before {
        background-color: #5dc957;
    }
    .icon-003:before,
    .icon-004:before {
        background-color: #ff9a26;
    }
}
.swiper {
    margin-top: 48px;
    .swiper-slide {
        width: 750px;
        height: 368px;
        background: url(../../../lib/base/tv/assets/img_default_recommend.png) no-repeat;
        background-size: 100%;
    }
    a {
        display: block;
        width: 750px;
        height: 368px;
        background-repeat: no-repeat;
        background-size: 100%;
        overflow: hidden;
    }
    img {
        width: 100%;
    }
    .title {
        position: absolute;
        left: 0;
        bottom: 0;
        color: #fff;
        font-size: 32px;
        height: 120px;
        width: 100%;
        padding-top: 50px;
        padding-left: 30px;
        background-image: linear-gradient(-180deg, rgba(47, 49, 51, 0) 0%, #2f3133 100%);
    }
    .swiper-container-horizontal > .swiper-pagination-bullets {
        width: auto;
        left: auto;
        right: 30px;
        bottom: 23px;
    }
    .swiper-pagination-bullet {
        width: 10px;
        height: 10px;
        opacity: 0.5;
        background: rgba(220, 225, 234, .7);
        border-radius: 5px;
        transition: width .5s;
    }
    .swiper-pagination-bullet-active {
        width: 34px;
        background: #fdde4B;
    }
}


.control {
    display: flex;
    justify-content: space-between;
    margin: 50px;
    a {
        display: block;
        width: 100px;
        height: 100px;
        line-height: 60px;
        background-size: 100% 100%;
        background-color: #fff;
        border-radius: 50%;
        text-align: center;
        font-size: 48px;
        color: #222a37;
        box-shadow: 0 4px 12px rgba(0, 0, 0, .1);

        &:active {
            background-color: rgba(0, 0, 0, .2);
        }
    }
    .home {
        background-image: url(../../../lib/base/tv/assets/btn_TV_home_normal@2x.png);
        &:active {
            background-image: url(../../../lib/base/tv/assets/btn_TV_home_pressed@2x.png);
        }
    }
    .back {
        background-image: url(../../../lib/base/tv/assets/btn_TV_back_normal@2x.png);
        &:active {
            background-image: url(../../../lib/base/tv/assets/btn_TV_back_pressed@2x.png);
        }
    }
    .volup {
        background-image: url(../../../lib/base/tv/assets/btn_TV_volumeup_normal@2x.png);
        &:active {
            background-image: url(../../../lib/base/tv/assets/btn_TV_volumeup_pressed@2x.png);
        }
    }
    .voldown {
        background-image: url(../../../lib/base/tv/assets/btn_TV_volumedown_normal@2x.png);
        &:active {
            background-image: url(../../../lib/base/tv/assets/btn_TV_volumedown_pressed@2x.png);
        }
    }
    .icon-shut {
        color: #ed421a;
        &.spec {
            position: relative;
            z-index: 9999;
        }
    }
}

@media only screen and (-webkit-min-device-pixel-ratio: 3), only screen and (min-device-pixel-ratio: 3) {
    .page-header {
        height: 136px;
    }
}

.isIOS .page-index {
    padding-top: 139px;
    padding-bottom: 120px;
}
.isIOS .page-header {
    display: none;
}
</style>

<script>
import * as service from '../service';
import Icon from '../../../lib/components/SettingIconMobile.vue';
let infoCache = [];

export default {
    components: { Icon },
    data() {
        let self = this;
        return {
            channelId: '',
            vid: '',
            swiperOption: {
                loop: true,
                autoplay: {
                    delay: 2000,
                    disableOnInteraction: false
                },
                pagination: {
                    el: '.swiper-pagination'
                },
                on: {
                    tap() {
                        let i = this.clickedIndex - 1;
                        let len = self.homePageInfo.length;
                        if (i == -1) {
                            i = len - 1;
                        } else if (i == len) {
                            i = 0;
                        }
                        self.showDetailInfo(self.homePageInfo[i]);
                    }
                }
            },
            homePageInfo: [],
            ...service.getInitData()
        };
    },
    computed: {
        detailVisible() {
            return this.$store.state.detailVisible;
        }
    },
    watch: {
        detailVisible(visible) {
            if (visible) {
                HdSmart.UI.toggleHeadAndFoot(false);
                this.$refs.swiper.swiper.autoplay.stop();
            } else {
                HdSmart.UI.toggleHeadAndFoot(true);
                this.$refs.swiper.swiper.autoplay.start();
            }
        }
    },
    methods: {
        touchMove(e) {
            e.preventDefault();
        },
        volupStart(e) {
            this.timeOutEventUp = 1;
            e.preventDefault();
            this.cmd('rcVolumeUpStart');
        },
        voldownStart(e) {
            this.timeOutEventDown = 1;
            e.preventDefault();
            this.cmd('rcVolumeDownStart');
        },
        volupEnd(e) {
            e.preventDefault();
            if (this.timeOutEventUp) {
                this.cmd('rcVolumeUpStop');
                this.timeOutEventUp = 0;
            } else {
                this.cmd('rcVolumeUp');
            }
        },
        voldownEnd(e) {
            e.preventDefault();

            if (this.timeOutEventDown) {
                this.cmd('rcVolumeDownStop');
                this.timeOutEventDown = 0;
            } else {
                this.cmd('rcVolumeDown');
            }
        },
        cmd(name) {
            service.onClickEvent(name);
        },
        showDetailInfo(item) {
            this.$store.dispatch('showDetail', item);
        },
        pageInit() {
            service.getHomePageInfo(data => {
                infoCache = data;
                this.homePageInfo = infoCache;
            });
        }
    },
    mounted() {
        service.RemoteController({ show: false });
        this.$nextTick(() => {
            if (!infoCache.length) {
                this.pageInit();
            } else {
                this.homePageInfo = infoCache;
            }
        })
    }
};
</script>
