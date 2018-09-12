import Vue from 'vue'
import Router from 'vue-router'
import TodoDetail from '@/components/todo-detail/todo-detail.vue'
import Login from '@/components/login/login.vue' // 登陆
import NewLogin from '@/components/new-login/new-login.vue' // 登陆
import LoginErr from '@/components/login-err/login-err.vue' // 登陆
import Home from '@/components/home/home.vue' // 导航
import HomeJcj from '@/components/home-jcj/home-jcj.vue' // 接处警
import HomeJqcl from '@/components/home-jqcl/home-jqcl.vue' // 警情处理
import HomeXxtz from '@/components/home-xxtz/home-xxtz.vue' // 消息通知
import HomeGrzx from '@/components/home-grzx/home-grzx.vue' // 个人中心
import FirstUnit from '@/components/first-unit/first-unit.vue' // 一级单位
import Historical from '@/components/historical/historical.vue' // 历史查询
import Test from '@/components/test.vue' // 历史查询
import Test2 from '@/components/test2.vue' // 历史查询
import Mqtt from '@/components/mqtt.vue' // 历史查询
import NewFeedBack from '@/components/new-feedback/new-feedback.vue' // 历史查询
import SendMessage from '@/components/send-message/send-message.vue' // 历史查询
import WebMap from '@/components/web-map/web-map.vue' // 历史查询
import HomeMap from '@/components/home-map/home-map.vue'
import BackgroundInfo from '@/components/background-info/background-info.vue'
import FeedBack from '@/components/feedback/feedback.vue'
import Map from '@/components/map/map.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'newLogin',
      component: NewLogin
    },
    {
      path: '/loginErr',
      name: 'LoginErr',
      component: LoginErr
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/newLogin',
      name: 'NewLogin',
      component: NewLogin
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      children: [
        { path: '', component: HomeJcj },
        { path: '/HomeJcj', component: HomeJcj },
        { path: '/homeJqcl', component: HomeJqcl },
        { path: '/HomeXxtz', component: HomeXxtz },
        { path: '/HomeGrzx', component: HomeGrzx }
      ]
    },
    {
      path: '/firstUnit',
      name: 'FirstUnit',
      component: FirstUnit
    },
    {
      path: '/todoDetail',
      name: 'TodoDetail',
      component: TodoDetail
    },
    {
      path: '/Historical',
      name: 'Historical',
      component: Historical
    },
    {
      path: '/backgroundInfo',
      name: 'BackgroundInfo',
      component: BackgroundInfo
    },
    {
      path: '/feedBack',
      name: 'FeedBack',
      component: FeedBack
    },
    {
      path: '/sendMessage',
      name: 'SendMessage',
      component: SendMessage
    },
    {
      path: '/test',
      name: 'Test',
      component: Test
    },
    {
      path: '/test2',
      name: 'Test2',
      component: Test2
    },
    {
      path: '/newFeedBack',
      name: 'NewFeedBack',
      component: NewFeedBack
    },
    {
      path: '/map',
      name: 'Map',
      component: Map
    },
    {
      path: '/mqtt',
      name: 'Mqtt',
      component: Mqtt
    },
    {
      path: '/webMap',
      name: 'WebMap',
      component: WebMap
    },
    {
      path: '/homeMap',
      name: 'homeMap',
      component: HomeMap
    }
  ]
})
