<style scoped>
  .bg{
    width : 600px;
    height:600px;
    margin : 0 120px;
    background-size : 100%;
    background-repeat : no-repeat;
    position: relative;
  }
  .pointer{
    width: 100%;
    height:100%;
    padding: 0;
    margin: 0;
    transition: transform 1000ms ease;
    transform: rotate(0);
    transform-origin:50% 50%;
  }
  .val{
    position: absolute;
    display:inline-block;
    left:180px;
    top:443px;
    color:#333333;
    letter-spacing:0;
    text-align:left;
  }
  .val .value{
    font-family:RobotoCondensed-Light;
    font-size:96px;
    line-height:96px;
  }
  .val .unit{
    font-family:NotoSansHans-Regular;
    font-size:42px;
    line-height:42px;
  }
</style>

<template>
  <div class="bg">
    <img class="pointer" src="../assets/instument_pointer.png"/>
    <div class="val">
      <span class="value">{{value}}</span>
      <span class="unit">{{unit}}</span>
    </div>
  </div>
</template>

<script>
  import bg_1 from '@/assets/instrument_temp.png';
  import bg_2 from '@/assets/instrument_humidity.png';
  import status_desc from '@/config/status-desc';
  import {timeout} from '@/utils';

export default {
  name: 'dashboard',
  props: {
    value : Number,
    unit : String,
    //1:温度；2:湿度
    type : Number
  },
  mounted (){
    let type = this.type;
    this.$el.style.backgroundImage = `url(${(type === 1) ? bg_1 : bg_2})`;

    // 刻度：整个表盘的弧度是13 * 20 = 260°。
    // 注意这个值表示的是指针这个<img> element的相对旋转角度，而不是坐标系的绝对角度。
    const MIN_ANGLE = -40,
      MAX_ANGLE = 220,
      //表盘刻度上每个单位对应的角度。
      ANGLE_GRID = 13;
    //不同类型不同的区间值
    let min = 0,
      max = 0,
      val = this.value,
      angle = 0;

    //从配置文件里面读到温度的区间值，再根据比例来计算出实际的旋转角度
    //TODO:温度刻度稍复杂， 两端的刻度和中间刻度比例不一致，需要区分计算
    if(type === 1){
      min = status_desc[0].temp_range[0];
      max = status_desc[2].temp_range[1];
      //需要分三个区间，-20 - 0, 0 - 40, 40 - 60]。最大可能的区间优先判断。
      if(0 < val && val < 40){
        let unit = ANGLE_GRID / (10/4);
        angle = MIN_ANGLE + (ANGLE_GRID * 2) + (val - 0) * unit;
//        console.log(unit, angle);
      }else{
        //两端
        if(val <= 0){
          angle = MIN_ANGLE + (ANGLE_GRID * 2) + (ANGLE_GRID / 10) * val;
          console.log(val, angle);
        }else{
          angle = MAX_ANGLE - (ANGLE_GRID * 2) + (val - 40) * (ANGLE_GRID / 10);
        }
      }
    }else{
      min = status_desc[0].humidity[0].range[0];
      max = status_desc[0].humidity[2].range[1];

      let ratio = (this.value - min)/(max - min);
      angle = MIN_ANGLE + (MAX_ANGLE - MIN_ANGLE) * ratio;
    }

    //指针旋转到计算的角度（timeout用来使transition生效）
    timeout(0).then(()=>{
      let pointer = this.$el.querySelector('.pointer');
      pointer.style.transform = `rotate(${angle}deg)`;
    });
  }
}
</script>

