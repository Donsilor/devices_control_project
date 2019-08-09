<template>
  <div class="circle-pie">
    <div class="pie-right">
      <p 
        :style="rightPieStyle" 
        class="right"/>
    </div>
    <div class="pie-left">
      <p 
        :style="leftPieStyle" 
        class="left"/>
    </div>
    <div class="mask">
      <slot />
    </div>
  </div>
</template>

<style lang="less" scoped>
.circle-pie {
    width:262px;
    height:262px;
    border-radius: 50%;
    background: #ff6026;
    position: relative;
}
.pie-right, .pie-left {
    position: absolute;
    top: 0;
    left: 0;
    width:262px;
    height:262px;
    border-radius: 50%;
}
.right, .left {
    position: absolute;
    top: 0;
    left: 0;
    width:262px;
    height:262px;
    border-radius: 50%;
    background:#fff;
}
.pie-right, .right {
    clip: rect(0, auto, auto, 132px);
}
.pie-left, .left {
    clip: rect(0, 130px, auto, 0);
}
.mask {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 242px; 
    height: 242px;  
    border-radius: 50%;
    background-color: #fff;
}
</style>


<script>
export default {
    props: ['leftStatus','rightStatus'],
    computed: {
        rotate() {
          if (this.leftStatus == 'no') {
            return 0
          }
          if (this.leftStatus == 'low' || this.leftStatus == 'low_60') {
            return 120
          }
          if (this.leftStatus == 'nomal') {
            return 240
          }
          if (this.leftStatus == 'high'|| this.leftStatus == 'high_30') {
            return 360
          }
            // return (100-this.value) * 3.6
            // return 120
        },
        rightPieStyle() {
            var r = this.rotate < 180 ? this.rotate : 180
            return {
                'transform': `rotate(${r}deg)`
            }
        },
        leftPieStyle() {
            var r = this.rotate < 180 ? 0 : this.rotate-180
            return {
                'transform': `rotate(${r}deg)`
            }
        }
    }
}
</script>
