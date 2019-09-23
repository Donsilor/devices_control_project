<template>
  <div id="parcent-light">
    <img 
      v-if="brightness==370"
      :style="lightType" 
      src="../../../lib/base/hongyan_light/assets/btn_ac_mode_e@2x.png" 
      class="coverlight">
    <img 
      v-if="brightness==240"
      :style="lightType" 
      src="../../../lib/base/hongyan_light/assets/btn_ac_mode_a@2x.png" 
      class="coverlight">
    <img 
      v-if="brightness==167"
      :style="lightType" 
      src="../../../lib/base/hongyan_light/assets/btn_ac_mode_t@2x.png" 
      class="coverlight">
    <div 
      class="touch"
      @touchstart="touchStart($event)"
      @touchmove="touchMove($event)"
      @touchend="touchEnd($event)"/>
  </div>
</template>
<script>
export default {
  props: {
    brightness:{
      type:Number
    }
  },
  data(){
    return {
    }
  },
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
    lightType(){
     return console.log('0')
    }
  },
  mounted(){
    this.$nextTick(()=>{
        setTimeout(()=>{
            this.clipwidth = {
            "width":"100%"
            }
        },300)   
    })   
  },
  methods: {
     touchStart(e) {
        e.stopPropagation()
        e.preventDefault()
      },
      touchMove(e) {
        e.stopPropagation()
        e.preventDefault()
        
      },
      touchEnd(e) {
        e.stopPropagation() //阻止冒泡
        e.preventDefault() //阻止默认行为
    
      },
  },
}
</script>
<style lang="less">
  .coverlight{
    position:absolute;
    left: 0;
    top: 0px;
    width: 320px;
    height: 450px;
    clip:rect(80px 320px 450px 0px); 
 }
 .touch{
       width: 74px;
       height: 16px;
       position: absolute;
       top: 90px;
       left: 50%;
       transform: translateX(-50%);
       background-size: 100% 100%;
       background: url('../../../lib/base/hongyan_light/assets/btn_ac_on_lianggang@2x.png')
    }
</style>