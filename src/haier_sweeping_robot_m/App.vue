<template>
  <div>
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, {'filter': showModeBtns }, 'page']">
      <topbar 
        :title="device_name"
        :bak-color="bakColor" />
      <div class="status">{{ model.status | statusType }}</div>
      <!-- msg 提示 -->
      <transition name="fade">
        <div 
          v-show="isShowMsg"
          class="err-tips">{{ msg }}</div>
      </transition>
      <div class="wrap-robot">
        <div class="garbage">
          <img 
            src="../../lib/base/sweeping_robot/assets/huicheng1@2x.png" 
            class="pic">
          <img 
            src="../../lib/base/sweeping_robot/assets/huicheng2@2x.png" 
            class="pic">
          <img 
            src="../../lib/base/sweeping_robot/assets/huicheng3@2x.png" 
            class="pic"></div>
        <img 
          class="robot"
          src="../../lib/base/sweeping_robot/assets/saodirobot@2x.png">
        <div 
          v-show="model.status == 'charging'" 
          class="robot-charging">
        <div class="line"/></div>
      </div>

      <!-- <div class="point">
        <span class="sport sport1" />
        <span class="sport sport2" />
        <span class="sport sport3" />
        <span class="sport sport4" />
        <span class="sport sport5" />
        <span class="sport sport6" />
        <span class="sport sport7" />
        <span class="sport sport8" />
        <span class="sport sport9" />
        <span class="sport sport10" />
        <span class="sport sport11" />
        <span class="sport sport12" />
        <span class="sport sport13" />
        <span class="sport sport1" />
      </div> -->

      <div 
        v-show="model.status == 'charging'"
        class="wrap-filter">
        <!-- <div class="filter">
          <div class="filter-item">{{ model.filter_time_remaining }}<sup>%</sup></div>
          <div class="filter-name">剩余滤芯</div>
        </div> -->
        <div class="filter">
          <div class="filter-item">{{ model.battery_percentage }}<sup>%</sup></div>
          <div class="filter-name">目前电量</div>
        </div>
      </div>

      <div 
        v-show="model.status != 'charging'" 
        class="wrap-filter detail">
        <!-- <div class="filter">
          <div class="filter-item">{{ model.filter_time_remaining }}<sup>%</sup></div>
          <div class="filter-name">剩余滤芯</div>
        </div> -->
        <div class="filter">
          <div class="filter-item">{{ model.battery_percentage }}<sup>m²</sup></div>
          <div class="filter-name">清扫面积</div>
        </div>
        <div class="filter">
          <div class="filter-item">{{ model.battery_percentage }}<sup>%</sup></div>
          <div class="filter-name">剩余电量</div>
        </div>
        <div class="filter">
          <div class="filter-item">{{ model.working_time }}<sup class="comma">，</sup></div>
          <div class="filter-name">已扫时间</div>
        </div>
      </div>

      <!-- 按钮 -->
      <div class="panel-btn center">
        <div :class="[{'up-index': !isOffline }, 'btn-wrap']">
          <div 
            :class="[{'active': !isClose && !isOffline }, 'btn btn-swich center']"
            @click="setSwitch" />
          <div class="btn-name">开关</div>
        </div>
        <div class="btn-wrap btns">
          <div 
            :class="[model.status == 'charging' ? 'charging' : '', 'btn btn-charging center circleProgress_wrapper']"
            @click="setCharging()">
            <div class="wrapper right">
              <div class="circleProgress rightcircle" />
            </div>
            <div class="wrapper left">
              <div class="circleProgress leftcircle" />
            </div>
          </div>
          <div class="btn-name">回充</div>
        </div>

        <div class="btn-wrap">
          <div 
            :class="[{'active': model.speed == 'sleep' },'btn btn-clean center']"
            @click="setSleep()" />
          <div class="btn-name">清扫</div>
        </div>

        <div class="btn-wrap">
          <div 
            :class="[btnClass, 'btn center btn-plan']"
            @click="handeModeClick" />
          <div class="btn-name">规划</div>
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
          :class="[{ 'item1': animation }, {' btn-current': model.speed === 'low' }, {'btn-loading': btnLoading.low },'btn btn-low center']"
          @click.stop="setSpeed('low')">
          <div class="name">规划</div>
        </div>
        <div 
          :class="[{ 'item2': animation }, {' btn-current': model.speed === 'middle' }, {' btn-loading': btnLoading.middle },'btn btn-middle center']"
          @click.stop="setSpeed('middle')">
          <div class="name">单间</div>
        </div>
        <div 
          :class="[{ 'item3': animation }, {' btn-current': model.speed === 'high' }, {' btn-loading': btnLoading.high },'btn btn-high center']"
          @click.stop="setSpeed('high')">
          <div class="name">沿边</div>
        </div>
        <div 
          :class="[{ 'item4': animation }, {' btn-current': model.speed === 'very_high' }, {' btn-loading': btnLoading.very_high },'btn btn-very_high center']"
          @click.stop="setSpeed('very_high')">
          <div class="name">定位</div>
        </div>
        <div 
          :class="[{ 'item5': animation }, {'btn-current': model.speed === 'super_high' }, {' btn-loading': btnLoading.super_high },'btn btn-super_high center']"
          @click.stop="setSpeed('super_high')">
          <div class="name">拖地</div>
        </div>
        <div 
          :class="[ { 'item6': animation }, btnClass,'btn btn-plan center active']"
          @click.stop />
      </div>
    </div>

    <!-- PM2.5简介 -->
    <sub-page 
      v-model="showSubPage"
      title="PM2.5简介"
      class="modal-w">
      <div class="pm2">
        <p>
          PM2.5指环境空气动力学当量直径小于等于2.5微米的颗粒物。它能较长时间悬浮于空气中，其在空气中含量浓度越高，就代表空气污染越严重。
        </p>
        <p class="sub-title">
          PM2.5数值范围说明
        </p>
        <div class="items">
          <div class="item item1">优</div>
          <div class="item item2">良</div>
          <div class="item item3">轻度</div>
          <div class="item item3">中度</div>
          <div class="item item4">重度</div>
          <div class="item item5">严重</div>
        </div>
        <ul class="ruler">
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
        </ul>
        <ul class="name">
          <li>0</li>
          <li>35</li>
          <li>75</li>
          <li>115</li>
          <li>150</li>
          <li>250+</li>
          <li />
        </ul>
      </div>
    </sub-page>
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
      isShowMsg: false,
      msg: '',
      device_name: "",
      model: {
        'switch_status': 'on',
        'mode': 'mop',
        'battery_percentage': '100',
        'status': 'charging',
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
        low: false,
        middle: false,
        high: false,
        very_high: false,
        super_high: false,
      },
      showSubPage: false
    }
  },
  computed: {
    isClose() {
      return this.model.switch_status == 'on' ? false : true
    },
    bakColor() {
      return this.isClose ? '#fff' : '#000'
    },
    isOffline() {
      return this.model.connectivity === 'online' ? false : true
    },
    btnClass() {
      /* eslint-disable no-unreachable */
      switch (this.model.speed) {
        case 'low':
          return 'btn-low'
          break
        case 'middle':
          return 'btn-middle'
          break
        case 'high':
          return 'btn-high'
          break
        case 'very_high':
          return 'btn-very_high'
          break
        case 'super_high':
          return 'btn-super_high'
          break
        case 'sleep':
          return 'btn-low'
          break
      }
    },
    current() {
      return 4
      let pm2 = this.model.air_filter_result.PM25[0]
      if (pm2 < 35) {
        return 0
      } else if (pm2 < 75) {
        return 1
      } else if (pm2 < 115) {
        return 2
      } else if (pm2 >= 150) {
        return 3
      } else if (pm2 >= 250) {
        return 4
      }
    },
    btnTxt() {
      /* eslint-disable no-unreachable */
      switch (this.model.speed) {
        case 'low':
          return '低挡'
          break
        case 'middle':
          return '中档'
          break
        case 'high':
          return '高档'
          break
        case 'very_high':
          return '超高档'
          break
        case 'super_high':
          return '极速挡'
          break
        case 'sleep':
          return '低挡'
          break
      }
    }
  },
  watch: {
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
  // mounted(){
  //    //获取图片所在的div对象  
  //   var pic = document.getElementsByClassName('pic')  
                   
  //   for (var i=0;i<pic.length;i++) {
  //         var w=document.body.clientWidth//窗口的大小                 
  //       //产生随机坐标  
  //   var x = Math.random()*w  
       
  //   var y = Math.random()*242  
       
  //   //图片的定位  
  //   pic[i].style.left=x+"px"  
       
  //   pic[i].style.top=y+"px"  
  //   }
    
    
  // },
  methods: {
    setSpeed(speed) {
      // if (this.checkCmd('mode', mode)) return this.showModeBtns = false
      // this.showModeBtns = false
      this.controlDevice('speed', speed, speed,
        () => {
          if (this.showModeBtns) this.showModeBtns = false
          this.showMsg(tips['speed' + speed])
        }, () => { }, speed)
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
    // 清扫
    setSleep(){
      console.log(this.model.status)
      
    },
    setSwitch() {
      let switchStatus = ''
      if (this.model.switch_status == 'on') {
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
      this.model.status = "charging"
      console.log(this.model.status)
      
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
    }
  },
}
</script>
<style lang="less" scoped>
.page {
  min-height: 100%;
  overflow-x: hidden;
  position: relative;
  background: #fff;
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
    // padding-top: 242px;
    position: relative;
    .garbage{
      width: 100%;
      height: 242px;
      // border: #03fd05 1px solid;
      // position: relative;
      // img{
      //   position: absolute;
      //   width: 50%;
      //   height: 50%;
      //   display: inline-block;
      // }
    }
    .robot {
      width: 446px;
      margin: auto;
    }
    .robot-charging {
      width: 46px;
      height: 100px;
      background: #FFF7DB;
      border: 1px solid #FFF0B2;
      border-radius: 4px;
      position: absolute;
      left: 50%;
      bottom: 118px;
      // transform: translate(-50%);
      margin-left: -23px;
      background-image: linear-gradient(0deg, white 15%, green 15%);
      background-repeat: repeat-y;
      background-size: 100% 20%;
      background-clip: content-box; /* 将背景限定在内容区域 */
      box-sizing: content-box;
      transform: rotate(0deg);
      display: inline-block;
      &::after {
        content: '';
	width: calc(44px);
	height: calc(100px - 16px);
	position: absolute;
  background-color: #FFF7DB;
  left: 0px;
	animation: charge 2s steps(5) infinite alternate;
	animation-play-state: running;

      }
      .line{
        position: absolute;
        width: 4px;
        height: 60px;
        background: #FFF0B2;
        border-radius: 1px;
        position: absolute;
        bottom: -60px;
        left: 50%;
        transform: translate(-50%)
      }
      
    }
    @keyframes charge {
    from {
          // background-size:  80% 15%;
          height: calc(100px - 22px);

    }
80% {
		height: 0px;
	}
	to {
		height: 0px;
	}

    // to {
    //       background-size:  80% 95%;
    // }
}
  }

  .point {
    .sport {
      display: inline-block;
      border-radius: 50%;
      width: 13px;
      height: 13px;
      opacity: 0.84;
      background: #03fd05;
      position: absolute;
    }
    .sport1 {
      top: 192px;
      left: 460px;
    }
    .sport2 {
      top: 208px;
      left: 472px;
    }
    .sport3 {
      top: 230px;
      left: 384px;
    }
    .sport4 {
      top: 265px;
      left: 368px;
    }
    .sport5 {
      top: 376px;
      left: 70px;
    }
    .sport6 {
      top: 374px;
      left: 276px;
    }
    .sport7 {
      top: 390px;
      left: 616px;
    }
    .sport8 {
      top: 400px;
      left: 238px;
    }
    .sport9 {
      top: 482px;
      left: 670px;
    }
    .sport10 {
      top: 468px;
      left: 646px;
    }
    .sport11 {
      top: 708px;
      left: 142px;
    }
    .sport12 {
      top: 690px;
      left: 502px;
    }
    .sport13 {
      top: 774px;
      left: 300px;
    }
  }

  .wrap-filter {
    display: flex;
    justify-content: center;
    margin: 64px 0 218px 0;
    &.detail {
      margin: 230px 0 48px 0;
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
    background: #ffffff;
    box-shadow: 0 -3px 28px 0 rgba(209, 209, 209, 0.5);
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
    margin: 50px 24px 0;
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
      // opacity: 0.5;
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
    .btn-plan {
      &::before {
        content: "";
        display: block;
        width: 48px;
        height: 48px;
        background-image: url(../../lib/base/sweeping_robot/assets/guihua0.png);
        background-size: 100% 100%;
      }
       &.btn-low::before {
          background-image: url(../../lib/base/sweeping_robot/assets/guihua@2x.png);
        }
        &.btn-middle::before {
          background-image: url(../../lib/base/sweeping_robot/assets/danjian3.png);
        }
        &.btn-high::before {
          background-image: url(../../lib/base/sweeping_robot/assets/yanbian3.png);
        }
        &.btn-very_high::before {
          background-image: url(../../lib/base/sweeping_robot/assets/dingwei3.png);
        }
        &.btn-super_high::before {
          background-image: url(../../lib/base/sweeping_robot/assets/tuodi3.png);
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
        background-image: url('../../lib/base/sweeping_robot/assets/chongdianzhong.png');
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
    left: 562px;
    top: 1366px;
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
      top: -720px;
      left: 0;
    }
    .item2 {
      top: -576px;
      left: 0;
    }
    .item3 {
      top: -432px;
      left: 0;
    }
    .item4 {
      top: -288px;
      left: 0;
    }
    .item5 {
      top: -144px;
      left: 0;
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

        &.btn-low::before {
          background-image: url(../../lib/base/sweeping_robot/assets/guihua@2x.png);
        }
        &.btn-middle::before {
          background-image: url(../../lib/base/sweeping_robot/assets/danjian3.png);
        }
        &.btn-high::before {
          background-image: url(../../lib/base/sweeping_robot/assets/yanbian3.png);
        }
        &.btn-very_high::before {
          background-image: url(../../lib/base/sweeping_robot/assets/dingwei3.png);
        }
        &.btn-super_high::before {
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
    .btn-low {
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
    .btn-middle {
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
    .btn-high {
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
    .btn-very_high {
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
    .btn-super_high {
      &::before {
        content: "";
        display: block;
        width: 48px;
        height: 48px;
        background-image: url(../../lib/base/sweeping_robot/assets/tuodi.png);
        background-size: 100% 100%;
      }
         &.btn-current {
        border-color: #ffc600;
        &::before {
          background-image: url(../../lib/base/sweeping_robot/assets/tuodi2.png);
        }
        .name {
          color: #ffc600;
        }
      }
      &.active {
        &::before {
          background-image: url(../../lib/base/sweeping_robot/assets/tuodi2.png);
        }
      }
    }
  }
}

.modal-w.subpage {
  background: #fff;
}
.pm2 {
  padding: 56px 48px;
  font-size: 28px;
  color: #35353d;
  text-align: justify;
  .sub-title {
    padding: 48px 0;
  }
  .items {
    display: flex;
    justify-content: space-between;
    .item {
      width: 124px;
      height: 96px;
      line-height: 96px;
      border-radius: 10px;

      font-size: 24px;
      color: #fff;
      text-align: center;
      margin: 0 1px;
      &.item1 {
        background: #03fd05;
      }
      &.item2 {
        background: #fff100;
      }
      &.item3 {
        background: #f99f03;
      }
      &.item4 {
        background: #fe0408;
      }
      &.item5 {
        background: #7e0023;
      }
    }
  }
  .ruler {
    margin-top: 26px;
    list-style: none;
    opacity: 0.3;

    border-radius: 4px;

    border-bottom: 1px solid #35353d;

    display: flex;
    justify-content: space-between;
    li {
      background: #35353d;
      width: 1px;
      height: 12px;
    }
  }
  .name {
    margin-top: 8px;
    list-style: none;
    display: flex;
    justify-content: space-between;
  }
}
</style>
