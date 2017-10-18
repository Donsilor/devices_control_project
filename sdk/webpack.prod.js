var path = require('path')
var webpack = require('webpack');
var libraryName = 'HdSmart';


function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: __dirname + '/src/index.js',
    output: {
        path: __dirname + '/dist',
        filename: 'hdsmart.js',
        //library: libraryName,
        //libraryTarget: 'umd',
        //umdNamedDefine: true
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('sdk')]
             }
        ]
    }
}
