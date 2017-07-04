var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var util = require('./util');
var env = config.build.env;
var appName = util.getCommandAppName();
var app = util.getCommandApp();

// 本地测试使用
// baseWebpackConfig.entry['after_iot'] = `${__dirname}/../src/__global_iot_proxy/${app}/index.js`;
// 使用此entry可以进行打包后代码测试，但需要在链接后面加上 ?env=desktop

var webpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true
        })
    },
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    output: {
        path: config.build.assetsRoot,
        filename: 'js/[name].[chunkhash].js',
        chunkFilename: 'js/[id].[chunkhash].js'
    },
    plugins: [
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        new webpack.DefinePlugin({
            'process.env': env
        }),
        new UglifyJSPlugin(),
        // extract css into its own file
        new ExtractTextPlugin({
            filename: '[name].[contenthash].css'
        }),
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),
        // generate dist index.html with correct asset hash for caching.
        // you can customize output by editing /index.html
        // see https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: config.build.index,
            template: 'index.html',
            inject: true,
            title: appName,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: utils.sortChunks
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: config.build.assetsSubDirectory,
                ignore: ['.*']
            }
        ])
    ]
})
//
// if (config.build.productionGzip) {
//     var CompressionWebpackPlugin = require('compression-webpack-plugin')
//
//     webpackConfig.plugins.push(
//         new CompressionWebpackPlugin({
//             asset: '[path].gz[query]',
//             algorithm: 'gzip',
//             test: new RegExp(
//                 '\\.(' +
//                 config.build.productionGzipExtensions.join('|') +
//                 ')$'
//             ),
//             threshold: 10240,
//             minRatio: 0.8
//         })
//     )
// }
//
// if (config.build.bundleAnalyzerReport) {
//     var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
//     webpackConfig.plugins.push(new BundleAnalyzerPlugin())
// }

module.exports = webpackConfig
