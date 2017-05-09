/**
 * 调用原生的toast
 * @function toast
 * @memberOf module:UI
 * @param {object} options JsBridge通信协议要求实现
 * @param {string} options.data JsBridge通信协议要求传递数据,需要JSON格式字符串
 * @param {string} options.data.message toast显示的内容
 * @param {number} options.data.duration toast显示的时长
 * @example
 * HdIot.UI.toast({
 *      data: JSON.stringify({
 *          message:'toast message',
 *          duration: 3000
 *      })
 * })
 */

export default function (options) {
}