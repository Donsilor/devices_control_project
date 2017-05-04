<template>
  <div class="ct" :style="{background : bg_color}">
    <div class="move">
      <div class="cont orig">
        <div class="cover c1" :class="'index'+bg_index+'_1'"></div>
        <div class="cover c2" :class="'index'+bg_index+'_2'"></div>
      </div>
      <div class="cont bak">
        <div class="cover c1" :class="'index'+bg_index+'_1'"></div>
        <div class="cover c2" :class="'index'+bg_index+'_2'"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .ct{
    height : 100%;
    width : 100%;
    /*background: #a7efbd;*/
    overflow: hidden;
  }
  .move{
    transition: transform 10s ease-out;
    transform : translateY(50%);
    height : 100%;
    width : 100%;
  }
  .cont{
    position: absolute;
    top : 0;left : 0;right : 0;bottom : 0;
  }
  .orig{
    animation-name:orig_first, loop;
    animation-duration:5s, 10s;
    animation-timing-function:linear, linear;
    animation-delay:0s, 5s;
    animation-iteration-count:1, infinite;
    animation-fill-mode:forwards, forwards;
    animation-direction:normal, normal;
  }
  .bak{
    animation: loop 10s linear 0s infinite forwards normal;
  }
  @keyframes orig_first {
    from { transform: translateX(0); }
    to{ transform: translateX(-100%);  }
  }
  @keyframes loop {
    from { transform: translateX(100%); }
    to{ transform: translateX(-100%);  }
  }

  .cover{
    position: absolute;
    left:0; right:0;top : 0;bottom : 0;
    transform: translateX(0);
    background-position: left bottom;
    background-repeat: no-repeat;
    background-size: contain;
  }
  /* 背景颜色集 */
  .index0-0_1{ background-image : url('../assets/wave-bg/0-0_1.png')}
  .index0-0_2{ background-image : url('../assets/wave-bg/0-0_2.png')}
  .index0-1_1{ background-image : url('../assets/wave-bg/0-1_1.png')}
  .index0-1_2{ background-image : url('../assets/wave-bg/0-1_2.png')}
  .index0-2_1{ background-image : url('../assets/wave-bg/0-2_1.png')}
  .index0-2_2{ background-image : url('../assets/wave-bg/0-2_2.png')}
  .index1-0_1{ background-image : url('../assets/wave-bg/1-0_1.png')}
  .index1-0_2{ background-image : url('../assets/wave-bg/1-0_2.png')}
  .index1-1_1{ background-image : url('../assets/wave-bg/1-1_1.png')}
  .index1-1_2{ background-image : url('../assets/wave-bg/1-1_2.png')}
  .index1-2_1{ background-image : url('../assets/wave-bg/1-2_1.png')}
  .index1-2_2{ background-image : url('../assets/wave-bg/1-2_2.png')}
  .index2-0_1{ background-image : url('../assets/wave-bg/2-0_1.png')}
  .index2-0_2{ background-image : url('../assets/wave-bg/2-0_2.png')}
  .index2-1_1{ background-image : url('../assets/wave-bg/2-1_1.png')}
  .index2-1_2{ background-image : url('../assets/wave-bg/2-1_2.png')}
  .index2-2_1{ background-image : url('../assets/wave-bg/2-2_1.png')}
  .index2-2_2{ background-image : url('../assets/wave-bg/2-2_2.png')}
</style>

<script>
  import { $timeout } from '../utils';
  export default {
    name: 'wave',
    props : {
      'bg_index' : String,
      'bg_color' : String
    },
    mounted (){
      // 从下往上升的动画
      $timeout(0).then(()=>{
        this.$el.querySelector('.move').style.transform = 'translateY(0)';
      });
    },
//    watch:{
//      bg_index (val){
//        [].forEach.call(this.$el.querySelectorAll('.c1'), el=>{
////          let c1_bg = require(`../assets/wave-bg/${val}_1.png`);
//          el.style.backgroundImage = `url(${caches[val+'_1']})`;
//        });
//        [].forEach.call(this.$el.querySelectorAll('.c2'), el=>{
//          let c2_bg = require(`../assets/wave-bg/${val}_2.png`);
//          el.style.backgroundImage = `url(${caches[val+'_2']})`;
//        });
//      }
//    }
  }
</script>


