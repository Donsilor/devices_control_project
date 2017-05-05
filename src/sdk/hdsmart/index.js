import * as System from './system';
import * as Device from './device';
import * as UI from './ui';
import * as Util from './util';


window.HdSmart = {
    ready: System.beforeReady,
    onDeviceListen: System.onDeviceListen
};
//打印api日志
window.apiLog = function (apiName, data, result) {

};

//app在webview ready后调用
let is_ready = false;
window.onDeviceJsReady = function () {
    if (!window.HdIot) {
        throw new Error("当前环境没有可用的api")
    }
    if (!is_ready) {
        window.HdSmart.ready = System.ready;
        window.HdSmart.Device = Device;
        window.HdSmart.UI = UI;
        window.HdSmart.Util = Util;
        is_ready = true;
    }

    System.runReadyCallbacks();
};
// app在device mqtt有数据上报后调用
window.onDeviceChange = function (data) {
    System.runDeviceListenCallback(data);
};
