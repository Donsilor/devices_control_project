import {guid, getDeviceUUID, log, isFunction} from '../helper';
/**
 * 获取每天24个整时的日志
 * @function getDeviceLogByDay
 * @memberOf module:Device
 * @param {date} start_time 13位的时间戳(需要到整点时刻)
 * @param {function} onSuccess 当获取日志成功后的回调函数
 * @param {function} onFailure 当获取日志失败后的回调函数
 * @example
 * HdSmart.Device.getDeviceLogByDay(+ new Date('2017-05-03 05:00:00'),function(data){
 *          //data为控制成功由设备端返回的数据
 * })
 */
export default function (start_time, onSuccess, onFailure) {
    let dataOptions = JSON.stringify({
        method: 'getDeviceLogByDay',
        req_id: guid(),
        params: {
            start_time: start_time,
            device_uuid: getDeviceUUID()
        }
    });
    HdIot.Device.getDeviceLogByDay({
        data: dataOptions,
        onListener: function (data) {
            data = JSON.parse(data);
            log('getDeviceLogByDay', dataOptions, data);
            if(data.code == 504){
                if(isFunction(onFailure)){
                    onFailure
                }
            }else if (isFunction(onSuccess)) {
                onSuccess(data)
            }
        }
    })
};