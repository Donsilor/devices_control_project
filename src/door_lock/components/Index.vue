<template>
<div class="page-index">

    <div class="name">{{device_name}}</div>
    <div class="lock-status">
        <span class="status" :class="{on:model.switch=='on'}">{{statusText}}</span>
        <span class="battery" :class="{low:lowBattery}">{{model.battery_percentage}}%电量</span>
    </div>
    <div class="lock" :class="[model.switch]"></div>

    <a href="#" class="btn-unlock" :class="{disabled:btnDisabled}" @click.prevent="showPwdInput">开锁</a>

    <router-link to="log" class="btn-golog"></router-link>

    <div class="alert-wraper">
      <div class="alert" :class="{warn:item.key}" v-for="(item,index) in theUnclickAlert" :key="index" v-if="index==0">
        <i></i>{{item.msg}}
        <a class="close" href="javascript:void(0)" @click="closeAlert(item)"></a>
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
  background:#f2f2f2;
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
}
.name {
  font-size: 30px;
  color: #808080;
  text-align: center;
  margin: 60px auto 6px;
  height: 40px;
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

/**
 *  {0, "e0", "not fully locked"}, // 未锁好
    {1, "e3", "tamper alarm: "},   // 防拆
    {2, "e4", "hijacked"},         // 挟持
    {3, "e2", "wrong code entry limit"}, // 密码试探
    {4, "e1", "battery low power"},      // 低电量
    {5, "e5", "dead locked"},            // 锁死
    {6, "e6", "dead bolt on"},      //反锁
    {7, "e7", "remote open disabled"} //禁止远程开锁
 */
//switch理解为disabled
const WARN_CODE = {
  e0: { msg: "门未关好!", switch: false },
  e1: { msg: "智能门锁电池电量不足，请及时更换电池！", switch: false },
  e2: { msg: "密码错误超过限制，请2分钟后再试", switch: true },
  e3: { msg: "有人强行拆门锁！", switch: false },
  e4: { msg: "家庭成员触发被挟持报警！", switch: false },
  e5: { msg: "门锁已被锁死，无法手机开锁", switch: true },
  e6: { msg: "门锁已被反锁，无法手机开锁", switch: true },
  e7: { msg: "无法手机开锁", switch: true },
};
let ERROR_STORE_KEY = ''

function findIndex(array, fn){
    for(var i=0;i<array.length;i++){
        if(fn(array[i])){
            return i
        }
    }
    return -1
}

export default {
  components: {
    PasswordInput
  },
  data() {
    return {
      hasSnapShot: false,
      device_name: "",
      passwordInputVisible: false,
      alertModel: [],
      model: {
        switch: "off",
        battery_percentage: '--'
      },
      errorStore: []
    };
  },
  computed: {
    lowBattery() {
        return this.model.battery_percentage <= 15
    },
    btnDisabled() {
      let status = this.model.switch == "on" ? true : false;
      this.alertModel.forEach(function(v, i) {
        status = v.switch || status;
      });
      return status;
    },
    theUnclickAlert() {
        var hasE5 = findIndex(this.alertModel, (item) =>{
            return item.code == 'e5'
        })
        var result = this.alertModel.filter((item) => {
            if(item.clicked){
                return false
            }
            if(item.code == 'e6'){
                return false
            }
            if(item.code == 'e2' && hasE5 >= 0){
                return false
            }
            return true
        })
        return result
    },
    lockedStatus() {
        var hasE6 = findIndex(this.alertModel, (item) =>{
            return item.code == 'e6'
        })
        return hasE6 >= 0
    },
    statusText() {
        return this.lockedStatus ? '已反锁' : (this.model.switch == 'on' ? '已打开' : '已关闭')
    }
  },
  watch: {
      btnDisabled(val) {
          if(val){
              this.passwordInputVisible = false
          }
      }
  },
  methods: {
    showPwdInput() {
      if (this.btnDisabled) {
        return;
      }
      this.passwordInputVisible = true;
    },
    closeAlert(error) {
      let code = error.code
      if(code == 'e4'){
          HdSmart.Device.control({
              method: 'dm_set',
              nodeid: 'doorlock.main.error',
              params: {
                  attribute: {
                      error: [{
                        "code": "e4",
				        "status": 1
                      }]
                  }
              }
          })
      }
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
    onAlert(errors) {
        for(var i=0; i<this.errorStore.length; i++){
            var item = errors.filter((el) => {
                return el.code == this.errorStore[i] && el.status == 0
            })
            if(item.length){
                this.errorStore.splice(i, 1)
                i--
            }
        }
        for(var i=0; i<errors.length; i++){
            var el = errors[i]
            var index = findIndex(this.alertModel, (item) => {
                return item.code == el.code
            })
            if(index >= 0){
                this.alertModel.splice(index, 1)
            }
            if(el.status == 1){
                this.alertModel.push({
                    msg: WARN_CODE[el.code].msg,
                    code: el.code,
                    key: 1,
                    switch: WARN_CODE[el.code].switch,
                    clicked: false
                })
            }
        }
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

      if(this.model.switch == "on") {
        this.passwordInputVisible = false;
      }
      this.onAlarm(data.attribute)
      HdSmart.UI.hideLoading()
    },
    onError() {}
  },
  created() {
    // this.$watch('errorStore', () => {
    //     localStorage.setItem(ERROR_STORE_KEY, JSON.stringify(this.errorStore))
    // })
    HdSmart.ready(() => {
    //   ERROR_STORE_KEY = window.device_uuid
    //   this.errorStore = JSON.parse(localStorage.getItem(ERROR_STORE_KEY)) || []
      HdSmart.UI.showLoading();
      setTimeout(() => {
        this.getSnapShot();
      }, 150)
    });

    HdSmart.onDeviceListen(data => {
      switch (data.method) {
        case "dm_set":
          if(data.code === 0){
              HdSmart.UI.toast("开锁成功");
          } else if(data.code == -16005){
            HdSmart.UI.toast("密码错误，请重新输入");
          }else{
            HdSmart.UI.toast("开锁失败！");
          }
          break;
        case "dr_report_dev_alert":
            this.onAlert(data.result.attribute.error)
          break;
        default:
          this.onSuccess(data.result);
          break;
      }
    });
  }
};
</script>
