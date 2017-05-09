/**
 * 获取设备快照
 * @function getSnapShot
 * @memberOf module:Device
 * @param {object} options JsBridge通信协议要求实现
 * @param {string} options.data='' JsBridge通信协议要求传递数据,需要JSON格式字符串
 * @param {function} options.onListener JsBridge通信协议要求回调方式
 * @example
 * HdIot.Device.getSnapShot({
 *      data:'',
 *      onListener:function(data){
 *          //data为获取快照成功后，由http返回的设备相关状态数据
 *      }
 * })
 */

export default function (options) {
    options.onListener(JSON.stringify({
        result:options.data
    }));
}