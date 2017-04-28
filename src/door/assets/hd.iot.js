window.HdIot = {
    Device: {
        control: function (options) {
            options.onListener(options.data)
        },
        getSnapShot: function (options) {
            options.onListener(JSON.stringify({
                code: 200,
                result:{
                    'device_title':'大门',
                    'status':'on'
                }
            }))
        },
        getDeviceLog:function (options) {
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
        sendNotification:function (options) {

        }
    }
};

window.device_uuid = 'abc123';

window.onDeviceJsReady();