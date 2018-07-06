(function() {
    if (window.HdSmart) {
        return;
    }
    //通道字典
    var CHANNEL_DICTIONARY = {
        dm_set: 'REQ_ROUTER',
        dr_get_dev_status_list: 'REQ_CLOUD_THAN_ROUTER',
        da_get_dev_alert_list: 'REQ_CLOUD_THAN_ROUTER',
        dr_delete_dev_status: '',
        '3d_get_moji_weather': 'REQ_CLOUD'
    };

    if (typeof Object.assign != 'function') {
        Object.assign = function(target, varArgs) {
            'use strict';
            if (target == null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var to = Object(target);

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];

                if (nextSource != null) {
                    for (var nextKey in nextSource) {
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        };
    }

    /**
     * iOS jsbridge实现
     */
    function iosCall(method, data, callback) {
        if (!window.JSBridgeEventHandler) {
            return;
        }
        method = method.replace(/\w+\./, '');
        data = data || '';
        console.log(method + ' = ' + JSON.stringify(data));
        JSBridgeEventHandler.callNativeFunction(method, data, function(response) {
            console.log(method + ' res = ' + JSON.stringify(response));
            callback(response);
        });
    }

    /**
     * android jsbridge实现
     */
    function androidCall(method, data, callback, toJSON) {
        if (!window.HdIot && !window.WebViewJavascriptBridge) {
            return;
        }

        data = data || '';
        toJSON = toJSON !== false;
        console.log(method + ' = ' + JSON.stringify(data));
        try {
            if (window.HdIot && !window.WebViewJavascriptBridge) {
                var fn = method.split('.').reduce(function(fn, method) {
                    return fn[method];
                }, HdIot);

                var options = {
                    data: JSON.stringify(data),
                    onListener(response) {
                        console.log(method + ' res = ' + response);
                        if (toJSON) {
                            callback(JSON.parse(response));
                        } else {
                            callback(response);
                        }
                    }
                };
                if (method == 'UI.toast') {
                    options = JSON.stringify({ data: data });
                }
                fn(options);
            } else if (window.WebViewJavascriptBridge) {
                if (typeof method === 'string') {
                    method = method.split('.').pop();
                }
                window.WebViewJavascriptBridge.callHandler(method, data, function(response) {
                    if (toJSON) {
                        callback(JSON.parse(response));
                    } else {
                        callback(response);
                    }
                });
            }
        } catch (e) {}
    }

    function guid() {
        return getRandomInt(3000000, 5000000); //1, 10000
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    var bridge = {
        sendEvent: /iphone|ipad/i.test(navigator.userAgent) ? iosCall : androidCall
    };

    var apiList = {
        ready: 'ready',
        on_device_change: 'device_change',
        on_device_state_change: 'device_state_change',
        on_device_alert: 'device_alert',
        on_device_control: 'device_control',
        device_control: 'Device.control',
        device_getsnapshot: 'Device.getSnapShot',
        ui_alert: 'UI.alert',
        ui_showloading: 'UI.showLoading',
        ui_hideloading: 'UI.hideLoading',
        ui_toast: 'UI.toast',
        ui_toggleheadandfoot: 'UI.toggleHeadAndFoot',
        util_dispatchevent: 'Util.dispatchEvent',
        ui_setNavigationBar: 'setNavigationBar'
    };

    var tipMsg = {
        timeout: '请求超时',
        e504: '网络异常，请稍后重试',
        e505: '操作失败，设备离线',
        jsonerr: 'JSON解析错误'
    };

    var _cbs = {};
    var events = {
        on: function(type, callback) {
            (_cbs[type] || (_cbs[type] = [])).unshift(callback);
        },
        off: function(type, callback) {
            if (!type) return;
            if (!callback) return delete _cbs[type];

            var cbs = _cbs[type] || [];
            var i;
            while (cbs && ~(i = cbs.indexOf(callback))) cbs.splice(i, 1);
        },
        trigger: function(type) {
            var cbs = _cbs[type];
            if (cbs) {
                var args = [].slice.call(arguments, 1);
                var l = cbs.length;
                while (l--) cbs[l].apply(this, args);
            }
        }
    };

    var isReady = false;
    /**
     * todo：这里应该由native注入，目前分开注入了device_uuid，device_name，device_category_id
     * 建议改成json格式，格式如下，添加family_id、user_id、device_id
     * 修改完成后，control方法也需要修改(需兼容以前)
     */
    // window.iot_device_info = {
    //     device_name: '',
    //     device_uuid: '',
    //     device_id: '',
    //     device_category_id: '',
    //     user_id: '',
    //     family_id: ''
    //   }
    var oldDeviceInfo = {};

    var sdk = {
        send: bridge.sendEvent,
        ready: function(callback) {
            if (isReady) {
                callback();
            } else {
                events.on(apiList.ready, callback);
            }
        },
        onDeviceListen: function(callback) {
            events.on(apiList.on_device_change, callback);
        },
        offDeviceListen: function(callback) {
            events.off(apiList.on_device_change, callback);
        },
        // 设备状态变化监听
        onDeviceStateChange: function(callback) {
            events.on(apiList.on_device_state_change, callback);
        },
        offDeviceStateChange: function(callback) {
            events.off(apiList.on_device_state_change, callback);
        },
        // 设备故障告警监听
        onDeviceAlert: function(callback) {
            events.on(apiList.on_device_alert, callback);
        },
        offDeviceAlert: function(callback) {
            events.off(apiList.on_device_alert, callback);
        },
        // 设备控制监听，历史原因，属于内部方法
        onDeviceControl: function(callback) {
            events.on(apiList.on_device_control, callback);
        },
        offDeviceControl: function(callback) {
            events.off(apiList.on_device_control, callback);
        }
    };

    sdk.Device = {
        /**
         * 获取设备快照
         * dm_get_device_info
         */
        getSnapShot: function(success, fail) {
            var isTimeout = false;
            var timer = setTimeout(function() {
                isTimeout = true;
                fail({ code: -1, msg: 'request timeout' });
            }, 8000);

            var callback = function(data) {
                if (isTimeout) {
                    return false;
                }
                clearTimeout(timer);
                if (data && data.code === 0) {
                    oldDeviceInfo = data.result;
                    success(data.result);
                } else {
                    fail(data);
                }
            };

            var callback_wrap = function(data) {
                callback(data);
                sdk.offDeviceStateChange(callback_wrap);
            };

            bridge.sendEvent(apiList.device_getsnapshot, { device_uuid: window.device_uuid }, function(data) {
                if (data.msg == 'TcpClient send msg success') {
                    sdk.onDeviceStateChange(callback_wrap);
                } else {
                    callback(data);
                }
            });
        } /**
         * 路由器/云端交互通道。todo：策略管理由H5指定，待app网络层重构后处理
         *
         * 注：三通是指app连路由器，路由器连云端
         * 具体参数请参考：http://wiki.evergrande.me/pages/viewpage.action?pageId=6014203
         *
         * dm_set 设备控制：仅路由器
         * dr_get_dev_status_list 状态列表查询：优先云端，其次路由器
         * da_get_dev_alert_list  告警列表查询：优先云端，其次路由器
         * dr_delete_dev_status  状态日志删除：三通
         * 3d_get_moji_weather  天气预报接口：仅云端
         * 
         * 
         * 策略:
         *  REQ_ROUTER //仅路由
            REQ_CLOUD  //仅先云端
            REQ_CLOUD_TRANS //优先云端透传
            REQ_ROUTER_THAN_CLOUD //优先路由次选云端
            REQ_CLOUD_THAN_ROUTER //优先云端次选路由
            REQ_ROUTER_THAN_CLOUD_TRANS //优先云端次选云端透传

            //路由：是指请求发往路由器
            //云端：是指请求发往云端服务器
            //云端透传：是指请求经云端转发后发往路由器
         *
         */,
        control: function(options, success, fail) {
            var opt = Object.assign({ req_id: guid(), timestamp: Date.now(), method: 'dm_set', params: {} }, options);

            //通道参数
            opt.channel = CHANNEL_DICTIONARY[opt.method];

            opt.params = Object.assign(
                {
                    device_uuid: window.device_uuid || oldDeviceInfo.device_uuid,
                    user_id: window.user_id || oldDeviceInfo.user_id,
                    family_id: window.family_id || oldDeviceInfo.family_id
                },
                opt.params
            );

            if (opt.params.user_id) {
                opt.params.user_id = parseInt(opt.params.user_id);
            }

            if (opt.params.family_id) {
                opt.params.family_id = parseInt(opt.params.family_id);
            }

            if (opt.params.device_id) {
                opt.params.device_id = parseInt(opt.params.device_id);
            }

            var isTimeout = false;
            var timer = setTimeout(function() {
                isTimeout = true;
                fail({ code: -1, msg: 'request timeout' });
            }, 8000);

            var callback = function(data) {
                if (isTimeout) {
                    return false;
                }
                clearTimeout(timer);
                if (data.code === 0) {
                    success(data);
                } else {
                    fail(data);
                }
            };

            var callback_wrap = function(data) {
                setTimeout(function() {
                    if (data.req_id == opt.req_id) {
                        callback(data);
                        sdk.offDeviceControl(callback_wrap);
                        callback = function() {};
                    }
                }, 0);
            };

            bridge.sendEvent(apiList.device_control, opt, function(data) {
                if (data.msg == 'TcpClient send msg success') {
                    if (data.req_id) opt.req_id = data.req_id;
                    sdk.onDeviceControl(callback_wrap);
                } else {
                    callback(data);
                }
            });
        }
    };

    sdk.UI = {
        /**
         * 显示加载中动画
         */
        showLoading: function() {
            bridge.sendEvent(apiList.ui_showloading);
        },
        /**
         * 隐藏加载中动画
         */
        hideLoading: function() {
            bridge.sendEvent(apiList.ui_hideloading);
        },
        /**
         * toast提示
         */
        toast: function(message, duration) {
            bridge.sendEvent(apiList.ui_toast, {
                message: message,
                duration: duration || 3000
            });
        },
        /**
         * 提示框
         * @param {object} options 选项
         * @param {string} options.okText 确定按钮文字
         * @param {string} options.cancelText 取消按钮文字，为空不显示
         * @param {number} options.dialogStyle int类型，表示对话框类型。0：普通，1：指引，2：告警
         * @param {function} callback 回调函数fn(isOK) isOK=true点击确定
         */
        alert: function(options, callback) {
            var opt = Object.assign(
                {
                    okText: '确定',
                    cancelText: '取消',
                    dialogStyle: 0,
                    isCancelEnable: ''
                },
                options
            );
            bridge.sendEvent(apiList.ui_alert, opt, callback);
        },
        /**
         * 显示/隐藏头部底部控件
         */
        toggleHeadAndFoot: function(visible) {
            bridge.sendEvent(apiList.ui_toggleheadandfoot, {
                show_head_foot: visible
            });
        },

        /**
         * 设置导航栏样式
         *
         */
        setNavigationBarLeft: function(option = { type: 'icon', text: '', icon: 'back' }) {
            bridge.sendEvent(apiList.setNavigationBarLeft, option);
        },
        setNavigationBarRight: function(option = { type: 'text', text: '', color: '', onClick: function() {}, show: false }) {
            bridge.sendEvent(apiList.setNavigationBarRight, option);
        },
        setNavigationBarTitle: function(title) {
            bridge.sendEvent(apiList.setNavigationBarTitle, title);
        }
    };

    sdk.Util = {
        /**
         * 用于电视交互
         */
        dispatchEvent: function(params, callback) {
            bridge.sendEvent(
                apiList.util_dispatchevent,
                params,
                function(data) {
                    var error = null;
                    if (typeof data === 'string') {
                        //HACK: app返回json数据有问题，没找到解决方案
                        try {
                            data = JSON.parse(data);
                        } catch (e) {
                            try {
                                data = data.replace(/\n/g, '\\n');
                                data = data.replace(/:"([^{[]*?)("[,}])/g, function(match, v, q) {
                                    return ':"' + v.replace(/"/g, '\\"') + q;
                                });
                                data = JSON.parse(data);
                            } catch (e) {
                                error = {
                                    errormsg: tipMsg.jsonerr
                                };
                            }
                        }
                    } else if (typeof data === 'undefined') {
                        data = {};
                    }

                    if (data.code === 504) {
                        error = {
                            errormsg: tipMsg.e504
                        };
                    }

                    if (data.code === 505) {
                        error = {
                            errormsg: tipMsg.e505
                        };
                    }

                    callback && callback(error, data);
                },
                false
            );
        }
    };

    /**
     * JSSDK注入完成，由APP触发
     */
    window.onDeviceJsReady = function() {
        if (!isReady) {
            isReady = true;
            events.trigger(apiList.ready);
        }
    };
    window.WebViewJavascriptBridgeReady = function() {
        if (!isReady) {
            isReady = true;
            events.trigger(apiList.ready);
        }
    };
    //由于app jsbridge升级导致需要在document上侦听自定义
    document.addEventListener(
        'WebViewJavascriptBridgeReady',
        function() {
            if (!isReady) {
                isReady = true;
                events.trigger(apiList.ready);
            }
        },
        false
    );

    /**
     * 状态/告警/其他通知，由APP触发
     */
    window.onDeviceChange = function(data) {
        console.log('device change = ' + JSON.stringify(data));
        if (data && data.msg == 'TcpClient send msg success') {
            return;
        }

        switch (data.method) {
            case 'dm_set':
                events.trigger(apiList.on_device_control, data);
                break;
            case 'report':
            case 'dm_get_device_info':
            case 'dr_report_dev_status':
                events.trigger(apiList.on_device_state_change, data);
                break;
            case 'dr_report_dev_alert':
            case 'da_report_dev_alert':
                events.trigger(apiList.on_device_alert, data);
                break;
            default:
                break;
        }
        events.trigger(apiList.on_device_change, data);
    };

    window.HdSmart = sdk;
})();
