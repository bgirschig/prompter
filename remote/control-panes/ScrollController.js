import ControlPane from "./ControlPane.js";

export default class ScrollController extends ControlPane {
  constructor() {
    super(...arguments);

    this.initMouseScroll();
    this.initTouchScroll();
  }

  initMouseScroll() {
    this.element.addEventListener('wheel', evt => {
      this.emit('scrollBy', evt.deltaY);
    });
  }

  initTouchScroll() {
    let prevTouchPos = null;

    this.element.addEventListener('touchstart', evt => {
      prevTouchPos = { x: evt.touches[0].clientX, y: evt.touches[0].clientY };
    });
    
    this.element.addEventListener('touchmove', evt => {
      const current =  {
        x: evt.touches[0].clientX,
        y: evt.touches[0].clientY
      }
      const delta = {
        x: current.x - prevTouchPos.x,
        y: current.y - prevTouchPos.y
      };
      prevTouchPos = current;
      this.emit('scrollBy', -delta.y);
    });
  }
}