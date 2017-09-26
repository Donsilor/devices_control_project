import io from 'socket.io-client'

import {
    on,
    off,
    trigger,
} from '../event'

import { apiList } from '../constant'

const noop = ()=>{}

const bridge = {

    socket: null,
    isConnect: false,
    isReady: false,

    init (e) {
        this.socket = io('http://localhost')
        this.socket.on('connect', ()=>{
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

        this.socket.emit(method, data, (response)=>{
            callback(response)
        })
    },

    registerHandler (method, callback) {
        this.socket.on(method, (data)=>{
            callback(data)
        })
    },

}

window.onDeviceJsReady = function(){
    trigger(apiList.ready)
    bridge.isReady = true
}

export default bridge
