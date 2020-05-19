<template>
  <div 
    class="error-page" 
    @click="reload">
    <div class="error-tip">
      <img src="~@lib/base/tv/assets/img_disconnection@2x.png" >
      <p>加载失败，请点击屏幕刷新</p>
    </div>
  </div>
</template>

<style>
.error-page {
    height: 100%;
    background: #f2f2f2;
    text-align: center;
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
}
.error-tip {
    left: 50%;
    top: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
}
.error-tip img {
    width: 360px;
}
.error-tip p {
    min-height: 30px;
    font-size: 30px;
    margin: 24px 0 110px 0;
    opacity: 1;
    position: relative;
}
</style>

<script>
import * as service from "../service"

export default {
    methods: {
        reload() {
            service.onClickEvent("reload")
        }
    }
}
</script>
