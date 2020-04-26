
export default {
  grid: {
    left: '3%',
    right: '3%',
    bottom: '3%',
    containLabel: true
  },
  dataZoom: [
    {
      type: 'inside',
      realtime: true,
      startValue: 0,
      endValue: 4,
      filterMode: 'none',
      minValueSpan:3,
      maxValueSpan:100,
      // zoomLock: true
    }],
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      axisLabel: {
        show: true,
        lineHeight: 20,
        textStyle: {
          color: 'rgba(255,255,255,0.5)',
        },
        formatter: function (value, index) {
          console.log('formatter====',value)
          let arr = value.split(' ')[0].split('-')
          let str = arr[2]+ '-'+ arr[1]
          return str.replace(/-/g, '\n');
        },
      },
      data: []
    }
  ],
  yAxis: [
    {
      type: 'value',
      show: false,
      axisLabel: {
        show: false
      }
    }
  ],
  series: []
}
