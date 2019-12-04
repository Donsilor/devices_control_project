var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var webpack = require('webpack')
var util = require('./util')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

var isProduction = process.env.NODE_ENV === 'production'
var app = util.getInputName()

module.exports = {
  entry: {
    sdk: './lib/hdsmart.js',
    app: [`./src/${app}/main.js`]
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: isProduction ? config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': path.resolve('src'),
      '@lib': path.resolve('lib'),
      '@mock': path.resolve('mock'),
      '~': path.resolve('./')
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
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1, // 页面内置到APP，没必要减少请求数，反而会增加代码大小
          name: isProduction ? 'images/[name].[hash:7].[ext]' : utils.assetsPath(`images/[name].[hash:7].[ext]`)
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1,
          name: isProduction ? 'fonts/[name].[hash:7].[ext]' : utils.assetsPath(`fonts/[name].[hash:7].[ext]`)
        }
      }
    ]
  },
  plugins: [new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.ProvidePlugin({
        $:'jquery'
      })
  ]
}
