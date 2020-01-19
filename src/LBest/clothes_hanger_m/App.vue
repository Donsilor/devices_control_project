<template>
  <div class="body">
    <div 
      :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']" 
    >
      <NewTopBar
        :title="device.device_name"
        :room="device.room_name"
        :scroll="true"
        bak-color="#000"
        page-class=".page"
      />
      <StatusTip/>
      <div class="main center"> 
        <div class="control">
          <div 
            :class="['box' ,'box-s',{'active':deviceAttrs.control=='up'}]" 
            @touchstart ="touchstart('control','up')"
            @touchend="touchend('control','up')">
            <div class="box-s-img"/>
            <span>上升</span>  
          </div>
          <div 
            :class="['box' ,'box-z',{'active':deviceAttrs.control=='down'}]" 
            @touchstart ="touchstart('control','down')"
            @touchend="touchend('control','down')">
            <div class="box-z-img"/>
            <span>暂停</span>  
          </div>

          <div 
            :class="['box' ,'box-x',{'active':deviceAttrs.control=='pause'}]" 
            @touchstart ="touchstart('control','pause')"
            @touchend="touchend('control','pause')">
            <div class="box-x-img"/>
            <span>下降</span>  
          </div>
        </div>

        <div class="status">{{ deviceAttrs.status|statusText }}</div>
      </div>
      <div class="panel-btn center">
        <div
          class="btn-wrap"
        >
          <div
            ref="light"
            :class="['btn', 'btn-light' ,'center',{'active':deviceAttrs.light=='on'}]"
            @touchstart ="touchstart('light')"
            @touchend="touchend('light')"/>
          <div class="btn-name">照明</div>
          <div class="btn-name">次日13:25结束</div>
        </div>
        <div class="btn-wrap">
          <div
            ref="dryingAll"
            :class="['btn', 'btn-dryingAll' ,'center',{'active':deviceAttrs.drying=='on'||deviceAttrs.air_drying=='on'}]"
            @touchstart ="touchstart('dryingAll')"
            @touchend="touchend('dryingAll')"/>
          <div class="btn-name">{{ deviceAttrs|dryingText }}</div>
          <div class="btn-name">次日13:25结束</div>
        </div>
        <div class="btn-wrap">
          <div
            ref="sterilization"
            :class="['btn', 'btn-sterilization' ,'center',{'active':deviceAttrs.sterilization=='on'}]"
            @touchstart ="touchstart('sterilization')"
            @touchend="touchend('sterilization')"/>
          <div class="btn-name">杀菌</div>
          <div class="btn-name">次日13:25结束</div>
        </div>
      </div>
      <div 
        ref="synopsisD" 
        class="synopsisD">
        <div 
          class="drying" 
          @click="setDrying('drying')">热风干</div>
        <div 
          class="air_drying" 
          @click="setDrying('air_drying')">冷风干</div>
        <div 
          class="rest" 
          @click="synopsisResetFn">取消</div>
      </div>
      <div 
        v-show="maskShow" 
        class="mask" 
        @click="synopsisResetFn"/>

    </div>
</div></template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      checkboxVal: true,
      maskShow:false
    }
  },
  computed: {
    ...mapGetters(['isClose', 'isOffline']),
    ...mapState(['device', 'deviceAttrs']),
  },
  watch: {
    "device.stateChange"(){
    },
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
        .then((res) => {
          console.log(res,'aaa')
          
        })
      HdSmart.UI.setStatusBarColor(2)
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    touchstart(attr) {
      console.log(this.deviceAttrs,'sdsd')
      
      if(this.isOffline)return   
     
      if(attr!='control'){
        this.$refs[attr].classList.add('animateStart')
      }     
      
    },
    touchend(attr,val){ 
      // if (val == 'switchStatus') {
      //   if (this.isOffline) return
      // }else{
      //   if (this.deviceAttrs.switchStatus=='off'||this.isOffline) return
      // }
      let btn = document.querySelectorAll('.btn')

       for(let i=0;i<btn.length;i++){
        btn[i].classList.remove('yellowExtend')
      } 
      this.$refs[attr].classList.remove('animateStart')

      if(attr!='control'&&attr!='dryingAll'){
        console.log(attr,';e')
        
        this.$refs[attr].classList.add('animateEnd')
        this.$refs[attr].classList.add('yellowExtend')
        setTimeout(() => {
          this.$refs[attr].classList.remove('animateEnd')
        // this.$refs[attr].classList.remove('yellowExtend')

        }, 300)
      }
    console.log(attr,'atrr11111')
    
      switch (attr) {
        case 'control':
          console.log(1)
          
          this.controlDevice('control',val)
          break
        case 'dryingAll':
          console.log(2)
          
          this.synopsisFn()
          break
        default:
          console.log(3)
          
          this.controlDevice(attr,this.getToggle(this.deviceAttrs[attr]))
          break
      }
    
  
    },
    // 返回主页
    setBack(val){
      HdSmart.UI.vibrate()
      this.controlDevice('button',val)
    },
    setDrying(attr){
      this.controlDevice(attr,'on')
      this.synopsisResetFn()
      this.$refs['dryingAll'].classList.add('animateEnd')
      this.$refs['dryingAll'].classList.add('yellowExtend')
    },
    getToggle(val) {
      return val === "on" ? "off" : "on"
    },
    synopsisFn(){
      if(this.deviceAttrs.drying == 'on'){
        this.controlDevice('drying','off')
      }else if(this.deviceAttrs.air_drying == 'on'){
        this.controlDevice('air_drying','off')
      }else{
        this.$refs.synopsisD.classList.remove('b')
        this.$refs.synopsisD.classList.add('a')
        this.maskShow = true
      }
      console.log('点击了')
    
    },
    synopsisResetFn(){

      this.maskShow = false
      this.$refs.synopsisD.classList.remove('a')
      this.$refs.synopsisD.classList.add('b')
      // this.isShowAll=false

    },
    controlDevice(attr, value) {
      let param = {}
      return this.doControlDevice({
        nodeid: `clothes_hanger.main.${attr}`,
        params: {
          attribute: {
            [attr]: value,
            ...param
          }
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
@imgPath:"base/clothes_hanger/new";
.mask{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 9999;
}
.synopsisD{
  width: 100%;
  height: 380px;
  position:fixed;
  bottom: -380px;
  left: 0;
  z-index: 10000;
  background: #F8F8F8;
  div{
    height: 120px;
    background: #fff;
    font-family: PingFangSC-Light;
    font-size: 32px;
    color: #000000;
    text-align: center;
    line-height:  120px;
  }
  .air_drying{
    margin: 2px 0 18px 0
  }
}
 .a{
    animation: bottom .2s linear;
    animation-fill-mode : forwards
  }
   @keyframes bottom {
      from {
            bottom: -1010px;
      }
      to {
            bottom: 0;
      }
  }
  .b{
    animation: bottomReset .2s linear;
    animation-fill-mode : forwards

  }
   @keyframes bottomReset {
      from {
            bottom: 0;
      }
      to {
            bottom: -1010px;
      }
      //  from {
      //       bottom: -966px;
      // }
  }
  .page {
    height: 100vh;
  &::before{
    content: "";
    background-image: url('~@lib/base/konka_tv/assets/img_bg.png');
    background-repeat:no-repeat;
    background-size: 100% 100%;
    position: fixed;
    top:0;
    left: 0; 
    right: 0;
    bottom: 0;
    z-index: -1;
  }
  &::-webkit-scrollbar {
		display: none;
	}
  &.filter {
    filter: blur(12px);
  }
  .main {
    margin-top:95px;
    .control{
      background: rgba(0,0,0,0.05);
      border-radius: 200px;
    }
    .box{
      width: 252px;
      height: 240px;
      text-align: center;
      font-family: PingFangSC-Light;
      font-size: 24px;
      color: #000000;
      text-align: center;
       display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      &.active{
        background: rgba(0,0,0,0.05);
      }
      span{
        margin-top: 10px;
      }
      .box-s-img{
        width: 36px;
        height: 28px;
        background-image: url('~@lib/@{imgPath}/lyj_btn_sheng.png');
        background-size: 100% 100%;
      }
      .box-z-img{
        width: 36px;
        height: 28px;
        background-image: url('~@lib/@{imgPath}/lyj_btn_zanting.png');
        background-size: 100% 100%;
      }
      .box-x-img{
        width: 36px;
        height: 28px;
        background-image: url('~@lib/@{imgPath}/lyj_btn_jiang.png');
        background-size: 100% 100%;
      }
    }
    .box-s{
      border-radius: 200px 200px 0 0;
    }
    .box-z{
      position: relative;
      &::before{
        content: "";
        width: 204px;
        height: 1px;
        position: absolute;
        top: 0;
        background: rgba(0,0,0,0.10);
      }
      &::after{
        content: "";
        width: 204px;
        height: 1px;
        position: absolute;
        bottom: 0;
        background: rgba(0,0,0,0.10);
      }
    }
    .box-x{
      border-radius:  0 0 200px 200px;
    }
    &.center{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    .status{
      font-family: PingFangSC-Light;
      font-size: 32px;
      color: #000000;
      text-align: center;
      margin: 48px 0 167px 0;
    }
      /*********** 按钮 ***********/
  }
}

.panel-btn {
    height: auto;
    width: 100%;
    // position: fixed;
    bottom: 40px;
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
        // background: #E1B96E;
        &.btn-sterilization::before{
          background-image: url('~@lib/@{imgPath}/lyj_btn_shajun.png');
          background-size: 100% 100%;
        }
        &.btn-dryingAll::before{
          background-image: url('~@lib/@{imgPath}/lyj_btn_fenggan.png');
          background-size: 100% 100%;
        }
        &.btn-light::before{
          background-image: url('~@lib/@{imgPath}/lyj_btn_zhaoming.png');
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
      height: 40px;;
      // opacity: .5;
    }

    .btn-sterilization {
      &::before {
        background-image: url('~@lib/@{imgPath}/lyj_btn_shajun.png');
        background-size: 100% 100%;
      }
    }
    .btn-dryingAll {
      &::before {
        background-image: url('~@lib/@{imgPath}/lyj_btn_fenggan.png');
        background-size: 100% 100%;
      }
    }
    .btn-light {
      &::before {
        background-image: url('~@lib/@{imgPath}/lyj_btn_zhaoming.png');
        background-size: 100% 100%;
      }
    }
  }
  
</style>