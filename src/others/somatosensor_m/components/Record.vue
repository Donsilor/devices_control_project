<template>
  <div class="record">
    <div 
      class="topbar topbar-fixed" 
      style="background:transparent">
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
        <div 
          class="title" 
          style="font-weight:bold">
          人体侦测记录
        </div>
      </div>
    </div>
    <div class="main">
      <div 
        v-show="timeList.result.list&&timeList.result.list.length!==0" 
        class="timeBox">
        <div class="title">
          <span>起始时间</span>
          <span>停留时长</span>
        </div>
        <ul>
          <li 
            v-for="item in timeList.result.list" 
            class="list">
            <span>{{ getDateTime(item.updated_at,'fulltime') }}</span>
            <span class="isgray">{{ item.updated_at }}</span>
          </li>
        </ul>
      </div>
      <div 
        v-show="timeList.result.list&&timeList.result.list.length==0" 
        class="picBox" >
        <img src="../../../../lib/base/somatosensor/assets/kong.png">
        <p>空空如也，暂无历史记录</p>
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
      timeList:{},
      // timeList:[
      //   // {day:'2019/09/27 12:33',time:'10小时32分钟'},
      //   // {day:'2019/09/26 16:57',time:'32小时56分钟'},
      //   // {day:'2019/09/25 23:24',time:'1小时7分钟'}
      // ]
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

      })
      // HdSmart.UI.setStatusBarColor(2)
    })
    // 当前时间和一个月前时间
    var date = new Date()
    function fillz(num) {
        num = num + ''
        return num.length == 1 ? '0' + num : num
    }
    this.currentdate=date.getFullYear() + fillz(date.getMonth() + 1) + fillz(date.getDate())
    this.currentdate1=date.getFullYear() + fillz(date.getMonth() ) + fillz(date.getDate())
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
    },()=>{

    },'da_get_dev_alert_list')
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
@imgPath: 'base/somatosensor/assets';
  .record{
    height: 100vh;
    min-height: 550px;
    overflow-x: hidden;
    position: relative;
    background-image: url('~@lib/@{imgPath}/img_bg_02.png');
    background-size: 100% 100%;
    position: relative;
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