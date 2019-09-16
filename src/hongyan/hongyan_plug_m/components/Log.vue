<template>
  <div>
    <div 
      v-show="show" 
      class="page-log">
      <div class="topbar topbar-fixed">
        <div 
          class="statusbar" 
          style="25px"/>
        <div 
          class="navbar" 
          style="height:44px; line-height: 44px">
          <div class="left">
            <router-link
              to="/"
              class="icon-return"
            />
          </div>
          <div class="title">
            定时
          </div>
          <div class="right">
            <img 
              src="../../../../lib/base/hongyan_plug/assets/add.png" 
              @click.prevent="setNewTime">
          </div>
        </div>
      </div>
      <div class="main">
        <div 
          v-for="(item, index) in clockList" 
          :key="index" 
          class="clock">
          <div 
            class="time" 
            @click="toEditClock(index)">
            <div class="order">{{ item.time | tiemFiter }}</div>
            <div class="plan">{{ item.type | typeFiter }}，{{ item.week }}</div>
          </div>
          <switch-button 
            :value="item.clockSwitch"
            :sync="true" 
            :width="90"
            :height="55"
            :color="'#FFC700'"
            @change="changeClock"
          />
        </div>
      </div>
    </div>
    <!-- 新建定时/编辑定时 -->
    <Time 
      v-show="!show" 
      :oldTime="oldTime" 
      @delClock="delClock"
      @weekFlag="weekFlag" 
      @saveClock="saveClock"/>
  </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import SwitchButton from '@lib/components/SwitchButton.vue'
import Time from './Time.vue'
export default {
  components: {
    SwitchButton,
    Time
  },
  filters: {
    tiemFiter(data) {
      let h = data.split(':')[0]
      h = h < 10 ? ("0" + h) : h
      let m = data.split(':')[1]
      m = m < 10 ? ("0" + m) : m
      return h + ":" + m
    },
    typeFiter(data) {
      if (data ==1 ) {
        return '通电定时'
      } else {
        return '断电定时'
      }
    }
  },
  data(){
    return{
      show:true,
      oldTime:'',
      num:'',
      clockList:[
        // {time:"",type:"",week:""}
      ]
    }
  },
  computed: {
    ...mapGetters(['isClose', 'isOffline']),
    ...mapState(['device', 'deviceAttrs']),
    // 定时是否开启

  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
      // HdSmart.UI.setStatusBarColor(2)
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    setNewTime(){
      this.show = false
    },
    // 设置定时开启和关闭
    changeClock(){
      let clockStatus
      if (this.deviceAttrs.order_mode == 'on') {
        clockStatus = 'off'
      }else{
        clockStatus = 'on'
      }
      this.controlDevice("order_mode", clockStatus)
    },
    // 编辑闹钟
    toEditClock(index){
      console.log(index)
      this.num = index
      this.oldTime = this.clockList[index].time
      this.show = false
      this.controlDevice('order_time', this.clockList[index].time)
    },
    weekFlag(){
      this.show = true
    },
    // 保存闹钟
    saveClock(val){
      console.log(val)
      this.clockList.push(val)
      this.controlDevice('order_time', val.time)
    },
    // 删除闹钟
    delClock(){
      this.show = true
      this.clockList.splice(this.num,1)
    },
    controlDevice(attr, value) {
      return this.doControlDevice({
        nodeid: `hongyan_plug.main.${attr}`,
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
  .page-log {
    height: 100vh;
    min-height: 550px;
    overflow-x: hidden;
    position: relative;
    background: #f7f8fa;
    .right {
      >img{
        width: 40px;
        height: 40px;
      }
    }
    .main {
      margin-top: 178px;
    }
    .clock {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 40px 0 40px;
      padding: 10px 20px;
      background: #fff;
      border-bottom: 1px solid #F3F3F3;
      &:first-of-type{
        border-radius: 12px 12px 0 0;
      }
      &:last-of-type{
        border-radius: 0 0 12px 12px;
        border: none;
      }
      .time {
        font-size: 40px;
        color: #20282B;
        width: 100%;
        height: 124px;
        .order{
          line-height: 80px;
        }
        .plan {
          opacity: 0.5;
          font-size: 24px;
          color: #20282B;
        }
      }
      .vue-js-switch{
        overflow:initial;
      }
    }
  }
</style>