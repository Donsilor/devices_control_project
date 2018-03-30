<template>
<div class="page-log">
    <!-- 顶部条 -->
    <div class="topbar topbar-fixed">
        <div class="left">
            <router-link to="/" class="icon icon-arrow"></router-link>
        </div>
        <div class="title">
            <a href="" @click.prevent="switchLog('lock')">开锁记录</a>
            <!-- <a href="#" @click.prevent="switchLog('warn')" :class="{active:activeName=='warn'}">预警记录</a> -->
        </div>
        <div class="right">
            <!-- <a href="" class="icon icon-del" @click.prevent="clearLog"></a> -->
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
  bottom: 80px;
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
import LogList from "./LogList";

let device_id = null
let family_id = null

function fillz(num) {
    return num.length == 1 ? '0' + num : num
}

function getDate(date){
    let d = date.split('-')
    let result = d[0] + fillz(d[1]) + fillz(d[2])
    return result
}

export default {
  components: {
    LogList
  },
  data() {
    return {
        list: []
    };
  },
  methods: {
    showCalendar() {
      this.$calendar.show({
        year: [2017,2020],
        onOk: date => {
            this.getLogData(getDate(date))
        }
      });
    },
    clearLog() {

    },
    getLogData(date){
        HdSmart.Device.control({
          method: "dr_get_dev_status_list",
          params: {
              device_id: device_id,
              family_id: family_id,
              date: date || '20180330',
              page: {
                size: 10,
                begin: 0
              }
          }
        }, (data) => {
            if(data.code === 0 && data.result.list){
                this.list = data.result.list
            }else{
                alert(JSON.stringify(data))
            }
        }, (data) => {

        }
      )
    },
    getAlertData() {

    },
    beforeInit(data){
        if(!data || !data.device_id || !data.family_id){
            return
        }
        if(data.device_id){
            device_id = data.device_id
        }
        if(data.family_id){
            family_id = data.family_id
        }
        this.getLogData()
    }
  },
  created() {
    HdSmart.ready(() =>{
        setTimeout(() => {
            HdSmart.Device.getSnapShot(this.beforeInit)
        }, 100)
    })

    HdSmart.onDeviceListen((data) => {
        if(data.method == 'dm_get_device_info'){
            this.beforeInit(data.result)
        }
    })

  }
};
</script>
