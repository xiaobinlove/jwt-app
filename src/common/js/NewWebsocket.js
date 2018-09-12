/**
 * Created by admin on 2017/8/19.
 */
import {WSBROKER, WSPORT} from './config'
import {getAppUser} from './auth'

const WebSocketMsg = function (_self) {
  var wsbroker = WSBROKER
  var wsport = WSPORT // port for above
  var userId = `mjcj#${getAppUser().loginid}_mjcj`
  // var userId = `mjcj#18944788312_htcf`
  // var userId = `mjcj#13341338639`
  var client = new Paho.MQTT.Client(wsbroker, wsport, '/ws', userId)
  var flag = true
  client.onConnectionLost = function (responseObject) {
    console.log('CONNECTION LOST - ' + responseObject.errorMessage)
    reconnect()
    // client.connect(options)
    // WebSocketMsg()
  }
  client.onMessageArrived = function (message) {
    console.log('RECEIVE ON ' + message.destinationName + ' PAYLOAD ' + message.payloadString)
    console.log(message)
    _self.$store.dispatch('socketAction', message.payloadString)
  }
  function getOptions () {
    let options = {
      timeout: 3,
      keepAliveInterval: 10,
      onSuccess: function () {
        console.log('CONNECTION SUCCESS')
        setTimeout(function () {
          client.send('11', '5555555', 1, true)
        }, 5000)
      },
      onFailure: function (message) {
        console.log('CONNECTION FAILURE - ' + message.errorMessage)
        reconnect()
      },
      cleanSession: false, // 使用non-auto-delete队列,防止退出客户端后,队列自动删除
      userName: 'admin',
      password: 'admin'
    }
    return options
  }
  function connect () {
    let options = getOptions()
    if (location.protocol === 'https:') {
      options.useSSL = true
    }
    console.log('CONNECT TO ' + wsbroker + ':' + wsport)
    client.connect(options)
  }
  function reconnect () {
    if (flag) {
      flag = false
      setTimeout(() => {
        flag = true
      }, 2000)
      connect()
    }
  }
  connect()
}
export {WebSocketMsg}
// userName: 'admin',
//   password: 'admin'
