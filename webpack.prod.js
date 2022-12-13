const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { writeUCDEXT, getManifest, copyManifestIcon } = require('@ubtech/ucode-extension-developer-kit/lib/make-ucdext');
const validateManifest = require('@ubtech/ucode-extension-developer-kit/validate');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
          getManifest().then((manifest) => {
            copyManifestIcon(manifest)
              .then(() => {
                validateManifest(manifest);
                writeUCDEXT(manifest);
              })
              .catch((err) => process.exit(-1));
          });
        });
      },
    },
  ],
});
