/**
 * 发送控制设备的命令
 * @function control
 * @memberOf module:Device
 * @param {object} options JsBridge通信协议要求实现
 * @param {string} options.data JsBridge通信协议要求传递数据,需要JSON格式字符串
 * @param {string} options.data.method 控制方式
 * @param {string} options.data.req_id 请求的id(唯一值)
 * @param {object} options.data.params 控制的参数
 * @param {string} options.data.params.cmd 控制的命令
 * @param {string} options.data.params.device_uuid 控制的设备uuid
 * @param {object} options.data.params.attr 控制的需变更设备属性
 * @param {function} options.onListener JsBridge通信协议要求回调方式
 * @example
 * HdIot.Device.control({
 *      data: JSON.stringify({
 *              method:'method',
 *              req_id:12345
 *              params:{
 *                  cmd:'cmd',
 *                  device_uuid:'abc123',
 *                  attr:{
 *                      mode:'pause'
 *                  }
 *              }
 *      })，
 *      onListener:function(data){
 *          //data为控制成功由设备端返回的数据
 *      }
 * })
 */

export default function (options) {
    options.onListener(JSON.stringify({
        result:options.data
    }));
}