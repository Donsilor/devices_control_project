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
            class="btn btn-close center"
            @touchstart ="touchstart('light')"
            @touchend="touchend('light')"/>
          <div class="btn-name">照明</div>
          <div class="btn-name">次日13:25结束</div>
        </div>
        <div class="btn-wrap">
          <div
            ref="pause"
            class="btn-pause btn center"
            @touchstart ="touchstart('pause')"
            @touchend="touchend('pause')"/>
          <div class="btn-name">风干</div>
          <div class="btn-name">次日13:25结束</div>
        </div>
        <div class="btn-wrap">
          <div
            ref="open"
            class="btn-open btn center"
            @touchstart ="touchstart('open')"
            @touchend="touchend('open')"/>
          <div class="btn-name">杀菌</div>
          <div class="btn-name">次日13:25结束</div>
        </div>
      </div>

    </div>
</div></template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      checkboxVal: true
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
      if(attr!='control'){
        this.$refs[attr].classList.add('animateEnd')
        this.$refs[attr].classList.add('yellowExtend')
        this.$refs[attr].classList.remove('animateStart')
        setTimeout(() => {
          this.$refs[attr].classList.remove('animateEnd')
        }, 300)
      }
    
      switch (attr) {
        case 'control':
          this.controlDevice('control',val)
          break
      
        default:
          break
      }
    
  
    },
    // 返回主页
    setBack(val){
      HdSmart.UI.vibrate()
      this.controlDevice('button',val)
    },
    getToggle(val) {
      return val === "on" ? "off" : "on"
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
        &.btn-open::before{
          background-image: url('~@lib/@{imgPath}/lyj_btn_shajun.png');
          background-size: 100% 100%;
        }
        &.btn-pause::before{
          background-image: url('~@lib/@{imgPath}/lyj_btn_fenggan.png');
          background-size: 100% 100%;
        }
        &.btn-close::before{
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

    .btn-open {
      &::before {
        background-image: url('~@lib/@{imgPath}/lyj_btn_shajun.png');
        background-size: 100% 100%;
      }
    }
    .btn-pause {
      &::before {
        background-image: url('~@lib/@{imgPath}/lyj_btn_fenggan.png');
        background-size: 100% 100%;
      }
    }
    .btn-close {
      &::before {
        background-image: url('~@lib/@{imgPath}/lyj_btn_zhaoming.png');
        background-size: 100% 100%;
      }
    }
  }
  
</style>