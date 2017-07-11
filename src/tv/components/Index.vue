<template>
    <div class="page-index grid">
        <div class="span1">
            <div class="swiper">
                此处是轮播，2秒1滚，循环滚<br>
                <router-link 
                    v-for="item in homePageInfo" 
                    :to="{  
                        name: 'list',
                        query: {    
                            channelId: item.channelId,
                            channel: item.channel,
                            showDetail: '1',
                            vid: item.vid
                        }
                    }"
                    :key="item.vid"    
                >{{item.title}}</router-link>
            </div>
        </div>
        <div class="span2">
            <router-link to="/search" class="item item-search">搜索</router-link>
            <a href="#" @click.prevent="openScreen" class="item item-tp">投屏</a>
            <a href="#" @click.prevent="openControl" class="item item-ykq">遥控器</a>
        </div>
        <div class="span3">
            <router-link 
                v-for="item in channels" 
                :to="{
                    name: 'list',
                    query: {    
                        channelId: item.channelId,
                        channel: item.channel
                    }
                }" 
                :key="item.channelId"
                class="item"
            >{{item.channel}}</router-link>
        </div>
    </div>
</template>

<style lang="scss">
    .grid{  
        width: 820px;
        left: 50%;
        top: 50%;
        position: absolute;
        transform: translate(-50%,-50%);
        .span1{
            float: left;
            width: 600px;
            height: 250px;
        }
        .span2{ 
            float: left;
            width: 200px;
        }
        .span3{ 
            clear: left;
        }
        .item{
            float: left;
            width: 200px;
            height: 100px;
            background: #ccc;
        }
    }
</style>

<script>

    import * as service from '../service'

    export default {
        data() {
            return {
                ...service.getInitData()
            }
        },
        methods: {
            openScreen() {
                service.onClickEvent('screenProjectionEvent')
            },
            openControl() {
                service.onClickEvent('remoteControlEvent')
            }
        },
        created() {  
            console.log(this.homePageInfo)
        }
    }
</script>