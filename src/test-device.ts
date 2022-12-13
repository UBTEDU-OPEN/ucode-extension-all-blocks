import { ExtensionUI } from '@ubtech/ucode-extension-common-sdk';
import { ITestCastFunction } from './devices/interface';
import messages from './messages';

const { Toast } = ExtensionUI;

export class TestDevice implements ITestCastFunction {
  /**
   * 当前硬件角色id
   */
  targetId: string;

  /**
   * 连接的设备实例
   */
  device?: any;

  /**
   * 当前类单例
   */
  static mInstance: TestDevice;

  private constructor(targetId: string) {
    this.targetId = targetId;
  }

  /**
   * 做成单例模式
   * @param {*} targetId
   * @returns
   */
  public static getInstance(targetId: string) {
    if (!this.mInstance) {
      this.mInstance = new TestDevice(targetId);
    }
    if (targetId !== this.mInstance.targetId) {
      this.mInstance.targetId = targetId;
    }
    return this.mInstance;
  }

  /**
   * 获取设备通信对象
   * @param {*} needToast
   * @returns
   */
  public getDevice(needToast = true) {
    // eslint-disable-next-line no-undef
    const device = self.UCode.extensions.getDevice(this.targetId);
    if (!device?.isConnected() && needToast) {
      Toast(messages.noConnection);
      return undefined;
    }
    if (!this.device) {
      this.device = device;
      this.device.onData(this.onReceiveMsg.bind(this));
    }
    return device;
  }

  /**
   * 连接成功后，可以获取到device
   * @param {*} needToast
   * @returns
   */
  public isConnected(needToast = true) {
    return this.getDevice(needToast)?.isConnected();
  }

  saySomething(args?: any): Promise<void> {
    console.log('saySomething');
    const device = this.getDevice(true) as unknown as ITestCastFunction;
    return device?.saySomething(args);
  }

  getTemperature(args?: any): Promise<any> {
    console.log('getTemperature');
    const device = this.getDevice(true) as unknown as ITestCastFunction;
    return device?.getTemperature();
  }

  isFaceDown() {
    const device = this.getDevice(true) as unknown as ITestCastFunction;
    return device?.isFaceDown();
  }

  listen(key: string): Promise<void> {
    const device = this.getDevice(false) as unknown as ITestCastFunction;
    device.listen();
    return device.getCacheData(key);
  }

  /**
   * 监听数据，可接收一问一答数据，也可接收自动上报的数据
   * @param {*} data
   */
  public onReceiveMsg(data: Buffer | string) {
    console.log('received:', Buffer.from(data).toString());
  }

  getCacheData(key: string) {
    const device = this.getDevice(true) as unknown as ITestCastFunction;
    return device.getCacheData(key);
  }
}
