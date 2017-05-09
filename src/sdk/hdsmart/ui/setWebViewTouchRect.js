import {log, covertToNumber} from '../helper';
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
export default function (x1, y1, x2, y2) {
    var rect = document.body.getBoundingClientRect();
    x1 = covertToNumber(x1, rect.width);
    y1 = covertToNumber(y1, rect.height);
    x2 = covertToNumber(x2, rect.width);
    y2 = covertToNumber(y2, rect.height);

    let dataOptions = JSON.stringify({
        left: x1,
        right: x2,
        top: y1,
        bottom: y2
    });
    HdIot.UI.setTouchRect({
        data: dataOptions
    });
    log('setWebViewTouchRect', dataOptions, '')
};