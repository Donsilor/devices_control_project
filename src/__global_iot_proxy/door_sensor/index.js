import * as mockData from './mock';
import '../sdk/index';
if (window.HdIot && location.search.indexOf('env=desktop') != -1) {
    HdIot.Device.getSnapShot = function (options) {
        options.onListener(JSON.stringify(mockData.generateSnapShotData()));
    };
    HdIot.Device.getDeviceLog = function (options) {
        let data = JSON.parse(options.data);
        options.onListener(JSON.stringify(mockData.generateDeviceLogData(data.params.start_time, data.params.items_per_page, data.params.direction)));
    };
    HdIot.Device.getDeviceMonthHistory = function (options) {
        options.onListener(JSON.stringify(mockData.generateDeviceMonthHistoryData()));
    }
}
