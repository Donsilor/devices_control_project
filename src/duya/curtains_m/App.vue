/* eslint-disable vue/no-unused-vars */
<template>
  <div class="body">
    <div class="page">
      <NewTopBar
        :scroll="true"
        :title="device.device_name"
        bak-color="#000"/>
      <div class="main center">
        <div class="stick" >
          <div class="imgBox">
            <img 
              class="curtainLeft" 
              src="../../../lib/base/new_curtains/assets/single.png">
            <img 
              class="left" 
              src="../../../lib/base/new_curtains/assets/left.png">
            <img 
              class="curtainRight" 
              src="../../../lib/base/new_curtains/assets/single.png">
            <img 
              class="right" 
              src="../../../lib/base/new_curtains/assets/right.png">
          </div>
        </div>
        <!-- <div
          ref="isgray"
          class="isgray" >
          <div
            ref="cover"
            :class="['cover']">
            <div
              ref="touchbox"
              class="touchbox"
              @touchstart="touchStart($event)"
              @touchmove="touchMove($event)"
              @touchend="touchEnd($event)">
              <div
                class="touch"/>
            </div>
          </div>
        </div> -->
        <div 
          v-if="txtShow === 'opening'" 
          class="status">正在打开窗帘</div>
        <div 
          v-if="txtShow === 'closing'" 
          class="status">正在关闭窗帘</div>
        <div 
          v-if="txtShow === 'opened'" 
          class="status">窗帘已打开</div>
        <div 
          v-if="txtShow === 'closed'"
          class="status" >窗帘已关闭</div>
      </div>
      <!-- 底部按钮 -->
      <div class="panel-btn center">
        <div class="btn-wrap">
          <div
            :class="[{'active': curtainStatus === 'opening' },'btn-open btn center']"
            @click="setOpen" />
          <div class="btn-name">全开</div>
        </div>
        <div class="btn-wrap">
          <div
            ref="btn-pause"
            :class="['btn-pause btn center']"
            @click="setPause" />
          <div class="btn-name">暂停</div>
        </div>
        <div
          class="btn-wrap"
        >
          <div
            :class="[{ 'active': curtainStatus === 'closing' }, 'btn btn-close center']"
            @click="setClose" />
          <div class="btn-name">全关</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      //  target_percentage: 50,
      // 点击中部到指定幅度按钮显示的信息
      coverWidth:"",
      timeId: '',
      curtainStatus: '',
      btnActive: '',
      range: 0,
      txtShow: '',
      myMove:false
    }
  },
  computed: {
    ...mapGetters(['isClose','isOffline']),
    ...mapState(['device', 'deviceAttrs']),
    bakColor(){
      return this.isClose ? '#000' : '#fff'
    }
  },

  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
      .then(()=>{
      })
      HdSmart.UI.setStatusBarColor(2)
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    // 全开
    setOpen(){
      this.controlDevice('switch', 'on')
    },
    setPause(){},
    setClose(){
      this.controlDevice('switch', 'off')
    },
    controlDevice(attr, value,params) {
      return this.doControlDevice({
        nodeid: `curtain.main.${attr}`,
        params: {
          attribute: {
            [attr]: value,
            ...params
          }
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
@imgPath: 'base/new_curtains/assets';

.body {
  min-height: 100%;
}
.page {
  height: 100vh;
  min-height: 550px;
  overflow-x: hidden;
  position: relative;
  background-image: url('~@lib/@{imgPath}/img_bg_01@2x.png');
  background-size: 100% 100%;
  .main {
    position: relative;
    margin-top: 100px;
    .stick{
      width: 80%;
      height: 20px;
      position: relative;
      &::before{
        content: "";
        display: block;
        width: 100%;
        height: 100%;
        background-image: url('~@lib/@{imgPath}/gun.png');
        background-size: 100% 100%;
      }
      .imgBox{
        position: absolute;
        top: 16px;
        width: 100%;
        height: 38vh;
        .curtainLeft{
          top: 0;
          left: 10px;
          width: 49%;
          height: 38vh;
          position: absolute;
          left: 10px;
        }
        .curtainRight{
          top: 0;
          width: 49%;
          height: 38vh;
          position: absolute;
          right: 10px;
        }
        .left{ 
          position: absolute;
          top: 50%;
          left: 20px;
          width: 276px;
          margin-top: -52px;
        }
        .right{ 
          position: absolute;
          top: 50%;
          right: 20px;
          width: 276px;
          margin-top: -52px;
        }
      }
    }
    // &.center {
    //   flex-direction: column;
    // }
    // .cover{
    //   width: 572px;
    //   height: 204px;
    //   left: 0;
    //   top: 0px;
    //   background-image: linear-gradient(-90deg, #E5B864 3%, #F1CB85 52%);
    //   border-radius: 1px;
    //   position: absolute;
    //   clip:rect(0px 572px 204px 0px);
    //   .touchbox{
    //     // width: 28px;
    //     width: 40px;
    //     height: 204px;
    //     position: absolute;
    //     top: 50%;
    //     right: 0px;
    //     transform: translateY(-50%);
    //     display: flex;
    //     align-items: center;
    //     justify-content: center;
    //     .touch{
    //       width: 12px;
    //       height: 65px;
    //       border-left: 2px solid #BF954C;
    //       border-right: 2px solid #BF954C;
    //     }
    //   }
    //   &.move{
    //     transition: 5s linear;
    //   }
    //   &.openCurtains{
    //     animation: open 5s linear;
    //   }
    //   &.closeCurtains{
    //     animation: close 5s linear;
    //   }
    //   &.pause{
    //     animation-play-state: paused;
    //   }
    //   @-webkit-keyframes open {
    //     0% {
    //       width: 0px;
    //     }
    //     100% {
    //       width: 572px;
    //     }
    //   }
    //   @-webkit-keyframes close {
    //       0% {
    //       width: 572px;
    //     }
    //     100% {
    //       width: 28px;
    //     }
    //   }

    // }
    // .isgray {
    //   width: 76%;
    //   height: 204px;
    //   // background: rgb(234, 235, 238);
    //   background: rgba(0, 0, 0,0.1);
    //   border-radius: 1px;
    //   margin-top: 15vh;
    //   position: relative;
    // }
    .status{
      font-size: 28px;
      height: auto;
      margin-top: 120px;
    }
  }
  .panel-btn {
    height: auto;
    width: 100%;
    position: fixed;
    bottom: 130px;
    z-index: 99999;
    .btn {
      margin-top: 24px;
      width: 100%;
      height: 306px;
      border-radius: 40px 40px 0 0;
      // background: rgba(136, 138, 137,.4);
      background: rgba(0, 0, 0, 0.1);
      overflow: hidden;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
    }
    &.center{
      display: flex;
      align-items: center;
    }
  }
  /*********** 按钮 ***********/
  .btn-wrap {
    margin: 0 34px 40px;
    .btn {
      box-sizing: border-box;
      margin: 0px auto;
      width: 120px;
      height: 120px;
      border-radius: 50%;

      display: flex;
      flex-direction: column;
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
      }
      &.active {
        background-image: linear-gradient(221deg, #F1CB85 10%, #E1B96E 81%);
        &.btn-open::before{
          background-image: url('~@lib/@{imgPath}/on.png');
          background-size: 100% 100%;
        }
        &.btn-pause::before{
          background-image: url('~@lib/@{imgPath}/pause.png');
          background-size: 100% 100%;
        }
        &.btn-close::before{
          background-image: url('~@lib/@{imgPath}/off.png');
          background-size: 100% 100%;
        }
      }
    }
    .btn-name {
      text-align: center;
      color: #000;
      margin-top: 16px;
      font-size: 24px;
      line-height: 40px;
      // opacity: .5;
    }

    .btn-open {
      &::before {
        background-image: url('~@lib/@{imgPath}/on.png');
        background-size: 100% 100%;
      }
    }
    .btn-pause {
      &::before {
        background-image: url('~@lib/@{imgPath}/pause.png');
        background-size: 100% 100%;
      }
    }
    .btn-close {
      &::before {
        background-image: url('~@lib/@{imgPath}/off.png');
        background-size: 100% 100%;
      }
    }
    }
  }
  &.close,
  &.offline {
    &:before {
      content: "";
      position: fixed;
      top: 64PX;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 999;
      width: 100%;
      // background: rgba(0, 0, 0, 0.1);
    }
    &.page {
      background: #fff;
      .panel-btn {
        background: #fff;
      }
    }
    .panel-btn {
      background: #efefef;
    }
    .btn-wrap {
      opacity: .2;
      &.up-index {
        opacity: 1;
        .btn-open{
          z-index:999999;
        }
      }
    }
  }
</style>
