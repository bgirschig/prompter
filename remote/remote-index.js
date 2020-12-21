import "/socket.io/socket.io.js";

var socket = io();

document.body.addEventListener('wheel', evt => {
  const data = { type: 'scroll', x: evt.deltaX, y: evt.deltaY };
  socket.emit('event', data);
});

let isMouseDown = false;
let mouseDownStart = null;
document.body.addEventListener('touchstart', evt => {
  if (isMouseDown) return;
  isMouseDown = true;
  mouseDownStart = { x: evt.touches[0].clientX, y: evt.touches[0].clientY };
  // socket.emit('event', { type: 'dragstart' });
});
document.body.addEventListener('touchmove', evt => {
  if (!isMouseDown) return;
  const delta = {
    x: evt.touches[0].clientX - mouseDownStart.x,
    y: evt.touches[0].clientY - mouseDownStart.y,
  }
  // socket.emit('event', { type: 'drag', x: delta.x, y: delta.y });
  socket.emit('event', { type: 'scrollSpeed', speed: delta.y/300 });
});
document.body.addEventListener('touchend', evt => {
  isMouseDown = false;
  socket.emit('event', { type: 'scrollSpeed', speed: 0 });
});