import { UCodeUploadMode } from '@ubtech/ucode-extension-common-sdk/types';

/**
 * 代码烧录器
 */
export class Uploader implements UCodeUploadMode.UploaderInterface<any> {
  /**
   * 这里是 uCode 里面点击烧录时候的逻辑
   * @param code 代码
   * @returns Promise<void>
   */
  uploadCode(code: string) {
    console.log(code);
    return Promise.resolve();
  }
}
