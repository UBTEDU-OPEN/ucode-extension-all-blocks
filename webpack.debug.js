/*
 * @Description:
 * @Create by: bright.lin
 * @LastEditors: bright.lin
 * @LastEditTime: 2022-08-10 10:59:03
 */
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { debugServer, serveDebugHttpService } = require('@ubtech/ucode-extension-developer-kit/debug');

serveDebugHttpService();

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  watch: true,
  watchOptions: {
    ignored: '**/node_modules',
    aggregateTimeout: 500,
  },
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
          debugServer.installExtension();
        });
      },
    },
  ],
});
