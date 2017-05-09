/**
 * 调用源生的弹出窗口
 * @function alert
 * @memberOf module:UI
 * @param {object} options JsBridge通信协议要求实现
 * @param {string} options.data JsBridge通信协议要求传递数据,需要JSON格式字符串
 * @param {string} options.data.title 弹窗的标题
 * @param {string} options.data.message 弹窗的内容
 * @param {string} options.data.okText 弹窗的'确定'按钮文本
 * @param {string} options.data.cancelText 弹窗的'取消'按钮'文本
 * @param {function} options.onListener JsBridge通信协议要求回调方式，当点击了确定按钮以后，触发此回调
 * @example
 * HdIot.UI.alert({
 *      data: JSON.stringify({
 *          title:'alert title',
 *          message:'alert message',
 *          okText:'确定',
 *          cancelText:'取消'
 *      })，
 *      onListener:function(){
 *          //当点击了确定以后执行的回调函数
 *      }
 * })
 */

export default function (options) {
    options.onListener(JSON.stringify({
        result:options.data
    }));
}