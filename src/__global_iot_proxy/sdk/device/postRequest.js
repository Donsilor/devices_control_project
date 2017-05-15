/**
 * 获取设备的日志
 * @function postRequest
 * @memberOf module:Device
 * @param {object} options JsBridge通信协议要求实现
 * @param {string} options.data JsBridge通信协议要求传递数据,需要JSON格式字符串
 * @param {string} options.data.method 使用的方法名
 * @param {object} options.data.params 请求参数
 * @param {function} options.onListener JsBridge通信协议要求回调方式
 * @example
 * //获取设备日志 目前使用 人体传感器 门窗传感器
 * HdIot.Device.postRequest({
 *      data: JSON.stringify({
 *              method:'getDeviceLog',
 *              params:{
 *                  device_uuid:'abc123',
 *                  page_number:1, //要请求的分页数
 *                  direction:'down', //要请求数据的方向: 'down','up'
 *                  items_per_page:8 //每页的日志数量
 *              }
 *      })，
 *      onListener:function(data){
 *          //data为获取的设备日志
 *      }
 * })
 *
 * @example
 * //获取过去24个整点时刻的日志 目前用于温湿度传感器
 * HdIot.Device.postRequest({
 *      data: JSON.stringify({
 *          method:'getDeviceLogByDay',
 *          params:{
 *              device_uuid:'abc123',
 *              start_time: + new Date('2017-5-10 05:00:00') //请求的13位时间戳(要求整点),将从这个时刻倒数24小时
 *          }
 *      })，
 *      onListener:function(data){
 *          //data为获取的日志
 *      }
 * })
 * @example
 * //获取指定月份有日志的日期  目前用于温湿度传感器
 * HdIot.Device.postRequest({
 *      data: JSON.stringify({
 *              method:'getDeviceMonthHistory',
 *              params:{
 *                  device_uuid:'abc123',
 *                  year:2017, //请求日志的年份
 *                  month:12 //请求日志的月份
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