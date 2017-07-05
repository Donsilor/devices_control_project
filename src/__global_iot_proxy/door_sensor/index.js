import * as mockData from './mock';
import '../sdk/index';
if (window.HdIot && location.search.indexOf('env=desktop') != -1) {
    HdIot.Device.getSnapShot = function (options) {
        setTimeout(function () {
            options.onListener(JSON.stringify(mockData.generateSnapShotData()));
        },1000)
    };

    HdIot.Device.postRequest = function (options) {
        if(options.method == 'getDeviceLog'){
            let data = JSON.parse(options.data);
            setTimeout(function () {
                options.onListener(JSON.stringify(mockData.generateDeviceLogData(data.params.start_time, data.params.items_per_page, data.params.direction)));
            },1000)
        }else if(options.method == 'getDeviceMonthHistory'){
            options.onListener(JSON.stringify(mockData.generateDeviceMonthHistoryData()));
        }
    };
}
