(function (window, undefined) {
    if (window.HdSmart) {
        return false;
    }
    function isFunction(fun) {
        return typeof fun === 'function'
    }

    function noop() {

    }

    function uuid() {
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
        HdIot.Device.control({
            data: JSON.stringify({
                method: method,
                req_id: uuid(),
                params: {
                    device_uuid: window.device_uuid,
                    cmd: command,
                    attr: attr
                }
            }),
            onListener: function (data) {
                onSuccess(data)
            }
        });
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
                data = JSON.parse(data);
                if (data.code == 200) {
                    onSuccess(data.result);
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

    HdSmart.Util = {};

    /**
     * @method HdSmart.Util.getNetworkType
     * @param onSuccess
     */
    HdSmart.Util.getNetworkType = function (onSuccess) {
        HdIot.Util.getNetworkType(onSuccess);
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