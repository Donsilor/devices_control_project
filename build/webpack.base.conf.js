var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf');
var autoprefixer = require('autoprefixer');
var pxtorem = require('postcss-pxtorem');
var webpack = require('webpack');
var util = require('./util');

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

var app = util.getCommandApp();
module.exports = {
    entry: {
        app: ['./src/sdk/assets/hd.sdk.js', `./src/${app}/main.js`]
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src')
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test')]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 8000,
                    name: utils.assetsPath(`images/[name].[hash:7].[ext]`)
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath(`fonts/[name].[hash:7].[ext]`)
                }
            }
        ]
    },
    plugins: [new webpack.LoaderOptionsPlugin({
        vue: {
            postcss: [autoprefixer({
                remove: false
            }), pxtorem({
                rootValue: 30,
                unitPrecision: 3,
                propList: ['*', '!border', '!border-radius'],
                minPixelValue: 3,
                selectorBlackList: ['html']
            })]
        }
    })]
}
