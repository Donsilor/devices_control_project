/**
 * Created by lenovo on 2017/6/27.
 */
import on from '../app'
import { apiList } from '../app/constant'
import * as mockData from './mock'
if (argv_is_mock || location.search.indexOf('env=desktop') != -1) {
    window.device_name = '挂式空调'
    window.room_name = '客厅'
    window.networkStatus = -1
    window.status_bar_height = 45

    on(apiList.device_getsnapshot, function(data, done) {
        done(mockData.generateSnapShot())
    })

    on(apiList.device_control, function(data, done) {
        done(mockData.set(data))
        setTimeout(function() {
            onDeviceChange(mockData.generateSnapShot())
        }, 1000)
    })
}
