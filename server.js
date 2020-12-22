// Express server for serving the remote's files and sockets

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

const port = 1992;

app.use(express.static(path.join(__dirname, 'remote')));

app.get('/', (req, res) => {
  res.send('socket server ok');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.broadcast.emit('new connection', {});
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

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});
