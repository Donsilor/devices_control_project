import {guid, getDeviceUUID, log, isFunction} from '../helper';
/**
 * 获取设备的日志
 * @function getDeviceLog
 * @memberOf module:Device
 * @param {object} data 要发送的日志查询条件
 * @param {date} data.start_time 13位的时间戳
 * @param {number} [data.items_per_page=8] 每页加载的日志数量
 * @param {direction} data.direction 日志查询的方向:'down','up'
 * @param {function} onSuccess 当获取日志成功时的回调函数
 * @param {function} onFailure 当获取日志失败时的回调函数
 * @example
 * HdSmart.Device.getDeviceLog({
 *          start_time: new Date(2017,4,1),
 *          //items_per_page:8，
 *          direction:'down'
 *      }，
 *      function(data){
 *          //data为获取历史成功由设备端返回的数据
 *      }
 * })
 */
export default function (data, onSuccess, onFailure) {
    let dataOptions = JSON.stringify({
        method: 'getDeviceLog',
        req_id: guid(),
        params: {
            device_uuid: getDeviceUUID(),
            start_time: data.start_time,
            items_per_page: typeof data.items_per_page === 'number' ? data.items_per_page : 8,
            direction: data.direction
        }
    });
    HdIot.Device.getDeviceLog({
        data: dataOptions,
        onListener: function (data) {
            log('getDeviceLog', dataOptions, data);
            data = JSON.parse(data);
            if (data.code == 504) {
                if (isFunction(onFailure)) {
                    onFailure(data)
                }
            } else if (data.result) {
                if (isFunction(onSuccess)) {
                    onSuccess(data.result)
                }
            }
        }
    });
};