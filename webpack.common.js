const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { merge } = require('webpack-merge');
const webpackCommon = require('@ubtech/ucode-extension-developer-kit/webpack/webpack.common');

module.exports = merge(webpackCommon, {
  entry: path.join(__dirname, 'src/index.ts'),
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'static/manifest.json',
          to: '.',
        },
        {
          from: 'static/logo.svg',
          to: '.',
        },
      ],
    }),
  ],
});
