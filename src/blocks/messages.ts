const formatMessage = self.UCode.formatMessage;

export default {
  blockType: formatMessage({
    id: 'category.name.blockType',
    defaultMessage: '积木类型',
  }),
  fieldType: formatMessage({
    id: 'category.name.fieldType',
    defaultMessage: '积木控件',
  }),
  runningMode: formatMessage({
    id: 'category.name.runningMode',
    defaultMessage: '运行模式',
  }),
  blockTypeSubTitle: formatMessage({
    id: 'blocks.blockTypeSubTitle',
    defaultMessage: '类型 子标题1 (BlockType.LABEL)',
  }),
  hatBlock: formatMessage({
    id: 'blocks.hatBlock',
    defaultMessage: '类型 帽子块 (BlockType.HAT)',
  }),
  terminalBlock: formatMessage({
    id: 'blocks.terminalBlock',
    defaultMessage: '类型 帽子块截止块 (BlockType.HAT, hasNextStatement=false)',
  }),
  commandBlock: formatMessage({
    id: 'blocks.commandBlock',
    defaultMessage: '类型 执行块 (BlockType.COMMAND)',
  }),
  commandBlock2: formatMessage({
    id: 'blocks.commandBlock2',
    defaultMessage: '类型 截止块 (BlockType.COMMAND, isTerminal=true)',
  }),
  subTitle2: formatMessage({
    id: 'blocks.subTitle2',
    defaultMessage: '类型 子标题2 (BlockType.LABEL)',
  }),
  numBlock: formatMessage({
    id: 'blocks.numBlock',
    defaultMessage: '类型 数值块 (BlockType.NUMBER)',
  }),
  reporterBlock: formatMessage({
    id: 'blocks.reporterBlock',
    defaultMessage: '类型 报告块 (BlockType.REPORTER)',
  }),
  booleanBlock: formatMessage({
    id: 'blocks.booleanBlock',
    defaultMessage: '类型 布尔块 (BlockType.BOOLEAN)',
  }),
  validationBlock: formatMessage({
    id: 'blocks.validationBlock',
    defaultMessage: '运行可验证参数获取',
  }),
  numPadBlock: formatMessage({
    id: 'blocks.numPadBlock',
    defaultMessage: '控件 数字输入盘（-10～10的整数）[INPUT]，（-10～10的2位小数）[INPUT2]',
  }),
  numInputBlock: formatMessage({
    id: 'blocks.numInputBlock',
    defaultMessage: '控件 数字输入盘（正则表达式+min+max参数判断：-10～10的2位小数）[INPUT]',
  }),
  numInput2Block: formatMessage({
    id: 'blocks.numInput2Block',
    defaultMessage: '控件 数字输入（-10～10的整数）[INPUT]，（-10～10的2位小数）[INPUT2]',
  }),
  numInput3Block: formatMessage({
    id: 'blocks.numInput3Block',
    defaultMessage: '控件 数字输入（正则表达式+min+max参数判断：-10～10的2位小数）[INPUT]',
  }),
  stringBlock: formatMessage({
    id: 'blocks.stringBlock',
    defaultMessage: '控件 字符串（a~zA~Z 8个字符）[INPUT]',
  }),
  booleanFieldBlock: formatMessage({
    id: 'blocks.booleanFieldBlock',
    defaultMessage: '控件 布尔值 [INPUT]',
  }),
  dropdownBlock: formatMessage({
    id: 'blocks.dropdownBlock',
    defaultMessage: '控件 下拉菜单 [MENU]',
  }),
  dialogFieldBlock: formatMessage({
    id: 'blocks.dialogFieldBlock',
    defaultMessage: '控件 菜单选择弹窗 [MENU]',
  }),
  HSLBlock: formatMessage({
    id: 'blocks.HSLBlock',
    defaultMessage: '控件 颜色HSL [COLOR]',
  }),
  RGBBlock: formatMessage({
    id: 'blocks.RGBBlock',
    defaultMessage: '控件 颜色RGB [COLOR]',
  }),
  toneBlock: formatMessage({
    id: 'blocks.toneBlock',
    defaultMessage: '控件 音符 [NOTE]',
  }),
  angleBlock: formatMessage({
    id: 'blocks.angleBlock',
    defaultMessage: '控件 角度 [ANGLE]',
  }),
  matrixBlock: formatMessage({
    id: 'blocks.matrixBlock',
    defaultMessage: '控件 5x5(默认) 点阵 [MATRIX], 5x10 点阵 [MATRIX2]',
  }),
  matrixCustomBlock: formatMessage({
    id: 'blocks.matrixCustomBlock',
    defaultMessage: '控件 8x8(默认) 自定义点阵 [MATRIX], 4x16 点阵 [MATRIX1],4x4 点阵 [MATRIX2]',
  }),
  runningModeTitle: formatMessage({
    id: 'blocks.runningModeTitle',
    defaultMessage: '运行模式+通信测试',
  }),
  runningModeLabel: formatMessage({
    id: 'blocks.runningModeLabel',
    defaultMessage: '在线/烧录模式',
  }),
  eventBlock: formatMessage({
    id: 'blocks.eventBlock',
    defaultMessage: '监听 事件块（当姿态朝下）（轮询周期1秒）',
  }),
  eventAsyncBlock: formatMessage({
    id: 'blocks.eventAsyncBlock',
    defaultMessage: '监听 事件块（当姿态朝下）（轮询周期1秒）异步处理',
  }),
  syncBlock: formatMessage({
    id: 'blocks.syncBlock',
    defaultMessage: '运行 阻塞块 直到结束(设置了3秒）：显示文本(英文或数字8个字符以内) [INPUT]',
  }),
  asyncBlock: formatMessage({
    id: 'blocks.asyncBlock',
    defaultMessage: '运行 非阻塞块(不等待,循环中运行需加延迟块)：显示文本(英文或数字8个字符以内) [INPUT]',
  }),
  getDataBlock: formatMessage({
    id: 'blocks.getDataBlock',
    defaultMessage: '获取数据（温度）',
  }),
  onlyOnlineBlock: formatMessage({
    id: 'blocks.onlyOnlineBlock',
    defaultMessage: '切换 仅支持在线模式：发送数据(英文或数字8个字符以内) [INPUT]',
  }),
  onlyUploadBlock: formatMessage({
    id: 'blocks.onlyUploadBlock',
    defaultMessage: '切换 仅支持烧录模式：显示文本(英文或数字8个字符以内) [INPUT]',
  }),
};
