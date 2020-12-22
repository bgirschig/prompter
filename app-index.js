/** frontend main script */
import "http://localhost:1992/socket.io/socket.io.js";
var socket = io("http://localhost:1992");

const textArea = document.querySelector('textarea');

const state = {
  window: { width: window.innerWidth, height: window.innerHeight },
  text: { size: 4 },
  scrollPosition: 0,
  scrollSpeed: 0,
}

function main() {
  applyState();
  
  window.addEventListener('resize', () => {
    state.window = { width: window.innerWidth, height: window.innerHeight };
  });
  textArea.addEventListener('scroll', () => {
    state.scrollPosition = textArea.scrollTop
  });

  socket.on('new connection', sendState);
  socket.on('scrollTo', (value) => {
    state.scrollPosition = value;
    applyState();
  });
  socket.on('scrollBy', (value) => {
    state.scrollPosition += value;
    applyState();
  });
  socket.on('scrollSpeed', (value) => {
    state.scrollSpeed = value;
  });

  loop();
}

function loop(deltaT=0) {
  if (state.scrollSpeed !== 0) {
    const seconds = deltaT / 1000.0;
    const delta = seconds * state.scrollSpeed;
    state.scrollPosition += delta;
    applyState();
  }
  requestAnimationFrame(loop);
}

function applyState() {
  const maxScroll = textArea.scrollHeight-textArea.offsetHeight;
  state.scrollPosition = Math.min(Math.max(state.scrollPosition, 0), maxScroll);
  textArea.scrollTop = state.scrollPosition;

  textArea.style.fontSize = `${state.text.size}vw`;
  sendState();
}
function sendState() {
  socket.emit('state', state);
}

main();