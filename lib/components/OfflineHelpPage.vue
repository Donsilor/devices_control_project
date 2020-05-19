<template>
  <!-- 离线帮助移入移出动画，先注释保留 -->
  <!-- <div
    ref="page"
    :class="['OfflineHelpPage',{'moveIn':moveIn},{'moveOut':moveOut}]"> -->
  <div
    ref="page"
    :class="['OfflineHelpPage', {'moveOut':moveOut}]">
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
      <!-- <h3
        v-if="networkStatus=='-2'"
        class="viewHelpH3">路由器离线</h3> -->
      <h3
        class="viewHelpH3">设备离线</h3>
      <!-- <div
        v-if="networkStatus=='-2'"
        class="viewHelpstatus"
        v-html="viewHelpstatus.router_content"/> -->
      <div
        class="viewHelpstatus"
        v-html="viewHelpstatus.content"/>
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
      navigation_bar_height:44,
      moveOut:false,
      moveIn:true
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
      this.getViewHelpInfo()
      .then((res)=>{
        let obj = {}
        obj.content = res.content.replace(/\n/g,"<br/>").replace(/(\d+)/g,'<span style="font-weight:normal">$1</span>')
        obj.router_content = res.router_content&&res.router_content.replace(/\n/g,"<br/>").replace(/(\d+)/g,'<span style="font-weight:normal">$1</span>')
        this.setViewHelpInfo(obj)
      })
    })
  },
  methods:{
    ...mapActions(['getDeviceInfo','getNetworkInfo','setNetworkStatus','doControlDevice','getViewHelpInfo','setViewHelpInfo']),

    goBack(){
      // 离线帮助移入移出的动画控制，先注释保留
      this.moveIn = false
      this.moveOut = true
      if(this.$router)  this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="less">
@keyframes moveIn {
    0% {
      left: 100%;
    }

    100% {
      left:0;
    }
}
.moveIn{
   animation: moveIn 0.2s linear;
}


@keyframes moveOut {
    0% {
      left: 0%;
    }

    100% {
      left:100%;
    }
}
.moveOut{
   animation: moveOut linear;
   animation-fill-mode:forwards
}
.OfflineHelpPage {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  // background: url('~@lib/base/img/bg02.png') no-repeat;
  // background-size: 100% 100%;
  background: #000;
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
    position: absolute;
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
  // color: #222a37;
  color: #fff;
  align-items: center;
  .left,
  .right,.right-search {
    // width: 44PX;
    // height: @navigation_bar_height;
   width: 60px;
    height: 60px;
    p{
        width: 40px;
        height: 40px;

    }

  }
  .left{
    // display: flex;
    // justify-content: flex-start;
    // align-items: center;
    position: absolute;
    left: 40px;
    p{
        background: url('../base/img/arrow_back.png');
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
  line-height: 1.5em;
  font-weight: lighter;
  color: rgba(255, 255, 255, .5);
}
  .title {
    text-align: center;
    font-size: 17PX;
    width: 100%;
  }
  .viewHelpH3{
  padding: 20px 40px;
  font-size: 16PX;
  color: #fff;
  }
</style>
