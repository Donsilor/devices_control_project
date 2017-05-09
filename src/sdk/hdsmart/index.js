import * as System from './system';
import * as Device from './device';
import * as UI from './ui';
import * as Util from './util';


window.HdSmart = {
    ready: System.beforeReady,
    onDeviceListen: System.onDeviceListen
};
/**
 * 用于打印api的request和response，在index.debug.js中进行了重写
 * @function apiLog
 * @private
 * @param apiName
 * @param data
 * @param result
 * @example
 * window.apiLog('getSnapShot','','{data:'blablablabla'}');
 */
window.apiLog = function (apiName, data, result) {

};

/**
 * 此api用于app在webView加载完后调用，初始化HdSmart
 * @function onDeviceJsReady
 *
 */
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

/**
 * 此api供app在设备变更上报后调用，用于监听设备
 * @function onDeviceChange
 * @param {object} data 设备变更的上报数据
 */
window.onDeviceChange = function (data) {
    System.runDeviceListenCallback(data);
};
