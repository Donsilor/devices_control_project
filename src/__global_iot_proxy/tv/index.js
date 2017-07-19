import * as mockData from './mock';
import '../sdk/index';

if (window.HdIot && location.search.indexOf('env=desktop') != -1) {

    window.tvInitData = mockData.getInitData()

    HdIot.Util.dispatchEvent = function(options){  
    //console.log(options)
    console.log('mockdata')
    var data = JSON.parse(options.data)
    var callback = options.onListener
    
    setTimeout(()=>{
       switch(data.method) {    
            case 'getChannelData': 
                callback(JSON.stringify(mockData.getChannelData()))
                break;
            case 'searchData':
                callback(JSON.stringify(mockData.searchData()))
                break;
            case 'fuzzySearch': 
                callback(JSON.stringify(mockData.fuzzySearch()))
                break;
            case 'getSearchHistory': 
                callback(JSON.stringify(mockData.getSearchHistory()))
                break;
            case 'getDetaileData':
                callback(JSON.stringify(mockData.getDetaileData()))
                break;
            case 'onClickEvent': 
                console.log('onClickEvent: ',data.params.eventCode)
                break;
       }
    },1000)
    }
}
