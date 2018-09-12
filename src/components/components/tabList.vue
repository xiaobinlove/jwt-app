<template>
  <div class="tab-list-component">
    <div class="todo-table">
      <ul class="item-wrap t-c">
        <li v-for="(item,index) in tabList" :key="item.key" class="item" :class="{'active': tabCurItem ===item.key}" @click="tabClick(item,index)">{{item.name}}</li>
      </ul>
    </div>
    <div class="todo-list" ref="listDom">
      <div class="unfinished" v-show="tabCurItem === 0">
        <div>
          <div v-for="(item, index) in unfinishedList" :key="index">
            <todo-item class="todo-list-item" :handle-item="item"></todo-item>
            <div class="todo-time t-c">
              {{item.bjsj|formatShortDate}}
            </div>
          </div>
          <div v-if="unfinishedList.length === 0" class="t-c">
            暂无未完成警情数据
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
          <div v-if="finishedList.length === 0" class="t-c">
            暂无已完成警情数据
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import todoItem from '../components/todoItem'
export default {
  components: {todoItem},
  name: 'tab-list-component',
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
    }
  },
  props: {
    handleList: Array
  },
  computed: {
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
  created () {},
  mounted () {
    console.log(this.unfinishedList, this.finishedList, 'finishedList')
  },
  destroyed () {
  },
  methods: {
    tabClick (item, index) {
      this.tabCurItem = index
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/less/sum.less";
  @import "../../common/less/varlable.less";
  .tab-list-component {
    box-sizing: border-box;
    /*.pt(130);*/
    height: 100%;
    background: #eeedf3;
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
      /*height: calc(100% - unit(236/108, rem));*/
      height: 100%;
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
        height: calc(100% - unit(106/108, rem));
        overflow: auto;
      }
    }
  }
</style>
