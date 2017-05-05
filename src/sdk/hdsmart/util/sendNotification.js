import {log} from '../helper';
export default function (title, message) {
    let dataOptions = JSON.stringify({
        title: title,
        message: message
    });
    HdIot.Util.sendNotification({
        data: dataOptions
    });
    log('sendNotification', dataOptions, '');
}