<template>
  <div class="ct" :style="{background : bg_color}">
    <div class="move">
      <div class="cont orig">
        <div class="cover c1"></div>
        <div class="cover c2"></div>
      </div>
      <div class="cont bak">
        <div class="cover c1"></div>
        <div class="cover c2"></div>
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
    position: relative;
  }
  .move{
    transition: transform 4s linear;
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
    animation-duration:2s, 4s;
    animation-timing-function:linear, linear;
    animation-delay:0s, 2s;
    animation-iteration-count:1, infinite;
    animation-fill-mode:forwards, forwards;
    animation-direction:normal, normal;
  }
  .bak{
    animation: loop 4s linear 0s infinite forwards normal;
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
</style>

<script>
  import { timeout } from '../utils';
  export default {
    name: 'wave',
    props : {
      'bg_index' : String,
      'bg_color' : String
    },
    mounted (){
      // 从下往上升的动画
      timeout(0).then(()=>{
        this.$el.querySelector('.move').style.transform = 'translateY(0)';
      });
    },
    watch:{
      bg_index (val){
        console.log('bg_index changed:', val);
        [].forEach.call(this.$el.querySelectorAll('.c1'), el=>{
          let c1_bg = require(`../assets/wave-bg/${val}_1.png`);
          el.style.backgroundImage = `url(${c1_bg})`;
        });
        [].forEach.call(this.$el.querySelectorAll('.c2'), el=>{
          let c2_bg = require(`../assets/wave-bg/${val}_2.png`);
          el.style.backgroundImage = `url(${c2_bg})`;
        });
        console.log('bg-index changed!')
      }
    }
  }
</script>


