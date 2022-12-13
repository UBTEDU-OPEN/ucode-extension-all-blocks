/*
 * @Description: 积木块控件(field)相关
 * @LastEditors: bright.lin
 * @LastEditTime: 2022-08-10 16:40:26
 */
import type { UCodeExternalHardwareDefinition } from '@ubtech/ucode-extension-common-sdk/types';
import { testMenus } from '../menus';
import Messages from './messages';

export const fieldTypeTestBlocks: UCodeExternalHardwareDefinition.GetInfo = {
  name: Messages.fieldType,
  color1: '#fa6899',
  color3: '#d51b7b',
  menus: {
    TEST_MENUS: {
      acceptReporters: false,
      items: testMenus,
    },
  },
  blocks: [
    {
      opcode: 'field-type-tips',
      blockType: self.UCode.BlockType.LABEL,
      text: Messages.validationBlock,
    },
    {
      opcode: 'field-numpad',
      blockType: self.UCode.BlockType.COMMAND,
      text: Messages.numPadBlock,
      func: 'fieldNumPadFunc',
      arguments: {
        INPUT: {
          type: self.UCode.ArgumentType.NUMBER_PAD, // 数字输入盘
          defaultValue: 2, // 默认值
          options: {
            type: 'number',
            min: -10, // 最小值，非必填。若regExp值为空，则根据min的值来限制负号的输入。
            max: 10, //最大值，非必填
            precision: 0, //小数点位数限制，非必填。
          },
        },
        INPUT2: {
          type: self.UCode.ArgumentType.NUMBER_PAD, // 数字输入盘
          defaultValue: 2.01, // 默认值
          options: {
            type: 'number',
            min: -10, // 最小值，非必填。若regExp值为空，则根据min的值来限制负号的输入。
            max: 10, //最大值，非必填
            precision: 2, //小数点位数限制，非必填。
          },
        },
      },
    },
    {
      opcode: 'field-numpad2',
      blockType: self.UCode.BlockType.COMMAND,
      text: Messages.numInputBlock,
      func: 'fieldNumPadRegexpFunc',
      arguments: {
        INPUT: {
          type: self.UCode.ArgumentType.NUMBER_PAD, // 数字输入盘
          defaultValue: 2.01, // 默认值
          options: {
            type: 'number',
            max: 10, //最大值，非必填
            min: -10,
            regExp: '^[-]?\\d+(.\\d{0,2})?$', // 校验规则，非必填。校验优先级高于【precision】的限制。
          },
        },
      },
    },
    {
      opcode: 'field-numinput',
      blockType: self.UCode.BlockType.COMMAND,
      text: Messages.numInput2Block,
      func: 'fieldNumInputFunc',
      arguments: {
        INPUT: {
          type: self.UCode.ArgumentType.NUMBER_INPUT, // 数字输入盘
          defaultValue: 2, // 默认值
          options: {
            type: 'number',
            min: -10, // 最小值，非必填。若regExp值为空，则根据min的值来限制负号的输入。
            max: 10, //最大值，非必填
            precision: 0, //小数点位数限制，非必填。
          },
        },
        INPUT2: {
          type: self.UCode.ArgumentType.NUMBER_INPUT, // 数字输入盘
          defaultValue: 2.01, // 默认值
          options: {
            type: 'number',
            min: -10, // 最小值，非必填。若regExp值为空，则根据min的值来限制负号的输入。
            max: 10, //最大值，非必填
            precision: 2, //小数点位数限制，非必填。
          },
        },
      },
    },
    {
      opcode: 'field-numinput2',
      blockType: self.UCode.BlockType.COMMAND,
      text: Messages.numInput3Block,
      func: 'fieldNumInputRegexpFunc',
      arguments: {
        INPUT: {
          type: self.UCode.ArgumentType.NUMBER_PAD, // 数字输入盘
          defaultValue: 2.01, // 默认值
          options: {
            type: 'number',
            max: 10, //最大值，非必填
            min: -10,
            regExp: '^[-]?\\d+(.\\d{0,2})?$', // 校验规则，非必填。校验优先级高于【precision】的限制。
          },
        },
      },
    },
    {
      opcode: 'field-string',
      blockType: self.UCode.BlockType.COMMAND,
      text: Messages.stringBlock,
      func: 'fieldStringRegexpFunc',
      arguments: {
        INPUT: {
          type: self.UCode.ArgumentType.STRING, // 字符串
          defaultValue: 'Hello',
          options: {
            type: 'text',
            regExp: '^[a-zA-Z]{0,8}$', // 校验规则，非必填
          },
        },
      },
    },
    {
      opcode: 'field-boolean',
      blockType: self.UCode.BlockType.COMMAND,
      text: Messages.booleanFieldBlock,
      func: 'fieldBooleanFunc',
      arguments: {
        INPUT: {
          type: self.UCode.ArgumentType.BOOLEAN,
        },
      },
    },
    '---',
    {
      opcode: 'field-dropdown-menu',
      blockType: self.UCode.BlockType.COMMAND,
      text: Messages.dropdownBlock,
      func: 'fieldDropdownMenuFunc',
      arguments: {
        MENU: {
          type: self.UCode.ArgumentType.DROPDOWN_MENU,
          menu: 'TEST_MENUS',
          defaultValue: '菜单1',
        },
      },
    },
    {
      opcode: 'field-dialog-menu',
      blockType: self.UCode.BlockType.COMMAND,
      text: Messages.dialogFieldBlock,
      func: 'fieldDialogMenuFunc',
      arguments: {
        MENU: {
          type: self.UCode.ArgumentType.DIALOG_MENU,
          menu: 'TEST_MENUS',
          defaultValue: '菜单1',
        },
      },
    },
    {
      opcode: 'field-color-hsl',
      blockType: self.UCode.BlockType.COMMAND,
      text: Messages.HSLBlock,
      func: 'fieldHSLFunc',
      arguments: {
        COLOR: {
          type: self.UCode.ArgumentType.COLOR,
          defaultValue: '#0000ff',
        },
      },
    },
    {
      opcode: 'field-color-rgb',
      blockType: self.UCode.BlockType.COMMAND,
      text: Messages.RGBBlock,
      func: 'fieldRGBFunc',
      arguments: {
        COLOR: {
          type: self.UCode.ArgumentType.RGB_COLOR,
          defaultValue: '#00ff00',
        },
      },
    },
    {
      opcode: 'field-note',
      blockType: self.UCode.BlockType.COMMAND,
      text: Messages.toneBlock,
      func: 'fieldNoteFunc',
      arguments: {
        NOTE: {
          type: self.UCode.ArgumentType.NOTE,
          defaultValue: 60,
        },
      },
    },
    {
      opcode: 'field-angle',
      blockType: self.UCode.BlockType.COMMAND,
      text: Messages.angleBlock,
      func: 'fieldAngleFunc',
      arguments: {
        ANGLE: {
          type: self.UCode.ArgumentType.ANGLE,
          defaultValue: 90,
        },
      },
    },
    {
      opcode: 'field-matrix',
      blockType: self.UCode.BlockType.COMMAND,
      text: Messages.matrixBlock,
      func: 'fieldMatrixFunc',
      arguments: {
        MATRIX: {
          type: self.UCode.ArgumentType.MATRIX,
          defaultValue: '0101010101100010101000100',
        },
        MATRIX2: {
          type: self.UCode.ArgumentType.MATRIX,
          defaultValue: '00100011100110001010001000101000100010100010001110',
          options: {
            type: 'matrix',
            col: 10,
            row: 5,
          },
        },
      },
    },
    {
      opcode: 'field-matrix1',
      blockType: self.UCode.BlockType.COMMAND,
      text: Messages.matrixCustomBlock,
      func: 'fieldMatrixFunc1',
      arguments: {
        MATRIX: {
          type: self.UCode.ArgumentType.UCODE_CUSTOM_MATRIX,
        },
        MATRIX1: {
          type: self.UCode.ArgumentType.UCODE_CUSTOM_MATRIX,
          defaultValue: ['1000111100000000', '0001111100000000', '00111111', '10001111'],
        },
        MATRIX2: {
          type: self.UCode.ArgumentType.UCODE_CUSTOM_MATRIX,
          defaultValue: ['1000', '0001', '0011', '1011'],
        },
      },
    },
  ],
};
