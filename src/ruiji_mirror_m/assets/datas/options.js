

const currentYear = new Date().getFullYear()
export default {
  grid: {
    left: '6.5%',
    right: '6.5%',
    bottom: '3%',
    containLabel: true
  },
  dataZoom: [
    {
      type: 'inside',
      realtime: true,
      startValue: 1,
      endValue: 5,
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
        lineHeight: 12,
        textStyle: {
          color: 'rgba(255,255,255,0.5)',
        },
        formatter: function (value, index) {
          let arr = value.split(' ')[0].split('-')
          let str = ''
          if (currentYear+''===arr[0]) {
             str = arr[2]+ ' -- '+ arr[1]
          }else {
            str = arr[2]+ ' -- '+arr[0]+ '.' + arr[1]
          }

          return str.replace(/ /g, '\n');
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
