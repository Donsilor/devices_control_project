!function(e){function t(o){if(n[o])return n[o].exports;var i=n[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="./",t(t.s=5)}([function(e,t,n){e.exports={default:n(2),__esModule:!0}},,function(e,t,n){var o=n(3),i=o.JSON||(o.JSON={stringify:JSON.stringify});e.exports=function(e){return i.stringify.apply(i,arguments)}},function(e,t){var n=e.exports={version:"2.4.0"};"number"==typeof __e&&(__e=n)},,function(e,t,n){e.exports=n(6)},function(e,t,n){"use strict";function o(e){return"function"==typeof e}function i(){var e="xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=10*Math.random()|0;return("x"==e?t:3&t|8).toString(16)});return e=e.replace(/^0/,"1")}function r(){return window.device_uuid}function a(e,t,n){window.apiLog(e,t,n)}function c(e,t){if("number"==typeof e)return e;if("string"==typeof e){var n=parseInt(e);if(e.indexOf("%")>-1)return t*n/100;if(!isNaN(n))return n}return 0}function d(e){o(e)&&e()}function u(e){o(e)&&v.push(e)}function s(){a("ready","",""),v.forEach(function(e){e()}),v=[]}function f(e){o(e)&&x.push(e)}function g(e){a("onDeviceListen","",e),x.forEach(function(t){t(e)})}function p(){HdIot.UI.showLoading({data:""})}function l(){a("hideLoading","",""),HdIot.UI.hideLoading({data:""})}Object.defineProperty(t,"__esModule",{value:!0});var v=[],x=[],y={ready:d,beforeReady:u,runReadyCallbacks:s,onDeviceListen:f,runDeviceListenCallback:g},m=n(0),h=n.n(m),w=function(e,t,n,c,d,u){var s=h.a({method:e,req_id:i(),params:{device_uuid:r(),cmd:t,attr:n}}),f=!1,g=setTimeout(function(){f=!0,a("control","",{result:"超时"}),d()},u||8e3);return HdIot.Device.control({data:s,onListener:function(e){if(f)return!1;clearTimeout(g),e=JSON.parse(e),a("control",s,e),504==e.code?d(e):o(c)&&c()}}),g},D=function(e,t){HdIot.Device.getSnapShot({data:"",onListener:function(n){a("getSnapShot","",n),n=JSON.parse(n),n.result?o(e)&&e(n.result,n.timestamp||n.result.timestamp):o(t)&&t(n)}})},L=n(0),_=n.n(L),H=function(e,t,n,i){var r=_.a(t);HdIot.Device.getDeviceLog({method:e,data:r,onListener:function(t){a("postRequest_"+e,r,t),t=JSON.parse(t),504==t.code?o(i)&&i(t):t.result&&o(n)&&n(t.result)}})},I=n(0),S=n.n(I),b=function(e,t,n){var c=S.a({method:"getDeviceLog",req_id:i(),params:{device_uuid:r(),start_time:e.start_time,items_per_page:"number"==typeof e.items_per_page?e.items_per_page:8,direction:e.direction}});HdIot.Device.getDeviceLog({data:c,onListener:function(e){a("getDeviceLog",c,e),e=JSON.parse(e),504==e.code?o(n)&&n(e):e.result&&o(t)&&t(e.result)}})},N=n(0),O=n.n(N),U=function(e,t,n){var c=O.a({method:"getDeviceLogByDay",req_id:i(),params:{start_time:e,device_uuid:r()}});HdIot.Device.getDeviceLogByDay({data:c,onListener:function(e){e=JSON.parse(e),a("getDeviceLogByDay",c,e),504==e.code?o(n):o(t)&&t(e)}})},R=n(0),J=n.n(R),T=function(e,t,n,c){var d=J.a({method:"getDeviceMonthHistory",req_id:i(),params:{device_uuid:r(),year:e,month:t}});HdIot.Device.getDeviceMonthHistory({data:d,onListener:function(e){a("getDeviceMonthHistory",d,e),e=JSON.parse(e),504==e.code?o(c)&&c():o(n)&&n(e)}})},k={control:w,getSnapShot:D,postRequest:H,getDeviceLog:b,getDeviceLogByDay:U,getDeviceMonthHistory:T},M=n(0),q=n.n(M),C=function(e,t,n,i,r){i=i||"确定",r=r||"取消",HdIot.UI.alert({data:q.a({title:e,message:t,okText:i,cancelText:r}),onListener:function(){o&&n()}})},B=n(0),j=n.n(B),A=function(e,t){t=t||3e3;var n=j.a({data:{message:e,duration:t}});HdIot.UI.toast(n),a("toast",n,"")},E=n(0),F=n.n(E),P=function(e,t,n,o){var i=document.body.getBoundingClientRect();e=c(e,i.width),t=c(t,i.height),n=c(n,i.width),o=c(o,i.height);var r=F.a({left:e,right:n,top:t,bottom:o});HdIot.UI.setTouchRect({data:r}),a("setWebViewTouchRect",r,"")},V=n(0),W=n.n(V),z=function(e){HdIot.UI.toggleHeadAndFoot({data:W.a({show_head_foot:e})}),a("toggleHeadAndFoot",e,"")},G={alert:C,toast:A,showLoading:p,hideLoading:l,setWebViewTouchRect:P,toggleHeadAndFoot:z},K=function(e){HdIot.Util.getNetworkType({data:"",onListener:function(t){a("getNetworkType","",t),o(e)&&e(t)}})},Q=function(){HdIot.Util.reload({data:""})},X=n(0),Y=n.n(X),Z=function(e,t,n,i){var r=Y.a({url:e,data:t});HdIot.Util.post({data:r,onListener:function(e){o(n)&&n(e),a("post",r,e)}})},$=n(0),ee=n.n($),te=function(e,t){var n=ee.a({title:e,message:t});HdIot.Util.sendNotification({data:n}),a("sendNotification",n,"")},ne={getNetworkType:K,reload:Q,post:Z,sendNotification:te};window.HdSmart={ready:y.beforeReady,onDeviceListen:y.onDeviceListen},window.apiLog=function(e,t,n){};var oe=!1;window.onDeviceJsReady=function(){if(!window.HdIot)throw new Error("当前环境没有可用的api");oe||(window.HdSmart.ready=y.ready,window.HdSmart.Device=k,window.HdSmart.UI=G,window.HdSmart.Util=ne,oe=!0),y.runReadyCallbacks()},window.onDeviceChange=function(e){y.runDeviceListenCallback(e)}}]);