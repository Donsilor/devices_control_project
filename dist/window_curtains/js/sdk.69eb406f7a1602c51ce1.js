webpackJsonp([1],{1:function(t,e,i){t.exports={default:i(2),__esModule:!0}},2:function(t,e,i){var o=i(3),n=o.JSON||(o.JSON={stringify:JSON.stringify});t.exports=function(t){return n.stringify.apply(n,arguments)}},3:function(t,e){var i=t.exports={version:"2.4.0"};"number"==typeof __e&&(__e=i)},32:function(t,e,i){t.exports=i(5)},5:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=i(1),n=i.n(o);!function(t,e){function i(t){return"function"==typeof t}function o(){return t.device_uuid}function a(){var t="xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g,function(t){var e=10*Math.random()|0;return("x"==t?e:3&e|8).toString(16)});return t=t.replace(/^0/,"1")}function r(t,e){if("number"==typeof t)return t;if("string"==typeof t){var i=parseInt(t);if(t.indexOf("%")>-1)return e*i/100;if(!isNaN(i))return i}return 0}if(t.HdSmart)return!1;t.apiLog||(t.apiLog=function(t,e,i){});var c={};c.Device={},c.Device.control=function(e,i,r,c,d){var u=n()({method:e,req_id:a(),params:{device_uuid:o(),cmd:i,attr:r}});HdIot.Device.control({data:u,onListener:function(e){t.apiLog("control",u,e),c(e)}})},c.Device.getDeviceLog=function(e,r){var c=n()({method:"getDeviceLog",req_id:a(),params:{device_uuid:o(),start_time:e.start_time,items_per_page:"number"==typeof e.items_per_page?e.items_per_page:8,direction:e.direction}});HdIot.Device.getDeviceLog({data:c,onListener:function(e){t.apiLog("getDeviceLog",c,e),e=JSON.parse(e),i(r)&&r(e.result)}})},c.Device.getDeviceLogByDay=function(e,r){var c=n()({method:"getDeviceLogByDay",req_id:a(),params:{start_time:e,device_uuid:o()}});HdIot.Device.getDeviceLogByDay({data:c,onListener:function(e){e=JSON.parse(e),t.apiLog("getDeviceLogByDay",c,e),i(r)&&r(e)}})},c.Device.getDeviceMonthHistory=function(e,r,c){var d=n()({method:"getDeviceMonthHistory",req_id:a(),params:{device_uuid:o(),year:e,month:r}});HdIot.Device.getDeviceMonthHistory({data:d,onListener:function(e){t.apiLog("getDeviceMonthHistory",d,e),e=JSON.parse(e),i(c)&&c(e)}})},c.Device.getSnapShot=function(e,i){HdIot.Device.getSnapShot({data:"",onListener:function(o){t.apiLog("getSnapShot","",o),o=JSON.parse(o),o.result?e(o.result,o.timestamp||o.result.timestamp):i(o)}})},c.UI={},c.UI.alert=function(t,e,i,o,a){o=o||"确定",a=a||"取消",HdIot.UI.alert({data:n()({title:t,message:e,okText:o,cancelText:a}),onListener:function(){i()}})},c.UI.toast=function(t,e){e=e||3e3,HdIot.UI.toast(t,e)},c.UI.showLoading=function(){HdIot.UI.showLoading({data:""})},c.UI.hideLoading=function(){HdIot.UI.hideLoading({data:""})},c.UI.setWebViewTouchRect=function(e,i,o,a){var c=document.body.getBoundingClientRect();e=r(e,c.width),i=r(i,c.height),o=r(o,c.width),a=r(a,c.height);var d=n()({left:e,right:o,top:i,bottom:a});HdIot.UI.setTouchRect({data:d}),t.apiLog("setWebViewTouchRect",d,"")},c.Util={},c.Util.getNetworkType=function(e){HdIot.Util.getNetworkType({data:"",onListener:function(i){t.apiLog("getNetworkType","",i),e(i)}})},c.Util.reload=function(){HdIot.Util.reload()},c.Util.post=function(t,e,i,o){HdIot.Util.post({data:n()({url:t,data:e}),onListener:function(t){i(t)}})},c.Util.sendNotification=function(t,e){HdIot.Util.sendNotification({data:n()({title:t,message:e})})},c.UI.toggleHeadAndFoot=function(t){HdIot.UI.toggleHeadAndFoot({data:n()({show_head_foot:t})})};var d=!1,u=[],s=[];t.HdSmart={ready:function(t){d?t():u.push(t)},onDeviceListen:function(t){s.push(t)}},t.onDeviceChange=function(e){t.apiLog("onDeviceListen","",e);for(var o=s.length,n=0;n<o;n++)i(s[n])&&s[n](e)},t.onDeviceJsReady=function(){if(!t.HdIot)throw new Error("当前环境没有可用的api");for(d||(c.ready=t.HdSmart.ready,c.onDeviceListen=t.HdSmart.onDeviceListen,t.HdSmart=c,d=!0);u.length;){var e=u.pop();i(e)&&e()}}}(window)}},[32]);
//# sourceMappingURL=sdk.69eb406f7a1602c51ce1.js.map