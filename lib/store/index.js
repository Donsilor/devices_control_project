/**
 * 已经接入的设备历史原因不想改动
 *
 * @summary 全局设备状态管理
 * @author songwh
 *
 * Created at     : 2019-08-05 11:32:49
 * Last modified  : 2019-08-23 08:59:05
 */
import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 是否是首次加载
    isInitLoad: false,
    // 是否超时/错误
    isLoadError: '',
    networkStatus:'',
    viewHelpstatus:"",
    // 设备基本信息
    device: {
      device_uuid: '',
      device_id: '',
      family_id: '',
      room_id: '',
      device_category_id: '',
      device_name: '',
      room_name: '',
     
      device_access_type: '', // 设备接入类型 0:中控接入, 1:云云对接, 2:APP对接, 3:云中控接入
      stateChange: false, // 设备状态改变
    },
    // 设备属性
    deviceAttrs: {},
    ThirddeviceAttrs: {},
    // 设备告警
    deviceErrors: [],
    // 确认过的告警，只保存code值
    deviceErrorsConfirmed: [],
  },
  getters: {
    // 设备开关
    isClose: state => (state.deviceAttrs.switch === 'on' ? false : true),
    // 设备状态
    isOffline: state => (state.deviceAttrs.connectivity === 'online' ? false : true),
    // 网络状态
    networkStatus: state => state.networkStatus,
    viewHelpstatus:state => state.viewHelpstatus
  },
  mutations: {
    toggleState(state) {
      state.device.stateChange = !state.device.stateChange
    },
    setDeviceInfo(state, result) {
      // console.log('result',result)
      for (let k in result) {
        if (k === 'attribute') {
          let attribute = result[k]
          if (attribute && Object.keys(attribute).length) {
            // 空调开关机状态为switchStatus
            if(attribute.switchStatus){
              attribute.switch = attribute.switchStatus
            }
            state.deviceAttrs = Object.assign({}, state.deviceAttrs, attribute)
            if (attribute.error) {
              state.deviceErrors = attribute.error
            }
          }
        } else if (k === 'third_attribute') {
          let third_attribute = result[k]
          if (third_attribute && Object.keys(third_attribute).length) {
            // 空调开关机状态为switchStatus
            if(third_attribute.switchStatus){
              third_attribute.switch = third_attribute.switchStatus
            }
            state.ThirddeviceAttrs = Object.assign({}, state.ThirddeviceAttrs, third_attribute)
            if (third_attribute.error) {
              state.deviceErrors = third_attribute.error
            }
          }
        } else {
          state.device[k] = result[k]
        }
      }
    },
    setDeviceName(state, name) {
      state.device.device_name = name
    },
    setRoomName(state, name) {
      state.device.room_name = name
    },
    setNetworkStatus1(state, name) {
      console.log(state,name)
      
      state.networkStatus = name
    },
    setViewHelpstatus(state, name) {
      console.log(state,name)
      
      state.viewHelpstatus = name
    },
    setDeviceAttrs(state, attrs) {
      state.deviceAttrs = attrs
    },
    setDeviceAttrsThird(state, attrs) {
      state.ThirddeviceAttrs = attrs
    },
    setLoadError(state, val){
      state.isLoadError = val
    },
  },

  actions: {
    // 获取设备属性
    getDeviceInfo({ commit}) {
      // console.log('aaaa1',state)
      HdSmart.UI.showLoading()
      return new Promise((resolve, reject) => {
        HdSmart.Device.getSnapShot(res => {
          // console.log('bbb1',res)
          // HdSmart.UI.hideLoading()
          commit('setDeviceInfo', res)
          commit('setLoadError', false)
          if (window.device_uuid) {
            window.localStorage.setItem(window.device_uuid, JSON.stringify(res.attribute))
          }
          if (window.device_id) {
            window.localStorage.setItem(window.device_id, JSON.stringify(res.third_attribute))
          }
          HdSmart.UI.hideLoading()
          resolve(res)
        },
        (err) => {
          HdSmart.UI.hideLoading()
          commit('setLoadError', true)
          reject(err)
        })
      })
    },
    // 获取网络状态
    getNetworkInfo({ commit}) {
      // console.log('aaaa1',state)
      HdSmart.UI.showLoading()
      return new Promise((resolve, reject) => {
        HdSmart.Device.getNetworkStatus(res => {
          // console.log('向APP发起请求')
          
          // commit('setNetworkStatus',res)
          // console.log('bbb1',res)
          // HdSmart.UI.hideLoading()
          // commit('setDeviceInfo', res)
          // commit('setLoadError', false)
          // if (window.device_uuid) {
          //   window.localStorage.setItem(window.device_uuid, JSON.stringify(res.attribute))
          // }
          // if (window.device_id) {
          //   window.localStorage.setItem(window.device_id, JSON.stringify(res.third_attribute))
          // }
          HdSmart.UI.hideLoading()

          resolve(res)
        },
        (err) => {
          // console.log('请求失败')
          
          HdSmart.UI.hideLoading()
          commit('setLoadError', true)
          reject(err)
        })
      })
    },
    setNetworkStatus({commit},res){
      // console.log('set',res)
      // console.log('把获取的指'+res+"存入仓库中")
      
      commit('setNetworkStatus1', res)
    },
    // 获取网络状态
    getViewHelpInfo({ commit}) {
      // console.log('aaaa1',state)
      HdSmart.UI.showLoading()
      return new Promise((resolve, reject) => {
        HdSmart.Device.getViewHelp(res => {
          console.log('向APP发起请求')
          
          // commit('setNetworkStatus',res)
          console.log('bbb1',res)
          // HdSmart.UI.hideLoading()
          // commit('setDeviceInfo', res)
          // commit('setLoadError', false)
          // if (window.device_uuid) {
          //   window.localStorage.setItem(window.device_uuid, JSON.stringify(res.attribute))
          // }
          // if (window.device_id) {
          //   window.localStorage.setItem(window.device_id, JSON.stringify(res.third_attribute))
          // }
          HdSmart.UI.hideLoading()

          resolve(res)
        },
        (err) => {
          // console.log('请求失败')
          
          HdSmart.UI.hideLoading()
          commit('setLoadError', true)
          reject(err)
        })
      })
    },
    setViewHelpInfo({commit},res){
      // console.log('set',res)
      // console.log('把获取的指'+res+"存入仓库中")
      
      commit('setViewHelpstatus', res)
    },
    // 监听设备属性变化
    addListener({ commit }) {
      // console.log('aaaa2',state)
      HdSmart.onDeviceStateChange(res => {
        console.log('监听设备属性',res)
        commit('toggleState')
        commit('setDeviceInfo', res.result)
        if (window.device_uuid) {
          window.localStorage.setItem(window.device_uuid, JSON.stringify(res.attribute))
        }
        if (window.device_id) {
          window.localStorage.setItem(window.device_id, JSON.stringify(res.third_attribute))
        }
      })
    },
    // 控制设备
    doControlDevice( { commit, state }, params) {
      HdSmart.UI.showLoading()
      // 对接方式，选择不同的请求策略
      let type = +state.device.device_access_type
      if(type === 1 || type === 3){ // 云端对接
        params.channel = 'REQ_CLOUD'
      }
      return new Promise((resolve, reject) => {
        console.log('设备控制。。。。')
        HdSmart.Device.control(params,
          (res) => {
            console.log(res,'设备控制调用完成。。。。')
            commit('setLoadError', false)
            HdSmart.UI.hideLoading()
            resolve(res)
          },
          (err) => {
            commit('setLoadError', true)
            HdSmart.UI.hideLoading()
            reject(err)
          }
        )
      }).catch(err => {
        commit('setLoadError', true)
        HdSmart.UI.hideLoading()
      })
    },
  }
})
// js 桥ready
HdSmart.ready(() => {
  if (window.device_name) {
    window.document.title = window.device_name
    store.commit('setDeviceName', window.device_name)
  }
  if(window.room_name){
    store.commit('setRoomName', window.room_name)
  }
  // if(window.networkStatus){
  //   store.commit('setNetworkStatus', window.networkStatus)
  // }
  if (window.device_uuid) {
    let str_model = window.localStorage.getItem(window.device_uuid)
    let str_third_model = window.localStorage.getItem(window.device_id)
    if (str_model) {
      try {
        // str_model 有可能不是合法的JSON字符串，便会产生异常
        store.commit('setDeviceAttrs', JSON.parse(str_model))
      } catch (e) {
        store.commit('setDeviceAttrs', {})
      }
    }
    if (str_third_model) {
      try {
        // str_model 有可能不是合法的JSON字符串，便会产生异常
        store.commit('setDeviceAttrsThird', JSON.parse(str_third_model))
      } catch (e) {
        store.commit('setDeviceAttrsThird', {})
      }
    }
  }
  store.dispatch('addListener')
})

export default store
