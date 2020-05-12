<template>
  <div class="container" @click="switchClick" :class="{active:isActive}">
    <img class="img" :src="currentImg">
    <div class="text">{{type===0?'血压计':'体脂秤'}}</div>
  </div>
</template>

<script>
  import img1 from '@/ruiji/ruiji_mirror_m/assets/imgs/btn_ac_xuyaji@3x.png'
  import img2 from '@/ruiji/ruiji_mirror_m/assets/imgs/btn_ac_xuyaji2@3x.png'
  import img3 from '@/ruiji/ruiji_mirror_m/assets/imgs/btn_ac_tizhicheng2@3x.png'
  import img4 from '@/ruiji/ruiji_mirror_m/assets/imgs/btn_ac_tizhicheng@3x.png'

  export default {
    name: "typeSwitch",
    props:{
      type:{
        type: Number,
        default:0
      },
      isActive:{
        type:Boolean,
        default: true
      }
    },
    data() {
      return {
        localIsActive: this.isActive
      };
    },
    computed:{
      currentImg(){
        if (this.type===0)  {
          return this.isActive?img1:img2
        }else {
          return this.isActive?img3:img4
        }
      }
    },
    methods:{
      switchClick(){
        if (this.type===0) {
          HdSmart.UI.toast('敬请期待')
        }
        this.$emit('update:currentIndex', this.type)
      }
    }
  }
</script>

<style lang="less" scoped>
.container{
  display: flex;
  /*flex-grow: 1;*/
  width: 50%;
  height: 128px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  background-color: black;
  color: rgba(255,255,255,0.5);
  img{
    width: 60px;
  }
}
.active{
  background-color: #19191C;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  .text{
    background-image: linear-gradient(to right,#713DF4,#1EB4F2);
    -webkit-background-clip:text;
    color: transparent;
  }
}
</style>
