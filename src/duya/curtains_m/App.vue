/* eslint-disable vue/no-unused-vars */
<template>
  <div class="body">
    <div class="page">
      <NewTopBar
        :scroll="true"
        :title="device.device_name"
        bak-color="#000"/>
      <div class="main center">
        <div 
          ref="stick" 
          class="stick" >
          <div 
            ref="imgBox" 
            class="imgBox">
            <div 
              ref="leftCurtainBox" 
              class="leftCurtainBox"
              @touchstart="leftStart($event)"
              @touchmove="movefn($event,'left')"
              @touchend="endfn($event)">
              <img 
                ref="curtainLeft"
                class="curtainLeft" 
                src="../../../lib/base/new_curtains/assets/single.png">
              <img 
                ref="left"
                class="left" 
                src="../../../lib/base/new_curtains/assets/left.png"
              >
            </div>
            <div 
              ref="rightCurtainBox" 
              class="rightCurtainBox"
              @touchstart="rightStart($event)"
              @touchmove="movefn($event,'right')"
              @touchend="endfn($event)">
              <img 
                ref="curtainRight"
                class="curtainRight" 
                src="../../../lib/base/new_curtains/assets/single.png">
              <img 
                ref="right"
                class="right" 
                src="../../../lib/base/new_curtains/assets/right.png"
              >
            </div>
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
      myMove:false,
      curtainWidth:0,
    }
  },
  computed: {
    ...mapGetters(['isClose','isOffline']),
    ...mapState(['device', 'deviceAttrs']),
    bakColor(){
      return this.isClose ? '#000' : '#fff'
    }
  },
  watch:{
    "deviceAttrs"(){
      this.newRatio()
    }
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
      .then(()=>{
        this.newRatio()
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
    //暂停
    setPause(){},
    //全关
    setClose(){
      this.controlDevice('switch', 'off')
    },
    // 滑动窗帘
    leftStart(e){
      console.log(e)
    },
    leftEnd(e){
     
    },
    rightStart(e){
      console.log(e)
    },
    rightEnd(e){},
    endfn(){
       let circle = this.$refs.right.offsetHeight
      let maxWidth = this.$refs.imgBox.offsetWidth*0.49
      this.range = 100-Math.round((this.curtainWidth-circle) / (maxWidth-circle) * 100)
      console.log(this.range)
      this.controlDevice('open_percentage',this.range)
    },
    movefn(e,val){
            //滑动时计算窗帘的宽度
      let circle = this.$refs.right.offsetHeight
      let leftCurtainBox = this.$refs.leftCurtainBox
      let rightCurtainBox = this.$refs.rightCurtainBox
      let maxWidth = this.$refs.imgBox.offsetWidth*0.49
      this.curtainWidth = e.targetTouches[0].pageX - leftCurtainBox.offsetLeft - this.$refs.stick.offsetLeft +circle/2 
      if(val=='right'){
        this.curtainWidth-=maxWidth 
        this.curtainWidth=maxWidth-this.curtainWidth+circle
      }
      this.curtainWidth = this.curtainWidth <= circle ? circle : this.curtainWidth
      this.curtainWidth = this.curtainWidth >= maxWidth ? maxWidth : this.curtainWidth
      leftCurtainBox.style.width = this.curtainWidth +"px"
      rightCurtainBox.style.width = leftCurtainBox.style.width
    },
    //根据后台返回数据得出窗帘的宽度
    newRatio(){
      let circle = this.$refs.right.offsetHeight
      let maxWidth = this.$refs.imgBox.offsetWidth*0.49
      let width = (100-this.deviceAttrs['open_percentage'])/100*(maxWidth-circle)+circle
      let leftCurtainBox = this.$refs.leftCurtainBox
      let rightCurtainBox = this.$refs.rightCurtainBox
      leftCurtainBox.style.width =width +"px"
      console.log(width)
      rightCurtainBox.style.width = leftCurtainBox.style.width
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
        height: 564px;
        .leftCurtainBox{
          position: absolute;
          top: 0;
          left: 1%;
          width: 49%;
          height: 564px;
          overflow: hidden;
          .curtainLeft{
            top: 0;
            left: 0;
            width: 100%;
            height: 564px;
            position: absolute;
          }
          .left{ 
            position: absolute;
            top: 50%;
            right: 0;
            // width: 49%;
            height: 60px;
            margin-top: -30px;
          }
        }
        .rightCurtainBox{
           position: absolute;
           top: 0;
           width: 49%;
           height: 564px;
           right: 1%;
           overflow: hidden;
          .curtainRight{
            top: 0;
            width: 100%;
            height: 564px;
            position: absolute;
          }
          .right{ 
            position: absolute;
            top: 50%;
            left: 0;
            // width: 100%;
            height: 60px;
            margin-top: -30px;
          }
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
