import on from '../app'
import { apiList } from '../app/constant'
import * as mockData from './mock'

if (argv_is_mock || location.search.indexOf('env=desktop') != -1) {
  window.device_name = '窗帘'

  on(apiList.device_getsnapshot, function(data, done) {
    done(mockData.generateSnapShot())
  })

  on(apiList.device_control, function(data, done) {
    done({ result: data })
    // 设备状态改变
    setTimeout(function() {
      onDeviceChange(data)
    }, 1000)
  })

  var percent = 0
  var dif
  var delay = 500

  setTimeout(() => {
    setInterval(() => {
      var data = mockData.generateSnapShot()
      if (percent == 0) {
        dif = 10
      } else if (percent == 100) {
        dif = -10
      }
      percent += dif
      data.result.attribute.open_percentage = percent
      // window.onDeviceChange(data)
    }, delay)
  }, 2000)
}
