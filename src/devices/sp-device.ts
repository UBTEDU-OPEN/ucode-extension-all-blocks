import { CommonProtocols, ExtensionUI, CommonUtility } from '@ubtech/ucode-extension-common-sdk';
import type { CommonUtility as CommonUtilityTypes } from '@ubtech/ucode-extension-common-sdk';
import type { HardwareDeviceConstructorArgumentType } from '@ubtech/ucode-extension-common-sdk/types';

import { ITestCastFunction, CacheDataTypes } from './interface';

const { SerialPortProtocol, getSerialPortDeviceRegister } = CommonProtocols.SerialPort;
const { Toast } = ExtensionUI;
const { MicroPythonReplDevice, DeviceType } = CommonUtility.MicroPythonReplUtil;

function getTempScript() {
  return `from future import *;
temp = sensor.getTemp();
print(temp)`;
}

function getGestureScript(name = 'face_down') {
  return `from future import *;
gesture = sensor.gesture(${name});
print(gesture)`;
}

function showScreenScript(displayText: string) {
  return `from future import *;
screen.clear();
screen.text(${displayText}, 5, 10, 1, (255, 200, 180));`;
}

export class DemoSerialPortDevice extends SerialPortProtocol implements ITestCastFunction {
  private gestureTask: any;

  private gestureTimeout: any;

  private cacheData: Map<string, any> = new Map();

  public replDevice: CommonUtilityTypes.MicroPythonReplUtil.MicroPythonReplDevice;

  /**
   * 串口 构造函数
   * @param args uCode 初始化的时候会注入的函数或者变量
   */
  constructor(args: HardwareDeviceConstructorArgumentType) {
    super(args);
    this.onData((data: string | Buffer) => {
      // console.log('onData:', Buffer.from(data).toString());
    });
    this.replDevice = new MicroPythonReplDevice({
      type: DeviceType.serialport,
      send: this.send.bind(this),
      onData: this.onData.bind(this),
    });
    (globalThis as any).serailSend = this.send.bind(this);
  }

  afterConnect(): Promise<void> {
    this.replDevice.onConnected();
    return super.afterConnect();
  }

  afterDisconnect(): Promise<void> {
    this.replDevice.onDisconnected();
    return super.afterDisconnect();
  }

  getCacheData(key: string) {
    return this.cacheData.get(key);
  }

  async saySomething(text: string): Promise<void> {
    const displayText = /^"(.*)"$/.test(text) ? text : `"${text}"`; // 加上引号
    console.log('saySomething:', showScreenScript(displayText));
    try {
      await this.replDevice.runScript(showScreenScript(displayText));
    } catch (e) {
      console.error(e);
    }
  }

  async getTemperature(): Promise<any> {
    console.log('getTemperature:');
    try {
      return await this.replDevice.runScript(getTempScript());
    } catch (e) {
      console.error(e);
    }
  }

  async isFaceDown() {
    try {
      const resp = await this.replDevice.runScript(getGestureScript('face_down'));
      return resp.includes('True');
    } catch (e) {
      console.error(e);
    }
  }

  listen(args: any): Promise<void> {
    this.queryGestureTask();
    return Promise.resolve();
  }

  /**
   * 轮询姿态，屏幕是否朝下。
   */
  queryGestureTask() {
    if (this.isConnected()) {
      if (!this.gestureTask) {
        this.gestureTask = setInterval(async () => {
          // repl空闲时查询，有程序运行时不打断。
          const resp = await this.replDevice.runScript(getGestureScript('face_down'));
          const isFaceDown = resp.includes('True');
          console.log('resp', resp);
          this.cacheData.set(CacheDataTypes.gestureFaceDown, isFaceDown);
        }, 1000);
      }
      if (this.gestureTimeout) {
        clearTimeout(this.gestureTimeout);
        this.gestureTimeout = undefined;
      }
      this.gestureTimeout = setTimeout(() => {
        clearInterval(this.gestureTask);
        clearTimeout(this.gestureTimeout);
        this.gestureTask = undefined;
        this.gestureTimeout = undefined;
      }, 2000);
    }
  }
}

export const spRegister = getSerialPortDeviceRegister({
  DeviceConnection: DemoSerialPortDevice,
  // 以下配置均为可选配置
  Options: {
    openOptions: {
      baudRate: 1000000, // 串口打开的波特率, 必填
      // bufferSize: 12 * 1024 * 1024, // 缓冲区大小 可选
    },
    queueOptions: {
      enable: true, // 数据发送是否启用队列, 可选
      interval: 70, // 启用队列时数据发送的间隔
    },
    /**
     * 发现设备时过滤用的vid和pid,配置后将只显示和配置id一致的串口设备, 可选
     */
    filter: {
      vid: '28e9',
      pid: '018a',
    },
    // 自定义显示串口设备名, 可以根据串口搜索出来的设备, 进行名字加工, 可选
    customDeviceName: (data) => `AF_${data?.comName.replace(/\/dev\//, '')}`,
  },
});
