import {log, isFunction} from '../helper';
/**
 * 获取设备当前快照
 * @function getSnapShot
 * @memberOf module:Device
 * @param {function} onSuccess 获取快照成功的回调函数
 * @param {function} onFailure 获取快照失败的回调函数
 * @example
 * HdSmart.Device.getSnapShot(function(data,service_time){
 *      //data为获取快照成功后返回的数据
 *      //service_time 服务器时间
 * },function(error){
 *      //返回失败的原因
 * });
 */
export default function (onSuccess, onFailure) {
    HdIot.Device.getSnapShot({
        data: '',
        onListener: function (data) {
            log('getSnapShot', '', data);
            data = JSON.parse(data);
            if (data.result) {
                if (isFunction(onSuccess)) {
                    onSuccess(data.result, data.timestamp || data.result.timestamp);
                }
            } else {
                if (isFunction(onFailure)) {
                    onFailure(data);
                }
            }
        }
    });
}