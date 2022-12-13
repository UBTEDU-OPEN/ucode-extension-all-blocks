/**
 * 示例 硬件连接
 */

import type {
  DeviceRegisterType,
  DeviceConnectionInterface,
  HardwareDeviceConstructorArgumentType,
  DeviceEventbusInterface,
  UCode,
  InputIdDeviceType,
  IDiscoverDevice,
} from '@ubtech/ucode-extension-common-sdk/types';
import { ExtensionUI, CommonUtility } from '@ubtech/ucode-extension-common-sdk';

// import { WebsocketRPCAdapter } from '@ubtech/ucode-extension-common-sdk/ucodelink-client/src/rpc/websocket';
import { ITestCastFunction, CacheDataTypes } from './interface';

const { Toast } = ExtensionUI;

const { replModel } = CommonUtility.Repl;

const TARGET_PORT = 8800;

export class WebsocketDevice implements DeviceConnectionInterface, ITestCastFunction {
  private gestureTask: any;

  private gestureTimeout: any;

  private cacheData: Map<string, any> = new Map();

  private ws?: WebSocket;

  public eventbus: DeviceEventbusInterface;

  public connectStatus: UCode.DeviceConnectStatusUnionType = self.UCode.Constant.ConnectStatus.Disconnected;

  private messageListeners: Map<string, (msg: string) => void>;

  private data: string;

  constructor(injectArgs: HardwareDeviceConstructorArgumentType) {
    this.eventbus = injectArgs.eventbus;
    this.ws = undefined;
    this.messageListeners = new Map();
    this.data = '';
    this.connectStatus = self.UCode.Constant.ConnectStatus.Disconnected;
    this.eventbus = injectArgs.eventbus;
  }

  setReady() {
    return this.sendAndWait(Buffer.from([replModel.CANCEL]).toString())
      .then(() => this.sendAndWait(Buffer.from([replModel.CANCEL]).toString()))
      .then(() => this.sendAndWait(Buffer.from([replModel.ENTER]).toString()));
  }

  afterConnect() {
    this.sendMsg(Buffer.from([0x03]).toString()); // ctrl+C
    this.sendMsg(Buffer.from([0x03]).toString());
    this.sendMsg(Buffer.from([0x02]).toString()); // ctrl+B
    return Promise.resolve();
  }

  /**
   * 发送消息
   * @param {string | Object} data
   */
  sendMsg(data: string) {
    return new Promise((resolve) => {
      const id = `${Date.now()}`;
      this.addMessageListener(id, (message) => {
        this.removeMessageListenerById(id);
        resolve(message);
      });
      this.data = data + '\r\n'; // 未来板的数据需要用 \r\n 结尾
      console.log(`send to esp32: ${this.data}`);
      const sendMsg =
        JSON.stringify({
          method: 'write',
          params: {
            data: window.btoa(
              encodeURIComponent(this.data).replace(/%([0-9A-F]{2})/g, function (e, A) {
                return String.fromCharCode(parseInt('0x'.concat(A)));
              })
            ),
          },
          jsonrpc: '2.0',
        }) + '\n';
      console.log(`last send data to esp32 jsonrpc: ${sendMsg}`);
      this.ws?.send(sendMsg);
    });
  }

  resolveData(data: string) {
    const res = JSON.parse(data).params.data.replace('\n', '');
    let msg = window.atob(res);
    console.log('receiveMsg--Base64 decode:', msg);
    const tempA = msg.split('\r\n');
    if (tempA.length == 3) {
      msg = tempA[1];
    }
    return msg;
  }

  /**
   * 当接收到消息后, 会调用该方法
   * @param {string} data
   */
  receiveMsg(data: string) {
    console.log('receiveMsg:', data);
    const msg = this.resolveData(data);
    console.log('receiveMsg resolved:', msg);
    this.notifyMessage(msg);
    const errors = msg.match(/.*Error:.*/g); // 简单设置了一个判断报错的关键字段。
    if (errors) {
      Toast(errors[0], { duration: 4000 });
    }
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
      const disposeObj = this.onData((evt) => {
        // 监听消息会返回一个 dispose
        const msg = this.resolveData(evt);
        console.log('receive msg', msg);
        clearTimeout(timeoutDispose); // 清空 timeout
        disposeObj.dispose?.(); // 收到想要的消息, 清理掉事件
        resolve(msg); // 返回消息
      });
      this.sendMsg(data);
    });
  }

  addMessageListener(id: string, listener: (message: string) => void) {
    if (!this.messageListeners.has(id)) {
      this.messageListeners.set(id, listener);
    }
  }

  removeMessageListenerById(id: string) {
    if (this.messageListeners.has(id)) {
      this.messageListeners.delete(id);
    }
  }

  notifyMessage(message: string) {
    this.messageListeners.forEach((listener) => {
      listener.call(listener, message);
    });
  }

  onData(listener: (data: any) => void) {
    const eventListener = (event: { data: any }) => {
      listener?.(event.data);
    };
    this.ws?.addEventListener('message', eventListener);
    return {
      dispose: () => this.ws?.removeEventListener('message', eventListener),
    };
  }

  isConnected() {
    return this.connectStatus === self.UCode.Constant.ConnectStatus.Connected;
  }

  /**
   * 连接设备
   * @returns {Promise<void>}
   */
  connect(device: IDiscoverDevice): Promise<void> {
    console.log('worker demo connect device ');
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(`ws://${device.id}:${TARGET_PORT}`);
      this.ws.onopen = () => resolve();
      this.ws.onclose = () => {
        console.log('ws close');
        this.eventbus.dispatchDisconnect();
        this.connectStatus = self.UCode.Constant.ConnectStatus.Disconnected;
      };
      this.ws.onerror = (error) => {
        this.eventbus.dispatchDisconnect();
        reject();
      };
      this.ws.onmessage = (ev) => {
        console.log('ws onMessage', ev);
        this.receiveMsg(ev.data);
      };
    });
  }

  disconnect() {
    this.ws?.close();
    this.eventbus.dispatchDisconnect();
    return Promise.resolve();
  }

  /**
   * 设备销毁
   */
  destroy() {
    this.disconnect();
    return Promise.resolve();
  }

  async saySomething(text: string): Promise<void> {
    const displayText = /^"(.*)"$/.test(text) ? text : `"${text}"`; // 加上引号
    const message = `from future import *;screen.text(${displayText}, 5, 10, 1, (255, 200, 180));`;
    await this.setReady().then(() => this.sendAndWait(message));
  }

  getTemperature() {
    const message = `from future import *;sensor.getTemp();`;
    return this.sendAndWait(message);
  }

  isFaceDown() {
    // TODO：待完善
    return Promise.resolve('false');
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
          const message = `from future import *;sensor.gesture('face_down');`;
          this.sendAndWait(message).then((resp) => {
            const isFaceDown = resp === 'True';
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

const WSType: InputIdDeviceType = {
  id: 'websocket',
  name: 'Websocket',
  connectType: 'inputDeviceId',
  configInfo: {
    inputTitle: '输入IP后连接设备', // 输入框标题
    inputPlaceholder: '输入IP地址', // 输入框默认文字
    description: `需要先让futrureboard连上网络`, // 该类型连接相关的描述信息，位于输入框下方，可不填
    verifyRegex: /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/, // 校验IP地址，仅支持IPv4，不支持IPv6和域名
  },
};

export const WebsocketRegister: DeviceRegisterType = {
  type: 'inputDeviceId',
  DeviceType: WSType,
  DeviceConnection: WebsocketDevice,
  Options: {},
};

// export const WebsocketRegister: DeviceRegisterType = {
//   DeviceType: {
//     id: 'websocket',
//     name: 'websocket连接',
//     connectType: 'inputDeviceId',
//     configInfo: {
//       inputPlaceholder: '请输入IP地址',
//       verifyRegex: /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/, // 校验IP地址，仅支持IPv4，不支持IPv6和域名
//     },
//   },
//   type: 'inputDeviceId',
//   DeviceConnection: WebsocketDevice,
// };
