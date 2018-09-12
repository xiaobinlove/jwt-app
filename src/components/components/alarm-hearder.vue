<template>
  <div class="alarm-header t-c">
    {{title}}
    <i class="iconfont icon-fanhui2 header-icon" @click="$emit('back')" v-if="backFlag"></i>
    <slot name="right"></slot>
    <div class="refresh-wrapper" @click="$emit('refresh')" v-if="refreshFlag">
      <i class="iconfont icon-shuaxin"></i>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  name: 'alarm-header',
  data () {
    return {}
  },
  props: {
    title: String,
    backFlag: {
      default: true,
      type: Boolean
    },
    refreshFlag: {
      default: true,
      type: Boolean
    }
  },
  methods: {}
}
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/less/sum.less";
  @import "../../common/less/varlable.less";
  @import "../../common/less/vuxIndex.less";
  .right-slot {
    /* .fs(35);*/
    .fs(48);
    position: absolute;
    .r(60);
    top: 50%;
    transform: translateY(-50%);
  }
  .alarm-header {
    position: relative;
    width: 100%;
    .h(130);
    .lh(130);
    .fs(60);
    color: #fff;
    background: @header-background-color;
    .header-icon {
      position: absolute;
      .l(64);
      .fs(60);
      top: 50%;
      transform: translateY(-50%);
    }
    .refresh-wrapper {
      position: absolute;
      .w(150);
      .r(0);
      top: 50%;
      transform: translateY(-50%);
      .iconfont {
        .fs(70);
      }
    }
  }
</style>
