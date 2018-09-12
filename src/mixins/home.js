import {getAppUser} from '../common/js/auth'
import {sendGPS} from '../api/home'
import {TEL_DEV} from '../common/js/config'

let pushPositionMixin = {
  methods: {
    pushPositionApi (qwzt) {
      let paramas = getAppUser()
      if (TEL_DEV) {
        this.$store.dispatch('getCurPositon').then(res => {
          // this.$store.commit('SET_POSITION', {longitude: res.longitude, latitude: res.latitude})
          if (res.longitude && res.latitude) {
            Object.assign(paramas, {jd: res.longitude, wd: res.latitude, qwzt: qwzt})
            console.log(paramas, 'paramas')
            sendGPS(paramas).then(res => {
              console.log(res.data, '位置发送')
            }, err => {
              console.log(err, 'pushPositionApiErr')
            })
          }
        }, err => {
          alert(err)
        })
      } else {
        Object.assign(paramas, {jd: '113.7301', wd: '23.054068', qwzt: qwzt})
        console.log(paramas, 'paramas')
        sendGPS(paramas).then(res => {
          console.log(res.data, '位置发送')
        }, err => {
          console.log(err, 'pushPositionApiErr')
        })
      }
    }
  }
}
export {pushPositionMixin}
