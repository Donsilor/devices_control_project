/**
 * 设置允许前端设置touch事件的区域
 * @function setTouchRect
 * @memberOf module:UI
 * @param {object} options JsBridge通信协议要求实现
 * @param {string} options.data JsBridge通信协议要求传递数据,需要JSON格式字符串
 * @param {number} options.data.left 区域的左上角x坐标
 * @param {number} options.data.top 区域的左上角y坐标
 * @param {number} options.data.right 区域的右下角x坐标
 * @param {number} options.data.bottom 区域的右下角y坐标
 * @example
 * HdIot.Device.control({
 *      data: JSON.stringify({
 *          left:0,
 *          top:0,
 *          right:500,
 *          bottom:500
 *      })
 * })
 */

export default function (options) {
}