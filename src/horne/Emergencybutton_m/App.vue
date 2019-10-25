/* eslint-disable vue/no-unused-vars */
<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, 'page']">
      <NewTopBar
        :title="device.device_name"
        bak-color="#000"/>
      <div class="top">
        <div class="node">
          <div>今日记录次数</div>
          <div class="num">{{ todayNum.result.list.length }}</div>
        </div>
      </div>
      <div class="main">
        <div 
          v-show="timeList.result.list&&timeList.result.list.length!==0" 
          class="timeBox">
          <div class="title">
            <span>起始时间</span>
            <span>事件</span>
          </div>
          <ul>
            <li 
              v-for="item in timeList.result.list" 
              class="list">
              <span>{{ getDateTime(item.updated_at,'fulltime') }}</span>
              <span class="isgray">{{ item.title }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      currentdate:'',
      currentdate1:'',
      today:'',
      // 今日记录次数
      todayNum:{
        result: {
          list: []
        }
      },
      // 时间记录
      timeList:{
        result: {
          list: []
        }
      },
      lockStatus:'',
    }
  },
  computed: {
    ...mapGetters(['isOffline']),
    ...mapState(['device', 'deviceAttrs']),
  },
  watch: {
    'device.stateChange'(){
      this.$nextTick(()=>{
        //  this.newRatio()
      })
    },
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
      .then(()=>{
         // 当前时间和一个月前时间
          var date = new Date()
          function fillz(num) {
              num = num + ''
              return num.length == 1 ? '0' + num : num
          }
          this.currentdate=date.getFullYear() + fillz(date.getMonth() + 1) + fillz(date.getDate())
          this.currentdate1=date.getFullYear() + fillz(date.getMonth() ) + fillz(date.getDate())
          this.today=fillz(date.getDate())
          // 获取今日记录次数
           HdSmart.Device.control({
            'date_start':this.today,
            'date_end':this.today,
            'page':{
              'size':50,
              'begin':0
            }
          },(data)=>{
            console.log(data)
            this.todayNum = data
            console.log(this.todayNum.result)
            this.todayNum.result = JSON.parse(this.todayNum.result)
            console.log(this.todayNum.result)
          },()=>{
          },'da_get_dev_alert_list')

          // 获取列表list
          HdSmart.Device.control({
            'date_start':this.currentdate1,
            'date_end':this.currentdate,
            'page':{
              'size':50,
              'begin':0
            }
          },(data)=>{
            console.log(data)
            this.timeList = data
            console.log(this.timeList.result)
            this.timeList.result = JSON.parse(this.timeList.result)
            console.log(this.timeList.result)
          },()=>{
          },'da_get_dev_alert_list')
        })
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    getDateTime(date, type) {
      // 时间格式获取
      if (!date) return
      let d = new Date(+date)
      let year = d.getFullYear()
      let month =
        d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
      let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
      let hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
      let minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
      let seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()
      if (type === 'fulltime') {
        return (
          year +
          '/' +
          month +
          '/' +
          day +
          ' ' +
          hours +
          ':' +
          minutes +
          ':' +
          seconds
        )
      } else if (type === 'hms') {
        return hours + ':' + minutes + ':' + seconds
      } {
        return year + '-' + month + '-' + day
      }
    },
    lock(){
      this.lockStatus = this.timeList.result.list[0].status
      if (this.lockStatus=='1') {
        HdSmart.Device.control({
            'status':0,
          },(data)=>{
            console.log(data)
            // this.timeList = data
            // console.log(this.timeList.result)
            // this.timeList.result = JSON.parse(this.timeList.result)
          },()=>{

          },'da_set_alert_status')
      }else{
         HdSmart.Device.control({
            'status':1,
          },(data)=>{
            console.log(data)
            // this.timeList = data
            // console.log(this.timeList.result)
            // this.timeList.result = JSON.parse(this.timeList.result)
          },()=>{

          },'da_set_alert_status')
      }
    },
    controlDevice(attr, value,params) {
      return this.doControlDevice({
        nodeid: `curtain.main.${attr}`,
        params: {
          attribute: {
            [attr]: value,
            ...params
          }
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
// @imgPath: 'base/new_curtains/assets';
@imgPath: 'base/somatosensor/assets';

.body {
  min-height: 100%;
}
  .panel-btn {
    height: auto;
    width: 100%;
    // position: fixed;
    // bottom: 130px;
    z-index: 99999;
    .btn {
      margin-top: 24px;
      width: 100%;
      height: 306px;
      border-radius: 40px 40px 0 0;
      // background: rgba(136, 138, 137,.4);
      background: rgba(0, 0, 0, 0.1);
      overflow: hidden;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
    }
    &.center{
      display: flex;
      align-items: center;
    }
  }
  /*********** 按钮 ***********/
  .btn-wrap {
    margin: 0 34px 40px;
    .btn {
      box-sizing: border-box;
      margin: 0px auto;
      width: 120px;
      height: 120px;
      border-radius: 50%;

      display: flex;
      flex-direction: column;
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/@{imgPath}/chefang.png');
          background-size: 100% 100%;
      }
      &.active {
        &.btn-open::before{
          background-image: url('~@lib/@{imgPath}/bufang.png');
          background-size: 100% 100%;
        }
      }
    }
    .btn-name {
      text-align: center;
      color: #000;
      margin-top: 16px;
      font-size: 24px;
      line-height: 40px;
      // opacity: .5;
    }
  }
.page {
  height: 100vh;
  min-height: 550px;
  overflow-x: hidden;
  position: relative;
  background-image: url('~@lib/@{imgPath}/img_bg_01.png');
  background-size: 100% 100%;
  .top{
    .node{
      width: 100%;
      height: auto;
      opacity: 0.5;
      font-family: PingFangSC-Regular;
      font-size: 24px;
      color: #000000;
      display: flex;
      align-items: center;
      flex-direction: column;
      margin-top: 10vh;
      .num{
        font-size: 172px;
        opacity: 1;
        margin: 10px 0 100px 0;
      }
    }
      .status{
        font-family: PingFangSC-Regular;
        font-size: 48px;
        color: #000000;
        text-align: center;
        margin-bottom: 150px;
      }
  }
  .main{
      margin-top: 12vh;
      .title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 26px;
        color: #808080;
        margin-bottom: 30px;
        padding: 0 40px;
      }
      ul{
        .list{
          border-top: 1px solid rgba(0, 0, 0, 0.12);
          font-size: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #000;
          height: 102px;
          padding: 0 40px;
          &:last-of-type{
            border-bottom: 1px solid rgba(0, 0, 0, 0.12);
          }
          .isgray{
            color: rgba(0, 0, 0, 0.5);
          }
        }
      }
      .picBox{
        width: 264px;
        height: 250px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -132px;
        margin-top: -125px;
        img{
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: -46px;
          margin-top: -210px;
          width: 92px;
          height: 116px;
        }
        p{
          font-size: 24px;
          margin-top: 80px;
          color: rgba(0, 0, 0, 0.39);
        }
      }
    }
}
</style>
