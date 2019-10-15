<template>
  <div class="remote_control anima">
    <span @click="cmd('remoteControlEvent')"/>
  </div>
</template>

<script>
export default {

}
</script>

<style lang='less' scoped>
@keyframes right {
    0% {
      right:-140px;
    }
    10% {
      right:-20px;
    }
    15% {
      right:-40px;
    }
    20% {
      right:0;
    }
    25% {
      right:-20px;
    }
    90% {
      right:-20px;
    }
    100% {
       right:-140px;
    }
}
.remote_control{
  background: rgba(255,255,255,0.9);
  border-radius: 200px 0px 0px 200px;
  position: fixed;
  right: -140px;
  bottom: 100px;
  width: 258px;
  height: 114px;
  z-index: 100;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  line-height: 114px;
  padding-left: 20px;
  span{
    display: block;
    width: 60px;
    height: 60px;
    background: url("~@lib/base/tv/assets/new/tv_icn_yaokong.png");
    background-size: 100% 100%;
  }
}
.anima{
  animation: right 3.6s linear 0s;
}
</style>