
(function(){

    if(window.HdSmart){
      return
    }

    function iosCall(method, data, callback){
      if(!window.JSBridgeEventHandler){
        return
      }

      method = method.replace(/\w+\./,'')
      data = data || ''
      JSBridgeEventHandler.callNativeFunction(method, data, callback)
    }

    function androidCall(method, data, callback, toJSON){
      if(!window.HdIot) {
          return
      }

      data = data || ''
      toJSON = toJSON !== false
      console.log(method + ' = ' + JSON.stringify(data))
      try{
          var fn = method.split('.').reduce(function(fn, method){
              return fn[method]
          }, HdIot)

          var options = {
              data: JSON.stringify(data),
              onListener(response) {
                  console.log(method + ' res = ' + response)
                  if(toJSON){
                      callback(JSON.parse(response))
                  }else{
                      callback(response)
                  }
              }
          }
          if(method == 'UI.toast'){
              options = JSON.stringify({
                data: data
              })
          }
          fn(options)

      }catch(e){

      }
    }

    function guid() {
      return getRandomInt(3000000, 5000000);//1, 10000
    }

    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }

    var bridge = {
      sendEvent: /iphone|ipad/i.test(navigator.userAgent) ? iosCall : androidCall
    }

    var apiList = {
      ready: 'ready',
      device_change: 'device_change',
      device_control: 'Device.control',
      device_getsnapshot: 'Device.getSnapShot',
      ui_alert: 'UI.alert',
      ui_showloading: 'UI.showLoading',
      ui_hideloading: 'UI.hideLoading',
      ui_toast: 'UI.toast',
      ui_toggleheadandfoot: 'UI.toggleHeadAndFoot',
      util_dispatchevent: 'Util.dispatchEvent'
    }

    var tipMsg = {
      timeout: '请求超时',
      e504: '网络异常，请稍后重试',
      e505: '操作失败，设备离线',
      jsonerr: 'JSON解析错误'
  }

    var _cbs = {}
    var events = {
      on: function(type, callback){
        (_cbs[type] || (_cbs[type] = [])).unshift(callback)
      },
      off: function(type, callback){
        if (!type) return
        if (!callback) return delete _cbs[type]

        var cbs = _cbs[type] || []
        var i
        while (cbs && ~(i = cbs.indexOf(callback))) cbs.splice(i, 1)
      },
      trigger: function(type){
        var cbs = _cbs[type]
        if (cbs) {
          var args = [].slice.call(arguments, 1)
          var l = cbs.length
          while (l--) cbs[l].apply(this, args)
        }
      }
    }


    var isReady = false
    var oldDeviceInfo = {}

    var sdk = {
      ready: function(callback){
        if(isReady){
          callback()
        }else{
          events.on(apiList.ready, callback)
        }
      },
      onDeviceListen: function(callback){
        events.on(apiList.device_change, callback)
      },
      offDeviceListen: function(callback){
        events.off(apiList.device_change, callback)
      }
    }

    sdk.Device = {
      getInfo: function(){
        return oldDeviceInfo
      },
      getSnapShot: function(success, fail){
        // 设置timer
        var isTimeout = false
        var timer = setTimeout(function(){
          isTimeout = true
          fail({code: -1, msg: 'request timeout'})
        }, 8000)

        var callback = function(data){
          if (isTimeout) {
              return false
          }
          clearTimeout(timer)
          if(data && data.code === 0){
            oldDeviceInfo = data.result
            success(data.result)
          }else{
            fail(data)
          }

        }

        var callback_wrap = function(data){
          if(data.method == 'dm_get_device_info'){
            callback(data)
            sdk.offDeviceListen(callback_wrap)
          }
        }

        bridge.sendEvent(apiList.device_getsnapshot, '', function(data){
          if(data.msg == 'TcpClient send msg success'){
            sdk.onDeviceListen(callback_wrap)
          }else{
            callback(data)
          }
        })


      },
      control: function(options, success, fail){
        var opt = Object.assign({
              req_id: guid(),
              timestamp: Date.now(),
              method: 'dm_set',
              params: {}
          }, options)

          opt.params.device_uuid = window.device_uuid || oldDeviceInfo.device_uuid
          opt.params.user_id = window.user_id ||  oldDeviceInfo.user_id
          opt.params.family_id = window.family_id || oldDeviceInfo.family_id

          var isTimeout = false
          var timer = setTimeout(function(){
              isTimeout = true
              fail({code: -1, msg: 'request timeout'})
          }, 8000)

          var callback = function(data){
            if (isTimeout) {
                return false
            }
            clearTimeout(timer)
            if(data.code === 0) {
                success(data)
            }else{
                fail(data)
            }
          }

          var callback_wrap = function(data){
            if(data.req_id == opt.req_id){
              callback(data)
              sdk.offDeviceListen(callback_wrap)
            }
          }

          bridge.sendEvent(apiList.device_control, opt, function(data){
            if(data.msg == 'TcpClient send msg success'){
              sdk.onDeviceListen(callback_wrap)
            }else{
              callback(data)
            }
          })
      }
    }

    sdk.UI = {
      showLoading: function(){
        bridge.sendEvent(apiList.ui_showloading)
      },
      hideLoading: function(){
        bridge.sendEvent(apiList.ui_hideloading)
      },
      toast: function(message, duration){
        bridge.sendEvent(apiList.ui_toast, {
          message: message,
          duration: duration || 3000
        })
      },
      alert: function(options, callback){
        var opt = Object.assign({
            okText: '确定',
            cancelText: '取消',
            dialogStyle: 0,
            isCancelEnable: ''
        }, options)
        bridge.sendEvent(apiList.ui_alert, opt, callback)
      },
      toggleHeadAndFoot: function(visible){
        bridge.sendEvent(apiList.ui_toggleheadandfoot, {
          show_head_foot: visible
        })
      }
    }

    sdk.Util = {
      dispatchEvent: function(params, callback){
        bridge.sendEvent(apiList.util_dispatchevent, params, function(data){

          var error = null
          if(typeof data === 'string'){
              //HACK: app返回json数据有问题，没找到解决方案
              try{
                  data = JSON.parse(data)
              }catch(e){
                  try{
                      data = data.replace(/\n/g,'\\n');
                      data = data.replace(/:"([^{[]*?)("[,}])/g,function(match,v,q){
                          return ':"' + v.replace(/"/g,'\\"') + q;
                      });
                      data = JSON.parse(data)
                  }catch(e){
                      error = {
                          errormsg: tipMsg.jsonerr
                      }
                  }
              }
          }else if(typeof data === 'undefined'){
              data = {}
          }

          if(data.code === 504){
              error = {
                  errormsg: tipMsg.e504
              }
          }

          if(data.code === 505){
              error = {
                  errormsg: tipMsg.e505
              }
          }

          callback && callback(error, data)

          }, false)
      }
    }

    window.onDeviceJsReady = function(){
      setTimeout(function(){
        if(!isReady){
          isReady = true
          events.trigger(apiList.ready)
        }
      }, 100)
    }

    window.onDeviceChange = function(data){
      console.log('device change = ' + JSON.stringify(data))
      if(data && data.msg == 'TcpClient send msg success'){
        return
      }
      events.trigger(apiList.device_change, data)
    }

    window.HdSmart = sdk

  })();
