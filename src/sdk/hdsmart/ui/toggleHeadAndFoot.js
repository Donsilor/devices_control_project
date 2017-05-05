import {log} from '../helper';

export default function (isShow) {
    HdIot.UI.toggleHeadAndFoot({
        data: JSON.stringify({
            show_head_foot: isShow
        })
    });
    log('toggleHeadAndFoot', isShow, '');
};