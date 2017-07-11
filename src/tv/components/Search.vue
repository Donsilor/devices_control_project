<template>
    <div class="page-search">
        <topbar class="topbar-fixed">
            <form class="search_bar" @submit.prevent="submit">
                <div class="search_input">
                    <input type="text" placeholder="输入片名、导演、演员搜索" v-model="word" @input="fuzzySearch">
                    <a href="#" class="del" v-show="this.word !== ''" @click.prevent="clearWord"></a>
                </div>
                <input type="submit" value="搜索" class="search_submit">
            </form>
        </topbar>

        <div class="search_suggest" v-show="curpage===2">
            <ul>
                <li @click="doSearch(item.text)" v-for="item in relatedData" v-html="item.html"></li>
            </ul>
        </div>

        <div class="search_history" v-show="curpage===1">
            <div class="hd">
                <a href="" class="del" @click="clearHistory"></a>
                搜索记录
            </div>
            <ul class="bd clearfix">
                <li @click="doSearch(item)" v-for="item in historyData">
                    {{item}}
                </li>
            </ul>
        </div>
        
        <div class="search_result" v-show="curpage===3">
            <div class="hd clearfix">
                <div class="tab">
                    <a href="" class="active">全部</a>
                    <a href="">电影</a>
                    <a href="">动漫</a>
                </div>
                <div class="sorts">
                    <a href="">最新</a>
                    <a href="">最热</a>
                </div>
            </div>
            <ul class="vlist clearfix">
                <li class="vitem" v-for="item in resultData" @click="showDetailInfo(item.channelId,item.vid)">
                    <img :src="item.pictureUrl" alt="">
                    <div class="name">{{item.title}}</div>
                </li>
            </ul>
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
    
    function splitWord(kw,input){   
        return input.replace(new RegExp('('+kw+')','g'),'<strong>$1</strong>')
    }

    export default {   
        data(){
            return {    
                word: '',
                curpage: 1, // 默认1,联想词2,搜索结果3
                channelId: '',
                vid: '',
                relatedData: [],
                historyData: [],
                resultData: []
            }
        },
        watch: {    
            word() { 
                if(this.word === '' && this.curpage === 2){ 
                    this.curpage = 1
                }
            }
        },
        methods: {  
            clearWord() {
                this.word = ''
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
                service.searchData({
                    keyword: word
                },(data)=>{ 
                    console.log(data.searchData)
                    this.resultData = data.searchData.list
                })
            },
            fuzzySearch() { 
                var kw = this.word.trim()
                if(kw){
                    this.curpage = 2
                    service.fuzzySearch(kw, (data)=>{  
                        this.relatedData = data.fuzzySearch.map((item)=>{
                            return {    
                                text: item,
                                html: splitWord(kw, item)
                            }
                        })
                    })
                }
            },
            showDetailInfo(channelId, vid) {
                this.$refs.detail.visible = true
                this.channelId = channelId
                this.vid = vid
            }
        },
        created() { 
            service.getSearchHistory((data)=>{  
                this.historyData = data.getSearchHistory
            })
        }
    }
</script>