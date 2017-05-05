import {guid, getDeviceUUID, log, isFunction} from '../helper';
export default function (onSuccess, onFailure) {
    HdIot.Device.getSnapShot({
        data: '',
        onListener: function (data) {
            log('getSnapShot', '', data);
            data = JSON.parse(data);
            if (data.result) {
                if (isFunction(onSuccess)) {
                    onSuccess(data.result, data.timestamp || data.result.timestamp);
                }
            } else {
                if (isFunction(onFailure)) {
                    onFailure(data);
                }
            }
        }
    });
}