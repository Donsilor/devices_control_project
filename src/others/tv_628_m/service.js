/**
 * 服务类
 */
import jsonp from 'jsonp'
const deviceType = 'tv'
import store from './store'
import router from './router'

function sendApp(method, params, callback){
    HdSmart.Util.dispatchEvent({
        method,
        deviceType,
        params,
    }, function(error, data){
      console.log(store.state.tvStatus.tvOnlineStatus,'store.state.tvStatus.tvOnlineStatus')
      if(store.state.tvStatus.tvOnlineStatus==-1){
        router.push('/NoNetwork')
      }

        console.log(method,'method')
        console.log(error,'error')
        console.log(data,'data')
        if(data.errorcode && data.errorcode != '0'){
            error = {
                errormsg: data.errormsg
            }
        }
        if(error && method !== 'fuzzySearch'){
          console.log(error.errormsg,'error.errormsg---------------------')
          HdSmart.UI.toast(error.errormsg)
        }
        callback && callback(error, data)
    })
}

/**
 * 页面首次进入会注入 channel信息，推荐信息
 */

export function getHomePageInfo(callback){
    jsonp('http://hdmedia.api.my7v.com/tmop-api/v1/carousel?sourceId=9&appId=hd1457430496', null, function(err, res){
    
        console.log(err,res,'getHomePageInfo------------------------------------------------------------------------------------------------------')
        if(!err && res.errorcode == '0'){
            callback(res.data)
        }
    })
}


export function getInitData(){
    return {
        "channels": [
            {
              channelId: '005',
              channel: '精选'
            },
            {
                "channelId": "001",
                "channel": "电影"
            },
            {
                "channelId": "002",
                "channel": "电视剧"
            },
            {
                "channelId": "003",
                "channel": "动漫"
            },
            {
                "channelId": "004",
                "channel": "综艺"
            }
        ]
    }
}

/**
 * 获取channel所有数据接口
 */
export function getChannelData(params, callback){
    setTimeout(()=>{
        sendApp('getChannelData', params, callback)
    }, 150)
}

/**
 * 取得视频详情
 */
export function getDetaileData(params, callback){
    setTimeout(()=>{
        sendApp('getDetaileData', params, callback)
    }, 150)
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
    }, 150)
}

/**
 * 发送点击命令
 * 投屏 screenProjectionEvent
 * 遥控器 remoteControlEvent
 * 清除搜索历史记录 clearSearchHistory
 */
export function onClickEvent(eventCode, params){
    sendApp('onClickEvent', {eventCode, ...params})
}

/**
 * 点播
 */
export function playVideo(link, title){
    sendApp('playVideo', {link,title})
}

export function getScreenProjectionStatus(callback) {
    sendApp('screenProjectionStatus', '', callback)
}

export function goToScreenProjectionPage(){
    sendApp('screenProjectionStatusClick', '')
}
/**
 * 遥控器控制显隐
 */
export function RemoteController(ifShow){
    sendApp('RemoteController',ifShow)
}
