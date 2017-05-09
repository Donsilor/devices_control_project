import * as mockData from './mock';
import '../sdk/hd.iot.sdk';

if (window.HdIot && location.search.indexOf('env=desktop') != -1) {
    HdIot.Device.getSnapShot = function (options) {
        setTimeout(()=>{
            options.onListener(JSON.stringify(mockData.generateSnapShot()))
        },100)
    }
    HdIot.Device.getDeviceLogByDay = function (options) {
      let data = JSON.parse(options.data);

      setTimeout(()=>{
            options.onListener(JSON.stringify(mockData.generateDeviceLogByDay(data.params.start_time)))
        },100)
    }
    HdIot.Device.getDeviceLog = function (options) {
      let data = JSON.parse(options.data);

      setTimeout(()=>{
        options.onListener(JSON.stringify(mockData.generateDeviceLog(data.params.start_time)))
      },200)
    }
}
