import {guid, getDeviceUUID, log, isFunction} from '../helper';
export default function (start_time, onSuccess) {
    let dataOptions = JSON.stringify({
        method: 'getDeviceLogByDay',
        req_id: guid(),
        params: {
            start_time: start_time,
            device_uuid: getDeviceUUID()
        }
    });
    HdIot.Device.getDeviceLogByDay({
        data: dataOptions,
        onListener: function (data) {
            data = JSON.parse(data);
            log('getDeviceLogByDay', dataOptions, data);
            if (isFunction(onSuccess)) {
                onSuccess(data)
            }
        }
    })
};