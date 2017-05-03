(function (window, undefined) {
    if (window.HdSmart) {
        return false;
    }
    function isFunction(fun) {
        return typeof fun === 'function'
    }

    function noop() {

    }

    function getDeviceUUID() {
        return window.device_uuid;
    }

    if (!window.apiLog) {
        window.apiLog = function (apiName, params, result) {
        };
    }

    function guid() {
        var guid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 10 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        guid = guid.replace(/^0/, '1');
        return guid;
    }

    var HdSmart = {};


    HdSmart.Device = {};

    /**
     * @method HdSmart.Device.control
     * @param method
     * @param command
     * @param attr
     * @param onSuccess
     * @param onFailure
     */
    HdSmart.Device.control = function (method, command, attr, onSuccess, onFailure) {
        var dataOptions = JSON.stringify({
            method: method,
            req_id: guid(),
            params: {
                device_uuid: getDeviceUUID(),
                cmd: command,
                attr: attr
            }
        });
        HdIot.Device.control({
            data: dataOptions,
            onListener: function (data) {
                window.apiLog('control', dataOptions, data);
                onSuccess(data)
            }
        });
    };

    /**
     * @method HdSmart.Device.getDeviceLog
     * @param data
     * @param data.start_time required
     * @param data.items_per_page optional
     * @param data.direction required
     * @param onSuccess
     */

    HdSmart.Device.getDeviceLog = function (data, onSuccess) {
        var dataOptions = JSON.stringify({
            method: 'getDeviceLog',
            req_id: guid(),
            params: {
                device_uuid: getDeviceUUID(),
                start_time: data.start_time,
                items_per_page: typeof data.items_per_page === 'number' ? data.items_per_page : 8,
                direction: data.direction
            }
        });
        HdIot.Device.getDeviceLog({
            data: dataOptions,
            onListener: function (data) {
                window.apiLog('getDeviceLog', dataOptions, data)
                data = JSON.parse(data);
                if (isFunction(onSuccess)) {
                    onSuccess(data.result)
                }
            }
        });
    };

    HdSmart.Device.getDeviceLogByDay = function (start_time, onSuccess) {
        var dataOptions = JSON.stringify({
            method: 'getDeviceLogByDay',
            req_id: guid(),
            params: {
                start_time: start_time,
                device_uuid: getDeviceUUID()
            }
        });
        HdIot.Device.getDeviceLogByDay({
            data: dataOptions,
            onListener: function (data) {
                window.apiLog('getDeviceLogByDay', dataOptions, data);
                if (isFunction(onSuccess)) {
                    onSuccess(data)
                }
            }
        })
    };


    HdSmart.Device.getDeviceMonthHistory = function (year, month, onSuccess) {
        var dataOptions = JSON.stringify({
            method: 'getDeviceMonthHistory',
            req_id: guid(),
            params: {
                device_uuid: getDeviceUUID(),
                year: year,
                month: month,
                // start_time: parseInt(new Date(year, month - 1) / 1000)
            }
        })
        HdIot.Device.getDeviceMonthHistory({
            data: dataOptions,
            onListener: function (data) {
                window.apiLog('getDeviceMonthHistory', dataOptions, data);
                data = JSON.parse(data);
                if (isFunction(onSuccess)) {
                    onSuccess(data);
                }
            }
        })
    };

    /**
     * @method HdSmart.Device.getSnapShot
     * @param onSuccess
     * @param onFailure
     */
    HdSmart.Device.getSnapShot = function (onSuccess, onFailure) {
        HdIot.Device.getSnapShot({
            data: '',
            onListener: function (data) {
                window.apiLog('getSnapShot', '', data);
                data = JSON.parse(data);
                if (data.result) {
                    onSuccess(data.result, data.timestamp || data.result.timestamp);
                } else {
                    onFailure(data);
                }
            }
        });
    };

    HdSmart.UI = {};
    /**
     * @method HdSmart.UI.alert
     * @param title
     * @param message
     * @param onSuccess
     * @param okText
     * @param cancelText
     */
    HdSmart.UI.alert = function (title, message, onSuccess, okText, cancelText) {
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
                onSuccess()
            }
        });
    };

    /**
     * @method HdSmart.UI.toast
     * @param message
     * @param delay
     */
    HdSmart.UI.toast = function (message, delay) {
        delay = delay || 3000;
        HdIot.UI.toast(message, delay);
    };
    /**
     * @method HdSmart.UI.showLoading
     */
    HdSmart.UI.showLoading = function () {
        HdIot.UI.showLoading({
            data: ''
        });
    };

    /**
     * @method HdSmart.UI.hideLoading
     */
    HdSmart.UI.hideLoading = function () {
        HdIot.UI.hideLoading({
            data: ''
        });
    };

    function covertToNumber(num, max) {
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
        return 0
    };

    HdSmart.UI.setWebViewTouchRect = function (left, top, right, bottom) {
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
        window.apiLog('setWebViewTouchRect', dataOptions, '')
    };

    HdSmart.Util = {};

    /**
     * @method HdSmart.Util.getNetworkType
     * @param onSuccess
     */
    HdSmart.Util.getNetworkType = function (onSuccess) {
        HdIot.Util.getNetworkType({
            data: '',
            onListener (data){
                window.apiLog('getNetworkType', '', data);
                onSuccess(data);
            }
        });
    };

    /**
     * @method HdSmart.Util.reload
     */
    HdSmart.Util.reload = function () {
        HdIot.Util.reload();
    };

    /**
     * @method HdSmart.Util.post
     * @param url
     * @param data
     * @param onSuccess
     * @param onFailure
     */
    HdSmart.Util.post = function (url, data, onSuccess, onFailure) {
        HdIot.Util.post({
            data: JSON.stringify({
                url: url,
                data: data
            }),
            onListener: function (data) {
                onSuccess(data)
            }
        })
    };

    HdSmart.Util.sendNotification = function (title, message) {
        HdIot.Util.sendNotification({
            data: JSON.stringify({
                title: title,
                message: message
            })
        });
    };

    /**
     * @method HdSmart.UI.toggleHeadAndFoot
     * @param isShow { Boolean }
     */
    HdSmart.UI.toggleHeadAndFoot = function (isShow) {
        HdIot.UI.toggleHeadAndFoot({
            data: JSON.stringify({
                show_head_foot: isShow
            })
        });
    }
    /**
     * 设备控制页加载资源完成后调用
     * @method HdSmart.ready
     * @type {Window.onDeviceJsReady}
     */
    var is_ready = false;
    var readyCallbacks = [];
    var deviceChangeCallbacks = [];
    window.HdSmart = {
        ready: function (callback) {
            if (is_ready) {
                callback();
            } else {
                readyCallbacks.push(callback);
            }
        },
        onDeviceListen: function (callback) {
            deviceChangeCallbacks.push(callback);
        }
    };

    window.onDeviceChange = function (data) {
        window.apiLog('onDeviceListen', '', data);
        var length = deviceChangeCallbacks.length;
        for (var i = 0; i < length; i++) {
            if (isFunction(deviceChangeCallbacks[i])) {
                deviceChangeCallbacks[i](data);
            }
        }
    };

    window.onDeviceJsReady = function () {
        if (!window.HdIot) {
            throw new Error("当前环境没有可用的api")
        }
        if (!is_ready) {
            HdSmart.ready = window.HdSmart.ready;
            HdSmart.onDeviceListen = window.HdSmart.onDeviceListen;
            window.HdSmart = HdSmart;
            is_ready = true;
        }
        while (readyCallbacks.length) {
            var func = readyCallbacks.pop();
            if (isFunction(func)) {
                func();
            }
        }
    };
})(window);