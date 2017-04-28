if (location.search.indexOf('env=desktop') != -1) {
    window.HdIot = {
        Device: {
            control: function (options) {
                setTimeout(function () {
                    options.onListener(options.data)
                }, 2000)
            },
            getSnapShot: function (options) {
                options.onListener(JSON.stringify({
                    "timestamp": 1493287676,
                    "msg": "success",
                    "code": 200,
                    "method": "report",
                    "result": {
                        "device_uuid": "c04fcb0b006f0d0001",
                        "attr": {"status": "off", "alarm_low_battery": "off", "alarm_removal": "on"}
                    }
                }))
            },
            getDeviceLog: function (options) {
                options.onListener(JSON.stringify({
                        "method": "report",
                        "result": {
                            "device_uuid": "c04fcb0b006f0d0001",
                            "log": [{
                                "time": 29322104,
                                "attr": {"status": "off", "alarm_low_battery": "off", "alarm_removal": "on"}
                            }, {
                                "time": 29322312,
                                "attr": {"status": "off", "alarm_low_battery": "off", "alarm_removal": "on"}
                            }, {
                                "time": 29198920,
                                "attr": {"status": "on", "alarm_low_battery": "off", "alarm_removal": "on"}
                            }, {
                                "time": 29323056,
                                "attr": {"status": "off", "alarm_low_battery": "off", "alarm_removal": "on"}
                            }, {
                                "time": 29322520,
                                "attr": {"status": "off", "alarm_low_battery": "off", "alarm_removal": "on"}
                            }, {
                                "time": 29323264,
                                "attr": {"status": "on", "alarm_low_battery": "off", "alarm_removal": "on"}
                            }, {
                                "time": 29323472,
                                "attr": {"status": "on", "alarm_low_battery": "off", "alarm_removal": "on"}
                            }, {
                                "time": 29323680,
                                "attr": {"status": "on", "alarm_low_battery": "off", "alarm_removal": "on"}
                            }]
                        }
                    }
                ));
            }
        },
        UI: {
            alert: function (options) {
                options.onListener();
            },
            toast: function () {

            },
            showLoading: function () {

            },
            hideLoading: function () {

            }
        },
        Util: {
            getNetworkType: function (onSuccess) {
                onSuccess('wifi')
            },
            reload: function () {

            },
            post: function (options) {
                options.onListener(options.data)
            },
            sendNotification: function (options) {

            }
        }
    };
    window.device_uuid = 'abc123';
    window.onDeviceJsReady();
}
