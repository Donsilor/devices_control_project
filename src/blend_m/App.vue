<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, {'filter': showModeBtns }, 'page']">
      <topbar
        :title="device_name"
        bak-color="#000"/>
      <div class="timebox">
        <div 
          v-show="model.order_time > 0 && model.connectivity == 'online'" 
          class="appointment">
          <img src="../../lib/base/blend/assets/time-black.png">
          2小时25分后启动运行
        </div>
      </div>
      <div
        class="main center">
        <div class="bg center">
          <div class="bg2 center">
            <div class="num">{{ model.machine_status == 'standby' ? '预计运行时间' : '剩余时间' }}</div>
            <!-- 离线的时候显示的时间 -->
            <div 
              v-show="model.connectivity == 'offline'" 
              class="offtime">--:--</div>
            <!-- 预计运行时间 -->
            <div 
              v-show="model.machine_status == 'standby'&& model.connectivity == 'online'" 
              class="time">{{ model['h-t10'] }}:{{ model['h-t11'] }}</div>
            <!-- 剩余运行时间 -->
            <div 
              v-show="model.machine_status !== 'standby'" 
              class="time">{{ model.remaining_run_time }}</div>
            <div 
              v-show="model.connectivity !== 'offline'" 
              class="cmode">{{ btnTxt }}</div>
          </div>
        </div>
      </div>
      <div 
        v-show="model.machine_status !== 'standby'" 
        class="status">运行中…</div>

      <!-- 按钮 -->
      <div class="panel-btn center">
        <div :class="[{'up-index': !isOffline },{'disable' : model.order_time > 0 }, 'btn-wrap']" >
          <div
            :class="[ model.machine_status == 'standby' ? 'btn-start': 'btn-stop', 'btn center']"
            @click="setSwitch" />
          <div class="btn-name">{{ model.machine_status == 'standby' ? '启动' : '暂停' }}</div>
        </div>

        <div :class="[{'disable' : model.machine_status !== 'standby' || model.order_time > 0},'btn-wrap']">
          <div
            :class="[modeBtnClass, 'btn center btn-mode']"
            @click="handeModeClick" />
          <div class="btn-name">模式</div>
        </div>

        <div :class="[{'disable' : model.machine_status !== 'standby'},'btn-wrap']">
          <div
            class="btn btn-time center"
            @click="showTime" />
          <div class="btn-name">预约</div>
        </div>
      </div>
    </div>
    <!-- 模式选择弹框 -->
    <Modal 
      v-model="showModeBtns" 
      title="选择模式">
      <div class="items">
        <div class="btns">
          <div 
            class="btn-wrap" 
            @click="setMode('grains')">
            <div :class="[{ 'active': model.machine_mode == 'grains' },{'btn-loading': btnLoading.grains }, 'btn btn-mode1 center']" />
            <div class="btn-name">五谷</div>
          </div>

          <div 
            class="btn-wrap"
            @click="setMode('rice_paste')">
            <div :class="[{ 'active': model.machine_mode == 'rice_paste' }, {'btn-loading': btnLoading.rice_paste }, 'btn btn-mode2 center']"/>
            <div class="btn-name">米糊</div>
          </div>

          <div 
            class="btn-wrap"
            @click="setMode('gruel')">
            <div :class="[{ 'active': model.machine_mode == 'gruel' }, {'btn-loading': btnLoading.gruel }, 'btn btn-mode3 center']"/>
            <div class="btn-name">绵粥</div>
          </div>
          <div 
            class="btn-wrap"
            @click="setMode('pottage')">
            <div :class="[{ 'active': model.machine_mode == 'pottage' }, {'btn-loading': btnLoading.pottage }, 'btn btn-mode4 center']"/>
            <div class="btn-name">浓汤</div>
          </div>
        </div>
      </div>
      <div class="items">
        <div class="btns">
          <div 
            class="btn-wrap" 
            @click="setMode('stewing')">
            <div :class="[{ 'active': model.machine_mode == 'stewing' }, {'btn-loading': btnLoading.stewing }, 'btn btn-mode5 center']" />
            <div class="btn-name">蒸煮</div>
          </div>

          <div 
            class="btn-wrap"
            @click="setMode('grind')">
            <div :class="[{ 'active': model.machine_mode == 'grind' }, {'btn-loading': btnLoading.grind }, 'btn btn-mode6 center']"/>
            <div class="btn-name">研磨</div>
          </div>

          <div 
            class="btn-wrap"
            @click="setMode('fruit_vegdtable')">
            <div :class="[{ 'active': model.machine_mode == 'fruit_vegdtable' }, {'btn-loading': btnLoading.fruit_vegdtable }, 'btn btn-mode7 center']"/>
            <div class="btn-name">果蔬</div>
          </div>
          <div 
            class="btn-wrap"
            @click="setMode('milk_shake')">
            <div :class="[{ 'active': model.machine_mode == 'milk_shake' }, {'btn-loading': btnLoading.milk_shake }, 'btn btn-mode8 center']"/>
            <div class="btn-name">奶昔</div>
          </div>
        </div>
      </div>
      <div class="items">
        <div class="btns">
          <div 
            class="btn-wrap" 
            @click="setMode('water_ice')">
            <div :class="[{ 'active': model.machine_mode == 'water_ice' }, {'btn-loading': btnLoading.water_ice }, 'btn btn-mode9 center']" />
            <div class="btn-name">沙冰</div>
          </div>
          <div 
            class="btn-wrap"
            @click="setMode('tepidity')">
            <div :class="[{ 'active': model.machine_mode == 'tepidity' }, {'btn-loading': btnLoading.tepidity }, 'btn btn-mode10 center']"/>
            <div class="btn-name">温热</div>
          </div>
        </div>
      </div>
    </Modal>
    <!-- 时间选择 -->
    <SelectTime 
      ref="time" 
      @selectedTime="setReserve" />

  </div>
</template>

<script>
import SelectTime from '../../lib/components/time/time.vue'
import Modal from '../../lib/components/Modal.vue'

export default {
  components: {
    SelectTime,
    Modal
  },
  data() {
    return {
      device_name: "",
      model: {
        "progress": 60,
        "machine_mode": 'grains',
        "order_time": 440,
        "step": 3,
        "speed_tem": 10,
        "run_time": 40,
        "machine_status": 'standby',
        "order_mode": 'grains',
        "realtime_tem": 79,
        "realtime_speed": 3,
        "no_cup": 'on',
        "dry_heat": 'on',
        "connectivity": "online",
         "h-t10": "30",
         "h-t11": "00"
      },
      showModeBtns: false,
      animation: false,
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
      },
    }
  },
  computed: {
    isRun() {
      return this.model.machine_status == 'standby'
    },
    isClose() {
      return this.model.machine_mode == 'off' ? true : false
    },
    isOffline() {
      return this.model.connectivity === 'online' ? false : true
    },
    btnTxt() {
       switch(this.model.machine_mode) {
        case 'grains':
          return '五谷'
          break
        case 'rice_paste':
          return '米糊'
          break
        case 'gruel':
          return '绵粥'
          break
        case 'pottage':
          return '浓汤'
          break

        case 'stewing':
            return '蒸煮'
            break
        case 'grind':
            return '研磨'
            break
          case 'fruit_vegdtable':
            return '果蔬'
            break
          case 'milk_shake':
            return '奶昔'
            break
          case 'water_ice':
            return '沙冰'
            break
          case 'tepidity':
            return '温热'
            break 
          default:
            return '绵粥'
      }
    },
    modeBtnClass(){
      /* eslint-disable no-unreachable */
      switch(this.model.machine_mode) {
        case 'grains':
          return 'grains'
          break
        case 'rice_paste':
          return 'rice_paste'
          break
        case 'gruel':
          return 'gruel'
          break
        case 'pottage':
          return 'pottage'
          break

        case 'stewing':
            return 'stewing'
            break
        case 'grind':
            return 'grind'
            break
          case 'fruit_vegdtable':
            return 'fruit_vegdtable'
            break
          case 'milk_shake':
            return 'milk_shake'
            break
          case 'water_ice':
            return 'water_ice'
            break
          case 'tepidity':
            return 'tepidity'
            break 
          default:
            return 'gruel'
      }
    },
  },
  watch: {
    // 当切换模式的时候，预约的时间将作废
    // "model.machine_mode":function() {
    //   this.controlDevice('order_time', 0, {},
    //     () => {
    //       if (this.showModeBtns) this.hide()
    //     }, () => { }, 'order_time')
    // }
  },
  created() {
    HdSmart.ready(() => {
      if (window.device_name) {
        this.device_name = window.device_name
      }
      if (window.device_uuid) {
        var str_model = window.localStorage.getItem(window.device_uuid)
        if (str_model) {
          try {
            // str_model 有可能不是合法的JSON字符串，便会产生异常
            this.model = JSON.parse(str_model)
          } catch (e) {
            this.model = {}
          }
        }
      }
      HdSmart.UI.showLoading()
      this.getSnapShot(() => {
        HdSmart.UI.hideLoading()
      })
    })

    HdSmart.onDeviceStateChange(data => {
      this.onSuccess(data.result)
    })
  },
  methods: {
    showTime() {
      if(this.model.machine_status !== 'standby'){
        return false
      }
      if(!this.isClose) this.$refs.time.show = true
    },
    setReserve(time) {
      if (this.model.machine_status !== 'standby') {
        HdSmart.UI.toast('运行中无法设置预约')
        return
      }
      let h = parseInt(time.split(':')[0])
      let m = parseInt(time.split(':')[1]) > 0 ? 0.5 : 0
      this.controlDevice('order_time', h + m)
    },

    setSwitch() {
      if (this.model.order_time > 0) {
        return false
      }
      if(this.model.machine_status == 'standby') {
        this.controlDevice('machine_status', this.model.machine_mode, {},
        () => {
        }, () => { }, this.model.machine_mode)
      }else{
        this.controlDevice('machine_status', 'standby', {},
        () => {
        }, () => { }, 'standby')
      }
    },
    // 点击模式
    handeModeClick() {
      // 所有模式互斥
      if (this.model.machine_status !== 'standby' || this.model.order_time > 0 ) {
        return false
      }
      this.showModeBtns = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.animation = true
        }, 0)
      })
    },
    // 切换模式
    setMode(mode) {
      this.controlDevice('machine_mode', mode, {},
        () => {
          if (this.showModeBtns) this.hide()
        }, () => { }, mode)
    },
    hide() {
      this.showModeBtns = false
      this.animation = false
    },
    // 显示按钮点击loading
    showBtnLoading(attr) {
      this.btnLoading[attr] = true
    },
    // 隐藏按钮点击loading
    hideBtnLoading(attr) {
      this.btnLoading[attr] = false
    },
    showTip(text) {
      clearTimeout(this.tipTime)
      this.tip = text
      this.tipTime = setTimeout(() => {
        this.tip = ""
      }, 2000)
    },
    controlDevice(attr, val, param, success, error,btnAttr) {
      this.showBtnLoading(btnAttr)
      var fn = this.confirm
      var params = Object.assign(
        {
          [attr]: val
        },
        param
      )

      if (attr == "child_lock_switch") {
        fn = function(cb) {
          cb()
        }
      }

      fn(() => {
        HdSmart.Device.control(
          {
            method: "dm_set",
            nodeid: `air_filter.main.${attr}`,
            params: {
              attribute: params
            }
          },
          () => {
            this.hideBtnLoading(btnAttr)
            success && success()
          },
          () => {
            this.hideBtnLoading(btnAttr)
            error && error()
            this.showTip("操作失败")
          }
        )
      })
    },
    getSnapShot(cb) {
      HdSmart.Device.getSnapShot(
        data => {
          this.onSuccess(data)
          cb && cb()
        },
        () => {
          cb && cb()
        }
      )
    },
    onSuccess(data) {
      this.status = "success"
      this.model = data.attribute
      // 将model 保存在 localStorage
      if (window.device_uuid) {
        window.localStorage.setItem(window.device_uuid, JSON.stringify(data.attribute))
      }
    },
    confirm(done) {
      if (this.model.child_lock_switch_status == "on") {
        HdSmart.UI.alert(
          {
            title: "解除童锁",
            message: "解除童锁后才能控制此设备，\n是否解除？",
            dialogStyle: 2
          },
          val => {
            if (val) this.setChildLock()
          }
        )
      } else {
        done()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.btn-loading{
  position: relative;
  &:after{
    width: 90%;
    height: 90%;
    content: '';
    background-image: url(../../lib/base/blend/assets/blueloading.gif);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
*{
  touch-action: none;
}
.body{
  min-height: 100%;
}
.page {
  height: 100vh;
  min-height: 550px;
  overflow-x: hidden;
  position: relative;
  background: rgba(230, 255, 243, 1);

  &.filter {
    filter: blur(12px);
  }
  .timebox{
    width: 100%;
    height: 32px;
    margin-top: 10px;
    .appointment{
      font-size: 24px;
      color: #20282B;
      display: flex;
      align-items: center;
      justify-content: center;
      vertical-align:middle;
    >img{
      width: 25px;
      height: 25px;
      margin-right: 10px;
    }
  }
  }
  .bg{
    width: 750px;
    height: 750px;
    background-image: url(../../lib/base/blend/assets/bg3.png);
    background-size: 100% 100%;
    // margin: 60px auto;
    .bg2{
      flex-direction: column;
      width: 620px;
      height: 620px;
      margin: auto;
      background-image: url(../../lib/base/blend/assets/bg1.png);
      background-size: 100% 100%;
    }
  }
  .main {
    position: relative;

    &.center{
      flex-direction: column;
    }

    .num {
      font-size: 24px;
      color: #20282B;
      text-align: center;
    }
    .offtime {
      font-size: 112px;
      color: #20282B;
      letter-spacing: 0;
    }
    .time {
      font-size: 112px;
      color: #20282B;
      text-align: center;
    }
    .cmode{
      font-size: 32px;
      color: #20282B;
      text-align: center;
    }

    .nuit {
      opacity: 0.5;
      color: #03FD05;
      font-size: 24px;
      letter-spacing: 0;
      text-align: center;
      position: absolute;
      top: 145px;
    }
  }
  .status{
    margin-top: 25px;
    font-size: 24px;
    color: #20282B;
    text-align: center;
  }
  .panel-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;


    height: 306px;
    background: #FFFFFF;
    box-shadow: 0 -3px 28px 0 rgba(209,209,209,0.50);
    border-radius: 42px 42px 0px 0px;
    .btn {
      margin-top: 24px;
      width: 100%;
      height: 306px;
      border-radius: 40px 40px 0 0;
      background: #ffffff;
      box-shadow: 0 -3px 28px 0 rgba(209, 209, 209, 0.5);
      display: flex;
      justify-content: space-evenly;
      align-items: center;
    }
  }

  .btn-wrap {
    margin: -40px 36px 0;
    &.up-index{
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
        background-image: linear-gradient(-90deg, #FFD500 0%, #FFBF00 100%);
        border-color: #FFBF00;
      }
    }
    .btn-name {
      text-align: center;
      color: #818181;
      margin-top: 16px;
      font-size: 24px;
    }
    .btn-start {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/start.png);
        background-size: 100% 100%;
      }
    }
    .btn-stop {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-stop.png);
        background-size: 100% 100%;
      }
    }
    .btn-time {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/time-black.png);
        background-size: 100% 100%;
      }
    }
    .btn-mode {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode1.png);
        background-size: 100% 100%;
      }
      &.grains::before {
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode1.png);
        background-size: 100% 100%;
      }
      &.rice_paste::before {
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode2.png);
        background-size: 100% 100%;
      }
      &.gruel::before {
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode3.png);
        background-size: 100% 100%;
      }
      &.pottage::before {
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode4.png);
        background-size: 100% 100%;
      }
      &.stewing::before {
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode5.png);
        background-size: 100% 100%;
      }
      &.grind::before {
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode6.png);
        background-size: 100% 100%;
      }
      &.fruit_vegdtable::before {
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode7.png);
        background-size: 100% 100%;
      }
      &.milk_shake::before {
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode8.png);
        background-size: 100% 100%;
      }
      &.water_ice::before {
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode9.png);
        background-size: 100% 100%;
      }
      &.tepidity::before {
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode10.png);
        background-size: 100% 100%;
      }
    }
    &.disable {
     opacity: 0.2;
    }
  }
  &.close,  &.offline {
    &:before {
      content: "";
      position: fixed;
      top: 64PX;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 999;
      width: 100%;
      background: rgba(0, 0, 0, 0.1);
    }
    &.page{
      background: #fff;
      .bg .bg2{
        background-image: url(../../lib/base/blend/assets/bg2.png);
        background-size: 100% 100%;
      }
    }
    .btn-wrap{
      opacity: .2;
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
      border: 1px solid #20282B;
      border-radius: 50%;

      display: flex;
      flex-direction: column;
      &.active {
        background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
        border: none;
      }
    }
    // .btn-start {
    //   &::before {
    //     content: "";
    //     display: block;
    //     width: 44px;
    //     height: 44px;
    //     background-image: url(../../lib/base/haier_washer/assets/btn-start.png);
    //     background-size: 100% 100%;
    //   }
    //   &.active {
    //     &::before {
    //       background-image: url(../../lib/base/haier_washer/assets/btn-stop.png);
    //     }
    //   }
    // }
    // .btn-stop {
    //   &::before {
    //     content: "";
    //     display: block;
    //     width: 44px;
    //     height: 44px;
    //     background-image: url(../../lib/base/haier_washer/assets/btn-stop.png);
    //     background-size: 100% 100%;
    //   }
    //   &.active {
    //     &::before {
    //       background-image: url(../../lib/base/haier_washer/assets/btn-stop.png);
    //     }
    //   }
    // }
    // .btn-mode {
    //   &::before {
    //     content: "";
    //     display: block;
    //     width: 44px;
    //     height: 44px;
    //     background-image: url(../../lib/base/haier_washer/assets/btn-mode-white58.png);
    //     background-size: 100% 100%;
    //   }
    //   &.active {
    //     &::before {
    //       background-image: url(../../lib/base/haier_washer/assets/btn-mode-black58.png);
    //     }
    //   }
    // }
    // .btn-time {
    //   &::before {
    //     content: "";
    //     display: block;
    //     width: 44px;
    //     height: 44px;
    //     background-image: url(../../lib/base/air_condition/assets/new-air/time-white.png);
    //     background-size: 100% 100%;
    //   }
    //   &.active {
    //     &::before {
    //       background-image: url(../../lib/base/air_condition/assets/new-air/time-black.png);
    //     }
    //   }
    //   &.btn-current {
    //     border-color: #FFC600;
    //     &::before {
    //       background-image: url(../../lib/base/air_condition/assets/new-air/time-yellow.png);
    //     }
    //     .name{
    //       color: #FFC600;
    //     }
    //   }
    // }

    .btn-mode1 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode1.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/blend/assets/btn-mode1.png);
        }
      }
    }
    .btn-mode2 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode2.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/blend/assets/btn-mode2.png);
        }
      }
    }
    .btn-mode3 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode3.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/blend/assets/btn-mode3.png);
        }
      }
    }
    .btn-mode4 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode4.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/blend/assets/btn-mode4.png);
        }
      }
    }
    .btn-mode5 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode5.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/blend/assets/btn-mode5.png);
        }
      }
    }
    .btn-mode6 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode6.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/blend/assets/btn-mode6.png);
        }
      }
    }
    .btn-mode7 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode7.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/blend/assets/btn-mode7.png);
        }
      }
    }
    .btn-mode8 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode8.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/blend/assets/btn-mode8.png);
        }
      }
    }
    .btn-mode9 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode9.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/blend/assets/btn-mode9.png);
        }
      }
    }
    .btn-mode10 {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../lib/base/blend/assets/btn-mode10.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/blend/assets/btn-mode10.png);
        }
      }
    }


  }
}

</style>
