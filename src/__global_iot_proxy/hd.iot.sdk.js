if (location.search.indexOf('env=desktop') != -1) {
    window.HdIot = {
        Device: {
            control: function (options) {
                options.onListener(options.data)
            },
            getSnapShot: function (options) {
                options.onListener(JSON.stringify({
                    code: 200,
                    result: {
                        'getSnapShot': 'test'
                    }
                }))
            },
            getDeviceLog: function (options) {
                options.onListener(options.data);
            },
            getDeviceMonthHistory: function (options) {
                options.onListener(options.data);
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

            },
            setTouchRect: function (options) {
            },
            toggleHeadAndFoot:function () {

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
    window.deviceReadyTimer = setTimeout(function () {
        window.onDeviceJsReady();
    }, 500)
}

if (window.HdSmart) {
    HdSmart.ready(function () {
        console.log('device_uuid', window.device_uuid);
    })
}
