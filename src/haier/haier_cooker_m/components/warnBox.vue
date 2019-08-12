<template>
  <div 
    class="box">
    <div class="main">
      <div v-if="dryHeat">
        <div class="title">锅具出现干烧现象</div>
        <div class="content">您家中锅具出现干烧情况，请及时检查您的燃气灶。</div>
      </div>
      <div v-else>
        <div class="title">{{ leftStalling === 'on'?'燃气灶左灶意外熄火': '燃气灶右灶意外熄火' }}</div>
        <div class="content">您的燃气灶出现意外熄火现象，请及时查看您的灶具。</div>
      </div>
      <button 
        class="check" 
        type="button"
        @click="check" >查看</button>
      <div 
        class="cancel" 
        @click="cancelEvent">忽略</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    leftStalling:{
      type:String
    },
    rightStalling:{
      type:String
    },
    dryHeat:{
      default:false,
      type:Boolean
    }
    
  },
  data(){
    return{
      show: true,
    }
  },
  methods:{
    check(){
        this.$router.push({name:'list'})
    },
    cancelEvent(){
      this.$emit('stallingEvent')
      this.$emit('dryheatEvent')
    }
  }
}
</script>

<style lang="less" scoped>
  .box{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    &:nth-of-type(2)::before{
      position: absolute;
      top: 0;
      left: 0;
      content: '';
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
    }
    .main {
      width: 638px;
      height: 540px;
      position: relative;
      top: -100px;
      z-index: 999999999999;
      background: #FFFFFF;
      border: 0 solid #DDDDDD;
      border-radius: 12px;
      color: #20282B;
      padding: 88px 54px 0 48px ;
      .title{
        font-size: 40px;
      }
      .content{
        font-size: 28px;
        color: #A4A9AF;
        letter-spacing: 0;
        line-height: 40px;
        margin: 32px 0 56px 0;
      }
      .check{
        margin-top: 50px;
        outline: none;
        border: none;
        background-image: linear-gradient(-90deg, #FFD500 0%, #FFBF00 100%);
        border-radius: 71px;
        font-size: 32px;
        text-align: center;
        width: 542px;
        height: 100px;
        margin: auto;
      }
      .cancel {
        outline: none;
        border: none;
        color: #FFC700;
        background: #FFFFFF;
        border-radius: 71px;
        font-size: 32px;
        text-align: center;
        width: 542px;
        height: 100px;

        margin: auto;
        margin-top: 10px;
        line-height: 100px;
      }
    }
  }
</style>
