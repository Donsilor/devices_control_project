/**
 * Created by lenovo on 2017/6/27.
 */
import on from '../app'
import { apiList } from '../app/constant'
import * as mockData from './mock'
if (argv_is_mock || location.search.indexOf('env=desktop') != -1) {
    window.device_name = '控客插座'

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
