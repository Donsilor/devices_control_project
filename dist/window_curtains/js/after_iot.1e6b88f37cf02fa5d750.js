webpackJsonp([2],{12:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=t(1),i=t.n(o);t(2);window.HdIot&&-1!=location.search.indexOf("env=desktop")&&(HdIot.Device.getSnapShot=function(e){e.onListener(i()({code:200,result:{close_percent:0}}))})},2:function(e,n,t){"use strict";var o=t(1),i=t.n(o);-1!=location.search.indexOf("env=desktop")&&(window.HdIot={Device:{control:function(e){e.onListener(e.data)},getSnapShot:function(e){e.onListener(i()({code:200,result:{getSnapShot:"test"}}))},getDeviceLog:function(e){e.onListener(e.data)},getDeviceMonthHistory:function(e){e.onListener(e.data)},getDeviceLogByDay:function(e){e.onListener(e.data)}},UI:{alert:function(e){e.onListener()},toast:function(){},showLoading:function(){},hideLoading:function(){},setTouchRect:function(e){},toggleHeadAndFoot:function(){}},Util:{getNetworkType:function(e){e("wifi")},reload:function(){},post:function(e){e.onListener(e.data)},sendNotification:function(e){}}},window.device_uuid="abc123",window.deviceReadyTimer=setTimeout(function(){window.onDeviceJsReady()},500)),window.HdSmart&&HdSmart.ready(function(){console.log("device_uuid",window.device_uuid)})}},[12]);
//# sourceMappingURL=after_iot.1e6b88f37cf02fa5d750.js.map