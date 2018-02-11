
function sendApp(method, params, callback){
    HdSmart.Util.dispatchEvent({
        method,
        params,
    }, function(error, data){
        if(data.errorcode && data.errorcode != '0'){
            error = {
                errormsg: data.errormsg
            }
        }
        // if(error && method !== 'fuzzySearch'){
        //     HdSmart.UI.toast(error.errormsg)
        // }
        callback && callback(error, data)
    })
}



/**
 * 取得视频详情
 */
export function getDetaileData(params, callback){
    setTimeout(()=>{
        sendApp('getDetaileData', params, callback)
    }, 150);
}


/**
 * 发送点启动
 */
export function onClickEvent(eventCode){
    sendApp('onClickEvent', {eventCode})
}
