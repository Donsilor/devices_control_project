/**
 * 获取指定月份有日志的日期
 * @function getDeviceMonthHistory
 * @memberOf module:Device
 * @deprecated
 * @param {object} options JsBridge通信协议要求实现
 * @param {string} options.data JsBridge通信协议要求传递数据,需要JSON格式字符串
 * @param {string} options.data.method='getDeviceMonthHistory' 请求名
 * @param {string} options.data.req_id 请求的id(唯一值)
 * @param {object} options.data.params 请求参数
 * @param {string} options.data.params.device_uuid 控制的设备uuid
 * @param {string} options.data.params.year 请求日志的年份
 * @param {string} options.data.params.month 请求日志的月份
 * @param {function} options.onListener JsBridge通信协议要求回调方式
 * @example
 * HdIot.Device.control({
 *      data: JSON.stringify({
 *              method:'getDeviceMonthHistory',
 *              req_id:12345
 *              params:{
 *                  device_uuid:'abc123',
 *                  year:2017,
 *                  month:12
 *              }
 *      })，
 *      onListener:function(data){
 *          //data为指定年月的有日志日期
 *      }
 * })
 */

export default function (options) {
    options.onListener(JSON.stringify({
        result: options.data
    }));
}