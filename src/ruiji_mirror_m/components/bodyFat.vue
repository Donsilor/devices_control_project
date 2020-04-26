<template>
  <div class="container">
    <div class="title">{{remindTip}}</div>
    <div class="date">2020/03/16 18:35</div>
    <div class="datas">
      <bodyData :status="0" :value="weight" name="体重" unit="kg"></bodyData>
      <bodyData :status="FatStatus()" :value="bodyFatRate" name="体脂率" unit="%"></bodyData>
      <bodyData :status="MuscleStatus()" :value="muscleRate" name="骨骼肌率" unit="%"></bodyData>
    </div>
    <div class="trend">
      <div class="top-title">
        <div class="left">趋势</div>
        <div class="right">
          <detailSwitch :type="0" @itemClick="itemClick" :isActive="currentIndex===0"></detailSwitch>
          <detailSwitch :type="1" @itemClick="itemClick" :isActive="currentIndex===1"></detailSwitch>
          <detailSwitch :type="2" @itemClick="itemClick" :isActive="currentIndex===2"></detailSwitch>
        </div>
      </div>
      <div class="bottm">
        <line-chart :options="options"></line-chart>
      </div>
    </div>
  </div>
</template>

<script>
  import lineChart from '@/ruiji_mirror_m/components/lineData.vue'
  import options from '@/ruiji_mirror_m/assets/datas/options.js'
  import bodyData from '@/ruiji_mirror_m/components/bodyData.vue'
  import detailSwitch from '@/ruiji_mirror_m/components/detailSwitch.vue'
  import Echart from 'echarts'
  import creatSerie from '@/ruiji_mirror_m/assets/datas/creatSerie.js'

  export default {
    name: "bodyFat",
    components: {lineChart, bodyData, detailSwitch},
    data() {
      return {
        BMI: 0,
        sex: 0,
        muscleRate: 0,
        bodyFatRate: 0,
        weightList:[],
        bodyFatList:[],
        muscleList:[],
        timeList:[],
        weight: 0,
        options,
        fatLevel: 2,
        isUnusual: true,
        currentIndex: 0,
      };
    },
    computed: {
      remindTip() {
        let str = ''
        let status = 0
        if (this.BMI >= 18.5 && this.BMI <= 23.9) {
          str = '您的体型正常'
          status = 0
        } else if (this.BMI < 18.5) {
          str = '您的体型偏瘦'
          status = 2
        } else if (this.BMI >= 24 && this.BMI <= 25) {
          str = '您的体型有点超重'
          status = 1
        } else if (this.BMI >= 25 && this.BMI <= 27.9) {
          str = '您的体型偏胖'
          status = 1
        } else if (this.BMI >= 28) {
          str = '您的体型属于肥胖型'
          status = 1
        }
        str = str + '   BMI:' + `${this.BMI}`
        return str
      }
    },
    props: {
      fatData: {
        type: Array,
        default() {
          return []
        }
      }
    },
    watch:{
      fatData:{
        handler(value) {
          this.weight = value[0].attribute.value1
          this.bodyFatRate = value[0].attribute.value8
          this.muscleRate = value[0].attribute.value3
          this.BMI = value[0].attribute.value11
          this.weightList= value.map(item=>{
            return item.attribute.value1
          })
          this.bodyFatList= value.map(item=>{
            return item.attribute.value8
          })
          this.muscleList= value.map(item=>{
            return item.attribute.value3
          })
          this.timeList = value.map(item => {
            return item.attribute.createTime
          })

        },
        immediate:true
      }
    },
    mounted() {
      this.options.series = [
        creatSerie(Echart, '#3198F2', this.weightList)
      ]
      this.options.xAxis[0].data = this.timeList
    },
    methods: {
      itemClick(index) {
        this.currentIndex = index
        if (index ===0) {
          this.options.series = [
            creatSerie(Echart,'#713DF4', this.weightList)
          ]

        }else if (index ===1){
          this.options.series = [
            creatSerie(Echart,'#713DF4', this.bodyFatList)
          ]
        } else if (index ===2){
          this.options.series = [
            creatSerie(Echart,'#713DF4', this.muscleList)
          ]
        }

      },
      FatStatus(){
        if (this.bodyFatRate < 15) {
          return 2
        } else if (this.bodyFatRate >= 15 && this.bodyFatRate <= 18) {
          return 0
        } else {
          return 1
        }
      },
      MuscleStatus() {
        if (this.muscleRate < 31) {
          return 2
        } else if (this.muscleRate >= 31 && this.muscleRate <= 34) {
          return 0
        } else {
          return 1
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    font-family: PingFangSC-Light;
    border-top-left-radius: 30px;
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
          width: 458px;
          font-size: 24px;
          line-height: 72px;
          justify-content: space-between;

          .right-item {
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }

    .unusual .item-number, .unusual .item-unit {
      background-image: linear-gradient(to right, #CC44D5, #FA277A);
      -webkit-background-clip: text;
      color: transparent;
    }
  }
</style>
