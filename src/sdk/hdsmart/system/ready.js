import {isFunction, log} from '../helper';
let callbacks = [];
/**
 * 当webView加载完成后，会执行此函数中的回调函数
 * @function ready
 * @memberOf module:System
 * @param {function} onReadyCallback 执行的回调函数
 * @example
 * HdSmart.ready(function(){
 *      //当加载完成后会执行此处的函数
 * })
 */
export function ready(onReadyCallback) {
    if (isFunction(onReadyCallback)) {
        onReadyCallback();
    }
}
/**
 * 当webView加载完成后，会执行此函数中的回调函数
 * @function beforeReady
 * @memberOf module:System
 * @private
 * @param {function} onReadyCallback 执行的回调函数
 * @example
 * HdSmart.ready(function(){
 *      //当加载完成后会执行此处的函数
 * })
 */

export function beforeReady(onReadyCallback) {
    if (isFunction(onReadyCallback)) {
        callbacks.push(onReadyCallback);
    }
}

export function runReadyCallbacks() {
    log('ready','','');
    callbacks.forEach((callback) => {
        callback();
    });
    callbacks = [];
}