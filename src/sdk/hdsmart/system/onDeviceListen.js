import {isFunction, log} from '../helper';
let callbacks = [];
/**
 * 监听设备的上报，并执行回调函数
 * @function onDeviceListen
 * @memberOf module:System
 * @param {function} onDeviceChangeCallback 当属性变更时的回调函数
 * @example
 * // 调用多次这个函数，会按顺序执行
 * HdSmart.onDeviceListen(function(data){
 *      // data为变更的设备属性值
 *      // 当设备属性变更时会执行此函数
 * })
 */
export function onDeviceListen(onDeviceChangeCallback) {
    if (isFunction(onDeviceChangeCallback)) {
        callbacks.push(onDeviceChangeCallback);
    }
}
/**
 * 该函数为内部方法，在全局的onDeviceChange中执行
 * @private
 * @param {object} data 设备变更的统一回调执行方法
 */

export function runDeviceListenCallback(data) {
    log('onDeviceListen', '', data);
    callbacks.forEach((callback) => {
        // alert('onDeviceListen---' +  JSON.stringify(data));
        callback(data);
    });
}
