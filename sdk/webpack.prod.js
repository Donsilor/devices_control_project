var path = require('path')
var webpack = require('webpack');
var libraryName = 'HdSmart';


function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: resolve('sdk/src/index.js'),
    output: {
        path: resolve('sdk/dist'),
        filename: 'hdsmart.js',
        // library: libraryName,
        // libraryTarget: 'umd',
        // umdNamedDefine: true
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('sdk/src')]
             }
        ]
    }
}
