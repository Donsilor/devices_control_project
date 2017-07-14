import {log} from '../helper';
/**
 * 显示源生loading
 * @function showLoading
 * @memberOf module:UI
 * @author ive.chen
 * @example
 * HdSmart.UI.showLoading();
 */
export function showLoading() {
    log('showLoading','','');
    HdIot.UI.showLoading({
        data: ''
    });
}

/**
 * 隐藏源生loading
 * @function hideLoading
 * @memberOf module:UI
 * @example
 * HdSmart.UI.hideLoading();
 */

export function hideLoading() {
    log('hideLoading','','');
    HdIot.UI.hideLoading({
        data: ''
    });
}