!function(t){function e(n){if(i[n])return i[n].exports;var o=i[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var i={};e.m=t,e.c=i,e.i=function(t){return t},e.d=function(t,i,n){e.o(t,i)||Object.defineProperty(t,i,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(i,"a",i),i},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="./",e(e.s=51)}([function(t,e,i){"use strict";function n(t){return"function"==typeof t}function o(){var t="xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g,function(t){var e=10*Math.random()|0;return("x"==t?e:3&e|8).toString(16)});return t=t.replace(/^0/,"1")}function a(){return window.device_uuid}function r(t,e,i){window.apiLog(t,e,i)}function c(t,e){if("number"==typeof t)return t;if("string"==typeof t){var i=parseInt(t);if(t.indexOf("%")>-1)return e*i/100;if(!isNaN(i))return i}return 0}e.b=n,e.d=o,e.e=a,e.a=r,e.c=c},function(t,e,i){t.exports={default:i(32),__esModule:!0}},,function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(18),o=i(17),a=i(22),r=i(28);window.HdSmart={ready:n.a.beforeReady,onDeviceListen:n.a.onDeviceListen},window.apiLog=function(t,e,i){};var c=!1;window.onDeviceJsReady=function(){if(!window.HdIot)throw new Error("当前环境没有可用的api");c||(window.HdSmart.ready=n.a.ready,window.HdSmart.Device=o.a,window.HdSmart.UI=a.a,window.HdSmart.Util=r.a,c=!0),n.a.runReadyCallbacks()},window.onDeviceChange=function(t){n.a.runDeviceListenCallback(t)}},,,,,,,,,function(t,e,i){"use strict";var n=i(1),o=i.n(n),a=i(0);e.a=function(t,e,n,r,c){var u=o()({method:t,req_id:i.i(a.d)(),params:{device_uuid:i.i(a.e)(),cmd:e,attr:n}});HdIot.Device.control({data:u,onListener:function(t){t=JSON.parse(t),i.i(a.a)("control",u,t),504==t.code?c(t):i.i(a.b)(r)&&r()}})}},function(t,e,i){"use strict";var n=i(1),o=i.n(n),a=i(0);e.a=function(t,e,n){var r=o()({method:"getDeviceLog",req_id:i.i(a.d)(),params:{device_uuid:i.i(a.e)(),start_time:t.start_time,items_per_page:"number"==typeof t.items_per_page?t.items_per_page:8,direction:t.direction}});HdIot.Device.getDeviceLog({data:r,onListener:function(t){i.i(a.a)("getDeviceLog",r,t),t=JSON.parse(t),504==t.code?i.i(a.b)(n)&&n(t):t.result&&i.i(a.b)(e)&&e(t.result)}})}},function(t,e,i){"use strict";var n=i(1),o=i.n(n),a=i(0);e.a=function(t,e,n){var r=o()({method:"getDeviceLogByDay",req_id:i.i(a.d)(),params:{start_time:t,device_uuid:i.i(a.e)()}});HdIot.Device.getDeviceLogByDay({data:r,onListener:function(t){t=JSON.parse(t),i.i(a.a)("getDeviceLogByDay",r,t),504==t.code?i.i(a.b)(n):i.i(a.b)(e)&&e(t)}})}},function(t,e,i){"use strict";var n=i(1),o=i.n(n),a=i(0);e.a=function(t,e,n,r){var c=o()({method:"getDeviceMonthHistory",req_id:i.i(a.d)(),params:{device_uuid:i.i(a.e)(),year:t,month:e}});HdIot.Device.getDeviceMonthHistory({data:c,onListener:function(t){i.i(a.a)("getDeviceMonthHistory",c,t),t=JSON.parse(t),504==t.code?i.i(a.b)(r)&&r():i.i(a.b)(n)&&n(t)}})}},function(t,e,i){"use strict";var n=i(0);e.a=function(t,e){HdIot.Device.getSnapShot({data:"",onListener:function(o){i.i(n.a)("getSnapShot","",o),o=JSON.parse(o),o.result?i.i(n.b)(t)&&t(o.result,o.timestamp||o.result.timestamp):i.i(n.b)(e)&&e(o)}})}},function(t,e,i){"use strict";var n=i(12),o=i(16),a=i(13),r=i(14),c=i(15);e.a={control:n.a,getSnapShot:o.a,getDeviceLog:a.a,getDeviceLogByDay:r.a,getDeviceMonthHistory:c.a}},function(t,e,i){"use strict";var n=i(20),o=i(19);e.a={ready:n.a,beforeReady:n.b,runReadyCallbacks:n.c,onDeviceListen:o.a,runDeviceListenCallback:o.b}},function(t,e,i){"use strict";function n(t){i.i(a.b)(t)&&r.push(t)}function o(t){i.i(a.a)("onDeviceListen","",t),r.forEach(function(e){e(t)})}var a=i(0);e.a=n,e.b=o;var r=[]},function(t,e,i){"use strict";function n(t){i.i(r.b)(t)&&t()}function o(t){i.i(r.b)(t)&&c.push(t)}function a(){i.i(r.a)("ready","",""),c.forEach(function(t){t()}),c=[]}var r=i(0);e.a=n,e.b=o,e.c=a;var c=[]},function(t,e,i){"use strict";var n=i(1),o=i.n(n),a=i(0);e.a=function(t,e,i,n,r){n=n||"确定",r=r||"取消",HdIot.UI.alert({data:o()({title:t,message:e,okText:n,cancelText:r}),onListener:function(){a.b&&i()}})}},function(t,e,i){"use strict";var n=i(21),o=i(25),a=i(23),r=i(24),c=i(26);e.a={alert:n.a,toast:o.a,showLoading:a.a,hideLoading:a.b,setWebViewTouchRect:r.a,toggleHeadAndFoot:c.a}},function(t,e,i){"use strict";function n(){HdIot.UI.showLoading({data:""})}function o(){i.i(a.a)("hideLoading","",""),HdIot.UI.hideLoading({data:""})}var a=i(0);e.a=n,e.b=o},function(t,e,i){"use strict";var n=i(1),o=i.n(n),a=i(0);e.a=function(t,e,n,r){var c=document.body.getBoundingClientRect();t=i.i(a.c)(t,c.width),e=i.i(a.c)(e,c.height),n=i.i(a.c)(n,c.width),r=i.i(a.c)(r,c.height);var u=o()({left:t,right:n,top:e,bottom:r});HdIot.UI.setTouchRect({data:u}),i.i(a.a)("setWebViewTouchRect",u,"")}},function(t,e,i){"use strict";var n=i(1),o=i.n(n),a=i(0);e.a=function(t,e){e=e||3e3;var n=o()({data:{message:t,duration:e}});HdIot.UI.toast(n),i.i(a.a)("toast",n,"")}},function(t,e,i){"use strict";var n=i(1),o=i.n(n),a=i(0);e.a=function(t){HdIot.UI.toggleHeadAndFoot({data:o()({show_head_foot:t})}),i.i(a.a)("toggleHeadAndFoot",t,"")}},function(t,e,i){"use strict";var n=i(0);e.a=function(t){HdIot.Util.getNetworkType({data:"",onListener:function(e){i.i(n.a)("getNetworkType","",e),i.i(n.b)(t)&&t(e)}})}},function(t,e,i){"use strict";var n=i(27),o=i(30),a=i(29),r=i(31);e.a={getNetworkType:n.a,reload:o.a,post:a.a,sendNotification:r.a}},function(t,e,i){"use strict";var n=i(1),o=i.n(n),a=i(0);e.a=function(t,e,n,r){var c=o()({url:t,data:e});HdIot.Util.post({data:c,onListener:function(t){i.i(a.b)(n)&&n(t),i.i(a.a)("post",c,t)}})}},function(t,e,i){"use strict";e.a=function(){HdIot.Util.reload({data:""})}},function(t,e,i){"use strict";var n=i(1),o=i.n(n),a=i(0);e.a=function(t,e){var n=o()({title:t,message:e});HdIot.Util.sendNotification({data:n}),i.i(a.a)("sendNotification",n,"")}},function(t,e,i){var n=i(33),o=n.JSON||(n.JSON={stringify:JSON.stringify});t.exports=function(t){return o.stringify.apply(o,arguments)}},function(t,e){var i=t.exports={version:"2.4.0"};"number"==typeof __e&&(__e=i)},,,,,,,,,,,,,,,,,,function(t,e,i){t.exports=i(3)}]);
//# sourceMappingURL=sdk.3fb6b089e8c7577d65b8.js.map