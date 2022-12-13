const formatMessage = self.UCode.formatMessage;
export default {
  customDialog: formatMessage({
    id: 'settings.customDialog',
    defaultMessage: '我的组件（自定义弹窗，无图标）',
  }),
  customDialogTitle: formatMessage({
    id: 'settings.customDialogTitle',
    defaultMessage: '我的组件',
  }),
  firmwareVersion: formatMessage({
    id: 'settings.firmwareVersion',
    defaultMessage: '查看固件版本（仅在线模式）',
  }),
  firmwareVersionToast: formatMessage({
    id: 'settings.firmwareVersionToast',
    defaultMessage: '点击了 查看固件版本 菜单',
  }),
  fileManager: formatMessage({
    id: 'settings.fileManager',
    defaultMessage: '文件管理',
  }),
  uploadFirmware: formatMessage({
    id: 'settings.uploadFirmware',
    defaultMessage: '升级固件（仅烧录模式、串口）',
  }),
  uploadFirmwareToast: formatMessage({
    id: 'settings.uploadFirmwareToast',
    defaultMessage: '点击了 升级固件 菜单',
  }),
  scanFile: formatMessage({
    id: 'settings.scanFile',
    defaultMessage: '扫描指定路径文件列表',
  }),
  scanPath: formatMessage({
    id: 'settings.scanPath',
    defaultMessage: '扫描路径',
  }),
  inputPath: formatMessage({
    id: 'settings.inputPath',
    defaultMessage: '请输入路径',
  }),
  scanCounts: formatMessage({
    id: 'settings.scanCounts',
    defaultMessage: '扫描完成，目录和文件共[COUNT]个',
  }),
  scanError: formatMessage({
    id: 'settings.scanError',
    defaultMessage: '扫描目录出错：',
  }),
  createFolder: formatMessage({
    id: 'settings.createFolder',
    defaultMessage: '创建目录',
  }),
  folderName: formatMessage({
    id: 'settings.folderName',
    defaultMessage: '请输入目录名',
  }),
  folderSuccess: formatMessage({
    id: 'settings.folderSuccess',
    defaultMessage: '创建目录完成',
  }),
  folderFail: formatMessage({
    id: 'settings.folderFail',
    defaultMessage: '创建目录出错',
  }),
  deviceInfo: formatMessage({
    id: 'settings.deviceInfo',
    defaultMessage: '获取设备信息',
  }),
  infoSuccess: formatMessage({
    id: 'settings.infoSuccess',
    defaultMessage: '查询完毕，请查看控制台日志',
  }),
  infoFail: formatMessage({
    id: 'settings.infoFail',
    defaultMessage: '获取设备信息出错：',
  }),
  fileHash: formatMessage({
    id: 'settings.fileHash',
    defaultMessage: '获取文件hash',
  }),
  inputFileName: formatMessage({
    id: 'settings.inputFileName',
    defaultMessage: '请输入文件名',
  }),
  fileContent: formatMessage({
    id: 'settings.fileContent',
    defaultMessage: '获取文件内容',
  }),
  getFileDone: formatMessage({
    id: 'settings.getFileDone',
    defaultMessage: '查询完毕，请查看控制台日志',
  }),
  fileInfo: formatMessage({
    id: 'settings.fileInfo',
    defaultMessage: '获取文件信息',
  }),
  getDone: formatMessage({
    id: 'settings.getDone',
    defaultMessage: '查询完毕',
  }),
  deleteFile: formatMessage({
    id: 'settings.deleteFile',
    defaultMessage: '删除指定文件',
  }),
  deleteDone: formatMessage({
    id: 'settings.deleteDone',
    defaultMessage: '文件已删除',
  }),
  deleteFail: formatMessage({
    id: 'settings.deleteFail',
    defaultMessage: '文件删除出错：',
  }),
  renameAdd: formatMessage({
    id: 'settings.renameAdd',
    defaultMessage: '文件名追加',
  }),
  rename: formatMessage({
    id: 'settings.rename',
    defaultMessage: '重命名',
  }),
  renameDone: formatMessage({
    id: 'settings.renameDone',
    defaultMessage: '文件已重命名：',
  }),
  renameFail: formatMessage({
    id: 'settings.renameFail',
    defaultMessage: '文件重命名出错：',
  }),
  compareHash: formatMessage({
    id: 'settings.compareHash',
    defaultMessage: '比较文件内容hash',
  }),
  hashSame: formatMessage({
    id: 'settings.hashSame',
    defaultMessage: '文件hash一样？',
  }),
  compareFail: formatMessage({
    id: 'settings.compareFail',
    defaultMessage: '文件比较失败：',
  }),
  appendContent: formatMessage({
    id: 'settings.appendContent',
    defaultMessage: '往文件中存放',
  }),
  newAppend: formatMessage({
    id: 'settings.newAppend',
    defaultMessage: '新建文件并写入数据',
  }),
  fileWrite: formatMessage({
    id: 'settings.fileWrite',
    defaultMessage: '文件内容写入结果：',
  }),
  download: formatMessage({
    id: 'settings.download',
    defaultMessage: '下载文件',
  }),
  upload: formatMessage({
    id: 'settings.upload',
    defaultMessage: '上传文件',
  }),
  uploadDone: formatMessage({
    id: 'settings.uploadDone',
    defaultMessage: '文件上传完成',
  }),
  uploadFail: formatMessage({
    id: 'settings.uploadFail',
    defaultMessage: '文件上传出错：',
  }),
  newFile: formatMessage({
    id: 'settings.newFile',
    defaultMessage: '新建文件',
  }),
  newDone: formatMessage({
    id: 'settings.newDone',
    defaultMessage: '完成新建文件',
  }),
  newFail: formatMessage({
    id: 'settings.newFail',
    defaultMessage: '新建文件出错：',
  }),
  gc: formatMessage({
    id: 'settings.gc',
    defaultMessage: '触发gc',
  }),
  reset: formatMessage({
    id: 'settings.reset',
    defaultMessage: '重置设备',
  }),
  resetting: formatMessage({
    id: 'settings.resetting',
    defaultMessage: '设备重启中，大约需要7秒钟时间',
  }),
  resetDone: formatMessage({
    id: 'settings.resetDone',
    defaultMessage: '设备完成重启',
  }),
  resetFail: formatMessage({
    id: 'settings.resetFail',
    defaultMessage: '设备重启失败：',
  }),
  noConnection: formatMessage({
    id: 'device.noConnection',
    defaultMessage: '您还没连接Device设备！',
  }),
};
