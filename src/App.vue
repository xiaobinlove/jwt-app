<template>
  <div id="app">
    <!--<transition :name="transitionName">-->
      <!--<router-view class="child-view"></router-view>-->
    <!--</transition>-->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      transitionName: 'slide-left'
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.path === '/') {
        this.transitionName = 'slide-right'
      } else {
        this.transitionName = 'silde-left'
      }
    }
  }
}
</script>

<style lang="less">
  @import "common/less/index.less";
  @import "common/less/varlable.less";
  html,body {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    .fs(40);
    background: #eeedf3;
  }
  /*.child-view {*/
    /*position: absolute;*/
    /*left: 0;*/
    /*top: 0;*/
    /*width: 100%;*/
    /*height: 100%;*/
    /*transition: all .5s cubic-bezier(.55, 0, .1, 1);*/
  /*}*/
  /*.slide-left-enter, .slide-right-leave-active {*/
    /*opacity: 0;*/
    /*transform: translate(30px, 0);*/
  /*}*/
  /*.slide-left-leave-active, .slide-right-enter {*/
    /*opacity: 0;*/
    /*transform: translate(-30px, 0);*/
  /*}*/
  #app {
    max-width: 640px;
    height:100%;
    margin: 0 auto;
   /* background: @bg-color;*/
  }
  .icon {
    width: 1em; height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
