const { WebSocketServer } = require('ws');

let PORT = 8800;

const wss = new WebSocketServer({
  port: PORT,
});

console.log('ws server listen on: %s', PORT);

wss.on('connection', function connection(ws, req) {
  console.log('new client connected: %s', req.socket.remoteAddress);
  ws.on('message', function message(rawData) {
    console.log('received: %s', rawData);
    const msg = rawData.toString();
    if (msg === 'hello') {
      ws.send('world');
      console.log('reply: %s', 'world');
    } else if (msg === 'foo') {
      ws.send('bar');
      console.log('reply: %s', 'bar');
    }
  });
});
