import bridge from '../bridge/app'
import {on, off, trigger} from '../event'
import {apiList} from '../constant'

window.onDeviceChange = function(data){
    trigger(apiList.device_change, data)
}

/**
 * 监听设备的上报，并执行回调函数
 * @function onDeviceListen
 * @memberOf module:System
 * @param {function} callback 当属性变更时的回调函数
 * @example
 * // 调用多次这个函数，会按顺序执行
 * HdSmart.onDeviceListen(function(data){
 *      // data为变更的设备属性值
 *      // 当设备属性变更时会执行此函数
 * })
 */
export default function onDeviceListen (callback){
    on(apiList.device_change, callback)
}
