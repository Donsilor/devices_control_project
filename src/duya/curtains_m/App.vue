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
        </div>
        <div class="ruler">
          <ul>
            <li
              v-for="i in 11"/>
          </ul>
        </div>
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
  watch: {
    'device.stateChange'(){
      this.$nextTick(()=>{
        // if (this.btnActive === 'kai'||this.btnActive === 'guan'||this.btnActive ==='pause') {
        //   this.newRatio()
        // }
        if (this.myMove==false) {
          this.newRatio()
        }
                  //如果窗帘幅度发生改变
        //  if (this.deviceAttrs.open_percentage) {
        //    this.newRatio()
        //  }
        if (this.btnActive === 'kai') {
            this.curtainStatus='opening'
            this.txtShow = 'opening'
        } else if (this.btnActive === 'guan') {
            this.curtainStatus='closing' 
            this.txtShow = 'closing'
        }
         if (this.deviceAttrs.open_percentage=='100') {
           this.curtainStatus='opened'
           this.txtShow = 'opened'
         }
         if (this.deviceAttrs.open_percentage=='0') {
           this.curtainStatus='closed'
           this.txtShow = 'closed'
         }
      })
    },
    'deviceAttrs.open_percentage'(newValue, oldValue) {
      if(this.btnActive != 'pause') {
        if(newValue > oldValue) {
          this.txtShow = 'opening'
          console.log('======',this.txtShow, this.btnActive)
        }
        if(newValue < oldValue) {
          this.txtShow = 'closing'
          console.log('======',this.txtShow, this.btnActive)
        }
        if(newValue == oldValue) {
          this.txtShow = ''
          console.log('======',this.txtShow, this.btnActive)
        }
      }else{
        this.txtShow = ''
        this.btnActive='pause'
        this.curtainStatus=''
      }
      if(this.deviceAttrs.open_percentage == this.range) {
        this.txtShow = ''
        this.myMove = false
      }
      if(this.deviceAttrs.open_percentage == 100) {
        this.txtShow = ''
      }
      if(this.deviceAttrs.open_percentage == 0) {
        this.txtShow = ''
      }
    }
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
      .then(()=>{
          this.newRatio()
          console.log(this.myMove)
      })
      HdSmart.UI.setStatusBarColor(2)
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    setPause() {
      
      console.log(this.myMove)
      this.myMove = false
      this.txtShow = ''
      this.move = false
      this.btnActive = 'pause'
      this.curtainStatus = ''
      this.$refs['btn-pause'].classList.add('active')
      setTimeout(() => {
        this.$refs['btn-pause'].classList.remove('active')
      }, 500)
      clearInterval(this.timeId)
      let maxW = this.$refs.isgray.offsetWidth - 20
      let cover = this.$refs.cover
      let s = cover.offsetWidth-20
      let pauseRange = s/maxW*100
      // console.log('窗帘的最大宽度', maxW)
      // console.log('cover宽度', s)
      console.log('暂停的百分比计算（cover宽度 / 窗帘的最大宽度 * 100）', pauseRange)
      this.controlDevice('switch', 'pause')
      .then(() => {
        this.txtShow = ''
      })
      .catch(() => {
        this.txtShow = ''
      })
    },
    // 全开
    setOpen(){
      this.myMove = false
      this.move = false
      this.btnActive = 'kai'
      this.controlDevice('switch', 'on')
      console.log(this.myMove)
    },
    //全关
    setClose(){
      this.myMove = false
      this.move = false
      this.btnActive = 'guan'
      this.controlDevice('switch', 'off')
      console.log(this.myMove)
    },
    touchStart(e){
      this.myMove = true
      this.btnActive = ''
      console.log(e)
      console.log(e.targetTouches[0].pageX,'touchStart')
      this.start = e.targetTouches[0].pageX
      console.log(this.myMove)
    },
    touchMove(e){
      this.myMove = true
      e.stopPropagation()
      e.preventDefault()
      let cover = this.$refs.cover
      let w = e.targetTouches[0].pageX - cover.offsetLeft
      let maxW = this.$refs.isgray.offsetWidth
      w=w<=20?20:w
      w=w>=maxW?maxW :w
      cover.style.width = w+"px"
      this.coverWidth=w-20
      console.log(this.myMove)
    },
    touchEnd(e){
        this.end = e.changedTouches[0].pageX
        if(this.start !=  this.end ){
          console.log('滑动了')
          this.move = true
        }
      e.stopPropagation()
      e.preventDefault()
      let maxW = this.$refs.isgray.offsetWidth-20
      this.range = 100-Math.round(this.coverWidth/maxW*100)
      console.log(this.coverWidth)
      console.log(maxW)
      console.log(this.range)
      this.controlDevice('open_percentage', this.range)
      this.myMove = true
      console.log(this.myMove)
      
    },
    newRatio(){
       // let maxW = this.$refs.isgray.offsetWidth-14
       if(this.myMove)return
       console.log('执行了')
       let maxW = document.querySelector('.isgray').clientWidth-20
      console.log('窗帘的最大宽度api', maxW)
      this.coverWidth = (100-this.deviceAttrs.open_percentage)/100*maxW
      console.log(this.deviceAttrs.open_percentage,1111111111)
      
      let cover = this.$refs.cover
       cover.style.width = this.coverWidth +20+"px"
      console.log('窗帘的赋值宽度为', this.coverWidth+"px")
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
    &.center {
      flex-direction: column;
    }
    .cover{
      width: 572px;
      height: 204px;
      left: 0;
      top: 0px;
      background-image: linear-gradient(-90deg, #E5B864 3%, #F1CB85 52%);
      border-radius: 1px;
      position: absolute;
      clip:rect(0px 572px 204px 0px);
      .touchbox{
        // width: 28px;
        width: 40px;
        height: 204px;
        position: absolute;
        top: 50%;
        right: 0px;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        justify-content: center;
        .touch{
          width: 12px;
          height: 65px;
          border-left: 2px solid #BF954C;
          border-right: 2px solid #BF954C;
        }
      }
      &.move{
        transition: 5s linear;
      }
      &.openCurtains{
        animation: open 5s linear;
      }
      &.closeCurtains{
        animation: close 5s linear;
      }
      &.pause{
        animation-play-state: paused;
      }
      @-webkit-keyframes open {
        0% {
          width: 0px;
        }
        100% {
          width: 572px;
        }
      }
      @-webkit-keyframes close {
          0% {
          width: 572px;
        }
        100% {
          width: 28px;
        }
      }

    }
    .isgray {
      width: 76%;
      height: 204px;
      // background: rgb(234, 235, 238);
      background: rgba(0, 0, 0,0.1);
      border-radius: 1px;
      margin-top: 15vh;
      position: relative;
    }
    .ruler{
      // width: 572px;
      width: 562px;
      height: 60px;
      margin-top: 34px;
      ul{
        width: 100%;
        padding: 0 28px;
        // padding-left: 28px;
        display: flex;
        justify-content: space-between;
        li{
          width: 1px;
          height: 24px;
          background-color: rgba(0, 0, 0,.26);
          position: relative;
          &::before{
            position: absolute;
            top: 30px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 24px;
            color: #000;
          }
          &:first-child::before{
            content: "0";
          }
          &:nth-child(3)::before{
            content: "20";
          }
          &:nth-child(5)::before{
            content: "40";
          }
           &:nth-child(7)::before{
            content: "60";
          }
           &:nth-child(9)::before{
            content: "80";
          }
           &:nth-child(11)::before{
            content: "100";
          }
        }

      }
    }
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
        background: #000000;
        &.btn-open::before{
          background-image: url('~@lib/@{imgPath}/dakai2@2x.png');
          background-size: 100% 100%;
        }
        &.btn-pause::before{
          background-image: url('~@lib/@{imgPath}/zanting2@2x.png');
          background-size: 100% 100%;
        }
        &.btn-close::before{
          background-image: url('~@lib/@{imgPath}/guanbi2@2x.png');
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
        background-image: url('~@lib/@{imgPath}/dakai@2x.png');
        background-size: 100% 100%;
      }
    }
    .btn-pause {
      &::before {
        background-image: url('~@lib/@{imgPath}/zanting@2x.png');
        background-size: 100% 100%;
      }
    }
    .btn-close {
      &::before {
        background-image: url('~@lib/@{imgPath}/guanbi@2x.png');
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
