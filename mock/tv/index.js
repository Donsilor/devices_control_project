import on from '../app'
import { apiList } from '../app/constant'
import * as mockData from './mock'

if (argv_is_mock || location.search.indexOf('env=desktop') != -1) {
  window.device_name = '电视'

  window.tvInitData = mockData.getInitData()

  on(apiList.util_dispatchevent, function(data, callback) {
    setTimeout(() => {
      switch (data.method) {
        case 'getChannelData':
          callback(mockData.getChannelData())
          break
        case 'searchData':
          callback(mockData.searchData())
          break
        case 'fuzzySearch':
          callback(mockData.fuzzySearch())
          break
        case 'getSearchHistory':
          callback(mockData.getSearchHistory())
          break
        case 'getDetaileData':
          callback(mockData.getDetaileData())
          break
        case 'onClickEvent':
          console.log('onClickEvent: ', data.params.eventCode)
          break
        case 'playVideo':
          console.log('playVideo', data.params)
          callback({})
          break
      }
    }, 300)
  })
}
