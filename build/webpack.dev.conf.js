var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var util = require('./util');

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

var app = util.getCommandApp();
var appName = util.getCommandAppName();

baseWebpackConfig.entry['after_iot'] = `${__dirname}/../src/__global_iot_proxy/hd.iot.${app}.js`;

module.exports = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({sourceMap: config.dev.cssSourceMap})
    },
    // cheap-module-eval-source-map is faster for development
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            title: 'test',
            filename: 'index.html',
            template: 'index.html',
            title: appName,
            inject: true,
            chunksSortMode: function (chunkA, chunkB) {
                let orderAWeight = 0;
                let orderBWeight = 0;
                if (/^before/.test(chunkA.names[0])) {
                    orderAWeight = 1;
                }
                if (/^before/.test(chunkB.names[0])) {
                    orderBWeight = 1;
                }
                if (/^after/.test(chunkA.names[0])) {
                    orderAWeight = -1;
                }
                if (/^after/.test(chunkB.names[0])) {
                    orderBWeight = -1;
                }
                return orderBWeight - orderAWeight;
            }
        }),
        new FriendlyErrorsPlugin()
    ]
})
