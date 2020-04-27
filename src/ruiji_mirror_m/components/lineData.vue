<template>
  <div id="chart"></div>
</template>

<script>
  import Echart from 'echarts'

  export default {
    name: "lineData",
    props: {
      options: {
        type: Object,
        default:function () {
          return {}
        }
      }
    },
    data() {
      return {
        mychart:null
      }
    },
    watch:{
      options: {
        handler: function (value) {
          console.log('数据更新')
          this.mychart&&this.mychart.setOption(value, true)
        },
        deep:true
      }
    },
    mounted() {
      this.mychart = Echart.init(document.getElementById('chart'));
      this.mychart.setOption(this.options)
    }
  }
</script>

<style scoped>
  #chart {
    width: 100%;
    height: 650px;
  }
</style>
