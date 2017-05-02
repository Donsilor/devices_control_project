import * as mockData from './hd.iot.window.mock';
if (location.search.indexOf('env=desktop') != -1) {
    window.HdIot = {
        Device: {
            control: function (options) {
                setTimeout(function () {
                    options.onListener(options.data)
                }, 2000)
            },
            getSnapShot: function (options) {
                options.onListener(JSON.stringify(mockData.generateSnapShotData()));
            },
            getDeviceLog: function (options) {
                let data = JSON.parse(options.data);
                options.onListener(JSON.stringify(mockData.generateDeviceLogData(data.params.start_time, data.params.items_per_page, data.params.direction)));
            },
            getDeviceMonthHistory (options){
                options.onListener(JSON.stringify(mockData.generateDeviceMonthHistoryData()));
            }
        },
        UI: {
            alert: function (options) {
                options.onListener();
            },
            toast: function () {

            },
            showLoading: function () {

            },
            hideLoading: function () {

            }
        },
        Util: {
            getNetworkType: function (onSuccess) {
                onSuccess('wifi')
            },
            reload: function () {

            },
            post: function (options) {
                options.onListener(options.data)
            },
            sendNotification: function (options) {

            }
        }
    };
    window.device_uuid = 'abc123';
    window.onDeviceJsReady();
}
