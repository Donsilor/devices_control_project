var _cbs = {}

export function on (type, callback){
    // document.addEventListener(type, ({data})=>callback(data), false)
    (_cbs[type] || (_cbs[type] = [])).unshift(callback)
}

export function off (type, callback){
    //document.removeEventListener(type, callback, false)
    if (!type) return
    if (!callback) return delete _cbs[type]

    var cbs = _cbs[type] || []
    var i
    while (cbs && ~(i = cbs.indexOf(callback))) cbs.splice(i, 1)
}

export function trigger (type) {
    // const event = document.createEvent("Events")
    // event.initEvent(type, false, true)
    // event.data = param
    // document.dispatchEvent(event)
    var cbs = _cbs[type]
    if (cbs) {
        var args = [].slice.call(arguments, 1)
        var l = cbs.length
        while (l--) cbs[l].apply(this, args)
      }
}
