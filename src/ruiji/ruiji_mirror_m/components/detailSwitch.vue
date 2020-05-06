<template>
  <div class="item-container" @click="itemClick" :class="{active:isActive}">
    <img :src="currentImg" alt="">
    <span>{{text}}</span>
  </div>
</template>

<script>
  import tizhongimg1 from '@/ruiji/ruiji_mirror_m/assets/imgs/btn_ac_tizhong@3x.png'
  import tizhongimg2 from '@/ruiji/ruiji_mirror_m/assets/imgs/btn_ac_tizhong2@3x.png'
  import tizhiimg1 from '@/ruiji/ruiji_mirror_m/assets/imgs/btn_ac_tizhi2@3x.png'
  import tizhiimg2 from '@/ruiji/ruiji_mirror_m/assets/imgs/btn_ac_tizhi@3x.png'
  import gugejiimg1 from '@/ruiji/ruiji_mirror_m/assets/imgs/btn_ac_gugeji2@3x.png'
  import gugejiimg2 from '@/ruiji/ruiji_mirror_m/assets/imgs/btn_ac_gugeji@3x.png'
  import xuyajiimg1 from '@/ruiji/ruiji_mirror_m/assets/imgs/btn_ac_xuyaji@3x.png'
  import xuyajiimg2 from '@/ruiji/ruiji_mirror_m/assets/imgs/btn_ac_xuyaji2@3x.png'
  import xinlvimg1 from '@/ruiji/ruiji_mirror_m/assets/imgs/btn_ac_xinlv2@3x.png'
  import xinlvimg2 from '@/ruiji/ruiji_mirror_m/assets/imgs/btn_ac_xinlv@3x.png'
  export default {
    name: "detailSwitch",
    data(){
      return{
        text:'体重'
      }
    },
    props:{
      type:{
        type:[String,Number],
        default:0
      },
      isActive:{
        type:Boolean,
        default:false
      }
    },
    computed:{
      currentImg(){
        if (this.type===0)  {
          return this.isActive?tizhongimg1:tizhongimg2
        }else if (this.type===1) {
          return this.isActive?tizhiimg1:tizhiimg2
        }else if (this.type===2) {
          return this.isActive?gugejiimg1:gugejiimg2
        }else if (this.type===3) {
          return this.isActive?xuyajiimg1:xuyajiimg2
        }else if (this.type===4) {
          return this.isActive?xinlvimg1:xinlvimg2
        }
      },

    },
    watch:{
      type:{
        handler(value){
          switch(value) {
            case 0:
              this.text = '体重'
              break;
            case 1:
              this.text = '体脂'
              break;
            case 2:
              this.text = '骨骼肌'
              break;
            case 3:
              this.text = '血压'
              break;
            case 4:
              this.text = '心率'
              break;
            default:
              this.text = '体重'
          }
        },
        immediate:true
      }
    },
    methods:{
      itemClick(){
       this.$emit('itemClick', this.type)
      }
    }

  }
</script>

<style lang="less" scoped>
  .item-container {
    display: inline-block;
    width: auto;
    height: 100%;
    font-size: 24px;
    color: rgba(255,255,255,0.5);
    img{
      width:24px;
      vertical-align: middle;
    }
  }
  .active {
    span {
      background-image: linear-gradient(to right,#713DF4,#1EB4F2);
      -webkit-background-clip:text;
      color: transparent;
    }
  }
</style>
