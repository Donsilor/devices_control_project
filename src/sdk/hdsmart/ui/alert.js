import {isFunction} from '../helper';
//todo 相当于js的confirm  可能还需要alert 和 prompt
/**
 * 调用源生弹出框
 * @function alert
 * @memberOf module:UI
 * @author ive.chen
 * @param {string} title  弹出框的标题
 * @param {string} message  弹出框的消息
 * @param {function} onSuccess  弹出框的点击'确定'按钮的回调函数
 * @param {string} [okText=确定]  弹出框'确定'按钮的文本
 * @param {string} [cancelText=取消]  弹出框'取消'按钮的文本
 * @example
 * HdSmart.UI.alert(title,message,function(){
 *      //点击确定的执行函数
 * },'确定','取消');
 */
export default function (title, message, onSuccess, okText, cancelText) {
    okText = okText || '确定';
    cancelText = cancelText || '取消';
    HdIot.UI.alert({
        data: JSON.stringify({
            title: title,
            message: message,
            okText: okText,
            cancelText: cancelText
        }),
        onListener: function () {
            if(isFunction(onSuccess)){
                onSuccess()
            }
        }
    });
};