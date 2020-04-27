

const currentYear = new Date().getFullYear()
export default {
  grid: {
    left: '6.5%',
    right: '6.5%',
    bottom: '3%',
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'none'
    },
    backgroundColor: 'rgba(245, 245, 245, 0.8)',
    borderWidth: 1,
    formatter:function (tipData) {
      console.log('tipData====', tipData)
      if (tipData.length>1) {
        return tipData[0].name.slice(5,16).replace('-','/')+
          `<br/>`+`${tipData[1].seriesName}:`+`${tipData[1].value}`+`<br/>`+
          `${tipData[1].seriesName}:${tipData[0].value}`
      }
      return tipData[0].name.slice(5,16).replace('-','/')+
        `<br/>`+ `${tipData[0].seriesName}:${tipData[0].value}`

    },
    padding: 10,
    textStyle: {
      color: '#fff',
      fontSize:'12px'
    },
    position: function (pos, params, el, elRect, size) {
      // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
      console.log('pos====', pos)
      console.log('size====', size)
      console.log('params====', params)
      let left = 0
      if (pos[0]>size.viewSize[0]/2) {
        left = pos[0]- 120
      }else {
        left = pos[0]
      }
      console.log('left====', left)
      return [size.viewSize[0]/2 - size.contentSize[0]/2+20, '0%'];
    },
    extraCssText: '' +
      'width: 121px;' +
      'height:57px;' +
      'background-image: linear-gradient(225deg, #1EB4F2 0%, #713DF4 100%);' +
      'line-height:20px'
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
