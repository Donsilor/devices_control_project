export function on (type, callback){
    document.addEventListener(type, ({data})=>callback(data), false)
}

export function off (type, callback){
    document.removeEventListener(type, callback, false)
}

export function trigger (type, param = {}) {
    const event = document.createEvent("Events")
    event.initEvent(type, false, true)
    event.data = param
    document.dispatchEvent(event)
}
