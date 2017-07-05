import * as mockData from './mock';
import '../sdk/index';

if (window.HdIot && location.search.indexOf('env=desktop') != -1) {
    HdIot.Device.getSnapShot = function (options) {
        setTimeout(()=>{
            options.onListener(JSON.stringify(mockData.generateSnapShot()))
        },100)
    }
    HdIot.Device.postRequest = function (options) {
        if(options.method == 'getDeviceLogByDay'){
            let data = JSON.parse(options.data);
            setTimeout(()=>{
                options.onListener(JSON.stringify(mockData.generateDeviceLogByDay(data.params.start_time)))
            },100)
        }else if(options.method == 'getDeviceLog'){
            let data = JSON.parse(options.data);

            setTimeout(()=>{
                options.onListener(JSON.stringify(mockData.generateDeviceLog(data.params.start_time)))
            },200)
        }
    }
}
