<template>
  <div
    :class="{visible:is_ready}"
    class="wrap"
  >
    <!--<div class="bg" :style="{transform:'translate3d(-50%,-'+moveX+'px,0)',opacity:bg_opacity}"></div>-->
    <div
      ref="leftBox"
      class="box left"
    >
      <div
        :style="{width:width}"
        class="clothes"
      >
        <div
          :style="{opacity: opacity}"
          class="folding"
        />
      </div>
    </div>

    <div
      ref="rightBox"
      class="box right"
    >
      <div
        :style="{width:width}"
        class="clothes"
      >
        <div
          :style="{opacity: opacity}"
          class="folding"
        />
      </div>
    </div>
  </div>
</template>

<script>
const BGMOVEDISTANCE = 24;
export default {
  props: {
    open_percentage: Number,
    is_ready: Boolean
  },
  computed: {
    //背景图移动的距离
    moveX() {
      return BGMOVEDISTANCE * this.open_percentage / 100;
    },
    //云背景的透明度
    bg_opacity() {
      return 0.7 + 0.3 * this.open_percentage / 100;
    },
    //窗帘黑色背景图的透明度
    opacity() {
      return 0.1 + 0.9 * this.open_percentage / 100;
    },
    width() {
      return 100 - 0.8 * this.open_percentage + "%";
    }
  }
};
</script>
<style lang="less" scope>
.clothes {
  transition: width 1s;
}
</style>

