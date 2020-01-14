/* eslint-disable vue/no-unused-vars */
<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, 'page']">
      <NewTopBar
        :title="device.device_name"
        :room="device.room_name"
        :scroll="true"
        page-class=".page"
        bak-color="#000"/>
      <StatusTip v-show="device.device_uuid"/>
      <div class="top">
        <div :class="[{'sideCicle':lockStatus =='1'},{'withdrawal':lockStatus != '1'}]">
          <div class="innerCicle">
            <div class="protectImg">
              <div 
                v-show="lockStatus =='1'" 
                class="protect"/>
            </div>
            <div class="node">
              <div>今日记录次数</div>
              <div class="num">{{ todayNum.result.total }}</div>
            </div>
            <div class="status">{{ lockStatus=='1'?'防护中':'已撤防' }}</div>
          </div>
        </div>
      </div>
      <!-- 按钮 -->
      <div class="panel-btn center">
        <div class="btn-wrap">
          <div
            :class="[{'active':lockStatus=='1'},'btn-open btn center']"
            @click="lock" />
          <div class="btn-name">{{ lockStatus=='1'?'撤防':'布防' }}</div>
        </div>
      </div>
      <div class="main">
        <div 
          v-show="timeList.result.list&&timeList.result.list.length!==0" 
          class="timeBox">
          <div class="title">
            <span>侦测时间</span>
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
          // list: [],
          total:""
        }
      },
      // 时间记录
      timeList:{
        result: {
          list: [
            {
              title:'除味',
              updated_at:3748481,
            },
            {
              title:'密胺',
              updated_at:1048486,
            },
            {
              title:'除味',
              updated_at:3748481,
            },
            {
              title:'密胺',
              updated_at:1048486,
            },
            {
              title:'除味',
              updated_at:3748481,
            },
            {
              title:'密胺',
              updated_at:1048486,
            },
          ]
        }
      },
      lockData:{},
      lockStatus:'',
      setLock:''
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
          this.getOne()
          .then(() =>{
            this.getTwo()
            .then(() => {
              this.getThree()
            })
          })
        })
        HdSmart.UI.setStatusBarColor(2)
    })

  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    getOne() {
      return new Promise((resolve, reject) => {
        // 获取设备布防/撤防状态
        HdSmart.Device.control({
          'list':[{
            'device_id':this.device.device_id,
            'device_category_id':this.device.device_category_id
          }]
        },(data)=>{
          console.log('===================status  data',data)
          if (typeof data.result === 'string') {
              this.lockData.result = JSON.parse(data.result)
            } else if (typeof data.result === 'object') {
              this.lockData.result = data.result
            }
            this.lockStatus = this.lockData.result.list.length > 0 ? this.lockData.result.list[0].status : ''
            console.log(this.lockStatus,'1111111')
            
          resolve()
        },(err)=>{
          reject(err)
        },'da_get_alert_status')
        
      })
    },
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
    // 设置布防/撤防
    lock(){
      HdSmart.UI.vibrate()
     if (this.lockStatus=='1') {
       this.setLock = 0
     } else{
       this.setLock = 1
     }
      HdSmart.Device.control({
        'family_id':this.device.family_id,
        'device_id':this.device.device_id,
        'status':this.setLock,
        },(data)=>{
          console.log('=====================setLock',data)
          if (data.code=='0') {
            this.lockStatus=this.setLock
            console.log(this.lockStatus,'状态-------')
            
          }
        },()=>{

        },'da_set_alert_status')
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
// .body {
//   min-height: 100%;
// }
  .panel-btn {
    height: auto;
    width: 100%;
    z-index: 999;
    margin-top: 156px;
    .btn {
      margin-top: 24px;
      width: 100%;
      height: 306px;
      border-radius: 40px 40px 0 0;
      background: rgba(0,0,0,0.05);
      overflow: hidden;
      display: flex;
      align-items: center;
    }
    &.center{
      display: flex;
      align-items: center;
    }
  }
  /*********** 按钮 ***********/
  .btn-wrap {
    margin: 0 34px 49px;
    .btn {
      box-sizing: border-box;
      margin: 0px auto;
      width: 132px;
      height: 132px;
      border-radius: 50%;

      display: flex;
      flex-direction: column;
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url('~@lib/@{imgPath}/anfang3.png');
          background-size: 100% 100%;
      }
      &.active {
        &.btn-open::before{
          background-image: url('~@lib/@{imgPath}/anfang4.png');
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
  // padding-bottom: 324px;
  &::before{
    content: "";
    background-image: url('~@lib/@{imgPath}/img_bg.png');
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
    width: 520px;
    height: 520px;
    margin: 0 auto;
    position: relative;
     .innerCicle{
        width: 464px;
        height: 464px;
        display: flex;
        align-items: center;
        flex-direction: column;
        .protectImg{
          width: 64px;
          height: 132px;
          position: relative;
          .protect{
            width: 64px;
            height: 70px;
            &::before{
              position: absolute;
              left: 0;
              top: 50%;
              margin-top: -50%;
              content: "";
              width: 64px;
              height: 70px;
              background-image: url('~@lib/@{imgPath}/protect.png');
              background-size: 100% 100%;
            }
          }
        }
      }
    .sideCicle{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 110px auto 156px;
      background: rgba(255,255,255,0.3);
      &::before{
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-image: url('~@lib/@{imgPath}/anfang1.png');
        background-size: 100% 100%;
        animation: 1.8s roate infinite linear;
      }
      @keyframes roate {
        0%{transform: rotate(0);}
        100%{transform: rotate(360deg);}
      }
      @keyframes roate1 {
        0%{transform: rotate(0);}
        100%{transform: rotate(-360deg);}
      }
      .innerCicle{
        width: 464px;
        height: 464px;
        display: flex;
        align-items: center;
        flex-direction: column;
        &::before{
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-image: url('~@lib/@{imgPath}/anfang2.png');
          background-size: 100% 100%;
          animation: 1.8s roate1 infinite linear;
        }
      }
    }
    .withdrawal{
       width: 100%;
       height: 100%;
       border-radius: 50%;
       margin: 110px auto 156px;
       display: flex;
       align-items: center;
       justify-content: center;
      //  background-image: linear-gradient(transparent, rgba(255,255,255,0.3));
      background: rgba(255,255,255,0.3);
       &::before{
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-image: url('~@lib/@{imgPath}/anfang5.png');
        background-size: 100% 100%;
      }
    }
    .node{
      width: 100%;
      height: auto;
      font-family: PingFangSC-Light;
      font-size: 24px;
      color: #000000;
      display: flex;
      align-items: center;
      flex-direction: column;
      .num{
        font-size: 144px;
        margin-bottom:40px;
        font-family: PingFangSC-Light;
      }
    }
      .status{
        font-family: PingFangSC-Light;
        font-size: 46px;
        text-align: center;
      }
  }
  .main{
    font-family: PingFangSC-Light;
      .title{
        height: 100px;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 26px;
        color: rgba(0,0,0,0.5);
        padding: 0 40px;
      }
      ul{
        .list{
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          font-size: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #000;
          height: 100px;
          padding: 0 40px;
          &:last-of-type{
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          }
          .isgray{
            color: rgba(0, 0, 0, 0.5);
          }
        }
      }
    }
}
</style>
