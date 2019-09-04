<template>
  <div class="page">
    <topbar 
      :title="device_name"
      bak-color="#000" />
    <div class="main center">
      <div 
        class="wrap-circle center" 
        @click="pmsynopsis()">
        <div 
          :class="[ rotateClass, 'bg', 'rotate-low']"/>
        <div :class="['bgc',rotateClass2]" />
        <div class="PM PM-close">
          <span class="num">{{ deviceAttrs['pm2.5']||deviceAttrs['pm2.5']===0?deviceAttrs['pm2.5']:"--" }}</span>
          <span class="unit">ug/m<span class="span3">3</span></span>
        </div>
        <p class="describe">PM2.5 {{ deviceAttrs['pm2.5'] | pm25Text }}</p>
      </div>

      <div class="information first">
        <p>
          <span> <i class="num">{{ deviceAttrs.temperature | fixVal }}</i> <i class="unit">°C</i> </span>
          <span class="text">温度 {{ deviceAttrs.temperature | temperatureText }}</span>
          <!-- <span> <i class="num">{{ deviceAttrs.envnoise ||'--' }}</i> <i class="unit">db</i> </span>
          <span class="text">噪音</span> -->
        </p>
        <p>
          <span> <i class="num">{{ deviceAttrs.humidity | fixVal2 }}</i> <i class="unit">%</i></span>
          <span class="text">湿度 {{ deviceAttrs.humidity | humidityText }}</span>
          <!-- <span> <i class="num">--</i> <i class="unit">%</i></span>
          <span class="text">湿度 --</span> -->
        </p> 
        <p>
          <span> <i class="num">{{ deviceAttrs.envlux||'--' }}</i> <i class="unit">lux</i></span>
          <span class="text">光照度</span>
        </p>
      </div>

      <div class="information flex">
        <p>
          <!-- <span> <i class="num">{{ deviceAttrs.tvoc | fixVal }}</i> <i class="unit">mg/m3</i></span>
          <span class="text">TVOC {{ deviceAttrs.tvoc | tvocText }}</span> -->
          <span> <i class="num">{{ deviceAttrs.formaldehyde/100||'--' }}</i> <i class="unit">mg/m<i class="span3">3</i></i></span>
          <span class="text">甲醛</span>
        </p>
        <p class="last">
          <span><i class="num">{{ deviceAttrs.co2||'--' }}</i> <i class="unit">ppm</i></span>
          <span class="text">CO2a {{ deviceAttrs.co2 | co2Text }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      device_name:""
    }
  },
  computed: {
    ...mapState(['device', 'deviceAttrs']),
    rotateClass() {
      let pm2 = this.deviceAttrs['pm2.5']
      if (pm2||pm2===0) {
        if (pm2 >= 0 && pm2 <= 35) {
          return 'lvs2'
        } else if (pm2 > 35 && pm2 <= 75) {
          return 'huangs'
        } else if (pm2 > 75 && pm2 <= 115) {
          return 'huangs'
        } else if (pm2 > 115 && pm2 <= 150) {
          return 'hongse'
        } else if (pm2 > 150 && pm2 <= 255) {
          return 'shenghong'
        } else {
          return 'shenheng'
        }
      } else {
        return '----'
      }
    },
    rotateClass2() {
      let pm2 = this.deviceAttrs['pm2.5']
      if (pm2||pm2===0) {
        if (pm2 >= 0 && pm2 <= 35) {
          return 'lvs22'
        } else if (pm2 > 35 && pm2 <= 75) {
          return 'huangs2'
        } else if (pm2 > 75 && pm2 <= 115) {
          return 'huangs2'
        } else if (pm2 > 115 && pm2 <= 150) {
          return 'hongse2'
        } else if (pm2 > 150 && pm2 <= 255) {
          return 'shenghong2'
        } else {
          return 'shenheng2'
        }
      } else {
        return '----'
      }
    }
  },
  created() {
      if (window.device_name) {
        this.device_name = window.device_name
      }else{
        this.device_name = '空气云管家'
      }
    HdSmart.ready(() => { 
      console.log('sdsd')
      this.getDeviceInfo()
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo','doControlDevice']),
    pmsynopsis() {
      // console.log(this.deviceAttrs)
      this.$router.push('/pmsynopsis')
    },
  }
}
</script>

<style lang="less" scoped>
@imgPath: "base/air_quality_check/assets";
@bgcW: 440px;
i {
  font-style: normal;
}
.main {
  flex: 1;
  padding-bottom: 40px;
  &.center {
    flex-direction: column;
  }
  .wrap-circle {
    position: relative;
    margin-top: 60px;
    width: 524px;
    height: 524px;
    flex-direction: column;
    color: #20282b;
    .lvs2 {
      background: url("~@lib/@{imgPath}/lvs2.png") no-repeat;
      background-size: 100% 100%;
    }
    .huangs {
      background: url("~@lib/@{imgPath}/huangs.png") no-repeat;
      background-size: 100% 100%;
    }

    .huangs {
      background: url("~@lib/@{imgPath}/huangs.png") no-repeat;
      background-size: 100% 100%;
    }

    .hongse {
      background: url("~@lib/@{imgPath}/hongse.png") no-repeat;
      background-size: 100% 100%;
    }

    .shenghong {
      background: url("~@lib/@{imgPath}/shenghong.png") no-repeat;
      background-size: 100% 100%;
    }

    .shenheng {
      background: url("~@lib/@{imgPath}/shenheng.png") no-repeat;
      background-size: 100% 100%;
    }
    .lvs22 {
      background: #30d80a;
    }
    .huangs2 {
      background: #f5d100;
    }

    .huangs2 {
      background: #f99f03;
    }

    .hongse2 {
      background: #e31717;
    }

    .shenghong2 {
      background: #99004c;
    }

    .shenheng2 {
      background: #7e0023;
    }
  }

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .bgc {
    position: absolute;
    width: 420px;
    height: 420px;
    border-radius: 50%;
  }

  .PM {
    &.PM-close {
      display: flex;
      align-items: center;
      height: 152px;
      margin-left: 66px;
    }
    .num {
      color: #fff;
      position: relative;
      font-size: 100px;
    }
    .unit {
      opacity: 0.5;
      color: #fff;
      font-size: 20px;
      position: relative;
      top: -36px;
      left: 6px;
    }
  }
  .describe {
    color: #fff;
    position: relative;
    font-size: 20px;
  }
}
.information {
  display: flex;
  justify-content: space-between;
  font-size: 36px;
  width: 720px;

  &.first {
    margin-top: 60px;
    margin-bottom: 60px;
    border-bottom: 1px rgba(0, 0, 0, 0.1) solid;
    padding-bottom: 60px;
  }
  p {
    padding-left:60px;
    border-left: 1px rgba(0, 0, 0, 0.1) solid;
    text-align: left;
     flex: 1;
    &:nth-child(1) {
      border: 0;
    }
    // &.last {
    //   text-align: right;
    // }
    span {
      display: block;
    }
    .num {
      font-size: 62px;
    }
    .unit {
      font-size: 24px;
      position: relative;
      top: -40px;
      color: #35353d;
      opacity: 0.5;
    }
    .text {
      font-size: 24px;
      color: #35353d;
      opacity: 0.5;
    }
  }
}
.flex {
  p {
    flex: 1;
  }
}
.span3{
  position: relative;
  top:-6px;
  font-size: 10px;
}
</style>