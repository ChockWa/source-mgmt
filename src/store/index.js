import Vue from 'vue'
import Vuex from 'vuex'
import config from './../common/config/baseConfig'

Vue.use(Vuex)

// 创建vuex的store
const store = new Vuex.Store({
  state: {
    config: config,
    token: ''
  },
  // 更改store的状态
  mutations: {
    initConfig (state) {
      state.config = config
    },
    setToken (state, token) {
      state.token = token
      localStorage.setItem('beautyT', token)
    },
    removeToken (state) {
      state.token = ''
      localStorage.removeItem('beautyT')
    }
  },
  // 有异步的时候， 需要action
  actions: {
    initConfig(context) {
      context.commit('initConfig')
    },
    setToken(context, token) {
      context.commit('setToken', token)
    },
    removeToken(context) {
      context.commit('removeToken')
    }
  },
  // 通过getter 进行数据获取
  getters: {
    getConfig(state) {
      return state.config
    },
    getToken(state) {
      return state.token
    }
  }
})

export default store
