import _ from 'lodash';
import './style.css';
import Icon from './icon.jpg';
import { start } from 'repl';

class Client {
  element;
  websocket;
  abc(ele) {
    this.element = ele
    start()
  }

  start() {
    websocket = WebSocket("ws://127.0.0.1:14703/7af8d118-1b35-4ed6-884e-0a1e270724bf")
    websocket.onmessage = function(evt) { 
      element.innerHTML = evt;
      websocket.close();
    };
  }
}

var client = new Client()

function component() {
  let element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello');
  // 将图像添加到我们现有的 div。
  var myIcon = new Image();
  myIcon.src = Icon;

  element.appendChild(myIcon);
  client.abc(element)
  return element;
}

document.body.appendChild(component());