//{ "method":"report" ,"result":{"device_uuid":"c04fcb0b006f0d0001" ,"log":[{ "time": 1493318989 ,"attr":{"status":"on","alarm_low_battery":"off","alarm_removal":"on"}},{ "time": 1493318971 ,"attr":{"status":"off","alarm_low_battery":"off","alarm_removal":"on"}},{ "time": 1493318969 ,"attr":{"status":"on","alarm_low_battery":"off","alarm_removal":"on"}},{ "time": 1493318967 ,"attr":{"status":"off","alarm_low_battery":"off","alarm_removal":"on"}},{ "time": 1493318965 ,"attr":{"status":"on","alarm_low_battery":"off","alarm_removal":"on"}},{ "time": 1493318934 ,"attr":{"status":"on","alarm_low_battery":"off","alarm_removal":"on"}},{ "time": 1493318932 ,"attr":{"status":"off","alarm_low_battery":"off","alarm_removal":"on"}},{ "time": 1493318731 ,"attr":{"status":"on","alarm_low_battery":"off","alarm_removal":"on"}},{ "time": 1493318730 ,"attr":{"status":"off","alarm_low_battery":"off","alarm_removal":"on"}},{ "time": 1493318696 ,"attr":{"status":"on","alarm_low_battery":"off","alarm_removal":"on"}},{ "time": 1493318690 ,"attr":{"status":"off","alarm_low_battery":"off","alarm_removal":"on"}},{ "time": 1493318688 ,"attr":{"status":"on","alarm_low_battery":"off","alarm_removal":"on"}},{ "time": 1493318686 ,"attr":{"status":"off","alarm_low_battery":"off","alarm_removal":"on"}},{ "time": 1493167232 ,"attr":{"status":"on","alarm_low_battery":"off","alarm_removal":"on"}},{ "time": 1493167229 ,"attr":{"status":"on","alarm_low_battery":"off","alarm_removal":"on"}}]}}

//{"method":"report","result":{"timestamp":1493367110,"device_uuid":"c04fcb0b006f0d0001","attr":{"status":"on","alarm_low_battery":"off","alarm_removal":"on"}}}

//{"method": "report","result": {"device_uuid": "112233445566778810", "has_log": [1,2,10,21 ]}}
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
                    "method": "report",
                    "result": {
                        "timestamp": 1493367110,
                        "device_uuid": "c04fcb0b006f0d0001",
                        "attr": {"status": "on", "alarm_low_battery": "off", "alarm_removal": "on"}
                    }
                }));
            },
            getDeviceLog: function (options) {
                options.onListener(JSON.stringify({
                    "method": "report",
                    "result": {
                        "device_uuid": "c04fcb0b006f0d0001",
                        "log": [{
                            "time": 1493318989,
                            "attr": {"status": "on", "alarm_low_battery": "off", "alarm_removal": "on"}
                        }, {
                            "time": 1493318971,
                            "attr": {"status": "off", "alarm_low_battery": "off", "alarm_removal": "on"}
                        }, {
                            "time": 1493318969,
                            "attr": {"status": "on", "alarm_low_battery": "off", "alarm_removal": "on"}
                        }, {
                            "time": 1493318967,
                            "attr": {"status": "off", "alarm_low_battery": "off", "alarm_removal": "on"}
                        }, {
                            "time": 1493318965,
                            "attr": {"status": "on", "alarm_low_battery": "off", "alarm_removal": "on"}
                        }, {
                            "time": 1493318934,
                            "attr": {"status": "on", "alarm_low_battery": "off", "alarm_removal": "on"}
                        }, {
                            "time": 1493318932,
                            "attr": {"status": "off", "alarm_low_battery": "off", "alarm_removal": "on"}
                        }, {
                            "time": 1493318731,
                            "attr": {"status": "on", "alarm_low_battery": "off", "alarm_removal": "on"}
                        }, {
                            "time": 1493318730,
                            "attr": {"status": "off", "alarm_low_battery": "off", "alarm_removal": "on"}
                        }, {
                            "time": 1493318696,
                            "attr": {"status": "on", "alarm_low_battery": "off", "alarm_removal": "on"}
                        }, {
                            "time": 1493318690,
                            "attr": {"status": "off", "alarm_low_battery": "off", "alarm_removal": "on"}
                        }, {
                            "time": 1493318688,
                            "attr": {"status": "on", "alarm_low_battery": "off", "alarm_removal": "on"}
                        }, {
                            "time": 1493318686,
                            "attr": {"status": "off", "alarm_low_battery": "off", "alarm_removal": "on"}
                        }, {
                            "time": 1493167232,
                            "attr": {"status": "on", "alarm_low_battery": "off", "alarm_removal": "on"}
                        }, {
                            "time": 1493167229,
                            "attr": {"status": "on", "alarm_low_battery": "off", "alarm_removal": "on"}
                        }]
                    }
                }));
            },
            getDeviceMonthHistory (options){
                options.onListener(JSON.stringify({
                    "method": "report",
                    "result": {"device_uuid": "112233445566778810", "has_log": [1, 2, 10, 21]}
                }));
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
