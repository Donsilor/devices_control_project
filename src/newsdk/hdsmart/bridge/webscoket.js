import io from 'socket.io-client'

import {
    on,
    off,
    trigger,
} from '../event'

import {
    apiList,
    tipMsg,
} from '../constant'

const noop = ()=>{}

const bridge = {

    socket: null,
    isConnect: false,
    isReady: false,

    init (e) {
        this.socket = io('http://localhost')
        this.socket.on('connect', ()=>{
            console.log('websocket is connect')
            this.isConnect = true
            if(!this.isReady){
                onDeviceJsReady()
            }
        })
        this.socket.on('disconnect', ()=>{
            console.error('websocket is disconnect')
            this.isConnect = false
        })
    },

    send (method, data = '', callback = noop, autoParseResponse = true) {
        if(!this.isConnect){
            console.error('websocket is disconnect')
            return
        }
        console.log(`%c ws.${method} called success :`, 'background:#aaa;color:green', data)
        this.socket.emit(method, data, (response)=>{
            console.log(`ws.${method} callback :`, response)
            callback(response)
        })
    },

    registerHandler (method, callback) {
        this.socket.on(method, (data)=>{
            console.log(`%c${method} from app:`, 'background:#aaa;color:yellow', data)
            callback(data)
        })
    },

}

window.onDeviceJsReady = function(){
    trigger(apiList.ready)
    bridge.isReady = true
}

export default bridge
