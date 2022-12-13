/**
 * 调试服务器
 */
const { WebSocketServer } = require('ws');

let PORT = 9321;

const wss = new WebSocketServer({
  port: PORT,
});

const wsClients = new Set();

wss.on('connection', function connection(ws, req) {
  wsClients.add(ws);
  console.log('uCode 调试接口已连接: %s', req.socket.remoteAddress);
  ws.on('message', function message(rawData) {
    console.log('接收到来自 uCode 的消息: %s', rawData.toString());
  });
  ws.on('close', () => {
    console.log('uCode 调试接口 断开连接: %S', req.socket.remoteAddress);
    wsClients.delete(ws);
  })
});

console.log('插件调试服务已打开, 端口号: %s', PORT);

function sendDebugCommand(cmd, data) {
  console.log('发送 调试', cmd);
  wsClients.forEach((ws) => ws.send(JSON.stringify({
    cmd,
    data,
  })));
}

module.exports = {
  sendDebugCommand
};
