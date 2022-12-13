import { ExtensionUI } from '@ubtech/ucode-extension-common-sdk';
import type { UCodeExternalHardwareDefinition } from '@ubtech/ucode-extension-common-sdk/types';
import { blockTypeTestBlocks } from './blocks/block-type';
import { fieldTypeTestBlocks } from './blocks/field-type';
import { runningModeTestBlocks } from './blocks/running-mode';
import { CacheDataTypes } from './devices/interface';
import { TestDevice } from './test-device';

const formatMessage = self.UCode.formatMessage;
const messages = {
  args: formatMessage({
    id: 'toast.args',
    defaultMessage: '参数',
  }),
};

const { Toast } = ExtensionUI;

export class ExampleDeviceExtension {
  getInfo(): UCodeExternalHardwareDefinition.GetInfo | UCodeExternalHardwareDefinition.GetInfo[] {
    return [blockTypeTestBlocks, fieldTypeTestBlocks, runningModeTestBlocks];
  }

  blockHatFunc() {
    return false;
  }

  blockCommandFunc() {
    /* 无需实现 */
  }

  blockNumberFunc() {
    return 1234;
  }

  blockReporterFunc() {
    return 1234;
  }

  blockBooleanFunc() {
    return true;
  }

  fieldNumPadFunc(args: { INPUT: string; INPUT2: string }) {
    Toast(`${messages.args}1：${args.INPUT}, ${messages.args}2: ${args.INPUT2}`);
  }

  fieldNumPadRegexpFunc(args: { INPUT: string }) {
    Toast(`${messages.args}：${args.INPUT}`);
  }

  fieldNumInputFunc(args: { INPUT: string; INPUT2: string }) {
    Toast(`${messages.args}1：${args.INPUT}, ${messages.args}2: ${args.INPUT2}`);
  }

  fieldNumInputRegexpFunc(args: { INPUT: string }) {
    Toast(`${messages.args}：${args.INPUT}`);
  }

  fieldStringRegexpFunc(args: { INPUT: string }) {
    Toast(`${messages.args}：${args.INPUT}`);
  }

  fieldBooleanFunc(args: { INPUT: string }) {
    Toast(`${messages.args}：${args.INPUT}`);
  }

  fieldDropdownMenuFunc(args: { MENU: string }) {
    Toast(`${messages.args}：${args.MENU}`);
  }

  fieldDialogMenuFunc(args: { MENU: string }) {
    Toast(`${messages.args}：${args.MENU}`);
  }

  fieldHSLFunc(args: { COLOR: string }) {
    Toast(`${messages.args}：${args.COLOR}`);
  }

  fieldRGBFunc(args: { COLOR: string }) {
    Toast(`${messages.args}：${args.COLOR}`);
  }

  fieldNoteFunc(args: { NOTE: string }) {
    Toast(`${messages.args}：${args.NOTE}`);
  }

  fieldAngleFunc(args: { ANGLE: string }) {
    Toast(`${messages.args}：${args.ANGLE}`);
  }

  fieldMatrixFunc(args: { MATRIX: string; MATRIX2: string }) {
    Toast(`${messages.args}1：${args.MATRIX}, ${messages.args}2：${args.MATRIX2}`);
  }

  /**
   * 运行 阻塞块
   * @param args
   * @param util
   * @returns
   */
  runningSyncFunc(args: { INPUT: string }, util: { targetId: string }) {
    const device = TestDevice.getInstance(util.targetId);
    device.saySomething(args.INPUT);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 3000);
    });
  }

  /**
   * 运行 非阻塞块
   * @param args
   * @param util
   */
  runningAsyncFunc(args: { INPUT: string }, util: { targetId: string }) {
    const device = TestDevice.getInstance(util.targetId);
    device.saySomething(args.INPUT);
  }

  /**
   * 监听事件，姿态朝下？
   * 监听类的积木块不能出现 promise、async-await 等异步处理标志。
   */
  runningEventFunc(args: any, util: { targetId: string }) {
    const device = TestDevice.getInstance(util.targetId);
    return device.listen(CacheDataTypes.gestureFaceDown); // 开启轮询，如果已经轮询中，会跳过。
  }

  /**
   * 帽子块异步执行函数，1秒检测周期
   * @param args
   * @param util
   * @returns
   */
  runningEventAsyncFunc(args: any, util: { targetId: string }) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const device = TestDevice.getInstance(util.targetId);
        if (device.isConnected(false)) {
          const isFaceDown = await device.isFaceDown();
          console.log('runningEventAsyncFunc', isFaceDown);
          resolve(isFaceDown);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  }

  /**
   * 获取数据
   * @param util
   * @returns
   */
  runningGetFunc(args: any, util: { targetId: string }) {
    const device = TestDevice.getInstance(util.targetId);
    return device.getTemperature();
  }

  runningOnlineOnlyFunc() {}

  runningUploadOnlyFunc() {}
}
