var argv
try {
  argv = JSON.parse(process.env.npm_config_argv).original
} catch (ex) {
  argv = process.argv
}
console.log('process.env.npm_config_argv')
console.log(process.env.npm_config_argv)
var product = argv.slice(2)[0]
let reg = /.*src(\/|\\)/
let reg1 = /\\/g
product=product.replace(reg,'')
product=product.replace(reg1,'/')
// var params = require('minimist')(argv.slice(3))
var isMock = false
if (argv.indexOf('-mock') > -1) {
  isMock = true
}

var debug = false
if (argv.indexOf('-debug') > -1) {
  debug = true
}
// if (params.m || params.mobile) {
//   product += '_m'
// }
if (argv.indexOf('-m') > -1) {
  product += '_m'
}

function fillz(num) {
  num = num + ''
  return num.length == 1 ? '0' + num : num
}

exports.getInputName = function() {
  return product
}

exports.getIsMock = function() {
  return isMock
}

exports.getdebug = function() {
  return debug
}
var now = new Date()

exports.getBuildTime = function() {
  return now.getFullYear() + fillz(now.getMonth() + 1) + fillz(now.getDate()) //+ '_' + fillz(now.getHours()) + fillz(now.getMinutes())
}
