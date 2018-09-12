<template>
  <div id="home-grzx">
    <alarm-header title="个人中心" :backFlag="false" @refresh="refresh"></alarm-header>
    <div class="user-img">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-jingcha"></use>
      </svg>
    </div>
    <group class="user-list">
      <cell title="警员姓名" :value="userList.yhxm">
        <svg slot="icon" class="icon" aria-hidden="true">
          <use xlink:href="#icon-gerenzhongxin"></use>
        </svg>
      </cell>
      <cell title="警员编号" :value="userList.loginid">
        <svg slot="icon" class="icon" aria-hidden="true">
          <use xlink:href="#icon-fasongwenjianfawen1300"></use>
        </svg>
      </cell>
      <cell title="所属单位" :value="userList.ssdwmc">
        <svg slot="icon" class="icon" aria-hidden="true">
          <use xlink:href="#icon-dianhua1"></use>
        </svg>
      </cell>
      <!--<cell title="修改密码" is-link link="/Feedback">-->
        <!--<svg slot="icon" class="icon" aria-hidden="true">-->
          <!--<use xlink:href="#icon-mima1"></use>-->
        <!--</svg>-->
      <!--</cell>-->
      <!--<cell title="功能介绍" is-link link="/historical">-->
        <!--<svg slot="icon" class="icon" aria-hidden="true">-->
          <!--<use xlink:href="#icon-xitonggongneng"></use>-->
        <!--</svg>-->
      <!--</cell>-->
      <cell title="版本信息" :value="APP_VERSION">
        <svg slot="icon" class="icon" aria-hidden="true" @click="openConsole">
          <use xlink:href="#icon-wenjian"></use>
        </svg>
      </cell>
    </group>
    <!--<x-button class="user-out" type="primary" @click.native="loginOut">退出登录</x-button>-->
  </div>
</template>

<script>
import { Cell, XHeader, XButton, Tabbar, TabbarItem, Flexbox, FlexboxItem } from 'vux'
import { logout } from '../../api/home-grzx'
import { getUser, IS_OK, getAppUser } from '../../common/js/auth'
import alarmHeader from '../components/alarm-hearder'
import {APP_VERSION} from '../../common/js/config'

export default {
  components: {
    Cell,
    XHeader,
    Tabbar,
    TabbarItem,
    Flexbox,
    FlexboxItem,
    XButton,
    alarmHeader
  },
  name: 'home-jcj',
  data () {
    return {
      userList: getUser(),
      APP_VERSION: APP_VERSION
    }
  },
  methods: {
    openConsole () {
      console.log('new VConsole()')
      new VConsole()
    },
    loginOut () {
      logout({loginid: getAppUser().loginid}).then(res => {
        console.log(res, '退出')
        if (res.data.status === IS_OK) {
          // this.$router.push({path: 'New'})
        }
      })
    },
    refresh () {}
  },
  mounted () {
    // console.log(JSON.parse(getUser()))
    // this.userList = JSON.parse(getUser())
    this.userList = getUser()
  }
}
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/less/sum";
  #home-grzx {
    width: 100%;
    height: 100%;
    background-color: #edeef2;
    .user-img {
      width: 100%;
      overflow: hidden;
      padding: 10px 0;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      .icon {
        .w(160);
        .h(160);
        background-color: #88a48d;
        border-radius: 50%;
      }
    }
    .user-list {
      width: 100%;
      color: #7b7b7b;
      .icon {
        .w(60);
        .h(60);
        color: #3396d9;
        font-weight: bold;
        .mr(30);
      }
    }
    .user-out {
      width: 90%;
      margin: 10px auto;
    }
  }
</style>
