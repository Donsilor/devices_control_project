/**
 * 检测是否函数
 * @param fun
 * @returns {boolean}
 */
export function isFunction(fun) {
    return typeof fun === 'function'
}

/**
 * 空函数
 */

export function noop() {
}

/**
 * 获取32位请求guid
 * @returns {string}
 */

export function guid() {
    let guid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 10 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    guid = guid.replace(/^0/, '1');
    return guid;
}

/**
 * 获取设备device_uuid
 * @returns {string}
 */

export function getDeviceUUID() {
    return window.device_uuid;
}
/**
 * 打赢api日志
 * @param apiName
 * @param data
 * @param result
 */
export function log(apiName, data, result) {
    window.apiLog(apiName, data, result)
}

/**
 * 将百分比转为数字
 * @param num
 * @param max
 * @returns {*}
 */

export function covertToNumber(num, max) {
    if (typeof num == 'number') {
        return num;
    } else if (typeof num == 'string') {
        let _num = parseInt(num);
        if (num.indexOf('%') > -1) {
            return max * _num / 100;
        } else if (!isNaN(_num)) {
            return _num;
        }
    }
    return 0;
}

export const HTTP_CODE_MSG = {
    504: '请求超时'
};