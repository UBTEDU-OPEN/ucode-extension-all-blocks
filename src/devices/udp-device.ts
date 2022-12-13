/*
 * @Description: 通信、连接类
 * @Create by:  bright.lin@ubtrobot.com
 * @LastEditors: bright.lin
 * @LastEditTime: 2022-08-09 18:16:33
 */
import { CommonProtocols } from '@ubtech/ucode-extension-common-sdk';
import type {
  DeviceRegisterType,
  HardwareDeviceConstructorArgumentType,
  IDiscoverDevice,
} from '@ubtech/ucode-extension-common-sdk/types';
import { UDPMsg } from '@ubtech/ucode-extension-common-sdk/ucodelink-client/src';
import { ITestCastFunction, CacheDataTypes } from './interface';
import messages from './messages';

const { UDPDeviceConnection } = CommonProtocols.UDP;

export class MyUDPDeviceConnection extends UDPDeviceConnection implements ITestCastFunction {
  private gestureTask: any;

  private gestureTimeout: any;

  private cacheData: Map<string, any> = new Map();

  constructor(args: HardwareDeviceConstructorArgumentType) {
    super(args);
    if (this.socketoptions) {
      this.socketoptions.bindPort = undefined; // 不使用register设置的
      this.socketoptions.bindAddress = undefined; // 不使用register设置的
    }
  }

  async connect(device: IDiscoverDevice): Promise<void> {
    await super.connect({
      ...device,
      data: {
        port: 5001,
        address: device.id,
      },
    });
    this.send('connected');
  }

  beforeDisconnect(): Promise<void> {
    this.send('disconnected');
    return Promise.resolve();
  }

  /**
   * 发送并等待, 适合一问一答的协议类型
   * @param {string} data
   * @param {number} timeout
   * @returns {Promise<string>}
   */
  sendAndWait(data: string, timeout = 3000) {
    return new Promise<UDPMsg>((resolve, reject) => {
      const timeoutDispose = setTimeout(() => {
        // 超时处理
        dispose.dispose();
        reject(new Error('timeout'));
      }, timeout);

      const dispose = this.onData((msg: UDPMsg) => {
        clearTimeout(timeoutDispose);
        resolve(msg);
      });
      this.send(data);
    });
  }

  async saySomething(text: string): Promise<void> {
    await this.sendAndWait(text);
  }

  getTemperature() {
    return this.sendAndWait('cmd=getTemp');
  }

  isFaceDown() {
    return this.sendAndWait('cmd=getFaceDown').then((resp) => (resp as string).includes('True'));
  }

  listen(args?: any) {
    this.queryGestureTask();
    return Promise.resolve();
  }

  getCacheData(key: string) {
    return this.cacheData.get(key);
  }

  /**
   * 轮询姿态，屏幕是否朝下。
   */
  queryGestureTask() {
    if (this.isConnected()) {
      if (!this.gestureTask) {
        this.gestureTask = setInterval(() => {
          this.sendAndWait('cmd=getFaceDown').then((resp) => {
            const isFaceDown = (resp as string).includes('True');
            console.log('resp', resp);
            this.cacheData.set(CacheDataTypes.gestureFaceDown, isFaceDown);
          });
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

/**
 * UDP连接，通过输入IP地址连接。如果需要使用 discover 方式搜索设备，请用 “getUDPDeviceRegister” 实现。
 */
export const udpRegister: DeviceRegisterType = {
  DeviceType: {
    id: 'udp',
    name: messages.udpDevice,
    connectType: 'inputDeviceId',
    configInfo: {
      inputPlaceholder: messages.inputIp,
      verifyRegex: /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/, // 校验IP地址，仅支持IPv4，不支持IPv6和域名
    },
    needUcodelink: true,
  },
  type: 'inputDeviceId',
  DeviceConnection: MyUDPDeviceConnection,
};

// export const udpRegister = getUDPDeviceRegister({
//   DeviceConnection: MyUDPDeviceConnection,
//   Options: {
//     udpConstructorOptions: UDPSocketType.udp4,
//     sendMsgForResponse: Buffer.from('A'),
//     bindPort: 65432,
//     scanTime: 20, // 扫描时长
//     customDeviceName: (deviceData) => {
//       try {
//         // 通过设备信息，生成设备名
//         const { buffer, port, address } = deviceData;
//         const device = JSON.parse(Buffer.from(buffer).toString());
//         console.log(`Robot_${device.name} info: ${address}:${port}`);
//         return `Robot_${device.name}`;
//       } catch (error) {
//         console.log(error);
//       }
//       return 'Robot';
//     },
//   },
// });
