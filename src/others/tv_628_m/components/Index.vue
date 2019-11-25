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
      page-class=".page-index"
      bak-color="#000"
      @shutdownCallback="cmd('rcPower')"
    />
    <!--    -->
    <status-tip
      v-show="device_uuid"  
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

    <div class="icon_grid">
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
    
    <div class="index-list">
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
            @click="toListPage(idx)"><span class="more_text">更多</span> <span class="more_mg"/></div>
        </div>

        <ul class="vlist list-m60">
          <li
            v-for="item in it"
            :key="item.vid"
            :class="['item-'+ item.channelId, 'vitem']"
            @click="showDetailInfo(item)">

            <img
              v-lazy="getThumbPic(item.pictureUrl)"
              :data-src="item.pictureUrl"
              alt="">
       
            <div class="name">{{ item.title }}</div>
            <div class="bottom">
              <span 
                v-if="item.channelId=='002'" 
                class="text">
                {{ getUpdateSet(item.setCount,item.lastUpdateSet) }}
              </span>
              <span 
                v-if="item.channelId=='001'" 
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
  padding-bottom: 48px;
  background: url("../../../../lib/base/tv/assets/icn_blurry_bg@2x.png");
  background-size: 100% 100%;
  background-attachment: fixed;
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
    .title {
      font-size: 40px;
      color: #20282b;
      font-weight: bold;
      padding: 48px 0 40px 0;
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
    margin-top: 28PX;
    height: 44PX;
  .search-screen{
    overflow: hidden;
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
      color: #AAA;
      display: flex;
      justify-content: center;
      align-items: center;
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
  margin: 0 40px;
  padding: 20px 0;

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
    font-size: 40px !important;
    font-weight: 500;
    position:relative;
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
    font-family: PingFangSC-Medium;
    position: relative;
    color: #000000;
    opacity: 0.5;
    font-size: 32px;
    text-align: center;
    border-radius: 12px;
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
    right: 0;
    top:0;
    background-image: linear-gradient(90deg, #F5D598 0%, #E1B96E 100%);
    // width: 48px;
    line-height: 32px;
    // border-radius: 4px;
    font-size: 24px;
    text-align: center;
    color: #000;
    // opacity: 0.9;
    display: block;
    margin-bottom: 5px;
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
    height:36px;
    position: absolute;
    bottom: 86px;
    display: flex;
    justify-content: space-between;
    padding: 0 12px;
    align-items: center;
    .text{
      font-family: PingFangSC-Regular;
      font-size: 20px;
      color: #FFFFFF;
    }
    .score{
       color: #E1B96E;
    }
    .play{
      width: 36px;
      height: 36px;
      background:  url('~@lib/base/tv/assets/new/tv_icn_play.png');
      background-size:100% 100%; 
  
    }
  }
  
  .name {
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 2;
    height: 76px;
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
</style>

<script>
import { mapState } from 'vuex'
import * as service from '../service'
import Icon from '@lib/components/SettingIconMobile.vue'
let infoCache = []

export default {
  components: { Icon },
  data() {
    const self = this
    return {
      
      ios: /iPad|iPhone|iPod/.test(navigator.userAgent),
      device_uuid: window.device_uuid || '',
      device_name:window.device_name||'',
      isShowBar: this.$route.query.showBar == 1,
      activeIndex:0,
      channelId: '',
      vid: '',
      itemData:{},
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
      homePageInfo: [],
      ...service.getInitData(),

      listDY: [],
      listDSJ: [],
      listZY: [],
      listDM: [],

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
      noVal: false
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
        return [this.listDY.slice(0, 6), this.listDSJ.slice(0, 6), this.listZY.slice(0, 6), this.listDM.slice(0, 6)]
        case 1:
        return [this.listDY]
        case 2:
        return [ this.listDSJ]
        case 3:
        return [this.listZY]
        case 4:
        return [this.listDM]
      }
      
    },
    // homePage() {
    //   if(homePageInfo.length == 0) {
    //     return this.pageInit()
    //   }
    // }
  },
  watch: {
    // detailVisible(visible) {
    //   if (visible) {
    //     this.$refs.swiper.swiper.autoplay.stop()
    //   } else {
    //     this.$refs.swiper.swiper.autoplay.start()
    //   }
    // }
    // homePageInfo() {
    //   if(this.homePageInfo.length == 0) {
    //     this.pageInit()
    //   }
    // }
  },
  created() {   
    //  this.$router.push('/NoNetwork') 
    this.pageInit()
    HdSmart.UI.toggleNav()
    console.log('1111',window.device_name)
  },
  mounted() {
    setTimeout(()=>{
      window.scrollTo(0,1)
    },300)
    document.body.scrollTop = 0
    this.initFixedMenu()
    console.log('uu', this.channels)
    service.RemoteController({ show: false })
    // this.$nextTick(() => {
    //   this.pageInit()
    //   if (!infoCache.length) {
    //     this.pageInit()
    //   } else {
    //     this.homePageInfo = infoCache
    //   }
    // })
    // 获取推荐电视信息
    // this.allList = []
    for (var i in this.channels) {
      this.filterData(this.channels[i].channelId)
    }

    document.addEventListener('contextmenu', function(e) {
      e.preventDefault()
    })
    HdSmart.UI.hideLoading()
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
    filterData(channelId) {
      // service.searchData(
      //   {
      //     channelId: channelId,
      //     category: this.current_category,
      //     region: this.current_region,
      //     year: this.current_year,
      //     cateId: this.current_category,
      //     regionId: this.current_region,
      //     orderby: this.current_orderby,
      //     pageSize: 6,
      //     pageNo: 1
      //   },
      //   (err, data) => {
      //     let cid = data.data.channelId
      //     console.log(cid)
      //     console.log(data.data.list.slice(0, 6))
      //     if(cid === '001'){
      //       this.listDY = data.data.list.slice(0, 6)
      //     } else if(cid === '002') {
      //       this.listDSJ = data.data.list.slice(0, 6)
      //     } else if(cid === '003') {
      //       this.listZY = data.data.list.slice(0, 6)
      //     } else if(cid === '004') {
      //       this.listDM = data.data.list.slice(0, 6)
      //     }
      //   }
      // )
      console.log('----getChannelData--------')
      service.getChannelData(channelId, (err, data) => {
        console.log('data',data)
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
    //换成小图地址
    getThumbPic(pic) {
      let imgObj = {
        src: pic.replace(".jpg", "_y.jpg"),
        error: pic
      }
      return imgObj
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
        console.log(this.$store.state.tvStatus)
       this.activeIndex = idx
       this.itemData = item
    },
    toPage(item) {

      // let name = encodeURIComponent(item.channel)


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
    }
  }
}
</script>
