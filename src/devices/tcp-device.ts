/*
 * @Description:
 * @Create by:  bright.lin@ubtrobot.com
 * @LastEditors: bright.lin
 * @LastEditTime: 2022-08-09 18:15:44
 */
import { CommonProtocols } from '@ubtech/ucode-extension-common-sdk';
import type {
  DeviceRegisterType,
  HardwareDeviceConstructorArgumentType,
  IDiscoverDevice,
} from '@ubtech/ucode-extension-common-sdk/types';
import { ITestCastFunction, CacheDataTypes } from './interface';
import messages from './messages';

const { TCPClientConnection } = CommonProtocols.TCP;

/**
 * 连接通信类子类，根据业务需求覆写父类方法或实现抽象方法
 */
export class MyTCPClientConnection extends TCPClientConnection implements ITestCastFunction {
  private gestureTask: any;

  private gestureTimeout: any;

  private cacheData: Map<string, any> = new Map();

  constructor(args: HardwareDeviceConstructorArgumentType) {
    super(args);
  }

  /**
   * 发送消息
   * @param {string} data
   */
  sendMsg(data: string) {
    /**
     * this.write TCP发送消息的接口
     */
    this.write(data);
  }

  /**
   * 实现抽象类获取设备信息的方法
   * @param { {buffer: Buffer, port: number, address: string} } device discover传过来的设备对象
   * @return Promise<SocketConnectOpts = {
   * port: number;
   * host?: string;
   * localAddress?: string;
   * localPort?: number;
   * hints?: number;
   * family?: number;
   * lookup?: LookupFunction;
   * onread?: OnReadOpts;
   * path?: string;
   * } TCP连接时用的设备信息
   */
  getDeviceInfo(device: IDiscoverDevice) {
    return {
      port: 5001,
      host: device.id,
    };
  }

  /**
   * 发送并等待, 适合一问一答的协议类型
   * @param {string} data
   * @param {number} timeout
   * @returns {Promise<string>}
   */
  sendAndWait(data: string, timeout = 3000) {
    return new Promise((resolve, reject) => {
      const timeoutDispose = setTimeout(() => {
        // 超时处理
        disposeObj.dispose?.();
        reject(new Error('timeout'));
      }, timeout);
      const disposeObj = this.onData((msg: Uint8Array | string) => {
        // 监听消息会返回一个 dispose
        console.log('receive msg', msg, typeof msg);
        clearTimeout(timeoutDispose); // 清空 timeout
        disposeObj.dispose?.(); // 收到想要的消息, 清理掉事件
        resolve(Buffer.from(msg).toString()); // 返回消息
      });
      this.sendMsg(data);
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
 * TCP连接，通过IP地址连接TCP服务。如需通过UDP搜索+TCP连接，请用 “getTCPDeviceRegister”
 */
export const tcpRegister: DeviceRegisterType = {
  DeviceType: {
    id: 'tcp',
    name: messages.tcpDevice,
    connectType: 'inputDeviceId',
    configInfo: {
      inputPlaceholder: messages.inputIp,
      verifyRegex: /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/, // 校验IP地址，仅支持IPv4，不支持IPv6和域名
    },
    needUcodelink: true,
  },
  type: 'inputDeviceId',
  DeviceConnection: MyTCPClientConnection,
};
// export const tcpRegister = getTCPDeviceRegister({
//   Discover: UDPDiscover, // 设置搜索器
//   DeviceConnection: MyTCPClientConnection, // 设置通信器
//   Options: {
//     // 设置搜索器、连接器用到的配置参数
//     discoverDeviceType: getUDPDeviceType({ scanTime: scanTimeTimeout }), // 搜索器类型（搜索、输入ID/IP、自行处理）
//     discoverOptions: {
//       // 搜索器配置
//       // udpConstructorOptions: UDPConstructorOptions | UDPSocketType; // https://nodejs.org/dist/latest-v16.x/docs/api/dgram.html#dgramcreatesocketoptions-callback
//       // sendMsgForDiscover?: UDPMsg; // 发消息来触发设备回应？
//       // sendMsgForResponse?: UDPMsg; // 收到消息后，发送一条固定的消息回应？
//       // bindPort?: number; // 绑定端口
//       // bindAddress?: string; // 绑定地址
//       // sendPort?: number; // 往端口发数据
//       // sendAddress?: string; // 往地址发数据
//       // isBroadcast?: boolean; // 开启广播？
//       // multicastLoopback?: boolean; // 广播自己也能收到？
//       // multicastInterface?: string;
//       // customDeviceName?: (deviceData: DiscoverDeviceData) => string; // 自定义设备名，可以从socket数据中加工出新名字
//       // ttl?: number;
//       // multicastTTL?: number;
//       // recvBufferSize?: number;
//       // sendBufferSize?: number;
//       // multicastAddress?: string;
//       // scanTime?: number; // 扫描超时
//       // queueOptions?: QueueConstructorType; // 队列参数，可以设置 队列 发送的 间隔 或者 数量
//       udpConstructorOptions: UDPSocketType.udp4,
//       sendMsgForResponse: Buffer.from('A'),
//       bindPort: 65432,
//       scanTime: scanTimeTimeout, // 扫描时长
//       customDeviceName: (deviceData: DeviceInfoType) => {
//         try {
//           const { buffer, port, address } = deviceData;
//           const device = JSON.parse(Buffer.from(buffer).toString());
//           console.log(`Robot_${device.name} info: ${address}:${port}`);
//           return `Robot_${device.name}`;
//         } catch (error) {
//           console.log(error);
//         }
//         return 'Robot';
//       },
//     },
//     connectionOptions: {
//       // 通信器配置
//       // tcpConstructorOptions?: SocketConstructorOpts; // 创建TCP socket时，传给构造函数的参数
//       // queueOptions?: QueueConstructorType; // 队列参数，可以设置 队列 发送的 间隔 或者 数量
//       // encoding?: BufferEncoding; // 设置数据编码，也可以在write中设置
//       // keepAlive?: { // 是否开启KeepAlive功能
//       //   enable: true;
//       //   initialDelay?: number;
//       // };
//       // noDelay?: boolean; // 是否开启拥塞控制算法
//       // timeout?: number; // 设置inactive超时时长
//       queueOptions: {
//         enable: true,
//         interval: 70, // 毫秒
//       },
//       keepAlive: {
//         enable: true,
//       },
//       timeout: 30000, // 毫秒
//     },
//   },
// });
