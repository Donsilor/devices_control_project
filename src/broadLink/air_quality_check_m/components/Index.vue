<template>
  <div class="page">
    <topbar 
      :title="device.name"
      bak-color="#000" />
    <div class="main center">
      <div class="wrap-circle center">
        <div 
          :class="[ rotateClass, 'bg', 'rotate-low']"
          @click="pmsynopsis()" />
        <div class="PM PM-close">
          <span class="num">{{ deviceAttrs['pm2.5'] | fixVal }}</span>
          <span class="unit">ug/m3</span>
        </div>
        <p class="describe">PM2.5 {{ deviceAttrs['pm2.5'] | pm25Text }}</p>
      </div>

      <div class="information first">
        <p>
          <span> <i class="num">{{ deviceAttrs.temperature | fixVal }}</i> <i class="unit">°C</i> </span>
          <span class="text">温度 {{ deviceAttrs.temperature | temperatureText }}</span>
        </p>
        <p>
          <span> <i class="num">{{ deviceAttrs.humidity | fixVal }}</i> <i class="unit">%</i></span>
          <span class="text">湿度 {{ deviceAttrs.humidity | humidityText }}</span>
        </p>
        <p>
          <span> <i class="num">--</i> <i class="unit">lux</i></span>
          <span class="text">光照度</span>
        </p>
      </div>

      <div class="information flex">
        <p>
          <span> <i class="num">{{ deviceAttrs.tvoc | fixVal }}</i> <i class="unit">mg/m3</i></span>
          <span class="text">TVOC {{ deviceAttrs.tvoc | tvocText }}</span>
        </p>
        <p class="last">
          <span><i class="num">{{ deviceAttrs.co2 || '----' }}</i> <i class="unit">ppm</i></span>
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
    }
  },
  computed: {
    ...mapState(['device', 'deviceAttrs']),
    rotateClass() {
      let pm2 = this.deviceAttrs['pm2.5']
      if (pm2 && pm2 > 0) {
        if (pm2 > 0 && pm2 <= 350) {
          return 'lvs2'
        } else if (pm2 > 350 && pm2 <= 750) {
          return 'huangs'
        } else if (pm2 > 750 && pm2 <= 1150) {
          return 'huangs'
        } else if (pm2 > 1150 && pm2 <= 1500) {
          return 'hongse'
        } else if (pm2 > 1500 && pm2 <= 2550) {
          return 'shenghong'
        } else {
          return 'shenheng'
        }
      } else {
        return '----'
      }
    }
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo']),
    pmsynopsis() {
      this.$router.push('/pmsynopsis')
    }
  }
}
</script>

<style lang="less" scoped>
@imgPath: 'base/air_quality_check/assets';

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
      background: url("~@lib/@{imgPath}/huangs.png")
        no-repeat;
      background-size: 100% 100%;
    }

    .huangs {
      background: url("~@lib/@{imgPath}/huangs.png")
        no-repeat;
      background-size: 100% 100%;
    }

    .hongse {
      background: url("~@lib/@{imgPath}/hongse.png")
        no-repeat;
      background-size: 100% 100%;
    }

    .shenghong {
      background: url("~@lib/@{imgPath}/shenghong.png")
        no-repeat;
      background-size: 100% 100%;
    }

    .shenheng {
      background: url("~@lib/@{imgPath}/shenheng.png")
        no-repeat;
      background-size: 100% 100%;
    }
  }

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .PM {
    &.PM-close {
      display: flex;
      align-items: center;
      height: 152px;
    }
    .num {
      font-size: 120px;
    }
    .unit {
      font-size: 20px;
      position: relative;
      top: -40px;
      left: 10px;
    }
  }
  .describe {
    font-size: 32px;
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
    border-bottom: 1px #0000004f solid;
    padding-bottom: 60px;
  }
  p {
    padding: 0 40px;
    border-left: 1px #0000004f solid;
    //  flex: 1;
    &:nth-child(1) {
      border: 0;
    }
    &.last {
      text-align: right;
    }
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
    }
    .text {
      font-size: 24px;
    }
  }
}
.flex {
  p {
    flex: 1;
  }
}
</style>