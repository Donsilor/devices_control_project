import './index';
import moment from 'moment';

let counter = 0;
window.apiLog = function (apiName, data, result) {
    counter = counter + 1;
    const now = moment().format('HH:mm:ss SSSS');
    console.log(`<<<---[${now}]${counter}：${apiName} log begin---`)
    console.warn(`传入值：${data === '' ? '空' : data }`);
    if (result) {
        let resultStr;
        let resultObj;
        if (typeof  result == 'string') {
            resultStr = result;
            resultObj = JSON.parse(result);
        } else {
            resultObj = result;
            resultStr = JSON.stringify(result);
        }
        console.warn('返回值(object):', resultObj);
        console.warn('返回值(string):', resultStr);
    } else {
        console.warn('返回值:', '无')
    }
    console.log(`---${counter}：${apiName} log end--->>>`)
};
