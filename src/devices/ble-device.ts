import { CommonProtocols } from '@ubtech/ucode-extension-common-sdk';
import type { HardwareDeviceConstructorArgumentType } from '@ubtech/ucode-extension-common-sdk/types';

const { UCodeBleProtocol, getUCodeBleDeviceRegister } = CommonProtocols.BLE;

class DemoWebbleDevice extends UCodeBleProtocol {
  /**
   * 串口 构造函数
   * @param args uCode 初始化的时候会注入的函数或者变量, 不要修改, 或者抹掉
   */
  constructor(args: HardwareDeviceConstructorArgumentType) {
    super(args);
    this.onData(this.receiveMsg.bind(this)); // 绑定接收消息的事件
  }

  sendMsg(data: string) {
    this.send(Buffer.from(data));
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
        dispose.dispose();
        reject(new Error('timeout'));
      }, timeout);
      const dispose = this.onData((commonData) => {
        // 监听消息会返回一个 dispose
        const msg = Buffer.from(commonData.data).toString();
        console.log(msg, msg.length);
        if (msg.endsWith('\r\n')) {
          // 这里的案例是使用 回车做分隔符
          clearTimeout(timeoutDispose); // 清空 timeout
          dispose.dispose(); // 收到想要的消息, 清理掉事件
          resolve(msg.replace('\r\n', '')); // 返回消息
        }
      });
      this.send(Buffer.from(data));
    });
  }

  /**
   * 蓝牙接收的数据体
   * @typedef {Object} CommonBleDataType
   * @property {string} uuid - 蓝牙 read 特征值的 uuid
   * @property {Buffer} data - 数据
   */

  /**
   * 当接收到消息后, 会调用该方法
   * @param {CommonBleDataType} data
   */
  receiveMsg(data: CommonProtocols.BLE.CommonBleDataType) {
    console.log(data.uuid, data.data);
  }
}

export const bleRegister = getUCodeBleDeviceRegister({
  DeviceConnection: DemoWebbleDevice,
  Options: {
    services: {
      serviceUUID: '55425401-ff00-1000-8000-00805f9b34fb', // ble 的服务 id
      characteristics: [
        {
          name: 'read',
          uuid: '55425403-ff00-1000-8000-00805f9b34fb', // notify 的特征id
          readable: true,
        },
        {
          name: 'write',
          uuid: '55425402-ff00-1000-8000-00805f9b34fb', // 写数据的特征id
        },
      ],
    },
    defaultWriteCharacteristicUUID: '55425402-ff00-1000-8000-00805f9b34fb', // 默认写的特征id
    filters: [{ namePrefix: 'uKit' }], // 过滤字符，配置后发现设备时将只显示该字符开头的蓝牙设备
    queueOptions: {
      enable: true, // 数据发送是否启用队列, 可选
      interval: 150, // 启用队列时数据发送的间隔
    },
  },
});
