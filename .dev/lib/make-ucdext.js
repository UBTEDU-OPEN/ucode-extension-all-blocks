const AdmZip = require("adm-zip");
const path = require('path');

const DEFAULT_PATH = path.join(__dirname, '../../dist');
const DEFAULT_UCDEXT_PATH = path.join(__dirname, '../../dist/ext.ucdext');

/**
 * 获取 .ucdext 插件压缩包数据
 * @param {string} distPath ["dist"] dist 目录
 */
function getUCDEXT(distPath = DEFAULT_PATH) {
  const zip = new AdmZip();
  zip.addLocalFile(path.join(distPath, 'manifest.json'));
  zip.addLocalFile(path.join(distPath, 'main.js'));
  zip.addLocalFile(path.join(distPath, 'logo.svg'));
  return zip;
}

/**
 * 生成 .ucdext 插件压缩包
 * @param {string} distPath ["dist"] dist 目录
 * @param {string} targetExtPath ["dist/ext.ucdext"]
 */
function writeUCDEXT(distPath = DEFAULT_PATH, targetExtPath = DEFAULT_UCDEXT_PATH) {
  const zip = getUCDEXT(distPath);
  zip.writeZip(targetExtPath);
}

module.exports = {
  getUCDEXT,
  writeUCDEXT,
}
