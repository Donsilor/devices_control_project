var argv;
try {
    argv = JSON.parse(process.env.npm_config_argv).original;
}	catch(ex) {
    argv = process.argv;
}
var product = argv.slice(2)[0]
var params = require('minimist')(argv.slice(3))

if(params.m || params.mobile){
    product += '_m'
}

exports.getInputName = function(){
    return product
}
