if (location.search.indexOf('env=dev') == -1) {
    window.HdIot = {
        Device: {
            control: function (options) {
                setTimeout(function () {
                    options.onListener(options.data)
                }, 2000)
            },
            getSnapShot: function (options) {
                options.onListener(JSON.stringify({
                    code: 200,
                    result: {
                        close_percent: 0
                    }
                }))
            },
            getDeviceLog: function (options) {
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
