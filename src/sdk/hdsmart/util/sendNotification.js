import {log} from '../helper';
/**
 *
 * @function sendNotification
 * @memberOf module:Util
 * @author ive.chen
 * @param {string} title  notification标题
 * @param {string} message  notification消息体
 * @example
 * HdSmart.Util.sendNotification('消息标题','消息体');
 */
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