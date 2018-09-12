<template>
  <div id="home-xxtz">
    <alarm-header title="通知" :backFlag="false" :refreshFlag="false">
      <div slot="right" @click="$router.replace('/sendMessage')" class="right-slot">发送通知</div>
    </alarm-header>
    <div class="message-box">
      <message v-for="(item, index) of list" :item="item" :key="index"></message>
    </div>
  </div>
</template>

<script>
import { XHeader, Tabbar, TabbarItem, Flexbox, FlexboxItem, Card } from 'vux'
import message from '../components/message.vue'
import alarmHeader from '../components/alarm-hearder'
import {mjcjXxtzList} from '../../api/home-xxtz'
import { getAppUser } from '../../common/js/auth'

export default {
  components: {
    message,
    XHeader,
    Tabbar,
    TabbarItem,
    Card,
    Flexbox,
    FlexboxItem,
    alarmHeader
  },
  name: 'home-xxtz',
  data () {
    return {
      list: []
    }
  },
  created () {
    this.$vux.loading.show()
    mjcjXxtzList({
      loginid: getAppUser().loginid,
      // yhbh: getUser().yhbh,
      // yhxm: getUser().yhxm,
      pageNum: 1,
      pageSize: 10
    }).then(res => {
      this.$vux.loading.hide()
      console.log(res.data, 'mjcjXxtzList')
      console.log(JSON.parse(res.data.data).data.list)
      this.list = JSON.parse(res.data.data).data.list
    }, function () {
      this.$vux.loading.hide()
    })
  },
  methods: {
    refresh () {
      console.log('refresh')
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/less/sum";
  #home-xxtz {
    width: 100%;
    height: 100%;
    background-color: #edecf2;
    .message-box {
      width: 100%;
      height: calc(100% - unit(130/108, rem));
      overflow-y: auto;
    }
  }
</style>
