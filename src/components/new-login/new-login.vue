<template>
  <div class="new-login">
    <!--我是ligin-->
  </div>
</template>

<script>
import {login} from '../../api/login'
import {IS_OK, setUser, setAppUser, getAppUser} from '../../common/js/auth'
import {TEL_DEV} from '../../common/js/config'
import {WebSocketMsg} from '../../common/js/NewWebsocket'
export default {
  name: 'new-login',
  data () {
    return {
      user: {
        loginid: '153348',
        orgId: 'b483606f-aaef-47e9-afce-7ede8d4f763c',
        orgName: '航天长峰',
        picture_local: 'null',
        telephone: '13341338639',
        type: 1,
        userId: '2e75bf64-f73b-40d9-a1a9-d4a875278fc1',
        userName: '航天长峰'
      }
    }
  },
  methods: {
    async getUserInfo () {
      let _this = this
      if (TEL_DEV) {
        // console.log(app, 'app')
        // app.page.onLoad = () => {
        //   app.link.getLoginInfo(res => {
        //     // res.loginId = 'htcf'
        //     res.loginId = 'tanwen02'
        //     console.log(res)
        //     let data = res
        //     data.loginid = res.loginId
        //     // data.telephone = '18944788312'
        //     data.telephone = '13341338639'
        //     setAppUser(JSON.stringify(data))
        //     console.log(getAppUser(), 'getAppUser()~~~~~')
        //     _this.login()
        //   })
        // }
        app.link.getLoginInfo(res => {
          // res.loginId = 'htcf'
          // res.loginId = 'tanwen02'
          console.log(res, 'getLoginInfo')
          let data = res
          data.loginid = res.loginId
          // data.loginid = '159833'
          // data.telephone = '18944788312'
          // data.telephone = '13341338639'
          setAppUser(JSON.stringify(data))
          console.log(getAppUser(), 'getAppUser()~~~~~')
          _this.login()
        })
      } else {
        setAppUser(JSON.stringify(this.user))
        this.login()
        // WebSocketMsg(this)
      }
    },
    login () {
      login(getAppUser()).then(res => {
        console.log(res.data, '用户登陆')
        console.log(res.data.status, 'status')
        if (res.data.status === IS_OK) {
          let data = JSON.parse(res.data.data)
          let user = data.mjcjAppdwxx
          console.log(user, 'user')
          setUser(JSON.stringify(user))
          // console.log(JSON.parse(res.data.data))
          WebSocketMsg(this)
          this.$router.replace({path: 'home'})
        } else if (res.data.status === 'BUSINESS_ERROR') {
          this.$router.replace({path: '/loginErr', query: {errText: res.data.errMsg, log: '0'}})
        } else {
          this.$router.replace({path: '/loginErr', query: {errText: '登陆失败', log: '1'}})
        }
      }, err => {
        this.$router.replace({path: '/loginErr', query: {errText: '登陆失败', log: '1'}})
      })
    }
  },
  mounted () {
    setTimeout(() => {
      console.log('getUserInfo')
      this.getUserInfo()
    }, 500)
  }
}
</script>

<style lang="less" rel="stylesheet/less">
</style>
