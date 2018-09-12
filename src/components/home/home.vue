<template>
  <div id="home">
    <view-box ref="viewBox">
      <!--<x-header slot="header" class="header-top" :left-options="{showBack: false}" style="width:100%;position:absolute;left:0;top:0;z-index:100;">-->
        <!--<span>{{title}}</span><span @click="location.reload()">刷新</span>-->
        <!--<svg slot="right" class="icon" aria-hidden="true">-->
          <!--<use xlink:href="#icon-shuaxin"></use>-->
        <!--</svg>-->
      <!--</x-header>-->
      <router-view></router-view>
      <!--<tabbar slot="bottom" @on-index-change="indexChange">-->
      <tabbar slot="bottom">
        <!--<tabbar-item selected @click.native="go('/homeJcj')" active-class="item-active">-->
        <tabbar-item :link="{path: '/homeJcj', replace: true}" selected>
          <!--<svg class="icon" slot="icon" aria-hidden="true">-->
            <!--<use xlink:href="#icon-zhuye"></use>-->
          <!--</svg>-->
          <i slot="icon" class="iconfont icon-zhuye"></i>
          <span slot="label" class="tab-text">首页</span>
        </tabbar-item>
        <!--<tabbar-item @click.native="homeTabClick('jqcl')" active-class="item-active">-->
        <tabbar-item :link="{path: '/HomeJqcl', replace: true}" @click.native="homeTabClick('jqcl')" :class="{'weui-bar__item_on': curRoute === '/HomeJqcl'}">
          <i slot="icon" class="iconfont icon-shoucang"></i>
          <span slot="label" class="tab-text">今日警情</span>
        </tabbar-item>
        <!--<tabbar-item @click.native="go('/homeXxtz')" active-class="item-active">-->
        <tabbar-item :link="{path: '/homeXxtz', replace: true}">
          <i slot="icon" class="iconfont icon-duanxin"></i>
          <span slot="label" class="tab-text">消息通知</span>
        </tabbar-item>
        <!--<tabbar-item @click.native="go('/homeGrzx')" active-class="item-active">-->
        <tabbar-item :link="{path: '/homeGrzx', replace: true}">
          <i slot="icon" class="iconfont icon-gerenzhongxin"></i>
          <span slot="label" class="tab-text">个人中心</span>
        </tabbar-item>
      </tabbar>
    </view-box>
    <div id="tempMap"></div>
  </div>
</template>

<script>
// import {WebSocketMsg} from '../../common/js/NewWebsocket'
import {getAppUser} from '../../common/js/auth'
// import {sendGPS} from '../../api/home'
import { ViewBox, XHeader, Tabbar, TabbarItem, Flexbox, FlexboxItem, Card } from 'vux'
import {Bus} from '../../common/js/Bus'
import { mapGetters } from 'vuex'
import {pushPositionMixin} from '../../mixins/home'
let timer = null

export default {
  components: {
    ViewBox,
    XHeader,
    Tabbar,
    TabbarItem,
    Card,
    Flexbox,
    FlexboxItem
  },
  name: 'home',
  data () {
    return {
      title: '首页',
      PositionInterval: 0,
      user: {
        loginId: 'xiaobin',
        loginid: 'xiaobin',
        orgId: 'b483606f-aaef-47e9-afce-7ede8d4f763c',
        orgName: '航天长峰',
        picture_local: null,
        telephone: '18944788312',
        type: 1,
        userid: '2e75bf64-f73b-40d9-a1a9-d4a875278fc1',
        userName: '航天长峰'
      },
      timer: null,
      curRoute: ''
    }
  },
  mixins: [pushPositionMixin],
  computed: {
    ...mapGetters({
      qwzt: 'qwzt',
      curPosition: 'curPosition',
      count: 'count'
    })
  },
  watch: {
    '$route' (to, form) {
      console.log(to, 'route')
      this.curRoute = to.fullPath
    }
  },
  methods: {
    go (val) {
      this.$router.replace({path: val})
    },
    homeTabClick (type) {
      if (type === 'jqcl') {
        // this.$router.replace({path: 'HomeJqcl'})
        Bus.$emit('jqcl')
        this.$store.commit('SET_HANDLE_USER', getAppUser().loginid)
        this.$store.commit('SET_OPERATION', true)
      }
    },
    indexChange (val) {
      // console.log(val)
      // switch (val) {
      //   case 0:
      //     this.title = '首页'
      //     break
      //   case 1:
      //     this.title = '今日警情'
      //     break
      //   case 2:
      //     this.title = '消息通知'
      //     break
      //   case 3:
      //     this.title = '个人中心'
      //     break
      // }
    },
    sendPosition (qwzt) {
      // if (TEL_DEV) {
      //   this.$store.dispatch('getCurPositon').then(res => {
      //     this.curPosition.longitude = res.longitude
      //     this.curPosition.latitude = res.latitude
      //     this.pushPositionApi(this.curPosition, qwzt)
      //   }, err => {
      //     alert(err)
      //     // clearInterval(this.timer)
      //   })
      // } else {
      //   this.pushPositionApi(this.curPosition, this.qwzt)
      // }
      // app.getLocation(res => {
      //   console.log(res, 'getLocation位置信息')
      //   this.curPosition.longitude = res.longitude
      //   this.curPosition.latitude = res.latitude
      //   this.pushPositionApi()
      // }, err => {
      //   alert(err)
      //   clearInterval(this.timer)
      //   console.log(err, '获取定位失败')
      // })
    },
    startPushPosition () {
      clearInterval(timer)
      timer = setInterval(() => {
        if (this.qwzt !== null) {
          this.pushPositionApi(this.qwzt)
        }
      }, 10000)
    }
    // 向后台发送定位数据
    // pushPositionApi () {
    //   let paramas = getAppUser()
    //   Object.assign(paramas, {jd: this.curPosition.longitude, wd: this.curPosition.latitude, qwzt: this.qwzt, QWZT: this.qwzt})
    //   console.log(paramas, 'paramas')
    //   sendGPS(paramas).then(res => {
    //     console.log(res.data, '位置发送')
    //   }, err => {
    //     console.log(err, 'pushPositionApiErr')
    //   })
    // }
  },
  created () {
    console.log(this.$route.path, 'this.$route.path')
    let _this = this
    Bus.$on('REFRESH_TASK', (val) => {
      console.log('homeREFRESH_TASK', val)
      this.$store.commit('SET_QWZT', 1)
      this.pushPositionApi(this.qwzt)
      this.$vux.confirm.show({
        title: '提示',
        content: '您有一条新任务，请查收',
        onConfirm () {
          console.log('确定~~~~~')
          _this.$router.push({path: '/todoDetail', query: val})
        }
      })
    })
  },
  mounted () {
    if (this.count === 0) {
      this.startPushPosition()
      console.log('startPushPosition')
    }
    this.$store.commit('SET_COUNT', 1)
  },
  beforeDestroy () {}
}
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/less/sum";
  #home {
    width: 100%;
    height: 100%;
    /*.wrapper {*/
      /*height: calc(100% - 96px);*/
    /*}*/
    .header-top {
      .icon {
        .w(70);
        .h(70);
        color: #fff;
      }
    }
    .tab-text{
      .fs(40);
    }
    .item-active {
      color: #09BB07;
      .iconfont {
        color: #09BB07;
      }
    }
  }
</style>
