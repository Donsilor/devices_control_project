<template>
  <div 
    ref="page" 
    class="Allocation">
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
            class="title">按键配置</div>
    
    

        </div>
      
      </div>
      
    </div>
    <div class="viewHelpstatus">
      <div class="Prefabrication">
        <h3 class="AllocationH3">页面预制配置</h3>
        <ul class="PrefabricationUl">
          <li>
            <p>开灯</p>
            <p>打开面板面板所在房间的全部灯</p>
          </li>
          <li>
            <p>关灯</p>
            <p>关闭面板面板所在房间的全部灯</p>
          </li>
          <li>
            <p>打开全部</p>
            <p>打开面板面板所在房间的全部设备</p>
          </li>
          <li>
            <p>关闭全部</p>
            <p>关闭面板面板所在房间的全部设备</p>
          </li>
        </ul>
      </div>
    </div>


    <div class="viewHelpstatus">
      <div class="Prefabrication">
        <h3 class="AllocationH3">页面预制配置</h3>
        <ul class="PrefabricationUl">
          <li>
            <p>开灯</p>
            <p>打开面板面板所在房间的全部灯</p>
          </li>
          <li>
            <p>关灯</p>
            <p>关闭面板面板所在房间的全部灯</p>
          </li>
          <li>
            <p>打开全部</p>
            <p>打开面板面板所在房间的全部设备</p>
          </li>
          <li>
            <p>关闭全部</p>
            <p>关闭面板面板所在房间的全部设备</p>
          </li>
        </ul>
      </div>
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
      
    })
  },
  methods:{
    ...mapActions(['getDeviceInfo','getNetworkInfo','setNetworkStatus','doControlDevice','getViewHelpInfo','setViewHelpInfo']),

    goBack(){
      this.$router.go(-1)
      // this.moveIn = false
      // this.moveOut = true
    }
  }
}
</script>

<style scoped lang="less">
.Allocation {
  width: 100%;
  height: 100vh;
  &::before{
    content: "";
    width: 100%;
    background: url('~@lib/base/img/bg02.png') no-repeat;
    background-repeat:no-repeat;
    background-size: 100% 100%;
    position: fixed;
    top:0;
    left: 0; 
    right: 0;
    bottom: 0;
    z-index: -1;
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
        background: url('~@lib/base/img/tv_arrow_back.png');
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
.title {
  text-align: center;
  font-size: 17PX;
  width: 100%;
}
.Allocationstatus{
  font-size: 28px;
  padding: 0 40px;
  line-height: 1.5em;

  // font-weight: lighter;
  color: rgba(0, 0, 0, .5);
  
}

  .AllocationH3{
  padding: 12px 40px 24px;
  font-size: 32px;
  font-family: PingFangSC-Regular;

color: #000000;
// margin-bottom:12px;

  }
  .PrefabricationUl{
    padding: 0 40px 28px;
    font-size: 32px;
    li{
      height: 156px;
      background:rgba(255, 255, 255, .5);
      margin-bottom: 12px;
      padding-left: 40px;
      p{
          font-family: PingFangSC-Regular;
          color: #000000;


        &:nth-child(1){
          font-size: 32px;
          padding: 40px 0 12px 0;
        }
        &:nth-child(2){
          font-size: 24px;
        }
      }
    }
  }
}
</style>
