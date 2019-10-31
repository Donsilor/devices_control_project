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
          <div class="num">32</div>
        </div>
        <div>布防中...</div>
        <!-- 按钮 -->
        <div class="panel-btn center">
          <div class="btn-wrap">
            <div
              :class="['btn-open btn center']"
              @click="lock" />
            <div class="btn-name">撤防</div>
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
      })
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
      console.log(this.timeList.result)
    },()=>{
    },'da_get_dev_alert_list')

    // 点击按钮事件
    // HdSmart.Device.control({
    //   'status':1,
    // },(data)=>{
    //   console.log(data)
    //   this.timeList = data
    //   console.log(this.timeList.result)
    //   this.timeList.result = JSON.parse(this.timeList.result)
    // },()=>{

    // },'da_set_alert_status')
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    // goRecord(){
    //   this.$router.push({path:'/Record'})
    // },
    // 撤防/布防
    // lock(){
    //   if (this.timeList.result.list.status=='1') {
    //     HdSmart.Device.control({
    //       'status':0,
    //     },(data)=>{
    //       console.log(data,'我是按钮')
    //       // this.timeList = data
    //       // console.log(this.timeList.result)
    //       this.timeList.result = JSON.parse(this.timeList.result)
    //     },()=>{

    //     },'da_set_alert_status')
    //   }else{
    //     HdSmart.Device.control({
    //       'status':1,
    //     },(data)=>{
    //       console.log(data,'我是按钮')
    //       // this.timeList = data
    //       // console.log(this.timeList.result)
    //       this.timeList.result = JSON.parse(this.timeList.result)
    //     },()=>{

    //     },'da_set_alert_status')
    //   }
    // },
    // lock(e) {
    //   let ovp = ''
    //   if(e.target.checked){
    //       ovp = 'on'
    //   }else{
    //       ovp = 'off'
    //   }
    //    this.controlDevice('status',ovp)
    //   console.log(e.target.checked)
    // },
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
@imgPath: 'base/new_curtains/assets';
@imgPath1: 'base/somatosensor/assets';

.body {
  min-height: 100%;
}
  .panel-btn {
    height: auto;
    width: 100%;
    position: fixed;
    bottom: 130px;
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
        background-image: url('~@lib/@{imgPath1}/chefang.png');
          background-size: 100% 100%;
      }
      &.active {
        &.btn-open::before{
          background-image: url('~@lib/@{imgPath1}/bufang.png');
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
  background-image: url('~@lib/@{imgPath}/bg_01@2x.png');
  background-size: 100% 100%;
    .bottom{
      width: 100%;
      margin-top: 40px;
      .timing,.Charging-protection{
        padding: 0 50px;
        display: flex;
        justify-content: space-between;
        font-family: PingFangSC-Regular;
        font-size: 32px;
        color: #000000;
        height: 120px;
        line-height: 120px;
        border-bottom: 1px rgba(0, 0, 0, .1) solid;
        .flex{
          display: flex;
          justify-content: center;
          flex-direction: column;
          line-height: 56px;
          .small{
            font-size: 24px;
            line-height: 24px;
            color: rgba(0, 0, 0, 0.5);
          }
        }
        .timing-right{
          img{
            width: 32px;
          }
        }
    }
     .switch {
    width: 73px;
    height: 28px;
    position: relative;
    border: 1px solid transparent;
    // background-color: #fdfdfd;
    box-shadow: #dfdfdf 0 0 0 0 inset;
    border-radius: 20px;
    background-clip: content-box;
    display: inline-block;
    -webkit-appearance: none;
    user-select: none;
    outline: none;
    background-color: rgba(0, 0, 0, 0.1);
  }
  .switch:before {
      content: '';
      width: 40px;
      height: 40px;
      position: absolute;
      top: -8px;
      left: 0;
      border-radius: 20px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
      background: #7F7F7F;
  }
  .switch:checked {
      border-color: #E1B96E;
      box-shadow: #E1B96E 0 0 0 16px inset;
      background-color: #E1B96E;
  }
  .switch:checked:before {
      left: 30px;
      background: #000000;
  }
  .switch.switch-anim {
      transition: border cubic-bezier(0, 0, 0, 1) 0.4s, box-shadow cubic-bezier(0, 0, 0, 1) 0.4s;
  }
  .switch.switch-anim:before {
      transition: left 0.3s;
  }
  .switch.switch-anim:checked {
      // box-shadow: #64bd63 0 0 0 16px inset;
      // background-color: #64bd63;
      transition: border ease 0.4s, box-shadow ease 0.4s, background-color ease 1.2s;
  }
  .switch.switch-anim:checked:before {
      transition: left 0.3s;
  };
  }
}
</style>
