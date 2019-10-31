const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const {
  absolutize,
  typescriptRule,
  cssRule,
  fontsRule,
  svgRule,
  imagesRule,
  plugins
} = require('./webpack.parts');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: [
    'core-js/modules/es6.promise',
    'core-js/modules/es6.array.iterator',
    absolutize('src/index.tsx')
  ],
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom'
    },
    extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: absolutize('tsconfig.json')
      })
    ]
  },

  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'none' : 'cheap-eval-source-map',

  module: {
    rules: [typescriptRule, cssRule, fontsRule, svgRule, imagesRule]
  },

  plugins,

  output: {
    filename: isProduction ? '[hash].bundle.js' : 'bundle.js',
    publicPath: process.env.BASE_URL
  },

  node: {
    fs: 'empty'
  }
};
