<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']">
      <topbar 
        :title="device.device_name"
        bak-color="#20282B" />
      <div class="main center">
        <div class="wrap-circle">
          <div class="circle-left">
            <div 
              v-if="deviceAttrs.connectivity == 'offline' || deviceAttrs.switch == 'off'" 
              class="circle-gray">
              <img src="../../../lib/base/haier_cooker/assets/no_fire.png" >
            </div>
            <div 
              v-else 
              :class="[{'active': leftStatus !== 'no'}, 'circle-gray']">
              <circle-pie 
                :left-status="leftStatus" 
                class="pie">
                <p class="icon">
                  <img 
                    v-show="leftStatus == 'no'" 
                    src="../../../lib/base/haier_cooker/assets/no_fire.png" >
                  <img 
                    v-show="leftStatus == 'low' || leftStatus == 'low_60'" 
                    src="../../../lib/base/haier_cooker/assets/small_fire.png" >
                  <img 
                    v-show="leftStatus == 'nomal'" 
                    src="../../../lib/base/haier_cooker/assets/middle_fire.png" >
                  <img 
                    v-show="leftStatus == 'high' || leftStatus == 'high_30'" 
                    src="../../../lib/base/haier_cooker/assets/big_fire.png" >
                </p>
              </circle-pie>
            </div>
            <div class="left-cooker">
              <div class="cooker-name">左灶</div>
              <div class="fire">{{ deviceAttrs.connectivity == 'offline' || deviceAttrs.switch == 'off'? '无火': leftTxt }}</div>
            </div>
          </div>
          <div class="circle-right">
            <div 
              v-if="deviceAttrs.connectivity == 'offline' || deviceAttrs.switch == 'off'" 
              class="circle-gray">
              <img src="../../../lib/base/haier_cooker/assets/no_fire.png" >
            </div>
            <div 
              v-else 
              :class="[{'active': rightStatus !== 'no'}, 'circle-gray']">
              <circle-pie 
                :right-status="rightStatus" 
                class="pie">
                <p class="icon">
                  <img 
                    v-show="rightStatus == 'no'" 
                    src="../../../lib/base/haier_cooker/assets/no_fire.png" >
                  <img 
                    v-show="rightStatus == 'low' || rightStatus == 'low_60'" 
                    src="../../../lib/base/haier_cooker/assets/small_fire.png" >
                  <img 
                    v-show="rightStatus == 'nomal'" 
                    src="../../../lib/base/haier_cooker/assets/middle_fire.png" >
                  <img 
                    v-show="rightStatus == 'high' || rightStatus == 'high_30'" 
                    src="../../../lib/base/haier_cooker/assets/big_fire.png" >
                </p>
              </circle-pie>
            </div>
            <div class="right-cooker">
              <div class="cooker-name">右灶</div>
              <div class="fire">{{ deviceAttrs.connectivity == 'offline' || deviceAttrs.switch == 'off' ? '无火': rightTxt }}</div>
            </div>
          </div>
        </div>
        <!-- 警告 -->
        <warn-Box 
          v-if="accidentOut&&stalling"
          :left-stalling="leftStalling"
          @stallingEvent ="stallingEvent"
        />
        <warn-Box 
          v-if="dryHeat&&dryFire"
          :dry-heat="true"
          @dryheatEvent ="dryheatEvent"
        />
      </div>
      <div class="footer">
        <p>温馨提示：国家规定不能远程控制燃气灶，</p>
        <p>请不要远离开火的燃气灶太久。</p>
      </div>
    </div>
  </div>
</template>

<script>
import CirclePie from "./components/CirclePie.vue"
import warnBox from "./components/warnBox.vue"
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  components: {CirclePie,warnBox},
  data() {
    return {
      stalling:true,
      dryFire:true
    }
  },
  computed: {
    ...mapGetters(['isClose', 'isOffline']),
    ...mapState(['device', 'deviceAttrs']),
    // 意外熄火弹框
    accidentOut() {
        return this.leftStalling === 'on'|| this.rightStalling === 'on'
    },
    dryHeat(){
      return this.leftDryfire === 'on' || this.rightDryfire === 'on'
    },
    leftTxt() {
      console.log(this.accidentOut)
       if(!this.deviceAttrs.fire_status) return
      /* eslint-disable no-unreachable */
       switch(this.deviceAttrs.fire_status.stove_0) {
        case 'no':
          return '无火'
          break
        case 'low':
          return '小火'
          break
        case 'nomal':
          return '中火'
          break
        case 'high':
          return '大火'
          break
        case 'high_30':
          return '大火'
          break
        case 'low_60':
          return '小火'
          break
        // default:
        //   return 
      }
    },
    rightTxt() {
       if(!this.deviceAttrs.fire_status) return
      /* eslint-disable no-unreachable */
       switch(this.deviceAttrs.fire_status.stove_1) {
        case 'no':
          return '无火'
          break
        case 'low':
          return '小火'
          break
        case 'nomal':
          return '中火'
          break
        case 'high':
          return '大火'
          break
        case 'high_30':
          return '大火'
          break
        case 'low_60':
          return '小火'
          break
        // default:
        //   return 
      }
    },
    leftStalling(){
      if(this.deviceAttrs.accident_out) return this.deviceAttrs.accident_out.stove_0
    },
    rightStalling(){
      if(this.deviceAttrs.accident_out) return this.deviceAttrs.accident_out.stove_1
    },
    leftDryfire(){
      if(this.deviceAttrs.dry_heat) return this.deviceAttrs.dry_heat.stove_0
    },
    rightDryfire(){
      if(this.deviceAttrs.dry_heat) return this.deviceAttrs.dry_heat.stove_1
    },
    leftStatus() {
      if(this.deviceAttrs.fire_status) return this.deviceAttrs.fire_status.stove_0
    },
    rightStatus() {
      if(this.deviceAttrs.fire_status) return this.deviceAttrs.fire_status.stove_1
    },
  },
  created() {
  },
  methods: {
    ...mapActions(['doControlDevice']),
    controlDevice(attr, value) {
      return this.doControlDevice({
        nodeid: `haier_cooker.main.${attr}`,
        params: {
          attribute: {
            [attr]: value
          }
        }
      })
    },
    stallingEvent(){
      this.stalling = false
    },
    dryheatEvent(){
      this.dryFire = false
    }
  }
}
</script>
<style lang="less" scoped>
.body {
  min-height: 100%;
}
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-height: 550px;
  overflow-x: hidden;
  position: relative;
  background: #fff;

  &.filter {
    filter: blur(12px);
  }
  .main {
    flex: 1;
    padding-bottom: 40px;
    &.center {
      flex-direction: column;
    }
    .wrap-circle {
      width: 100%;
      display:flex;
      justify-content: space-around;
      .circle-gray {
        border: 2px solid #BFBFBF;
        border-radius: 50%;
        box-sizing: border-box;
        width: 276px;
        height: 276px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 40px;
        >img{
          width: 92px;
        }
        .icon {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          >img{
            width: 92px;
          }
        }
      }
      .circle-gray.active {
        border:2px solid #ff6026;
      }
      .cooker-name {
        font-size: 28px;
        margin-bottom: 14px;
        color: #000000;
        text-align: center;
      }
      .fire {
        font-size: 40px;
        color: #000000;
        text-align: center;
      }
    }
  }
  .footer {
    font-size: 28px;
    color: #A4A9AF;
    letter-spacing: 0;
    line-height: 40px;
    height: 336px;
    text-align: center;
  }
  &.close,
  &.offline {
    &:before {
      content: "";
      position: fixed;
      top: 64px;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 999;
      width: 100%;
    }
    &.page {
      background: #fff;
      .cover {
        background: #fff;
        .point {
          &.left {
            background: #d8d8d8;
          }
        }
      }
    }
    .panel-btn {
      background: #efefef;
    }
    .btn-wrap {
      opacity: 0.2;
      .btn {
        &.active {
          background: #fff;
          border: none;
        }
      }
    }
  }
}

</style>
