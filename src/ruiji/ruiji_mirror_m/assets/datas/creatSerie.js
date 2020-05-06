const creatSerie = function (color, name, data, lineColor) {
  return {
    type: 'line',
    name: name,
    stack: '总量',
    symbol: 'circle',//折线点设置为实心点
    symbolSize: 8,   //折线点的大小
    itemStyle: {
      normal: {
        color: color,//折线点的颜色
        lineStyle: {        // 系列级个性化折线样式
          width: 2,
          type: 'solid',
          color: lineColor || color
        }
      }
    },
    areaStyle: {
      color:
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: color // 0% 处的颜色
          }, {
            offset: 1, color: 'rgba(28,29,40,0.6)' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }
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
