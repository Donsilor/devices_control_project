/* eslint-disable vue/no-unused-vars */
<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, 'page']">
      <NewTopBar
        :title="device.device_name"
        :scroll="true"
        bak-color="#000"/>
      <div class="top">
        <div class="node">
          <div>今日记录次数</div>
          <div class="num">{{ todayNum.result.total }}</div>
        </div>
        <div class="status">布防中...</div>
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
              <span>{{ getDateTime(item.updated_at*1000,'fulltime') }}</span>
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
      // 今日记录次数
      todayNum:{
        result: {
          // list: []
          total:""
        }
      },
      // 时间记录
      timeList:{
        result: {
          list: []
        }
      },
    }
  },
  computed: {
    ...mapGetters(['isOffline']),
    ...mapState(['device', 'deviceAttrs']),
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
          this.getTwo()
          .then(() =>{
            this.getThree()
          })
        })
        HdSmart.UI.setStatusBarColor(2)
    })

  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    getTwo() {
      return new Promise((resolve, reject) => {
        // 获取今日记录次数
           HdSmart.Device.control({
            'date_start':this.currentdate,
            'date_end':this.currentdate,
            'page':{
              'size':50,
              'begin':0
            }
          },(data)=>{
            console.log('==================today',data)
            // this.todayNum = data
            if (typeof data.result === 'string') {
              this.todayNum.result = JSON.parse(data.result)
            } else if (typeof data.result === 'object') {
              this.todayNum.result = data.result
            }
            resolve()
          },(err)=>{
            reject(err)
          },'da_get_dev_alert_list')
      })
    },
    getThree() {
      return new Promise((resolve, reject) =>{
        // 获取列表list
          HdSmart.Device.control({
            'date_start':this.currentdate1,
            'date_end':this.currentdate,
            'page':{
              'size':50,
              'begin':0
            }
          },(data)=>{
            console.log('=====================getList',data)
            this.timeList = data
            if (typeof data.result === 'string') {
              this.timeList.result = JSON.parse(data.result)
            } else if (typeof data.result === 'object') {
              this.timeList.result = data.result
            }
            resolve()
          },(err)=>{
            reject(err)
          },'da_get_dev_alert_list')
      })
    },
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
      // justify-content: space-evenly;
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
   &::before{
    content: "";
    background-image: url('~@lib/@{imgPath}/img_bg_01.png');
    background-repeat:no-repeat;
    background-size: 100% 100%;
    position: fixed;
    top:0;
    left: 0; 
    right: 0;
    bottom: 0;
    z-index: -1;
  }
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
