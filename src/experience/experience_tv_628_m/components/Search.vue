<!--
    搜索页面
-->
<template>
  <div class="page-search">

    <topbar :search="false">
      <form 
        class="search_bar"
        @submit.prevent="submit">
        <div class="search_input">
          <a 
            href="javascript:void(0);" 
            class="icon-search" />
          <input 
            v-model="word"
            type="text"
            placeholder="输入片名、导演、演员搜索"
            @input="fuzzySearch">
          <a 
            v-show="word != ''"
            href="javascript:void(0);"
            class="icon-del1"
            @click.prevent="clearWord" />
        </div>
        <input 
          type="submit"
          value="搜索"
          class="search_submit">
      </form>
    </topbar>

    <status-tip />
    <!-- 搜索建议 -->
    <div 
      v-show="curpage===2"
      class="search_suggest">
      <ul>
        <li 
          v-for="item in suggestData"
          :key="`${item.index}`"
          @click="doSearch(item.text)"
          v-html="item.html" />
      </ul>
    </div>
    <!-- 搜搜历史 -->
    <div 
      v-show="curpage===1"
      class="search_history">
      <div class="hd">
        <a 
          href="#"
          class="del icon-del"
          @click.prevent="clearHistory" />
        搜索记录
      </div>
      <ul class="bd clearfix">
        <li 
          v-for="item in historyData"
          :key="`${item.index}`"
          @click="doSearch(item)">
          {{ item }}
        </li>
      </ul>
    </div>
    <!-- 搜索结果 -->
    <div 
      v-show="curpage===3"
      class="search_result">
      <div 
        v-show="resultData.length && loadState !== 'NO_DATA' || current_channel!=''"
        class="hd clearfix">
        <div class="tab">
          <a 
            :class="{active:current_channel==''}"
            href="#"
            @click.prevent="setParam('current_channel','')">
            全部
          </a>
          <a 
            v-for="item in channels"
            :class="{active:current_channel==item.channelId}"
            href="#"
            @click.prevent="setParam('current_channel',item.channelId)">
            {{ item.channel }}
          </a>
        </div>
        <div class="sorts">
          <a 
            v-for="item in orderby"
            :class="{active:current_orderby==item.orderId}"
            href="#"
            @click.prevent="setParam('current_orderby',item.orderId)">
            {{ item.text }}
          </a>
        </div>
      </div>
      <ul class="vlist list-m60">
        <li 
          v-for="item in resultData"
          :key="item.vid"
          :class="['item-'+item.channelId]"
          class="vitem"
          @click="showDetailInfo(item)">
          <img 
            v-lazy="getThumbPic(item.pictureUrl)"
            :data-src1="item.pictureUrl"
            alt="">
          <div class="name">{{ item.title }}</div>
          <span 
            v-show="item.channelId!='001'"
            class="update">
            {{ getUpdateSet(item.setCount,item.lastUpdateSet) }}
          </span>
          <div class="label">
            <span 
              v-if="item.ispay && item.ispay !== '1'"
              class="isvip">付费</span>
          </div>
        </li>
      </ul>
      <!-- 没有数据 -->
      <div 
        v-show="loadState === 'NO_DATA'"
        class="nodata">
        <i />
        <p>暂无结果</p>
      </div>
      <!-- 加载更多 -->
      <div class="loadmore">
        <p v-show="!isFirstLoad && loadState === 'LOADING'">正在加载中...</p>
        <p v-show="!isFirstLoad && loadState === 'LOADED'">加载更多...</p>
        <!--<p class="finish" v-show="loadState === 'NO_MORE'">已加载全部</p>-->
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.search_bar {
  flex: 1;
  padding-top: 8PX;
  padding-left: 100px;
  display: flex;
}
.search_input {
  line-height: 1;
  position: relative;
  height: 30PX;
  width: 100%;
  .icon-search{
    position: absolute;
    top: 10px;
    left: 0;
    color: #dbdbdb;;

    font-size: 35px;
    line-height: 35px;
  }
  input {
    border: 1px solid #dbdbdb;
    height: 30PX;
    border-radius: 32px;
    width: 100%;
    box-sizing: border-box;
    // background: #fff
    //   url(../../../lib/base/tv/assets/icn_topbar_search_pressed@2x.png)
    //   no-repeat 20px center;
    // background-size: 36px 36px;
    padding-left: 68px;
    padding-right: 64px;
    font-size: 28px;
    &::-webkit-input-placeholder {
      color: #c8cacc;
    }
    &:focus {
      /*border: 1px solid #13d5dc;*/
      outline: none;
    }
  }
  .icon-del1 {
    position: absolute;
    right: 0;
    top: 10px;
    color: #d8d8d8;
    font-size: 35px;
    line-height: 35px;
    &:active {
      color: #999;
    }
  }
}

.search_submit {
  width: 150px;
  font-size: 28px;
  appearance: none;
  border: none;
  background: none;
  outline: none;
  color: #2f3133;
}
.search_history {
  margin: 0 32px;
  .hd {
    color: #75787a;
    padding: 32px 0 24px;
    border-bottom: 1px solid rgba(216, 216, 216, 0.7);
    margin-bottom: 24px;
    color: #a4a9af;
    .icon-del {
      float: right;
      margin-right: 10px;
      width: 36px;
      height: 36px;
      line-height: 18px;
      font-size: 36px;
      color: #76787a;
      /*background-repeat: no-repeat;
            background-size: 100% 100%;
            background-image: url(../../../lib/base/tv/assets/btn_clear_normal.png);*/
      &:active {
        color: #ffc700;
        /*background-image: url(../../../lib/base/tv/assets/btn_clear_pressed.png);*/
      }
    }
  }
  .bd {
    li {
      color: #222a37;
      width: 50%;
      box-sizing: border-box;
      height: 56px;
      line-height: 56px;
      margin-bottom: 16px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      float: left;
      padding-right: 26px;
    }
  }
}
.search_suggest {
  padding-left: 32px;
  background-color: #fff;
  /*border-bottom: 1px solid rgba(216, 216, 216, .7);*/
  li {
    height: 120px;
    line-height: 120px;
    border-bottom: 1px solid rgba(216, 216, 216, 0.7);
    font-size: 32px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #222a37;
    strong {
      color: #ffc700;
      font-weight: normal;
    }
    &:last-child {
      border-bottom: 0;
    }
  }
}
.search_result {
  background-color: #f7f8fa;
  .hd {
    padding: 20px 32px 26px;
    background-color: #fff;
  }
  .tab {
    /*border-bottom: 1px solid #dbdbdb;*/
    margin-bottom: 24px;
    overflow: hidden;
    a {
      float: left;
      padding: 15px 0;
      margin-right: 20px;
      color: #a4a9af;
      &.active {
        color: #222a37;
        font-weight: bold;
        border-bottom: 3px solid #ffc700;
      }
    }
  }
  .sorts {
    a {
      float: left;
      width: 88px;
      height: 56px;
      text-align: center;
      line-height: 56px;
      margin-right: 16px;
      color: #a4a9af;
      border-radius: 2px;
      &.active {
        color: #ffc700;
        background: #f6f6f6;
      }
    }
  }
}

.vlist {
  padding: 36px 32px 0 32px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  // align-content: space-between;
}
.vitem {
  width: 200px;
  margin: 0;
  position: relative;

  img {
    border-radius: 10px;
    width: 200px;
    height: 310px;
    display: block;
    object-fit: cover;
    background-color: #ebebeb;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 120px 120px;
  }
  .update {
    position: absolute;
    left: 0;
    bottom: 100px;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    line-height: 30px;
    font-size: 24px;
    padding: 0 12px;
    border-radius: 0 3px 3px 0;
    display: none;
  }
  /*.label {
        position: absolute;
        right: 0;
        top: 27px;
    }*/
  .isvip {
    position: absolute;
    right: 15px;
    top: 40px;
    background: #f26161;
    width: 60px;
    line-height: 30px;
    border-radius: 4px;
    font-size: 24px;
    text-align: center;
    color: #fff;
    opacity: 0.9;
    display: block;
    margin-bottom: 5px;
  }
  .score {
    position: absolute;
    right: 15px;
    top: 260px;
    background-image: linear-gradient(90deg, #ffda00 0%, #ffc700 100%);
    width: 60px;
    line-height: 30px;
    border-radius: 4px;
    font-size: 24px;
    text-align: center;
    color: #fff;
    opacity: 0.9;
    display: none;
  }
  .name {
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 2;
    height: 76px;
  }
}
.loadmore {
  text-align: center;
  /*padding: 30px 0;*/
  height: 60px;
  color: #75787a;
  font-size: 24px;
  .finish {
    color: #c8cacc;
  }
}
</style>

<script>
import * as service from '../service'
import _ from '../util'

// 关键字加粗
function splitWord(kw, input) {
  return input.replace(
    new RegExp('(' + kw + ')', 'g'),
    '<strong>$1</strong>'
  )
}

export default {
  data() {
    return {
      word: '',
      // 当前视图：1默认,2联想词,3搜索结果
      curpage: 1,
      // 栏目，目前无法根据搜索结果过滤，显示全部
      channels: service.getInitData().channels,
      // 排序
      orderby: [
        { text: '相关', orderId: '' },
        { text: '最新', orderId: 'year' },
        { text: '好评', orderId: 'iscore' }
      ],
      channelId: '',
      vid: '',
      // 搜索建议，模糊查找
      suggestData: [],
      // 搜索历史
      historyData: [],
      // 搜索结果
      resultData: [],
      // 当前栏目
      current_channel: '',
      // 当前排序
      current_orderby: '',
      // 总条数
      total: 0,
      // 当前页码
      pageNo: 1,
      // 分页数
      pageSize: 15,
      /**
      * 加载状态
      * LOADING  分页加载中，显示 分页loading
      * LOADED   分页加载成功，显示 加载更多...
      * NO_DATA  没有数据，显示  暂无结果
      * NO_MORE  全部加载完成，显示 已加载全部
      */
      loadState: '',
      isFirstLoad: true
    }
  },
  watch: {
    word(val) {
      if (val == '') {
        this.word = ' '
        this.curpage = 1
        this.getHistory()
      }
    },
    loadState(val) {
      if (this.isFirstLoad) {
        if (val === 'LOADING') {
          HdSmart.UI.showLoading()
        } else if (val === 'LOADED') {
          HdSmart.UI.hideLoading()
        }
      }
    }
  },
  mounted() {
    this.getHistory()
    service.RemoteController({ 'show': true })
    setTimeout(() => {
      this.$el.querySelector('.search_input input').focus()
    }, 500)

    window.addEventListener('scroll', this.loadMore)
    this.$Lazyload.$on('error', function({ el, src, loading }) {
      el.src = el.dataset.src1
      el.onerror = function() {
        el.src = loading
        el.onerror = null
      }
    })
  },
  destroyed() {
    window.removeEventListener('scroll', this.loadMore)
  },
  methods: {
    // 删除搜索词
    clearWord() { 
      this.word = ''
      this.$el.querySelector('.search_input input').focus()
    },
    // 清空搜索历史
    clearHistory() {
      HdSmart.UI.alert(
        {
          title: '清空记录',
          message: '确认要清空所有搜索记录？',
          okText: '清空',
          cancelText: '取消',
          dialogStyle: 2
        },
        val => {
          if (val != undefined && val != false) {
            service.onClickEvent('clearSearchHistory')
            this.historyData = []
          }
        }
      )
    },
    // 提交
    submit() {
      var kw = this.word.trim()
      if (kw) {
        this.doSearch(kw)
        this.$el.querySelector('.search_input input').blur()
      }
    },
    doSearch(word) {
      this.curpage = 3
      this.word = word
      this.current_channel = ''
      this.current_orderby = ''
      this.filterData(1)
    },
    // 模糊查询
    fuzzySearch: _.debounce(function() {
      var kw = this.word.trim()
      if (kw) {
        this.curpage = 2
        service.fuzzySearch(kw, (err, data) => {
          if (err) return
          this.suggestData = data.data.map(item => {
            return {
              text: item,
              html: splitWord(kw, item)
            }
          })
        })
      }
    }, 100),
    setParam(key, value) {
      this[key] = value
      this.filterData(1)
    },
    filterData(page) {
      if (page === 1) this.isFirstLoad = true
      this.loadState = 'LOADING'
      service.searchData(
        {
          keyword: this.word.trim(),
          channelId: this.current_channel,
          orderby: this.current_orderby,
          pageSize: this.pageSize,
          pageNo: page
        },
        (err, data) => {
          this.loadState = 'LOADED'
          if (err) return

          if (data.data) {
            data = data.data
          }
          if (data.list == '') {
            data.list = []
          }
          this.$nextTick(() => {
            this.resultData = Object.freeze(
              (page === 1 ? [] : this.resultData).concat(
                data.list
              )
            )
            this.total = data.total
            this.pageNo = page
            if (this.isFirstLoad) {
              this.isFirstLoad = false
              window.scrollTo(0, 0)
            }
            if (this.total === 0) {
              this.loadState = 'NO_DATA'
            } else if (this.pageSize * this.pageNo >= this.total) {
              this.loadState = 'NO_MORE'
              // HdSmart.UI.toast('已加载全部')
            }
          })
        }
      )
    },
    loadMore: _.debounce(function() {
      if (this.curpage !== 3) {
        return
      }

      var scrollTop =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop
      if (
        scrollTop > 0 &&
        scrollTop + window.innerHeight >=
        document.documentElement.scrollHeight - 15
      ) {
        if (this.$store.state.detailVisible) {
          return
        }
        if (
          this.loadState === 'LOADING' ||
          this.loadState === 'NO_DATA'
        ) {
          return
        }
        if (this.loadState === 'NO_MORE') {
          HdSmart.UI.toast('已加载全部')
          return
        }
        this.filterData(this.pageNo + 1)
      }
    }, 300),
    showDetailInfo(item) {
      this.$store.dispatch('showDetail', item)
      window.location.href = `index.html#/detail?channelId=${item.channelId}&vid=${item.vid}&ispay=${item.ispay}`
    },
    getUpdateSet(count, last) {
      if (!count || !last || count == '0' || last == '0') {
        return ''
      } else if (last === count) {
        return count + '集全'
      } else {
        return '更新至' + last + '集'
      }
    },
    getThumbPic(pic) {
      return pic.replace('.jpg', '_y.jpg')
    },
    getHistory() {
      service.getSearchHistory((err, data) => {
        if (err) return
        this.historyData = data.data
      })
    }
  }
}
</script>
