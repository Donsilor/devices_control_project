import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        //是否是首次加载
        isInitLoad: false,
        //是否超时/错误
        isLoadError: false,
        //设备基本信息
        device: {
            device_uuid: '',
            device_id: '',
            family_id: '',
            room_id: '',
            device_category_id: '',
            device_name: ''
        },
        //设备属性
        deviceAttrs: {},
        //设备告警
        deviceErrors: [],
        //确认过的告警，只保存code值
        deviceErrorsConfirmed: []
    },
    mutations: {
        setDeviceInfo(state, result) {
            for(let k in result){   
                if(k === 'attribute'){  
                    let attribute = result[k]
                    if(attribute && Object.keys(attribute).length){ 
                        state.deviceAttrs = attribute
                        if(attribute.error){  
                            state.deviceErrors = attribute.error
                        }
                    }
                }else{  
                    state.device[k] = result[k]
                }
            }
        }
    },
    actions: {
        getDeviceInfo({ commit }){    
            HdSmart.Device.getSnapShot(res => { 
                commit('setDeviceInfo', res)
            })
        },
        addListener({ commit }){    
            HdSmart.onDeviceStateChange(res => {
                commit('setDeviceInfo', res.result)
            })
        }
    }
})


HdSmart.ready(() => {
    store.dispatch('getDeviceInfo')
    store.dispatch('addListener')
})


export default store