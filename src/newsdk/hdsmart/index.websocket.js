import api from './core/api'
import bridge from './bridge/webscoket'

api.init(bridge)

window.HdSmart = api
