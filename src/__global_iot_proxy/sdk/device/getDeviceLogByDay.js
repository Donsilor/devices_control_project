/**
 * 获取过去24个整点时刻的日志
 * @function getDeviceLogByDay
 * @memberOf module:Device
 * @param {object} options JsBridge通信协议要求实现
 * @param {string} options.data JsBridge通信协议要求传递数据,需要JSON格式字符串
 * @param {string} options.data.method='getDeviceLogByDay' 请求名
 * @param {string} options.data.req_id 请求的id(唯一值)
 * @param {object} options.data.params 请求参数
 * @param {string} options.data.params.device_uuid 请求的设备uuid
 * @param {string} options.data.params.start_time 请求的13位时间戳(要求整点),将从这个时刻倒数24小时
 * @param {function} options.onListener JsBridge通信协议要求回调方式
 * @example
 * HdIot.Device.getDeviceLogByDay({
 *      data: JSON.stringify({
 *          method:'getDeviceLogByDay',
 *          req_id:123456,
 *          params:{
 *              device_uuid:'abc123',
 *              start_time: + new Date('2017-5-10 05:00:00')
 *          }
 *      })，
 *      onListener:function(data){
 *          //data为获取的日志
 *      }
 * })
 */

export default function (options) {
    options.onListener(JSON.stringify({
        result:options.data
    }));
}