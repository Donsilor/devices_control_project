import {log} from '../helper';
/**
 * 调用原生toast
 * @function toast
 * @memberOf module:UI
 * @param {string} message toast的文本
 * @param {string} [duration=3000] 显示的时长
 * @example
 * HdSmart.UI.toast('我要显示toast信息')
 */

export default function (message, duration) {
    duration = duration || 3000;
    let dataOptions = JSON.stringify({
        data: {
            message: message,
            duration: duration
        }
    });
    HdIot.UI.toast(dataOptions);
    log('toast', dataOptions, '');
};