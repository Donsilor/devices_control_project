/* eslint-disable vue/no-unused-vars */
<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']">
      <NewTopBar
        :title="device.device_name"
        bak-color="#000"/>
      <div class="bottom">
        <div class="Charging-protection">
          <div class="flex"><span>布防</span><span class="small">开启后侦查到人体时会提醒你</span></div>
          <div><input
            :checked="deviceAttrs.ovp=='open'"
            class="switch switch-anim"
            type="checkbox"
            @click="lock"></div>
        </div>
        <div class="timing">
          <div>人体侦测记录</div>
          <div
            class="timing-right"
            @click="goRecord"><img src="../../../../lib/base/somatosensor/assets/arrow_in.png"></div>
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
    }
  },
  computed: {
    ...mapGetters(['isClose','isOffline']),
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
      // HdSmart.UI.setStatusBarColor(2)
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    goRecord(){
      this.$router.push({path:'/Record'})
    },
    lock(e) {
      console.log(this.isClose)
       if (this.isClose) return
      let ovp = ''
      if(e.target.checked){
          ovp = 'open'
      }else{
          ovp = 'close'
      }
       this.controlDevice('ovp',ovp)
      // console.log(e.target.checked)
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

.body {
  min-height: 100%;
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
