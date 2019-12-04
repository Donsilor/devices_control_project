<template>
  <div 
    class="NoNetwork-page" 
  >
    <!-- <div
      class="space-block" /> -->
    <new-topbar
      :shutdown="true"
      :title="device_name"
      bak-color="#000"
      switchimg="tv"
      @shutdownCallback="cmd('rcPower')"

    />
    <status-tip
      v-show="device_uuid" 
    />
    <div class="error-tip">
      <div class="NoNetwork-img">
        <img src="~@lib/base/tv/assets/new/tv_icn_nowifi@2x.png" >
      </div>
      <p>很抱歉，当前网络不可用</p>
      <!-- <button @click="fn">按钮</button> -->
    </div>
  </div>
</template>

<script>
import * as service from '../service'
export default {
  data(){
    return {
        device_name:window.device_name||'',
        device_uuid: window.device_uuid || '',

    }
  },
  methods:{
    cmd(name) {
      service.onClickEvent(name)
    },
    // fn(){
    //    let obj = this.$store.state.tvStatus
    //   obj.tvOnlineStatus = 1
    //   this.$store.commit('setScreenProjectionStatus',obj)
    // }
  }

}
</script>

<style lang="less">
.NoNetwork-page{
  .space-block{
    height: 25PX;
  }
   background: url("../../../../lib/base/tv/assets/icn_blurry_bg@2x.png");
    background-size: 100% 100%;
    background-attachment: fixed;
    min-height: 100%;
  .error-tip{
    .NoNetwork-img{
      display: flex;
      justify-content: center;
      img{
        width: 120px;
        height: 120px;
      }
    
    }
      p{
        opacity: 0.39;
        font-family: PingFangSC-Regular;
        font-size: 24px;
        color: #000000;
        text-align: center;
        margin-top: 64px;
      }
  }
}
</style>



