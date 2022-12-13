import { UCodeLinkAPI, ExtensionUI } from '@ubtech/ucode-extension-common-sdk';
import type { UCodeCustomUI } from '@ubtech/ucode-extension-common-sdk/types/hardware/custom-ui';
import { ExampleDeviceExtension } from './block';
// import { bleRegister } from './devices/ble-device';
import { spRegister, DemoSerialPortDevice } from './devices/sp-device';
import { udpRegister } from './devices/udp-device';
import { tcpRegister } from './devices/tcp-device';
import { WebsocketRegister } from './devices/websocket-device';
import { UploadModeRegister } from './upload-mode';
import { DemoComp } from './components/example';
import { FileManagerModal } from './components/file-manager';
import firmwareInfoIcon from './images/ic-firmware-info.svg';
import updateFirmwareIcon from './images/ic-update-firmware.svg';
import messages from './messages';

const { injectRpcClient } = UCodeLinkAPI;
const { Toast, showInputDialog } = ExtensionUI;

console.log('初始化硬件插件', 'all-blocks');

injectRpcClient();

/**
 * 创建repl设备工具
 */
function getMicroPythonDevice(targetId: string) {
  const device = self.UCode.extensions.getDevice(targetId) as DemoSerialPortDevice;
  if (device.deviceType.id === spRegister.DeviceType.id) {
    return device.replDevice;
  }
  return undefined;
}

/**
 * 从buffer创建下载链接
 */
function downloadFile(fileName: string, content: Buffer) {
  const downloadLink = document.createElement('a');
  document.body.appendChild(downloadLink);
  const ab = new ArrayBuffer(content.length);
  const view = new Uint8Array(ab);
  for (let i = 0; i < content.length; ++i) {
    view[i] = content[i];
  }
  const blob = new Blob([ab]);
  const url = window.URL.createObjectURL(blob);
  downloadLink.href = url;
  downloadLink.download = fileName;
  downloadLink.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(downloadLink);
}

function uploadFile() {
  return new Promise<{ content: Buffer; fileName: string }>((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*';

    input.onchange = (e: any) => {
      // getting a hold of the file reference
      if (e.target) {
        const file = e.target.files[0];

        // setting up the reader
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        const fileName = file.name;

        // here we tell the reader what to do when it's done reading...
        reader.onload = (readerEvent: any) => {
          const content = readerEvent.target.result; // this is the content!
          resolve({ content, fileName });
        };
      }
    };
    input.click();
  });
}

/**
 * 调用 Worker 全局变量 self.UCode 注册
 */
self.UCode.extensions.register({
  DeviceRegister: [spRegister, /* bleRegister, */ WebsocketRegister, udpRegister, tcpRegister],
  BlockRegister: ExampleDeviceExtension,
  UploadModeRegister,
  SettingMenuRegister: {
    myMenu: {
      name: messages.customDialog,
      icon: '',
      type: 'component',
      component: DemoComp,
      additionalData: {
        title: messages.customDialogTitle,
        size: 'l' as UCodeCustomUI.ModalSize.L,
      },
    },
    firmwareVersion: {
      type: 'callback',
      name: messages.firmwareVersion,
      icon: firmwareInfoIcon,
      availableWorkingModes: ['online'],
      callback: (util: { targetId: string }) => {
        Toast(messages.firmwareVersionToast);
      },
    },
    fileManager: {
      name: messages.fileManager,
      icon: updateFirmwareIcon,
      type: 'component',
      component: FileManagerModal,
      availableDeviceTypes: [spRegister.DeviceType], // 目前仅串口
      additionalData: {
        size: {
          type: 'height',
          width: 'xl' as UCodeCustomUI.ModalSize.XL,
          height: '36.875rem',
        },
      },
    },
    UPDATE_FIRMWARE: {
      type: 'callback',
      name: messages.uploadFirmware,
      icon: updateFirmwareIcon,
      availableWorkingModes: ['upload'],
      availableDeviceTypes: [spRegister.DeviceType],
      callback: (util: { targetId: string }) => {
        Toast(messages.uploadFirmwareToast);
      },
    },
    LIST_FILE: {
      type: 'callback',
      name: messages.scanFile,
      icon: updateFirmwareIcon,
      availableDeviceTypes: [spRegister.DeviceType],
      callback: async (util: { targetId: string }) => {
        const mpyDevice = getMicroPythonDevice(util.targetId);
        showInputDialog({
          title: messages.scanPath,
          placeholder: messages.inputPath,
          autofocus: true,
        }).then(async (result) => {
          if (result.onConfirm && result.data) {
            try {
              const files = await mpyDevice?.listFiles(result.data);
              console.log('mpyDevice.listFiles:\n', files);
              Toast(messages.scanCounts.replace('[COUNT]', `${files?.length || 0}`));
            } catch (e) {
              Toast(`${messages.scanError}${e}`);
            }
          }
        });
      },
    },
    mkdir: {
      type: 'callback',
      name: messages.createFolder,
      icon: updateFirmwareIcon,
      availableDeviceTypes: [spRegister.DeviceType],
      callback: async (util: { targetId: string }) => {
        const mpyDevice = getMicroPythonDevice(util.targetId);

        showInputDialog({
          title: messages.createFolder,
          placeholder: messages.folderName,
          autofocus: true,
        }).then(async (result) => {
          if (result.onConfirm && result.data) {
            try {
              const success = await mpyDevice?.mkdir(result.data);
              console.log('mpyDevice.mkdir:', success);
              Toast(`${messages.folderSuccess}，success：${success}`);
            } catch (e) {
              Toast(`${messages.folderFail}：${e}`);
            }
          }
        });
      },
    },
    getBoard: {
      type: 'callback',
      name: messages.deviceInfo,
      icon: updateFirmwareIcon,
      availableDeviceTypes: [spRegister.DeviceType],
      callback: async (util: { targetId: string }) => {
        const mpyDevice = getMicroPythonDevice(util.targetId);

        try {
          const board = await mpyDevice?.getBoardInfo();
          console.log('mpyDevice.getBoardInfo:\n', board);
          Toast(messages.infoSuccess);
        } catch (error) {
          Toast(`${messages.infoFail}${error}`);
        }
      },
    },
    getFileHash: {
      type: 'callback',
      name: messages.fileHash,
      icon: updateFirmwareIcon,
      availableDeviceTypes: [spRegister.DeviceType],
      callback: async (util: { targetId: string }) => {
        const mpyDevice = getMicroPythonDevice(util.targetId);

        showInputDialog({
          title: messages.fileHash,
          placeholder: messages.inputFileName,
          autofocus: true,
        }).then(async (result) => {
          if (result.onConfirm && result.data) {
            try {
              const hash = await mpyDevice?.getFileHash(result.data);
              console.log('mpyDevice.getFileHash:', hash);
              Toast(`hash: ${hash}`);
            } catch (error) {
              Toast(`getFileHash Error：${error}`);
            }
          }
        });
      },
    },
    getFile: {
      type: 'callback',
      name: messages.fileContent,
      icon: updateFirmwareIcon,
      availableDeviceTypes: [spRegister.DeviceType],
      callback: async (util: { targetId: string }) => {
        const mpyDevice = getMicroPythonDevice(util.targetId);

        showInputDialog({
          title: messages.fileContent,
          placeholder: messages.inputFileName,
          autofocus: true,
        }).then(async (result) => {
          if (result.onConfirm && result.data) {
            const content = await mpyDevice?.getFile(result.data);
            try {
              console.log('mpyDevice.getFile:\n', content?.toString());
              Toast(messages.getFileDone);
            } catch (error) {
              Toast(`${messages.fileContent}: ${error}`);
            }
          }
        });
      },
    },
    statFile: {
      type: 'callback',
      name: messages.fileInfo,
      icon: updateFirmwareIcon,
      availableDeviceTypes: [spRegister.DeviceType],
      callback: async (util: { targetId: string }) => {
        const mpyDevice = getMicroPythonDevice(util.targetId);

        showInputDialog({
          title: messages.fileInfo,
          placeholder: messages.inputFileName,
          autofocus: true,
        }).then(async (result) => {
          if (result.onConfirm && result.data) {
            const info = await mpyDevice?.stat(result.data);
            try {
              console.log('mpyDevice.stat:\n', info);
              Toast(`${messages.getDone}: ${JSON.stringify(info)}`);
            } catch (error) {
              Toast(`${messages.fileInfo}: ${error}`);
            }
          }
        });
      },
    },
    remove: {
      type: 'callback',
      name: messages.deleteFile,
      icon: updateFirmwareIcon,
      availableDeviceTypes: [spRegister.DeviceType],
      callback: (util: { targetId: string }) => {
        const mpyDevice = getMicroPythonDevice(util.targetId);

        showInputDialog({
          title: messages.deleteFile,
          placeholder: messages.inputFileName,
          autofocus: true,
        }).then(async (result) => {
          if (result.onConfirm && result.data) {
            console.log('remove (recursive=false):', result.data);
            try {
              await mpyDevice?.remove(result.data);
              Toast(messages.deleteDone);
            } catch (e: any) {
              Toast(`${messages.deleteFail} ${e}`);
            }
          }
        });
      },
    },
    rename: {
      type: 'callback',
      name: `${messages.renameAdd}"a"`,
      icon: updateFirmwareIcon,
      availableDeviceTypes: [spRegister.DeviceType],
      callback: (util: { targetId: string }) => {
        const mpyDevice = getMicroPythonDevice(util.targetId);

        showInputDialog({
          title: messages.rename,
          placeholder: messages.inputFileName,
          autofocus: true,
        }).then(async (result) => {
          if (result.onConfirm && result.data) {
            console.log('rename:', result.data, result.data + 'a');
            try {
              await mpyDevice?.rename(result.data, result.data + 'a');
              Toast(`${messages.renameDone}${result.data + 'a'}`);
            } catch (e: any) {
              Toast(`${messages.renameFail} ${e}`);
            }
          }
        });
      },
    },
    isFileTheSame: {
      type: 'callback',
      name: messages.compareHash,
      icon: updateFirmwareIcon,
      availableDeviceTypes: [spRegister.DeviceType],
      callback: async (util: { targetId: string }) => {
        const mpyDevice = getMicroPythonDevice(util.targetId);
        const content = await mpyDevice?.getFile('wifi_cfg.py');
        if (content) {
          try {
            const isSame = await mpyDevice?.isFileTheSame('wifi_cfg.py', content);
            console.log('isFileTheSame:', isSame);
            Toast(`${messages.hashSame} ${isSame}`);
          } catch (error) {
            Toast(`${messages.compareFail} ${error}`);
          }
        }
      },
    },
    putFile: {
      type: 'callback',
      name: `${messages.appendContent}"print("hello World")"`,
      icon: updateFirmwareIcon,
      availableDeviceTypes: [spRegister.DeviceType],
      callback: async (util: { targetId: string }) => {
        const mpyDevice = getMicroPythonDevice(util.targetId);
        showInputDialog({
          title: messages.newAppend,
          placeholder: messages.inputFileName,
          autofocus: true,
        }).then(async (result) => {
          if (result.onConfirm && result.data) {
            try {
              const success = await mpyDevice?.putFile(result.data, Buffer.from('print("hello World")'));
              console.log('putFile:', success);
              Toast(`${messages.fileWrite} ${success}`);
            } catch (e) {
              Toast(`${messages.fileWrite} ${e}`);
            }
          }
        });
      },
    },
    saveFile: {
      type: 'callback',
      name: messages.download,
      icon: updateFirmwareIcon,
      availableDeviceTypes: [spRegister.DeviceType],
      callback: async (util: { targetId: string }) => {
        const mpyDevice = getMicroPythonDevice(util.targetId);
        showInputDialog({
          title: messages.download,
          placeholder: messages.inputFileName,
          autofocus: true,
        }).then(async (result) => {
          if (result.onConfirm && result.data) {
            const file = await mpyDevice?.stat(result.data);
            if (file?.exists && !file?.isDir) {
              const buffer = await mpyDevice?.getFile(result.data);
              if (buffer) {
                downloadFile(result.data.substring(result.data.lastIndexOf('/') + 1), buffer);
              }
            } else {
              console.error(`"${result.data}" is not a file or no exists!`);
            }
          }
        });
      },
    },
    uploadFile: {
      type: 'callback',
      name: messages.upload,
      icon: updateFirmwareIcon,
      availableDeviceTypes: [spRegister.DeviceType],
      callback: async (util: { targetId: string }) => {
        const mpyDevice = getMicroPythonDevice(util.targetId);
        const { content, fileName } = await uploadFile();
        try {
          await mpyDevice?.putFile(fileName, Buffer.from(content));
          Toast(messages.uploadDone);
        } catch (e) {
          Toast(`${messages.uploadFail}${e}`);
        }
      },
    },
    newFile: {
      type: 'callback',
      name: messages.newDone,
      icon: updateFirmwareIcon,
      availableDeviceTypes: [spRegister.DeviceType],
      callback: async (util: { targetId: string }) => {
        const mpyDevice = getMicroPythonDevice(util.targetId);
        const newFile = `new-file-${Date.now()}.txt`;
        try {
          await mpyDevice?.putFile(newFile, Buffer.from(''));
          Toast(messages.newDone);
        } catch (e) {
          Toast(`${messages.newFail} ${e}`);
        }
      },
    },
    gc: {
      type: 'callback',
      name: messages.gc,
      icon: updateFirmwareIcon,
      availableDeviceTypes: [spRegister.DeviceType],
      callback: async (util: { targetId: string }) => {
        const mpyDevice = getMicroPythonDevice(util.targetId);

        try {
          console.log('gc....');
          await mpyDevice?.gcCollect();
          Toast('gc success');
        } catch (error) {
          Toast(`gc error: ${error}`);
        }
      },
    },
    reset: {
      type: 'callback',
      name: messages.reset,
      icon: updateFirmwareIcon,
      availableDeviceTypes: [spRegister.DeviceType],
      callback: (util: { targetId: string }) => {
        const mpyDevice = getMicroPythonDevice(util.targetId);

        try {
          Toast(messages.resetting, { duration: 1500 });
          mpyDevice?.resetDevice();
        } catch (error) {
          console.log(`${messages.resetFail}${error}`);
        }

        setTimeout(() => {
          // 重启设备后，断开连接
          const device = self.UCode.extensions.getDevice(util.targetId);
          if (device?.isConnected()) {
            device?.disconnect();
            device?.eventbus?.dispatchDisconnect();
          }
        }, 2000);
      },
    },
  },
  DefaultTargetDataRegister: {
    json: {
      name: 'all-features',
      comments: {},
      blocks: {
        'Z8mSiJN#v]CEZ,86L]H|': {
          opcode: 'deviceworker-bd4d8b65-b1dd-48e7-a441-5226599ab563_field-matrix1',
          next: null,
          parent: 'EF*?m%`2G{v;@BgS%2P7',
          inputs: {
            MATRIX: [1, ',)Vw=lBOm+A*_YI68cOD'],
            MATRIX1: [1, ',nz}490Ir?yw_vj2t%ZM'],
            MATRIX2: [1, 's^Bu|Gf=1^[{;3%72~/f'],
          },
          fields: {},
          shadow: false,
          deletable: true,
          topLevel: false,
        },
        ',)Vw=lBOm+A*_YI68cOD': {
          opcode: 'custom_matrix',
          next: null,
          parent: 'Z8mSiJN#v]CEZ,86L]H|',
          inputs: {},
          fields: {
            CUSTOM_MATRIX: ['', ''],
          },
          shadow: true,
          deletable: true,
          topLevel: false,
        },
        ',nz}490Ir?yw_vj2t%ZM': {
          opcode: 'custom_matrix',
          next: null,
          parent: 'Z8mSiJN#v]CEZ,86L]H|',
          inputs: {},
          fields: {
            CUSTOM_MATRIX: ['1000111100000000,0001111100000000,0011111100000000,1000111100000000', ''],
          },
          shadow: true,
          deletable: true,
          topLevel: false,
        },
        's^Bu|Gf=1^[{;3%72~/f': {
          opcode: 'custom_matrix',
          next: null,
          parent: 'Z8mSiJN#v]CEZ,86L]H|',
          inputs: {},
          fields: {
            CUSTOM_MATRIX: ['1000,0001,0011,1011', ''],
          },
          shadow: true,
          deletable: true,
          topLevel: false,
        },
        'EF*?m%`2G{v;@BgS%2P7': {
          opcode: 'deviceworker-bd4d8b65-b1dd-48e7-a441-5226599ab563_field-matrix',
          next: 'Z8mSiJN#v]CEZ,86L]H|',
          parent: null,
          inputs: {
            MATRIX: [1, '(L!tO*K9Y3hY}%osgCq0'],
            MATRIX2: [1, '_XteJd6EGFwaM!RFwn*V'],
          },
          fields: {},
          shadow: false,
          deletable: true,
          topLevel: true,
          x: 462,
          y: 523,
        },
        '(L!tO*K9Y3hY}%osgCq0': {
          opcode: 'matrix',
          next: null,
          parent: 'EF*?m%`2G{v;@BgS%2P7',
          inputs: {},
          fields: {
            MATRIX: ['0101010101100010101000100', ''],
          },
          shadow: true,
          deletable: true,
          topLevel: false,
        },
        '_XteJd6EGFwaM!RFwn*V': {
          opcode: 'matrix',
          next: null,
          parent: 'EF*?m%`2G{v;@BgS%2P7',
          inputs: {},
          fields: {
            MATRIX: ['00100011100110001010001000101000100010100010001110', ''],
          },
          shadow: true,
          deletable: true,
          topLevel: false,
        },
      },
      variables: {},
      lists: {},
      broadcasts: {},
    },
  },
});
