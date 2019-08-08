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
    width:360px;
    height:360px;
    border-radius: 50%;
    background: #f8f8f8;
    position: relative;
}
.pie-right, .pie-left {
    position: absolute;
    top: 0;
    left: 0;
    width:360px;
    height:360px;
    border-radius: 50%;
}
.right, .left {
    position: absolute;
    top: 0;
    left: 0;
    width:360px;
    height:360px;
    border-radius: 50%;
    background:#46bcff;
}
.pie-right, .right {
    clip: rect(0, auto, auto, 180px);
}
.pie-left, .left {
    clip: rect(0, 180px, auto, 0);
}
.mask {
    position: absolute;
    top: 10px;
    left: 10px;
    height: 340px;
    width: 340px;
    background: #fff;
    border-radius: 50%;
    text-align: center;
}
</style>


<script>
export default {
    props: ['value'],
    computed: {
        rotate() {
            return (100-this.value) * 3.6
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
