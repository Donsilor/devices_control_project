<template>
  <div
    class="NoNetwork-page"
  >
    <new-topbar
      :shutdown="true"
      :title="device_name"
      bak-color="#000"
      switchimg="tv"
      @shutdownCallback="cmd('rcPower')"

    />
    <status-tip
      v-show="true"
    />
    <div class="error-tip">
      <div class="NoNetwork-img">
        <img src="~@lib/base/tv/assets/new/tv_img_nowifi.png" >
      </div>
      <p>当前网络不可用</p>
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
  mounted(){
     window.addEventListener("popstate", this.goback, false)
  },
  destroyed(){
    window.removeEventListener("popstate", this.goback)
  },
  methods:{
    cmd(name) {
      service.onClickEvent(name)
    },
    goback(){
       HdSmart.UI.popWindow()
    }
  }

}
</script>

<style lang="less" scoped>
.NoNetwork-page{
  .space-block{
    height: 25PX;
  }
    background-size: 100% 100%;
    background-color: black;
    background-attachment: fixed;
    min-height: 100%;
  .error-tip{
    margin-top: 200px;
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
        color: #fff;
        text-align: center;
        margin-top: 34px;
      }
  }
}
</style>



