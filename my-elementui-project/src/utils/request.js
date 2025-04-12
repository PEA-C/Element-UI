import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'

const request = axios.create({
  baseURL: 'http://interview-api-t.itheima.net/',
  timeout: 5000
})

// 添加请求拦截器
request.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // const token = localStorage.getItem('mj-pc-token')
    const token = store.state.user.token
    config.headers.Authorization = `Bearer ${token}`
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)
// 添加响应拦截器
request.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    return response.data // 直接返回真正的响应结果
  },
  function (error) {
    // 对响应错误做点什么
    if (error.response && error.response.status === 401) {
      Message.error('尊敬的用户，当前登录状态已过期！')
      store.commit('user/updateToken')
      // 跳转到登录
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default request
