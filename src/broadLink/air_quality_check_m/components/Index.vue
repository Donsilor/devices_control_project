<template>
  <div class="page">
    <topbar 
      title="空气检查仪"
      bak-color="#000" />
    <div class="main center">
      <div class="wrap-circle center">
        <div 
          :class="[ rotateClass, 'bg', 'rotate-low']" 
          @click="PMsynopsis()" />
        <div 
          class="PM PM-close">
          <span class="num">{{ computePM25 }}</span>
          <span class="unit">ug/m3</span>
        </div>
        <p 
          class="describe">PM2.5 {{ computePM25Text }}</p>
      </div>


      <div class="information first">
        <p>
          <span>  <i class="num">{{ computeTemperature }}</i> <i class="unit">°C</i>  </span>
          <span class="text">温度 {{ computeTemperatureText }}</span> 
        </p>
        <p> 
          <span>  <i class="num">{{ computeHumidity }}</i> <i class="unit">%</i></span>
          <span class="text">湿度 {{ computeHumidityText }}</span> 
        </p>
        <p>
          <span>  <i class="num">--</i> <i class="unit">lux</i></span>
          <span class="text">光照度</span> 
        </p>      
      </div>


      <div class="information flex">
        <p>
          <span>  <i class="num">{{ computeTVOC }}</i> <i class="unit">mg/m3</i></span>
          <span class="text">TVOC {{ computeTVOCText }}</span> 
        </p>
        <p class="last">
          <span><i class="num">{{ deviceAttrs.co2||'----' }}</i> <i class="unit">ppm</i></span>
          <span class="text">CO2a {{ computeCO2Text }}</span> 
        </p>

      </div>
    </div>
  </div>
</template>
<script>
import {mapActions,mapState} from 'vuex'
export default {
  data(){
    return {

    }
  },
  computed:{
    ...mapState(['device', 'deviceAttrs']),
    rotateClass(){
      if(this.deviceAttrs['pm2.5']&&this.deviceAttrs['pm2.5']>0){
        if(this.deviceAttrs['pm2.5']>0&&this.deviceAttrs['pm2.5']<=350){
          return 'lvs2'
        }else if(this.deviceAttrs['pm2.5']>350&&this.deviceAttrs['pm2.5']<=750){
          return 'huangs'
        }else if(this.deviceAttrs['pm2.5']>750&&this.deviceAttrs['pm2.5']<=1150){
          return 'huangs'
        }else if(this.deviceAttrs['pm2.5']>1150&&this.deviceAttrs['pm2.5']<=1500){
          return 'hongse'
        }else if(this.deviceAttrs['pm2.5']>1500&&this.deviceAttrs['pm2.5']<=2550){
          return 'shenghong'
        }else{
          return 'shenheng'
        }
      }else{
        return '----'
      }
    },
    computePM25(){
      if(this.deviceAttrs['pm2.5']){
        return  this.deviceAttrs['pm2.5']/10
      }else{
        return '---'
      }
    },
    computePM25Text(){
      if(this.deviceAttrs['pm2.5']&&this.deviceAttrs['pm2.5']>0){
        if(this.deviceAttrs['pm2.5']>0&&this.deviceAttrs['pm2.5']<=350){
          return '优'
        }else if(this.deviceAttrs['pm2.5']>350&&this.deviceAttrs['pm2.5']<=750){
          return '良'
        }else if(this.deviceAttrs['pm2.5']>750&&this.deviceAttrs['pm2.5']<=1150){
          return '轻度污染'
        }else if(this.deviceAttrs['pm2.5']>1150&&this.deviceAttrs['pm2.5']<=1500){
          return '中度污染'
        }else if(this.deviceAttrs['pm2.5']>1500&&this.deviceAttrs['pm2.5']<=2550){
          return '重度污染'
        }else{
          return '严重污染'
        }
      }else{
        return '----'
      }
      
    },
    computeTemperature(){
      if(this.deviceAttrs.temperature){
        return  this.deviceAttrs.temperature/10
      }else{
        return '---'
      }
    },
    computeTemperatureText(){
      if(this.deviceAttrs.temperature){
        if(this.deviceAttrs.temperature<=-100){
          return '极寒'
        }else if(this.deviceAttrs.temperature>-100&&this.deviceAttrs.temperature<=100){
          return '寒冷'
        }else if(this.deviceAttrs.temperature>100&&this.deviceAttrs.temperature<=150){
          return '较冷'
        }else if(this.deviceAttrs.temperature>150&&this.deviceAttrs.temperature<=220){
          return '凉爽'
        }else if(this.deviceAttrs.temperature>220&&this.deviceAttrs.temperature<=260){
          return '适宜'
        }else if(this.deviceAttrs.temperature>260&&this.deviceAttrs.temperature<=300){
          return '较热'
        }else if(this.deviceAttrs.temperature>300&&this.deviceAttrs.temperature<=340){
          return '炎热'
        }else{
          return '酷热'
        }
      }else{
        return '--'
      }
    },
    computeHumidity(){
      if(this.deviceAttrs.humidity){
        return  this.deviceAttrs.humidity/100
      }else{
        return '---'
      }
    },
    computeHumidityText(){
      if(this.deviceAttrs.humidity){
        if(this.deviceAttrs.humidity<=1000){
          return '极度干燥'
        }else if(this.deviceAttrs.humidity>1000&&this.deviceAttrs.humidity<=3000){
          return '较为干燥'
        }else if((this.deviceAttrs.humidity>3000&&this.deviceAttrs.humidity<=4000)||(this.deviceAttrs.humidity>6000&&this.deviceAttrs.humidity<=7000)){
          return '较适宜'
        }else if(this.deviceAttrs.humidity>4000&&this.deviceAttrs.humidity<=6000){
          return '适宜'
        }else if(this.deviceAttrs.humidity>7000&&this.deviceAttrs.humidity<=9000){
          return '较潮湿'
        }else{
          return '非常潮湿'
        }
      }else{
        return '----'
      }
    },
    computeTVOC(){
      if(this.deviceAttrs.tvoc){
        return  this.deviceAttrs.tvoc/10
      }else{
        return '---'
      }
    },
    computeTVOCText(){
      if(this.deviceAttrs.tvoc&&this.deviceAttrs.tvoc>0){
        if(this.deviceAttrs.tvoc>0&&this.deviceAttrs.tvoc<=4){
          return '优'
        }else if(this.deviceAttrs.tvoc>4&&this.deviceAttrs.tvoc<=6){
          return '良'
        }else if(this.deviceAttrs.tvoc>6&&this.deviceAttrs.tvoc<=30){
          return '轻度污染'
        }else if(this.deviceAttrs.tvoc>30&&this.deviceAttrs.tvoc<=100){
          return '中度污染'
        }else if(this.deviceAttrs.tvoc>100&&this.deviceAttrs.tvoc<=250){
          return '重度污染'
        }else{
          return '严重污染'
        }
      }else{
        return '----'
      }
    },
    computeCO2Text(){
      if(this.deviceAttrs.co2&&this.deviceAttrs.co2>350){
        if(this.deviceAttrs.co2>350&&this.deviceAttrs.co2<=450){
          return '正常'
        }else if(this.deviceAttrs.co2>450&&this.deviceAttrs.co2<=1000){
          return '较正常'
        }else if(this.deviceAttrs.co2>1000&&this.deviceAttrs.co2<=2000){
          return '较浑浊'
        }else if(this.deviceAttrs.co2>2000&&this.deviceAttrs.co2<=5000){
          return '浑浊'
        }else{
          return '过于浑浊'
        }
      }else{
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
    PMsynopsis(){
      this.$router.push('/PMsynopsis')
    }
  }
}
</script>

<style lang="less" scoped>
@lib: "../../../../lib/base/haier_hood/assets";
@lib1: "../../../lib";
i{
   font-style:normal
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
      color: #20282B;
       .lvs2 {
        background: url("~@lib/base/air_quality_check/assets/lvs2.png") no-repeat;
        background-size: 100% 100%;
        }
      .huangs {
        background: url("~@lib/base/air_quality_check/assets/huangs.png") no-repeat;
        background-size: 100% 100%;
        }
      
      .huangs {
        background: url("~@lib/base/air_quality_check/assets/huangs.png") no-repeat;
        background-size: 100% 100%;
        }
      
      .hongse {
        background: url("~@lib/base/air_quality_check/assets/hongse.png") no-repeat;
        background-size: 100% 100%;
        }
      
      .shenghong {
        background: url("~@lib/base/air_quality_check/assets/shenghong.png") no-repeat;
        background-size: 100% 100%;
        }
      
      .shenheng {
        background: url("~@lib/base/air_quality_check/assets/shenheng.png") no-repeat;
        background-size: 100% 100%;
        }
    }
      
      .bg{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      .PM {
        &.PM-close{
          display: flex;
          align-items: center;
          height: 152px;
        }
        .num{
          font-size: 120px;
        }
        .unit{
          font-size: 20px;
          position: relative;
          top: -40px;
          left: 10px;
        }
       
      }
       .describe{
          font-size: 32px;
        }
    }
    .information{
      display: flex;
      justify-content:space-between;
      font-size: 36px;
      width: 720px;
     
      &.first{
        margin-top:60px;
        margin-bottom: 60px;
        border-bottom: 1px #0000004f solid;
        padding-bottom: 60px;
      }
      p{
        padding: 0 40px;
        border-left: 1px #0000004f solid;
        //  flex: 1;
        &:nth-child(1){
          border: 0
        }
        &.last{
          text-align: right
        }
        span{
          display: block
        }
        .num{
          font-size: 62px;
        }
        .unit{
          font-size: 24px;
          position: relative;
          top:-40px;
        }
        .text{
          font-size: 24px;
        }
      }
    }
    .flex{
      p{
        flex: 1
      }
    }
  
</style>