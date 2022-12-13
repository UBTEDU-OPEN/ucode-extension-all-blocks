"""
author: raspberry.liu<raspberry.liu@ubtrobot.com>;
界面
    1. start page
      1.1 启动屏
        a. 显示logo
        b. 等待2秒跳过
    2. menu select
      2.1 串口模式
        a. 开启 _thread 定时上传文件，模拟上报事件
        b. 进入 repl 模式，支持串口发送 repl 指令
      2.2 蓝牙模式
      2.3 websocket模式
        a. 显示基本内容如下：
            1 > 点击背后的 复位 按钮
            2 > 按住左上角的 A 键
            3 > 出现菜单后选择 智能配网
            4 > 选择 启用无线模式 （已配置 UBT-Robot 网络）
            (需先Airkiss配网)
      2.4 tcp模式
        a. 自动链接网络（UBT-Robot）
        b. 开启tcp服务
        c. 连接后，向客户端发送基本信息
        b. 接收来自客户端的Data并显示
      2.5 udp模式
        a. 自动链接网络（UBT-Robot）
        b. 开启udp服务
        c. 连接后，向客户端发送基本信息
        b. 接收来自客户端的Data并显示
工具
    1. keyscan
"""

from future import *
import time
import _thread

def getIndex():
    global btn_event_flag
    global UI_update_flag
    global index
    global indexRange
    if btn_event_flag == True:
        btn_event_flag = False
        if btn_value[0] == "a":  # +1
            if index <= indexRange[1]:
                index += 1
            if index > indexRange[1]:
                index = indexRange[0]
            UI_update_flag = True
            print("[a] : ", index, False)
            return index, False
        elif btn_value[0] == "b":  # 确认
            UI_update_flag = True
            print("[b] : ", index, True)
            return index, True
        else:
            return index, False
    else:
        return index, False

class page:
    def __init__(self):
        self._set_head = False
        self._set_menu = False
        self._set_pic = False
        self._set_index = False
        screen.fill(BLACK)

    def set_menus(self, menusData):
        self.menus = menusData
        self._set_menu = True

    def set_index(self, index=0):
        self.menu_index = index
        self._set_index = True

    def set_head(self, headData):
        self.btn_head_left = headData[0]
        self.btn_head_right = headData[1]
        # self.btn_head_title = headData[3]
        self._set_head = True

    def set_pic(self, picPath):
        self.picpath = picPath
        self._set_pic = True

    def paint_index(self):
        x_position = 12
        y_position = 30
        y_dur = 20
        screen.rect(x_position - 5, y_position - 5, 10, 140, color=0, fill=1)
        for i in range(len(self.menus)):
            # print(self.menus[i])
            screen.circle(
                12, y_position + i * y_dur, 5, color=255, fill=int(i == self.menu_index)
            )

    def paint_menus(self):
        # 选择器 展示菜单项、指示当前选中菜单项
        y_position = 30
        y_dur = 20
        for i in range(len(self.menus)):
            # print(self.menus[i])
            screen.textCh(
                self.menus[i], x=24, y=y_position + i * y_dur - 8, ext=1, color=255
            )

    def paint_head(self):
        # 头栏的切换、确认提示
        screen.fill(0)
        screen.textCh(self.btn_head_left, x=4, y=2, ext=1, color=255)
        screen.textCh(self.btn_head_right, x=132, y=2, ext=1, color=255)
        screen.line(0, 16, 160, 16, color=255)

    def page_starting(self):
        screen.fill((225, 225, 225))
        screen.fill(0)
        # screen.loadPng("logo.png",70,20)
        screen.textCh("UBTech", x=50, y=40, ext=1, color=255)
        screen.refresh()

    def paint_pic(self):
        screen.loadPng(self.picpath, x=2, y=45)

    def show(self):
        if self._set_head:
            self.paint_head()
        if self._set_menu:
            self.paint_menus()
        if self._set_pic:
            self.paint_pic()
        if self._set_index:
            self.paint_index()
        # screen.refresh()


def start_page():
    start_page = page()
    start_page.set_pic("logo.png")
    start_page.show()
    time.sleep(0.5)
    del start_page


# 扫描 A\B 按键，返回键值
# UI 更新在其他线程
def th_btn_event(id):
    global _threads
    global btn_value
    global btn_event_flag
    _threads[id] = "RUNNING"
    while 1:
        while _threads[id] == "RUNNING":
            # 在此执行
            time.sleep(0.2)
            btn_value = sensor.btnValue()
            if btn_value != []:
                btn_event_flag = True

        while _threads[id] == "SUSPENDED":
            pass

        while _threads[id] == "DEADED":
            _thread.exit()

# 1. 检查输入
# 2. 渲染界面
def th_UI(id):
    global UI_update_flag
    global menu
    global _threads
    global indexRange
    global index

    # 启动页面
    start_page()
    _threads[id] = "RUNNING"
    current_page = "menus_page"
    while 1:
        while _threads[id] == "RUNNING":
            # 在此执行
            if current_page == "menus_page":
                print("current_page : menus_page")
                menu_page = page()
                menu_page.set_menus(menu)
                menu_page.set_head(("切换", "确认"))
                menu_page.set_index(0)
                menu_page.show()
                menu_page._set_head = False
                menu_page._set_menu = False
                indexRange = [0, 4]
                while 1:
                    _index, isComfirmed = getIndex()
                    if UI_update_flag == True:
                        UI_update_flag = False
                        menu_page.set_index(_index)
                        menu_page.show()
                        if isComfirmed == True:
                            if _index == 0:
                                print("in serial page")
                            if _index == 1:
                                print("in ble page")
                            if _index == 2:
                                print("in websocket page")
                                screen.clear()
                                screen.textCh('1、重启后按住A键不放', x=4, y=2 + 15 * 0, ext=1, color=255)
                                screen.textCh('2、选择智能配网', x=4, y=2 + 15 * 1, ext=1, color=255)
                                screen.textCh('3、启用无线模式', x=4, y=2 + 15 * 2, ext=1, color=255)
                                screen.textCh('秒后重启', x=60, y=60, ext=1, color=255)
                                for i in range(3,-1,-1):
                                    screen.rect(48, 60, 10, 12, color=0, fill=1)
                                    screen.textCh(i, x=50, y=60, ext=1, color=255)
                                    time.sleep(1)
                                import machine
                                machine.reset()
                            if _index == 3:
                                print("in tcp page")
                                _thread.start_new_thread(tcp_page, ("tcp_page",))
                                current_page = "tcp_page"
                                break
                            if _index == 4:
                                print("in udp page")
                                _thread.start_new_thread(udp_page, ("udp_page",))
                                current_page = "udp_page"
                                break
            if current_page == "tcp_page":
                print("current_page : tcp_page")
                indexRange = [0, 0]
                index = 0
                while 1:
                    _index, isComfirmed = getIndex()
                    if isComfirmed == True:
                        if _index == 0:
                            current_page = "menus_page"
                            _threads["tcp_page"] = "DEADED"
                            break
            if current_page == "udp_page":
                print("current_page : udp_page")
                indexRange = [0, 0]
                index = 0
                while 1:
                    _index, isComfirmed = getIndex()
                    if isComfirmed == True:
                        if _index == 0:
                            current_page = "menus_page"
                            _threads["udp_page"] = "DEADED"
                            break

        while _threads[id] == "SUSPENDED":
            pass
        while _threads[id] == "DEADED":
            _thread.exit()


def tcp_page(id):
    global UI_update_flag
    global _threads
    global server
    _threads[id] = "RUNNING"
    while 1:
        # 在此执行
        tcp_page = page()
        tcp_page.set_head(("TCP test", "返回"))
        tcp_page.show()
        time.sleep(0.1)
        # import socketserver # 在这里阻塞了，还得改改
        while _threads[id] == "RUNNING":
            print("tcp_page running")
            try:
                import socket

                port = 5001  # TCP服务端的端口,range0~65535
                if server != None:
                    server.close()
                else:
                    server = None

                ip = sta_if.ifconfig()[0]  # 获取本机IP地址
                server = socket.socket(
                    socket.AF_INET, socket.SOCK_STREAM
                )  # 创建socket,不给定参数默认为TCP通讯方式
                server.setsockopt(
                    socket.SOL_SOCKET, socket.SO_REUSEADDR, 1
                )  # 设置套接字属性参数
                server.bind((ip, port))  # 绑定ip和端口
                server.setblocking(False) # 设置非阻塞模式
                server.listen(3)  # 开始监听并设置最大连接数
                print("tcp waiting...")
                screen.text(
                    "%s:%s" % (ip, port), 0, 36, ext=1, color=255
                )  # oled屏显示本机服务端ip和端口
                screen.textCh("等待接入...", 0, 56, ext=1, color=255)

                print("accepting.....")
                while _threads[id] == "RUNNING":  # 代码阻塞的，无法控制线程
                    try:
                      (
                          conn,
                          addr,
                      ) = (
                          server.accept() # 阻塞,等待客户端的请求连接,如果有新的客户端来连接服務器，那麼会返回一个新的套接字专门为这个客户端服务
                      )  # sync 
                    except OSError as e:
                      pass
                    else:
                      print(addr, "connected")
                      screen.rect(0, 48, 150, 80, color=0, fill=1)
                      screen.textCh("已连接", 0, 56, ext=1, color=255)
                      conn.setblocking(False)

                      print('waiting message...')
                      while _threads[id] == "RUNNING":
                          try:
                            data = conn.recv(
                                1024
                            )  # sync                                          # 接收对方发送过来的数据,读取字节设为1024字节
                          except OSError as e:
                            pass
                          else:
                            screen.rect(0, 48, 150, 80, color=0, fill=1)
                            if len(data) == 0:
                                print("close socket")
                                conn.close()  # 如果接收数据为0字节时,关闭套接字
                                break
                            
                            data_utf = data.decode()  # 接收到的字节流以utf8编码解码字符串
                            print(data_utf)
                            screen.text(data_utf, 0, 66, ext=1, color=255)  # 将接收到文本oled显示出来
                            
                            if data_utf == "cmd=getTemp":
                                temp = sensor.getTemp()
                                conn.send(str(temp))  # 发送数据给客户端
                            elif data_utf == "cmd=getFaceDown":
                                faceDown = sensor.gesture("face_down")
                                conn.send(str(faceDown))  # 发送数据给客户端
                            else:
                                conn.send(data)  # 发送数据给客户端
                      server.close()
                      break
                break
            except:
                if server:
                    server.close()
                sta_if.disconnect()
                _threads[id] = "DEADED"
            _threads[id]
            break
        while _threads[id] == "SUSPENDED":
            pass
        while _threads[id] == "DEADED":
            print("[Threads] ", id, " ", _threads[id])
            _thread.exit()


def udp_page(id):
    global UI_update_flag
    global _threads
    global server
    _threads[id] = "RUNNING"
    while 1:
        # 在此执行
        udp_page = page()
        udp_page.set_head(("UDP test", "返回"))
        udp_page.show()
        time.sleep(0.1)
        # import socketserver # 在这里阻塞了，还得改改
        while _threads[id] == "RUNNING":
            print("udp_page running")
            try:
                import socket
                ip = sta_if.ifconfig()[0]
                print("ip=%s" %ip);
                port = 5001
                BUF_SIZE = 1024  # 设置缓冲区大小
                try:
                  if server != None:
                      server.close()
                  else:
                      server = None
                  server_addr = (ip, port)  # IP和端口构成表示地址
                  server = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)  # 生成新的套接字对象
                  server.bind(server_addr)  # 套接字绑定IP和端口
                  server.setblocking(False) # 设置非阻塞模式
                except OSError as e:
                  print(e)

                print("udp waiting...")
                screen.text(
                    "%s:%s" % (ip, port), 0, 36, ext=1, color=255
                )  # oled屏显示本机服务端ip和端口
                screen.textCh("等待接入...", 0, 56, ext=1, color=255)
                screen.refresh()

                print("waitting for data")
                while _threads[id] == "RUNNING":
                    try:
                      data, client_addr = server.recvfrom(BUF_SIZE)  # 从客户端接收数据
                    except OSError as e:
                      pass # 非阻塞模式会触发Error，忽略。
                    else:
                      print("received from: ", client_addr, ", Data: ", data)
                      screen.rect(0, 48, 128, 80, color=0, fill=1)

                      if data == b"cmd=getTemp":
                          temp = sensor.getTemp()
                          server.sendto(str(temp), client_addr)  # 发送数据给客户端
                      elif data == b"cmd=getFaceDown":
                          faceDown = sensor.gesture("face_down")
                          server.sendto(str(faceDown), client_addr)  # 发送数据给客户端
                      else:
                          screen.text(data, 0, 66, ext=1, color=255)
                          server.sendto(data, client_addr)  # 发送数据给客户端
                      
                break
            except OSError as e:
                print("error ", e)
                if server:
                    server.close()
                sta_if.disconnect()
                _threads[id] = "DEADED"
            break
        while _threads[id] == "SUSPENDED":
            pass
        while _threads[id] == "DEADED":
            print("[Threads] ", id, " ", _threads[id])
            _thread.exit()


import network

sta_if = network.WLAN(network.STA_IF)
ap_if = network.WLAN(network.AP_IF)
if ap_if.active():
    ap_if.active(False)

if not sta_if.isconnected():
    print("connecting to network...")
    screen.textCh("正在连接wifi", x=0, y=20, ext=1, color=255)
    screen.refresh()

sta_if.active(True)
# sta_if.connect('NETGEAR47', 'gentlehippo555') #wifi的SSID和密码
sta_if.connect("UBT-Robot", "ubtubtubt")
while not sta_if.isconnected():
    pass

print("network config:", sta_if.ifconfig())
screen.fill(BLACK)
screen.textCh("连接成功...", x=0, y=20, ext=1, color=255)
screen.refresh()

_threads = {}  # RUNNING SUSPENDED DEADED
btn_value = []
btn_event_flag = False
UI_update_flag = False
menu = ("Serial", "BLE-未支持", "websocket", "tcp", "udp")
index = 0
indexRange = []
server = None

_thread.start_new_thread(th_btn_event, ("th_btn_event",))
_thread.start_new_thread(th_UI, ("th_UI",))
print("starting testing\n")
