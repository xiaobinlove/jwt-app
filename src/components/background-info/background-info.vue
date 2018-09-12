<template>
  <div class="background-info">
    <alarm-header :title="'背景信息'"></alarm-header>
    <div>
      <div class="background-info-content">
        <div class="info-title t-c">
          报警人背景关联信息
        </div>
        <div class="info-content">
          <div class="info-item">
            资源名称
            <span class="label">相关用户信息</span>
          </div>
          <div class="info-item">
            证件号码
            <span class="label">{{backgroundInfoData.zjhm}}</span>
          </div>
          <div class="info-item">
            出生年月
            <span class="label">{{backgroundInfoData.csrq}}</span>
          </div>
          <div class="info-item">
            户籍地址
            <span class="label">{{backgroundInfoData.hjdz_dzmc}}</span>
          </div>
          <div class="info-item">
            现住址
            <span class="label">{{backgroundInfoData.xzz_dzmc}}</span>
          </div>
        </div>
      </div>
      <!--<div class="background-info-content">-->
        <!--<div class="info-title t-c">-->
          <!--报警人背景关联信息-->
        <!--</div>-->
        <!--<div class="info-content">-->
          <!--<div class="info-item">-->
            <!--资源名称-->
            <!--<span class="label">相关用户信息</span>-->
          <!--</div>-->
          <!--<div class="info-item">-->
            <!--报警人信息-->
            <!--<span class="label">先生 男 35岁 湖南</span>-->
          <!--</div>-->
          <!--<div class="info-item">-->
            <!--犯罪前科信息-->
            <!--<span class="label">2018-04-19</span>-->
          <!--</div>-->
          <!--<div class="info-item">-->
            <!--违法前科信息-->
            <!--<span class="label">先生</span>-->
          <!--</div>-->
          <!--<div class="info-item">-->
            <!--婚姻状况-->
            <!--<span class="label">已婚</span>-->
          <!--</div>-->
          <!--<div class="info-item">-->
            <!--车辆信息-->
            <!--<span class="label">湘A232323</span>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
import alarmHeader from '../components/alarm-hearder'
import {mapGetters} from 'vuex'

export default {
  name: 'TodoDetail',
  components: {alarmHeader},
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      backgroundInfoData: 'backgroundInfoData'
    })
  },
  created () {},
  methods: {}
}
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/less/sum.less";
  @import "../../common/less/varlable.less";
  .background-info {
    height: 100%;
    background: #eeedf3;
    .background-info-content {
      .pl(43);
      .pr(43);
      .info-title {
        .h(92);
        .lh(92);
        color: #000;
        .fs(35);
        font-weight: bold;
      }
      .info-content {
        color: #676767;
        background: #fff;
        border-radius: 5px;
        border: 1px solid #868686;
        .pl(42);
        .pr(42);
        .info-item {
          .fs(33);
          .h(107);
          .lh(107);
          border-bottom: 1px solid #898989;
          .label {
            display: inline-block;
            .ml(35);
            color: #000;
          }
          &:nth-last-of-type(1) {
            border-bottom: none;
          }
        }
      }
    }
  }
</style>
