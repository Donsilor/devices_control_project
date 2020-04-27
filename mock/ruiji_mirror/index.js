/**
 * Created by lenovo on 2017/6/27.
 */
import on from '../app'
import {apiList} from '../app/constant'
import * as mockData from './mock'

if (argv_is_mock || location.search.indexOf('env=desktop') != -1) {

    window.device_name = '锐吉魔镜'
    window.networkStatus = -1
    window.device_uuid = 41515

    on(apiList.device_getsnapshot, function(data, done){
        done(mockData.generateSnapShot())
    })
  on('get_dev_status_list', function(data, done){
    done(mockData.getRuijiData())
  })
    on(apiList.device_getnetwork, function(data, done){
      done(mockData.generateNetwork())
    })
    on(apiList.device_getviewhelp, function(data, done){
      done(mockData.generateViewHelp())
    })

    on(apiList.device_control, function(data, done){
        done(mockData.set(data))
        setTimeout(function(){
            onDeviceChange(mockData.generateSnapShot())
        },1000)
    })


}
