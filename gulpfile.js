const path = require('path');
const { task, dest, src } = require('gulp');
const merge = require('merge-stream');
const zip = require('gulp-zip');
const template = require('gulp-template');
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const webpackCompiler = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const package = require('./package.json');
const output = {
  artifactName:
    `${(process.env.BASE_URL || package.name).replace(/\//g, '')}` +
    `##${package.version}.war`,
  paths: {
    api: path.resolve(__dirname, './.tmp/api')
  }
};

//
// DEFAULT
//

task('build', () => {
  return merge(
    src('./src/index.tsx').pipe(webpack(webpackConfig, webpackCompiler)),
    src('./extras/**/*').pipe(template(process.env))
  )
    .pipe(zip(output.artifactName))
    .pipe(dest('build'));
});

task('start', cb => {
  const devServerConfig = {
    hot: true,
    inline: true,
    public: 'http://localhost:8080',
    historyApiFallback: true
  };
  if (process.env.API_PROXY) {
    devServerConfig.proxy = {
      // TODO: вопросы к универсальности
      // проксирования абсолютного контекста
      [process.env.API_URL]: {
        target: process.env.API_PROXY,
        pathRewrite: {
          ['^' + process.env.API_URL]: '/'
        }
      }
    };
  }
  WebpackDevServer.addDevServerEntrypoints(webpackConfig, devServerConfig);
  new WebpackDevServer(webpackCompiler(webpackConfig), devServerConfig).listen(
    8080,
    'localhost'
  );
});
