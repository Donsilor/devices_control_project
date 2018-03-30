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

    <a href="#" class="btn-unlock" :class="{disabled:btnDisabled}" @click.prevent="showPwdInput">开锁</a>

    <router-link to="log" class="btn-golog"></router-link>

    <div class="alert-wraper">
      <div class="alert" v-if="showLowBattery">
        <i></i>智能门锁电池电量不足，请及时更换电池！
        <a class="close" href="javascript:void(0)" @click="showLowBattery=false"></a>
      </div>
      <div class="alert" :class="{warn:item.key}" v-for="(item,index) in alertModel" :key="index" v-if="!item.clicked">
        <i></i>{{item.msg}}
        <a class="close" href="javascript:void(0)" @click="closeAlert(index)"></a>
      </div>
    </div>
    <password-input :visible="passwordInputVisible" v-on:close-dialog="passwordInputVisible=false" />

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
.alert-wraper {
  position: fixed;
  left: 0;
  width: 100%;
  top: 96px;
  .alert {
    background: rgba(51, 51, 51, 0.75);
    width: 100%;
    height: 84px;
    line-height: 84px;
    text-align: center;
    color: #fff;
    font-size: 30px;
    margin-bottom: 4px;
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
}
</style>

<script>
import PasswordInput from "./PasswordInput.vue";
import Log from "./Log.vue";

const WARN_CODE = {
  e0: { msg: "门未关好!", switch: false },
  e1: { msg: "智能门锁电池电量不足，请及时更换电池！", switch: true },
  e2: { msg: "有人非法开锁！", switch: true },
  e3: { msg: "有人强行拆门锁！", switch: true },
  e4: { msg: "门锁触发被挟持报警！", switch: true },
  e5: { msg: "门锁：门锁已被锁死，无法手机开锁", switch: false },
  e6: { msg: "门锁：门锁已被反锁，无法手机开锁", switch: false },
  e7: { msg: "门锁：无法手机开锁", switch: false },
};
const ERROR_STORE_KEY = 'door_lock_error'
let errorSession = {};
export default {
  components: {
    PasswordInput,
    Log
  },
  data() {
    return {
      hasSnapShot: false,
      device_name: "",
      passwordInputVisible: false,
      lowBattery: false,
      showLowBattery: false,
      alertModel: [
        // { msg: "智能门锁电池电量不足，请及时更换电池！", key: 0,switch:true },
      ],
      model: {
        switch: "on",
        battery_percentage: 0
      },
      errorStore: []
    };
  },
  computed: {
    btnDisabled() {
      let status = this.model.switch == "on" ? true : false;
      this.alertModel.forEach(function(v, i) {
        status = v.switch && status;
      });
      return status;
    }
  },
  methods: {
    showPwdInput() {
      if (this.model.switch == "on") {
        return;
      }
      this.passwordInputVisible = true;
    },
    closeAlert(index) {
      let error = this.alertModel[index]
      let code = error.code
      if(this.errorStore.indexOf(code) < 0){
        this.errorStore.push(code)
        error.clicked = true
      }
    },
    onAlarm(attr) {
      let errors = attr.error || []
      let alertArry = [];
        for(var i=0; i<this.errorStore.length; i++){
            var item = errors.filter((el) => {
                return el.code == this.errorStore[i]
            })
            if(item.length==0 || item[0].status==0){
                this.errorStore.splice(i, 1)
                i--
            }
        }

        errors.forEach((el) => {
            if(el.status == 1){
                alertArry.push({
                    msg: WARN_CODE[el.code].msg,
                    code: el.code,
                    key: 1,
                    switch: WARN_CODE[el.code].switch,
                    clicked: this.errorStore.indexOf(el.code) >= 0
                })
            }
        })

        this.alertModel = alertArry

    },
    getSnapShot(cb) {
      HdSmart.Device.getSnapShot((data) => {
          this.onSuccess(data)
      });
    },
    onSuccess(data) {
      if (!data) return;
      if (data.device_name) {
        this.device_name = data.device_name;
      }
      this.model = data.attribute;
      if (this.model.battery_percentage <= 10) {
        this.lowBattery = true;
        this.showLowBattery = true;
      } else {
        this.lowBattery = false;
        this.showLowBattery = false;
      }
      if (this.model.switch == "on") {
        this.passwordInputVisible = false;
      }
      this.onAlarm(data.attribute)
      HdSmart.UI.hideLoading()
    },
    onError() {}
  },
  created() {
    this.$watch('errorStore', () => {
        localStorage.setItem(ERROR_STORE_KEY, JSON.stringify(this.errorStore))
    })
    HdSmart.ready(() => {
      HdSmart.UI.showLoading();
      setTimeout(() => {
        this.getSnapShot();
      }, 100)
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
