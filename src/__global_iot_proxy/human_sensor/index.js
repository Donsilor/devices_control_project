import * as mockData from './mock';
import '../sdk/index';
if (window.HdIot && location.search.indexOf('env=desktop') != -1) {
    HdIot.Device.getSnapShot = function (options) {
        setTimeout(function () {
            options.onListener(JSON.stringify(mockData.generateSnapShotData()));
        },1000)
    };
    HdIot.Device.getDeviceLog = function (options) {
        let data = JSON.parse(options.data);
        setTimeout(function () {
            options.onListener(JSON.stringify(mockData.generateDeviceLogData(data.params.start_time, data.params.items_per_page, data.params.direction)));
        },1000)
    };
    HdIot.Device.getDeviceMonthHistory = function (options) {
        options.onListener(JSON.stringify(mockData.generateDeviceMonthHistoryData()));
    }
}
