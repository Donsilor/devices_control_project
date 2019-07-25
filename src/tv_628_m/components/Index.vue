<!-- 首页 -->
<template>
  <div class="page-index">
    <div 
      v-show="ios" 
      class="space-block" />
    <!-- 顶部导航菜单 -->
    <topbar 
      v-if="isShowBar"
      :title="$store.state.device_name"
      :more="true"
      :search="false"
      :back="back" />
    <!-- 设备状态提示 -->
    <status-tip 
      v-show="device_uuid"
      :bar-height="barHeight" />
    <!-- 栏目分类 -->
    <div class="swiper mar">
      <div 
        v-if="homePageInfo.length === 0"
        @click="pageInit">
        <img src="../../../lib/base/tv/assets/img_default_recommend.png">
      </div>
      <swiper 
        v-if="homePageInfo.length"
        ref="swiper"
        :options="swiperOption">
        <swiper-slide 
          v-for="item in homePageInfo"
          :key="item.vid">
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
    <div class="wrap-title">
      <div class="title mar">栏目分类</div>
    </div>

    <div class="icon_grid">
      <div class="icon_grid_inner">
        <div 
          v-for="(item, idx) in channels"
          :class="['item' + idx, 'item']"
          @click.prevent="toPage(item)">{{ item.channel }}</div>
        <div class="block" />
      </div>
    </div>
    <!-- 列表 -->
    <div 
      v-for="(it, idx) in allList"
      :key="idx"
      class="mar">
      <div 
        v-show="it && it.length > 0" 
        class="wrap-title">
        <div class="title">{{ idx | nameType }}</div>
        <div 
          class="more" 
          @click="toListPage(idx)">更多&nbsp;></div>
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
          <span class="update">
            更新至12集
            {{ getUpdateSet(item.setCount,item.lastUpdateSet) }}
          </span>
          <!-- <span 
            v-if="item.ispay && item.ispay !== '1'"
            class="isvip">付费</span> -->
          <!-- <span class="score">{{ item.score }}</span> -->
          <!--<div class="label">-->
          <!--</div>-->
        </li>
      </ul>
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
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.page-index {
  padding-bottom: 48px;
  background: #f8f8f8;

  .space-block{
    height: 26px;
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
      font-size: 24px;
      color: #20282B;
    }
  }

  .mar {
    margin: 0 48px;
  }
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

.icon_grid {
  overflow: hidden;
  .icon_grid_inner {
    display: flex;
    flex-wrap: nowrap;

    width: 100%;
    overflow-x: auto;
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .item {
    position: relative;
    color: #fff;
    font-size: 32px;
    text-align: center;
    border-radius: 12px;
    width: 280px;
    height: 152px;

    display: flex;
    justify-content: center;
    align-items: center;

    margin-right: 24px;
    &.item0 {
      background: #f05645;
      margin-left: 48px;
    }
    &.item1 {
      background: #fedd52;
    }
    &.item2 {
      background: #f891f7;
    }
    &.item3 {
      background: #00BCD4;
    }
    &.item4 {
      background: #009688;
    }
    &.item5 {
      background: #8bc34a;
    }
  }
  .block {
    width: 24px;
  }
}

.vlist {
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
    right: 0;
    bottom: 85px;
    color: #fff;
    line-height: 30px;
    font-size: 24px;
    padding: 0 12px;
    text-shadow: 0 2px 4px rgba(0,0,0,0.50);
    // display: none;
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
/* 根据栏目控制样式显示 */
.item-001 {
  .score {
    display: block;
  }
  img {
    background-image: url(../../../lib/base/tv/assets/icn_TV_movie_white@2x.png);
  }
}
.item-002 {
  .update {
    display: block;
  }
  img {
    background-image: url(../../../lib/base/tv/assets/icn_TV_tvshow_white@2x.png);
  }
}
.item-003 {
  .update {
    display: block;
  }
  img {
    background-image: url(../../../lib/base/tv/assets/icn_TV_comic_white@2x.png);
  }
}
.item-004 {
  .update {
    display: block;
  }
  img {
    background-image: url(../../../lib/base/tv/assets/icn_TV_entertainment_white@2x.png);
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
        background-image: url(../../../lib/base/tv/assets/new/switch.png);
        background-size: 100% 100%;
      }
    }
    .icon-add {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../../lib/base/tv/assets/new/add.png);
        background-size: 100% 100%;
      }
    }
    .icon-sub {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../../lib/base/tv/assets/new/sub.png);
        background-size: 100% 100%;
      }
    }
    .icon-bak {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../../lib/base/tv/assets/new/bak.png);
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
        background-image: url(../../../lib/base/tv/assets/new/ykq.png);
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
        background-image: url(../../../lib/base/tv/assets/new/screen.png);
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
        background-image: url(../../../lib/base/tv/assets/new/detail.png);
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
import Icon from '../../../lib/components/SettingIconMobile.vue'
let infoCache = []

export default {
  components: { Icon },
  data() {
    const self = this
    return {
      ios: /iPad|iPhone|iPod/.test(navigator.userAgent),
      device_uuid: window.device_uuid || '',
      isShowBar: this.$route.query.showBar == 1,

      channelId: '',
      vid: '',
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

      hideMenu: false
    }
  },
  computed: {
    ...mapState(['status_bar_height', 'navigation_bar_height']),
    detailVisible() {
      return this.$store.state.detailVisible
    },
    barHeight() {
      return this.status_bar_height + this.navigation_bar_height
    },
    allList() {
      return [this.listDY, this.listDSJ, this.listZY, this.listDM]
    }
  },
  watch: {
    // detailVisible(visible) {
    //   if (visible) {
    //     this.$refs.swiper.swiper.autoplay.stop()
    //   } else {
    //     this.$refs.swiper.swiper.autoplay.start()
    //   }
    // }
  },
  mounted() {
    document.body.scrollTop = 0
    this.initFixedMenu()
    service.RemoteController({ show: false })
    this.$nextTick(() => {
      if (!infoCache.length) {
        this.pageInit()
      } else {
        this.homePageInfo = infoCache
      }
    })

    // 获取推荐电视信息
    this.allList = []
    for (var i in this.channels) {
      this.filterData(this.channels[i].channelId)
    }

    document.addEventListener('contextmenu', function(e) {
      e.preventDefault()
    })
  },
  methods: {
    back() {
      HdSmart.UI.popWindow()
    },
    touchMove(e) {
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
      this.$store.dispatch('showDetail', item)

      if (this.isShowBar) {
        window.location.href = `index.html#/detail?channelId=${item.channelId}&vid=${item.vid}&ispay=${item.ispay}&showBar=1`
      } else {
        HdSmart.UI.pushWindow({
          url: `index.html#/detail?channelId=${item.channelId}&vid=${item.vid}&ispay=${item.ispay}`
        })
      }
      // this.$router.push({ name: 'detail', query: { channelId: item.channelId, channel: item.channel } })
      // window.location.href = `index.html#/detail?channelId=${item.channelId}&vid=${item.vid}&ispay=${item.ispay}`
    },
    pageInit() {
      service.getHomePageInfo(data => {
        infoCache = data
        this.homePageInfo = infoCache
      })
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
        if (err) {
          this.error = true
          return
        }
        let cid = data.channelId
        console.log(cid)
        if(cid === '001'){
          this.listDY = data.data.list.slice(0, 6)
        } else if(cid === '002') {
          this.listDSJ = data.data.list.slice(0, 6)
        } else if(cid === '003') {
          this.listZY = data.data.list.slice(0, 6)
        } else if(cid === '004') {
          this.listDM = data.data.list.slice(0, 6)
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

    toPage(item) {
      let name = encodeURIComponent(item.channel)
      if (this.isShowBar) {
        window.location.href = `index.html#/list?channelId=${item.channelId}&channel=${name}&showBar=1`
      } else {
        HdSmart.UI.pushWindow({
          url: `index.html#/list?channelId=${item.channelId}&channel=${name}`
        })
      }
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
    }
  }
}
</script>
