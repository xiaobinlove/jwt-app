<template>
  <div class="web-map" id="webMap">
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  data () {
    return {}
  },
  watch: {},
  computed: {
    ...mapGetters({
      curPosition: 'curPosition'
    })
  },
  mounted () {
    this.initMap()
  },
  methods: {
    initMap () {
      console.log(1111111)
      // "longitude:"+longitude+" latitude:"+latitude);
      // var position = app.getSectionParams()

      let map = new BMap.Map('webMap')
      let point
      let marker
      let myIcon
      console.log(2222)
      this.$store.dispatch('getCurPositon').then(res => {
        point = new BMap.Point(res.longitude, res.latitude)
        map.centerAndZoom(point, 15) // 初始化地图,设置中心点坐标和地图级别。
        myIcon = new BMap.Icon(require('./curPosition.png'), new BMap.Size(40, 40))
        marker = new BMap.Marker(point, {icon: myIcon})
        map.addOverlay(marker)
        console.log(point, res.longitude, res.latitude, 'point')
      })
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" type="text/less">
  .web-map {
    width: 100%;
    height: 100%;
  }
</style>
