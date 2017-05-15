/**
 * 获取设备的日志
 * @function getDeviceLog
 * @memberOf module:Device
 * @deprecated
 * @param {object} options JsBridge通信协议要求实现
 * @param {string} options.data JsBridge通信协议要求传递数据,需要JSON格式字符串
 * @param {string} options.data.method='getDeviceLog' 请求名
 * @param {string} options.data.req_id 请求的id(唯一值)
 * @param {object} options.data.params 请求参数
 * @param {string} options.data.params.page_number 要请求的分页数
 * @param {string} options.data.params.device_uuid 控制的设备uuid
 * @param {string} options.data.params.direction 要请求数据的方向: 'down','up'
 * @param {string} options.data.params.items_per_page=8 每页的日志数量
 * @param {function} options.onListener JsBridge通信协议要求回调方式
 * @example
 * HdIot.Device.getDeviceLog({
 *      data: JSON.stringify({
 *              method:'getDeviceLog',
 *              req_id:12345
 *              params:{
 *                  device_uuid:'abc123',
 *                  page_number:1,
 *                  direction:'down',
 *                  items_per_page:8
 *              }
 *      })，
 *      onListener:function(data){
 *          //data为获取的设备日志
 *      }
 * })
 */

export default function (options) {
    options.onListener(JSON.stringify({
        result: options.data
    }));
}