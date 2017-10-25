import bridge from '../bridge/app'
import {on, off, trigger} from '../event'
import {apiList} from '../constant'

window.onDeviceJsReady = function(){
    if(!bridge.isReady){
        trigger(apiList.ready)
        bridge.isReady = true
    }
}

/**
 * 当webView加载完成后，会执行此函数中的回调函数
 * @function ready
 * @memberOf module:System
 * @param {function} callback 执行的回调函数
 * @example
 * HdSmart.ready(function(){
 *      //当加载完成后会执行此处的函数
 * })
 */
export default function ready (callback) {
    if(bridge.isReady){
        callback()
    }else{
        on(apiList.ready, callback)
    }
}
