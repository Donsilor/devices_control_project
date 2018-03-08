/**
 * Created by lenovo on 2017/6/27.
 */
import on from '../app';
import {apiList} from '../app/constant'
import * as mockData from './mock';

if (location.search.indexOf('env=desktop') != -1) {

    on(apiList.device_control, function(data, callback){

        setTimeout(()=>{
            switch(data.method) {
                case '3d_get_moji_weather':
                    callback(mockData.generateSnapShot())
                    break;
                default:
                    break;
            }
        },300)
    })

}
