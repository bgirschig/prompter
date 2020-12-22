import ControlPane from "./ControlPane.js";

const SPEED_FACTOR = 1; // pixels per second at max speed

export default class ScrollController extends ControlPane {
  constructor() {
    super(...arguments);

    let dragStartPos = null;
    this.scrollSpeed = 0;

    this.element.addEventListener('touchstart', evt => {
      dragStartPos = { x: evt.touches[0].clientX, y: evt.touches[0].clientY };
    });
    
    this.element.addEventListener('touchmove', evt => {
      const current =  {
        x: evt.touches[0].clientX,
        y: evt.touches[0].clientY
      }
      const delta = {
        x: current.x - dragStartPos.x,
        y: current.y - dragStartPos.y
      };
      this.emit('scrollSpeed', delta.y / (window.innerHeight / 2.0));
    });

    this.element.addEventListener('touchend', evt => {
      dragStartPos = null;
      this.emit('scrollSpeed', 0);
    });
  }
}