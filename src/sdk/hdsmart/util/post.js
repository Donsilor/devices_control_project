import {isFunction, log} from '../helper';

export default function (url, data, onSuccess, onFailure) {
    let dataOptions = JSON.stringify({
        url: url,
        data: data
    });
    HdIot.Util.post({
        data: dataOptions,
        onListener: function (data) {
            if (isFunction(onSuccess)) {
                onSuccess(data)
            }
            log('post', dataOptions, data);
        }
    })
}