<template>
  <div class="todo-detail">
    <alarm-header :title="'发送消息'" :refresh-flag="false" @back="back"></alarm-header>
    <div>
      <group>
        <x-address
          @on-hide="logHide"
          @on-show="logShow"
          :title="title"
          v-model="value"
          :list="list"
          @on-shadow-change="onShadowChange" placeholder="请选择" :show.sync="showAddress"></x-address>
        <x-textarea :max="200" placeholder="请输入消息内容" v-model="messageContent"></x-textarea>
        <x-button type="primary" @click.native="send">发送</x-button>
      </group>
    </div>
  </div>
</template>
<script>
import alarmHeader from '../components/alarm-hearder'
import {IS_OK, getAppUser} from '../../common/js/auth'
import { Group, XAddress, XButton, Cell, XTextarea, XInput } from 'vux'
import { getTreeByUser, fstz } from '../../api/send-message'

export default {
  name: 'TodoDetail',
  components: {alarmHeader, Group, XAddress, XButton, Cell, XTextarea, XInput},
  data () {
    return {
      title: '发送至',
      value: [],
      list: [],
      showAddress: false,
      messageContent: '',
      dwzdbh: '',
      selected: {}
    }
  },
  computed: {},
  created () {
    getTreeByUser({loginid: getAppUser().loginid}).then(res => {
      console.log(res.data, 'getTreeByUser')
      let data = JSON.parse(res.data.data)
      if (data.status === IS_OK) {
        this.list = data.data.system_zzjgsybz_jcj1
        this.dwzdbh = 'system_zzjgsybz_jcj1'
        if (this.list.length === 1) {
          this.value = [this.list[0].value]
          console.log(this.value, 'this.value')
        }
      }
      console.log(this.list, 'list')
      console.log(JSON.parse(res.data.data).data)
    })
  },
  methods: {
    send () {
      console.log('send1')
      if (this.messageContent.trim().length === 0) {
        this.$vux.toast.show({
          type: 'warn',
          text: '请输入内容'
        })
        return
      }
      let params = {
        loginid: getAppUser().loginid,
        nr: this.messageContent,
        dwzdbhList: 'this.dwzdbh'
      }
      console.log(params, 'params')
      fstz(params).then(res => {
        console.log(res.data, 'fstz')
        console.log(res.data.data, 'fsdwtz')
        console.log(JSON.parse(res.data.data).status, 'es.data.data.status')
        let data = JSON.parse(res.data.data)
        if (data.status === IS_OK) {
          this.messageContent = ''
          this.$vux.toast.show({
            type: 'success',
            text: '发送成功'
          })
        }
      }, err => {
        console.log(err, 'fsdwtzerr')
      })
      console.log('send2')
    },
    back () {
      this.$router.replace({path: '/HomeXxtz'})
    },
    logHide (str) {
      console.log('logHide', str)
      setTimeout(() => {
        console.log()
        console.log(this.value, 'value')
      }, 1000)
    },
    logShow () {},
    onShadowChange (ids, names) {
      this.selected = {ids, names}
      console.log(ids, names, 'onShadowChange')
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/less/sum.less";
  @import "../../common/less/varlable.less";
</style>
