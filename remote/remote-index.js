import "/socket.io/socket.io.js";
import ScrollController from "./control-panes/ScrollController.js";
import SpeedController from "./control-panes/SpeedController.js";

const socket = io();
const state = {};
let controllers = [];
let currentController = null;

function main() {
  socket.on('state', newState => {
    Object.assign(state, newState);
  });

  controllers.scroll = new ScrollController('.controlPane.scroll', state, onControllerEvent);
  controllers.speed = new SpeedController('.controlPane.speed', state, onControllerEvent);

  gotoController('scroll');
}

function onControllerEvent(type, data) {
  // Here we'll be able to apply global settings like scroll speed, inverted scroll, etc...
  socket.emit(type, data);
}

function gotoController(name) {
  if (currentController === name) return;
  if (currentController) controllers[currentController].deactivate();
  console.log(controllers, name);
  controllers[name].activate();
  currentController = name;
}

main();
