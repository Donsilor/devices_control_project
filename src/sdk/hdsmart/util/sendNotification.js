import {log} from '../helper';
/**
 * 发送推送信息
 * @function sendNotification
 * @memberOf module:Util
 * @author ive.chen
 * @param {string} title  notification标题
 * @param {string} message  notification消息体
 * @example
 * HdSmart.Util.sendNotification('消息标题','消息体');
 */


//todo  app应进行设备低电量警告，设备损毁的数据解析和处理。
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