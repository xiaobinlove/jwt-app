/**
 * Created by DGGA on 2017/11/10.
 */
/*
* 日期时间转换
* */

let formatDate = val => {
  if (val === null || val === '') {
    return
  }
  function add0 (m) {
    return m < 10 ? '0' + m : m
  }
  let time = new Date(parseInt(val))
  let y = time.getFullYear()
  let m = time.getMonth() + 1
  let d = time.getDate()
  let h = time.getHours()
  let i = time.getMinutes()
  // var s = time.getSeconds()
  return `${add0(y)}-${add0(m)}-${add0(d)} ${add0(h)}:${add0(i)}`
}
let sortDate = val => {
  if (val === null || val === '') {
    return
  }
  function add0 (m) {
    return m < 10 ? '0' + m : m
  }
  let time = new Date(parseInt(val))
  // let y = time.getFullYear()
  // let m = time.getMonth() + 1
  // let d = time.getDate()
  let h = time.getHours()
  let i = time.getMinutes()
  // var s = time.getSeconds()
  return `${add0(h)}:${add0(i)}`
}
let formatShortDate = val => {
  if (val === null || val === '') {
    return
  }
  function add0 (m) {
    return m < 10 ? '0' + m : m
  }
  let time = new Date(parseInt(val))
  // let y = time.getFullYear()
  // let m = time.getMonth() + 1
  // let d = time.getDate()
  let h = time.getHours()
  let i = time.getMinutes()
  // var s = time.getSeconds()
  return `${add0(h)}:${add0(i)}`
}
let today = val => {
  if (val === null || val === '') {
    return
  }
  switch (val) {
    case 0:
      return '星期日'
    case 1:
      return '星期一'
    case 2:
      return '星期二'
    case 3:
      return '星期三'
    case 4:
      return '星期四'
    case 5:
      return '星期五'
    case 6:
      return '星期六'
  }
}
let formatJqdjmc = val => {
  console.log(val, 'formatJqdjmc')
  if (val === null || val === '') {
    return
  }
  switch (val) {
    case '01':
      return '一级'
    case '02':
      return '二级'
    case '03':
      return '三级'
    case '04':
      return '四级'
  }
}

export {
  formatDate, today, formatJqdjmc, formatShortDate, sortDate
}
