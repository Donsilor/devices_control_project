/**
 * 服务类
 */

const deviceType = 'tv'

function sendApp(method, params, callback){
    HdSmart.Util.dispatchEvent({
        method,
        deviceType,
        params,
    }, function(error, data){
        if(data.errorcode && data.errorcode != '0'){
            error = {
                errormsg: data.errormsg
            }
        }
        if(error){   
            HdSmart.UI.toast(error.errormsg)
        }
        callback && callback(error, data)
    })
}

/**
 * 页面首次进入会注入 channel信息，推荐信息
 */

export function getInitData(){  
    return JSON.parse(window.tvInitData)
}

/**
 * 获取channel所有数据接口
 */
export function getChannelData(channelId, callback){  
    setTimeout(()=>{ 
        sendApp('getChannelData', {channelId}, callback)
    }, 100);
}

/**
 * 取得视频详情
 */
export function getDetaileData(params, callback){ 
    setTimeout(()=>{    
        sendApp('getDetaileData', params, callback)
    }, 100);
}

/**
 * 搜索结果
 */
export function searchData(params, callback){ 
    sendApp('searchData', params, callback)
}

/**
 * 模糊（联想）查询
 */
export function fuzzySearch(keyword, callback){  
    sendApp('fuzzySearch', {keyword}, callback)
}

/**
 * 搜索历史记录
 */
export function getSearchHistory(callback){ 
    setTimeout(()=>{  
        sendApp('getSearchHistory', '', callback)
    }, 100);
}

/**
 * 发送点击命令
 * 投屏 screenProjectionEvent
 * 遥控器 remoteControlEvent
 * 清除搜索历史记录 clearSearchHistory
 */
export function onClickEvent(eventCode){ 
    sendApp('onClickEvent', {eventCode})
}

/**
 * 点播
 */
export function playVideo(link, title){    
    sendApp('playVideo', {link,title})
}