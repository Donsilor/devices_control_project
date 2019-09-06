<template>
  <div
    v-show="show" 
    class="cover">
    <div 
      class="weekbox">
      <h3>重复</h3>
      <ul>
        <li>周日</li>
        <li>周一</li>
        <li>周二</li>
        <li>周三</li>
        <li>周四</li>
        <li>周五</li>
        <li>周六</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      show:false
    }
  }
}
</script>

<style lang="less" scoped>
.cover{
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

    &:before{
      position: absolute;
      top: 0;
      left: 0;
      content: '';
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
    }
}
  .weekbox {
    width: 100%;
    height: 1168px;
    background-color: #fff;
    border-radius: 24px 24px 0 0;
    z-index: 9999999;
    position: absolute;
    bottom: 0;
  }
</style>