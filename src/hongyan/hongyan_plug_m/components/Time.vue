<template>
  <div class="page-time">
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
          新建定时
        </div>
        <div class="right">
          <router-link 
            to="/log" 
            class="storage">存储</router-link>
        </div>
      </div>
    </div>
    <div class="timebox">
      <div
        class="model"
        @click.self="show = false"
        @touchmove.prevent>
        <div class="main">
          <div class="type">
            <span class="title">定时类型</span>
            <span class="electrify active">通电</span>
            <span class="electrify">断电</span>
          </div>
          <time-pick 
            :selectedchange="selectedchange" 
            class="pickTime"/>
          <div class="repeat">
            <span class="title">重复</span>
            <span 
              class="order" 
              @click="showWeek">永不 ></span>
          </div>
        </div>
      </div>
    </div>
    <week ref="week"/>
  </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import timePick from './timePick.vue'
import week from './week.vue'
export default {
  components: {
    'time-pick': timePick,week
  },
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
    selectedchange(val) {
      this.time = val
    },
    showWeek(){
      if(!this.isClose) this.$refs.week.show = true
    }
  }
}
</script>

<style lang="less" scoped>
  .page-time {
    height: 100vh;
    min-height: 550px;
    overflow-x: hidden;
    position: relative;
    background: #f7f8fa;
    .right{
      margin-right: 20px;
      .storage {
        color: #FFC800;
      }
    }
    .timebox {
      margin-top: 178px;
        .model{
          display: flex;
          align-items: center;
          justify-content: center;
          .main{
            position: relative;
            z-index: 99;
            width: 638px;
            height: 640px;
            color: #20282B;
            background: #fff;
            border-radius: 12px;
            .type{
              border-bottom: 1px solid #F3F3F3;
            }
            .title{
              margin: 50px 120px 50px 48px;
              display: inline-block;
              font-size: 32px;
              color: #20282B;
            }
            .electrify{
              font-size: 32px;
              width: 120px;
              height: 72px;
              text-align: center;
              line-height: 72px;
              display: inline-block;
              border-radius: 8px;
              border: 1px solid #D8D8D8;
              &.active{
                background: #FFC800;
                border: 1px solid #FFC800;
                color: #fff;
              }
            }
            .repeat{
              border-top: 1px solid #F3F3F3;
              height: 126px;
              .order{
              font-size: 24px;
              color: #C4C4C4;
              margin-left: 220px;
              }
            }
            
            .txt{
              text-align: center;
              font-size: 24px;
              color: #20282B;
              margin-bottom: 35px;
            }
            .wrap-btns{
              text-align: center;
            }
            .submit{
              margin-top: 50px;
              outline: none;
              border: none;
              background-image: linear-gradient(-90deg, #FFD500 0%, #FFBF00 100%);
              border-radius: 71px;

              font-size: 32px;
              color: #000000;
              text-align: center;
              width: 542px;
              height: 100px;
              margin: auto;
            }
            .cancel{
              margin-top: 32px;
              color: #FFC700;
              font-size: 32px;
              line-height: 44px;
            }
          }
      }
    }
  }
</style>