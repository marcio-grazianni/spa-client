var BundleTracker = require('webpack-bundle-tracker')

var config = require('./webpack.base.config.js')

config.plugins = config.plugins.concat([
  new BundleTracker({filename: './webpack-stats-qa.json'}),

  // removes a lot of debugging code in React
  // new webpack.DefinePlugin({
  //   'process.env': {
  //     'NODE_ENV': JSON.stringify('production')
  // }}),

  // minifies your code
  // new webpack.optimize.UglifyJsPlugin({
  //   compressor: {
  //     warnings: false
  //   }
  // })
])


module.exports = config