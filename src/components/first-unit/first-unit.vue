<template>
  <unit-num :title="title" :list="list" :dwdm="dwdm" @goPCS="goPCS"></unit-num>
</template>
<script>
import unitNum from '../components/unit-num'
import {getUnitNumList} from '../../api/home-jcj'

export default {
  components: {
    unitNum
  },
  data () {
    return {
      title: '单位人员在线情况',
      dwdm: '',
      list: []
    }
  },
  created () {
    console.log('created')
    this.dwdm = this.$route.query.dwdm
    this.getUnitNumListApi()
  },
  watch: {
    $route (to, from) {
      console.log(to, '$routeto')
      console.log('$route')
      this.dwdm = to.query.dwdm
      this.getUnitNumListApi()
    },
    // dwdm () {
    //   this.getUnitNumListApi()
    // },
  },
  computed: {},
  methods: {
    goPCS (val) {
      this.dwdm = val
    },
    getUnitNumListApi () {
      if (this.dwdm) {
        this.$vux.loading.show()
        getUnitNumList({dwdm: this.dwdm}).then(res => {
          this.$vux.loading.hide()
          console.log(res.data, 'getUnitNumList')
          this.list = JSON.parse(res.data.data)
          console.log(JSON.parse(res.data.data))
        }, err => {
          this.$vux.loading.hide()
          console.log(err, 'getUnitNumListerr')
        })
      }
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" type="text/less">
</style>
