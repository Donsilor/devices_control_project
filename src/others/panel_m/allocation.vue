<template>
  <div 
    class="newpage" 
    @click="goback">
    1
  </div>
</template>

<script>
export default {
  data(){
    return {

    }
  },
  methods:{
    goback(){
      this.$emit('goBack')
    }
  }

}
</script>

<style lang="less" scoped>
@imgPath:"base/konka_tv/assets";

.newpage{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  &::before{
    content: "";
    background-image: url('~@lib/@{imgPath}/img_bg.png');
    background-repeat:no-repeat;
    background-size: 100% 100%;
    position: fixed;
    top:0;
    left: 0; 
    right: 0;
    bottom: 0;
    z-index: -1;
  }
}
</style>