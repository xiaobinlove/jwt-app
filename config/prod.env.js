'use strict'
let buildType = process.argv.slice(2)[0]
let obj = {
  NODE_ENV: '"production"'
}
console.log(`-----start build ----- ${buildType}`)
switch (buildType) {
  case 'pro':
    process.env.srconfig = 'pro'
    obj.srconfig = '"pro"'
    break
  case 'dev':
    process.env.srconfig = 'dev'
    obj.srconfig = '"dev"'
    break
  case 'test':
    process.env.srconfig = 'test'
    obj.srconfig = '"test"'
    break
  default: // 默认开发
    process.env.srconfig = ''
    obj.srconfig = '""'
    break
}
// module.exports = {
//   NODE_ENV: '"production"'
// }
module.exports = obj
