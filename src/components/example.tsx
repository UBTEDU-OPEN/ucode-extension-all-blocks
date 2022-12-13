import React from 'react';
import { UCodeExternalHardwareDefinition } from '@ubtech/ucode-extension-common-sdk/types';

const formatMessage = self.UCode.formatMessage;

const messages = {
  msg1: formatMessage({
    id: 'ui.msg1',
    defaultMessage: '我是一个 React Hook 组件 MenuId',
  }),
  deviceType: formatMessage({
    id: 'ui.deviceType',
    defaultMessage: '设备类型',
  }),
};

export const DemoComp: UCodeExternalHardwareDefinition.ReactComponent = (props) => {
  console.log(props.getDevice());
  return (
    <h1>
      {messages.msg1}: {props.menuId}, {messages.deviceType}: {props.getDevice()?.deviceType?.name}
    </h1>
  );
};
