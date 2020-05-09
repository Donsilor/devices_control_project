<template>
  <div ref="chart" id="chart"></div>
</template>

<script>
  import Echart from 'echarts'
  import eBus from '@/ruiji/ruiji_mirror_m/assets/datas/eventBus.js'

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
          console.log('数据更新', this.mychart)
          this.mychart&&this.mychart.setOption(value, true)
        },
        deep:true
      }
    },
    mounted() {
      this.mychart = Echart.init(this.$refs.chart);
      this.mychart.setOption(this.options)
      let that = this
      let timer
      eBus.$on('hideToolTip',function () {
        timer&&clearTimeout(timer)
        timer = setTimeout(function () {
          that.mychart.dispatchAction({
            type: 'hideTip'
          })
        },4000)

      })
    }
  }
</script>

<style scoped>
  #chart {
    width: 100%;
    height: 550px;
  }
</style>
