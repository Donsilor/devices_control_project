var argv;
try {
    argv = JSON.parse(process.env.npm_config_argv).original;
}	catch(ex) {
    argv = process.argv;
}
var prod = argv.slice(2)[0]
var params = require('minimist')(argv.slice(3))
var products = require('../products.json')
var appConfig = global.appConfig = products[prod]

if(!appConfig){
    throw new Error(`${prod} is not found in products.json`);
}

if(params.m || params.mobile){
    appConfig.src = appConfig.mobileSrc
}

exports.getAppConfig = function(){
    return global.appConfig
}

exports.getCommandPort = function () {
    return global.appConfig.port || 8081
};

exports.getCommandApp = function () {
    if(appConfig.src){
        return appConfig.src
    }else{
        throw new Error('src is undefined');
    }
}

exports.getCommandAppName = function () {
    if(appConfig.name){
        return appConfig.name
    }else{
        throw new Error('name is undefined');
    }
}
