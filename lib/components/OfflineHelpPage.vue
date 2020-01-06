<template>
  <div class="page">
    <div
      ref="topbar"
      class="topbar">
      <div
        :style="{ height:status_bar_height+navigation_bar_height+'px', 'line-height': status_bar_height+navigation_bar_height + 'px'}"
        class="topbar-block" />
      <div

        :class="['topbar-fixed']">

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
            class="title">离线帮助</div>
    
    

        </div>
      
      </div>
      <h3 class="viewHelpH3">设备离线</h3>

      <div 
        class="viewHelpstatus" 
        v-html="viewHelpstatus"/>
    </div>
  </div>
 
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'

let dpr = /iPad|iPhone|iPod/.test(navigator.userAgent) ? 1 : window.devicePixelRatio

export default {
  data(){
    return{
      status_bar_height:25,
      navigation_bar_height:44

    }
  },
    computed:{
    ...mapGetters(['isClose', 'isOffline','networkStatus','viewHelpstatus']),
    ...mapState(['device', 'deviceAttrs']),
  },
   created() {
    HdSmart.ready(() => {
      if (window.status_bar_height) {
        this.status_bar_height = window.status_bar_height / dpr
      }
      console.log('获取帮助文字')
      this.getViewHelpInfo()
      .then((res)=>{
        console.log(res.content,'sdsds')

        let str = res.content.replace(/\n/g,"<br/>")
        this.setViewHelpInfo(str)
        
      })
    })
  },

  methods:{
    ...mapActions(['getDeviceInfo','getNetworkInfo','setNetworkStatus','doControlDevice','getViewHelpInfo','setViewHelpInfo']),

    goBack(){
      this.$emit('goBack')
    }
  }
}
</script>

<style scoped lang="less">
.page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('~@lib/base/img/bg02.png') no-repeat;
  background-size: 100% 100%;
}

*{ -webkit-tap-highlight-color:transparent; }

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
    height: @status_bar_height+@navigation_bar_height;
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
    // display: flex;
    // justify-content: flex-start;
    // align-items: center;
    position: absolute;
    left: 40px;
    p{
        background: url('../base/img/btn_ac_close@2x.png');
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
  
}

.viewHelpstatus{
  font-size: 28px;
  padding: 0 40px;
  line-height: 42px;
  font-weight: lighter;
}
  .title {
    text-align: center;
    font-size: 17PX;
    width: 100%;
  }
  .viewHelpH3{
  padding: 20px 40px;
  font-size: 16PX;

  }
</style>
