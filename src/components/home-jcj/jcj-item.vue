<template>
  <div class="user-box" @click="itemUser(item.loginid)">
    <div class="user-header">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-jingcha"></use>
      </svg>
    </div>
    <div class="user-item">
      <div class="item-name">
        <span>{{item.yhxm}}</span>
        <span>今日任务总数({{item.jqCount}})</span>
      </div>
      <div class="item-count">
        <span>处理完毕({{item.worked}})</span>
        <span v-if="index > 0">正在处理({{item.a_tao}})</span>
        <div class="d-ib" v-if="index === 0">
          正在处理
          <badge :text="item.a_tao" v-if="parseInt(item.a_tao) > 0"></badge>
          <span v-if="parseInt(item.a_tao) === 0">({{item.a_tao}})</span>
        </div>
        <div class="d-ib" v-if="index === 0">
          未签收
          <badge :text="item.unreceipted" v-if="parseInt(item.unreceipted) > 0"></badge>
          <span v-if="parseInt(item.unreceipted) === 0">({{item.unreceipted}})</span>
        </div>
        <span v-if="index > 0">未签收({{item.unreceipted}})</span>
      </div>
    </div>
    <!--<div class="user-code" v-if="item.type === '1'">-->
      <!--在线-->
    <!--</div>-->
    <!--<div class="user-code" v-else>-->
      <!--离线-->
    <!--</div>-->
    <div class="user-code">
      {{item.appzt}}
    </div>
  </div>
</template>

<script>
import {Badge} from 'vux'
export default {
  name: 'user-box',
  components: {
    Badge
  },
  props: {
    item: Object,
    index: Number
  },
  data () {
    return {
    }
  },
  methods: {
    itemUser (val) {
      this.$emit('itemList', val)
      console.log('$emititemList')
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/less/sum";
  .user-box {
    width: auto;
    .h(160);
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    background-color: #fff;
    color: #7b7b7b;
    margin: 6px 4px;
    .fs(20);
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
        .fs(10);
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
</style>
