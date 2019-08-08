<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']">
      <topbar 
        title="厨房的烟机"
        bak-color="#000" />
      <div class="main center">
        <div class="wrap-circle center">
          <p class="wind">风速档位</p>
          <p class="speed">{{ !isClose?deviceAttrs.speed_pct:"- -" }}</p>
          <p class="switch">关</p>
        </div>
      </div>
      <div class="tips">
        <i/>
        <span>照明已开启</span>
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
          @click="setMode('dy_expansion')">
          <div :class="[{ 'active': deviceAttrs.mode == 'dy_expansion' }, 'btn btn-rs center']" />
          <div class="btn-name">柔速</div>
        </div>
        <div 
          class="btn-wrap"
          @click="setMode('heat_keep')">
          <div :class="[ { 'active': deviceAttrs.mode == 'heat_keep' }, 'btn btn-ds center']" />
          <div class="btn-name">低速</div>
        </div>
        <div 
          class="btn-wrap"
          @click="setMode('sterilization')">
          <div :class="[ { 'active': deviceAttrs.mode == 'sterilization' }, 'btn btn-gs center']" />
          <div class="btn-name">高速</div>
        </div>
        
        <div 
          v-show="isOpen" 
          class="btn-wrap">
          <div
            class="btn-zm btn center"/>
          <div class="btn-name">照明</div>
        </div>

        <div 
          v-show="isOpen" 
          class="btn-wrap">
          <div
            class="btn btn-yc center"/>
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
      isOpen:false
    }
  },
  computed:{
    ...mapGetters(['isClose', 'isOffline']),
    ...mapState(['device', 'deviceAttrs']),
    
  },
  methods:{
    ...mapActions(['doControlDevice']),
    setMode(val) {
      if (val == this.deviceAttrs.mode) {
        val = 'free'
      }
      // if (this.isClose) return
      // this.controlDevice('mode', val)
    },
    setSwitch(){
      console.log('点击了开关')
       let switchStatus = ''
      if (this.deviceAttrs.switch == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      console.log(switchStatus,this.isClose)
      this.controlDevice("switch", switchStatus)
        .then(() => {
          console.log('setSwitch success')
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
@lib:"../../../lib/base/haier_hood/assets";
@lib1:"../../../lib";
.wrap-circle{
  margin-top: 60px;
  background: url('@{lib}/yanji_img_animation.png') no-repeat;
  background-size: 100% 100%;
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

.tips{
  font-size:20px;
  text-align: center;
  i{
       content: "";
        display: inline-block;
        width: 30px;
        height: 30px;
        background-image: url('@{lib}/yanji_ico_light.png');
        background-size: 100% 100%;
  }
  span{
    width: 100px;
  } 
}
.panel-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 38px 0;
    z-index: 9999;

    background: #ffffff;
    box-shadow: 0 -3px 28px 0 rgba(209, 209, 209, 0.5);
    border-radius: 42px 42px 0px 0px;

    flex-wrap: wrap;
    justify-content: center;

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
        background-image: url('@{lib1}/base/blend/assets/start.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib1}/base/blend/assets/start.png');
        }
      }
    }

    .btn-zm {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/yanji_btn_light.png');
        background-size: 100% 100%;
      }
    }
    .btn-yc {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/blend/assets/time-black.png');
        background-size: 100% 100%;
      }
    }
    .btn-rs {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/yanji_btn_fan01.png');
        background-size: 100% 100%;
      }
    }
    .btn-ds {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/yanji_btn_fan02.png');
        background-size: 100% 100%;
      }
    }
    .btn-bpsr {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/yanji_btn_fan03.png');
        background-size: 100% 100%;
      }
    }
    .btn-gs {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib}/yanji_btn_fan03.png');
        background-size: 100% 100%;
      }
    }

    .btn-swich {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/air_cleaner/assets/new-air/swich-black.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib1}/base/air_cleaner/assets/new-air/swich-black.png');
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


