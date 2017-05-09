/**
 * 发送推送
 * @function sendNotification
 * @memberOf module:Util
 * @param {object} options JsBridge通信协议要求实现
 * @param {string} options.data='' JsBridge通信协议要求传递数据,需要JSON格式字符串
 * @param {string} options.data.title 推送的标题
 * @param {string} options.data.message 推送的内容
 * @example
 * HdIot.Util.sendNotification({
 *      data: {
 *          title:'notification title',
 *          message:'notification message'
 *      }
 * })
 */

export default function (options) {
}