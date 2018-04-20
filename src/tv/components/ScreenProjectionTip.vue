<template>
    <div class="sp_status_bar" @click="goToScreenProjectionPage" v-show="tvStatus.screenProjectType!=0">
        <i class="ico"></i>正在投屏 {{tvStatusText}}：{{tvStatus.screenProjectTitle}} <i class="arr"></i>
    </div>
</template>

<style>
.sp_status_bar{
    /* background:#ffffff; */
    box-shadow:inset 0 -1px 0 0 #dbdbdb;
    text-align: center;
    height:84px;
    line-height: 84px;
    font-size:30px;
    color:#13d5dc;
    overflow: hidden;
}
.sp_status_bar .ico{
    width: 36px;
    height: 36px;
    background: url(../assets/icn_sync_blue.png) no-repeat;
    background-size: 100% 100%;
    display: inline-block;
    vertical-align: -8px;
    margin-right: 10px;
}
.sp_status_bar .arr{
    width: 22px;
    height: 12px;
    background: url(../assets/icn_arrow_down_blue.png) no-repeat;
    background-size: 100% 100%;
    transform: rotate(-90deg);
    display: inline-block;
    vertical-align: 4px;
}
.sp_status_home{
    position: fixed;
    left: 0;
    width: 100%;
    top: 96px;
    z-index: 2;
    background: rgba(255, 255, 255, 0.98);
}
.sp_status_detail{
    background: #fff;
    flex-shrink: 0;
}
.sp_status_list{
    background: #fff;
}
.screen-projection-tip-placeholder{
    height: 84px;
}
</style>


<script>
import * as service from '../service'
export default {
    data() {
        return {

        }
    },
    computed: {
        tvStatus() {
            return this.$store.state.screenProjectionStatus
        },
        tvStatusText(){
            return ['', '图片', '视频', '音乐'][this.tvStatus.screenProjectType]
        }
    },
    methods: {
        goToScreenProjectionPage() {
            service.onClickEvent('screenProjectionStatusClick')
        }
    }
}
</script>
