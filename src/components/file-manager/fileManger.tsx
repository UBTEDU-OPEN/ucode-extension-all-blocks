import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { ExtensionUI } from '@ubtech/ucode-extension-common-sdk';
import { FileInfo, FileManagerProps, UploadFileInfo } from './file.manager';

import styles from './style.module.scss';
import folderImg from './images/folder.svg';
import fileImg from './images/file.png';
import iconMore from './images/ic_more.svg';
import loadingImg from './images/ic_loading.gif';
import icAddImg from './images/ic_add.svg';
import icFloderImg from './images/ic_folder.svg';
import icUploadImg from './images/ic_upload.svg';
import icDowloadImg from './images/ic_download.svg';
import icRenameImg from './images/ic_rename.svg';
import icDeleteImg from './images/ic_Delete.svg';
import messages from './messages';

const { Toast, showTipDialog, showInputDialog } = ExtensionUI;

export function FileManager(props: FileManagerProps) {
  const [fileList, setFileList] = useState<Array<FileInfo>>([]); //当前目录文件列表
  const [checkedList, setCheckedList] = useState<Array<FileInfo>>([]); //选中的文件列表
  const [pressCtrl, setPressCtrl] = useState(false); // 是否按住ctr键
  const [currentPath, setCurrentPath] = useState<string>(); //当前目录
  const uploadInput = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    // if (props.resetDevice) {
    //   await props.resetDevice();
    // }
    getFiles(props.initPath || '/');
  };

  const toogleFile = (file: FileInfo) => {
    if (pressCtrl) {
      const idx = checkedList.indexOf(file);
      if (idx === -1) {
        checkedList.push(file);
      } else {
        checkedList.splice(idx, 1);
      }
      setCheckedList([...checkedList]);
    } else {
      setCheckedList([file]);
    }
  };

  const fileNameFilter = (fileName = '') => {
    let name = '';
    if (fileName) {
      name = fileName.split('/').pop() || '';
    }
    return decodeURIComponent(name);
  };

  const listFileNameFilter = (fileName = '') => {
    const decodeFileName = fileNameFilter(fileName);
    return decodeFileName.length < 15
      ? decodeFileName
      : `${decodeFileName.substring(0, 9)}...${decodeFileName.substring(decodeFileName.length - 6, decodeFileName.length)}`;
  };

  /**
   * 查询文件列表
   * @filePath 文件路径
   */
  const getFiles = (filePath?: string) => {
    setLoading(true);
    props
      .getFiles(filePath)
      .then((files: Array<FileInfo>) => {
        setCheckedList([]);
        setCurrentPath(filePath);
        setFileList(files);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onNewFile = () => {
    showInputDialog({
      title: messages.new,
      placeholder: messages.inputName,
      autofocus: true,
    }).then((result) => {
      if (result.onConfirm) {
        setLoading(true);
        result.data &&
          props.onNewFile &&
          props
            .onNewFile(`${currentPath}/${encodeURIComponent(result.data)}`)
            .then((data: boolean) => {
              if (data) getFiles(currentPath);
              else Toast(messages.newFail);
            })
            .finally(() => {
              setLoading(false);
            });
      }
    });
  };

  const onNewDirectory = () => {
    showInputDialog({
      // 输入文字对话框
      title: messages.newFolder,
      placeholder: messages.newFolderName,
      autofocus: true,
    }).then((result) => {
      if (result.onConfirm) {
        setLoading(true);
        props.onNewDirectory &&
          result.data &&
          props
            .onNewDirectory(`${currentPath}/${encodeURIComponent(result.data)}`)
            .then((data: boolean) => {
              if (data) getFiles(currentPath);
              else Toast(messages.newFail);
            })
            .finally(() => {
              setLoading(false);
            });
      }
    });
  };

  const onDownLoad = () => {
    if (checkedList && checkedList.length > 0) {
      showTipDialog(messages.downloadConfirm) // 提示对话框
        .then(async (data) => {
          if (data.onConfirm) {
            setLoading(true);
            props.onDownLoad &&
              props
                .onDownLoad(checkedList)
                .then(() => {
                  setCheckedList([]);
                })
                .finally(() => {
                  setLoading(false);
                });
          }
        })
        .catch((e) => {
          Toast(messages.error);
        });
    }
  };

  const onRename = () => {
    if (checkedList && checkedList.length > 0) {
      showInputDialog({
        title: messages.rename,
        placeholder: messages.inputText,
        autofocus: true,
        initValue: fileNameFilter(checkedList[0].filename),
      }).then((result) => {
        if (result.onConfirm) {
          setLoading(true);
          const path = checkedList[0].filename.split('/');
          const parentPath = path.slice(0, path.length - 1).join('/');
          result.data &&
            props.onRename &&
            props
              .onRename(checkedList[0].filename, `${parentPath}/${encodeURIComponent(result.data)}`)
              .then((data) => {
                getFiles(currentPath);
              })
              .finally(() => {
                setLoading(false);
              });
        }
      });
    }
  };

  const onRemove = () => {
    if (checkedList && checkedList.length > 0) {
      showTipDialog(messages.deleteConfirm) // 提示对话框
        .then((data) => {
          if (data.onConfirm) {
            setLoading(true);
            props.onRemove &&
              props
                .onRemove(checkedList)
                .then(() => {
                  getFiles(currentPath);
                })
                .finally(() => {
                  setLoading(false);
                });
          }
        })
        .catch((e) => {
          Toast(messages.error);
        });
    }
  };

  const onUpload = () => {
    uploadInput?.current?.click();
  };

  const confirmUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e?.target?.files;
    const uploadFiles: Array<UploadFileInfo> = [];
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        if (props.uploadType) {
          const fileNameType = files[i].name.split('.').pop() || '';
          if (props.uploadType.indexOf(fileNameType) < 0) {
            Toast(`${messages.ext} ${props.uploadType.join('、')}`);
            return;
          }
        }
        if (props.uploadMaxSize) {
          const fileSize = files[i].size / 1024;
          if (fileSize > 1024 * props.uploadMaxSize) {
            Toast(`${messages.sizeLimit} ${props.uploadMaxSize}M`);
            return;
          }
        }
        const reader = new FileReader();
        reader.onload = function () {
          const arrayBuffer = this.result;
          if (arrayBuffer) {
            uploadFiles.push({
              path: `${currentPath}/${encodeURIComponent(files[i].name)}`,
              data: Buffer.from(typeof arrayBuffer === 'string' ? arrayBuffer : new Uint8Array(arrayBuffer)),
            });
            if (uploadFiles.length === files.length) {
              setLoading(true);
              props.onUpload &&
                props
                  .onUpload(uploadFiles)
                  .then(() => {
                    getFiles(currentPath);
                  })
                  .finally(() => {
                    setLoading(false);
                  });
            }
          }
        };
        reader.readAsArrayBuffer(files[i]);
      }
    }
  };

  const onBack = () => {
    const path = currentPath?.split('/');
    getFiles(path?.slice(0, path.length - 1).join('/'));
  };

  document.addEventListener('keydown', (e) => {
    // ctr | command
    if (e && (e.key === 'Control' || e.key === 'Meta')) {
      setPressCtrl(true);
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e && (e.key === 'Control' || e.key === 'Meta')) {
      setPressCtrl(false);
    }
  });

  return (
    <div className={styles.file_manager_container}>
      <div className={styles.head_box}>
        <div className={styles.title}>{fileNameFilter(currentPath) || messages.fileManager}</div>
        {props.menus && (
          <div className={styles.more_box}>
            <img src={iconMore} />
            <ul className={styles.more_ul}>
              {props.menus.map((item) => {
                return <li onClick={item.callback}>{item.menuName}</li>;
              })}
            </ul>
          </div>
        )}
      </div>
      <div className={styles.file_list_container}>
        {currentPath && currentPath !== '/' && (
          <div className={styles.parent_path} onClick={onBack}>
            <i className={styles.ico_back}></i>
            {decodeURIComponent(currentPath.substring(0, currentPath.lastIndexOf('/'))) || '/'}
          </div>
        )}
        <div
          className={styles.file_list}
          onClick={() => {
            if (!pressCtrl) setCheckedList([]);
          }}
        >
          {fileList && fileList.length ? (
            fileList.map((file: FileInfo, idx: number) => {
              return (
                <div
                  key={idx}
                  className={classNames(styles.file_item, checkedList.indexOf(file) !== -1 ? styles.selected : '')}
                  onClick={(e) => {
                    e.stopPropagation();
                    toogleFile(file);
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    if (file.isDir) {
                      getFiles(file.filename);
                    }
                  }}
                >
                  <img src={file.isDir ? folderImg : fileImg} className={styles.file_img} />
                  <div className={styles.file_name}>{listFileNameFilter(file.filename)}</div>
                </div>
              );
            })
          ) : (
            <div className={styles.no_data}>{messages.empty}</div>
          )}
        </div>
      </div>
      <div className={styles.btn_container}>
        {(!checkedList || !checkedList.length) && (
          <>
            {props.onNewFile && (
              <div className={styles.btn_box} onClick={onNewFile}>
                <img src={icAddImg} />
                {messages.new}
              </div>
            )}
            {props.onNewDirectory && (
              <div className={styles.btn_box} onClick={onNewDirectory}>
                <img src={icFloderImg} style={{ marginRight: 0 }} />
                {messages.newFolder}
              </div>
            )}
            {props.onUpload && (
              <div className={styles.btn_box} onClick={onUpload}>
                <img src={icUploadImg} />
                {messages.upload}
              </div>
            )}
            {props.onUpload && (
              <input
                type="file"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => confirmUpload(e)}
                style={{ display: 'none' }}
                ref={uploadInput}
                multiple={props.multiple}
              />
            )}
          </>
        )}
        {checkedList && checkedList.length > 0 && (
          <>
            {props.onDownLoad && (
              <div className={styles.btn_box} onClick={onDownLoad}>
                <img src={icDowloadImg} />
                {messages.download}
              </div>
            )}
            {props.onRename && checkedList.length === 1 && (
              <div className={styles.btn_box} onClick={onRename}>
                <img src={icRenameImg} />
                {messages.rename}
              </div>
            )}
            {props.onRemove && (
              <div className={styles.btn_box} onClick={onRemove}>
                <img src={icDeleteImg} />
                {messages.delete}
              </div>
            )}
          </>
        )}
      </div>
      {loading && (
        <div className={styles.loading_box}>
          <img src={loadingImg} />
        </div>
      )}
    </div>
  );
}
