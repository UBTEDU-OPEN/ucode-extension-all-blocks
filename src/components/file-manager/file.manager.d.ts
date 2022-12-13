import { DeviceConnectionInterface } from '@ubtech/ucode-extension-common-sdk/types';

export type FileInfo = {
  filename: string;
  isDir: boolean;
  size: number;
  mTime?: number;
  sha256?: string;
};

export type FileMangerModalProps = {
  menuName: string;
  menuId: string;
  targetId: string;
  getDevice: <T extends DeviceConnectionInterface>() => T | undefined;
};

export type UploadFileInfo = {
  path: string;
  data: Buffer;
};

export type FileOperateListener = (filePath: string) => Promise<boolean>;

export type FilesOperateListener = (files: Array<FileInfo>) => Promise<void>;

export type FileManagerProps = FileMangerModalProps & {
  initPath?: string;
  getFiles: (filePath?: string) => Promise<Array<FileInfo>>;
  uploadType?: Array<string>; // eg: ['png','jpg']
  uploadMaxSize?: number; // 单位M
  multiple?: boolean;
  onUpload?: (files: Array<UploadFileInfo>) => Promise<void>;
  onNewFile?: FileOperateListener;
  onNewDirectory?: FileOperateListener;
  onDownLoad?: FilesOperateListener;
  onRename?: (oldFilePath: string, newFilePath: string) => Promise<boolean | void>;
  onRemove?: FilesOperateListener;
  resetDevice?: () => Promise<void>;
  menus?: Array<{ menuName: string; callback?: () => void }>;
};
