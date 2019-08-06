<template>
  <!-- <div id="app">
    <div
      v-if="status == 'error' || model.switch_status == 'on'"
      class="page-on">
      <div class="mainTitle">
        <div class="name">{{ device_name }}
          <icon class="redact-white" />
        </div>
        <div class="tip">
          <p v-show="tip">{{ tip }}</p>
          <p v-show="!tip && remain_tip">{{ remain_tip }}</p>
        </div>
      </div>
      <a
        v-if="ab.child_lock_switch || ab.negative_ion_switch"
        href=""
        class="btn-more"
        @click.prevent="moreModalVisible = true"/>
      <div class="pm25">
        <div class="circle">
          <span
            v-for="i in 5"
            v-show="i==(pm25_level>5?5:pm25_level)"
            :key="i"
            :class="'c'+i"/>
        </div>
        <div
          :style="{transform:'rotate('+ pm25_rotate +'deg)'}"
          class="arrow"/>
        <div
          class="value"
          v-html="pm25_text"/>
        <div
          class="pic"
          @click="togglePMPop">PM 2.5</div>
        <div class="attrs">
          <span v-if="model.temperature && model.temperature!='0'">温度：{{ model.temperature }}℃</span>
          <span v-if="model.humidity && model.humidity!='0'">湿度：{{ model.humidity }}%</span>
        </div>
      </div>

      <div class="btns btns-fn">
        <a
          href=""
          class="btn-on"
          @click.prevent="setSwitch('off')">
          <i/> 开关
        </a>
        <a
          :class="{active:model.control_status == 'sleep'}"
          href=""
          class="btn-sleep"
          @click.prevent="setSleep">
          <i/> 睡眠
        </a>

        <a href="" class="btn-sleep"  @click.prevent="setControl('manual')">
                <i></i> 手动
            </a>

        <a
          v-if="model.control_status == 'auto'"
          href=""
          class="btn-auto active"
          @click.prevent="showSpeedModal">
          <i/> 自动
        </a>
        <a
          v-else-if="model.control_status == 'manual'"
          :class="speedCss"
          href=""
          @click.prevent="showSpeedModal">
          <i/> {{ speedText }}
        </a>
        <a
          v-else
          href=""
          class="btn-speed"
          @click.prevent="showSpeedModal">
          <i/> 风档
        </a>
      </div>

      <modal
        v-model="speedModalVisible"
        title="风档"
        class="windControl">
        <div class="btns btns-speed">
          <a
            v-for="item in speedItems"
            :key="item.value"
            :class="['btn1-speed'+item.className,{active:model.control_status == 'manual' && model.speed == item.value}]"
            href=""
            @click.prevent="setSpeed(item.value)">
            <i/> {{ item.text }}
          </a>
          <a
            :class="{active: model.control_status == 'auto'}"
            href=""
            class="btn1-auto"
            @click.prevent="setControl('auto')">
            <i/> 自动
          </a>
        </div>
      </modal>

      <modal
        v-model="moreModalVisible"
        title="更多">
        <div class="btns btns-more">
          <a
            v-if="ab.negative_ion_switch"
            :class="{active:model.negative_ion_switch_status == 'on'}"
            href=""
            class="btn-ni"
            @click.prevent="setNegativeIon">
            <i/> 负离子
          </a>
          <a
            v-if="ab.child_lock_switch"
            :class="{active:model.child_lock_switch_status == 'on'}"
            href=""
            class="btn-cl"
            @click.prevent="setChildLock">
            <i/> 童锁
          </a>
        </div>
      </modal>
      <sub-page
        v-model="pmPopVisible"
        title="PM2.5简介"
        class="modal-w"
        @click.prevent="toggleModePop">
        <div class="intro-body">
          <p class="main_text">
            PM2.5指环境空气中空气动力学当量直径小于等于2.5微米的颗粒物。它能较长时间悬浮于空气中，其在空气中含量浓度越高，就代表空气污染越严重。
          </p>
          <div class="pm-range">
            <img src="../../lib/base/air_cleaner/assets/PM2.5_scale@3x.png" >
          </div>
        </div>
      </sub-page>

    </div>

    <div
      v-if="model.switch_status == 'off'"
      class="page-off">
      <div class="name">{{ device_name }}
        <icon />
      </div>
      <div class="tip">已关闭</div>
      <div class="air_cleaner"/>
      <div class="btns btns-fn">
        <a
          href="javascript:void(0)"
          class="btn-off"
          @click.prevent="setSwitch('on')">
          <i/> 开关
        </a>
        <a
          href="javascript:void(0)"
          class="btn-sleep disable">
          <i/> 睡眠
        </a>
        <a
          href="javascript:void(0)"
          class="btn-speed disable">
          <i/> 风档
        </a>
      </div>
    </div>

    <error-tip v-if="status == 'error'" @click.native="getSnapShot" />
  </div> -->
  <div :class="[{'close': isClose}, 'page']">
    <topbar
      title="空气净化器" />
    <div
      class="main"
      @click="togglePMPop">
      <div>
        <img
          class="circle"
          src="../../lib/base/air_cleaner/assets/new-air/yuanquan@2x.png"
          alt="">
        <img
          v-show="current==1"
          class="pointer-excellent"
          src="../../lib/base/air_cleaner/assets/new-air/jiejing@2x.png"
          alt="">
        <img
          v-show="current==0"
          class="lianghao"
          src="../../lib/base/air_cleaner/assets/new-air/lianghao@2x.png"
          alt="">
        <img
          v-show="current==2"
          class="lianghao2"
          src="../../lib/base/air_cleaner/assets/new-air/lianghao2@2x.png"
          alt="">
        <img
          v-show="current==3"
          class="lianghao3"
          src="../../lib/base/air_cleaner/assets/new-air/lianghao3@2x.png"
          alt="">
        <img
          v-show="current==4"
          class="lianghao4"
          src="../../lib/base/air_cleaner/assets/new-air/lianghao4@2x.png"
          alt="">
        <img
          v-show="current==5"
          class="lianghao5"
          src="../../lib/base/air_cleaner/assets/new-air/lianghao5@2x.png"
          alt="">
      </div>
      <div class="block">
        <div class="num">76</div>
        <div class="txt">室内空气 优</div>
      </div>
      <span class="nuit">μg/m³</span>
      <span class="sport" />
      <span class="sport1" />
      <span class="sport2" />
      <span class="sport3" />
      <span class="sport4" />
      <span class="sport5" />
      <span class="sport6" />
      <span class="sport7" />
      <span class="sport8" />
      <span class="sport9" />
      <span class="sport10" />
      <span class="sport11" />
      <span class="sport12" />
      <span class="sport13" />
      <sub-page
        v-model="pmPopVisible"
        class="modal-w"
        title="PM2.5简介"
        @click.prevent="toggleModePop">
        <div class="intro-body">
          <p class="main_text">
            PM2.5指环境空气中空气动力学当量直径小于等于2.5微米的颗粒物。它能较长时间悬浮于空气中，其在空气中含量浓度越高，就代表空气污染越严重。
          </p>
          <div class="pm-range">
            <!-- <img src="../../lib/base/air_cleaner/assets/PM2.5_scale@3x.png" > -->
            <p class="pm-range-title">PM2.5数值范围说明</p>
            <ul>
              <li>
                <p>优</p>
              </li>
              <li>
                <p>良</p>
              </li>
              <li>
                <p>轻度</p>
              </li>
              <li>
                <p>中度</p>
              </li>
              <li>
                <p>重度</p>
              </li>
              <li>
                <p>严重</p>
              </li>
            </ul>
            <table>
              <tr>
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
              </tr>
            </table>
            <div class="pm-num">
              <span>0</span>
              <span>35</span>
              <span>75</span>
              <span>115</span>
              <span>150</span>
              <span>250+</span>
              <span />
            </div>
          </div>
        </div>
      </sub-page>
    </div>
    <div class="remind">
      <div class="remind-box">
        <div class="remind-num">53</div>
        <div class="remind-txt">剩余滤芯</div>
        <div class="remind-tis">%</div>
      </div>
      <div class="remind-box">
        <div class="remind-num">98</div>
        <div class="remind-txt">滤芯寿命</div>
        <div class="remind-tis">天</div>
      </div>
    </div>
    <div class="btn">
      <div
        :class="[{'active-switch': !isClose}, {'btn-show':btnSwitch}, 'btn-tab', 'btn-swich']"
        @click.prevent="btnClose">
        <div class="btn-sty">
          <a
            href="#"
            class="shutdown" />
        </div>
        <div class="btn-txt">关机</div>
      </div>
      <div
        :class="[{'btn-show':somnus}, 'btn-tab']"
        @click.prevent="btnSleep">
        <div class="btn-sty">
          <a
            href="#"
            class="shutdown1" />
        </div>
        <div class="btn-txt">睡眠</div>
      </div>
      <div
        :class="[{'btn-wind':windshield}, 'btn-tab']"
        @click.prevent="btnWind">
        <div
          class="btn-sty"
          @click="handeModeClick">
          <a
            href="#"
            class="shutdown2" />
        </div>
        <div class="btn-txt">{{ showModeName }}</div>
      </div>
      <div
        :class="[{'btn-wind':moreShow}, 'btn-tab']"
        @click.prevent="btnMore">
        <div
          class="btn-sty"
          @click="handMoreClick">
          <a
            href="#"
            class="shutdown3" />
        </div>
        <div class="btn-txt">更多</div>
      </div>
    </div>
    <!-- 风档选择弹框 -->
    <div
      v-show="showModeBtns"
      class="mode-btn"
      @touchmove.prevent
      @click="hide">
      <div class="mode-items">
        <div
          :class="[{'disu': showModeName === '低速风'},'mode-item1']"
          @click.stop="setMode('低速风', 1)">
          <div class="mode-name">低速</div>
        </div>
        <div
          :class="[{'zhongdisu': showModeName === '中低速风'},'mode-item2']"
          @click.stop="setMode('中低速风', 2)">
          <div class="mode-name">中低速</div>
        </div>
        <div
          :class="[{'zhongsu': showModeName === '中速风'},'mode-item3']"
          @click.stop="setMode('中速风', 3)">
          <div class="mode-name">中速</div>
        </div>
        <div
          :class="[{'gaosu': showModeName === '高速风'},'mode-item4']"
          @click.stop="setMode('高速风', 4)">
          <div class="mode-name">高速</div>
        </div>
        <div
          :class="[{'auto': showModeName === '自动'},'mode-item5']"
          @click.stop="setMode('自动', 5)">
          <div class="mode-name">自动</div>
        </div>
      </div>
    </div>
    <!-- 更多选择弹框 -->
    <div
      v-show="showMoreBtns"
      class="mode-btn"
      @touchmove.prevent
      @click="hide">
      <div class="mode-items">
        <div
          :class="[{'disu': anion},'mode-item6']"
          @click.stop="setAnion()">
          <div class="mode-name">负离子</div>
        </div>
        <div
          :class="[{'zhongdisu': childLockName},'mode-item7']"
          @click.stop="childLock()">
          <div class="mode-name">童锁</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from "../../lib/components/Modal.vue";
import SubPage from "../../lib/components/SubPage";
import Icon from "../../lib/components/SettingIconMobile.vue";

const SPEED_TEXT1 = [
  { text: "低速", className: "1", value: "low" },
  { text: "中低速", className: "2", value: "middle" },
  { text: "中速", className: "3", value: "high" },
  { text: "中高速", className: "4", value: "very_high" },
  { text: "高速", className: "5", value: "super_high" }
];
const SPEED_TEXT2 = [
  { text: "一档", className: "1", value: "low" },
  { text: "二档", className: "2", value: "middle" },
  { text: "三档", className: "3", value: "high" },
  { text: "四档", className: "4", value: "very_high" }
];
const SPEED_TEXT3 = [
  { text: "低速", className: "1", value: "low" },
  { text: "中速", className: "3", value: "middle" },
  { text: "高速", className: "5", value: "high" }
];
const DEVICE_MODEL = {
  "KJ315F-A1": {
    child_lock_switch: false,
    negative_ion_switch: false
  },
  "KJ400F-A11": {
    child_lock_switch: false,
    negative_ion_switch: false
  },
  "KJ819F-B2": {
    speed: 5
  }
};
const DEVICE_DEFAULT = {
  child_lock_switch: true,
  negative_ion_switch: true,
  speed: 3
};

const PM25_VAL = [0, 35, 75, 115, 150, 250];
const PM25_ANGLE = [-136, -84, -28, 28, 84, 136];

function getToggle(val) {
  return val === "on" ? "off" : "on";
}

function getRotate(val, start, end) {
  var min = PM25_VAL[start];
  var max = PM25_VAL[end];
  var min_r = PM25_ANGLE[start];
  var max_r = PM25_ANGLE[end];
  return min_r + (val - min) / (max - min) * (max_r - min_r);
}

/**
 * 创建并返回一个像节流阀一样的函数，当重复调用函数的时候，最多每隔 wait毫秒调用一次该函数
 * @param func 执行函数
 * @param wait 时间间隔
 * @param options 如果你想禁用第一次首先执行的话，传递{leading: false}，
 *                如果你想禁用最后一次执行的话，传递{trailing: false}
 * @returns {Function}
 */
function throttle(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function() {
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  wait = wait || 500;
  return function() {
    var now = new Date().getTime();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}

export default {
  components: {
    Modal,
    SubPage,
    Icon
  },
  data() {
    return {
      status: "",
      speedModalVisible: false,
      moreModalVisible: false,
      device_name: "",
      model: {},
      tip: "",
      remain_tip: "",
      pm25: "",
      speedItems: SPEED_TEXT3,
      //功能能力判断
      ab: {},
      //前一个状态
      prevModel: {
        control_status: "auto",
        speed: ""
      },
      pmPopVisible: false,
      current: 1,
      switchStatus: 'on',
      showModeBtns: false,
      showMoreBtns: false,
      showModeName: '低速风',
      btnSwitch: true,
      somnus: false,
      windshield: false,
      anion: false,
      childLockName: false,
      moreShow: false,
    };
  },
  computed: {
    isClose() {
      return this.switchStatus == 'on' ? false : true
    },
    currentSpeed() {
      var item = this.speedItems.filter(item => {
        return item.value == this.model.speed;
      });
      if (item.length) {
        return item[0];
      }
      return {};
    },
    speedCss() {
      return ["btn-speed" + this.currentSpeed.className, "active"];
    },
    speedText() {
      return this.currentSpeed.text;
    },
    pm25_level() {
      for (var i = PM25_VAL.length - 1; i >= 0; i--) {
        if (this.pm25 > PM25_VAL[i]) {
          return i + 1;
        }
      }
      return 1;
    },
    pm25_rotate() {
      var level = this.pm25_level;
      if (level == 6) {
        return PM25_ANGLE[5];
      }
      return getRotate(this.pm25, level - 1, level);
    },
    pm25_text() {
      return this.pm25 == 0 ? "--" : this.pm25 + "<small>μg/m³</small>";
    }
  },
  watch: {
    pmPopVisible() {
      if (this.pmPopVisible) {
        HdSmart.UI.toggleHeadAndFoot(false);
      } else {
        HdSmart.UI.toggleHeadAndFoot(true);
      }
    }
  },
  created() {
    this.$watch("model.control_status", (newVal, oldVal) => {
      this.prevModel.control_status = oldVal || "auto";
    });

    this.$watch("model.speed", (newVal, oldVal) => {
      this.prevModel.speed = oldVal || "";
    });

    HdSmart.ready(() => {
      if (window.device_name) {
        this.device_name = window.device_name;
      }
      HdSmart.UI.showLoading();
      HdSmart.UI.toggleHeadAndFoot(true);
      this.getSnapShot(() => {
        HdSmart.UI.hideLoading();
      });
    });

    HdSmart.onDeviceStateChange(data => {
      this.onSuccess(data.result);
    });
  },
  methods: {
    setAnion() {
      this.anion = !this.anion
    },
    childLock() {
      this.childLockName = !this.childLockName
    },
    handeModeClick() {
      this.showModeBtns = true
    },
    handMoreClick() {
      this.showMoreBtns = true
      this.moreShow = true
    },
    setMode(mode) {
      console.log(mode)
      this.showModeName = mode
      this.showModeBtns = false
      this.showMoreBtns = false
      this.activeMode = false
      this.windshield = false
    },
    hide() {
      this.showModeBtns = false
      this.showMoreBtns = false
      this.windshield = false
      this.moreShow = false
    },
    // 开关btn
    btnClose() {
      this.btnSwitch = !this.btnSwitch
      if (this.btnSwitch === false) {
        this.somnus = false
        this.windshield = false
      }
      if (this.switchStatus === 'on') {
        this.switchStatus = 'off'
      } else {
        this.switchStatus = 'on'
      }
    },
    // 睡眠btn
    btnSleep() {
      this.somnus = !this.somnus
    },
    // 风档btn
    btnWind() {
      this.windshield = true
    },
    // 更多btn
    btnMore() {
      this.current = 4
    },
    togglePMPop() {
      //pm2.5
      this.pmPopVisible = !this.pmPopVisible;
    },
    showTip(text) {
      clearTimeout(this.tipTime);
      this.tip = text;
      this.tipTime = setTimeout(() => {
        this.tip = "";
      }, 2000);
    },
    controlDevice(attr, val, param, success, error) {
      var fn = this.confirm;
      var params = Object.assign(
        {
          [attr]: val
        },
        param
      );

      if (attr == "child_lock_switch") {
        fn = function(cb) {
          cb();
        };
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
            success && success();
          },
          () => {
            error && error();
            this.showTip("操作失败");
          }
        );
      });
    },
    setSwitch(val) {
      this.controlDevice("switch", val);
    },
    setControl: throttle(function(val) {
      if (this.model.control_status == val) {
        return;
      }
      this.controlDevice("control", val, () => {
        this.model.control_status = val;
      });
    }),
    setSleep() {
      if (this.model.negative_ion_switch_status == "on") {
        this.controlDevice("negative_ion_switch", "off", { control: "sleep" }, () => {
          this.model.control_status = "sleep";
        });
      } else {
        this.setControl("sleep");
      }
    },
    setSpeed: throttle(function(val) {
      if (this.model.control_status == "manual" && this.model.speed == val) {
        return;
      }
      this.controlDevice("speed", val, { control: "manual" }, () => {
        this.model.control_status = "manual";
        this.model.speed = val;
      });
    }),
    setNegativeIon: throttle(function() {
      if (this.model.child_lock_switch_status == "on") {
        HdSmart.UI.toast("解除童锁后才能控制此设备");
        return;
      }
      var val = getToggle(this.model.negative_ion_switch_status);

      this.controlDevice(
        "negative_ion_switch",
        val,
        {
          control:
            this.model.control_status == "sleep" ? this.prevModel.control_status : this.model.control_status
        },
        () => {
          this.model.negative_ion_switch_status = val;
        }
      );
    }),
    setChildLock: throttle(function() {
      if (this.model.control_status == "sleep") {
        HdSmart.UI.toast("睡眠模式下不能开启童锁");
        return;
      }
      var val = getToggle(this.model.child_lock_switch_status);
      this.controlDevice(
        "child_lock_switch",
        val,
        { control: this.model.control_status },
        () => { },
        () => {
          this.model.child_lock_switch_status = getToggle(val);
        }
      );
      //http://jira.evergrande.me/browse/HAALPHA-47
      this.model.child_lock_switch_status = val;
    }),
    showSpeedModal() {
      if (this.model.child_lock_switch_status == "on") {
        this.confirm();
      } else {
        this.speedModalVisible = true;
      }
    },
    getSnapShot(cb) {
      HdSmart.Device.getSnapShot(
        data => {
          this.onSuccess(data);
          cb && cb();
        },
        () => {
          this.onError();
          cb && cb();
        }
      );
    },
    onSuccess(data) {
      this.status = "success";
      this.model = data.attribute;
      console.log(this.model, 'mock假数据');

      if (this.model.filter_time_remaining <= 0) {
        this.remain_tip = "需更换滤网";
      } else if (this.model.filter_time_remaining <= 120) {
        this.remain_tip = `滤芯寿命剩余${this.model.filter_time_remaining}小时`;
      } else {
        this.remain_tip = "";
      }

      var pm25 = this.model.air_filter_result.PM25;
      this.pm25 = pm25.length == 2 ? pm25[1] : pm25[0];

      // 根据设备型号判断功能点，后边从开放平台拉取
      this.ab = Object.assign(DEVICE_DEFAULT, DEVICE_MODEL[this.model.deviceModel] || {});
      if (this.ab.speed == 5) {
        this.speedItems = SPEED_TEXT1;
      } else if (this.ab.speed == 4) {
        this.speedItems = SPEED_TEXT2;
      } else {
        this.speedItems = SPEED_TEXT3;
      }
    },
    onError() {
      this.status = "error";
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
            if (val) this.setChildLock();
          }
        );
      } else {
        done();
      }
    }
  }
};
</script>
<style lang="less" scoped>
.page {
  overflow-x: hidden;
  position: relative;
  background: rgba(230, 255, 243, 1);
  height: 1624px;
  width: 750px;
  // * {
  //   transition: all 0.3s ease-in-out;
  // }
  // 圆圈样式
  .main {
    width: 540px;
    height: 540px;
    margin: 216px auto 0;
    .circle {
      width: 100%;
      height: 100%;
      // transform: rotateY(180deg);
    }
    .lianghao {
      position: relative;
      left: 110px;
      top: -594px;
      width: 136px;
      height: 26px;
      transform: rotate(339deg);
    }
    .lianghao1 {
      position: relative;
      left: -50px;
      top: -394px;
      width: 136px;
      height: 26px;
      transform: rotate(278deg);
    }
    .lianghao2 {
      position: relative;
      left: -28px;
      top: -250px;
      width: 136px;
      height: 26px;
      transform: rotate(245deg);
    }
    .lianghao3 {
      position: relative;
      left: 186px;
      top: -104px;
      width: 136px;
      height: 26px;
      transform: rotate(184deg);
    }
    .lianghao4 {
      position: relative;
      left: 426px;
      top: -238px;
      width: 136px;
      height: 26px;
      transform: rotate(118deg);
    }
    .lianghao5 {
      position: relative;
      left: 438px;
      top: -452px;
      width: 136px;
      height: 26px;
      transform: rotate(68deg);
    }
    .block {
      position: relative;
      left: 176px;
      top: -520px;
      width: 184px;
      height: 224px;
      color: #03fd05;
      text-align: center;
      font-family: PingFangSC-Regular;
      .num {
        font-size: 160px;
      }
      .txt {
        font-size: 24px;
        letter-spacing: -0.2px;
        position: relative;
        top: -24px;
        font-weight: 900;
      }
    }
    .nuit {
      opacity: 0.5;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #03fd05;
      letter-spacing: 0;
      text-align: center;
      position: relative;
      left: 370px;
      top: -760px;
    }
    .sport {
      display: inline-block;
      border-radius: 50%;
      width: 13px;
      height: 13px;
      opacity: 0.84;
      background: #03fd05;
      position: relative;
      left: 170px;
      top: -930px;
    }
    .sport1 {
      display: inline-block;
      border-radius: 50%;
      width: 13px;
      height: 13px;
      opacity: 0.55;
      background: #03fd05;
      position: relative;
      left: 156px;
      top: -960px;
    }
    .sport2 {
      display: inline-block;
      border-radius: 50%;
      width: 10px;
      height: 10px;
      opacity: 0.62;
      background: #03fd05;
      position: relative;
      left: 208px;
      top: -996px;
    }
    .sport3 {
      display: inline-block;
      border-radius: 50%;
      width: 13px;
      height: 13px;
      opacity: 0.5;
      background: #03fd05;
      position: relative;
      left: 190px;
      top: -980px;
    }
    .sport4 {
      display: inline-block;
      border-radius: 50%;
      width: 11px;
      height: 11px;
      opacity: 0.4;
      background: #03fd05;
      position: relative;
      left: 200px;
      top: -900px;
    }
    .sport5 {
      display: inline-block;
      border-radius: 50%;
      width: 8px;
      height: 8px;
      opacity: 0.54;
      background: #03fd05;
      position: relative;
      left: -280px;
      top: -870px;
    }
    .sport6 {
      display: inline-block;
      border-radius: 50%;
      width: 8px;
      height: 8px;
      opacity: 1;
      background: #03fd05;
      position: relative;
      left: -120px;
      top: -846px;
    }
    .sport7 {
      display: inline-block;
      border-radius: 50%;
      width: 8px;
      height: 8px;
      opacity: 1;
      background: #03fd05;
      position: relative;
      left: -190px;
      top: -820px;
    }
    .sport8 {
      display: inline-block;
      border-radius: 50%;
      width: 11px;
      height: 11px;
      opacity: 0.66;
      background: #03fd05;
      position: relative;
      left: 136px;
      top: -824px;
    }
    .sport9 {
      display: inline-block;
      border-radius: 50%;
      width: 11px;
      height: 11px;
      opacity: 0.57;
      background: #03fd05;
      position: relative;
      left: 170px;
      top: -720px;
    }
    .sport10 {
      display: inline-block;
      border-radius: 50%;
      width: 8px;
      height: 8px;
      opacity: 1;
      background: #03fd05;
      position: relative;
      left: 116px;
      top: -630px;
    }
    .sport11 {
      display: inline-block;
      border-radius: 50%;
      width: 8px;
      height: 8px;
      opacity: 0.57;
      background: #03fd05;
      position: relative;
      left: -410px;
      top: -500px;
    }
    .sport12 {
      display: inline-block;
      border-radius: 50%;
      width: 8px;
      height: 8px;
      opacity: 0.51;
      background: #03fd05;
      position: relative;
      left: -70px;
      top: -500px;
    }
    .sport13 {
      display: inline-block;
      border-radius: 50%;
      width: 8px;
      height: 8px;
      opacity: 0.7;
      background: #03fd05;
      position: relative;
      left: -336px;
      top: -430px;
    }
  }
  .remind {
    position: relative;
    top: 250px;
    display: flex;
    justify-content: space-evenly;
    font-family: PingFangSC-Regular;
    .remind-box {
      display: inline-block;
      .remind-num {
        font-size: 80px;
        color: #35353d;
        text-align: center;
      }
      .remind-txt {
        opacity: 0.5;
        font-size: 24px;
        color: #35353d;
        text-align: center;
      }
      .remind-tis {
        position: relative;
        font-size: 24px;
        color: #35353d;
        text-align: center;
        top: -120px;
        left: 60px;
      }
    }
  }
  .btn {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 306px;
    border-radius: 40px 40px 0 0;
    // box-shadow: 0px -6px 56px 0px #111111;
    background: #ffffff;
    box-shadow: 0 -3px 28px 0 rgba(209, 209, 209, 0.5);
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    .btn-tab {
      position: relative;
      top: -50px;
      width: 120px;
      height: 120px;
      opacity: 0.5;
      border: 1px solid #818181;
      border-radius: 50%;
      .btn-txt {
        font-size: 24px;
        color: #35353d;
        text-align: center;
        position: relative;
        top: 10px;
      }
      .btn-sty {
        height: 120px;
        .shutdown {
          display: block;
          width: 120px;
          height: 120px;
          background-image: url(../../lib/base/air_cleaner/assets/new-air/btn_ac_on_cd@2x.png);
          background-repeat: no-repeat;
          background-size: 48px 48px;
          background-position: 50% 50%;
        }
        .shutdown1 {
          display: block;
          width: 120px;
          height: 120px;
          background-image: url(../../lib/base/air_cleaner/assets/new-air/btn_ac_mode_heat@2x.png);
          background-repeat: no-repeat;
          background-size: 48px 48px;
          background-position: 50% 50%;
        }
        .shutdown2 {
          display: block;
          width: 120px;
          height: 120px;
          // background-image: url(../../lib/base/air_cleaner/assets/new-air/feng2@2x.png);
          background-repeat: no-repeat;
          background-size: 48px 48px;
          background-position: 50% 50%;
          &.change1 {
            background-image: url(../../lib/base/air_cleaner/assets/new-air/btn_dh_fan_low.png);
          }
          &.change2 {
            background-image: url(../../lib/base/air_cleaner/assets/new-air/btn_dh_fan_mid.png);
          }
          &.change3 {
            background-image: url(../../lib/base/air_cleaner/assets/new-air/btn_dh_fan_high.png);
          }
          &.change4 {
            background-image: url(../../lib/base/air_cleaner/assets/new-air/btn_dh_fan_4high.png);
          }
          &.change5 {
            background-image: url(../../lib/base/air_cleaner/assets/new-air/auto-black.png);
          }
        }
        .shutdown3 {
          display: block;
          width: 120px;
          height: 120px;
          background-image: url(../../lib/base/air_cleaner/assets/new-air/gengduo@2x.png);
          background-repeat: no-repeat;
          background-size: 48px 48px;
          background-position: 50% 50%;
        }
      }
      &.btn-wind {
        z-index: 99999;
        opacity: 1;
        background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
      }
    }
    .btn-show {
      background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
      opacity: 1;
      border: 1px solid #ffffff;
      .btn-sty {
        .shutdown {
          display: block;
          width: 120px;
          height: 120px;
          background-image: url(../../lib/base/air_cleaner/assets/new-air/btn_ac_on_cd@2x.png);
          background-repeat: no-repeat;
          background-size: 48px 48px;
          background-position: 50% 50%;
        }
      }
    }
  }
  // pm2.5简介
  .modal-w {
    font-family: PingFangSC-Medium;
    font-size: 17px;
    background: #ffffff;
    .main_text {
      font-size: 28px;
      padding: 0.453rem 48px 0;
      color: #35353d;
    }
    .pm-range {
      padding: 0 48px;
      .pm-range-title {
        font-size: 28px;
        color: #000000;
        margin-bottom: 0.453rem;
        color: #35353d;
      }
      ul {
        display: flex;
        justify-content: space-between;
        li {
          list-style: none;
          background: #15d0ba;
          border-radius: 8px;
          width: 106px;
          height: 96px;
          display: flex;
          align-items: center;
          justify-content: center;
          &:nth-child(2) {
            background: #a5d015;
          }
          &:nth-child(3) {
            background: #efc12d;
          }
          &:nth-child(4) {
            background: #ef9c2d;
          }
          &:nth-child(5) {
            background: #ef642d;
          }
          &:nth-child(6) {
            background: #ef2d2d;
          }
          p {
            font-size: 24px;
            color: #35353d;
          }
        }
      }
      table {
        margin-top: 10px;
        width: 100%;
        height: 16px;
        border-collapse: collapse;
        opacity: 1;
        tr {
          height: 16px;
          td {
            height: 16px;
            border: 1px solid #d8d8d8;
            border-top: none;
            border-right: none;
            &:last-child {
              border-right: 1px solid #d8d8d8;
            }
          }
        }
      }
      .pm-num {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        font-size: 24px;
        color: #ffffff;
        span {
          &:nth-child(2) {
            position: relative;
            left: 6px;
          }
          &:nth-child(3) {
            position: relative;
            left: 14px;
          }
          &:nth-child(4) {
            position: relative;
            left: 14px;
          }
          &:nth-child(5) {
            position: relative;
            left: 6px;
          }
        }
      }
    }
  }
  &.close {
    &:before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 9;
      width: 100%;
      background: rgba(0, 0, 0, 0.8);
    }
    .btn {
      .btn-swich {
        z-index: 10;
        opacity: 1;
        .btn-sty {
          .shutdown {
            display: block;
            width: 120px;
            height: 120px;
            background-image: url(../../lib/base/dehumidifier/assets/swich-white.png);
            background-repeat: no-repeat;
            background-size: 48px 48px;
            background-position: 50% 50%;
          }
        }
        .btn-txt {
          color: #ffffff;
        }
      }
    }
  }
}
.mode-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  &:before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 9999;
    width: 100%;
    background: rgba(0, 0, 0, 0.8);
  }
  .mode-items {
    z-index: 99999;
    position: absolute;
    bottom: 0;
    left: 488px;
    .mode-item1 {
      position: relative;
      left: -262px;
      top: 354px;
      width: 120px;
      height: 120px;
      border: 1px solid #fff;
      border-radius: 50%;
      background-image: url(../../lib/base/air_cleaner/assets/new-air/disu@2x.png);
      background-repeat: no-repeat;
      background-size: 48px 48px;
      background-position: 50% 20px;
      .mode-name {
        position: relative;
        top: 72px;
        text-align: center;
        font-size: 20px;
        color: #ffffff;
      }
    }
    .mode-item2 {
      position: relative;
      left: -230px;
      top: 90px;
      width: 120px;
      height: 120px;
      border: 1px solid #fff;
      border-radius: 50%;
      background-image: url(../../lib/base/air_cleaner/assets/new-air/zhongdisu@2x.png);
      background-repeat: no-repeat;
      background-size: 48px 48px;
      background-position: 50% 20px;
      .mode-name {
        position: relative;
        top: 72px;
        text-align: center;
        font-size: 20px;
        color: #ffffff;
      }
    }
    .mode-item3 {
      position: relative;
      left: -88px;
      top: -80px;
      width: 120px;
      height: 120px;
      border: 1px solid #fff;
      border-radius: 50%;
      background-image: url(../../lib/base/air_cleaner/assets/new-air/zhongsu@2x.png);
      background-repeat: no-repeat;
      background-size: 48px 48px;
      background-position: 50% 20px;
      .mode-name {
        position: relative;
        top: 72px;
        text-align: center;
        font-size: 20px;
        color: #ffffff;
      }
    }
    .mode-item4 {
      position: relative;
      left: 56px;
      top: -160px;
      width: 120px;
      height: 120px;
      border: 1px solid #fff;
      border-radius: 50%;
      background-image: url(../../lib/base/air_cleaner/assets/new-air/gaosu@2x.png);
      background-repeat: no-repeat;
      background-size: 48px 48px;
      background-position: 50% 20px;
      .mode-name {
        position: relative;
        top: 72px;
        text-align: center;
        font-size: 20px;
        color: #ffffff;
      }
    }
    .mode-item5 {
      position: relative;
      left: 88px;
      top: -142px;
      width: 120px;
      height: 120px;
      border: 1px solid #fff;
      border-radius: 50%;
      background-image: url(../../lib/base/air_cleaner/assets/new-air/auto-white.png);
      background-repeat: no-repeat;
      background-size: 48px 48px;
      background-position: 50% 20px;
      .mode-name {
        position: relative;
        top: 72px;
        text-align: center;
        font-size: 20px;
        color: #ffffff;
      }
    }
    .mode-item6 {
      position: relative;
      left: 88px;
      top: -180px;
      width: 120px;
      height: 120px;
      border: 1px solid #fff;
      border-radius: 50%;
      background-image: url(../../lib/base/air_cleaner/assets/new-air/zidong@2x.png);
      background-repeat: no-repeat;
      background-size: 48px 48px;
      background-position: 50% 20px;
      .mode-name {
        position: relative;
        top: 72px;
        text-align: center;
        font-size: 20px;
        color: #ffffff;
      }
    }
    .mode-item7 {
      position: relative;
      left: -88px;
      top: -142px;
      width: 120px;
      height: 120px;
      border: 1px solid #fff;
      border-radius: 50%;
      background-image: url(../../lib/base/air_cleaner/assets/new-air/zidong@2x.png);
      background-repeat: no-repeat;
      background-size: 48px 48px;
      background-position: 50% 20px;
      .mode-name {
        position: relative;
        top: 72px;
        text-align: center;
        font-size: 20px;
        color: #ffffff;
      }
    }
    .disu {
      border-color: #ffc600;
      background-image: url(../../lib/base/air_cleaner/assets/new-air/disu@2x.png);
      .mode-name {
        color: #ffc600;
      }
    }
    .zhongdisu {
      border-color: #ffc600;
      background-image: url(../../lib/base/air_cleaner/assets/new-air/zhongdisu@2x.png);
      .mode-name {
        color: #ffc600;
      }
    }
    .zhongsu {
      border-color: #ffc600;
      background-image: url(../../lib/base/air_cleaner/assets/new-air/zhongsu@2x.png);
      .mode-name {
        color: #ffc600;
      }
    }
    .gaosu {
      border-color: #ffc600;
      background-image: url(../../lib/base/air_cleaner/assets/new-air/gaosu@2x.png);
      .mode-name {
        color: #ffc600;
      }
    }
    .auto {
      border-color: #ffc600;
      background-image: url(../../lib/base/air_cleaner/assets/new-air/zidong@2x.png);
      .mode-name {
        color: #ffc600;
      }
    }
  }
}
</style>
