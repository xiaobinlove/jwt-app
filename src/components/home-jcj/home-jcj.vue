<template>
  <div class="home-jcj">
      <alarm-header title="首页" :backFlag="false" @refresh="refresh">
      </alarm-header>
      <div class="head-box">
        <div class="head-wrapper">
          <div class="head-day"><span>{{date}}</span> <span>{{navList.ssdwmc}}</span> <span>{{togetDay | today}}</span></div>
          <div class="head-name-wrapper">
            <div class="head-name" v-for="(item, index) in indexInfo.leaders" :key="index">
              <div class="head-tel">
                <span class="name">{{item.teamRoleName}}：{{item.policeName}}</span>
                <span class="tel" @click="call(item.mobilePhone)"><i class="iconfont icon-dianhua2"></i>{{item.mobilePhone}}</span>
              </div>
            </div>
          </div>
          <!--<div class="head-name">-->
            <!--<div class="head-tel" >-->
              <!--<span class="name">{{teamRoleName}}：{{indexInfo.leaders[0].policeName}}</span>-->
              <!--<span class="tel" @click="actionShow = true"><i class="iconfont icon-dianhua2"></i>拨号</span>-->
            <!--</div>-->
          <!--</div>-->
          <div class="head-num" @click="goUnitList">
            <!--今日警情总数：{{indexInfo.jqzs}}条-->
            <div>
              辖区在线：{{xqNum || 0}}
            </div>
            <div>
              单位在线：{{unitNum || 0}}
            </div>
            <!--<i class="iconfont icon-iconfontjiantou2 f-r"></i>-->
          </div>
        </div>
      </div>
      <div class="scroller-box">
        <scroller :on-refresh="refreshList">
          <jcj-item v-for="(item, index) in indexInfo.appdxJqs" :item="item" :key="index" @itemList="itemClick(item)" :index="index"></jcj-item>
        </scroller>
        <actionsheet v-model="actionShow" :menus="menus"></actionsheet>
        <actionsheet v-model="actionShow" :menus="menus"></actionsheet>
      </div>
  </div>
</template>

<script>
import { LoadMore, ViewBox, XHeader, Tabbar, TabbarItem, Flexbox, FlexboxItem, Card } from 'vux'
import {getIndexInfo, getUnitNum} from '../../api/home-jcj'
import { mapGetters } from 'vuex'
import alarmHeader from '../components/alarm-hearder'
import jcjItem from './jcj-item.vue'
import {IS_OK, getAppUser, getUser} from '../../common/js/auth'
import {Bus} from '../../common/js/Bus'
import {pushPositionMixin} from '../../mixins/home'

export default {
  components: {
    jcjItem,
    LoadMore,
    ViewBox,
    XHeader,
    Tabbar,
    TabbarItem,
    Card,
    Flexbox,
    FlexboxItem,
    alarmHeader
  },
  name: 'home-jcj',
  data () {
    return {
      items: [],
      actionShow: false,
      menus: {
        menu1: ''
      },
      menus2: {
        menu1: ''
      },
      date: '', // 日期
      togetDay: '', // 星期
      navList: {}, // 头部资源
      jcjItemList: [], // 列表资源
      indexInfo: {},
      unitNum: '', // 单位人数
      xqNum: '' // 辖区人数
    }
  },
  mixins: [pushPositionMixin],
  computed: {
    ...mapGetters({
      GET_RW: 'GET_RW',
      dwxxzt: 'dwxxzt',
      onlineObj: 'onlineObj'
    })
  },
  watch: {
    GET_RW () {
      this.getIndexData()
    },
    dwxxzt (val) {
      for (let item of this.indexInfo.appdxJqs) {
        if (item.loginid === val.loginid) {
          item.appzt = val.appzt
        }
      }
    },
    onlineObj (val) {
      this.unitNum = val.bdwNum
      this.xqNum = val.xqNum
    }
  },
  methods: {
    goUnitList () {
      this.$router.push({path: 'firstUnit', query: {dwdm: getUser().ssdwdm}})
    },
    call (val) {
      app.phone.dial(val)
    },
    refresh () {
      this.getIndexData()
    },
    itemClick (val) {
      let flag
      console.log(val, 'itemClickval')
      this.$store.commit('SET_HANDLE_USER', val.loginid)
      if (getAppUser().loginid === val.loginid) {
        flag = true
      } else {
        flag = false
      }
      this.$store.commit('SET_OPERATION', flag)
      this.$router.push({path: 'homeJqcl'})
    },
    refreshList: function (done) {
      console.log(done, 'refresh')
      var _self = this
      setTimeout(function () {
        _self.getIndexData()
        _self.$vux.toast.show({
          type: 'success',
          text: '加载成功'
        })
        done()
      }, 500)
    },
    getIndexData () {
      this.$vux.loading.show()
      console.log(getAppUser().loginid, 'getAppUser().loginid')
      getIndexInfo({
        loginid: getAppUser().loginid
      }).then(res => {
        this.$vux.loading.hide()
        console.log(res.data, '首页信息')
        // console.log((JSON.parse(res.data.data)), '首页信息')
        if (res.data.status === IS_OK) {
          this.indexInfo = JSON.parse(res.data.data)
          this.setQwzt(this.indexInfo.appdxJqs[0])
        }
      }, err => {
        this.$vux.loading.hide()
        console.log(err, 'getIndexInfoerr')
      })
    },
    setQwzt (item) {
      console.log('setQwzt', item)
      let val = null
      if (parseInt(item.a_tao) > 0 || parseInt(item.unreceipted) > 0) {
        val = 1
      } else {
        val = 0
      }
      console.log(val, 'SET_QWZTjcj')
      this.$store.commit('SET_QWZT', val)
    }
  },
  created () {
    this.getIndexData()
    // 单位人数
    getUnitNum({
      loginid: getAppUser().loginid
    }).then(res => {
      let data = JSON.parse(res.data.data)
      this.unitNum = data.bdwNum
      this.xqNum = data.xqNum
      console.log(res.data, 'getUnitNum')
    })
    Bus.$on('jqcl', () => {
      console.log('收到')
    })
    Bus.$on('REFRESH_TASK', () => {
      console.log('收到REFRESH_TASK')
      this.getIndexData()
    })
  },
  mounted () {
    this.top = 1
    let day = new Date()
    this.date = `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`
    this.togetDay = day.getDay()
  },
  beforeDestroy () {
    Bus.$off('jqcl')
    // Bus.$off('REFRESH_TASK')
  }
}
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/less/sum";
  .home-jcj {
    width: 100%;
    height: 100%;
    .head-box {
      width: 100%;
      .h(500);
      background: -webkit-linear-gradient(#3b70a6, #8ea9de); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(#3b70a6, #8ea9de); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(#3b70a6, #8ea9de); /* Firefox 3.6 - 15 */
      background: linear-gradient(#3b70a6, #8ea9de); /* 标准的语法 */
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: center;
      position: absolute;
      .t(130);
      z-index: 2;
      .head-wrapper {
        width: 90%;
        .h(400);
        background-color: rgba(133, 203, 234, 0.52);
        border-radius: 6px;
        .head-day {
          width: auto;
          padding: 0 10px;
          .fs(40);
          background-color: rgba(255, 255, 255, 0.4);
          border-radius: 6px;
          .h(100);
          color: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .head-name-wrapper {
          .h(180);
          overflow-x: auto;
        }
        .head-name {
          color: rgba(255, 255, 255, 0.9);
          .fs(40);
          font-weight: bold;
          border-bottom: 1px solid rgba(226, 222, 222, 0.2);
          .h(80);
          .lh(80);
          .head-tel {
            width: auto;
            .h(80);
            .lh(80);
            .fs(40);
            display: flex;
            text-align: center;
            .name {
              width: 70%;
            }
            .tel {
              width: 30%;
              .mr(40);
            }
          }
        }
        .head-num {
          display: flex;
          width: 100%;
          justify-content: space-around;
          .fs(50);
          .h(140);
          .lh(140);
          text-align: center;
          color: #fff;
          font-weight: bold;
          .iconfont {
            .mr(30);
          }
        }
      }
    }
    .scroller-box {
      width: 100%;
      height: calc(100% - 170px);
      background-color: #edeef2;
      overflow-y: auto;
      position: relative;
      .t(500);
      .user-box {
        width: auto;
        .h(160);
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        background-color: #fff;
        color: #7b7b7b;
        margin: 6px 4px;
        .fs(40);
        border-radius: 4px;
        .user-header {
          width: 15%;
          .lh(160);
          display: flex;
          align-items: center;
          justify-content: center;
          .icon {
            background-color: #88a48d;
            border-radius: 50%;
            .w(100);
            .h(100);
          }
        }
        .user-item {
          width: 70%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
          .item-name {
            width: 100%;
            .h(80);
            .lh(80);
            .fs(40);
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-around;
          }
          .item-count {
            width: 100%;
            .h(80);
            .lh(80);
            .fs(40);
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-around;
          }
        }
        .user-code {
          width: 15%;
          .lh(160);
          .fs(40);
          color: #528cba;
          font-weight: bold;
          text-align: center;
        }
      }
    }
  }
</style>
