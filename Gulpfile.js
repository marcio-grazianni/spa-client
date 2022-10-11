var browserSync = require('browser-sync');
var gulp = require('gulp');
var gutil = require('gulp-util');
var process = require('child_process');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackLocalConfig = require('./webpack.local.config');
var webpackQAConfig = require('./webpack.qa.config');
var less = require('gulp-less');

var paths = {
  less: {
    src: './less/*.less',
    build: './css/build/'
  }
}

gulp.task("djangoDevServer", function(){
  var spawn = process.spawn;
  console.info('Starting Django server');
  var PIPE = {stdio: 'inherit'};
  spawn('python', ['manage.py','runserver'], PIPE);
});

gulp.task("webpackDevServer", function(callback) {
  //Get local external IP address
  var address,
    ifaces = require('os').networkInterfaces();
  for (var dev in ifaces) {
    ifaces[dev].filter(function(details) {
      details.family === 'IPv4' && details.internal === false ? address = details.address: undefined
    });
  }

  new WebpackDevServer(webpack(webpackLocalConfig), {
    publicPath: webpackLocalConfig.output.publicPath,
    hot: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    inline: true,
    historyApiFallback: true
  }).listen(3000, address, function (err, result) {
    if (err) {
      console.log(err)
    }

    console.log('Listening at '+ address +':3000')
  })
});

gulp.task("browserSyncServer", function() {
  browserSync.init({
    notify: false,
    port: 8000,
    proxy: '127.0.0.1:8000'
  })
});

gulp.task("buildScripts", function(callback) {
  webpack(webpackLocalConfig, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      // output options
    }));
    callback();
  });
});

gulp.task("buildScripts:qa", function(callback) {
  webpack(webpackQAConfig, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      // output options
    }));
    callback();
  });
});

gulp.task("buildLess", function() {
  gulp.src(paths.less.src)
    .pipe(less())
    .pipe(gulp.dest(paths.less.build))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task("watchLess", function() {
  gulp.watch(paths.less.src, ['buildLess'])
});

gulp.task('default', ['djangoDevServer', 'webpackDevServer', 'browserSyncServer', 'watchLess']);