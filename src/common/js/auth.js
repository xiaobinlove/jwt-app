
const IS_OK = 'SUCCESS'
const User = 'User'
const APP_USER_INFON = 'APP_USER_INFON'
// const USER_INFO = getAppUser()
// const LOGIN_ID = USER_INFO.loginId
export {IS_OK}
// 用户ID 做查询用
export function getUser () {
  return JSON.parse(localStorage.getItem(User))
}

export function setUser (token) {
  return localStorage.setItem(User, token)
}
// 储存警务通登陆信息
export function setAppUser (val) {
  return localStorage.setItem(APP_USER_INFON, val)
}
export function getAppUser () {
  return JSON.parse(localStorage.getItem(APP_USER_INFON))
}
