
const creatSerie =function (Echart,color,name, data) {
  return {
    type: 'line',
    name:name,
    stack: '总量',
    symbol: 'circle',//折线点设置为实心点
    symbolSize: 8,   //折线点的大小
    itemStyle: {
      normal: {
        color: color,//折线点的颜色
        // lineStyle: {        // 系列级个性化折线样式
        //   width: 2,
        //   type: 'solid',
        //   color: new Echart.graphic.LinearGradient(0, 0, 1, 0, [{
        //     offset: 0,
        //     color: '#0000FF'
        //   }, {
        //     offset: 1,
        //     color: '#CD5C5C'
        //   }]),//线条渐变色
        // }
      }
    },
    areaStyle: {
      color: new Echart.graphic.LinearGradient(0, 0, 0, 1, [{
        offset: 0,
        color: color
      }, {
        offset: 1,
        color: 'rgba(28,29,40,0.6)'
      }])
    },
    data: data,
    label: {
      normal: {
        show: true,
        position: 'top'
      }
    },
  }
}
export default creatSerie
