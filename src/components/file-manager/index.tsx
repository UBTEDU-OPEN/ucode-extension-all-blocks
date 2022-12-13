import React from 'react';
import type { CommonUtility as CommonUtilityType } from '@ubtech/ucode-extension-common-sdk';
import { FileInfo, FileManagerProps, FileMangerModalProps, UploadFileInfo } from './file.manager';
import type { DemoSerialPortDevice } from '../../devices/sp-device';
import { FileManager } from './fileManger';

const formatMessage = self.UCode.formatMessage;

const messages = {
  space: formatMessage({
    id: 'ui.space',
    defaultMessage: '空间信息',
  }),
  load: formatMessage({
    id: 'ui.load',
    defaultMessage: '挂载信息',
  }),
};

export function FileManagerModal(props: FileMangerModalProps) {
  let _replDevice: CommonUtilityType.MicroPythonReplUtil.MicroPythonReplDevice;

  const getMicroPythonDevice = () => {
    const device = props.getDevice() as DemoSerialPortDevice; // 目前仅串口
    if (!_replDevice) {
      _replDevice = device.replDevice;
    }
    return _replDevice;
  };

  /**
   * 查询文件列表
   * @filePath 文件路径
   */
  const getFiles = (filePath?: string): Promise<Array<FileInfo>> => {
    return getMicroPythonDevice().listFiles(filePath);
  };

  const onNewFile = (filePath: string): Promise<boolean> => {
    return getMicroPythonDevice().mkdir(filePath);
  };

  const onNewDirectory = (filePath: string): Promise<boolean> => {
    return getMicroPythonDevice().mkdir(filePath);
  };

  /**
   * 从buffer创建下载链接
   */
  function downloadFile(fileName: string, content: Buffer) {
    const downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);
    const ab = new ArrayBuffer(content.length);
    const view = new Uint8Array(ab);
    for (let i = 0; i < content.length; ++i) {
      view[i] = content[i];
    }
    const blob = new Blob([ab]);
    const url = window.URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = decodeURIComponent(fileName);
    downloadLink.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(downloadLink);
  }

  const fileDownLoad = async (filePath: string) => {
    const file = await getMicroPythonDevice().stat(filePath);
    if (file.exists && !file.isDir) {
      const buffer = await getMicroPythonDevice().getFile(filePath);
      downloadFile(filePath.substring(filePath.lastIndexOf('/') + 1), buffer);
      return Promise.resolve(true);
    } else {
      console.error(`"${filePath}" is not a file or no exists!`);
      return Promise.resolve(false);
    }
  };

  const onDownLoad = async (files: Array<FileInfo>): Promise<void> => {
    if (files) {
      for (let i = 0; i < files.length; i++) {
        //等文件读取完
        await fileDownLoad(files[i].filename);
      }
    }
    return Promise.resolve();
  };

  const onRename = (oldFilePath: string, newFilePath: string): Promise<void> => {
    return getMicroPythonDevice().rename(oldFilePath, newFilePath);
  };

  const fileRemove = (filePath: string, recursive = false): Promise<void> => {
    return getMicroPythonDevice().remove(filePath, recursive);
  };

  const onRemove = async (files: Array<FileInfo>): Promise<void> => {
    if (files) {
      for (let i = 0; i < files.length; i++) {
        await fileRemove(files[i].filename, files[i].isDir);
      }
    }
    return Promise.resolve();
  };

  const onUpload = async (files: Array<UploadFileInfo>): Promise<void> => {
    if (files) {
      for (let i = 0; i < files.length; i++) {
        await getMicroPythonDevice().putFile(files[i].path, files[i].data);
      }
    }
    return Promise.resolve();
  };

  const resetDevice = (): Promise<void> => {
    return getMicroPythonDevice().resetDevice();
  };

  const newProps: FileManagerProps = {
    ...props,
    getFiles,
    // onNewFile,
    onNewDirectory,
    onUpload,
    onDownLoad,
    onRename,
    onRemove,
    // uploadType: ['png'],
    uploadMaxSize: 0.5,
    resetDevice,
    menus: [{ menuName: messages.space }, { menuName: messages.load }],
  };
  return <FileManager {...newProps}></FileManager>;
}
