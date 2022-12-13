/*
 * @Description: 积木块相关
 * @LastEditors: bright.lin
 * @LastEditTime: 2022-08-09 17:50:46
 */
import type { UCodeExternalHardwareDefinition } from '@ubtech/ucode-extension-common-sdk/types';
import Messages from './messages';

export const blockTypeTestBlocks: UCodeExternalHardwareDefinition.GetInfo = {
  name: Messages.blockType,
  color1: '#fa6868',
  color3: '#a55b5b',
  blocks: [
    {
      opcode: 'block-type-label1',
      blockType: self.UCode.BlockType.LABEL,
      text: Messages.blockTypeSubTitle,
    },
    {
      opcode: 'block-type-hat',
      blockType: self.UCode.BlockType.HAT,
      isEdgeActivated: true,
      text: Messages.hatBlock,
      func: 'blockHatFunc',
    },
    {
      opcode: 'block-type-hat2',
      blockType: self.UCode.BlockType.HAT,
      text: Messages.terminalBlock,
      isEdgeActivated: true,
      hasNextStatement: false,
      func: 'blockHatFunc',
    },
    {
      opcode: 'block-type-command',
      blockType: self.UCode.BlockType.COMMAND,
      text: Messages.commandBlock,
      func: 'blockCommandFunc',
    },
    {
      opcode: 'block-type-command2',
      blockType: self.UCode.BlockType.COMMAND,
      text: Messages.commandBlock2,
      isTerminal: true,
      func: 'blockCommandFunc',
    },
    {
      opcode: 'block-type-label2',
      blockType: self.UCode.BlockType.LABEL,
      text: Messages.subTitle2,
    },
    {
      opcode: 'block-type-number',
      blockType: self.UCode.BlockType.NUMBER,
      text: Messages.numBlock,
      func: 'blockNumberFunc',
    },
    {
      opcode: 'block-type-reporter',
      blockType: self.UCode.BlockType.REPORTER,
      text: Messages.reporterBlock,
      func: 'blockReporterFunc',
    },
    {
      opcode: 'block-type-boolean',
      blockType: self.UCode.BlockType.BOOLEAN,
      text: Messages.booleanBlock,
      func: 'blockBooleanFunc',
    },
  ],
};
