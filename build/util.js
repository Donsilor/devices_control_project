var argv = require('minimist')(process.argv.slice(2));
exports.getCommandPort = function () {
    return argv.port || 8081
};

exports.getCommandApp = function () {
    if(argv.app){
        return argv.app
    }else{
        throw new Error('--app=xxx');
    }
}


exports.getCommandAppName = function () {
    if(argv.appName){
        return argv.appName
    }else{
        throw new Error('--appName=xxx');
    }
}