import * as WebSocket from 'ws'
import {TestBridgeModule, BridgeCore, OnRecveFunction, Bridge} from '../../Common/JSBridgeCore'
import { MessagerModule } from './messager';

let message = new MessagerModule()



let wsServer: WebSocket.Server = new WebSocket.Server({ port: 8088 })
wsServer.on('connection', function(ws) {
    console.log('connection');
    let model = new TestBridgeModule()
    var wsBridge = new Bridge(new NodeWebSocketBridgeCore(ws))
    wsBridge.register("test", model);
    ws.on('message', function(message) {
      console.log('received: %s', message);
      //ws.send('Hi Client' + message);
    });//当收到消息时，在控制台打印出来，并回复一条信息
}); 


class NodeWebSocketBridgeCore implements BridgeCore {
  ws: WebSocket = null;

  constructor(ws: WebSocket) {
      this.ws = ws
  }

  call(jsonData: object) {
      let str = JSON.stringify(jsonData)
      this.ws.send(str)
  }
  onRecve: OnRecveFunction
  register() {
      let self = this
      this.ws.onmessage = function (mes) {
        try {
          let jsonObject = JSON.parse(mes.data)
          self.onRecve(jsonObject)
        } catch (error) {
          
        }
          
      }
  }
}

