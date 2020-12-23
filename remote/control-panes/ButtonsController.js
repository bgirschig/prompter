import ControlPane from "./ControlPane.js";

export default class ButtonsController extends ControlPane {
  constructor() {
    super(...arguments);

    this.element.querySelectorAll('button[data-click-action]').forEach(button => {
      button.oncontextmenu = prevent;
      button.addEventListener('click', this[button.dataset.clickAction].bind(this));
    });
    this.element.querySelectorAll('button[data-hold-action]').forEach(button => {
      button.oncontextmenu = prevent;
      button.addEventListener('mousedown', this[button.dataset.holdAction+"Start"].bind(this));
      button.addEventListener('touchstart', this[button.dataset.holdAction+"Start"].bind(this));
      button.addEventListener('mouseup', this[button.dataset.holdAction+"End"].bind(this));
      button.addEventListener('touchend', this[button.dataset.holdAction+"End"].bind(this));
    });
  }

  upStart(e) {
    e.preventDefault();
    this.emit('scrollSpeed', -0.1);
  }
  upEnd() {
    this.emit('scrollSpeed', 0);
  }
  downStart(e) {
    e.preventDefault();
    this.emit('scrollSpeed', 0.1);
  }
  downEnd() {
    this.emit('scrollSpeed', 0);
  }
  prev() {
    this.emit('scrollBy', -50);
  }
  next() { 
    this.emit('scrollBy', 50);
  }
  top() {
    this.emit('scrollTo', 0);
  }
  bottom() {
    this.emit('scrollTo', this.state.maxScroll);
  }
}

function prevent(event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
}