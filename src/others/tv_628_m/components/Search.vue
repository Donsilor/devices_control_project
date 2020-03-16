<!-- 搜索页面 -->
<template>
  <div
    ref="search"
    class="page-search">
    <!-- 遥控器 -->
    <!-- <remoteControl/> -->
    <div
      :style="{height:status_bar_height+navigation_bar_height+'PX'}"
      class="statusbar"
      @touchmove.prevent>
      <div
        ref="statusbar_fexid"
        :style="{height:status_bar_height+'PX'}"
        class="statusbar_fexid"/>
      <div
        ref="search_fexid"
        :search="false"
        :style="{top:status_bar_height+'PX',height:navigation_bar_height+'px', 'line-height': navigation_bar_height + 'px'}"
        class="search_fexid">
        <form
          class="search_bar"
          @submit.prevent="submit"
        >
          <div class="search_input">
            <div class="search">
              <p />
            </div>
            <input
              v-model="word"
              type="text"
              placeholder="输入片名、导演、演员搜索"
              @blur="blurfn"
              @input="fuzzySearch">
            <div
              v-show="word != ''"
              class="del1"
              @click.prevent="clearWord">
              <p/>
            </div>

          </div>
          <input
            type="button"
            value="取消"
            class="search_submit"
            @click="goBack">
        </form>
      </div>
    </div>


    <!-- <status-tip /> -->
    <!-- 搜索建议 -->
    <div
      v-show="curpage===2"
      ref="search_suggest"
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
      v-show="curpage===1&&loadState !== 'NO_DATA' "
      ref="search_history"
      class="search_history"
      @touchmove.prevent>
      <div class="hd">
        <h3>搜索记录</h3>
        <a
          href="#"
          class="del"
          @click.prevent="clearHistory" />

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
      ref="search_result"
      class="search_result">
      <ul class="vlist list-m60">
        <li
          v-for="(item,index) in resultData"
          :key="item.vid+index"
          :class="['item-'+item.channelId]"
          class="vitem"
          @click="showDetailInfo(item)">
          <div class="vitem-left">
            <img
              v-lazy="getThumbPic(item.pictureUrl)"
              :data-src1="item.pictureUrl"
              alt="">
            <div
              v-if="item.ispay && item.ispay !== '1'"
              class="label">付费
            </div>
          </div>
          <div
            class="vitem-right"
            style="position:relative">
            <div class="title">{{ item.title }}</div>
            <div class="name">{{ item.cate }}·{{ item.year }}{{ item.region&&'·'+item.region }}</div>
            <div class="name">{{ item.director&&'导演：'+item.director }}</div>
            <div class="name starring">{{ item.director&&'主演：'+item.starring }}</div>
            <div
              :class="{'gray':tvStatus.tvOnlineStatus==-3||tvStatus.tvOnlineStatus==0||tvStatus.tvOnlineStatus==2||tvStatus.tvOnlineStatus==-2}"
              class="playstate playstate_unplay" >
              <a
                href="#"
                class="btn"
                @click.prevent="play(item)">
              <i class="play" /><span>电视播放</span></a>
            </div>
            <span
              class="update">
              {{ getUpdateSet(item.setCount,item.lastUpdateSet) }}
            </span>

          </div>

        </li>
      </ul>

      <!-- 加载更多 -->
      <div class="loadmore">
        <p v-show=" loadState === 'LOADING'">正在加载中...</p>
        <p v-show=" loadState === 'LOADED'">上拉加载更多</p>
        <p
          v-show="loadState === 'NO_MORE'"
          class="finish">已加载全部</p>
      </div>
    </div>
    <!-- 没有数据 -->
    <div
      v-show="loadState === 'NO_DATA'"
      class="nodata">
      <i />
      <p>没有找到相关结果</p>
    </div>
  </div>
</template>

<style lang="less" scoped>
@status_bar_height: 25PX;
@navigation_bar_height: 44PX;
 *{
   -webkit-tap-highlight-color:transparent;
  }
.gray{
  opacity: 0.2;
}
.nodata{
  margin-top: 400px;
  // display: flex;
  text-align: center;
  position: relative;
  i{
    display: block;
    width: 120px;
    height: 120px;
    background: url("../imgs/tv_img_wujieg.png");
     background-size: 100% 100%;
     position: absolute;
     left: 50%;
     transform: translateX(-50%)
  }
  p{
    opacity: 0.39;
    font-family: PingFangSC-Regular;
    font-size: 32px;
    color: white;
    padding-top: 150px;
  }
}
.statusbar {
  position: relative;
  z-index: 10000;
  top: 0;
  left: 0;
  width: 100%;
  height: @status_bar_height;
  .statusbar_fexid{
    // position: fixed;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: @status_bar_height;
    background: transparent;
    z-index: 999
  }
  .search_fexid{
    // position: fixed;
    position: absolute;
    top:@status_bar_height;
    left: 0;
    width: 100%;
    height: 44px;
    background: transparent;
    z-index: 999999
  }
}
.page-search{
  height: 100%;
  &::before{
    content: "";
    background-color: black;
    background-repeat:no-repeat;
    background-size: 100% 100%;
    position: fixed;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }
}
.search_bar {
  display: flex;
  height: 100%;
  align-items: center;
  margin: 0 32px;
}
.search_input {
  line-height: 1;
  position: relative;
  height: 30PX;
  width: 100%;
  background: rgba(255,255,255,0.10);
  border-radius: 15px;
  .search{
   display: flex;
   justify-content: center;
   align-items: center;
    width: 60px;
    height: 60px;
    position: absolute;
    // top: 2px;
    // left: 20px;
    // color: #dbdbdb;;
    // font-size: 35px;
    // line-height: 35px;
    margin-right:3px;
    P{
      width: 32px;
        height: 32px;
         background: url('~@lib/base/img/tv_icn_search.png');
        background-size:100% 100%;
    }
  }
  input {
    border: 0;
    background: rgba(0, 0, 0, 0.04);
    color: white;
    height: 60px;
    border-radius: 3px;
    width: 100%;
    box-sizing: border-box;
    // background: #fff
    //   url(../../../lib/base/tv/assets/icn_topbar_search_pressed@2x.png)
    //   no-repeat 20px center;
    // background-size: 36px 36px;
    padding-left: 68px;
    padding-right: 64px;
    font-size: 24px;
    font-weight: lighter;
    &::-webkit-input-placeholder {
      color: #c8cacc;
    }
    &:focus {
      outline: none;
    }
  }
  .del1 {
    display: flex;
   justify-content: center;
   align-items: center;
    position: absolute;
    right: 0;
    top: 0;
    width: 40px;
    height: 60px;
    margin-right:20px;
    p{
        width: 40px;
        height: 40px;
        background: url('../imgs/btn_delete@1x.png');
        background-size:100% 100%;
    }
  }
}

.search_submit {
  width: auto;
  margin-left:32px;
  font-weight: lighter;
  font-size: 32px;
  appearance: none;
  border: none;
  background: none;
  outline: none;
  color: #737373;
  text-align: right;
}
.search_history {
  padding: 0 32px;
  padding-top: 60px;
  position: absolute;
  top: 150px;
  bottom: 0;
  width: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  .hd {
    padding-bottom: 36px;
    margin-bottom: 24px;
    font-family: PingFangSC-Medium;
    font-size: 48px;
    color: #ffffff;
    line-height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .del {
      width: 48px;
      height: 48px;
      background: url('../imgs/tv_btn_delete@2x.png');
      background-size: 100% 100%;
      &:active {
        color: #ffc700;
      }
    }
  }
  .bd {
    li {
      height: 68px;
      line-height: 68px;
      box-sizing: border-box;
      margin-right: 20px;
      margin-bottom: 16px;
      float: left;
      padding:0 30px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 34px;
      font-family: PingFangSC-Regular;
      font-size: 24px;
      font-weight: lighter;
      color: #FFFFFF;
      display:-webkit-box;
      word-break:break-all;
      -webkit-box-orient:vertical;
      -webkit-line-clamp:1;
      overflow:hidden;
      text-overflow:ellipsis;

    }
  }
}
.search_suggest {
    position: absolute;
    width: 100%;
  top: 150px;
  bottom: 0;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  padding-left: 32px;
  background-color: transparent;
  /*border-bottom: 1px solid rgba(216, 216, 216, .7);*/
  li {
    height: 120px;
    line-height: 120px;
    // border-bottom: 1px solid rgba(216, 216, 216, 0.7);
    font-size: 32px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: white;
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
  // background-color: #f7f8fa;
  position: absolute;
  top: 150px;
  bottom: 0;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  .hd {
    padding: 20px 32px 26px;
  }
  .tab {
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
  padding: 20PX 0 0 38px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  li{
    width: 100%;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 48px;
    .vitem-left{
      margin-right: 40px;
      position: relative;
       .label {
        background-image: linear-gradient(90deg, #F5D598 0%, #E1B96E 100%);
        position: absolute;
        right: 8px;
        top: 5px;
        padding: 0 4px;
        // width: 48px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #000000;
        letter-spacing: 0;
        text-align: center;
      }
    }
  }
  // align-content: space-between;
}
.vitem {
  width: 200px;
  margin: 0;
  position: relative;
  margin-right: 36px;
  color: white;
  img {
    width: 264px;
    height: 400px;
    display: block;
    object-fit: cover;
    background-color: #ebebeb;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 120px 120px;
    border-radius: 10px;
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
  .title{
    font-size: 32px;
    font-weight: lighter;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 366px;
    // padding-bottom: 20px;
    font-family: PingFangSC-Light;
    height: 45px;
    line-height: 45px;
    font-size: 32px;
    margin-bottom: 20px;

  }
  .name {
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 40px;
    width: 366px;
    font-size:24px;
    font-weight: lighter;
    clear: rgba(0,0,0,.5);
    margin-bottom:4px;

  }
  .starring{
    text-align: left;
    width: 366px;
    line-height: 40px;
  }
  .playstate {
  position: absolute;
  bottom: 0;
  width: 100%;
  // height: 84px;
   .play {
    margin-right: 0.16rem;
    vertical-align: middle;
    width: 0.533rem;
    height: 0.533rem;
      background: url('../imgs/tv_btn_play@2x.png');

    background-size: 100% 100%;
    // margin-top: -4px;

  }
  .btn {
    background-image: linear-gradient(225deg, #F9BB6B 0%, #EF6D5E 100%);
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    border-radius: 20px;
    font-size: 32px;
    font-weight: lighter;
    text-align: center;
    width: 100%;
    height: 72px;
    i {
      display: inline-block;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      margin-right: 12px;
      // margin-top: -2px;
      vertical-align: middle;
      font-size: 30px;
    }
    span{
      font-size: 28px;
      line-height: 0;
    }
    .icon-play,
    .icon-playing {
      font-size: 40px;

      &:before {
        line-height: 20px;
      }
    }
    .icon-time {
      width: 34px;
      height: 34px;
      background-image: url('~@lib/base/tv/assets/icn_history_white_s.png');
    }
  }
  .btn-outline {
    color: #13d5dc;
    background: none;
    padding-left: 0;
  }
  .tip {
    height: 54px;
    border-radius: 6px;
    position: absolute;
    margin-left: 50px;
    margin-top: 15px;
    padding: 0 27px;
    line-height: 54px;
    background: rgba(255, 255, 255, 0.1);
    .arrow {
      position: absolute;
      left: -15px;
      top: 18px;
      width: 0;
      height: 0;
      border-top: 10px solid transparent;
      border-right: 15px solid rgba(255, 255, 255, 0.1);
      border-bottom: 10px solid transparent;
    }
  }
}

}
.loadmore {
  text-align: center;
  height: 60px;
  color: #000;
  opacity: 0.5;
  font-size: 24px;
}
</style>

<script>
import * as service from '../service'
import _ from '../util'
let dpr = /iPad|iPhone|iPod/.test(navigator.userAgent) ? 1 : window.devicePixelRatio

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
      cur: {
        playlist: [
          {
            list: []
          }
        ],
        playlist2: {
          list: [],
          list2: []
        }
      },
      status_bar_height: 25,
      navigation_bar_height: 44,
      ios: /iPad|iPhone|iPod/.test(navigator.userAgent),
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
   computed: {
    tvStatus() {
            return this.$store.state.tvStatus
    },
    title() {
      if (this.cur.title && this.cur.title.length > 10) {
        return this.cur.title.substr(0, 10) + '...'
      }
      return this.cur.title
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
  created() {
    HdSmart.ready(() => {
      if (window.status_bar_height) {
        this.status_bar_height = window.status_bar_height / dpr
      }
      if (window.navigation_bar_height) {
        this.navigation_bar_height = window.navigation_bar_height / dpr
      }
    })
  },
  mounted() {
    setTimeout(()=>{
        window.scrollTo(0,1)
    },300)
    this.getHistory()
    service.RemoteController({ 'show': true })
    setTimeout(() => {
      this.$el.querySelector('.search_input input').focus()
    }, 500)

    this.$refs.search_result.addEventListener('scroll', this.loadMore)
    this.$Lazyload.$on('error', function({ el, src, loading }) {
      el.src = el.dataset.src1
      el.onerror = function() {
        el.src = loading
        el.onerror = null
      }
    })
    let searchTop = this.$refs.statusbar_fexid.offsetHeight + this.$refs.search_fexid.offsetHeight + 'px'
    this.$refs.search_result.style.top = searchTop
    this.$refs.search_suggest.style.top = searchTop
    this.$refs.search_history.style.top = searchTop

    addEventListener('scroll',this.scroll2, { passive: false })
  },
  destroyed() {
    this.$refs.search_result&&this.$refs.search_result.removeEventListener('scroll', this.loadMore)
    removeEventListener('scroll', this.scroll2)
  },
  //在页面离开时记录滚动位置
  beforeRouteLeave(to, from, next) {
    this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    next()
  },
  //进入该页面时，用之前保存的滚动位置赋值
  beforeRouteEnter(to, from, next) {
    next(vm => {
      document.body.scrollTop = vm.scrollTop
    })
  },
  methods: {
    blurfn(){
      window.scrollTo(0,0)
    },
    scroll2(event){
         this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        if(this.scrollTop>=20){
          this.$refs.search_fexid.style.background = "#fff"
          this.$refs.statusbar_fexid.style.background = "#fff"
        }else{
          this.$refs.search_fexid.style.background = "transparent"
          this.$refs.statusbar_fexid.style.background = "transparent"
        }
    },
    // 删除搜索词
    clearWord() {
      this.word = ''
      this.loadState = ''
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
    goBack(){
        window.history.go(-1)
    },
    filterData(page) {
      this.loadState = 'LOADING'
      console.log('筛选')
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
          console.log(data,'ssdata----------------------')
          this.$nextTick(() => {
            this.resultData = Object.freeze(
              (page === 1 ? [] : this.resultData).concat(
                data.list
              )
            )

            console.log(this.resultData,'this.resultData')
            this.total = data.total
            this.pageNo = page
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
      console.log('滚动')

      if (this.curpage !== 3) {
        return
      }
      var scrollTop = this.$refs['search_result'].scrollTop
      if (
        scrollTop>0&&(scrollTop + this.$refs['search_result'].clientHeight >= this.$refs['search_result'].scrollHeight - 15)) {
        if (this.$store.state.detailVisible) {
          console.log(this.$store.state.detailVisible)
          return
        }
        if (
          this.loadState === 'LOADING' ||
          this.loadState === 'NO_DATA'
        ) {
            console.log(this.loadState)
          return
        }
        if (this.loadState === 'NO_MORE') {

          HdSmart.UI.toast('已加载全部')
          return
        }
        console.log(this.pageNo,'this.pageNo')

        this.filterData(this.pageNo + 1)
      }
    }, 300),
    showDetailInfo(item) {
      console.log(item)
      this.$store.dispatch('showDetail', item)
      this.$router.push({
        path:"/detail",
        query:{
          channelId:item.channelId,
          vid:item.vid,
          ispay:item.ispay
        }
      })
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
    },
     //点播：播放状态如playstate
    play(item,e) {
      if ( e && e.stopPropagation ) {
    //因此它支持W3C的stopPropagation()方法
       e.stopPropagation()
      }else {
          //否则，我们需要使用IE的方式来取消事件冒泡
          window.event.cancelBubble = true
      }
      service.getDetaileData(
        {
          channelId: item.channelId,
          vid: item.vid
        },
        (err, data) => {
          // this.loading = false
          if (err) {
            // this.close()
            return
          }
          var temp = data.data
          console.log(temp,'temp')
          var playlist = temp.playlist[0]
          temp.playlist2 = {}
          temp.playlist2.total = playlist.total
          temp.playlist2.list = playlist.list.filter(
            item => item.states == "1"
          )
          temp.playlist2.list2 = playlist.list.filter(
            item => item.states != "1"
          )
          let cur = Object.freeze(temp)
          console.log(cur,'cur')
          let clickItem = cur.playlist2.list[0] || cur.playlist2.list2[0]
          console.log(clickItem,'clickItem')
          if (clickItem) {
            service.playVideo(clickItem.link, clickItem.name)
          }
        }
      )
    },
  }
}
</script>
