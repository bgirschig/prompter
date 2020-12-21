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
  
  socket.on('event', (msg) => {
    socket.broadcast.emit('event', msg);
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});
