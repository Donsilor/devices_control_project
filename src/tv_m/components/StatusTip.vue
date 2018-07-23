<template>
    <div class="status_bar" v-if="visible">
        <div class="sp_status_bar" @click="goToScreenProjectionPage" v-if="spVisible">
            <i class="ico"></i>正在投屏 {{spStatusText}}：
            <span class="text">{{tvStatus.screenProjectTitle}}</span>
            <i class="arr"></i>
        </div>
        <div v-show="ios">
            <div class="offline_bar" @click="goToOfflineHelpPage" v-if="tvStatus.tvOnlineStatus==-1">
                <i class="wifi"></i>无法连接网络，请检查网络设置
            </div>
            <div class="offline_bar" @click="goToOfflineHelpPage" v-if="tvStatus.tvOnlineStatus==-2">
                <i class="error"></i>路由器已离线 &nbsp;
                <span class="link">查看帮助</span>
                <i class="arr"></i>
            </div>
            <div class="offline_bar" @click="goToOfflineHelpPage" v-if="tvStatus.tvOnlineStatus==-3">
                <i class="error"></i>设备已离线 &nbsp;
                <span class="link">查看帮助</span>
                <i class="arr"></i>
            </div>
        </div>
        <div class="offline_bar_blank" v-if="tvStatus.tvOnlineStatus < 0 && !ios"></div>
    </div>
</template>

<style>
.sp_status_bar {
    /* background:#ffffff; */
    background: rgba(255, 255, 255, 0.98);
    box-shadow: inset 0 -1px 0 0 #dbdbdb;
    text-align: center;
    height: 80px;
    line-height: 80px;
    font-size: 28px;
    color: #13d5dc;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
}
.sp_status_bar .text {
    max-width: 50%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    /* display: inline-block;
    vertical-align: middle; */
}
.status_bar .link {
    color: #13d5dc;
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
.sp_status_home {
    position: fixed;
    left: 0;
    width: 100%;
    top: 100px;
    z-index: 2;
}
.sp_status_detail {
    background: #fff;
    flex-shrink: 0;
    position: fixed;
    left: 0;
    width: 100%;
    top: 100px;
    z-index: 2;
}
.sp_status_list {
    background: #fff;
}
.sp_status_search {
    position: fixed;
    left: 0;
    width: 100%;
    top: 100px;
    z-index: 9;
}
.status-tip-placeholder {
    height: 80px;
}
.offline_bar {
    background: rgba(51, 51, 51, 0.9);
    width: 100%;
    height: 80px;
    line-height: 80px;
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

@media only screen and (-webkit-min-device-pixel-ratio: 3),
    only screen and (min-device-pixel-ratio: 3) {
    .sp_status_home,
    .sp_status_detail,
    .sp_status_search {
        top: 116px;
    }
}

.isIOS .sp_status_home {
    top: 0;
}
.isIOS .sp_status_search {
    top: 88px;
}
.isIOS .sp_status_detail {
    top: 88px;
}
</style>


<script>
import * as service from "../service";
export default {
    data() {
        return {
            ios: true
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
        }
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
    mounted() {
        var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (iOS) {
            this.ios = true;
        } else {
            this.ios = false;
        }
    }
};
</script>
