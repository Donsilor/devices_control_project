import api from './core/api'
import bridge from './bridge/webscoket'

api.init(bridge)
bridge.init()

window.HdSmart = api
