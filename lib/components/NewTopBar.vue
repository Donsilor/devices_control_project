<template>
  <div
    :class="[{'topbar-nobg':transparent}, {'topbar-black': bgBlack}]"
    class="topbar">
    <div
      :style="{ 'background': bgColor }" 
      class="topbar-block" />
    <div
      :style="{ background: bgColor }"
      :class="['topbar-fixed', className]">

      <div
        :style="{height:status_bar_height+'px','background':'#fff'}"
        class="statusbar" />
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
          v-show="rightSearch" 
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
          class="title">{{ title }}</div>
        <div
          v-if="shutdown"
          ref="shutdown"
          class="header-bottom-right"
          @click="shutdownCallback"/>
          
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
      type: String,
      default: ''
    },
    scroll:{
       type: Boolean,
      default: false
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
      this.$nextTick(()=>{
          let topbar_fixed = document.querySelectorAll('.topbar-fixed')[0]
          let status_bar_fixed = document.querySelectorAll('.status_bar_fixed')[0]  
          let search_screen_bg = document.querySelectorAll('.search-screen-bg')[0]
          if(status_bar_fixed&&topbar_fixed&&search_screen_bg){
            status_bar_fixed.style.top = topbar_fixed.offsetHeight + 'px'
            search_screen_bg.style.marginTop = status_bar_fixed.offsetHeight + 'px'
          }
      })
     
     
    if(this.scroll){
       addEventListener('scroll',this.scrollfn)
    }
    
   
  },
  destroyed(){
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
      let status = document.querySelectorAll('.status')[0]  
      let statusbar = document.querySelectorAll('.statusbar')[0]   
      let newNavbar = document.querySelectorAll('.newNavbar')[0]   
      let status_bar_fixed = document.querySelectorAll('.status_bar_fixed')[0]   
      let search_screen = document.querySelectorAll('.search-screen')[0]   
      // let statusTop = status.offsetTop-  this.scrollTop
      let topbar_fixed = document.querySelectorAll('.topbar-fixed')[0]   
      // let w = this.$refs['header-bottom'].offsetWidth/2-this.$refs.title.offsetWidth/2    如果标题要居中
      // console.log(statusTop,'statusTop')
      //  console.log(status.offsetTop,'status.offsetTop')
      //   console.log( this.scrollTop,' this.scrollTop')
      if(status&& status_bar_fixed){
        if(this.scrollTop>=100){
            status_bar_fixed.style.top = statusbar.offsetHeight+newNavbar.offsetHeight +"px"

        }else{
            status_bar_fixed.style.top = topbar_fixed.offsetHeight + 'px'
        }
      } 
      let h = this.$refs['header-bottom'].offsetHeight
      let b = (h/100)*this.scrollTop
      let l = (44/100)*this.scrollTop
      let f = (-6/100)*this.scrollTop+24
      b = b>=h?h:b
      l = l>=44?44:l
      f = f<=18?18:f
      this.$refs.title.style.bottom = b + 'px'
      this.$refs.title.style.left = l + 'px'
       this.$refs.title.style.fontSize = f + 'px'
      if( this.scrollTop>=90){
        this.$refs.shutdown.style.display='none'  
        this.$refs.newNavbar.style.background='#fff'  
        this.rightSearch = true
        search_screen.style.visibility='hidden'    
      }else{
        this.$refs.shutdown.style.display='block'  
        this.$refs.newNavbar.style.background=''  
        this.rightSearch = false
        search_screen.style.visibility=''
      }

    }
  }
}
</script>


<style lang="less">
/* topbar */
@status_bar_height: 25PX;
@navigation_bar_height: 44PX;
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
    background: #fff;
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
.header-bottom{
  display: flex;
  justify-content: space-between;
  margin: 0 40px;
  align-items: center;
 .title {
   position: relative;
    text-align: center;
    font-size: 17PX;
    font-family: PingFangSC-Medium;
    font-size: 48px;
    color: #000000;
    font-weight: 600
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
        width: 50px;
        height: 50px;

    }

  }
  .left{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    p{
        background: url('../base/img/tv_btn_close.png');
        background-size: 100% 100%;

    }
  }
  .right{
      display: flex;
      justify-content: center;
      align-items: center;
    p{
      background: url('../base/img/tv_btn_setting.png');
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

    display: inline-block;
    width: 36PX;
    height: 36PX;
    background: url('~@lib/base/assets/yikai.png');
    background-size: 100% 100%;
  }
.opcity-0 {
  background-color: rgba(255, 255, 255, 0) !important;
}
.opcity-20 {
  background-color: rgba(255, 255, 255, 0.2) !important;
}
.opcity-40 {
  background-color: rgba(255, 255, 255, 0.4) !important;
}
.opcity-60 {
  background-color: rgba(255, 255, 255, 0.6) !important;
}
.opcity-80 {
  background-color: rgba(255, 255, 255, 0.8) !important;
}
//  .topbar-fixed {
//       z-index: 1;
//       position: absolute;
//       top: 0;
//       left:0;
//       overflow: hidden;
//     &::before{
//       background-color: rgba(255, 255, 255,0.8);
//       content: '';
//       position: absolute;
//       top: 0;
//       bottom: 0;
//       left: 0;
//       right: 0;
//       z-index: -1;
//       background: url('../base/oakes_air_condition/assets/bg_01.png') 0 / cover fixed;
//       filter: blur(60px);
//       margin: -30px;
//     }
//  }
</style>
