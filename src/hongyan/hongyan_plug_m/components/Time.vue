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
          <a 
            class="icon-return" 
            @click.prevent="$emit('weekFlag', true)"/>
            <!-- <router-link
            to="/log"
            class="icon-return"
          /> -->
        </div>
        <div class="title">
          {{ titleType }}
        </div>
        <div class="right">
          <div 
            class="storage" 
            @click="saveTime">存储</div>
            <!-- <router-link 
            to="/log" 
            class="storage">存储</router-link> -->
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
            <span 
              :class="[{'active': deviceAttrs.type == 1 },'electrify' ]" 
              @click="setType('1')">通电</span>
            <span 
              :class="[{'active': deviceAttrs.type == 2 },'electrify' ]" 
              @click="setType('2')">断电</span>
          </div>
          <time-pick 
            class="pickTime" 
            @selectedchange="selectedchange"/>
          <div class="repeat">
            <span class="title">重复</span>
            <span 
              class="order" 
              @click="showWeek">{{ dayClone }} ></span>
          </div>
        </div>
      </div>
      <div 
        v-show="oldTime" 
        class="delbtn">
        <input 
          class="delclock"
          type="button"
          value="删除定时" 
          @click="delclock">
      </div>
    </div>
    <week 
      v-show="weekFlag"
      ref="week"
      @flagClose="flagClose"
      @selectDay="selectDay"/>
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
  props: {
     oldTime:'',
  },
  data(){
    return{
      weekFlag: false,
      day:'永不',
      time: "0:0",
      clockObj:{
        time:"",
        type:"",
        week:""
      }
    }
  },
  computed: {
    dayClone() {
      if (Object.prototype.toString.call(this.day) !== '[object Array]') {
        return this.day
      }
      function compare(property, desc) {
        return function(a, b) {
          var value1 = a[property]
          var value2 = b[property]
          if (desc === true) {
            return value1 - value2
          } else {
            return value2 - value1
          }
        }
      }
      let day = this.day
      day = day.sort(compare('order', true))
      let show = ''
      day.forEach((ele) => {
        if (!ele.show) {
          show += ele.week 
        }
      })
      console.log(show)
      if (show == '') {
        return '永不'
      }
      if (show.length == 14) {
        return '每天'
      }
      return show
    },
    titleType(){
      return this.oldTime !='' ? '编辑定时' : '新建定时'
    },
    // editTime(){
    //   return this.oldTime ? this.time == this.oldTime : this.time
    // },
    ...mapGetters(['isClose', 'isOffline']),
    ...mapState(['device', 'deviceAttrs']),
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    setType(val){
      this.controlDevice('type', val)
    },
    selectedchange(val) {
      this.time = val
      console.log(val)
    },
    flagClose() {
      this.weekFlag = false
    },
    showWeek(){
      this.weekFlag = true
    },
    selectDay(data){
      this.day = data
    },
    // 删除定时
    delclock(){
      this.$emit('delClock')
    },
    // 存储
    saveTime(){
      this.clockObj.week = this.dayClone
      this.clockObj.time = this.time
      this.clockObj.type = this.deviceAttrs.type
      this.clockObj.clockSwitch = true
      console.log(this.clockObj)
      
      this.$emit('weekFlag', true)
      this.$emit('saveClock', JSON.parse(JSON.stringify(this.clockObj)))
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
        font-size:32px;
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
              display: flex;
              justify-content: space-between;
              align-items: center;
              .order{
                font-size: 24px;
                color: #C4C4C4;
                margin-right: 40px;
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
      .delbtn{
        width: 100%;
        height: 204px;
        background-color: #fff;
        position: absolute;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        .delclock {
          width: 654px;
          height: 100px;
          border: 1px solid rgba(241, 48, 27, .5);
          border-radius: 71.36px;
          background-color: #fff;
          font-size: 32px;
          color: #F1301B;
          text-align: center;
          line-height: 44px;
        }
      }
      
    }
  }
</style>