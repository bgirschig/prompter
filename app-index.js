/** frontend main script */

import "http://localhost:1992/socket.io/socket.io.js";
var socket = io("http://localhost:1992");

const textArea = document.querySelector('textarea');

let scrollspeed = 0;
let targetScroll = 0;
let dragStartPos = null;

socket.on('event', (evt) => {
  switch (evt.type) {
    case 'scroll':
      targetScroll = evt.y;
      break;
    case 'dragstart':
      dragStartPos = textArea.scrollTop;
      break;
    case 'drag':
      targetScroll = dragStartPos + evt.y;
      break;
    case 'scrollSpeed':
      scrollspeed = evt.speed;
      break;
    default:
      break;
  }
});

function loop(deltaT = 0) {
  targetScroll += deltaT/1000 * scrollspeed;
  
  targetScroll = Math.max(targetScroll, 0);
  targetScroll = Math.min(targetScroll, textArea.scrollHeight - textArea.offsetHeight);

  textArea.scrollTop = targetScroll;
  requestAnimationFrame(loop);
}
loop();