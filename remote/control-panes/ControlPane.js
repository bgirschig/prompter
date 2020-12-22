export default class ControlPane {
  constructor(target, state, callback) {
    /** @type HTMLElement */
    this.element = document.querySelector(target);
    if (!this.element) throw new Error(`Target element not found: ${target}`);
    this.listeners = [];
    this.state = state;
    this.callback = callback;

    this.active = null;
    this.deactivate();
  }
  show() {
    this.element.style.display = '';
  }
  hide() {
    this.element.style.display = 'none';
    console.log(this.element.style.display);
  }
  addListener(type, callback, options) {
    this.listeners.push({type, callback, options});
  }
  emit() {
    if (!this.active) throw new Error("trying to invoke an event on a disabled controlPane");
    this.callback(...arguments);
  }

  activate() {
    if (this.active) throw new Error("trying to activate a control pane that is already active");
    this.active = true;

    this.show();
    this.listeners.forEach(listener => {
      this.element.addEventListener(listener.type, listener.callback, listener.options);
    });
  }
  deactivate() {
    if (this.active === false) {
      throw new Error("trying to deactivate a control pane that is already disabled");
    }
    this.active = false;

    this.hide();
    this.listeners.forEach(listener => {
      this.element.removeEventListener(listener.type, listener.callback);
    });
  }
}