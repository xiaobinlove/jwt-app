<template>
  <div class="message">
    <div class="msg-wrapper">
      <p class="time">{{item.cjsj | formatDate}}</p>
      <div class="msg-item">
        <div class="user">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-jingcha"></use>
          </svg>
        </div>
        <div class="content">
          <p>{{item.cjrxm}}</p>
          <div class="text">
            <div class="text-msg">
              {{item.xxnr}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  name: 'message',
  data () {
    return {
    }
  },
  props: {
    item: Object
  },
  methods: {
  }
}
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/less/sum";
  .message {
    /*background-color: #edecf2;*/
    .msg-wrapper {
      width: auto;
      overflow: hidden;
      border-bottom: 1px solid #d6d6d6;
      .time {
        text-align: center;
        /*.fs(20);*/
        color: #7f7e83;
      }
      .msg-item {
        width: auto;
        .pl(40);
        display: flex;
        align-items: flex-start;
        .user {
          width: 10%;
          display: flex;
          align-items: flex-start;
          .icon {
            .w(100);
            .h(100);
            background-color: #88a48d;
            border-radius: 50%;
          }
        }
        .content {
          width: 90%;
          p {
            text-align: left;
          /*  .fs(20);*/
            .pl(20);
            color: #7f7e83;
          }
          .text {
            width: auto;
            position: relative;
            .pl(40px);
            .pr(60px);
            .pt(20);
            .pb(20);
            .text-msg {
              background-color: #adda41;
              word-break: break-all;
              box-shadow: 0 0 8px 0px #191919;
              border-radius: 8px;
              .pl(20);
              .pr(20);
              .pt(20);
              .pb(20);
              .fs(48);
            }
          }
        }
      }
    }
  }
</style>
