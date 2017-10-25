var path = require('path')
var pkg = require('../package.json')

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
        }
    }
}

module.exports = [
    createConfig('src/index.js', 'hdsmart.js'),
    createConfig('src/debug.js', 'hdsmart.debug.js'),
]
