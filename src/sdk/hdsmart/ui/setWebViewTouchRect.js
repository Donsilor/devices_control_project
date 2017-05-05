import {log, covertToNumber} from '../helper';

export default function (left, top, right, bottom) {
    var rect = document.body.getBoundingClientRect();
    left = covertToNumber(left, rect.width);
    top = covertToNumber(top, rect.height);
    right = covertToNumber(right, rect.width);
    bottom = covertToNumber(bottom, rect.height);

    let dataOptions = JSON.stringify({
        left: left,
        right: right,
        top: top,
        bottom: bottom
    });
    HdIot.UI.setTouchRect({
        data: dataOptions
    });
    log('setWebViewTouchRect', dataOptions, '')
};