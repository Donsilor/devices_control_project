<template>
  <div
    v-if="visible"
    class="status_bar">
    <div class="status_bar_block"/>
    <div
      :style="{top:(status_bar_height + navigation_bar_height) +'px'}"
      class="status_bar_fixed">
      <div
        v-if="spVisible"
        class="sp_status_bar"
        @click="goToScreenProjectionPage">
        <i class="ico"/>正在投屏 {{ spStatusText }}：
        <span class="text">{{ tvStatus.screenProjectTitle }}</span>
        <i class="arr"/>
      </div>
      <div v-show="ios">
        <div
          v-if="tvStatus.tvOnlineStatus==-1"
          class="offline_bar"
          @click="goToOfflineHelpPage">
          <i class="wifi"/>无法连接网络，请检查网络设置
        </div>
        <div
          v-if="tvStatus.tvOnlineStatus==-2"
          class="offline_bar"
          @click="goToOfflineHelpPage">
          <i class="error"/>路由器已离线 &nbsp;
          <span class="link">查看帮助</span>
          <i class="arr"/>
        </div>
        <div
          v-if="tvStatus.tvOnlineStatus==-3"
          class="offline_bar"
          @click="goToOfflineHelpPage">
          <i class="error"/>电视离线或关机 &nbsp;
          <span class="link">查看帮助</span>
          <i class="arr"/>
        </div>
      </div>
      <div
        v-if="tvStatus.tvOnlineStatus < 0 && !ios"
        class="offline_bar_blank"/>
    </div>
  </div>
</template>

<style>
.status_bar_block{
    height: 80px;
}
.status_bar_fixed{
    position:fixed;
    left: 0;
    top: 64PX;
    width: 100%;
    z-index: 999;
    border-bottom:1px solid rgba(45,45,45,0.20);
}
.sp_status_bar {
    /* background: #f7f8fa; */
    text-align: center;
    height: 40PX;
    line-height: 40PX;
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
.status_bar .link {
    color: #FFC800;
}
.status_bar .ico {
    width: 32px;
    height: 32px;
    background: url(../../../lib/base/tv/assets/icn_sync_blue.png) no-repeat;
    background-size: 100% 100%;
    display: inline-block;
    vertical-align: -8px;
    margin-right: 10px;
}
.status_bar .arr {
    width: 22px;
    height: 12px;
    background: url(../../../lib/base/tv/assets/icn_arrow_down_blue.png)
        no-repeat;
    background-size: 100% 100%;
    transform: rotate(-90deg);
    display: inline-block;
    vertical-align: 4px;
}
.status_bar .wifi {
    width: 32px;
    height: 32px;
    background: url(../../../lib/base/tv/assets/ico_wifi.png) no-repeat;
    background-size: 100% 100%;
    display: inline-block;
}

.offline_bar {
    background: rgba(51, 51, 51, 1);
    width: 100%;
    height: 40PX;
    line-height: 40PX;
    text-align: center;
    color: #fff;
    font-size: 28px;
}
.offline_bar_blank {
    height: 84px;
}
.offline_bar i {
    display: inline-block;
    width: 30px;
    height: 30px;
    background: url(../../../lib/base/tv/assets/icn_notice_white_s.png)
        no-repeat;
    background-size: 100% 100%;
    margin-right: 10px;
    vertical-align: text-bottom;
}

</style>


<script>
import * as service from "../service";
import {mapState} from 'vuex'

export default {
    data() {
        return {
            ios: /iPad|iPhone|iPod/.test(navigator.userAgent)
        };
    },
    computed: {
        tvStatus() {
            return this.$store.state.tvStatus;
        },
        spStatusText() {
            return ["", "图片", "视频", "音乐"][
                this.tvStatus.screenProjectType
            ];
        },
        spVisible() {
            return (
                this.tvStatus.tvOnlineStatus == 1 &&
                this.tvStatus.screenProjectType != 0 &&
                this.$route.name != "search"
            );
        },
        visible() {
            return this.tvStatus.tvOnlineStatus != 1 || this.spVisible;
        },
        ...mapState(['status_bar_height', 'navigation_bar_height', 'isStatusBarShow'])
    },
    mounted() {
    },
    methods: {
        goToScreenProjectionPage() {
            service.onClickEvent("screenProjectionStatusClick");
        },
        goToOfflineHelpPage() {
            service.onClickEvent("tvOnlineStatusClick", {
                tvOnlineStatus: this.tvStatus.tvOnlineStatus
            });
        }
    },
};
</script>
