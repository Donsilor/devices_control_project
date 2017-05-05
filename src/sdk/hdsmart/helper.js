export function isFunction(fun) {
    return typeof fun === 'function'
}

export function noop() {
}

export function guid() {
    let guid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 10 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    guid = guid.replace(/^0/, '1');
    return guid;
}

export function getDeviceUUID() {
    return window.device_uuid;
}

export function log(apiName, data, result) {
    window.apiLog(apiName, data, result)
}

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