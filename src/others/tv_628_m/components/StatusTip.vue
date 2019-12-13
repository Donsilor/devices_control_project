<template>
  <div
    v-if="visible"
    class="status_bar">
    <!-- <div class="status_bar_block"/> -->
    <div
      ref="status_bar_fixed"
      class="status_bar_fixed">
      <div
        v-if="spVisible"
        class="sp_status_bar"
        @click="goToScreenProjectionPage">
        <i class="icon-tv1"/>正在投屏 {{ spStatusText }}：
        <span class="text">{{ tvStatus.screenProjectTitle }}</span>
        <i class="icon-arrow"/>
      </div>
      <div>
        <div
          v-if="tvStatus.tvOnlineStatus==0" 
          class="offline_bar">
          <div class="offline_bar_div">
            <p class="offline_bar_p">
              <i 
                class="synchronization rotate"/>
            </p>
            <span class="link">状态同步中,&nbsp;&nbsp;请稍后...</span> 

          </div>
        </div>
        <div
          v-if="tvStatus.tvOnlineStatus==-1" 
          class="offline_bar offline_bar_wifi"
          @click="goToOfflineHelpPage">
          <div class="offline_bar_div">
            <p class="offline_bar_p">
              <i class="wifi"/>
            </p>
            <span class="link">当前网络不可用</span> 

          </div>
        </div>
        <div
          v-if="tvStatus.tvOnlineStatus==-2"
          class="offline_bar"
          @click="goToOfflineHelpPage">
          <div class="offline_bar_div">
            <p class="offline_bar_p">
              <i class="error"/>
            </p>
            <span class="link">路由器已离线,查看帮助</span>
          </div>
          <i class="arrow"/>
        </div>
        <div
          v-if="tvStatus.tvOnlineStatus==-3||tvStatus.tvOnlineStatus==2"      
          class="offline_bar"
          @click="goToOfflineHelpPage">
          <div class="offline_bar_div">
            <p class="offline_bar_p">
              <i class="error"/>
            </p>
           
            <span class="link">设备已离线,查看帮助</span>
          </div>
          <i class="arrow"/>
        </div>
      </div>
    </div>
    <!-- <div
      v-if="tvStatus.tvOnlineStatus < 0 && !ios"
      class="offline_bar_blank"/> -->
  </div>
</template>

<style lang="less" scoped>
@status_bar_height: 25PX;
@navigation_bar_height: 44PX;
// .status_bar_block{
//     height: 0;
// }
.status_bar_fixed{
    // position:fixed;
    left: 0;
    top: 69PX;
    width: 100%;
    z-index: 999;
    /* border-bottom:1px solid rgba(45,45,45,0.20); */
}
.sp_status_bar {
    /* background: #f7f8fa; */
    text-align: center;
    height: 44PX;
    line-height: 44PX;
    font-size: 28px;
    color: #FFC800;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgb(255,255,255);
}
.sp_status_bar .text {
    max-width: 50%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.status_bar {
    // position: absolute;

    width: 100%;
    z-index: 10000;
    top: 0;
    left: 0;
    height: 44PX;
}
.status_bar .link {
    color: #FFC800;
    font-weight: lighter;
}
.status_bar .icon-tv1 {
    display: inline-block;
    margin-right: 20px;
    color: #FFC700;
    font-size: 36px;
}
.status_bar .icon-arrow {
    transform: rotate(90deg);
    display: inline-block;
    font-size: 24px;
    color: #FFC700;
}
.status_bar .icon-wifi {
    display: inline-block;
}

.offline_bar {
    background: rgba(0, 0, 0, .3);
    width: 100%;
    height: 44PX;
    line-height: 44PX;
    text-align: center;
    color: #fff;
    font-size: 28px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20PX;
    .offline_bar_div{
      display: flex;
      justify-content: flex-start;
      align-items: center;
       .link{
        font-family: PingFangSC-Light;
        font-size: 32px;
        color: #FFFFFF;
        letter-spacing: 0;
      }
    }
    .offline_bar_p{
      width: 26PX;
      height: 44PX;
      display: flex;
      justify-content:flex-start;
      align-items: center;
      .wifi{
        width: 40px;
        height: 40px;
        background: url('~@lib/base/tv/assets/new/tv_icn_tips_nowifi@2x.png');
        background-size: 100% 100%;
      }
      .synchronization{
        width: 40px;
        height: 40px;
        background: url('~@lib/base/tv/assets/new/tv_icn_tips_tongbu.png');
        background-size: 100% 100%;
      }
     
    }
    .error{
      width: 20PX;
      height: 20PX;
      background: url('~@lib/base/tv/assets/new/tv_icn_lixian.png');
      background-size: 100% 100%;
    }
    .arrow{
      width: 20PX;
      height: 20PX;
      background: url('~@lib/base/tv/assets/new/tv_arrow_lixian.png');
      background-size: 100% 100%;
    }
}
.offline_bar.offline_bar_wifi{
    justify-content: left;
    i{
      &::before{
        position: relative;
        top: -6px;
      }
    }
}
.offline_bar i {
    display: inline-block;
    margin-right: 10px;
    font-size: 30px;
}
.rotate{
  animation:changDeg 1.5s linear  infinite;

}
@keyframes changDeg{
			0%{
				transform: rotate(0deg);
			}
			100%{
				transform: rotate(360deg);
			}
		}

</style>


<script>
import * as service from "../service"
import {mapState} from 'vuex'
let dpr = /iPad|iPhone|iPod/.test(navigator.userAgent) ? 1 : window.devicePixelRatio

export default {
    props: ["barHeight","type"],
    data() {
        return {
          status_bar_height: 25,
          navigation_bar_height: 44,
          ios: /iPad|iPhone|iPod/.test(navigator.userAgent)
        }
    },
   
    computed: {
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
        ...mapState([ 'isStatusBarShow'])
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
    // mounted() {
    //   console.log(this.type)
    //   if(this.type==='首页'&& this.$refs.status_bar_fixed){
    //     this.$refs.status_bar_fixed.style.position="absolute"
    //     this.$refs.status_bar_fixed.style.top="0"
        
    //   }
    // },
    methods: {
        goToScreenProjectionPage() {
            service.onClickEvent("screenProjectionStatusClick")
        },
        goToOfflineHelpPage() {
            service.onClickEvent("tvOnlineStatusClick", {
                tvOnlineStatus: this.tvStatus.tvOnlineStatus
            })
        }
    },
}
</script>
