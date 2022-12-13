import { CommonUtility } from '@ubtech/ucode-extension-common-sdk';
import type { GeneratorDefinition } from '@ubtech/ucode-extension-common-sdk/types';

// 缩进处理函数
const { prefixLines, Cast } = CommonUtility.GeneratorUtil;

export const DemoCustomBlockGenerators: { [key: string]: GeneratorDefinition.BlockGenerator } = {
  'running-mode-event': {
    hat: true, // 帽子块必须显示声明
    // 帽子块
    toCode(args: { [key: string]: any }, constants, branchCode) {
      const definitions: { [key: string]: string } = {};
      definitions['future'] = 'from future import *';
      const funcName = `onGesture_face_down_${crypto.randomUUID().split('-')[0]}`;
      const code = `def ${funcName}():\n${prefixLines(branchCode || '  pass', constants.INDENT)}

sensor.gesTrig['face_down']=${funcName}
sensor.startSchedule()
      `;
      return {
        code,
        definitions,
      };
    },
  },
  'running-mode-sync': {
    toCode(args: { [key: string]: any }) {
      const definitions: { [key: string]: string } = {};
      definitions['future'] = 'from future import *';
      definitions['time'] = 'import time';
      const displayText = /^"(.*)"$/.test(args.INPUT) ? args.INPUT : `"${args.INPUT}"`; // 加上引号
      const code = `screen.clear()\nscreen.text(${displayText}, 5, 10, 1, (255, 200, 180))\ntime.sleep(3)\n`;
      return {
        code,
        definitions,
      };
    },
  },
  'running-mode-get': {
    toCode(args: { [key: string]: any }) {
      return 'sensor.getTemp()';
    },
  },
  'switch-mode-upload': {
    toCode(args: { [key: string]: any }) {
      const definitions: { [key: string]: string } = {};
      definitions['future'] = 'from future import *';
      const displayText = /^"(.*)"$/.test(args.INPUT) ? args.INPUT : `"${args.INPUT}"`; // 加上引号
      const code = `screen.clear()\nscreen.text(${displayText}, 5, 10, 1, (255, 200, 180))\n`;
      return {
        code,
        definitions,
      };
    },
  },
  // -------------- 控件分类的积木块 ---------------
  'field-numpad': {
    toCode(args: { [key: string]: any }) {
      return `print(${Cast.toNumber(args.INPUT)}, ${Cast.toNumber(args.INPUT2)})\n`;
    },
  },
  'field-numpad2': {
    toCode(args: { [key: string]: any }) {
      return `print(${Cast.toNumber(args.INPUT)})\n`;
    },
  },
  'field-numinput': {
    toCode(args: { [key: string]: any }) {
      return `print(${Cast.toNumber(args.INPUT)}, ${Cast.toNumber(args.INPUT2)})\n`;
    },
  },
  'field-numinput2': {
    toCode(args: { [key: string]: any }) {
      return `print(${Cast.toNumber(args.INPUT)})\n`;
    },
  },
  'field-string': {
    toCode(args: { [key: string]: any }) {
      return `print(${args.INPUT})\n`;
    },
  },
  'field-boolean': {
    toCode(args: { [key: string]: any }) {
      return `print(${args.INPUT || 'False'})\n`;
    },
  },
  'field-dropdown-menu': {
    toCode(args: { [key: string]: any }) {
      return `print("${args.MENU}")\n`;
    },
  },
  'field-dialog-menu': {
    toCode(args: { [key: string]: any }) {
      return `print("${args.MENU}")\n`;
    },
  },
  'field-color-hsl': {
    toCode(args: { [key: string]: any }) {
      return `print(${args.COLOR})\n`;
    },
  },
  'field-color-rgb': {
    toCode(args: { [key: string]: any }) {
      return `print(${args.COLOR})\n`;
    },
  },
  'field-note': {
    toCode(args: { [key: string]: any }) {
      return `print(${Cast.toNumber(args.NOTE)})\n`;
    },
  },
  'field-angle': {
    toCode(args: { [key: string]: any }) {
      return `print(${Cast.toNumber(args.ANGLE)})\n`;
    },
  },
  'field-matrix': {
    toCode(args: { [key: string]: any }) {
      return `print(${args.MATRIX}, ${args.MATRIX2})\n`;
    },
  },
  'field-matrix1': {
    toCode(args: { [key: string]: any }) {
      return `print(${args.MATRIX}, ${args.MATRIX1}, ${args.MATRIX2})\n`;
    },
  },
};
