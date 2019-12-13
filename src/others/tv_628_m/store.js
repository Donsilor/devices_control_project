import Vue from 'vue'
import Vuex from 'vuex'

import * as service from './service'
import router from './router'
console.log(router,'router-----------------')

Vue.use(Vuex)
var scrollTop = 0
var docEl = document.body
const store = new Vuex.Store({
  state: {
    online: true,
    detailVisible: false,
    activeDetail: {},
    device_name: '',
    tvStatus: {
      tvOnlineStatus: 2,
      screenProjectType: 0,
      screenProjectTitle: ``
    },
    status_bar_height: 20,
    navigation_bar_height: 44
  },
  getters: {
    isStatusBarShow(state)  {
      return window.device_uuid && (state.tvStatus.screenProjectType != 0 || state.tvStatus.tvOnlineStatus != 1)
    }
  },
  mutations: {
    showDetail(state, payload) {
      state.detailVisible = true
      if(payload) {
        state.activeDetail = payload
        scrollTop = docEl.scrollTop
        docEl.scrollTop = 0
      }
      service.RemoteController({
        'show': true
      })
    },
    hideDetail(state) {
      state.detailVisible = false
      var path = router.history.current.name
      if (path === 'index') {
        service.RemoteController({
          'show': false
        })
      } else {
        service.RemoteController({
          'show': true
        })
      }
      setTimeout(() => {
        docEl.scrollTop = scrollTop
      }, 50)
    },
    setOnline(state, payload) {
      state.online = payload
    },
    setDeviceName(state, payload) {
      state.device_name = payload
    },
    setScreenProjectionStatus(state, payload) {
      state.tvStatus = payload
    },
    setStatusBarHeight(state, payload) {
        state.status_bar_height = payload
    },
    setNavigationBarHeight(state, payload) {
        state.navigation_bar_height = payload
    }
  },
  actions: {
    showDetail({
      commit
    }, item) {
      commit('showDetail', item)
    },
    hideDetail: ({
      commit
    }) => {
      commit('hideDetail')
    },
    setOnline({
      commit
    }, onlineStr) {
      commit('setOnline', onlineStr == 'online')
    }
  }
})
export default store