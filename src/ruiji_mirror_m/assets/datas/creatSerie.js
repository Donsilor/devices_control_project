
const creatSerie =function (Echart,color, data) {
  return {
    type: 'line',
    stack: '总量',
    symbol: 'circle',//折线点设置为实心点
    symbolSize: 8,   //折线点的大小
    itemStyle: {
      normal: {
        color: color,//折线点的颜色
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
