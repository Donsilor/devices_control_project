import * as mockData from './mock';
import '../sdk/index';

if (window.HdIot && location.search.indexOf('env=desktop') != -1) {

    window.tvInitData = mockData.getInitData()

    HdIot.Util.dispatchEvent = function(data,callback){  
    //console.log(options)
       switch(data.method) {    
            case 'getChannelData': 
                callback(mockData.getChannelData())
                break;
            case 'searchData':
                callback(mockData.searchData())
                break;
            case 'fuzzySearch': 
                callback(mockData.fuzzySearch())
                break;
            case 'getSearchHistory': 
                callback(mockData.getSearchHistory())
                break;
            case 'getDetaileData':
                callback(mockData.getDetaileData())
                break;
            case 'onClickEvent': 
                console.log('onClickEvent: ',data.params)
                break;
       }
    }
}
