<template>
<div class="page-index">

    <div class="name">{{device_name}}</div>
    <div class="lock-status">
        <span class="status">{{model.switch == 'on' ? '已打开' : '已关闭'}}</span>
        <span class="battery" :class="{low:lowBattery}">{{model.battery_percentage}}%电量</span>
    </div>
    <div class="lock" :class="[model.switch]">
        <!-- <div class="pic" :class="[model.switch]"></div> -->
    </div>

    <a href="#" class="btn-unlock" :class="{disabled:model.switch == 'on'}" @click.prevent="showPwdInput">开锁</a>

    <router-link to="log" class="btn-golog"></router-link>

    <div class="alert" v-if="showAlert">
        <i></i>智能门锁电池电量不足，请及时更换电池！
        <a class="close" href="javascript:void(0)" @click="showAlert=false"></a>
    </div>

    <password-input :visible="passwordInputVisible" :switch="model.switch" v-on:close-dialog="passwordInputVisible=false" />

</div>
</template>

<style lang="less" scoped>
* {
  -webkit-tap-highlight-color: transparent;
}
.page-index {
  padding-top: 96px;
}
.name {
  font-size: 30px;
  color: #808080;
  text-align: center;
  margin: 60px auto 6px;
}
.lock-status {
  text-align: center;
  font-size: 0;
  .status {
    font-size: 30px;
    color: #c8cacc;
    margin-right: 12px;
    &.on {
      color: #46bcff;
    }
  }
  .battery {
    font-size: 30px;
    color: #c8cacc;
    margin-left: 12px;
    &.low {
      color: #f26161;
    }
  }
}
.lock {
  width: 504px;
  height: 504px;
  margin: 24px auto 0;
  background: url(../assets/img_lock_locked.png) no-repeat;
  background-size: 504px;
  text-align: center;
  &.on {
    background-image: url(../assets/img_lock_unlocked.png);
  }
  .pic {
    width: 96px;
    height: 96px;
    background: url(../assets/icn_lock_locked.png) no-repeat;
    background-size: 96px;
    margin: 132px auto 60px;
    display: inline-block;
    &.on {
      background-image: url(../assets/icn_lock_unlocked.png);
    }
  }
}
.btn-unlock {
  background: #46bcff;
  width: 144px;
  height: 144px;
  border-radius: 100%;
  margin: 24px auto 0;
  display: block;
  text-align: center;
  line-height: 144px;
  color: #ffffff;
  font-size: 36px;
  &.disabled {
    background: #ffffff;
    color: #c8cacc;
  }
}
.btn-golog {
  position: fixed;
  display: inline-block;
  right: 60px;
  top: 132px;
  width: 96px;
  height: 96px;
  background: url(../assets/btn_record_normal.png) no-repeat;
  background-size: 100% 100%;
  &:active {
    background-image: url(../assets/btn_record_pressed.png);
  }
}
.alert {
  position: fixed;
  left: 0;
  top: 96px;
  background: rgba(51, 51, 51, 0.75);
  width: 100%;
  height: 84px;
  line-height: 84px;
  text-align: center;
  color: #fff;
  font-size: 30px;
  i {
    display: inline-block;
    width: 34px;
    height: 34px;
    background: url(../assets/icn_notice_white_s.png) no-repeat;
    background-size: 34px;
    margin-right: 13px;
    vertical-align: text-bottom;
  }
  .close {
    float: right;
    display: inline-block;
    width: 30px;
    height: 30px;
    background: url(../assets/btn_close_white_normal.png) no-repeat;
    background-size: 30px;
    margin-top: 27px;
    margin-right: 26px;
    &:active {
      background-image: url(../assets/btn_close_pressed.png);
    }
  }
  &.warn {
    background: rgba(242, 97, 97, 0.9);
  }
}
</style>

<script>
import PasswordInput from "./PasswordInput.vue";
import Log from "./Log.vue";

export default {
  components: {
    PasswordInput,
    Log
  },
  data() {
    return {
      device_name: "智能门锁",
      passwordInputVisible: false,
      lowBattery: false,
      showAlert: false,
      model: {
        switch: "on",
        battery_percentage: 0
      }
    };
  },
  computed: {
    batteryStatus() {}
  },
  methods: {
    showPwdInput() {
      if (this.model.switch == "on") {
        return;
      }
      this.passwordInputVisible = true;
    },
    closepwdInput() {},
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
      if (!data) return;
      this.status = "success";
      if (data.device_name) {
        this.device_name = data.device_name;
      }
      this.model = data.attribute;
      this.lowBattery = this.model.battery_percentage > 10 ? false : true;
      this.showAlert = this.lowBattery;
    },
    onError() {
      this.status = "error";
    }
  },
  created() {
    HdSmart.ready(() => {
      HdSmart.UI.showLoading();
      this.getSnapShot(() => {
        HdSmart.UI.hideLoading();
      });
    });

    HdSmart.onDeviceListen(data => {
      switch (data.method) {
        case "dm_set":
          if (data.code !== 0) {
            this.getSnapShot();
          }
          break;
        case "dr_report_dev_alert":
          this.onAlarm(data.result.attribute);
          break;
        default:
          this.onSuccess(data.result);
          break;
      }
    });
  }
};
</script>
