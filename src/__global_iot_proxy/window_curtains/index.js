import '../sdk/index';
if (window.HdIot && location.search.indexOf('env=desktop') != -1) {
    HdIot.Device.getSnapShot = function (options) {
        options.onListener(JSON.stringify({
            code: 200,
            result: {
                close_percent: 0
            }
        }));
    };
    HdIot.Device.control = function (options) {
        setTimeout(function () {
            options.onListener(JSON.stringify({
                result:options.data
            }));
        },300)
    }
}
