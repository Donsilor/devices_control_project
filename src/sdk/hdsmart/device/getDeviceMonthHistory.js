import {guid, getDeviceUUID, log, isFunction} from '../helper';
/**
 * 根据年月查询有日志的日子
 * @function getDeviceMonthHistory
 * @memberOf module:Device
 * @param {number} year 查询的年
 * @param {number} month 查询的月
 * @param {function} onSuccess 查询成功的回调函数
 * @param {function} onFailure 查询失败的回调函数
 * @example
 * HdSmart.Device.getDeviceMonthHistory(year,month，
 *      function(data){
 *          //data为获取历史成功由设备端返回的数据
 *      }
 * })
 */
export default function (year, month, onSuccess, onFailure) {
    let dataOptions = JSON.stringify({
        method: 'getDeviceMonthHistory',
        req_id: guid(),
        params: {
            device_uuid: getDeviceUUID(),
            year: year,
            month: month,
        }
    });
    HdIot.Device.getDeviceMonthHistory({
        data: dataOptions,
        onListener: function (data) {
            log('getDeviceMonthHistory', dataOptions, data);
            data = JSON.parse(data);
            if (data.code == 504) {
                if (isFunction(onFailure)) {
                    onFailure();
                }
            } else if (isFunction(onSuccess)) {
                onSuccess(data);
            }
        }
    })
};