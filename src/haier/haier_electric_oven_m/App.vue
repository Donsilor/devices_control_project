<template>
  <div class="body">
    <div :class="[{'minHeight': isOpen && isMin}, {'offline': isOffline }, {'close': isClose}, 'page']">
      <!-- 顶部 -->
      <topbar
        title="电烤箱"
        bg-color="#fff"
        bak-color="#000" />
      <!-- 圆圈 -->
      <div class="main center">
        <div class="bg center">
          <div :class="['circle', {'start': deviceAttrs.mode == 'start' && !isClose }]"/>
          <div class="bg-middle center">
            <div :class="['circle', {'start': deviceAttrs.mode == 'start' && !isClose }]"/>
            <div
              v-if="isClose"
              class="bg2 center">
              <div class="temperature opac">--<sup>°C</sup></div>
              <div class="cmodeNo"/>
            </div>
            <div
              v-else
              class="bg2 center">
              <div class="temperature">126<sup>°C</sup></div>
              <div class="cmode"/>
            </div>

            <div class="bg2 pos-ab">
              <i class="circle-arrow" />
            </div>
          </div>
        </div>
        <div class="operator reduce"/>
        <div class="operator plus"/>
      </div>
      <!-- 信息 -->
      <div class="control center">
        <div v-show="!isClose">
          <div class="baking">正在烘焙 &nbsp;快速预热</div>
          <div class="bakingTime">烘焙时间 : &nbsp;30分10秒</div>
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
            :class="[{ 'active': !isClose }, 'btn-switch btn center']"
            @click="setSwitch" />
          <div class="btn-name">开关</div>
        </div>

        <div
          class="btn-wrap"
          @click="setMode('start')">
          <div :class="[{ 'active': deviceAttrs.mode == 'start' }, 'btn btn-start center']" />
          <div class="btn-name">启动</div>
        </div>
        <div
          class="btn-wrap"
          @click="showMode">
          <div :class="[{ 'active': deviceAttrs.mode == 'mode' }, 'btn btn-mode center']" />
          <div class="btn-name">模式</div>
        </div>
        <div
          class="btn-wrap"
          @click="showTime">
          <div :class="[{ 'active': deviceAttrs.mode == 'time' }, 'btn btn-time center']" />
          <div class="btn-name">时间</div>
        </div>

        <div
          v-show="isOpen"
          class="btn-wrap"
          @click="setMode('preheat')">
          <div :class="[{ 'active': deviceAttrs.mode == 'preheat' }, 'btn btn-preheat center']" />
          <div class="btn-name">快速预热</div>
        </div>
        <div
          v-show="isOpen"
          class="btn-wrap">
          <div :class="['btn center bor']" />
          <div class="btn-name"/>
        </div>
        <div
          v-show="isOpen"
          class="btn-wrap">
          <div :class="['btn center bor']" />
          <div class="btn-name"/>
        </div>
        <div
          v-show="isOpen"
          class="btn-wrap">
          <div :class="['btn center bor']" />
          <div class="btn-name"/>
        </div>
      </div>
    </div>
    <!-- 定时弹框 -->
    <SelectTime
      ref="time"
      @selectedTime="setReserve" />
    <!-- 模式选择弹框 -->
    <SelectModal
      v-model="seletModal"
      title="选择模式">
      <div class="items">
        <div class="btns">
          <div
            class="btn-wrap"
            @click="setMode('grains')">
            <div :class="[{ 'active': deviceAttrs.mode == 'grains'},{'btn-loading': btnLoading.grains }, 'btn btn-mode1 center']" />
            <div class="btn-name">上内</div>
          </div>

          <div
            class="btn-wrap"
            @click="setMode('rice_paste')">
            <div :class="[{ 'active': deviceAttrs.mode == 'rice_paste'}, {'btn-loading': btnLoading.rice_paste }, 'btn btn-mode2 center']"/>
            <div class="btn-name">上内+风</div>
          </div>

          <div
            class="btn-wrap"
            @click="setMode('gruel')">
            <div :class="[{ 'active': deviceAttrs.mode == 'gruel' }, {'btn-loading': btnLoading.gruel }, 'btn btn-mode3 center']"/>
            <div class="btn-name">上内+上外</div>
          </div>
          <div
            class="btn-wrap"
            @click="setMode('pottage')">
            <div :class="[{ 'active': deviceAttrs.mode == 'pottage' }, {'btn-loading': btnLoading.pottage }, 'btn btn-mode4 center']"/>
            <div class="btn-name">上内+下</div>
          </div>
        </div>
      </div>
      <div class="items">
        <div class="btns">
          <div
            class="btn-wrap"
            @click="setMode('grains1')">
            <div :class="[{ 'active': deviceAttrs.mode == 'grains1'},{'btn-loading': btnLoading.grains }, 'btn btn-mode5 center']" />
            <div class="btn-name">上下+风</div>
          </div>

          <div
            class="btn-wrap"
            @click="setMode('rice_paste1')">
            <div :class="[{ 'active': deviceAttrs.mode == 'rice_paste1'}, {'btn-loading': btnLoading.rice_paste }, 'btn btn-mode6 center']"/>
            <div class="btn-name">下加热</div>
          </div>

          <div
            class="btn-wrap"
            @click="setMode('gruel1')">
            <div :class="[{ 'active': deviceAttrs.mode == 'gruel1' }, {'btn-loading': btnLoading.gruel }, 'btn btn-mode7 center']"/>
            <div class="btn-name">后背+风</div>
          </div>
          <div
            class="btn-wrap"
            @click="setMode('pottage1')">
            <div :class="[{ 'active': deviceAttrs.mode == 'pottage1' }, {'btn-loading': btnLoading.pottage }, 'btn btn-mode8 center']"/>
            <div class="btn-name">后背+下+风</div>
          </div>
        </div>
      </div>
      <div class="items">
        <div class="btns">
          <div
            class="btn-wrap"
            @click="setMode('grains2')">
            <div :class="[{ 'active': deviceAttrs.mode == 'grains2'},{'btn-loading': btnLoading.grains }, 'btn btn-mode9 center']" />
            <div class="btn-name">发酵</div>
          </div>

          <div
            class="btn-wrap"
            @click="setMode('rice_paste2')">
            <div :class="[{ 'active': deviceAttrs.mode == 'rice_paste2'}, {'btn-loading': btnLoading.rice_paste }, 'btn btn-mode10 center']"/>
            <div class="btn-name">解冻</div>
          </div>
        </div>
      </div>
    </SelectModal>
  </div>
</template>

<script>
import SelectTime from './components/time/time.vue'
import SelectModal from './components/Modal.vue'
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
  components: {
    SelectTime,
    SelectModal,
  },
  data() {
    return {
      isOpen: false,
      isMin: false,
      seletModal: false,
      btnLoading: {
        grains: false,
        rice_paste: false,
        gruel: false,
        pottage: false,
        stewing: false,
        grind: false,
        fruit_vegdtable: false,
        milk_shake: false,
        water_ice: false,
        tepidity: false
      }
    }
  },
  computed: {
    ...mapGetters(['isClose', 'isOffline']),
    ...mapState(['device', 'deviceAttrs']),
  },
  created() {
    if(document.body.clientHeight/document.body.clientWidth < 2) {
      this.isMin = true
    }
  },
  methods: {
    ...mapActions(['doControlDevice']),
    showMode() {
      this.seletModal = true
    },
    showTime() {
      if(!this.isClose) this.$refs.time.show = true
    },
    setReserve(time) {
      let h = parseInt(time[0].split(':')[0])
      let m = parseInt(time[0].split(':')[1])
      this.controlDevice(
        "time_mode",
        ((h*60)+m)*60==0?'no_time':'on',
        {"time": ((h*60)+m)*60},
        () => {},
        () => {},
        time[1]
      )
    },
    handleMore() {
      this.isOpen = !this.isOpen
      if(this.isOpen == true) {
        setTimeout(() => {
          document.scrollingElement.scrollTop = document.scrollingElement.scrollHeight * 1.15
        }, 0)
      }
    },
    setMode(val) {
      this.seletModal = false
      if (val == this.deviceAttrs.mode) {
        val = 'free'
      }
      if (this.isClose) return
      this.controlDevice('mode', val)
    },
    setSwitch() {
      let switchStatus = ''
      if (this.deviceAttrs.switch == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.controlDevice("switch", switchStatus)
        .then(() => {
          console.log('setSwitch success')
        })
    },
    controlDevice(attr, value) {
      return this.doControlDevice({
        nodeid: `water_heater.main.${attr}`,
        params: {
          attribute: {
            [attr]: value
          }
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
@keyframes circle-opacity{
  from {
      opacity: 1;
      transform: scale(1);
  }
  to {
      opacity: 0;
      transform: scale(1.2);
  }
}
.body {
  min-height: 100%;
  height: 100vh;
}
.page {
  overflow-x: hidden;
  position: relative;
  background: #fff;

  &.minHeight {
    min-height: 115%;
  }
  &.filter {
    filter: blur(12px);
  }
  .bg {
    position: relative;
    z-index: 1;

    width: 558px;
    height: 558px;
    .start {
      animation: circle-opacity 1.5s infinite;
    }
    .circle {
      position: absolute;
      border-radius: 50%;
      border:1px solid rgba(151,151,151,0.2);
      width: 558px;
      height: 558px;
    }
    .bg-middle {
      width: 500px;
      height: 500px;
      .start {
        animation: circle-opacity 1.5s .2s infinite;
      }
      .circle {
        position: absolute;
        border-radius: 50%;
        border:1px solid rgba(151,151,151,0.3);
        width: 500px;
        height: 500px;
      }
      .bg2 {
        width: 100%;
        height: 100%;
        background: #fff;
        border-radius: 50%;
        flex-direction: column;
        &.pos-ab {
          background: transparent;
          position: absolute;
          top: 0;
          left: 0;
        }
      }
      .circle-arrow {
        display: block;
        width: 418px;
        height: 418px;
        background-image: url('~@lib/base/haier_electric_oven/assets/btn_ac_jhuo.png');
        background-size: 100% 100%;
        position: absolute;
        top: 12%;
        left: 13%;
        transform: rotate(0deg);
      }
    }
  }
  .main {
    margin-top: 80px;
    position: relative;
    &.center {
      flex-direction: column;
    }
    .temperature {
      &.opac {
        opacity: 0.5;
      }
      font-size: 144px;
      color: #20282b;
      text-align: center;
      position: relative;
      sup {
        opacity: 0.5;
        font-size: 24px;
        color: #2e2e2e;
        position: absolute;
        top: 16px;
      }
    }
    .cmode {
      position: absolute;
      top: 406px;
      width: 100px;
      height: 100px;
      background-image: url('~@lib/base/haier_electric_oven/assets/btn_ac_fire2.png');
      background-size: 100% 100%;
      text-align: center;
    }
    .cmodeNo {
      position: absolute;
      top: 406px;
      width: 100px;
      height: 100px;
      background-image: url('~@lib/base/haier_electric_oven/assets/btn_ac_fire.png');
      background-size: 100% 100%;
      text-align: center;
    }
    .operator {
      width: 72px;
      height: 72px;
      background: #F8F8F8;
      border-radius: 50%;
      position: relative;
    }
    .reduce {
      left: -220px;
      top: -60px;
      background-image: url('~@lib/base/haier_electric_oven/assets/btn_ac_jian1.png');
      background-size: 100% 100%;
    }
    .plus {
      left: 220px;
      top: -132px;
      background-image: url('~@lib/base/haier_electric_oven/assets/btn_ac_jia1.png');
      background-size: 100% 100%;
    }
  }
  .control {
    position: relative;
    top: -74px;
    text-align: center;
    font-size: 24px;
    .baking {
      margin-bottom: 8px;
      color: #20282B;
    }
    .bakingTime {
      color: #35353D;
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
        display: inline-block;
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
      border: 1px solid rgba(32,40,43,0.5);
      border-radius: 50%;

      display: flex;
      flex-direction: column;
      &.active {
        background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
        border-color: #ffbf00;
      }
    }
    .bor {
      border: none;
      box-shadow: none;
    }
    .btn-name {
      text-align: center;
      color: #000;
      margin-top: 16px;
      font-size: 24px;
    }

    .btn-switch {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/haier_electric_oven/assets/btn_ac_switch.png');
        background-size: 100% 100%;
      }
    }
    .btn-mode {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/haier_electric_oven/assets/btn_ac_Pattern.png');
        background-size: 100% 100%;
      }
    }
    .btn-start {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/haier_electric_oven/assets/btn_ac_play.png');
        background-size: 100% 100%;
      }
    }
    .btn-time {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/haier_electric_oven/assets/btn_ac_time.png');
        background-size: 100% 100%;
      }
    }
    .btn-preheat {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/base/haier_electric_oven/assets/btn_ac_heating.png');
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
      background: rgba(255, 255, 255,0.1);
    }
    &.page {
      background: #fff;
    }
    .panel-btn {
      background: #fff;
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
    .up-index {
      opacity: 1;
      .btn-name {
        opacity: 0.5;
      }
    }
  }
}
.items{
  margin-bottom: 30px;
  .btns {
    display: flex;
    justify-content: center;
    justify-content: flex-start;
    padding: 10px 30px;
    .btn-wrap{
      margin-right: 20px;
    }
    .btn-name{
      margin-top: 16px;
      font-size: 24px;
      color: #20282B;
      text-align: center;
    }
    .btn {
      box-sizing: border-box;
      margin: 0 5px;
      width: 110px;
      height: 110px;
      border: 1px solid rgba(32,40,43,0.5);
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      &.active {
        background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
        border: none;
      }
    }
    .btn-mode1,
    .btn-mode2,
    .btn-mode3,
    .btn-mode4,
    .btn-mode5,
    .btn-mode6,
    .btn-mode7,
    .btn-mode8,
    .btn-mode9,
    .btn-mode10{
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-size: 100% 100%;
      }
    }
    .btn-mode1 {
      &::before {
        background-image: url('~@lib/base/haier_electric_oven/assets/btn_ac_mode_shangnei.png');
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/haier_electric_oven/assets/btn_ac_mode_shangnei.png');
        }
      }
    }
    .btn-mode2 {
      &::before {
        background-image: url('~@lib/base/haier_electric_oven/assets/btn_ac_shangxiafeng.png');
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/haier_electric_oven/assets/btn_ac_shangxiafeng.png');
        }
      }
    }
    .btn-mode3 {
      &::before {
        background-image: url('~@lib/base/haier_electric_oven/assets/btn_ac_shangxiafeng.png');
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/haier_electric_oven/assets/btn_ac_shangxiafeng.png');
        }
      }
    }
    .btn-mode4 {
      &::before {
        background-image: url('~@lib/base/haier_electric_oven/assets/btn_ac_shangneixia.png');
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/haier_electric_oven/assets/btn_ac_shangneixia.png');
        }
      }
    }
    .btn-mode5 {
      &::before {
        background-image: url('~@lib/base/haier_electric_oven/assets/btn_ac_shangxiafeng2.png');
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/haier_electric_oven/assets/btn_ac_shangxiafeng2.png');
        }
      }
    }
    .btn-mode6 {
      &::before {
        background-image: url('~@lib/base/haier_electric_oven/assets/btn_ac_xiajiare.png');
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/haier_electric_oven/assets/btn_ac_xiajiare.png');
        }
      }
    }
    .btn-mode7 {
      &::before {
        background-image: url('~@lib/base/haier_electric_oven/assets/btn_ac_houbeifeng.png');
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/haier_electric_oven/assets/btn_ac_houbeifeng.png');
        }
      }
    }
    .btn-mode8 {
      &::before {
        background-image: url('~@lib/base/haier_electric_oven/assets/btn_ac_houbeixiafeng.png');
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/haier_electric_oven/assets/btn_ac_houbeixiafeng.png');
        }
      }
    }
    .btn-mode9 {
      &::before {
        background-image: url('~@lib/base/haier_electric_oven/assets/btn_ac_fajiao.png');
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/haier_electric_oven/assets/btn_ac_fajiao.png');
        }
      }
    }
    .btn-mode10 {
      &::before {
        background-image: url('~@lib/base/haier_electric_oven/assets/btn_dh_jiedong.png');
      }
      &.active {
        &::before {
          background-image: url('~@lib/base/haier_electric_oven/assets/btn_dh_jiedong.png');
        }
      }
    }
  }
}
</style>
