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
 * @example
 * HdSmart.Device.control('method','cmd',attr,function(data){
 *      //data为控制成功后设备返回的状态
 * },function(error){
 *      //控制失败
 * });
 *
 */
export default function (method, command, attr, onSuccess, onFailure) {
    let dataOptions = JSON.stringify({
        method: method,
        req_id: guid(),
        params: {
            device_uuid: getDeviceUUID(),
            cmd: command,
            attr: attr
        }
    });
    HdIot.Device.control({
        data: dataOptions,
        onListener: function (data) {
            data = JSON.parse(data);
            log('control', dataOptions, data);
            if (data.code == 504) {
                onFailure(data);
            } else if (isFunction(onSuccess)) {
                onSuccess()
            }
        }
    });
};