import '../sdk/index';
import * as mockData from './mock';
if (window.HdIot && location.search.indexOf('env=desktop') != -1) {
    HdIot.Device.getSnapShot = function (options) {
        options.onListener(JSON.stringify(mockData.generateSnapShot()));
    };
    HdIot.Device.control = function (options) {
        setTimeout(function () {
            options.onListener(JSON.stringify({
                result: options.data
            }));
        }, 600)
    };
    // setInterval(() => {
    //     window.onDeviceChange(mockData.generateSnapShot())
    // }, 2000)
}
