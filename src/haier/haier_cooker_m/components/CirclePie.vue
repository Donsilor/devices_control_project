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

<script>
  export default {
    props: ['leftStatus','rightStatus'],
    computed: {
        rotate() {
          if(this.leftStatus){
            if (this.leftStatus == 'no') {
              return 360
            }
            if (this.leftStatus == 'low' || this.leftStatus == 'low_60') {
              return 240
            }
            if (this.leftStatus == 'nomal') {
              return 120
            }
            if (this.leftStatus == 'high'|| this.leftStatus == 'high_30') {
              return 0
            }
          }
         if(this.rightStatus) {
            if (this.rightStatus == 'no') {
              return 360
            }
            if (this.rightStatus == 'low' || this.rightStatus == 'low_60') {
              return 240
            }
            if (this.rightStatus == 'nomal') {
              return 120
            }
            if (this.rightStatus == 'high'|| this.rightStatus == 'high_30') {
              return 0
            }
          }
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

<style lang="less" scoped>
.circle-pie {
    width:262px;
    height:262px;
    border-radius: 50%;
    background:#fff; 
    position: relative;
}
.pie-right,.pie-left {
    position: absolute;
    top: 0;
    left: 0;
    width:262px;
    height:262px;
    border-radius: 50%;
    transform: rotateY(0deg);
}
.right, .left {
    position: absolute;
    top: 0;
    left: 0;
    width:262px;
    height:262px;
    border-radius: 50%;
    background: #ff6026;
}
.pie-right, .right {
    clip: rect(0, auto, auto, 131px);
}
.pie-left, .left {
    clip: rect(0, 131px, auto, 0);
}
.mask {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);


    width: 232px; 
    height: 232px;  
    border-radius: 50%;
    background-color: #fff;
}
</style>