/* eslint-disable vue/no-unused-vars */
<template>
  <div class="body">
    <div class="page">
      <NewTopBar
        :scroll="true"
        :title="device.device_name"
        page-class=".page"
        bak-color="#000"/>
      <StatusTip v-show="device.device_uuid"/>
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
            ref="close"
            class="btn btn-close center"
            @click="setClose"
            @touchstart ="touchstart('close')"
            @touchend="touchend('close')" />
          <div class="btn-name">全关</div>
        </div>
        <div class="btn-wrap">
          <div
            ref="pause"
            class="btn-pause btn center"
            @click="setPause"
            @touchstart ="touchstart('pause')"
            @touchend="touchend('pause')" />
          <div class="btn-name">暂停</div>
        </div>
        <div class="btn-wrap">
          <div
            ref="open"
            class="btn-open btn center"
            @click="setOpen" 
            @touchstart ="touchstart('open')"
            @touchend="touchend('open')"/>
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
    touchstart(val) {
        this.$refs[val].classList.remove('animateStart','animateEnd')
        this.$refs[val].classList.add('animateStart')
        this.$refs[val].classList.add('yellowExtend')
    },
    touchend(val){ 
      // this.$refs[val].classList.remove('animateStart')
      this.$refs[val].classList.add('animateEnd')
      if(val=='open'){
        this.setOpen()
      }else if(val=='close'){
        this.setClose()
      }else{
        this.setPause()
      }
    },
    // 全开
    setOpen(){
      // this.$refs['open'].classList.add('active')
      setTimeout(()=>{
        this.$refs['open'].classList.remove('yellowExtend')
      },600)
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
      // this.$refs['close'].classList.add('active')
      setTimeout(()=>{
        this.$refs['close'].classList.remove('yellowExtend')
      },600)
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
      // this.$refs['pause'].classList.add('active')
      setTimeout(()=>{
        this.$refs['pause'].classList.remove('yellowExtend')
      },600)
      this.controlDevice('switch', 'pause')
      .then((res)=>{
        if (res.code==0) {
          this.leftCurtainBox.classList.add('pause')
          this.rightCurtainBox.classList.add('pause')
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
.animateStart::before{
  animation: scaleStart 0.15s;
  animation-fill-mode : forwards;
}
@keyframes scaleStart {
  0%{
    transform: scale(1);
  }
  100%{
    transform: scale(0.6);
  }
  // 90%{
  //   transform: scale(1.3);
  // }
  //   100%{
  //   transform: scale(1);
  // }
}

.animateEnd::before{
  animation: scaleEnd 0.3s;
  animation-fill-mode : forwards;
}
@keyframes scaleEnd {
  0%{
    transform: scale(0.6);
  }
  66%{
    transform: scale(1.2);
  }
  100%{
    transform: scale(1);
  }
}


  .yellowExtend{
    position: relative;
    &::after{
      content: '';
      position: absolute;
      width: 70%;
      height: 70%;
      // background-image: linear-gradient(to right, #F1CB85, #E1B96E);
      background: #E1B96E;
      top: 50%;
      left: 50%;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: yellowExtendAnimate .15s 1;
       animation-fill-mode : forwards;
       animation-timing-function: ease-out;
      z-index: 99
    }
  }
  @keyframes yellowExtendAnimate {
    0% {width: 0%;height: 0%;}
    100% {width: 100%;height: 100%;}
  }


  .bgcStart{
    position: relative;
    &::after{
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.3);
      top: 50%;
      left: 50%;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: bgcStart .15s 1;
       animation-fill-mode : forwards;
       animation-timing-function: ease-out;
      z-index: 99
    }
  }
  @keyframes bgcStart {
    0% {width: 100%;height: 100%;}
    100% {width: 110%;height: 110%;}
  }
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
    z-index: 9999;
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
        z-index: 999;
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
          z-index:999;
        }
      }
    }
  }
</style>
