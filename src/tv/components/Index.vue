<template>
<div class="page-index">
    <div class="grid" v-once>
        <div class="span1">
            <div class="swiper">
                <swiper :options="swiperOption">
                    <swiper-slide 
                        v-for="item in homePageInfo" 
                        :key="item.vid">
                    <a href="#" @click.prevent="showDetailInfo(item.channelId,item.vid)"> 
                        <img :src="item.pictureUrl">
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

    <!-- 详情页 -->
    <detail :vid="vid" :channel-id="channelId" @onClose="onDetailClose" ref="detail"></detail>
</div>
</template>

<style lang="less">
    .page-index{    
        background: #f2f2f2; 
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
        width: 1364px;
        .span1{
            float: left;
            width: 1020px;
            height: 500px;
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
            border-radius:6px;
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
        img{
            width: 100%;
            height: 100%;
            border-radius: 6px;
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
            border-radius:1.5px;
        }
        .swiper-pagination-bullet-active{  
            background: #13d5dc
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
                    pagination: '.swiper-pagination'
                },
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
            },
            onDetailClose(){    
                HdSmart.UI.toggleHeadAndFoot(true)
            },
            // 根据栏目id取得栏目名称
            getChannelName(channelId) {  
                let result = this.channels.filter((item)=>{
                    return item.channelId === channelId
                })
                return result[0].channel
            }
        }
    }
</script>