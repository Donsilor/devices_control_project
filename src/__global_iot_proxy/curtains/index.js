import on from '../../../sdk/app';
import {apiList} from '../../../sdk/src/constant'
import * as mockData from './mock';

if (location.search.indexOf('env=desktop') != -1) {

    on(apiList.device_getsnapshot, function(data, done){
        done(mockData.generateSnapShot())
    })

    on(apiList.device_control, function(data, done){
        done({
            result: data
        })
    })

}
