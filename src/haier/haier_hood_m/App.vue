<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']">
      <topbar 
        title="厨房的烟机"
        bak-color="#000" />
      <div class="main center">
        <div class="wrap-circle center">
          <p class="wind">风速档位</p>
          <p class="speed">0</p>
          <p class="switch">关</p>
        </div>
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
          <div :class="[ { 'active': deviceAttrs.mode == 'sterilization' }, 'btn btn-zs center']" />
          <div class="btn-name">中速</div>
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
      isOffline:false,
      isClose:false,
      isOpen:false
    }
  },
  computed:{
    ...mapState(['device', 'deviceAttrs'])
  },
  methods:{
    setMode(){

    },
    setSwitch(){

    },
    handleMore(){
      this.isOpen = !this.isOpen
    }
  }

}
</script>

<style lang="less" scoped>
@lib:"../../../lib/base/haier_hood/assets";
@lib1:"../../../lib";
.wrap-circle{
  margin-top: 166px;
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
    .btn-stop {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/blend/assets/btn-stop.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib1}/base/blend/assets/btn-stop.png');
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
    .btn-zs {
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
    .btn-mode {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/blend/assets/btn-mode1.png');
        background-size: 100% 100%;
      }
    }
    .btn-low {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/air_cleaner/assets/new-air/speed1.png');
        background-size: 100% 100%;
      }
    }
    .btn-middle {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/air_cleaner/assets/new-air/speed2.png');
        background-size: 100% 100%;
      }
    }
    .btn-high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/air_cleaner/assets/new-air/speed3.png');
        background-size: 100% 100%;
      }
    }
    .btn-very_high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/air_cleaner/assets/new-air/speed4.png');
        background-size: 100% 100%;
      }
    }
    .btn-super_high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/air_cleaner/assets/new-air/speed5.png');
        background-size: 100% 100%;
      }
    }
    .btn-more {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/air_cleaner/assets/new-air/more.png');
        background-size: 100% 100%;
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


.btns-panel {
  &:before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 99999;
    width: 100%;

    background: rgba(0, 0, 0, 0.8);
  }
  .items {
    position: fixed;
    left: 510px;
    top: 950px;
    z-index: 999999;

    width: 750px;
    min-height: 160px;
    .btn {
      transition: all 0.3s ease-in-out;
      position: absolute;
      top: 0;
      left: 0;
    }
    .item1 {
      top: -122px;
      left: 88px;
    }
    .item2 {
      top: -122px;
      left: -76px;
    }
    .item3 {
      top: 20px;
      left: -150px;
    }
    .item4 {
      top: 155px;
      left: -94px;
    }
    .item5 {
      top: 150px;
      left: 50px;
    }
  }
  &.more {
    .items {
      left: 384px;
    }
  }
  .btns {
    justify-content: flex-start;
    transition: all 0.3s ease-in-out;
    margin-top: 57px;
    .btn {
      margin-right: 40px;
      width: 120px;
      height: 120px;
      border: 1px solid #fff;
      border-radius: 50%;

      display: flex;
      flex-direction: column;

      .name {
        margin-top: 8px;
        font-size: 20px;
        color: #fff;
      }
      &.active {
        background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
        border-color: #ffbf00;
      }
    }
    .btn-swich {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/air_cleaner/assets/new-air/swich-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib1}/base/air_cleaner/assets/new-air/swich-black.png');
        }
      }
    }

    .btn-low {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/air_cleaner/assets/new-air/speed1-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib1}/base/air_cleaner/assets/new-air/speed1.png');
        }
      }
    }
    .btn-middle {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/air_cleaner/assets/new-air/speed2-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib1}/base/air_cleaner/assets/new-air/speed2.png');
        }
      }
    }
    .btn-high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/air_cleaner/assets/new-air/speed3-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib1}/base/air_cleaner/assets/new-air/speed3.png');
        }
      }
    }
    .btn-very_high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/air_cleaner/assets/new-air/speed4-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib1}/base/air_cleaner/assets/new-air/speed4.png');
        }
      }
    }
    .btn-super_high {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/air_cleaner/assets/new-air/speed5-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib1}/base/air_cleaner/assets/new-air/speed5.png');
        }
      }
    }
  }
}
.items {
  margin-bottom: 30px;
  .btns {
    display: flex;
    justify-content: center;
    justify-content: flex-start;
    padding: 10px 30px;
    .btn-wrap {
      margin-right: 20px;
    }

    .btn-name {
      margin-top: 16px;
      font-size: 24px;
      color: #20282b;
      text-align: center;
    }

    .btn {
      box-sizing: border-box;
      margin: 0 5px;
      width: 110px;
      height: 110px;
      border: 1px solid #20282b;
      border-radius: 50%;

      display: flex;
      flex-direction: column;
      &.active {
        background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
        border: none;
      }
    }
    .btn-swich {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/air_condition/assets/new-air/swich-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib1}/base/air_condition/assets/new-air/swich-black.png');
        }
      }
    }
    .btn-start {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/haier_washer/assets/btn-start.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib1}/base/haier_washer/assets/btn-stop.png');
        }
      }
    }
    .btn-stop {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/haier_washer/assets/btn-stop.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib1}/base/haier_washer/assets/btn-stop.png');
        }
      }
    }
    .btn-mode {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/haier_washer/assets/btn-mode-white58.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib1}/base/haier_washer/assets/btn-mode-black58.png');
        }
      }
    }
    .btn-time {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/air_condition/assets/new-air/time-white.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib1}/base/air_condition/assets/new-air/time-black.png');
        }
      }
      &.btn-current {
        border-color: #ffc600;
        &::before {
          background-image: url('@{lib1}/base/air_condition/assets/new-air/time-yellow.png');
        }
        .name {
          color: #ffc600;
        }
      }
    }

    .btn-mode1 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/blend/assets/btn-mode1.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib1}/base/blend/assets/btn-mode1.png');
        }
      }
    }
    .btn-mode2 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/blend/assets/btn-mode2.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib1}/base/blend/assets/btn-mode2.png');
        }
      }
    }
    .btn-mode3 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/blend/assets/btn-mode3.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib1}/base/blend/assets/btn-mode3.png');
        }
      }
    }
    .btn-mode4 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/blend/assets/btn-mode4.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib1}/base/blend/assets/btn-mode4.png');
        }
      }
    }
    .btn-mode5 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/blend/assets/btn-mode5.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib1}/base/blend/assets/btn-mode5.png');
        }
      }
    }
    .btn-mode6 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/blend/assets/btn-mode6.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib1}/base/blend/assets/btn-mode6.png');
        }
      }
    }
    .btn-mode7 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/blend/assets/btn-mode7.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib1}/base/blend/assets/btn-mode7.png');
        }
      }
    }
    .btn-mode8 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/blend/assets/btn-mode8.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib1}/base/blend/assets/btn-mode8.png');
        }
      }
    }
    .btn-mode9 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/blend/assets/btn-mode9.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib1}/base/blend/assets/btn-mode9.png');
        }
      }
    }
    .btn-mode10 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('@{lib1}/base/blend/assets/btn-mode10.png');
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url('@{lib1}/base/blend/assets/btn-mode10.png');
        }
      }
    }
  }
}
</style>


