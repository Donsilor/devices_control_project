webpackJsonp([2],[,function(n,e,t){n.exports={default:t(2),__esModule:!0}},function(n,e,t){var o=t(3),i=o.JSON||(o.JSON={stringify:JSON.stringify});n.exports=function(n){return i.stringify.apply(i,arguments)}},function(n,e){var t=n.exports={version:"2.4.0"};"number"==typeof __e&&(__e=t)},function(n,e,t){"use strict";var o=t(1),i=t.n(o);-1!=location.search.indexOf("env=desktop")&&(window.HdIot={Device:{control:function(n){n.onListener(n.data)},getSnapShot:function(n){n.onListener(i()({code:200,result:{getSnapShot:"test"}}))},getDeviceLog:function(n){n.onListener(n.data)},getDeviceMonthHistory:function(n){n.onListener(n.data)},getDeviceLogByDay:function(n){n.onListener(n.data)}},UI:{alert:function(n){n.onListener()},toast:function(){},showLoading:function(){},hideLoading:function(){},setTouchRect:function(n){},toggleHeadAndFoot:function(){}},Util:{getNetworkType:function(n){n("wifi")},reload:function(){},post:function(n){n.onListener(n.data)},sendNotification:function(n){}}},window.device_uuid="abc123",window.deviceReadyTimer=setTimeout(function(){window.onDeviceJsReady()},500)),window.HdSmart&&HdSmart.ready(function(){console.log("device_uuid",window.device_uuid)})},,,,,,,,,,function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=t(1),i=t.n(o);t(4);window.HdIot&&-1!=location.search.indexOf("env=desktop")&&(HdIot.Device.getSnapShot=function(n){n.onListener(i()({code:200,result:{close_percent:0}}))})}],[14]);
//# sourceMappingURL=after_iot.a7db3d0a101e5ffde315.js.map