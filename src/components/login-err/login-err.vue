<template>
    <div class="login-err">
      {{errText}}
    </div>
</template>

<script>
export default {
  name: "login-err",
  data () {
    return {
      errText: '',
      log: '0'
    }
  },
  created () {
    this.errText = this.$route.query.errText
    this.log = this.$route.query.log
    if (this.log === '1') {
      new VConsole()
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less">
@import "../../common/less/sum";
.login-err {
  width: 100%;
  height: calc(100vh);
  text-align: center;
  line-height: calc(100vh);
  .fs(55);
}
</style>
