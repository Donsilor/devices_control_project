<template>
  <div
    ref="topbar"
    :class="[{'topbar-nobg':transparent}, {'topbar-black': bgBlack}]"
    class="topbar">
    <div
      :style="{ 'background': bgColor,height:'auto'}"
      class="topbar-block" >
      <div
        :style="{height:status_bar_height+'px'}" />
      <div
        :style="{height:navigation_bar_height+'px', 'line-height': navigation_bar_height + 'px'}"/>
      <div
        :style="{height:navigation_bar_height+'px', 'line-height': navigation_bar_height + 'px'}"/>
    </div>

    <!-- 定位头部，不占位 -->
    <div
      :class="['topbar-fixed', className]">
      <div
        ref="statusbar"
        :style="{height:status_bar_height+'px'}"
        class="statusbar" />
      <div
        ref="newNavbar"
        :style="{height:navigation_bar_height+'px', 'line-height': navigation_bar_height + 'px'}"
        class="newNavbar">
        <div
          class="left"
          @click.prevent="goBack">
          <p
            v-if="returnBack"
            class="close"/>
          <p
            v-if="!returnBack"
            class="back"/>
        </div>
        <div
          v-if="showRight&&!rightSearch"
          class="right"
          @click.prevent="goDetail">
          <p/>
        </div>
        <div
          v-show="rightSearch&&search"
          class="right-search"
          @click="$router.push('/search')">
          <p/>
        </div>

      </div>
      <div
        ref="header-bottom"
        :style="{height:navigation_bar_height+'px', 'line-height': navigation_bar_height + 'px'}"
        class="header-bottom">
        <div
          ref="title"
          :style="{ 'color': bakColor }"
          class="title"> {{ room && room+'&nbsp;|&nbsp;' }}{{ title }}</div>
        <button
          v-if="shutdown"
          ref="shutdown"
          :class="['header-bottom-right', styleName]"
          :disabled="(styleName && Object.keys(styleName).indexOf('no-work') > -1) ? true : false"
          @click="shutdownCallback">
          <p
            v-if="!switchimg"
            class="header-bottom-right-p"/>
          <p
            v-if="switchimg=='tv'"
            class="header-bottom-right-tvimg"/>
        </button>
        <!-- <slot /> -->
      </div>

    </div>

  </div>
</template>


<script>

let dpr = /iPad|iPhone|iPod/.test(navigator.userAgent) ? 1 : window.devicePixelRatio
import { mapGetters } from 'vuex'

export default {
  props: {
    shutdown:{
      type: Boolean,
      default: false
    },
    onBack: {
      type: Function,
      default: null
    },
    returnBack:{
      type: Boolean,
      default: true
    },
    showRight:{
      type: Boolean,
      default: true
    },
    buttons: {
      type: Array,
      default: function() {
        return null
      }
    },
    transparent: {
      type: Boolean,
      default: false
    },
    black: {
      type: Boolean,
      default: true
    },
    white: {
      type: Boolean,
      default: false
    },
    bgBlack: {
      type: Boolean,
      default: false
    },
    bgColor: {
      type: String,
      default: '#000'
    },
    bakColor: {
      type: String,
      default: '#fff'
    },
    title: {
      type: String,
      default: ''
    },
    className: {
      type: '',
      default: ''
    },
    styleName: {
      type: Object,
      default: function() {
        return null
      }
    },
    scroll:{
       type: Boolean,
      default: false
    },
    search:{
      type: Boolean,
      default: false
    },
    pageClass:{
      type: String,
      default: ''
    },
    room:{
      type:String,
      default:''
    },
    switchimg:{
      type:String,
      default:''
    }
  },
  data() {
    return {
      status_bar_height: 25,
      navigation_bar_height: 44,
      scrollTop:0,
      clientHeight:0,
      scrollHeight:0,
      rightSearch:false
    }
  },
  computed:{
    ...mapGetters(['isOffline']),
  },
  created() {
    HdSmart.ready(() => {
      if (window.status_bar_height) {
        this.status_bar_height = window.status_bar_height / dpr
      }
      // if (window.navigation_bar_height) {
      //   this.navigation_bar_height = window.navigation_bar_height / dpr
      // }
    })
  },
  mounted(){
    if(this.scroll){
       addEventListener('scroll',this.scrollfn)
    }
  },
  destroyed(){
    removeEventListener('scroll',this.scrollfn)
  },
  activated(){
    if(this.scroll){
       addEventListener('scroll',this.scrollfn)
    }
  },
  deactivated(){
      removeEventListener('scroll',this.scrollfn)
  },

  methods: {
    goBack() {
      if (typeof this.onBack === 'function') {
        this.onBack()
      } else if (argv_is_mock) {
        let t = new Date().getTime()
        let url = ''
        if (process.env.NODE_ENV == 'development') {
          return
        } else {
          url = `/scattered-pages-in-app/dist/experience.html?_=${t}`
        }
        window.location.replace(url)
      } else {
        HdSmart.UI.popWindow()
      }
    },
    goDetail() {
      HdSmart.UI.goDeviceDetail()
    },
    shutdownCallback(){
      this.$emit("shutdownCallback")
    },

    scrollfn(){
      if(this. isOffline) return
      let _this = this
      this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      this.clientHeight = document.documentElement.clientHeight || document.body.clientHeight
      this.scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      let pageClass
      if(this.pageClass){
        pageClass = document.querySelector(this.pageClass)
      }else{
        pageClass = this.$refs.topbar
      }
      let titleDom = this.$refs.title
      let fixedTop =  this.$refs.statusbar.offsetHeight+this.$refs.newNavbar.offsetHeight
      let status_bar_fixed = document.querySelectorAll('.status_bar_fixed')[0]
      let headerBottomHeight = this.$refs['header-bottom'].offsetHeight
      let headerBottom = (headerBottomHeight/44)*this.scrollTop
      let fontSize = (-6/44)*this.scrollTop+24
      let headerBottomCenter = this.$refs['header-bottom'].offsetWidth/2-titleDom.offsetWidth/2-(this.$refs['header-bottom'].offsetWidth/375*20)  //
      let titleLeft = (headerBottomCenter/44)*this.scrollTop
      let titleMaxWidth = (-19/44)*this.scrollTop+281
      headerBottom = headerBottom>=headerBottomHeight?headerBottomHeight:headerBottom
      // titleMaxWidth =  this.scrollTop *24/44+20
      fontSize = fontSize<=18?18:fontSize
      titleLeft = titleLeft<=headerBottomCenter?titleLeft :headerBottomCenter
      titleMaxWidth = titleMaxWidth<=262?262 :titleMaxWidth
      titleDom.style.bottom = headerBottom + 'px'
      titleDom.style.left = titleLeft + 'px'
      titleDom.style.fontSize = fontSize/37.5 + 'rem'
      titleDom.style.maxWidth = titleMaxWidth/37.5 + 'rem'
      _this.$emit('hscroll', headerBottomHeight)
      _this.$emit('hscrolltop', _this.scrollTop)
      if( this.scrollTop>=headerBottomHeight ){
        pageClass.classList.add('scroll44')
        status_bar_fixed&&(status_bar_fixed.style.top  =fixedTop +"px")
        this.search&&(this.rightSearch = true)
      }else{
        pageClass.classList.remove('scroll44')
        this.search&&(this.rightSearch = false)
      }
       if((this.clientHeight+this.scrollTop == this.scrollHeight)&&this.switchimg!="tv"){
        titleDom.style.bottom = (headerBottomHeight/44)*headerBottomHeight+ 'px'
        titleDom.style.left = ((headerBottomCenter/44)*headerBottomHeight) + 'px'
        titleDom.style.fontSize = ((-6/44)*headerBottomHeight+24)/37.5 + 'rem'
        pageClass.classList.add('scroll44')
      }
    }
  }
}
</script>


<style lang="less">
*{ -webkit-tap-highlight-color:transparent; }
.scroll44{
  .status_bar_fixed{
    position: fixed
  }
  .header-bottom-right{
    display: none
  }
.newNavbar,.statusbar{
}
  .search-screen-bg{
    // display:none
    visibility: hidden;
  }
}






/* topbar */
@status_bar_height: 25PX;
@navigation_bar_height: 44PX;
.no-work{
  opacity: 0.3;
  position: relative;
}
.topbar{
  position: relative;
  z-index: 9999;
  .icon-search{
    &::before{
      font-size: 20PX;
      position: relative;
      bottom: 14px;
    }
}
  .topbar-block {
    height: @status_bar_height+@navigation_bar_height*2;
  }
  .topbar-fixed {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    width: 100%;
    border:0;
    background-color: rgba(0,0,0,0.7);
    backdrop-filter: blur(15px);
  }
}
.topbar-nobg {
  .topbar-fixed {
    background: transparent;
    border-bottom: none;
  }
  .navbar {
    color: #fff;
    .left a,
    .right a {
      color: #fff;
    }
  }
}

.topbar-black {
  .topbar-fixed {
    // background: #20282b;
    background: #35353d;
    border-bottom: none;
  }
  .navbar {
    color: #fff;
    .left a,
    .right a {
      color: #fff;
    }
  }
}

.statusbar {
  height: @status_bar_height;
}
.header-bottom{
  display: flex;
  justify-content: space-between;
  padding: 0 40px;
  align-items: center;
 .title {
    position: relative;
    text-align: center;
    max-width: 562px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 48px;
    color: #000000;
  }
}

.newNavbar {
  display: flex;
  padding: 0 40px;
  justify-content: space-between;
  height: @navigation_bar_height;
  position: relative;
  color: #222a37;
  align-items: center;
  .left,
  .right,.right-search {
   width: 60px;
        height: 60px;
        border-radius: 50%;
        background: rgba(225, 225, 225, .1);
    p{
        width: 48px;
        height: 48px;

    }

  }
  .left{
    display: flex;
    justify-content: center;
    align-items: center;
    .close{
        background: url('../base/img/kt_btn_close.png');
        background-size: 100% 100%;
    }
    .back{
        background: url('../base/img/arrow_back.png');
        background-size: 100% 100%;
    }
  }
  .right{
      display: flex;
      justify-content: center;
      align-items: center;
    p{
      background: url('../base/img/kt_btn_setting.png');
        background-size: 100% 100%;

    }

  }
  .right-search{
      display: flex;
      justify-content: flex-end;
      align-items: center;
    p{
       background: url('../base/tv/assets/new/kt_icn_search.png');
        background-size: 100% 100%;
    }
  }


  .left a,
  .right a {
    width: @navigation_bar_height;
    height: @navigation_bar_height;
    display: block;
    line-height: @navigation_bar_height;
    color: #222a37;
    text-align: center;
    font-size: 17PX;
    text-decoration: none;
    &:active {
      opacity: 0.8;
    }
  }
  .left a.icon-return {
    position: absolute;
    top: 55%;
    margin-left:8px;
    margin-bottom:4px;
    display: inline-block;
    width: 12PX;
    height: 12PX;
    border: solid #000;
    border-width: 1PX 1PX 0 0;
    transform: translate(0, -50%) rotate(225deg);
  }
}
.header-bottom-right{

    display: flex;
    width: 36PX;
    height: 36PX;
   justify-content: flex-end;
   align-items: center;
    border: transparent;
   background: transparent;
  outline: none;
    .header-bottom-right-p{
       background: url('~@lib/base/img/btn_ac_open@2x.png');
        background-size: 100% 100%;
        width: 24PX;
        height: 24PX;
    }
    .header-bottom-right-tvimg{
      background: url('~@lib/base/tv/assets/new/tv_btn_close01.png');
        background-size: 100% 100%;
        width: 24PX;
        height: 24PX;
    }
  }


</style>
