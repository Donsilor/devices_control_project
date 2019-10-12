/* eslint-disable vue/no-unused-vars */
<template>
  <div class="body">
    <div class="page">
      <topbar 
        :title="device.device_name"
        bak-color="#000" />
      <div class="main center">
        <div 
          ref="isgray" 
          class="isgray" >
          <div 
            ref="cover" 
            :class="[{'openCurtains':deviceAttrs.open_pencentage == 100},'cover']">
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
        <div class="status">正在打开窗帘</div>
      </div>
      <!-- 底部按钮 -->
      <div class="panel-btn center">
        <div class="btn-wrap">
          <div 
            :class="[{'active':deviceAttrs.open_pencentage == 100},'btn-open btn center']"
            @click="setMode(100)" />
          <div class="btn-name">全开</div>
        </div>
        <div class="btn-wrap">
          <div 
            :class="[{'active':deviceAttrs.switch == 'pause'},'btn-pause btn center']"
            @click="setPause" />
          <div class="btn-name">暂停</div>
        </div>
        <div 
          class="btn-wrap"
        >
          <div 
            :class="[{ 'active': deviceAttrs.open_pencentage == 0 }, 'btn btn-close center']" 
            @click="setMode(0)" />
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
       target_percentage: 50,
      // 点击中部到指定幅度按钮显示的信息
      coverWidth:""
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
         this.newRatio()
      })
    }
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
      .then(()=>{
          this.newRatio()
      })
      // HdSmart.UI.setStatusBarColor(2)
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    setPause() {
      this.controlDevice("switch", 'pause')
      this.controlDevice("open_pencentage", this.target_percentage)
    },
    setMode(val) {
      this.controlDevice('open_pencentage', val)
      this.controlDevice('switch', 'on')
    },
    touchStart(e){
      console.log(e)
    },
    touchMove(e){
      e.stopPropagation()
      e.preventDefault()
      let cover = this.$refs.cover
      let w = e.targetTouches[0].pageX - cover.offsetLeft
      let maxW = this.$refs.isgray.offsetWidth
      w=w<=14?14:w
      w=w>=maxW?maxW :w
      // cover.style.width = w/37.5+"rem"
      cover.style.width = w+"px"
      this.coverWidth=w-14
    },
    touchEnd(e){
      e.stopPropagation()
      e.preventDefault()
      let maxW = this.$refs.isgray.offsetWidth-14
      let range =Math.round(this.coverWidth/maxW*100)
      console.log(this.coverWidth)
      console.log(maxW)
      
      console.log(Math.round(range))      
      this.controlDevice('open_pencentage', range)
    },
    newRatio(){
       let maxW = this.$refs.isgray.offsetWidth
      this.ratio = this.deviceAttrs.open_pencentage/100*maxW
      console.log(this.ratio,'aaaa')
      let cover = this.$refs.cover
       cover.style.width = this.ratio+"px"
      // let touchbox = document.querySelectorAll(".touchbox")[0] 
      // let coverlight = document.querySelectorAll(".coverlight")[0]    
      // touchbox.style.top = ((100-this.ratio)/100*185)/37.5 +"rem"
      // coverlight.style.clip = `rect(${((100-this.ratio)/100*185)/37.5 +"rem"} ${320/37.5 +'rem'} ${450/37.5 +'rem'} 0)`
    },
    controlDevice(attr, value) {
      return this.doControlDevice({
        nodeid: `curtain.main.${attr}`,
        params: {
          attribute: {
            [attr]: value
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
  background-image: url('~@lib/@{imgPath}/bg_01@2x.png');
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
        width: 28px;
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
      &.openCurtains{
        animation: open 5s linear;
      }
      @keyframes open {
        0% {
          width: 0px;
        }
        100% {
          width: 572px;
        }
      }
      
    }
    .isgray {
      width: 572px;
      height: 204px;
      background: rgb(234, 235, 238);
      border-radius: 1px;
      margin-top: 25vh;
      position: relative;
    }
    .ruler{
      width: 572px;
      height: 60px;
      margin-top: 34px;
      ul{
        width: 100%;
        // padding: 0 28px;
        padding-left: 28px;
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
      background: rgba(136, 138, 137,.4);
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
      .btn {
        &.active {
           &.active {
        background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
        border-color: #ffbf00;
      }
        }
      }
    }
  }
</style>
