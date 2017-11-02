var path = require('path')
var webpack = require('webpack')
var pkg = require('../package.json')

function getBuiltDate() {
    var now = new Date()
    return `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`
}

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

function createConfig(entry, outputName){
    return {
        entry: resolve(entry),
        output: {
            path: resolve('dist'),
            filename: outputName,
            // library: libraryName,
            // libraryTarget: 'umd',
            // umdNamedDefine: true
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    include: [resolve('src')]
                 }
            ]
        },
        plugins: [
            new webpack.BannerPlugin(`${outputName} built at ${getBuiltDate()}`),
        ]
    }
}

module.exports = createConfig('src/debug.js', 'hdsmart.debug.js')
