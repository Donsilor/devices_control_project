import {guid, getDeviceUUID, log, isFunction} from '../helper';
/**
 * 发送设备的控制命令
 * @function control
 * @memberOf module:Device
 * @param {string} method 控制的方法名
 * @param {string} command 控制的设备名
 * @param {object} attr 变更的属性名
 * @param {function} onSuccess 变更成功的回调函数
 * @param {function} onFailure 变更失败的回调函数
 * @param {number} timeout=8000 控制超时时间
 *
 * @return {number} 返回定时器id
 * @example
 * HdSmart.Device.control('method','cmd',attr,function(data){
 *      //data为控制成功后设备返回的状态
 * },function(error){
 *      //控制失败
 * },3000);
 *
 */
export default function (method, command, attributes, onSuccess, onFailure, timeout) {
    let dataOptions = JSON.stringify({
        method: method,
        req_id: guid(),
        params: {
            device_uuid: getDeviceUUID(),
            cmd: command,
            attribute: attributes
        }
    });
    let isTimeout = false;
    let timer = setTimeout(() => {
        isTimeout = true;
        log('control', '', {result: "超时"});
        onFailure();
    }, timeout || 8000);
    HdIot.Device.control({
        data: dataOptions,
        onListener: function (data) {
            if (isTimeout) {
                return false;
            }
            clearTimeout(timer);
            data = JSON.parse(data);
            log('control', dataOptions, data);
            if (data.code == 504) {
                onFailure(data);
            } else if (isFunction(onSuccess)) {
                onSuccess()
            }
        }
    });
    return timer;
};