<template>
  <div>
    test2
    <div @click="setTest('1')">案例1</div>
    <div @click="setTest('0')">案例0</div>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  mounted () {},
  watch: {},
  computed: {},
  methods: {
    setTest (val) {
      console.log('click', val)
      this.$store.commit('SET_TEST', val)
      // setTimeout(() => {
      //   console.log('1')
      // }, 1000)
      // this.time()
    },
  }
}
</script>
<style lang="less" rel="stylesheet/less" type="text/less">
</style>
