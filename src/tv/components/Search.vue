<template>
    <div class="page-search">
        <topbar class="topbar-fixed">
            <form class="search_bar" @submit.prevent="submit">
                <div class="search_input">
                    <input autofocus type="text" placeholder="输入片名、导演、演员搜索" v-model="word" @input="fuzzySearch">
                    <a href="#" class="del" v-show="this.word !== ''" @click.prevent="clearWord"></a>
                </div>
                <input type="submit" value="搜索" class="search_submit">
            </form>
        </topbar>
        <!-- 搜索建议 -->
        <div class="search_suggest" v-show="curpage===2">
            <ul>
                <li @click="doSearch(item.text)" v-for="item in relatedData" v-html="item.html"></li>
            </ul>
        </div>
        <!-- 搜搜历史 -->
        <div class="search_history" v-show="curpage===1">
            <div class="hd">
                <a href="#" class="del" @click.prevent="clearHistory"></a>
                搜索记录
            </div>
            <ul class="bd clearfix">
                <li @click="doSearch(item)" v-for="item in historyData">
                    {{item}}
                </li>
            </ul>
        </div>
        <!-- 搜索结果 -->
        <div class="search_result" v-show="curpage===3">
            <div class="hd clearfix">
                <div class="tab">
                    <a href="#"
                        @click.prevent="setParam('current_channel','')"
                        v-bind:class="{active:current_channel==''}">
                        全部
                    </a>
                    <a href="#" 
                        v-for="item in channels"
                        @click.prevent="setParam('current_channel',item.channelId)"
                        v-bind:class="{active:current_channel==item.channelId}">
                        {{item.channel}}
                    </a>
                </div>
                <div class="sorts">
                    <a href="#" 
                        v-for="item in orderby"
                        @click.prevent="setParam('current_orderby',item.orderId)"
                        v-bind:class="{active:current_orderby==item.orderId}">
                        {{item.text}}
                    </a>
                </div>
            </div>
            <ul class="vlist clearfix">
                <li class="vitem" v-for="item in resultData" @click="showDetailInfo(item.channelId,item.vid)">
                    <img :src="item.pictureUrl" alt="">
                    <div class="name">{{item.title}}</div>
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
        </div>
        <!-- 详情页 -->
        <detail :vid="vid" :channel-id="channelId" ref="detail"></detail>
    </div>
</template>

<style lang="scss">
    .page-search{
        padding-top: 96px;
    }
    .page-search .right{
        display: none;
    }
    .search_bar{
        padding: 12px 0 0 84px;
        display: flex;
    }
    .search_input{
        position: relative;
        width: 100%;
        input{  
            border:1px solid #dbdbdb;
            height: 70px;
            width: 100%;
            box-sizing: border-box;
            background:#fff url(../assets/icn_topbar_search_pressed.png) no-repeat 25px center;
            background-size: 34px 34px;
            padding-left: 85px;
            font-size: 30px;
            &::-webkit-input-placeholder{
                color: #c8cacc;
            }
        }
        .del{   
            position: absolute;
            width: 48px;
            height: 48px;
            right: 24px;
            top: 12px;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-image: url(../assets/btn_input_delete_normal.png);
            &:active{   
               background-image: url(../assets/btn_input_delete_pressed.png); 
            }
        }
    }
    .search_submit{ 
        width: 108px;
        font-size: 30px;
        appearance: none;
        border: none;
        background: none;
    }
    .search_history{    
        margin: 0 60px;
        .hd{    
            color: #75787a;
            padding: 48px 0 24px;
            border-bottom: 1px solid #dbdbdb;
            margin-bottom: 24px;
            .del{   
                float: right;
                margin-right: 15px;
                width: 42px;
                height: 42px;
                background-repeat: no-repeat;
                background-size: 100% 100%;
                background-image: url(../assets/btn_clear_normal.png);
                &:active{   
                  background-image: url(../assets/btn_clear_pressed.png);  
                }
            }
        }
        .bd{    
            li{  
                width: 324px;
                height: 84px;
                line-height: 84px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                float: left;
            }
        }
    }
    .search_suggest{    
        padding:0 48px;
        li{ 
            height: 120px;
            line-height: 120px;
            border-bottom: 1px solid #dbdbdb;
            strong{ 
                color: #13d5dc;
            }
            &:last-child{   
                border-bottom: 0;
            }
        }
        border-bottom: 1px solid #dbdbdb;
    }
    .search_result{ 
        margin: 0 60px;
        .hd{    
            border-bottom: 1px solid #dbdbdb;
        }
        .tab{   
            float: left;
            a{  
                float: left;
                padding: 42px 12px 30px;
                margin-right: 36px;
                color: #75787a;
                &.active{   
                   color: #13d5dc;
                   border-bottom: 3px solid #13d5dc;
                }
            }
        }
        .sorts{
            float: right;
            margin-top: 36px;
            a{  
                float: left;
                width: 84px;
                height: 42px;
                text-align: center;
                line-height: 42px;
                border-radius: 3px;
                margin-left: 36px;
                color: #75787a;
                &.active{   
                    color: #fff;
                    background: #13d5dc;
                }
            }
        }
    }
</style>

<script>

    import * as service from '../service'
    import _ from '../util'
    
    function splitWord(kw,input){   
        return input.replace(new RegExp('('+kw+')','g'),'<strong>$1</strong>')
    }

    export default {   
        data(){
            return {    
                word: '',
                curpage: 1, // 默认1,联想词2,搜索结果3
                channels: service.getInitData().channels,
                orderby: [
                    {text:'最新',orderId:'year'},
                    {text:'最热',orderId:'iscore'}
                ],
                channelId: '',
                vid: '',
                relatedData: [],
                historyData: [],
                resultData: [],
                current_channel: '',
                current_orderby: 'year',
                total: 0,
                pageNo: 1,
                pageSize: 1,
                //系统loading，初始化页面或pageNo=1
                loading: false,
                /**
                    定义数据加载状态
                    LOADING  分页加载中，显示 分页loading
                    LOADED   分页加载成功，显示 加载更多...
                    NO_DATA  没有数据，显示  暂无结果
                    NO_MORE  全部加载完成，显示 已加载全部
                 */
                loadState: ''
            }
        },
        watch: {    
            word() { 
                if(this.word === '' && this.curpage === 2){ 
                    this.curpage = 1
                }
            },
            loading(val) {
                if(val){ 
                    HdSmart.UI.showLoading()
                }else{    
                    HdSmart.UI.hideLoading()
                }
            }
        },
        methods: {  
            clearWord() {
                this.word = ''
                document.querySelectorAll('.search_input input')[0].focus()
            },
            clearHistory() {
                HdSmart.UI.alert('清空记录', '确认要清空所有搜索记录？', ()=>{  
                    service.onClickEvent('clearSearchHistory')
                }, '清空', '取消')
            },
            submit() {
                var kw = this.word.trim()
                if(kw){
                    this.doSearch(kw)
                }
            },
            doSearch(word) {   
                this.curpage = 3 
                this.word = word
                this.current_channel = ''
                this.current_orderby = 'year'
                this.pageNo = 1
                this.filterData()
            },
            fuzzySearch: _.debounce(function(){ 
                var kw = this.word.trim()
                if(kw){
                    this.curpage = 2
                    service.fuzzySearch(kw, (data)=>{  
                        this.relatedData = data.data.map((item)=>{
                            return {    
                                text: item,
                                html: splitWord(kw, item)
                            }
                        })
                    })
                }
            },300),
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
                    keyword: this.word.trim(),
                    channelId: this.current_channel,
                    orderby: this.current_orderby,
                    pageSize: this.pageSize,
                    pageNo: this.pageNo
                },(data)=>{ 
                    if(this.pageNo === 1){
                        window.scrollTo(0,0)
                        this.loading = false
                    }
                    this.loadState = 'LOADED'
                    this.resultData = (this.pageNo > 1 ? this.resultData : []).concat(data.data.list)
                    this.total = data.data.total
                    if(this.total === 0){    
                        this.loadState = 'NO_DATA'
                    }
                    if(this.pageSize*this.pageNo >= this.total){    
                        this.loadState = 'NO_MORE' 
                    }
                })
            },
            loadMore: _.debounce(function(){
                
                if(this.curpage !== 3){ 
                    return 
                }
                if(this.loadState.indexOf('LOADED') < 0){   
                    return 
                }
                
                if(document.body.scrollTop+document.documentElement.offsetHeight >= document.body.scrollHeight-10){   
                    this.pageNo++
                    this.filterData()
                }
            },300),
            showDetailInfo(channelId, vid) {
                this.$refs.detail.visible = true
                this.channelId = channelId
                this.vid = vid
            }
        },
        mounted() { 
            service.getSearchHistory((data)=>{  
                this.historyData = data.data
            })
            window.addEventListener('scroll',this.loadMore)
        },
        destroyed() {
            window.removeEventListener('scroll',this.loadMore)
        }
    }
</script>