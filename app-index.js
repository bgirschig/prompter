/** frontend main script */
import "http://localhost:1992/socket.io/socket.io.js";

var socket = io("http://localhost:1992");
const textArea = document.querySelector('textarea');
const qrcodeImage = document.querySelector('img.qrcode');

const state = {
  window: { width: 0, height: 0 },
  text: { size: 4 },
  scrollPosition: 0,
  scrollPositionRelative: 0,
  scrollSpeed: 0,
  maxScroll: 0,
}

function main() {
  updateState();
  sendText();
  
  window.addEventListener('resize', ()=> {
    setTimeout(()=> {
      updateState();
      sendText();
    }, 100);
  });
  document.addEventListener('keyup', evt => {
    if (evt.target === textArea) {
      if (evt.key === 'Escape') textArea.blur();
    }
    else if (evt.key === 'q') qrcodeImage.classList.toggle('hidden'); 
  })
  textArea.addEventListener('change', sendText);
  textArea.addEventListener('scroll', () => {
    state.scrollPosition = textArea.scrollTop;
    updateState();
  });

  socket.on('welcome', data => {
    qrcodeImage.src = data.qrCodeUrl;
    qrcodeImage.classList.remove('hidden');
  });
  socket.on('new connection', () => {
    qrcodeImage.classList.add('hidden');
    sendText();
  });
  
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

let prevTime=0;
function loop(time=0) {
  const deltaT = time - prevTime;
  prevTime = time;

  if (state.scrollSpeed !== 0) {
    const delta = deltaT * state.scrollSpeed;
    state.scrollPosition += delta;
    applyState();
  }
  requestAnimationFrame(loop);
}

function updateState() {
  state.maxScroll = textArea.scrollHeight-textArea.offsetHeight;
  state.scrollPositionRelative = state.scrollPosition / state.maxScroll;
  state.window = { width: window.innerWidth, height: window.innerHeight };
  applyState();
  sendState();
}

function applyState() {
  const maxScroll = textArea.scrollHeight-textArea.offsetHeight;
  state.scrollPosition = Math.min(Math.max(state.scrollPosition, 0), maxScroll);
  textArea.scrollTop = state.scrollPosition;

  textArea.style.fontSize = `${state.text.size}vw`;
  sendState();
}

// throttled state update function
let sendTimeout = null;
function sendState() {
  if (sendTimeout) return;
  sendTimeout = setTimeout(() => {
    socket.emit('state', state);
    sendTimeout = null;
  }, 10);
}

function sendText() {
  const computedStyle = getComputedStyle(textArea);
  const focusPointStyle = getComputedStyle(document.getElementById('focusPoint'));
  const data = {
    text: textArea.textContent,
    width: textArea.offsetWidth,
    height: textArea.offsetHeight,
    clientWidth: textArea.clientWidth,
    font: computedStyle.font,
    padding: computedStyle.padding,
    focusPoint: { font: focusPointStyle.font, top: focusPointStyle.top },
  }
  socket.emit('text', data);
}

main();