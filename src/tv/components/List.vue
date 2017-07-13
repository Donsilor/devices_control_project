<template>
    <div class="page-list">
        <div class="fixedtop">
            <topbar :title="title"></topbar>
            <!-- 条件 -->
            <div class="filters">
                <!-- 地区 -->
                <div class="row">
                    <a href="#" 
                        v-for="item in region"
                        @click.prevent="setParam('current_region',item.regionId)"
                        v-bind:class="{active:current_region==item.regionId}" >
                        {{item.region}}
                    </a>
                </div>
                <!-- 分类 -->
                <div class="row">
                    <a href="#" 
                        v-for="item in category" 
                        @click.prevent="setParam('current_category',item.cateId)"
                        v-bind:class="{active:current_category==item.cateId}">
                        {{item.cate}}
                    </a>
                </div>
                <!-- 年份 -->
                <div class="row">
                    <a href="#" 
                        v-for="item in year"
                        @click.prevent="setParam('current_year',item.yearrange)"
                        v-bind:class="{active:current_year==item.yearrange}">
                        {{item.year}}
                    </a>
                </div>
                <!-- 排序 -->
                <div class="row">
                    <a href="#" 
                        v-for="item in orderby"
                        @click.prevent="setParam('current_orderby',item.orderId)"
                        v-bind:class="{active:current_orderby==item.orderId}">
                        {{item.text}}
                    </a>
                </div>
                
            </div>
        </div>
        <!-- 列表 -->
        <ul class="vlist list-m60">
            <li class="vitem" v-for="item in list" @click="showDetailInfo(item.channelId,item.vid)">
                <img :src="item.pictureUrl" alt="">
                <div class="name">{{item.title}}</div>
                <span class="update">{{item.lastUpdateSet}}</span>
            </li>
        </ul>
        <!-- 加载更多 -->
        <div class="loadmore">

        </div>
        <!-- 详情页 -->
        <detail :vid="vid" :channel-id="channelId" ref="detail"></detail>
    </div>
</template>

<style lang="scss">
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
            margin-bottom: 24px;
        }
        a{  
            margin-right: 38px;
            color: #7f8082;
            border-radius: 2px;
            padding: 2px 12px;
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
        margin: 0 30px;
        position: relative;
        img{
            width: 300px;
            height: 440px;
            display: block;
        }
        .update{    
            position: absolute;
            left: 0; 
            top: 386px;
            background: rgba(0,0,0,.5);
            color: #fff;
            padding: 0 12px;
        }
        .name{  
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 2;
            height: 96px;
        }
    }
</style>

<script>

    import * as service from '../service'
    import config from '../config'

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
                orderby: config.orderby,
                current_category: '',
                current_region: '',
                current_year: '',
                current_orderby: '',
                total: 0,
                pageNo: 1,
                pageSize: 20,
                loading: false,
                noMore: false,
                noData: false
            }
        },
        methods: {
            setParam(key, value) {    
                this[key] = value
                this.pageNo = 1
                this.filterData()
            },
            filterData() {   
                this.loading = true
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
                    this.list = (this.pageNo > 1 ? this.list : []).concat(data.data.list)
                    this.total = data.data.total
                })
            },
            loadMore() {
                if(this.loading){   
                    return 
                }
                if(this.pageSize*this.pageNo >= this.total){    
                    return 
                }
                
                if(document.body.scrollTop+document.documentElement.offsetHeight >= document.body.scrollHeight-10){   
                    this.pageNo++
                    this.filterData()
                }
            },
            showDetailInfo(channelId, vid) {
                this.$refs.detail.visible = true
                this.channelId = channelId
                this.vid = vid
            }
        },
        mounted() {
            service.getChannelData(this.channelId,(data)=>{ 
                //data = data.data
                this.list = data.data.list
                this.total = data.data.total
                this.category = config.category.concat(data.category)
                this.region = config.region.concat(data.region)
                this.year = config.year.concat(data.year)
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