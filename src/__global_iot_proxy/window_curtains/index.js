import '../sdk/hd.iot.sdk';
if (window.HdIot && location.search.indexOf('env=desktop') != -1) {
    HdIot.Device.getSnapShot = function (options) {
        options.onListener(JSON.stringify({
            code: 200,
            result: {
                close_percent: 0
            }
        }))
    };
}
