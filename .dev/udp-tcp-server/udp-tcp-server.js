/*
 * @Description: 模拟设备UDP广播+通信。在命令行通过node运行本脚本，配合本插件可以实现通信。
 */
const dgram = require('dgram');
const net = require('net');

const tcpPort = 54321;
const tcpHost = '127.0.0.1';
let scanTask;

function createTCPServer() {
  const server = net.createServer();
  server.on('close', () => {
    console.log('tcp close');
  });
  server.on('listening', () => {
    console.log('tcp listening');
  });
  server.on('connection', (socket) => {
    console.log('tcp socket:', socket.port, socket.address());
    if (scanTask) {
      clearInterval(scanTask);
    }

    socket.on('data', (data) => {
      console.log('tcp received:', Buffer.from(data).toString());
      socket.write(`你发了 ${data} 给我`);
    });
    socket.on('close', () => {
      console.log('socket close')
    })
  });
  server.on('error', (error) => {
    console.log('tcp error:', error);
  });
  server.listen(tcpPort, tcpHost);
}

function createUDP() {
  let socket = dgram.createSocket('udp4');
  const broadcast = () => {
    const data = {
      name: '2022TCP',
      port: tcpPort,
      address: tcpHost,
    };
    socket.send(Buffer.from(JSON.stringify(data)), 65432);
  };
  broadcast();

  scanTask = setInterval(() => {
    broadcast();
  }, 3000);

  socket.on('close', () => {
    console.log('socket已关闭');
  });

  socket.on('error', (err) => {
    console.log(err);
  });

  socket.on('listening', () => {
    console.log('udp listening...');
    socket.setBroadcast(true);
  });

  socket.on('message', (msg, rinfo) => {
    console.log('udp received:', Buffer.from(msg).toString());
  });
}

createTCPServer();
createUDP();
