<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, 'page']">
      <newtopbar
        :title="device.device_name"
        :room="device.room_name"
        :scroll="true"
        bak-color="#000"
        page-class=".page" />
      <!-- 主体部分 -->
      <div class="main">
        <div class="headline">准备就绪</div>
        <div class="subheading">
          <div class="subheading_tips">风温 | 低</div>
          <div class="subheading_tips margin-tips">水温 | 中</div>
          <div class="subheading_tips">座温 | 中</div>
        </div>
        <!-- <div class="subheading">
          <div class="subheading_tips">妇洗</div>
          <div class="subheading_tips tips-margin">——</div>
          <div class="subheading_tips"> 冲水</div>
          <div class="subheading_tips tips-margin">——</div>
          <div class="subheading_tips"> 烘干</div>
        </div> -->
        <!-- <div class="subheading">
          <div class="subheading_tips-big">正在烘干</div>
        </div> -->
      </div>

      <!-- 当前型号暂不支持以下功能，注释处理 -->

      <!-- 按钮 -->
      <div class="panel-btn center">
        <div
          class="btn-wrap"
          @click="setMode('cool')">
          <div
            :class="[{ 'active': deviceAttrs.mode == 'frozen' }, 'btn-cold btn center']"/>
          <div class="btn-name">洗便</div>
        </div>

        <div
          class="btn-wrap"
          @click="setMode('frozen')">
          <div :class="[{ 'active': deviceAttrs.mode == 'frozen' }, 'btn btn-freeze center']" />
          <div class="btn-name">妇洗</div>
        </div>

        <div
          class="btn-wrap"
          @click="setMode('intelligent', deviceAttrs.intelligent)">
          <div :class="[ { 'active': deviceAttrs.intelligent == 'on' }, 'btn btn-auto center']" />
          <div class="btn-name">烘干</div>
        </div>

        <div
          class="btn-wrap"
          @click="setMode('holiday', deviceAttrs.holiday)">
          <div :class="[ { 'active': deviceAttrs.holiday == 'on' }, 'btn btn-holiday center']" />
          <div class="btn-name">冲水</div>
        </div>
      </div>

      <!-- 当前型号暂不支持以下功能，注释处理 -->
      <div class="panel-btn center">
        <div
          class="btn-wrap-ellipse"
        >
          <div
            :class="['btn-ellipse']"/>
          <div class="btn-name">洗便烘干</div>
        </div>

        <div
          class="btn-wrap-ellipse"
        >
          <div :class="['btn-ellipse']" />
          <div class="btn-name">妇洗烘干</div>
        </div>
      </div>

      <div class="footer">
        <div class="line"/>
        <div class="footer-line">
          <div class="footer-title">风温</div>
          <div class="footer-nav">
            <div class="footer-nav-btn active">关</div>
            <div class="footer-nav-btn">低</div>
            <div class="footer-nav-btn">中</div>
            <div class="footer-nav-btn">高</div>
          </div>
        </div>
        <div class="line"/>
        <div class="footer-line">
          <div class="footer-title">水温</div>
          <div class="footer-nav">
            <div class="footer-nav-btn">关</div>
            <div class="footer-nav-btn">低</div>
            <div class="footer-nav-btn">中</div>
            <div class="footer-nav-btn">高</div>
          </div>
        </div>
        <div class="line"/>
        <div class="footer-line">
          <div class="footer-title">座温</div>
          <div class="footer-nav">
            <div class="footer-nav-btn">关</div>
            <div class="footer-nav-btn">低</div>
            <div class="footer-nav-btn">中</div>
            <div class="footer-nav-btn">高</div>
          </div>
        </div>
        <div class="line"/>
        <div class="footer-line">
          <div class="footer-title">清洗水压</div>
          <div class="footer-nav">
            <div class="footer-nav-btn">弱</div>
            <div class="footer-nav-btn">中</div>
            <div class="footer-nav-btn">强</div>
          </div>
        </div>
        <div class="line"/>
        <div class="footer-line">
          <div class="footer-title">出水位置</div>
          <div class="footer-nav">
            <div class="footer-nav-btn">前</div>
            <div class="footer-nav-btn">中</div>
            <div class="footer-nav-btn">后</div>
          </div>
        </div>
        <div class="line"/>
        <div class="footer-line">
          <div class="footer-title">按摩模式</div>
          <!-- <div class="footer-nav"> -->
          <input
            class="switch switch-anim"
            type="checkbox"
            @click="lock">
            <!-- </div> -->
        </div>
        <div class="line"/>
        <div class="footer-line">
          <div class="footer-title">夜灯</div>
          <!-- <div class="footer-nav"> -->
          <input
            class="switch switch-anim"
            type="checkbox"
            @click="lock">
            <!-- </div> -->
        </div>
        <div class="line"/>
        <div class="footer-line">
          <div class="footer-title">自动冲水</div>
          <!-- <div class="footer-nav"> -->
          <input
            class="switch switch-anim"
            type="checkbox"
            @click="lock">
            <!-- </div> -->
        </div>
        <div class="line"/>
      </div>
      <!-- <div
        class="option"
        @click="handleMore">
        更多选项
      </div> -->
      <div
        v-show="isOpen=='on'"
        class="more-Choice"
        @click.self="isOpen = 'off'">
        <div class="model-main">
          <div
            class="line-list">更多选项</div>
          <div class="line"/>
          <div
            class="line-list one-line">
            <div class="txt">开门后亮灯</div>
            <input
              class="switch switch-anim"
              type="checkbox"
              @click="door">
          </div>
          <div
            class="line-list two-line jindutiao">
            <div class="txt">亮度</div>
            <div class="range">
              <input
                :class="[{'range-zero': rangeColor || doorValue=='off'}]"
                :disabled="doorValue=='off'"
                type="range"
                min="0"
                max="6"
                step="1"
                value="0"
                @input="changeSpeed">
              <p :class="['rang_width', {'rang_bak': doorValue=='off'}]"/>
            </div>
            <div :class="['tips', {'tips-bak': doorValue=='off'}]">{{ brightness }}</div>
          </div>
          <div
            class="line-list two-line">
            <div class="txt">时长</div>
            <ul class="duration">
              <li
                :class="['item', {'active': timeValue == 1}, {'disable': doorValue=='off'}]"
                @click="durationTime(1)">20秒</li>
              <li
                :class="['item', {'active': timeValue == 2}, {'disable': doorValue=='off'}]"
                @click="durationTime(2)">1分钟</li>
              <li
                :class="['item', {'active': timeValue == 3}, {'disable': doorValue=='off'}]"
                @click="durationTime(3)">5分钟</li>
              <li
                :class="['item', {'active': timeValue == 4}, {'disable': doorValue=='off'}]"
                @click="durationTime(4)">20分钟</li>
              <li
                :class="['item', {'active': timeValue == 5}, {'disable': doorValue=='off'}]"
                @click="durationTime(5)">60分钟</li>
              <li
                :class="['item', {'active': timeValue == 6}, {'disable': doorValue=='off'}]"
                @click="durationTime(6)">不限时</li>
            </ul>
          </div>
          <div class="line"/>
          <div
            class="line-list one-line">
            <div class="txt">锁定冰箱屏幕</div>
            <input
              class="switch switch-anim"
              type="checkbox"
              @click="lock">
          </div>
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
      code: true,
      isOpen: 'off',
      rangeColor: 'on',
      timeValue: 0,
      doorValue: 'off',
      coldValue: 'off',
      frozenValue: 'off',
      brightness: 0,
      checkedColdValue: false,
      checkedFrozenValue: false,
      coldDisabled: false,
      frozenDisabled: false,
    }
  },
  computed: {
    ...mapGetters(['isOffline']),
    ...mapState(['device', 'deviceAttrs']),
    progress1() {
      let x = +this.deviceAttrs.temperature_container
      let [min, max ] = [20, 80]
      if(x < min){
        return 0
      } else if(x > max){
        return 100
      } else {
        return (x-min) / (max - min) * 100
      }
    },
    progress2() {
      let x = +this.deviceAttrs.tempVarTempChamber
      let [min, max ] = [-180, 50]
      if(x < min){
        return 0
      } else if(x > max){
        return 100
      } else {
        return (x-min) / (max - min) * 100
      }
    },
    progress3() {
      let x = +this.deviceAttrs.temperature_freezer
      let [min, max ] = [-250, -150]
      if(x < min){
        return 0
      } else if(x > max){
        return 100
      } else {
        return (x-min) / (max - min) * 100
      }
    },
  },
  watch: {
    "deviceAttrs.holiday"() {
      if(this.code == false) return
      this.coldDisabled = false
      this.frozenDisabled = false
      if(this.deviceAttrs.holiday == 'on') {
        this.coldValue = 'off'
        // this.frozenValue = 'off'
        this.checkedColdValue = false
        // this.checkedFrozenValue = false
      }
    },
    "deviceAttrs.intelligent"() {
      if(this.code == false) return
      this.coldDisabled = false
      this.frozenDisabled = false
      if(this.deviceAttrs.intelligent == 'on') {
        this.coldValue = 'off'
        this.frozenValue = 'off'
        this.checkedColdValue = false
        this.checkedFrozenValue = false
      }
    },
    "deviceAttrs.fast_cool"() {
      if(this.code == false) return
      this.coldDisabled = false
      if(this.deviceAttrs.fast_cool == 'on') {
        this.coldValue = 'on'
        this.checkedColdValue = true
      }
      if(this.deviceAttrs.fast_cool == 'off') {
        this.coldValue = 'off'
        this.checkedColdValue = false
      }
    },
    "deviceAttrs.fast_frozen"() {
      if(this.code == false) return
      this.frozenDisabled = false
      if(this.deviceAttrs.fast_frozen == 'on') {
        this.frozenValue = 'on'
        this.checkedFrozenValue = true
      }
      if(this.deviceAttrs.fast_frozen == 'off') {
        this.frozenValue = 'off'
        this.checkedFrozenValue = false
      }
    }
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
      HdSmart.UI.setStatusBarColor(2)
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo','doControlDevice']),
    handleMore() {
      this.isOpen = 'on'
    },
    setMode(val, boolean) {
      if (this.isClose) return
      if(this.isOffline) return HdSmart.UI.toast('设备已离线')
      // if (this.checkedColdValue == true && this.checkedFrozenValue == true) return HdSmart.UI.toast('请先退出速冷和速冻模式', 1000)
      // if (this.checkedColdValue == true) return HdSmart.UI.toast('请先退出速冷模式', 1000)
      // if (this.checkedFrozenValue == true) return HdSmart.UI.toast('请先退出速冻模式', 1000)
      var value
      if(boolean == 'on') {
        value = 'off'
      } else {
        value = 'on'
      }
      this.controlDevice(val, value)
      .then((res) => {
        if(res.code == 0) {
          this.code = true
        } else {
          this.code = false
          HdSmart.UI.toast('操作失败')
          this.coldDisabled = false
          this.frozenDisabled = false
        }
      })
      .catch((res) => {
        if(res.code == 0) {
          this.code = true
        } else {
          this.code = false
          HdSmart.UI.toast('操作失败')
          this.coldDisabled = false
          this.frozenDisabled = false
        }
      })
    },
    setTemperature(attr, step, [min, max ]) {
      if(this.isOffline) return HdSmart.UI.toast('设备已离线')
      var temp = this.deviceAttrs[attr] + step
      // 最小温度
      if (temp < min) {
        if (this.deviceAttrs[attr] == min) {
          return HdSmart.UI.toast(`温度最低为${min}℃`)
        } else {
          temp = min
        }
      }
      // 最大温度
      if (temp > max) {
        if (this.deviceAttrs[attr] == max) {
          return HdSmart.UI.toast(`温度最高为${max}℃`)
        } else {
          temp = max
        }
      }
      this.controlDevice(attr, temp)
      .then((res) => {
        if(res.code == 0) {
          this.code = true
        } else {
          this.code = false
          HdSmart.UI.toast('操作失败')
        }
      })
      .catch((res) => {
        if(res.code == 0) {
          this.code = true
        } else {
          this.code = false
          HdSmart.UI.toast('操作失败')
        }
      })
    },
    changeSpeed(e) {
      var max = e.target.getAttribute("max")
      var width = (91.3 / max * e.target.value) +"%"
      document.querySelector('.rang_width').style.width = width
      if(e.target.value == 0) {
        this.rangeColor = 'on'
      } else {
        this.rangeColor = 'off'
      }
      this.brightness = e.target.value
      console.log(e.target.value)
    },
    door(e) {
      console.log(e.target.checked)
      this.doorValue = e.target.checked
      if(e.target.checked == false) {
        this.timeValue = 0
      }
    },
    lock(e) {
      console.log(e.target.checked)
    },
    durationTime(val) {
      console.log(val)
      if(this.doorValue == 0) return
      this.timeValue = val
    },
    cold(e, val) {
      if(this.isOffline) return HdSmart.UI.toast('设备已离线')
      this.coldDisabled = true
      var value
      if(val == 'on') {
        value = 'off'
      } else {
        value = 'on'
      }
      this.controlDevice('fast_cool', value)
      .then((res) => {
        if(res.code == 0) {
          this.code = true
        } else {
          this.code = false
          HdSmart.UI.toast('操作失败')
          this.coldDisabled = false
        }
      })
      .catch((res) => {
        if(res.code == 0) {
          this.code = true
        } else {
          this.code = false
          HdSmart.UI.toast('操作失败')
          this.coldDisabled = false
        }
      })
    },
    frozen(e, val) {
      if(this.isOffline) return HdSmart.UI.toast('设备已离线')
      this.frozenDisabled = true
      var value
      if(val == 'on') {
        value = 'off'
      } else {
        value = 'on'
      }
      this.controlDevice('fast_frozen', value)
      .then((res) => {
        if(res.code == 0) {
          this.code = true
        } else {
          this.code = false
          HdSmart.UI.toast('操作失败')
          this.frozenDisabled = false
        }
      })
      .catch((res) => {
        if(res.code == 0) {
          this.code = true
        } else {
          this.code = false
          HdSmart.UI.toast('操作失败')
          this.frozenDisabled = false
        }
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
  }
}
</script>
<style lang="less" scoped>
@imgPath3: 'base/honghan_switch/assets';
// .body {
  // min-height: 100%;
  // touch-action: none;
// }
.page {
  // height: 100vh;
  // min-height: 550px;
  // overflow-x: hidden;
  // position: relative;
  // background-image: url(~@lib/base/fridge/assets/img_bg_01@2x.png);
  // background-size: 100% 100%;
  &::before{
    content: "";
    background-image: url('~@lib/@{imgPath3}/bg02.png');
    background-repeat:no-repeat;
    background-size: 100% 100%;
    position: fixed;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }
  .main{
      margin-top: 60px;
    .headline {
      font-size: 112px;
      color: #000000;
      text-align: center;
    }
    .subheading {
      margin: 50px 0 150px;
      display: flex;
      justify-content: center;
      .subheading_tips {
        font-size: 24px;
        color: #000000;
        text-align: center;
        &.margin-tips {
          margin: 0 80px;
        }
        &.tips-margin {
          margin: 0 45px;
        }
      }
      .subheading_tips-big {
        font-size: 48px;
        color: #000000;
        text-align: center;
      }
    }
    .line{
      width: 100%;
      height: 1px;
      background: #000;
      opacity: 0.1;
      margin-bottom: 40px;
    }
  }
  .c-status{
    text-align: center;
    font-size: 24px;
    color: #20282B;
  }
  .panel-btn {
    // position: fixed;
    // bottom: 0;
    // left: 0;
    // right: 0;
    padding: 0px 38px 0;
    z-index: 9999;

    background: transparent;
    // box-shadow: 0 -3px 28px 0 rgba(209, 209, 209, 0.5);
    // border-radius: 42px 42px 0px 0px;

    flex-wrap: wrap;
    // justify-content: flex-start;
    justify-content: space-around;
  }
  /*********** 按钮 ***********/
  .btn-wrap {
    margin: 0 24px 0px;
    .btn {
      box-sizing: border-box;
      margin: 0 auto;
      width: 120px;
      height: 120px;
      border: 1px solid rgba(0,0,0,0.04);
      border-radius: 50%;

      display: flex;
      flex-direction: column;
      background: rgba(0,0,0,0.04);
      &::before {
        content: "";
        display: block;
        width: 48px;
        height: 48px;
      }
      &.active {
        // background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
        // border-color: #ffbf00;
        background: #000000;
        border-color: #000;
        &.btn-energy {
          &::before {
            background-image: url(~@lib/base/fridge/assets/bx_mode_jieneng_selected.png);
            background-size: 100% 100%;
          }
        }
        &.btn-auto {
          &::before {
            background-image: url(~@lib/base/fridge/assets/bx_mode_auto_selected.png);
            background-size: 100% 100%;
          }
        }
        &.btn-holiday {
          &::before {
            background-image: url(~@lib/base/fridge/assets/bx_mode_jiari_selected.png);
            background-size: 100% 100%;
          }
        }
        &.btn-baoxian {
          &::before {
            background-image: url(~@lib/base/fridge/assets/bx_mode_baoxian.png);
            background-size: 100% 100%;
          }
        }
      }
    }
    .btn-name {
      text-align: center;
      color: #000;
      margin-top: 16px;
      font-size: 24px;
    }

    .btn-freeze {
      &::before {
        background-image: url(~@lib/base/fridge/assets/freeze-black.png);
        background-size: 100% 100%;
      }
    }
    .btn-cold {
      &::before {
        background-image: url(~@lib/base/fridge/assets/cold-black.png);
        background-size: 100% 100%;
      }
    }
    .btn-auto {
      &::before {
        background-image: url(~@lib/base/fridge/assets/bx_mode_auto.png);
        background-size: 100% 100%;
      }
    }
    .btn-holiday {
      &::before {
        background-image: url(~@lib/base/fridge/assets/bx_mode_jiari.png);
        background-size: 100% 100%;
      }
    }
    .btn-energy {
      &::before {
        background-image: url(~@lib/base/fridge/assets/bx_mode_jieneng.png);
        background-size: 100% 100%;
      }
    }
    .btn-baoxian {
      &::before {
        background-image: url(~@lib/base/fridge/assets/bx_mode_baoxian_selected.png);
        background-size: 100% 100%;
      }
    }
  }
  .btn-wrap-ellipse {
    box-sizing: border-box;
    margin: 40px auto 0;
    width: 314px;
    height: 120px;
    border: 1px solid rgba(0,0,0,0.04);
    border-radius: 60px;
    background: rgba(0,0,0,0.04);
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    .btn-ellipse {
      width: 48px;
      height: 48px;
      background: url(~@lib/base/arrow_closestool/assets/mt_btn_xibianhonggan.png);
      background-size: 100% 100%;
    }
    .btn-name {
      font-size: 24px;
      color: #000000;
    }
  }
  .footer {
    margin-top: 60px;
    .line {
      width: 100%;
      height: 1px;
      opacity: .1;
      background: #000000;
    }
    .footer-line {
      padding: 0px 60px;
      height: 118px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .footer-title {
        font-size: 32px;
        color: #000000;
      }
      .footer-nav {
        display: flex;
        // width: 480px;
        .footer-nav-btn {
          // width: 120px;
          height: 64px;
          line-height: 64px;
          // background: rgba(0,0,0,0.04);
          font-size: 28px;
          color: #000000;
          text-align: center;
          margin-left: 64px;
          opacity: 0.5;
          &.active {
            opacity: 1;
            position: relative;
            &::before{
              display: block;
              content: "";
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #000;
              position: absolute;
              bottom: 0;
              left: 50%;
              margin-left: -4px;
            }
          }
        }
      }
      .switch {
            width: 74px;
            height: 28px;
            position: relative;
            border: 1px solid transparent;
            // background-color: #fdfdfd;
            box-shadow: #dfdfdf 0 0 0 0 inset;
            border-radius: 20px;
            background-clip: content-box;
            display: inline-block;
            -webkit-appearance: none;
            user-select: none;
            outline: none;
            background-color: rgba(0, 0, 0, 0.1);
        }
        .switch:before {
            content: '';
            width: 40px;
            height: 40px;
            position: absolute;
            top: -8px;
            left: 0;
            border-radius: 20px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
            background: #000;
        }
        .switch:checked {
            border-color: #E1B96E;
            box-shadow: #E1B96E 0 0 0 16px inset;
            background-color: #E1B96E;
        }
        .switch:checked:before {
            left: 30px;
            background: #000000;
        }
        .switch.switch-anim {
            transition: border cubic-bezier(0, 0, 0, 1) 0.4s, box-shadow cubic-bezier(0, 0, 0, 1) 0.4s;
        }
        .switch.switch-anim:before {
            transition: left 0.3s;
        }
        .switch.switch-anim:checked {
            // box-shadow: #64bd63 0 0 0 16px inset;
            // background-color: #64bd63;
            transition: border ease 0.4s, box-shadow ease 0.4s, background-color ease 1.2s;
        }
        .switch.switch-anim:checked:before {
            transition: left 0.3s;
        }
    }
  }
  /*********** 离线和关机 ***********/
  &.close,
  &.offline {
    .main {
      opacity: .2;
    }
    .c-status{
      opacity: 0;
    }
    &:before {
      content: "";
      position: fixed;
      top: 69PX;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 99999;
      width: 100%;
      background: rgba(0, 0, 0, 0.05);
    }
    .icon-swich{
      background-image: url(~@lib/base/fridge/assets/swich-black.png) !important;
      background-size: 100% 100%;
    }
    &.page{
      background: #fff;
      .btn-wrap {
        opacity: .2;
        .btn {
          &.active {
            background: #fff;
            border: 1px solid #818181;
          }
        }
      }
    }
  }
  .option {
    position: fixed;
    bottom: 30px;
    left: 0;
    right: 0;
    opacity: 0.53;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #000000;
    text-align: center;
  }
  .more-Choice {
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99999;
    overflow: auto;
    &:before{
      position: absolute;
      top: 0;
      left: 0;
      content: '';
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
    }
    .model-main {
      position: fixed;
      bottom: 0;
      width: 100%;
      background: #fff;
      height: 40%;
      z-index: 999999999999;
      .line{
      width: 100%;
      height: 1px;
      background: #EDEDED;
    }
    .line-list {
      height: 20%;
      font-size: 40px;
      color: #000000;
      display: flex;
      align-items: center;
      width: 90%;
      margin: 0 auto;
      font-weight: 900;
      .txt {
        font-size: 32px;
        color: #000000;
      }
      .switch {
            width: 74px;
            height: 28px;
            position: relative;
            border: 1px solid transparent;
            // background-color: #fdfdfd;
            box-shadow: #dfdfdf 0 0 0 0 inset;
            border-radius: 20px;
            background-clip: content-box;
            display: inline-block;
            -webkit-appearance: none;
            user-select: none;
            outline: none;
            background-color: rgba(0, 0, 0, 0.1);
        }
        .switch:before {
            content: '';
            width: 40px;
            height: 40px;
            position: absolute;
            top: -8px;
            left: 0;
            border-radius: 20px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
            background: #7F7F7F;
        }
        // .switch:checked {
            // border-color: #64bd63;
            // box-shadow: #64bd63 0 0 0 16px inset;
            // background-color: #64bd63;
        // }
        .switch:checked:before {
            left: 30px;
            background: #000000;
        }
        .switch.switch-anim {
            transition: border cubic-bezier(0, 0, 0, 1) 0.4s, box-shadow cubic-bezier(0, 0, 0, 1) 0.4s;
        }
        .switch.switch-anim:before {
            transition: left 0.3s;
        }
        .switch.switch-anim:checked {
            // box-shadow: #64bd63 0 0 0 16px inset;
            // background-color: #64bd63;
            transition: border ease 0.4s, box-shadow ease 0.4s, background-color ease 1.2s;
        }
        .switch.switch-anim:checked:before {
            transition: left 0.3s;
        }
    }
    .one-line {
      justify-content: space-between;
      font-weight: 100;
    }
    .two-line {
      border-top: 1px solid #EDEDED;
      font-weight: 100;
      .duration::-webkit-scrollbar {
        width: 0 !important
      }
      .duration {
        -ms-overflow-style: none;
        overflow: -moz-scrollbars-none;
        overflow-x: auto;
        list-style: none;
        white-space:nowrap;
        width: 80%;
        margin-left: 40px;
        .item {
          width: 120px;
          height: 64px;
          border: 1px solid #000;
          margin-left: 20px;
          display: inline-block;
          font-size: 12px;
          line-height: 64px;
          color: #000000;
          text-align: center;
          margin-top: 30px;
        }
        .active {
          background: #000000;
          color: #fff;
        }
        .disable {
          border: 1px solid #EDEDED;
          color: #EDEDED;
        }
      }
    }
    .jindutiao {
      input[type="range"] {
        display: block;
        -webkit-appearance: none;
        // background-color: #bdc3c7;
        background: rgba(101,101,101,0.3);
        width: 100%;
        height: 10px;border-radius: 5px;
        margin: 0 auto;outline: 0;
      }
      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        background-color: #000;
        width: 76px;
        height: 52px;
        border-radius: 25px;
        // border: 2px solid white;
        cursor: pointer;
        // transition: 0.3s ease-in-out;
      }

      .range {
        position: relative;
        width: 80%;
        margin: 0 auto;
        .range-zero::-webkit-slider-thumb {
          background: #EDEDED;
        }
        .range-zero {
          background: #EDEDED;
        }
      }
      .tips {
        font-size: 32px;
        color: #000000;
        float: right;
      }
      .tips-bak {
        color: #EDEDED;
      }
      .rang_width {
        position: absolute;
        top: 0;
        left: 0;
        background: #000;
        height: 10px;
        border-radius: 5px 0 0 5px;
        }
        .rang_bak {
          background: #EDEDED;
        }

      }
    }

  }
}
</style>
