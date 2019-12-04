<template>
  <div
    ref="topbar"
    :class="[{'topbar-nobg':transparent}, {'topbar-black': bgBlack}]"
    class="topbar">
    <div
      :style="{ 'background': bgColor ,height:status_bar_height+navigation_bar_height*2+'px', 'line-height': status_bar_height+navigation_bar_height*2 + 'px'}"
      class="topbar-block" />
    <div
      :style="{ background: bgColor }"
      :class="['topbar-fixed', className]">

      <div
        ref="statusbar"
        :style="{height:status_bar_height+'px'}"
        class="statusbar" />
      <!-- <div 
        ref="statusbarBg"
        :style="{height:status_bar_height+navigation_bar_height+'px'}"
        class="statusbarBg"/> -->
      <div
        ref="newNavbar"
        :style="{height:navigation_bar_height+'px', 'line-height': navigation_bar_height + 'px'}"
        class="newNavbar">
        <div
          class="left"
          @click.prevent="goBack">
          <p/>
          <!-- <a
            :style="{ 'border-color': bakColor }"
            href="javascript:void(0);"
            class="icon-return" /> -->
        </div>
        <div
          v-if="showRight&&!rightSearch"
          class="right"
          @click.prevent="goDetail">
          <p/>
          <!-- <template v-if="buttons">
            <a
              v-for="(item, index) in buttons"
              :key="index"
              :class="[item.className]"
              href="javascript:void(0);"
              @click.prevent="item.callback" />
          </template>
          <template v-else>
            <a
              :style="{ 'color': bakColor }"
              :class="[{'icon-more':black},{'icon-more1':white},'center']"
              href="javascript:void(0);"
              @click.prevent="goDetail" />
          </template> -->
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
      default: 'transparent'
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
      rightSearch:false
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
      console.log('goBack')
      if (typeof this.onBack === 'function') {
        console.log('goBack123123')
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
      this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      let pageClass
      if(this.pageClass){
        pageClass = document.querySelector(this.pageClass)
      }else{
        pageClass = this.$refs.topbar
      }
      let fixedTop =  this.$refs.statusbar.offsetHeight+this.$refs.newNavbar.offsetHeight
      let status_bar_fixed = document.querySelectorAll('.status_bar_fixed')[0]
      let h = this.$refs['header-bottom'].offsetHeight
      let b = this.scrollTop
      let f = (-6/44)*this.scrollTop+24
      let w = this.$refs['header-bottom'].offsetWidth/2-this.$refs.title.offsetWidth/2   //如果标题要居中
      let l = (w/44)*this.scrollTop
      b = b>=h?h:b
      // w2 =  this.scrollTop *24/44+20

      f = f<=18?18:f
      l = l<=w?l :w
      this.$refs.title.style.bottom = b + 'px'
      this.$refs.title.style.left = l + 'px'
      this.$refs.title.style.fontSize = f + 'px'
      if( this.scrollTop>=h ){
        pageClass.classList.add('scroll44')
        status_bar_fixed&&(status_bar_fixed.style.top  =fixedTop +"px")
        this.search&&(this.rightSearch = true)
      }else{
        pageClass.classList.remove('scroll44')
        this.search&&(this.rightSearch = false)
      }
    }
  }
}
</script>


<style lang="less">
.scroll44{
  .status_bar_fixed{
    position: fixed
  }
  .header-bottom-right{
    display: none
  }
.newNavbar,.statusbar{
    background: #fff
}
// .topbar-fixed{
//   &::before{
//     width: 100%;
//     height: 100%;
//     background: rgba(225, 225, 225, 0.6);
//     background: red;
//     filter: blur(20px);
//     position: absolute;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     content: '';
//   }
// }
  .search-screen-bg{
    visibility:hidden
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
    // background: #fff;
    border:0;
    // border-bottom: 1px solid rgba(216, 216, 216, 0.7);
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
// .statusbarBg{
//   height: @status_bar_height+@navigation_bar_height;
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   background: #fff;
//   -webkit-filter: blur(20px);
//   filter: blur(20px);
// }
.header-bottom{
  display: flex;
  justify-content: space-between;
  margin: 0 40px;
  align-items: center;
 .title {
   position: relative;
    text-align: center;
    // font-size: 17PX;
    // font-family: PingFangSC-Medium;
    font-size: 46px;
    color: #000000;
    // font-weight: bold;
    // line-height: 48px;
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
    // width: 44PX;
    // height: @navigation_bar_height;
   width: 72px;
    height: 72px;
    p{
        width: 48px;
        height: 48px;

    }

  }
  .left{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    p{
        background: url('../base/img/btn_ac_close@2x.png');
        background-size: 100% 100%;

    }
  }
  .right{
      display: flex;
      justify-content: center;
      align-items: center;
    p{
      background: url('../base/img/btn_ac_seting@2x.png');
        background-size: 100% 100%;

    }

  }
  .right-search{
      display: flex;
      justify-content: flex-end;
      align-items: center;
    p{

       background: url('../base/img/tv_btn_search.png');
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
    // position: absolute;
    // top: 50%;
    display: inline-block;
    width: 24PX;
    height: 24PX;
    border: 0;
    background: url('~@lib/base/assets/cha.png');
    background-size: 100% 100%;

    // border: solid #000;
    // border-width: 2PX 2PX 0 0;
    // transform: translate(0, -50%) rotate(225deg);
  }

}
.header-bottom-right{

    display: flex;
    width: 36PX;
    height: 36PX;
   justify-content: center;
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
