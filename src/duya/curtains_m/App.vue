/* eslint-disable vue/no-unused-vars */
<template>
  <div class="body">
    <div class="page">
      <NewTopBar
        :scroll="true"
        :room="device.room_name"
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
              @touchstart="touchStart($event)"
              @touchmove="touchMove($event,'left')"
              @touchend="touchEnd($event)">
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
              @touchstart="touchStart($event)"
              @touchmove="touchMove($event,'right')"
              @touchend="touchEnd($event)">
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
            @touchstart ="touchstart('close')"
            @touchend="touchend('close')"/>
          <div class="btn-name">全关</div>
        </div>
        <div class="btn-wrap">
          <div
            ref="pause"
            class="btn-pause btn center"
            @touchstart ="touchstart('pause')"
            @touchend="touchend('pause')"/>
          <div class="btn-name">暂停</div>
        </div>
        <div class="btn-wrap">
          <div
            ref="open"
            class="btn-open btn center"
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
import _ from './utils'
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
      count: 0
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
    "device.stateChange"(){
      if (this.myMove==false) {
          this.newRatio()
      }
    },
    'deviceAttrs.open_percentage'(newValue, oldValue) {
      this.count = this.count + 1
      var _that = this
      function a(num) {
        setTimeout(() => {
          if (num === _that.count) {
            console.log('暂停了') 
            if (_that.curtainStatusText=='正在关闭窗帘'||_that.curtainStatusText=='正在打开窗帘') {
              _that.curtainStatusText=''
            }
          }
        }, 2000)
      }
      a(this.count)
      if(this.btnActive == 'open'||this.btnActive == 'close'||this.myMove==true) {
        if(newValue > oldValue) {
          this.curtainStatusText = '正在打开窗帘'
        }
        if(newValue < oldValue) {
          this.curtainStatusText = '正在关闭窗帘'
        }
        if(newValue == oldValue) {
          this.curtainStatusText = ''
        }
      }else{
        this.curtainStatusText = ''
        this.btnActive='pause'
      }
      if(this.deviceAttrs.open_percentage == this.range) {
        this.curtainStatusText = ''
        this.myMove = false
      }
      if (oldValue-newValue<0&&this.deviceAttrs.open_percentage=='100') {
        this.curtainStatusText = '窗帘已打开'
        this.$refs['open'].classList.remove('yellowExtend')
        this.btnActive = ''
      }else if (this.deviceAttrs.open_percentage=='0') {
        this.curtainStatusText = '窗帘已关闭'
        this.$refs['close'].classList.remove('yellowExtend')
        this.btnActive = ''
      }
    }
  },
  created() {

  },
  mounted(){
      HdSmart.ready(() => {
      this.getDeviceInfo()
      .then(()=>{
        this.$nextTick(()=>{
          // 针对不同手机调整按钮的位置
          let btnHeight = document.documentElement.clientHeight
          let panelBtn = document.querySelectorAll('.panel-btn')[0]
          if (btnHeight>=812) {
            panelBtn.style.bottom = '100px'
          }else if(btnHeight>=667){
            panelBtn.style.bottom = '90px'
          }else if(btnHeight>=568){
            panelBtn.style.bottom = '30px'
          }else{
            panelBtn.style.bottom = '0'
          }  
        })
         setTimeout(() => {
            this.newRatio()
          }, 500)
        if (this.deviceAttrs.open_percentage=='100') {
          this.curtainStatusText = '窗帘已打开'
        }
        if (this.deviceAttrs.open_percentage=='0') {
          this.curtainStatusText = '窗帘已关闭'
        }
      })
      HdSmart.UI.setStatusBarColor(2)
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
      touchstart(val) {
        // this.$refs[val].classList.remove('animateStart','animateEnd')
        let btn = document.querySelectorAll('.btn')
        for(let i=0;i<btn.length;i++){
          btn[i].classList.remove('yellowExtend')
          btn[i].classList.remove('animateStart','animateEnd')
        } 
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
    setOpen: _.debounce(function(){
      // this.$refs['open'].classList.add('active')
      // setTimeout(()=>{
      //   this.$refs['open'].classList.remove('active')
      // },500)
      if (this.deviceAttrs.open_percentage == 100) {
        this.$refs['open'].classList.remove('yellowExtend')
      }
      this.btnActive = 'open'
      this.myMove = false
      this.controlDevice('switch', 'on')
      .then((res)=>{
        // console.log(res,'===============')
        if(res == null){
           HdSmart.UI.toast('请求超时，请重试')
        }
      })
    },300),
    //全关
    setClose:_.debounce(function(){
      if (this.deviceAttrs.open_percentage == 0) {
        this.$refs['close'].classList.remove('yellowExtend')
      }
      this.btnActive = 'close'
      this.myMove = false
      this.controlDevice('switch', 'off')
      .then((res)=>{
        // console.log(res,'===============')
        if(res == null){
           HdSmart.UI.toast('请求超时，请重试')
        }
      })
    },300),
    //暂停
    setPause:_.debounce(function(){
      this.btnActive = 'pause'
      this.curtainStatusText = ''
      this.myMove = false
      this.$refs['close'].classList.remove('yellowExtend')
      this.$refs['open'].classList.remove('yellowExtend')
       setTimeout(()=>{
        this.$refs['pause'].classList.remove('yellowExtend','animateStart','animateEnd')
      },500)
      this.controlDevice('switch', 'pause')
      .then((res)=>{
        if (res) {
          if (res.code == 0) {
            $('.leftCurtainBox').stop()
            $('.rightCurtainBox').stop()
            console.log('停止了=========')
            
          }
        }
        if(res == null){
           HdSmart.UI.toast('请求超时，请重试')
        }
      })
    },300),
    // clear
    // 滑动窗帘
    touchStart(e){
      this.myMove = true
      this.curtainStatusText = ''
      this.btnActive = ''
      this.$refs['close'].classList.remove('yellowExtend')
      this.$refs['open'].classList.remove('yellowExtend')
    },
    touchMove(e,val){
      //除了自己的手机，其他手机都要监听
      this.myMove = true
      //滑动时计算窗帘的宽度
      let circle = this.$refs.right.offsetHeight
      let leftCurtainBox = this.$refs.leftCurtainBox
      let rightCurtainBox = this.$refs.rightCurtainBox
      let maxWidth = this.$refs.imgBox.offsetWidth*0.5
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
    touchEnd(){
      this.myMove = true
      let circle = this.$refs.right.offsetHeight
      let maxWidth = this.$refs.imgBox.offsetWidth*0.5
      this.range = 100-Math.round((this.curtainWidth-circle) / (maxWidth-circle) * 100)
      console.log(this.range)
      this.controlDevice('open_percentage',this.range)
      .then((res)=>{
        console.log(res,'===============')
        if(res == null){
           HdSmart.UI.toast('请求超时，请重试')
        }
      })
    },
    //根据后台返回数据得出窗帘的宽度
    newRatio(){
        if(this.myMove)return
        let circle = this.$refs.right.offsetHeight
        let maxWidth = this.$refs.imgBox.offsetWidth*0.5
        let width = (100-this.deviceAttrs['open_percentage'])/100*(maxWidth-circle)+circle
        $('.leftCurtainBox').animate({
            width:Math.round(width)
        },200)
        $('.rightCurtainBox').animate({
            width:Math.round(width)
        },200)
      // leftCurtainBox.style.width =width +"px"
      // console.log(width,'=-=------------')
      // rightCurtainBox.style.width = leftCurtainBox.style.width
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
    margin-top: 90px;
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
          // left: 1%;
          // width: 49%;
          left:0;
          width:50%;
          height: 500px;
          overflow: hidden;
          .curtainLeft{
            top: 0;
            left: 0;
            width: 100%;
            height: 500px;
            margin-left:1%;
            position: absolute;
          }
          .left{ 
            position: absolute;
            top: 50%;
            right: 1px;
            // width: 49%;
            height: 60px;
            margin-top: -30px;
          }
        }
        .rightCurtainBox{
           position: absolute;
           top: 0;
          //  right: 1%;
          //  width: 49%;
          right:0;
          width:50%;
           height: 500px;
           overflow: hidden;
          .curtainRight{
            top: 0;
            right:0;
            width: 100%;
            height: 500px;
            margin-right:1%;
            position: absolute;
          }
          .right{ 
            position: absolute;
            top: 50%;
            left: 1px;
            // width: 100%;
            height: 60px;
            margin-top: -30px;
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
    bottom: 90px;
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
        // background-image: linear-gradient(221deg, #F1CB85 10%, #E1B96E 81%);
        background: #E1B96E;
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
