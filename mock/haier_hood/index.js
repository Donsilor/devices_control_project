import on from '../app'
import {apiList} from '../app/constant'
import * as mockData from './mock'

if (location.search.indexOf('env=desktop') != -1) {

    window.device_name = '抽油烟机'

    on(apiList.device_getsnapshot, function(data, done){
        done(mockData.generateSnapShot())
    })

    on(apiList.device_control, function(data, done){
        done(mockData.set(data))
        setTimeout(function(){
            onDeviceChange(mockData.generateSnapShot())
        },1000)
    })

}
