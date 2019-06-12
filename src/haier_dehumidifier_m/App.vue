<template>
  <div>
    <div :class="[{'close': isClose}, 'wrap']">
      <topbar
        :transparent="true"
        title="卧室的除湿机" />
      <div class="page">
        <!-- 离线提示 -->
        <div
          v-show="isOffline"
          class="tips">
          <i class="attention" />
          设备已离线，查看帮助
        </div>
        <!-- 数值展示 -->
        <div class="remind">
          <div class="remind-box">
            <div class="remind-num">46.4</div>
            <div class="remind-txt">相对湿度</div>
            <div class="remind-tis">%</div>
          </div>
          <div class="remind-box">
            <div class="remind-num">26</div>
            <div class="remind-txt">室外温度</div>
            <div class="remind-tis1">℃</div>
          </div>
        </div>
        <!-- 万能切割线 -->
        <div class="line-lz"/>
        <!-- 圆圈 -->
        <div class="main">
          <img
            class="circle"
            src="../../lib/base/dehumidifier/assets/animation_dh_circle.png"
            alt="">
          <img
            style="display: none"
            src="../../lib/base/dehumidifier/assets/animation_dh_circle_white.png"
            alt="">
          <div class="block">
            <div class="block-txt">除湿模式</div>
            <div class="block-tis">已启动</div>
          </div>
          <span class="sport1"/>
          <span class="sport2"/>
          <span class="sport3"/>
          <span class="sport4"/>
          <span class="sport5"/>
          <span class="sport6"/>
          <span class="sport7"/>
          <span class="sport8"/>
          <span class="sport9"/>
        </div>
      </div>
      <!-- 底部tab -->
      <div class="btn">
        <div
          :class="[{'active': !isClose}, 'btn-tab', 'btn-swich']"
          @click="setSwitch">
          <div class="btn-sty">
            <a
              class="shutdown"
              href="#"/>
          </div>
          <div class="btn-txt">开关</div>
        </div>
        <div
          class="btn-tab"
          @click="handeModeClick">
          <div class="btn-sty">
            <a
              href="#"
              class="shutdown1"/>
          </div>
          <div class="btn-txt">模式</div>
        </div>
        <div class="btn-tab">
          <div class="btn-sty">
            <a
              href="#"
              class="shutdown2"/>
          </div>
          <div class="btn-txt">档位2</div>
        </div>
        <div class="btn-tab">
          <div class="btn-sty">
            <a
              href="#"
              class="shutdown3"/>
          </div>
          <div class="btn-txt">定时</div>
        </div>
      </div>
      <!-- 模式选择弹框 -->
      <div
        v-show="showModeBtns"
        class="mode-btn"
        @touchmove.prevent
        @click="hide">
        <div class="mode-items">
          <div class="mode-item1">
            <div class="mode-name">除湿</div>
          </div>
          <div class="mode-item2">
            <div class="mode-name">干衣</div>
          </div>
          <div class="mode-item3">
            <div class="mode-name">自动</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOffline: false,
      switchStatus: 'on',
      showModeBtns: true,
    }
  },
  computed: {
    isClose() {
      return this.switchStatus == 'on' ? false : true
    }
  },
  methods: {
    hide(){
      this.showModeBtns = false
    },
    setSwitch() {
      if(this.switchStatus === 'on') {
        this.switchStatus = 'off'
      } else {
        this.switchStatus = 'on'
      }
    },
    handeModeClick() {
      console.log(123)
    }
  },
}
</script>
<style lang="less" scoped>
.wrap {
  font-family: PingFangSC-Regular;
  background: #20282B;
  height: 1624px;
  position: relative;
  // * {
  //   transition: all 0.3s ease-in-out;
  // }
  .page {
    position: relative;
    overflow-x: hidden;
    margin-top: 60px;
    // 离线提示
    .tips {
      background: rgba(0, 0, 0, 0.3);
      position: fixed;
      top: 64PX;
      left: 0;
      z-index: 99;

      padding-left: 48px;
      display: flex;
      align-items: center;
      width: 100%;
      height: 88px;
      line-height: 88px;

      font-size: 32px;
      color: #fff;
      .attention {
        display: inline-block;
        width: 36px;
        height: 36px;
        background-image: url(../../lib/base/air_condition/assets/new-air/icon-tips.png);
        background-size: 100% 100%;
        margin-right: 12px;
      }
      &:after {
        position: absolute;
        right: 50px;
        top: 50%;
        display: inline-block;
        content: "";
        width: 15px;
        height: 15px;
        border: 2px solid #fff;
        border-width: 2px 2px 0 0;
        -webkit-transform: translate(0, -50%) rotate(45deg);
        transform: translate(0, -50%) rotate(45deg);
      }
    }
    // 数值提示
    .remind {
      display: flex;
      justify-content: space-evenly;
      .remind-box {
        display: inline-block;
        .remind-num {
          font-size: 80px;
          color: #fff;
          text-align: center;
        }
        .remind-txt {
          opacity: 0.5;
          font-size: 24px;
          color: #fff;
          text-align: center;
        }
        .remind-tis {
          color: #fff;
          font-size: 24px;
          position: relative;
          top: -130px;
          left: 164px;
        }
        .remind-tis1 {
          color: #fff;
          font-size: 24px;
          position: relative;
          top: -130px;
          left: 100px;
        }
      }
    }
    // 切割线
    .line-lz {
      width: 654px;
      height: 2px;
      opacity: 0.1;
      background: #D8D8D8;
      margin: 0 auto;
    }
    // 圆圈样式
    .main {
      // width: 450px;
      // height: 450px;
      margin: 200px auto 0;
      // overflow: hidden;
      .circle {
        // display: inline-block;
        position: relative;
        top: -94px;
        left: 60px;
        width: 640px;
        height: 640px;
      }
      .block {
        text-align: center;
        position: relative;
        top: -480px;
        .block-txt {
          font-size: 48px;
          color: #fff;
        }
        .block-tis {
          opacity: 0.5;
          font-size: 24px;
          color: #FFFFFF;
        }
      }
      .sport1 {
        border-radius: 50%;
        position: relative;
        top: -800px;
        left: 140px;
        display: inline-block;
        background-image: url(../../lib/base/dehumidifier/assets/animation_dh_bubble.png);
        width: 88px;
        height: 88px;
        background-size: 88px 88px;
      }
      .sport2 {
        border-radius: 50%;
        position: relative;
        top: -836px;
        left: 200px;
        display: inline-block;
        background-image: url(../../lib/base/dehumidifier/assets/animation_dh_bubble.png);
        width: 48px;
        height: 48px;
        background-size: 48px 48px;
      }
      .sport3 {
        border-radius: 50%;
        position: relative;
        top: -740px;
        left: 370px;
        display: inline-block;
        background-image: url(../../lib/base/dehumidifier/assets/animation_dh_bubble.png);
        width: 68px;
        height: 68px;
        background-size: 68px 68px;
      }
      .sport4 {
        border-radius: 50%;
        position: relative;
        top: -576px;
        left: -164px;
        display: inline-block;
        background-image: url(../../lib/base/dehumidifier/assets/animation_dh_bubble.png);
        width: 28px;
        height: 28px;
        background-size: 28px 28px;
      }
      .sport5 {
        border-radius: 50%;
        position: relative;
        top: -480px;
        left: -180px;
        display: inline-block;
        background-image: url(../../lib/base/dehumidifier/assets/animation_dh_bubble.png);
        width: 28px;
        height: 28px;
        background-size: 28px 28px;
      }
      .sport6 {
        border-radius: 50%;
        position: relative;
        top: -520px;
        left: 230px;
        display: inline-block;
        background-image: url(../../lib/base/dehumidifier/assets/animation_dh_bubble.png);
        width: 28px;
        height: 28px;
        background-size: 28px 28px;
      }
      .sport7 {
        border-radius: 50%;
        position: relative;
        top: -386px;
        left: -260px;
        display: inline-block;
        background-image: url(../../lib/base/dehumidifier/assets/animation_dh_bubble.png);
        width: 48px;
        height: 48px;
        background-size: 48px 48px;
      }
      .sport8 {
        border-radius: 50%;
        position: relative;
        top: -364px;
        left: -60px;
        display: inline-block;
        background-image: url(../../lib/base/dehumidifier/assets/animation_dh_bubble.png);
        width: 48px;
        height: 48px;
        background-size: 48px 48px;
      }
      .sport9 {
        border-radius: 50%;
        position: relative;
        top: -380px;
        left: -30px;
        display: inline-block;
        background-image: url(../../lib/base/dehumidifier/assets/animation_dh_bubble.png);
        width: 68px;
        height: 68px;
        background-size: 68px 68px;
      }
    }
  }
  // 底部tab
  .btn {
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    background: #20282B;
    box-shadow: 0 -6px 56px 0 rgba(17,17,17,0.50);
    border-radius: 40px 40px 0px 0px;
    height: 306px;
    width: 100%;
    .btn-tab {
      position: relative;
      top: -50px;
      width: 120px;
      height: 120px;
      // opacity: 0.5;
      border: 1px solid #FFFFFF;
      border-radius: 50%;
      .btn-txt {
        font-size: 24px;
        color: #FFFFFF;
        text-align: center;
        position: relative;
        top: 10px;
        opacity: 0.5;
      }
      .btn-sty {
        height: 120px;
        .shutdown {
          display: block;
          width: 120px;
          height: 120px;
          background-image: url(../../lib/base/dehumidifier/assets/swich-white.png);
          background-repeat: no-repeat;
          background-size: 48px 48px;
          background-position: 50% 50%;
        }
        .shutdown1 {
          display: block;
          width: 120px;
          height: 120px;
          background-image: url(../../lib/base/dehumidifier/assets/btn_dh_mode_dry.png);
          background-repeat: no-repeat;
          background-size: 48px 48px;
          background-position: 50% 50%;
        }
        .shutdown2 {
          display: block;
          width: 120px;
          height: 120px;
          background-image: url(../../lib/base/dehumidifier/assets/btn_dh_fan_mid.png);
          background-repeat: no-repeat;
          background-size: 48px 48px;
          background-position: 50% 50%;
        }
        .shutdown3 {
          display: block;
          width: 120px;
          height: 120px;
          background-image: url(../../lib/base/dehumidifier/assets/time-white.png);
          background-repeat: no-repeat;
          background-size: 48px 48px;
          background-position: 50% 50%;
        }
      }
      &.active {
        background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
        .shutdown {
          display: block;
          width: 120px;
          height: 120px;
          background-image: url(../../lib/base/dehumidifier/assets/swich-black.png);
          background-repeat: no-repeat;
          background-size: 48px 48px;
          background-position: 50% 50%;
        }
      }
    }
  }
  &.close {
    &:before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 9;
      width: 100%;
      background: rgba(0, 0, 0, 0.8);
    }
    .btn {
      .btn-swich {
        z-index: 10;
        .btn-txt {
          .btn-sty {
            .shutdown {
              display: block;
              width: 120px;
              height: 120px;
              background-image: url(../../lib/base/dehumidifier/assets/swich-white.png);
              background-repeat: no-repeat;
              background-size: 48px 48px;
              background-position: 50% 50%;
            }
          }
        }
      }
    }
  }
}
</style>
