/**
 * 服务类
 */

const DEVICE_TYPE = 'tv'

function sendApp(options){
    options.data.deviceType = DEVICE_TYPE
    HdSmart.Util.dispatchEvent(options)
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
    sendApp({   
        data: { 
            method: 'getChannelData',
            params: {
                channelId: channelId
            }
        },
        onListener: callback
    })
}

/**
 * 取得视频详情
 */
export function getDetaileData(params, callback){   
    sendApp({   
        data: { 
            method: 'getDetaileData',
            params: params
        },
        onListener: callback
    })
}

/**
 * 搜索结果
 */
export function searchData(params, callback){   
    sendApp({
        data: { 
            method: 'searchData',
            params: params
        },
        onListener: callback
    })
}

/**
 * 模糊（联想）查询
 */
export function fuzzySearch(word, callback){  
    sendApp({   
        data: { 
            method: 'fuzzySearch',
            params: {
                keyword: word
            }
        },
        onListener: callback
    })
}

/**
 * 搜索历史记录
 */
export function getSearchHistory(callback){ 
    sendApp({   
        data: { 
            method: 'getSearchHistory',
            params: ''
        },
        onListener: callback
    })
}

/**
 * 发送点击命令
 * 投屏 screenProjectionEvent
 * 遥控器 remoteControlEvent
 * 清除搜索历史记录 clearSearchHistory
 */
export function onClickEvent(eventName){ 
    sendApp({   
        data: { 
            method: 'onClickEvent',
            params: {
                eventCode: eventName
            }
        }
    })
}

/**
 * 点播
 */
export function playVideo(link, title){    
    sendApp({
        data: {
            method:'playVideo' ,
            params: {
                link: link,
                title: title
            }
        }
    })
}