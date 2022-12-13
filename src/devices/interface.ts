export interface ITestCastFunction {
  /**
   * 向设备发送
   */
  saySomething: (args?: any) => Promise<void>;
  /**
   * 向设备发送，并接收响应
   */
  getTemperature: (args?: any) => Promise<any>;
  /**
   * 监听事件
   */
  listen: (args?: any) => Promise<void>;
  /**
   * 获取缓存变量
   */
  getCacheData: (key: string) => any;
  /**
   * 是否姿态朝下
   */
  isFaceDown: () => Promise<any>;
}

export enum CacheDataTypes {
  gestureFaceDown = 'gestureFaceDown',
}
