/**
 * Created by lenovo on 2017/6/27.
 */
import '../sdk/index';
import * as mockData from './mock';

if (window.HdIot && location.search.indexOf('env=desktop') != -1) {
    HdIot.Device.getSnapShot = function (options) {
        options.onListener(JSON.stringify(mockData.generateSnapShot()));
    };
    HdIot.Device.control = function (options) {
        setTimeout(function () {
            options.onListener(JSON.stringify(mockData.set(options)));
        }, 1000)
    };
    // setInterval(() => {
    //     window.onDeviceChange(mockData.generateSnapShot())
    // }, 500)
}
