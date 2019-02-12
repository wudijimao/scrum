import * as WebSocket from 'ws'
import * as bridge from '../../Common/JSBridgeCore'
import { MessagerModule } from './messager';

let message = new MessagerModule()

let wsServer: WebSocket.Server = new WebSocket.Server({ port: 8088 })
wsServer.on('connection', function(ws) {
    console.log('connection');
    ws.on('message', function(message) {
      console.log('received: %s', message);
      ws.send('Hi Client' + message);
    });//当收到消息时，在控制台打印出来，并回复一条信息
}); 


