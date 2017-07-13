/**
 * 和App的数据交互处理
 * @function dispatchEvent
 * @memberOf module:Util
 * @param {object} options JsBridge通信协议要求实现
 * @param {string} options.deviceType 设备名称，如tv
 * @param {string} options.method 方法名称，如getChannelData
 * @param {object} options.params 参数
 * @param {function} callback JsBridge通信协议要求回调方式
 * @example
 * HdIot.Util.dispatchEvent({
 *      deviceType: 'tv',
 *      method: 'getChannelData',
 *      params: JSON.stringify({
 *              method:'method',
 *              req_id:12345
 *              params:{
 *                  cmd:'cmd',
 *                  device_uuid:'abc123',
 *                  attr:{
 *                      mode:'pause'
 *                  }
 *              }
 *      })
 * },callback)
 */

export default function (options, callback) {
    //callback(JSON.stringify(options));
}