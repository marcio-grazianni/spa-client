var path = require("path")

module.exports = {
  context: __dirname,

  entry: {
    polyfill: ['babel-polyfill'],
    app: ['./es6/index'],
    reviewPage: ['babel-polyfill', './es6/review-index'],
    profilePage: ['./es6/profile-index'],
    appointmentRequestPage: ['babel-polyfill', './appointment-request-index'],
    svAdmin: ['babel-polyfill', './es6/svadmin-index'],
    unsubscribePage: ['babel-polyfill', './es6/unsubscribe-index']
  },

  output: {
    path: path.resolve('./bundles/'),
    filename: "[name].js"
  },

  plugins: [
  ], // add all common plugins here

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'react', 'stage-0'],
              plugins: ['transform-decorators-legacy']
            }
          }
        ]
      }
    ]
  },


  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx']
  },
}