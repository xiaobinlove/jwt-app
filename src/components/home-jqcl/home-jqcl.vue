<template>
  <div class="home-jqcl">
    <alarm-header title="今日警情" @refresh="refresh" :backFlag="false" :refreshFlag="false">
      <div class="f-r right-slot" slot="right" @click="goSearch">历史查询</div>
    </alarm-header>
    <div class="todo-table">
      <ul class="item-wrap t-c">
        <li v-for="(item,index) in tabList" :key="item.key" class="item" :class="{'active': tabCurItem ===item.key}" @click="tabClick(item,index)">{{item.name}}</li>
      </ul>
    </div>
    <div class="todo-list">
      <div class="unfinished" v-show="tabCurItem === 0">
        <div>
          <div v-for="(item, index) in unfinishedList" :key="index">
            <todo-item class="todo-list-item" :handle-item="item"></todo-item>
            <div class="todo-time t-c">
              {{item.bjsj|formatShortDate}}
            </div>
          </div>
          <div v-if="unfinishedList.length === 0" class="t-c no-data">
            <span class="text">暂无未完成警情数据</span>
          </div>
        </div>
      </div>
      <div class="finish" v-show="tabCurItem === 1">
        <div>
          <div v-for="(item, index) in finishedList" :key="index">
            <todo-item class="todo-list-item" :handle-item="item"></todo-item>
            <div class="todo-time t-c">
              {{item.bjsj|formatShortDate}}
            </div>
          </div>
          <div v-if="finishedList.length === 0" class="t-c no-data">
            <span class="text">暂无已完成警情数据</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { XHeader, Tabbar, TabbarItem, Flexbox, FlexboxItem, Card } from 'vux'
import todoItem from '../components/todoItem'
import { mapGetters } from 'vuex'
import alarmHeader from '../components/alarm-hearder'
import {getUserTask} from '../../api/home-jcj'
import {IS_OK, getAppUser} from '../../common/js/auth'
import {Bus} from '../../common/js/Bus'

export default {
  components: {todoItem, alarmHeader},
  name: 'home-jqcl',
  data () {
    return {
      tabList: [{
        name: '未处理完',
        key: 0
      },
      {
        name: '已处理完',
        key: 1
      }],
      tabCurItem: 0
      // handleList: [],
    }
  },
  computed: {
    ...mapGetters({
      handleList: 'handleList',
      handleUser: 'handleUser'
    }),
    finishedList: {
      get () {
        let arr = []
        for (let item of this.handleList) {
          if (item.zlqsztdm === '03') {
            arr.push(item)
          }
        }
        return arr
      },
      set () {
        let arr = []
        for (let item of this.handleList) {
          if (item.zlqsztdm === '03') {
            arr.push(item)
          }
        }
        return arr
      }
    },
    unfinishedList: {
      get () {
        let arr = []
        for (let item of this.handleList) {
          if (item.zlqsztdm !== '03') {
            arr.push(item)
          }
        }
        return arr
      },
      set () {
        let arr = []
        for (let item of this.handleList) {
          if (item.zlqsztdm !== '03') {
            arr.push(item)
          }
        }
        return arr
      }
    }
  },
  created () {
    Bus.$on('REFRESH_TASK', () => {
      console.log('收到JqclREFRESH_TASK')
      this.$store.commit('SET_HANDLE_USER', getAppUser().loginid)
      this.getUserTaskApi()
    })
    this.getUserTaskApi()
  },
  mounted () {
    console.log(this.unfinishedList, this.finishedList, 'finishedList')
  },
  destroyed () {
    // Bus.$off('REFRESH_TASK')
  },
  methods: {
    goSearch () {
      this.$router.push({path: '/Historical'})
    },
    refresh () {
      console.log('reflash')
      this.getUserTaskApi()
    },
    tabClick (item, index) {
      this.tabCurItem = index
    },
    getUserTaskApi () {
      this.$vux.loading.show()
      console.log(this.handleUser, 'this.handleUser')
      getUserTask({loginid: this.handleUser}).then(res => {
        this.$vux.loading.hide()
        console.log(res.data, '个人任务详情')
        if (res.data.status === IS_OK) {
          console.log('getJqList', JSON.parse(res.data.data))
          this.$store.commit('SET_HANDLELIST', JSON.parse(res.data.data))
        }
      }, function () {
        this.$vux.loading.hide()
      })
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/less/sum.less";
  @import "../../common/less/varlable.less";
  .home-jqcl {
    box-sizing: border-box;
    /*.pt(130);*/
    height: 100%;
    background: #eeedf3;
    .no-data {
     .pt(600);
      color: #999;
    }
    .todo-table {
     /* position: absolute;
      .t(130);
      left: 0;*/
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      .h(106);
      background: #53a0d8;
      .item-wrap {
        display: flex;
        justify-content: space-around;
        align-items: center;
        .w(970);
        .h(77);
        border-radius: 5px;
        background: #fff;
        .item {
          .w(466);
          .h(66);
          .lh(66);
          .fs(48);
          font-weight: bold;
          color: @theme-color1;
          &:nth-of-type(1) {
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
          }
          &:nth-of-type(2) {
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
          }
          &.active {
            background: #53a0d8;
            color: #fff;
          }
        }
      }
    }
    .todo-list {
      box-sizing: border-box;
      .pb(30);
      /*height: 600px;*/
      height: calc(100% - unit(236/108, rem));
      .todo-list-item {
        .mt(22);
        &:nth-last-of-type(1) {
          .mb(22);
        }
      }
      .todo-time {
        margin: 0 auto;
        .mt(20);
        .w(170);
        .h(58);
        .lh(58);
        color: #fff;
        border-radius: 4px;
        background: #c6c6c6;
      }
      .unfinished, .finish {
        height: 100%;
        overflow: auto;
      }
    }
  }
</style>
