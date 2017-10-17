/**
 * Created by lenovo on 2017/6/27.
 */
import on from '../../../sdk/app';
import {apiList} from '../../../sdk/src/constant'
import * as mockData from './mock';

if (location.search.indexOf('env=desktop') != -1) {
    on(apiList.device_getsnapshot, function(data, done){
        done(mockData.generateSnapShot())
    })

    on(apiList.device_control, function(data, done){
        done(mockData.set(data))
    })

}
