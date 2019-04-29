var argv
try {
  argv = JSON.parse(process.env.npm_config_argv).original
} catch (ex) {
  argv = process.argv
}
var product = argv.slice(2)[0]
var params = require('minimist')(argv.slice(3))

var isMock = false
if (argv.indexOf('-mock') > -1) {
  isMock = true
}

if (params.m || params.mobile) {
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

var now = new Date()

exports.getBuildTime = function() {
  return now.getFullYear() + fillz(now.getMonth() + 1) + fillz(now.getDate()) //+ '_' + fillz(now.getHours()) + fillz(now.getMinutes())
}
