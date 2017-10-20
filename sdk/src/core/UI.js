import bridge from '../bridge/app'
import {covertToNumber} from '../helper'
import {apiList, tipMsg} from '../constant'

export default {
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
    alert(title, message, onSuccess, okText = '确定', cancelText = '取消') {
        bridge.send(apiList.ui_alert, {title, message, okText, cancelText}, onSuccess)
    },
    /**
     * 显示源生loading
     * @function showLoading
     * @memberOf module:UI
     * @author ive.chen
     * @example
     * HdSmart.UI.showLoading();
     */
    showLoading() {
        bridge.send(apiList.ui_showloading)
    },
    /**
     * 隐藏源生loading
     * @function hideLoading
     * @memberOf module:UI
     * @example
     * HdSmart.UI.hideLoading();
     */
    hideLoading() {
        bridge.send(apiList.ui_hideloading)
    },
    /**
     * 允许webView 点击使用js来进行touch事件的区域
     * @function setWebViewTouchRect
     * @memberOf module:UI
     * @param {number | percentage} x1 区域左上角的坐标x轴
     * @param {number | percentage} y1 区域左上角的坐标y轴
     * @param {number | percentage} x2 区域右下角的坐标x轴
     * @param {number | percentage} y2 区域右下角的坐标y轴
     * @example
     * //当值为数字是单位为px
     * HdSmart.UI.setWebViewTouchRect(0,0,50,50);
     * //当值为百分比时，会根据屏幕的宽高和百分比值转为实际像素
     * HdSmart.UI.setWebViewTouchRect(0,0.'50%','50%')
     */
    setWebViewTouchRect (left, top, right, bottom){
        var rect = document.body.getBoundingClientRect()
        left = covertToNumber(left, rect.width)
        top = covertToNumber(top, rect.height)
        right = covertToNumber(right, rect.width)
        bottom = covertToNumber(bottom, rect.height)

        const dataOptions = {
            left,
            right,
            top,
            bottom,
        }
        bridge.send(apiList.ui_settouchrect, dataOptions)
    },
    /**
     * 调用原生toast
     * @function toast
     * @memberOf module:UI
     * @param {string} message toast的文本
     * @param {string} [duration=3000] 显示的时长
     * @example
     * HdSmart.UI.toast('我要显示toast信息')
     */
    toast (message, duration = 3000){
        bridge.send(apiList.ui_toast, {message, duration})
    },
    /**
     * 切换显示头部和底部
     * @function toggleHeadAndFoot
     * @memberOf module:UI
     * @param {boolean} isDisplayed 是否显示头部和底部
     * @example
     * HdSmart.UI.toggleHeadAndFoot(true);
     * HdSmart.UI.toggleHeadAndFoot(false);
     */
    toggleHeadAndFoot (visible){
        bridge.send(apiList.ui_toggleheadandfoot, {show_head_foot: visible})
    },
}
