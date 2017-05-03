import './hd.sdk';

if (process.env.NODE_ENV == 'development') {
    window.apiLog = function (apiName, data, result) {
        console.log('<<<---sdk.debug.log--->>>')
        console.log(`api名称：${apiName}`);
        console.log(`传入值：${data ? data : '空'}`);
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
            console.log('返回值(object):', resultObj);
            console.log('返回值(string):', resultStr);
        } else {
            console.log('返回值:', '无')
        }
    };
}