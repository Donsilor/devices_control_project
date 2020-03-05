<!-- 首页 -->
<template>
  <div
    class="page-index">
    <!-- 遥控器 -->
    <remoteControl/>
    <!-- <div
      class="space-block" /> -->
    <!-- 顶部导航菜单 -->
    <new-topbar
      :shutdown="true"
      :scroll="true"
      :search="true"
      :title="device_name"
      :room="room_name"
      page-class=".page-index"
      bak-color="#fff"
      bg-color = "#000"
      switchimg="tv"
      @shutdownCallback="cmd('rcPower')"
    />
    <!-- v-show="device_uuid"   -->
    <!--    -->
    <status-tip
      type="首页"/>
    <div
      :class="{'search-screen-bg_mt':device_uuid}"
      class="search-screen-bg">
      <div class="search-screen">
        <router-link
          class="search2"
          to="/search"><span class="search-img"/><span>搜索</span> </router-link>
        <div
          v-show="activeIndex!=0"
          class="screen"
          @click="toPage(itemData)"> <span/> 筛选</div>
      </div>
    </div>

    <!-- 设备状态提示 -->
    <!-- :bar-height="barHeight"  -->
    <!--    <div class="wrap-title">-->
    <!--      <div class="title mar">栏目分类</div>-->
    <!--    </div>-->

    <div
      ref="icon_grid"
      class="icon_grid">
      <div class="icon_grid_inner">
        <div
          v-for="(item, idx) in channels"
          :class="['item' + idx, 'item', {'active': idx == activeIndex}]"
          @click.prevent="toActive(item,idx)">{{ item.channel }}</div>
        <div class="block" />
      </div>
    </div>



    <!-- 栏目分类 -->
    <div
      v-if="activeIndex==0"
      style="position:relative"
      class="status">


      <div
        v-show="activeIndex==0"
        class="swiper mar" >

        <div
          v-if="noVal==true"
          @click="pageInit">
          <img src="~@lib/base/tv/assets/img_default_recommend.png">
        </div>
        <swiper
          v-if="homePageInfo.length"
          ref="swiper"
          :options="swiperOption">
          <swiper-slide
            v-for="(item,index) in homePageInfo"
            :key="index">
            <a
              :style="{backgroundImage:'url('+item.pictureUrl+')'}"
              href="javascript:void(0)">
              <span class="title">{{ item.title }}</span>
              <span
                v-if="+item.channelId < 5"
                class="channelName">{{ item.channelId | channelName }}</span>
            </a>
          </swiper-slide>
          <div
            slot="pagination"
            class="swiper-pagination" />
        </swiper>
      </div>
    </div>





    <!-- 列表 -->

    <div
      class="index-list"
      @touchstart="touchstart"
      @touchend="touchend">
      <div
        v-for="(it, idx) in allList"
        :key="idx"
        class="mar">
        <div
          v-show="it && it.length > 0 && activeIndex==0"
          class="wrap-title">
          <div class="title">{{ idx | nameType }}</div>
          <div
            class="more"
            @click="toListPage(idx)"><span class="more_mg"/></div>
        </div>

        <ul class="vlist list-m60">
          <li
            v-for="(item,index) in it"
            :key="item.vid+index"
            :class="['item-'+ item.channelId, 'vitem']"
            @click="showDetailInfo(item)">
            <img
              v-lazy="getThumbPic(item.pictureUrl)"
              :data-src="item.pictureUrl"
              alt="">

            <div class="name">{{ item.title }}</div>
            <div class="bottom">
              <span
                v-show="item.channelId=='002'"
                class="text">
                {{ getUpdateSet(item.setCount,item.lastUpdateSet) }}
              </span>
              <span
                v-show="item.channelId=='001'"
                class="text score" >{{ item.score }}</span>
              <p
                class="play"
                @click.stop="play(item)"/>
            </div>

            <span
              v-if="item.ispay && item.ispay !== '1'"
              class="isvip">付费</span>
              <!--<div class="label">-->
              <!--</div>-->
          </li>
        </ul>
      </div>
      <!-- 没有数据 -->
      <div
        v-show="loadState === 'NO_DATA'"
        class="nodata">
        <i />
        <p>暂无结果</p>
      </div>
      <!-- 加载更多 -->
      <div
        v-show="activeIndex!=0"
        class="loadmore">
        <p v-show=" loadState === 'LOADING'">正在加载中...</p>
        <p v-show=" loadState === 'LOADED'">上拉加载更多</p>
        <p
          v-show="loadState === 'NO_MORE'"
          class="finish">已加载全部</p>
      </div>
    </div>
    <!-- 控制菜单 -->
    <div :class="[{'hide': hideMenu}, 'control']">
      <div class="block" />
      <div class="right">
        <div
          class="icon-switch center"
          @click.prevent="cmd('rcPower')" />
        <div
          :class="{spec:!$store.state.online && !$store.state.detailVisible}"
          class="icon-ykq center"
          @click.prevent="cmd('remoteControlEvent')" />

        <div
          :class="{spec:!$store.state.online && !$store.state.detailVisible}"
          class="icon-screen center"
          @click.prevent="cmd('screenProjectionEvent')" />

        <div
          :class="{spec:!$store.state.online && !$store.state.detailVisible}"
          class="icon-detail center"
          @click.prevent="goDetail" />

      </div>

      <div class="block" />
    </div>
  </div>
</template>

<style lang="less" scoped>
@navigation_bar_height: 44PX;
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.page-index {
  &::after{
    content: "";
    padding-bottom: 48px;
    background: url("../../../../lib/base/tv/assets/icn_blurry_bg@2x.png");
    background-size: 100% 100%;
    background-attachment: fixed;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
  }
  // // background-position:center center;
  // &::before{
  //   //  content: ' ';
  //   // position: fixed;
  //   // z-index: -1;
  //   // top: 0;
  //   // right: 0;
  //   // bottom: 0;
  //   // left: 0;
  //   // background: url("../../../../lib/base/tv/assets/icn_blurry_bg@2x.png");
  //   // background-size: 100% 100%;
  // }

  .space-block{
    height: 25PX;
  }
  .wrap-title{
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    height:auto;
    padding: 32px 0;
    .title {
      font-size: 32px;
      color: #20282b;
      font-weight: normal;
    }
    .more{
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      color: #20282B;
      .more_mg{
        width: 24px;
        height: 24px;
        display: inline-block;
        background: url('~@lib/base/tv/assets/new/tv_arrow_more.png');
        background-size:100% 100%;
      }
    }
  }

  .mar {
    margin: 0 40px;
  }
  // .index-list{
  //   background: url("../../../../lib/base/tv/assets/icn_blurry_bg@2x.png");
  //   background-size: 100% 100%;
  // }
}

.search-box {
  background-color: #fff;
  padding: 24px 0;
}
.search {
  background-color: #f0f0f0;
  border: 1px solid #dbdbdb;
  border-radius: 32px;
  width: 654px;
  height: 64px;
  line-height: 64px;
  margin: 0 auto;
  display: block;
  font-size: 32px;
  color: #b4b4b4;
  padding-left: 68px;
  position: relative;
  &:before {
    position: absolute;
    top: 0;
    left: 28px;
    font-size: 36px;
    line-height: 64px;
    color: rgba(0, 0, 0, 0.2);
  }
}
.search-screen-bg{
    // padding-top: 20px;
    // margin-top: 28PX;
    width:100%;
    display:flex;
    height: 44PX;
    align-items: center;
  .search-screen{
    overflow: hidden;
    width:100%;
    margin: 0 40px;
    // padding: 20px 0;
    display: flex;
    justify-content: space-between;
    .search2{
      width: 100%;
      height: 60px;
      background:rgba(0, 0, 0, 0.04);
      border-radius: 2px;
      height: 60px;
      // text-align: center;
      // line-height:  60px;
      display: flex;
      color: #AAAAAA;
      justify-content: center;
      align-items: center;
      font-weight: lighter;
      font-size:24px;
      .search-img{
        width: 32px;
        height: 32px;
         background: url('~@lib/base/img/tv_icn_search.png');
        background-size:100% 100%;
        margin-right: 20px;
      }
    }
    .screen{
      margin-left: 20px;
      background:rgba(0, 0, 0, 0.04);
      border-radius: 2px;
      width: 180px;
      height: 60px;
      text-align: center;
      line-height: 60px;
      color: #000;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: lighter;
      font-size:24px;
      span{
        display: block;
        width:  40px;;
        height:  40px;;
        background: url('~@lib/base/tv/assets/new/tv_btn_shaixuan.png');
        background-size:100% 100%;
      }
    }
  }
}
.search-screen-bg-mt{
  margin-top: 40px;
}

.icon_grid {
  overflow: hidden;
  // margin: 0 40px;
  height:44PX;
  padding: 0 40px;
  z-index: 10000;
  width: 100%;
  display:flex;
  align-items: center;
  margin-bottom:16px;

  -webkit-overflow-scrolling: touch;
  .icon_grid_inner {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    overflow-x: auto;
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    padding-bottom: 20px;
    margin-bottom: -20px;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .active{
    color: #000000;
    opacity: 1 !important;
    font-size: 32px !important;
    font-weight: 500;
    position:relative;
    font-weight:normal!important;

    &::before{
      content: '';
      width: 0.5rem;
      height: 0.07rem;
      // background-color: #FFC800;
      background-image: linear-gradient(90deg, #F5D598 0%, #E1B96E 100%);
      // border-radius: 6px;
      border-radius: 4px;
      position: absolute;
      left:50%;
      transform:translateX(-50%);
      bottom: -3px;
    }
  }
  .item {
    font-weight: lighter;
    font-family: PingFangSC-Medium;
    position: relative;
    color: #000000;
    opacity: 0.5;
    font-size: 32px;
    text-align: center;
    border-radius: 12px;
    font-weight:lighter;
    /*width: 60px;*/
    /*height: 152px;*/
    padding: 14px 0;
    display: flex;
    justify-content: center;
    align-items: center;

    margin-right: 48px;
    /*&.item0 {*/
    /*  background: #f05645;*/
    /*  margin-left: 48px;*/
    /*}*/
    /*&.item1 {*/
    /*  background: #fedd52;*/
    /*}*/
    /*&.item2 {*/
    /*  background: #f891f7;*/
    /*}*/
    /*&.item3 {*/
    /*  background: #00BCD4;*/
    /*}*/
    /*&.item4 {*/
    /*  background: #009688;*/
    /*}*/
    /*&.item5 {*/
    /*  background: #8bc34a;*/
    /*}*/
  }
  .block {
    width: 24px;
  }
}

.vlist {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  li{
    margin-right: 20px;
    &:nth-child(3n){
      margin-right:0;
    }
  }

  // align-content: space-between;
}
.vitem {
  width: 210px;
  margin: 0;
  position: relative;

  img {
    // border-radius: 10px;
    width: 210px;
    height: 318px;
    display: block;
    object-fit: cover;
    background-color: #ebebeb;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 120px 120px;
  }
  // .update {
  //   position: absolute;
  //   right: 0;
  //   bottom: 85px;
  //   color: #fff;
  //   line-height: 30px;
  //   font-size: 24px;
  //   padding: 0 12px;
  //   text-shadow: 0 2px 4px rgba(0,0,0,0.50);
  //   // display: none;
  // }
  /*.label {
        position: absolute;
        right: 0;
        top: 27px;
    }*/
  .isvip {
    position: absolute;
    // width:56px;
    padding: 0 4px;
    height:32px;
    right: 8px;
    top:0;
    background-image: linear-gradient(90deg, #F5D598 0%, #E1B96E 100%);
    // width: 48px;
    line-height: 32px;
    // border-radius: 4px;
    font-size: 20px;
    text-align: center;
    color: #000;
    // opacity: 0.9;
    display: block;
    margin-bottom: 5px;
    font-weight: lighter;
  }
  // .score {
  //   position: absolute;
  //   right: 15px;
  //   top: 260px;
  //   background-image: linear-gradient(90deg, #ffda00 0%, #ffc700 100%);
  //   width: 60px;
  //   line-height: 30px;
  //   border-radius: 4px;
  //   font-size: 24px;
  //   text-align: center;
  //   color: #fff;
  //   opacity: 0.9;
  //   display: none;
  // }
  .bottom{
    width: 100%;
    height:56px;
    line-height: 56px;
    position: absolute;
    bottom: 60px;
    // display: flex;
    // justify-content: space-between;
    padding: 0 12px;
    // align-items: center;
    background-image: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,.5));
    .text{
      font-family: PingFangSC-Regular;
      font-size: 20px;
      color: #FFFFFF;
      font-weight: lighter;
      float: left;
    }
    .score{
       color: #E1B96E;
       float: left;
    }
    .play{
      position: absolute;
      float: right;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 36px;
      height: 36px;
      background:  url('~@lib/base/tv/assets/new/tv_btn_play.png');
      background-size:100% 100%;

    }
  }

  .name {
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    // line-height: 2;
    // height: 76px;
    font-size:24px;
    padding:12px 0 24px 0;
  }
}
/* 根据栏目控制样式显示 */
.item-001 {
  .score {
    display: block;
  }
  img {
    background-image: url('~@lib/base/tv/assets/icn_TV_movie_white@2x.png');
  }
}
.item-002 {
  .update {
    display: block;
  }
  img {
    background-image: url('~@lib/base/tv/assets/icn_TV_tvshow_white@2x.png');
  }
}
.item-003 {
  .update {
    display: block;
  }
  img {
    background-image: url('~@lib/base/tv/assets/icn_TV_comic_white@2x.png');
  }
}
.item-004 {
  .update {
    display: block;
  }
  img {
    background-image: url('~@lib/base/tv/assets/icn_TV_entertainment_white@2x.png');
  }
}

.control {

  transition: all .3s ease-out;

  position: fixed;
  bottom: 16px;
  left: 0;
  right: 0;

  display: flex;
  justify-content: space-between;
  height: 186px;

  overflow-x: auto;
  -webkit-box-orient: horizontal;
  display: none;
  &.hide{
    bottom: -200px;
  }
  &::-webkit-scrollbar {
    display: none;
  }

  .left {
    margin: 25px 0;
    flex-shrink: 0;
    width: 136px;
    margin-right: 12px;
    background: #fff;
    box-shadow: 0 10px 23px 0 rgba(138, 138, 138, 0.63);
    border-radius: 10px;

    &.add {
      margin-right: 0;
      margin-left: 12px;
    }
  }
  .right {
    margin: 25px 0;

    flex-shrink: 0;
    width: 654px;
    display: flex;
    justify-content: space-around;
    background: #fff;
    box-shadow: 0 10px 23px 0 rgba(138, 138, 138, 0.63);
    border-radius: 10px;
    div {
      flex: 1;
    }
    .icon-switch {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/tv/assets/new/switch.png');
        background-size: 100% 100%;
      }
    }
    .icon-add {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/tv/assets/new/add.png');
        background-size: 100% 100%;
      }
    }
    .icon-sub {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/tv/assets/new/sub.png');
        background-size: 100% 100%;
      }
    }
    .icon-bak {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/tv/assets/new/bak.png');
        background-size: 100% 100%;
      }
    }
    .icon-ykq {
      height: 136px;
      // &::after {
      //   position: absolute;
      //   left: 0;
      //   content: "";
      //   width: 1px;
      //   height: 80px;
      //   background-image: linear-gradient(
      //     -180deg,
      //     rgba(238, 238, 238, 0) 0%,
      //     #d9d9d9 52%,
      //     rgba(216, 216, 216, 0) 100%
      //   );
      //   border-radius: 1px;
      // }
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/tv/assets/new/ykq.png');
        background-size: 100% 100%;
      }
    }

    .icon-screen {
      height: 136px;
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/tv/assets/new/screen.png');
        background-size: 100% 100%;
      }
    }

    .icon-detail {
      height: 136px;
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/tv/assets/new/detail.png');
        background-size: 100% 100%;
      }
    }
  }
  .block {
    flex-shrink: 0;
    width: 48px;
    height: 186px;
  }
}
.loadmore {
  text-align: center;
  /*padding: 30px 0;*/
  height: 60px;
  color: #000;
  opacity: 0.5;
  font-size: 24px;
  // .finish {
  //   color: #c8cacc;
  // }
}
.nodata {
  text-align: center;
  color: #9097a2;
  padding-top: 126px;
  i {
    width: 360px;
    height: 360px;
    background: url('~@lib/base/tv/assets/img_nodata@2x.png') no-repeat;
    background-size: 100% 100%;
    display: block;
    margin: 0 auto;
  }
}
.status{
  height:336px;
  margin-bottom:20px;
  .swiper{
    height:100%;
    .swiper-container{
      height:100%;
      .swiper-wrapper{
         height:100%;
         .swiper-slide{
            height:100%;
            a{
              height:100%
            }
          }
      }
    }

  }
}
</style>

<script>
import { mapState } from 'vuex'
import * as service from '../service'
console.log(service,'service----------------')

import _ from "../util"
import Icon from '@lib/components/SettingIconMobile.vue'
let infoCache = []

export default {
  inject:['reload'],
  components: { Icon },
  data() {
    const self = this
    return {

      ios: /iPad|iPhone|iPod/.test(navigator.userAgent),
      device_uuid: window.device_uuid || '',
      device_name:window.device_name||'',
      room_name:window.room_name||'',
      isShowBar: this.$route.query.showBar == 1,
      activeIndex:0,
      channelId: '',
      vid: '',
      itemData:{
        channel: "精选",
        channelId: "005"
      },
      swiperOption: {
        loop: true,
        autoplay: {
          delay: 2000,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination'
        },
        on: {
          tap() {
            let i = this.clickedIndex - 1
            const len = self.homePageInfo.length
            if (i == -1) {
              i = len - 1
            } else if (i == len) {
              i = 0
            }
            self.showDetailInfo(self.homePageInfo[i])
          }
        }
      },
      swiperOption2: {
        // loop: true,
        // autoplay: {
        //   delay: 2000,
        //   disableOnInteraction: false
        // },
        pagination: {
          el: '.swiper-pagination'
        },
        on: {
          tap() {
            let i = this.clickedIndex - 1
            const len = self.homePageInfo.length
            if (i == -1) {
              i = len - 1
            } else if (i == len) {
              i = 0
            }
            self.showDetailInfo(self.homePageInfo[i])
          }
        }
      },
      homePageInfo: [],
      ...service.getInitData(),

      listDY: [],
      listDSJ: [],
      listZY: [],
      listDM: [],
      dataList:[
        {
          channelId: '005',
          channel: '精选',
          list:[]
        },
        {
          channelId: '001',
          channel: '电影',
          list:[]
        },
           {
          channelId: '002',
          channel: '电视剧',
          list:[]
        },
        {
          channelId: '003',
          channel: '动漫',
          list:[]
        },
        {
          channelId: '004',
          channel: '综艺',
          list:[]
        }
      ],
         //总条数
      total: 0,
      //当前页码
      pageNo: 1,
      //分页数
      pageSize: 21,
      /**
              加载状态
              LOADING  分页加载中，显示 分页loading
              LOADED   分页加载成功，显示 加载更多...
              NO_DATA  没有数据，显示  暂无结果
              NO_MORE  全部加载完成，显示 已加载全部
           */
      loadState: "",
      error: false,
      isFirstLoad:true,
      //排序
      orderby: Object.freeze([
        { text: "最新", orderId: "year" },
        { text: "好评", orderId: "iscore" }
      ]),
      current_category: "",
      current_region: "",
      current_year: "",
      current_orderby: "year",

      hideMenu: false,
      noVal: false,
      maxh:0,
      starX:0,
      endX:0,
      starY:0,
      endY:0,
      scrollToList:{
        '0':0,
        '1':0,
        '2':0,
        '3':0,
        '4':0
      },
      pageNoList:{
        '0':1,
        '1':1,
        '2':1,
        '3':1,
        '4':1
      }
    }
  },
  computed: {
    ...mapState(['status_bar_height', 'navigation_bar_height','isStatusBarShow']),
      tvStatus() {
            return this.$store.state.tvStatus
        },
        spStatusText() {
            return ["", "图片", "视频", "音乐"][
                this.tvStatus.screenProjectType
            ]
        },
        spVisible() {
            return (
                this.tvStatus.tvOnlineStatus == 1 &&
                this.tvStatus.screenProjectType != 0 &&
                this.$route.name != "search"
            )
        },
        visible() {
            return this.tvStatus.tvOnlineStatus != 1 || this.spVisible
        },
    detailVisible() {
      return this.$store.state.detailVisible
    },
    barHeight() {
      return this.status_bar_height + this.navigation_bar_height
    },
    allList() {
      switch(this.activeIndex){
        case 0:

        console.log([this.listDY.slice(0, 6), this.listDSJ.slice(0, 6), this.listZY.slice(0, 6), this.listDM.slice(0, 6)],'allList-------------------------------------')
        return [this.listDY.slice(0, 6), this.listDSJ.slice(0, 6), this.listZY.slice(0, 6), this.listDM.slice(0, 6)]
        case 1:
            console.log([this.listDY],'allList-------------------------------------')
        return [this.listDY]

        case 2:
           console.log([ this.listDSJ],'allList-------------------------------------')
        return [ this.listDSJ]
        case 3:
           console.log([ this.listDSJ],'allList-------------------------------------')
        return [this.listZY]

        case 4:
           console.log([ this.listDSJ],'allList-------------------------------------')
        return [this.listDM]
      }
    },
  },
  watch: {
    activeIndex(n){
        let bStop = false
        for(let key in this.scrollToList){
          if(this.scrollToList[key]>=44){
            bStop = true
            break
          }
        }
        if(bStop&&this.scrollToList[n]<44){
             window.scrollTo(0,44)
             return
        }
      this.$nextTick(()=>{
         if(bStop&&this.scrollToList[n]<44){
             window.scrollTo(0,44)
        } else{
            window.scrollTo(0,this.scrollToList[n])
        }
      })
    },
    '$store.state.tvStatus.tvOnlineStatus':{
        handler:function(n,v){
          console.log('111111111111111111111111111111111',n,v)
            if(n===2){
               this.reload()
               this.pageInit()
               for (var i in this.channels) {
                  this.getinitData(this.channels[i].channelId,1)
              }
            }
        },
        immediate: true
    },
    'window.room_name'(n){
        console.log(n,'window.room_name------------------------------------watch')
    }
  },
  created() {
    this.pageInit()
    HdSmart.UI.toggleNav()
    console.log('1111',window.device_name)
    if(this.$store.state.tvStatus.tvOnlineStatus == 2){
      // this.reload()
    }
  },
  mounted() {
    Object.defineProperty(window,'room_name',{
      set:(newValue)=>{
        this.room_name = newValue
      }
    })
    this.maxh = this.$refs.icon_grid.offsetTop
    setTimeout(()=>{
      window.scrollTo(0,1)
    },300)
    window.addEventListener("scroll", this.loadMore)
    addEventListener("scroll", this.fn)
    document.body.scrollTop = 0
    this.initFixedMenu()
    console.log('uu', this.channels)
    service.RemoteController({ show: false })
    // })
    // 获取推荐电视信息
    // this.allList = []
    for (var i in this.channels) {
      this.getinitData(this.channels[i].channelId,1)
    }

    document.addEventListener('contextmenu', function(e) {
      e.preventDefault()
    })
    HdSmart.UI.hideLoading()
  },
   destroyed() {
    console.log('destroy')
    window.removeEventListener("scroll", this.loadMore)
    removeEventListener("scroll", this.fn)
  },
  activated(){
      window.addEventListener("scroll", this.loadMore)
    addEventListener("scroll", this.fn)

  },
  deactivated(){
       window.removeEventListener("scroll", this.loadMore)
    removeEventListener("scroll", this.fn)
  },
  //在页面离开时记录滚动位置
  beforeRouteLeave(to, from, next) {
    this.scrollTop1 = document.documentElement.scrollTop || document.body.scrollTop
    console.log(this.scrollTop1)
    next()
  },
  //进入该页面时，用之前保存的滚动位置赋值
  beforeRouteEnter(to, from, next) {
    next(vm => {
      document.body.scrollTop = vm.scrollTop1
    })
  },
  methods: {
    fn(){
      let statusbarH = document.querySelector('.statusbar').offsetHeight
      let newNavbarH = document.querySelector('.newNavbar').offsetHeight
      this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      let icon_grid = this.$refs.icon_grid
            if((this.scrollTop)>= 44){
        icon_grid.style.position = 'fixed'
        icon_grid.style.top = statusbarH+newNavbarH + 'px'
         icon_grid.style.background= 'rgba(255,255,255,.98)'
      }else{
        icon_grid.style.position = ''
         icon_grid.style.background = ''
      }
      this.scrollToList[this.activeIndex] = this.scrollTop

    },
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
          let clickItem = cur.playlist2.list[0]
          // console.log(clickItem,'clickItem')
          // console.log( cur ,'cur')
          if (!clickItem) {
            clickItem = this.cur.playlist2.list[0] || this.cur.playlist2.list2[0]
          }
          // console.log(clickItem,'clickItem')
          if (clickItem) {
            service.playVideo(clickItem.link, clickItem.name)

          }
        }
      )
    },
    back() {
      HdSmart.UI.popWindow()
    },
    touchMove() {
      // e.preventDefault()
    },
    volupStart(e) {
      this.timeOutEventUp = 1
      this.cmd('rcVolumeUpStart')
      e.preventDefault()
    },
    voldownStart(e) {
      this.timeOutEventDown = 1
      this.cmd('rcVolumeDownStart')
      e.preventDefault()
    },
    volupEnd(e) {
      if (this.timeOutEventUp) {
        this.cmd('rcVolumeUpStop')
        this.timeOutEventUp = 0
      } else {
        this.cmd('rcVolumeUp')
      }
      e.preventDefault()
    },
    voldownEnd(e) {
      if (this.timeOutEventDown) {
        this.cmd('rcVolumeDownStop')
        this.timeOutEventDown = 0
      } else {
        this.cmd('rcVolumeDown')
      }
      e.preventDefault()
    },
    cmd(name) {
      service.onClickEvent(name)
    },
    showDetailInfo(item) {
      // let obj = this.$store.state.tvStatus
      // obj.tvOnlineStatus = -1
      // this.$store.commit('setScreenProjectionStatus',obj)
      // console.log(this.$store.state.tvStatus,'22222')
      // return
      this.$store.dispatch('showDetail', item)
      // window.location.href = `index.html#/detail?channelId=${item.channelId}&vid=${item.vid}&ispay=${item.ispay}&showBar=1`
      this.$router.push({
         path:"/detail",
         query:{
           channelId:item.channelId,
           vid:item.vid,
           ispay:item.ispay,
           showBar:1
         }
       })

      // if (this.isShowBar) {
      //   window.location.href = `index.html#/detail?channelId=${item.channelId}&vid=${item.vid}&ispay=${item.ispay}&showBar=1`
      // } else {
      //   HdSmart.UI.pushWindow({
      //     url: `index.html#/detail?channelId=${item.channelId}&vid=${item.vid}&ispay=${item.ispay}`
      //   })
      // }
      // this.$router.push({ name: 'detail', query: { channelId: item.channelId, channel: item.channel } })
      // window.location.href = `index.html#/detail?channelId=${item.channelId}&vid=${item.vid}&ispay=${item.ispay}`
    },
    pageInit() {
      service.getHomePageInfo(data => {
        infoCache = this.arrayUnqiue(data,'vid') //通过VID去重
        this.homePageInfo = infoCache
        if(!data || this.homePageInfo.length == 0) {
          this.noVal = true
        }
      })
    },
    /**
     * @param {object[]} arr 要去重的数组对象
     * @param {string} name 根据对象里面哪个属性去重
     * @return {object[]} 去重后的数组对象
     */
    arrayUnqiue(arr, name) {
        let hash = {}
        return arr.reduce((item, next) => {
          hash[next[name]] ? '' : hash[next[name]] = true && item.push(next)
          return item
        }, [])
    },
    filterData(channelId,page) {
      // if (page === 1) this.isFirstLoad = true
      this.loadState = "LOADING"
      service.searchData(
        {
          channelId: channelId,
          pageSize: this.pageSize,
          pageNo: page
        },
        (err, data) => {
          console.log(data,'333333333')

          this.loadState = "LOADED"
          if (err) return

          if (data.data) {
            data = data.data
          }
          if (data.list == "") {
            data.list = []
          }
          let cid = data.channelId

          this.$nextTick(() => {
            switch(this.activeIndex){
              case 1:
                this.listDY = Object.freeze(
                  (page === 1 ? [] : this.listDY).concat(data.list)
                )
                this.dataList[1].list = Object.freeze(
                  (page === 1 ? [] : this.dataList[1].list).concat(data.list)
                )
                break
              case 2:
                this.listDSJ = Object.freeze(
                  (page === 1 ? [] : this.listDSJ).concat(data.list)
                )
                this.dataList[2].list = Object.freeze(
                  (page === 1 ? [] : this.dataList[2].list).concat(data.list)
                )
                break
              case 3:
                this.listZY = Object.freeze(
                  (page === 1 ? [] : this.listZY).concat(data.list)
                )
                this.dataList[3].list = Object.freeze(
                  (page === 1 ? [] : this.dataList[3].list).concat(data.list)
                )
                break
              case 4:
                this.listDM = Object.freeze(
                  (page === 1 ? [] : this.listDM).concat(data.list)
                )
                this.dataList[4].list = Object.freeze(
                  (page === 1 ? [] : this.dataList[4].list).concat(data.list)
                )
                break
            }
            this.dataList[0].list = [
              this.dataList[1].list.slice(0,6),
              this.dataList[2].list.slice(0,6),
              this.dataList[3].list.slice(0,6),
              this.dataList[4].list.slice(0,6)
            ]
            console.log(this.listDY,'listDY')

            console.log( this.dataList,' this.dataList----------------------------------')


            // if(cid === '001'){
            //   this.listDY = Object.freeze(
            //     (page === 1 ? [] : this.listDY).concat(data.list)
            //   )
            // } else if(cid === '002') {
            //   this.listDSJ = data.data.list
            // } else if(cid === '003') {
            //   this.listZY = data.data.list
            // } else if(cid === '004') {
            //   this.listDM = data.data.list
            // }
            // this.list = Object.freeze(
            //   (page === 1 ? [] : this.list).concat(data.list)
            // )

            this.total = data.total
            // this.pageNo = page
          console.log(page,'page')

            this.pageNoList[this.activeIndex] = page
            // if (this.isFirstLoad) {
            //   this.isFirstLoad = false
            //   // console.log('?????????????????????????????')

            //   window.scrollTo(0, 0)
            // }
            if (data.total === 0) {
              //没有数据
              this.loadState = "NO_DATA"
            } else if (this.pageSize * page >= data.total) {
              //加载完全部
              this.loadState = "NO_MORE"
              //HdSmart.UI.toast('已加载全部')
            }
          })


        }
      )
      // console.log('----getChannelData--------')
      // service.getChannelData(channelId, (err, data) => {
      //   console.log('data',data)
      //   if (err) {
      //     console.log(err)
      //     this.error = true
      //     return
      //   }
      //   let cid = data.channelId
      //   if(cid === '001'){
      //     this.listDY = data.data.list
      //   } else if(cid === '002') {
      //     this.listDSJ = data.data.list
      //   } else if(cid === '003') {
      //     this.listZY = data.data.list
      //   } else if(cid === '004') {
      //     this.listDM = data.data.list
      //   }
      // })
    },
    getinitData(channelId){
         service.getChannelData({channelId,pageSize:21}, (err, data) => {
        console.log('data',data)
       this.loadState = "LOADED"

        if (err) {
          console.log(err)
          this.error = true
          return
        }
        let cid = data.channelId
        if(cid === '001'){
          this.listDY = data.data.list
        } else if(cid === '002') {
          this.listDSJ = data.data.list
        } else if(cid === '003') {
          this.listZY = data.data.list
        } else if(cid === '004') {
          this.listDM = data.data.list
        }
      })
    },
     loadMore: _.debounce(function() {
       if(this.itemData.channelId === '005') return
      var scrollTop =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop
        console.log(this.itemData.channelId,'3333333333333333555')

      if ( scrollTop > 0 && scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 15) {
        // if (this.$store.state.detailVisible) {
        //   return
        // }
        if ( this.loadState === "LOADING" || this.loadState === "NO_DATA") { return }
        if (this.loadState === "NO_MORE") {
          HdSmart.UI.toast("已加载全部")
          return
        }
        // console.log(this.pageNoList[this.activeIndex] + 1,'3433333333333333333333364678')

        this.filterData(this.itemData.channelId,this.pageNoList[this.activeIndex] + 1)
      }
    }, 300),
    //换成小图地址
    getThumbPic(pic) {
      if(pic){
        let imgObj = {
        src: pic.replace(".jpg", "_y.jpg"),
        error: pic
      }
      return imgObj
      }

    },
    getUpdateSet(count, last) {
      if (!count || !last || count == "0" || last == "0") {
        return ""
      } else if (last === count) {
        return count + "集全"
      } else {
        return "更新至" + last + "集"
      }
    },
    toActive(item,idx){
      // setTimeout(()=>{
      //   window.scrollTo(0,1000)
      // },300)
        console.log(this.$store.state.tvStatus)
       this.activeIndex = idx
       this.itemData = item
       this.loadState = 'LOADED'
       console.log( this.activeIndex,this.itemData,555555555)

    },
    toPage(item) {

console.log(item,'vm.scrollTopvm.scrollTop')

      // let name = encodeURIComponent(item.channel)

      console.log(this.$route.meta.keepAlive,'444444444444444')

      //  window.location.href = `index.html#/list?channelId=${item.channelId}&channel=${name}&showBar=1`
       this.$router.push({
         path:"/list",
         query:{
           channelId:item.channelId,
           channel:item.channel,
           showBar:1
         }
       })

      // if (this.isShowBar) {
      //   window.location.href = `index.html#/list?channelId=${item.channelId}&channel=${name}&showBar=1`
      // } else {
      //   HdSmart.UI.pushWindow({
      //     url: `index.html#/list?channelId=${item.channelId}&channel=${name}`
      //   })
      // }
      // window.location.href = `index.html#/list?channelId=${item.channelId}&channel=${item.channel}`
      // this.$router.push({ name: 'list', query: { channelId: item.channelId, channel: item.channel } })
    },
    toListPage(idx){
      let item = {}
      if(idx == 0){
        item = { channelId: '001', channel: '电影' }
      } else if(idx == 1) {
        item = { channelId: '002', channel: '电视剧'}
      } else if(idx == 2) {
        item = { channelId: '003',channel: '动漫'}
      } else if (idx == 3){
        item = { channelId: '004',channel: '综艺'}
      }
      this.toPage(item)
    },
    goDetail() {
      HdSmart.UI.goDeviceDetail()
    },
    initFixedMenu() {
      let last_position = 0
      window.addEventListener('scroll', () => {
        let current_position = window.scrollY
        if (current_position < last_position) {
          this.hideMenu = false
        } else if (current_position > last_position && current_position > 180) {
          this.hideMenu = true
        }
        last_position = current_position
      })
    },
    shutdownCallback(){
      console.log('11111111')
    },
    touchstart(e){
      this.starX = e.changedTouches[0].clientX
      this.starY = e.changedTouches[0].clientY
    },
    touchend(e){
      this.endX = e.changedTouches[0].clientX
      this.endY = e.changedTouches[0].clientY
      if(Math.abs(this.endY-this.starY)>30) return
      if((this.endX-this.starX>50)&&this.activeIndex!=0){
          this.activeIndex-=1
      }
      if((this.endX-this.starX<-50)&&this.activeIndex!=4){
          this.activeIndex+=1
      }
    }
  }
}
</script>
