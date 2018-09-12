<template>
  <div>
    我是测试
    <div @click="setTest('1')">案例1</div>
    <div @click="setTest('0')">案例0</div>
    <div class="test">
      <!--<img :src="src" alt="" style="-webkit-touch-callout: default">-->
      <!--<video :src="videoSrc" controls></video>-->
    </div>
  </div>
</template>
<script>
import axios from '../api/HTTP'
import {mapGetters} from 'vuex'
// let timer = null
// console.log('timer')
export default {
  data () {
    return {
      src: 'http://192.168.2.56:19041/jwt-app/testimg.jpg',
      // videoSrc: 'http://192.168.2.56:19041/jwt-app/121212.mp4',
      videoSrc: 'http://68.174.33.52/service-mjcj/common/temp-file/20180713/group1/M00/02/9A/RK4hS1tIAwSANJ57ASBPHtvcY5s463.mp4',
      timer: null,
      count: 0
    }
  },
  mounted () {
    // this.count++
    // if (this.count === 1) {
    //   // this.time()
    // }
    // if (timer) {
    //   clearInterval(timer)
    // }
    // timer = setInterval(() => {
    //   let test = this.test
    //   console.log(test, 'test')
    // }, 1000)
    // console.log('test3params', this.count)
    // this.time()
    // this.test()
    // this.post4()
    // this.getData()
    // this.Ssdwinfo()
    // app.link.getLoginInfo(res => {
    //   console.log(res, 'getLoginInfo')
    // })
    // this.test3()
    // console.log(window.xh.default_params(), 'xh.default_params')
    // this.getData()
    // this.test()
    console.log()
    this.getPosition()
  },
  activated () {
    console.log('test3params``````````````')
    this.time()
  },
  watch: {},
  computed: {
    ...mapGetters({
      test: 'test'
    })
  },
  methods: {
    getPosition () {
      navigator.geolocation.getCurrentPosition(function (position) {
        // 经度
        var longitude = position.coords.longitude
        // 纬度
        var latitude = position.coords.latitude
        // uposition={"longitude":longitude,"latitude":latitude};
        console.log(longitude, latitude, 'getPosition')
      }, function (error) {
       console.log(error, 'positionerror')
      })
    },
    time () {
      console.log(this.test, 'this.test')
      this.timer = setTimeout(this.time, 1000)
    },
    setTest (val) {
      this.$store.commit('SET_TEST', val)
      // setTimeout(() => {
      //   console.log('1')
      // }, 1000)
      // this.time()
    },
    getData () {
      // console.log('111111')
      let url = 'http://192.168.2.56:18080/supp/httpClient'
      var param = {
        APP_URL: 'http://68.174.33.52/service-mjcj/pubUser/getUserTask?liginid=小斌'
      }
      window.xh.post_dg(url, param, function (res) {
        // var result = eval(`(${res.returnValue})`)
        // var result = eval('(' + res.returnValue + ')')
        // alert(JSON.stringify(result))
        console.log(JSON.parse(res.returnValue), 'pubUser/getUserTask')
      }, function () {})
    },
    Ssdwinfo () {
      getSsdwinfo().then(res => {
        console.log(res.data, 'getSsdwinfo')
      })
    },
    test () {
      var param = {
        APP_URL: 'http://68.174.33.52/service-mjcj/user/logout?loginid=销彬'
      }
      var url = 'http://192.168.2.56:18080/supp/httpClient'
      xh.post_dg(url, param, function (res) {
        // var result = eval('(' + res.returnValue + ')')
        // alert(JSON.stringify(result))
        console.log(res, 'test')
      })
    },
    test1 () {
      axios.post('http://68.174.33.52/service-mjcj/pubUser/getUserTask', {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        console.log(res, 'test1')
      })
    },
    test3 () {
      test({}).then(res => {
        console.log(res, 'test3')
      })
    },
    post4 () {
      let params = fetch.post('/service-mjcj/pubUser/getUserTask', {})
      console.log(params, '1111111111')
      // console.log('post4', fetch.post1('/service-mjcj/pubUser/getUserTask', {}))
      // axios.post('', params, {
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded'
      //   }
      // }).then(res => {
      //   console.log(res, 'test1')
      // })
      axios({
        method: 'post',
        url: '',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: params
      }).then(res => {
        console.log(res, 'post4')
      })
    },
    test5 () {
      xh.post('/service-mjcj/pubUser/getUserTask', {}).then(res => {
        console.log(res, 'test5')
      })
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" type="text/less">
  @import "../common/less/sum";
  .test {
    .w(540);
    .h(100);
    background: red;
  }
</style>
