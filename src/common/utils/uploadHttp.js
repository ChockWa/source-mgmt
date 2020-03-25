import axios from 'axios'
import store from './../../store'
import router from './../../router'

// 创建axios实例
var instance = axios.create({ timeout: 1000 * 12 })

// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8'

/**
  * 请求拦截器
  * 每次请求前，如果存在token则在请求头中携带token
  */
instance.interceptors.request.use(function (config) {
  // const _this = this
  if (store.getters.getToken === '') {
    if (localStorage.getItem('beautyT')) {
      store.dispatch('setToken', localStorage.getItem('beautyT'))
    }
  }
  config.headers['beautyT'] = store.getters.getToken
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截器
instance.interceptors.response.use(
  // 请求成功
  res => {
    // const _this = this
    if (res.status === 200) {
      // 登录超时
      if (res.data.code === 1000) {
        store.dispatch('removeToken')
        router.replace({path: '/'})
      }
    //   console.log(res)
    //   Promise.resolve(res)
      return res.data
    } else {
      Promise.reject(res)
    }
  },
  // 请求失败
  error => {
    const { response } = error
    if (response) {
      return Promise.reject(response)
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      // store.commit('changeNetwork', false);
    }
  })

export default instance
