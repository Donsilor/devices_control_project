/**
 * 刷新当前webView
 * @function reload
 * @memberOf module:Util
 * @author ive.chen
 * @example
 * HdSmart.Util.reload();
 */
//todo 防止location.reload刷新页面，没有断开webView的mqtt监听导致onDeviceListen获取了n份重复数据。
export default function () {
    HdIot.Util.reload({
        data: ''
    });
};