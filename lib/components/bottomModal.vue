<template>
    <div v-if="visibility" class="modal-box">
      <ul>
        <li v-for="(v, i) in dataList" :class="[{'text-active': v.value === 1}]">{{v.label}}</li>
        <li class="text-active" @click="cancel">取消</li>
      </ul>
    </div>
</template>

<script>
    export default {
        name: "bottomModal",
        props: {
          visibility: {
            default: true
          },
          dataList: {
            default: Array
          }
        },
        data () {
          return {

          }
        },
        methods: {
          cancel () {
            this.$parent.visibility = false
          }
        },
        watch: {
          // visibility (newValue) {
          //   if (newValue) {
          //     document.body.addEventListener('touchmove', function(e){
          //       e.preventDefault();
          //     }, { passive: false });
          //   } else {
          //     document.body.removeEventListener('touchmove')
          //   }
          // }
        }
    }
</script>

<style lang="less" scoped>
.modal-box{
  position: absolute;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.2);
  width: 100vw;
  height: 100vh;
  top: 0;
  ul{
    position: absolute;
    width: 100%;
    bottom: 0;
    margin: 20px;
    border-radius: 10px;
    background-color: #000;
    li{
      background-color: rgba(37,37,37,0.80);
      color: #fff;
      font-size: 32px;
      text-align: center;
      height: 120px;
      line-height: 120px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      &:nth-last-child(2) {
        border: 0;
      }
      &:last-child{
        border: 0;
        margin-top: 20px;
      }
    }
  }
}
.text-active{
  font-size: 16px;
  color: #E1B96E !important;
}
</style>
