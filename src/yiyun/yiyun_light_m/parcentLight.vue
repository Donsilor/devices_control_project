<template>
  <div 
    id="parcent-light">
    <img 
      v-if="switch_status == 'on' &&(brightness==370||category_sub==1||category_sub==3)"
      src="../../../lib/base/yiyun_light/assets/tongdengruanguang@2x.png" 
      class="coverlight">
    <img 
      v-if="switch_status == 'on'&&brightness==240" 
      src="../../../lib/base/yiyun_light/assets/tongdengziranguang@2x.png" 
      class="coverlight">
    <img 
      v-if="switch_status == 'on'&&brightness==167" 
      src="../../../lib/base/yiyun_light/assets/tongdengbaiguang@2x.png" 
      class="coverlight">
    <img 
      v-if="switch_status == 'off'" 
      style="'clip: rect(0, 8.53333rem, 12rem, 0px)'" 
      src="../../../lib/base/yiyun_light/assets/tongdengguan@2x.png" 
      class="coverlight">
      <!-- <div 
      class="touchbox" 
      @touchstart="touchStart($event)"
      @touchmove="touchMove($event)"
      @touchend="touchEnd($event)">
      <div 
        class="touch"/> -->
  <!-- </div> -->
  </div>
</template>
<script>
export default {
  props:{
    brightness:{
      type:Number
    },
    switch_status:{
      type:String,
      default:"on"
    },
    category_sub:{
      type:Number
    }
  },
  data(){
    return {
      scale:""
    }
  },
  // watch:{
  //   switch_status(){
  //     if(switch_status=='of'){
  //       let coverlight = document.querySelectorAll(".coverlight")[0]  
  //       coverlight.style.clip = `rect(${0/37.5 +'rem'} ${320/37.5 +'rem'} ${450/37.5 +'rem'} 0)`
  //     }
  //   }
  // },
  methods: {
    touchStart(e){
      console.log(e)
    },
    touchMove(e){
      e.stopPropagation()
      e.preventDefault()
      let parcentlight = document.querySelectorAll("#parcent-light")[0]
      let touchbox = document.querySelectorAll(".touchbox")[0]  
      let coverlight = document.querySelectorAll(".coverlight")[0]  
      let h = e.targetTouches[0].pageY - parcentlight.offsetTop
      h=h<=0?0:h
      h=h>=185?185:h
      touchbox.style.top = (h + coverlight.offsetTop)/37.5 +"rem"
      coverlight.style.clip = `rect(${h /37.5 +'rem'} ${320/37.5 +'rem'} ${450/37.5 +'rem'} 0)`
      this.scale = Math.round((h/185)*100)
      this.$emit('moveLight',this.scale)
    },
    touchEnd(e){
      e.stopPropagation()
      e.preventDefault()
      // let level = parseInt(this.scale/100*254) 
      let level = parseInt((100-this.scale)/100*254) 
      console.log(level)
      this.$emit('endLight',level)
    },
    // lightRatio(e){
    //   e.stopPropagation()
    //   e.preventDefault()
    //   let touch = document.querySelectorAll(".touch")[0] 
    //   touch.style.top = e.offsetY/37.7 +"rem"
    // }
  },
}
</script>
<style lang="less">
.parcent-light{
  width: auto;
  height: auto;
}
  .coverlight{
    position:absolute;
    left: 0;
    top: 0px;
    width: 320px;
    height: 450px;
    clip:rect(0px 320px 450px 0px); 
 }
 .touchbox{
   width: 320px;
   height: 100px;
   position: absolute;
   top: 0px;
   left: 50%;
   transform: translateX(-50%);
   .touch{
      width: 60px;
      height: 14px;
      // height: 32px;
      position: absolute;
      border-top: 2px #BF954C solid;
      border-bottom: 2px #BF954C solid;
      top: 6px;
      left: 50%;
      transform: translateX(-50%);
      background-size: 100% 100%;
      background: url('../../../lib/base/hongyan_light/assets/btn_ac_on_lianggang@2x.png')
   }
 }
</style>