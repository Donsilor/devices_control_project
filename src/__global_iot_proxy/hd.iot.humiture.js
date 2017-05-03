import * as mockData from './hd.iot.humiture.mock';

import './hd.iot.sdk';
if (window.HdIot && location.search.indexOf('env=desktop') != -1) {
    HdIot.Device.getSnapShot = function (options) {
        options.onListener(JSON.stringify(mockData.generateSnapShot()))
    }
}