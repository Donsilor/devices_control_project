<!--
    搜索页面
-->
<template>
    <div class="page-search">
        <topbar class="topbar-fixed">
            <form class="search_bar" @submit.prevent="submit">
                <div class="search_input">
                    <input type="text" placeholder="输入片名、导演、演员搜索" v-model="word" @input="fuzzySearch">
                    <a href="#" class="del" v-show="this.word != ''" @click.prevent="clearWord"></a>
                </div>
                <input type="submit" value="搜索" class="search_submit">
            </form>
        </topbar>
        <div class="status-tip-placeholder" v-show="$store.state.tvStatus.tvOnlineStatus!=1"></div>
        <status-tip class="sp_status_search" />
        <!-- 搜索建议 -->
        <div class="search_suggest" v-show="curpage===2">
            <ul>
                <li @click="doSearch(item.text)" v-for="item in suggestData" v-html="item.html"></li>
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
            <div class="hd clearfix" v-show="resultData.length && loadState !== 'NO_DATA' || current_channel!=''">
                <div class="tab">
                    <a href="#" @click.prevent="setParam('current_channel','')" :class="{active:current_channel==''}">
                        全部
                    </a>
                    <a href="#" v-for="item in channels" @click.prevent="setParam('current_channel',item.channelId)" :class="{active:current_channel==item.channelId}">
                        {{item.channel}}
                    </a>
                </div>
                <div class="sorts">
                    <a href="#" v-for="item in orderby" @click.prevent="setParam('current_orderby',item.orderId)" :class="{active:current_orderby==item.orderId}">
                        {{item.text}}
                    </a>
                </div>
            </div>
            <ul class="vlist clearfix">
                <li class="vitem" v-for="item in resultData" :key="item.vid" @click="showDetailInfo(item)" :class="['item-'+item.channelId]">
                    <img v-lazy="getThumbPic(item.pictureUrl)" :data-src1="item.pictureUrl" alt="">
                    <div class="name">{{item.title}}</div>
                    <span class="update" v-if="item.channelId!='001'">
                        {{getUpdateSet(item.setCount,item.lastUpdateSet)}}
                    </span>
                    <div class="label">
                        <span class="isvip" v-if="item.ispay && item.ispay !== '1'">付费</span>
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
                <!--
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
                -->
                <p v-show="!isFirstLoad && loadState === 'LOADING'">正在加载中...</p>
                <p v-show="!isFirstLoad && loadState === 'LOADED'">加载更多...</p>
                <!--<p class="finish" v-show="loadState === 'NO_MORE'">已加载全部</p>-->
            </div>
        </div>
    </div>
</template>

<style lang="less">
.page-search {
    padding-top: 96px;
    font-size: 30px;
}
.page-search .right {
    display: none;
}
.search_bar {
    padding: 12px 0 0 100px;
    display: flex;
}
.search_input {
    position: relative;
    width: 100%;
    input {
        vertical-align: top;
        border: 1px solid #dbdbdb;
        height: 70px;
        width: 100%;
        box-sizing: border-box;
        background: #fff
            url(../../../lib/base/tv/assets/icn_topbar_search_pressed.png)
            no-repeat 25px center;
        background-size: 34px 34px;
        padding-left: 85px;
        font-size: 30px;
        &::-webkit-input-placeholder {
            color: #c8cacc;
        }
        &:focus {
            /*border: 1px solid #13d5dc;*/
            outline: none;
        }
    }
    .del {
        position: absolute;
        width: 48px;
        height: 48px;
        right: 24px;
        top: 12px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-image: url(../../../lib/base/tv/assets/btn_input_delete_normal.png);
        &:active {
            background-image: url(../../../lib/base/tv/assets/btn_input_delete_pressed.png);
        }
    }
}
.search_submit {
    width: 150px;
    font-size: 30px;
    appearance: none;
    border: none;
    background: none;
    outline: none;
}
.search_history {
    margin: 0 60px;
    .hd {
        color: #75787a;
        padding: 48px 0 24px;
        border-bottom: 1px solid #dbdbdb;
        margin-bottom: 24px;
        .del {
            float: right;
            margin-right: 15px;
            width: 42px;
            height: 42px;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-image: url(../../../lib/base/tv/assets/btn_clear_normal.png);
            &:active {
                background-image: url(../../../lib/base/tv/assets/btn_clear_pressed.png);
            }
        }
    }
    .bd {
        li {
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
.search_suggest {
    padding-left: 48px;
    li {
        height: 120px;
        line-height: 120px;
        border-bottom: 1px solid #dbdbdb;
        strong {
            color: #13d5dc;
            font-weight: normal;
        }
        &:last-child {
            border-bottom: 0;
        }
    }
    border-bottom: 1px solid #dbdbdb;
}
.search_result {
    margin: 0 60px;
    .hd {
        border-bottom: 1px solid #dbdbdb;
    }
    .tab {
        float: left;
        a {
            float: left;
            padding: 42px 12px 30px;
            margin-right: 36px;
            color: #75787a;
            &.active {
                color: #13d5dc;
                border-bottom: 3px solid #13d5dc;
            }
        }
    }
    .sorts {
        float: right;
        margin-top: 36px;
        a {
            float: left;
            width: 84px;
            height: 42px;
            text-align: center;
            line-height: 42px;
            border-radius: 3px;
            margin-left: 36px;
            color: #75787a;
            &.active {
                color: #fff;
                background: #13d5dc;
            }
        }
    }
}
</style>

<script>
import * as service from "../service";
import _ from "../util";

//关键字加粗
function splitWord(kw, input) {
    return input.replace(
        new RegExp("(" + kw + ")", "g"),
        "<strong>$1</strong>"
    );
}

export default {
    data() {
        return {
            word: "",
            //当前视图：1默认,2联想词,3搜索结果
            curpage: 1,
            //栏目，目前无法根据搜索结果过滤，显示全部
            channels: service.getInitData().channels,
            //排序
            orderby: [
                { text: "相关", orderId: "" },
                { text: "最新", orderId: "year" },
                { text: "好评", orderId: "iscore" }
            ],
            channelId: "",
            vid: "",
            //搜索建议，模糊查找
            suggestData: [],
            //搜索历史
            historyData: [],
            //搜索结果
            resultData: [],
            //当前栏目
            current_channel: "",
            //当前排序
            current_orderby: "",
            //总条数
            total: 0,
            //当前页码
            pageNo: 1,
            //分页数
            pageSize: 15,
            /**
                    加载状态
                    LOADING  分页加载中，显示 分页loading
                    LOADED   分页加载成功，显示 加载更多...
                    NO_DATA  没有数据，显示  暂无结果
                    NO_MORE  全部加载完成，显示 已加载全部
                 */
            loadState: "",
            isFirstLoad: true
        };
    },
    watch: {
        word() {
            // if(this.word === '' && this.curpage === 2){
            if (this.word === "") {
                this.curpage = 1;
                this.getHistory();
            }
        },
        loadState(val) {
            if (this.isFirstLoad) {
                if (val === "LOADING") {
                    HdSmart.UI.showLoading();
                } else if (val === "LOADED") {
                    HdSmart.UI.hideLoading();
                }
            }
        }
    },
    methods: {
        //删除搜索词
        clearWord() {
            this.word = "";
            this.$el.querySelector(".search_input input").focus();
        },
        //清空搜索历史
        clearHistory() {
            HdSmart.UI.alert(
                {
                    title: "清空记录",
                    message: "确认要清空所有搜索记录？",
                    okText: "清空",
                    cancelText: "取消"
                },
                val => {
                    if (val) {
                        service.onClickEvent("clearSearchHistory");
                        this.historyData = [];
                    }
                }
            );
        },
        //提交
        submit() {
            var kw = this.word.trim();
            if (kw) {
                this.doSearch(kw);
                this.$el.querySelector(".search_input input").blur();
            }
        },
        doSearch(word) {
            this.curpage = 3;
            this.word = word;
            this.current_channel = "";
            this.current_orderby = "";
            this.filterData(1);
        },
        //模糊查询
        fuzzySearch: _.debounce(function() {
            var kw = this.word.trim();
            if (kw) {
                this.curpage = 2;
                service.fuzzySearch(kw, (err, data) => {
                    if (err) return;
                    this.suggestData = data.data.map(item => {
                        return {
                            text: item,
                            html: splitWord(kw, item)
                        };
                    });
                });
            }
        }, 100),
        setParam(key, value) {
            this[key] = value;
            this.filterData(1);
        },
        filterData(page) {
            if (page === 1) this.isFirstLoad = true;
            this.loadState = "LOADING";
            service.searchData(
                {
                    keyword: this.word.trim(),
                    channelId: this.current_channel,
                    orderby: this.current_orderby,
                    pageSize: this.pageSize,
                    pageNo: page
                },
                (err, data) => {
                    this.loadState = "LOADED";
                    if (err) return;

                    if (data.data) {
                        data = data.data;
                    }
                    if (data.list == "") {
                        data.list = [];
                    }
                    this.$nextTick(() => {
                        this.resultData = Object.freeze(
                            (page === 1 ? [] : this.resultData).concat(
                                data.list
                            )
                        );
                        this.total = data.total;
                        this.pageNo = page;
                        if (this.isFirstLoad) {
                            this.isFirstLoad = false;
                            window.scrollTo(0, 0);
                        }
                        if (this.total === 0) {
                            this.loadState = "NO_DATA";
                        } else if (this.pageSize * this.pageNo >= this.total) {
                            this.loadState = "NO_MORE";
                            //HdSmart.UI.toast('已加载全部')
                        }
                    });
                }
            );
        },
        loadMore: _.debounce(function() {
            if (this.curpage !== 3) {
                return;
            }

            var scrollTop =
                document.documentElement.scrollTop ||
                window.pageYOffset ||
                document.body.scrollTop;
            if (
                scrollTop > 0 &&
                scrollTop + window.innerHeight >=
                    document.documentElement.scrollHeight - 15
            ) {
                if (
                    this.loadState === "LOADING" ||
                    this.loadState === "NO_DATA"
                ) {
                    return;
                }
                if (this.loadState === "NO_MORE") {
                    HdSmart.UI.toast("已加载全部");
                    return;
                }
                this.filterData(this.pageNo + 1);
            }
        }, 300),
        showDetailInfo(item) {
            this.$store.dispatch("showDetail", item);
        },
        getUpdateSet(count, last) {
            if (!count || !last || count == "0" || last == "0") {
                return "";
            } else if (last === count) {
                return count + "集全";
            } else {
                return "更新至" + last + "集";
            }
        },
        getThumbPic(pic) {
            return pic.replace(".jpg", "_y.jpg");
        },
        getHistory() {
            service.getSearchHistory((err, data) => {
                if (err) return;
                this.historyData = data.data;
            });
        }
    },
    mounted() {
        this.getHistory();
        service.RemoteController({'show':true});
        setTimeout(() => {
            this.$el.querySelector(".search_input input").focus();
        }, 500);

        window.addEventListener("scroll", this.loadMore);
        this.$Lazyload.$on("error", function({ el, src, loading }) {
            el.src = el.dataset.src1;
            el.onerror = function() {
                el.src = loading;
                el.onerror = null;
            };
        });
    },
    destroyed() {
        window.removeEventListener("scroll", this.loadMore);
    }
};
</script>
