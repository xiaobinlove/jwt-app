<template>
  <div class="historical">
    <alarm-header title="历史查询" :refreshFlag="false" @back="back"></alarm-header>
    <div class="wrapper">
      <group>
        <datetime v-model="startlimitTime" title="开始时间" :start-date="startDate" :end-date="endDate"></datetime>
        <datetime v-model="endlimitTime" title="结束时间" :start-date="startDate" :end-date="endDate" ></datetime>
      </group>
      <div class="historLook">
        <x-button type="primary" @click.native="search">查询</x-button>
      </div>
    </div>
    <div class="item">
      <!--<div>-->
        <!--<div v-for="(item, index) in taskList" :key="index">-->
          <!--<todo-item class="todo-list-item" :handle-item="item"></todo-item>-->
          <!--<div class="todo-time t-c">-->
            <!--{{item.bjsj|formatShortDate}}-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
      <tab-list :handleList="taskList" v-if="taskList.length > 0"></tab-list>
    </div>
  </div>
</template>

<script>
import { XHeader, dateFormat } from 'vux'
import todoItem from '../../components/components/todoItem.vue'
import {getUserTaskByDate} from '../../api/historucal'
import {getAppUser} from '../../common/js/auth'
import alarmHeader from '../components/alarm-hearder'
import TabList from '../components/tabList'
let curDate = new Date()
export default {
  components: {
    todoItem,
    XHeader,
    alarmHeader,
    TabList
  },
  name: 'historical',
  data () {
    return {
      startlimitTime: dateFormat(new Date(curDate.getTime() - 24 * 3 * 60 * 60 * 1000), 'YYYY-MM-DD'),
      endlimitTime: dateFormat(new Date(), 'YYYY-MM-DD'),
      startDate: dateFormat(new Date(curDate.getTime() - 24 * 30 * 60 * 60 * 1000), 'YYYY-MM-DD'),
      endDate: dateFormat(new Date(), 'YYYY-MM-DD'),
      pageSize: '5',
      taskList: []
    }
  },
  methods: {
    back () {
      this.$router.replace({path: '/HomeJqcl'})
    },
    search () {
      this.$vux.loading.show()
      getUserTaskByDate({
        loginid: getAppUser().loginid,
        startDate: this.startlimitTime,
        endDate: this.endlimitTime,
        pageNum: '0',
        pageSize: this.pageSize
      }).then(res => {
        this.$vux.loading.hide()
        let data = JSON.parse(res.data.data)
        console.log(res.data, '查询')
        console.log(data.data)
        this.taskList = data.data.list
        if (this.taskList.length === 0) {
          this.$vux.toast.show({
            type: 'text',
            text: '无数据',
            position: 'top'
          })
        }
      }, function () {
        this.$vux.loading.hide()
      })
    }
  },
  mounted () {
  }
}
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/less/sum";
  @import "../../common/less/varlable.less";
  .historical {
    width: 100%;
    height: 100%;
    background-color: #edecf2;
    overflow: hidden;
    .wrapper {
      width: 100%;
      /*position: absolute;
      top: 46px;*/
      background-color: #fff;
      .historLook {
        width: 100%;
        /*background-color: #edecf2;*/
        padding: 10px 0;
        /*box-shadow: 0 1px 5px #afafaf;*/
        .weui-btn {
          width: 90%;
          margin: 0 auto;
          background: @header-background-color;
        }
      }
    }
    .item {
      width: 100%;
     /* height: calc(100% - unit(130/108, rem) - 150px);*/
      height: calc(100% - unit(160/108, rem) - 150px);
      overflow: hidden;
    }
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
  }
</style>
