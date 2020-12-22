import "/socket.io/socket.io.js";
import ScrollController from "./control-panes/ScrollController.js";
import SpeedController from "./control-panes/SpeedController.js";
import ButtonsController from "./control-panes/ButtonsController.js";

const socket = io();
const state = {};

let currentControllerId = null;
const controllers = {};
const paneButtons = document.querySelector('.paneButtons');

const controllerConfigs = [
  {constructor: ScrollController, id:'scroll'},
  {constructor: SpeedController, id:'speed'},
  {constructor: ButtonsController, id:'buttons'},
]

function main() {
  socket.on('state', newState => {
    Object.assign(state, newState);
  });

  controllerConfigs.forEach(controllerConfig => {
    const controller = new controllerConfig.constructor(
      `.controlPane.${controllerConfig.id}`,
      state, onControllerEvent);

    controllers[controllerConfig.id] = controller;

    const button = document.createElement('button');
    button.innerText = controllerConfig.id;
    button.classList.add(controllerConfig.id);
    button.onclick = () => gotoController(controllerConfig.id);
    paneButtons.appendChild(button);
  });

  gotoController('buttons');
}

function onControllerEvent(type, data) {
  // Here we'll be able to apply global settings like scroll speed, inverted scroll, etc...
  socket.emit(type, data);
}

function gotoController(controllerId) {
  if (currentControllerId === controllerId) return;

  if (currentControllerId) {
    paneButtons.querySelector(`button.${currentControllerId}`).classList.remove('active');
    controllers[currentControllerId].deactivate();
  }
  
  controllers[controllerId].activate();
  paneButtons.querySelector(`button.${controllerId}`).classList.add('active');
  currentControllerId = controllerId;
}

main();
