<template>
  <div class="todo-item" @click="goDetail">
    <div class="todo-title">
      <div class="name">
        {{handleItem.jqxzmc}}
      </div>
      <div class="status">
        <i class="iconfont icon-completed"></i>{{handleItem.zlqsztdmms}}
      </div>
    </div>
    <div class="todo-content">
      <div class="todo-content-item">
        报案人：{{handleItem.bjrxm}}
      </div>
      <div class="todo-content-item">
        电话：{{handleItem.jqdjdm === null? '无':handleItem.jqdjdm}}
      </div>
      <div class="todo-content-item">
        案发地址：{{handleItem.jqdz}}
      </div>
      <div class="todo-content-item">
        警情性质：{{handleItem.jqxzmc}}
      </div>
    </div>
    <div class="todo-go-detail">
      <div>
        点击查看详情
      </div>
      <i class="iconfont icon-iconfontjiantou2"></i>
    </div>
  </div>
</template>

<script>

export default {
  components: {},
  name: 'TodoItem',
  data () {
    return {}
  },
  props: {
    handleItem: Object
  },
  methods: {
    goDetail () {
      this.$router.push({path: '/todoDetail', query: this.handleItem})
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/less/sum";
  .todo-item {
    box-sizing:border-box;
    background-color: #fff;
    .w(1035);
    margin: 0 auto;
    color: #6c6c6c;
   /* .fs(35);*/
    .pl(40);
    .pr(40);
    .pt(20);
    border-radius: 5px;
    border: 1px solid #a9a9a9;
    box-shadow: #ddd 2px 2px 2px;
    .todo-title {
      .h(76);
      .lh(76);
      color: #e32728;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #5a5a5a;
      font-weight: bold;
      font-family: "微软雅黑", "宋体", Arial;
    }
    .todo-content {
      .pt(15);
      .pb(15);
      .lh(50);
      border-bottom: 1px solid #bbb;
    }
    .todo-go-detail {
      display: flex;
      justify-content: space-between;
      .h(64);
      .lh(64);
      .fs(38);
      color: #909090;
    }
  }
</style>
