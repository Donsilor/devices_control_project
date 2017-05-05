import {isFunction} from '../helper';

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
            if(isFunction){
                onSuccess()
            }
        }
    });
};