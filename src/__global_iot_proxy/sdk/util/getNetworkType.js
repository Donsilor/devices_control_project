/**
 * 获取当前的网络状态
 * @function getNetworkType
 * @memberOf module:Util
 * @param {object} options JsBridge通信协议要求实现
 * @param {string} options.data='' JsBridge通信协议要求传递数据,需要JSON格式字符串
 * @param {function} options.onListener JsBridge通信协议要求回调方式，当获取成功后返回
 * @example
 * HdIot.Util.getNetworkType({
 *      data: ''，
 *      onListener:function(data){
 *          //data为获取network的返回数据
 *      }
 * })
 */

export default function (options) {
}