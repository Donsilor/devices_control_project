<template>
  <div class="container">
    <div class="title">{{remindTip}}</div>
    <div class="date">2020/03/16 18:35</div>
    <div class="datas">
      <bodyData v-for="item in bodyDatas"
                :status="item.status"
                :key="item.name"
                :value="item.value"
                :name="item.name"
                :unit="item.unit">
      </bodyData>
    </div>
    <div class="trend">
      <div class="top-title">
        <div class="left">趋势</div>
        <div class="right">
          <detailSwitch :type="3" @itemClick="itemClick" :isActive="currentIndex===3"></detailSwitch>
          <detailSwitch :type="4" @itemClick="itemClick" :isActive="currentIndex===4"></detailSwitch>
        </div>
      </div>
      <div class="bottm">
        <line-chart :options="options"></line-chart>
      </div>
    </div>
  </div>
</template>

<script>
  import Echart from 'echarts'
  import options from '@/ruiji_mirror_m/assets/datas/options.js'
  import lineChart from '@/ruiji_mirror_m/components/lineData.vue'
  import bodyData from '@/ruiji_mirror_m/components/bodyData.vue'
  import detailSwitch from '@/ruiji_mirror_m/components/detailSwitch.vue'
  import creatSerie from '@/ruiji_mirror_m/assets/datas/creatSerie.js'

  export default {
    name: "bloodPressure",
    components: {lineChart, bodyData, detailSwitch},
    data() {
      return {
        options: options,
        sPressureList: [],
        rPressureList: [],
        heartRateList: [],
        timeList: [],
        sPressure: 0,
        rPressure: 0,
        heartRate: 0,
        bodyDatas: [
          {name: '收缩压', value: '0', unit: 'mmhg', status: 0},
          {name: '舒张压', value: '0', unit: 'mmhg', status: 0},
          {name: '心率', value: '0', unit: 'bpm', status: 0}
        ],
        currentIndex: 3
      };
    },
    mounted() {
      this.options.series = [
        creatSerie(Echart, '#713DF4', this.rPressureList),
        creatSerie(Echart, '#3198F2', this.sPressureList)
      ]
      this.options.xAxis[0].data = this.timeList
      console.log('this.options=====', this.options)
    },
    computed: {
      remindTip() {
        if ((this.sPressure >= 90 && this.sPressure <= 140) && (this.rPressure >= 60 && this.rPressure <= 90) && (this.heartRate >= 60 && this.heartRate <= 100)) {
          return '您的血压、心率正常'
        } else if ((this.sPressure >= 90 && this.sPressure <= 140) && (this.rPressure > 90) && (this.heartRate >= 60 && this.heartRate <= 100)) {
          return '您的血压偏高心率正常'
        } else if ((this.sPressure > 140) && (this.rPressure >= 60 && this.rPressure <= 90) && (this.heartRate >= 60 && this.heartRate <= 100)) {
          return '您的血压偏高心率正常'
        } else if ((this.sPressure >= 90 && this.sPressure <= 140) && (this.rPressure < 60) && (this.heartRate >= 60 && this.heartRate <= 100)) {
          return '您的血压偏低心率正常'
        } else if ((this.sPressure > 140) && (this.rPressure > 90) && (this.heartRate >= 60 && this.heartRate <= 100)) {
          return '您的血压偏高心率正常'
        } else if ((this.sPressure >= 90 && this.sPressure <= 140) && (this.rPressure >= 60 && this.rPressure <= 90) && (this.heartRate > 100)) {
          return '您的血压正常心率偏高'
        } else if ((this.sPressure >= 90 && this.sPressure <= 140) && (this.rPressure >= 60 && this.rPressure <= 90) && (this.heartRate < 60)) {
          return '您的血压正常心率偏低'
        } else if ((this.sPressure >= 90 && this.sPressure <= 140) && (this.rPressure < 60) && (this.heartRate < 60)) {
          return '您的血压偏低心率偏低'
        } else if ((this.sPressure > 140) && (this.rPressure > 90) && (this.heartRate > 100)) {
          return '您的血压偏高心率偏高!'
        } else if ((this.sPressure > 140) && (this.rPressure > 90) && (this.heartRate < 60)) {
          return '您的血压偏高心率偏低!'
        } else if ((this.sPressure > 140) && (this.rPressure >= 60 && this.rPressure <= 90) && (this.heartRate > 100)) {
          return '您的血压偏高心率偏高!'
        } else {
          return '您的血压、心率正常'
        }
      }
    },
    watch: {
      bloodData: {
        handler(value) {
          this.sPressure = value[0].attribute.value1
          this.rPressure = value[0].attribute.value2
          this.heartRate = value[0].attribute.value3
          this.bodyDatas[0].value = this.sPressure
          this.bodyDatas[1].value = this.rPressure
          this.bodyDatas[2].value = this.heartRate
          this.sPressureList = value.map(item => {
            return item.attribute.value1
          })
          this.rPressureList = value.map(item => {
            return item.attribute.value2
          })
          this.heartRateList = value.map(item => {
            return item.attribute.value3
          })
          this.timeList = value.map(item => {
            return item.attribute.createTime
          })
        },
        immediate: true
      }
    },
    props: {
      bloodData: {
        type: Array,
        default() {
          return []
        }
      }
    },
    methods: {
      itemClick(index) {
        this.currentIndex = index
        if (index === 3) {
          this.options.series = [
            creatSerie(Echart, '#713DF4', this.rPressureList),
            creatSerie(Echart, '#3198F2', this.sPressureList)
          ]
        } else {
          this.options.series = [
            creatSerie(Echart, '#713DF4', this.heartRateList)
          ]
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    font-family: PingFangSC-Light;
    border-top-right-radius: 30px;
    color: white;
    background: #19191C;
    padding-top: 60px;
    padding: 60px 24px 10px;

    .title {
      font-size: 36px;
    }

    .date {
      opacity: 0.5;
      margin-top: 10px;
      font-size: 24px;

    }

    .datas {
      margin-top: 68px;
      margin-bottom: 60px;
      text-align: center;
      display: flex;
      justify-content: space-around;
    }

    .trend {
      border-top: 1px solid rgba(255, 255, 255, 0.1);

      .top-title {
        margin-top: 57px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .right {
          padding: 0 50px;
          display: flex;
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 36px;
          width: 324px;
          font-size: 24px;
          line-height: 72px;
          justify-content: space-between;
        }
      }
    }
  }
</style>
