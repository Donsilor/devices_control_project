!function(t){function e(i){if(n[i])return n[i].exports;var o=n[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var n={};e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="./",e(e.s=252)}({1:function(t,e,n){"use strict";function i(t){return"function"==typeof t}function o(){var t="xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g,function(t){var e=10*Math.random()|0;return("x"==t?e:3&e|8).toString(16)});return t=t.replace(/^0/,"1")}function a(){return window.device_uuid}function r(t,e,n){window.apiLog(t,e,n)}function c(t,e){if("number"==typeof t)return t;if("string"==typeof t){var n=parseInt(t);if(t.indexOf("%")>-1)return e*n/100;if(!isNaN(n))return n}return 0}e.b=i,e.d=o,e.e=a,e.a=r,e.c=c},161:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(2),o=n.n(i),a=(n(177),0);window.apiLog=function(t,e,n){if(a+=1,console.log("<<<---"+a+".api："+t+" log begin---"),console.warn("传入值："+(""===e?"空":e)),n){var i=void 0,r=void 0;"string"==typeof n?(i=n,r=JSON.parse(n)):(r=n,i=o()(n)),console.warn("返回值(object):",r),console.warn("返回值(string):",i)}else console.warn("返回值:","无");console.log("---"+a+".api："+t+" log end---\x3e>>")}},171:function(t,e,n){"use strict";var i=n(2),o=n.n(i),a=n(1);e.a=function(t,e,i,r,c){var u=o()({method:t,req_id:n.i(a.d)(),params:{device_uuid:n.i(a.e)(),cmd:e,attr:i}});HdIot.Device.control({data:u,onListener:function(t){t=JSON.parse(t),n.i(a.a)("control",u,t),504==t.code?c(t):n.i(a.b)(r)&&r()}})}},172:function(t,e,n){"use strict";var i=n(2),o=n.n(i),a=n(1);e.a=function(t,e,i){var r=o()({method:"getDeviceLog",req_id:n.i(a.d)(),params:{device_uuid:n.i(a.e)(),start_time:t.start_time,items_per_page:"number"==typeof t.items_per_page?t.items_per_page:8,direction:t.direction}});HdIot.Device.getDeviceLog({data:r,onListener:function(t){n.i(a.a)("getDeviceLog",r,t),t=JSON.parse(t),504==t.code?n.i(a.b)(i)&&i(t):t.result&&n.i(a.b)(e)&&e(t.result)}})}},173:function(t,e,n){"use strict";var i=n(2),o=n.n(i),a=n(1);e.a=function(t,e,i){var r=o()({method:"getDeviceLogByDay",req_id:n.i(a.d)(),params:{start_time:t,device_uuid:n.i(a.e)()}});HdIot.Device.getDeviceLogByDay({data:r,onListener:function(t){t=JSON.parse(t),n.i(a.a)("getDeviceLogByDay",r,t),504==t.code?n.i(a.b)(i):n.i(a.b)(e)&&e(t)}})}},174:function(t,e,n){"use strict";var i=n(2),o=n.n(i),a=n(1);e.a=function(t,e,i,r){var c=o()({method:"getDeviceMonthHistory",req_id:n.i(a.d)(),params:{device_uuid:n.i(a.e)(),year:t,month:e}});HdIot.Device.getDeviceMonthHistory({data:c,onListener:function(t){n.i(a.a)("getDeviceMonthHistory",c,t),t=JSON.parse(t),504==t.code?n.i(a.b)(r)&&r():n.i(a.b)(i)&&i(t)}})}},175:function(t,e,n){"use strict";var i=n(1);e.a=function(t,e){HdIot.Device.getSnapShot({data:"",onListener:function(o){n.i(i.a)("getSnapShot","",o),o=JSON.parse(o),o.result?n.i(i.b)(t)&&t(o.result,o.timestamp||o.result.timestamp):n.i(i.b)(e)&&e(o)}})}},176:function(t,e,n){"use strict";var i=n(171),o=n(175),a=n(172),r=n(173),c=n(174);e.a={control:i.a,getSnapShot:o.a,getDeviceLog:a.a,getDeviceLogByDay:r.a,getDeviceMonthHistory:c.a}},177:function(t,e,n){"use strict";var i=n(178),o=n(176),a=n(182),r=n(188);window.HdSmart={ready:i.a.beforeReady,onDeviceListen:i.a.onDeviceListen},window.apiLog=function(t,e,n){};var c=!1;window.onDeviceJsReady=function(){if(!window.HdIot)throw new Error("当前环境没有可用的api");c||(window.HdSmart.ready=i.a.ready,window.HdSmart.Device=o.a,window.HdSmart.UI=a.a,window.HdSmart.Util=r.a,c=!0),i.a.runReadyCallbacks()},window.onDeviceChange=function(t){i.a.runDeviceListenCallback(t)}},178:function(t,e,n){"use strict";var i=n(180),o=n(179);e.a={ready:i.a,beforeReady:i.b,runReadyCallbacks:i.c,onDeviceListen:o.a,runDeviceListenCallback:o.b}},179:function(t,e,n){"use strict";function i(t){n.i(a.b)(t)&&r.push(t)}function o(t){n.i(a.a)("onDeviceListen","",t),r.forEach(function(e){e(t)})}var a=n(1);e.a=i,e.b=o;var r=[]},180:function(t,e,n){"use strict";function i(t){n.i(r.b)(t)&&t()}function o(t){n.i(r.b)(t)&&c.push(t)}function a(){c.forEach(function(t){t()}),c=[]}var r=n(1);e.a=i,e.b=o,e.c=a;var c=[]},181:function(t,e,n){"use strict";var i=n(2),o=n.n(i),a=n(1);e.a=function(t,e,n,i,r){i=i||"确定",r=r||"取消",HdIot.UI.alert({data:o()({title:t,message:e,okText:i,cancelText:r}),onListener:function(){a.b&&n()}})}},182:function(t,e,n){"use strict";var i=n(181),o=n(185),a=n(183),r=n(184),c=n(186);e.a={alert:i.a,toast:o.a,showLoading:a.a,hideLoading:a.b,setWebViewTouchRect:r.a,toggleHeadAndFoot:c.a}},183:function(t,e,n){"use strict";function i(){HdIot.UI.showLoading({data:""})}function o(){HdIot.UI.hideLoading({data:""})}e.a=i,e.b=o},184:function(t,e,n){"use strict";var i=n(2),o=n.n(i),a=n(1);e.a=function(t,e,i,r){var c=document.body.getBoundingClientRect();t=n.i(a.c)(t,c.width),e=n.i(a.c)(e,c.height),i=n.i(a.c)(i,c.width),r=n.i(a.c)(r,c.height);var u=o()({left:t,right:i,top:e,bottom:r});HdIot.UI.setTouchRect({data:u}),n.i(a.a)("setWebViewTouchRect",u,"")}},185:function(t,e,n){"use strict";var i=n(2),o=n.n(i),a=n(1);e.a=function(t,e){e=e||3e3;var i=o()({data:{message:t,duration:e}});HdIot.UI.toast(i),n.i(a.a)("toast",i,"")}},186:function(t,e,n){"use strict";var i=n(2),o=n.n(i),a=n(1);e.a=function(t){HdIot.UI.toggleHeadAndFoot({data:o()({show_head_foot:t})}),n.i(a.a)("toggleHeadAndFoot",t,"")}},187:function(t,e,n){"use strict";var i=n(1);e.a=function(t){HdIot.Util.getNetworkType({data:"",onListener:function(e){n.i(i.a)("getNetworkType","",e),n.i(i.b)(t)&&t(e)}})}},188:function(t,e,n){"use strict";var i=n(187),o=n(190),a=n(189),r=n(191);e.a={getNetworkType:i.a,reload:o.a,post:a.a,sendNotification:r.a}},189:function(t,e,n){"use strict";var i=n(2),o=n.n(i),a=n(1);e.a=function(t,e,i,r){var c=o()({url:t,data:e});HdIot.Util.post({data:c,onListener:function(t){n.i(a.b)(i)&&i(t),n.i(a.a)("post",c,t)}})}},190:function(t,e,n){"use strict";e.a=function(){HdIot.Util.reload({data:""})}},191:function(t,e,n){"use strict";var i=n(2),o=n.n(i),a=n(1);e.a=function(t,e){var i=o()({title:t,message:e});HdIot.Util.sendNotification({data:i}),n.i(a.a)("sendNotification",i,"")}},196:function(t,e,n){var i=n(4),o=i.JSON||(i.JSON={stringify:JSON.stringify});t.exports=function(t){return o.stringify.apply(o,arguments)}},2:function(t,e,n){t.exports={default:n(196),__esModule:!0}},252:function(t,e,n){t.exports=n(161)},4:function(t,e){var n=t.exports={version:"2.4.0"};"number"==typeof __e&&(__e=n)}});
//# sourceMappingURL=sdk.0c0b53acc61b6354a763.js.map