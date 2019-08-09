/**
 * 已经接入的设备历史原因不想改动
 *
 * @summary 全局设备状态管理
 * @author songwh
 *
 * Created at     : 2019-08-05 11:32:49
 * Last modified  : 2019-08-09 14:20:26
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
    // 设备基本信息
    device: {
      device_uuid: '',
      device_id: '',
      family_id: '',
      room_id: '',
      device_category_id: '',
      device_name: ''
    },
    // 设备属性
    deviceAttrs: {},
    // 设备告警
    deviceErrors: [],
    // 确认过的告警，只保存code值
    deviceErrorsConfirmed: []
  },
  getters: {
    // 设备开关
    isClose: state => (state.deviceAttrs.switch === 'on' ? false : true),
    // 设备状态
    isOffline: state => (state.deviceAttrs.connectivity === 'online' ? false : true),
  },
  mutations: {
    setDeviceInfo(state, result) {
      for (let k in result) {
        if (k === 'attribute') {
          let attribute = result[k]
          if (attribute && Object.keys(attribute).length) {
            state.deviceAttrs = attribute
            if (attribute.error) {
              state.deviceErrors = attribute.error
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
    setDeviceAttrs(state, attrs) {
      state.deviceAttrs = attrs
    },
    setLoadError(state, val){
      state.isLoadError = val
    },
  },

  actions: {
    // 获取设备属性
    getDeviceInfo({ commit }) {
      HdSmart.UI.showLoading()
      return new Promise((resolve, reject) => {
        HdSmart.Device.getSnapShot(res => {
          HdSmart.UI.hideLoading()
          commit('setDeviceInfo', res)
          commit('setLoadError', false)
          if (window.device_uuid) {
            window.localStorage.setItem(window.device_uuid, JSON.stringify(res.attribute))
          }
          resolve()
        },
        (err) => {
          HdSmart.UI.hideLoading()
          commit('setLoadError', true)
          reject(err)
        })
      })
    },
    // 监听设备属性变化
    addListener({ commit }) {
      HdSmart.onDeviceStateChange(res => {
        commit('setDeviceInfo', res.result)
        if (window.device_uuid) {
          window.localStorage.setItem(window.device_uuid, JSON.stringify(res.attribute))
        }
      })
    },
    // 控制设备
    doControlDevice( { commit }, params) {
      HdSmart.UI.showLoading()
      return new Promise((resolve, reject) => {
        HdSmart.Device.control(params,
          (res) => {
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
  if (window.device_uuid) {
    let str_model = window.localStorage.getItem(window.device_uuid)
    if (str_model) {
      try {
        // str_model 有可能不是合法的JSON字符串，便会产生异常
        store.commit('setDeviceAttrs', JSON.parse(str_model))
      } catch (e) {
        store.commit('setDeviceAttrs', {})
      }
    }
  }
  store.dispatch('getDeviceInfo')
  store.dispatch('addListener')
})

export default store
