var webpack = require('webpack')
var path = require('path')

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  mode:'development',
  entry:path.join(__dirname,"js/app/index.js"),
  output: {
      path: path.join(__dirname,"../public/js"),
      filename:"index.js"
  },
  resolve: {
      alias: {
        jquery: path.join(__dirname,"js/lib/jquery-3.3.1.min.js"),
        mod: path.join(__dirname,"js/mod"),
        less: path.join(__dirname,"less")
      }
  },
  module: {
    rules: [{
      test: /\.less$/,
      use: [{
        loader: 'style-loader' // creates style nodes from JS strings
      }, {
        loader: 'css-loader' // translates CSS into CommonJS
      }, {
        loader: 'less-loader' // compiles Less to CSS
      }]
    }]
  },
  plugin: [
    new webpack.ProvidePlugin({
      $: 'jquery',
    })
  ]

}