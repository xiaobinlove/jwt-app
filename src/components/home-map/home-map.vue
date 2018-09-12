<template>
  <div class="home-map">
    我是地图
    <div id="myMap" style="width:100%;height:100%"></div>
  </div>
</template>

<script>
export default {
  name: 'home-map',
  data () {
    return {
      newMap: null, // 初始化地图示例对象
      casePoint: null,
      pdtPoint: null,
      zoomLevel: 0
    }
  },
  mounted () {
    console.log('11111111111地图')
    setTimeout(() => {
      this.newMap = new CMap.Map('myMap')
      console.log('222222地图')
      console.log(this.newMap)
    }, 1000)
  },
  methods: {
    // 清除点的方法
    deletePoiint () {
      let _self = this
      if (_self.casePoint !== null) {
        _self.casePoint.remove()
      }
    },
    // 画点的方法
    setCaseCoorinate (data, data2) {
      console.log(data, data2)
      let x1 = parseFloat(data[0])
      let y1 = parseFloat(data[1])
      let x2 = parseFloat(data2[0])
      let y2 = parseFloat(data2[1])
      let centerX = (x1 + x2) / 2
      let centerY = (y1 + y2) / 2
      console.log(x1, y1)
      console.log(x2, y2)
      console.log(centerX, centerY)
      let _self = this
      let cMap = _self.newMap
      let linezb = [[x1, y1], [x2, y2]]
      let line = new CMap.Geometry.LineString(cMap.util.coordinateTransTo4326(linezb))
      cMap.addGeometry(line)
      let lineLength = cMap.util.getLineStringDistance(line.geometry)
      console.log(lineLength, '两点距离')
      if (lineLength >= 2740) {
        _self.zoomLevel = 13
      } else {
        _self.zoomLevel = 14
      }
      cMap.removeGeometry(line)
      if (_self.casePoint !== null) {
        _self.casePoint.remove()
      }
      _self.casePoint = new CMap.Geometry.Point(data) // 根据坐标创建一个点
      _self.casePoint.setAnimate(CMap.Geometry.Point.Animate.WAVE) // 中间的动态点
      cMap.addGeometry(_self.casePoint)
      cMap.setAnimateCenter([centerX, centerY])
      cMap.setAnimateZoom(_self.zoomLevel)
    },
    // 画pdt 上图
    setCasePdtCoor (data) {
      console.log(data, '画pdt!!!!!!!!!!')
      let _self = this
      let cMap = _self.newMap
      if (_self.pdtPoint !== null) {
        _self.pdtPoint.remove()
      }
      _self.pdtPoint = new CMap.Geometry.Point(data)
      _self.pdtPoint.setImage('../../static/img/map-onfree-x.png')
      cMap.addGeometry(_self.pdtPoint)
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/less/sum.less";
  .home-map {
    width: 100%;
    height: 100%;
  }
</style>
