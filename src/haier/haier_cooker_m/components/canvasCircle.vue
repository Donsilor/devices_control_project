<template>
  <div id="canvas-circle">
    <div class="circle-chart">
      <div class="donut-chart">
        <div 
          id="section1"   
          class="clip">
          <div
            :style="rightPieStyle" 
            class="item"/>
        </div>
        <div 
          id="section2"      
          class="clip">
          <div
            :style="leftPieStyle" 
            class="item"/>
        </div>
        <div 
          id="section3"
          ref="section3" 
          :style="rightPieStyle" 
          class="clip">
          <div 
            ref="section3Item"
            :style="leftPieStyle" 
            class="item"/>
        </div>
        <div class="center">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['leftStatus','rightStatus'],
  computed:{
    parcent(){
      if(this.leftStatus){
            if (this.leftStatus == 'no') {
              return 0
            }
            if (this.leftStatus == 'low' || this.leftStatus == 'low_60') {
              return 34
            }
            if (this.leftStatus == 'nomal') {
              return 67
            }
            if (this.leftStatus == 'high'|| this.leftStatus == 'high_30') {
              return 100
            }
          }
         if(this.rightStatus) {
            if (this.rightStatus == 'no') {
              return 0
            }
            if (this.rightStatus == 'low' || this.rightStatus == 'low_60') {
              return 34
            }
            if (this.rightStatus == 'nomal') {
              return 67
            }
            if (this.rightStatus == 'high'|| this.rightStatus == 'high_30') {
              return 100
            }
          }
          
    },
     rightPieStyle() {
       if(this.parcent < 50){
        var offset = (360 / 100) * this.parcent
            return {
                'transform': `rotate(${offset}deg)`
            }
       }else{
         return {
                'transform': `rotate(${180}deg)`
            }
       }
            
    },
    leftPieStyle() {
      var offset = ""
       if(this.parcent < 50){
        offset = (360 / 100) * this.parcent
            return {
                'transform': `rotate(${180-offset}deg)`,
                'backgroundColor': '#fff'
            }
       }else{
         offset = ((360 / 100) * this.parcent)-180
         return {
                'transform': `rotate(${offset}deg)`,
                'backgroundColor': '#ff6026'
            }
       }
            
    },
  }
}
</script>
<style lang="less">
.circle-chart {
    .donut-chart {
      position: relative;
      width: 254px;
      height: 254px;
      border-radius: 100%
    }
    .donut-chart .center {
      background: #fff;
      border-radius: 50%;
      width: 88%;
      height: 88%;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      position: absolute;
    }
    .clip {
      border-radius: 50%;
      clip: rect(0px 258px 258px 126px);
      height: 100%;
      position: absolute;
      width: 100%;
    }  
    .item {
      border-radius: 50%;
      clip: rect(0px 128px 258px 0px);
      height: 100%;
      position: absolute;
      width: 100%;
    } 
    #section1 {
      transform: rotate(0deg);
    }
    #section1 .item {
      background-color: #ff6026;
      transform: rotate(180deg);
    }
    #section2 {
      transform: rotate(180deg);
    } 
    #section2 .item {
      background-color: #fff;
      transform: rotate(180deg);
    }
}
</style>