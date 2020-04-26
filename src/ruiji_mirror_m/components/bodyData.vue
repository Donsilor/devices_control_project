<template>
  <div class="item-container" :class="{unusual:status!==0}">
    <div class="item-title">
      <span>{{name}}</span>
      <img v-if="status!==0" :src="status===1?up:down" alt="">
    </div>
    <div class="item-number">{{value}}</div>
    <div class="item-unit">{{unit}}</div>
  </div>
</template>

<script>
  import up from '@/ruiji_mirror_m/assets/imgs/btn_ac_shangsheng@3x.png'
  import down from '@/ruiji_mirror_m/assets/imgs/btn_ac_xiajiang@3x.png'

  export default {
    name: "bodyData",
    data() {
      return {
        imgurl: up,
        up,
        down
      }
    },
    props: {
      name: {
        type: String,
        default: '参数名'
      },
      value: {
        type: [String, Number],
        default: 0
      },
      unit: {
        type: String,
        default: 'mmhg'
      },
      status: {
        type: Number,
        default: 0
      }
    }
  }
</script>

<style lang="less" scoped>
.item-container{
  width: 140px;
  text-align: center;
  color: white;
  margin-bottom: 60px;
  .item-title,.item-unit{
    opacity: 0.5;
    font-size: 24px;
    letter-spacing: 0;
    img{
      width: 22px;
    }
  }
  .item-number{
    font-size: 46px;
  }
}
.unusual {
  .item-unit,.item-number{
    background-image: linear-gradient(to right,#CC44D5 ,#FA277A);
    -webkit-background-clip:text;
    color: transparent;
  }
}
</style>
