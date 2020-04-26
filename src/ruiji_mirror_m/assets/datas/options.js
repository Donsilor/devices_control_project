
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
          return value.replace(' ', '\n');
        },
      },
      data: ['16 1990.10', '12 1990.10', '5 1990.10', '8 1990.10', '4 1990年10月', '4 1990年10月', '9 1990年10月']
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
