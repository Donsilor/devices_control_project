/**
 * 已经接入的设备历史原因不想改动
 *
 * @summary 全局设备状态管理
 * @author songwh
 *
 * Created at     : 2019-08-05 11:32:49
 * Last modified  : 2019-08-05 15:58:50
 */
import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 是否是首次加载
    isInitLoad: false,
    // 是否超时/错误
    isLoadError: false,
    // 控制设备命令是否执行成功
    isControlSuceess: false,
    // 是否成功获取设备属性的回调判断
    isDeviceStatus: false,
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
    setControl(state, bool) {
      state.isControlSuceess = !!bool
    },
    setDeviceName(state, name) {
      state.device.device_name = name
    },
    setDeviceAttrs(state, attrs) {
      state.deviceAttrs = attrs
    },
    setSuccessDeviceStatus(state) {
      state.isDeviceStatus = true
    },
    setErrorDeviceStatus(state) {
      state.isDeviceStatus = false
    }
  },

  actions: {
    // 获取设备属性
    getDeviceInfo({ commit }) {
      HdSmart.Device.getSnapShot(res => {
        commit('setDeviceInfo', res)
        commit('setSuccessDeviceStatus')
        if (window.device_uuid) {
          window.localStorage.setItem(window.device_uuid, JSON.stringify(res.attribute))
        }
      }, () => {
        commit('setErrorDeviceStatus')
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
            HdSmart.UI.hideLoading()
            commit('setControl', 1)
            resolve(res)
          },
          (err) => {
            HdSmart.UI.hideLoading()
            commit('setControl', 0)
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
        commit('setDeviceAttrs', JSON.parse(str_model))
      } catch (e) {
        commit('setDeviceAttrs', {})
      }
    }
  }
  store.dispatch('getDeviceInfo')
  store.dispatch('addListener')
})

export default store
