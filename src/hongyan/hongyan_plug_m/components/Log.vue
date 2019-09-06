<template>
  <div class="page-log">
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
          <a
            href=""
            class="icon-more"
            @click.prevent="setNewTime"
          />
        </div>
      </div>
    </div>
    <div class="main">
      <div class="clock">
        <div class="time">
          <div class="order">09:00</div>
          <div class="plan">通电定时，每天</div>
        </div>
        <div class="switch-wrap">
          <input 
            id= "switch" 
            type="checkbox">
          <label 
            for="switch"/>
        </div>
      </div>
      <div class="clock">
        <div class="time">
          <div class="order">09:00</div>
          <div class="plan">断电定时，周一 周二 周三</div>
        </div>
        <div class="switch-wrap">
          <input 
            id= "switch1"
            type="checkbox">
          <label 
            for="switch1"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  data(){
    return{
    }
  },
  computed: {
    ...mapGetters(['isClose', 'isOffline']),
    ...mapState(['device', 'deviceAttrs']),
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
      this.$router.push({path:'/time'})
    }
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
      .switch-wrap{
        height: 124px;
        line-height: 0;
        input[type=checkbox]{
          height: 0px;
          width: 0px;
          visibility: hidden;
          margin:0;
          padding:0;
        }
        label{
          display: inline-block;
          width: 100px;
          height: 60px;
          border: 2px solid #F0F2F4;
          outline: none;
          border-radius: 16px;
          box-sizing: border-box;
          background: #FFFFFF;
          cursor: pointer;
          transition: border-color .3s,background-color .3s;
          vertical-align: middle;
          position: relative;
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            transition: transform 0.3s;
            width: 50px;
            height: 49.5px;
            border-radius: 50%;
            background-color: #fff;
            border: 1px solid #D4D8DE;
            box-shadow: 0 4px 8px 0 rgba(145,145,145,0.39);
          }
        }
      }
      .switch-wrap input:checked + label {
        background-image: linear-gradient(90deg, #FFDA00 0%, #FFC700 100%);
      }
      .switch-wrap input:checked + label:before {
        transform: translateX(40px);
        border: none;
      }
    }
  }
</style>