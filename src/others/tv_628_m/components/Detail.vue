<!--
    详情页
-->
<template>
  <div class="page-detail">
    <!-- 遥控器 --> 
    <remoteControl/>

    <topbar
      :back="goBack"
      :search="false">
      <div class="title">
        {{ title }}
        <span
          v-show="!loading && ispay && ispay !== '1'"
          class="isvip">付费</span>
      </div>
    </topbar>
    <!-- <status-tip v-show="device_uuid" /> -->

    <div class="detail-bd">
      <div
        v-show="cur.title"
        class="detail-info clearfix">
        <div class="info-inner">
          <div class="pic">
            <img
              v-lazy="cur.pictureUrl"
              :class="['pic-'+channelId]"
              :key="cur.pictureUrl">
          </div>
          <div class="text">
            <div class="shortinfo">
              <p v-show="isNotNull(cur.score)">评分：
                <span>{{ cur.score }}</span>
              </p>
              <p v-show="isNotNull(cur.year)">年代：{{ cur.year }}</p>
              <p v-show="isNotNull(cur.cate)">类型：{{ cur.cate }}</p>
              <p 
                v-show="isNotNull(cur.director)" 
                class="director">导演：{{ cur.director }}</p>
              <p
                v-show="isNotNull(cur.starring)"
                class="text_s">主演：{{ cur.starring }}</p>
            </div>
            <div 
              :class="{'gray':tvStatus.tvOnlineStatus==-3}" 
              class="playstate playstate_unplay">
              <a
                href="#"
                class="btn"
                @click.prevent="play(cur.playlist2.list[0])">
                <i class="play" /><span>在电视上播放</span> 
              </a>
            </div>
          </div>
        </div>
        <!-- 描述 -->
       
        <div
          v-show="cur.desc"
          class="desc">
          <div
            :class="{
              'words-cut': !isDescOverflow,
              'words-show': isDescShow
            }"
            class="desc-cont words">
            <div
              class="desc-cont-p"
              v-html="toHTML(cur.desc)" />
          </div>
          <a
            v-show="isDescOverflow"
            :class="{'open':isDescShow}"
            href="#"
            class="desc-toggle"
            @click.prevent="isDescShow=!isDescShow">
            <i class="arrow-desc" />
          </a>
        </div>
      </div>

      <div
        :class="[isShowAll?'detail-playlist-all':'']"
        class="detail-playlist">
        <div
          v-if="cur.playlist2.list.length"
          class="hd" >
          {{ channelId==='001' ? '正片' : '选集' }}
          <a
            v-show="!isShowAll && (channelId==='002' || channelId==='003')"
            href="#"
            class="showAll"
            @click.prevent="showAll"> 
            <i>{{ channelId==='001' ? '正片' : getUpdateSet() }}</i>
            <i class="arrow" />
          </a>

          <a
            v-show="isShowAll"
            href="#"
            class="showAll"
            @click.prevent="showAllClose">
            <span class="icon-close" />
          </a>
        </div>
        <ul
          v-if="channelId==='0011' || channelId==='0041'"
        
          class="bd">
          <li
            v-for="item in cur.playlist2.list"
            :key="item.index"
            class="item-haspic"
            @click="play(item)">
            <img
              v-lazy="item.pictureUrl"
              :key="item.pictureUrl">
            <p>{{ item.name }}</p>
            <!--<span class="play" v-show="item.playstate===2"><i></i>当前播放</span>-->
            <span
              v-show="item.drm && item.drm!='0'"
              class="tag_pay">付费</span>
          </li>
        </ul>
        <!-- v-else -->

        <ul
          :class="[isShowAll?'bd-num-all':'bd-num']"
          class="bd" >
          <li
            v-for="(item, num) in cur.playlist2.list"
            :key="item.index"
            :class="{'gray':tvStatus.tvOnlineStatus==-3}"
            class="item-num" 
            @click="play(item)">
            {{ item.set ? item.set : ( item.index=='0' ? num+1 : item.index ) }}         
            <!-- <span 
              v-show="item.states" 
              class="tag_new">新</span> -->
            <span
              v-show="item.drm && item.drm!='0'"
              class="tag_pay">付费</span>
          </li>
        </ul>
      </div>

      <div class="detail-playlist">
        <div
          v-if="cur.playlist2.list2.length"
          class="hd related"
          style="clear:both">相关视频</div>
        <ul class="bd" >
          <li
            v-for="item in cur.playlist2.list2"
            :key="item.index"
            class="item-haspic"
            @click="play(item)">
            <img
              v-lazy="item.pictureUrl"
              :key="item.pictureUrl">
            <p>{{ item.name }}</p>
            <!--<span class="play" v-show="item.playstate===2"><i></i>当前播放</span>-->
            <span
              v-show="item.drm && item.drm!='0'"
              class="tag_pay">付费</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <!-- </transition> -->
</template>

<style lang="less">
// .gray{
//   opacity: 0.2;
// }

.page-detail {
  color: #75787a;
  // /*background: #fafafa;*/
  // background-size: 100% 100%;
  // background-attachment: fixed;
  &::before{
    content: ' ';
    position: fixed;
    z-index: -1;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: url("../../../../lib/base/tv/assets/icn_blurry_bg@2x.png");
    background-size: 100% 100%;
  }
}
.detail-hd {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  height: 160px;
  // height:100px;
  width: 100%;
  background: #fafafa;
  // flex-shrink: 0;
  border-bottom: 1px solid #dbdbdb;

  .isvip {
    background-image: linear-gradient(90deg, #F5D598 0%, #E1B96E 100%);
    font-family: PingFangSC-Regular;
    font-size: 20px;
    color: #000000;
    letter-spacing: 0;
    text-align: center;
    padding:4px 10px;

    // background: #f26161;
    // width: 60px;
    // line-height: 32px;
    // border-radius: 3px;
    // font-size: 24px;
    // text-align: center;
    // color: #fff;
    // opacity: 0.9;
    // display: inline-block;
    // vertical-align: 4px;
  }
  .back {
    width: 100px;
    height: 124px;
    background-size: 36px 36px;
    background-repeat: no-repeat;
    background-position: center center;
    position: absolute;
    top: 0;
    left: 0;
    background-image: url('~@lib/base/tv/assets/icn_topbar_arrowdown_normal.png');
    &:active {
      background-image: url('~@lib/base/tv/assets/icn_topbar_arrowdown_pressed.png');
    }
  }
  .title {
    text-align: center;
    line-height: 124px;
    color: #2f3133;
    font-size: 36px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 75%;
    margin: 0 auto;
  }
}
.detail-bd {
  // height: 100%;
  padding-top: 32px;
  // overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.detail-info {
  margin: 0 32px;
  border-bottom: 1px solid rgba(0,0,0,.1);
  .info-inner {
    position: relative;
    overflow: hidden;
    margin-bottom: 32px;
  }
  .pic {
    width: 320px;
    height: 470px;
    float: left;
    img {
      width: 100%;
      height: 100%;
      background-color: #525456;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 120px 120px;
      opacity: 0.5;
      &.pic-001 {
        background-image: url('~@lib/base/tv/assets/icn_TV_movie_white@2x.png');
      }
      &.pic-002 {
        background-image: url('~@lib/base/tv/assets/icn_TV_tvshow_white@2x.png');
      }
      &.pic-003 {
        background-image: url('~@lib/base/tv/assets/icn_TV_comic_white@2x.png');
      }
      &.pic-004 {
        background-image: url('~@lib/base/tv/assets/icn_TV_entertainment_white@2x.png');
      }
    }
    [lazy="loaded"] {
      opacity: 1;
    }
  }
  .text {
    margin-left: 344px;
    height: 470px;
    position: relative;
    color: #222a37;
  }
  .desc {
    clear: both;
    padding-top: 24px;
    // border-top: 1px solid #dbdbdb;
    color: #a4a9af;
    position: relative;
    .desc-cont-p{
      color: #000;
      line-height: 40px;
    }
  }
  .desc-cont {
    overflow: hidden;
    height: 126px;
    line-height: 1.4;
  }
  .text-cut {
    height: auto;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .words{
  opacity: 0.5;
  font-family: PingFangSC-Regular;
  font-size: 28px;
  color: #000000;
  letter-spacing: 0;
  text-align: justify;
  // font-size: 14px;
  // color: #4A4A4A;
  overflow: hidden;
  line-height: 32px;
  position: relative;
  height: 4em;
}
// .words:after {
//   content: '...';
//   text-align: right;
//   position: absolute;
//   bottom: 0;
//   right: 0;
//   width: 4%;
//   height: 1.2em;
//   // background: url("../../../../lib/base/tv/assets/icn_blurry_bg@2x.png")
//   background-image: linear-gradient(90deg, #F5D598 0%, #E1B96E 100%);
// }
.words-show{
  height: 100%;
  &::after{
    display: none
  }
}
.words-cut{
  &::after{
    display: none
  }
}
  .text-show {
    display: block;
  }
  .desc-toggle {
    margin: 0 auto;
    width: 24px;
    display: block;
    color: #fff;
    i,
    span {
      color: #222a37;
      display: inline-block;
      width: 50px;
      height: 50px;
      text-align: center;
      line-height: 50px;
      transform: rotate(0deg);
      /*transition: transform .6s;*/
    }
    &.open {
      i {
        transform: rotate(180deg);
      }
    }
    .arrow-desc{
      display: block;
      width: 40px;
      height: 40px;
      background: url('~@lib/base/img/tv_btn_xiala.png');
      background-size: 100% 100%;
    }
  }
}
.shortinfo {
  margin-bottom: 48px;
  p {
    line-height: 54px;
  }
  span {
    color: #000;
  }
  .text_s {
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 6em
  }
  .director{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
}
.playstate {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 84px;
  &.gray{
   opacity: 0.2;
  }
  .btn {
    /*background-image: linear-gradient(90deg, #ffda00 0%, #ffc700 100%);*/
    /*border-radius: 45px;*/
    background-color: #000000;
    height: 84px;
    line-height: 84px;
    display: block;
    color: #fff;
    font-size: 36px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    i {
      margin-right: 14px;
      vertical-align: middle;
      width: 32px;
      height: 32px;
      background: url('~@lib/base/tv/assets/new/tv_icn_play.png');
        background-size: 100% 100%;
    }
    span{
      font-size: 28px;
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
    /*.icon-playing {*/
    /*width: 36px;*/
    /*height: 36px;*/
    /*display: inline-block;*/
    /*vertical-align: middle;*/
    /*margin-right: 12px;*/
    /*background: url(../../../lib/base/tv/assets/icn_playing_blue_s.png)*/
    /*no-repeat;*/
    /*background-size: 100% 100%;*/
    /*}*/
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

.detail-playlist {
  margin-left: 32px;
  padding-top: 30px;

  .hd {

    font-family: PingFangSC-Medium;
    font-size: 32px;
    color: #222A37;
    line-height: 44px;
    margin-bottom: 30px;
    color: #222a37;
    font-weight: 600;

    &.related {
      font-size: 34px;
    }
  }

  &-all {
    position: fixed;
    bottom: 0;
    z-index: 10;
    width: 100%;
    height: 776px;
    overflow: hidden;
    background-color: #fff;
    margin-left: 0;
    padding-top: 0;

    .hd {
      height: 106px;
      line-height: 106px;
      padding-left: 32px;
      border: 1px solid #d8d8d8;
      margin-bottom: 0;
    }

    .bd-num-all {
      width: 100%;
      padding-top: 30px;
      max-height: 670px;
      padding-left: 32px;
      overflow-y: auto;
    }

    .icon-close {
      line-height: 1;
    }
  }

  .showAll {
    float: right;
    margin-right: 32px;
    display: flex;
    align-items: center;

    i {
      // display: inline-block;
    
      font-size: 24px;
      color: #000000;
      margin-left: 2px;
      // transform: rotate(90deg);
      font-family: PingFangSC-Light;
      text-align: right;
      font-style: normal;
      font-weight:normal;
    }
    .arrow{
      display: inline-block;
      width: 24px;
      height: 24px;
      background: url('~@lib/base/tv/assets/new/tv_arrow_more.png');
      background-size: 100% 100%;
    }
  }
  .bd-num {
    width: 100%;
    overflow-x: scroll;
    display: -webkit-box;
    margin-bottom: 30px;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
      display: none;
    }
    li {
      margin-right: 16px;
    }
  }
  .bd-num-all {
    display: flex;
    flex-wrap: wrap;
    li {
      margin: 0 30px 30px 0;
    }
  }
  li.item-num {
    width: 118px;
    height: 118px;
    line-height: 118px;
    text-align: center;
    position: relative;
    // background-color: #f0f0f0;
    // background: rgba(0,0,0,0.2);
    // background: #000;
    // opacity: 0.04;
    /*border: 1px solid #dbdbdb;*/
    // border-radius: 8px;
    font-family: PingFangSC-Regular;
    font-size: 28px;
    letter-spacing: 0;
    background: rgba(0,0,0,.04);
    color: #000;
    // &:active {
    //   background: #ebebeb;
    // }
    &.gray{
       color: #c4c4c4!important;
    }
    &.active {
      /*background: #19c9cf
                url(../../../lib/base/tv/assets/icn_playing_white_s.png)
                no-repeat center center;
            background-size: 36px 36px;
            text-indent: -9999px;*/
      font-family: PingFangSC-Regular;
      font-size: 28px;
      color: #E1B96E;
      letter-spacing: 0;
    }
  }
  li.item-haspic {
    position: relative;
    width: 320px;
    height: 306px;
    margin: 0 25px 0 5px;
    float: left;
    overflow: hidden;
    color: #222a37;
    img {
      width: 320px;
      height: 180px;
      display: block;
      margin-bottom: 18px;
    }
    p {
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 40px;
      height: 3em;
    }
    .play {
      position: absolute;
      left: 42px;
      top: 54px;
      opacity: 0.9;
      background: #13d5dc;
      border-radius: 360px;
      width: 216px;
      height: 60px;
      text-align: center;
      line-height: 60px;
      i {
        width: 36px;
        height: 36px;
        background: url('~@lib/base/tv/assets/icn_playing_white_s.png')
          no-repeat;
        background-size: 100% 100%;
        display: inline-block;
        vertical-align: middle;
        margin-top: -4px;
      }
    }
  }
  .tag_new,
  .tag_pay {
    position: absolute;
    right: 0;
    top: 0;
    width: 48px;
    height: 32px;
    line-height: 32px;
    background-image: linear-gradient(90deg, #F5D598 0%, #E1B96E 100%);
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #000000;
    // letter-spacing: 0;
    text-align: center;
  }

  .tag_new {
    background:#000;
    width: 32px;
    height: 32px;
    color: #fff;
    font-family: PingFangSC-Regular;
    font-size: 20px;
    letter-spacing: 0;
    text-align: center;
    /*background-image: url(../../../lib/base/tv/assets/tag_new.png);*/
  }
  .tag_pay {
    background-color: #f26161;
    /*background-image: url(../../../lib/base/tv/assets/tag_pay.png);*/
  }
}

.isvip {
     background-image: linear-gradient(90deg, #F5D598 0%, #E1B96E 100%);
    font-family: PingFangSC-Regular;
    font-size: 20px;
    color: #000000;
    letter-spacing: 0;
    text-align: center;
    padding:4px 10px;
  // background-color: #f26161;
  // color: #fff;
  // font-size: 28px;
  // border-radius: 4px;
  // line-height: 32px;
  // padding: 0 6px;
}
</style>

<script>
import { mapState, mapActions } from "vuex"
import * as service from "../service"

//隐藏body滚动条
function toggleBoayScroll(val) {
  var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  if (!iOS) {
    document.documentElement.className = val ? "andriod hidescroll" : ""
  } else {
    document.documentElement.className = val ? "hidescroll" : ""
  }

}

export default {
  // props: ['channelId','vid'],
  data() {
    return {
      device_uuid: window.device_uuid || '',
      isShowBar: this.$route.query.showBar == 1,

      //是否显示
      // visible: false,
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
      //描述是否超出行数
      isDescOverflow: false,
      //描述展开按钮状态
      isDescShow: false,
      loading: false,
      history: false,
      isShowAll: false,

      channelId: this.$route.query.channelId || '',
      vid: this.$route.query.vid || '',
      ispay: this.$route.query.ispay || '',
    }
  },
  computed: {
    tvStatus() {
            return this.$store.state.tvStatus
    },
    ...mapState({
      visible: state => state.detailVisible,
      // channelId: state => state.activeDetail.channelId,
      // vid: state => state.activeDetail.vid,
      // ispay: state => state.activeDetail.ispay
    }),
    title() {
      if (this.cur.title && this.cur.title.length > 10) {
        return this.cur.title.substr(0, 10) + '...'
      }
      return this.cur.title
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.getData()
      } else {
        this.cur = {
          playlist: [
            {
              list: []
            }
          ],
          playlist2: {
            list: [],
            list2: []
          }
        }
        this.history = false
        this.isShowAll = false
      }
      toggleBoayScroll(val)
    },
    loading(val) {
      if (val) {
        HdSmart.UI.showLoading()
      } else {
        HdSmart.UI.hideLoading()
      }
    }
  },
  created() {
    service.RemoteController({ 'show': true })

    this.$watch("cur.desc", this.getDescLine)
    //详情页添加history change
    this.$watch("$route.query.detail", (newVal, oldVal) => {
      if (oldVal && newVal === undefined && this.visible) {
        this.hideDetail()
      } else if (oldVal === undefined && newVal) {
        this.showDetail()
      }
    })

    this.getData()
  },
  mounted(){
    setTimeout(()=>{
        window.scrollTo(0,1)
    },300)
  },
  methods: {
    ...mapActions(["hideDetail", "showDetail"]),
    getData() {
      this.loading = true
      // this.setHistory()
      service.getDetaileData(
        {
          channelId: this.channelId,
          vid: this.vid
        },
        (err, data) => {
          this.loading = false
          if (err) {
            // this.close()
            return
          }

          var temp = data.data
          var playlist = temp.playlist[0]
          temp.playlist2 = {}
          temp.playlist2.total = playlist.total
          temp.playlist2.list = playlist.list.filter(
            item => item.states == "1"
          )
          temp.playlist2.list2 = playlist.list.filter(
            item => item.states != "1"
          )
          this.cur = Object.freeze(temp)
        }
      )
    },
    //点播：播放状态如playstate
    play(clickItem) {
      console.log(clickItem,'clickItem')
      if (!clickItem) {
        clickItem =
          this.cur.playlist2.list[0] || this.cur.playlist2.list2[0]
      }
      if (clickItem) {
        service.playVideo(clickItem.link, clickItem.name)
      }
    },
    //描述按行截取：对比实际文本高度和3行文本高度，如果超出则截断，显示展开按钮
    getDescLine() {
      if (this.$el) {
        this.isDescShow = false
        this.isDescOverflow = false
        this.$nextTick(() => {
          let wrapHeight = this.$el.querySelector(".desc-cont")
            .offsetHeight
          let textHeight = this.$el.querySelector(".desc-cont-p")
            .offsetHeight
          if (textHeight > wrapHeight) {
            this.isDescOverflow = true
          } else {
            this.isDescOverflow = false
          }
        })
      }
    },
    getUpdateSet() {
      var count = this.cur.playlist2.total + 1 //-this.cur.playlist2.list2.length
      var last = this.cur.playlist2.list.length
      if (!count || !last || count == "0" || last == "0") {
        return ""
      } else if (last === count) {
        return count + "集全"
      } else {
        return "更新至" + last + "集"
      }
    },
    toHTML(str) {
      if (!str) return ""
      return str
        .split("\n")
        .map(item => {
          return "\u3000\u3000" + item
        })
        .join("<br>")
    },
    isNotNull(str) {
      return str && str != "null"
    },
    setHistory() {
      this.history = true
      var query = {
        ...this.$route.query,
        detail: this.channelId + "_" + this.vid
      }
      this.$router.push({ query })
    },
    showAll() {
      this.isShowAll = true
    },
    showAllClose() {
      this.isShowAll = false
    },
    goBack(){
      this.hideDetail()
      service.RemoteController({ show: false })
      if(this.isShowBar || window.history.length > 1){
        window.history.go(-1)
      } else {
        HdSmart.UI.popWindow()
      }
      this.loading = false
    }
  }
}
</script>
