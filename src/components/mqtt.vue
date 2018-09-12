<template>
  <div>mqtt</div>
</template>
<script>
export default {
  data () {
    return {}
  },
  created () {
    this.mqtt()
  },
  watch: {},
  computed: {},
  methods: {
    mqtt () {
      var wsbroker = '192.168.2.56'
      var wsport = 19041 // port for above
      var userId = 'jcj#10000#sadfsdf'
      var client = new Paho.MQTT.Client(wsbroker, wsport, '/ws',
        userId)
      client.onConnectionLost = function (responseObject) {
        console.log('CONNECTION LOST - ' + responseObject.errorMessage)
      }
      client.onMessageArrived = function (message) {
        console.log('RECEIVE ON ' + message.destinationName + ' PAYLOAD ' + message.payloadString)
        console.log(message.payloadString)
      }
      var options = {
        timeout: 3,
        keepAliveInterval: 10,
        onSuccess: function () {
          console.log('CONNECTION SUCCESS')
          setTimeout(function () {
            // client.send("11","5555555",1,true);
          }, 5000)
        },
        onFailure: function (message) {
          console.log('CONNECTION FAILURE - ' + message.errorMessage)
        },
        cleanSession: false, // 使用non-auto-delete队列,防止退出客户端后,队列自动删除
        userName: 'admin',
        password: 'admin'
      }
      if (location.protocol === 'https:') {
        options.useSSL = true
      }
      console.log('CONNECT TO ' + wsbroker + ':' + wsport)
      client.connect(options)
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" type="text/less">
</style>
