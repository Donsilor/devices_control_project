<!--
    列表页,query:{title:"",channelId:""}
-->
<template>
  <div class="page-list">
    <!-- 遥控器 --> 
    <remoteControl/>
    <!-- 错误提示 -->
    <div
      v-if="error"
      class="error-page"
      @click="reload">
      <div class="error-tip">
        <img src="~@lib/base/tv/assets/img_disconnection@2x.png">
        <p>加载失败，请点击屏幕刷新</p>
      </div>
    </div>

    <topbar
      ref="topbar"
      :back="goBack"
      :title="title" />

    <!-- <status-tip v-show="device_uuid" /> -->
    <!-- 条件 -->
    <div
      :class="{active:filterVisible}"
      class="filters-placeholder" />
    <div
      v-if="!error"
      ref="filters"
      :class="{active:filterVisible}" 
      class="filters">
      <!-- :style="{top: isStatusBarShow ? (status_bar_height + navigation_bar_height + 40) + 'px' : (status_bar_height + navigation_bar_height) + 'px' }" -->
      <!-- 地区 -->
      <dl
        v-show="filterVisible"
        class="row">
        <dt>
          <a
            :class="{active:current_region==''}"
            href="#"
            @click.prevent="setParam('current_region','')">全部地区</a>
        </dt>
        <dd>
          <a
            v-for="(item,index) in region"
            :key="item.regionId+index"
            :class="{active:current_region==item.regionId}"
            href="#"
            @click.prevent="setParam('current_region',item.regionId)">
            {{ item.region }}
          </a>
        </dd>
      </dl>
      <!-- 分类 -->
      <dl
        v-show="filterVisible"
        class="row">
        <dt>
          <a
            :class="{active:current_category==''}"
            href="#"
            @click.prevent="setParam('current_category','')">全部分类</a>
        </dt>
        <dd>
          <a
            v-for="(item,index) in category"
            :key="item.cateId+index"
            :class="{active:current_category==item.cateId}"
            href="#"
            @click.prevent="setParam('current_category',item.cateId)">
            {{ item.cate }}
          </a>
        </dd>
      </dl>
      <!-- 年份 -->
      <dl
        v-show="filterVisible"
        class="row">
        <dt>
          <a
            :class="{active:current_year==''}"
            href="#"
            @click.prevent="setParam('current_year','')">全部年份</a>
        </dt>
        <dd>
          <a
            v-for="(item,index) in year"
            :key="item.yearrange+index"
            :class="{active:current_year==item.yearrange}"
            href="#"
            @click.prevent="setParam('current_year',item.yearrange)">
            {{ item.year }}
          </a>
        </dd>
      </dl>
      <!-- 排序 -->
      <dl
        v-show="filterVisible"
        class="row">
        <dd>
          <a
            v-for="(item,index) in orderby"
            :key="item.orderId+index"
            :class="{active:current_orderby==item.orderId}"
            href="#"
            @click.prevent="setParam('current_orderby',item.orderId)">
            {{ item.text }}
          </a>
        </dd>
      </dl>
      <div
        v-show="!filterVisible"
        :class="{active:filterVisible}"
        href="#"
        class="toggle" 
        @click.prevent="toggleFilter()">
        <p class="text">综合排序</p>
        <!-- <p class="arrow"/> -->
      </div>

    </div>

    <!-- 列表 -->
    <div class="video-list">
  
      <ul class="vlist list-m60">
        <li
          v-for="(item,index) in list"
          :key="item.vid+index"
          :class="['item-'+channelId]"
          class="vitem"
          @click="showDetailInfo(item)">
          <img
            v-lazy="getThumbPic(item.pictureUrl)"
            :data-src1="item.pictureUrl"
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
            

          <!-- <span class="update">
            {{ getUpdateSet(item.setCount,item.lastUpdateSet) }}
          </span> -->
          <span
            v-if="item.ispay && item.ispay !== '1'"
            class="isvip">付费</span>
            <!-- <span class="score">{{ item.score }}</span> -->
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
    <div class="loadmore">
      <p v-show="!isFirstLoad && loadState === 'LOADING'">正在加载中...</p>
      <p v-show="!isFirstLoad && loadState === 'LOADED'">上拉加载更多</p>
      <p 
        v-show="loadState === 'NO_MORE'" 
        class="finish">已加载全部</p>
    </div>
  </div>
</template>

<style lang="less" scoped>
.page-list{
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
}
.filters-placeholder {
  height: 120px;
  &.active {
    height: 345px;
  }
}
.filters {
  // padding: 28px 28px 12px;
  // background: rgba(255, 255, 255, 0.98);
  // background: rgba(255, 255, 255, 1);
  /**box-shadow: inset 0 -1px 0 0 #dbdbdb;**/
  position: fixed;
  // height:88px;
  left: 0;
  top: 65px;
  width: 100%;
  z-index: 999;
  font-size:24px;
  &.active {
    padding: 32px 32px 16px 32px;
    .toggle {
      bottom: 22px;
    }
  }
  .toggle {
    width: 100%;
    height:88px;
    display: flex;
    justify-content: center;
    align-items: center;
    .text{
      display: block;
      width: auto;
      font-size: 24px;
      font-weight: lighter;
    }
    .arrow{
      display: block;
      width: 40px;
      height: 40px;
      background: url('~@lib/base/img/tv_btn_xiala.png');
      background-size: 100% 100%;
    }
    &.active i {
      transform: rotate(0deg);
    }
  }
  .row {
    overflow: hidden;
    height: auto;
    display: flex;
    width: 100%;
  }
  dt {
    width: 178px;
    display: -webkit-box;
    -webkit-box-orient: horizontal;
  }
  dd {
    width: 100%;
    overflow-x: auto;
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .row a {
    height: 56px;
    line-height: 56px;
    display: block;
    // margin-right: 24px;
    margin-bottom: 24px;
    color: #7f8082;
    height: 56px;
    line-height: 56px;
    white-space: nowrap;
    padding: 0 24px;
    font-weight: lighter;
    &.active {
      color: #000000;
      background: rgba(0,0,0,.05);
      border-radius: 2px;
      height:60px;
      padding:0 24px;
    }
  }
}
.list-m60 {
  margin: 0 40px;
}
.vlist {
  padding-top: 10PX;
  display: flex;
  flex-wrap: wrap;
  // align-content: space-between;
}
// .video-list{
//   background: url("../../../../lib/base/tv/assets/icn_blurry_bg@2x.png");
//   background-size: 100% 100%;
// }
.vitem {
  width: 210px;
  // height: 318px;
  margin-right: 20px;
  position: relative;
  &:nth-child(3n){
      margin-right:0; 
    }

  img {
     width: 210px;
  height: 318px;
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
    right: 8px;
    top:0;
    padding: 0 4px;
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
  //   top: 420px;
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
    position: absolute;
    bottom: 76px;
    display: flex;
    justify-content: space-between;
    padding: 0 12px;
    align-items: center;
    background-image: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,.5));
    .text{
      font-family: PingFangSC-Regular;
      font-size: 20px;
      color: #FFFFFF;
      font-weight: lighter;
    }
    .score{
       color: #E1B96E;
    }
    .play{
      width: 36px;
      height: 36px;
      background:  url('~@lib/base/tv/assets/new/tv_btn_play.png');
      background-size:100% 100%; 
  
    }
  }
  .name {
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    // line-height: 2;
    height: 76px;
    text-align: left;
    font-size: 24px;
    font-weight: lighter;
    padding: 12px 0 40px 0;
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
.spinner > div {
  background-color: #13d5dc;
  height: 12px;
  width: 12px;
  border-radius: 100%;
  display: inline-block;
  animation: stretchdelay 1.2s infinite ease-in-out;
}
.spinner .rect2 {
  animation-delay: -1.1s;
}
.spinner .rect3 {
  animation-delay: -1s;
}
.spinner .rect4 {
  animation-delay: -0.9s;
}
.spinner .rect5 {
  animation-delay: -0.8s;
}
.spinner .rect6 {
  animation-delay: -0.7s;
}
.spinner .rect7 {
  animation-delay: -0.6s;
}
.spinner .rect8 {
  animation-delay: -0.5s;
}
@keyframes stretchdelay {
  0%,
  40%,
  100% {
    transform: scale(0.5);
  }
  20% {
    transform: scale(1);
  }
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

@media (min-device-width: 414px) {
  .list-m60 {
    margin: 0 17px;
  }
  .vitem {
    width: 216px;
    margin: 0 11px;
    img {
      width: 216px;
      height: 317px;
    }
    .score {
      top: 270px;
    }
  }
}
</style>

<script>
import * as service from "../service"
import _ from "../util"
import { mapState, mapGetters } from 'vuex'

export default {
  data() {
    return {
      device_uuid: window.device_uuid || '',
      isShowBar: this.$route.query.showBar == 1,

      title: decodeURIComponent(this.$route.query.channel),
      channelId: this.$route.query.channelId,
      vid: "",
      //列表数据
      list: [],
      //分类
      category: [],
      //地区
      region: [],
      //年份
      year: [],
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
      current_orderby: "year",
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
      isFirstLoad: true,
      filterVisible: true,
      time:null
      //filterToggleClicked: false
    }
  },
  computed: {
    ...mapState(['status_bar_height', 'navigation_bar_height']),
    ...mapGetters(['isStatusBarShow']),
  },
  watch: {
    //如果首次加载，则调用app loading
    loadState(val) {
      if (this.isFirstLoad) {
        if (val === "LOADING") {
          HdSmart.UI.showLoading()
        } else if (val === "LOADED") {
          HdSmart.UI.hideLoading()
        }
      }
    }
  },
  mounted() {
    this.init()

        setTimeout(()=>{
            window.scrollTo(0,1)
        },300)
           
        let topbar = document.querySelector('.topbar2')
        // console.log(topbar)
        
        this.$refs.filters.style.top = topbar.offsetHeight +"px"
        service.RemoteController({ 'show': true })
        this.onPageInit()
        this.$Lazyload.$on("error", function({ el, src, loading }) {
          el.src = el.dataset.src1
          el.onerror = function() {
            el.src = loading
            el.onerror = null
          }
        })
  },
  destroyed() {
    console.log('destroy')
    window.removeEventListener("scroll", this.loadMore)
    removeEventListener("scroll", this.scrollfn)
  },
  activated(){  
      this.init()
      console.log('activated')
      
  },
  deactivated(){
    window.removeEventListener("scroll", this.loadMore)
    removeEventListener("scroll", this.scrollfn)
  },
 
  //在页面离开时记录滚动位置
  beforeRouteLeave(to, from, next) {
    console.log('离开了')
    this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    console.log(to,from,next)
    if(to.name==='detail'){
      if(!from.meta.keepAlive){
          from.meta.keepAlive=true//当我们进入到detail时开启list的缓存
      }
      next()
    }else{
          from.meta.keepAlive=false
          this.scrollTop = 0
          // this.$destroy()//销毁B的实例
          next()//当我们前进的不是detail时我们让list页面刷新
    }
    next()
  },
  //进入该页面时，用之前保存的滚动位置赋值
  beforeRouteEnter(to, from, next) {
    console.log('进入了')

    next(vm => {
      console.log(vm.scrollTop,'vm.scrollTop')
      
      document.body.scrollTop = vm.scrollTop
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
    init(){

        window.addEventListener("scroll", this.loadMore)
        addEventListener("scroll", this.scrollfn)
        // filters
    },
    scrollfn(){
         var scrollTop =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop
      // if(this.a - scrollTop<130&&this.a - scrollTop>-130) return
      // this.a = scrollTop
      let topbar_fixed = document.querySelector('.topbar-fixed')
      if(scrollTop>=10){
        this.$refs.filters.style.position = 'fixed'
        this.$refs.filters.style.background = '#fff'
        topbar_fixed.style.background = '#fff'
        this.filterVisible = false
      }else{
        this.filterVisible = true
         this.$refs.filters.style.background = ''
        topbar_fixed.style.background = ''
      }
    },
    toggleFilter() {
      let topbar_fixed = document.querySelector('.topbar-fixed')

       if(!this.filterVisible){
        this.$refs.filters.style.background = '#fff'
        topbar_fixed.style.background = '#fff'
      }else{
         this.$refs.filters.style.background = ''
        topbar_fixed.style.background = ''
      }
      this.filterVisible = !this.filterVisible
      window.removeEventListener("scroll", this.loadMore)
      removeEventListener("scroll", this.scrollfn)
      clearTimeout(this.time)
      this.time = setTimeout(()=>{
        window.addEventListener("scroll", this.loadMore)
        addEventListener("scroll", this.scrollfn)
      },300)
      console.log(this.time)
     

      // var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
      // scrollTop += this.filterVisible ? 132 : -132
      // window.scrollTo(0, scrollTop)
    },
    //参数筛选
    setParam(key, value) {
      this[key] = value
      this.filterData(1)
    },
    filterData(page) {
      if (page === 1) this.isFirstLoad = true
      console.log(this.pageSize,'----------------------------------------------')
      
      this.loadState = "LOADING"
      service.searchData(
        {
          channelId: this.channelId,
          category: this.current_category,
          region: this.current_region,
          year: this.current_year,
          cateId: this.current_category,
          regionId: this.current_region,
          orderby: this.current_orderby,
          pageSize: this.pageSize,
          pageNo: page
        },
        (err, data) => {
          this.loadState = "LOADED"
          if (err) return

          if (data.data) {
            data = data.data
          }
          if (data.list == "") {
            data.list = []
          }
          this.$nextTick(() => {
            this.list = Object.freeze(
              (page === 1 ? [] : this.list).concat(data.list)
            )
            this.total = data.total
            this.pageNo = page
            if (this.isFirstLoad) {
              this.isFirstLoad = false
              window.scrollTo(0, 0)
            }
            if (this.total === 0) {
              //没有数据
              this.loadState = "NO_DATA"
            } else if (this.pageSize * this.pageNo >= this.total) {
              //加载完全部
              this.loadState = "NO_MORE"
              //HdSmart.UI.toast('已加载全部')
            }
          })
        }
      )
    },
    loadMore: _.debounce(function() {
      var scrollTop =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop
  
      if ( scrollTop > 0 && scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 15) {
        // if (this.$store.state.detailVisible) {
        //   return
        // }
        if ( this.loadState === "LOADING" || this.loadState === "NO_DATA") { return }
        if (this.loadState === "NO_MORE") {
          HdSmart.UI.toast("已加载全部")
          return
        }
        this.filterData(this.pageNo + 1)
      }
    }, 300),
    showDetailInfo(item) {
      this.$store.dispatch("showDetail", item)
      // window.location.href = `index.html#/detail?channelId=${item.channelId}&vid=${item.vid}&ispay=${item.ispay}`

      this.$router.push({
         path:"/detail",
         query:{
           channelId:item.channelId,
           vid:item.vid,
           ispay:item.ispay,
           showBar:1
         }
       })
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
    //换成小图地址
    getThumbPic(pic) {
      return pic.replace(".jpg", "_y.jpg")
    },
    reload() {
      if (this.error) {
        service.RemoteController({ 'show': true })
        this.error = false
        this.onPageInit()
      }
    },
    onPageInit() {
      this.loadState = "LOADING"
      service.getChannelData({channelId:this.channelId,pageSize:21}, (err, data) => {
        this.loadState = "LOADED"
        if (err) {
          service.RemoteController({ 'show': false })
          this.error = true
          return
        }
        this.category = Object.freeze(data.category)
        this.region = Object.freeze(data.region)
        this.year = Object.freeze(data.year)
        this.list = Object.freeze(data.data.list)
        this.total = data.data.total
        this.$nextTick(() => {
          this.isFirstLoad = false
        })
      })
    },
    goBack(){
      if(this.isShowBar){
        window.history.go(-1)
      } else {
        service.RemoteController({ show: false })
        HdSmart.UI.popWindow()
      }
    }
  }
}
</script>
