/**
 * Created by superman on 17/2/16.
 * http配置
 */
import axios from 'axios'
import router from '../router/index'
// import {LOCAL_URL} from '../common/js/config'
// axios 配置
axios.defaults.timeout = 6000
axios.defaults.withCredentials = true
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = `http://68.174.33.52:8980`
  // axios.defaults.baseURL = `http://68.174.33.43`
  // axios.defaults.baseURL = `http://68.174.33.52`
} else {
  // axios.defaults.baseURL = `http://68.174.72.12:8080`
  axios.defaults.baseURL = `http://68.174.72.18:8080`
  // axios.defaults.baseURL = `http://68.174.72.12:8080`
  // axios.defaults.baseURL = `http://68.174.33.52`
  // axios.defaults.baseURL = `http://68.174.33.52:8980`
  // axios.defaults.baseURL = `http://68.174.33.43`
  // axios.defaults.baseURL = `http://68.174.33.52:8980`
  // axios.defaults.baseURL = `http://68.174.72.11:8080`
}
// axios.defaults.baseURL = `http://68.174.72.11:8080`
// http request 拦截器
axios.interceptors.request.use(
  config => {
    // if (store.state.user.token) {
    //   config.headers.Authorization = `token ${store.state.user.token}`
    // }
    return config
  },
  err => {
    return Promise.reject(err)
  })

// http response 拦截器
axios.interceptors.response.use(
  response => {
    // console.log(response)
    if (response.data.status === 'NOT_LOGIN' && response.data.statusCode === 4010) {
      router.replace({
        path: '/Login',
        query: {redirect: router.currentRoute.fullPath}
      })
    }
    // if (response.data.statusCode === 10010002) {
    //   // session失效 清除token信息并跳转到登录页面
    //   // Vue.$message.error(`登录已失效，请重新登录，错误代码为：${response.data.errCode}`)
    //   router.replace({
    //     path: 'Login',
    //     query: {redirect: router.currentRoute.fullPath}
    //   })
    // } else if (response.data.statusCode === 501) {
    //   // Vue.$message.error(`登录已失效，请重新登录，错误代码为：${response.data.statusCode}`)
    //   // session失效 清除token信息并跳转到登录页面
    //   let tblist = store.state.user.tabsList
    //   let flag = true
    //   for (let i = 0; i < tblist.length; i++) {
    //     if (tblist[i].title === '接警台') {
    //       flag = false
    //     }
    //   }
    //   if (flag === true) {
    //     router.replace({
    //       path: 'Login',
    //       query: {redirect: router.currentRoute.fullPath}
    //     })
    //   }
    // } else {
    //   setNetWork(true)
    //   return response
    // }
    return response
  },
  error => {
    // if (error.response) {
    //   switch (error.response.status) {
    //     case 401:
    //       // 401 清除token信息并跳转到登录页面
    //       store.commit(types.LOGOUT)
    //       router.replace({
    //         path: 'Login',
    //         query: {redirect: router.currentRoute.fullPath}
    //       })
    //   }
    // }
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
    return Promise.reject(error)
  })

export default axios
