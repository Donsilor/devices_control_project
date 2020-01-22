<template>
  <div
    v-if="deviceAttrs.connectivity==='offline'||networkStatus==-1||networkStatus==-2||deviceAttrs.error"
    class="status_bar">
    <!-- v-show="device.device_uuid"  -->
    <!-- <div class="status_bar_block"/> -->
    <div 
      :style="{ 'top': status_bar_height+navigation_bar_height*2 + 'px'}" 
      class="bac_fiexd"/>
    <div
      ref="status_bar_fixed"
      :style="{ 'top': status_bar_height+navigation_bar_height*2 + 'px'}"
      class="status_bar_fixed">
      <!-- <div
        v-if="spVisible"
        class="sp_status_bar"
        @click="goToScreenProjectionPage">
        <i class="icon-tv1"/>正在投屏 {{ spStatusText }}：
        <span class="text">{{ tvStatus.screenProjectTitle }}</span>
        <i class="icon-arrow"/>
      </div> -->
      <div>
        <!-- <div
          v-if="tvStatus.tvOnlineStatus==0" 
          class="offline_bar">
          <div class="offline_bar_div">
            <p class="offline_bar_p">
              <i 
                class="synchronization rotate"/>
            </p>
            <span class="link">状态同步中,&nbsp;&nbsp;请稍后...</span> 

          </div>
        </div> -->
        <!-- {{ networkStatus }} -->
        <div
          v-show="networkStatus==-1" 
          class="offline_bar offline_bar_wifi">
          <div class="offline_bar_div">
            <p class="offline_bar_p">
              <i class="wifi"/>
            </p>
            <span class="link">当前网络不可用</span> 

          </div>
        </div>

        <div
          v-if="networkStatus==-2"
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
          v-if="deviceAttrs.connectivity==='offline'&&networkStatus!=-1&&networkStatus!=-2"      
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
        <div
          v-if="deviceAttrs.error&&networkStatus!=-1&&networkStatus!=-2&&deviceAttrs.connectivity!=='offline'"      
          class="offline_bar"
         >
          <div class="offline_bar_div">
            <p class="offline_bar_p">
              <i class="error"/>
            </p>
            <span class="link">{{deviceAttrs.error}}</span>
          </div>
        </div>
      </div>
    </div>
    <div 
    :style="{ 'top': status_bar_height+navigation_bar_height*3 + 'px'}" 
    v-if="!deviceAttrs.error"
      class="mask"/>
    <OfflineHelpPage 
      v-show="OfflineHelpPageView" 
      ref="OfflineHelpPageView"/>
  </div>
  
</template>




<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import OfflineHelpPage from './OfflineHelpPage.vue'

let dpr = /iPad|iPhone|iPod/.test(navigator.userAgent) ? 1 : window.devicePixelRatio

export default {
    components:{
      OfflineHelpPage
    },
    props: ["barHeight","type"],
    data() {
        return {
          ...mapState,
          OfflineHelpPageView:false,
          status_bar_height: 25,
          navigation_bar_height: 44,
          ios: /iPad|iPhone|iPod/.test(navigator.userAgent),
          prohibit:false
        }
    },
    computed: {
    ...mapGetters(['isClose', 'isOffline','networkStatus']),
    ...mapState(['device', 'deviceAttrs']),
    },
    watch:{
      networkStatus(n,v){
        console.log(n,v)
      switch (n) {
        case -1:
          this.prohibitmove()
          break
        case -2:
          this.prohibitmove()
          break
        case 0:
        if (this.deviceAttrs.connectivity==='offline') return
          this.allowmove()
          break
        default:
          break
      }
        
      },
      'deviceAttrs.connectivity'(n,v){
        console.log(n,v,3434)
        switch (n) {
        case 'offline':
          this.prohibitmove()
          break
       case 'online':
       if (this.networkStatus==-1||this.networkStatus==-2)return
          this.allowmove()
          break
        default:
          break
      }
      
        console.log(n,v,54665)
      }
    },
    created() {
      HdSmart.ready(() => {
        if (window.status_bar_height) {
          this.status_bar_height = window.status_bar_height / dpr
        }
        this.getNetworkInfo()
        .then((res)=>{
          this.setNetworkStatus(res)
        })
        window.onNetworkStatusChange = (data)=> {
            this.setNetworkStatus(data)
        }
      })
    },
    methods: {
      ...mapActions(['getDeviceInfo','getNetworkInfo','setNetworkStatus','doControlDevice']),
        goToOfflineHelpPage() {
          this.OfflineHelpPageView = true
          this.$refs.OfflineHelpPageView.moveOut = false
          this.$refs.OfflineHelpPageView.moveIn = true
        },
        prohibitmove(){
          if (!this.prohibit) {
            document.addEventListener('touchmove', this.touchmovefn, { passive: false }) 
            this.prohibit = true
          }
        },
        allowmove(){
         document.removeEventListener('touchmove',this.touchmovefn, { passive: false }) 
         this.prohibit = false
        },
        touchmovefn(e){
          e.preventDefault();
          
        },
    },
}
</script>



<style lang="less" scoped>
@status_bar_height: 25PX;
@navigation_bar_height: 44PX;
.status_bar_fixed{
    // position:fixed;
    left: 0;
    top: 69PX;
    width: 100%;
    z-index: 10001;
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
    position: relative;

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
  position: relative;
    background: #a1a1a1;
    opacity: 0.9;
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
.mask{
      position: fixed;
      top: 44PX;
      left: 0;
      right: 0;
      bottom: 0;
      // height: 2000px;
      background: transparent;
      z-index: 10000;
   
}
</style>