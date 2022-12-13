const Ajv = require('ajv');
const schema = require('./manifest_schema.json');
const input = require('../static/manifest.json');

function validateManifest() {
  const ajv = new Ajv();

  const validate = ajv.compile(schema);

  const valid = validate(input);

  if (!valid) {
    console.log(validate.errors);
    throw new Error('Manifest 校验出错');
  } else {
    console.log('');
    console.log('Manifest 校验成功');
    console.log('');
  }
}

module.exports = validateManifest;
