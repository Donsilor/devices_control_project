/**
 * Created by lenovo on 2017/6/27.
 */
import on from '../app';
import {apiList} from '../app/constant'
import * as mockData from './mock';

if (location.search.indexOf('env=desktop') != -1) {
    on(apiList.device_getsnapshot, function(data, done){
        done(mockData.generateSnapShot())
    })

    on(apiList.device_control, function(data, done){
        done(mockData.set(data))
        setTimeout(function(){
            onDeviceChange(mockData.generateSnapShot())

            var ret = mockData.generateSnapShot()

            if(data.params.attribute.control == 'up'){
                setTimeout(function(){
                    ret.result.attribute.status = 'top'
                    onDeviceChange(ret)
                },3000)
            }
            if(data.params.attribute.control == 'down'){
                setTimeout(function(){
                    ret.result.attribute.status = 'bottom'
                    onDeviceChange(ret)
                },3000)
            }
        },1000)
    })

}
