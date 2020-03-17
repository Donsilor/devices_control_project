<!--
    详情页
-->
<template>
  <div class="page-detail">
    <topbar
      :back="goBack"
      :search="true">
      <div class="title">
        {{ title }}
        <span
          v-show="!loading && ispay && ispay !== '1'"
          class="isvip">付费</span>
      </div>
    </topbar>

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
              <p
                v-show="isNotNull(cur.desc)"
                class="synopsis"
                @click="synopsisFn"
              ><span>简介：{{ cur.desc }}</span></p>
            </div>
            <div
              :class="{'gray':tvStatus.tvOnlineStatus==-3||tvStatus.tvOnlineStatus==0||tvStatus.tvOnlineStatus==2||tvStatus.tvOnlineStatus==-2}"
              class="playstate playstate_unplay">
              <a
                href="#"
                class="btn"
                @click.prevent="play(cur.playlist2.list[0])">
                <i class="play"/><span>电视播放</span>
              </a>
            </div>
          </div>
        </div>
        <transition name="fade">
          <div
            v-show="synopsisB"
            class="mb"
            @click="synopsisResetFn"/>
        </transition>
        <!--弹出的简介框-->
        <div
          ref="synopsisD"
          class="synopsisD">
          <div class="synopsisD-header">
            <p>{{ title }}</p>
            <span @click="synopsisResetFn"/>
          </div>
          <div class="synopsisD-content">
            <div class="text2">
              <p>{{ cur.cate }}{{ cur.year&&'.'+cur.year }}{{ cur.region&&'·'+cur.region }}</p>
              <p v-show="isNotNull(cur.score)">评分：
                <span>{{ cur.score }}</span>
              </p>
              <p
                v-show="isNotNull(cur.director)"
                class="director">导演：{{ cur.director }}</p>
              <p
                v-show="isNotNull(cur.starring)"
                class="text_s"><span class="text_s_1"> 主演：</span><span>{{ cur.starring }}</span></p>
            </div>
            <div class="text3">简介</div>
            <div class="desc2">{{ cur.desc }}</div>
          </div>


        </div>

        <div
          ref="isShowAll"
          :class="[isShowAll?'detail-playlist-all a':'']"
          class="detail-playlist">
          <div
            v-if="cur.playlist2.list.length"
            class="hd">
            <span>{{ channelId==='001' ? '正片' : '选集' }}</span>
            <a
              v-show="!isShowAll && (channelId==='002' || channelId==='003')"
              href="#"
              class="showAll"
              @click.prevent="showAll">
              <i>{{ channelId==='001' ? '正片' : getUpdateSet() }}</i>
              <i class="arrow"/>
            </a>
            <a
              v-show="isShowAll"

              href="#"
              class="showAll"
              @click.prevent="showAllClose">
              <span class="close"/>
            </a>
          </div>
          <ul
            v-if="channelId==='001' || channelId==='004'"

            class="bd clearfix">
            <li
              v-for="(item,index) in cur.playlist2.list"
              :key="item.index+index"
              class="item-haspic"
              @click="play(item)">
              <img
                v-lazy="item.pictureUrl"
                :key="item.pictureUrl">
              <p class="palyimg"/>
              <p class="palyname">{{ item.name }}</p>
              <!--<span class="play" v-show="item.playstate===2"><i></i>当前播放</span>-->
              <span
                v-show="item.drm && item.drm!='0'||5"
                class="tag_pay">付费</span>
            </li>
          </ul>
          <ul
            v-else
            :class="[isShowAll?'bd-num-all':'bd-num']"
            class="bd">
            <li
              v-for="(item, num) in cur.playlist2.list"
              :key="item.index"
              :class="{'gray':tvStatus.tvOnlineStatus==-3||tvStatus.tvOnlineStatus==0||tvStatus.tvOnlineStatus==2||tvStatus.tvOnlineStatus==-2,'active':activeIndex==num}"
              class="item-num"
              @click="play(item,num)">
              {{ item.set ? item.set : ( item.index=='0' ? num+1 : item.index ) }}
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
            style="clear:both">相关视频
          </div>
          <ul class="bd">
            <li
              v-for="(item,index) in cur.playlist2.list2"
              :key="item.index+index"
              class="item-haspic"
              @click="play(item)">
              <img
                v-lazy="item.pictureUrl"
                :key="item.pictureUrl">
              <p class="palyimg"/>
              <p class="palyname">{{ item.name }}</p>
              <!--<span class="play" v-show="item.playstate===2"><i></i>当前播放</span>-->
              <span
                v-show="item.drm && item.drm!='0'"
                class="tag_pay">付费</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 遥控器 -->
    <remoteControl :isPlay="false"/>
  </div>
</template>

<style lang="less" scoped>
  * {
    -webkit-tap-highlight-color: transparent;
  }

  .page-detail {
    color: #75787a;

    &::before {
      content: ' ';
      position: fixed;
      z-index: -1;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: #000;
      background-size: 100% 100%;
    }
  }

  .detail-hd {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
    height: 160px;
    width: 100%;
    background: #fafafa;
    border-bottom: 1px solid #dbdbdb;

    .isvip {
      padding: 0 4px;
      height: 32px;
      right: 8px;
      top: 0;
      background-image: linear-gradient(90deg, #F5D598 0%, #E1B96E 100%);
      line-height: 32px;
      font-size: 20px;
      text-align: center;
      color: #000;
      display: inline-block;
      margin-bottom: 5px;
      font-weight: lighter;
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
    padding-top: 20px;
    -webkit-overflow-scrolling: touch;
  }

  .detail-info {
    margin: 0 32px;

    .info-inner {
      position: relative;
      overflow: hidden;
    }

    .pic {
      width: 264px;
      height: 400px;
      float: left;

      img {
        width: 100%;
        height: 100%;
        background-color: #525456;
        border-radius: 20px;
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
      margin-left: 304px;
      height: 400px;
      width: 366px;
      position: relative;
      color: #222a37;
    }

    .mb {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      background: #000;
      opacity: 0.5;
      z-index: 9999
    }

    .fade-enter-active, .fade-leave-active {
      transition: opacity .4s
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active, 2.1.8 版本以下 */ {
      opacity: 0
    }

    .synopsisD {
      position: fixed;
      bottom: -1010px;
      left: 0;
      width: 100%;
      max-height: 1010px;
      background: #1C1C1E;
      border-radius: 10px 10px 0 0;
      z-index: 10000;

      .synopsisD-header {
        padding: 0 32px;

        height: 120px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        p {
          font-family: PingFangSC-Regular;
          font-size: 32px;
          color: #fff;
        }

        span {
          width: 48px;
          height: 48px;
          background: url('~@lib/base/tv/assets/new/btn_delete.png');
          background-size: 100% 100%;
        }
      }

      .synopsisD-content {
        padding: 0 32px;

        overflow-y: scroll;
        max-height: 846px;

        .text2 {
          border-bottom: 1px solid rgba(255, 255, 255, .1);
          padding-bottom: 40px;

          p {
            opacity: 0.5;
            font-family: PingFangSC-Light;
            font-size: 24px;
            color: #fff;
            letter-spacing: 0;
            line-height: 40px;
          }

          .text_s {
            display: flex;
            justify-content: left;

            .text_s_1 {
              width: 46PX;
            }
          }
        }

        .text3 {
          height: 48px;
          line-height: 48px;
          margin: 41px 0 12px 0;
          font-family: PingFangSC-Regular;
          font-size: 24px;
          color: #fff;
          line-height: 44px;
        }

        .desc2 {
          opacity: 0.5;
          font-family: PingFangSC-Light;
          font-size: 24px;
          color: #fff;
          letter-spacing: 0;
          text-align: justify;
          line-height: 40px;
          padding-bottom: 68px;
        }

      }


    }

    .a {
      animation: bottom .2s linear;
      animation-fill-mode: forwards
    }

    @keyframes bottom {
      from {
        bottom: -1010px;
      }
      to {
        bottom: 0;
      }
    }

    .b {
      animation: bottomReset .2s linear;
      animation-fill-mode: forwards

    }

    @keyframes bottomReset {
      from {
        bottom: 0;
      }
      to {
        bottom: -1010px;
      }
    }

    .desc {
      clear: both;
      padding-top: 24px;
      color: #a4a9af;
      position: relative;

      .desc-cont-p {
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

    .words {
      opacity: 0.5;
      font-family: PingFangSC-Regular;
      font-size: 28px;
      color: #000000;
      letter-spacing: 0;
      text-align: justify;
      overflow: hidden;
      line-height: 32px;
      position: relative;
      height: 4em;
    }

    .words-show {
      height: 100%;

      &::after {
        display: none
      }
    }

    .words-cut {
      &::after {
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
      }

      &.open {
        i {
          transform: rotate(180deg);
        }
      }

      .arrow-desc {
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
      font-family: PingFangSC-Light;
      font-size: 24px;
      color: #fff;
      letter-spacing: 0;
      line-height: 40px;
      padding-bottom: 4px;
    }

    span {
      color: #fff;
    }

    .text_s {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .director {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .synopsis {
      line-height: 40px;
      height: 160px;
      overflow: hidden;

      span {
        &::after {
          content: "";
          display: inline-block;
          width: 24px;
          height: 24px;
          position: relative;
          top: 4px;
          background: url('~@lib/base/tv/assets/new/tv_btn_xiala.png') no-repeat;
          background-size: 100% 100%;
        }
      }
    }
  }

  .playstate {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 84px;

    &.gray {

    }

    .btn {
      border-radius: 40px;
      background-color: #000000;
      background-image: linear-gradient(225deg, #F9BB6B 0%, #EF6D5E 100%);
      height: 80px;
      line-height: 80px;
      display: block;
      color: #fff;
      font-size: 32px;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;

      i {
        margin-right: 12px;
        vertical-align: middle;
        width: 40px;
        height: 40px;
        background: url('~@lib/base/tv/assets/new/tv_btn_play.png');
        background-size: 100% 100%;
      }

      span {
        font-size: 32px;
        font-family: PingFangSC-Light;
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

  .detail-playlist {
    // margin-left: 32px;
    padding-top: 52px;
    position: relative;

    .item-haspic {
      p.palyimg {
        position: absolute;
        top: 136px;
        right: 12px;
        width: 36px;
        height: 36px;
        background: url('~@lib/base/tv/assets/new/tv_btn_play.png');
        background-size: 100% 100%;
      }
    }


    .hd {

      font-family: PingFangSC-Medium;
      font-size: 32px;
      color: #fff;
      line-height: 44px;
      margin-bottom: 30px;
      font-weight: 600;
      font-size: 32px;

      &.related {
        font-size: 34px;
      }
    }

    &-all {
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 10000;
      width: 100%;
      height: 1010px;
      overflow: hidden;
      background-color: #1c1c1e;
      margin-left: 0;
      padding-top: 0;

      .hd {
        height: 120px;
        line-height: 120px;
        padding-left: 32px;
        margin-bottom: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;

      }

      .bd-num-all {
        width: 100%;
        max-height: 890px;
        padding-left: 32px;
        overflow-y: auto;
      }

      .close {
        width: 48px;
        height: 48px;
        background: url('~@lib/base/tv/assets/new/btn_delete.png');
        background-size: 100% 100%;
      }
    }

    .showAll {
      float: right;
      margin-right: 32px;
      display: flex;
      align-items: center;

      i {
        font-size: 24px;
        color: #fff;
        margin-left: 2px;
        font-family: PingFangSC-Light;
        text-align: right;
        font-style: normal;
        font-weight: lighter;

      }

      .arrow {
        display: inline-block;
        width: 36px;
        height: 36px;
        background: url('~@lib/base/tv/assets/new/tv_arrow_in.png');
        background-size: 100% 100%;
        background-color: rgba(255, 255, 255, .1);
        border-radius: 18px;
      }
    }

    .bd-num {
      width: 100%;
      overflow-x: scroll;
      display: -webkit-box;
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
        margin: 0 20px 20px 0;
      }
    }

    li.item-num {
      width: 118px;
      height: 118px;
      line-height: 118px;
      text-align: center;
      position: relative;
      font-family: PingFangSC-Regular;
      font-size: 28px;
      letter-spacing: 0;
      background: rgba(255, 255, 255, .08);
      color: #000;

      &.gray {
        color: #c4c4c4 !important;
      }

      &.active {
        font-family: PingFangSC-Light;
        font-size: 24px;
        color: #E1B96E;
        letter-spacing: 0;
        text-align: center;
      }
    }

    li.item-haspic {
      position: relative;
      width: 320px;
      margin-bottom: 40px;
      float: left;
      overflow: hidden;
      color: #fff;
      margin-right: 22px;

      img {
        width: 320px;
        height: 180px;
        display: block;
        margin-bottom: 12px;
        border-radius: 10px;
      }

      p {
        overflow: hidden;
        line-height: 36px;
        font-size: 24px;
        font-weight: lighter;
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
          background: url('~@lib/base/tv/assets/icn_playing_white_s.png') no-repeat;
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
      padding: 0 4px;
      height: 32px;
      right: 8px;
      top: 0;
      background-image: linear-gradient(90deg, #F5D598 0%, #E1B96E 100%);
      line-height: 32px;
      font-size: 20px;
      text-align: center;
      color: #000;
      display: block;
      margin-bottom: 5px;
      font-weight: lighter;
    }

    .tag_new {
      background: #000;
      width: 32px;
      height: 32px;
      color: #fff;
      font-family: PingFangSC-Regular;
      font-size: 20px;
      letter-spacing: 0;
      text-align: center;
    }

    .tag_pay {
      background-color: #f26161;
    }
  }

  .isvip {
    display: inline-block;

    padding: 0 4px;
    height: 32px;
    right: 8px;
    top: 0;
    background-image: linear-gradient(90deg, #F5D598 0%, #E1B96E 100%);
    line-height: 32px;
    font-size: 20px;
    text-align: center;
    color: #000;
    margin-left: 12px;
    font-weight: lighter;
  }

  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }

  .title {
    display: flex;
    align-items: center;
  }
</style>

<script>
  import {mapState, mapActions} from "vuex"
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
    data() {
      return {
        device_uuid: window.device_uuid || '',
        isShowBar: this.$route.query.showBar == 1,
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
        isShowAll2: false,

        channelId: this.$route.query.channelId || '',
        vid: this.$route.query.vid || '',
        ispay: this.$route.query.ispay || '',
        synopsisB: false,
        activeIndex: -1
      }
    },
    computed: {
      tvStatus() {
        return this.$store.state.tvStatus
      },
      ...mapState({
        visible: state => state.detailVisible
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
      service.RemoteController({'show': true})
      // this.$watch("cur.desc", this.getDescLine)
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
    mounted() {
      setTimeout(() => {
        window.scrollTo(0, 1)
      }, 300)
      addEventListener('scroll', this.scrollfn)
    },
    destroyed() {
      removeEventListener('scroll', this.scrollfn)
    },
    methods: {
      ...mapActions(["hideDetail", "showDetail"]),
      synopsisFn() {
        console.log('点击了')
        this.$refs.synopsisD.classList.remove('b')
        this.$refs.synopsisD.classList.add('a')
        this.synopsisB = true
      },
      synopsisResetFn() {
        this.synopsisB = false
        this.$refs.synopsisD.classList.remove('a')
        this.$refs.synopsisD.classList.add('b')
        this.isShowAll = false
      },
      scrollfn() {
        var scrollTop =
          document.documentElement.scrollTop ||
          window.pageYOffset ||
          document.body.scrollTop
        let topbar_fixed = document.querySelector('.topbar-fixed')
        if (scrollTop >= 20) {
          topbar_fixed.style.background = '#1c1c1e'
        } else {
          topbar_fixed.style.background = ''
        }

      },
      count(arr = []) {
        let num = 0
        arr.forEach(val => {
          if (!val) {
            num += 1
          }
        })
        return num
      },
      getData() {
        this.loading = true
        service.getDetaileData(
          {
            channelId: this.channelId,
            vid: this.vid
          },
          (err, data) => {
            this.loading = false
            if (err) {
              return
            }
            console.log(data, '4444444444444')
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
            this.$nextTick(() => {
              let num = 0
              num = this.count([this.cur.score, this.cur.year, this.cur.cate, this.cur.director, this.cur.starring])
              let synopsis = document.querySelector('.synopsis')
              synopsis.style.height = 20 * (2 + num) + 'px'
              let synopsisSpan = document.querySelector('.synopsis>span')
              let synopsisH = synopsis.offsetHeight
              let synopsisSpanH = synopsisSpan.offsetHeight
              synopsisSpan.innerText += '...'
              while (synopsisSpanH > synopsisH) {
                synopsisSpan.innerText = synopsisSpan.innerText.substr(0, synopsisSpan.innerText.length - 4)
                synopsisSpan.innerText += '...'
                synopsisSpanH = synopsisSpan.offsetHeight
              }
              let palynameList = document.querySelectorAll('.palyname')
              for (let i = 0; i < palynameList.length; i++) {
                let synopsisH = palynameList[i].offsetHeight
                console.log(palynameList[i])

                console.log(synopsisH)

                if (synopsisH <= 38) {
                  palynameList[i].style.height = 36 + 'PX'
                  continue
                }
                console.log(palynameList[i])

                palynameList[i].innerText += '...'
                while (synopsisH > 38) {
                  palynameList[i].innerText = palynameList[i].innerText.substr(0, palynameList[i].innerText.length - 4)
                  palynameList[i].innerText += '...'
                  synopsisH = palynameList[i].offsetHeight
                  console.log(synopsisH)
                }
                palynameList[i].style.height = 36 + 'PX'
              }
            })
          }
        )
      },
      //点播：播放状态如playstate
      play(clickItem, num) {
        if (num != undefined) {
          this.activeIndex = num
        }
        console.log(clickItem, 'clickItem')
        if (!clickItem) {
          clickItem =
            this.cur.playlist2.list[0] || this.cur.playlist2.list2[0]
        }
        if (clickItem) {
          service.playVideo(clickItem.link, clickItem.name)
        }
      },
      //描述按行截取：对比实际文本高度和3行文本高度，如果超出则截断，显示展开按钮
      // getDescLine() {
      //   if (this.$el) {
      //     this.isDescShow = false
      //     this.isDescOverflow = false
      //     this.$nextTick(() => {
      //       let wrapHeight = this.$el.querySelector(".desc-cont")
      //         .offsetHeight
      //       let textHeight = this.$el.querySelector(".desc-cont-p")
      //         .offsetHeight
      //       if (textHeight > wrapHeight) {
      //         this.isDescOverflow = true
      //       } else {
      //         this.isDescOverflow = false
      //       }
      //     })
      //   }
      // },
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
        this.$router.push({query})
      },
      showAll() {
        this.isShowAll = true
        this.synopsisB = true
      },
      showAllClose() {
        this.isShowAll = false
        this.synopsisB = false
      },
      goBack() {
        this.hideDetail()
        service.RemoteController({show: false})
        if (this.isShowBar || window.history.length > 1) {
          window.history.go(-1)
        } else {
          HdSmart.UI.popWindow()
        }
        this.loading = false
      }
    }
  }
</script>
