<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']">
      <topbar 
        title="厨房的烟机"
        bak-color="#000" />
      <div class="main center">
        <div :class="[{'animation': !isClose },{'greycircle': isClose },'wrap-circle' ,'center']">
          <p class="wind">风速档位</p>
          <p 
            v-if="!isClose&&!isOffline" 
            class="speed">{{ speedNum }}</p>
          <p 
            v-else 
            class="speed">- -</p>
          <p 
            v-if="!isClose&&!isOffline" 
            class="switch">{{ speedText }}</p>
          <p 
            v-else 
            class="switch">0</p>
        </div>
      </div>
      <div 
        v-show="deviceAttrs.light == 'on'" 
        class="tips">
        <i/>
        <span>照明已开启</span>
      </div>
      <div 
        v-show="deviceAttrs.delay == 'on'" 
        class="tips tips2">
        <i/>
        <span>{{ m1 }}分{{ s1 }}秒后关机</span>
      </div>

      <!-- 按钮 -->
      <div class="panel-btn center">
        <div 
          class="more" 
          @click="handleMore">
          <div :class="[isOpen ? 'up': 'down', 'arrow']">></div>
          <div>{{ isOpen ? '收起' : '查看更多' }}</div>
        </div>

        <div :class="[{'up-index': !isOffline }, 'btn-wrap']">
          <div 
            :class="[{ 'active': !isClose }, 'btn-swich btn center']"
            @click="setSwitch" />
          <div class="btn-name">关机</div>
        </div>
        <div 
          class="btn-wrap"
          @click="setSpeed('low')">
          <div :class="[{ 'active': deviceAttrs.speed == 'low' }, 'btn btn-rs center']" />
          <div class="btn-name">柔速</div>
        </div>
        <div 
          class="btn-wrap"
          @click="setSpeed('overlow')">
          <div :class="[ { 'active': deviceAttrs.speed == 'overlow' }, 'btn btn-ds center']" />
          <div class="btn-name">低速</div>
        </div>
        <div 
          class="btn-wrap"
          @click="setSpeed('normal')">
          <div :class="[ { 'active': deviceAttrs.speed == 'normal' }, 'btn btn-gs center']" />
          <div class="btn-name">高速</div>
        </div>
        
        <div 
          v-show="isOpen" 
          class="btn-wrap"
          @click="setLight()">
          <div
            :class="[{ 'active': deviceAttrs.light == 'on' },'btn-zm', 'btn' ,'center']"/>
          <div class="btn-name">照明</div>
        </div>

        <div 
          v-show="isOpen" 
          :class="[{'disabled':deviceAttrs.speed=='off'&& deviceAttrs.light == 'off' },'btn-wrap']"
          @click="setDelay()">
          <div
            :class="[{ 'active': deviceAttrs.delay == 'on' },'btn', 'btn-yc' ,'center']"/>
          <div class="btn-name">延迟</div>
        </div>
      </div> 
</div></div></template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  data(){
    return {
      // isOffline:false,
      // isClose:false,
      isOpen:false,
      speedNum:0,
      speedText:'关',
      m1:2,
      s1:25
    }
  },
  computed:{
    ...mapGetters(['isClose', 'isOffline']),
    ...mapState(['device', 'deviceAttrs']),
    
  },
  watch:{
    deviceAttrs: {
      handler(newName) {
        switch(newName.speed){
          case "off":
            this.speedNum = 0
            this.speedText = "关"
            break
          case "low":
            this.speedNum = 1
            this.speedText = "柔速"
            break
          case "overlow":
            this.speedNum = 2
            this.speedText = "中速"
            break
          case "normal":
            this.speedNum = 3
            this.speedText = "高速"
            break
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods:{
    ...mapActions(['doControlDevice']),
    setSpeed(val) {
      if (val == this.deviceAttrs.speed) {
        val = 'off'
      }
      if (this.isClose) return  // 关机状态点击无效
      this.controlDevice('speed', val)
    },
    setSwitch(){
      console.log('点击了开关')
       let switchStatus = ''
      if (this.deviceAttrs.switch == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.controlDevice("switch", switchStatus)
      this.controlDevice("light", 'off')
      this.controlDevice("speed", 'off')
      this.controlDevice("delay", 'off')
    },
    setLight(){
      if (this.isClose) return  // 关机状态点击无效
      console.log('点击了灯光')
      let switchStatus = ''
      if (this.deviceAttrs.light == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      console.log(switchStatus,this.isClose)
      this.controlDevice("light", switchStatus)
        .then(() => {
          console.log('setLight success')
        })
    },
    setDelay(){
      if (this.isClose || (this.deviceAttrs.speed=='off'&& this.deviceAttrs.light == 'off')) return  // 关机状态或者风速灯光都没开启点击无效
      console.log('点击了延迟')
      let switchStatus = ''
      if (this.deviceAttrs.delay == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      console.log(switchStatus,this.isClose)
      this.controlDevice("delay", switchStatus)
        .then(() => {
          console.log('setDelay success')
        })
    },
    controlDevice(attr, value) {
      return this.doControlDevice({
        nodeid: `haier_hood.main.${attr}`,
        params: {
          attribute: {
            [attr]: value
          }
        }
      })
    },
    handleMore(){
      this.isOpen = !this.isOpen
    }
  },

}
</script>

<style lang="less" scoped>
@imgPath:"base/haier_hood/assets";
@imgPath1:"base/blend/assets";
@imgPath2:"base/air_cleaner/assets/new-air";
.wrap-circle{
  margin-top: 60px;
  width: 524px;
  height: 524px;
  flex-direction: column;
  font-size: 30px;
  .wind{
    margin-bottom: 40px;
  }
  .speed{
    font-size: 120px
  }
  .switch{
    margin-top: 40px;
  }
}
.animation{
    background: url('~@lib/@{imgPath}/yanji_img_animation.png') no-repeat;
    background-size: 100% 100%;
}
.greycircle{
    background: url('~@lib/@{imgPath}/yanji_img_greycircle.png') no-repeat;
    background-size: 100% 100%;
}

.tips{
  font-size:20px;
  text-align: center;
  i{
       content: "";
        display: inline-block;
        width: 30px;
        height: 30px;
        background-image: url('~@lib/@{imgPath}/yanji_ico_light.png');
        background-size: 100% 100%;
  }
  span{
    width: 100px;
  } 
}
.tips2{
  i{
        background-image: url('~@lib/@{imgPath1}/time-black.png');
  }
}
.panel-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 40px 30px 30px;;
    z-index: 9999;

    background: #ffffff;
    box-shadow: 0 -3px 28px 0 rgba(209, 209, 209, 0.5);
    border-radius: 42px 42px 0px 0px;

    flex-wrap: wrap;
    justify-content: flex-start;

    .more {
      width: 750px;
      color: #9e9e9e;
      font-size: 24px;
      text-align: center;
      position: absolute;
      left: 0;
      top: -100px;
      .arrow {
        font-size: 32px;
        &.up {
          transform: rotate(90deg);
        }
        &.down {
          transform: rotate(-90deg);
        }
      }
    }

    .btn {
      margin-top: 24px;
      width: 100%;
      border-radius: 40px 40px 0 0;
      background: #ffffff;
      box-shadow: 0 -3px 28px 0 rgba(209, 209, 209, 0.5);
      display: flex;
      justify-content: space-evenly;
      align-items: center;
    }
  }
    .disabled{
      opacity: 0.2;
    }
  .btn-wrap {
    margin: 0 24px 24px;
    &.up-index {
      position: relative;
      z-index: 9999;
    }
    .btn {
      box-sizing: border-box;
      margin: 0 auto;
      width: 120px;
      height: 120px;
      border: 1px solid #818181;
      border-radius: 50%;

      display: flex;
      flex-direction: column;
      &.active {
        background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
        border-color: #ffbf00;
      }
    }
    .btn-name {
      text-align: center;
      color: #000;
      margin-top: 16px;
      font-size: 24px;
    }
    .btn-start {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/@{imgPath1}/start.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('~@lib/@{imgPath1}/start.png');
        }
      }
    }

    .btn-zm {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/@{imgPath}/yanji_btn_light.png');
        background-size: 100% 100%;
      }
    }
    .btn-yc {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/@{imgPath1}/time-black.png');
        background-size: 100% 100%;
      }
    }

    .btn-rs {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/@{imgPath}/yanji_btn_fan01.png');
        background-size: 100% 100%;
      }
    }
    .btn-ds {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/@{imgPath}/yanji_btn_fan02.png');
        background-size: 100% 100%;
      }
    }
    .btn-bpsr {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/@{imgPath}/yanji_btn_fan03.png');
        background-size: 100% 100%;
      }
    }
    .btn-gs {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/@{imgPath}/yanji_btn_fan03.png');
        background-size: 100% 100%;
      }
    }

    .btn-swich {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/@{imgPath2}/swich-black.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('~@lib/@{imgPath2}/swich-black.png');
        }
      }
    }
  }
  &.close,
  &.offline {
    &:before {
      content: "";
      position: fixed;
      top: 64px;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 999;
      width: 100%;
      background: rgba(0, 0, 0, 0.1);
    }
    &.page {
      background: #fff;
      .cover {
        background: #fff;
        .point {
          &.left {
            background: #d8d8d8;
          }
        }
      }
    }
    .panel-btn {
      background: #efefef;
    }
    .btn-wrap {
      opacity: 0.2;
      .btn {
        &.active {
          background: #fff;
          border: none;
        }
      }
    }
  
}
</style>


