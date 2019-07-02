<!-- 首页 -->
<template>
  <div class="page-index">
    <status-tip />
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
          </a>
        </swiper-slide>
        <div 
          slot="pagination"
          class="swiper-pagination" />
      </swiper>
    </div>
    <div class="title mar">栏目分类</div>

    <div class="icon_grid">
      <div class="icon_grid_inner">
        <div 
          v-for="(item, idx) in channels"
          :class="['item' + idx, 'item']"
          @click.prevent="toPage(item)">{{ item.channel }}</div>

          <!-- <div 
          class="item4 item "
          @click.prevent="cmd('screenProjectionEvent')">投屏</div> -->
          <!-- <div 
          class="item5 item "
          @click.prevent="cmd('remoteControlEvent')">遥控器</div> -->
      </div>
    </div>

    <div 
      v-for="(it, idx) in allList"
      :key="idx" 
      class="mar">
      <div class="title">{{ idx | nameType }}</div>
      <!-- 列表 -->
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
            {{ getUpdateSet(item.setCount,item.lastUpdateSet) }}
          </span>
          <span 
            v-if="item.ispay && item.ispay !== '1'"
            class="isvip">付费</span>
          <span class="score">{{ item.score }}</span>
          <!--<div class="label">-->
          <!--</div>-->
        </li>
      </ul>
    </div>

    <div class="control">
      <div class="left">
        <div
          :class="{spec:!$store.state.online && !$store.state.detailVisible}"
          class="icon-screen center"
          @click.prevent="cmd('screenProjectionEvent')" />
      </div>

      <div class="right">
        <div 
          class="icon-switch center"
          @click.prevent="cmd('rcPower')" />
        <div
          v-finger:touch-end="volupEnd"
          v-finger:touch-move="touchMove"
          v-finger:long-tap="volupStart"
          class="icon-add center" />
        <div
          v-finger:touch-end="voldownEnd"
          v-finger:touch-move="touchMove"
          v-finger:long-tap="voldownStart"
          class="icon-sub center" />
        <div 
          class="icon-bak center"
          @click.prevent="cmd('rcBack')" />
      </div>

    </div>
  </div>
</template>

<style lang="less" scoped>
.center{
  display: flex;
  justify-content: center;
  align-items: center;
}
.page-index {
  padding: 48px 0 180px;
  background: #f8f8f8;
  .title {
    font-size: 40px;
    color: #20282b;
    font-weight: bold;
    padding: 48px 0 40px 0;
  }
  .mar{
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
  margin-left: 48px;
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
    }
    &.item1 {
      background: #fedd52;
    }
    &.item2 {
      background: #f891f7;
    }
    &.item3 {
      background: #2196f3;
    }
    &.item4 {
      background: #009688;
    }
    &.item5 {
      background: #8bc34a;
    }
  }
}

.swiper {
  .swiper-container {
    border-radius: 11.5px;
  }
  .swiper-slide {
    width: 750px;
    height: 302px;
    background: url(../../../lib/base/tv/assets/img_default_recommend.png)
      no-repeat;
    background-size: 100%;
  }
  a {
    display: block;
    width: 750px;
    height: 302px;
    background-repeat: no-repeat;
    background-size: 100%;
    overflow: hidden;
  }
  img {
    width: 100%;
  }
  .title {
    position: absolute;
    left: 0;
    bottom: -1px;
    color: #fff;
    font-size: 32px;
    height: 120px;
    width: 100%;
    padding-top: 50px;
    padding-left: 30px;
    background-image: linear-gradient(
      -180deg,
      rgba(47, 49, 51, 0) 0%,
      #2f3133 100%
    );
  }
  .swiper-container-horizontal > .swiper-pagination-bullets {
    width: auto;
    left: auto;
    right: 30px;
    bottom: 23px;
  }
  .swiper-pagination-bullet {
    width: 10px;
    height: 10px;
    opacity: 0.5;
    background: rgba(220, 225, 234, 0.7);
    border-radius: 5px;
    transition: width 0.5s;
  }
  .swiper-pagination-bullet-active {
    width: 34px;
    background: #fdde4b;
  }
}

.list-m60 {
  // margin: 0 25px;
}
.vlist {
  padding-top: 36px;
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
    top: 420px;
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
  position: fixed;
  bottom: 36px;
  left: 0;
  right: 0;

  display: flex;
  justify-content: space-between;
  margin: 0 48px;
  height: 136px;

  .left{
    width: 136px;
    margin-right: 16px;
    background: #fff;
    box-shadow: 0 10px 23px 0 rgba(138,138,138,0.63);
    border-radius: 10px;
    .icon-screen{
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
  }
  .right{
    flex: 1;
    display: flex;
    justify-content: space-around;
    background: #fff;
    box-shadow: 0 10px 23px 0 rgba(138,138,138,0.63);
    border-radius: 10px;
    div{
      flex: 1;
    }
    .icon-switch{
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../../lib/base/tv/assets/new/switch.png);
        background-size: 100% 100%;
      }
    }
    .icon-add{
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../../lib/base/tv/assets/new/add.png);
        background-size: 100% 100%;
      }
    }
    .icon-sub{
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../../lib/base/tv/assets/new/sub.png);
        background-size: 100% 100%;
      }
    }
    .icon-bak{
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../../lib/base/tv/assets/new/bak.png);
        background-size: 100% 100%;
      }
    }
  }

}
</style>

<script>
import * as service from '../service'
import Icon from '../../../lib/components/SettingIconMobile.vue'
let infoCache = []

export default {
  components: { Icon },
  data() {
    const self = this
    return {
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

      allList: [],
      //排序
      orderby: Object.freeze([
        { text: "最新", orderId: "year" },
        { text: "好评", orderId: "iscore" }
      ]),
      //当前分类，默认全部
      current_category: "",
      //当前地区，默认全部
      current_region: "",
      //当前年份，默认全部
      current_year: "",
      //当前年份，默认全部
      current_orderby: "year"
    }
  },
  computed: {
    detailVisible() {
      return this.$store.state.detailVisible
    }
  },
  watch: {
    detailVisible(visible) {
      if (visible) {
        this.$refs.swiper.swiper.autoplay.stop()
      } else {
        this.$refs.swiper.swiper.autoplay.start()
      }
    }
  },
  mounted() {
    document.body.scrollTop = 0
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
      e.preventDefault()
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
      // this.$router.push({ name: 'detail', query: { channelId: item.channelId, channel: item.channel } })
      window.location.href = `index.html#/detail?channelId=${item.channelId}&vid=${item.vid}&ispay=${item.ispay}`
    },
    pageInit() {
      service.getHomePageInfo(data => {
        infoCache = data
        this.homePageInfo = infoCache
      })
    },
    filterData(channelId) {
      console.log(channelId)
      console.log('------before-------')
      service.searchData(
        {
          channelId: channelId,
          category: this.current_category,
          region: this.current_region,
          year: this.current_year,
          cateId: this.current_category,
          regionId: this.current_region,
          orderby: this.current_orderby,
          pageSize: 6,
          pageNo: 1
        },
        (err, data) => {
          console.log('------push-------')
          this.allList.push(data.data.list.slice(0, 6))
        }
      )
    },
    //换成小图地址
    getThumbPic(pic) {
      let imgObj =  {
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
      HdSmart.UI.pushWindow({
          url: `index.html#/list?channelId=${item.channelId}&channel=${item.channel}`
      })
      // window.location.href = `index.html#/list?channelId=${item.channelId}&channel=${item.channel}`
      // this.$router.push({ name: 'list', query: { channelId: item.channelId, channel: item.channel } })
    }
  }
}
</script>
