/*
 * @Description: 运行模式相关
 * @LastEditors: bright.lin
 * @LastEditTime: 2022-08-09 17:57:57
 */
import type { UCodeExternalHardwareDefinition } from '@ubtech/ucode-extension-common-sdk/types';
import Messages from './messages';

export const runningModeTestBlocks: UCodeExternalHardwareDefinition.GetInfo = {
  name: Messages.runningMode,
  color1: '#f49898',
  color3: '#b47878',
  blocks: [
    {
      opcode: 'running-label',
      blockType: self.UCode.BlockType.LABEL,
      text: Messages.runningModeTitle,
    },
    {
      opcode: 'running-mode-label',
      blockType: self.UCode.BlockType.LABEL,
      text: Messages.runningModeLabel,
    },
    {
      opcode: 'running-mode-event',
      blockType: self.UCode.BlockType.HAT,
      isEdgeActivated: true,
      text: Messages.eventBlock,
      func: 'runningEventFunc',
    },
    {
      opcode: 'running-mode-event-async',
      blockType: self.UCode.BlockType.HAT,
      text: Messages.eventAsyncBlock,
      isEdgeActivated: true,
      func: 'runningEventAsyncFunc',
    },
    {
      opcode: 'running-mode-sync',
      blockType: self.UCode.BlockType.COMMAND,
      text: Messages.syncBlock,
      func: 'runningSyncFunc',
      arguments: {
        INPUT: {
          type: self.UCode.ArgumentType.STRING,
          defaultValue: 'Hello',
          options: {
            type: 'text',
            regExp: '^[a-zA-Z0-9]{0,8}$',
          },
        },
      },
    },
    {
      opcode: 'running-mode-async',
      blockType: self.UCode.BlockType.COMMAND,
      text: Messages.asyncBlock,
      func: 'runningAsyncFunc',
      arguments: {
        INPUT: {
          type: self.UCode.ArgumentType.STRING,
          defaultValue: 'Hello',
          options: {
            type: 'text',
            regExp: '^[a-zA-Z0-9]{0,8}$',
          },
        },
      },
    },
    {
      opcode: 'running-mode-get',
      blockType: self.UCode.BlockType.NUMBER,
      text: Messages.getDataBlock,
      func: 'runningGetFunc',
    },
    {
      opcode: 'switch-mode-online',
      blockType: self.UCode.BlockType.COMMAND,
      text: Messages.onlyOnlineBlock,
      func: 'runningAsyncFunc',
      arguments: {
        INPUT: {
          type: self.UCode.ArgumentType.STRING,
          defaultValue: 'Hello',
          options: {
            type: 'text',
            regExp: '^[a-zA-Z0-9]{0,8}$',
          },
        },
      },
    },
    {
      opcode: 'switch-mode-upload',
      blockType: self.UCode.BlockType.COMMAND,
      text: Messages.onlyUploadBlock,
      func: 'runningUploadOnlyFunc',
      onlySupportUploadMode: true,
      arguments: {
        INPUT: {
          type: self.UCode.ArgumentType.STRING,
          defaultValue: 'Hello',
          options: {
            type: 'text',
            regExp: '^[a-zA-Z0-9]{0,8}$',
          },
        },
      },
    },
  ],
};
