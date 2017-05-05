import {guid, getDeviceUUID, log, isFunction} from '../helper';
export default function (method, command, attr, onSuccess, onFailure) {
    let dataOptions = JSON.stringify({
        method: method,
        req_id: guid(),
        params: {
            device_uuid: getDeviceUUID(),
            cmd: command,
            attr: attr
        }
    });
    HdIot.Device.control({
        data: dataOptions,
        onListener: function (data) {
            log('control', dataOptions, data);
            if(isFunction(onSuccess)){
                onSuccess(data)
            }
        }
    });
};