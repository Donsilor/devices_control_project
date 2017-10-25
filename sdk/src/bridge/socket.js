import io from 'socket.io-client'
const socket = io()
const noop = () => {}

export default {
    io: socket,
    isReady: false,
    send(method, data = '', callback = noop) {
        var callbackName = method + '_callback_' + Date.now()
        data = data || {}
        data.callbackName = callbackName
        socket.on(callbackName, callback)
        socket.emit(method, data)
    }
}
