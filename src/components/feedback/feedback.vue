<template>
  <div class="feedback">
    <view-box ref="historView" body-padding-top="46px" body-padding-bottom="49px">
      <x-header slot="header" :left-options="{backText: '返回'}" style="width:100%;position:absolute;left:0;top:0;z-index:100;">
        <span>处警反馈</span>
        <!--<x-icon slot="overwrite-left" type="ios-arrow-left" size="30" style="fill:#fff;position:relative;left:-15px;top:-5px;"></x-icon>-->
      </x-header>
      <div class="wrapper">
        <message :msg="'已签收当前警情'"></message>
        <message :msg="'已到达现场'"></message>
        <message :msg="'正在联系报警人'"></message>
        <message :msg="'报警人无受伤，正在调查案件发生经过'"></message>
        <message :msg="'需协助增援警力协助'"></message>
        <message :msg="'处理完毕'"></message>
      </div>
      <group slot="bottom" class="msg-bottom">
        <x-input>
          <x-button slot="right" type="primary" mini>发送</x-button>
          <x-icon slot="right" type="ios-plus" size="30" style="fill: #1AAD19;"></x-icon>
        </x-input>
        <ul class="list">
          <li>
            <i class="iconfont icon-xiangji"></i>
            <span>拍照</span>
          </li>
          <li>
            <i class="iconfont icon-duanxin"></i>
            <span>相册</span>
          </li>
          <li>
            <i class="iconfont icon-voice_icon"></i>
            <span>录音</span>
          </li>
          <li>
            <i class="iconfont icon-wenjianjia1"></i>
            <span>短语</span>
          </li>
          <li>
            <i class="iconfont icon-shipin"></i>
            <span>视频</span>
          </li>
        </ul>
      </group>
    </view-box>
  </div>
</template>

<script>
import message from '../components/message.vue'
import XHeader from '../../../node_modules/vux/src/components/x-header/index.vue'
import XButton from '../../../node_modules/vux/src/components/x-button/index.vue'
export default {
  components: {
    XButton,
    XHeader,
    message
  },
  name: 'feedback',
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/less/sum";
  .feedback {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background-color: #edecf2;
    .msg-bottom {
      width: 100%;
      overflow: hidden;
      background-color: #fff;
      position: absolute;
      left: 0;
      bottom: 0;
      .weui-cells {
        margin-top: 0;
      }
      .weui-cell {
        .pr(10);
        .pt(10);
        .pb(10);
      }
      .weui-input {
        border: 1px solid #3396d9;
        border-radius: 4px;
      }
      .weui-cell__bd {
        margin-right: 4px;
      }
      .weui-icon {
        display: flex;
        align-items: center;
      }
      .weui-cell__ft {
        display: flex;
        justify-content: space-between;
      }
      .list {
        width: auto;
        padding-left: 15px;
        padding-right: 15px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .pt(10);
        li {
          .pl(40);
          .pr(40);
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
          .iconfont {
            .fs(60);
            .lh(40);
            margin: 0;
          }
          span {
            .fs(20);
          }
        }
      }
    }
    .wrapper {
      width: 100%;
      overflow: hidden;
      background-color: #fff;
    }
  }
</style>
