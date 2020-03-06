<template>
  <!--底部遥控器-->
  <div class="fixed-bottom">
    <!-- 遥控器 -->
    <div class="left">
      <div :class="[isPlay ? 'remote_control' : 'remote_control-self', isPlay ?  'anima': '']">
        <div class="control">
          <span @click="cmd('remoteControlEvent')"/>
        </div>
        <div :class="[isPlay? 'remote' : 'no-remote']">遥控器</div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as service from '../service'

  export default {
    props: {
      isPlay: {
        default: true
      }
    },
    data() {
      return {}
    },
    methods: {
      cmd(name) {
        service.onClickEvent(name)
      }
    }

  }
</script>

<style lang='less' scoped>
  .fixed-bottom{
    background: rgba(12,12,12,0.8);
    height: 160px;
    width: 100%;
    position: fixed;
    bottom: 0;
    .left{
      width: 100%;
      height: 100%;
      position: relative;
      .remote_control-self{
        position: absolute;
        left: 10px;
        top: -15px;
      }
    }
  }
  @keyframes right {
    0% {
      right: -140px;
    }
    10% {
      right: -20px;
    }
    15% {
      right: -40px;
    }
    20% {
      right: 0;

    }
    25% {
      right: -20px;
      background: rgba(255, 255, 255, 0.9);
    }
    90% {
      right: -20px;
      background: rgba(255, 255, 255, 0.9);
    }
    100% {
      right: -140px;

      .remote {
        opacity: 0;
      }
    }
  }

  @keyframes remote {
    0% {
      opacity: 0;
    }

    25% {
      opacity: 1;

    }
    90% {
      opacity: 1;

    }
    100% {
      opacity: 0;

    }
  }

  .remote_control {
    background: rgba(0, 0, 0, 0.14);
    border-radius: 200px 0px 0px 200px;
    position: fixed;
    right: -140px;
    bottom: 100px;
    width: 258px;
    height: 104px;
    z-index: 100;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    line-height: 104px;

    // padding: 20px;
    .control {
      margin: 0 12px 0 30px;

      width: 64px;
      height: 64px;
      background: #fff;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    div {
      font-size: 32px;
    }

    span {
      display: block;
      width: 48px;
      height: 48px;
      background: url("~@lib/base/tv/assets/new/tv_icn_yaokong.png");
      background-size: 100% 100%;
    }
  }

  .remote_control-self {
    border-radius: 200px 0px 0px 200px;
    position: fixed;
    right: -140px;
    bottom: 100px;
    width: 258px;
    height: 104px;
    z-index: 100;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    line-height: 104px;

    // padding: 20px;
    .control {
      margin: 0 12px 0 30px;
      width: 100px;
      height: 100px;
      background: rgba(51, 51, 51, 0.98);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    div {
      font-size: 32px;
    }

    span {
      display: block;
      width: 48px;
      height: 48px;
      background: url("~@lib/base/tv/assets/new/tv_btn_control.png");
      background-size: 100% 100%;
    }
  }

  .anima {
    animation: right 3.6s linear 0s;
  }

  .remote {
    animation: remote 3.6s linear 0s;
    opacity: 0;
  }

  .no-remote {
    color: #fff;
  }
</style>
