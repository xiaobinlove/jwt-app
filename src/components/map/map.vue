<template>
  <div id="jwt-map" class="jwt-map"></div>
</template>
<script>
import { mapGetters } from 'vuex'
// 固定值
let TYPE_GET_LOCATION = 'get_point'
let TYPE_SHOW_LOCATION = 'show_point'
// let TYPE_SHOW_LOCATION2 = 'show_gether_point'
// let TYPE_HEAT_MAP = 'heat_map'
// let TYPE_POLYGONS = 'polygons'
// var TYPE_GPS = 'GPS'
var TYPE_BAIDU = 'BAIDU'
// var TYPE_COMM = 'COMMON'
export default {
  data () {
    return {}
  },
  watch: {},
  computed: {
    ...mapGetters({
      mapData: 'mapData'
    })
  },
  created () {
    console.log(this.mapData, 'this.mapData')
  },
  mounted () {
    this.sighPotion()
    // this.getAddress()
  },
  methods: {
    // 地图取点
    getMapPoint () {
      var params = {'action': 'com.xhinfo.xhbmap.getLocation',
        'names': ['type', 'zoom', 'gps_type', 'latitude', 'longitude'],
        'values': [TYPE_GET_LOCATION, '18', TYPE_BAIDU, '23.033601', '113.773797']
      }

      app.szgaplugin.startActivityForResult(params, function (res) {
        console.log(res, '地图取点')
      }, function (err) {
        alert(JSON.stringify(err))
      })
    },
    // 打点标注
    sighPotion () {
      var list = [{lat: this.mapData.sgdwyzb, lng: this.mapData.sgdwxzb, name: '案发地址'}]

      var params = {'action': 'com.xhinfo.xhbmap.getLocation',
        'names': ['latitude', 'longitude', 'overlay', 'type', 'zoom', 'gps_type'],
        'values': [this.mapData.sgdwyzb, this.mapData.sgdwxzb, list, TYPE_SHOW_LOCATION, '16', 'GPS']
      }

      app.szgaplugin.startActivityForResult(params, function (res) {
        console.log(res, '打点标注')
      }, function (err) {
        console.log(err, '打点标注err')
      })
      // var params2 = {'action': 'start_navi_activity',
      //   'names': ['eLat', 'eLng', 'eAddress', 'coorType'],
      //   'values': ['22.540943', '114.069212', '岗厦北地铁站', '1']
      // }
      // setTimeout(() => {
      //   app.szgaplugin.startActivityForResult(params2, function (res) {
      //     console.log(res, '内置导航res')
      //     alert(res + '内置导航res')
      //   }, function (err) {
      //     console.log(err, '内置导航err')
      //     alert(err + '内置导航err')
      //   })
      // }, 2000)
    },
    getAddress () {
      var params = {'action': 'com.xhinfo.xhbmap.getLocation',
        'names': ['type', 'zoom', 'gps_type', 'latitude', 'longitude'],
        'values': [TYPE_GET_LOCATION, '18', TYPE_BAIDU, '23.033601', '113.773797']
      }
      app.szgaplugin.startActivityForResult(params, function (res) {
        var ret = eval('(' + res + ')')
        localStorage.setItem('addressS', res)
        alert(JSON.stringify(ret))
      }, function (err) {
        localStorage.setItem('addressF', err)
        alert(JSON.stringify(err))
      })
    }
  },
  beforeDestroy () {}
}
</script>
<style lang="less" rel="stylesheet/less" type="text/less">
  .jwt-map {
    width: 100%;
    height: 100%;
  }
</style>
