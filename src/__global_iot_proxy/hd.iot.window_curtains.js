import './hd.iot.sdk';
if (window.HdIot) {
    HdIot.Device.getSnapShot = function (options) {
        options.onListener(JSON.stringify({
            code: 200,
            result: {
                close_percent: 0
            }
        }))
    };
}