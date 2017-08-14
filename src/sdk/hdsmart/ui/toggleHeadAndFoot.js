import {log} from '../helper';

/**
 * 切换显示头部和底部
 * @function toggleHeadAndFoot
 * @memberOf module:UI
 * @param {boolean} isDisplayed 是否显示头部和底部
 * @example
 * HdSmart.UI.toggleHeadAndFoot(true);
 * HdSmart.UI.toggleHeadAndFoot(false);
 */
//todo 需要跟产品和ui确定是否做成配置的形式。
export default function (isDisplayed) {
    HdIot.UI.toggleHeadAndFoot({
        data: JSON.stringify({
            show_head_foot: isDisplayed
        })
    });
    log('toggleHeadAndFoot', isDisplayed, '');
};