import {isFunction,log} from '../helper';
export default function (onSuccess) {
    HdIot.Util.getNetworkType({
        data: '',
        onListener (data){
            log('getNetworkType', '', data);
            if(isFunction(onSuccess)){
                onSuccess(data)
            }
        }
    })
}