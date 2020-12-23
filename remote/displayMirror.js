export default function displayMirror(socket) {
  let el = document.querySelector('#displayMirror');
  let wrapper = el.querySelector('.wrapper');
  let display = el.querySelector('.display');
  let focusPoint = el.querySelector('#focusPoint');

  let textInfo;

  window.addEventListener('resize', updateText);
  socket.on('state', state => {
    display.scrollTop = state.scrollPositionRelative * (display.scrollHeight-display.offsetHeight);
  });
  socket.on('text', newTextInfo => {
    textInfo = newTextInfo;
    updateText();
  });
  function updateText( ) {
    wrapper.style.width = textInfo.width+"px";
    wrapper.style.height = textInfo.height+"px";
    display.style.font = textInfo.font;
    display.style.padding = textInfo.padding;

    const scrollbarWidth = display.offsetWidth - display.clientWidth;
    const masterScrollbarWidth = textInfo.width - textInfo.clientWidth;
    const scrollbarDelta = scrollbarWidth - masterScrollbarWidth;
    wrapper.style.width = textInfo.width + scrollbarDelta+"px";

    const scale = Math.min(el.clientWidth/textInfo.width, el.clientHeight/textInfo.height);
    wrapper.style.transform = `scale(${scale}) translate(-50%, -50%)`;
    display.textContent = textInfo.text;

    focusPoint.style.font = textInfo.focusPoint.font;
    focusPoint.style.top = textInfo.focusPoint.top;
  }
}