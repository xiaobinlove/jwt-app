<template>
  <div id="login">
    <div class="login-wrapper">
      <group>
        <x-input title="账号" v-model="username"></x-input>
        <x-input title="密码" type="password" v-model="password"></x-input>
      </group>
      <x-button type="primary" @click.native="userlogin">登录</x-button>
      <x-button type="primary" @click.native="$router.push('/test')">测试</x-button>
      <x-button type="primary" @click.native="$router.push('/newLogin')">newlogin</x-button>
      <x-button type="primary" @click.native="$router.push('/map')">地图</x-button>
      <x-button type="primary" @click.native="$router.push('/mqtt')">mqtt</x-button>
      <x-button type="primary" @click.native="$router.push('/webMap')">webmap</x-button>
    </div>
  </div>
</template>

<script>
import { Group, XButton, XInput } from 'vux'
import {addOrRmoveUserinfo} from '../../../src/api/login'
import {getAppUser, setAppUser} from '../../common/js/auth'
import {taskCoupleBack} from '../../api/todo-detail'

export default {
  components: { XButton, XInput, Group },
  name: 'login',
  data () {
    return {
      username: '',
      password: '',
      user: {
        loginId: 'htcf',
        orgId: 'b483606f-aaef-47e9-afce-7ede8d4f763c',
        orgName: '航天长峰',
        picture_local: null,
        telephone: '18944788312',
        type: 1,
        userId: '2e75bf64-f73b-40d9-a1a9-d4a875278fc1',
        userName: '航天长峰'
      }
    }
  },
  methods: {
    userInfo () {
      addOrRmoveUserinfo({
        type: 1,
        yhzh: getAppUser().loginid
      }).then(res => {
        console.log(res, 'addOrRmoveUserinfo')
      })
    },
    userlogin () {
      this.userInfo()
      this.$router.push({path: 'home'})
      // let _self = this
      // if (_self.username.trim() === '') {
      //   _self.$vux.toast.show({
      //     type: 'cancel',
      //     text: '账号不能为空'
      //   })
      // } else if (_self.password.trim() === '') {
      //   _self.$vux.toast.show({
      //     type: 'cancel',
      //     text: '密码不能为空'
      //   })
      // }
      // login({
      //   'username': _self.username,
      //   'password': _self.password
      // }).then(res => {
      //   console.log(res)
      //   if (res.data.status === 'SUCCESS') {
      //     console.log(res.data.data.data, '用户信息')
      //     setUser(JSON.stringify(res.data.data.data))
      //     console.log(JSON.stringify(res.data.data.data))
      //     _self.$router.push({path: 'home'})
      //   } else {
      //     _self.$vux.toast.show({
      //       type: 'warning',
      //       text: res.data.errMsg
      //     })
      //   }
      // }, err => {
      //   console.log(err, 'loginerr')
      // })
    },
    getUserInfo () {
      app.link.getLoginInfo(res => {
        setAppUser(JSON.stringify(res))
      })
      console.log(getAppUser(), 'getAppUser()')
    }
  },
  mounted () {
    taskCoupleBack({}).then(res => {
      console.log(res, 'taskCoupleBack')
    })
    this.getUserInfo({})
    this.userInfo()
  }
}
</script>

<style lang="less" rel="stylesheet/less">
  #login {
    width: 100%;
    height: 100%;
    background: url('./login-bg.png') no-repeat center;
    background-size: 100% 100%;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    .login-wrapper {
      margin-top: 60px;
      width: 80%;
    }
  }
</style>
