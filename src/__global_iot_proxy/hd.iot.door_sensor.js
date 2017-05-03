import * as mockData from './hd.iot.door_sensor.mock';

import './hd.iot.sdk';

if (window.HdIot) {
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
    // setInterval(function () {
        // window.onDeviceChange(mockData.generateDeviceChangeData(store.state.ptr_up_time));
    // }, 2000)
}
