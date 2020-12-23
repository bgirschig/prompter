// Express server for serving the remote's files and sockets

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const { networkInterfaces } = require('os');
const QRCode = require('qrcode');

const port = 1992;

app.use(express.static(path.join(__dirname, 'remote')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/remote/remote.html');
});

io.on('connection', async (socket) => {
  console.log('a user connected');
  
  const remoteUrl = `http://${getIp()}:${port}/`;
  const qrCodeUrl = await QRCode.toDataURL(remoteUrl);

  socket.emit('welcome', {qrCodeUrl});
  socket.broadcast.emit('new connection', { qrCodeUrl });
  socket.on('scrollTo', (msg) => {
    socket.broadcast.emit('scrollTo', msg);
  });
  socket.on('scrollBy', (msg) => {
    socket.broadcast.emit('scrollBy', msg);
  });
  socket.on('scrollSpeed', (msg) => {
    socket.broadcast.emit('scrollSpeed', msg);
  });
  socket.on('state', (msg) => {
    socket.broadcast.emit('state', msg);
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

function getIp() {
  const nets = networkInterfaces();
  const results = {};
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
  }
  return results['en0'][0];
}

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});
