<!--
    列表页,query:{title:"",channelId:""}
-->
<template>
    <div class="page-list">

        <!-- 错误提示 -->
        <div class="error-page" v-if="error" @click="reload">
            <div class="error-tip">
                <img src='../assets/init_err.png' />
                <p>加载失败，请点击屏幕刷新</p>
            </div>
        </div>

        <div class="filters-placeholder" v-show="filterVisible"></div>

        <div class="fixedtop">
            <topbar :title="title"></topbar>
            <!-- 条件 -->
            <div class="filters" v-if="!error">
                <!-- 地区 -->
                <dl class="row" v-show="filterVisible">
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
                <dl class="row" v-show="filterVisible">
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
                <dl class="row" v-show="filterVisible">
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
                <a href="#" class="toggle" :class="{active:filterVisible}" @click.prevent="toggleFilter()">
                    {{filterVisible?'收起':'展开'}}<i></i>
                </a>
            </div>
        </div>
        <!-- 列表 -->
        <ul class="vlist list-m60 clearfix" :class="['list-'+channelId]">
            <li class="vitem"
                v-for="item in list"
                :key="item.vid"
                @click="showDetailInfo(item)">
                <img v-lazy="getThumbPic(item.pictureUrl)" :data-src1="item.pictureUrl" alt="">
                <div class="name">{{item.title}}</div>
                <span class="update">
                    {{getUpdateSet(item.setCount,item.lastUpdateSet)}}
                </span>
                <div class="label">
                    <span class="isvip" v-if="item.ispay && item.ispay !== '1'">付费</span>
                    <span class="score">{{item.score}}</span>
                </div>
            </li>
        </ul>
        <!-- 没有数据 -->
        <div class="nodata" v-show="loadState === 'NO_DATA'">
            <i></i>
            <p>暂无结果</p>
        </div>
        <!-- 加载更多 -->
        <div class="loadmore">
            <!--<div class="spinner" v-show="loadState === 'LOADING'">
                <div class="rect1"></div>
                <div class="rect2"></div>
                <div class="rect3"></div>
                <div class="rect4"></div>
                <div class="rect5"></div>
                <div class="rect6"></div>
                <div class="rect7"></div>
                <div class="rect8"></div>
            </div>-->
            <p v-show="!isFirstLoad && loadState === 'LOADING'">正在加载中...</p>
            <p v-show="!isFirstLoad && loadState === 'LOADED'">加载更多...</p>
            <!--<p class="finish" v-show="loadState === 'NO_MORE'">已加载全部</p>-->
        </div>
    </div>
</template>

<style lang="less">
    .page-list{
        padding-top: 200px; //400
    }
    .fixedtop{
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        z-index: 2;
    }
    .filters-placeholder{
        height: 198px;
    }
    .filters{
        padding: 36px 60px 0;
        background: rgba(255,255,255,.98);
        box-shadow:inset 0 -1px 0 0 #dbdbdb;
        position: relative;
        .toggle{
            position: absolute;
            right: 0px;
            bottom: 4px;
            line-height: 42px;
            color: #75787a;
            padding: 20px;
            font-size: 30px;
            i{
               background: url(../assets/icn_arrow_up.png) no-repeat center right;
               background-size: 24px 12px;
               display: inline-block;
               width: 24px;
               height: 22px;
               margin-left: 2px;
               transform: rotate(180deg);
            }
            &.active i{
                transform: rotate(0deg);
            }
        }
        .row{
            overflow: hidden;
            height: 66px;
            display: flex;
            width: 100%;
        }
        dt{
            width: 210px;
            a{
                margin-right: 0;
                display:inline-block;
            }
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
        .row a{
            display: block;
            margin-right: 36px;
            color: #7f8082;
            border-radius: 3px;
            padding: 0 12px;
            height: 42px;
            line-height: 42px;
            &.active{
                background: #13d5dc;
                color: #fff;
            }
        }
    }
    .list-m60{
        margin-left: 60px;
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
            background-color: #ebebeb;
            background-repeat: no-repeat;
            background-position: center center;
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
        .label{
            position: absolute;
            right: 0;
            top: 27px;
        }
        .isvip{
            background: #f26161;
            width: 60px;
            line-height: 30px;
            border-radius:3px 0 0 3px;
            font-size:24px;
            text-align: center;
            color:#fff;
            opacity:0.9;
            display: block;
            margin-bottom: 5px;
        }
        .score{
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
    /* 根据栏目控制样式显示 */
    .list-001{
        .score{
            display: block;
        }
        img{
            background-image: url(../assets/icn_tv_movie.png)
        }
    }
    .list-002{
        .update{
            display: block;
        }
        img{
            background-image: url(../assets/icn_tv_tvshow.png)
        }
    }
    .list-003{
        .update{
            display: block;
        }
        img{
            background-image: url(../assets/icn_tv_comic.png)
        }
    }
    .list-004{
        .update{
            display: block;
        }
        img{
            background-image: url(../assets/icn_tv_entertainment.png)
        }
    }
    .loadmore{
        text-align: center;
        /*padding: 30px 0;*/
        height: 60px;
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
                vid: '',
                //列表数据
                list: [],
                //分类
                category: [],
                //地区
                region: [],
                //年份
                year: [],
                //排序
                orderby: Object.freeze([
                    {text:'最新', orderId:'year'},
                    {text:'好评', orderId:'iscore'}
                ]),
                //当前分类，默认全部
                current_category: '',
                //当前地区，默认全部
                current_region: '',
                //当前年份，默认全部
                current_year: '',
                //当前年份，默认全部
                current_orderby: 'year',
                //总条数
                total: 0,
                //当前页码
                pageNo: 1,
                //分页数
                pageSize: 20,
                /**
                    加载状态
                    LOADING  分页加载中，显示 分页loading
                    LOADED   分页加载成功，显示 加载更多...
                    NO_DATA  没有数据，显示  暂无结果
                    NO_MORE  全部加载完成，显示 已加载全部
                 */
                loadState: '',
                error: false,
                isFirstLoad: true,
                filterVisible: false,
                //filterToggleClicked: false
            }
        },
        watch: {
            //如果首次加载，则调用app loading
            loadState(val) {
                if(this.isFirstLoad){
                    if(val === 'LOADING'){
                        HdSmart.UI.showLoading()
                    }else if(val === 'LOADED'){
                        HdSmart.UI.hideLoading()
                    }
                }
            }
        },
        methods: {
            toggleFilter() {
                this.filterVisible = !this.filterVisible
                // var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
                // scrollTop += this.filterVisible ? 132 : -132
                // window.scrollTo(0, scrollTop)
            },
            //参数筛选
            setParam(key, value) {
                this[key] = value
                this.filterData(1)
            },
            filterData(page) {
                if(page === 1) this.isFirstLoad = true
                this.loadState = 'LOADING'
                service.searchData({
                    channelId: this.channelId,
                    category: this.current_category,
                    region: this.current_region,
                    year: this.current_year,
                    orderby: this.current_orderby,
                    pageSize: this.pageSize,
                    pageNo: page
                },(err, data)=>{
                    this.loadState = 'LOADED'
                    if(err) return

                    if(data.data){
                        data = data.data
                    }
                    if(data.list == ""){
                        data.list = []
                    }
                    this.$nextTick(()=>{
                        this.list = Object.freeze((page === 1 ? [] : this.list).concat(data.list))
                        this.total = data.total
                        this.pageNo = page
                        if(this.isFirstLoad){
                            this.isFirstLoad = false
                            window.scrollTo(0,0)
                        }
                        if(this.total === 0){
                            //没有数据
                            this.loadState = 'NO_DATA'
                        }else if(this.pageSize*this.pageNo >= this.total){
                            //加载完全部
                            this.loadState = 'NO_MORE'
                            //HdSmart.UI.toast('已加载全部')
                        }
                    })
                })
            },
            loadMore: _.debounce(function(){
                var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
                if(scrollTop > 0 && (scrollTop+window.innerHeight >= document.documentElement.scrollHeight-15)){
                    if(this.loadState === 'LOADING' || this.loadState === 'NO_DATA'){
                        return
                    }
                    if(this.loadState === 'NO_MORE'){
                        HdSmart.UI.toast('已加载全部')
                        return
                    }
                    this.filterData(this.pageNo + 1)
                }
            },300),
            showDetailInfo(item) {
                this.$store.dispatch('showDetail', item)
            },
            getUpdateSet(count, last) {
                if(!count || !last || count == '0' || last == '0'){
                    return ''
                }else if(last === count){
                    return count + '集全'
                }else{
                    return '更新至' + last + '集'
                }
            },
            //换成小图地址
            getThumbPic(pic) {
                return pic.replace('.jpg','_y.jpg')
            },
            reload() {
                if(this.error){
                    this.error = false
                    this.onPageInit()
                }
            },
            onPageInit() {
                this.loadState = 'LOADING'
                service.getChannelData(this.channelId,(err, data)=>{
                    this.loadState = 'LOADED'
                    if(err){
                        this.error = true
                        return
                    }
                    this.category = Object.freeze(data.category)
                    this.region = Object.freeze(data.region)
                    this.year = Object.freeze(data.year)
                    this.list = Object.freeze(data.data.list)
                    this.total = data.data.total
                    this.$nextTick(()=>{this.isFirstLoad = false})
                })
            }
        },
        mounted() {
            this.onPageInit()
            this.$Lazyload.$on('error',function({el, src, loading}){
                el.src = el.dataset.src1
                el.onerror = function(){
                    el.src = loading
                    el.onerror = null
                }
            })
            window.addEventListener('scroll',this.loadMore)
        },
        destroyed() {
            window.removeEventListener('scroll',this.loadMore)
        }
    }
</script>
