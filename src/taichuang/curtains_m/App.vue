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
          <div class="Pole"/>
          <div 
            ref="imgBox" 
            class="imgBox">
            <div 
              ref="leftCurtainBox" 
              class="leftCurtainBox"
            >
              <img 
                ref="curtainLeft"
                class="curtainLeft" 
                src="../../../lib/base/new_curtains/assets/single.png">
            </div>
            <div 
              ref="rightCurtainBox" 
              class="rightCurtainBox"
              @touchstart="touchStart($event)"
              @touchmove="touchMove($event,'right')"
              @touchend="touchEnd($event)">
              <img 
                ref="curtainRight"
                class="curtainRight" 
                src="../../../lib/base/new_curtains/assets/single.png">  
            </div>
          </div>
        </div>
        <div class="status" >{{ curtainStatusText }}</div>
      </div>
      <!-- 底部按钮 -->
      <div class="panel-btn center">
        <div
          class="btn-wrap"
        >
          <div
            ref="btn-close"
            class="btn btn-close center"
            @click="setClose" />
          <div class="btn-name">全关</div>
        </div>
        <div class="btn-wrap">
          <div
            ref="btn-pause"
            class="btn-pause btn center"
            @click="setPause" />
          <div class="btn-name">暂停</div>
        </div>
        <div class="btn-wrap">
          <div
            ref="btn-open"
            class="btn-open btn center"
            @click="setOpen" />
          <div class="btn-name">全开</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
// import './animate8.0.js'
export default {
  data() {
    return {
      //  target_percentage: 50,
      // 点击中部到指定幅度按钮显示的信息
      coverWidth:"",
      timeId: '',
      btnActive: '',
      range: 0,
      myMove:false,
      curtainWidth:0,
      curtainStatusText:'',
      count: 0,
      leftCurtainBox:'',
      rightCurtainBox:'',
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
      HdSmart.UI.setStatusBarColor(2)
    })
  },
  mounted(){
    this.leftCurtainBox = this.$refs.leftCurtainBox
    this.rightCurtainBox = this.$refs.rightCurtainBox
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    // 全开
    setOpen(){
      this.$refs['btn-open'].classList.add('active')
      setTimeout(()=>{
        this.$refs['btn-open'].classList.remove('active')
      },500)
      this.btnActive = 'open'
      this.controlDevice('switch', 'on')
      .then((res)=>{
        if (res.code==0) {
          this.leftCurtainBox.classList.add('setOpen')
          this.rightCurtainBox.classList.add('setOpen')
          this.leftCurtainBox.classList.remove('setClose')
          this.rightCurtainBox.classList.remove('setClose')
          this.leftCurtainBox.classList.remove('pause')
          this.rightCurtainBox.classList.remove('pause')
        }else{
          HdSmart.UI.toast('操作失败')
        }
      })
    },
    //全关
    setClose(){
      this.$refs['btn-close'].classList.add('active')
      setTimeout(()=>{
        this.$refs['btn-close'].classList.remove('active')
      },500)
      this.btnActive = 'close'
      this.controlDevice('switch', 'off')
      .then((res)=>{
        if (res.code==0) {
          console.log(this.leftCurtainBox.offsetWidth,this.$refs.imgBox.offsetWidth*0.5,'5555555')
            this.leftCurtainBox.classList.add('setClose')
            this.rightCurtainBox.classList.add('setClose')
            this.leftCurtainBox.classList.remove('setOpen')
            this.rightCurtainBox.classList.remove('setOpen')
            this.leftCurtainBox.classList.remove('pause')
            this.rightCurtainBox.classList.remove('pause')
        }else{
          HdSmart.UI.toast('操作失败')
        }
      })
    },
    //暂停
    setPause(){
      this.btnActive = 'pause'
      this.curtainStatusText = ''
      this.$refs['btn-pause'].classList.add('active')
      setTimeout(()=>{
        this.$refs['btn-pause'].classList.remove('active')
      },500)
      this.controlDevice('switch', 'pause')
      .then((res)=>{
        if (res.code==0) {
          this.leftCurtainBox.classList.add('pause')
          this.rightCurtainBox.classList.add('pause')
          console.log('99999999')
        }else{
          HdSmart.UI.toast('操作失败')
        }
      })
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

//兼容ie8获取元素对应浏览器渲染后的样式值。这个值是一个带单位的字符串
getStyle(obj,attr){
	return window.getComputedStyle ? window.getComputedStyle(obj,null)[attr] : obj.currentStyle[attr]
}
  }
}
</script>
<style lang="less" scoped>
@imgPath: 'base/new_curtains/assets';
.setOpen{
  animation: open 5s linear;
  animation-fill-mode:forwards;
}
@keyframes open {
  0%{
    width: 50%;
  }
  100%{
    width: 40px;
  }
}
.setClose{
  animation: close 5s linear;
  animation-fill-mode : forwards;
}
@keyframes close {
  0%{
    width: 40px;
  }
  100%{
    width: 50%;
  }
}
//暂停动画
.pause{
	animation-play-state:paused;
}
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
      // height: 20px;
      height: 586px;
      position: relative;
      .Pole{
        position: absolute;
        width: 100%;
        height: 20px;
        &::before{
          content: "";
          display: block;
          width: 100%;
          height: 100%;
          background-image: url('~@lib/@{imgPath}/gun.png');
          background-size: 100% 100%;
        }
      }

      .imgBox{
        position: absolute;
        top: 16px;
        width: 100%;
        // height: 500px;
        height: 500px;
        .leftCurtainBox{
          position: absolute;
          top: 0;
          left: 2px;
          width: 50%;
          height: 500px;
          overflow: hidden;
          .curtainLeft{
            top: 0;
            left: 0;
            width: 100%;
            height: 500px;
            position: absolute;
          }
        }
        .rightCurtainBox{
           position: absolute;
           top: 0;
           width: 50%;
           height: 500px;
           right: 2px;
           overflow: hidden;
          .curtainRight{
            top: 0;
            width: 100%;
            height: 500px;
            position: absolute;
          }
        }
      }
    }
    .status{
      position: absolute;
      font-size: 24px;
      height: auto;
      bottom: 0px;
      font-family: PingFangSC-Light;
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
      // justify-content: space-evenly;
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
          background-image: url('~@lib/@{imgPath}/off.png');
          background-size: 100% 100%;
        }
        &.btn-pause::before{
          background-image: url('~@lib/@{imgPath}/pause.png');
          background-size: 100% 100%;
        }
        &.btn-close::before{
          background-image: url('~@lib/@{imgPath}/on.png');
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
        background-image: url('~@lib/@{imgPath}/off.png');
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
        background-image: url('~@lib/@{imgPath}/on.png');
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
