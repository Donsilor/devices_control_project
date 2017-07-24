<template>
    <div class="page-list">
        <div class="fixedtop">
            <topbar :title="title"></topbar>
            <!-- 条件 -->
            <div class="filters">
                <!-- 地区 --> 
                <dl class="row">
                    <dt>
                        <a href="#" 
                            @click.prevent="setParam('current_region','')"
                            :class="{active:current_region==''}">全部地区</a>
                    </dt>
                    <dd>
                        <a href="#" 
                            v-for="item in region"
                            :key="item.regionId"
                            @click.prevent="setParam('current_region',item.regionId)"
                            :class="{active:current_region==item.regionId}">
                            {{item.region}}
                        </a>
                    </dd>
                </dl>
                <!-- 分类 -->
                <dl class="row">
                    <dt>
                        <a href="#" 
                            @click.prevent="setParam('current_category','')"
                            :class="{active:current_category==''}">全部分类</a>
                    </dt>
                    <dd>
                        <a href="#" 
                            v-for="item in category"
                            :key="item.cateId"
                            @click.prevent="setParam('current_category',item.cateId)"
                            :class="{active:current_category==item.cateId}">
                            {{item.cate}}
                        </a>
                    </dd>
                </dl>
                <!-- 年份 -->
                <dl class="row">
                    <dt>
                        <a href="#" 
                            @click.prevent="setParam('current_year','')"
                            :class="{active:current_year==''}">全部年份</a>
                    </dt>
                    <dd>
                        <a href="#" 
                            v-for="item in year"
                            :key="item.yearrange"
                            @click.prevent="setParam('current_year',item.yearrange)"
                            :class="{active:current_year==item.yearrange}">
                            {{item.year}}
                        </a>
                    </dd>
                </dl>
                <!-- 排序 -->
                <dl class="row">
                    <dd>
                        <a href="#" 
                            v-for="item in orderby"
                            :key="item.orderId"
                            @click.prevent="setParam('current_orderby',item.orderId)"
                            :class="{active:current_orderby==item.orderId}">
                            {{item.text}}
                        </a>
                    </dd>
                </dl>
                
            </div>
        </div>
        <!-- 列表 -->
        <ul class="vlist list-m60 clearfix">
            <li class="vitem" 
                v-for="item in list" 
                :key="item.vid" 
                @click="showDetailInfo(item.channelId,item.vid)">
                <img v-lazy="getThumbPic(item.pictureUrl)" alt="">
                <div class="name">{{item.title}}</div>
                <span class="update">
                    {{getUpdateSet(item.setCount,item.lastUpdateSet)}}
                </span>
                <!-- <span class="score">{{item.score}}</span> -->
            </li>
        </ul>
        <!-- 加载更多 -->
        <div class="loadmore">
            <div class="spinner" v-show="loadState === 'LOADING'">
                <div class="rect1"></div>
                <div class="rect2"></div>
                <div class="rect3"></div>
                <div class="rect4"></div>
                <div class="rect5"></div>
                <div class="rect6"></div>
                <div class="rect7"></div>
                <div class="rect8"></div>
            </div>
            <p v-show="loadState === 'LOADED'">加载更多...</p>
            <p class="finish" v-show="loadState === 'NO_MORE'">已加载全部</p>
        </div>
        <!-- 没有数据 -->
        <div class="nodata" v-show="loadState === 'NO_DATA'">
            <i></i>
            <p>暂无结果</p>
        </div>
        <!-- 详情页 -->
        <detail :vid="vid" :channel-id="channelId" ref="detail"></detail>
    </div>
</template>

<style lang="less">
    .page-list{
        padding-top: 400px;
    }
    .fixedtop{  
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        background: #fff;
        z-index: 2;
    }
    .filters{
        margin: 0 60px; 
        padding-top: 36px;
        border-bottom: 1px solid #dbdbdb;
        .row{   
            overflow: hidden;
            height: 66px;
            display: flex;
            width: 100%;
        }
        dt{ 
            width: 180px;
        }
        dd{ 
            width: 100%;
            overflow-x: auto;
            display: -webkit-box;
            -webkit-box-orient: horizontal;
            &::-webkit-scrollbar {
                display: none;
            }
        }
        a{  
            display: block;
            margin-right: 36px;
            color: #7f8082;
            border-radius: 3px;
            padding: 0 12px;
            height: 42px;
            line-height: 42px;
            white-space: nowrap;
            &.active{   
                background: #13d5dc;
                color: #fff;
            }
        }
    }
    .list-m60{  
        margin: 0 60px;
    }
    .vlist{ 
        padding-top: 36px;
    }
    .vitem{ 
        float: left;
        width: 300px; 
        margin: 0 30px 30px;
        position: relative;
        img{
            width: 300px;
            height: 440px;
            display: block;
            background:#ebebeb url(../assets/icn_tv_movie.png) no-repeat center center;
            background-size: 120px 120px;
        }
        .update{    
            position: absolute;
            left: 0; 
            top: 386px;
            background: rgba(0,0,0,.5);
            color: #fff;
            line-height: 30px;
            font-size:24px;
            padding:0 12px;
            border-radius:0 3px 3px 0;
            display:none;
        }
        .score{ 
            position: absolute;
            right: 0;
            top: 27px;
            background: #ffd53d;
            width: 60px;
            line-height: 30px;
            border-radius:3px 0 0 3px;
            font-size:24px;
            text-align: center;
            color:#fff;
            opacity:0.9;
            display:none;
        }
        .name{  
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 2;
            height: 66px;
        }
    }
    .list-001{
        .score{ 
            display: block;
        }
    }
    .list-002,list-003,.list-004{   
        .update{    
            display: block;
        }
    }
    .loadmore{  
        text-align: center;
        padding: 30px 0;
        height: 50px;
        color:#75787a;
        font-size: 24px;
        .finish{
            color:#c8cacc; 
        }
    }
    .spinner > div {
        background-color: #13d5dc;
        height: 12px;
        width: 12px;
        border-radius: 100%;
        display: inline-block;
        animation: stretchdelay 1.2s infinite ease-in-out;
    }
    .spinner .rect2 {
        animation-delay: -1.1s;
    }
    .spinner .rect3 {
        animation-delay: -1.0s;
    }
    .spinner .rect4 {
        animation-delay: -0.9s;
    }
    .spinner .rect5 {
        animation-delay: -0.8s;
    }
    .spinner .rect6 {
        animation-delay: -0.7s;
    }
    .spinner .rect7 {
        animation-delay: -0.6s;
    }
    .spinner .rect8 {
        animation-delay: -0.5s;
    }
    @keyframes stretchdelay {
        0%, 40%, 100% {
            transform: scale(0.5);
        }  20% {
            transform: scale(1.0);
        }
    }

    .nodata{    
        text-align: center;
        color: #c8cacc;
        padding-top: 126px;
        i{  
            width: 360px;
            height: 360px;
            background: url(../assets/img_noresult.png) no-repeat;
            background-size: 100% 100%;
            display: block;
            margin: 0 auto 36px;
        }
    }
</style>

<script>

    import * as service from '../service'
    import _ from '../util'

    export default {
        data() {
            return {    
                title: this.$route.query.channel,
                channelId: this.$route.query.channelId,
                vid: this.$route.query.vid,
                list: [],
                category: [],
                region: [],
                year: [],
                orderby: Object.freeze([
                    {text:'最新',orderId:'year'},
                    {text:'最热',orderId:'iscore'}
                ]),
                current_category: '',
                current_region: '',
                current_year: '',
                current_orderby: 'year',
                total: 0,
                pageNo: 1,
                pageSize: 15,
                //系统loading，初始化页面或pageNo=1
                loading: false,
                /**
                    定义数据加载状态
                    FIRST_LOADING
                    FIRST_LOADED
                    LOADING  分页加载中，显示 分页loading
                    LOADED   分页加载成功，显示 加载更多...
                    NO_DATA  没有数据，显示  暂无结果
                    NO_MORE  全部加载完成，显示 已加载全部
                 */
                loadState: ''
            }
        },
        watch: {
            loading(val) {
                if(val){ 
                    HdSmart.UI.showLoading()
                }else{    
                    HdSmart.UI.hideLoading()
                }
            }
        },
        methods: {
            setParam(key, value) {    
                this[key] = value
                this.pageNo = 1
                this.filterData()
            },
            filterData() {   
                if(this.pageNo === 1){  
                    this.loading = true
                }else{  
                   this.loadState = 'LOADING' 
                }
                service.searchData({
                    channelId: this.channelId,
                    category: this.current_category,
                    region: this.current_region,
                    year: this.current_year,
                    orderby: this.current_orderby,
                    pageSize: this.pageSize,
                    pageNo: this.pageNo
                },(data)=>{ 
                    this.loading = false
                    this.loadState = 'LOADED'
                    if(data.code === 504){  
                        return
                    }
                    if(this.pageNo === 1){
                        window.scrollTo(0,0)
                    }
                    if(data.data){  
                        data = data.data
                    }
                    this.list = Object.freeze((this.pageNo > 1 ? this.list : []).concat(data.list))
                    this.total = data.total
                    if(this.total === 0){    
                        this.loadState = 'NO_DATA'
                    }else if(this.pageSize*this.pageNo >= this.total){    
                        this.loadState = 'NO_MORE' 
                    }
                })
            },
            loadMore: _.debounce(function(){
                if(this.loadState.indexOf('LOADED') < 0){   
                    return 
                }
                var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
                if(scrollTop+window.innerHeight >= document.documentElement.scrollHeight-20){   
                    this.pageNo++
                    this.filterData()
                }
            },300),
            showDetailInfo(channelId, vid) {
                this.$refs.detail.visible = true
                this.channelId = channelId
                this.vid = vid
            },
            getUpdateSet(count, last) {
                if(last == ''){   
                    return ''
                }else if(last === count){   
                    return count + '集全'
                }else{  
                    return '更新至' + last + '集'
                }
            },
            getThumbPic(pic) {  
                return pic.replace('.jpg','_y.jpg')
            }
        },
        mounted() {
            this.loading = true
            service.getChannelData(this.channelId,(data)=>{ 
                this.loading = false
                this.loadState = 'LOADED'
                if(data.code === 504){  
                    return
                }
                this.list = Object.freeze(data.data.list)
                this.category = Object.freeze(data.category)
                this.region = Object.freeze(data.region)
                this.year = Object.freeze(data.year)
                this.total = data.data.total
            }) 
            if(this.$route.query.showDetail === '1' && this.vid){   
                this.showDetailInfo(this.channelId, this.vid)
            }
            window.addEventListener('scroll',this.loadMore)
        },
        destroyed() {
            window.removeEventListener('scroll',this.loadMore) 
        }
    }
</script>