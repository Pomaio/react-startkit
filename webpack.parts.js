const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const absolutize = v => path.join(__dirname, v);

const typescriptRule = {
  test: /\.(tsx?|jsx?)$/i,
  use: [
    {
      loader: 'babel-loader',
      options: {
        babelrc: false,
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                chrome: '50'
              }
            }
          ],
          '@babel/preset-react'
        ],
        plugins: [
          'react-hot-loader/babel',
          ['babel-plugin-styled-components', { displayName: true }],
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          ['@babel/plugin-proposal-class-properties', { loose: true }],
          ['@babel/plugin-transform-typescript', { isTSX: true }],
          ['@babel/plugin-syntax-dynamic-import']
        ]
      }
    }
  ],
  exclude: /node_modules/
};

const cssRule = {
  test: /\.css$/,
  use: [
    // здесь важно использовать не какой-нибудь
    // style-loader, чтобы styled-components имели
    // приоритет относительно импортированных стилей antd
    {
      loader: MiniCssExtractPlugin.loader
    },
    'css-loader'
  ]
};

const fontsRule = {
  test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: 'fonts/'
      }
    }
  ]
};

const svgRule = {
  test: /\.svg$/i,
  use: [
    {
      loader: 'babel-loader'
    },
    {
      loader: 'react-svg-loader',
      options: { jsx: false }
    }
  ]
};

const imagesRule = {
  test: /\.(jpe?g|png)$/i,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: 'images/'
      }
    }
  ]
};

const plugins = [
  new ForkTsCheckerWebpackPlugin(),
  new CircularDependencyPlugin({
    exclude: /a\.js|node_modules/,
    failOnError: true,
    cwd: process.cwd()
  }),
  new HtmlWebpackPlugin({
    template: absolutize('src/index.html'),
    inject: 'body',
    favicon: absolutize('src/images/favicon.ico')
  }),
  new webpack.EnvironmentPlugin({
    NODE_ENV: 'development',
    BASE_URL: '/',
    API_URL: '/',
    HAS_MOCKS: false
  }),
  new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[id].css'
  })
];

module.exports = {
  absolutize,
  typescriptRule,
  cssRule,
  fontsRule,
  svgRule,
  imagesRule,
  plugins
};
