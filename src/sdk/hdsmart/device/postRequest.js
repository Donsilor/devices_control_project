import {guid, getDeviceUUID, log, isFunction} from '../helper';
/**
 * 获取设备的业务数据统一接口
 * @function postRequest
 * @memberOf module:Device
 * @param {string} method 要请求的业务数据的方法
 * @param {object} params 要请求的业务数据方法需要的参数
 * @param {function} onSuccess 当获取日志成功时的回调函数
 * @param {function} onFailure 当获取日志失败时的回调函数
 * @example
 * //获取设备日志
 * //使用设备：人体传感器 门窗传感器
 * HdSmart.Device.postRequest('getDeviceLog',{
 *          direction:'down',
 *          start_time: new Date(2017,5,10),
 *          page_number:1
 *      }，
 *      function(data){
 *          //data为请求数据成功后由设备端返回的数据
 *      },
 *      function(error){
 *          //
 *      }
 * })
 * @example
 * //获取时刻日志
 * //使用设备：温湿度传感器
 * HdSmart.Device.postRequest('getDeviceLogByDay',{
 *      start_date:+ new Date('2017-05-03 05:00:00')
 *  },function(data){
 *          //data为控制成功由设备端返回的数据
 * })
 * @example
 * //获取指定月份的有日志的日期
 * //使用设备：人体传感器，门窗传感器
 * HdSmart.Device.getDeviceMonthHistory(year,month，
 *      function(data){
 *          //data为获取历史成功由设备端返回的数据
 *      }
 * })
 */
export default function (method, params, onSuccess, onFailure) {
    let dataOptions = JSON.stringify(params);
    HdIot.Device.getDeviceLog({
        method: method,
        data: dataOptions,
        onListener: function (data) {
            log('postRequest_' + method, dataOptions, data);
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