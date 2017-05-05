import {guid, getDeviceUUID, log, isFunction} from '../helper';
export default function (year, month, onSuccess) {
    let dataOptions = JSON.stringify({
        method: 'getDeviceMonthHistory',
        req_id: guid(),
        params: {
            device_uuid: getDeviceUUID(),
            year: year,
            month: month,
        }
    });
    HdIot.Device.getDeviceMonthHistory({
        data: dataOptions,
        onListener: function (data) {
            log('getDeviceMonthHistory', dataOptions, data);
            data = JSON.parse(data);
            if (isFunction(onSuccess)) {
                onSuccess(data);
            }
        }
    })
};