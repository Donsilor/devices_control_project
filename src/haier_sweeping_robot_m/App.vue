<template>
  <div>
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, {'filter': showModeBtns }, 'page']">
      <topbar 
        :title="device_name"
        :bak-color="bakColor" />
      <div 
        v-show="model.switch == 'on' && model.mode !== 'recharge'" 
        class="status">{{ model.status | statusType }}</div>
      <div 
        v-show="model.mode == 'recharge'" 
        class="status">回充中</div>
      <!-- msg 提示 -->
      <transition name="fade">
        <div 
          v-show="isShowMsg"
          class="err-tips">{{ msg }}</div>
      </transition>
      <!-- 回充电池 -->
      <div class="wrap-robot">
        <img 
          class="robot"
          src="../../lib/base/sweeping_robot/assets/saodirobot@2x.png">
        <div 
          v-show="model.status == 'charging' || model.status == 'charge_completed'"
          class="robot-charging">
          <div 
            v-for="i in 5" 
            :key="i" 
            :class="[{'item-charging': chargRank < i }, 'none-charging']"/>
          <div class="line" />
        </div>
      </div>

      <div 
        v-show="model.status == 'working'" 
        class="huicheng run">
        <i class="img1 sport1" />
        <i class="img2 sport2" />
        <i class="img3 sport3" />
        <i class="img2 sport4" />
        <i class="img4 sport5" />
        <i class="img2 sport6" />
        <i class="img2 sport7" />
        <i class="img3 sport8" />
        <i class="img2 sport9" />
        <i class="img2 sport10" />
        <i class="img3 sport11" />
        <i class="img4 sport12" />
        <i class="img2 sport13" />
        <i class="img1 sport14" />
      </div>

      <div 
        v-show="model.status == 'charging'"
        class="wrap-filter">
        <div class="filter">
          <div class="filter-item">{{ model.battery_percentage }}<sup>%</sup></div>
          <div class="filter-name">目前电量</div>
        </div>
      </div>

      <div 
        v-show="model.status != 'charging'"
        class="wrap-filter detail">
        <div class="filter">
          <div class="filter-item">{{ model.battery_percentage }}<sup>%</sup></div>
          <div class="filter-name">剩余电量</div>
        </div>
      </div>

      <!-- 按钮 -->
      <div class="panel-btn center">
        <div :class="[{'up-index': !isOffline }, {'disable': model.status == 'charging'}, 'btn-wrap']">
          <div 
            :class="[{'active': !isClose && !isOffline }, 'btn btn-swich center']"
            @click="setSwitch" />
          <div class="btn-name">开关</div>
        </div>

        <div :class="[{'disable': model.status == 'working'}, 'btn-wrap btns']">
          <div 
            :class="[model.status == 'charging' ? 'charging' : '', 'btn btn-charging center circleProgress_wrapper']"
            @click="setCharging">
            <div class="wrapper right">
              <div class="circleProgress rightcircle" />
            </div>
            <div class="wrapper left">
              <div class="circleProgress leftcircle" />
            </div>
          </div>
          <div class="btn-name">回充</div>
        </div>

        <div :class="[{'disable': model.status == 'charging'}, 'btn-wrap']">
          <div 
            :class="[model.status == 'working' ? 'btn-stop' : 'btn-clean', 'btn center']" 
            @click="setCommand"/>
          <div 
            v-show="model.status !== 'working'" 
            class="btn-name">清扫</div>
          <div 
            v-show="model.status == 'working'" 
            class="btn-name">暂停</div>
        </div>

        <div :class="[{'disable': model.status == 'working'}, 'btn-wrap']">
          <div 
            :class="[btnClass, 'btn center btn-plan']" 
            @click="handeModeClick"/>
          <div 
            v-show="model.mode !== 'idle'" 
            class="btn-name" >{{ btnTxt }}</div>
          <div 
            v-show="model.mode == 'idle'"
            class="btn-name">规划</div>
        </div>

      </div>

    </div>

    <!-- 模式选择弹框 -->
    <div 
      v-show="showModeBtns"
      class="btns-panel center"
      @touchmove.prevent
      @click="hide">
      <div class="items btns">
        <div 
          :class="[{ 'item1': animation }, {' btn-current': model.mode === 'plan_clean' }, {'btn-loading': btnLoading.plan_clean },'btn plan_clean center']"
          @click.stop="setMode('plan_clean')">
          <div class="name">规划</div>
        </div>
        <div 
          :class="[{ 'item2': animation }, {' btn-current': model.mode === 'single_plan' }, {' btn-loading': btnLoading.single_plan },'btn single_plan center']"
          @click.stop="setMode('single_plan')">
          <div class="name">单间</div>
        </div>
        <div 
          :class="[{ 'item3': animation }, {' btn-current': model.mode === 'edge_clean' }, {' btn-loading': btnLoading.edge_clean },'btn edge_clean center']"
          @click.stop="setMode('edge_clean')">
          <div class="name">沿边</div>
        </div>
        <div 
          :class="[{ 'item4': animation }, {'disable': model.status !== 'charging' || model.status == 'charging'},'btn design_clean center']"
          @click.stop="setMode('design_clean')">
          <div class="name">定点</div>
        </div>
        <div 
          :class="[{ 'item5': animation }, {'disable': model.status !== 'charging' || model.status == 'charging'},'btn mop center']"
          @click.stop="setMode('mop')">
          <div class="name">拖地</div>
        </div>
        <div 
          :class="[ { 'item6': animation }, btnClass,'btn btn-plan center active']"
          @click.stop />
      </div>
    </div>
  </div>
</template>

<script>
import SubPage from "./SubPage"
const tips = {
  fail: '设置失败',
  temperature: '温度设置成功',
  speed_low: '低风切换成功',
  speed_normal: '中风切换成功',
  speed_high: '高风切换成功',
  speed_auto: '自动风速切换成功',
  mode_cold: '制冷模式切换成功',
  mode_auto: '智能模式切换成功',
  mode_heat: '制热模式切换成功',
  mode_dehumidify: '除湿模式切换成功',
  mode_wind: '送风模式切换成功',
  wind_up_down_on: '上下扫风已启动',
  wind_up_down_off: '上下扫风已关闭',
  wind_left_right_on: '左右扫风已启动',
  wind_left_right_off: '左右扫风已关闭',
  err_temp1: '送风模式下不能设置温度',
  err_temp2: '温度已调至最高',
  err_temp3: '温度已调至最低',
  err_temp4: '送风模式不能设置自动风速',
  err_temp5: '低风、制冷模式下不支持此温度'
}
export default {
  components: {
    SubPage
  },
  data() {
    return {
      chargRank: 5,
      chargTimes: {},
      isShowMsg: false,
      msg: '',
      device_name: "",
      model: {
        'switch': 'on',
        'mode': 'idle',
        'battery_percentage': '100',
        'status': 'standby',
        'sweep_direction': 'right',
        'fan_status': 'normall',

        'command': 'stop',
        'frequency': '2',

        'water_level': 'low',
        'remaining': '10',
        'order_time': '01:20',

        'notclean': [],
        'working_time': '60',
        'begin_point': '0',
        'cleaning': '0',
        'cleaned': '0',
        'unclean': '0',

        'alarm_cancel': 'on',
        'wheel_overload': 'on',
        'cliff': 'on',
        'bump': 'on',
        'brush': 'on',
        'dust_box': 'on',
        'battery_overheat': 'on',
        'fan_err': 'on',


        'connectivity': 'online'
      },
      showModeBtns: false,
      animation: false,
      btnLoading: {
        plan_clean: false,
        single_plan: false,
        edge_clean: false,
      },
      showSubPage: false
    }
  },
  computed: {
    isClose() {
      return this.model.switch == 'on' ? false : true
    },
    bakColor() {
      return this.isClose ? '#fff' : '#000'
    },
    isOffline() {
      return this.model.connectivity === 'online' ? false : true
    },
    btnClass() {
      /* eslint-disable no-unreachable */
      // idle/plan_clean/edge_clean/design_clean/mop/recharge/manual_control/single_plan
      // 空闲模式/规划清扫/沿边清扫/定点清扫/拖地模式/回充模式/手动控制/单间规划
      switch (this.model.mode) {
        case 'plan_clean':
          return 'plan_clean'
          break
        case 'single_plan':
          return 'single_plan'
          break
        case 'edge_clean':
          return 'edge_clean'
          break
        case 'design_clean':
          return 'design_clean'
          break
        case 'mop':
          return 'mop'
          break
        default:
          return 'btn-others'
      }
    },
    btnTxt() {
      /* eslint-disable no-unreachable */
      switch (this.model.mode) {
        case 'plan_clean':
          return '规划'
          break
        case 'single_plan':
          return '单间'
          break
        case 'edge_clean':
          return '沿边'
          break
        case 'design_clean':
          return '定点'
          break
        case 'mop':
          return '拖地'
          break
        case 'recharge':
          return '规划'
          break
        case 'manual_control':
          return '规划'
          break
      }
    }
  },
  created() {
    var str_model = window.localStorage.getItem("cleaner_model_attr")
    if (str_model) {
      try {
        // str_model 有可能不是合法的JSON字符串，便会产生异常
        this.model = JSON.parse(str_model)
      } catch (e) {
        this.model = {}
      }
    }
    HdSmart.ready(() => {
      if (window.device_name) {
        this.device_name = window.device_name
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
    setSpeed(speed) {
      // if (this.checkCmd('mode', mode)) return this.showModeBtns = false
      // this.showModeBtns = false
      this.controlDevice('speed', speed, {},
        () => {
          if (this.showModeBtns) this.showModeBtns = false
          this.showMsg(tips['speed' + speed])
        }, () => { }, speed)
    },
    setMode(mode) {
      if(mode === 'mop'|| mode == 'design_clean') {
        return false
      }
      this.controlDevice('mode', mode, {},
       () => {
          if(this.showModeBtns) this.hide()
       }, () => {}, mode)
    },
    setCommand(e) {
      console.log(this.model.status)
      //如果在充电中，无法点击清扫
      if(this.model.status == "charging") {
         e.stopPropatation||e.cancelBubble == true
        return false
      }
      // 清扫 暂时
      let cmd = ''
      if (this.model.status == 'working') {
        cmd = 'stop'
      } else {
        cmd = 'start'
      }
      this.controlDevice('command', cmd, {},
       () => {
          this.model.command = cmd
       }, () => {})
       
    },
    showBtnLoading(attr) {
      this.btnLoading[attr] = true
    },
    hideBtnLoading(attr) {
      this.btnLoading[attr] = false
    },
    showMsg(msg) {
      if (!msg) return
      clearTimeout(timer)
      this.msg = msg
      this.isShowMsg = true
      this.$nextTick(() => {
        timer = setTimeout(() => {
          this.isShowMsg = false
        }, 3000)
      })
    },
    setSwitch(e) {
       //如果在充电中，无法点击清扫
      if(this.model.status == "charging") {
         e.stopPropatation||e.cancelBubble == true
        return false
      }
      let switchStatus = ''
      if (this.model.switch == 'on') {
        switchStatus = 'off'
      } else {
        switchStatus = 'on'
      }
      this.controlDevice("switch", switchStatus)
      
    },
    handeModeClick() {
      this.showModeBtns = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.animation = true
        }, 0)
      })
    },
    hide() {
      this.showModeBtns = false
      this.animation = false
    },
    toSubPage() {
      console.log('showSubPage')
      this.showSubPage = true
    },
    showTip(text) {
      clearTimeout(this.tipTime)
      this.tip = text
      this.tipTime = setTimeout(() => {
        this.tip = ""
      }, 2000)
    },
    controlDevice(attr, val, param, success, error, btnAttr) {
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
            nodeid: `Sweepingrobot.main.${attr}`,
            params: {
              attribute: params
            }
          },
          () => {
            this.hideBtnLoading(btnAttr)
            // this.model.speed[attr] = val
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

    setControl() {
      let val = ''
      if (this.model.control_status == 'sleep') {
        val = 'manual'
      } else {
        val = 'sleep'
      }

      this.controlDevice("control", val, () => {
        this.model.control_status = val
      })
    },
    setCharging() {
      this.controlDevice('mode', 'recharge', {},
       () => {
          this.initCharge()
       }, () => {}, 'recharge')
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
      if(data.attribute.status == 'charge_completed' || data.attribute.status == 'charging') {
        this.initCharge()
      }
      // 将model 保存在 localStorage
      window.localStorage.setItem('cleaner_model_attr', JSON.stringify(data.attribute))
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
    },
    initCharge() {
      clearInterval(this.chargTimes)
      if(this.model.status == 'charge_completed'){
        return this.chargRank = 0
      }
      this.chargRank =  4
      this.chargTimes = setInterval(() => {
        this.chargRank--
        if(this.chargRank < 0) this.chargRank = 4
      }, 400)
    }
  },
}
</script>
<style lang="less" scoped>
.page {
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
  background: #fff;
  display: flex;
  flex-direction: column;
  .err-tips {
    position: absolute;
    top: 150px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 26px;
    color: #ffc600;
  }
  &.filter {
    filter: blur(12px);
  }
  .status {
    margin-top: 30px;
    font-size: 24px;
    color: #35353d;
    text-align: center;
  }
  .wrap-robot {
    text-align: center;
    // padding-top: 130px;
    padding-top: 180px;
    position: relative;
    z-index: 1;
    .garbage {
      width: 100%;
      height: 242px;
    }
    .robot {
      width: 446px;
      margin: auto;
    }
    .robot-charging {
      width: 46px;
      height: 100px;
      position: absolute;
      left: 50%;
      bottom: 118px;
      transform: translate(-50%, 0);
      display: inline-block;
      background: #FFF7DB;
      border: 1px solid #FFF0B2;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      .none-charging{
        flex: 1;
        border-radius: 2px;
        margin: 1.5px 6px;
        width: 34px;
        height: 14px;
        &.item-charging{
         background: #12F894;
        }
      }
      .line {
        position: absolute;
        width: 4px;
        height: 60px;
        background: #fff0b2;
        border-radius: 1px;
        position: absolute;
        bottom: -60px;
        left: 50%;
        transform: translate(-50%);
      }
    }
  }

  .huicheng{
    width:500px;
    height:130px;
    position: absolute;
    left:50%;
    top:250px;
    transform:translate(-50%);
    i{
      display: block;
      position: absolute;
    }
    .img1{
      width: 26px;
      height: 26px;
      background-image: url(../../lib/base/sweeping_robot/assets/img1.png);
      background-size: 100% 100%;
    }
    .img2{
      width: 20px;
      height: 20px;
      background-image: url(../../lib/base/sweeping_robot/assets/img2.png);
      background-size: 100% 100%;
    }
    .img3{
      width: 26px;
      height: 26px;
      background-image: url(../../lib/base/sweeping_robot/assets/img3.png);
      background-size: 100% 100%;
    }
    .img4{
      width: 6px;
      height: 6px;
      background: #FFCE00;
      border-radius: 50%;
    }

    .sport1 {
      top: 15px;
      left: 50px;
    }
    .sport2 {
      top: 90px;
      left: 30px;
    }
    .sport3 {
      top: 40px;
      left: 100px;
    }
    .sport4 {
      top: 70px;
      left: 150px;
    }
    .sport5 {
      top: 30px;
      left: 150px;
    }
    .sport6 {
      top: 50px;
      left: 250px;
    }
    .sport7 {
      top: 70px;
      left: 365px;
    }
    .sport8 {
      top: 55px;
      left: 200px;
    }
    .sport9 {
      top: 100px;
      left: 430px;
    }

    .sport10 {
      top: 10px;
      left: 220px;
    }
    .sport11 {
      top: 50px;
      left: 420px;
    }
    .sport12 {
      top: 18px;
      left: 300px;
    }
    .sport13 {
      top: 16px;
      left: 400px;
    }
    .sport14 {
      top: 50px;
      left: 280px;
    }

    @keyframes animX1{
      0% {left: 50px;}
      100% {left:60px}
    }
    @keyframes animX2{
      0% { left: 30px;}
      100% { left: 45px;}
    }
    @keyframes animX3{
      0% {left: 100px;}
      100% {left: 110px;}
    }
    @keyframes animX4{
      0% {left: 150px;}
      100% {left: 160px;}
    }
    @keyframes animX5{
      0% {left: 150px;}
      100% {left:160px;}
    }
    @keyframes animX6{
      0% {left: 250px;}
      100% {left: 260px;}
    }
    @keyframes animX7{
      0% {left: 365px;}
      100% {left: 380px;}
    }
    @keyframes animX8{
      0% {left: 200px;}
      100% {left: 210px;}
    }
    @keyframes animX9{
      0% {left: 430px;}
      100% {left: 440px;}
    }

    @keyframes animX10{
      0% {left: 220px;;}
      100% {left: 230px;}
    }
    @keyframes animX11{
      0% {left: 300px;}
      100% {left: 310px;}
    }
    @keyframes animX12{
      0% {left: 320px;}
      100% {left: 330px;}
    }
    @keyframes animX13{
      0% {left: 350px;}
      100% {left: 364px;}
    }
    @keyframes animX14{
      0% {left: 400px;}
      100% {left: 410px;}
    }


    @keyframes animY1{
      0% {top: 15px;}
      100% {top: 100px;}
    }
    @keyframes animY2{
      0% {top: 90px;}
      100% {top: 150px;}
    }
    @keyframes animY3{
      0% {top: 40px;}
      100% {top: 130px;}
    }
    @keyframes animY4{
      0% {top: 70px;}
      100% {top: 140px;}
    }
    @keyframes animY5{
      0% {top: 30px;}
      100% {top: 120px;}
    }
    @keyframes animY6{
      0% {top: 50px;}
      100% {top: 130px;}
    }
    @keyframes animY7{
      0% {top: 70px;}
      100% {top: 120px;}
    }
    @keyframes animY8{
      0% {top: 55px;}
      100% {top: 100px;}
    }
    @keyframes animY9{
      0% {top: 100px;}
      100% {top: 150px;}
    }

    @keyframes animY10{
      0% {top: 10px;}
      100% {top: 80px;}
    }
    @keyframes animY11{
      0% {top: 60px;}
      100% {top: 130px;}
    }
    @keyframes animY12{
      0% {top: 20px;}
      100% {top: 120px;}
    }
    @keyframes animY13{
      0% {top: 5px;}
      100% {top: 80px;}
    }
    @keyframes animY14{
      0% {top: 18px;}
      100% {top: 110px;}
    }
    &.run{
      .sport1{
        animation: animX1 .5s ease-in-out 0s infinite alternate, animY1 4s ease-in-out 0s infinite;
      }
      .sport2{
        animation: animX2 .5s ease-in-out -.5s infinite alternate, animY2 4s ease-in-out -.5s infinite;
      }
      .sport3{
        animation: animX3 .5s ease-in-out -1s infinite alternate, animY3 4s ease-in-out -1s infinite;
      }
      .sport4{
        animation: animX4 .5s ease-in-out -1.5s infinite alternate, animY4 4s ease-in-out -1.5s infinite;
      }
      .sport5{
        animation: animX5 .5s ease-in-out -2s infinite alternate, animY5 4s ease-in-out -2s infinite;
      }
      .sport6{
        animation: animX6 .5s ease-in-out -2.5s infinite alternate, animY6 4s ease-in-out -2.5s infinite;
      }
      .sport7{
        animation: animX7 .5s ease-in-out -3s infinite alternate, animY7 4s ease-in-out -3s infinite;
      }
      .sport8{
        animation: animX8 .5s ease-in-out -3.5s infinite alternate, animY8 4s ease-in-out -3.5s infinite;
      }
      .sport9{
        animation: animX9 .5s ease-in-out -3.7s infinite alternate, animY9 4s ease-in-out -3.7s infinite;
      }

      .sport10{
        animation: animX10 .5s ease-in-out -2s infinite alternate, animY10 4s ease-in-out -2s infinite;
      }
      .sport11{
        animation: animX11 .5s ease-in-out -2.5s infinite alternate, animY11 4s ease-in-out -2.5s infinite;
      }
      .sport12{
        animation: animX12 .5s ease-in-out -3s infinite alternate, animY12 4s ease-in-out -3s infinite;
      }
      .sport13{
        animation: animX13 .5s ease-in-out -3.5s infinite alternate, animY13 4s ease-in-out -3.5s infinite;
      }
      .sport14{
        animation: animX14 .5s ease-in-out -3.7s infinite alternate, animY14 4s ease-in-out -3.7s infinite;
      }
    }
  }
  .wrap-filter {
    flex: 1;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    &.detail {
      margin-bottom: 48px;
    }
  }
  .filter {
    color: #35353d;
    margin: 0 38px;
    .filter-item {
      position: relative;
      font-size: 80px;
      text-align: center;
      line-height: 113px;
      sup {
        white-space: nowrap;
        font-size: 24px;
        position: absolute;
        top: -30px;
        &.comma {
          font-size: 40px;
          line-height: 80px;
        }
      }
    }
    .filter-name {
      text-align: center;
      color: #35353d;
      font-size: 24px;
    }
  }

  .panel-btn {
    height: 306px;
    width: 100%;
    background: #ffffff;
    box-shadow: 0 -3px 28px 0 rgba(209, 209, 209, 0.5);
    border-radius: 42px 42px 0px 0px;
    // position: fixed;
    // bottom: 0;
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
    margin: 0 24px 0;
    &.disable{
      opacity: .2;
    }
    &.up-index {
      position: relative;
      z-index: 9999;
    }
    .btn {
      box-sizing: border-box;
      margin: 0 auto;
      width: 120px;
      height: 120px;
      border: 1px solid #b9b9b9;
      border-radius: 50%;

      display: flex;
      flex-direction: column;
      &.active {
        opacity: 1;
        background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
        border-color: #ffbf00;
      }
    }
    .btn-name {
      text-align: center;
      color: #000;
      margin-top: 14px;
      font-size: 24px;
    }
    .btn-swich {
      &::before {
        content: "";
        display: block;
        width: 48px;
        height: 48px;
        background-image: url(../../lib/base/air_cleaner/assets/new-air/swich-white.png);
        background-size: 100% 100%;

      }
      &.active {
        &::before {
          background-image: url(../../lib/base/air_cleaner/assets/new-air/swich-black.png);
        }
      }
    }
    .btn-charging {
      &::before {
        content: "";
        display: block;
        width: 48px;
        height: 48px;
        background-image: url(../../lib/base/sweeping_robot/assets/huichong1@2x.png);
        background-size: 100% 100%;
      }
    }
    .btn-clean {
      &::before {
        content: "";
        display: block;
        width: 48px;
        height: 48px;
        background-image: url(../../lib/base/sweeping_robot/assets/qingsao2@2x.png);
        background-size: 100% 100%;
      }
    }
    .btn-stop {
      &::before {
        content: "";
        display: block;
        width: 48px;
        height: 48px;
        background-image: url(../../lib/base/sweeping_robot/assets/btn-stop.png);
        background-size: 100% 100%;
      }
    }
    .btn-plan {
      &::before {
        content: "";
        display: block;
        width: 48px;
        height: 48px;
        background-image: url(../../lib/base/sweeping_robot/assets/guihua0.png);
        background-size: 100% 100%;
      }
      &.plan_clean::before {
        background-image: url(../../lib/base/sweeping_robot/assets/guihua@2x.png);
        opacity: .2;
      }
      &.single_plan::before {
        background-image: url(../../lib/base/sweeping_robot/assets/danjian3.png);
         opacity: .2;
      }
      &.edge_clean::before {
        background-image: url(../../lib/base/sweeping_robot/assets/yanbian3.png);
         opacity: .2;
      }
      &.design_clean::before {
        background-image: url(../../lib/base/sweeping_robot/assets/dingwei3.png);
         opacity: .2;
      }
      &.mop::before {
        background-image: url(../../lib/base/sweeping_robot/assets/tuodi3.png);
         opacity: .2;
      }
    }
  }

  .circleProgress_wrapper {
    width: 120px;
    height: 120px;
    margin: 50px auto;
    position: relative;
    .wrapper {
      width: 60px;
      height: 120px;
      position: absolute;
      top: 0;
      overflow: hidden;
    }

    .right {
      right: -1px;
    }

    .left {
      left: -1px;
    }

    .circleProgress {
      box-sizing: border-box;
      width: 120px;
      height: 120px;
      border: 1px solid transparent;
      border-radius: 50%;
      position: absolute;
      top: -1px;
    }
    &.charging {
      .rightcircle {
        border-top: 1px solid yellow;
        border-right: 1px solid yellow;
        right: 0;
        animation: circleRight 5s linear infinite;
      }
      .leftcircle {
        border-bottom: 1px solid yellow;
        border-left: 1px solid yellow;
        left: 0;
        animation: circleLeft 5s linear infinite;
      }
      &::before {
        background-image: url("../../lib/base/sweeping_robot/assets/chongdianzhong.png");
      }
    }
    @keyframes circleRight {
      0% {
        -webkit-transform: rotate(225deg);
      }

      50%,
      100% {
        -webkit-transform: rotate(405deg);
      }
    }

    @keyframes circleLeft {
      0%,
      50% {
        -webkit-transform: rotate(225deg);
      }

      100% {
        -webkit-transform: rotate(405deg);
      }
    }
  }

  &.close,
  &.offline {
    &:before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 999;
      width: 100%;
      background: rgba(0, 0, 0, 0.7);
    }
    .btn-wrap {
      &.up-index {
        .btn-swich {
          background: transparent;
          border: 1px solid #fff;

          &::before {
            content: "";
            display: block;
            width: 48px;
            height: 48px;
            background-image: url(../../lib/base/air_cleaner/assets/new-air/swich-white.png);
            background-size: 100% 100%;
          }
          &.active {
            &::before {
              background-image: url(../../lib/base/air_cleaner/assets/new-air/swich-white.png);
            }
          }
        }
      }
    }
  }
  &.offline {
    .btn-wrap {
      .btn-swich {
        background: transparent;
        border: 1px solid #000;

        &::before {
          content: "";
          display: block;
          width: 48px;
          height: 48px;
          background-image: url(../../lib/base/air_cleaner/assets/new-air/swich-black.png);
          background-size: 100% 100%;
        }
        &.active {
          &::before {
            background-image: url(../../lib/base/air_cleaner/assets/new-air/swich-black.png);
          }
        }
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
    // left: 0;
    left: 50%;
    transform: translate(-50%);
    bottom: 70px;
    z-index: 999999;
    width: 750px;
    min-height: 160px;
    .btn {
      transition: all 0.3s ease-in-out;
      position: absolute;
      top: 0;
      right: 34px;
    }
    .item1 {
      top: -720px;
      right: 34px;
    }
    .item2 {
      top: -576px;
      right: 34px;
    }
    .item3 {
      top: -432px;
      right: 34px;
    }
    .item4 {
      top: -288px;
      right: 34px;
    }
    .item5 {
      top: -144px;
      right: 34px;
    }
     .item6 {
      top: 0;
      right: 34px;
    }
  }
  .btns {
    justify-content: flex-start;
    transition: all 0.3s ease-in-out;
    margin-top: 57px;
    .btn {
      margin-right: 20px;
      width: 120px;
      height: 120px;
      border: 1px solid #fff;
      border-radius: 50%;

      display: flex;
      flex-direction: column;
      &.disable {
        opacity: .2;
      }
      .name {
        margin-top: 8px;
        font-size: 20px;
        color: #fff;
      }
      &.active {
        background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
        border-color: #ffbf00;

        &.plan_clean::before {
          background-image: url(../../lib/base/sweeping_robot/assets/guihua@2x.png);
        }
        &.single_plan::before {
          background-image: url(../../lib/base/sweeping_robot/assets/danjian3.png);
        }
        &.edge_clean::before {
          background-image: url(../../lib/base/sweeping_robot/assets/yanbian3.png);
        }
        &.design_clean::before {
          background-image: url(../../lib/base/sweeping_robot/assets/dingwei3.png);
        }
        &.mop::before {
          background-image: url(../../lib/base/sweeping_robot/assets/tuodi3.png);
        }
      }
    }
    .btn-swich {
      &::before {
        content: "";
        display: block;
        width: 48px;
        height: 48px;
        background-image: url(../../lib/base/air_cleaner/assets/new-air/swich-white.png);
        background-size: 100% 100%;
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/air_cleaner/assets/new-air/swich-black.png);
        }
      }
    }
    .btn-plan {
      &::before {
        content: "";
        display: block;
        width: 48px;
        height: 48px;
        background-image: url(../../lib/base/sweeping_robot/assets/guihua@2x.png);
        background-size: 100% 100%;
      }
    }
    .plan_clean {
      &::before {
        content: "";
        display: block;
        width: 48px;
        height: 48px;
        background-image: url(../../lib/base/sweeping_robot/assets/guihua.png);
        background-size: 100% 100%;
      }

      &.btn-current {
        border-color: #ffc600;
        &::before {
          background-image: url(../../lib/base/sweeping_robot/assets/gh-yellow.png);
        }
        .name {
          color: #ffc600;
        }
      }
    }
    .single_plan {
      &::before {
        content: "";
        display: block;
        width: 48px;
        height: 48px;
        background-image: url(../../lib/base/sweeping_robot/assets/danjian.png);
        background-size: 100% 100%;
      }
      &.btn-current {
        border-color: #ffc600;
        &::before {
          background-image: url(../../lib/base/sweeping_robot/assets/danjian2.png);
        }
        .name {
          color: #ffc600;
        }
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/sweeping_robot/assets/danjian2.png);
        }
      }
    }
    .edge_clean {
      &::before {
        content: "";
        display: block;
        width: 48px;
        height: 48px;
        background-image: url(../../lib/base/sweeping_robot/assets/yanbian.png);
        background-size: 100% 100%;
      }
      &.btn-current {
        border-color: #ffc600;
        &::before {
          background-image: url(../../lib/base/sweeping_robot/assets/yanbian2.png);
        }
        .name {
          color: #ffc600;
        }
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/sweeping_robot/assets/yanbian2.png);
        }
      }
    }
    .design_clean {
      &::before {
        content: "";
        display: block;
        width: 48px;
        height: 48px;
        background-image: url(../../lib/base/sweeping_robot/assets/dingdian.png);
        background-size: 100% 100%;
      }
      &.btn-current {
        border-color: #ffc600;
        &::before {
          background-image: url(../../lib/base/sweeping_robot/assets/dingdian2.png);
        }
        .name {
          color: #ffc600;
        }
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/sweeping_robot/assets/dingdian2.png);
        }
      }
    }
    .mop {
      &::before {
        content: "";
        display: block;
        width: 48px;
        height: 48px;
        background-image: url(../../lib/base/sweeping_robot/assets/tuodi.png);
        background-size: 100% 100%;
      }
      // &.btn-current {
      //   border-color: #ffc600;
      //   &::before {
      //     background-image: url(../../lib/base/sweeping_robot/assets/tuodi2.png);
      //   }
      //   .name {
      //     color: #ffc600;
      //   }
      // }
      &.active {
        &::before {
          background-image: url(../../lib/base/sweeping_robot/assets/tuodi2.png);
        }
      }
    }
  }
}
</style>
