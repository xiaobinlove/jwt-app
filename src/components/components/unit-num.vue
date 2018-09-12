<template>
  <div class="unit-num">
    <alarm-header :title="title" :refreshFlag="false" @back="back"></alarm-header>
    <div class="content">
      <div class="unit-item" v-for="(item, index) in list" :key="index" @click="goPCSList(item)">
        <div class="left">
          <div class="img">

          </div>
          <div class="text">
            <p class="unit-text">{{item.dwjc}}</p>
            <p class="num-text">辖区在线：{{item.xqNum}}人</p>
          </div>
        </div>
        <div class="right">
          本单位在线：
          <span class="num">{{item.bdwNum}}</span>
          人
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import alarmHeader from '../components/alarm-hearder'
export default {
  name: 'unit-num',
  components: {
    alarmHeader
  },
  props: {
    title: String,
    list: Array,
    dwdm: String
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    checkPCSMethod () {
      let str = this.dwdm
      console.log(str.slice(str.length - 4, str.length), '未选到派出所')
      if (str.slice(str.length - 4, str.length) === '0000') {
        return false
      } else {
        return true
      }
    },
    goPCSList (item) {
      console.log(!this.checkPCSMethod())
      if (!this.checkPCSMethod()) {
        this.$emit('goPCS', item.dwdm)
        this.$router.push({path: 'firstUnit', query: {dwdm: item.dwdm}})
      }
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" type="text/less">
@import "../../common/less/sum";
.unit-num {
  height: 100vh;
  .content {
    height: calc(100% - unit(130/108, rem));
    overflow-y: auto;
  }
  .unit-item {
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    .pl(38);
    .pr(38);
    .pt(35);
    .pb(35);
    .mb(20);
    display: flex;
    justify-content: space-between;
    .left {
      display: flex;
      .img {
        .mr(35);
        .w(108);
        .h(108);
        background: url("./jinghui.png");
        background-size: 100% 100%;
      }
      .text {
        .w(480);
        .unit-text {
          color: #000;
          .fs(45);
        }
        .num-text {
          color: #8b8b8b;
        }
      }
    }
    .right {
      display: flex;
      align-items: center;
      .num {
        .fs(50);
        color: #2991da;
      }
    }
  }
}
</style>
