<template>
  <div class="todo-detail">
    <div v-if="!loadFlag">
      <alarm-header :title="'警情信息'" :refresh-flag="false" @back="back">
        <div slot="right" @click="navigate" class="right-slot">导航</div>
      </alarm-header>
      <div class="todo-detail-content">
        <div class="handle-status t-c">
          警情状态：{{detailInfo.zlqsztdmms}}
        </div>
        <div class="handle-info">
          <div class="handle-info-item">
            警情等级：<span class="label">{{detailInfo.jqdjdm | formatJqdjmc}}</span>
          </div>
          <div class="handle-info-item">
            警情性质：<span class="label">{{detailInfo.jqxzmc}}</span>
          </div>
          <div class="handle-info-item">
            警情编号：<span class="label">{{detailInfo.jjdbh}}</span>
          </div>
          <div class="handle-info-item">
            报警人姓名：<span class="label">{{detailInfo.bjrxm}}</span>
          </div>
          <div class="handle-info-item">
            报警电话：
            <span class="label">{{!detailInfo.lxdh ? '无': detailInfo.lxdh}}</span><i class="iconfont icon-dianhua2" @click="call(detailInfo.lxdh)" v-if="detailInfo.lxdh" style="margin-left: 5px"></i>
          </div>
          <div class="handle-info-item">
            案发地址：<span class="label">{{detailInfo.jqdz}}</span>
          </div>
          <div class="handle-info-item">
            案发时间：<span class="label">{{detailInfo.bjsj | formatDate}}</span>
          </div>
          <div class="handle-record">
            <div class="record-icon-box t-c">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-ktv"></use>
              </svg>
            </div>
            <span>报警录音</span>
            <!--<audio src="../../../static/record/e0001120180424172411.mp3..mp3" ref="record" id="detailAudio"></audio>-->
            <div class="record-content t-c" @click="audioPlay(detailInfo.lymxPageInfo.list)" v-if="detailInfo.lymxPageInfo.list !== null && detailInfo.lymxPageInfo.list.length>0">
              <div class="bg" v-show="!audioStatus"></div>
              <div class="bg voicePlay" :class="{'animation-play': audioStatus, 'animation-paused':!audioStatus}"></div>
              <span>点击播放</span>
            </div>
            <div v-else>
              ：暂无录音
            </div>
          </div>
          <div class="handle-info-item">
            警情描述：
          </div>
          <div class="handle-describe">
            <div>
              <div v-for="(item , index) in detailInfo.jqnrList" :key="index">
                {{item.jqnr}}
                <br>
              </div>
            </div>
          </div>
          <!--<home-map class="mapBox" ref="map"></home-map>-->
        </div>
      </div>
      <div class="handle-bottom">
        <div class="handle-bottom-item" @click="optionClick" v-if="detailInfo.zlqsztdmms !== '处理完毕'">
          <i class="iconfont icon-shuji"></i>
          <span class="text">{{optionText}}</span>
        </div>
        <div class="handle-bottom-item" @click="goBackgroundInfo">
          <i class="iconfont icon-shuji"></i>
          <span class="text">背景信息</span>
        </div>
        <div class="handle-bottom-item" @click="goMap">
          <i class="iconfont icon-shuji"></i>
          <span class="text">地图</span>
        </div>
        <div class="handle-bottom-item" @click="goFeedBack">
          <i class="iconfont icon-yijianfankui1"></i>
          <span class="text">反馈</span>
        </div>
      </div>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
import alarmHeader from '../components/alarm-hearder'
import {getUserTaskDetails, taskCoupleBack, getPendingUserTask, changeCaseAdress} from '../../api/todo-detail'
import {IS_OK, getAppUser, getUser} from '../../common/js/auth'
import {backgroundInfo} from '../../api/background-info'
import {MAP_IP} from '../../common/js/config'
import loading from '../components/loading'
import {pushPositionMixin} from '../../mixins/home'
import {mapGetters} from 'vuex'
import {getDisance, getAddress} from '../../../static/js/coor'

export default {
  name: 'TodoDetail',
  components: {alarmHeader, loading},
  data () {
    return {
      audioStatus: false,
      handleInfo: {},
      detailInfo: {},
      mapIp: MAP_IP,
      loadFlag: false,
      position: {}
    }
  },
  mixins: [pushPositionMixin],
  computed: {
    ...mapGetters({
      qwzt: 'qwzt',
      curPosition: 'curPosition',
      operation: 'operation'
    }),
    type () {
      if (this.detailInfo.zlqsztdmms === '未签收') {
        return '1'
      }
      if (this.detailInfo.zlqsztdmms === '已签收') {
        return '2'
      }
      if (this.detailInfo.zlqsztdmms === '到达现场') {
        return '3'
      }
    },
    optionText () {
      if (this.detailInfo.zlqsztdmms === '未签收') {
        return '签收出警'
      }
      if (this.detailInfo.zlqsztdmms === '已签收') {
        return '到达现场'
      }
      if (this.detailInfo.zlqsztdmms === '到达现场') {
        return '处理完毕'
      }
    },
    alertText () {
      if (this.detailInfo.zlqsztdmms === '未签收') {
        return '签收成功'
      }
      if (this.detailInfo.zlqsztdmms === '已签收') {
        return '到达现场签到成功'
      }
      if (this.detailInfo.zlqsztdmms === '到达现场') {
        return '处理完毕提交成功'
      }
    }
  },
  created () {
    this.handleInfo = this.$route.query
    this.getUserTaskDetailsApi()
    console.log(this.handleInfo, 'this.handleInfo')
    console.log(localStorage.getItem('addressS'), 'addressS')
    console.log(localStorage.getItem('addressF'), 'addressF')
  },
  methods: {
    nextStatus (obj) {
      if (obj.zlqsztdmms === '未签收') {
        obj.zlqsztdmms = '已签收'
        obj.zlqsztdm = '01'
        return
      }
      if (obj.zlqsztdmms === '已签收') {
        obj.zlqsztdmms = '到达现场'
        obj.zlqsztdm = '02'
        return
      }
      if (obj.zlqsztdmms === '到达现场') {
        obj.zlqsztdmms = '处理完毕'
        obj.zlqsztdm = '03'
      }
    },
    call (val) {
      app.phone.dial(val)
    },
    back () {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
    },
    navigate () {
      // this.detailInfo.sgdwyzb, this.detailInfo.sgdwxzb
      var params = {'action': 'start_baidu_map_app',
        'names': ['eLat', 'eLng', 'eAddress', 'coorType'],
        'values': [this.detailInfo.sgdwyzb, this.detailInfo.sgdwxzb, '案发地点', '1']
      }
      // alert(JSON.stringify(params))
      app.szgaplugin.startActivityForResult(params, function (res) {
      }, function (err) {
        // alert(err + '导航err')
      })
    },
    goMap () {
      // console.log('this.detailInfo', this.detailInfo)
      // if (!this.detailInfo.sgdwyzb) {
      //   return app.alert('该警情无坐标')
      // }
      this.$store.commit('SAVE_MAP_DATA', this.detailInfo)
      this.$router.push({path: '/map', query: JSON.stringify(this.detailInfo)})
      // this.$router.push({path: '/homeMap', query: JSON.stringify(this.detailInfo)})
      // this.$router.push({path: '/homeMap'})
    },
    optionClick () {
      if (!this.operation) {
        this.$vux.toast.show({
          type: 'warn',
          text: '您无权限操作他人的任务！'
        })
        return
      }
      let _this = this
      this.$vux.loading.show()
      taskCoupleBack({
        loginid: getAppUser().loginid,
        jjdbh: this.detailInfo.jjdbh,
        cjdbh: this.detailInfo.cjdbh,
        type: this.type,
        cdjyxm: this.detailInfo.yhmc
      }).then((res) => {
        console.log(res.data, 'taskCoupleBack')
        if (res.data.status === IS_OK) {
          if (this.type === '3') {
            getPendingUserTask({
              loginid: getAppUser().loginid
            }).then(res => {
              console.log(JSON.parse(res.data.data).data, 'getPendingUserTaskJSON')
              if (res.data.status === IS_OK) {
                console.log(111111111111111)
                let data = JSON.parse(res.data.data).data
                let val = null
                if (data.list.length === 0) {
                  val = 0
                } else {
                  val = 1
                }
                console.log(2222222)
                console.log('SET_QWZTtododetail', val)
                this.$store.commit('SET_QWZT', val)
                this.pushPositionApi(this.qwzt)
                // this.$store.dispatch('getCurPositon').then(res => {
                //   console.log(33333333333)
                //   this.position.longitude = res.longitude
                //   this.position.latitude = res.latitude
                //   this.pushPositionApi(this.position, this.qwzt)
                //   console.log('我是完成任务', this.qwzt, this.position)
                // }, err => {
                //   alert(err)
                //   // clearInterval(this.timer)
                // })
              }
              console.log(res.data, 'getPendingUserTask')
            })
          }
          if (this.type === '2') {
            let dis = getDisance(this.curPosition.longitude, this.curPosition.latitude, this.detailInfo.sgdwxzb, this.detailInfo.sgdwyzb)
            console.log(dis, 'dis')
            if (dis > 50) {
              this.$vux.confirm.show({
                title: '提示',
                content: '是否将当前位置设为案发地址？',
                onConfirm () {
                  let jd = _this.curPosition.longitude
                  let wd = _this.curPosition.latitude
                  console.log('确定~~~~~')
                  // changeCaseAdress({
                  //   loginid: getAppUser().loginid,
                  //   jjdbh: _this.detailInfo.jjdbh,
                  //   jqdz: '市公安局',
                  //   sgdwxzb: jd,
                  //   sgdwyzb: wd
                  // }).then((res) => {
                  //   console.log(res.data, 'changeCaseAdress')
                  //   if (res.data.status === IS_OK) {
                  //     _this.$vux.toast.show('案发地址修改成功')
                  //   }
                  //   console.log(res.data, 'changeCaseAdress')
                  // })
                  getAddress(wd, jd, function (address) {
                    changeCaseAdress({
                      loginid: getAppUser().loginid,
                      yhxm: getUser().yhxm,
                      jjdbh: _this.detailInfo.jjdbh,
                      cjdbh: _this.handleInfo.cjdbh,
                      jqdz: address,
                      sgdwxzb: jd,
                      sgdwyzb: wd,
                      ssdwmc: getUser().ssdwmc
                    }).then((res) => {
                      console.log(res.data, 'changeCaseAdress')
                      console.log(res.data.status, 'status')
                      if (res.data.status === IS_OK) {
                        _this.$vux.toast.show({
                          type: 'success',
                          text: `申请已发送`
                        })
                      }
                      // console.log(res.data, 'changeCaseAdress')
                    })
                  })
                }
              })
            }
          }
          this.$vux.toast.show({
            type: 'success',
            text: `${this.alertText}`
          })
          // this.getUserTaskDetailsApi()
          this.nextStatus(this.detailInfo)
        }
        this.$vux.loading.hide()
      }, function () {
        this.$vux.loading.hide()
      })
    },
    async getBackgroudDate () {
      await backgroundInfo({loginid: getAppUser().loginid, phoneNum: getAppUser().telephone}).then(res => {
        console.log(res.data, 'backgroudDate')
        if (res.data.status === IS_OK) {
          // if (res.data.data)
          let data = JSON.parse(res.data.data).data
          if (data === null || !JSON.parse(res.data.data).data) {
            this.$vux.toast.show({
              type: 'warn',
              text: '无背景信息'
            })
          } else {
            this.$router.push({path: '/backgroundInfo'})
            this.$store.commit('SAVE_BACKGROUND_INFO_DATA', data)
          }
        }
      })
    },
    getUserTaskDetailsApi () {
      this.loadFlag = true
      getUserTaskDetails({
        jjdbh: this.handleInfo.jjdbh,
        cjdbh: this.handleInfo.cjdbh,
        loginid: getAppUser().loginid,
        pageNum: 1,
        pageSize: 1
      }).then((res) => {
        console.log(res.data, 'getUserTaskDetailsApi')
        if (res.data.status === IS_OK) {
          this.detailInfo = JSON.parse(res.data.data)
          this.$store.commit('SAVE_DETAIL_INFO', this.detailInfo)
        }
        this.loadFlag = false
        console.log(JSON.parse(res.data.data), 'getUserTaskDetails')
      }, function () {
        this.loadFlag = false
      })
    },
    goBackgroundInfo () {
      this.getBackgroudDate()
    },
    goFeedBack () {
      if (!this.operation) {
        this.$vux.toast.show({
          type: 'warn',
          text: '您无权限操作他人的任务！'
        })
        return
      }
      this.$router.push({path: '/newFeedBack'})
    },
    audioPlay (list) {
      // let audio = document.getElementById('detailAudio')
      // if (audio !== null) {
      //   if (audio.paused) {
      //     audio.play()
      //   } else {
      //     audio.pause()
      //   }
      // }
      // this.audioStatus = !audio.paused
      let path = this.mapIp + '/' + list[0].wjlj
      app.openFile(path, '', function (res) {
        console.log(res, 'openFile')
      })
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/less/sum.less";
  @import "../../common/less/varlable.less";
  .todo-detail {
    position: relative;
    background: #fff;
    height: 100%;
    color: #646464;
    /*.fs(30);*/
    .todo-detail-content {
      /*height: 100%;*/
      background: #fff;
      .handle-status {
        border-top: .093rem solid #eeedf3;
        border-bottom: .093rem solid #eeedf3;
        .h(92);
        .lh(92);
        color: #fa8710;
        /*.fs(38);*/
        .fs(48);
        background: #fff;
      }
      .handle-info {
        .pl(24);
        .pr(24);
        .handle-info-item {
          .pl(24);
          .pr(24);
          background: #fff;
         /* .h(78);*/
          .lh(78);
          border-bottom: 1px solid #999;
          .label {
            color: #111;
          }
        }
      }
      .handle-record {
        display: flex;
        align-items: center;
        color: #646464;
        border-top: .12rem solid #eeedf3;
        border-bottom: .12rem solid #eeedf3;
        .pl(24);
        .pr(24);
        .h(127);
        background: #fff;
        .record-icon-box {
          .fs(48);
          .w(66);
          .h(66);
          border-radius: 50%;
          background: #4d5d74;
          .lh(66);
          .fs(48);
          .mr(20);
          .icon {
            color: #fff;
          }
        }
        .record-content {
          .fs(48);
          position: relative;
          .w(548);
          .h(77);
          .lh(77);
          .ml(33);
          background: #eeedf3;
          border-radius: 5px;
          border: 1px solid #7b7b7b;
          .bg {
            position: absolute;
            top: 50%;
            .l(16);
            transform: translateY(-50%);
            background:url('weixinhuise.png') right 0 no-repeat;
            .w(44);
            .h(44);
            background-size: 400%;
          }
          .voicePlay {
            animation-name: voicePlay;
            animation-duration: 1s;
            animation-direction: normal;
            animation-iteration-count: infinite;
            animation-timing-function: steps(3);
          }
          .animation-play {
            animation-play-state: running;
          }
          .animation-paused {
            animation-play-state: paused;
          }
          @keyframes voicePlay {
            0% {
              background-position: 0;
            }
            100% {
              background-position: 100%;
            }
          }
        }
      }
      .handle-describe {
        .h(486);
        overflow-y: auto;
        .fs(48);
        background: #fff;
        .pl(24);
        .pr(24);
      }
    }
    .handle-bottom {
      display: flex;
      position: absolute;
      width: 100%;
      .h(135);
      left: 0;
      bottom: 0;
      background: @theme-color1;
      .handle-bottom-item {
        position: relative;
        flex: 1;
        color: #fff;
        border-right: 1px solid #fff;
        text-align: center;
        &:nth-last-of-type(1) {
          border-right: none;
        }
        .iconfont {
          position: absolute;
          .t(10);
          left: 50%;
          transform: translateX(-50%);
          .fs(60);
        }
        .text {
          width: 100%;
          position: absolute;
          .b(12);
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
    .mapBox {
      height: 200px;
      border: 1px solid #97f51a;
      border-radius: 4px;
      overflow: hidden;
    }
  }
</style>
