<template>
<div class="page-log">
    <!-- 顶部条 -->
    <div class="topbar topbar-fixed">
        <div class="left">
            <router-link to="/" class="icon icon-arrow"></router-link>
        </div>
        <div class="title">
            <a href="#" @click.prevent="switchLog('lock')" :class="{active:activeName=='lock'}">开锁记录</a>
            <a href="#" @click.prevent="switchLog('warn')" :class="{active:activeName=='warn'}">预警记录</a>
        </div>
        <div class="right">
            <a href="" class="icon icon-del" @click.prevent="clearLog"></a>
        </div>
    </div>

    <log-list :data="list" />
    <a href="javascript:void(0)" class="btn-cale" @click.prevent="showCalendar"></a>
</div>
</template>

<style lang="less" scoped>
.page-log {
  padding-top: 96px;
}
.topbar {
  background: #f2f2f2;
  height: 95px;
  border-bottom: 1px solid #dbdbdb;
  position: relative;
  .left {
    position: absolute;
    top: 0;
    left: 0;
  }
  .right {
    position: absolute;
    top: 0;
    right: 0;
  }
  .title {
    text-align: center;
    line-height: 95px;
    font-size: 0;
    a {
      font-size: 30px;
      color: #2f3133;
      letter-spacing: 0;
      font-weight: 400;
      margin-left: 60px;
      margin-right: 60px;
      &.active {
        color: #13d5dc;
      }
    }
  }
  .icon {
    width: 100px;
    height: 96px;
    display: inline-block;
    background-repeat: no-repeat;
    background-size: 36px 36px;
    background-position: center center;
  }
  .icon-arrow {
    background-image: url(../assets/icn_topbar_back_normal.png);
    &:active {
      background-image: url(../assets/icn_topbar_back_pressed.png);
      -webkit-tap-highlight-color: transparent;
    }
  }
  .icon-del {
    background-image: url(../assets/icn_topbar_delete_normal.png);
    &:active {
      background-image: url(../assets/icn_topbar_delete_pressed.png);
      -webkit-tap-highlight-color: transparent;
    }
  }
}
.topbar-fixed {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 100;
}
.btn-cale {
  position: fixed;
  right: 60px;
  bottom: 78px;
  width: 96px;
  height: 96px;
  background: url(../assets/btn_calendar_normal.png) no-repeat;
  background-size: 100% 100%;
  &:active {
    background-image: url(../assets/btn_calendar_pressed.png);
    -webkit-tap-highlight-color: transparent;
  }
}
</style>

<script>
import Vue from "vue";
import datepick from "vue2-datepick";
import LogList from "./LogList";
import Calendar from "./Calendar";
Vue.use(datepick);
export default {
  components: {
    LogList,
    Calendar
  },
  data() {
    let date = new Date();
    let year = date.getYear();
    let month = date.getMonth() + 1;
    let day = date.getDay();
    month = month > 9 ? month : "0" + month;
    day = day > 9 ? day : "0" + day;
    return {
      family_id: "",
      device_id: "",
      activeName: "lock",
      date: year + month + day,
      list: []
    };
  },
  methods: {
    showCalendar() {
      this.$calendar.show({
        onOk: date => {
          this.date = date;
          if(this.activeName=='lock'){
              this.getLockList()
          }else{
              this.getWarnList();
          }
        }
      });
    },
    clearLog() {
        HdSmart.UI.alert({message:'确认清除所有记录吗？'},()=>{
            this.list = [];
        });
    },
    switchLog(type) {
      if (type == this.activeName) {
        return;
      }
      this.activeName = type;
      if(type=='lock'){
          this.getLockList();
      }else{
          this.getWarnList();
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
      if (!data) return;
      if (data.family_id) {
        this.family_id = data.family_id;
        this.device_id = data.device_id;
      }
    },
    onError() {},
    getLockList() {
      //发送指令
      HdSmart.Device.control(
        {
          method: "get",
          nodeid: "doorlock.main.user_identify",
          params: {
            attribute: {
              user_identify: "",
              date: this.date
            }
          }
        },
        data => {},
        data => {
          HdSmart.UI.toast("查询开锁记录失败！");
        }
      );
    },
    getWarnList() {
      HdSmart.Device.control(
        {
          method: "get",
          nodeid: "doorlock.main.open_type",
          params: {
            attribute: {
              open_type: "",
              date: this.date
            }
          }
        },
        data => {},
        data => {
          HdSmart.UI.toast("查询预警记录失败！");
        }
      );
    }
  },
  created() {
    HdSmart.ready(() => {
      HdSmart.UI.showLoading();
      this.getSnapShot(() => {
        this.getLockList();
        HdSmart.UI.hideLoading();
      });
    });
  }
};
</script>
