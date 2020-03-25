import on from '../app'
import {apiList} from '../app/constant'
import * as mockData from './mock'

if (argv_is_mock || location.search.indexOf('env=desktop') != -1) {
    window.room_name = '客厅'
    window.device_name = '智能筒灯'
    window.networkStatus = -1
    window.device_uuid = 545454


    on(apiList.device_getsnapshot, function(data, done){
        done(mockData.generateSnapShot())
    })

    on(apiList.device_getnetwork, function(data, done){
      done(mockData.generateNetwork())
    })
    // on(apiList.device_getviewhelp, function(data, done){
    //   done(mockData.generateViewHelp())
    // })

    on(apiList.device_control, function(data, done){
        done(mockData.set(data))
        setTimeout(function(){
            onDeviceChange(mockData.generateSnapShot())
        },1000)
    })

}
