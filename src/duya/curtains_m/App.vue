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
      // if (this.btnActive === 'open') {
      //     this.curtainStatusText='正在打开窗帘'
      // } else if (this.btnActive === 'close') {
      //     this.curtainStatusText='正在关闭窗帘'
      // }
      console.log(this.curtainStatusText,'curtainStatusText')
      console.log(this.btnActive,'btnActive')
    },
    'deviceAttrs.open_percentage'(newValue, oldValue) {
      this.count = this.count + 1
      console.log("count数", this.count)
      // var _this = this
      // (function(num) {
      //   setTimeout(() => {
      //     console.log("定时检索num", num)
      //     console.log("定时检索count", _this.count)
      //     if (num === _this.count) {
      //        console.log('暂停了') 
      //     }
      //   }, 2000)  
      // })(this.count)
      var _that = this
      function a(num) {
        setTimeout(() => {
            console.log("定时检索num", num)
            console.log("定时检索count", _that.count)
            if (num === _that.count) {
              console.log('暂停了') 
              if (_that.curtainStatusText=='正在关闭窗帘'||_that.curtainStatusText=='正在打开窗帘') {
                _that.curtainStatusText=''
              }
            }
          }, 2000)
      }
      a(this.count)
      console.log(newValue,oldValue,'打印新旧值111111111111111111111')
      
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
        this.btnActive = ''
      }else if (this.deviceAttrs.open_percentage=='0') {
        this.curtainStatusText = '窗帘已关闭'
        this.btnActive = ''
      }
      // if(this.deviceAttrs.open_percentage == 100) {
      //   this.curtainStatusText = ''
      // }
      // if(this.deviceAttrs.open_percentage == 0) {
      //   this.curtainStatusText = ''
      // }
    }
  },
  created() {
    
    HdSmart.ready(() => {
      this.getDeviceInfo()
      .then(()=>{
        this.newRatio()
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
  mounted(){
        console.log(this.animate,'4444444444')
        
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
      // this.curtainStatusText = '正在打开窗帘'
      this.myMove = false
      this.controlDevice('switch', 'on')
      .then((res)=>{
        if (res.code==-90004) {
          return HdSmart.UI.toast('网络超时，请重试')
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
      // this.curtainStatusText = '正在关闭窗帘'
      this.myMove = false
      this.controlDevice('switch', 'off')
      .then((res)=>{
        if (res.code==-90004) {
          return HdSmart.UI.toast('网络超时，请重试')
        }
      })
    },
    //暂停
    setPause(){
      this.btnActive = 'pause'
      this.curtainStatusText = ''
      this.myMove = false
      this.$refs['btn-pause'].classList.add('active')
      setTimeout(()=>{
        this.$refs['btn-pause'].classList.remove('active')
      },500)
      this.controlDevice('switch', 'pause')
      .then((res)=>{
        if (res.code==-90004) {
          return HdSmart.UI.toast('网络超时，请重试')
        }
      })
    },
    // clear
    // 滑动窗帘
    touchStart(e){
      this.myMove = true
      this.curtainStatusText = ''
      this.btnActive = ''
      console.log(e)
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
        if (res.code==-90004) {
          return HdSmart.UI.toast('网络超时，请重试')
        }
      })
    },
    //根据后台返回数据得出窗帘的宽度
    newRatio(){
      if(this.myMove)return
      let circle = this.$refs.right.offsetHeight
      let maxWidth = this.$refs.imgBox.offsetWidth*0.5
      let width = (100-this.deviceAttrs['open_percentage'])/100*(maxWidth-circle)+circle
      console.log(width,'width')
      console.log(circle)
      
      
      let leftCurtainBox = this.$refs.leftCurtainBox
      let rightCurtainBox = this.$refs.rightCurtainBox
      this.animate(leftCurtainBox,{
        width:Math.round(width)
      })
      this.animate(rightCurtainBox,{
        width:Math.round(width)
      }
      )
      // leftCurtainBox.style.width =width +"px"
      // // console.log(width)
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
    },
    animate(ele,param,callBack,speedTime){
	//callBack没有传递时
	//如果想要传递speedTime
	//这里callBack就是时间
	if(!!callBack && !(callBack instanceof Function)){//!!callBack表示存在并且不是一个函数
		//执行这里说明callBack是一个时间
		speedTime = callBack
		callBack = undefined
	}
	speedTime = speedTime ? speedTime : 10
	//console.log(speedTime);
	clearInterval(ele.timer)
	ele.timer = setInterval(()=>{
		var flag = true//表示所有的属性都到达了目标 值
		for(var attr in param){
			if(attr === "zIndex"){
				//zIndex不需要做任何动画，直接赋值就可以 了
				ele.style[attr] = param[attr]
			}else{
				var current = 0
				if(attr === "opacity"){
					current = this.getStyle(ele,attr)*100
				}else{
					current = parseInt(this.getStyle(ele,attr))
				}
				var speed = (param[attr] - current)/10
				speed = speed > 0 ?  Math.ceil(speed) : Math.floor(speed)
				if(current != param[attr]){
          // console.log(current,param[attr],speed,'222222222')
          
					//属性没有到达 目标 值
					flag = false//最少有一个属性没有到达目标 值
					if(attr === "opacity"){
						ele.style[attr] = (current + speed)/100
					}else{
						ele.style[attr] = (current*100 + speed*100)/100 + "px"
					}
				}
			}
    }
    // console.log(flag,'flag')
    
		if(flag){
			clearInterval(ele.timer)
			//到达了目标值。
			if(callBack){
				callBack()
			}
		}
	},speedTime)
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
          left: 1%;
          width: 49%;
          height: 500px;
          overflow: hidden;
          .curtainLeft{
            top: 0;
            left: 0;
            width: 100%;
            height: 500px;
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
           width: 49%;
           height: 500px;
           right: 1%;
           overflow: hidden;
          .curtainRight{
            top: 0;
            width: 100%;
            height: 500px;
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
