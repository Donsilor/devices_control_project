import {guid, getDeviceUUID, log, isFunction} from '../helper';
export default function (data, onSuccess, onError) {
    let dataOptions = JSON.stringify({
        method: 'getDeviceLog',
        req_id: guid(),
        params: {
            device_uuid: getDeviceUUID(),
            start_time: data.start_time,
            items_per_page: typeof data.items_per_page === 'number' ? data.items_per_page : 8,
            direction: data.direction
        }
    });
    HdIot.Device.getDeviceLog({
        data: dataOptions,
        onListener: function (data) {
            data = {
                code: 504
            };
            log('getDeviceLog', dataOptions, data);
            // data = JSON.parse(data);
            if (data.code == 504) {
                if (isFunction(onError)) {
                    onError(data)
                }
            } else if (data.result) {
                if (isFunction(onSuccess)) {
                    onSuccess(data.result)
                }
            }
        }
    });
};