<template>
  <div class="body">
    <div :class="[{'minHeight': isOpen && isMin}, {'offline': isOffline }, {'close': isClose}, 'page']">
      <!-- 顶部 -->
      <topbar
        :title="device.device_name"
        bg-color="#fff"
        bak-color="#000" />
      <!-- 圆圈 -->
      <div class="main center">
        <div class="bg center">
          <div :class="['circle', {'start': deviceAttrs.status == 'start' && !isClose }]"/>
          <div class="bg-middle center">
            <div :class="['circle', {'start': deviceAttrs.status == 'start' && !isClose }]"/>
            <div class="back-circle">
              <div
                v-if="isClose"
                class="back center">
                <div class="temperature opac">--<sup>°C</sup></div>
                <div class="cmodeNo"/>
              </div>
              <div
                v-else
                class="back center">
                <div class="temperature">{{ temperature }}<sup>°C</sup></div>
                <div class="cmode"/>
              </div>

              <div
                v-show="!isClose"
                class="bg2 pos-ab">
                <div
                  v-show="rotate>-42"
                  :style="deg_42"
                  class="circle-arrow-min pos1" />
                <div
                  v-show="rotate2>-88"
                  :style="deg_88"
                  class="circle-arrow-min pos2" />
                <div
                  v-show="rotate3>-133"
                  :style="deg_133"
                  class="circle-arrow-min pos3" />
                <div
                  v-show="rotate4>-178"
                  :style="deg_178"
                  class="circle-arrow-min pos4" />
                <div
                  v-show="rotate5>-220"
                  :style="deg_220"
                  class="circle-arrow-min pos5" />
                <div
                  v-show="rotate6>-232"
                  :style="deg_230"
                  class="circle-arrow-min pos6" />
                <div
                  v-show="rotate7>-286"
                  :style="deg_286"
                  class="circle-arrow-min pos7" />
                <div class="circle-arrow-min white"/>
              </div>

            </div>
          </div>
        </div>
        <div
          class="operator reduce"
          @click="reduce"/>
        <div
          class="operator plus"
          @click="plus"/>
      </div>
      <!-- 信息 -->
      <div class="control center">
        <div v-show="!isClose">
          <div class="baking">{{ deviceAttrs.status=='start'?'正在烘焙':'' }} &nbsp;{{ modeName }}</div>
          <div class="bakingTime">烘焙时间 : &nbsp;{{ deviceAttrs.bake_duration | time_H }}</div>
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
            :class="[{ 'active': !isClose }, {'btn-loading': btnLoading.switch && deviceAttrs.switch=='on' }, {'btn-loading-blue': btnLoading.switch && deviceAttrs.switch=='off' }, 'btn-switch btn center']"
            @click="setSwitch" />
          <div class="btn-name">开关</div>
        </div>

        <div
          class="btn-wrap"
          @click="setStart">
          <div :class="[{ 'active': deviceAttrs.status == 'start' }, {'btn-loading': btnLoading.status && deviceAttrs.status=='start' }, {'btn-loading-blue': btnLoading.status && deviceAttrs.status=='stop' }, 'btn btn-start center']" />
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
          <div :class="[{'btn-loading-blue': btnLoading.time }, 'btn btn-time center']" />
          <div class="btn-name">时间</div>
        </div>

        <div
          v-show="isOpen"
          class="btn-wrap"
          @click="setMode('preheat')">
          <div :class="[{ 'active': deviceAttrs.mode && deviceAttrs.mode == 'preheat' }, {'btn-loading-blue': btnLoading.preheat }, 'btn btn-preheat center']" />
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
        <div
          :style="{'justify-content': 'space-around'}"
          class="btns" >

          <div
            class="btn-wrap"
            @click="setMode('tra_barbecue')">
            <div :class="[{ 'active': deviceAttrs.mode && deviceAttrs.mode == 'tra_barbecue' }, {'btn-loading-blue': btnLoading.tra_barbecue }, 'btn btn-mode4 center']"/>
            <div class="btn-name">上外+下</div>
          </div>

          <div
            class="btn-wrap"
            @click="setMode('3D_hotwind', 'on')">
            <div :class="[{ 'active': deviceAttrs.mode && deviceAttrs.mode == '3D_hotwind' }, {'btn-loading-blue': btnLoading.D_hotwind }, 'btn btn-mode7 center']"/>
            <div class="btn-name">后背+风</div>
          </div>

          <div
            class="btn-wrap"
            @click="setMode('convection')">
            <div :class="[{ 'active': deviceAttrs.mode && deviceAttrs.mode == 'convection'},{'btn-loading-blue': btnLoading.convection }, 'btn btn-mode5 center']" />
            <div class="btn-name">上下+风</div>
          </div>

          <div
            class="btn-wrap"
            @click="setMode('bake')">
            <div :class="[{ 'active': deviceAttrs.mode && deviceAttrs.mode == 'bake' }, {'btn-loading-blue': btnLoading.bake }, 'btn btn-mode6 center']"/>
            <div class="btn-name">下加热</div>
          </div>

        </div>
      </div>
      <div class="items">
        <div
          :style="{'justify-content': 'space-around'}"
          class="btns" >

          <div
            class="btn-wrap"
            @click="setMode('grill')">
            <div :class="[{ 'active': deviceAttrs.mode && deviceAttrs.mode == 'grill'}, {'btn-loading-blue': btnLoading.grill }, 'btn btn-mode2 center']"/>
            <div class="btn-name">上+风</div>
          </div>

          <div
            class="btn-wrap"
            @click="setMode('barbecues')">
            <div :class="[{ 'active': deviceAttrs.mode && deviceAttrs.mode == 'barbecues'},{'btn-loading-blue': btnLoading.barbecues }, 'btn btn-mode1 center']" />
            <div class="btn-name">上内</div>
          </div>

          <!-- <div
            class="btn-wrap"
            @click="setMode('full_barbecue')">
            <div :class="[{ 'active': deviceAttrs.mode && deviceAttrs.mode == 'full_barbecue' }, {'btn-loading-blue': btnLoading.full_barbecue }, 'btn btn-mode3 center']"/>
            <div class="btn-name">上内+上外</div>
          </div> -->

          <!-- <div
            class="btn-wrap"
            @click="setMode('pottage1')">
            <div :class="[{ 'active': deviceAttrs.mode == 'pottage1' }, {'btn-loading-blue': btnLoading.pottage }, 'btn btn-mode8 center']"/>
            <div class="btn-name">后背+下+风</div>
          </div> -->
          <!-- <div
            class="btn-wrap"
            @click="setMode('ferment')">
            <div :class="[{ 'active': deviceAttrs.mode && deviceAttrs.mode == 'ferment' },{'btn-loading-blue': btnLoading.ferment }, 'btn btn-mode9 center']" />
            <div class="btn-name">发酵</div>
          </div> -->

          <div
            class="btn-wrap"
            @click="setMode('defrost')">
            <div :class="[{ 'active': deviceAttrs.mode && deviceAttrs.mode == 'defrost' }, {'btn-loading-blue': btnLoading.defrost }, 'btn btn-mode10 center']"/>
            <div class="btn-name">解冻</div>
          </div>

          <div
            class="btn-wrap">
            <div :class="['btn center bor']" />
            <div class="btn-name"/>
          </div>
        </div>
      </div>
      <!-- <div class="items">
        <div class="btns">

        </div>
      </div> -->
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
      getTime: 0,
      temperature: 0,
      isOpen: false,
      isMin: false,
      seletModal: false,
      rotate: 0,
      rotate2: -42,
      rotate3: -88,
      rotate4: -133,
      rotate5: -178,
      rotate6: -220,
      rotate7: -232,
      btnLoading: {
        // loading: false,
        switch: false,
        status: false,
        defrost: false,
        ferment: false,
        bake: false,
        roast: false,
        broil: false,
        time: false,
        preheat: false,
        tra_barbecue: false,
        D_hotwind: false,
        convection: false,
        grill: false,
        barbecues: false,
        full_barbecue: false,
      }
    }
  },
  computed: {
    ...mapGetters(['isClose', 'isOffline']),
    ...mapState(['device', 'deviceAttrs']),
    deg_42() {
      return {'transform': `rotate(${this.rotate}deg)`}
    },
    deg_88() {
      return {'transform': `rotate(${this.rotate2}deg)`}
    },
    deg_133() {
      return {'transform': `rotate(${this.rotate3}deg)`}
    },
    deg_178() {
      return {'transform': `rotate(${this.rotate4}deg)`}
    },
    deg_220() {
      return {'transform': `rotate(${this.rotate5}deg)`}
    },
    deg_230() {
      return {'transform': `rotate(${this.rotate6}deg)`}
    },
    deg_286() {
      if(this.temperature || this.temperature==0) {
        this.tempDeg()
      }
      return {'transform': `rotate(${this.rotate7}deg)`}
    },
    modeName() {
      /* eslint-disable no-unreachable */
      if(this.deviceAttrs.mode) {
        switch (this.deviceAttrs.mode) {
          case 'tra_barbecue':
            return '上外+下'
            break
          case '3D_hotwind':
            return '后背+风'
            break
          case 'convection':
            return '上下+风'
            break
          case 'bake':
            return '下加热'
            break
          case 'grill':
            return '上+风'
            break
          case 'barbecues':
            return '上内'
            break
          case 'full_barbecue':
            return '上内+上外'
            break
          case 'defrost':
            return '解冻'
            break
          case 'preheat':
            return '快速预热'
            break
          default: ''
            break
        }
      } else {
        return ''
      }
    }
  },
  watch: {
    "deviceAttrs.temperature"() {
      this.temperature = this.deviceAttrs.temperature
    },
    "deviceAttrs.switch"() {
      this.deviceAttrs.mode = ''
    }
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
      .then(() => {
        this.temperature = this.deviceAttrs.temperature
      })
      HdSmart.UI.setStatusBarColor(2)
    })
    if(document.body.clientHeight/document.body.clientWidth < 2) {
      this.isMin = true
    }
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    reduce() {
      if(this.temperature > 0) {
        if(this.deviceAttrs.mode == 'defrost') {
          if(this.temperature > 50) {
            this.temperature = this.temperature-1
            this.controlDevice('temperature', this.temperature)
          } else {
            HdSmart.UI.toast('当前模式最小温度为50', 1000)
          }
        } else {
          this.temperature = this.temperature-5
          this.controlDevice('temperature', this.temperature)
        }
      }
    },
    plus() {
      if(this.temperature < 250) {
        if(this.deviceAttrs.mode == 'defrost') {
          if(this.temperature < 70) {
            this.temperature = this.temperature+1
            this.controlDevice('temperature', this.temperature)
          } else {
            HdSmart.UI.toast('当前模式最大温度为70', 1000)
          }
        } else {
          this.temperature = this.temperature+5
          this.controlDevice('temperature', this.temperature)
        }
      }
    },
    tempDeg() {
      if(this.temperature > 212) {
        this.rotate = (-(250 - this.temperature) * 1.12)
        this.rotate2 = -42
        this.rotate3 = -88
        this.rotate4 = -133
        this.rotate5 = -178
        this.rotate6 = -220
        this.rotate7 = -232
        return
      } else if(this.temperature>171) {
        this.rotate = -42
        this.rotate2 = (-(250 - this.temperature) * 1.12)
        this.rotate3 = -88
        this.rotate4 = -133
        this.rotate5 = -178
        this.rotate6 = -220
        this.rotate7 = -232
        return
      } else if(this.temperature>131) {
        this.rotate = -42
        this.rotate2 = -88
        this.rotate3 = (-(250 - this.temperature) * 1.12)
        this.rotate4 = -133
        this.rotate5 = -178
        this.rotate6 = -220
        this.rotate7 = -232
        return
      } else if(this.temperature>91) {
        this.rotate = -42
        this.rotate2 = -88
        this.rotate3 = -133
        this.rotate4 = (-(250 - this.temperature) * 1.12)
        this.rotate5 = -178
        this.rotate6 = -220
        this.rotate7 = -232
        return
      } else if(this.temperature>53) {
        this.rotate = -42
        this.rotate2 = -88
        this.rotate3 = -133
        this.rotate4 = -178
        this.rotate5 = (-(250 - this.temperature) * 1.12)
        this.rotate6 = -220
        this.rotate7 = -232
        return
      } else if(this.temperature>42) {
        this.rotate = -42
        this.rotate2 = -88
        this.rotate3 = -133
        this.rotate4 = -178
        this.rotate5 = -220
        this.rotate6 = (-(250 - this.temperature) * 1.12)
        this.rotate7 = -232
        return
      } else if(this.temperature>=0) {
        this.rotate = -42
        this.rotate2 = -88
        this.rotate3 = -133
        this.rotate4 = -178
        this.rotate5 = -220
        this.rotate6 = -232
        this.rotate7 = this.temperature==0?-286:(-(250 - this.temperature) * 1.12)
        return
      }
    },
    showMode() {
      if(!this.isClose && !this.isOffline) this.seletModal = true
    },
    showTime() {
      if(!this.isClose && !this.isOffline) this.$refs.time.show = true
    },
    setReserve(time) {
      this.btnLoading['time'] = true
      let h = parseInt(time[0].split(':')[0])
      let m = parseInt(time[0].split(':')[1])
      this.getTime = ((h*60)+m)*60
      this.controlDevice("bake_duration", ((h*60)+m)*60)
      .then(() => {
        this.btnLoading['time'] = false
      })
      .catch(() => {
        this.btnLoading['time'] = false
      })
    },
    handleMore() {
      this.isOpen = !this.isOpen
      if(this.isOpen == true) {
        setTimeout(() => {
          document.scrollingElement.scrollTop = document.scrollingElement.scrollHeight * 1.15
        }, 0)
      }
    },
    setStart() {
      if (this.isClose) return
      if (this.deviceAttrs.status == 'start') return HdSmart.UI.toast('不支持暂停', 1000)
      if (!this.deviceAttrs.mode) return HdSmart.UI.toast('请选择模式', 1000)
      if (this.getTime == 0) return HdSmart.UI.toast('请设置时间', 1000)
      this.btnLoading['status'] = true
      this.controlDevice('control', 'start')
      .then(() => {
        this.btnLoading['status'] = false
        if(this.deviceAttrs.switch == 'off') return delete this.deviceAttrs.mode
      })
      .catch(() => {
        this.btnLoading['status'] = false
        if(this.deviceAttrs.switch == 'off') return delete this.deviceAttrs.mode
      })
    },
    setMode(val, param) {
      if (this.isClose) return
      if(val == 'preheat') {
        if(this.deviceAttrs.mode == 'defrost') return HdSmart.UI.toast('解冻模式不支持快速预热', 1000)
      }
      if(param) this.btnLoading['D_hotwind'] = true
      // if(param) {
      //   if(this.deviceAttrs.convection == param && this.deviceAttrs.mode == val) return
      //   this.btnLoading['loading'] = true
      // } else if(this.deviceAttrs.mode == val && this.deviceAttrs.convection=='off') return
      this.btnLoading[val] = true
      // this.controlDevice('mode', val, !param?{convection:'off'}:{convection: 'on'})
      this.controlDevice('mode', val)
      .then(() => {
        // this.btnLoading['loading'] = false
        this.btnLoading[val] = false
        this.btnLoading['D_hotwind'] = false
        this.seletModal = false
      })
      .catch(() => {
        // this.btnLoading['loading'] = false
        this.btnLoading[val] = false
        this.btnLoading['D_hotwind'] = false
        this.seletModal = false
      })
    },
    setSwitch() {
      if(this.isOffline) return
      this.btnLoading['switch'] = true
      let switchStatus = ''
      if (this.deviceAttrs.switch == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.controlDevice("switch", switchStatus, {'control': 'stop', 'mode': ''})
        .then(() => {
          this.btnLoading['switch'] = false
          delete this.deviceAttrs.mode
        })
        .catch(() => {
          this.btnLoading['switch'] = false
          delete this.deviceAttrs.mode
        })
    },
    controlDevice(attr, value, param) {
      return this.doControlDevice({
        nodeid: `water_heater.main.${attr}`,
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
@imgPath: 'base/haier_electric_oven/assets';
@100: 100% 100%;
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
  touch-action: manipulation;
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
      .back-circle {
        width: 418px;
        height: 418px;
        background: rgb(237, 237, 237);
        border-radius: 50%;
        position: absolute;
        top: 66px;
        left: 72px;
      }
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
          transform-origin: center center;
        }
      }
      .back {
        width: 418px;
        height: 418px;
        position: absolute;
        background-image: url('~@lib/@{imgPath}/btn_ac_zhezhao.png');
        background-size: @100;
        border-radius: 50%;
        z-index: 8;
        top: 2px;
      }
      .circle-arrow-min {
        display: block;
        width: 418px;
        height: 418px;
        position: absolute;
      }
      .circle-arrow-min::after {
        content: '';
        position: absolute;
        transform: translate(-50%, -50%);
      }
      .pos1 {
        transform: rotate(0deg);
        z-index: 6;
      }
      .pos2 {
        transform: rotate(-42deg);
        z-index: 5;
      }
      .pos3 {
        transform: rotate(-88deg);
        z-index: 4;
      }
      .pos4 {
        transform: rotate(-133deg);
        z-index: 3;
      }
      .pos5 {
        transform: rotate(-178deg);
        z-index: 2;
      }
      .pos6 {
        transform: rotate(-220deg);
        z-index: 1;
      }
      .pos7 {
        transform: rotate(-240deg);
        z-index: 0;
      }
      .pos1::after {
        width: calc(~"154px / 1.5");
        height: calc(~"252px / 1.5");
        top: 200px;
        left: 315px;
        transform: rotate(0deg);
        background-image: url('~@lib/@{imgPath}/jq.png');
        background-size: @100;
      }
      .pos2::after {
        width: calc(~"154px / 1.5");
        height: calc(~"252px / 1.5");
        top: 200px;
        left: 315px;
        transform: rotate(0deg);
        background-image: url('~@lib/@{imgPath}/jq.png');
        background-size: @100;
      }
      .pos3::after {
        width: calc(~"154px / 1.5");
        height: calc(~"252px / 1.5");
        top: 200px;
        left: 315px;
        transform: rotate(0deg);
        background-image: url('~@lib/@{imgPath}/jq.png');
        background-size: @100;
      }
      .pos4::after {
        width: calc(~"154px / 1.5");
        height: calc(~"252px / 1.5");
        top: 200px;
        left: 315px;
        transform: rotate(0deg);
        background-image: url('~@lib/@{imgPath}/jq.png');
        background-size: @100;
      }
      .pos5::after {
        width: calc(~"154px / 1.5");
        height: calc(~"252px / 1.5");
        top: 200px;
        left: 315px;
        transform: rotate(0deg);
        background-image: url('~@lib/@{imgPath}/jq.png');
        background-size: @100;
      }
      .pos6::after {
        width: calc(~"154px / 1.5");
        height: calc(~"252px / 1.5");
        top: 200px;
        left: 315px;
        transform: rotate(0deg);
        background-image: url('~@lib/@{imgPath}/jq.png');
        background-size: @100;
      }
      .pos7::after {
        width: calc(~"154px / 1.5");
        height: calc(~"252px / 1.5");
        top: 200px;
        left: 315px;
        transform: rotate(0deg);
        background-image: url('~@lib/@{imgPath}/jq.png');
        background-size: @100;
      }
      .white {
        border: 1px solid #fff;
        opacity: 0.2;
        border-radius: 50%;
        width: 378px;
        height: 378px;
        z-index: 7;
        left: 20px;
        top: 20px;
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
      font-size: 140px;
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
      top: 310px;
      width: 100px;
      height: 100px;
      background-image: url('~@lib/@{imgPath}/btn_ac_fire2.png');
      background-size: @100;
      text-align: center;
    }
    .cmodeNo {
      position: absolute;
      top: 310px;
      width: 100px;
      height: 100px;
      background-image: url('~@lib/@{imgPath}/btn_ac_fire.png');
      background-size: @100;
      text-align: center;
    }
    .operator {
      z-index: 2;
      width: 72px;
      height: 72px;
      background: #F8F8F8;
      border-radius: 50%;
      position: relative;
    }
    .reduce {
      left: -220px;
      top: -60px;
      background-image: url('~@lib/@{imgPath}/btn_ac_jian1.png');
      background-size: @100;
    }
    .plus {
      left: 220px;
      top: -132px;
      background-image: url('~@lib/@{imgPath}/btn_ac_jia1.png');
      background-size: @100;
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
      width: 100%;
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
      // justify-content: space-evenly;
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
        background-image: url('~@lib/@{imgPath}/btn_ac_switch.png');
        background-size: @100;
      }
    }
    .btn-mode {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/@{imgPath}/btn_ac_Pattern.png');
        background-size: @100;
      }
    }
    .btn-start {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/@{imgPath}/btn_ac_play.png');
        background-size: @100;
      }
    }
    .btn-time {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/@{imgPath}/btn_ac_time.png');
        background-size: @100;
      }
    }
    .btn-preheat {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/@{imgPath}/btn_ac_heating.png');
        background-size: @100;
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
      // margin: 0 5px;
      margin: 0 auto;
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
        background-size: @100;
      }
    }
    .btn-mode1 {
      &::before {
        background-image: url('~@lib/@{imgPath}/btn_ac_mode_shangnei.png');
      }
      &.active {
        &::before {
          background-image: url('~@lib/@{imgPath}/btn_ac_mode_shangnei.png');
        }
      }
    }
    .btn-mode2 {
      &::before {
        background-image: url('~@lib/@{imgPath}/btn_ac_shangxiafeng.png');
      }
      &.active {
        &::before {
          background-image: url('~@lib/@{imgPath}/btn_ac_shangxiafeng.png');
        }
      }
    }
    .btn-mode3 {
      &::before {
        background-image: url('~@lib/@{imgPath}/btn_ac_shangneishangjiawai.png');
      }
      &.active {
        &::before {
          background-image: url('~@lib/@{imgPath}/btn_ac_shangxiafeng.png');
        }
      }
    }
    .btn-mode4 {
      &::before {
        background-image: url('~@lib/@{imgPath}/btn_ac_shangneixia.png');
      }
      &.active {
        &::before {
          background-image: url('~@lib/@{imgPath}/btn_ac_shangneixia.png');
        }
      }
    }
    .btn-mode5 {
      &::before {
        background-image: url('~@lib/@{imgPath}/btn_ac_shangxiafeng2.png');
      }
      &.active {
        &::before {
          background-image: url('~@lib/@{imgPath}/btn_ac_shangxiafeng2.png');
        }
      }
    }
    .btn-mode6 {
      &::before {
        background-image: url('~@lib/@{imgPath}/btn_ac_xiajiare.png');
      }
      &.active {
        &::before {
          background-image: url('~@lib/@{imgPath}/btn_ac_xiajiare.png');
        }
      }
    }
    .btn-mode7 {
      &::before {
        background-image: url('~@lib/@{imgPath}/btn_ac_houbeifeng.png');
      }
      &.active {
        &::before {
          background-image: url('~@lib/@{imgPath}/btn_ac_houbeifeng.png');
        }
      }
    }
    .btn-mode8 {
      &::before {
        background-image: url('~@lib/@{imgPath}/btn_ac_houbeixiafeng.png');
      }
      &.active {
        &::before {
          background-image: url('~@lib/@{imgPath}/btn_ac_houbeixiafeng.png');
        }
      }
    }
    .btn-mode9 {
      &::before {
        background-image: url('~@lib/@{imgPath}/btn_ac_fajiao.png');
      }
      &.active {
        &::before {
          background-image: url('~@lib/@{imgPath}/btn_ac_fajiao.png');
        }
      }
    }
    .btn-mode10 {
      &::before {
        background-image: url('~@lib/@{imgPath}/btn_dh_jiedong.png');
      }
      &.active {
        &::before {
          background-image: url('~@lib/@{imgPath}/btn_dh_jiedong.png');
        }
      }
    }
    .bor {
      border: none;
      box-shadow: none;
    }
  }
}
.btn-loading {
  position: relative;
  &:after{
    width: 90%;
    height: 90%;
    content: '';
    background-image: url('~@lib/@{imgPath}/buffering_mode_white.gif');
    background-size: @100;
    background-repeat: no-repeat;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.btn-loading-blue {
  position: relative;
  &:after{
    width: 90%;
    height: 90%;
    content: '';
    background-image: url('~@lib/@{imgPath}/buffering_mode_blue.gif');
    background-size: @100;
    background-repeat: no-repeat;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
