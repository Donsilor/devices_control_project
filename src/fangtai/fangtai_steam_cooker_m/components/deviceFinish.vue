<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']">
      <NewTopBar
        :title="device.device_name"
        :shutdown="isClose == false || isOffline == true"
        :class-name="opcityStyle"
        bak-color="#000"
        @shutdownCallback="shutdowncallback('off')" />
      <!--模式-->
      <div class="main">
        <p class="finish-img"></p>
        <p class="finish-text">已完成</p>
      </div>
      <!--确定按钮-->
      <div class="tool-bar">
        <div class="ok">确定</div>
        <div class="auto-back">{{timer}}秒后自动返回默认状态</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapState, mapActions } from 'vuex'
  import TempTimePick from './tempTimePick.vue'
  export default {
    components: {
      TempTimePick
    },
    data() {
      return {
        activeMode: 0,
        timer: 10,
        timerId: ''
      }
    },

    computed: {
      ...mapGetters(['isClose', 'isOffline']),
      ...mapState(['device', 'deviceAttrs'])
    },
    watch: {

    },
    created() {
      this.timerId = setInterval(() => {
        if (this.timer === 0) {
          clearInterval(this.timerId)
          this.$router.push('/')
        } else {
          this.timer--
        }
      }, 1000)
    },
    mounted() {

    },
    methods: {
      ...mapActions(['getDeviceInfo', 'doControlDevice']),
      setRangWidth(val) {
        document.querySelector('.rang_width').style.width = val+"%"
      },
      // 开关机
      shutdowncallback(val){
        if (this.isOffline) return
        this.controlDevice('switch',val)
      },
      controlDevice(attr, value) {
        let param = {}
        if(attr == 'mode' && value == 'wind' && this.deviceAttrs.speed == 'auto'){
          param = { 'speed': 'low'}
        }
        return this.doControlDevice({
          nodeid: `airconditioner.main.${attr}`,
          params: {
            attribute: {
              [attr]: value,
              ...param
            }
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @imgPath: 'base/fantai_steam_cooker/assets';
  @imgPath1: 'base/oakes_air_condition/assets';
  .body {
    min-height: 100%;
  }
  .page {
    height: 100vh;
    min-height: 550px;
    overflow-x: hidden;
    position: relative;
    background-image: url('~@lib/@{imgPath1}/img_bg_01@2x.png');
    background-size: 100% 100%;
    &::-webkit-scrollbar {
      display: none;
    }

    .main {
      margin-top: 300px;
      position: relative;
      .finish-img{
        width: 140px;
        height: 140px;
        background: url('~@lib/@{imgPath}/wancheng@2x.png');
        background-size: 140px 140px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
      .finish-text{
        text-align: center;
        font-size: 48px;
        padding-top: 190px;
      }
    }
    .tool-bar {
      width: 90%;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 80px;
      .ok{
        width: 100%;
        height: 100px;
        background-color: #000;
        color: #fff;
        font-size: 32px;
        line-height: 100px;
        text-align: center;
      }
      .auto-back{
        font-size: 24px;
        text-align: center;
        padding-top: 12px;
      }
    }
    .close-style{
      opacity: 0.2;
    }
  }

</style>
